import React from 'react';
import { motion } from 'framer-motion';

export default function Timeline({ events, onClose }) {
  const timelineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      variants={timelineVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="mb-8 flex items-center justify-between"
        variants={itemVariants}
      >
        <h3 className="text-3xl font-serif font-bold text-luxury-dark">
          Cronograma
        </h3>
        <button
          onClick={onClose}
          className="text-2xl text-luxury-dark hover:text-luxury-gold transition-colors"
        >
          ✕
        </button>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Linha vertical central */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-luxury-gold to-yellow-300" />

        {/* Eventos */}
        <motion.div
          className="space-y-8"
          variants={timelineVariants}
        >
          {events.map((event, index) => (
            <motion.div
              key={index}
              className="relative pl-24"
              variants={itemVariants}
            >
              {/* Círculo do timeline */}
              <div className="absolute left-0 top-1 w-16 h-16 bg-white border-4 border-luxury-gold rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg font-serif font-bold text-luxury-gold">
                  {event.time}
                </span>
              </div>

              {/* Card do evento */}
              <div className="luxury-card p-6 hover:shadow-luxury-lg transition-all duration-300">
                <h4 className="text-xl font-serif font-bold text-luxury-dark">
                  {event.event}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {event.time}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Botão de fechar */}
      <motion.button
        onClick={onClose}
        className="luxury-button w-full mt-8"
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Voltar ao Convite
      </motion.button>
    </motion.div>
  );
}
