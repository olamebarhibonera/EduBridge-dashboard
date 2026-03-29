import { useEffect, useState } from "react";
import {
  Search,
  Download,
  MoreHorizontal,
  UserPlus,
  Shield,
  Ban,
  CheckCircle,
  Plus,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { formatDate, getInitials } from "@/lib/utils";
import { exportUserReport } from "@/lib/pdf-export";
import type { Profile } from "@/db/schema";

type DialogMode = "view" | "create" | "edit";

export function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("view");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    university: "",
    course: "",
    phone: "",
    role: "student",
    status: "active",
    preferred_language: "en",
  });

  const fetchUsers = async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (roleFilter !== "all") query = query.eq("role", roleFilter);
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,university.ilike.%${search}%`
      );
    }

    const { data } = await query;
    setUsers((data as Profile[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  const openCreate = () => {
    setDialogMode("create");
    setSelectedUser(null);
    setForm({
      full_name: "",
      email: "",
      university: "",
      course: "",
      phone: "",
      role: "student",
      status: "active",
      preferred_language: "en",
    });
    setDialogOpen(true);
  };

  const openEdit = (user: Profile) => {
    setDialogMode("edit");
    setSelectedUser(user);
    setForm({
      full_name: user.fullName || "",
      email: user.email || "",
      university: user.university || "",
      course: user.course || "",
      phone: user.phone || "",
      role: user.role || "student",
      status: user.status || "active",
      preferred_language: user.preferredLanguage || "en",
    });
    setDialogOpen(true);
  };

  const openView = (user: Profile) => {
    setDialogMode("view");
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (dialogMode === "create") {
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: form.email,
            password: "TempPass123!",
            email_confirm: true,
            user_metadata: {
              full_name: form.full_name,
              role: form.role,
            },
          });

        if (authError) {
          const { error: insertError } = await supabase.from("profiles").insert({
            id: crypto.randomUUID(),
            full_name: form.full_name,
            email: form.email,
            university: form.university || null,
            course: form.course || null,
            phone: form.phone || null,
            role: form.role,
            status: form.status,
            preferred_language: form.preferred_language,
          });
          if (insertError) {
            console.error("Create user error:", insertError);
          }
        } else if (authData?.user) {
          await supabase
            .from("profiles")
            .update({
              full_name: form.full_name,
              university: form.university || null,
              course: form.course || null,
              phone: form.phone || null,
              role: form.role,
              status: form.status,
              preferred_language: form.preferred_language,
            })
            .eq("id", authData.user.id);
        }

        await supabase.from("activity_log").insert({
          action: `Created user profile: ${form.full_name || form.email}`,
          entity_type: "user",
          metadata: { email: form.email, role: form.role },
        });
      } else if (dialogMode === "edit" && selectedUser) {
        await supabase
          .from("profiles")
          .update({
            full_name: form.full_name,
            email: form.email,
            university: form.university || null,
            course: form.course || null,
            phone: form.phone || null,
            role: form.role,
            status: form.status,
            preferred_language: form.preferred_language,
          })
          .eq("id", selectedUser.id);

        await supabase.from("activity_log").insert({
          action: `Updated user profile: ${form.full_name || form.email}`,
          entity_type: "user",
          entity_id: selectedUser.id,
          metadata: { changes: form },
        });
      }

      setDialogOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    await supabase.from("profiles").delete().eq("id", userToDelete.id);
    await supabase.from("activity_log").insert({
      action: `Deleted user: ${userToDelete.fullName || userToDelete.email}`,
      entity_type: "user",
      entity_id: userToDelete.id,
    });
    setDeleteDialogOpen(false);
    setUserToDelete(null);
    fetchUsers();
  };

  const updateUser = async (id: string, updates: Partial<Profile>) => {
    await supabase.from("profiles").update(updates).eq("id", id);
    await supabase.from("activity_log").insert({
      action: `Updated user ${Object.keys(updates).join(", ")}`,
      entity_type: "user",
      entity_id: id,
      metadata: updates,
    });
    fetchUsers();
  };

  const statusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      pending: "outline",
      suspended: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const roleBadge = (role: string) => {
    if (role === "admin")
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          <Shield className="mr-1 size-3" />
          Admin
        </Badge>
      );
    if (role === "moderator")
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Moderator
        </Badge>
      );
    return <Badge variant="secondary">Student</Badge>;
  };

  const renderForm = () => (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Full Name</Label>
          <Input
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            placeholder="John Doe"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="user@example.com"
            disabled={dialogMode === "edit"}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>University</Label>
          <Input
            value={form.university}
            onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))}
            placeholder="University of Nairobi"
          />
        </div>
        <div>
          <Label>Course</Label>
          <Input
            value={form.course}
            onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
            placeholder="Computer Science"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+254..."
          />
        </div>
        <div>
          <Label>Preferred Language</Label>
          <Select
            value={form.preferred_language}
            onValueChange={(v) => setForm((f) => ({ ...f, preferred_language: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="sw">Swahili</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Role</Label>
          <Select
            value={form.role}
            onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Create, edit, and manage all users on the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              exportUserReport(
                users.map((u) => ({
                  ...u,
                  created_at: u.createdAt ? formatDate(u.createdAt) : "",
                }))
              )
            }
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>University</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs bg-primary/10">
                            {getInitials(user.fullName || user.email || "?")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {user.fullName || "Unnamed"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.university || "—"}
                    </TableCell>
                    <TableCell>{roleBadge(user.role || "student")}</TableCell>
                    <TableCell>{statusBadge(user.status || "active")}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.createdAt ? formatDate(user.createdAt) : "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(user)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(user)}>
                            <Pencil className="mr-2 size-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => updateUser(user.id, { role: "admin" })}
                          >
                            <Shield className="mr-2 size-4" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => updateUser(user.id, { role: "student" })}
                          >
                            <UserPlus className="mr-2 size-4" />
                            Set as Student
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "suspended" ? (
                            <DropdownMenuItem
                              onClick={() => updateUser(user.id, { status: "active" })}
                            >
                              <CheckCircle className="mr-2 size-4" />
                              Activate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => updateUser(user.id, { status: "suspended" })}
                            >
                              <Ban className="mr-2 size-4" />
                              Suspend
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 size-4" />
                            Delete User
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create"
                ? "Create New User"
                : dialogMode === "edit"
                ? "Edit User Profile"
                : "User Details"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "create"
                ? "Add a new user to the platform"
                : dialogMode === "edit"
                ? `Editing profile for ${selectedUser?.fullName || selectedUser?.email}`
                : `Profile information for ${selectedUser?.fullName || selectedUser?.email}`}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === "view" && selectedUser ? (
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16">
                  <AvatarFallback className="text-lg bg-primary/10">
                    {getInitials(selectedUser.fullName || selectedUser.email || "?")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {selectedUser.fullName || "Unnamed"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">University</Label>
                  <p className="text-sm font-medium">{selectedUser.university || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Course</Label>
                  <p className="text-sm font-medium">{selectedUser.course || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="text-sm font-medium">{selectedUser.phone || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Language</Label>
                  <p className="text-sm font-medium">{selectedUser.preferredLanguage || "en"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Role</Label>
                  <div className="mt-1">{roleBadge(selectedUser.role || "student")}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">{statusBadge(selectedUser.status || "active")}</div>
                </div>
              </div>
            </div>
          ) : (
            renderForm()
          )}

          <DialogFooter>
            {dialogMode === "view" ? (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (selectedUser) openEdit(selectedUser);
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || !form.email}
                >
                  {saving ? "Saving..." : dialogMode === "create" ? "Create User" : "Save Changes"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {userToDelete?.fullName || userToDelete?.email}
              </span>
              ? This action cannot be undone and will permanently remove their
              profile and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
