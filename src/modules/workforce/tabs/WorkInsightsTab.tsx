import { productivityScores, weeklyTrend } from '../../../mock/data/analytics'
import { employees } from '../../../mock/data/employees'
import { GlassCard } from '../../../components/ui/GlassCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export function WorkInsightsTab() {
  const chartData = productivityScores.map(s => {
    const emp = employees.find(e => e.id === s.employeeId)
    return { name: emp?.name?.split(' ')[0] ?? s.employeeId, score: s.score }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <GlassCard>
          <div className="font-outfit font-semibold text-white/70 mb-4">Today's Productivity Scores</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#ffffff50', fontSize: 11 }} />
              <YAxis tick={{ fill: '#ffffff50', fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: '#1f1f2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
              <Bar dataKey="score" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
        <GlassCard>
          <div className="font-outfit font-semibold text-white/70 mb-4">7-Day Avg Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyTrend}>
              <XAxis dataKey="date" tick={{ fill: '#ffffff50', fontSize: 10 }} />
              <YAxis tick={{ fill: '#ffffff50', fontSize: 11 }} domain={[60, 100]} />
              <Tooltip contentStyle={{ background: '#1f1f2e', border: '1px solid #ffffff20', borderRadius: 8 }} />
              <Line type="monotone" dataKey="avg" stroke="#7C3AED" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
      <GlassCard>
        <div className="font-outfit font-semibold text-white/70 mb-3">Employee Breakdown</div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-3 text-white/40 text-sm">Employee</th>
              <th className="text-left p-3 text-white/40 text-sm">Score</th>
              <th className="text-left p-3 text-white/40 text-sm">Active Hours</th>
              <th className="text-left p-3 text-white/40 text-sm">Top App</th>
            </tr>
          </thead>
          <tbody>
            {productivityScores.map(s => {
              const emp = employees.find(e => e.id === s.employeeId)
              return (
                <tr key={s.employeeId} className="border-b border-white/5">
                  <td className="p-3 text-white text-sm">{emp?.name}</td>
                  <td className="p-3 font-geist text-violet-400">{s.score}%</td>
                  <td className="p-3 font-geist text-white/70">{s.activeHours}h</td>
                  <td className="p-3 text-white/70 text-sm">{s.topApp}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
