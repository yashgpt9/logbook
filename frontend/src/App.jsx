import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sheds from './pages/Sheds';
import Lines from './pages/Lines';
import Machines from './pages/Machines';
import MachineDetails from './pages/MachineDetails';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/browse" replace />} />
              <Route path="browse" element={<Sheds />} />
          <Route path="browse/:shedId/lines" element={<Lines />} />
          <Route path="browse/:shedId/lines/:lineId/machines" element={<Machines />} />
          <Route path="machine/:machineId" element={<MachineDetails />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
