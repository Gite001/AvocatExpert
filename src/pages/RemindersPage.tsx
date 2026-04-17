import { useState } from "react";
import {
  Bell,
  Plus,
  Search,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Reminder {
  id: string;
  title: string;
  description: string;
  linkedTo: string;
  date: string;
  time: string;
  done: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    linkedTo: "",
    date: "",
    time: "",
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const newR: Reminder = { ...form, id: crypto.randomUUID(), done: false };
    setReminders((prev) => [newR, ...prev]);
    setForm({ title: "", description: "", linkedTo: "", date: "", time: "" });
    setDialogOpen(false);
  };

  const toggleDone = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const today = new Date().toISOString().split("T")[0];

  const filtered = reminders.filter((r) => {
    const matchesSearch = r.title.includes(searchQuery) || r.linkedTo.includes(searchQuery);
    const matchesFilter =
      filter === "all" ||
      (filter === "done" && r.done) ||
      (filter === "pending" && !r.done);
    return matchesSearch && matchesFilter;
  });

  const pendingCount = reminders.filter((r) => !r.done).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="w-7 h-7 text-destructive" />
            التذكيرات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {pendingCount} تذكير معلق
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              تذكير جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة تذكير جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>العنوان *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="عنوان التذكير" />
              </div>
              <div>
                <Label>الوصف</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="تفاصيل التذكير..." rows={3} />
              </div>
              <div>
                <Label>مرتبط بـ (قضية / ملف / حكم)</Label>
                <Input value={form.linkedTo} onChange={(e) => setForm({ ...form, linkedTo: e.target.value })} placeholder="مرجع" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>التاريخ</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <Label>الوقت</Label>
                  <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">حفظ التذكير</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث في التذكيرات..." className="pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "done"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
              {f === "all" ? "الكل" : f === "pending" ? "معلق" : "مكتمل"}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {reminders.length === 0 ? "لم يتم إضافة أي تذكير بعد" : "لا توجد نتائج"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const isOverdue = !r.done && r.date && r.date < today;
            return (
              <Card key={r.id} className={`shadow-card hover:shadow-card-hover transition-all ${r.done ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleDone(r.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          r.done ? "bg-success/10" : isOverdue ? "bg-destructive/10" : "bg-warning/10"
                        }`}
                      >
                        {r.done ? (
                          <CheckCircle className="w-5 h-5 text-success" />
                        ) : isOverdue ? (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <Clock className="w-5 h-5 text-warning" />
                        )}
                      </button>
                      <div>
                        <h3 className={`font-semibold ${r.done ? "line-through" : ""}`}>{r.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          {r.date && <span>{r.date}</span>}
                          {r.time && <span>{r.time}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.linkedTo && (
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                          {r.linkedTo}
                        </Badge>
                      )}
                      {isOverdue && (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-xs">
                          متأخر
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteReminder(r.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {r.description && (
                    <p className="text-sm text-muted-foreground mt-3 pr-14 line-clamp-2">{r.description}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
