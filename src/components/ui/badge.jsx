import * as React from "react"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        secondary:
          "border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20",
        destructive:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        orange:
          "border-transparent bg-orange-100 text-orange-700 hover:bg-orange-200",
        outline: 
          "border-border text-foreground/80 hover:bg-muted/50",
        warning:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        success:
          "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
        info:
          "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
        purple:
          "border-transparent bg-purple-100 text-purple-700 hover:bg-purple-200",
        gray:
          "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
        muted:
          "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Badge({
  className,
  variant,
  size,
  ...props
}) {
  return (
    <div 
      className={cn(badgeVariants({ variant, size }), className)} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }