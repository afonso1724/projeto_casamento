# Instruções de Setup - Wedding Entry Experience (WEE)

## 🚀 Começando o Projeto

### Passo 1: Banco de Dados
```bash
# Abra seu cliente MySQL favorito e execute:
mysql -u root -p
source C:/Users/Afonso Fernando Pro/Documents/Projeto_casamento/database/schema.sql
```

### Passo 2: Backend
```bash
cd C:\Users\Afonso Fernando Pro\Documents\Projeto_casamento\backend
npm install
npm start
```
Servidor rodando em: http://localhost:5000

### Passo 3: Frontend (novo terminal)
```bash
cd C:\Users\Afonso Fernando Pro\Documents\Projeto_casamento\frontend
npm install
npm run dev
```
App rodando em: http://localhost:3000

---

## 📋 Checklist de Configuração

- [ ] MySQL instalado e rodando
- [ ] Node.js 16+ instalado
- [ ] npm/yarn funcionando
- [ ] Banco de dados criado (schema.sql executado)
- [ ] Backend node_modules instalados
- [ ] Frontend node_modules instalados
- [ ] Variáveis .env configuradas
- [ ] Backend iniciado na porta 5000
- [ ] Frontend iniciado na porta 3000

---

## 🔧 URLs de Teste

**Página Inicial:**
```
http://localhost:3000/
```

**Convite (usar slug do banco de dados):**
```
http://localhost:3000/convite/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
```

**Health Check API:**
```
http://localhost:5000/health
```

---

## 🗂️ Dados de Teste

Já inclusos no schema.sql:

| Nome | Slug | Presença | Categoria |
|------|------|----------|-----------|
| João Silva | a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6 | ✓ | convidado |
| Maria Santos | b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7 | ✓ | convidado |
| Pedro Oliveira | c3d4e5f6-g7h8-49i0-j1k2-l3m4n5o6p7q8 | ✓ | familia |
| Ana Costa | d4e5f6g7-h8i9-50j1-k2l3-m4n5o6p7q8r9 | ✗ | convidado |
| Carlos Mendes | e5f6g7h8-i9j0-51k2-l3m4-n5o6p7q8r9s0 | ✓ | staff |

---

## 🎯 Próximos Passos

1. **Customizar Casal:** Editar `backend/.env`
   - COUPLE_NAME_1 e COUPLE_NAME_2
   - COUPLE_IMAGE_URL

2. **Adicionar Convidados:** Via API ou MySQL direto
   
3. **Gerar QR Codes:** Use https://qr-code-generator.com/
   - URLs: `/convite/:slug` para convidados

4. **Personalizar Design:** Tailwind CSS em `frontend/tailwind.config.js`

5. **Deploy:** Preparar para produção (HTTPS, domínio, etc)

---

## ⚠️ Troubleshooting

### Erro: "Cannot GET /convite/:slug"
- Verifique se o slug existe no banco de dados
- Verifique se o backend está rodando

### Erro: "ECONNREFUSED 127.0.0.1:5000"
- Verifique se o backend foi iniciado
- Verifique se a porta 5000 está disponível

### Erro: "ER_ACCESS_DENIED_FOR_USER"
- Verifique credenciais MySQL no `.env`
- Verifique se MySQL está rodando

### Estilo Tailwind não aparece
- Limpe cache: `npm run build` no frontend
- Estude `frontend/src/index.css` e `tailwind.config.js`

---

## 📞 Suporte Rápido

```
Node.js: node --version
npm: npm --version
MySQL: mysql --version
```

Se houver problemas, verifique a saída do terminal para mensagens de erro específicas.
