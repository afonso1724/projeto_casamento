#!/bin/bash

# Wedding Entry Experience - Installation Script
# This script automates the setup process for the entire project

echo "================================================"
echo "Wedding Entry Experience (WEE) - Setup Script"
echo "================================================"
echo ""

# Check Node.js
echo "✓ Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js não encontrado. Por favor, instale Node.js 16+"
    exit 1
fi
echo "✓ Node.js: $(node --version)"

# Check npm
echo "✓ Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "✗ npm não encontrado."
    exit 1
fi
echo "✓ npm: $(npm --version)"

# Check MySQL
echo "✓ Verificando MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "⚠ MySQL não encontrado. Você precisa instalá-lo manualmente."
    echo "   https://dev.mysql.com/downloads/mysql/"
fi

echo ""
echo "================================================"
echo "Instalando Backend..."
echo "================================================"
cd backend
npm install
echo "✓ Backend instalado com sucesso!"

echo ""
echo "================================================"
echo "Instalando Frontend..."
echo "================================================"
cd ../frontend
npm install
echo "✓ Frontend instalado com sucesso!"

echo ""
echo "================================================"
echo "Setup Concluído!"
echo "================================================"
echo ""
echo "Próximos passos:"
echo "1. Configure o banco de dados MySQL com:"
echo "   mysql -u root -p < database/schema.sql"
echo ""
echo "2. Atualize as variáveis de ambiente em backend/.env"
echo ""
echo "3. Inicie o backend com:"
echo "   cd backend && npm start"
echo ""
echo "4. Em outro terminal, inicie o frontend com:"
echo "   cd frontend && npm run dev"
echo ""
echo "5. Acesse http://localhost:3000 no navegador"
echo ""
