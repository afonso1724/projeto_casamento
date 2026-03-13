import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔗 Configurando conexão com MySQL...');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   User: ${process.env.DB_USER}`);
console.log(`   Database: ${process.env.DB_NAME}`);
console.log(`   Port: ${process.env.DB_PORT}`);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wee_database',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Testar conexão
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexão com MySQL estabelecida com sucesso!');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Erro ao conectar com MySQL:');
    console.error(error.message);
    console.error('\n⚠️  Certifique-se que:');
    console.error('   1. MySQL está rodando');
    console.error('   2. Usuario/senha estão corretos no .env');
    console.error('   3. Banco de dados wee_database foi criado');
  });

export async function getConnection() {
  return await pool.getConnection();
}

export default pool;

