import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Factory, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Browse Plant', path: '/browse', icon: Factory },
  ];

  return (
    <div className="flex h-screen bg-background font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center mr-3 shadow-md shadow-primary-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Logbook</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <item.icon className={clsx('mr-3 w-5 h-5 transition-transform group-hover:scale-110', isActive ? 'text-primary-600' : 'text-slate-400')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer transition-colors rounded-xl hover:bg-slate-50">
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-surface border-b border-slate-200 flex items-center px-6 md:hidden">
            <Activity className="w-6 h-6 text-primary-600 mr-3" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">Logbook</span>
        </header>
        <div className="flex-1 overflow-auto p-6 md:p-10 bg-slate-50/50 pb-20 md:pb-6">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 z-50 px-2 pb-safe">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'flex flex-col items-center justify-center w-full h-full space-y-1',
                  isActive ? 'text-primary-600' : 'text-slate-500 hover:text-slate-900'
                )}
              >
                <item.icon className={clsx('w-5 h-5', isActive ? 'text-primary-600' : 'text-slate-500')} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
