import { useState } from "react";
import {
  Archive,
  Plus,
  Search,
  Trash2,
  Upload,
  FileText,
  BookOpen,
  File,
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

interface ArchiveItem {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
  date: string;
  tags: string;
}

const archiveTypes = ["حكم", "عقد", "مذكرة", "قانون", "مرسوم", "دورية", "أخرى"];

export default function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    type: "",
    category: "",
    description: "",
    tags: "",
  });

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const newItem: ArchiveItem = {
      ...form,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
    };
    setItems((prev) => [newItem, ...prev]);
    setForm({ title: "", type: "", category: "", description: "", tags: "" });
    setDialogOpen(false);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.title.includes(searchQuery) ||
      item.description.includes(searchQuery) ||
      item.tags.includes(searchQuery);
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: string) => {
    if (type === "حكم") return <BookOpen className="w-5 h-5 text-accent" />;
    if (type === "عقد") return <FileText className="w-5 h-5 text-primary" />;
    return <File className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Archive className="w-7 h-7 text-primary" />
            الأرشيف القانوني
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{items.length} وثيقة في الأرشيف</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة للأرشيف
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة وثيقة للأرشيف</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>العنوان *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="عنوان الوثيقة" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>النوع</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                    <SelectContent>
                      {archiveTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>التصنيف</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="مثال: قانون الشغل" />
                </div>
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">رفع ملف PDF</p>
              </div>
              <div>
                <Label>وصف</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="وصف مختصر..." rows={3} />
              </div>
              <div>
                <Label>كلمات مفتاحية</Label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="كلمات للبحث، مفصولة بفاصلة" />
              </div>
              <Button onClick={handleSubmit} className="w-full">حفظ في الأرشيف</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث في الأرشيف..." className="pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="النوع" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {archiveTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Archive className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {items.length === 0 ? "الأرشيف فارغ" : "لا توجد نتائج"}
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              {items.length === 0 ? "ابدأ بإضافة أول وثيقة" : "جرب البحث بكلمات أخرى"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <Card key={item.id} className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteItem(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  {item.type && <Badge variant="outline" className="text-xs">{item.type}</Badge>}
                  {item.category && <Badge variant="secondary" className="text-xs">{item.category}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
