import { cn } from "@/lib/utils"

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string
  filled?: boolean
  size?: number
}

export function Icon({ name, filled = false, size, className, ...props }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        fontSize: size ? `${size}px` : undefined,
      }}
      {...props}
    >
      {name}
    </span>
  )
}
