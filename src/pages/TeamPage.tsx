import { useState } from "react";
import {
  UserCog,
  Plus,
  Search,
  Trash2,
  Shield,
  Eye,
  Edit,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "مدير" | "محامي" | "مساعد" | "متدرب";
  permissions: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };
  active: boolean;
}

const roleColors: Record<string, string> = {
  "مدير": "bg-accent/10 text-accent border-accent/20",
  "محامي": "bg-primary/10 text-primary border-primary/20",
  "مساعد": "bg-success/10 text-success border-success/20",
  "متدرب": "bg-muted text-muted-foreground border-border",
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "owner",
      name: "المستخدم الرئيسي",
      email: "admin@mohamipro.ma",
      role: "مدير",
      permissions: { view: true, edit: true, delete: true },
      active: true,
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "مساعد" as TeamMember["role"],
    view: true,
    edit: false,
    delete: false,
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: form.name,
      email: form.email,
      role: form.role,
      permissions: { view: form.view, edit: form.edit, delete: form.delete },
      active: true,
    };
    setMembers((prev) => [...prev, newMember]);
    setForm({ name: "", email: "", role: "مساعد", view: true, edit: false, delete: false });
    setDialogOpen(false);
  };

  const deleteMember = (id: string) => {
    if (id === "owner") return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleActive = (id: string) => {
    if (id === "owner") return;
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, active: !m.active } : m))
    );
  };

  const filtered = members.filter(
    (m) => m.name.includes(searchQuery) || m.email.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserCog className="w-7 h-7 text-accent" />
            نظام الفريق
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {members.length} عضو في الفريق
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة عضو
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة عضو جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>الاسم الكامل *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسم العضو" />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" dir="ltr" />
              </div>
              <div>
                <Label>الدور</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as TeamMember["role"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="محامي">محامي</SelectItem>
                    <SelectItem value="مساعد">مساعد</SelectItem>
                    <SelectItem value="متدرب">متدرب</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <Label className="text-sm font-semibold">الصلاحيات</Label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">عرض</span>
                  </div>
                  <Switch checked={form.view} onCheckedChange={(v) => setForm({ ...form, view: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">تعديل</span>
                  </div>
                  <Switch checked={form.edit} onCheckedChange={(v) => setForm({ ...form, edit: v })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">حذف</span>
                  </div>
                  <Switch checked={form.delete} onCheckedChange={(v) => setForm({ ...form, delete: v })} />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">إضافة العضو</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="بحث بالاسم أو البريد..." className="pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <Card key={member.id} className={`shadow-card hover:shadow-card-hover transition-all ${!member.active ? "opacity-50" : ""}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    {member.email && (
                      <p className="text-xs text-muted-foreground" dir="ltr">{member.email}</p>
                    )}
                  </div>
                </div>
                {member.id !== "owner" && (
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteMember(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={roleColors[member.role]}>{member.role}</Badge>
                  <div className="flex gap-1">
                    {member.permissions.view && <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                    {member.permissions.edit && <Edit className="w-3.5 h-3.5 text-muted-foreground" />}
                    {member.permissions.delete && <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />}
                  </div>
                </div>
                {member.id !== "owner" && (
                  <Switch checked={member.active} onCheckedChange={() => toggleActive(member.id)} />
                )}
                {member.id === "owner" && (
                  <ShieldCheck className="w-5 h-5 text-accent" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
