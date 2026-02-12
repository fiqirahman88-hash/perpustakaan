
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('%c SmartLib Digital %c Berjalan ', 'background:#4f46e5; color:white; font-weight:bold; border-radius:4px 0 0 4px; padding:2px 8px;', 'background:#10b981; color:white; border-radius:0 4px 4px 0; padding:2px 8px;');
  } catch (err: any) {
    console.error('Mounting Error:', err);
    // Jika render gagal, tampilkan pesan error yang user-friendly
    container.innerHTML = `
      <div style="padding:40px; text-align:center; font-family:sans-serif; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f8fafc;">
        <div style="background:white; padding:32px; border-radius:24px; box-shadow:0 10px 15px -3px rgba(0,0,0,0.1); max-width:400px; border:1px solid #e2e8f0;">
          <h2 style="color:#1e293b; font-size:20px; font-weight:800; margin-bottom:12px;">Kesalahan Aplikasi</h2>
          <p style="color:#64748b; font-size:14px; margin-bottom:24px;">Terjadi kesalahan saat membangun antarmuka pengguna. Mohon coba segarkan halaman.</p>
          <button onclick="location.reload()" style="padding:14px 32px; background:#4f46e5; color:white; border:none; border-radius:14px; font-weight:700; cursor:pointer; width:100%;">Coba Lagi</button>
        </div>
      </div>
    `;
  }
};

// Menangani kondisi jika DOM mungkin sudah siap sebelum script selesai dimuat
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp();
} else {
  document.addEventListener('DOMContentLoaded', mountApp);
}
