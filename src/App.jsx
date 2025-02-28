import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import UserManagement from './components/UserManagement';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Reports from './components/Reports';
import IncidentsList from './components/IncidentsList';
import IncidentDetails from './components/IncidentDetails';
import CompleteTicket from './components/CompleteTicket';
import MasterManagement from './components/MasterManagement';
import CompleteOrg from './components/CompleteOrg';
import User from './components/User';
import Filter from './components/Filter';
import ProductMaster from './components/ProductMaster';
import ForgotPassword from './components/ForgotPassword';
import LevelManagement from './components/LevelManagement';
import SFTP from './components/SFTP';



const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]); // New state for incidents

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
  };

  const handleCreateTicket = (ticketData) => {
    // Create a new incident with the ticket data
    const newIncident = {
      id: Date.now(), // Simple way to generate unique ID
      ...ticketData,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    setIncidents(prevIncidents => [...prevIncidents, newIncident]);
  };

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div
          style={{
            marginLeft: sidebarOpen ? '250px' : '70px',
            width: sidebarOpen ? 'calc(100% - 250px)' : 'calc(100% - 70px)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Header
            onMenuClick={toggleSidebar}
            onLogout={handleLogout}
            onCreateTicket={handleCreateTicket}
          />
          <main style={{
            padding: '20px',
            flex: 1,
            backgroundColor: '#f4f6f9',
            overflowY: 'auto'
          }}>
            {children}
          </main>
        </div>
      </div>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={<Login onLogin={handleLogin} />}
        />
        // In your router configuration
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard incidents={incidents} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <IncidentsList
                onSelectIncident={handleSelectIncident}
                incidents={incidents}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents/:id"
          element={
            <ProtectedRoute>
              <CompleteTicket />
            </ProtectedRoute>
          }
        />
        <Route path="/complete-org/:organizationId"
          element={
            <ProtectedRoute>
              <CompleteOrg />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents/:id/details"
          element={
            <ProtectedRoute>
              <IncidentDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-management/user/:userId"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />

        <Route
          path="/master-management"
          element={
            <ProtectedRoute>
              <MasterManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product-management"
          element={
            <ProtectedRoute>
              <ProductMaster />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sftp"
          element={
            <ProtectedRoute>
              <SFTP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Filter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <LevelManagement />
            </ProtectedRoute>
          }
        />

        {/* Redirect unmatched routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
};

export default App;