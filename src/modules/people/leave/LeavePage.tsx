import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { leaveRequests as initialRequests, leaveBalances } from '../../../mock/data/leave'
import { leaveTypes } from '../../../mock/data/leaveTypes'
import { employees } from '../../../mock/data/employees'
import { GlassCard } from '../../../components/ui/GlassCard'
import { cn } from '../../../lib/utils'
import { X, Plus } from 'lucide-react'
import type { LeaveRequest, LeaveType } from '../../../mock/types'

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/20 text-amber-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export function LeavePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'my'
  const { user, permissions } = useAuthStore()

  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests)
  const [showApply, setShowApply] = useState(false)
  const [applyType, setApplyType] = useState(leaveTypes[0]?.name ?? '')
  const [applyStart, setApplyStart] = useState('')
  const [applyEnd, setApplyEnd] = useState('')
  const [applyReason, setApplyReason] = useState('')

  const [selectedReqId, setSelectedReqId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const [showCreateType, setShowCreateType] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')
  const [newTypeDays, setNewTypeDays] = useState(14)
  const [newTypeAccrual, setNewTypeAccrual] = useState<'upfront' | 'monthly'>('upfront')
  const [newTypeCarry, setNewTypeCarry] = useState(false)
  const [newTypeReqDoc, setNewTypeReqDoc] = useState(false)
  const [newTypeApproval, setNewTypeApproval] = useState(true)
  const [localTypes, setLocalTypes] = useState<LeaveType[]>([])

  const userId = user?.id ?? 'e3'
  const canApprove = permissions.includes('leave:approve')
  const canManage = permissions.includes('leave:manage')

  const myBalances = leaveBalances.filter(b => b.employeeId === userId)
  const myRequests = requests.filter(r => r.employeeId === userId)
  const teamIds = employees.filter(e => e.managerId === userId).map(e => e.id)
  const pendingRequests = requests.filter(r =>
    r.status === 'pending' && (canManage || teamIds.includes(r.employeeId))
  )

  const applyDays = applyStart && applyEnd
    ? Math.max(1, Math.ceil((new Date(applyEnd).getTime() - new Date(applyStart).getTime()) / 86400000) + 1)
    : 0

  function submitLeave() {
    setRequests(prev => [...prev, {
      id: `l${Date.now()}`, employeeId: userId, type: applyType,
      startDate: applyStart, endDate: applyEnd, status: 'pending', days: applyDays, reason: applyReason,
    }])
    setShowApply(false); setApplyStart(''); setApplyEnd(''); setApplyReason('')
  }

  function approveReq(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r))
    setSelectedReqId(null)
  }

  function rejectReq(id: string) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r))
    setRejectingId(null); setRejectReason(''); setSelectedReqId(null)
  }

  const selectedReq = selectedReqId ? requests.find(r => r.id === selectedReqId) : null
  const selectedEmp = selectedReq ? employees.find(e => e.id === selectedReq.employeeId) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl font-outfit font-bold text-white mr-2">Leave</h1>
        {[
          { id: 'my', label: 'My Leave', show: true },
          { id: 'approvals', label: 'Pending Approvals', show: canApprove },
          { id: 'types', label: 'Leave Types', show: canManage },
        ].filter(t => t.show).map(t => (
          <button key={t.id} onClick={() => setSearchParams({ tab: t.id })}
            className={cn('px-4 py-2 rounded-lg text-sm font-outfit transition-colors',
              tab === t.id ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-white/40 hover:text-white/70'
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* My Leave */}
      {tab === 'my' && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {myBalances.map(b => (
                <div key={b.type} className="w-44 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                  <div className="text-white/40 text-xs font-outfit mb-1">{b.type}</div>
                  <div className="text-2xl font-geist font-bold text-white">{b.remaining} <span className="text-white/30 text-sm">days</span></div>
                  <div className="text-white/30 text-xs mt-1">{b.used} used · {b.pending} pending</div>
                  <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(b.remaining / b.entitled) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowApply(true)}
              className="flex-shrink-0 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-outfit transition-colors flex items-center gap-2">
              <Plus size={14} /> Apply Leave
            </button>
          </div>
          <GlassCard>
            <div className="font-outfit font-semibold text-white/70 mb-4">My Requests</div>
            <table className="w-full text-sm">
              <thead><tr className="text-white/30 text-xs uppercase tracking-wide">
                {['Type', 'Start', 'End', 'Days', 'Status', ''].map(h => <th key={h} className="text-left pb-3 pr-4">{h}</th>)}
              </tr></thead>
              <tbody>
                {myRequests.map(r => (
                  <tr key={r.id} className="border-t border-white/[0.05]">
                    <td className="py-3 pr-4 text-white/80">{r.type}</td>
                    <td className="py-3 pr-4 text-white/50 font-geist">{r.startDate}</td>
                    <td className="py-3 pr-4 text-white/50 font-geist">{r.endDate}</td>
                    <td className="py-3 pr-4 text-white font-geist">{r.days}</td>
                    <td className="py-3 pr-4"><span className={cn('text-xs px-2 py-1 rounded-full', statusColors[r.status])}>{r.status}</span></td>
                    <td className="py-3">
                      {r.status === 'pending' && (
                        <button onClick={() => setRequests(prev => prev.map(x => x.id === r.id ? { ...x, status: 'rejected' } : x))}
                          className="text-red-400 hover:text-red-300 text-xs">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
                {myRequests.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-white/30 text-sm">No requests yet</td></tr>}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* Approvals */}
      {tab === 'approvals' && canApprove && (
        <div className="flex gap-4">
          <div className="flex-1">
            <GlassCard>
              <div className="font-outfit font-semibold text-white/70 mb-4">Pending Approvals</div>
              <table className="w-full text-sm">
                <thead><tr className="text-white/30 text-xs uppercase tracking-wide">
                  {['Employee', 'Type', 'Dates', 'Days'].map(h => <th key={h} className="text-left pb-3 pr-4">{h}</th>)}
                </tr></thead>
                <tbody>
                  {pendingRequests.map(r => {
                    const emp = employees.find(e => e.id === r.employeeId)
                    return (
                      <tr key={r.id} onClick={() => setSelectedReqId(r.id)}
                        className="border-t border-white/[0.05] cursor-pointer hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <img src={emp?.avatar} alt="" className="w-7 h-7 rounded-full" />
                            <span className="text-white/80">{emp?.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-white/60">{r.type}</td>
                        <td className="py-3 pr-4 text-white/50 font-geist text-xs">{r.startDate} – {r.endDate}</td>
                        <td className="py-3 text-white font-geist">{r.days}</td>
                      </tr>
                    )
                  })}
                  {pendingRequests.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-white/30 text-sm">No pending approvals</td></tr>}
                </tbody>
              </table>
            </GlassCard>
          </div>
          {selectedReq && selectedEmp && (
            <div className="w-64 flex-shrink-0">
              <GlassCard>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-outfit font-semibold text-white/70">Review</div>
                  <button onClick={() => setSelectedReqId(null)}><X size={13} className="text-white/30 hover:text-white" /></button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <img src={selectedEmp.avatar} alt="" className="w-9 h-9 rounded-full" />
                  <div><div className="text-white text-sm">{selectedEmp.name}</div><div className="text-white/40 text-xs">{selectedEmp.jobTitle}</div></div>
                </div>
                <div className="space-y-1.5 mb-4 text-xs">
                  <div className="flex justify-between"><span className="text-white/40">Type</span><span className="text-white">{selectedReq.type}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">Days</span><span className="text-white font-geist">{selectedReq.days}</span></div>
                  <div className="mt-2 bg-white/[0.03] rounded p-2 text-white/30">2 team members also off this period</div>
                </div>
                {rejectingId === selectedReq.id ? (
                  <div className="space-y-2">
                    <textarea placeholder="Rejection reason…" value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={2}
                      className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none resize-none" />
                    <div className="flex gap-1.5">
                      <button onClick={() => setRejectingId(null)} className="flex-1 border border-white/10 text-white/40 text-xs py-1.5 rounded-lg">Cancel</button>
                      <button onClick={() => rejectReq(selectedReq.id)} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs py-1.5 rounded-lg">Confirm</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setRejectingId(selectedReq.id)} className="flex-1 border border-red-500/30 text-red-400 text-xs py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">Reject</button>
                    <button onClick={() => approveReq(selectedReq.id)} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs py-1.5 rounded-lg transition-colors">Approve</button>
                  </div>
                )}
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {/* Leave Types */}
      {tab === 'types' && canManage && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowCreateType(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-outfit transition-colors flex items-center gap-2">
              <Plus size={14} /> Create Leave Type
            </button>
          </div>
          <GlassCard>
            <table className="w-full text-sm">
              <thead><tr className="text-white/30 text-xs uppercase tracking-wide">
                {['Name', 'Days/Year', 'Accrual', 'Carry-Forward', 'Req. Doc', 'Approval'].map(h => <th key={h} className="text-left pb-3 pr-6">{h}</th>)}
              </tr></thead>
              <tbody>
                {[...leaveTypes, ...localTypes].map(t => (
                  <tr key={t.id} className="border-t border-white/[0.05]">
                    <td className="py-3 pr-6 text-white font-medium">{t.name}</td>
                    <td className="py-3 pr-6 text-white/70 font-geist">{t.entitlementDays}</td>
                    <td className="py-3 pr-6 text-white/50 capitalize">{t.accrual}</td>
                    <td className="py-3 pr-6">{t.carryForward ? <span className="text-green-400 text-xs">✓ {t.maxCarryDays}d</span> : <span className="text-white/20">—</span>}</td>
                    <td className="py-3 pr-6">{t.requiresDocument ? <span className="text-amber-400 text-xs">✓</span> : <span className="text-white/20">—</span>}</td>
                    <td className="py-3">{t.approvalRequired ? <span className="text-violet-400 text-xs">✓</span> : <span className="text-white/20">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* Apply Leave slide-over */}
      {showApply && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowApply(false)} />
          <div className="fixed inset-y-0 right-0 w-[360px] bg-[#12111a] border-l border-white/[0.08] z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="text-white font-outfit font-semibold">Apply Leave</div>
              <button onClick={() => setShowApply(false)}><X size={16} className="text-white/40 hover:text-white" /></button>
            </div>
            <div className="flex-1 px-5 py-5 space-y-4 overflow-y-auto">
              <div>
                <label className="text-white/50 text-xs font-outfit block mb-1.5">Leave Type</label>
                <select value={applyType} onChange={e => setApplyType(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50">
                  {leaveTypes.map(t => {
                    const bal = myBalances.find(b => b.type === t.name)
                    return <option key={t.id} value={t.name} className="bg-[#12111a]">{t.name}{bal ? ` (${bal.remaining} left)` : ''}</option>
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-white/50 text-xs font-outfit block mb-1.5">Start Date</label>
                  <input type="date" value={applyStart} onChange={e => setApplyStart(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-outfit block mb-1.5">End Date</label>
                  <input type="date" value={applyEnd} onChange={e => setApplyEnd(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50" />
                </div>
              </div>
              {applyDays > 0 && <div className="text-violet-400 text-xs">{applyDays} day{applyDays !== 1 ? 's' : ''} will be deducted</div>}
              <div>
                <label className="text-white/50 text-xs font-outfit block mb-1.5">Reason</label>
                <textarea value={applyReason} onChange={e => setApplyReason(e.target.value)} rows={3}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500/50 resize-none" />
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center text-white/20 text-xs">Drop attachment here</div>
            </div>
            <div className="px-5 py-4 border-t border-white/[0.08]">
              <button onClick={submitLeave} disabled={!applyStart || !applyEnd || !applyReason}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-2.5 rounded-lg text-sm font-outfit transition-colors">
                Submit Request
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Leave Type modal */}
      {showCreateType && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#12111a] border border-white/[0.08] rounded-2xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <div className="text-white font-outfit font-semibold">Create Leave Type</div>
              <button onClick={() => setShowCreateType(false)}><X size={16} className="text-white/40 hover:text-white" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-white/50 text-xs font-outfit block mb-1.5">Name</label>
                <input value={newTypeName} onChange={e => setNewTypeName(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-outfit block mb-1.5">Days/Year</label>
                  <input type="number" value={newTypeDays} onChange={e => setNewTypeDays(+e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-outfit block mb-1.5">Accrual</label>
                  <select value={newTypeAccrual} onChange={e => setNewTypeAccrual(e.target.value as 'upfront' | 'monthly')}
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                    <option value="upfront" className="bg-[#12111a]">Upfront</option>
                    <option value="monthly" className="bg-[#12111a]">Monthly</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[
                  { state: newTypeCarry, set: setNewTypeCarry, label: 'Carry-Forward' },
                  { state: newTypeReqDoc, set: setNewTypeReqDoc, label: 'Requires Document' },
                  { state: newTypeApproval, set: setNewTypeApproval, label: 'Approval Required' },
                ].map(({ state, set, label }) => (
                  <label key={label} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="accent-violet-500" />
                    <span className="text-white/60 text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-white/[0.08] flex justify-end gap-3">
              <button onClick={() => setShowCreateType(false)} className="border border-white/10 text-white/50 px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => {
                if (!newTypeName) return
                setLocalTypes(prev => [...prev, {
                  id: `lt${Date.now()}`, name: newTypeName, entitlementDays: newTypeDays,
                  accrual: newTypeAccrual, carryForward: newTypeCarry, maxCarryDays: newTypeCarry ? 7 : 0,
                  requiresDocument: newTypeReqDoc, approvalRequired: newTypeApproval, description: '',
                }])
                setShowCreateType(false); setNewTypeName('')
              }} className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
