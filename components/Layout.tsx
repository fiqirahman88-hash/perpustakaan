import React from 'react';
import { User, UserRole } from '../types';
import { 
  LogOut, 
  Book as BookIcon, 
  Users, 
  LayoutDashboard, 
  BookOpen,
  Library,
  Settings,
  Bell
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const isAdmin = user.role === UserRole.ADMIN;

  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Kelola Buku', icon: BookIcon },
    { id: 'students', label: 'Kelola Siswa', icon: Users },
  ];

  const studentMenu = [
    { id: 'catalog', label: 'Katalog Buku', icon: Library },
    { id: 'reading', label: 'Rak Saya', icon: BookOpen },
  ];

  const menu = isAdmin ? adminMenu : studentMenu;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-30">
        <div className="p-8">
          <div className="flex items-center gap-3 text-red-800">
            <div className="bg-gradient-to-tr from-red-800 to-red-950 p-2.5 rounded-xl text-white shadow-red-100 shadow-lg">
              <Library size={24} />
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-slate-800">SmartLib</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Navigation</p>
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                activeTab === item.id 
                ? 'bg-red-800 text-white shadow-lg shadow-red-50 font-semibold' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-red-700'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-800 flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">{isAdmin ? 'Admin Panel' : 'Student Access'}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-red-500 hover:bg-red-50 border border-slate-200 text-xs font-bold transition-colors"
            >
              <LogOut size={14} />
              Keluar Sesi
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 font-medium">v2.1 Professional Edition</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-20">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {menu.find(m => m.id === activeTab)?.label || 'Overview'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Selamat datang kembali, {user.name}!</p>
          </div>
          <div className="flex items-center gap-3">
             <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 transition-colors">
               <Bell size={20} />
             </button>
             <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-100 transition-colors">
               <Settings size={20} />
             </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;