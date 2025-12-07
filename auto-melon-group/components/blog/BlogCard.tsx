import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlogPost } from "@/lib/blog/posts"

interface BlogCardProps {
  post: BlogPost
  locale: string
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const title = locale === "el" ? post.titleEl : post.title
  const excerpt = locale === "el" ? post.excerptEl : post.excerpt
  const category = locale === "el" ? post.categoryEl : post.category

  const formattedDate = new Date(post.publishedAt).toLocaleDateString(
    locale === "el" ? "el-GR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-brand-red/20">
      <Link href={`/${locale}/blog/${post.slug}`}>
        <div className="relative h-56 overflow-hidden bg-muted">
          {post.image ? (
            <>
              <Image
                src={post.image}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-orange-500/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-brand-red/30">{post.title[0]}</span>
            </div>
          )}
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-brand-red text-white border-0 shadow-lg">
              {category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 pb-3 border-b">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-brand-red/60" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-green/60" />
              {post.readingTime} {locale === "el" ? "λεπτά" : "min read"}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-brand-ink group-hover:text-brand-red transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-muted-foreground line-clamp-3 mb-5 text-sm leading-relaxed">{excerpt}</p>
          <span className="inline-flex items-center text-brand-red font-semibold text-sm group-hover:gap-3 transition-all">
            {locale === "el" ? "Διαβάστε περισσότερα" : "Read more"}
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-2 transition-transform" />
          </span>
        </CardContent>
      </Link>
    </Card>
  )
}
