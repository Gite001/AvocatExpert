import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
  File,
  Image,
  FolderOpen,
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

interface Document {
  id: string;
  name: string;
  category: string;
  linkedTo: string;
  fileType: string;
  size: string;
  date: string;
}

const categories = [
  "عقد",
  "مذكرة",
  "حكم",
  "شهادة",
  "تقرير",
  "مراسلة",
  "وكالة",
  "أخرى",
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    linkedTo: "",
    fileType: "PDF",
    size: "",
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const newDoc: Document = {
      ...form,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split("T")[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setForm({ name: "", category: "", linkedTo: "", fileType: "PDF", size: "" });
    setDialogOpen(false);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const filtered = documents.filter((d) => {
    const matchesSearch = d.name.includes(searchQuery) || d.linkedTo.includes(searchQuery);
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string) => {
    if (type.includes("صور") || type === "Image") return <Image className="w-5 h-5 text-accent" />;
    return <File className="w-5 h-5 text-primary" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            إدارة الوثائق
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {documents.length} وثيقة مسجلة
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              رفع وثيقة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة وثيقة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              {/* Drop zone */}
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">اسحب الملف هنا أو انقر للرفع</p>
                <p className="text-xs text-muted-foreground/60 mt-1">PDF, صور, Word</p>
              </div>
              <div>
                <Label>اسم الوثيقة *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="اسم الوثيقة"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>التصنيف</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="اختر التصنيف" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>مرتبط بـ</Label>
                  <Input
                    value={form.linkedTo}
                    onChange={(e) => setForm({ ...form, linkedTo: e.target.value })}
                    placeholder="زبون أو قضية"
                  />
                </div>
              </div>
              <Button onClick={handleSubmit} className="w-full">حفظ الوثيقة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث في الوثائق..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {documents.length === 0 ? "لم يتم رفع أي وثيقة بعد" : "لا توجد نتائج"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <Card key={doc.id} className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {getFileIcon(doc.fileType)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{doc.date}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteDocument(doc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {doc.category && (
                    <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                  )}
                  {doc.linkedTo && (
                    <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                      {doc.linkedTo}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">{doc.fileType}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
