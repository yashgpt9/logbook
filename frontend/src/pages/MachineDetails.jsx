import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Printer, Activity, User, MessageSquare, Download, Clock, Wrench } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import api from '../api/api';

export default function MachineDetails() {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [logForm, setLogForm] = useState({
    employee_name: '',
    employee_code: '',
    type_of_work: 'General',
    part_used: '',
    time_taken: '',
    activity: '',
    remarks: '',
    machine_status: 'Running'
  });

  const fetchData = async () => {
    try {
      const [machineRes, logsRes] = await Promise.all([
        api.get(`/machines/${machineId}`),
        api.get(`/machines/${machineId}/logs`, { params: { status: statusFilter, startDate, endDate } })
      ]);
      setMachine(machineRes.data);
      setLogs(logsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [machineId, statusFilter, startDate, endDate]);

  const handleCreateLog = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/machines/${machineId}/logs`, logForm);
      setLogForm({
        employee_name: '',
        employee_code: '',
        type_of_work: 'General',
        part_used: '',
        time_taken: '',
        activity: '',
        remarks: '',
        machine_status: 'Running'
      });
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Error creating log: ' + (error.response?.data?.error || error.message));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const dataToExport = logs.map(log => ({
      'Date & Time': format(new Date(log.created_at), 'MMM d, yyyy h:mm a'),
      'Status': log.machine_status,
      'Employee Name': log.employee_name,
      'Employee Code': log.employee_code || '-',
      'Type of Work': log.type_of_work,
      'Part Used': log.part_used || '-',
      'Time Taken (mins)': log.time_taken || '-',
      'Activity': log.activity,
      'Remarks': log.remarks || '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Maintenance Logs');
    XLSX.writeFile(workbook, `${machine.machine_code}_Logs.xlsx`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Running': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Breakdown': return 'bg-red-100 text-red-800 border-red-200';
      case 'Stopped': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Running': return 'bg-emerald-500';
      case 'Maintenance': return 'bg-amber-500';
      case 'Breakdown': return 'bg-red-500';
      case 'Stopped': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Loading machine details...</div>;
  if (!machine) return <div className="p-8 text-red-500">Machine not found</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10 print:max-w-none print:bg-white print:p-0">
      
      {/* Header section */}
      <div className="print:hidden">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{machine.machine_name}</h1>
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                {machine.machine_code}
              </span>
            </div>
            <p className="mt-2 text-slate-500 flex items-center">
              {machine.shed_name} <span className="mx-2 text-slate-300">/</span> {machine.line_name}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5 mr-2 text-slate-400" />
              Export Excel
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <Printer className="w-5 h-5 mr-2 text-slate-400" />
              Print
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Log
            </button>
          </div>
        </div>
      </div>

      {/* Printable Header */}
      <div className="hidden print:block mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-black mb-2">Machine Maintenance History</h1>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>Machine Name:</strong> {machine.machine_name}</div>
          <div><strong>Machine Code:</strong> {machine.machine_code}</div>
          <div><strong>Shed:</strong> {machine.shed_name}</div>
          <div><strong>Line:</strong> {machine.line_name}</div>
        </div>
      </div>

      {/* Filters (Non-printable) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 print:hidden flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option value="">All Statuses</option>
            <option value="Running">Running</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Breakdown">Breakdown</option>
            <option value="Stopped">Stopped</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Start Date</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">End Date</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
        {(statusFilter || startDate || endDate) && (
          <button 
            onClick={() => { setStatusFilter(''); setStartDate(''); setEndDate(''); }}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium pb-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-4 bottom-0 w-0.5 bg-slate-200 print:hidden"></div>

        <div className="space-y-6">
          {logs.length === 0 ? (
            <div className="pl-20 py-8 text-slate-500 italic print:pl-0">No logs recorded for this machine.</div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="relative flex items-start gap-6 group print:gap-4 print:mb-6 print:break-inside-avoid">
                {/* Timeline Dot */}
                <div className="relative z-10 flex items-center justify-center w-16 pt-1.5 print:hidden">
                  <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm ${getStatusDot(log.machine_status)} ring-1 ring-slate-200`}></div>
                </div>

                {/* Log Card */}
                <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 transition-all hover:shadow-md print:shadow-none print:border-slate-300 print:p-4 print:rounded-none">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3 print:border-none print:pb-0">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(log.machine_status)}`}>
                        {log.machine_status}
                      </span>
                      <span className="text-sm font-medium text-slate-500">
                        {format(new Date(log.created_at), 'MMM d, yyyy • h:mm a')}
                      </span>
                      <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {log.type_of_work}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Activity className="w-5 h-5 text-slate-400 mt-0.5 shrink-0 print:hidden" />
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-1 print:text-xs">Activity</h4>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{log.activity}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl print:bg-white print:border print:border-slate-200 print:p-2">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Part Used: <strong className="text-slate-900">{log.part_used || 'None'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-600">Time Taken: <strong className="text-slate-900">{log.time_taken ? `${log.time_taken} mins` : 'N/A'}</strong></span>
                      </div>
                    </div>
                    
                    {log.remarks && (
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-slate-400 mt-0.5 shrink-0 print:hidden" />
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-1 print:text-xs">Remarks</h4>
                          <p className="text-slate-600 italic whitespace-pre-wrap">{log.remarks}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 print:border-slate-200">
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-slate-400 print:hidden" />
                        <span className="text-sm text-slate-600">Logged by <strong className="text-slate-900">{log.employee_name}</strong> {log.employee_code && <span className="text-slate-400">({log.employee_code})</span>}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Log Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">Add Maintenance Log</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleCreateLog} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employee Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="John Doe"
                    value={logForm.employee_name}
                    onChange={(e) => setLogForm({ ...logForm, employee_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employee Code (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="EMP-123"
                    value={logForm.employee_code}
                    onChange={(e) => setLogForm({ ...logForm, employee_code: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type of Work</label>
                  <select
                    value={logForm.type_of_work}
                    onChange={(e) => setLogForm({ ...logForm, type_of_work: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
                  >
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Software">Software</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Machine Status After</label>
                  <select
                    value={logForm.machine_status}
                    onChange={(e) => setLogForm({ ...logForm, machine_status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none"
                  >
                    <option value="Running">Running</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Breakdown">Breakdown</option>
                    <option value="Stopped">Stopped</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Part Used (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="e.g. V-Belt"
                    value={logForm.part_used}
                    onChange={(e) => setLogForm({ ...logForm, part_used: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time Taken (minutes)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    placeholder="e.g. 45"
                    value={logForm.time_taken}
                    onChange={(e) => setLogForm({ ...logForm, time_taken: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Activity Performed</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                    placeholder="Describe the maintenance details..."
                    value={logForm.activity}
                    onChange={(e) => setLogForm({ ...logForm, activity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Remarks (Optional)</label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
                    placeholder="Any additional notes..."
                    value={logForm.remarks}
                    onChange={(e) => setLogForm({ ...logForm, remarks: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-600/20"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
