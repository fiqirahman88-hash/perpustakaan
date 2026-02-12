import React, { useState } from 'react';
import { Student } from '../types';
import { Search, Edit2, Trash2, X, Users, UserPlus, ShieldCheck } from 'lucide-react';

interface ManageStudentsProps {
  students: Student[];
  onAddStudent: (name: string, username: string) => void;
  onUpdateStudent: (id: string, name: string) => void;
  onDeleteStudent: (id: string) => void;
}

const ManageStudents: React.FC<ManageStudentsProps> = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', username: '' });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.username.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateStudent(editingId, formData.name);
    } else {
      onAddStudent(formData.name, formData.username);
    }
    closeModal();
  };

  const openEdit = (s: Student) => {
    setEditingId(s.id);
    setFormData({ name: s.name, username: s.username });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ name: '', username: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
        <div className="relative w-full lg:w-[450px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan NIS atau Nama Siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-red-100 transition-all outline-none font-medium text-slate-700 placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 flex-1">
             <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center">
               <Users size={18} />
             </div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Database Siswa</p>
               <p className="text-sm font-extrabold text-slate-800">{students.length} Terdaftar</p>
             </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-800 hover:bg-red-900 text-white px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 shadow-xl shadow-red-200 transition-all active:scale-95"
          >
            <UserPlus size={20} />
            Entri Siswa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-10 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Nomor Induk (NIS)</th>
                <th className="px-10 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Informasi Siswa</th>
                <th className="px-10 py-5 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Otoritas</th>
                <th className="px-10 py-5 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-red-50/20 transition-colors group">
                  <td className="px-10 py-5">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl font-mono font-bold text-xs border border-slate-200 shadow-inner">
                      {student.username}
                    </span>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-500 shadow-sm border border-white">
                         {student.name.charAt(0)}
                       </div>
                       <p className="font-bold text-slate-800">{student.name}</p>
                    </div>
                  </td>
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
                      <ShieldCheck size={14} />
                      Terverifikasi
                    </div>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEdit(student)}
                        className="p-3 text-slate-400 hover:text-red-800 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm hover:shadow-md"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center text-slate-300">
                    <div className="bg-slate-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                       <Users className="opacity-20" size={48} />
                    </div>
                    <p className="text-xl font-bold">Data siswa tidak ditemukan</p>
                    <p className="text-sm">Gunakan kata kunci pencarian yang berbeda.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-800">{editingId ? 'Edit Identitas' : 'Pendaftaran Siswa'}</h3>
                <p className="text-xs text-slate-400 font-medium">{editingId ? 'Memperbarui database siswa yang ada' : 'Mendaftarkan siswa baru ke sistem'}</p>
              </div>
              <button onClick={closeModal} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1">Nomor Induk Siswa (NIS)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingId}
                    placeholder="Contoh: 001"
                    value={formData.username}
                    onChange={e => setFormData(f => ({ ...f, username: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 font-mono font-bold text-slate-700 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1">Nama Lengkap Siswa</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama sesuai ijazah"
                    value={formData.name}
                    onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 font-bold text-slate-700"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 py-5 font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">Batal</button>
                <button type="submit" className="flex-1 py-5 bg-red-800 text-white font-extrabold rounded-2xl shadow-xl shadow-red-200 transition-all hover:bg-red-900">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;