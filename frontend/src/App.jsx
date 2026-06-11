import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sheds from './pages/Sheds';
import Lines from './pages/Lines';
import Machines from './pages/Machines';
import MachineDetails from './pages/MachineDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="browse" element={<Sheds />} />
          <Route path="browse/:shedId/lines" element={<Lines />} />
          <Route path="browse/:shedId/lines/:lineId/machines" element={<Machines />} />
          <Route path="machine/:machineId" element={<MachineDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
