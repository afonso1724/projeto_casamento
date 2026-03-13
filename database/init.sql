-- ============================================
-- Wedding Entry Experience (WEE) Database
-- ============================================

-- Create Database (if not exists)
CREATE DATABASE IF NOT EXISTS wee_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wee_database;

-- ============================================
-- Table: convidados
-- ============================================
DROP TABLE IF EXISTS convidados;
CREATE TABLE convidados (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único do convidado',
  slug VARCHAR(255) NOT NULL UNIQUE COMMENT 'UUID para acesso seguro na URL',
  nome_exibicao VARCHAR(255) NOT NULL COMMENT 'Nome do convidado',
  tipo VARCHAR(50) DEFAULT 'Individual' COMMENT 'Individual ou Casal',
  confirmado_presenca TINYINT(1) DEFAULT 0 COMMENT '0 = Não, 1 = Sim',
  categoria VARCHAR(100) DEFAULT 'convidado' COMMENT 'Categoria do convidado (convidado, familia, staff)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de atualização',
  
  INDEX idx_slug (slug),
  INDEX idx_categoria (categoria),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela de convidados do casamento';

-- ============================================
-- Sample Data
-- ============================================
INSERT INTO convidados (slug, nome_exibicao, confirmado_presenca, categoria) VALUES
('a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6', 'João Silva', 1, 'convidado'),
('b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7', 'Maria Santos', 1, 'convidado'),
('c3d4e5f6-g7h8-49i0-j1k2-l3m4n5o6p7q8', 'Pedro Oliveira', 1, 'familia'),
('d4e5f6g7-h8i9-50j1-k2l3-m4n5o6p7q8r9', 'Ana Costa', 0, 'convidado'),
('e5f6g7h8-i9j0-51k2-l3m4-n5o6p7q8r9s0', 'Carlos Mendes', 1, 'staff');

SELECT 'Database criado com sucesso! ✅' AS status;
