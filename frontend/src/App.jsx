import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Settings } from 'lucide-react';
import InvitePage from './pages/InvitePage';
import AgendaPage from './pages/AgendaPage';
import AdminPage from './pages/AdminPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/convite/:slug" element={<InvitePage />} />
        <Route path="/agenda/:slug" element={<AgendaPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-8">
          <svg
            className="w-32 h-32 text-luxury-gold mx-auto"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
        </div>
        <h1 className="text-slate-900 text-5xl mb-6 font-serif font-bold">
          Wedding Entry<br />Experience
        </h1>
        <p className="text-xl text-slate-600 mb-8 font-serif">
          Sistema de Convites Digitais com QR Code
        </p>
        <div className="space-y-4 max-w-xl mx-auto">
          <p className="text-lg text-gray-600">
            Escaneie o código QR do seu convite para visualizar os detalhes do evento
          </p>
          <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border-2 border-luxury-gold">
            <p className="text-sm text-gray-600 mb-4 font-serif">
              <strong className="text-luxury-gold">Para Convidados:</strong><br />
              Escaneie o QR Code da seu convite impresso
            </p>
            <p className="text-sm text-gray-600 pb-4 border-b border-gray-300 font-serif">
              <strong className="text-luxury-gold">Para Administrador:</strong><br />
              Acesse o painel de gerenciamento privado
            </p>
            <a
              href="/admin"
              className="inline-flex mt-4 bg-luxury-gold text-slate-900 px-6 py-2 rounded-lg font-bold hover:scale-105 transition-all items-center gap-2 justify-center"
            >
              <Settings size={18} />
              Painel Admin
            </a>
          </div>
          <p className="text-sm text-gray-500 mt-8">
            Sistema WEE - Wedding Entry Experience 2026 💎
          </p>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-white p-12 rounded-xl shadow-lg border-2 border-luxury-gold">
        <svg
          className="w-24 h-24 text-red-500 mx-auto mb-6"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">
          404 - Página não encontrada
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          Desculpe, a página que você está procurando não existe.
        </p>
        <a
          href="/"
          className="inline-block bg-luxury-gold text-slate-900 px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all"
        >
          ← Voltar ao Início
        </a>
      </div>
    </div>
  );
}

export default App;

