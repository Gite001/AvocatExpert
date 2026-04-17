import { useState } from "react";
import {
  Wallet,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
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
import { Progress } from "@/components/ui/progress";

interface Payment {
  id: string;
  clientName: string;
  caseRef: string;
  totalAmount: number;
  paidAmount: number;
  date: string;
  notes: string;
  transactions: { amount: number; date: string; note: string }[];
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [form, setForm] = useState({
    clientName: "",
    caseRef: "",
    totalAmount: "",
    paidAmount: "",
    date: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.clientName.trim() || !form.totalAmount) return;
    const paid = parseFloat(form.paidAmount) || 0;
    const newPayment: Payment = {
      id: crypto.randomUUID(),
      clientName: form.clientName,
      caseRef: form.caseRef,
      totalAmount: parseFloat(form.totalAmount),
      paidAmount: paid,
      date: form.date || new Date().toISOString().split("T")[0],
      notes: form.notes,
      transactions: paid > 0
        ? [{ amount: paid, date: form.date || new Date().toISOString().split("T")[0], note: "دفعة أولى" }]
        : [],
    };
    setPayments((prev) => [newPayment, ...prev]);
    setForm({ clientName: "", caseRef: "", totalAmount: "", paidAmount: "", date: "", notes: "" });
    setDialogOpen(false);
  };

  const handlePay = () => {
    if (!selectedPayment || !payAmount) return;
    const amount = parseFloat(payAmount);
    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment
          ? {
              ...p,
              paidAmount: p.paidAmount + amount,
              transactions: [
                ...p.transactions,
                { amount, date: new Date().toISOString().split("T")[0], note: payNote || "دفعة" },
              ],
            }
          : p
      )
    );
    setPayAmount("");
    setPayNote("");
    setPayDialogOpen(false);
    setSelectedPayment(null);
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const totalRevenue = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = payments.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0);

  const filtered = payments.filter(
    (p) =>
      p.clientName.includes(searchQuery) ||
      p.caseRef.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-7 h-7 text-warning" />
            الأتعاب والمدفوعات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {payments.length} سجل مالي
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              أتعاب جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة أتعاب جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>اسم الزبون *</Label>
                <Input
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  placeholder="اسم الزبون"
                />
              </div>
              <div>
                <Label>مرجع القضية</Label>
                <Input
                  value={form.caseRef}
                  onChange={(e) => setForm({ ...form, caseRef: e.target.value })}
                  placeholder="رقم الملف"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>المبلغ الإجمالي (د.م) *</Label>
                  <Input
                    type="number"
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: e.target.value })}
                    placeholder="0"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>المبلغ المدفوع (د.م)</Label>
                  <Input
                    type="number"
                    value={form.paidAmount}
                    onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
                    placeholder="0"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label>التاريخ</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <Label>ملاحظات</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="ملاحظات..."
                  rows={2}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">حفظ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المحصل</p>
              <p className="text-lg font-bold">{totalRevenue.toLocaleString()} د.م</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المبالغ المعلقة</p>
              <p className="text-lg font-bold">{totalPending.toLocaleString()} د.م</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الأتعاب</p>
              <p className="text-lg font-bold">
                {payments.reduce((s, p) => s + p.totalAmount, 0).toLocaleString()} د.م
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث بالاسم أو المرجع..."
          className="pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Payment Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>تسجيل دفعة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>المبلغ (د.م) *</Label>
              <Input type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} placeholder="0" dir="ltr" />
            </div>
            <div>
              <Label>ملاحظة</Label>
              <Input value={payNote} onChange={(e) => setPayNote(e.target.value)} placeholder="وصف الدفعة" />
            </div>
            <Button onClick={handlePay} className="w-full">تسجيل الدفعة</Button>
          </div>
        </DialogContent>
      </Dialog>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Wallet className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {payments.length === 0 ? "لم يتم إضافة أي أتعاب بعد" : "لا توجد نتائج"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const remaining = p.totalAmount - p.paidAmount;
            const progress = p.totalAmount > 0 ? (p.paidAmount / p.totalAmount) * 100 : 0;
            return (
              <Card key={p.id} className="shadow-card hover:shadow-card-hover transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{p.clientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {p.caseRef && `ملف: ${p.caseRef} • `}{p.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {remaining > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPayment(p.id);
                            setPayDialogOpen(true);
                          }}
                        >
                          تسجيل دفعة
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deletePayment(p.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">المدفوع: {p.paidAmount.toLocaleString()} د.م</span>
                      <span className="font-medium">الإجمالي: {p.totalAmount.toLocaleString()} د.م</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs">
                      <Badge
                        variant="outline"
                        className={remaining === 0
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {remaining === 0 ? "مكتمل" : `متبقي: ${remaining.toLocaleString()} د.م`}
                      </Badge>
                      <span className="text-muted-foreground">{p.transactions.length} عمليات</span>
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
