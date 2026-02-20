# Guia de Testes: Sidebar e Navegação

## 🧪 Como Testar a Implementação

### Pré-requisitos

1. Certifique-se de que o servidor está rodando:
   ```bash
   npm run dev
   ```

2. Faça login usando o mock auth (email e senha qualquer)

### ✅ Checklist de Testes

#### 1. Sidebar - Estrutura e Navegação

- [ ] **Grupos de Navegação**
  - [ ] Grupo "PRINCIPAL" aparece com 5 itens
  - [ ] Grupo "PROGRESSO" aparece com 4 itens
  - [ ] Grupo "DADOS" aparece com 3 itens
  - [ ] Grupo "CONFIG" aparece com 2-3 itens (dependendo se é admin)

- [ ] **Itens de Navegação**
  - [ ] Todos os ícones aparecem corretamente
  - [ ] Todos os labels estão traduzidos
  - [ ] Hover nos itens muda a cor de fundo
  - [ ] Click nos itens navega para a rota correta

- [ ] **Rota Ativa**
  - [ ] Item da rota atual está destacado (fundo azul claro)
  - [ ] Apenas um item está ativo por vez
  - [ ] Destaque persiste após navegação

- [ ] **Filtro de Admin**
  - [ ] Como usuário normal: item "Admin" NÃO aparece
  - [ ] Como admin: item "Admin" aparece no grupo CONFIG

#### 2. Responsividade

- [ ] **Desktop (≥768px)**
  - [ ] Sidebar permanece visível à esquerda
  - [ ] Botão de colapsar funciona
  - [ ] Sidebar colapsado mostra apenas ícones
  - [ ] Botão de expandir funciona quando colapsado

- [ ] **Mobile (<768px)**
  - [ ] Sidebar não aparece por padrão
  - [ ] Botão de menu (hambúrguer) abre sidebar
  - [ ] Sidebar abre como drawer da esquerda
  - [ ] Click em item fecha o drawer
  - [ ] Click fora do drawer fecha ele

#### 3. Componentes de Estado

- [ ] **LoadingState**
  - [ ] Spinner animado aparece
  - [ ] Mensagem "Carregando..." traduzida
  - [ ] Centralizado verticalmente

- [ ] **EmptyState**
  - [ ] Ícone aparece (se fornecido)
  - [ ] Título e descrição aparecem
  - [ ] Botão de ação funciona (se fornecido)
  - [ ] Centralizado e bem espaçado

- [ ] **ErrorState**
  - [ ] Ícone de erro aparece
  - [ ] Mensagem de erro aparece
  - [ ] Botão "Tentar Novamente" funciona
  - [ ] Retry recarrega os dados

#### 4. Guards de Autenticação

- [ ] **AuthGuard**
  - [ ] Usuário não autenticado é redirecionado para /sign-up
  - [ ] URL de destino é preservada no query param "redirect"
  - [ ] Após login, usuário é redirecionado para URL original
  - [ ] LoadingState aparece durante verificação

- [ ] **RoleGuard**
  - [ ] Usuário sem role admin vê página "Acesso Restrito"
  - [ ] Mensagem traduzida aparece
  - [ ] Botão "Voltar ao Início" funciona
  - [ ] Usuário admin acessa normalmente

#### 5. Páginas Implementadas

##### Página de Estudar (/estudar)

- [ ] **Sem Sessão Ativa**
  - [ ] EmptyState aparece
  - [ ] Título "Pronto para estudar?" aparece
  - [ ] Botão "Iniciar Sessão" funciona
  - [ ] Click inicia uma nova sessão

- [ ] **Com Sessão Ativa**
  - [ ] Cronômetro aparece e conta
  - [ ] Tempo é atualizado a cada segundo
  - [ ] Formato HH:MM:SS está correto
  - [ ] Tópico da sessão aparece
  - [ ] Cards de estatísticas aparecem (Minutos, XP)
  - [ ] Botão "Pausar" está desabilitado (funcionalidade futura)
  - [ ] Botão "Finalizar Sessão" funciona
  - [ ] Finalizar invalida queries e reseta estado

##### Página de Sessões (/sessoes)

- [ ] **Cards de Resumo**
  - [ ] Total de Horas calculado corretamente
  - [ ] Total de Sessões correto
  - [ ] Média por Sessão correta

- [ ] **Lista de Sessões**
  - [ ] Sessões ordenadas por data (mais recente primeiro)
  - [ ] Badge de tipo aparece com cor correta
  - [ ] Data formatada em PT-BR
  - [ ] Duração e XP aparecem
  - [ ] Hover adiciona sombra ao card

- [ ] **Empty State**
  - [ ] Aparece quando não há sessões
  - [ ] Mensagem apropriada
  - [ ] Ícone de cérebro aparece

##### Outras Páginas

- [ ] **HomePage (/)** - Carrega sem erros
- [ ] **ExplorePage (/explorar)** - Carrega sem erros
- [ ] **SearchPage (/pesquisar)** - Carrega sem erros
- [ ] **AssessmentsPage (/avaliacoes)** - Carrega sem erros
- [ ] **CalendarPage (/calendario)** - Carrega sem erros
- [ ] **GoalPage (/meu-objetivo)** - Carrega sem erros
- [ ] **ReviewsPage (/revisoes)** - Carrega sem erros
- [ ] **ReportsPage (/relatorios)** - Carrega sem erros
- [ ] **MetricsPage (/metricas)** - Carrega sem erros
- [ ] **ActivityPage (/atividade)** - Carrega sem erros
- [ ] **SavedPage (/salvos)** - Carrega sem erros
- [ ] **AdminPage (/admin)** - Protegida por RoleGuard
- [ ] **SettingsPage (/configuracoes)** - Carrega sem erros

#### 6. Traduções (i18n)

- [ ] **PT-BR (Padrão)**
  - [ ] Todos os grupos traduzidos
  - [ ] Todos os itens de navegação traduzidos
  - [ ] Estados traduzidos (loading, error, empty)
  - [ ] Mensagens de erro traduzidas

- [ ] **EN-US**
  - [ ] Trocar idioma nas configurações
  - [ ] Sidebar atualiza imediatamente
  - [ ] Todas as páginas atualizam
  - [ ] Sem keys não traduzidas aparecendo

#### 7. Performance

- [ ] **Carregamento Inicial**
  - [ ] Página carrega em menos de 2 segundos
  - [ ] Sem flashes de conteúdo não estilizado
  - [ ] Transições suaves

- [ ] **Navegação**
  - [ ] Mudança de rota é instantânea
  - [ ] Sem re-renders desnecessários
  - [ ] Scroll reseta ao mudar de página

- [ ] **Stubs de API**
  - [ ] Latência simulada (200-500ms) funciona
  - [ ] LoadingState aparece durante carregamento
  - [ ] Dados aparecem após latência

#### 8. Console e Erros

- [ ] **Console do Navegador**
  - [ ] Sem erros no console
  - [ ] Sem warnings de React
  - [ ] Sem warnings de TypeScript
  - [ ] Logs de desenvolvimento apropriados

- [ ] **Network**
  - [ ] Sem requisições falhando
  - [ ] Stubs não fazem requisições reais
  - [ ] React Query cache funcionando

## 🔍 Testes Específicos

### Teste 1: Fluxo Completo de Navegação

1. Faça login
2. Navegue por todos os 15 itens do sidebar
3. Verifique que cada página carrega
4. Verifique que não há erros no console
5. Volte para o início

**Resultado Esperado:** Todas as páginas carregam sem erros

### Teste 2: Fluxo de Sessão de Estudo

1. Navegue para /estudar
2. Click em "Iniciar Sessão"
3. Aguarde 10 segundos
4. Verifique que cronômetro está contando
5. Click em "Finalizar Sessão"
6. Navegue para /sessoes
7. Verifique que nova sessão aparece na lista

**Resultado Esperado:** Sessão é criada e aparece no histórico

### Teste 3: Proteção de Rota Admin

1. Como usuário normal, tente acessar /admin
2. Verifique que página "Acesso Restrito" aparece
3. Click em "Voltar ao Início"
4. Verifique que volta para /

**Resultado Esperado:** Usuário não admin não acessa /admin

### Teste 4: Responsividade

1. Abra DevTools (F12)
2. Ative modo responsivo
3. Teste em 320px (mobile pequeno)
4. Teste em 768px (tablet)
5. Teste em 1920px (desktop grande)
6. Verifique que sidebar se adapta

**Resultado Esperado:** Layout funciona em todos os tamanhos

### Teste 5: Mudança de Idioma

1. Navegue para /configuracoes
2. Mude idioma para EN-US
3. Verifique que sidebar atualiza
4. Navegue por algumas páginas
5. Mude de volta para PT-BR
6. Verifique que tudo volta ao português

**Resultado Esperado:** Idioma muda instantaneamente em toda a UI

## 🐛 Bugs Conhecidos

### Bugs Corrigidos
- ✅ Sidebar não mostrava grupos de navegação
- ✅ Rota ativa não era destacada
- ✅ Admin aparecia para todos os usuários

### Bugs Pendentes
- ⏳ Algumas páginas ainda não usam stubs
- ⏳ Traduções incompletas em algumas páginas
- ⏳ Falta Error Boundary global

## 📊 Relatório de Testes

Use este template para reportar resultados:

```markdown
## Relatório de Testes - [Data]

### Ambiente
- Navegador: [Chrome/Firefox/Safari]
- Versão: [versão]
- OS: [Windows/Mac/Linux]

### Resultados

#### Sidebar e Navegação
- [ ] Grupos aparecem corretamente
- [ ] Navegação funciona
- [ ] Rota ativa destacada
- [ ] Filtro admin funciona

#### Responsividade
- [ ] Desktop OK
- [ ] Tablet OK
- [ ] Mobile OK

#### Páginas
- [ ] Todas carregam sem erros
- [ ] Estados (loading/empty/error) funcionam
- [ ] Traduções corretas

#### Performance
- [ ] Carregamento rápido
- [ ] Sem erros no console
- [ ] Navegação suave

### Bugs Encontrados
1. [Descrição do bug]
2. [Descrição do bug]

### Observações
[Comentários adicionais]
```

## 🚀 Próximos Testes

Após completar a implementação:

1. **Testes de Integração**
   - Testar fluxos completos de usuário
   - Testar interação entre páginas
   - Testar persistência de dados

2. **Testes de Acessibilidade**
   - Navegação por teclado
   - Leitores de tela
   - Contraste de cores
   - ARIA labels

3. **Testes de Performance**
   - Lighthouse audit
   - Bundle size
   - Time to Interactive
   - Core Web Vitals

4. **Testes Automatizados**
   - Unit tests com Vitest
   - Component tests com Testing Library
   - E2E tests com Playwright

---

**Última atualização:** 2024
**Status:** Pronto para testes manuais
