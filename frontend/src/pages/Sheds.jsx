import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Factory, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

export default function Sheds() {
  const [sheds, setSheds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newShedName, setNewShedName] = useState('');

  const fetchSheds = async () => {
    try {
      const res = await api.get('/sheds');
      setSheds(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheds();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newShedName.trim()) return;
    try {
      await api.post('/sheds', { name: newShedName });
      setNewShedName('');
      setShowModal(false);
      toast.success('Shed created successfully!');
      fetchSheds();
    } catch (error) {
      console.error(error);
      toast.error('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this shed? All lines and machines inside will be deleted.')) return;
    try {
      await api.delete(`/sheds/${id}`);
      toast.success('Shed deleted');
      fetchSheds();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete shed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Plant Sheds</h1>
          <p className="mt-2 text-slate-500">Select a shed to view its production lines.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Shed
        </button>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading sheds...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sheds.map((shed) => (
            <Link
              key={shed.id}
              to={`/browse/${shed.id}/lines`}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={(e) => handleDelete(e, shed.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="Delete Shed"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 bg-primary-50 text-primary-600 rounded-xl w-fit mb-4">
                <Factory className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{shed.name}</h3>
              <p className="text-sm text-slate-500">View production lines &rarr;</p>
            </Link>
          ))}
          {sheds.length === 0 && (
            <div className="col-span-full p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-slate-500">
              No sheds found. Click "Add Shed" to create one.
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Create New Shed</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Shed Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-colors"
                  placeholder="e.g. Assembly Area A"
                  value={newShedName}
                  onChange={(e) => setNewShedName(e.target.value)}
                />
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
                  className="px-4 py-2 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors"
                >
                  Create Shed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
