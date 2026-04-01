import { Plus } from "lucide-react";
import { useState } from "react";
import { useCollections } from "@/hooks/use-collections";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function CollectionManager() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { create } = useCollections();

  const handleCreate = () => {
    if (!name.trim()) {
      return;
    }
    create(name.trim(), description.trim());
    setName("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Organize plans into a named collection.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="collection-name">Name</Label>
            <Input
              id="collection-name"
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Modern Ranch Plans"
              value={name}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="collection-desc">Description</Label>
            <Input
              id="collection-desc"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              value={description}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button disabled={!name.trim()} onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
