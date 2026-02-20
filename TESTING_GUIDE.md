# StudAI - Guia de Testes e Validação

## 📋 Checklist de Validação

### ✅ Autenticação e Autorização
- [ ] Criar conta nova funciona
- [ ] Login com credenciais válidas funciona
- [ ] Login com credenciais inválidas falha apropriadamente
- [ ] Logout funciona e limpa sessão
- [ ] Reset de senha funciona
- [ ] Verificação de email funciona
- [ ] Rotas protegidas redirecionam para login
- [ ] Owner-based access control funciona (usuário só vê seus dados)

### ✅ Dashboard e Home
- [ ] Dashboard carrega sem erros
- [ ] Gamification card mostra XP, nível e streak corretos
- [ ] Daily plan card mostra tarefas do dia
- [ ] Active track status mostra trilha ativa
- [ ] Next action card sugere próxima ação
- [ ] Navegação entre seções funciona

### ✅ Trilhas (Tracks)
- [ ] Listar trilhas funciona
- [ ] Criar nova trilha funciona
- [ ] Editar trilha funciona
- [ ] Deletar trilha funciona
- [ ] Visualizar detalhes da trilha funciona
- [ ] Adicionar módulos à trilha funciona
- [ ] Favoritar trilha funciona
- [ ] Buscar trilhas funciona
- [ ] Filtros de trilhas funcionam

### ✅ Módulos
- [ ] Listar módulos funciona
- [ ] Criar novo módulo funciona
- [ ] Editar módulo funciona
- [ ] Deletar módulo funciona
- [ ] Visualizar detalhes do módulo funciona
- [ ] Adicionar conteúdos ao módulo funciona
- [ ] Marcar módulo como completo funciona
- [ ] Favoritar módulo funciona

### ✅ Conteúdos
- [ ] Listar conteúdos funciona
- [ ] Criar novo conteúdo funciona
- [ ] Editar conteúdo funciona
- [ ] Deletar conteúdo funciona
- [ ] Visualizar detalhes do conteúdo funciona
- [ ] Marcar conteúdo como completo funciona
- [ ] Favoritar conteúdo funciona
- [ ] Tabs de conteúdo (Todos, Favoritos, Completos) funcionam
- [ ] Votar em conteúdo funciona

### ✅ Estudar com IA
- [ ] Página de estudo carrega
- [ ] Chat com IA funciona
- [ ] Mensagens são enviadas e recebidas
- [ ] Histórico de chat é mantido
- [ ] Limites de mensagens por dia são respeitados
- [ ] Mensagens de erro são claras

### ✅ Quizzes
- [ ] Listar quizzes funciona
- [ ] Criar quiz funciona
- [ ] Iniciar quiz funciona
- [ ] Responder perguntas funciona
- [ ] Submeter quiz funciona
- [ ] Ver resultado do quiz funciona
- [ ] Ver histórico de tentativas funciona
- [ ] Score é calculado corretamente

### ✅ Revisões (Spaced Repetition)
- [ ] Listar itens para revisão funciona
- [ ] Marcar item como revisado funciona
- [ ] Sistema de espaçamento funciona
- [ ] Próxima data de revisão é calculada corretamente
- [ ] Filtros de revisão funcionam

### ✅ Sessões de Estudo
- [ ] Criar sessão de estudo funciona
- [ ] Finalizar sessão funciona
- [ ] Duração é calculada corretamente
- [ ] XP é atribuído corretamente
- [ ] Histórico de sessões funciona

### ✅ Objetivos (Goals)
- [ ] Criar objetivo funciona
- [ ] Editar objetivo funciona
- [ ] Marcar objetivo como completo funciona
- [ ] Progresso do objetivo é calculado corretamente
- [ ] Visualizar objetivos funciona

### ✅ Plano de Estudos
- [ ] Visualizar plano funciona
- [ ] Editar plano funciona
- [ ] Tarefas diárias são geradas
- [ ] Marcar tarefa como completa funciona
- [ ] Progresso do plano é atualizado

### ✅ Calendário
- [ ] Visualizar calendário funciona
- [ ] Eventos são exibidos corretamente
- [ ] Criar evento funciona
- [ ] Editar evento funciona
- [ ] Deletar evento funciona
- [ ] Navegação entre meses funciona

### ✅ Ranking
- [ ] Ranking global funciona
- [ ] Ranking é ordenado por XP
- [ ] Posição do usuário é destacada
- [ ] Filtros de ranking funcionam

### ✅ Relatórios (Analytics)
- [ ] Visualizar relatórios funciona
- [ ] Gráficos são renderizados
- [ ] Estatísticas são calculadas corretamente
- [ ] Filtros de período funcionam
- [ ] Exportar dados funciona

### ✅ Configurações
- [ ] Visualizar configurações funciona
- [ ] Editar perfil funciona
- [ ] Alterar preferências funciona
- [ ] Alterar tema funciona
- [ ] Configurar notificações funciona
- [ ] Alterar idioma funciona

### ✅ Motor de IA - Course Builder
- [ ] Página de criar curso carrega
- [ ] Formulário de curso funciona
- [ ] Validação de campos funciona
- [ ] Verificação de limites do plano funciona
- [ ] Geração de curso com IA funciona
- [ ] Preview do curso é exibido
- [ ] Salvar curso funciona
- [ ] Listar meus cursos funciona
- [ ] Visualizar detalhes do curso funciona
- [ ] Inscrever-se em curso funciona
- [ ] Recursos são enriquecidos automaticamente

### ✅ Catálogo de Recursos
- [ ] Listar recursos funciona
- [ ] Buscar recursos funciona
- [ ] Filtrar por categoria funciona
- [ ] Filtrar por tags funciona
- [ ] Filtrar por nível funciona
- [ ] Links externos abrem corretamente
- [ ] Recursos verificados são destacados

### ✅ Plan Guard (Limites de Plano)
- [ ] Limites Free são respeitados
- [ ] Limites Pro são respeitados
- [ ] Mensagens de limite atingido são claras
- [ ] CTA de upgrade é exibido
- [ ] Contadores de uso funcionam
- [ ] Reset mensal funciona

### ✅ Páginas Públicas
- [ ] `/resources` carrega e funciona
- [ ] `/how-it-works` carrega e funciona
- [ ] `/plans` carrega e funciona
- [ ] `/faq` carrega e funciona
- [ ] `/contact` carrega e funciona
- [ ] `/support` carrega e funciona
- [ ] `/security` carrega e funciona
- [ ] `/privacy` carrega e funciona
- [ ] `/terms` carrega e funciona
- [ ] Footer é exibido em todas as páginas públicas
- [ ] Links do footer funcionam

### ✅ Responsividade
- [ ] Desktop (1920x1080) funciona
- [ ] Laptop (1366x768) funciona
- [ ] Tablet (768x1024) funciona
- [ ] Mobile (375x667) funciona
- [ ] Menu mobile funciona
- [ ] Navegação mobile funciona

### ✅ Performance
- [ ] Página inicial carrega em < 3s
- [ ] Navegação entre páginas é rápida
- [ ] Imagens são otimizadas
- [ ] Bundle size é aceitável (< 1MB)
- [ ] Lazy loading funciona
- [ ] Cache funciona

### ✅ Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] Screen readers funcionam
- [ ] Contraste de cores é adequado
- [ ] Textos alternativos estão presentes
- [ ] Foco é visível
- [ ] ARIA labels estão corretos

---

## 🧪 Casos de Teste Críticos

### Caso 1: Fluxo Completo de Novo Usuário
**Objetivo:** Validar que um novo usuário consegue criar conta e começar a usar

**Passos:**
1. Acessar `/sign-up`
2. Preencher formulário de cadastro
3. Verificar email
4. Fazer login
5. Completar preferências de aprendizado
6. Criar primeiro objetivo
7. Explorar trilhas
8. Criar primeira sessão de estudo
9. Ganhar XP e subir de nível

**Resultado Esperado:**
- Conta criada com sucesso
- Email verificado
- Preferências salvas
- Objetivo criado
- Sessão registrada
- XP atribuído

### Caso 2: Geração de Curso com IA
**Objetivo:** Validar que o sistema de geração de cursos funciona

**Passos:**
1. Fazer login
2. Acessar `/criar-curso`
3. Preencher formulário:
   - Título: "Python para Data Science"
   - Descrição: "Aprenda Python focado em análise de dados"
   - Nível: Intermediário
   - Duração: 40 horas
4. Clicar em "Gerar Curso"
5. Aguardar geração
6. Visualizar preview
7. Salvar curso
8. Acessar `/meus-cursos`
9. Visualizar curso criado

**Resultado Esperado:**
- Curso gerado com módulos e tarefas
- Recursos verificados incluídos
- Preview exibido corretamente
- Curso salvo no banco
- Curso aparece na lista

### Caso 3: Limite de Plano Free
**Objetivo:** Validar que limites do plano Free são respeitados

**Passos:**
1. Fazer login com conta Free
2. Criar 1 curso (sucesso)
3. Tentar criar 2º curso no mesmo mês (deve bloquear)
4. Verificar mensagem de limite
5. Verificar CTA de upgrade

**Resultado Esperado:**
- Primeiro curso criado com sucesso
- Segundo curso bloqueado
- Mensagem clara sobre limite
- CTA de upgrade exibido

### Caso 4: Busca de Recursos
**Objetivo:** Validar que busca de recursos funciona

**Passos:**
1. Acessar `/resources`
2. Buscar "Python"
3. Verificar resultados
4. Filtrar por categoria "programming"
5. Clicar em recurso
6. Verificar que link abre

**Resultado Esperado:**
- Resultados relevantes exibidos
- Filtros funcionam
- Links abrem corretamente
- Recursos verificados destacados

### Caso 5: Gamificação
**Objetivo:** Validar que sistema de gamificação funciona

**Passos:**
1. Fazer login
2. Completar conteúdo (ganhar XP)
3. Verificar XP no dashboard
4. Manter streak por 3 dias
5. Verificar streak no dashboard
6. Subir de nível
7. Verificar nível no dashboard

**Resultado Esperado:**
- XP atribuído corretamente
- Streak mantido
- Nível atualizado
- Dashboard reflete mudanças

---

## 🔍 Testes de Segurança

### Autenticação
- [ ] Senhas são hasheadas
- [ ] Tokens JWT expiram
- [ ] Refresh tokens funcionam
- [ ] Logout invalida tokens
- [ ] Sessões expiram após inatividade

### Autorização
- [ ] Owner-based access funciona
- [ ] Usuário não acessa dados de outros
- [ ] Rotas protegidas requerem autenticação
- [ ] Operações CRUD verificam ownership

### Dados
- [ ] Inputs são sanitizados
- [ ] SQL injection não é possível (GraphQL)
- [ ] XSS não é possível
- [ ] CSRF tokens funcionam
- [ ] Rate limiting funciona

---

## 📊 Testes de Performance

### Métricas Alvo
- **FCP (First Contentful Paint):** < 1.5s
- **LCP (Largest Contentful Paint):** < 2.5s
- **TTI (Time to Interactive):** < 3.5s
- **CLS (Cumulative Layout Shift):** < 0.1
- **FID (First Input Delay):** < 100ms

### Ferramentas
- Lighthouse (Chrome DevTools)
- WebPageTest
- GTmetrix
- Network tab (DevTools)

### Checklist
- [ ] Bundle size < 1MB
- [ ] Images otimizadas
- [ ] Lazy loading implementado
- [ ] Code splitting implementado
- [ ] Cache configurado
- [ ] CDN configurado (se aplicável)

---

## 🐛 Testes de Erro

### Cenários de Erro
- [ ] Erro de rede (offline)
- [ ] Erro de API (500)
- [ ] Erro de autenticação (401)
- [ ] Erro de autorização (403)
- [ ] Erro de validação (400)
- [ ] Erro de limite (402)
- [ ] Timeout de requisição

### Validações
- [ ] Mensagens de erro são claras
- [ ] Usuário sabe o que fazer
- [ ] Retry funciona quando apropriado
- [ ] Fallbacks funcionam
- [ ] Loading states são exibidos
- [ ] Erros são logados

---

## 📱 Testes de Dispositivos

### Desktop
- [ ] Chrome (última versão)
- [ ] Firefox (última versão)
- [ ] Safari (última versão)
- [ ] Edge (última versão)

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Samsung Internet

### Resoluções
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Laptop)
- [ ] 768x1024 (Tablet)
- [ ] 375x667 (Mobile)

---

## ✅ Critérios de Aceitação

### Funcionalidade
- ✅ Todas as funcionalidades principais funcionam
- ✅ Não há erros críticos no console
- ✅ Não há warnings de TypeScript
- ✅ Build passa sem erros

### Performance
- ✅ Lighthouse score > 90
- ✅ Bundle size < 1MB
- ✅ FCP < 1.5s
- ✅ LCP < 2.5s

### Segurança
- ✅ Autenticação funciona
- ✅ Autorização funciona
- ✅ Dados são protegidos
- ✅ HTTPS configurado

### UX
- ✅ Interface é intuitiva
- ✅ Feedback visual é claro
- ✅ Erros são tratados
- ✅ Loading states são exibidos

### Acessibilidade
- ✅ Navegação por teclado funciona
- ✅ Screen readers funcionam
- ✅ Contraste adequado
- ✅ ARIA labels corretos

---

## 📝 Relatório de Testes

### Template

```markdown
# Relatório de Testes - [Data]

## Resumo
- **Total de Testes:** X
- **Passou:** Y
- **Falhou:** Z
- **Bloqueado:** W

## Testes Executados
1. [Nome do Teste] - ✅ PASSOU / ❌ FALHOU
   - Descrição: ...
   - Resultado: ...
   - Observações: ...

## Bugs Encontrados
1. [Título do Bug]
   - Severidade: Crítico / Alto / Médio / Baixo
   - Descrição: ...
   - Passos para Reproduzir: ...
   - Resultado Esperado: ...
   - Resultado Atual: ...

## Recomendações
- ...
- ...

## Próximos Passos
- ...
- ...
```

---

## 🚀 Automação Futura

### Ferramentas Recomendadas
- **Vitest** - Testes unitários
- **React Testing Library** - Testes de componentes
- **Playwright** - Testes E2E
- **MSW** - Mock de APIs
- **Cypress** - Testes de integração

### Prioridades
1. Testes unitários para libs (plan-guard, course-generator)
2. Testes de componentes críticos (CourseBuilder, Dashboard)
3. Testes E2E para fluxos principais
4. Testes de API
5. Testes de performance automatizados
