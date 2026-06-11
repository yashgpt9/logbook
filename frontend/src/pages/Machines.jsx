import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Cog, Plus, Trash2, ArrowLeft } from 'lucide-react';
import api from '../api/api';

export default function Machines() {
  const { shedId, lineId } = useParams();
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ machine_code: '', machine_name: '' });

  const fetchMachines = async () => {
    try {
      const res = await api.get(`/lines/${lineId}/machines`);
      setMachines(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, [lineId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.machine_code.trim() || !formData.machine_name.trim()) return;
    try {
      await api.post(`/lines/${lineId}/machines`, formData);
      setFormData({ machine_code: '', machine_name: '' });
      setShowModal(false);
      fetchMachines();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this machine? All logs associated will be deleted.')) return;
    try {
      await api.delete(`/machines/${id}`);
      fetchMachines();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <button onClick={() => navigate(`/browse/${shedId}/lines`)} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Lines
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Machines</h1>
            <p className="mt-2 text-slate-500">Select a machine to view its details and maintenance history.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Machine
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading machines...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <Link
              key={machine.id}
              to={`/machine/${machine.id}`}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={(e) => handleDelete(e, machine.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="Delete Machine"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit mb-4">
                <Cog className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">{machine.machine_name}</h3>
              <p className="text-sm font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md inline-block mb-3">
                {machine.machine_code}
              </p>
              <p className="text-sm text-slate-500 block">View details & history &rarr;</p>
            </Link>
          ))}
          {machines.length === 0 && (
            <div className="col-span-full p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-slate-500">
              No machines found in this line.
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Create New Machine</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Machine Code</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                    placeholder="e.g. MCH-001"
                    value={formData.machine_code}
                    onChange={(e) => setFormData({ ...formData, machine_code: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Machine Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors"
                    placeholder="e.g. CNC Lathe"
                    value={formData.machine_name}
                    onChange={(e) => setFormData({ ...formData, machine_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors"
                >
                  Create Machine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
