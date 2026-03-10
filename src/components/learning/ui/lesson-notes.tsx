import { useState } from "react";
import { Save, Plus, Edit3, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  lessonId: string;
}

interface LessonNotesProps {
  lessonId: string;
  lessonTitle: string;
  className?: string;
}

export function LessonNotes({ 
  lessonId, 
  lessonTitle, 
  className 
}: LessonNotesProps) {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Conceitos importantes",
      content: "useState é fundamental para gerenciar estado em componentes funcionais. Sempre lembrar de usar a função setter para atualizar o estado.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      lessonId
    },
    {
      id: "2", 
      title: "Dúvida sobre useEffect",
      content: "Preciso revisar como funciona o array de dependências no useEffect. Quando deixar vazio vs quando incluir variáveis.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
      lessonId
    }
  ]);
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");

  const handleCreateNote = () => {
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle,
      content: newNoteContent,
      timestamp: new Date(),
      lessonId
    };
    
    setNotes(prev => [newNote, ...prev]);
    setNewNoteTitle("");
    setNewNoteContent("");
    setIsCreating(false);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const handleEditNote = (noteId: string, title: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, title, content, timestamp: new Date() }
        : note
    ));
    setEditingId(null);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Agora mesmo";
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Minhas Notas</h3>
            <p className="text-sm text-muted-foreground">
              {lessonTitle} • {notes.length} nota{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Button
            onClick={() => setIsCreating(true)}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Nota</span>
          </Button>
        </div>

        {/* Create Note Form */}
        {isCreating && (
          <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Criar Nova Nota</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Título da nota..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
              />
              <Textarea
                placeholder="Escreva sua nota aqui..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                rows={4}
              />
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleCreateNote}
                  size="sm"
                  disabled={!newNoteTitle.trim() || !newNoteContent.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button
                  onClick={() => {
                    setIsCreating(false);
                    setNewNoteTitle("");
                    setNewNoteContent("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">
                  Nenhuma nota criada ainda. Clique em "Nova Nota" para começar!
                </p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {editingId === note.id ? (
                    <EditNoteForm
                      note={note}
                      onSave={handleEditNote}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{note.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(note.timestamp)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingId(note.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Edit Note Form Component
function EditNoteForm({ 
  note, 
  onSave, 
  onCancel 
}: { 
  note: Note; 
  onSave: (id: string, title: string, content: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(note.id, title, content);
  };

  return (
    <div className="space-y-3">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título da nota..."
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Conteúdo da nota..."
        rows={4}
      />
      <div className="flex items-center space-x-2">
        <Button
          onClick={handleSave}
          size="sm"
          disabled={!title.trim() || !content.trim()}
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          size="sm"
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}