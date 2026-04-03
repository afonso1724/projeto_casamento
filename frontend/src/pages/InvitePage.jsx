import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronLeft, ChevronRight, MapPin, Wine, Utensils, Cake, ForkKnife } from 'lucide-react';

const CONSELHOS = [
  {
    titulo: 'Antes de ir embora, tire um tempinho para se despedir dos noivos.',
    descricao: 'Convidados, não se esqueça! O casamento é a celebração de duas vidas se unindo para a construção de um furuto e você foi convidado para celebrar e não criticar!'
  },
  {
    titulo: 'Preparação Emocional',
    descricao: 'Prepare o seu coração para momentos inesquecíveis e viva cada instante com intensidade.'
  },
  {
    titulo: 'Expressão de Alegria',
    descricao: 'Não esqueça o seu sorriso contagiante - ele será a melhor decoração da festa.'
  },
  {
    titulo: 'Pontualidade',
    descricao: 'Chegue com antecedência para aproveitar cada detalhe desta celebração única.'
  },
  {
    titulo: 'Entrega Total',
    descricao: 'Divirta-se ao máximo, dance, cante e celebre o amor que nos une a todos.'
  },
  {
    titulo: 'Memórias Eternas',
    descricao: 'Capture momentos inesquecíveis com fotografias e guarde-os no coração para sempre.'
  },
  {
    titulo: 'Celebração do Amor',
    descricao: 'Celebre o amor acima de tudo - ele é a razão desta festa memorável.'
  },
];

const JOURNEY_CARDS = [
  {
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1465301046430-c52cc00e626d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=400&fit=crop',
    ]
  },
  {
    images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&h=400&fit=crop',
    ]
  },
  {
    images: [
      'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop',
    ]
  },
  {
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
  const [currentSlide, setCurrentSlide] = useState(0);

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
          <Heart size={48} className="text-slate-600 fill-slate-600" />
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
    <div className="bg-[#fff5f7] overflow-hidden">
      {/* HERO SECTION (Parallax Enhanced) */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image with Enhanced Parallax */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&h=900&fit=crop)',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'translateZ(0)',
          }}
        />

        {/* Multiple Overlay Layers for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 opacity-30"
        >
          <Heart size={60} className="text-white" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 right-20 opacity-20"
        >
          <Heart size={80} className="text-white" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-8"
          >
            <Heart size={100} className="text-white fill-white mx-auto drop-shadow-2xl" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 font-serif tracking-wider drop-shadow-2xl"
          >
            Zola & Regina
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-xl md:text-2xl text-white/90 font-light mb-8 font-serif italic"
          >
            O nosso amor é a nossa maior aventura
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-3xl md:text-4xl text-white font-bold drop-shadow-lg"
          >
            07 • 08 • 2026
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
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 md:p-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="mb-6"
            >
              <Heart size={48} className="text-rose-400 fill-rose-400 mx-auto" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#ec4899] mb-4 font-serif">
              Olá, <span className="text-slate-700">{guestName}</span>
            </h2>
            <p className="text-xl text-gray-700 font-serif mb-6">
              Seja bem-vindo ao nosso grande dia!
            </p>
            <p className="text-slate-600 text-lg font-light mb-6">
              A sua mesa é a mesa 1
            </p>
            <p className="text-slate-600 text-lg font-light">
              É uma honra ter você connosco. Navegue por esta página para descobrir todos os detalhes do nosso grande dia.
            </p>
          </div>
        </div>
      </motion.section>

      {/* COUNTDOWN SECTION - Elegant Inline */}
      <motion.section
        id="contagem"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="py-24 px-4 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-[#ec4899] mb-16 font-serif tracking-wide"
          >
            Contagem Regressiva
          </motion.h2>

          {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="mb-8"
              >
                <Heart size={120} className="text-slate-600 fill-slate-600 mx-auto drop-shadow-xl" />
              </motion.div>
              <h3 className="text-6xl md:text-8xl font-bold text-slate-800 font-serif mb-6 drop-shadow-lg">
                Chegou o dia!
              </h3>
              <p className="text-2xl text-slate-600 font-light italic">
                Prepare-se para celebrar o amor
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-8">
                {[
                  { label: 'Dias', value: timeLeft.days || 0 },
                  { label: 'Horas', value: timeLeft.hours || 0 },
                  { label: 'Minutos', value: timeLeft.minutes || 0 },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-5xl md:text-7xl font-bold text-slate-800 mb-2 font-mono">
                      {String(item.value).padStart(2, '0')}
                    </div>
                    <div className="text-slate-600 text-sm md:text-lg font-light uppercase tracking-widest">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl text-slate-600 font-light italic mb-8"
              >
                Até o grande dia do nosso casamento
              </motion.p>

              <motion.a
                href={`https://wa.me/244935678380?text=Olá! Confirmo minha presença no casamento de Zola e Regina. Meu nome é ${guestName}.`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                viewport={{ once: true }}
                className="inline-block bg-[#ec4899] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#128C7E] transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                Confirmar Presença via WhatsApp
              </motion.a>
            </motion.div>
          )}
        </div>
      </motion.section>



      {/* EXPERIÊNCIA GASTRONÓMICA SECTION */}
      <motion.section
        id="gastronomia"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ec4899] text-center mb-16 font-serif">
            Experiência Gastronómica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Bebidas', icon: Wine, items: ['Vinhos Finos', 'Champanhe', 'Cocktails Especiais', 'Água com Gás'] },
              { title: 'Pratos', icon: Utensils, items: ['Grelhados Mistos', 'Peixe Fresco', 'Saladas Frescas', 'Massas Artesanais'] },
              { title: 'Doces', icon: Cake, items: ['Doces Tradicionais', 'Bolo de Casamento', 'Petit Fours', 'Frutas Tropicais'] },
              { title: 'Petiscos', icon: ForkKnife, items: ['Aperitivos Gourmet', 'Queijos e Frios', 'Canapés', 'Tapas Variadas'] },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-4xl mb-4 text-center flex justify-center">
                  <card.icon size={40} className="text-slate-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 font-serif text-center">{card.title}</h3>
                <ul className="space-y-3">
                  {card.items.map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: (idx * 0.15) + (i * 0.1) }}
                      className="text-gray-700"
                    >
                      {item}
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
        id="jornada"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ec4899] text-center mb-16 font-serif">
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
                          idx === journeyIndices[cardIdx] ? 'bg-slate-500 w-6' : 'bg-white/50'
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
        id="conselhos"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ec4899] text-center mb-16 font-serif">
            Conselho da Madrinha
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
            viewport={{ once: true }}
            whileHover={{
              scale: 1.03,
              rotate: 1,
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
            }}
            className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 group relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-4 right-4 text-3xl text-pink-500"
            >
              ❤️
            </motion.div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 font-serif mb-3">
                {CONSELHOS[0].titulo}
              </h3>
            </div>
            <p className="text-slate-600 text-center leading-relaxed font-light">
              {CONSELHOS[0].descricao}
            </p>
          </motion.div>

          {/* Imagem fixa com overlay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop"
              alt="Momento especial"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-white text-2xl font-serif italic text-center px-4">
                Memórias que durarão para sempre
              </p>
            </div>
          </motion.div>

          {/* Carrossel Manual do Convidado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-slate-800 text-center mb-8 font-serif">
              Manual do Convidado
            </h3>
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-slate-50 to-white">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {[
                  'https://github.com/afonso1724/projeto_casamento/blob/main/frontend/src/img/capa.jpeg?raw=true', 
                  // Capa
                  'https://github.com/afonso1724/projeto_casamento/blob/main/frontend/src/img/pagina1.jpeg?raw=true', // Página 1
                  'https://github.com/afonso1724/projeto_casamento/blob/main/frontend/src/img/pagina2.jpeg?raw=true'  // Página 2
                ].map((src, idx) => (
                  <img key={idx} src={src} alt={`Página ${idx + 1}`} className="w-full flex-shrink-0 h-screen max-h-96 object-contain" />
                ))}
              </div>
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              >
                <ChevronLeft size={20} className="text-gray-800" />
              </button>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg z-10"
              >
                <ChevronRight size={20} className="text-gray-800" />
              </button>
            </div>
          </motion.div>

          {/* Informações do Evento */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl mb-4 text-[#ec4899] flex justify-center">
                <Heart size={40} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Igreja</h4>
              <p className="text-slate-600">Igreja Evangélica Batista em Angola IEBA</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4 text-[#ec4899] flex justify-center">
                <MapPin size={40} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Local do Salão</h4>
              <p className="text-slate-600">Salão de Festas Kissonde, Luanda</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4 text-[#ec4899] flex justify-center">
                <Heart size={40} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Abertura do Salão</h4>
              <p className="text-slate-600">19:00</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* MAPA SEÇÃO */}
      <motion.section
        id="localizacao"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ec4899] text-center mb-12 font-serif">
            <MapPin className="inline-block mr-2 text-slate-600" size={32} />
            Localização
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden border-4 border-slate-200 shadow-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.8706265393223!2d13.234100600000002!3d-8.838611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51fa0d66e1c1b7%3A0x9f0dbe0d0d0d0d0d!2sLuanda%2C%20Angola!5e0!3m2!1spt-PT!2spt!4v1234567890"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <a
              href="https://www.google.com/maps/search/?api=1&query=Luanda+Angola"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#ec4899] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <MapPin size={20} />
              Abrir no Google Maps
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-gradient-to-br from-[#ec4899] via-slate-800 to-slate-900 text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold font-serif mb-6 text-white">Zola & Regina</h3>
          <p className="text-slate-300 text-lg mb-4 leading-relaxed">
            Celebrando o amor que nos une e a jornada que compartilhamos. Este é o nosso grande dia.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Heart size={20} className="text-[#ec4899] fill-[#ec4899]" />
            <span className="text-slate-300 font-medium">Para Sempre</span>
          </div>
          <p className="text-slate-400 text-sm">
            2026 SynerTech - Experiência de Casamento Digital<br />
            Todos os direitos reservados
          </p>
        </div>
      </motion.section>


    </div>
  );
}
