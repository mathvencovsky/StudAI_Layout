# Copy Atualizada - StudAI

## Resumo das Mudanças Aplicadas

Todas as mudanças foram aplicadas nos arquivos de tradução para garantir consistência e profissionalismo em todo o site.

## Mudanças Principais

### 1. Navegação e Cards da Home

#### Antes → Depois
- "Nova Sessão" → "Criar Nova Trilha"
- "Crie uma trilha de estudos personalizada com IA respondendo algumas perguntas" → "Responda um questionário rápido e receba uma trilha personalizada"
- "Criar Trilha com IA" → "Criar Trilha Personalizada"
- "Continuar Aprendendo" → "Retomar Estudos"
- "Continuar Trilha" → "Minha Trilha Ativa"
- "Continue de onde parou." → "Retome seus estudos de onde parou"
- "Sua trilha de aprendizado ativa." → "Acompanhe o progresso da sua trilha"
- "Seus itens salvos." → "Seus conteúdos salvos"

### 2. Questionário de Criação de Trilha

#### Títulos das Etapas
- "O que você quer estudar?" → "Qual assunto você quer dominar?"
- "Qual é o seu objetivo com este estudo?" → "Qual seu objetivo de aprendizado?"
- "Qual é o seu nível de conhecimento atual sobre o assunto?" → "Qual seu nível atual neste assunto?"
- "Quanto tempo você pode dedicar por semana?" → "Tempo disponível por semana"
- "Como você prefere aprender?" → "Seu estilo de aprendizado"
- "Você tem algum prazo? (Opcional)" → "Prazo desejado (Opcional)"
- "Há algum tópico específico que você quer incluir?" → "Tópicos específicos de interesse (Opcional)"

#### Textos de Ajuda
- "Seja específico. Ex: \"React com TypeScript\", \"Machine Learning\", \"Inglês para negócios\"" → "Seja específico. Ex: React com TypeScript, Machine Learning, Inglês para Negócios"
- "Ex: \"Conseguir um emprego\", \"Passar em certificação\", \"Projeto pessoal\"" → "Ex: Conseguir um emprego, Passar em certificação, Desenvolver projeto pessoal"
- "Seja honesto para que possamos criar a trilha ideal para você" → "Seja honesto para recebermos a trilha ideal para você"
- "Isso nos ajuda a criar um cronograma realista" → "Ajuda a criar um cronograma realista para você"
- "Vamos priorizar o tipo de conteúdo que funciona melhor para você" → "Priorizaremos o formato que funciona melhor para você"

#### Placeholders
- "Digite o assunto que deseja estudar..." → "Digite o assunto que deseja estudar"
- "Descreva seu objetivo..." → "Descreva seu objetivo"
- "Liste os tópicos específicos..." → "Liste os tópicos específicos"

### 3. Mensagens de Feedback

#### Mensagens de Sucesso
- "Suas alterações foram salvas com sucesso." → "Alterações salvas com sucesso"

#### Mensagens de Erro (Padrão mais conciso)
Antes:
- "Não foi possível [ação]. Por favor, tente novamente. Se o problema persistir, envie-nos um feedback."

Depois:
- "Erro ao [ação]. Tente novamente ou entre em contato."

Exemplos aplicados:
- "Erro ao excluir conteúdo. Tente novamente ou entre em contato."
- "Erro ao carregar módulos. Tente novamente ou entre em contato."
- "Erro ao carregar estatísticas. Tente novamente ou entre em contato."

### 4. Estados e Status

- "Em progresso" → "Em Andamento"

### 5. Dicas e Hints

- "Até 10 minutos ajuda — consistência vence intensidade." → "Consistência é mais importante que intensidade"

## Princípios Aplicados

### 1. Concisão
- Removidas frases redundantes
- Eliminado excesso de "por favor" e "por gentileza"
- Mensagens mais diretas e objetivas

### 2. Profissionalismo
- Tom mais formal mas ainda acessível
- Evitadas aspas desnecessárias em exemplos
- Linguagem mais polida

### 3. Consistência
- Padrão uniforme para mensagens de erro
- Estrutura similar em textos de ajuda
- Terminologia padronizada

### 4. Clareza
- Títulos mais descritivos
- Instruções mais claras
- Menos ambiguidade

## Impacto Visual

### Home Page
```
Antes:
┌─────────────────────────────────────┐
│ ✨ Nova Sessão                      │
│ Crie uma trilha de estudos          │
│ personalizada com IA respondendo    │
│ algumas perguntas                   │
│ [Criar Trilha com IA →]             │
└─────────────────────────────────────┘

Depois:
┌─────────────────────────────────────┐
│ ➕ Criar Nova Trilha                │
│ Responda um questionário rápido e   │
│ receba uma trilha personalizada     │
│ [✨ Criar Trilha Personalizada →]   │
└─────────────────────────────────────┘
```

### Questionário
```
Antes:
"O que você quer estudar?"
Seja específico. Ex: "React com TypeScript"

Depois:
"Qual assunto você quer dominar?"
Seja específico. Ex: React com TypeScript
```

## Arquivos Modificados

1. `src/i18n/locales/pt-BR/common.ts` - Traduções em português
2. `src/i18n/locales/en/common.ts` - Traduções em inglês

## Próximos Passos (Opcional)

### Melhorias Adicionais Sugeridas

1. **Microcopy de Botões**
   - Revisar todos os botões para garantir verbos de ação claros
   - Exemplo: "Ver Mais" vs "Explorar"

2. **Mensagens de Estado Vazio**
   - Tornar mais motivadoras e orientadas a ação
   - Exemplo: "Nenhum módulo ainda" → "Comece sua jornada criando seu primeiro módulo"

3. **Tooltips**
   - Adicionar tooltips informativos onde necessário
   - Manter máximo de 1-2 linhas

4. **Confirmações de Ação**
   - Revisar diálogos de confirmação para serem mais claros
   - Exemplo: "Tem certeza?" → "Excluir trilha permanentemente?"

## Validação

✅ Sem erros de diagnóstico
✅ Consistência entre PT-BR e EN
✅ Tom profissional mantido
✅ Clareza melhorada
✅ Concisão aplicada

## Feedback

As mudanças foram aplicadas com foco em:
- Profissionalismo sem perder acessibilidade
- Consistência em toda a plataforma
- Clareza e objetividade
- Melhor experiência do usuário
