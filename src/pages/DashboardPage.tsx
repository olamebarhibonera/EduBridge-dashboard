import { useEffect, useState } from "react";
import {
  Users,
  Languages,
  MapPin,
  TrendingUp,
  Activity,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTranslations: number;
  totalServices: number;
  recentUsers: { full_name: string; email: string; created_at: string; status: string }[];
  recentActivity: { action: string; entity_type: string; created_at: string; user_id: string }[];
}

const userChartConfig = {
  students: { label: "Students", color: "var(--chart-1)" },
  admins: { label: "Admins", color: "var(--chart-2)" },
} satisfies ChartConfig;

const COLORS = ["#6345cd", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [usersRes, translationsRes, servicesRes, recentUsersRes, activityRes] =
          await Promise.all([
            supabase.from("profiles").select("id, role, status", { count: "exact" }),
            supabase.from("translations").select("id", { count: "exact" }),
            supabase.from("services").select("id", { count: "exact" }),
            supabase
              .from("profiles")
              .select("full_name, email, created_at, status")
              .order("created_at", { ascending: false })
              .limit(5),
            supabase
              .from("activity_log")
              .select("action, entity_type, created_at, user_id")
              .order("created_at", { ascending: false })
              .limit(10),
          ]);

        const users = usersRes.data || [];
        setStats({
          totalUsers: usersRes.count || users.length,
          activeUsers: users.filter((u) => u.status === "active").length,
          totalTranslations: translationsRes.count || 0,
          totalServices: servicesRes.count || 0,
          recentUsers: recentUsersRes.data || [],
          recentActivity: activityRes.data || [],
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      description: `${stats?.activeUsers ?? 0} active`,
      trend: "+12%",
    },
    {
      title: "Translations",
      value: stats?.totalTranslations ?? 0,
      icon: Languages,
      description: "Phrase entries",
      trend: "+8%",
    },
    {
      title: "Services",
      value: stats?.totalServices ?? 0,
      icon: MapPin,
      description: "Active listings",
      trend: "+3%",
    },
    {
      title: "Activity",
      value: stats?.recentActivity?.length ?? 0,
      icon: Activity,
      description: "Recent actions",
      trend: "Live",
    },
  ];

  const monthlyData = [
    { month: "Jan", students: 45, admins: 2 },
    { month: "Feb", students: 62, admins: 3 },
    { month: "Mar", students: 78, admins: 3 },
    { month: "Apr", students: 95, admins: 4 },
    { month: "May", students: 110, admins: 4 },
    { month: "Jun", students: 132, admins: 5 },
  ];

  const categoryData = [
    { name: "Academic", value: 35 },
    { name: "Housing", value: 25 },
    { name: "Health", value: 20 },
    { name: "Transport", value: 12 },
    { name: "Other", value: 8 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your EduBridge platform
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="mr-1 size-3" />
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly registration trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={userChartConfig} className="h-[300px]">
              <BarChart data={monthlyData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="students"
                  fill="var(--color-students)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="admins"
                  fill="var(--color-admins)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: "Count" } }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats?.recentUsers ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No users registered yet
                </p>
              )}
              {(stats?.recentUsers ?? []).map((user, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {user.full_name || "Unnamed"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats?.recentActivity ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No activity recorded yet
                </p>
              )}
              {(stats?.recentActivity ?? []).map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Activity className="size-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.entity_type} &bull;{" "}
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
