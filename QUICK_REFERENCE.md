# Quick Reference - WEE

## 📋 Resumo Técnico

### Stack de Tecnologias
```
Frontend:  React 18 + Vite + Tailwind CSS + Framer Motion + Axios
Backend:   Node.js + Express.js + MySQL
Protocolo: REST API com JSON
Auth:      UUID-based Slug para URLs seguras
```

---

## 🚀 Commands Rápidos

### Iniciar Projeto
```bash
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend  
cd frontend && npm install && npm run dev

# Terminal 3 - Setup DB
mysql -u root -p < database/schema.sql
```

### URLs Locais
```
Frontend:  http://localhost:3000
Backend:   http://localhost:5000
Database:  localhost:3306
```

---

## 🔌 API Endpoints

```
GET  /api/convite/:slug          → Dados completo do convite
PUT  /api/convite/:slug/confirmar → Confirmar presença
GET  /api/admin/guests           → Lista todos convidados
POST /api/admin/guest            → Criar novo convidado
PUT  /api/admin/guest/:id        → Atualizar convidado
DELETE /api/admin/guest/:id      → Deletar convidado
GET  /health                     → Status do servidor
```

---

## 📊 Estrutura do Database

```sql
convidados:
  id (INT, PK)
  slug (VARCHAR, UNIQUE) ← UUID4
  nome_exibicao (VARCHAR)
  confirmado_presenca (TINYINT)
  categoria (VARCHAR) → convidado|familia|staff
  created_at (TIMESTAMP)
  updated_at (TIMESTAMP)
```

---

## 🎨 Paleta de Cores

```
Fundo:      #FAF9F6 (Luxury-bg)
Destaque:   #D4AF37 (Luxury-gold)
Texto:      #1C1C1C (Luxury-dark)
Gradiente:  #D4AF37 → #F4D47F
```

---

## 📱 Arquitetura de Pastas

```
backend/
  ├── config/database.js
  ├── routes/
  │   ├── invites.js
  │   ├── admin.js
  │   └── init.js
  ├── server.js
  ├── package.json
  └── .env

frontend/
  ├── src/
  │   ├── components/
  │   │   ├── InviteCard.jsx
  │   │   ├── Timeline.jsx
  │   │   └── QRCodeGenerator.jsx
  │   ├── pages/
  │   │   ├── InvitePage.jsx
  │   │   ├── AdminPage.jsx
  │   │   └── AgendaPage.jsx
  │   ├── App.jsx
  │   ├── main.jsx
  │   └── index.css
  ├── index.html
  └── tailwind.config.js

database/
  └── schema.sql
```
```

---

## 🔄 Fluxo de Dados

```
1. Convidado escaneia QR Code
   ↓
2. Abre /convite/{slug}
   ↓
3. Frontend requisita GET /api/convite/{slug}
   ↓
4. Backend busca no MySQL
   ↓
5. Retorna dados completos (couple, timeline, etc)
   ↓
6. UI renderiza convite elegante
   ↓
7. Convidado clica em "Programa do Evento"
   ↓
8. Timeline abre com animação

---

## 🔐 Segurança Implementada

✅ UUID randomizado para cada URL (não sequencial)
✅ CORS configurado
✅ Validação de dados
✅ Não expõe IDs reais nas URLs (usa slug)

⚠️ Para produção adicionar:
- JWT para authentication de staff
- Rate limiting
- HTTPS obrigatório
- Hash de senhas (se adicionar autenticação)

---

## 📈 Performance

### Frontend
- Vite (build instant)
- React lazy loading
- Framer Motion (GPU accelerated)
- Tailwind CSS (tree-shaking)

### Backend
- Connection pooling MySQL
- Async/await (non-blocking)
- Índices no banco (slug, categoria)

### Otimizações Recomendadas
- Cache com Redis
- CDN para imagens
- Compressão Gzip
- Minificação de assets

---

## 🧪 Testing

### Testar Backend
```bash
curl -X GET http://localhost:5000/api/convite/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
curl http://localhost:5000/health
```

### Testar Frontend
- Abra DevTools (F12)
- Teste páginas em diferentes resoluções
- Valide CSS com Lighthouse

---

## 📦 Dependências Principais

```json
{
  "backend": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "uuid": "^9.0.1"
  },
  "frontend": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",
    "axios": "^1.6.2",
    "framer-motion": "^10.16.4",
    "tailwindcss": "^3.3.0"
  }
}
```

---

## 🚀 Deploy

### Frontend (Vercel)
```bash
cd frontend && vercel deploy
```

### Backend (Heroku/Render)
```bash
git push heroku main
```

---

## 🎯 Checklist Final

- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 3000
- [ ] Banco de dados criado e populado
- [ ] Todos endpoints testados
- [ ] QR Codes gerados
- [ ] Domínio configurado
- [ ] HTTPS ativado (produção)
- [ ] Variáveis de ambiente definidas
- [ ] Backups configurados

---

## 📞 Suporte Rápido

| Problema | Solução |
|----------|---------|
| "Cannot GET /convite/:slug" | Verifique se slug existe no BD |
| API 500 error | Verificar logs do backend |
| Estilos desaparecidos | `npm run build` no frontend |
| CORS error | Verifique origem em CORS config |
| MySQL connection error | Verifique .env e credenciais |

---

## 📚 Documentações Externas

- [React Docs](https://react.dev)
- [Express](https://expressjs.com)
- [Tailwind](https://tailwindcss.com)
- [MySQL](https://dev.mysql.com/doc)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite](https://vitejs.dev)

---

**Última Atualização:** Março 2026 | **Versão:** 1.0.0
