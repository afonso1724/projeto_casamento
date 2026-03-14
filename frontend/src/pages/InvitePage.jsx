import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, supabaseInitError } from '../supabaseClient';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Heart } from 'lucide-react';

export default function InvitePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmingPresence, setConfirmingPresence] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(null);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] to-[#F8E8E3] flex items-center justify-center p-4">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-2xl border-4 border-[#E8D5CC] text-center">
          <h2 className="text-2xl font-serif font-bold text-[#5C3D2E] mb-3">
            Erro de configuração
          </h2>
          <p className="text-[#A8B4A8] mb-4">
            {supabaseInitError ||
              'Supabase não está configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no painel do Vercel.'}
          </p>
          <a
            href="/"
            className="inline-block bg-[#D4AF37] hover:bg-[#C9A961] text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            ← Voltar ao Início
          </a>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchInviteData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('convidados').select('*').eq('slug', slug).single();
        if (error || !data) {
          setError('Convite não encontrado. Verifique o código QR.');
          setInviteData(null);
        } else {
          setInviteData(data);
          setError(null);
        }
      } catch (err) {
        setError('Convite não encontrado. Verifique o código QR.');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchInviteData();
  }, [slug]);

  const handleConfirmPresence = async () => {
    setConfirmingPresence(true);
    try {
      // Usando o campo 'confirmado_presenca' conforme o seu banco
      const { error } = await supabase.from('convidados').update({ confirmado_presenca: true }).eq('slug', slug);
      if (error) throw error;
      
      setInviteData({ ...inviteData, confirmado_presenca: true });
      setConfirmationMessage({
        type: 'success',
        text: '✓ Presença confirmada com sucesso!',
      });
      setTimeout(() => setConfirmationMessage(null), 4000);
    } catch (err) {
      setConfirmationMessage({
        type: 'error',
        text: '✗ Erro ao confirmar presença',
      });
      setTimeout(() => setConfirmationMessage(null), 4000);
    } finally {
      setConfirmingPresence(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] to-[#F8E8E3] flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <Heart size={48} className="text-[#6B2C3E]" />
          </motion.div>
          <p className="text-[#5C3D2E] font-serif text-lg">
            Carregando seu convite...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] to-[#F8E8E3] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-4 border-[#E8D5CC]"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <AlertCircle size={64} className="text-red-500 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-serif font-bold text-[#5C3D2E] mb-3">
            Convite não encontrado
          </h2>
          <p className="text-[#A8B4A8] mb-6 text-lg">{error}</p>
          <p className="text-sm text-[#9DB4A8] mb-8">
            Verifique o código QR no seu convite impresso
          </p>
          <a
            href="/"
            className="inline-block bg-[#D4AF37] hover:bg-[#C9A961] text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            ← Voltar ao Início
          </a>
        </motion.div>
      </div>
    );
  }

  if (!inviteData) return null;

  // --- ALTERAÇÕES DE SEGURANÇA AQUI ---
  const name1 = inviteData?.coupleNames?.name1 || "Noivos";
  const name2 = inviteData?.coupleNames?.name2;
  const coupleNames = name2 ? `${name1} & ${name2}` : name1;
  
  const getWelcomeMessage = () => {
    const nome = inviteData?.nomeExibicao || "Convidado";
    return inviteData?.tipo === 'Casal' ? `Caro casal ${nome}` : `Caro ${nome}`;
  };

  // Verificando se já está confirmado (usando o campo do banco)
  const isAlreadyConfirmed = inviteData?.confirmado_presenca === true;
  // ------------------------------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-[#F8E8E3] to-[#E8D5CC] py-12 md:py-16 px-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-10 right-10 w-96 h-96 bg-[#D4AF37] rounded-full opacity-5 blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-[#6B2C3E] rounded-full opacity-5 blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-2xl mx-auto">
        {confirmationMessage && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className={`mb-6 p-4 rounded-lg font-bold text-center ${
              confirmationMessage.type === 'success'
                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}
          >
            {confirmationMessage.text}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#E8D5CC]"
        >
          <div className="bg-gradient-to-r from-[#6B2C3E] via-[#9DB4A8] to-[#D4AF37] h-56 md:h-72 relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-24 -top-24 w-48 h-48 border-2 border-[#D4AF37] rounded-full opacity-20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -left-32 -bottom-32 w-64 h-64 border-2 border-white rounded-full opacity-10"
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute top-6 md:top-8 left-1/2 transform -translate-x-1/2"
            >
              <Heart size={56} className="text-[#D4AF37] fill-[#D4AF37]" />
            </motion.div>
          </div>

          <div className="px-6 md:px-16 py-12 md:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <p className="font-serif text-[#6B2C3E] text-sm md:text-base uppercase tracking-widest mb-3">
                Somos Honrados em Convidá-lo
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#5C3D2E] leading-tight mb-4">
                {getWelcomeMessage()}
              </h1>
              <p className="font-serif text-lg md:text-2xl text-[#6B2C3E] italic">
                para celebrar o amor que une nossas vidas
              </p>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-32 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-8 md:mb-12"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-12 md:mb-16"
            >
              <p className="font-serif text-[#A8B4A8] text-sm md:text-base uppercase tracking-widest mb-2">
                O Casal
              </p>
              <p className="font-serif text-3xl md:text-4xl font-bold text-[#5C3D2E]">
                {coupleNames}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-[#FAF9F6] to-[#F8E8E3] p-6 md:p-8 rounded-2xl border-2 border-[#E8D5CC] mb-8 md:mb-12"
            >
              <p className="text-sm text-[#9DB4A8] uppercase tracking-wider mb-2 font-serif">
                Seu Convite
              </p>
              <p className="text-2xl md:text-3xl font-serif font-bold text-[#5C3D2E] mb-2">
                {inviteData?.nomeExibicao}
              </p>
              <p className="text-[#A8B4A8] font-serif">
                Tipo: {inviteData?.tipo} • Código: {slug}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              {!isAlreadyConfirmed ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmPresence}
                  disabled={confirmingPresence}
                  className="w-full bg-gradient-to-r from-[#6B2C3E] to-[#9DB4A8] hover:from-[#5C3D2E] hover:to-[#8AA8A0] text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={24} />
                  {confirmingPresence ? 'Confirmando...' : 'Confirmar Presença'}
                </motion.button>
              ) : (
                <div className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold py-4 px-8 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-lg">
                  <CheckCircle2 size={24} />
                  Presença Confirmada
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/agenda/${slug}`)}
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C9A961] hover:from-[#C9A961] hover:to-[#B89A2F] text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all hover:shadow-xl flex items-center justify-center gap-2"
              >
                Ver Agenda do Evento
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className={`p-4 md:p-5 rounded-xl font-bold text-center border-2 ${
                isAlreadyConfirmed
                  ? 'bg-green-50 text-green-800 border-green-300'
                  : 'bg-orange-50 text-orange-800 border-orange-300'
              }`}
            >
              <span className="flex items-center justify-center gap-2 font-serif">
                {isAlreadyConfirmed ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {isAlreadyConfirmed ? 'Sua presença está confirmada' : 'Por favor, confirme sua presença'}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-[#6B2C3E] to-[#5C3D2E] px-6 md:px-16 py-6 text-center border-t-4 border-[#D4AF37]"
          >
            <p className="text-[#E8D5CC] font-serif text-sm md:text-base">
              "O amor é a maior celebração da vida. Que este momento seja especial para todos nós."
            </p>
            <p className="text-[#9DB4A8] text-xs mt-3">
              Sistema de Experiência de entrada de casamento - SynerTech &copy; 2026
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}