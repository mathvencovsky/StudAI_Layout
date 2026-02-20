# ⚡ Início Rápido - StudAI

## 🎯 3 Passos para Ver o Projeto Funcionando

### 1️⃣ Abra o terminal na pasta do projeto

```bash
cd StudAI_Layout
```

### 2️⃣ Instale as dependências (primeira vez apenas)

```bash
npm install
```

⏱️ Isso pode levar alguns minutos...

### 3️⃣ Inicie o servidor

```bash
npm run dev
```

✅ Pronto! Abra o navegador em: **http://localhost:5173/**

---

## 🔍 Verificar se Está Tudo OK

Execute o script de verificação:

**Windows (PowerShell):**
```powershell
.\verificar-projeto.ps1
```

**Linux/Mac:**
```bash
chmod +x verificar-projeto.sh
./verificar-projeto.sh
```

---

## 🎨 O Que Você Vai Ver

Ao abrir `http://localhost:5173/`, você verá:

1. **Header fixo** no topo (fica sólido ao rolar)
2. **Hero section** com:
   - Badge "For exams, certifications and college"
   - Título grande com destaque
   - Toggle de perfis (Concurso/Certificação/Faculdade)
   - Lista de benefícios
   - Botões de ação
   - Cards de preview (Today, Reviews, Week)
   - Card de autenticação
3. **Logo Strip** com badges e links
4. **Product Section** com 6 features
5. **How It Works** com 3 passos
6. **Trust Section** com informações de transparência
7. **Testimonials** com 3 depoimentos
8. **Pricing** com planos Free e Pro
9. **FAQ** com perguntas frequentes
10. **Final CTA** com call-to-action
11. **Footer** completo com 5 colunas

---

## 🌐 Testar Idiomas

Clique no botão de idioma no header (ícone de globo) para alternar entre:
- 🇧🇷 Português
- 🇺🇸 English

---

## 📱 Testar Responsividade

Abra o DevTools do navegador (F12) e teste em diferentes tamanhos:

1. **Mobile** (375px): Layout em coluna, cards com scroll
2. **Tablet** (768px): Layout híbrido
3. **Desktop** (1440px): Layout completo

---

## 🎯 Comparar com o Lovable

Abra duas abas:

1. **Seu projeto**: http://localhost:5173/
2. **Lovable**: https://studaidash.lovable.app

Compare:
- ✅ Layout idêntico
- ✅ Cores iguais
- ✅ Tipografia igual
- ✅ Animações similares
- ✅ Responsividade igual

---

## 🐛 Problemas Comuns

### "npm: command not found"
→ Instale o Node.js: https://nodejs.org/

### "Port 5173 is already in use"
→ O Vite vai sugerir outra porta automaticamente

### Página em branco
→ Abra o console (F12) e veja os erros
→ Limpe o cache (Ctrl+Shift+R)

### "Cannot find module"
→ Execute: `npm install` novamente

---

## 📚 Mais Informações

- `COMO_INICIAR.md` - Guia completo e detalhado
- `LOVABLE_DESIGN_MATCH.md` - Comparação com o Lovable
- `README.md` - Documentação geral

---

## 🎉 Pronto!

Seu projeto está funcionando! 🚀

Qualquer dúvida, consulte os arquivos de documentação ou abra uma issue.
