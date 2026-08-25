import { useEffect, useState } from "react";
import { Save, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { listSettings, upsertSettings } from "@/services/settings";
import { useAuth } from "@/contexts/AuthContext";

interface Settings {
  maintenance_mode: boolean;
  app_name: string;
  support_email: string;
  enable_translations: boolean;
  enable_budget: boolean;
  enable_services: boolean;
  enable_announcements: boolean;
  default_language: string;
  max_translation_entries: number;
}

const DEFAULT_SETTINGS: Settings = {
  maintenance_mode: false,
  app_name: "EduBridge",
  support_email: "support@edubridge.com",
  enable_translations: true,
  enable_budget: true,
  enable_services: true,
  enable_announcements: true,
  default_language: "en",
  max_translation_entries: 1000,
};

export function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      const data = await listSettings();

      if (data.length > 0) {
        const merged = { ...DEFAULT_SETTINGS };
        for (const row of data) {
          if (row.key in merged) {
            (merged as Record<string, unknown>)[row.key] = row.value;
          }
        }
        setSettings(merged);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value as unknown,
        updated_by: user?.id,
      }));

      await upsertSettings(entries);

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Configure the EduBridge platform
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application</CardTitle>
              <CardDescription>
                Basic application configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>App Name</Label>
                  <Input
                    value={settings.app_name}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, app_name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label>Support Email</Label>
                  <Input
                    type="email"
                    value={settings.support_email}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        support_email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Default Language</Label>
                <Input
                  value={settings.default_language}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      default_language: e.target.value,
                    }))
                  }
                  placeholder="en"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Enable or disable mobile app features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: "enable_translations" as const,
                  label: "Translations",
                  desc: "Allow users to access the translation feature",
                },
                {
                  key: "enable_budget" as const,
                  label: "Budget Tracker",
                  desc: "Allow users to track their expenses",
                },
                {
                  key: "enable_services" as const,
                  label: "Services Directory",
                  desc: "Show local services and contacts",
                },
                {
                  key: "enable_announcements" as const,
                  label: "Announcements",
                  desc: "Show admin announcements on home screen",
                },
              ].map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.desc}
                    </p>
                  </div>
                  <Switch
                    checked={settings[feature.key]}
                    onCheckedChange={(v) =>
                      setSettings((s) => ({ ...s, [feature.key]: v }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limits</CardTitle>
              <CardDescription>
                Configure feature limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Max Translation Entries</Label>
                <Input
                  type="number"
                  value={settings.max_translation_entries}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      max_translation_entries: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>
                System maintenance controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">
                    When enabled, the mobile app will show a maintenance screen
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {settings.maintenance_mode && (
                    <Badge variant="destructive">Active</Badge>
                  )}
                  <Switch
                    checked={settings.maintenance_mode}
                    onCheckedChange={(v) =>
                      setSettings((s) => ({ ...s, maintenance_mode: v }))
                    }
                  />
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Platform Info</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span>1.0.0</span>
                  <span className="text-muted-foreground">Environment</span>
                  <span>Production</span>
                  <span className="text-muted-foreground">Database</span>
                  <span>Supabase (PostgreSQL)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
