import { cn } from '../../lib/utils'

interface Props {
  children: React.ReactNode
  variant?: 'default' | 'light'
  className?: string
}

export function GlassSurface({ children, variant = 'default', className }: Props) {
  return (
    <div className={cn(
      'backdrop-blur-md border border-white/10',
      variant === 'default' ? 'bg-white/5' : 'bg-white/[0.08]',
      className
    )}>
      {children}
    </div>
  )
}
