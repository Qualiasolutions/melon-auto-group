import { BlogPost } from "@/lib/blog/posts"
import { BlogCard } from "./BlogCard"

interface BlogListProps {
  posts: BlogPost[]
  locale: string
}

export function BlogList({ posts, locale }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {locale === "el"
            ? "Δεν βρέθηκαν άρθρα."
            : "No articles found."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} locale={locale} />
      ))}
    </div>
  )
}
