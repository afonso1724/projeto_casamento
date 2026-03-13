-- ============================================
-- Wedding Entry Experience (WEE) Database
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS wee_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE wee_database;

-- ============================================
-- Table: convidados
-- ============================================
DROP TABLE IF EXISTS convidados;
CREATE TABLE convidados (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID único do convidado',
  slug VARCHAR(10) NOT NULL UNIQUE COMMENT 'Código único de 6 caracteres para acesso do convite',
  nome_exibicao VARCHAR(255) NOT NULL COMMENT 'Nome da pessoa ou do casal',
  tipo VARCHAR(20) NOT NULL DEFAULT 'Individual' COMMENT 'Individual ou Casal',
  confirmado_presenca TINYINT(1) DEFAULT 0 COMMENT '0 = Não confirmado, 1 = Confirmado',
  categoria VARCHAR(100) DEFAULT 'convidado' COMMENT 'Categoria do convidado (convidado, familia, staff)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação do convite',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Data de última atualização',
  
  INDEX idx_slug (slug),
  INDEX idx_tipo (tipo),
  INDEX idx_categoria (categoria),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela de convidados do casamento com suporte a Individual/Casal';

-- ============================================
-- Sample Data (Opcional)
-- ============================================
INSERT INTO convidados (slug, nome_exibicao, tipo, confirmado_presenca, categoria) VALUES
('A1B2C3', 'João Silva', 'Individual', 1, 'convidado'),
('D4E5F6', 'Maria & Pedro Santos', 'Casal', 1, 'convidado'),
('G7H8I9', 'Ana Costa', 'Individual', 0, 'familia'),
('J0K1L2', 'Carlos & Juliana Mendes', 'Casal', 1, 'staff'),
('M3N4O5', 'Sofia Oliveira', 'Individual', 1, 'convidado');
