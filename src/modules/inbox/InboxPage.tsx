import { notifications } from '../../mock/data/notifications'
import { useLiveStore } from '../../store/liveStore'
import { GlassCard } from '../../components/ui/GlassCard'

const typeIcon: Record<string, string> = {
  approval: '✅', alert: '🚨', mention: '💬', info: 'ℹ️',
}

export function InboxPage() {
  const liveNotifications = useLiveStore((s) => s.liveNotifications)
  const all = [...liveNotifications, ...notifications]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-outfit font-bold text-white">Inbox</h1>
      <div className="space-y-3">
        {all.map((n, i) => (
          <GlassCard key={n.id ?? i} glow={!n.read} className="flex items-start gap-4">
            <span className="text-xl flex-shrink-0">{typeIcon[n.type]}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-white font-outfit text-sm font-semibold">{n.title}</span>
                <span className="text-white/30 text-xs font-geist">{new Date(n.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="text-white/60 text-sm mt-1">{n.body}</div>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0 mt-1" />}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
