import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import ProjectDetail from './pages/ProjectDetail';
import Tasks from './pages/Tasks';
import CalendarPage from './pages/Calendar';
import TimerPage from './pages/Timer';
import TimesheetPage from './pages/Timesheet';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/new" element={<CreateProject />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/projects/:id/edit" element={<EditProject />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/timesheet" element={<TimesheetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
