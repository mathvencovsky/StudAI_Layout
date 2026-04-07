import { useState, useEffect, useCallback } from "react";
import { StickyNote, Save, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StudyNotesProps {
  contentId: string;
}

const STORAGE_KEY = (id: string) => `studai:notes:${id}`;

/**
 * Persistent study notes for a content item.
 * Saves to localStorage automatically after 1s of inactivity.
 * Inspired by Coursera's in-video notes.
 */
export function StudyNotes({ contentId }: StudyNotesProps) {
  const [notes, setNotes] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY(contentId)) ?? ""; } catch { return ""; }
  });
  const [saved, setSaved] = useState(true);
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Reset when content changes
  useEffect(() => {
    try {
      setNotes(localStorage.getItem(STORAGE_KEY(contentId)) ?? "");
      setSaved(true);
    } catch {}
  }, [contentId]);

  const saveNotes = useCallback((text: string) => {
    try { localStorage.setItem(STORAGE_KEY(contentId), text); } catch {}
    setSaved(true);
  }, [contentId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNotes(text);
    setSaved(false);
    if (saveTimer) clearTimeout(saveTimer);
    setSaveTimer(setTimeout(() => saveNotes(text), 1000));
  };

  const handleManualSave = () => saveNotes(notes);

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <StickyNote className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Minhas anotações</span>
        </div>
        <div className="flex items-center gap-2">
          {saved ? (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Check className="h-3 w-3 text-green-500" /> Salvo
            </span>
          ) : (
            <span className="text-[10px] text-muted-foreground">Não salvo</span>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-xs"
            onClick={handleManualSave}
            disabled={saved}
          >
            <Save className="h-3 w-3 mr-1" />
            Salvar
          </Button>
        </div>
      </div>
      <Textarea
        value={notes}
        onChange={handleChange}
        placeholder="Escreva suas anotações aqui... (salvo automaticamente)"
        className={cn(
          "border-0 rounded-none resize-none min-h-[100px] text-sm",
          "focus-visible:ring-0 focus-visible:ring-offset-0"
        )}
        rows={4}
      />
    </div>
  );
}
