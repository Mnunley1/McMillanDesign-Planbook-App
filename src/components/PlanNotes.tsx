import { StickyNote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePlanNotes } from "@/hooks/use-plan-notes";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface PlanNotesProps {
  planId: string;
}

export default function PlanNotes({ planId }: PlanNotesProps) {
  const { note, save, remove, hasNote } = usePlanNotes(planId);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(note?.text ?? "");
  }, [note?.text]);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
    }
  }, [editing]);

  const persist = (closeEditor: boolean) => {
    const trimmed = text.trim();
    if (trimmed !== (note?.text ?? "")) {
      if (trimmed) {
        save(trimmed);
      } else if (hasNote) {
        remove();
      }
    }
    if (closeEditor || !trimmed) {
      setEditing(false);
    }
  };

  const handleBlur = () => persist(false);
  const handleSave = () => persist(true);

  const handleDelete = () => {
    remove();
    setText("");
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border border-dashed p-4",
        editing && "border-solid"
      )}
    >
      {!editing && hasNote && (
        <div className="space-y-2">
          <p className="line-clamp-3 text-muted-foreground text-sm">
            {note?.text}
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setEditing(true)} size="sm" variant="ghost">
              Edit
            </Button>
          </div>
        </div>
      )}

      {!(editing || hasNote) && (
        <button
          className="flex w-full flex-col items-center gap-2 py-2 text-muted-foreground text-sm hover:text-foreground"
          onClick={() => setEditing(true)}
          type="button"
        >
          <StickyNote className="h-4 w-4" />
          Add a note about this plan
        </button>
      )}

      {editing && (
        <div className="space-y-2">
          <Label className="sr-only" htmlFor={`note-${planId}`}>
            Plan notes
          </Label>
          <textarea
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            id={`note-${planId}`}
            onBlur={handleBlur}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add your notes about this plan..."
            ref={textareaRef}
            rows={3}
            value={text}
          />
          <div className="flex items-center justify-between">
            {hasNote && (
              <Button
                className="text-xs"
                onClick={handleDelete}
                size="sm"
                variant="ghost"
              >
                Delete
              </Button>
            )}
            <div className={cn("flex gap-2", !hasNote && "ml-auto")}>
              <Button
                className="text-xs"
                onClick={() => {
                  setText(note?.text ?? "");
                  setEditing(false);
                }}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button className="text-xs" onClick={handleSave} size="sm">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
