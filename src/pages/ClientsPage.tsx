import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  digitalAddress: string;
  notes: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<Client, "id">>({
    name: "",
    phone: "",
    email: "",
    address: "",
    digitalAddress: "",
    notes: "",
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    const newClient: Client = { ...form, id: crypto.randomUUID() };
    setClients((prev) => [newClient, ...prev]);
    setForm({ name: "", phone: "", email: "", address: "", digitalAddress: "", notes: "" });
    setDialogOpen(false);
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const filtered = clients.filter(
    (c) =>
      c.name.includes(searchQuery) ||
      c.phone.includes(searchQuery) ||
      c.email.includes(searchQuery)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-7 h-7 text-primary" />
            إدارة الزبناء
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {clients.length} زبون مسجل
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة زبون
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة زبون جديد</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>الاسم الكامل *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="أدخل اسم الزبون"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>الهاتف</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="06XXXXXXXX"
                  />
                </div>
                <div>
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <Label>العنوان</Label>
                <Input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="العنوان الكامل"
                />
              </div>
              <div>
                <Label>العنوان الإلكتروني</Label>
                <Input
                  value={form.digitalAddress}
                  onChange={(e) => setForm({ ...form, digitalAddress: e.target.value })}
                  placeholder="موقع أو حساب مهني"
                  dir="ltr"
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
                حفظ الزبون
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="بحث بالاسم أو الهاتف أو البريد..."
          className="pr-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Client List */}
      {filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-14 h-14 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg font-medium">
              {clients.length === 0 ? "لم يتم إضافة أي زبون بعد" : "لا توجد نتائج"}
            </p>
            <p className="text-muted-foreground/70 text-sm mt-1">
              {clients.length === 0 ? "ابدأ بإضافة أول زبون لك" : "جرب البحث بكلمات أخرى"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <Card
              key={client.id}
              className="shadow-card hover:shadow-card-hover transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {client.name.charAt(0)}
                    </div>
                    <h3 className="font-semibold">{client.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteClient(client.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span dir="ltr">{client.phone}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span dir="ltr">{client.email}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{client.address}</span>
                    </div>
                  )}
                </div>
                {client.notes && (
                  <p className="text-xs text-muted-foreground/70 mt-3 line-clamp-2 border-t pt-2">
                    {client.notes}
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
