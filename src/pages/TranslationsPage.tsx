import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Check,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { exportTranslationsReport } from "@/lib/pdf-export";
import type { Translation } from "@/db/schema";
import { mapTranslations } from "@/lib/mappers";

const CATEGORIES = [
  "general",
  "greeting",
  "academic",
  "emergency",
  "transport",
  "food",
  "health",
  "housing",
];

export function TranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Translation | null>(null);

  const [form, setForm] = useState({
    source_text: "",
    translated_text: "",
    source_language: "en",
    target_language: "sw",
    category: "general",
    is_verified: false,
  });

  const fetchTranslations = async () => {
    setLoading(true);
    let query = supabase
      .from("translations")
      .select("*")
      .order("created_at", { ascending: false });

    if (categoryFilter !== "all") query = query.eq("category", categoryFilter);
    if (search) {
      query = query.or(
        `source_text.ilike.%${search}%,translated_text.ilike.%${search}%`
      );
    }

    const { data } = await query;
    setTranslations(
      mapTranslations((data as Record<string, unknown>[]) || [])
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchTranslations();
  }, [categoryFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchTranslations, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      source_text: "",
      translated_text: "",
      source_language: "en",
      target_language: "sw",
      category: "general",
      is_verified: false,
    });
    setDialogOpen(true);
  };

  const openEdit = (t: Translation) => {
    setEditing(t);
    setForm({
      source_text: t.sourceText,
      translated_text: t.translatedText,
      source_language: t.sourceLanguage,
      target_language: t.targetLanguage,
      category: t.category || "general",
      is_verified: t.isVerified || false,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (editing) {
      await supabase
        .from("translations")
        .update({
          source_text: form.source_text,
          translated_text: form.translated_text,
          category: form.category,
          is_verified: form.is_verified,
        })
        .eq("id", editing.id);
    } else {
      await supabase.from("translations").insert({
        source_text: form.source_text,
        translated_text: form.translated_text,
        source_language: form.source_language,
        target_language: form.target_language,
        category: form.category,
        is_verified: form.is_verified,
      });
    }
    setDialogOpen(false);
    fetchTranslations();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("translations").delete().eq("id", id);
    fetchTranslations();
  };

  const toggleVerified = async (id: string, current: boolean) => {
    await supabase
      .from("translations")
      .update({ is_verified: !current })
      .eq("id", id);
    fetchTranslations();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Translations</h2>
          <p className="text-muted-foreground">
            Manage translation phrases for mobile app users
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              exportTranslationsReport(
                translations.map((t) => ({
                  source_text: t.sourceText,
                  translated_text: t.translatedText,
                  category: t.category,
                  is_verified: t.isVerified ? "Yes" : "No",
                }))
              )
            }
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Add Translation
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search translations..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>English</TableHead>
                <TableHead>Swahili</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : translations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">
                      No translations found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                translations.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {t.sourceText}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm">
                      {t.translatedText}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() =>
                          toggleVerified(t.id, t.isVerified || false)
                        }
                      >
                        {t.isVerified ? (
                          <Check className="size-4 text-green-600" />
                        ) : (
                          <X className="size-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(t)}>
                            <Pencil className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(t.id)}
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
              {editing ? "Edit Translation" : "Add Translation"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update translation phrase"
                : "Add a new phrase for mobile app users"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>English Text</Label>
              <Textarea
                value={form.source_text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, source_text: e.target.value }))
                }
                placeholder="Enter English text..."
              />
            </div>
            <div>
              <Label>Swahili Translation</Label>
              <Textarea
                value={form.translated_text}
                onChange={(e) =>
                  setForm((f) => ({ ...f, translated_text: e.target.value }))
                }
                placeholder="Enter Swahili translation..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_verified}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, is_verified: v }))
                    }
                  />
                  <Label>Verified</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.source_text || !form.translated_text}
            >
              {editing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
