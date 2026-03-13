# 🏗️ Arquitetura WEE - Wedding Entry Experience

## Fluxo Geral do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                     WEDDING ENTRY EXPERIENCE                     │
└─────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   Visitante │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
            │   QR Code    │ │  Home Page  │ │   Admin Link │
            │   (Convite)  │ │  (/admin)   │ │  (/admin)    │
            └──────┬───────┘ └─────┬───────┘ └──────┬───────┘
                   │               │                │
                   ▼               ▼                ▼
            ┌──────────────────────────────────────────┐
            │      FRONTEND (React + Vite)              │
            │  ✓ InvitePage (/convite/:slug)           │
            │  ✓ AdminPage (/admin)                    │
            │  ✓ AgendaPage (/agenda/:slug)            │
            └──────────────┬───────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
            ┌──────────────┐ ┌──────────────┐
            │ Public API   │ │ Admin API    │
            │ /convite/:s  │ │ /admin/*     │
            │              │ │ [Protected]  │
            └──────┬───────┘ └──────┬───────┘
                   │                │
                   └────────┬───────┘
                            ▼
                   ┌──────────────────┐
                   │  BACKEND          │
                   │  (Node + Express) │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │  MySQL Database  │
                   │  (convidados)    │
                   └──────────────────┘
```

---

## 🔄 Fluxo de Cadastro de Convidado

```
ADMINISTRADOR
    │
    ├─► Acessa /admin
    │   └─► Faz login (token na sessão)
    │
    ├─► Preenche formulário
    │   └─ Nome: "João Silva" ou "Maria & Pedro"
    │   └─ Tipo: Individual / Casal
    │
    ├─► Clica "Criar Convidado"
    │
    ▼
┌──────────────────────────────────────┐
│   Frontend (AdminPage)                │
│   POST /api/admin/convidados          │
│   {                                   │
│     "nomeExibicao": "João Silva",    │
│     "tipo": "Individual"              │
│   }                                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   Backend (admin.js)                  │
│   1. Valida dados                     │
│   2. Gera slug único: A1B2C3         │
│   3. Insere no banco                  │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   MySQL insere registro               │
│   {                                   │
│     slug: "A1B2C3",                  │
│     nome_exibicao: "João Silva",     │
│     tipo: "Individual",               │
│     confirmado_presenca: 0            │
│   }                                   │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   Frontend recebe resposta            │
│   Gera QR Code apontando para:        │
│   http://localhost:5173/convite/     │
│   A1B2C3                             │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   Admin pode:                         │
│   ✓ Baixar QR Code (PNG)             │
│   ✓ Imprimir convite                 │
│   ✓ Escanear com celular             │
└──────────────────────────────────────┘
```

---

## 📱 Fluxo de Visualização do Convite

```
CONVIDADO
    │
    ├─► Recebe convite impresso
    │
    ├─► Escaneia QR Code
    │   └─► Abre: /convite/A1B2C3
    │
    ▼
┌──────────────────────────────────────┐
│   Frontend (InvitePage)               │
│   GET /api/convite/A1B2C3            │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│   Backend (invites.js)                │
│   1. Valida slug                      │
│   2. Busca no banco                   │
│   3. Verifica se existe (404 se não)  │
└──────────────┬───────────────────────┘
               │
          ┌────┴────┐
          │          │
    ┌─────▼──┐  ┌────▼─────┐
    │ Existe │  │ Não existe│
    └────┬───┘  └────┬─────┘
         │           │
         ▼           ▼
     ┌───────┐  ┌─────────┐
     │Mostrar│  │Erro 404 │
     │Convite│  │Customizado
     └─────┬─┘  └────┬────┘
           │         │
           └────┬────┘
                │
                ▼
        ┌───────────────┐
        │ Design Luxo   │
        │ - Fundo bege  │
        │ - Texto ouro  │
        │ - Fontes serif│
        │ - Timeline    │
        └───────────────┘
```

---

## 🛡️ Arquitetura de Segurança

```
┌─────────────────────────────────────────────────────────┐
│                   Requisição do Cliente                  │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │ É rota pública? │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        │                 │
   ┌────▼────┐     ┌─────▼────────┐
   │   SIM   │     │     NÃO      │
   └────┬────┘     └──────┬───────┘
        │                 │
        ▼                 ▼
   ┌─────────┐    ┌──────────────────┐
   │Processa │    │ Tem token?       │
   │direto   │    └────┬─────────┬───┘
   └─────────┘         │         │
                  ┌────▼──┐ ┌────▼──┐
                  │ SIM   │ │ NÃO   │
                  └──┬────┘ └───┬───┘
                     │          │
                     ▼          ▼
                 ┌────────┐ ┌───────┐
                 │Token é │ │Erro   │
                 │válido? │ │401    │
                 └─┬──┬───┘ └───────┘
                   │  │
              ┌────▼┐ │
           SIM│     │ │NÃO
              │  ┌──▼─▼───┐
              │  │Erro 401│
              │  └─────────┘
              ▼
        ┌───────────────┐
        │Processa req.  │
        │e retorna dados│
        └───────────────┘
```

---

## 📊 Estrutura do Banco de Dados

```
┌─────────────────────────────────────────────┐
│           TABELA: convidados                 │
├─────────────────────────────────────────────┤
│ id (INT, PK, AUTO_INCREMENT)                │
│ slug (VARCHAR 10, UNIQUE) → A1B2C3         │
│ nome_exibicao (VARCHAR 255)                 │
│ tipo (VARCHAR 20) → Individual / Casal      │
│ confirmado_presenca (TINYINT 0/1)           │
│ categoria (VARCHAR 100)                     │
│ created_at (TIMESTAMP)                      │
│ updated_at (TIMESTAMP ON UPDATE)            │
├─────────────────────────────────────────────┤
│ INDICES:                                    │
│ - idx_slug                                  │
│ - idx_tipo                                  │
│ - idx_created_at                            │
└─────────────────────────────────────────────┘

Exemplo de Registros:
┌────┬────────┬──────────────┬────────────┐
│id  │ slug   │ nome_exibicao │ tipo       │
├────┼────────┼──────────────┼────────────┤
│ 1  │ A1B2C3 │ João Silva   │ Individual │
│ 2  │ D4E5F6 │ Maria & Pedro│ Casal      │
│ 3  │ G7H8I9 │ Ana Costa    │ Individual │
└────┴────────┴──────────────┴────────────┘
```

---

## 🎨 Componentes Frontend

```
┌─────────────────────────────────────────────┐
│            APPLICATION ROOT                  │
│           (Router + Routes)                  │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
    ▼         ▼         ▼
┌────────┐ ┌──────┐ ┌──────────┐
│  Home  │ │Admin │ │  Invite  │
│ Page   │ │ Page │ │   Page   │
└────────┘ └──┬───┘ └─────┬────┘
              │           │
       ┌──────▼────────┐  │
       │ AdminPage.jsx │  │
       ├───────────────┤  │
       │ • Sidebar     │  │
       │ • 3 Views     │  │
       │   - Cadastro  │  │
       │   - Lista     │  │
       │   - Stats     │  │
       └───────────────┘  │
                          │
                   ┌──────▼─────────┐
                   │InvitePage.jsx  │
                   ├────────────────┤
                   │ • Design Luxo   │
                   │ • Conteúdo Dinâ │
                   │ • Timeline      │
                   │ • 404 Custom    │
                   └────────────────┘
```

---

## 🔌 API Endpoints Estrutura

```
FRONTEND
   │
   ├─► GET / (HomePage)
   │
   ├─► GET /admin (AdminPage)
   │   ├─► GET /api/admin/convidados [TOKEN]
   │   ├─► GET /api/admin/convidados/busca [TOKEN]
   │   ├─► POST /api/admin/convidados [TOKEN]
   │   ├─► PUT /api/admin/convidados/:id [TOKEN]
   │   ├─► DELETE /api/admin/convidados/:id [TOKEN]
   │   └─► GET /api/admin/stats [TOKEN]
   │
   ├─► GET /convite/:slug (InvitePage)
   │   └─► GET /api/convite/:slug [PUBLIC]
   │
   └─► PUT /api/convite/:slug/confirmar (Confirm Presence)
       └─► GET /api/convite/:slug [PUBLIC]

Legend:
  [TOKEN] = Requer header 'x-admin-token'
  [PUBLIC] = Sem autenticação
```

---

## 📈 Fluxo de Dados

```
User Input
   │
   ▼
┌──────────────────────┐
│ React Component      │
│ (State + Handlers)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Axios Request        │
│ (API Call)           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Express Route        │
│ (Middleware)         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Validação            │
│ (Body, Auth, etc)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ MySQL Query          │
│ (CRUD Operations)    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ JSON Response        │
│ (Status + Data)      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ React Updates        │
│ (State + Re-render)  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ UI Display           │
│ (with Animations)    │
└──────────────────────┘
```

---

## ⚡ Performance & Escalabilidade

```
┌─────────────────────────────────────┐
│ Frontend Optimizations              │
├─────────────────────────────────────┤
│ ✓ Code splitting (Vite)             │
│ ✓ Lazy loading                      │
│ ✓ CSS modules                       │
│ ✓ Image optimization                │
│ ✓ Animations with Framer Motion     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Backend Optimizations               │
├─────────────────────────────────────┤
│ ✓ Connection pooling (10 max)       │
│ ✓ Query optimization with indices   │
│ ✓ Error handling & logging          │
│ ✓ CORS enabled properly             │
│ ✓ Environment variables for config  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Database Optimizations              │
├─────────────────────────────────────┤
│ ✓ Proper indexing on slug, tipo     │
│ ✓ Auto-cleanup with timestamps      │
│ ✓ UTF8mb4 encoding support          │
│ ✓ Foreign key constraints ready     │
└─────────────────────────────────────┘
```

---

Desenvolvido com foco em **Gestão Administrativa** 💎
