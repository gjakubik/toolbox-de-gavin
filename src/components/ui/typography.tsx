import React from 'react'

import { cn } from '@/lib/utils'

export interface TypographyProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h2xb'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'p'
    | 'pn'
    | 'bold'
    | 'blockquote'
    | 'code'
    | 'large'
    | 'small'
    | 'light'
    | 'extralight'
    | 'tinyextralight'
  className?: string
}

const Typography = ({
  children,
  variant = 'p',
  className,
  ...props
}: TypographyProps) => {
  const variants = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
    h2xb: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
    pn: 'leading-7 [&:not(:first-child)]:mt-0',
    bold: 'font-semibold',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    large: 'text-lg font-semibold',
    small: 'text-sm font-medium leading-none',
    light: 'text-sm dark:text-gray-400 font-light',
    extralight: 'text-sm dark:text-gray-400 font-extralight',
    tinyextralight: 'text-xs dark:text-gray-400 font-extralight',
  }

  return (
    <p className={cn(variants[variant], className)} {...props}>
      {children}
    </p>
  )
}

export { Typography }
