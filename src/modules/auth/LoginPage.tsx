import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, type PersonaKey } from '../../store/authStore'
import { ShieldCheck, BarChart2, Users, Radio, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const personas: Array<{
  key: PersonaKey
  name: string
  role: string
  seed: string
  description: string
  badge: string
  accentColor: string
  badgeColor: string
  dotColor: string
  permissions: string[]
}> = [
  {
    key: 'admin',
    name: 'Sarah Lim',
    role: 'Chief HR Officer',
    seed: 'sarah',
    description: 'Full platform access — all employees, analytics, settings & admin controls.',
    badge: 'Super Admin',
    accentColor: 'violet',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    dotColor: 'bg-violet-400',
    permissions: ['All modules', 'Settings & branding', 'Admin panel'],
  },
  {
    key: 'manager',
    name: 'James Rajan',
    role: 'Engineering Manager',
    seed: 'james',
    description: 'Team-scoped view — presence monitoring, leave approvals & exception alerts.',
    badge: 'Manager',
    accentColor: 'sky',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    dotColor: 'bg-sky-400',
    permissions: ['Team HR', 'Leave approvals', 'Workforce live'],
  },
  {
    key: 'employee',
    name: 'Aisha Noor',
    role: 'Software Engineer',
    seed: 'aisha',
    description: 'Self-service portal — my dashboard, leave requests, skills & documents.',
    badge: 'Employee',
    accentColor: 'emerald',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    dotColor: 'bg-emerald-400',
    permissions: ['My profile', 'Leave requests', 'My skills'],
  },
]

const features = [
  { icon: Users, label: 'People & Org', sub: '28 employees · 7 departments · full org chart' },
  { icon: Radio, label: 'Workforce Intelligence', sub: 'Real-time presence, activity & exceptions' },
  { icon: BarChart2, label: 'Analytics Suite', sub: 'Productivity trends, attendance & payroll' },
  { icon: ShieldCheck, label: 'Role-Based Access', sub: '3 demo personas with scoped permissions' },
]

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [hoveredPersona, setHoveredPersona] = useState<PersonaKey | null>(null)
  const [loading, setLoading] = useState<PersonaKey | null>(null)

  const handleSelect = (key: PersonaKey) => {
    setLoading(key)
    setTimeout(() => {
      login(key)
      navigate('/')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[#05050d] flex overflow-hidden">

      {/* ── Animated background ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(ellipse,rgba(124,58,237,0.12)_0%,transparent_60%)] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[-15%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(14,165,233,0.07)_0%,transparent_65%)]" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(124,58,237,0.04)_0%,transparent_70%)]" />
        {/* Grid */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
      </div>

      {/* ── Left panel ──────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[440px] xl:w-[500px] shrink-0 relative p-10 xl:p-12 border-r border-white/[0.04]">

        {/* Logo */}
        <div className="relative z-10 animate-fade-in flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-[0_0_32px_rgba(124,58,237,0.6)]">
              N
            </div>
            <div className="absolute inset-0 rounded-xl bg-violet-400/20 blur-xl" />
          </div>
          <div>
            <div className="text-white font-bold text-xl tracking-tight leading-none">ONEVO</div>
            <div className="text-white/30 text-[10px] tracking-widest uppercase mt-0.5">HR Platform</div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 space-y-8 animate-fade-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-medium">
              <Sparkles size={10} />
              Dev 3 — Full Stack HR Demo
            </div>
            <h1 className="text-[40px] xl:text-[44px] font-bold text-white leading-[1.1] tracking-tight">
              Modern HR for<br />
              <span className="text-gradient-violet">modern teams.</span>
            </h1>
            <p className="text-white/40 text-[14px] leading-relaxed max-w-[340px]">
              A complete workforce intelligence platform — from hiring to performance, with real-time presence built in.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3.5">
            {features.map(({ icon: Icon, label, sub }, i) => (
              <div key={label} className="flex items-start gap-3.5 group" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-8 h-8 rounded-lg bg-violet-600/12 border border-violet-500/15 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-violet-600/22 group-hover:border-violet-500/30 transition-all">
                  <Icon size={13} className="text-violet-400" />
                </div>
                <div>
                  <div className="text-white/80 text-[13px] font-semibold">{label}</div>
                  <div className="text-white/30 text-[11px] mt-0.5 leading-relaxed">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 flex items-center gap-2 text-white/15 text-[11px]">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Demo environment · No real authentication required
        </div>
      </div>

      {/* ── Right panel ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(124,58,237,0.5)]">N</div>
          <span className="text-white font-bold text-lg tracking-tight">ONEVO</span>
        </div>

        <div className="w-full max-w-[420px]">

          {/* Heading */}
          <div className="mb-8 animate-fade-up">
            <h2 className="text-[22px] font-bold text-white tracking-tight">Sign in as</h2>
            <p className="text-white/35 text-[13px] mt-1.5">
              Pick a demo persona to explore with pre-loaded data.
            </p>
          </div>

          {/* Persona cards */}
          <div className="space-y-2.5">
            {personas.map((p, i) => {
              const isHovered = hoveredPersona === p.key
              const isLoading = loading === p.key

              const glowMap: Record<string, string> = {
                violet: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:border-violet-500/40',
                sky:    'hover:shadow-[0_0_30px_rgba(14,165,233,0.12)] hover:border-sky-500/40',
                emerald:'hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] hover:border-emerald-500/40',
              }

              return (
                <button
                  key={p.key}
                  onClick={() => handleSelect(p.key)}
                  onMouseEnter={() => setHoveredPersona(p.key)}
                  onMouseLeave={() => setHoveredPersona(null)}
                  disabled={!!loading}
                  className={cn(
                    'w-full group relative flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 text-left overflow-hidden',
                    'bg-white/[0.025] border-white/[0.07]',
                    glowMap[p.accentColor],
                    isLoading && 'scale-[0.99] opacity-80',
                    i === 0 && 'animate-fade-up-delay-1',
                    i === 1 && 'animate-fade-up-delay-2',
                    i === 2 && 'animate-fade-up-delay-3',
                  )}
                >
                  {/* Hover shimmer */}
                  {isHovered && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0 mt-0.5">
                    <div className={cn(
                      'w-11 h-11 rounded-full p-[2px] transition-all',
                      isHovered ? `ring-2 ring-offset-1 ring-offset-transparent ${
                        p.accentColor === 'violet' ? 'ring-violet-500/50' :
                        p.accentColor === 'sky' ? 'ring-sky-500/50' : 'ring-emerald-500/50'
                      }` : ''
                    )}>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`}
                        alt={p.name}
                        className="w-full h-full rounded-full bg-white/5"
                      />
                    </div>
                    <span className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#05050d]', p.dotColor)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-white font-semibold text-[14px]">{p.name}</span>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full border font-medium', p.badgeColor)}>
                        {p.badge}
                      </span>
                    </div>
                    <div className="text-white/40 text-[11px] font-medium mb-2">{p.role}</div>
                    <p className="text-white/30 text-[11px] leading-relaxed">{p.description}</p>

                    {/* Permissions */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {p.permissions.map(perm => (
                        <span key={perm} className="flex items-center gap-1 text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                          <CheckCircle2 size={8} className="text-white/20" />
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow / loader */}
                  <div className="shrink-0 mt-2.5">
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    ) : (
                      <ChevronRight
                        size={15}
                        className={cn(
                          'transition-all duration-200',
                          isHovered ? 'text-white/60 translate-x-0.5' : 'text-white/15'
                        )}
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-white/[0.05] flex items-center justify-center gap-2 text-white/18 text-[11px]">
            <ShieldCheck size={11} className="text-white/20" />
            No real data stored · Demo environment only
          </div>
        </div>
      </div>
    </div>
  )
}
