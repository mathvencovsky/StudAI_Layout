# Script de Verificação do Projeto StudAI (PowerShell)
# Este script verifica se todos os arquivos necessários existem

Write-Host "🔍 Verificando estrutura do projeto StudAI..." -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0

# Função para verificar arquivo
function Check-File {
    param($Path)
    if (Test-Path $Path -PathType Leaf) {
        Write-Host "✓ $Path" -ForegroundColor Green
    } else {
        Write-Host "✗ $Path (FALTANDO)" -ForegroundColor Red
        $script:ERRORS++
    }
}

# Função para verificar diretório
function Check-Dir {
    param($Path)
    if (Test-Path $Path -PathType Container) {
        Write-Host "✓ $Path/" -ForegroundColor Green
    } else {
        Write-Host "✗ $Path/ (FALTANDO)" -ForegroundColor Red
        $script:ERRORS++
    }
}

Write-Host "📦 Arquivos principais:" -ForegroundColor Yellow
Check-File "package.json"
Check-File "index.html"
Check-File "vite.config.ts"
Check-File "tsconfig.json"
Write-Host ""

Write-Host "📁 Diretórios principais:" -ForegroundColor Yellow
Check-Dir "src"
Check-Dir "src\components"
Check-Dir "src\components\landing"
Check-Dir "src\i18n"
Check-Dir "src\routes"
Check-Dir "node_modules"
Write-Host ""

Write-Host "🎨 Componentes da Landing Page:" -ForegroundColor Yellow
Check-File "src\components\landing\landing-page.tsx"
Check-File "src\components\landing\landing-header.tsx"
Check-File "src\components\landing\LandingHero.tsx"
Check-File "src\components\landing\auth-card.tsx"
Check-File "src\components\landing\logo-strip-section.tsx"
Check-File "src\components\landing\product-section.tsx"
Check-File "src\components\landing\how-it-works.tsx"
Check-File "src\components\landing\trust-section.tsx"
Check-File "src\components\landing\testimonials.tsx"
Check-File "src\components\landing\pricing-section.tsx"
Check-File "src\components\landing\faq-section.tsx"
Check-File "src\components\landing\final-cta.tsx"
Check-File "src\components\landing\landing-footer.tsx"
Check-File "src\components\landing\ui.tsx"
Check-File "src\components\landing\index.ts"
Write-Host ""

Write-Host "🌐 Internacionalização:" -ForegroundColor Yellow
Check-File "src\i18n\i18n.ts"
Check-File "src\i18n\locales\pt-BR\common.ts"
Check-File "src\i18n\locales\en\common.ts"
Write-Host ""

Write-Host "🎨 Estilos:" -ForegroundColor Yellow
Check-File "src\index.css"
Write-Host ""

Write-Host "🛣️ Rotas:" -ForegroundColor Yellow
Check-File "src\routes\__root.tsx"
Check-File "src\routes\index.tsx"
Check-File "src\main.tsx"
Write-Host ""

Write-Host "📚 Documentação:" -ForegroundColor Yellow
Check-File "README.md"
Check-File "LOVABLE_DESIGN_MATCH.md"
Check-File "COMO_INICIAR.md"
Write-Host ""

# Verificar versões do Node e npm
Write-Host "🔧 Versões instaladas:" -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
    
    # Verificar se a versão é >= 20.20.0
    $nodeMajor = [int]($nodeVersion -replace 'v', '' -split '\.')[0]
    if ($nodeMajor -ge 20) {
        Write-Host "  → Versão adequada (>= 20.20.0)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Versão recomendada: >= 20.20.0" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Node.js não encontrado" -ForegroundColor Red
    $ERRORS++
}

try {
    $npmVersion = npm --version
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm não encontrado" -ForegroundColor Red
    $ERRORS++
}
Write-Host ""

# Verificar se node_modules existe
if (Test-Path "node_modules" -PathType Container) {
    Write-Host "✓ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠ Dependências não instaladas" -ForegroundColor Yellow
    Write-Host "  → Execute: npm install" -ForegroundColor Yellow
}
Write-Host ""

# Resultado final
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
if ($ERRORS -eq 0) {
    Write-Host "✅ Projeto verificado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Para iniciar o projeto:" -ForegroundColor Cyan
    Write-Host "npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "❌ Encontrados $ERRORS erro(s)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique os arquivos faltantes acima." -ForegroundColor Yellow
}
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
