import * as React from "react"
import { cn } from "../../lib/utils"
import { Slot } from "@radix-ui/react-slot"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref as any}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium",
          "bg-primary text-white shadow-soft transition-transform active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
export { Button }
