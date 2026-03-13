# WEE - Wedding Entry Experience 🎉

## Configuração Rápida

### 1. Backend (.env)

Crie um arquivo `.env` na pasta `backend/`:

```env
# Banco de Dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=wee_database
DB_PORT=3306

# Node Environment
NODE_ENV=development
PORT=5000

# Admin Token (Segurança)
ADMIN_TOKEN=admin-secret-2026

# Frontend URL (para gerar links de convite)
FRONTEND_URL=http://localhost:5173

# Informações dos Noivos
COUPLE_NAME_1=Noiva
COUPLE_NAME_2=Noivo
EVENT_DATE=2026-06-15
EVENT_TIME=15:00
EVENT_LOCATION=Salão de Eventos XYZ
```

### 2. Frontend (Vite + React)

A URL da API é configurada automaticamente para `http://localhost:5000/api`

### 3. Instalação de Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Criar Banco de Dados

```bash
mysql -u root -p < database/schema.sql
```

### 5. Iniciar a Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Estrutura de Endpoints

### Admin (Protegido com Token)

Todos os endpoints admin requerem o header `x-admin-token`:

- **POST** `/api/admin/convidados` - Criar novo convidado
  - Body: `{ "nomeExibicao": "João Silva", "tipo": "Individual" }`
  
- **GET** `/api/admin/convidados` - Listar todos os convidados
  
- **GET** `/api/admin/convidados/busca?q=João` - Buscar convidados
  
- **PUT** `/api/admin/convidados/:id` - Atualizar convidado
  
- **DELETE** `/api/admin/convidados/:id` - Deletar convidado
  
- **GET** `/api/admin/stats` - Obter estatísticas

### Convites (Público)

- **GET** `/api/convite/:slug` - Obter dados do convite

## Token de Autenticação

Por padrão, o token é: `admin-secret-2026`

Para mudar, edite o arquivo `.env` do backend com:
```env
ADMIN_TOKEN=seu-token-secreto
```

## Design

- **Cores**: Fundo #FAF9F6 (Off-white), Ouro #D4AF37, Escuro #1C1C1C
- **Fontes**: Playfair Display (serif), Inter (sans-serif)
- **Tailwind classes**: `bg-stone-50`, `text-luxury-gold`, `border-luxury-gold`, etc.

## Componentes Principais

### Frontend
- `AdminPage.jsx` - Painel administrativo com sidebar
- `InvitePage.jsx` - Página de convite com design de luxo
- `App.jsx` - Roteamento

### Backend
- `routes/admin.js` - Endpoints de administração
- `routes/invites.js` - Endpoint de convites públicos
- `config/database.js` - Configuração MySQL

## Geração de Slugs

Slugs são códigos únicos de **6 caracteres** em MAIÚSCULAS, gerados automaticamente usando `nanoid(6)`.

Exemplo: `A1B2C3`, `X9Y8Z7`

## QR Codes

Os QR Codes são gerados no painel admin usando a biblioteca `qrcode.react` e apontam para:

```
http://localhost:5173/convite/A1B2C3
```

## Features Implementadas

✅ Cadastro de convidados (Individual/Casal)
✅ Geração automática de slugs únicos
✅ Geração de QR Codes
✅ Página de convite com design de luxo
✅ Conteúdo dinâmico (Individual/Casal)
✅ Painel administrativo com sidebar
✅ Lista de convidados com busca
✅ Estatísticas em tempo real
✅ Validação de slug (404 personalizado)
✅ Middleware de autenticação simples
✅ Timeline fixa do evento

## Troubleshooting

### Erro de conexão com MySQL
- Certifique-se que MySQL está rodando: `mysql -u root -p`
- Verifique as credenciais no `.env`
- Execute o script de criação do banco: `mysql -u root -p < database/schema.sql`

### Erro ao gerar QR Code
- Instale a dependência: `npm install qrcode.react`

### Frontend não conecta ao backend
- Verifique se o backend está rodando em `http://localhost:5000`
- Verifique a URL da API nos arquivos do frontend

---

**Desenvolvido com foco em Gestão Administrativa** 💎
