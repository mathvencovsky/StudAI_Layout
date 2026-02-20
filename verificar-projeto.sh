#!/bin/bash

# Script de Verificação do Projeto StudAI
# Este script verifica se todos os arquivos necessários existem

echo "🔍 Verificando estrutura do projeto StudAI..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de erros
ERRORS=0

# Função para verificar arquivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 ${RED}(FALTANDO)${NC}"
        ((ERRORS++))
    fi
}

# Função para verificar diretório
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${RED}✗${NC} $1/ ${RED}(FALTANDO)${NC}"
        ((ERRORS++))
    fi
}

echo "📦 Arquivos principais:"
check_file "package.json"
check_file "index.html"
check_file "vite.config.ts"
check_file "tsconfig.json"
echo ""

echo "📁 Diretórios principais:"
check_dir "src"
check_dir "src/components"
check_dir "src/components/landing"
check_dir "src/i18n"
check_dir "src/routes"
check_dir "node_modules"
echo ""

echo "🎨 Componentes da Landing Page:"
check_file "src/components/landing/landing-page.tsx"
check_file "src/components/landing/landing-header.tsx"
check_file "src/components/landing/LandingHero.tsx"
check_file "src/components/landing/auth-card.tsx"
check_file "src/components/landing/logo-strip-section.tsx"
check_file "src/components/landing/product-section.tsx"
check_file "src/components/landing/how-it-works.tsx"
check_file "src/components/landing/trust-section.tsx"
check_file "src/components/landing/testimonials.tsx"
check_file "src/components/landing/pricing-section.tsx"
check_file "src/components/landing/faq-section.tsx"
check_file "src/components/landing/final-cta.tsx"
check_file "src/components/landing/landing-footer.tsx"
check_file "src/components/landing/ui.tsx"
check_file "src/components/landing/index.ts"
echo ""

echo "🌐 Internacionalização:"
check_file "src/i18n/i18n.ts"
check_file "src/i18n/locales/pt-BR/common.ts"
check_file "src/i18n/locales/en/common.ts"
echo ""

echo "🎨 Estilos:"
check_file "src/index.css"
echo ""

echo "🛣️ Rotas:"
check_file "src/routes/__root.tsx"
check_file "src/routes/index.tsx"
check_file "src/main.tsx"
echo ""

echo "📚 Documentação:"
check_file "README.md"
check_file "LOVABLE_DESIGN_MATCH.md"
check_file "COMO_INICIAR.md"
echo ""

# Verificar versões do Node e npm
echo "🔧 Versões instaladas:"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
    
    # Verificar se a versão é >= 20.20.0
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 20 ]; then
        echo -e "  ${GREEN}→ Versão adequada (>= 20.20.0)${NC}"
    else
        echo -e "  ${YELLOW}⚠ Versão recomendada: >= 20.20.0${NC}"
    fi
else
    echo -e "${RED}✗${NC} Node.js não encontrado"
    ((ERRORS++))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm não encontrado"
    ((ERRORS++))
fi
echo ""

# Verificar se node_modules existe
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependências instaladas"
else
    echo -e "${YELLOW}⚠${NC} Dependências não instaladas"
    echo -e "  ${YELLOW}→ Execute: npm install${NC}"
fi
echo ""

# Resultado final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ Projeto verificado com sucesso!${NC}"
    echo ""
    echo "Para iniciar o projeto:"
    echo -e "${YELLOW}npm run dev${NC}"
else
    echo -e "${RED}❌ Encontrados $ERRORS erro(s)${NC}"
    echo ""
    echo "Verifique os arquivos faltantes acima."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
