import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Pencil, Trash2, Megaphone } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import type { Announcement } from "@/db/schema";
import { mapAnnouncements } from "@/lib/mappers";

const PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "normal" as string,
    target_audience: "all",
    is_active: true,
    expires_at: "",
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setAnnouncements(
      mapAnnouncements((data as Record<string, unknown>[]) || [])
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      content: "",
      priority: "normal",
      target_audience: "all",
      is_active: true,
      expires_at: "",
    });
    setDialogOpen(true);
  };

  const openEdit = (a: Announcement) => {
    setEditing(a);
    setForm({
      title: a.title,
      content: a.content,
      priority: a.priority || "normal",
      target_audience: a.targetAudience || "all",
      is_active: a.isActive ?? true,
      expires_at: a.expiresAt
        ? new Date(a.expiresAt).toISOString().slice(0, 16)
        : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title,
      content: form.content,
      priority: form.priority,
      target_audience: form.target_audience,
      is_active: form.is_active,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };

    if (editing) {
      await supabase.from("announcements").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("announcements").insert(payload);
    }
    setDialogOpen(false);
    fetchAnnouncements();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnnouncements();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase
      .from("announcements")
      .update({ is_active: !current })
      .eq("id", id);
    fetchAnnouncements();
  };

  const priorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      low: "bg-gray-100 text-gray-700",
      normal: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };
    return (
      <Badge className={colors[priority] || colors.normal}>{priority}</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            Send announcements to mobile app users
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          New Announcement
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Megaphone className="mx-auto mb-2 size-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No announcements yet
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{a.title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {a.content}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{priorityBadge(a.priority || "normal")}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {a.targetAudience || "all"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={a.isActive ?? true}
                        onCheckedChange={() =>
                          toggleActive(a.id, a.isActive ?? true)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {a.expiresAt ? formatDate(a.expiresAt) : "Never"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {a.createdAt ? formatDate(a.createdAt) : "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(a)}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(a.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update announcement details"
                : "This will be visible to all mobile app users"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Announcement title"
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                placeholder="Announcement content..."
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Priority</Label>
                <Select
                  value={form.priority}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, priority: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Target Audience</Label>
                <Select
                  value={form.target_audience}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, target_audience: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="new">New Students</SelectItem>
                    <SelectItem value="returning">Returning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expires At (optional)</Label>
                <Input
                  type="datetime-local"
                  value={form.expires_at}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expires_at: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-end gap-2">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, is_active: v }))
                  }
                />
                <Label>Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.title || !form.content}
            >
              {editing ? "Update" : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
