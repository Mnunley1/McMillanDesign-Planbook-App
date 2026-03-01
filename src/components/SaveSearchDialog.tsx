import { Save } from "lucide-react";
import { useState } from "react";
import { useInstantSearch } from "react-instantsearch";
import { useSavedSearches } from "@/hooks/use-saved-searches";
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

export default function SaveSearchDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { indexUiState } = useInstantSearch();
  const { save } = useSavedSearches();

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    save(name.trim(), JSON.stringify(indexUiState));
    setName("");
    setOpen(false);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button
          className="w-full text-muted-foreground"
          size="sm"
          variant="ghost"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Search</DialogTitle>
          <DialogDescription>
            Give this search a name to quickly reload it later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="search-name">Name</Label>
            <Input
              id="search-name"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              placeholder="e.g., 3+ bed ranch plans"
              value={name}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)} variant="ghost">
              Cancel
            </Button>
            <Button disabled={!name.trim()} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
