# 💡 Dicas de Desenvolvimento - Editor de Trilhas

## 🛠️ Ferramentas Úteis

### Zustand DevTools
O store usa Zustand com DevTools integrado. Para visualizar:

1. Instale a extensão Redux DevTools no navegador
2. Abra o DevTools (F12)
3. Vá para a aba "Redux"
4. Veja todas as ações e estado em tempo real

### React DevTools
Para inspecionar componentes:

1. Instale React DevTools
2. Abra DevTools (F12)
3. Vá para aba "Components"
4. Inspecione a árvore de componentes

## 🔧 Estrutura do Código

### Store (Zustand)
```typescript
// Acessar estado
const currentTrack = useAdminTrackStore((state) => state.currentTrack);

// Chamar ação
const addModule = useAdminTrackStore((state) => state.addModule);
addModule({ /* dados */ });

// Múltiplos valores
const { currentTrack, addModule } = useAdminTrackStore((state) => ({
  currentTrack: state.currentTrack,
  addModule: state.addModule,
}));
```

### Tipos TypeScript
Todos os tipos estão em `src/types/admin-track.ts`:
- `AdminTrack` - Trilha completa
- `AdminModule` - Módulo
- `AdminLesson` - Aula
- `ContentBlock` - Bloco de conteúdo
- `VideoContent`, `TextContent`, etc. - Conteúdos específicos

### Componentes
Padrão de composição:
```
TrackEditorPage (container)
  └─ TrackEditorLayout (layout)
      ├─ TrackEditorHeader (header)
      ├─ TrackEditorSidebar (sidebar)
      │   └─ TrackStructureTree (tree)
      ├─ TrackEditorContent (main)
      │   ├─ TrackOverview
      │   ├─ ModuleEditor
      │   └─ LessonEditor
      │       └─ ContentBlockEditor
      │           ├─ VideoBlockEditor
      │           ├─ TextBlockEditor
      │           ├─ QuizBlockEditor
      │           ├─ ExerciseBlockEditor
      │           └─ ResourcesBlockEditor
      └─ TrackEditorPropertiesPanel (properties)
```

## 🎯 Adicionar Novo Tipo de Bloco

### 1. Adicionar Tipo
```typescript
// src/types/admin-track.ts
export type ContentBlockType = 'video' | 'text' | 'quiz' | 'exercise' | 'resources' | 'seu-novo-tipo';

export interface SeuNovoTipoContent {
  // Seus campos aqui
  campo1: string;
  campo2: number;
}
```

### 2. Criar Editor
```typescript
// src/components/admin/track-editor/content/content-blocks/seu-novo-tipo-editor.tsx
import { useAdminTrackStore } from '@/stores/admin-track-store';
import type { ContentBlock, SeuNovoTipoContent } from '@/types/admin-track';

interface SeuNovoTipoEditorProps {
  block: ContentBlock;
}

export function SeuNovoTipoEditor({ block }: SeuNovoTipoEditorProps) {
  const updateContentBlock = useAdminTrackStore((state) => state.updateContentBlock);
  const content = block.content as SeuNovoTipoContent;

  const handleUpdate = (updates: Partial<SeuNovoTipoContent>) => {
    updateContentBlock(block.id, {
      content: { ...content, ...updates },
      isComplete: /* sua lógica de validação */,
    });
  };

  return (
    <div>
      {/* Seu editor aqui */}
    </div>
  );
}
```

### 3. Adicionar ao ContentBlockEditor
```typescript
// src/components/admin/track-editor/content/content-blocks/content-block-editor.tsx
import { SeuNovoTipoEditor } from './seu-novo-tipo-editor';

export function ContentBlockEditor({ block }: ContentBlockEditorProps) {
  switch (block.type) {
    // ... outros casos
    case 'seu-novo-tipo':
      return <SeuNovoTipoEditor block={block} />;
    default:
      return <div>Tipo de bloco desconhecido</div>;
  }
}
```

### 4. Adicionar ao Menu
```typescript
// src/components/admin/track-editor/content/lesson-editor.tsx
<DropdownMenuItem onClick={() => onAdd('seu-novo-tipo')}>
  <SeuIcone className="h-4 w-4 mr-2" />
  <div>
    <div className="font-medium">Seu Novo Tipo</div>
    <div className="text-xs text-muted-foreground">Descrição</div>
  </div>
</DropdownMenuItem>
```

## 🔄 Integrar com Backend

### 1. Criar API Client
```typescript
// src/api/admin-tracks.ts
export async function saveTrack(track: AdminTrack) {
  const response = await fetch('/api/admin/tracks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(track),
  });
  return response.json();
}

export async function loadTrack(trackId: string) {
  const response = await fetch(`/api/admin/tracks/${trackId}`);
  return response.json();
}
```

### 2. Adicionar Hook
```typescript
// src/hooks/admin/use-save-track.ts
import { useMutation } from '@tanstack/react-query';
import { saveTrack } from '@/api/admin-tracks';

export function useSaveTrack() {
  return useMutation({
    mutationFn: saveTrack,
    onSuccess: () => {
      // Atualizar UI
    },
  });
}
```

### 3. Usar no Componente
```typescript
// src/components/admin/track-editor/track-editor-page.tsx
import { useSaveTrack } from '@/hooks/admin/use-save-track';

const { mutate: saveTrack } = useSaveTrack();

// Autosave
useEffect(() => {
  const timer = setTimeout(() => {
    if (currentTrack) {
      saveTrack(currentTrack);
    }
  }, 3000);
  return () => clearTimeout(timer);
}, [currentTrack, saveTrack]);
```

## 🎨 Customizar Estilos

### Cores
Edite `src/index.css` ou use Tailwind:
```css
/* Cores do tema */
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;
```

### Componentes
Use classes do Tailwind ou crie CSS modules:
```typescript
<div className="p-4 rounded-lg border hover:bg-accent">
  Conteúdo
</div>
```

## 🐛 Debug

### Console Logs
```typescript
// No store
console.log('Current track:', get().currentTrack);

// No componente
console.log('Selected module:', selectedModuleId);
```

### Zustand DevTools
Veja todas as ações:
- `setCurrentTrack`
- `addModule`
- `updateLesson`
- etc.

### React DevTools
Inspecione props e state de qualquer componente.

## 📊 Performance

### Otimizações Implementadas
- Seletores específicos no Zustand (evita re-renders)
- Componentes pequenos e focados
- Lazy loading preparado

### Melhorias Futuras
- Virtualização para listas grandes
- Debounce em buscas
- Memoização de cálculos pesados

## 🧪 Testes

### Testar Store
```typescript
import { useAdminTrackStore } from '@/stores/admin-track-store';

test('adicionar módulo', () => {
  const { addModule, currentTrack } = useAdminTrackStore.getState();
  
  addModule({
    trackId: 'track-1',
    title: 'Novo Módulo',
    // ...
  });
  
  expect(currentTrack?.modules).toHaveLength(1);
});
```

### Testar Componente
```typescript
import { render, screen } from '@testing-library/react';
import { TrackEditorPage } from './track-editor-page';

test('renderiza página', () => {
  render(<TrackEditorPage />);
  expect(screen.getByText('Fundamentos de React')).toBeInTheDocument();
});
```

## 🚀 Deploy

### Build
```bash
npm run build
```

### Variáveis de Ambiente
```env
VITE_API_URL=https://api.studai.com
VITE_ENABLE_DEVTOOLS=false
```

### Checklist
- [ ] Remover console.logs
- [ ] Testar em produção
- [ ] Verificar performance
- [ ] Testar em diferentes navegadores
- [ ] Validar acessibilidade

## 📚 Recursos

### Bibliotecas Usadas
- **Zustand**: Estado global
- **TanStack Router**: Roteamento
- **Radix UI**: Componentes acessíveis
- **Tailwind CSS**: Estilos
- **Lucide React**: Ícones

### Documentação
- [Zustand](https://github.com/pmndrs/zustand)
- [TanStack Router](https://tanstack.com/router)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 💡 Dicas Finais

1. **Use TypeScript**: Aproveite os tipos para evitar erros
2. **Zustand DevTools**: Essencial para debug
3. **Componentes Pequenos**: Mais fácil de manter
4. **Teste Incrementalmente**: Não espere tudo estar pronto
5. **Documente Mudanças**: Mantenha README atualizado

---

**Happy Coding! 🚀**
