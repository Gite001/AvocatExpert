import { useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  Trash2,
  Download,
  Eye,
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

interface InvoiceItem {
  description: string;
  amount: number;
}

interface Invoice {
  id: string;
  number: string;
  clientName: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: "مدفوعة" | "معلقة" | "متأخرة";
  notes: string;
}

const statusColors: Record<string, string> = {
  "مدفوعة": "bg-success/10 text-success border-success/20",
  "معلقة": "bg-warning/10 text-warning border-warning/20",
  "متأخرة": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    date: "",
    dueDate: "",
    status: "معلقة" as Invoice["status"],
    itemDesc: "",
    itemAmount: "",
    notes: "",
  });
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const addItem = () => {
    if (!form.itemDesc || !form.itemAmount) return;
    setItems((prev) => [...prev, { description: form.itemDesc, amount: parseFloat(form.itemAmount) }]);
    setForm((f) => ({ ...f, itemDesc: "", itemAmount: "" }));
  };

  const handleSubmit = () => {
    if (!form.clientName.trim() || items.length === 0) return;
    const inv: Invoice = {
      id: crypto.randomUUID(),
      number: `INV-${Date.now().toString().slice(-6)}`,
      clientName: form.clientName,
      date: form.date || new Date().toISOString().split("T")[0],
      dueDate: form.dueDate,
      items: [...items],
      status: form.status,
      notes: form.notes,
    };
    setInvoices((prev) => [inv, ...prev]);
    setForm({ clientName: "", date: "", dueDate: "", status: "معلقة", itemDesc: "", itemAmount: "", notes: "" });
    setItems([]);
    setDialogOpen(false);
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch = inv.clientName.includes(searchQuery) || inv.number.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="w-7 h-7 text-success" />
            الفواتير
          </h1>
          <p className="text-muted-foreground text-sm mt-1">{invoices.length} فاتورة</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              فاتورة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>إنشاء فاتورة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>اسم الزبون *</Label>
                <Input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="اسم الزبون" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>تاريخ الفاتورة</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div>
                  <Label>تاريخ الاستحقاق</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>حالة الدفع</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Invoice["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="معلقة">معلقة</SelectItem>
                    <SelectItem value="مدفوعة">مدفوعة</SelectItem>
                    <SelectItem value="متأخرة">متأخرة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Items */}
              <div className="border rounded-lg p-3 space-y-3">
                <Label className="text-sm font-semibold">بنود الفاتورة</Label>
                {items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm bg-muted/50 rounded-lg px-3 py-2">
                    <span>{item.description}</span>
                    <span className="font-medium">{item.amount.toLocaleString()} د.م</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="الوصف"
                    value={form.itemDesc}
                    onChange={(e) => setForm({ ...form, itemDesc: e.target.value })}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="المبلغ"
                    value={form.itemAmount}
                    onChange={(e) => setForm({ ...form, itemAmount: e.target.value })}
                    className="w-28"
                    dir="ltr"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addItem}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {items.length > 0 && (
                  <div className="flex justify-between font-semibold text-sm border-t pt-2">
                    <span>المجموع</span>
                    <span>{items.reduce((s, i) => s + i.amount, 0).toLocaleString()} د.م</span>
                  </div>
                )}
              </div>
              <div>
                <Label>ملاحظات</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="ملاحظات..." rows={2} />
              </div>
              <Button onClick={handleSubmit} className="w-full">إنشاء الفاتورة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="بحث بالاسم أو الرقم..." className="pr-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {["all", "معلقة", "مدفوعة", "متأخرة"].map((s) => (
            <Button key={s} variant={statusFilter === s ? "default" : "outline"} size="sm" onClick={() => setStatusFilter(s)}>
              {s === "all" ? "الكل" : s}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {invoices.length === 0 ? "لم يتم إنشاء أي فاتورة بعد" : "لا توجد نتائج"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((inv) => {
            const total = inv.items.reduce((s, i) => s + i.amount, 0);
            return (
              <Card key={inv.id} className="shadow-card hover:shadow-card-hover transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{inv.number}</h3>
                        <p className="text-sm text-muted-foreground">
                          {inv.clientName} • {inv.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">{total.toLocaleString()} د.م</span>
                      <Badge variant="outline" className={statusColors[inv.status]}>
                        {inv.status}
                      </Badge>
                      <Button variant="ghost" size="icon" title="تحميل PDF">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteInvoice(inv.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
