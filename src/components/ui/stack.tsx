import * as React from 'react'
import { cn } from '@/lib/utils'

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  gap?:
    | 0
    | 0.5
    | 1
    | 1.5
    | 2
    | 2.5
    | 3
    | 3.5
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 14
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 44
    | 48
    | 52
    | 56
    | 60
    | 64
    | 72
    | 80
    | 96
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { className, direction = 'column', justify, align, gap = 2, ...props },
    ref
  ) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    }

    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    }

    const gapClass = `gap-${gap}`

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'column' ? 'flex-col' : 'flex-row',
          gapClass,
          justify && justifyClasses[justify],
          align && alignClasses[align],
          className
        )}
        {...props}
      />
    )
  }
)

Stack.displayName = 'Stack'

export { Stack }
