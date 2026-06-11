import { useEffect, useState } from 'react';
import { Factory, GitFork, Cog, FileText } from 'lucide-react';
import { format } from 'date-fns';
import api from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [data, setData] = useState({ stats: null, recentLogs: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center py-20 text-slate-400">Loading dashboard...</div>;

  const { stats, recentLogs } = data;

  const statCards = [
    { name: 'Total Sheds', value: stats?.totalSheds || 0, icon: Factory, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Lines', value: stats?.totalLines || 0, icon: GitFork, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Total Machines', value: stats?.totalMachines || 0, icon: Cog, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Total Logs', value: stats?.totalLogs || 0, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="mt-2 text-slate-500">Overview of your manufacturing plant maintenance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className={`p-4 rounded-xl ${stat.bg} mr-5`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No activity logs found.</div>
          ) : (
            recentLogs.map((log) => (
              <div key={log.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-start mb-4 sm:mb-0">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full mr-4 shrink-0 ${
                    log.machine_status === 'Running' ? 'bg-emerald-500' :
                    log.machine_status === 'Maintenance' ? 'bg-amber-500' :
                    log.machine_status === 'Breakdown' ? 'bg-red-500' : 'bg-slate-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      <Link to={`/machine/${log.machine_id}`} className="hover:text-primary-600 transition-colors">
                        {log.machine_name} ({log.machine_code})
                      </Link>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{log.activity}</p>
                    <div className="flex items-center mt-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-600 mr-2">{log.operator_name}</span>
                      &bull; <span className="ml-2">{format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 self-start sm:self-center">
                  {log.machine_status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
