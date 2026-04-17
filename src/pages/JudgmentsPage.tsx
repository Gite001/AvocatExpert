import { useState } from "react";
import {
  Gavel,
  Plus,
  Search,
  Trash2,
  Upload,
  FileText,
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

interface Judgment {
  id: string;
  number: string;
  date: string;
  court: string;
  type: string;
  summary: string;
  caseRef: string;
  clientName: string;
  notes: string;
}

const judgmentTypes = ["ابتدائي", "استئناف", "نقض"];
const courts = [
  "المحكمة الابتدائية",
  "محكمة الاستئناف",
  "محكمة النقض",
  "المحكمة التجارية",
  "المحكمة الإدارية",
];

const typeColors: Record<string, string> = {
  "ابتدائي": "bg-primary/10 text-primary border-primary/20",
  "استئناف": "bg-accent/10 text-accent border-accent/20",
  "نقض": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function JudgmentsPage() {
  const [judgments, setJudgments] = useState<Judgment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    number: "",
    date: "",
    court: "",
    type: "",
    summary: "",
    caseRef: "",
    clientName: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.number.trim()) return;
    const newJ: Judgment = { ...form, id: crypto.randomUUID() };
    setJudgments((prev) => [newJ, ...prev]);
    setForm({ number: "", date: "", court: "", type: "", summary: "", caseRef: "", clientName: "", notes: "" });
    setDialogOpen(false);
  };

  const deleteJudgment = (id: string) => {
    setJudgments((prev) => prev.filter((j) => j.id !== id));
  };

  const filtered = judgments.filter((j) => {
    const matchesSearch =
      j.number.includes(searchQuery) ||
      j.court.includes(searchQuery) ||
      j.clientName.includes(searchQuery) ||
      j.summary.includes(searchQuery);
    const matchesType = typeFilter === "all" || j.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Gavel className="w-7 h-7 text-accent" />
            إدارة الأحكام
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{judgments.length} حكم مسجل</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              حكم جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إضافة حكم جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>رقم الحكم *</Label>
                  <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="مثال: 2024/567" />
                </div>
                <div>
                  <Label>تاريخ الحكم</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>المحكمة</Label>
                  <Select value={form.court} onValueChange={(v) => setForm({ ...form, court: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر المحكمة" /></SelectTrigger>
                    <SelectContent>
                      {courts.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>نوع الحكم</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                    <SelectContent>
                      {judgmentTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>مرتبط بقضية</Label>
                  <Input value={form.caseRef} onChange={(e) => setForm({ ...form, caseRef: e.target.value })} placeholder="رقم الملف" />
                </div>
                <div>
                  <Label>الزبون</Label>
                  <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="اسم الزبون" />
                </div>
              </div>
              <div>
                <Label>منطوق الحكم</Label>
                <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="ملخص الحكم..." rows={3} />
              </div>
              {/* Upload zone */}
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">رفع نسخة PDF للحكم</p>
              </div>
              <div>
                <Label>ملاحظات</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="ملاحظات..." rows={2} />
              </div>
              <Button onClick={handleSubmit} className="w-full">حفظ الحكم</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث في الأحكام..." className="pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", ...judgmentTypes].map((t) => (
            <Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(t)}>
              {t === "all" ? "الكل" : t}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Gavel className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {judgments.length === 0 ? "لم يتم إضافة أي حكم بعد" : "لا توجد نتائج"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((j) => (
            <Card key={j.id} className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Gavel className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">حكم رقم: {j.number}</h3>
                      <p className="text-sm text-muted-foreground">
                        {j.court} {j.date && `• ${j.date}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {j.type && (
                      <Badge variant="outline" className={typeColors[j.type] || ""}>
                        {j.type}
                      </Badge>
                    )}
                    {j.clientName && (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {j.clientName}
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteJudgment(j.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {j.summary && (
                  <p className="text-sm text-muted-foreground mt-3 pr-14 line-clamp-2">{j.summary}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
