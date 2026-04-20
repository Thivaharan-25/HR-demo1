export type CalendarEventType = 'holiday' | 'company' | 'team' | 'leave' | 'review' | 'personal'

export interface CalendarEvent {
  id: string
  title: string
  date?: string
  startDate?: string
  endDate?: string
  type: CalendarEventType
  employeeId?: string
  teamId?: string
  description?: string
  visibility: 'public' | 'team' | 'private'
}

export const calendarEvents: CalendarEvent[] = [
  // April holidays
  { id: 'c1', title: 'Hari Raya Aidilfitri', date: '2026-04-29', type: 'holiday', visibility: 'public', description: 'Public holiday — Hari Raya (Day 1)' },
  { id: 'c2', title: 'Hari Raya Aidilfitri (Day 2)', date: '2026-04-30', type: 'holiday', visibility: 'public' },

  // Company events
  { id: 'c3', title: 'Q2 All-Hands Meeting', date: '2026-04-22', type: 'company', visibility: 'public', description: 'Quarterly all-hands — Q2 goals and OKR review' },
  { id: 'c4', title: 'NEXUS Hackathon', startDate: '2026-05-01', endDate: '2026-05-02', type: 'company', visibility: 'public', description: '2-day internal hackathon — theme: AI in HR' },
  { id: 'c5', title: 'Q2 Planning Session', date: '2026-05-05', type: 'company', visibility: 'public' },
  { id: 'c6', title: 'Team Building Day', date: '2026-05-16', type: 'company', visibility: 'public' },
  { id: 'c7', title: 'Mid-Year Performance Reviews', startDate: '2026-05-20', endDate: '2026-05-22', type: 'review', visibility: 'public', description: 'Mid-year review cycle begins' },

  // Team events
  { id: 'c8', title: 'Engineering Team Sync', date: '2026-04-21', type: 'team', teamId: 'tm1', visibility: 'team', description: 'Weekly platform team sync' },
  { id: 'c9', title: 'Engineering Team Sync', date: '2026-04-28', type: 'team', teamId: 'tm1', visibility: 'team' },
  { id: 'c10', title: 'HR Monthly Review', date: '2026-04-24', type: 'team', teamId: 'tm6', visibility: 'team' },
  { id: 'c11', title: 'Sales Pipeline Review', date: '2026-04-23', type: 'team', teamId: 'tm15', visibility: 'team' },
  { id: 'c12', title: 'Marketing Sprint Kickoff', date: '2026-04-20', type: 'team', teamId: 'tm10', visibility: 'team' },
  { id: 'c13', title: 'Product Roadmap Review', date: '2026-04-25', type: 'team', teamId: 'tm12', visibility: 'team' },

  // Leave events
  { id: 'c14', title: 'Aisha Noor — Annual Leave', startDate: '2026-04-28', endDate: '2026-04-30', type: 'leave', employeeId: 'e3', visibility: 'team' },
  { id: 'c15', title: 'Ravi Kumar — Medical Leave', startDate: '2026-04-20', endDate: '2026-04-21', type: 'leave', employeeId: 'e4', visibility: 'team' },
  { id: 'c16', title: 'Priya Devi — Annual Leave', startDate: '2026-05-05', endDate: '2026-05-09', type: 'leave', employeeId: 'e5', visibility: 'team' },
  { id: 'c17', title: 'Vikram Singh — Annual Leave', startDate: '2026-05-19', endDate: '2026-05-23', type: 'leave', employeeId: 'e8', visibility: 'team' },
  { id: 'c18', title: 'Kavitha Raj — Medical Leave', startDate: '2026-04-25', endDate: '2026-04-26', type: 'leave', employeeId: 'e10', visibility: 'team' },
  { id: 'c19', title: 'Nurul Ain — Compassionate Leave', startDate: '2026-04-22', endDate: '2026-04-23', type: 'leave', employeeId: 'e7', visibility: 'team' },

  // May events
  { id: 'c20', title: 'Labour Day', date: '2026-05-01', type: 'holiday', visibility: 'public', description: 'Public holiday — Labour Day' },
  { id: 'c21', title: 'Wesak Day', date: '2026-05-12', type: 'holiday', visibility: 'public', description: 'Public holiday — Wesak Day' },
  { id: 'c22', title: '1:1 Review Cycle', startDate: '2026-04-21', endDate: '2026-04-25', type: 'review', visibility: 'team', description: 'Bi-weekly manager 1:1 cycle' },
]
