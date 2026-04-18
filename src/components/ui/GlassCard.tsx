import { cn } from '../../lib/utils'

interface Props {
  children: React.ReactNode
  glow?: boolean
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, glow, className, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl bg-white/[0.03] border border-white/[0.07] p-4',
        glow && 'border-violet-500/40 shadow-[0_0_24px_rgba(124,58,237,0.12),inset_0_0_0_1px_rgba(124,58,237,0.15)]',
        onClick && 'cursor-pointer hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-150',
        className
      )}
    >
      {children}
    </div>
  )
}
