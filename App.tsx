import React, { useState, useEffect } from 'react';
import { User, Book, Student, Category, UserRole, AppState, ActivityLog } from './types.ts';
import { INITIAL_BOOKS, INITIAL_CATEGORIES } from './constants.tsx';
import Login from './views/Login.tsx';
import Layout from './components/Layout.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import ManageBooks from './views/ManageBooks.tsx';
import ManageStudents from './views/ManageStudents.tsx';
import StudentDashboard from './views/StudentDashboard.tsx';
import BookReader from './views/BookReader.tsx';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('smartlib_state_v3');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Gagal memuat state dari localStorage", e);
    }

    const generatedStudents: Student[] = Array.from({ length: 919 }, (_, i) => {
      const nis = (i + 1).toString().padStart(3, '0');
      return {
        id: `std-${nis}`,
        username: nis,
        name: `Siswa ${nis}`
      };
    });

    return {
      books: INITIAL_BOOKS,
      students: generatedStudents,
      categories: INITIAL_CATEGORIES,
      activityLogs: []
    };
  });

  useEffect(() => {
    localStorage.setItem('smartlib_state_v3', JSON.stringify(state));
  }, [state]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab(user.role === UserRole.ADMIN ? 'dashboard' : 'catalog');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedBook(null);
    setActiveTab('dashboard');
  };

  const addBook = (bookData: Omit<Book, 'id' | 'viewCount'>) => {
    const newBook: Book = { ...bookData, id: `book-${Date.now()}`, viewCount: 0 };
    setState(prev => ({ ...prev, books: [...prev.books, newBook] }));
  };

  const deleteBook = (id: string) => {
    setState(prev => ({ ...prev, books: prev.books.filter(b => b.id !== id) }));
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setState(prev => ({
      ...prev,
      books: prev.books.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const addStudent = (name: string, username: string) => {
    const newStudent: Student = { id: `std-${username}-${Date.now()}`, username, name };
    setState(prev => ({ ...prev, students: [newStudent, ...prev.students] }));
  };

  const updateStudent = (id: string, name: string) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === id ? { ...s, name } : s)
    }));
  };

  const deleteStudent = (id: string) => {
    setState(prev => ({ ...prev, students: prev.students.filter(s => s.id !== id) }));
  };

  const logActivity = (book: Book) => {
    if (!currentUser) return;
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      bookId: book.id,
      bookTitle: book.title,
      timestamp: new Date().toISOString()
    };
    setState(prev => ({ ...prev, activityLogs: [newLog, ...prev.activityLogs] }));
  };

  const openReader = (book: Book) => {
    updateBook(book.id, { viewCount: book.viewCount + 1 });
    logActivity(book);
    setSelectedBook(book);
    setActiveTab('reading-mode');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      user={currentUser} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {currentUser.role === UserRole.ADMIN && (
        <>
          {activeTab === 'dashboard' && (
            <AdminDashboard 
              books={state.books} 
              students={state.students} 
              categories={state.categories}
              logs={state.activityLogs}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'books' && (
            <ManageBooks 
              books={state.books} 
              categories={state.categories} 
              onAddBook={addBook}
              onDeleteBook={deleteBook}
              onUpdateBook={updateBook}
            />
          )}
          {activeTab === 'students' && (
            <ManageStudents 
              students={state.students}
              onAddStudent={addStudent}
              onUpdateStudent={updateStudent}
              onDeleteStudent={deleteStudent}
            />
          )}
        </>
      )}

      {currentUser.role === UserRole.STUDENT && (
        <>
          {activeTab === 'catalog' && (
            <StudentDashboard 
              books={state.books} 
              categories={state.categories} 
              onReadBook={openReader}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'reading' && (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-slate-800">Rak Saya</h3>
              <p className="text-slate-500 mb-8">Koleksi buku yang baru saja kamu baca.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                {state.activityLogs
                  .filter(l => l.studentId === currentUser.id)
                  .map(log => {
                    const book = state.books.find(b => b.id === log.bookId);
                    if (!book) return null;
                    return (
                       <div key={log.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                          <div className="w-16 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0">
                            <img src={book.coverImage || `https://picsum.photos/seed/${book.id}/100/150`} alt="cover" className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="font-bold text-slate-800 truncate">{book.title}</p>
                            <p className="text-xs text-red-800 font-medium mb-2">{state.categories.find(c => c.id === book.categoryId)?.name}</p>
                            <button 
                              onClick={() => openReader(book)}
                              className="text-xs font-bold px-4 py-1.5 bg-slate-900 text-white rounded-full transition-all hover:bg-slate-700"
                            >
                              Buka Lagi
                            </button>
                          </div>
                       </div>
                    );
                  })}
              </div>
            </div>
          )}
          {activeTab === 'reading-mode' && selectedBook && (
            <BookReader book={selectedBook} onBack={() => setActiveTab('catalog')} />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;