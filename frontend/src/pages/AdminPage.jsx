import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, supabaseInitError } from '../supabaseClient';
import QRCode from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users, Plus, BarChart3, Search, Eye, Trash2, Download, CheckCircle2, Circle, Gift } from 'lucide-react';

const FRONTEND_URL = 'https://projeto_casamento.vercel.app';

export default function AdminPage() {
  const [currentView, setCurrentView] = useState('cadastro');
  const [formData, setFormData] = useState({ nomeExibicao: '', tipo: 'Individual' });
  const [convidados, setConvidados] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastCreatedSlug, setLastCreatedSlug] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQrSlug, setSelectedQrSlug] = useState(null);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-stone-50">
        <div className="max-w-xl bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Erro de configuração do Supabase</h1>
          <p className="text-sm text-gray-600 mb-4">
            {supabaseInitError ||
              'Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel do Vercel.'}
          </p>
          <p className="text-xs text-gray-400">
            No ambiente de produção, configure as variáveis de ambiente no painel do Vercel.
          </p>
        </div>
      </div>
    );
  }

  // Buscar todos os convidados
const fetchConvidados = async () => {
  setLoading(true);
  try {
    // Usamos select('*') para trazer todas as colunas, incluindo nomeExibicao
    const { data, error } = await supabase
      .from('convidados')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    
    setConvidados(data || []);
    // Removi o setMessage de sucesso aqui para não ficar aparecendo toda vez que a lista atualiza
  } catch (error) {
    setMessage({ type: 'error', text: `Erro ao carregar convidados: ${error.message}` });
  }
  setLoading(false);
};

// Buscar convidados por termo (CORRIGIDO PARA nomeExibicao)
const handleSearch = async (e) => {
  const q = e.target.value;
  setSearchTerm(q);

  if (q.length < 2) {
    fetchConvidados();
    return;
  }

  try {
    const { data, error } = await supabase
      .from('convidados')
      .select('*')
      // ALTERADO: de 'nome_exibicao' para 'nomeExibicao'
      .ilike('nomeExibicao', `%${q}%`); 

    if (error) throw error;
    setConvidados(data);
  } catch (error) {
    console.error("Erro na busca:", error);
    setMessage({ type: 'error', text: 'Erro na busca' });
  }
};

  // Buscar estatísticas
  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('convidados').select('*');
      if (error) throw error;
      const totalConvidados = data.length;
      const confirmados = data.filter((c) => c.confirmado_presenca).length;
      const porTipo = data.reduce((acc, c) => {
        acc[c.tipo] = (acc[c.tipo] || 0) + 1;
        return acc;
      }, {});
      setStats({ totalConvidados, confirmados, porTipo });
    } catch (error) {
      setStats(null);
    }
    setLoading(false);
  };

  // 3. Criar novo convidado (CORRIGIDO: Coluna nomeExibicao + Tradução de Tipo)
const handleCreateGuest = async (e) => {
  e.preventDefault();
  if (!formData.nomeExibicao.trim()) {
    setMessage({ type: 'error', text: 'Nome é obrigatório' });
    return;
  }

  setLoading(true);
  
  // Gerar SLUG único
  const novoSlug = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Mapeamento para satisfazer a Constraint do Banco (individual/casal em minúsculo)
  const tipoParaBanco = formData.tipo === 'Pessoa Individual' ? 'individual' : 'casal';

  try {
    const { data, error } = await supabase
      .from('convidados')
      .insert([
        { 
          nomeExibicao: formData.nomeExibicao, 
          tipo: tipoParaBanco, // Enviando o valor aceito pelo ARRAY['individual', 'casal']
          slug: novoSlug 
        }
      ])
      .select()
      .single();

    if (error) throw error;

    setMessage({ type: 'success', text: 'Convidado criado com sucesso!' });
    setLastCreatedSlug(data.slug);
    
    // Limpar formulário voltando ao estado inicial visual
    setFormData({ nomeExibicao: '', tipo: 'Pessoa Individual' });
    
    // Atualizar interface
    if (currentView === 'lista') fetchConvidados();
    fetchStats();
    fecharMensagem();

  } catch (error) {
    console.error("Erro detalhado:", error);
    setMessage({ type: 'error', text: error.message });
  } finally {
    setLoading(false);
  }
};
  // Deletar convidado
  const handleDeleteGuest = async (id) => {
    if (confirm('Tem certeza que deseja deletar este convidado?')) {
      try {
        await axios.delete(`${API_URL}/admin/convidados/${id}`, {
          headers: { 'x-admin-token': ADMIN_TOKEN },
        });
        setMessage({ type: 'success', text: 'Convidado deletado com sucesso' });
        fetchConvidados();
        fetchStats();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao deletar convidado' });
      }
    }
  };

  /*Buscar convidados por termo
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchTerm(q);
    if (q.length < 2) {
      fetchConvidados();
      return;
    }
    try {
      const { data, error } = await supabase.from('convidados').select('*').ilike('nome_exibicao', `%${q}%`);
      if (error) throw error;
      setConvidados(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro na busca' });
    }
  };*/

  useEffect(() => {
    // Carregar dados apenas quando as abas forem ativadas
    if (currentView === 'lista') {
      fetchConvidados();
    } else if (currentView === 'stats') {
      fetchStats();
    }
  }, [currentView]);

  return (
    <div className="flex h-screen bg-stone-50">
      {/* SIDEBAR - Desktop */}
      <aside className="hidden md:block w-64 h-screen bg-gradient-to-b from-rose-950 via-slate-900 to-slate-800 text-white p-6 shadow-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Gift size={28} className="text-rose-400" />
            <h1 className="text-2xl font-serif font-bold text-rose-300">Casal Kela Admin</h1>
          </div>
          <p className="text-xs text-gray-400 ml-10">Experiência de entrada de casamento</p>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'cadastro', label: 'Novo Convidado', icon: Plus },
            { id: 'lista', label: 'Lista de Convidados', icon: Users },
            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
          ].map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                  currentView === item.id
                    ? 'bg-rose-500 text-white font-bold shadow-lg'
                    : 'hover:bg-slate-700 text-gray-100'
                }`}
              >
                <IconComponent size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <hr className="my-6 border-slate-700" />

        <div className="bg-slate-700/50 p-4 rounded-lg text-sm border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-400" />
            <p className="text-gray-300">Status: Conectado</p>
          </div>
          <p className="text-xs text-gray-400 ml-6">Token ativo</p>
        </div>
      </aside>

      {/* SIDEBAR - Mobile (animated) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            />
            <motion.aside
              key="mobile-sidebar"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed md:hidden top-0 left-0 h-screen w-64 bg-gradient-to-b from-rose-950 via-slate-900 to-slate-800 text-white p-6 shadow-2xl z-50"
            >
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <Gift size={28} className="text-rose-400" />
                <h1 className="text-2xl font-serif font-bold text-rose-300">WEE Admin</h1>
              </div>
              <p className="text-xs text-gray-400 ml-10">Wedding Entry Experience</p>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'cadastro', label: 'Novo Convidado', icon: Plus },
                { id: 'lista', label: 'Lista de Convidados', icon: Users },
                { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      currentView === item.id
                        ? 'bg-rose-500 text-white font-bold shadow-lg'
                        : 'hover:bg-slate-700 text-gray-100'
                    }`}
                  >
                    <IconComponent size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <hr className="my-6 border-slate-700" />

            <div className="bg-slate-700/50 p-4 rounded-lg text-sm border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-green-400" />
                <p className="text-gray-300">Status: Conectado</p>
              </div>
              <p className="text-xs text-gray-400 ml-6">Token ativo</p>
            </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* TOP BAR */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-slate-900" />
          </button>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-slate-900">
            {currentView === 'cadastro' && 'Novo Convidado'}
            {currentView === 'lista' && 'Lista de Convidados'}
            {currentView === 'stats' && 'Estatísticas do Evento'}
          </h2>
          <div className="w-10" /> {/* spacer for centering */}
        </div>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Message Alert */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className={`mb-6 p-4 rounded-lg border-l-4 ${
                  message.type === 'success'
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-red-50 border-red-500 text-red-800'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEÇÃO: CADASTRO */}
          <AnimatePresence mode="wait">
            {currentView === 'cadastro' && (
              <motion.div
                key="cadastro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* FORMULÁRIO */}
                  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-rose-200">
                    <div className="flex items-center gap-2 mb-6">
                      <Plus size={28} className="text-rose-500" />
                      <h3 className="text-2xl font-serif font-bold text-slate-900">
                        Formulário de Cadastro
                      </h3>
                    </div>

                    <form onSubmit={handleCreateGuest} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Nome ou Casal
                        </label>
                        <input
                          type="text"
                          value={formData.nomeExibicao}
                          onChange={(e) =>
                            setFormData({ ...formData, nomeExibicao: e.target.value })
                          }
                          placeholder="Ex: João Silva ou Maria & Pedro"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">
                          Tipo de Convite
                        </label>
                        <select
                          value={formData.tipo}
                          onChange={(e) =>
                            setFormData({ ...formData, tipo: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500 transition-colors"
                        >
                          <option value="Individual">Pessoa Individual</option>
                          <option value="Casal">Casal</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        {loading ? 'Criando...' : 'Criar Convidado'}
                      </button>
                    </form>
                  </div>

                  {/* QR CODE */}
                  {lastCreatedSlug && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-rose-200 text-center flex flex-col items-center justify-center"
                    >
                      <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6">
                        QR Code Gerado
                      </h3>
                      <div className="bg-stone-50 p-4 rounded-lg mb-6 border border-gray-200">
                        <QRCode
                          value={`${FRONTEND_URL}/convite/${lastCreatedSlug}`}
                          size={256}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Slug: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{lastCreatedSlug}</code>
                      </p>
                      <p className="text-xs text-gray-500 mb-6 break-all">
                        {FRONTEND_URL}/convite/{lastCreatedSlug}
                      </p>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          const canvas = document.querySelector('canvas');
                          link.href = canvas.toDataURL();
                          link.download = `qrcode-${lastCreatedSlug}.png`;
                          link.click();
                        }}
                        className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                      >
                        <Download size={18} />
                        Baixar QR Code
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEÇÃO: LISTA DE CONVIDADOS */}
          <AnimatePresence mode="wait">
            {currentView === 'lista' && (
              <motion.div
                key="lista"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      placeholder="Buscar convidado por nome..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-bold">Nome</th>
                        <th className="px-6 py-4 text-left font-bold">Tipo</th>
                        <th className="px-6 py-4 text-left font-bold">Slug</th>
                        <th className="px-6 py-4 text-center font-bold">Confirmado</th>
                        <th className="px-6 py-4 text-center font-bold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {convidados.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                            Nenhum convidado encontrado
                          </td>
                        </tr>
                      ) : (
                        convidados.map((guest) => (
                          <tr key={guest.id} className="border-b hover:bg-stone-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">
                              {guest.nomeExibicao}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1 ${
                                  guest.tipo === 'Casal'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {guest.tipo === 'Casal' ? (
                                  <Users size={14} />
                                ) : (
                                  <Users size={14} />
                                )}
                                {guest.tipo}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm text-gray-700">
                              {guest.slug}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {guest.confirmadoPresenca ? (
                                <div className="flex items-center justify-center gap-1 text-green-600">
                                  <CheckCircle2 size={18} />
                                  <span className="font-bold">Sim</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-1 text-gray-400">
                                  <Circle size={18} />
                                  <span>Não</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button
                                onClick={() => setSelectedQrSlug(guest.slug)}
                                className="text-green-600 hover:text-green-800 font-bold p-1 hover:bg-green-50 rounded transition-colors inline-flex gap-1 items-center"
                                title="Baixar QR Code"
                              >
                                <Download size={16} />
                                QR
                              </button>
                              <button
                                onClick={() => {
                                  const url = `${FRONTEND_URL}/convite/${guest.slug}`;
                                  window.open(url, '_blank');
                                }}
                                className="text-blue-600 hover:text-blue-800 font-bold p-1 hover:bg-blue-50 rounded transition-colors inline-flex gap-1 items-center"
                                title="Ver convite"
                              >
                                <Eye size={16} />
                                Ver
                              </button>
                              <button
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="text-red-600 hover:text-red-800 font-bold p-1 hover:bg-red-50 rounded transition-colors inline-flex gap-1 items-center"
                                title="Deletar convidado"
                              >
                                <Trash2 size={16} />
                                Deletar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {convidados.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center text-gray-500 border border-gray-200">
                      Nenhum convidado encontrado
                    </div>
                  ) : (
                    convidados.map((guest) => (
                      <motion.div
                        key={guest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-lg p-4 border border-gray-200 shadow-md"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-slate-900">{guest.nomeExibicao}</h3>
                              <p className="text-xs text-gray-600 font-mono mt-1">{guest.slug}</p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold ${
                                guest.tipo === 'Casal'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {guest.tipo}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600 text-xs">Confirmado</p>
                              {guest.confirmadoPresenca ? (
                                <p className="font-bold text-green-600 flex items-center gap-1">
                                  <CheckCircle2 size={14} /> Sim
                                </p>
                              ) : (
                                <p className="text-gray-400 flex items-center gap-1">
                                  <Circle size={14} /> Não
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t">
                            <button
                              onClick={() => setSelectedQrSlug(guest.slug)}
                              className="flex-1 text-green-600 hover:bg-green-50 font-bold py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                            >
                              <Download size={16} />
                              QR
                            </button>
                            <button
                              onClick={() => {
                                const url = `${FRONTEND_URL}/convite/${guest.slug}`;
                                window.open(url, '_blank');
                              }}
                              className="flex-1 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                            >
                              <Eye size={16} />
                              Ver
                            </button>
                            <button
                              onClick={() => handleDeleteGuest(guest.id)}
                              className="flex-1 text-red-600 hover:bg-red-50 font-bold py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                            >
                              <Trash2 size={16} />
                              Deletar
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEÇÃO: ESTATÍSTICAS */}
          <AnimatePresence mode="wait">
            {currentView === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {stats ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {[
                      {
                        label: 'Total de Convidados',
                        value: stats.totalConvidados,
                        icon: Users,
                        color: 'from-blue-500 to-blue-600',
                        bgColor: 'bg-blue-50',
                      },
                      {
                        label: 'Confirmados',
                        value: stats.confirmados,
                        icon: CheckCircle2,
                        color: 'from-green-500 to-green-600',
                        bgColor: 'bg-green-50',
                      },
                      {
                        label: 'Casais',
                        value: stats.porTipo.Casal || 0,
                        icon: Gift,
                        color: 'from-rose-500 to-rose-600',
                        bgColor: 'bg-rose-50',
                      },
                    ].map((stat, idx) => {
                      const IconComp = stat.icon;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05, translateY: -5 }}
                          className={`${stat.bgColor} rounded-xl shadow-lg p-6 border-2 border-gray-200 transition-all`}
                        >
                          <div className={`inline-block p-3 bg-gradient-to-r ${stat.color} rounded-lg text-white mb-4`}>
                            <IconComp size={24} />
                          </div>
                          <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                          <p className="text-4xl font-bold text-slate-900 mt-2">{stat.value}</p>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin">
                      <BarChart3 size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 mt-4">Carregando estatísticas...</p>
                  </div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {/* QR CODE MODAL */}
          <AnimatePresence>
            {selectedQrSlug && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedQrSlug(null)}
                  className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
                />
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                >
                  <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center pointer-events-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-serif font-bold text-slate-900">
                        QR Code
                      </h3>
                      <button
                        onClick={() => setSelectedQrSlug(null)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-lg mb-6 border border-gray-200 flex justify-center">
                      <QRCode
                        value={`${FRONTEND_URL}/convite/${selectedQrSlug}`}
                        size={256}
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Slug: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{selectedQrSlug}</code>
                    </p>

                    <button
                      onClick={() => {
                        const canvas = document.querySelector('[data-slug="' + selectedQrSlug + '"]')?.parentElement?.querySelector('canvas');
                        if (!canvas) {
                          const link = document.createElement('a');
                          const tempCanvas = document.querySelector('canvas');
                          if (tempCanvas) {
                            link.href = tempCanvas.toDataURL();
                            link.download = `qrcode-${selectedQrSlug}.png`;
                            link.click();
                          }
                        }
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Baixar o QR Code
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
