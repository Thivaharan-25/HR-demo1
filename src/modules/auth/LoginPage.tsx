import { useNavigate } from 'react-router-dom'
import { useAuthStore, type PersonaKey } from '../../store/authStore'
import { GlassCard } from '../../components/ui/GlassCard'

const personas: Array<{ key: PersonaKey; name: string; role: string; seed: string; description: string }> = [
  { key: 'admin', name: 'Sarah Lim', role: 'Super Admin', seed: 'sarah', description: 'Full platform access — all modules, all settings' },
  { key: 'manager', name: 'James Rajan', role: 'Engineering Manager', seed: 'james', description: 'Team view — presence, approvals, exception alerts' },
  { key: 'employee', name: 'Aisha Noor', role: 'Software Engineer', seed: 'aisha', description: 'Self-service — my dashboard, leave, skills' },
]

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const handleSelect = (key: PersonaKey) => { login(key); navigate('/') }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-full max-w-2xl px-6">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-5 shadow-[0_0_30px_rgba(124,58,237,0.5)]">N</div>
          <h1 className="text-3xl font-outfit font-bold text-white">Sign in to ONEVO</h1>
          <p className="text-white/50 mt-2 text-sm">Choose a demo persona to explore the platform</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {personas.map((p) => (
            <GlassCard key={p.key} glow onClick={() => handleSelect(p.key)} className="text-center">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`}
                alt={p.name}
                className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-violet-500/50"
              />
              <div className="font-outfit font-semibold text-white">{p.name}</div>
              <div className="text-violet-400 text-sm mt-1">{p.role}</div>
              <div className="text-white/40 text-xs mt-2 leading-relaxed">{p.description}</div>
            </GlassCard>
          ))}
        </div>
        <p className="text-center text-white/30 text-xs mt-8">ONEVO Demo — No real authentication required</p>
      </div>
    </div>
  )
}
