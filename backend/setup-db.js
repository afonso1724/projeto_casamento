import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    console.log('📦 Iniciando setup do banco de dados...\n');

    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '../database/schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf-8');

    // Conexão sem banco específico
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });

    console.log('✅ Conectado ao MySQL');

    // Primeiro, criar o banco de dados se não existir
    try {
      await connection.query('CREATE DATABASE IF NOT EXISTS wee_database');
      console.log('✅ Banco de dados garantido');
    } catch (err) {
      if (!err.message.includes('already exists')) {
        throw err;
      }
    }

    // Conectar ao banco específico
    const dbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'wee_database',
    });

    console.log('✅ Conectado ao banco wee_database');

    // Remover tabela antiga se existir
    console.log('\n🗑️  Removendo tabelas antigas se existirem...');
    try {
      await dbConnection.query('DROP TABLE IF EXISTS convidados');
      console.log('✅ Tabelas antigas removidas');
    } catch (err) {
      console.warn('⚠️  Aviso ao remover tabelas:', err.message);
    }

    // Executar cada comando SQL da schema
    console.log('\n📋 Criando nova estrutura de banco...');
    const statements = sqlScript.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim() && !statement.trim().startsWith('--')) {
        try {
          const cleanStatement = statement.trim();
          if (cleanStatement.length > 10) {
            console.log(`  → ${cleanStatement.substring(0, 50)}...`);
          }
          await dbConnection.query(cleanStatement);
        } catch (err) {
          console.error(`  ❌ Erro: ${err.message}`);
          throw err;
        }
      }
    }

    await dbConnection.end();

    console.log('✅ Banco de dados criado com sucesso!');
    console.log('✅ Tabela "convidados" pronta');
    console.log('✅ Dados de teste inseridos\n');

    await connection.end();
    console.log('🎉 Setup concluído!');
  } catch (error) {
    console.error('❌ Erro ao setup banco de dados:', error.message);
    process.exit(1);
  }
}

setupDatabase();
