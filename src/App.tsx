import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { LoginPage } from './modules/auth/LoginPage'
import { HomePage } from './modules/home/HomePage'
import { EmployeesPage } from './modules/people/employees/EmployeesPage'
import { LeavePage } from './modules/people/leave/LeavePage'
import { WorkforcePage } from './modules/workforce/WorkforcePage'
import { OrgPage } from './modules/org/OrgPage'
import { CalendarPage } from './modules/calendar/CalendarPage'
import { InboxPage } from './modules/inbox/InboxPage'
import { AdminPage } from './modules/admin/AdminPage'
import { SettingsPage } from './modules/settings/SettingsPage'
import { EmployeeProfile } from './modules/people/employees/EmployeeProfile'
import { DocumentsPage } from './modules/people/documents/DocumentsPage'
import { SkillsPage } from './modules/skills/SkillsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/people/employees/*" element={<EmployeesPage />} />
          <Route path="/people/leave/*" element={<LeavePage />} />
          <Route path="/workforce/*" element={<WorkforcePage />} />
          <Route path="/org/*" element={<OrgPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/settings/*" element={<SettingsPage />} />
          <Route path="/people/employees/:id" element={<EmployeeProfile />} />
          <Route path="/people/documents/*" element={<DocumentsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
