import React, { useState, useMemo } from 'react';
import { Book, Category } from '../types';
import { Search, BookOpen, ExternalLink, Filter, Star, Sparkles, Info, Library, Mail, Instagram, Facebook } from 'lucide-react';

interface StudentDashboardProps {
  books: Book[];
  categories: Category[];
  onReadBook: (book: Book) => void;
  onNavigate?: (tab: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ books, categories, onReadBook, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'popular'>('default');

  const filteredBooks = useMemo(() => {
    let list = books.filter(b => {
      const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || b.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'popular') {
      list = [...list].sort((a, b) => b.viewCount - a.viewCount);
    }

    return list;
  }, [books, searchTerm, selectedCategory, sortBy]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showPopular = () => {
    setSortBy('popular');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-800 to-red-950 rounded-[2.5rem] p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Selamat Datang di Rak Buku Pintar!</h2>
          <p className="text-red-100 text-lg leading-relaxed mb-6">
            Pilih buku favoritmu dari ratusan koleksi digital kami dan mulailah berpetualang lewat kata-kata hari ini.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-red-900 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i + 50}/100/100`} alt="reader" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-red-200">+120 Siswa sedang membaca</p>
          </div>
        </div>
        <div className="absolute right-[-10%] bottom-[-20%] opacity-20">
          <BookOpen size={400} />
        </div>
      </div>

      {/* Modern Marquee Section for Motivation */}
      <div className="marquee-container relative bg-white border border-slate-100 rounded-2xl py-3 px-4 overflow-hidden shadow-sm flex items-center gap-4">
        <div className="bg-red-800 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider z-10 shadow-md flex items-center gap-2">
          <Sparkles size={14} /> Inspirasi
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee inline-block text-sm font-semibold text-slate-600 italic">
            "Membaca adalah alat paling dasar untuk meraih hidup yang lebih baik." — Joseph Addison | Baca 5 buku bulan ini untuk mendapatkan sertifikat literasi digital! | Koleksi buku baru telah tersedia di kategori Novel dan Cerita | Semangat belajar, masa depan cerah menantimu!
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center sticky top-0 z-20 bg-[#F8FAFC]/80 backdrop-blur-md py-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari buku berdasarkan judul..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-red-100 transition-all outline-none"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-4 rounded-[1.5rem] font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all' 
              ? 'bg-red-800 text-white shadow-lg shadow-red-100' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-4 rounded-[1.5rem] font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                ? 'bg-red-800 text-white shadow-lg shadow-red-100' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredBooks.map(book => (
          <div 
            key={book.id} 
            className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={book.coverImage || `https://picsum.photos/seed/${book.id}/600/450`} 
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-red-800 text-xs font-bold rounded-full shadow-sm">
                  {categories.find(c => c.id === book.categoryId)?.name}
                </span>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="bg-amber-400 text-white p-2 rounded-xl shadow-lg">
                  <Star size={16} fill="white" />
                </div>
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{book.title}</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                {book.description || 'Belum ada deskripsi untuk buku ini.'}
              </p>
              
              <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Lokasi</span>
                  <span className="text-sm font-bold text-slate-700">Rak {book.shelf}</span>
                </div>
                <button 
                  onClick={() => onReadBook(book)}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md"
                >
                  <BookOpen size={18} />
                  Baca Sekarang
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredBooks.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Buku tidak ditemukan</h3>
            <p className="text-slate-500">Coba ubah kata kunci atau kategori pencarian Anda.</p>
          </div>
        )}
      </div>

      {/* Student Footer */}
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
              Tempat terbaik untuk menjelajahi dunia melalui buku digital. Mari tingkatkan literasi dan wawasan untuk masa depan yang gemilang.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-slate-800">Navigasi</h5>
            <ul className="text-sm text-slate-500 space-y-2">
              <li onClick={showPopular} className="hover:text-red-800 cursor-pointer transition-colors">Buku Terpopuler</li>
              <li onClick={() => alert('Gunakan viewer PDF untuk membaca, zoom tersedia di dalam viewer.')} className="hover:text-red-800 cursor-pointer transition-colors">Panduan Membaca</li>
              <li onClick={() => onNavigate?.('reading')} className="hover:text-red-800 cursor-pointer transition-colors">Rak Bacaan Saya</li>
              <li onClick={resetFilters} className="hover:text-red-800 cursor-pointer transition-colors">Katalog Lengkap</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-slate-800">Ikuti Kami</h5>
            <div className="flex gap-4">
              <button onClick={() => window.open('https://facebook.com', '_blank')} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-800 hover:text-white transition-all">
                <Facebook size={18} />
              </button>
              <button onClick={() => window.open('https://instagram.com', '_blank')} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-800 hover:text-white transition-all">
                <Instagram size={18} />
              </button>
              <button onClick={() => window.location.href = 'mailto:hello@smartlib.id'} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-red-800 hover:text-white transition-all">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-100 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-medium text-slate-400">© 2024 SmartLib Digital. Dibuat dengan cinta untuk pendidikan Indonesia.</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-red-800 uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full">
            <Sparkles size={12} /> Literasi Untuk Negeri
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StudentDashboard;