# Revisão de Copy - StudAI

## Princípios de Copy

### Tom de Voz
- **Profissional mas acessível**: Evitar gírias, manter clareza
- **Orientado a ação**: Verbos claros e diretos
- **Consistente**: Mesma terminologia em todo o site
- **Motivador**: Foco em progresso e conquistas

### Padrões de Escrita
1. **Títulos**: Substantivos ou frases curtas (2-4 palavras)
2. **Descrições**: Frases completas, objetivas
3. **Botões**: Verbos no infinitivo ou imperativo
4. **Mensagens de erro**: Claras, com solução
5. **Mensagens de sucesso**: Positivas, confirmando ação

## Mudanças Propostas

### 1. Navegação e Seções Principais

#### Antes → Depois
- "Continuar Aprendendo" → "Retomar Estudos"
- "Continuar Trilha" → "Minha Trilha Ativa"
- "Nova Sessão" → "Criar Nova Trilha"
- "Próxima melhor ação" → "Próxima Ação Recomendada"

### 2. Preferências de Aprendizado

#### Antes → Depois
- "Em que você está interessado em aprender?" → "Quais áreas você quer estudar?"
- "Quanto tempo você pode dedicar diariamente?" → "Tempo disponível por dia"
- "Quais dias funcionam melhor para você?" → "Dias da semana disponíveis"
- "Como você prefere aprender?" → "Formato de aprendizado preferido"
- "Qual duração de conteúdo você prefere?" → "Duração ideal de conteúdo"

### 3. Questionário de Criação de Trilha

#### Antes → Depois
- "O que você quer estudar?" → "Qual assunto você quer dominar?"
- "Qual é o seu objetivo com este estudo?" → "Qual seu objetivo de aprendizado?"
- "Qual é o seu nível de conhecimento atual sobre o assunto?" → "Qual seu nível atual neste assunto?"
- "Quanto tempo você pode dedicar por semana?" → "Tempo disponível por semana"
- "Como você prefere aprender?" → "Seu estilo de aprendizado"
- "Há algum tópico específico que você quer incluir?" → "Tópicos específicos de interesse"

### 4. Mensagens de Feedback

#### Antes → Depois
- "Suas alterações foram salvas com sucesso." → "Alterações salvas com sucesso"
- "Não foi possível carregar seu conteúdo agora. Por favor, atualize a página." → "Erro ao carregar conteúdo. Atualize a página."
- "Algo deu errado ao carregar o progresso do conteúdo. Por favor, tente novamente. Se o problema persistir, envie-nos um feedback." → "Erro ao carregar progresso. Tente novamente ou entre em contato."

### 5. Ações e Botões

#### Antes → Depois
- "Criar Trilha com IA" → "Criar Trilha Personalizada"
- "Iniciar sessão" → "Começar Sessão"
- "Explorar Módulos" → "Ver Módulos"
- "Explorar Trilhas" → "Ver Trilhas"
- "Salvar preferências" → "Salvar Preferências"

### 6. Estados e Status

#### Antes → Depois
- "Em progresso" → "Em Andamento"
- "Não iniciado" → "Não Iniciado"
- "Concluído" → "Concluído" (mantém)

### 7. Descrições de Cards

#### Antes → Depois
- "Continue de onde parou." → "Retome seus estudos de onde parou"
- "Sua trilha de aprendizado ativa." → "Acompanhe o progresso da sua trilha"
- "Crie uma trilha de estudos personalizada com IA respondendo algumas perguntas" → "Responda um questionário rápido e receba uma trilha personalizada"

## Consistência de Terminologia

### Termos Padronizados
- **Trilha** (não "track" ou "caminho")
- **Módulo** (não "curso" ou "aula")
- **Conteúdo** (não "material" ou "recurso")
- **Sessão de Estudo** (não "sessão" apenas)
- **Progresso** (não "avanço")
- **Meta** (não "objetivo" em contexto de goals)
- **Objetivo** (não "meta" em contexto de propósito)

### Ações Padronizadas
- **Criar** (para novo)
- **Editar** (para modificar)
- **Excluir** (para remover)
- **Iniciar** (para começar)
- **Continuar** (para retomar)
- **Concluir** (para finalizar)
- **Salvar** (para persistir)
- **Cancelar** (para abortar)

## Melhorias de Microcopy

### Placeholders
- Mais específicos e exemplificados
- Formato: "Ex: [exemplo concreto]"

### Mensagens de Erro
- Estrutura: "[Problema]. [Solução]."
- Exemplo: "Erro ao salvar. Tente novamente."

### Mensagens de Sucesso
- Estrutura: "[Ação] [resultado]"
- Exemplo: "Trilha criada com sucesso"

### Tooltips e Hints
- Máximo 1-2 linhas
- Informação útil, não óbvia
- Exemplo: "Consistência é mais importante que intensidade"

## Implementação

As mudanças serão aplicadas em:
1. `src/i18n/locales/pt-BR/common.ts`
2. `src/i18n/locales/en/common.ts`
3. Componentes que usam texto hardcoded (se houver)
