import React, { useRef, useState, useEffect } from 'react';
import { Book } from '../types';
import { ArrowLeft, Maximize, Minimize, Share2, Info, BookOpen, AlertCircle } from 'lucide-react';

interface BookReaderProps {
  book: Book;
  onBack: () => void;
}

const BookReader: React.FC<BookReaderProps> = ({ book, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Helper to extract ID if user accidentally pasted the whole URL
  const extractId = (input: string) => {
    const match = input.match(/\/d\/(.+?)\/(view|preview)/) || input.match(/id=(.+?)(&|$)/);
    return match ? match[1] : input;
  };

  const fileId = extractId(book.driveLink);
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  const toggleFullScreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Gagal mengaktifkan layar penuh: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
      {/* Reader Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white hover:bg-slate-50 rounded-2xl text-slate-600 transition-all border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 line-clamp-1">{book.title}</h2>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <BookOpen size={14} className="text-red-800" />
              Mode Membaca Digital • Lokasi: {book.shelf}
            </p>
          </div>
        </div>
        <div className="hidden md:flex gap-2">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Share2 size={20} />
          </button>
          <button 
            onClick={toggleFullScreen}
            className={`p-3 rounded-2xl transition-all shadow-lg flex items-center gap-2 px-6 font-bold ${
              isFullscreen 
              ? 'bg-slate-800 text-white hover:bg-slate-700' 
              : 'bg-red-800 text-white hover:bg-red-900 shadow-red-100'
            }`}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            {isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
          </button>
        </div>
      </div>

      {/* Main Viewer Container */}
      <div 
        ref={containerRef}
        className={`flex-1 min-h-[600px] bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl relative ${
          isFullscreen ? 'rounded-0' : 'rounded-[2.5rem]'
        }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 text-slate-500">
          <div className="bg-slate-800 p-6 rounded-full mb-4 animate-pulse">
            <BookOpen size={48} className="text-slate-600" />
          </div>
          <p className="font-bold text-lg">Memuat Dokumen Digital...</p>
          <p className="text-sm opacity-60">Pastikan Anda memiliki koneksi internet yang stabil.</p>
        </div>
        
        <iframe
          src={previewUrl}
          className="w-full h-full border-0 relative z-10"
          allow="autoplay"
          title={book.title}
          loading="lazy"
        ></iframe>
      </div>
      
      {/* Navigation Help */}
      {!isFullscreen && (
        <div className="mt-6 p-5 bg-red-50 rounded-2xl border border-red-100 text-red-950 flex items-start gap-4">
          <Info className="shrink-0 mt-0.5 text-red-800" size={20} />
          <div className="text-xs md:text-sm leading-relaxed">
            <p className="font-bold mb-1">Panduan Viewer:</p>
            <p>Jika dokumen tidak muncul, pastikan file di Google Drive telah diatur ke <span className="font-bold">"Siapa saja yang memiliki link dapat melihat"</span>. Gunakan kontrol zoom di dalam viewer untuk memperbesar teks.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReader;