import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, Share2, Tag } from "lucide-react"
import Image from "next/image"
import { getBlogPost, getRelatedPosts, getAllBlogPosts } from "@/lib/blog/posts"
import { BlogCard } from "@/components/blog/BlogCard"
import { StructuredData } from "@/components/StructuredData"
import { siteConfig } from "@/config/site"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Locale } from "@/config/i18n"

interface BlogPostPageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  const locales: Locale[] = ["en", "el"]

  return locales.flatMap((locale) =>
    posts.map((post) => ({
      locale,
      slug: post.slug,
    }))
  )
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const title = locale === "el" ? post.titleEl : post.title
  const description = locale === "el" ? post.excerptEl : post.excerpt
  const keywords = locale === "el" ? post.tagsEl : post.tags

  return {
    title,
    description,
    keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      languages: {
        en: `${siteConfig.url}/en/blog/${post.slug}`,
        el: `${siteConfig.url}/el/blog/${post.slug}`,
        "x-default": `${siteConfig.url}/en/blog/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      locale: locale === "el" ? "el_GR" : "en_US",
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/og-image.jpg`],
    },
  }
}

function getBlogPostSchema(post: ReturnType<typeof getBlogPost>, locale: Locale) {
  if (!post) return null

  const title = locale === "el" ? post.titleEl : post.title
  const description = locale === "el" ? post.excerptEl : post.excerpt

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: `${siteConfig.url}/og-image.jpg`,
    author: {
      "@type": "Organization",
      name: post.author,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/melon-logo.png`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/${locale}/blog/${post.slug}`,
    },
    keywords: (locale === "el" ? post.tagsEl : post.tags).join(", "),
    articleSection: locale === "el" ? post.categoryEl : post.category,
    inLanguage: locale === "el" ? "el-GR" : "en-US",
  }
}

function getBreadcrumbSchema(post: ReturnType<typeof getBlogPost>, locale: Locale) {
  if (!post) return null

  const title = locale === "el" ? post.titleEl : post.title

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "el" ? "Αρχική" : "Home",
        item: `${siteConfig.url}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${siteConfig.url}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      },
    ],
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const title = locale === "el" ? post.titleEl : post.title
  const content = locale === "el" ? post.contentEl : post.content
  const category = locale === "el" ? post.categoryEl : post.category
  const tags = locale === "el" ? post.tagsEl : post.tags

  const relatedPosts = getRelatedPosts(slug, 3)

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === "el" ? "el-GR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )

  const blogPostSchema = getBlogPostSchema(post, locale)
  const breadcrumbSchema = getBreadcrumbSchema(post, locale)

  return (
    <>
      <StructuredData data={[blogPostSchema, breadcrumbSchema].filter(Boolean)} />

      <article className="min-h-screen">
        {/* Hero Section with Image */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          {/* Background Image */}
          {post.image && (
            <div className="absolute inset-0 z-0">
              <Image
                src={post.image}
                alt={title}
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/60" />
            </div>
          )}
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
          <div className="container relative z-10 py-16">
            <div className="max-w-3xl mx-auto">
              {/* Back Link */}
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {locale === "el" ? "Πίσω στο Blog" : "Back to Blog"}
              </Link>

              {/* Category Badge */}
              <Badge className="mb-4 bg-brand-red text-white">{category}</Badge>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{title}</h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-slate-300">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {post.readingTime} {locale === "el" ? "λεπτά ανάγνωσης" : "min read"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.image && (
          <section className="bg-white">
            <div className="container py-8">
              <div className="max-w-5xl mx-auto">
                <div className="relative aspect-[21/9] overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={post.image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Section */}
        <section className="py-12 bg-white">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              {/* Article Content */}
              <div
                className="prose prose-lg prose-slate max-w-none
                  prose-headings:font-bold prose-headings:text-brand-ink
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-brand-ink
                  prose-ul:my-6 prose-li:text-slate-600
                  prose-table:w-full prose-table:my-6
                  prose-th:bg-slate-100 prose-th:p-3 prose-th:text-left
                  prose-td:p-3 prose-td:border-b prose-td:border-slate-200"
                dangerouslySetInnerHTML={{ __html: formatContent(content) }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Share */}
              <div className="mt-8 p-6 bg-muted/40 rounded-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">
                      {locale === "el" ? "Σας βοήθησε αυτό το άρθρο;" : "Found this article helpful?"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {locale === "el"
                        ? "Μοιραστείτε το με άλλους που μπορεί να το βρουν χρήσιμο."
                        : "Share it with others who might find it useful."}
                    </p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    {locale === "el" ? "Κοινοποίηση" : "Share"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/40">
            <div className="container">
              <h2 className="text-2xl font-bold mb-8 text-center">
                {locale === "el" ? "Σχετικά Άρθρα" : "Related Articles"}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.slug} post={relatedPost} locale={locale} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-brand-red text-white">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">
              {locale === "el"
                ? "Έτοιμοι να Αγοράσετε;"
                : "Ready to Buy?"}
            </h2>
            <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
              {locale === "el"
                ? "Περιηγηθείτε στο απόθεμά μας ή επικοινωνήστε μαζί μας για εξατομικευμένη βοήθεια."
                : "Browse our inventory or contact us for personalized assistance."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/inventory`}
                className="inline-flex items-center gap-2 bg-white text-brand-red px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              >
                {locale === "el" ? "Δείτε το Απόθεμα" : "View Inventory"}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {locale === "el" ? "Επικοινωνία" : "Contact Us"}
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

// Simple markdown-like to HTML conversion
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Tables
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim())
      if (cells.every((c) => c.match(/^[-:]+$/))) {
        return "" // Skip separator row
      }
      const isHeader = cells.some((c) => c.match(/^[A-Z]/))
      const cellTag = isHeader ? "th" : "td"
      return `<tr>${cells.map((c) => `<${cellTag}>${c}</${cellTag}>`).join("")}</tr>`
    })
    .replace(/<tr>.*<th>.*<\/tr>/s, (match) =>
      `<table><thead>${match}</thead><tbody>`
    )
    .replace(/<\/tr>(?![\s\S]*<\/tr>)/g, "</tr></tbody></table>")
    // Lists
    .replace(/^- (.*$)/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
    // Check marks
    .replace(/✓/g, '<span class="text-green-600">✓</span>')
    // Paragraphs
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hultdp])(.+)$/gm, "<p>$1</p>")
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, "")
    .replace(/<p>\s*<\/p>/g, "")
}
