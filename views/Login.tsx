import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Library, LogIn, ShieldAlert, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin Check
    if (username === 'admin' && password === 'admin009') {
      onLogin({
        id: 'admin-1',
        username: 'admin',
        name: 'Pak Guru (Admin)',
        role: UserRole.ADMIN
      });
      return;
    }

    // Student Check (001-919)
    const studentIdPattern = /^(00[1-9]|0[1-9][0-9]|[1-8][0-9][0-9]|9[0-1][0-9])$/;
    if (studentIdPattern.test(username)) {
      onLogin({
        id: `student-${username}`,
        username: username,
        name: `Siswa ${username}`,
        role: UserRole.STUDENT
      });
      return;
    }

    setError('Username atau password tidak valid (001-919 untuk Siswa)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-950 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl mb-6 shadow-2xl border border-white/20">
            <Library className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">SmartLib</h1>
          <p className="text-red-100 flex items-center justify-center gap-2">
            <Sparkles size={16} /> Digital Library Platform <Sparkles size={16} />
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Selamat Datang</h2>
              <p className="text-slate-500 mt-1">Silakan masuk ke akun Anda</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 text-sm animate-pulse">
                  <ShieldAlert size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Username / NIS</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin atau 001-919"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-800 transition-all outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 focus:border-red-800 transition-all outline-none"
                  required={username === 'admin'}
                />
                <p className="text-xs text-slate-400 mt-2">*Siswa tidak memerlukan password</p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-red-800 hover:bg-red-900 text-white rounded-2xl font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <LogIn size={20} />
                <span>Masuk Sekarang</span>
              </button>
            </form>
          </div>
          
          <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 italic">"Membaca adalah jendela dunia"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;