import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DashboardPage from './pages/demo/DashboardPage';
import MachinesPage from './pages/demo/MachinesPage';
import ReportsPage from './pages/demo/ReportsPage';
import SettingsPage from './pages/demo/SettingsPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo/*" element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="machines" element={<MachinesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
