import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Heart } from 'lucide-react';

export default function AgendaPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInviteData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/convite/${slug}`);
        
        if (response.data.success) {
          setInviteData(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || 'Erro ao carregar agenda');
        }
      } catch (err) {
        console.error('Erro ao buscar agenda:', err);
        setError('Agenda não encontrada.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchInviteData();
    }
  }, [slug]);

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
            Carregando agenda...
          </p>
        </div>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] to-[#F8E8E3] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md bg-white p-8 md:p-12 rounded-2xl shadow-2xl border-4 border-[#E8D5CC]"
        >
          <h2 className="text-3xl font-serif font-bold text-[#5C3D2E] mb-3">
            Agenda não encontrada
          </h2>
          <p className="text-[#A8B4A8] mb-8 text-lg">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#C9A961] text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105"
          >
            <ArrowLeft size={20} />
            Voltar
          </button>
        </motion.div>
      </div>
    );
  }

  const coupleNames = `${inviteData.coupleNames.name1}${inviteData.coupleNames.name2 ? ` & ${inviteData.coupleNames.name2}` : ''}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-[#F8E8E3] to-[#E8D5CC] py-12 px-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-20 right-10 w-80 h-80 bg-[#D4AF37] rounded-full opacity-5 blur-3xl"
          animate={{ y: [0, 40, 0], x: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-[#6B2C3E] rounded-full opacity-5 blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Voltar Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B2C3E] hover:text-[#C9A961] font-serif font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar ao Convite
        </motion.button>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#E8D5CC] mb-8"
        >
          {/* Top Gradient */}
          <div className="bg-gradient-to-r from-[#6B2C3E] via-[#9DB4A8] to-[#D4AF37] h-40 relative overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-20 -top-20 w-40 h-40 border-2 border-[#D4AF37] rounded-full opacity-20"
            />
          </div>

          {/* Content */}
          <div className="px-6 md:px-12 py-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-4xl md:text-5xl font-bold text-[#6B2C3E] mb-2"
            >
              Agenda do Evento
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[#A8B4A8] font-serif text-lg"
            >
              {coupleNames}
            </motion.p>
          </div>
        </motion.div>

        {/* Event Info Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {/* Data */}
          <motion.div
            whileHover={{ translateY: -4 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-4 border-[#E8D5CC]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#E8D5CC] p-3 rounded-lg">
                <Heart size={24} className="text-[#6B2C3E]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#6B2C3E]">Data do Evento</h3>
            </div>
            <p className="text-2xl font-serif font-bold text-[#5C3D2E]">
              {new Date(inviteData.eventDetails.date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </motion.div>

          {/* Local */}
          <motion.div
            whileHover={{ translateY: -4 }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-4 border-[#E8D5CC]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#E8D5CC] p-3 rounded-lg">
                <MapPin size={24} className="text-[#6B2C3E]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#6B2C3E]">Local</h3>
            </div>
            <p className="text-2xl font-serif font-bold text-[#5C3D2E]">
              {inviteData.eventDetails.location}
            </p>
          </motion.div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-[#E8D5CC]"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#6B2C3E] mb-12 text-center">
            Cronograma
          </h2>

          <div className="space-y-6">
            {inviteData.eventDetails.timeline.map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                whileHover={{ translateX: 8 }}
                className="group"
              >
                <div className="flex items-start gap-6 md:gap-8">
                  {/* Timeline Dot e Linha */}
                  <div className="flex flex-col items-center pt-1">
                    <div className="w-6 h-6 bg-[#D4AF37] rounded-full ring-4 ring-[#FAF9F6] shadow-lg group-hover:ring-[#E8D5CC] transition-all" />
                    {idx < inviteData.eventDetails.timeline.length - 1 && (
                      <div className="w-1 h-16 bg-gradient-to-b from-[#D4AF37] to-[#E8D5CC] mt-2" />
                    )}
                  </div>

                  {/* Conteúdo do Evento */}
                  <div className="flex-1 py-2">
                    <div className="bg-gradient-to-r from-[#FAF9F6] to-[#F8E8E3] p-6 rounded-2xl border-l-4 border-[#D4AF37] hover:shadow-lg transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={18} className="text-[#D4AF37]" />
                        <span className="font-serif text-xl font-bold text-[#6B2C3E]">
                          {event.time}
                        </span>
                      </div>
                      <p className="text-lg text-[#5C3D2E] font-serif">
                        {event.event}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <p className="text-[#6B2C3E] font-serif text-lg">
            Esperamos você em cada momento especial deste dia! 💕
          </p>
        </motion.div>
      </div>
    </div>
  );
}
