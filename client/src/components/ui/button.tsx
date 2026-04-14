import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-black text-white shadow-sm hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200',
        secondary:
          'border border-gray-200 bg-white text-black shadow-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900',
        outline:
          'border border-gray-200 bg-transparent text-black hover:bg-gray-100 dark:border-gray-800 dark:text-white dark:hover:bg-gray-900',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-900 dark:hover:text-white',
        destructive:
          'border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-100 dark:border-gray-800 dark:bg-black dark:text-white dark:hover:bg-gray-900',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-11 rounded-xl px-8 text-sm',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
