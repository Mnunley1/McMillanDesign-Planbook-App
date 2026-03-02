import { BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";
import DateRangeSelect, {
  type DateRange,
  RANGE_MS,
} from "@/components/analytics/DateRangeSelect";
import EngagementTab from "@/components/analytics/EngagementTab";
import ExportButton from "@/components/analytics/ExportButton";
import OverviewTab from "@/components/analytics/OverviewTab";
import SearchAnalyticsTab from "@/components/analytics/SearchAnalyticsTab";
import TrendingTab from "@/components/analytics/TrendingTab";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const { startTime, endTime } = useMemo(() => {
    if (dateRange === "all") {
      return { startTime: undefined, endTime: undefined };
    }
    const now = Date.now();
    return { startTime: now - RANGE_MS[dateRange], endTime: now };
  }, [dateRange]);

  return (
    <Container className="max-w-5xl py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="flex items-center gap-2 font-bold text-2xl">
          <BarChart3 className="h-6 w-6 text-primary" />
          Analytics
        </h1>
        <div className="flex items-center gap-3">
          <DateRangeSelect onChange={setDateRange} value={dateRange} />
          <ExportButton endTime={endTime} startTime={startTime} />
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab endTime={endTime} startTime={startTime} />
        </TabsContent>

        <TabsContent value="engagement">
          <EngagementTab endTime={endTime} startTime={startTime} />
        </TabsContent>

        <TabsContent value="trending">
          <TrendingTab dateRange={dateRange} />
        </TabsContent>

        <TabsContent value="search">
          <SearchAnalyticsTab startTime={startTime} />
        </TabsContent>
      </Tabs>
    </Container>
  );
}
