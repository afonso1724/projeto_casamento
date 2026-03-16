import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Heart, Navigation } from 'lucide-react';
import { supabase } from '../supabaseClient'; 

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
        const { data, error: supabaseError } = await supabase
          .from('convidados')
          .select('*')
          .eq('slug', slug)
          .single();

        if (supabaseError) throw supabaseError;

        if (data) {
          setInviteData({
            coupleNames: {
              name1: data.nome_noivo || "Afonso", 
              name2: data.nome_noiva || "Daniela"
            },
            eventDetails: {
              // Informações Reais solicitadas
              date: "2026-05-23", 
              location: "Salão de Festas - Luanda, Angola",
              googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Luanda+Angola",
              timeline: [
                { time: "15:30", event: "Chegada dos Convidados" },
                { time: "16:00", event: "Início da Cerimónia" },
                { time: "17:30", event: "Sessão de Fotos e Cocktail" },
                { time: "19:00", event: "Jantar de Gala" },
                { time: "21:00", event: "Corte do Bolo" },
                { time: "22:00", event: "Início da Festa / DJ" }
              ]
            }
          });
        }
      } catch (err) {
        console.error('Erro:', err);
        setError('Não conseguimos carregar os detalhes da agenda.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchInviteData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4">
        <Heart size={48} className="text-[#6B2C3E] animate-pulse" />
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 text-center">
        <p className="text-[#6B2C3E] font-serif text-xl">{error}</p>
      </div>
    );
  }

  const coupleNames = `${inviteData.coupleNames.name1} & ${inviteData.coupleNames.name2}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F6] via-[#F8E8E3] to-[#E8D5CC] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#6B2C3E] font-bold mb-8 hover:opacity-70 transition-all"
        >
          <ArrowLeft size={20} /> Voltar ao Convite
        </button>

        {/* Card Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#E8D5CC] mb-8"
        >
          <div className="bg-[#6B2C3E] py-12 text-center px-6">
            <h1 className="font-serif text-4xl text-white font-bold mb-2">Agenda do Evento</h1>
            <p className="text-[#D4AF37] font-serif text-xl uppercase tracking-widest">{coupleNames}</p>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data */}
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border-2 border-[#E8D5CC]">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-[#6B2C3E]" size={24} />
                <span className="font-bold text-[#6B2C3E]">Data</span>
              </div>
              <p className="text-xl font-serif text-[#5C3D2E]">Sábado, 23 de Maio de 2026</p>
            </div>

            {/* Local com Botão de Mapa */}
            <div className="bg-[#FAF9F6] p-6 rounded-2xl border-2 border-[#E8D5CC]">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="text-[#6B2C3E]" size={24} />
                <span className="font-bold text-[#6B2C3E]">Localização</span>
              </div>
              <p className="text-lg font-serif text-[#5C3D2E] mb-4">{inviteData.eventDetails.location}</p>
              <a 
                href={inviteData.eventDetails.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#C9A961] transition-colors"
              >
                <Navigation size={16} /> Abrir GPS
              </a>
            </div>
          </div>
        </motion.div>

        {/* Cronograma Estilizado */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-[#E8D5CC]"
        >
          <h2 className="font-serif text-3xl font-bold text-[#6B2C3E] mb-10 text-center">Cronograma</h2>
          
          <div className="relative border-l-4 border-[#D4AF37] ml-4 space-y-12">
            {inviteData.eventDetails.timeline.map((item, idx) => (
              <div key={idx} className="relative ml-8">
                {/* O círculo na linha do tempo */}
                <div className="absolute -left-[44px] top-1 w-6 h-6 bg-[#D4AF37] rounded-full border-4 border-white shadow-md" />
                
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <span className="text-[#6B2C3E] font-bold text-xl font-serif min-w-[80px]">
                    {item.time}
                  </span>
                  <div className="bg-[#FAF9F6] p-4 rounded-xl flex-1 shadow-sm border border-[#E8D5CC]">
                    <p className="text-[#5C3D2E] font-medium text-lg">{item.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <footer className="mt-12 text-center text-[#6B2C3E] font-serif italic">
          <p>Prepare o seu melhor sorriso, esperamos por si!</p>
        </footer>
      </div>
    </div>
  );
}