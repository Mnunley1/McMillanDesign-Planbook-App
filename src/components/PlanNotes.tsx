import { StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { usePlanNotes } from "@/hooks/use-plan-notes";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface PlanNotesProps {
  planId: string;
}

export default function PlanNotes({ planId }: PlanNotesProps) {
  const { note, save, remove, hasNote } = usePlanNotes(planId);
  const [text, setText] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setText(note?.text ?? "");
  }, [note?.text]);

  const handleBlur = () => {
    if (text.trim() !== (note?.text ?? "")) {
      if (text.trim()) {
        save(text.trim());
      } else if (hasNote) {
        remove();
      }
    }
  };

  return (
    <div className="space-y-2">
      <button
        className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <StickyNote className="h-4 w-4" />
        {hasNote ? "Edit Note" : "Add Note"}
      </button>

      {expanded && (
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
            rows={3}
            value={text}
          />
          {hasNote && (
            <Button
              className="text-xs"
              onClick={() => {
                remove();
                setText("");
              }}
              size="sm"
              variant="ghost"
            >
              Delete Note
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
