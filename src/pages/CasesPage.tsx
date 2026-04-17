import { useState } from "react";
import {
  Scale,
  Plus,
  Search,
  Filter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Case {
  id: string;
  fileNumber: string;
  type: string;
  court: string;
  status: "جارية" | "مغلقة" | "مؤجلة";
  startDate: string;
  notes: string;
}

const caseTypes = [
  "مدني",
  "جنائي",
  "تجاري",
  "إداري",
  "عقاري",
  "أسري",
  "شغل",
  "أخرى",
];

const courts = [
  "المحكمة الابتدائية",
  "محكمة الاستئناف",
  "محكمة النقض",
  "المحكمة التجارية",
  "المحكمة الإدارية",
];

const statusColors: Record<string, string> = {
  "جارية": "bg-success/10 text-success border-success/20",
  "مغلقة": "bg-muted text-muted-foreground border-border",
  "مؤجلة": "bg-warning/10 text-warning border-warning/20",
};

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    fileNumber: "",
    type: "",
    court: "",
    status: "جارية" as Case["status"],
    startDate: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.fileNumber.trim()) return;
    const newCase: Case = { ...form, id: crypto.randomUUID() };
    setCases((prev) => [newCase, ...prev]);
    setForm({ fileNumber: "", type: "", court: "", status: "جارية", startDate: "", notes: "" });
    setDialogOpen(false);
  };

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.fileNumber.includes(searchQuery) ||
      c.type.includes(searchQuery) ||
      c.court.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="w-7 h-7 text-accent" />
            إدارة القضايا
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cases.length} قضية مسجلة
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              قضية جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة قضية جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>رقم الملف *</Label>
                <Input
                  value={form.fileNumber}
                  onChange={(e) => setForm({ ...form, fileNumber: e.target.value })}
                  placeholder="مثال: 2024/1234"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>نوع القضية</Label>
                  <Select
                    value={form.type}
                    onValueChange={(v) => setForm({ ...form, type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {caseTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>المحكمة</Label>
                  <Select
                    value={form.court}
                    onValueChange={(v) => setForm({ ...form, court: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر المحكمة" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الحالة</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) => setForm({ ...form, status: v as Case["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="جارية">جارية</SelectItem>
                      <SelectItem value="مغلقة">مغلقة</SelectItem>
                      <SelectItem value="مؤجلة">مؤجلة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>تاريخ البداية</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>ملاحظات</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="ملاحظات إضافية..."
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                حفظ القضية
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث بالرقم أو النوع أو المحكمة..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "جارية", "مغلقة", "مؤجلة"].map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s === "all" ? "الكل" : s}
            </Button>
          ))}
        </div>
      </div>

      {/* Cases List */}
      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Scale className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {cases.length === 0 ? "لم يتم إضافة أي قضية بعد" : "لا توجد نتائج"}
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              {cases.length === 0 ? "ابدأ بإضافة أول قضية" : "جرب تغيير معايير البحث"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card
              key={c.id}
              className="shadow-card hover:shadow-card-hover transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Scale className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">ملف رقم: {c.fileNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {c.type} • {c.court}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.startDate && (
                      <span className="text-xs text-muted-foreground">{c.startDate}</span>
                    )}
                    <Badge variant="outline" className={statusColors[c.status]}>
                      {c.status}
                    </Badge>
                  </div>
                </div>
                {c.notes && (
                  <p className="text-sm text-muted-foreground mt-3 pr-14 line-clamp-1">
                    {c.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
