import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
      <Router>
        <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="browse" element={<Sheds />} />
          <Route path="browse/:shedId/lines" element={<Lines />} />
          <Route path="browse/:shedId/lines/:lineId/machines" element={<Machines />} />
          <Route path="machine/:machineId" element={<MachineDetails />} />
        </Route>
      </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
