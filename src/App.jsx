import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ShiftHandoverLog from './components/ShiftLogs';
import SafetyManagementPlan from './components/Safetymanagement';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';
import Login from './components/Login';
import Navbar from './components/Navbar';
import UserManagement from './components/UserManagement';
import AuditLog from './components/AuditLog';
import DataVisualization from './components/DataVisualization';
import ReportGeneration from './components/ReportGeneration';
import Resources from './components/Resources';
import Inventory from './components/Inventory';
import { ResourceProvider } from './context/ResourceContext';
import { WeatherProvider } from './context/WeatherContext';
import WeatherAlerts from './components/WeatherWidget';
import Alerts from './components/Alerts';


// import NotFound from './components/NotFound'; // Optional NotFound component

function App() {
  return (
    <ResourceProvider>
      <WeatherProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Weather" element={<WeatherAlerts />} />
            <Route path="/Audit-Logs" element={<AuditLog />} />
            <Route path="/User-Management" element={<UserManagement />} />
            <Route path="/Data-Visualization" element={<DataVisualization />} />
            <Route path="/Report-Generation" element={<ReportGeneration />} />
            <Route path="/shift-logs" element={<ShiftHandoverLog />} />
            <Route path="/safety-plan" element={<SafetyManagementPlan />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/Alerts" element={<Alerts/>}/>
            {/* <Route path="*" element={<NotFound />} /> Catch-all for 404 */}
          </Routes>
        </Router>
      </WeatherProvider>
    </ResourceProvider>
  );
}

export default App;
