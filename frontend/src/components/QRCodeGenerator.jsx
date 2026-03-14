import React from 'react';
import { motion } from 'framer-motion';

export default function QRCodeGenerator({ guestData, baseURL = 'https://projeto-casamento-sigma.vercel.app'}) {
  if (!guestData) return null;

  const conviteURL = `${baseURL}/convite/${guestData.slug}`;

  // Usando API do Google Charts para gerar QR Code
  const generateQRImage = (url) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}`;
  };

  const downloadQR = async () => {
    const qrImageUrl = generateQRImage(conviteURL);
    
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `qr-convite-${guestData.nomeExibicao.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      alert('Erro ao baixar QR Code');
      console.error(error);
    }
  };

  return (
    <motion.div
      className="text-center p-6 bg-white rounded-luxury shadow-luxury border-2 border-luxury-gold"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-serif font-bold text-luxury-dark mb-4">
        {guestData.nomeExibicao}
      </h3>

      <div className="space-y-6">
        {/* QR Code para Convite */}
        <motion.div
          className="p-4 border-2 border-dashed border-luxury-gold rounded-lg bg-luxury-bg"
          whileHover={{ scale: 1.02 }}
        >
          <p className="text-sm text-gray-600 mb-3 font-semibold">QR CODE - CONVITE</p>
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-lg border-2 border-luxury-gold">
              <img 
                src={generateQRImage(conviteURL)}
                alt="QR Code Convite"
                className="w-64 h-64"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-3 break-all font-mono">
            {conviteURL}
          </p>
          <button
            onClick={downloadQR}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-all"
          >
            Baixar QR Convite
          </button>
        </motion.div>

        {/* Informações */}
        <div className="text-left p-4 bg-gray-50 rounded-lg border-l-4 border-luxury-gold">
          <p className="text-xs text-gray-700">
            <strong>ID:</strong> {guestData.id} | <strong>Slug:</strong> {guestData.slug}
          </p>
          <p className="text-xs text-gray-700 mt-1">
            <strong>Presença:</strong> {guestData.confirmadoPresenca ? '✓ Confirmada' : '✗ Não confirmada'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
