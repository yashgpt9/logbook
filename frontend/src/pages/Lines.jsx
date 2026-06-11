import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GitFork } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

export default function Lines() {
  const { shedId } = useParams();
  const navigate = useNavigate();
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newLineName, setNewLineName] = useState('');

  const fetchLines = async () => {
    try {
      const res = await api.get(`/sheds/${shedId}/lines`);
      setLines(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLines();
  }, [shedId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newLineName.trim()) return;
    try {
      await api.post(`/sheds/${shedId}/lines`, { name: newLineName });
      setNewLineName('');
      setShowModal(false);
      toast.success('Line created successfully!');
      fetchLines();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create line');
    }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this line? All machines inside will be deleted.')) return;
    try {
      await api.delete(`/lines/${id}`);
      toast.success('Line deleted');
      fetchLines();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete line');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <button onClick={() => navigate('/browse')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sheds
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Production Lines</h1>
            <p className="mt-2 text-slate-500">Select a line to view its machines.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Line
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400">Loading lines...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lines.map((line) => (
            <Link
              key={line.id}
              to={`/browse/${shedId}/lines/${line.id}/machines`}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={(e) => handleDelete(e, line.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  title="Delete Line"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
                <GitFork className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{line.name}</h3>
              <p className="text-sm text-slate-500">View machines &rarr;</p>
            </Link>
          ))}
          {lines.length === 0 && (
            <div className="col-span-full p-10 text-center bg-white border border-dashed border-slate-300 rounded-2xl text-slate-500">
              No lines found in this shed.
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Create New Line</h3>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Line Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                  placeholder="e.g. Packaging Line 1"
                  value={newLineName}
                  onChange={(e) => setNewLineName(e.target.value)}
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
                  className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  Create Line
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
