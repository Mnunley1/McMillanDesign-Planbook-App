import { FolderPlus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCollections } from "@/hooks/use-collections";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";

interface AddToCollectionDialogProps {
  className?: string;
  compact?: boolean;
  planId: string;
}

export default function AddToCollectionDialog({
  planId,
  compact = false,
  className,
}: AddToCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const { collections, create, update } = useCollections();

  const isInAnyCollection = collections.some((c) =>
    (c.planIds ?? []).includes(planId)
  );

  const toggle = (id: string, planIds: string[], isInCollection: boolean) => {
    const updatedPlanIds = isInCollection
      ? planIds.filter((pid) => pid !== planId)
      : [...planIds, planId];
    update(id, { planIds: updatedPlanIds });
  };

  const handleCreate = () => {
    if (!newName.trim()) {
      return;
    }
    create(newName.trim(), "", [planId]);
    setNewName("");
  };

  // Control open state directly (instead of DialogTrigger) so we can stop the
  // surrounding card/row link from navigating without canceling the open.
  const openDialog = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {compact ? (
        <Button
          aria-label={
            isInAnyCollection ? "In a collection" : "Add to collection"
          }
          className={cn(
            "text-muted-foreground hover:text-foreground",
            isInAnyCollection &&
              "bg-primary/15 text-primary ring-1 ring-primary hover:bg-primary/25 hover:text-primary",
            className
          )}
          onClick={openDialog}
          size="icon"
          title={isInAnyCollection ? "In a collection" : "Add to collection"}
          variant="ghost"
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          className={cn(
            "w-full border-border hover:bg-accent hover:text-accent-foreground md:w-auto",
            isInAnyCollection &&
              "border-primary text-primary hover:bg-primary/10 hover:text-primary"
          )}
          onClick={openDialog}
          variant="outline"
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          {isInAnyCollection ? "In Collection" : "Add to Collection"}
        </Button>
      )}
      {/* Stop clicks bubbling through the React tree to a surrounding card/row
          link (portaled content still bubbles via React, not the DOM). */}
      <DialogContent
        className="sm:max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Select the collections this plan should belong to.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {collections.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No collections yet. Create one below.
            </p>
          ) : (
            <div className="max-h-64 space-y-1 overflow-y-auto">
              {collections.map((collection) => {
                const planIds = collection.planIds ?? [];
                const isInCollection = planIds.includes(planId);
                return (
                  <button
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                    key={collection._id}
                    onClick={() =>
                      toggle(collection._id, planIds, isInCollection)
                    }
                    type="button"
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{collection.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {planIds.length} plan
                        {planIds.length === 1 ? "" : "s"}
                      </span>
                    </span>
                    {isInCollection ? (
                      <span className="flex items-center gap-1 font-medium text-destructive text-xs">
                        <X className="h-3.5 w-3.5" />
                        Remove
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-medium text-primary text-xs">
                        <Plus className="h-3.5 w-3.5" />
                        Add
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2 border-border border-t pt-4">
            <Input
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreate();
                }
              }}
              placeholder="New collection name"
              value={newName}
            />
            <Button disabled={!newName.trim()} onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
