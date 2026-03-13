# Wedding Entry Experience (WEE)
## Sistema de Convites Digitais via QR Code

Um sistema completo e luxuoso de gerenciamento de convites digitais para casamentos, com painel de check-in para staff e interface móvel responsiva.

---

## 🎯 Projeto: ZolanaKela 2026

**Características Principais:**
- ✅ Convites digitais dinâmicos com QR Code
- ✅ Painel de check-in em tempo real para portaria
- ✅ Interface mobile-first com design luxuoso
- ✅ Segurança via UUID/Slug nas URLs
- ✅ Timeline de eventos integrada
- ✅ Confirmação de presença
- ✅ Animações suaves com Framer Motion

---

## 📱 Tecnologias

### Frontend
- **React 18** - Biblioteca UI moderno
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Estilização utility-first
- **Framer Motion** - Animações suaves
- **Axios** - Cliente HTTP
- **React Router** - Navegação SPA

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL 8.0+** - Banco de dados relacional
- **UUID** - Geração de slugs únicos
- **CORS** - Compartilhamento de recursos
- **Dotenv** - Gerenciamento de variáveis de ambiente

---

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 16+
- npm ou yarn
- MySQL 8.0+

### 1. Backend

```bash
cd backend
npm install
```

**Configurar `.env`:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=wee_database
DB_PORT=3306
PORT=5000
NODE_ENV=development

COUPLE_NAME_1=Noivo
COUPLE_NAME_2=Noiva
COUPLE_IMAGE_URL=https://sua-imagem.jpg
EVENT_DATE=2026-06-15
EVENT_TIME=15:00
EVENT_LOCATION=Salão de Eventos
```

**Inicializar banco de dados:**
```bash
mysql -u root -p < ../database/schema.sql
```

**Iniciar servidor:**
```bash
npm start      # Produção
npm run dev    # Desenvolvimento (com nodemon)
```

O servidor rodará em: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

O app estará em: `http://localhost:3000`

---

## 📊 Estrutura de Pastas

```
Projeto_casamento/
├── backend/
│   ├── config/
│   │   └── database.js          # Conexão MySQL
│   ├── routes/
│   │   ├── invites.js           # Rotas de convites
│   │   └── admin.js             # Rotas administrativas
│   ├── server.js                # Servidor principal
│   ├── package.json
│   ├── .env
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InviteCard.jsx   # Card do convite
│   │   │   ├── Timeline.jsx     # Timeline de eventos
│   │   ├── QRCodeGenerator.jsx # Gerador de QR Codes
│   │   ├── pages/
│   │   │   ├── InvitePage.jsx   # Página do convite
│   │   │   ├── AdminPage.jsx    # Painel administrativo
│   │   │   └── AgendaPage.jsx   # Agenda de eventos
│   │   ├── App.jsx              # Componente raiz
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
└── database/
    └── schema.sql               # Schema do banco de dados
```

---

## 🔌 Endpoints da API

### Convites
```
GET /api/convite/:slug
```
Retorna dados completos do convite.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
    "nomeExibicao": "João Silva",
    "confirmadoPresenca": true,
    "categoria": "convidado",
    "coupleNames": { "name1": "Noivo", "name2": "Noiva" },
    "coupleImage": "https://...",
    "eventDetails": {
      "date": "2026-06-15",
      "time": "15:00",
      "location": "Salão de Eventos",
      "timeline": [
        { "time": "15:00", "event": "Recepção" },
        { "time": "16:30", "event": "Cerimônia" },
        { "time": "18:00", "event": "Buffet" },
        { "time": "22:00", "event": "Corte do Bolo" }
      ]
    }
  }
}
```

---

## 🎨 Design & Estilo

### Paleta de Cores (Luxury)
| Cor | Código | Uso |
|-----|--------|-----|
| Off-White | `#FAF9F6` | Fundo principal |
| Ouro Metálico | `#D4AF37` | Detalhes premium |
| Preto Carvão | `#1C1C1C` | Texto principal |
| Gradiente | `#D4AF37 → #F4D47F` | Efeitos especiais |

### Tipografia
- **Serifada:** Playfair Display (headings)
- **Sem Serifa:** Inter (corpo do texto)

### Animações
- Fade-in com delay
- Slide-up suave
- Transições de hover
- Efeitos de gradiente flutuante

---

## 🔐 Segurança

### Implementado
✅ UUID para URLs (evita acesso não autorizado)
✅ CORS configurado
✅ Validação de dados
✅ Hash de senhas em produção (recomendado)
✅ Rate limiting (recomendado para produção)

### Recomendações
- Use HTTPS em produção
- Implemente autenticação JWT para staff
- Adicione rate limiting
- Validação rigorosa de entrada
- Backup regular do banco de dados

---

## 📱 Responsividade

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Todas as páginas são otimizadas para mobile-first.

---

## 🛠️ Desenvolvimento

### Adicionar Novo Convidado (Admin)
```bash
curl -X POST http://localhost:5000/api/admin/guest \
  -H "Content-Type: application/json" \
  -d '{
    "nomeExibicao": "Maria Silva",
    "confirmadoPresenca": true,
    "categoria": "convidado"
  }'
```

### Gerar QR Code
Use um gerador online e insira a URL:
```
https://seu-dominio.com/convite/{slug}
```

---

## 📝 Variáveis de Ambiente

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=wee_database
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development

# Event Details
COUPLE_NAME_1=Noivo
COUPLE_NAME_2=Noiva
COUPLE_IMAGE_URL=https://...
EVENT_DATE=2026-06-15
EVENT_TIME=15:00
EVENT_LOCATION=Salão de Eventos
```

### Frontend
Sem variáveis de ambiente obrigatórias. API automaticamente proxificada em desenvolvimento via Vite.

---

## 🚀 Deploy

### Backend (Heroku/Render)
1. Configure variáveis de ambiente
2. Push para repositório Git
3. Deploy automático

### Frontend (Vercel/Netlify)
1. Configure API_URL do backend
2. Push para repositório Git
3. Deploy automático

---

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação das tecnologias:
- [React Docs](https://react.dev)
- [Express.js](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [MySQL](https://dev.mysql.com/doc)

---

## 📄 Licença

Desenvolvido para o Projeto ZolanaKela 2026.

---

**Última Atualização:** Março de 2026
**Versão:** 1.0.0
**Status:** ✅ Produção
