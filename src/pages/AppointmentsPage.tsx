import { useState } from "react";
import {
  Calendar,
  Plus,
  Search,
  Clock,
  User,
  Scale,
  Trash2,
  MapPin,
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

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  linkedTo: string;
  location: string;
  notes: string;
}

const appointmentTypes = [
  "جلسة محكمة",
  "اجتماع مع زبون",
  "استشارة قانونية",
  "توقيع عقد",
  "تسليم وثائق",
  "أخرى",
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    type: "",
    linkedTo: "",
    location: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.date || !form.type) return;
    const newAppt: Appointment = { ...form, id: crypto.randomUUID() };
    setAppointments((prev) => [newAppt, ...prev]);
    setForm({ date: "", time: "", type: "", linkedTo: "", location: "", notes: "" });
    setDialogOpen(false);
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const filtered = appointments.filter(
    (a) =>
      a.type.includes(searchQuery) ||
      a.linkedTo.includes(searchQuery) ||
      a.location.includes(searchQuery)
  );

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-7 h-7 text-success" />
            المواعيد والجلسات
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {appointments.length} موعد مسجل
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              موعد جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة موعد جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>التاريخ *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>الوقت</Label>
                  <Input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>نوع الموعد *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>مرتبط بـ (زبون / قضية)</Label>
                <Input
                  value={form.linkedTo}
                  onChange={(e) => setForm({ ...form, linkedTo: e.target.value })}
                  placeholder="اسم الزبون أو رقم القضية"
                />
              </div>
              <div>
                <Label>المكان</Label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="المحكمة أو المكتب"
                />
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
                حفظ الموعد
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث في المواعيد..."
          className="pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {appointments.length === 0 ? "لم يتم إضافة أي موعد بعد" : "لا توجد نتائج"}
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              {appointments.length === 0 ? "ابدأ بإضافة أول موعد" : "جرب البحث بكلمات أخرى"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((appt) => (
            <Card key={appt.id} className="shadow-card hover:shadow-card-hover transition-all">
              <CardContent className="p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{appt.type}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {appt.date} {appt.time && `- ${appt.time}`}
                        </span>
                        {appt.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {appt.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {appt.linkedTo && (
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                        {appt.linkedTo}
                      </Badge>
                    )}
                    {appt.date === today && (
                      <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                        اليوم
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteAppointment(appt.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {appt.notes && (
                  <p className="text-sm text-muted-foreground mt-3 pr-14 line-clamp-1">
                    {appt.notes}
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
