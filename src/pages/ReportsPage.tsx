import { useEffect, useState } from "react";
import {
  Download,
  Users,
  Languages,
  DollarSign,
  MapPin,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import {
  exportUserReport,
  exportTranslationsReport,
  exportTransactionsReport,
  exportToPDF,
} from "@/lib/pdf-export";

const chartConfig = {
  count: { label: "Count", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function ReportsPage() {
  const [reportType, setReportType] = useState("users");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    translations: 0,
    services: 0,
    transactions: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      const [u, t, s, tx] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("translations").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        users: u.count || 0,
        translations: t.count || 0,
        services: s.count || 0,
        transactions: tx.count || 0,
      });
    }
    fetchCounts();
  }, []);

  const handleExport = async () => {
    setLoading(true);
    try {
      if (reportType === "users") {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        exportUserReport(
          (data || []).map((u) => ({
            ...u,
            created_at: u.created_at ? formatDate(u.created_at) : "",
          }))
        );
      } else if (reportType === "translations") {
        const { data } = await supabase
          .from("translations")
          .select("*")
          .order("created_at", { ascending: false });
        exportTranslationsReport(
          (data || []).map((t) => ({
            ...t,
            is_verified: t.is_verified ? "Yes" : "No",
          }))
        );
      } else if (reportType === "transactions") {
        const { data } = await supabase
          .from("transactions")
          .select("*")
          .order("date", { ascending: false });
        exportTransactionsReport(
          (data || []).map((t) => ({
            ...t,
            date: t.date ? formatDate(t.date) : "",
          }))
        );
      } else if (reportType === "services") {
        const { data } = await supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: false });
        exportToPDF({
          title: "EduBridge Services Report",
          subtitle: `Total Services: ${(data || []).length}`,
          columns: [
            { header: "Name", dataKey: "name" },
            { header: "Category", dataKey: "category" },
            { header: "Address", dataKey: "address" },
            { header: "Phone", dataKey: "phone" },
            { header: "Active", dataKey: "is_active" },
          ],
          data: (data || []).map((s) => ({
            ...s,
            is_active: s.is_active ? "Yes" : "No",
          })),
        });
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const growthData = [
    { month: "Oct", count: 20 },
    { month: "Nov", count: 35 },
    { month: "Dec", count: 52 },
    { month: "Jan", count: 71 },
    { month: "Feb", count: 95 },
    { month: "Mar", count: stats.users || 120 },
  ];

  const reportCards = [
    {
      title: "User Report",
      description: "Export all registered users with roles and status",
      icon: Users,
      count: stats.users,
      type: "users",
    },
    {
      title: "Translations Report",
      description: "Export all translation phrase entries",
      icon: Languages,
      count: stats.translations,
      type: "translations",
    },
    {
      title: "Budget Report",
      description: "Export all user financial transactions",
      icon: DollarSign,
      count: stats.transactions,
      type: "transactions",
    },
    {
      title: "Services Report",
      description: "Export all service listings",
      icon: MapPin,
      count: stats.services,
      type: "services",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and export platform data as PDF reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {reportCards.map((card) => (
          <Card
            key={card.type}
            className={`cursor-pointer transition-all hover:shadow-md ${
              reportType === card.type ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setReportType(card.type)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <card.icon className="size-5 text-muted-foreground" />
                <span className="text-2xl font-bold">{card.count}</span>
              </div>
              <CardTitle className="text-sm">{card.title}</CardTitle>
              <CardDescription className="text-xs">
                {card.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>User registrations over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={growthData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-count)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Data</CardTitle>
            <CardDescription>
              Download data as formatted PDF documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="users">User Report</SelectItem>
                  <SelectItem value="translations">Translations Report</SelectItem>
                  <SelectItem value="transactions">Budget Report</SelectItem>
                  <SelectItem value="services">Services Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={handleExport}
              disabled={loading}
            >
              <Download className="mr-2 size-4" />
              {loading ? "Generating..." : "Export as PDF"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              <FileText className="inline size-3 mr-1" />
              PDF reports include all records with formatted tables
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
