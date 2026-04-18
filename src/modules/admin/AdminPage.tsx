import { useSearchParams, useNavigate } from 'react-router-dom'
import { employees } from '../../mock/data/employees'
import { GlassCard } from '../../components/ui/GlassCard'
import { PermissionGate } from '../../components/ui/PermissionGate'

type AdminTab = 'users' | 'audit' | 'agents' | 'devices' | 'compliance'

const tabLabels: Record<AdminTab, string> = {
  users: 'Users & Roles',
  audit: 'Audit Log',
  agents: 'Agents',
  devices: 'Devices',
  compliance: 'Compliance',
}

export function AdminPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = (searchParams.get('tab') ?? 'users') as AdminTab

  const setTab = (t: AdminTab) => {
    if (t === 'users') navigate('/admin')
    else navigate(`/admin?tab=${t}`)
  }

  return (
    <PermissionGate module="admin" fallback={
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🔒</span>
          </div>
          <div className="text-white/60 text-base font-outfit">Access Restricted</div>
          <div className="text-white/25 text-sm mt-1">You don't have permission to view this section</div>
        </div>
      </div>
    }>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-outfit font-semibold text-white">Admin</h1>
          <div className="flex gap-1.5 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
            {(Object.keys(tabLabels) as AdminTab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-outfit transition-all ${
                  tab === t
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {tabLabels[t]}
              </button>
            ))}
          </div>
        </div>

        {tab === 'users' && (
          <div className="space-y-6">
            <GlassCard className="p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <span className="text-white/50 text-sm font-outfit">{employees.length} users</span>
                <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
                  + Invite User
                </button>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">User</th>
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Role</th>
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Department</th>
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={emp.id} className={`border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full border border-white/10" />
                          <div>
                            <div className="text-white/85 text-sm font-outfit">{emp.name}</div>
                            <div className="text-white/30 text-xs">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white/55 text-sm">{emp.jobTitle}</td>
                      <td className="px-4 py-3 text-white/55 text-sm">{emp.department}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>

            {/* Role Management */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="text-white/50 text-sm font-outfit">Roles & Permissions</div>
                <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
                  + Create Role
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Super Admin', desc: 'Full platform access — all modules, all tenants', members: 1, color: 'text-red-400', badge: 'bg-red-500/10 border-red-500/20', features: ['All modules', 'Billing', 'User management', 'Tenant config'] },
                  { name: 'HR Manager', desc: 'Core HR, Leave, Documents, Org Structure', members: 2, color: 'text-violet-400', badge: 'bg-violet-500/10 border-violet-500/20', features: ['Core HR', 'Leave', 'Documents', 'Org'] },
                  { name: 'Department Manager', desc: 'View team presence, approve leave, view reports', members: 3, color: 'text-blue-400', badge: 'bg-blue-500/10 border-blue-500/20', features: ['Leave approval', 'Workforce view', 'Team reports'] },
                  { name: 'Employee', desc: 'Own profile, own leave requests, documents', members: 4, color: 'text-green-400', badge: 'bg-green-500/10 border-green-500/20', features: ['Own profile', 'Own leave', 'Own documents'] },
                ].map(role => (
                  <GlassCard key={role.name}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className={`font-outfit font-semibold text-sm ${role.color}`}>{role.name}</div>
                        <div className="text-white/35 text-xs mt-0.5">{role.desc}</div>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ml-2 text-white/50 ${role.badge}`}>{role.members} users</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {role.features.map(f => (
                        <span key={f} className="text-[11px] px-2 py-0.5 rounded bg-white/[0.04] text-white/40 border border-white/[0.06]">{f}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.05]">
                      <button className="text-xs px-2.5 py-1 rounded-lg text-violet-400 border border-violet-500/20 hover:bg-violet-500/10 transition-colors">Edit Permissions</button>
                      <button className="text-xs px-2.5 py-1 rounded-lg text-white/30 border border-white/[0.06] hover:bg-white/[0.04] transition-colors">Assign Users</button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'audit' && (
          <GlassCard>
            <div className="text-white/40 text-sm font-outfit mb-4">Recent activity</div>
            <div className="space-y-2">
              {[
                { action: 'Updated employee profile', user: 'Sarah Lim', target: 'Aisha Noor', time: '08:01' },
                { action: 'Approved leave request', user: 'James Rajan', target: '#l2 Ravi Kumar', time: '08:22' },
                { action: 'WMS Bridge sync completed', user: 'System', target: '12 records synced', time: '08:05' },
                { action: 'Created role', user: 'Sarah Lim', target: 'HR Manager', time: '09:15' },
                { action: 'Exception flagged', user: 'System', target: 'Vikram Singh — No clock-in', time: '09:30' },
              ].map((entry, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-white/70 text-sm font-outfit">{entry.action}</span>
                    <span className="text-white/35 text-sm"> — {entry.target}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-white/25 text-xs font-geist">{entry.user}</div>
                    <div className="text-white/20 text-xs font-geist">2026-04-17 {entry.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {tab === 'agents' && (
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="text-white/40 text-sm font-outfit">Desktop agent instances</div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">5 online</span>
            </div>
            <div className="space-y-2">
              {employees.slice(0, 5).map(emp => (
                <div key={emp.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full border border-white/10" />
                  <div className="flex-1">
                    <div className="text-white/80 text-sm font-outfit">{emp.name}</div>
                    <div className="text-white/30 text-xs font-geist">v2.1.4 · Windows 11 · {emp.email}</div>
                  </div>
                  <span className="text-green-400 text-xs font-outfit">Online</span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {tab === 'devices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-white/40 text-sm font-outfit">Biometric terminals registered to this tenant</div>
              <button className="px-3 py-1.5 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-300 text-xs font-outfit hover:bg-violet-600/30 transition-colors">
                + Register Device
              </button>
            </div>
            <GlassCard className="p-0 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Device</th>
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Type</th>
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Location</th>
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Enrolled</th>
                    <th className="text-left px-4 py-3 text-white/30 text-xs font-outfit uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'BIO-001', name: 'Main Entrance Terminal', type: 'Fingerprint', location: 'HQ - KL Lobby', enrolled: 10, status: 'active' },
                    { id: 'BIO-002', name: 'Server Room Entry', type: 'Face Recognition', location: 'HQ - KL Level 3', enrolled: 4, status: 'active' },
                    { id: 'BIO-003', name: 'Remote Hub Terminal', type: 'NFC Card', location: 'Remote Hub - PJ', enrolled: 3, status: 'active' },
                    { id: 'BIO-004', name: 'Cafeteria Gate', type: 'Fingerprint', location: 'HQ - KL Ground', enrolled: 10, status: 'offline' },
                  ].map(device => (
                    <tr key={device.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-white/85 text-sm font-outfit">{device.name}</div>
                        <div className="text-white/30 text-xs font-geist">{device.id}</div>
                      </td>
                      <td className="px-4 py-3 text-white/55 text-sm">{device.type}</td>
                      <td className="px-4 py-3 text-white/55 text-sm">{device.location}</td>
                      <td className="px-4 py-3 text-white/55 text-sm">{device.enrolled} employees</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${device.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {device.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>
        )}

        {tab === 'compliance' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'GDPR Data Retention Policy', status: 'Active', icon: '🛡️' },
              { label: 'Screenshot Audit Trail', status: 'Enabled', icon: '📸' },
              { label: 'Biometric Data Encryption', status: 'AES-256', icon: '🔐' },
              { label: 'Employee Consent Forms', status: '10/10 signed', icon: '✍️' },
              { label: 'Data Processing Agreement', status: 'Signed', icon: '📄' },
              { label: 'Access Control Policy', status: 'Enforced', icon: '🔒' },
            ].map(item => (
              <GlassCard key={item.label}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-white/75 text-sm font-outfit">{item.label}</div>
                    <div className="text-green-400 text-xs mt-1 font-outfit">{item.status}</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </PermissionGate>
  )
}
