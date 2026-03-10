# Redesign Completo da Experiência de Admin - StudAI (Parte 2)

## Continuação do documento ADMIN_EXPERIENCE_REDESIGN.md

---

## 10. COMPONENTES DE INTERFACE

### 10.1 Árvore de Navegação (Tree View)

**Componente:** `NavigationTree`

**Props:**
```typescript
interface NavigationTreeProps {
  track: Track;
  selectedItem?: string; // ID do item selecionado
  onSelect: (itemId: string, itemType: 'module' | 'lesson') => void;
  onReorder: (items: ReorderData[]) => void;
  onAction: (action: TreeAction) => void;
}
```

**Funcionalidades:**
- Expand/collapse animado
- Drag-and-drop para reordenação
- Indicadores de status
- Busca inline
- Ações contextuais

**Uso:**
```tsx
<NavigationTree
  track={currentTrack}
  selectedItem={selectedLessonId}
  onSelect={handleSelect}
  onReorder={handleReorder}
  onAction={handleTreeAction}
/>
```

