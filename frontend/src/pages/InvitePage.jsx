import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const CONSELHOS = [
  'Traga sapatos confortáveis',
  'Prepare o coração',
  'Não esqueça o sorriso',
  'Chegue com antecedência',
  'Divirta-se ao máximo',
  'Capture momentos inesquecíveis',
  'Celebre o amor acima de tudo',
];

const JOURNEY_CARDS = [
  {
    title: 'Nosso Primeiro Encontro',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1465301046430-c52cc00e626d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop',
    ]
  },
  {
    title: 'O Pedido de Casamento',
    images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=400&fit=crop',
    ]
  },
  {
    title: 'Preparativos do Grande Dia',
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    ]
  },
  {
    title: 'Momentos de Alegria',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1465301046430-c52cc00e626d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    ]
  },
];

export default function InvitePage() {
  const { slug: routeSlug } = useParams();
  const navigate = useNavigate();
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [journeyIndices, setJourneyIndices] = useState([0, 0, 0, 0]);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const fetchInviteData = async () => {
      try {
        setLoading(true);

        const searchParams = new URLSearchParams(window.location.search);
        const qrSlug = searchParams.get('qr') || searchParams.get('codigo') || routeSlug;

        if (!qrSlug) {
          setInviteData({ nomeExibicao: 'Convidado', tipo: 'Individual' });
          setError(null);
          return;
        }

        const { data, error } = await supabase
          .from('convidados')
          .select('*')
          .eq('slug', qrSlug)
          .single();

        if (error || !data) {
          setError('Convite não encontrado');
          setInviteData({ nomeExibicao: 'Convidado', tipo: 'Individual' });
        } else {
          setInviteData(data);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar convite');
      } finally {
        setLoading(false);
      }
    };

    fetchInviteData();
  }, [routeSlug]);

  // Countdown
  useEffect(() => {
    const updateCountdown = () => {
      const weddingDate = new Date('2026-08-07T00:00:00').getTime();
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <Heart size={48} className="text-rose-600 fill-rose-600" />
        </motion.div>
      </div>
    );
  }

  if (error || !inviteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Convite não encontrado'}</h2>
          <a href="/" className="text-yellow-600 hover:text-yellow-700">
            ← Voltar para Home
          </a>
        </div>
      </div>
    );
  }

  const guestName = inviteData?.nomeExibicao || 'Convidado';

  return (
    <div className="bg-white overflow-hidden">
      {/* HERO SECTION (Parallax) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&h=900&fit=crop)',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'translateZ(0)',
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-45" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="mb-6"
          >
            <Heart size={80} className="text-rose-400 fill-rose-400 mx-auto" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-3xl text-white font-serif italic mb-6"
          >
            O nosso amor é a nossa maior aventura
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl text-rose-400 font-bold"
          >
            07/08/2026
          </motion.p>
        </div>
      </motion.section>

      {/* BOAS-VINDAS SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif">
            Olá, <span className="text-rose-600">{guestName}</span>
          </h2>
          <p className="text-xl text-gray-700 font-serif">
            Seja bem-vindo ao nosso grande dia!
          </p>
        </div>
      </motion.section>

      {/* COUNTDOWN SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16 font-serif">
            Contagem Regressiva
          </h2>

          {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <h3 className="text-5xl md:text-6xl font-bold text-rose-600 font-serif mb-4">
                Chegou o dia!
              </h3>
              <Heart size={64} className="text-rose-500 fill-rose-500 mx-auto animate-pulse" />
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { label: 'Dias', value: timeLeft.days || 0 },
                { label: 'Horas', value: timeLeft.hours || 0 },
                { label: 'Minutos', value: timeLeft.minutes || 0 },
                { label: 'Segundos', value: timeLeft.seconds || 0 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 md:p-8 text-center shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {String(item.value).padStart(2, '0')}
                  </p>
                  <p className="text-white text-lg font-serif uppercase tracking-wider">{item.label}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* RSVP BUTTON SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-r from-rose-50 to-white"
      >
        <div className="max-w-2xl mx-auto text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition-all"
          >
            Confirmar Minha Presença
          </motion.button>
        </div>
      </motion.section>

      {/* AGENDA SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16 font-serif">
            Agenda do Evento
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-rose-50 to-white rounded-3xl shadow-2xl overflow-hidden border-4 border-rose-200 mb-12"
          >
            <div className="bg-rose-600 py-8 text-center px-6">
              <h3 className="font-serif text-3xl text-white font-bold mb-2">Afonso & Daniela</h3>
              <p className="text-rose-200 font-serif text-lg uppercase tracking-widest">07 de Agosto de 2026</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-200">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="text-rose-600" size={24} />
                  <span className="font-bold text-rose-600">Data</span>
                </div>
                <p className="text-xl font-serif text-gray-800">Sábado, 07 de Agosto de 2026</p>
              </div>

              <div className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-200">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-rose-600" size={24} />
                  <span className="font-bold text-rose-600">Localização</span>
                </div>
                <p className="text-lg font-serif text-gray-800 mb-4">Salão de Festas - Luanda, Angola</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Luanda+Angola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-rose-700 transition-colors"
                >
                  <MapPin size={16} /> Abrir GPS
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-rose-200"
          >
            <h3 className="font-serif text-2xl font-bold text-rose-600 mb-8 text-center">Cronograma</h3>

            <div className="relative border-l-4 border-rose-400 ml-4 space-y-8">
              {[
                { time: "15:30", event: "Chegada dos Convidados" },
                { time: "16:00", event: "Início da Cerimónia" },
                { time: "17:30", event: "Sessão de Fotos e Cocktail" },
                { time: "19:00", event: "Jantar de Gala" },
                { time: "21:00", event: "Corte do Bolo" },
                { time: "22:00", event: "Início da Festa / DJ" }
              ].map((item, idx) => (
                <div key={idx} className="relative ml-8">
                  <div className="absolute -left-[44px] top-1 w-6 h-6 bg-rose-400 rounded-full border-4 border-white shadow-md" />

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                    <span className="text-rose-600 font-bold text-xl font-serif min-w-[80px]">
                      {item.time}
                    </span>
                    <div className="bg-rose-50 p-4 rounded-xl flex-1 shadow-sm border border-rose-200">
                      <p className="text-gray-800 font-medium text-lg">{item.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* EXPERIÊNCIA GASTRONÓMICA SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16 font-serif">
            Experiência Gastronómica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Bebidas', icon: '🍷', items: ['Vinhos Finos', 'Champanhe', 'Cocktails Especiais', 'Água com Gás'] },
              { title: 'Pratos', icon: '🍽️', items: ['Grelhados Mistos', 'Peixe Fresco', 'Saladas Frescas', 'Massas Artesanais'] },
              { title: 'Doces', icon: '🍰', items: ['Doces Tradicionais', 'Bolo de Casamento', 'Petit Fours', 'Frutas Tropicais'] },
              { title: 'Petiscos', icon: '🥂', items: ['Aperitivos Gourmet', 'Queijos e Frios', 'Canapés', 'Tapas Variadas'] },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-8 border-2 border-rose-200 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-center">{card.icon}</div>
                <h3 className="text-2xl font-bold text-rose-600 mb-6 font-serif text-center">{card.title}</h3>
                <ul className="space-y-3">
                  {card.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx * 0.15) + (i * 0.1) }}
                      className="text-gray-700 flex items-center gap-2"
                    >
                      <span className="text-rose-400">•</span> {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* NOSSA JORNADA SLIDESHOW */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16 font-serif">
            Nossa Jornada
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {JOURNEY_CARDS.map((card, cardIdx) => (
              <motion.div
                key={cardIdx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: cardIdx * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-rose-200"
              >
                <div className="relative h-64 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={journeyIndices[cardIdx]}
                      src={card.images[journeyIndices[cardIdx]]}
                      alt={card.title}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  <button
                    onClick={() => setJourneyIndices(prev => prev.map((idx, i) => i === cardIdx ? (idx - 1 + card.images.length) % card.images.length : idx))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all"
                  >
                    <ChevronLeft size={20} className="text-gray-800" />
                  </button>

                  <button
                    onClick={() => setJourneyIndices(prev => prev.map((idx, i) => i === cardIdx ? (idx + 1) % card.images.length : idx))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10 transition-all"
                  >
                    <ChevronRight size={20} className="text-gray-800" />
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {card.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setJourneyIndices(prev => prev.map((i, cardI) => cardI === cardIdx ? idx : i))}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === journeyIndices[cardIdx] ? 'bg-rose-400 w-6' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-rose-600 font-serif text-center">{card.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CONSELHOS DA MADRINHA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16 font-serif">
            Conselhos da Madrinha
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CONSELHOS.map((conselho, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 100 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotate: 2,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
                className="bg-gradient-to-br from-rose-50 to-white rounded-2xl p-8 border-2 border-rose-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-4xl mb-4 text-center"
                >
                  💝
                </motion.div>
                <p className="text-gray-800 text-lg font-serif text-center leading-relaxed">{conselho}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* MAPA SEÇÃO */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl border-2 border-rose-200 shadow-2xl p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-700 text-center mb-4 font-serif">
              <MapPin className="inline-block mr-2 text-rose-600" size={32} />
              Localização
            </h2>
            <p className="text-center text-rose-600 mb-6 text-lg font-medium">Salão de Festas - Luanda, Angola</p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl overflow-hidden border-2 border-rose-100 shadow-inner">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.8706265393223!2d13.234100600000002!3d-8.838611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51fa0d66e1c1b7%3A0x9f0dbe0d0d0d0d0d!2sLuanda%2C%20Angola!5e0!3m2!1spt-PT!2spt!4v1234567890"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="p-6 bg-rose-50 rounded-2xl border-2 border-rose-200 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-rose-700 mb-3">Detalhes do local</h3>
                <ul className="list-disc list-inside space-y-2 text-rose-600">
                  <li>Chegada: 15h30</li>
                  <li>Cerimônia: 16h00</li>
                  <li>Jantar: 19h00</li>
                  <li>Festa com DJ: 22h00</li>
                </ul>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Luanda+Angola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block rounded-full bg-rose-600 text-white px-5 py-3 font-bold hover:bg-rose-700 transition-all text-center"
                >
                  Abrir no Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12 px-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center"
      >
        <Heart size={32} className="text-rose-400 fill-rose-400 mx-auto mb-4" />
        <p className="text-lg font-serif mb-2">Obrigado por fazer parte do nosso grande dia!</p>
        <p className="text-sm text-gray-400">© 2026 - SynerTech | Todos os direitos reservados</p>
      </motion.section>
    </div>
  );
}
