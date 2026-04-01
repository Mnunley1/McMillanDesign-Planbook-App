import { useConvex } from "convex/react";
import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";

interface ExportButtonProps {
  endTime: number | undefined;
  startTime: number | undefined;
}

export default function ExportButton({
  startTime,
  endTime,
}: ExportButtonProps) {
  const convex = useConvex();
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await convex.query(api.analytics.getExportData, {
        startTime,
        endTime,
      });

      const header = "planNumber,planId,userId,date";
      const rows = data.map(
        (row) => `${row.planNumber},${row.planId},${row.userId},${row.date}`
      );
      const csv = [header, ...rows].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={loading}
        onClick={handleExport}
        size="sm"
        variant="outline"
      >
        <Download className="mr-2 h-4 w-4" />
        {loading ? "Exporting..." : "Export CSV"}
      </Button>
      {error && <span className="text-destructive text-xs">{error}</span>}
    </div>
  );
}
