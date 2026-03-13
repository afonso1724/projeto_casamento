import React from 'react';
import { motion } from 'framer-motion';

export default function InviteCard({ data, onViewTimeline }) {
  if (!data) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header com foto dos noivos */}
      <motion.div
        className="mb-8"
        variants={itemVariants}
      >
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48">
            {/* Moldura dupla dourada */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-400 rounded-full shadow-2xl" />
            <div className="absolute inset-2 bg-white rounded-full" />
            <img
              src={data.coupleImage}
              alt="Casal"
              className="absolute inset-3 w-auto h-auto rounded-full object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* Corpo do convite */}
      <motion.div
        className="luxury-card p-8 mb-8"
        variants={itemVariants}
      >
        {/* Decoração superior */}
        <div className="text-center mb-6">
          <div className="inline-block mb-4">
            <svg className="w-8 h-8 text-luxury-gold" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-luxury-dark mb-2">
            Você é especial
          </h2>
          <p className="text-sm text-gray-600">para nós</p>
        </div>

        {/* Mensagem principal */}
        <div className="border-t-2 border-b-2 border-luxury-gold py-6 mb-6 text-center">
          <p className="text-lg font-serif text-luxury-dark mb-4">
            O casal <span className="font-bold text-luxury-gold">{data.coupleNames.name1} & {data.coupleNames.name2}</span>
          </p>
          <p className="text-lg font-serif text-luxury-dark">
            tem a honra de convidar<br />
            <span className="text-2xl font-bold text-luxury-gold mb-2">{data.nomeExibicao}</span>
          </p>
        </div>

        {/* Detalhes do evento */}
        <div className="space-y-3 text-center mb-6">
          <div>
            <p className="text-sm text-gray-600">Data</p>
            <p className="text-lg font-serif font-bold text-luxury-dark">
              {new Date(data.eventDetails.date).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Horário de Recepção</p>
            <p className="text-lg font-serif font-bold text-luxury-dark">
              {data.eventDetails.time}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Local</p>
            <p className="text-lg font-serif font-bold text-luxury-dark">
              {data.eventDetails.location}
            </p>
          </div>
        </div>

        {/* Decoração inferior */}
        <div className="text-center">
          <svg className="w-6 h-6 text-luxury-gold inline-block" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </motion.div>

      {/* Botão de visualização do programa */}
      <motion.button
        onClick={onViewTimeline}
        className="luxury-button w-full"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Programa do Evento
      </motion.button>

      {/* Status de presença */}
      {data.confirmadoPresenca && (
        <motion.div
          className="mt-4 p-4 bg-green-50 border-luxury rounded-luxury text-center"
          variants={itemVariants}
        >
          <p className="text-sm text-green-700 font-semibold">
            ✓ Sua presença foi confirmada
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
