import React, { useState, useRef } from 'react';
import { Book, Category } from '../types';
import { Plus, Search, Edit2, Trash2, Link as LinkIcon, Sparkles, X, Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { getBookDescription } from '../services/geminiService';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js Worker with a compatible version URL
const PDF_WORKER_URL = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';

try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;
} catch (e) {
  console.warn('PDF.js worker could not be initialized immediately:', e);
}

interface ManageBooksProps {
  books: Book[];
  categories: Category[];
  onAddBook: (book: Omit<Book, 'id' | 'viewCount'>) => void;
  onDeleteBook: (id: string) => void;
  onUpdateBook: (id: string, updates: Partial<Book>) => void;
}

const ManageBooks: React.FC<ManageBooksProps> = ({ books, categories, onAddBook, onDeleteBook, onUpdateBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isExtractingPreview, setIsExtractingPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    categoryId: categories[0]?.id || '',
    shelf: '',
    driveLink: '',
    description: '',
    coverImage: ''
  });

  const extractDriveId = (input: string) => {
    const match = input.match(/\/d\/(.+?)\/(view|preview)/) || input.match(/id=(.+?)(&|$)/);
    return match ? match[1] : input;
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.shelf.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtractingPreview(true);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);
        
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setFormData(prev => ({ ...prev, coverImage: dataUrl }));
        }
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({ ...prev, coverImage: event.target?.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error extracting preview:', error);
      alert('Gagal mengambil preview dari file tersebut. Pastikan koneksi internet stabil.');
    } finally {
      setIsExtractingPreview(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title) return alert('Isi judul buku terlebih dahulu');
    setIsGeneratingDescription(true);
    const catName = categories.find(c => c.id === formData.categoryId)?.name || 'Umum';
    const desc = await getBookDescription(formData.title, catName);
    setFormData(prev => ({ ...prev, description: desc || '' }));
    setIsGeneratingDescription(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      driveLink: extractDriveId(formData.driveLink)
    };
    if (editingId) {
      onUpdateBook(editingId, finalData);
    } else {
      onAddBook({ ...finalData, status: 'available' });
    }
    closeModal();
  };

  const openEdit = (book: Book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      categoryId: book.categoryId,
      shelf: book.shelf,
      driveLink: book.driveLink,
      description: book.description || '',
      coverImage: book.coverImage || ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', categoryId: categories[0]?.id || '', shelf: '', driveLink: '', description: '', coverImage: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari buku atau rak..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-red-100 transition-all outline-none"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-red-100 transition-all"
        >
          <Plus size={20} />
          Tambah Buku Baru
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Sampul</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Judul Buku</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Kategori</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700">Lokasi Rak</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 text-center">Bacaan</th>
                <th className="px-6 py-4 text-sm font-bold text-slate-700 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBooks.map(book => (
                <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img 
                        src={book.coverImage || `https://picsum.photos/seed/${book.id}/100/150`} 
                        className="w-full h-full object-cover" 
                        alt="cover" 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">{book.title}</p>
                    <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">{book.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-red-50 text-red-800 rounded-full text-xs font-semibold">
                      {categories.find(c => c.id === book.categoryId)?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{book.shelf}</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-500 font-medium">{book.viewCount}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEdit(book)}
                        className="p-2 text-slate-400 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteBook(book.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Buku' : 'Tambah Buku Baru'}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Preview Generation */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Cover / Preview Buku</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-[3/4] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-red-300 hover:bg-red-50 transition-all group relative overflow-hidden"
                    >
                      {isExtractingPreview ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="text-red-800 animate-spin" size={32} />
                          <p className="text-xs font-bold text-red-800">Mengekstrak Halaman...</p>
                        </div>
                      ) : formData.coverImage ? (
                        <>
                          <img src={formData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <p className="text-white text-xs font-bold flex items-center gap-2"><Upload size={14} /> Ganti File</p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-6">
                          <div className="bg-white p-4 rounded-2xl shadow-sm mb-4 inline-block text-slate-400 group-hover:text-red-800 transition-colors">
                            <Upload size={32} />
                          </div>
                          <p className="text-sm font-bold text-slate-600 mb-1">Upload PDF / Gambar</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Otomatis ambil sampul</p>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="application/pdf,image/*" 
                      onChange={handleFileChange} 
                    />
                  </div>
                </div>

                {/* Right Column: Form Data */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Buku</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
                      <select 
                        value={formData.categoryId}
                        onChange={e => setFormData(f => ({ ...f, categoryId: e.target.value }))}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 transition-all"
                      >
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Lokasi Rak</label>
                      <input
                        type="text"
                        placeholder="E.g. A1, B2"
                        value={formData.shelf}
                        onChange={e => setFormData(f => ({ ...f, shelf: e.target.value }))}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Google Drive Link / ID</label>
                      <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                          type="text"
                          required
                          placeholder="ID File atau Link Google Drive..."
                          value={formData.driveLink}
                          onChange={e => setFormData(f => ({ ...f, driveLink: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 transition-all"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">Sistem akan otomatis mengekstrak ID jika Anda memasukkan URL lengkap.</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
                        <button 
                          type="button"
                          onClick={handleGenerateAI}
                          disabled={isGeneratingDescription}
                          className="text-xs font-bold text-red-800 flex items-center gap-1 hover:text-red-950 disabled:opacity-50"
                        >
                          <Sparkles size={14} />
                          {isGeneratingDescription ? 'Menyusun...' : 'Generate AI'}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-red-100 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-4 font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-red-800 hover:bg-red-900 text-white font-bold rounded-2xl shadow-lg shadow-red-100 transition-all"
                >
                  {editingId ? 'Update Buku' : 'Simpan Buku'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;