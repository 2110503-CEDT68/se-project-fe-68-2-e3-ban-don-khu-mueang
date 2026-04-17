import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "default", ...props }, ref) => {
    let variantClasses = ""
    switch (variant) {
      case "primary":
        variantClasses = "bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container"
        break
      case "secondary":
        variantClasses = "bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container"
        break
      case "outline":
        variantClasses = "border border-outline bg-transparent hover:bg-surface-variant text-foreground"
        break
      case "ghost":
        variantClasses = "hover:bg-surface-variant text-foreground hover:text-on-surface-variant"
        break
      case "danger":
        variantClasses = "bg-error text-on-error hover:bg-error-container hover:text-on-error-container"
        break
    }

    let sizeClasses = ""
    switch (size) {
      case "default":
        sizeClasses = "h-10 px-4 py-2"
        break
      case "sm":
        sizeClasses = "h-9 rounded-md px-3"
        break
      case "lg":
        sizeClasses = "h-11 rounded-md px-8"
        break
      case "icon":
        sizeClasses = "h-10 w-10"
        break
    }

    const classes = `inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses} ${sizeClasses} ${className}`

    return (
      <button
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
