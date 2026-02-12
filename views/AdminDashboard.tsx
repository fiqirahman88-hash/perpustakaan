import React, { useMemo, useState, useEffect, useRef } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Book, Category, Student, ActivityLog } from '../types';
import { 
  BookOpen, Users, Tags, TrendingUp, BrainCircuit, 
  FileSpreadsheet, Printer, History, Calendar, 
  Info, Library, Facebook, Instagram, Mail, Trophy,
  Medal, Crown, Award
} from 'lucide-react';
import { getLibraryInsights } from '../services/geminiService';

interface AdminDashboardProps {
  books: Book[];
  students: Student[];
  categories: Category[];
  logs: ActivityLog[];
  onNavigate?: (tab: string) => void;
}

const COLORS = ['#800000', '#991b1b', '#450a0a', '#f59e0b', '#10b981'];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ books, students, categories, logs, onNavigate }) => {
  const [aiInsight, setAiInsight] = useState('Menganalisis data...');
  const logsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInsight = async () => {
      const insight = await getLibraryInsights(books.map(b => ({ title: b.title, category: b.categoryId, views: b.viewCount })));
      setAiInsight(insight);
    };
    fetchInsight();
  }, [books]);

  // Calculate top 3 active students
  const leaderboard = useMemo(() => {
    const counts: Record<string, { name: string, count: number }> = {};
    
    logs.forEach(log => {
      if (!counts[log.studentId]) {
        counts[log.studentId] = { name: log.studentName, count: 0 };
      }
      counts[log.studentId].count += 1;
    });

    return Object.entries(counts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [logs]);

  const categoryStats = useMemo(() => {
    return categories.map(cat => ({
      name: cat.name,
      count: books.filter(b => b.categoryId === cat.id).length
    })).filter(c => c.count > 0);
  }, [books, categories]);

  const timelineData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => ({
      date: date.split('-').slice(1).reverse().join('/'),
      reads: logs.filter(l => l.timestamp.startsWith(date)).length
    }));
  }, [logs]);

  const downloadCSV = () => {
    const headers = ['LOG_ID', 'NIS', 'NAMA_SISWA', 'JUDUL_BUKU', 'TANGGAL_WAKTU'];
    const rows = logs.map(l => [l.id, l.studentId.replace('std-',''), l.studentName, l.bookTitle, l.timestamp]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LAPORAN_BACA_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scrollToLogs = () => {
    logsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-800">Analitik Perpustakaan</h3>
          <p className="text-sm text-slate-500">Pantau perkembangan literasi siswa secara real-time</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 px-5 py-3 bg-white text-slate-700 rounded-2xl font-bold text-xs border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileSpreadsheet size={16} className="text-emerald-500" />
            Export Spreadsheet
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-3 bg-red-800 text-white rounded-2xl font-bold text-xs hover:bg-red-900 transition-all shadow-lg shadow-red-100"
          >
            <Printer size={16} />
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Modern Marquee Section */}
      <div className="marquee-container relative bg-white border border-slate-100 rounded-2xl py-3 px-4 overflow-hidden shadow-sm flex items-center gap-4">
        <div className="bg-red-800 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider z-10 shadow-md flex items-center gap-2">
          <Info size={14} /> Pengumuman
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee inline-block text-sm font-medium text-slate-600">
            Sistem Perpustakaan Digital v2.1 Professional Edition | Mohon lakukan backup data buku setiap akhir bulan | Gunakan fitur AI Insights untuk membantu pengambilan keputusan koleksi baru | Perpustakaan buka 07.00 - 15.00 WIB setiap hari sekolah.
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Koleksi Buku', value: books.length, icon: BookOpen, color: 'text-red-700', bg: 'bg-red-50' },
          { label: 'Siswa Aktif', value: students.length, icon: Users, color: 'text-red-800', bg: 'bg-red-50' },
          { label: 'Kategori', value: categories.length, icon: Tags, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Total Interaksi', value: logs.length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-red-200 transition-all">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-extrabold text-slate-800">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Visualization & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Tren Membaca Siswa</h3>
              <p className="text-xs text-slate-400">Data aktivitas 7 hari terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-800 bg-red-50 px-3 py-1.5 rounded-full">
              <Calendar size={14} />
              Live Report
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorReads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#800000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#800000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="reads" stroke="#800000" strokeWidth={4} fillOpacity={1} fill="url(#colorReads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 3 Leaderboard Section */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Top 3 Literasi</h3>
            <Trophy size={20} className="text-amber-400" />
          </div>
          
          <div className="space-y-4 flex-1">
            {leaderboard.length > 0 ? leaderboard.map((item, idx) => {
              const colors = [
                { bg: 'bg-amber-50', text: 'text-amber-600', icon: Crown, border: 'border-amber-100' },
                { bg: 'bg-slate-50', text: 'text-slate-500', icon: Medal, border: 'border-slate-100' },
                { bg: 'bg-orange-50', text: 'text-orange-600', icon: Award, border: 'border-orange-100' }
              ][idx];

              return (
                <div key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${colors.border} ${colors.bg} transition-transform hover:scale-[1.02]`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.text} bg-white shadow-sm font-bold`}>
                    <colors.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {item.id.replace('std-','')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-slate-800">{item.count}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Bacaan</p>
                  </div>
                </div>
              );
            }) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-10">
                <Trophy size={48} className="mb-4" />
                <p className="text-sm font-bold italic">Belum ada aktivitas</p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-50">
             <div className="bg-red-50 p-3 rounded-xl flex items-center gap-3">
               <Info size={16} className="text-red-800 shrink-0" />
               <p className="text-[10px] text-red-900 leading-tight">Berikan apresiasi pada siswa teraktif bulan ini untuk menjaga motivasi mereka.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Analytics Visualization Part 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Keseimbangan Koleksi</h3>
          <p className="text-xs text-slate-400 mb-8">Porsi buku berdasarkan kategori</p>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="count"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryStats.slice(0, 3).map((cat, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  {cat.name}
                </div>
                <span className="font-bold text-slate-800">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs Section */}
        <div ref={logsRef} className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2.5 rounded-xl text-slate-600">
                <History size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Log Aktivitas Terbaru</h3>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Last 10 Actions</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Waktu</th>
                  <th className="px-8 py-4">Siswa</th>
                  <th className="px-8 py-4">Materi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {logs.slice(0, 10).map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <p className="text-xs font-bold text-slate-700">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{log.studentName}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-semibold text-red-800 truncate max-w-[150px]">{log.bookTitle}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-4">
          {/* AI Insight Section */}
          <div className="bg-gradient-to-br from-red-800 via-red-950 to-black p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
             <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="bg-white/20 p-6 rounded-3xl backdrop-blur-md shrink-0">
                  <BrainCircuit size={48} />
                </div>
                <div>
                  <h4 className="text-2xl font-extrabold mb-2 leading-tight">AI Smart Strategy</h4>
                  <p className="text-red-100 text-sm leading-relaxed font-medium">
                    "{aiInsight}"
                  </p>
                  <div className="mt-4 flex gap-4">
                    <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm text-[10px] font-bold uppercase">
                      Recommendation Ready
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Admin Footer */}
      <footer className="mt-20 pt-10 border-t border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-red-800">
              <div className="bg-red-800 p-2 rounded-lg text-white">
                <Library size={20} />
              </div>
              <span className="text-xl font-bold text-slate-800">SmartLib Digital</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
              Sistem manajemen perpustakaan sekolah modern berbasis digital dengan integrasi AI untuk mencerdaskan kehidupan bangsa melalui literasi.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-slate-800">Tautan Penting</h5>
            <ul className="text-sm text-slate-500 space-y-2">
              <li onClick={scrollToTop} className="hover:text-red-800 cursor-pointer transition-colors">Beranda Analitik</li>
              <li onClick={() => onNavigate?.('books')} className="hover:text-red-800 cursor-pointer transition-colors">Manajemen Buku</li>
              <li onClick={() => onNavigate?.('students')} className="hover:text-red-800 cursor-pointer transition-colors">Database Siswa</li>
              <li onClick={scrollToLogs} className="hover:text-red-800 cursor-pointer transition-colors">Log Aktivitas</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-slate-800">Hubungi Kami</h5>
            <div className="flex gap-4">
              <button onClick={() => window.open('https://facebook.com', '_blank')} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-800 hover:text-white transition-all">
                <Facebook size={18} />
              </button>
              <button onClick={() => window.open('https://instagram.com', '_blank')} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-800 hover:text-white transition-all">
                <Instagram size={18} />
              </button>
              <button onClick={() => window.location.href = 'mailto:support@smartlib.id'} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-800 hover:text-white transition-all">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-400">© 2024 SmartLib Professional Edition. Dikembangkan oleh Tim IT Sekolah.</p>
          <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Server Status: Online</span>
            <span>Version: 2.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;