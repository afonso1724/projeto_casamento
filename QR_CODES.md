# Geração de QR Codes - WEE

## 📱 O que são QR Codes?

QR Code (Quick Response) é um código de barras bidimensional que pode ser escaneado com smartphones para acessar informações instantaneamente.

**Benefícios para seu casamento:**
- ✓ Elegante e moderno
- ✓ Sem necessidade de imprimir URLs
- ✓ Redireciona automaticamente para convite
- ✓ Funciona offline (não precisa internet para escanear, só para carregar)

---

## 🔗 URLs para QR Codes

### Para Convidados (Convite)
```
https://seu-dominio.com/convite/{SLUG}
```

**Exemplo:**
```
https://wee-app.vercel.app/convite/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
```

---

## 🛠️ Geradores de QR Code Recomendados

### 1. **QR Code Generator** (Gratuito, Offline)
📍 https://www.qr-code-generator.com/

**Passo a passo:**
1. Acesse o site
2. Cole a URL completa
3. Customize cores (ouro e preto para WEE)
4. Baixe como PNG

**Vantagens:**
- Customização de cores
- Sem marca d'água
- Offline
- Histórico gratuito

### 2. **QR Code Monkey** (Gratuito)
📍 https://www.qr-code-monkey.com/

**Recursos especiais:**
- Upload de logo no centro
- Padrões e cores personalizadas
- Download em alta resolução

### 3. **Unitag** (Freemium)
📍 https://www.unitag.io/

**Premium features:**
- Rastreamento de scans
- Analytics em tempo real
- QR codes dinâmicos

---

## 🎨 Personalização de QR Codes (Luxuoso)

### Cores Recomendadas (WEE)
```
Fundo: #FAF9F6 (Off-white)
Padrão: #D4AF37 (Ouro)
Borda: #1C1C1C (Preto)
```

### Dimensões Recomendadas
- **Tamanho mínimo:** 100x100 pixels
- **Tamanho ideal:** 300x300 pixels
- **Tamanho grande:** 500x500 pixels (para posters)

### Formatos Suportados
- PNG (melhor para web)
- SVG (escalável)
- PDF (para impressão)
- EPS (para design profissional)

---

## 📋 Fluxo de Criação

### Passo 1: Gerar Slugs para Convidados
No seu backend:
```bash
# Já gerado automaticamente com UUID
# Exemplo de slug: a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
```

Ou use geradores online:
- https://www.uuidgenerator.net/
- https://www.guidgenerator.com/

### Passo 2: Construir URLs Completas
```
URL Base: https://seu-dominio.com
Tipo: /convite/ (convidados)
Slug: a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6

URL Final: https://seu-dominio.com/convite/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
```

### Passo 3: Gerar QR Code
1. Abra gerador de QR Code
2. Cole a URL completa
3. Customize com cores WEE
4. Baixe em PNG de alta resolução

### Passo 4: Incorporar ao Convite
- Imprima junto com convite físico
- Coloque em convite digital (email/WhatsApp)
- Displayed em posters na entrada

---

## 📊 Exemplo Prático

**Convidado: João Silva**
- ID no banco: 1
- Slug: a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6

**URL do Convite:**
```
https://seu-dominio.com/convite/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
```

---

## 🔐 Dicas de Segurança

### ✅ Fazer
- Usar URLs únicas (UUIDs)
- Não reutilizar slugs
- Testar cada QR Code antes de imprimir
- Manter lista de slugs em local seguro

### ❌ Não Fazer
- Incluir nomes diretos na URL
- URLs sequenciais (1, 2, 3...)
- Compartilhar QR codes públicamente
- Usar URLs muito longas (difícil de scanear)

---

## 🖨️ Impressão de QR Codes

### Tamanho Recomendado
| Uso | Tamanho | Resolução |
|-----|--------|-----------|
| Convite | 4x4 cm | 300 DPI |
| Poster | 10x10 cm | 300 DPI |
| Acessório | 2x2 cm | 300 DPI |

### Papel Recomendado
- Papel premium luxo (200+ gsm)
- Acabamento fosco (mais elegante)
- Branco natural ou off-white (combina com tema)

### Dicas de Impressão
1. Imprima em alta resolução (300 DPI)
2. Teste antes de imprimir em lote
3. Use impressora laser para melhor qualidade
4. Deixe margem branca ao redor do QR

---

## 📱 Testando QR Codes

### Antes de Imprimir

1. **Gere o QR completo**
2. **Teste com seu smartphone:**
   - Use câmera nativa (iOS 11+) ou app Leitor QR
   - Aponte para a tela do computador
   - Verifique se a URL está correta

3. **Teste variações de distância:**
   - De perto (5 cm)
   - Normal (30 cm)
   - De longe (50+ cm)

4. **Teste em diferentes iluminações:**
   - Luz natural
   - Luz artificial
   - Ambiente escuro

### Ferramentas de Teste
```
QR Scanner Online: https://products.aspose.app/barcode/en/scan
```

---

## 📈 Analytics (Opcional)

Para rastrear cliques em QR Codes, use serviços como:

### **Bitly** (Encurtador com Analytics)
```
1. Crie conta em https://bitly.com
2. Encurte/customize sua URL
3. Gere QR Code do link encurtado
4. Acesse dashboard para estatísticas
```

**Exemplo:**
```
URL Longa: https://seu-dominio.com/convite/a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6
URL Bitly: https://bit.ly/convite-joao
QR Code: [QR do link Bitly]
```

### **Statisticaly Dados Disponíveis:**
- Tempo de scan
- Localização do scan
- Tipo de dispositivo
- Sistema operacional
- Navegador usado

---

## 🎁 Ideias Criativas

### 1. **Cardaço Personalizado**
- Coloque QR Code em cartão anexado no convite
- Use papel texturizado dourado

### 2. **Gravura no Espelho**
- Grave QR Code em acrílico/espelho para mesa de entrada

### 3. **Marcador de Página**
- QR Code em marcador de página com tema do casamento

### 4. **Tabela de Lugares**
- Cada mesa tem QR Code único para check-in por mesa

### 5. **Pulseira de Entrada**
- Selinho com QR Code integrado

---

## 🚀 Checklist de Implementação

- [ ] Gerar slugs para todos os convidados
- [ ] Converter slugs em URLs completas
- [ ] Testar 3-5 QR Codes em smartphone real
- [ ] Gerar versão final de todos os QR Codes
- [ ] Revisar qualidade de impressão
- [ ] Imprimir exemplos de teste
- [ ] Guardar backup digital de todos os QR Codes
- [ ] Documentar qual QR Code é de qual convidado

---

## 📞 Troubleshooting de QR Code

### QR Code não funciona
- [ ] Teste em outro smartphone
- [ ] Verifique se a URL está correta
- [ ] Tente aumentar o tamanho da imagem
- [ ] Teste com outro app de leitura QR

### QR Code muito escuro/claro
- Ajuste cores no gerador
- Use contraste maior
- Escolha cores diferentes

### Erro "URL inválida" ao scanear
- Verifique URL digitada corretamente
- Teste a URL direto no navegador
- Garanta que o servidor está online

---

## 📄 Modelos de QR Code

Salvamos exemplos em:
- `frontend/public/qr-codes/` (quando implementado)

Para usar imagens alojadas:
```html
<!-- Em seu HTML/design -->
<img src="path/to/qr-code.png" alt="QR Code">
```

---

**Última Atualização:** Março 2026
**Versão:** 1.0.0
