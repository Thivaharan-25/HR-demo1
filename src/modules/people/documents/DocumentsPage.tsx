import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import { companyDocuments, employeeDocuments as initialEmpDocs } from '../../../mock/data/documents'
import { employees } from '../../../mock/data/employees'
import { cn } from '../../../lib/utils'
import { X, Plus, FileText, FileCheck, FileClock } from 'lucide-react'
import type { CompanyDocument, DocumentCategory, DocumentAccessLevel, EmployeeDocument } from '../../../mock/types'

const categories: (DocumentCategory | 'All')[] = ['All', 'Contract', 'Policy', 'Certificate', 'General']

const categoryColors: Record<string, string> = {
  Contract: 'bg-violet-500/20 text-violet-400',
  Policy: 'bg-blue-500/20 text-blue-400',
  Certificate: 'bg-green-500/20 text-green-400',
  General: 'bg-white/10 text-white/50',
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  pending_acknowledgement: { label: 'Pending Acknowledgement', classes: 'bg-amber-500/20 text-amber-400' },
  acknowledged: { label: 'Acknowledged', classes: 'bg-green-500/20 text-green-400' },
  no_action: { label: 'No Action Required', classes: 'bg-white/10 text-white/40' },
}

export function DocumentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') ?? 'mine'
  const { user, permissions } = useAuthStore()
  const canManage = permissions.includes('employees:write')

  const userId = user?.id ?? 'e3'
  const [empDocs, setEmpDocs] = useState<EmployeeDocument[]>(initialEmpDocs)
  const [category, setCategory] = useState<DocumentCategory | 'All'>('All')
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [ackChecked, setAckChecked] = useState(false)

  const [showUpload, setShowUpload] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('Policy')
  const [uploadAccess, setUploadAccess] = useState<DocumentAccessLevel>('Public')
  const [uploadReqAck, setUploadReqAck] = useState(false)
  const [localDocs, setLocalDocs] = useState<CompanyDocument[]>([])

  const myEmpDocs = empDocs.filter(d => d.employeeId === userId)
  const filteredMyDocs = myEmpDocs.filter(ed => {
    const doc = companyDocuments.find(d => d.id === ed.documentId)
    return doc && (category === 'All' || doc.category === category)
  })

  const selectedEmpDoc = selectedDocId ? empDocs.find(d => d.documentId === selectedDocId && d.employeeId === userId) : null
  const selectedDoc = selectedDocId ? companyDocuments.find(d => d.id === selectedDocId) : null

  function acknowledge(docId: string) {
    setEmpDocs(prev => prev.map(d =>
      d.documentId === docId && d.employeeId === userId
        ? { ...d, status: 'acknowledged', acknowledgedAt: new Date().toISOString().split('T')[0] }
        : d
    ))
    setAckChecked(false)
  }

  const allDocs = [...companyDocuments, ...localDocs]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-outfit font-bold text-white mr-2">Documents</h1>
        {[
          { id: 'mine', label: 'My Documents', show: true },
          { id: 'manage', label: 'Manage Documents', show: canManage },
        ].filter(t => t.show).map(t => (
          <button key={t.id} onClick={() => setSearchParams({ tab: t.id })}
            className={cn('px-4 py-2 rounded-lg text-sm font-outfit transition-colors',
              tab === t.id ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-white/40 hover:text-white/70'
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* My Documents */}
      {tab === 'mine' && (
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            {/* Category filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={cn('px-3 py-1.5 rounded-lg text-xs font-outfit transition-colors',
                    category === c ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-white/40 hover:text-white/70 border border-white/[0.07]'
                  )}>
                  {c}
                </button>
              ))}
            </div>

            {/* Document cards */}
            <div className="space-y-2">
              {filteredMyDocs.map(ed => {
                const doc = companyDocuments.find(d => d.id === ed.documentId)
                if (!doc) return null
                const currentStatus = empDocs.find(d => d.documentId === ed.documentId && d.employeeId === userId)?.status ?? ed.status
                const StatusIcon = currentStatus === 'acknowledged' ? FileCheck : currentStatus === 'pending_acknowledgement' ? FileClock : FileText
                return (
                  <div key={ed.id} onClick={() => { setSelectedDocId(doc.id); setAckChecked(false) }}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all',
                      selectedDocId === doc.id
                        ? 'bg-white/[0.05] border-violet-500/30'
                        : 'bg-white/[0.03] border-white/[0.07] hover:border-white/[0.12]'
                    )}>
                    <StatusIcon size={18} className="text-white/30 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{doc.title}</div>
                      <div className="text-white/30 text-xs mt-0.5">Received: {doc.uploadedAt} · {doc.fileSize}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[doc.category])}>{doc.category}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', statusConfig[currentStatus].classes)}>
                        {statusConfig[currentStatus].label}
                      </span>
                    </div>
                  </div>
                )
              })}
              {filteredMyDocs.length === 0 && (
                <div className="text-center text-white/30 text-sm py-10">No documents found</div>
              )}
            </div>
          </div>

          {/* Preview drawer */}
          {selectedDoc && selectedEmpDoc && (
            <div className="w-80 flex-shrink-0">
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                  <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[selectedDoc.category])}>{selectedDoc.category}</span>
                  <button onClick={() => setSelectedDocId(null)}><X size={14} className="text-white/30 hover:text-white" /></button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="text-white font-medium text-sm leading-snug">{selectedDoc.title}</div>
                  <div className="bg-white/[0.02] border border-white/[0.07] rounded-lg h-48 flex items-center justify-center text-white/20 text-xs text-center px-4">
                    PDF Preview<br />{selectedDoc.title}
                  </div>
                  <div className="text-white/30 text-xs">
                    Uploaded: {selectedDoc.uploadedAt} · {selectedDoc.fileSize}
                  </div>
                  {(() => {
                    const currentStatus = empDocs.find(d => d.documentId === selectedDoc.id && d.employeeId === userId)?.status ?? selectedEmpDoc.status
                    const currentAcknowledgedAt = empDocs.find(d => d.documentId === selectedDoc.id && d.employeeId === userId)?.acknowledgedAt
                    if (currentStatus === 'acknowledged') {
                      return <div className="text-green-400 text-xs">Acknowledged on {currentAcknowledgedAt ?? selectedEmpDoc.acknowledgedAt}</div>
                    }
                    if (currentStatus === 'pending_acknowledgement') {
                      return (
                        <div className="space-y-3 pt-1">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <input type="checkbox" checked={ackChecked} onChange={e => setAckChecked(e.target.checked)} className="mt-0.5 accent-violet-500" />
                            <span className="text-white/60 text-xs">I confirm I have read and understood this document</span>
                          </label>
                          <button disabled={!ackChecked} onClick={() => acknowledge(selectedDoc.id)}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white py-2 rounded-lg text-xs font-outfit transition-colors">
                            Acknowledge
                          </button>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manage Documents */}
      {tab === 'manage' && canManage && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowUpload(true)}
              className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-outfit transition-colors flex items-center gap-2">
              <Plus size={14} /> Upload Document
            </button>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/30 text-xs uppercase tracking-wide border-b border-white/[0.07]">
                  {['Title', 'Category', 'Access', 'Uploaded', 'Acknowledgements'].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allDocs.map(doc => {
                  const acks = empDocs.filter(ed => ed.documentId === doc.id && ed.status === 'acknowledged').length
                  const total = empDocs.filter(ed => ed.documentId === doc.id).length
                  return (
                    <tr key={doc.id} className="border-t border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-white/80 max-w-xs truncate">{doc.title}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColors[doc.category])}>{doc.category}</span>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs">{doc.accessLevel}</td>
                      <td className="px-4 py-3 text-white/40 font-geist text-xs">{doc.uploadedAt}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">
                        {doc.requiresAcknowledgement && total > 0 ? `${acks}/${total} ack'd` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#12111a] border border-white/[0.08] rounded-2xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <div className="text-white font-outfit font-semibold">Upload Document</div>
              <button onClick={() => setShowUpload(false)}><X size={16} className="text-white/40 hover:text-white" /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-white/50 text-xs font-outfit block mb-1.5">Title</label>
                <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none" />
              </div>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center text-white/20 text-sm cursor-pointer hover:border-white/20 transition-colors">
                Drag & drop file or click to browse
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-outfit block mb-1.5">Category</label>
                  <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value as DocumentCategory)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                    {(['Contract', 'Policy', 'Certificate', 'General'] as DocumentCategory[]).map(c => (
                      <option key={c} value={c} className="bg-[#12111a]">{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-outfit block mb-1.5">Access Level</label>
                  <select value={uploadAccess} onChange={e => setUploadAccess(e.target.value as DocumentAccessLevel)}
                    className="w-full bg-white/[0.04] border border-white/[0.10] rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
                    {(['Public', 'Department', 'Individual', 'Confidential'] as DocumentAccessLevel[]).map(a => (
                      <option key={a} value={a} className="bg-[#12111a]">{a}</option>
                    ))}
                  </select>
                </div>
              </div>
              {uploadCategory === 'Policy' && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={uploadReqAck} onChange={e => setUploadReqAck(e.target.checked)} className="accent-violet-500" />
                  <span className="text-white/60 text-sm">Requires acknowledgement from employees</span>
                </label>
              )}
            </div>
            <div className="px-6 py-4 border-t border-white/[0.08] flex justify-end gap-3">
              <button onClick={() => setShowUpload(false)} className="border border-white/10 text-white/50 px-4 py-2 rounded-lg text-sm">Cancel</button>
              <button onClick={() => {
                if (!uploadTitle) return
                setLocalDocs(prev => [...prev, {
                  id: `d${Date.now()}`, tenantId: 't1', title: uploadTitle, category: uploadCategory,
                  accessLevel: uploadAccess, uploadedBy: user?.id ?? 'e1',
                  uploadedAt: new Date().toISOString().split('T')[0],
                  requiresAcknowledgement: uploadReqAck, fileSize: '—',
                }])
                setShowUpload(false); setUploadTitle('')
              }} className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm transition-colors">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
