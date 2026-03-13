# Guia de Personalização - WEE

## 🎨 Customizar Identidade Visual

### 1. Paleta de Cores

Editar `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      'luxury-bg': '#FAF9F6',        // Fundo principal
      'luxury-gold': '#D4AF37',      // Cor primária
      'luxury-dark': '#1C1C1C',      // Texto
    },
  },
}
```

**Exemplos de Paletas Alternativas:**

**Paleta Rose Gold:**
```
Fundo: #FFF5F3
Gold: #E8B4B8
Texto: #2D1B1D
```

**Paleta Emerald Luxury:**
```
Fundo: #FFFEFB
Green: #2F5D50
Texto: #0F1F1C
```

### 2. Fontes

Editar `frontend/src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;600&display=swap');

h1, h2, h3 {
  font-family: 'Playfair Display', serif; /* Mude para outra fonte serifada */
}

p { 
  font-family: 'Montserrat', sans-serif;  /* Mude para outra sans-serif */
}
```

### 3. Animações

Editar `frontend/src/components/InviteCard.jsx`:

```javascript
// Alternar duração das animações
transition={{ duration: 0.6 }}  /* Mude para 0.3 (mais rápido) ou 1.0 (mais lento) */

// Adicionar novos efeitos
whileHover={{ scale: 1.02 }}   /* Aumentar a escala ao passar mouse */
whileTap={{ scale: 0.98 }}     /* Reduzir ao clicar */
```

---

## 👰 Customizar Informações do Casal

Editar `backend/.env`:

```env
# Nome dos noivos
COUPLE_NAME_1=João Silva
COUPLE_NAME_2=Maria Silva

# URL da imagem do casal
COUPLE_IMAGE_URL=https://sua-imagem-hospedada.com/casal.jpg

# Detalhes do evento
EVENT_DATE=2026-06-15
EVENT_TIME=15:00
EVENT_LOCATION=Salão de Eventos Luxo
```

**Opções de hospedagem de imagens livres:**
- Cloudinary
- Imgur
- Firebase Storage
- AWS S3

---

## 📅 Customizar Timeline de Eventos

Editar `backend/routes/invites.js`:

```javascript
timeline: [
  { time: '15:00', event: 'Recepção' },
  { time: '16:30', event: 'Cerimônia' },
  { time: '18:00', event: 'Buffet' },
  { time: '22:00', event: 'Corte do Bolo' },
  // Adicione mais eventos aqui
  { time: '23:30', event: 'Saída dos Noivos' },
]
```

---

## 🔤 Customizar Textos

### Página de Convite

Editar `frontend/src/components/InviteCard.jsx`:

```javascript
<h2 className="text-2xl font-serif font-bold text-luxury-dark mb-2">
  Você é especial
</h2>
<p className="text-sm text-gray-600">para nós</p>
```

### Saudação do Convite

```javascript
<p className="text-lg font-serif text-luxury-dark">
  O casal <span className="font-bold text-luxury-gold">{data.coupleNames.name1} & {data.coupleNames.name2}</span>
</p>
<p className="text-lg font-serif text-luxury-dark">
  tem a honra de convidar<br />
  <span className="text-2xl font-bold text-luxury-gold mb-2">{data.nomeExibicao}</span>
</p>
```

---

## 🎯 Customizar Categorias de Convidados

Editar `database/schema.sql`:

```sql
-- Adicionar novas categorias conforme necessário
categoria VARCHAR(100) DEFAULT 'convidado' -- Pode ser: convidado, familia, staff, padrinhos, etc.
```

---

## 📱 Customizar Layout Mobile

Editar `frontend/src/index.css`:

```css
@media (max-width: 768px) {
  h1 {
    font-size: 2.5rem;  /* Alterar tamanho para mobile */
  }
  
  /* Adicionar breakpoints customizados */
  .luxury-button {
    padding: 1.5rem;    /* Botões maiores em mobile */
  }
}
```

---

## 🌐 Personalizar Domínio

### URLs dos QR Codes em Produção

Após fazer deploy, alterar URLs:

```
https://seu-dominio.com/convite/:slug
```

---

## 🔒 Personalizar Segurança

### Autenticação de Admin

Editar `backend/routes/admin.js` para adicionar validações adicionais de segurança conforme necessário para sua aplicação.

---

## 🎨 Adicionar Logo

Editar `frontend/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="seu-logo.svg" />
```

Editar `frontend/src/pages/InvitePage.jsx`:

```javascript
<img 
  src="/logo.png" 
  alt="Logo"
  className="w-20 h-20 mb-8"
/>
```

---

## 💾 Adicionar Novos Campos ao Banco

Exemplo: Adicionar telefone do convidado

```sql
ALTER TABLE convidados ADD COLUMN telefone VARCHAR(20);
```

Depois atualizar:
1. Backend (models/queries)
2. Frontend (componentes que exibem dados)

---

## 🚀 Deploy & Customização

### Vercel (Frontend)
```bash
cd frontend
npm run build
vercel deploy
```

### Heroku (Backend)
```bash
cd backend
heroku create seu-app-name
git push heroku main
```

---

## 📊 Extraindo Dados

### Exportar Lista de Convidados

```bash
mysql -u root -p wee_database -e "SELECT * FROM convidados;" > convidados.csv
```

---

## 🆘 Troubleshooting de Personalização

**Estilos Tailwind não aparecem:**
```bash
# No frontend/
npm run build
```

**Imagem do casal não carrega:**
- Verifique URL em COUPLE_IMAGE_URL
- Teste URL no navegador
- Considere usar CORS proxy se necessário

**Timeline não atualiza:**
- Salve arquivo invites.js
- Reinicie servidor backend
- Limpe cache de browser

---

## 📞 Recursos Úteis

- [Tailwind Color Generator](https://www.tailwindshades.com/)
- [Google Fonts](https://fonts.google.com/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Color Theory Wedding](https://99designs.com/blog/design-trends/wedding-color-schemes/)

Última Atualização: Março 2026
