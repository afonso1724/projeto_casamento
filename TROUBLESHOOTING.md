# Troubleshooting & FAQ - WEE

## 🔴 Erros Comuns

### Backend

#### "Cannot find module 'express'"
```bash
cd backend
npm install
```

#### "ER_ACCESS_DENIED_FOR_USER 'root'@'localhost'"
Verifique credenciais no `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_correta
DB_PORT=3306
```

Teste conexão SQL:
```bash
mysql -h localhost -u root -p seu_password -e "SELECT 1;"
```

#### "ER_NO_REFERENCED_TABLE"
Certifique-se que o banco foi criado:
```bash
mysql -u root -p < database/schema.sql
```

#### "Port 5000 already in use"
Encontre o processo:
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

Mude a porta em `.env`:
```env
PORT=5001
```

### Frontend

#### "Failed to fetch from /api/..."
O backend não está rodando. Verifique:
```bash
# Terminal do backend
npm start
```

Verifique CORS em `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

#### "Tailwind styles not appearing"
Reconstrua CSS:
```bash
cd frontend
npm run build
```

Limpe cache:
- Ctrl+Shift+Delete no navegador
- Ou acesse modo incógnito

#### "Module not found 'react-router-dom'"
Instale dependência:
```bash
cd frontend
npm install react-router-dom
```

### Banco de Dados

#### "Cannot execute: Syntax error in SQL"
Verifique `database/schema.sql`:
```bash
# Teste sintaxe
mysql -u root -p < database/schema.sql
```

#### "No convidados appearing"
Verifique dados:
```bash
mysql -u root -p wee_database
SELECT * FROM convidados;
```

Se vazio, insira dados:
```sql
INSERT INTO convidados (slug, nome_exibicao, confirmado_presenca) 
VALUES ('seu-uuid-aqui', 'João Silva', 1);
```

---

## 🟡 Avisos & Aviso

### Performance

**Aviso: Muitos convidados simultaneamente**
- Implemente pagination em `/api/admin/guests`
- Adicione índices de banco de dados
- Considere caching com Redis

### Segurança

**⚠️ Em produção:**
- Nunca deixe `NODE_ENV=development`
- Use `.env` com senhas fortes
- Implemente rate limiting
- Use HTTPS obrigatoriamente
- Considere JWT para autenticação

### Escalabilidade

Para mais de 500 convidados:
- Migre para PostgreSQL
- Implemente load balancing
- Use CDN para imagens
- Considere serverless (AWS Lambda, Vercel)

---

## ✅ Checklist de Debugging

- [ ] Node.js instalado? `node --version`
- [ ] npm funcionando? `npm --version`
- [ ] MySQL rodando? `mysql --version`
- [ ] Porta 5000 disponível?
- [ ] Porta 3000 disponível?
- [ ] `.env` configurado corretamente?
- [ ] Banco de dados criado? `show databases;`
- [ ] Tabela convidados existe? `describe convidados;`
- [ ] Dados no banco? `SELECT * FROM convidados LIMIT 1;`
- [ ] Backend respondendo? `http://localhost:5000/health`
- [ ] Frontend carregando? `http://localhost:3000/`

---

## 🔧 Soluções Rápidas

### Backend não inicia
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Frontend com erro de CSS
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Limpar cache completo
```bash
# Windows
rmdir /s /q node_modules
del package-lock.json
npm install

# Mac/Linux
rm -rf node_modules package-lock.json
npm install
```

### Resetar banco de dados
```bash
mysql -u root -p
DROP DATABASE wee_database;
source database/schema.sql;
```

---

## 📞 Testando Endpoints

### Health Check
```bash
curl http://localhost:5000/health
```

**Resposta esperada:**
```json
{ "status": "ok", "timestamp": "2026-03-11T..." }
```

### Buscar Convite
```bash
curl http://localhost:5000/api/convite/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
```

### Listar Convidados
```bash
curl http://localhost:5000/api/admin/guests
```

---

## 📱 Testar em Mobile

### Local Network
```bash
# Obtenha seu IP local
ipconfig getifaddr en0  # Mac
hostname -I            # Linux
ipconfig                # Windows (procure por IPv4)

# Acesse pelo celular
http://SEU_IP:3000
```

### Utilizando ngrok
```bash
ngrok http 3000
# Compartilhe URL gerada
```

---

## 🐛 Logs e Debug

### Ativar modo verbose
```bash
# Backend
DEBUG=* npm start

# Frontend
VITE_DEBUG=true npm run dev
```

### Verificar logs do MySQL
```bash
# Localização (varia por SO)
# Windows: C:\ProgramData\MySQL\MySQL Server 8.0\Data\
# Mac: /usr/local/var/mysql/
# Linux: /var/log/mysql/
```

### Browser DevTools
- F12 ou Ctrl+Shift+I
- Aba "Console" para erros JavaScript
- Aba "Network" para requisições HTTP
- Aba "Storage" para LocalStorage

---

## 🆘 Nenhuma Solução Funcionou?

### Informações a Coletar

Quando pedir ajuda, forneça:

1. **Versões:**
   ```bash
   node --version
   npm --version
   mysql --version
   ```

2. **Erro completo** (copiar console inteiro)

3. **Ambiente:**
   - Sistema operacional
   - Node.js versão
   - MySQL versão

4. **Passos para reproduzir** (passo a passo)

5. **O que já tentou**

---

## 📖 Recursos de Ajuda

- **Node.js:** https://nodejs.org/docs/
- **Express:** https://expressjs.com/
- **MySQL:** https://dev.mysql.com/doc/
- **React:** https://react.dev/
- **Tailwind:** https://tailwindcss.com/docs/

---

## 💡 Dicas pro:

1. Use `console.log()` frequentemente
2. Reinicie sempre após mudar `.env`
3. Limpe cache de browser regularmente
4. Teste URLs de API em ferramentas como Postman
5. Mantenha backups do banco de dados
6. Use controle de versão (Git)

---

**Última Atualização:** Março 2026
**Versão:** 1.0.0
