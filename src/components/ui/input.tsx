import * as React from 'react'
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`h-10 w-full rounded-xl border border-border px-3 ${className}`} {...props} />
  )
)
Input.displayName = 'Input'
export default Input
