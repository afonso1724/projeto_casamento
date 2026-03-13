# 🧪 Guia de Testes WEE - Wedding Entry Experience

## Pré-requisitos

- Backend rodando: `http://localhost:5000`
- Frontend rodando: `http://localhost:5173`
- MySQL com banco `wee_database` criado
- Token padrão: `admin-secret-2026`

---

## ✅ Teste 1: Criar Convidado (Individual)

### Via cURL

```bash
curl -X POST http://localhost:5000/api/admin/convidados \
  -H "Content-Type: application/json" \
  -H "x-admin-token: admin-secret-2026" \
  -d '{
    "nomeExibicao": "João Silva",
    "tipo": "Individual",
    "categoria": "convidado"
  }'
```

### Resposta Esperada

```json
{
  "success": true,
  "message": "Convidado criado com sucesso",
  "data": {
    "id": null,
    "slug": "A1B2C3",
    "nomeExibicao": "João Silva",
    "tipo": "Individual",
    "conviteUrl": "http://localhost:5173/convite/A1B2C3"
  }
}
```

---

## ✅ Teste 2: Criar Convidado (Casal)

### Via cURL

```bash
curl -X POST http://localhost:5000/api/admin/convidados \
  -H "Content-Type: application/json" \
  -H "x-admin-token: admin-secret-2026" \
  -d '{
    "nomeExibicao": "Maria & Pedro Santos",
    "tipo": "Casal",
    "categoria": "convidado"
  }'
```

### Resposta Esperada

```json
{
  "success": true,
  "message": "Convidado criado com sucesso",
  "data": {
    "id": null,
    "slug": "D4E5F6",
    "nomeExibicao": "Maria & Pedro Santos",
    "tipo": "Casal",
    "conviteUrl": "http://localhost:5173/convite/D4E5F6"
  }
}
```

---

## ✅ Teste 3: Listar Convidados

### Via cURL

```bash
curl -X GET http://localhost:5000/api/admin/convidados \
  -H "x-admin-token: admin-secret-2026"
```

### Resposta Esperada

```json
{
  "success": true,
  "total": 2,
  "data": [
    {
      "id": 1,
      "slug": "A1B2C3",
      "nomeExibicao": "João Silva",
      "tipo": "Individual",
      "confirmadoPresenca": false,
      "categoria": "convidado",
      "criadoEm": "2026-03-11T10:30:00.000Z"
    },
    {
      "id": 2,
      "slug": "D4E5F6",
      "nomeExibicao": "Maria & Pedro Santos",
      "tipo": "Casal",
      "confirmadoPresenca": false,
      "categoria": "convidado",
      "criadoEm": "2026-03-11T10:31:00.000Z"
    }
  ]
}
```

---

## ✅ Teste 4: Buscar Convidado

### Via cURL

```bash
curl -X GET "http://localhost:5000/api/admin/convidados/busca?q=João" \
  -H "x-admin-token: admin-secret-2026"
```

### Resposta Esperada

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "slug": "A1B2C3",
      "nomeExibicao": "João Silva",
      "tipo": "Individual",
      "confirmadoPresenca": false,
      "chegouAoEvento": false
    }
  ]
}
```

---

## ✅ Teste 5: Obter Dados do Convite (Público)

### Via cURL

```bash
curl -X GET http://localhost:5000/api/convite/A1B2C3
```

### Resposta Esperada

```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "A1B2C3",
    "nomeExibicao": "João Silva",
    "tipo": "Individual",
    "confirmadoPresenca": false,
    "categoria": "convidado",
    "coupleNames": {
      "name1": "Os Noivos",
      "name2": ""
    },
    "coupleImage": null,
    "eventDetails": {
      "date": "2026-06-15",
      "time": "15:00",
      "location": "Local do Evento",
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

## ✅ Teste 6: Convite Não Encontrado (404)

### Via cURL

```bash
curl -X GET http://localhost:5000/api/convite/INVALID
```

### Resposta Esperada

```json
{
  "success": false,
  "message": "Convite não encontrado",
  "statusCode": 404
}
```

---

## ✅ Teste 7: Sem Token (401)

### Via cURL

```bash
curl -X GET http://localhost:5000/api/admin/convidados
```

### Resposta Esperada

```json
{
  "success": false,
  "message": "Acesso negado. Token inválido ou ausente."
}
```

---

## ✅ Teste 8: Token Inválido (401)

### Via cURL

```bash
curl -X GET http://localhost:5000/api/admin/convidados \
  -H "x-admin-token: token-errado"
```

### Resposta Esperada

```json
{
  "success": false,
  "message": "Acesso negado. Token inválido ou ausente."
}
```

---

## ✅ Teste 9: Atualizar Convidado

### Via cURL

```bash
curl -X PUT http://localhost:5000/api/admin/convidados/1 \
  -H "Content-Type: application/json" \
  -H "x-admin-token: admin-secret-2026" \
  -d '{
    "nomeExibicao": "João Pedro Silva",
    "tipo": "Individual"
  }'
```

### Resposta Esperada

```json
{
  "success": true,
  "message": "Convidado atualizado com sucesso"
}
```

---

## ✅ Teste 10: Deletar Convidado

### Via cURL

```bash
curl -X DELETE http://localhost:5000/api/admin/convidados/1 \
  -H "x-admin-token: admin-secret-2026"
```

### Resposta Esperada

```json
{
  "success": true,
  "message": "Convidado deletado com sucesso"
}
```

---

## ✅ Teste 11: Obter Estatísticas

### Via cURL

```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "x-admin-token: admin-secret-2026"
```

### Resposta Esperada

```json
{
  "success": true,
  "data": {
    "totalConvidados": 2,
    "confirmados": 0,
    "porTipo": {
      "Individual": 1,
      "Casal": 1
    }
  }
}
```

---

## 🎯 Testes de Interface (Manual)

### Home Page
- URL: `http://localhost:5173/`
- ✓ Logo e título aparecem
- ✓ Botão "Painel Admin" funciona
- ✓ Design responsivo em mobile

### Admin Panel
- URL: `http://localhost:5173/admin`
- ✓ Sidebar carrega corretamente
- ✓ Abas funcionam (Cadastro, Lista, Stats)
- ✓ Formulário de cadastro envia dados corretamente
- ✓ QR Code é gerado e pode ser baixado
- ✓ Lista de convidados mostra todos
- ✓ Busca funciona em tempo real
- ✓ Estatísticas carregam corretamente

### Invite Page
- URL: `http://localhost:5173/convite/A1B2C3` (slug válido)
- ✓ Carrega dados do convite
- ✓ Exibe nome e tipo corretos
- ✓ Mostra timeline do evento
- ✓ Design de luxo ativo
- ✓ Animações funcionam

### Error Page (404)
- URL: `http://localhost:5173/convite/INVALID`
- ✓ Mostra erro personalizado
- ✓ Botão "Voltar" funciona

---

## 🔧 Validações de Negócio

### Slug Validation
- [x] Slug tem exatamente 6 caracteres
- [x] Slug é único no banco
- [x] Slug é gerado em maiúsculas
- [x] Slug não pode ser repetido

### Tipo Validation
- [x] Tipo aceita apenas "Individual" ou "Casal"
- [x] Tipo é obrigatório
- [x] Conteúdo do convite muda com o tipo

### Nome Validation
- [x] Nome é obrigatório
- [x] Nome não pode ser vazio ou só espaços
- [x] Nome é trimado

### Token Validation
- [x] Token é obrigatório em rotas protegidas
- [x] Token inválido retorna 401
- [x] Token é passado no header `x-admin-token`

---

## 📊 Checklist de Implementação

### Backend
- [x] Conexão MySQL funcionando
- [x] Pool de conexões configurado
- [x] Todos os endpoints funcionando
- [x] Middleware de autenticação ativo
- [x] Validações em lugar
- [x] Tratamento de erros completo
- [x] Logs console apropriados

### Frontend
- [x] Admin Page com sidebar
- [x] Formulário de cadastro
- [x] QR Code generator
- [x] Lista de convidados
- [x] Busca funcional
- [x] Estatísticas
- [x] Página de convite luxo
- [x] Página 404 customizada
- [x] Responsivo em mobile

### Database
- [x] Tabela criada
- [x] Índices adicionados
- [x] Dados de teste inseridos
- [x] Timestamps automáticos

---

## 🐛 Debugging Tips

### Erro de Conexão MySQL
```bash
# Verifique se MySQL está rodando
mysql -u root -p

# Verifique as credenciais em backend/.env
cat backend/.env
```

### Erro 401 (Token)
```bash
# Verifique se está enviando o token correto
# Header: x-admin-token: admin-secret-2026

# Ou configure um novo token em .env
ADMIN_TOKEN=seu-novo-token
```

### QR Code não renderiza
```bash
# Instale a dependência
cd frontend
npm install qrcode.react
```

### Frontend não conecta ao backend
```bash
# Verifique a URL da API em AdminPage.jsx
const API_URL = 'http://localhost:5000/api';

# Certifique-se que backend está rodando
cd backend && npm run dev
```

---

## 📈 Performance Check

```bash
# Tempo de resposta esperado: < 200ms
time curl http://localhost:5000/api/health

# Teste de carga (create-load-test)
npm install -g artillery

artillery quick --count 100 --num 10 \
  http://localhost:5000/api/convite/A1B2C3
```

---

## ✨ Próximos Testes (Opcionais)

- [ ] Teste de unicode em nomes (acentos)
- [ ] Teste com nomes muito longos
- [ ] Teste de concorrência (múltiplas requisições)
- [ ] Teste de performance com 10k+ convidados
- [ ] Teste de responsividade em tablets
- [ ] Teste de acessibilidade (WCAG)

---

**Status**: ✅ Testes Prontos para Execução

Elaborado com foco em cobertura completa do sistema 💎
