import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import invitesRoutes from './routes/invites.js';
import adminRoutes from './routes/admin.js';
import initRoutes from './routes/init.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== IMPORTAR ROTAS ====================

app.use('/api', invitesRoutes);
app.use('/api', adminRoutes);
app.use('/api', initRoutes);

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// ==================== ERROR HANDLING ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

app.use((error, req, res, next) => {
  console.error('Erro geral:', error);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Servidor WEE rodando em http://localhost:${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`💍 Casamento: ${process.env.COUPLE_NAME_1} & ${process.env.COUPLE_NAME_2}`);
});
