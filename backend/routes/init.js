import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ==================== INICIALIZAR BANCO DE DADOS ====================

/**
 * Rota POST /api/init/database
 * Cria o banco de dados e tabelas se não existirem
 * Apenas execute uma vez para configurar o sistema
 */
router.post('/init/database', async (req, res) => {
  try {
    console.log('🔧 Iniciando setup do banco de dados...');

    // Conexão sem especificar banco (para criar o banco)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 1. Criar banco de dados
    console.log('📚 Criando banco de dados wee_database...');
    await connection.execute(`
      CREATE DATABASE IF NOT EXISTS wee_database 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci
    `);
    console.log('✅ Banco de dados criado/verificado');

    // 2. Usar o banco
    await connection.query('USE wee_database');

    // 3. Criar tabela de convidados
    console.log('📋 Criando tabela convidados...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS convidados (
        id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único do convidado',
        slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'UUID para acesso seguro na URL',
        nome_exibicao VARCHAR(255) NOT NULL COMMENT 'Nome do convidado',
        tipo VARCHAR(50) DEFAULT 'Individual' COMMENT 'Individual ou Casal',
        confirmado_presenca TINYINT(1) DEFAULT 0 COMMENT '0 = Não, 1 = Sim',
        categoria VARCHAR(100) DEFAULT 'convidado' COMMENT 'Categoria do convidado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de atualização',
        
        INDEX idx_slug (slug),
        INDEX idx_categoria (categoria),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Tabela convidados criada/verificada');

    // 4. Verificar se já existem dados
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM convidados');
    const hasData = rows[0].count > 0;

    let insertedCount = 0;

    // 5. Inserir dados de exemplo se vazio
    if (!hasData) {
      console.log('📥 Inserindo dados de exemplo...');
      const sampleGuests = [
        ['a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6', 'João Silva', 1, 'convidado'],
        ['b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7', 'Maria Santos', 1, 'convidado'],
        ['c3d4e5f6-g7h8-49i0-j1k2-l3m4n5o6p7q8', 'Pedro Oliveira', 1, 'familia'],
        ['d4e5f6g7-h8i9-50j1-k2l3-m4n5o6p7q8r9', 'Ana Costa', 0, 'convidado'],
        ['e5f6g7h8-i9j0-51k2-l3m4-n5o6p7q8r9s0', 'Carlos Mendes', 1, 'staff'],
      ];

      for (const [slug, nome, confirmado, categoria] of sampleGuests) {
        try {
          await connection.execute(
            'INSERT INTO convidados (slug, nome_exibicao, confirmado_presenca, categoria) VALUES (?, ?, ?, ?)',
            [slug, nome, confirmado, categoria]
          );
          insertedCount++;
        } catch (err) {
          // Ignorar duplicatas
          if (!err.message.includes('Duplicate')) {
            throw err;
          }
        }
      }
      console.log(`✅ ${insertedCount} convidados de exemplo inseridos`);
    } else {
      console.log(`ℹ️  Banco já contém ${rows[0].count} convidados (dados não sobrescrevem))`);
    }

    await connection.end();

    return res.status(200).json({
      success: true,
      message: '✅ Banco de dados configurado com sucesso!',
      details: {
        database: 'wee_database criado',
        table: 'convidados criada',
        sampleDataInserted: insertedCount,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erro ao configurar banco de dados',
      error: error.message,
    });
  }
});

export default router;
