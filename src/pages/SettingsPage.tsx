import { useState } from "react";
import { Settings, Bell, Lock, Globe, Moon, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: "ar",
  });

  const handleSave = () => {
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-7 h-7 text-accent" />
          إعدادات النظام
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          تخصيص تفضيلات التطبيق والأمان
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">التنبيهات</CardTitle>
            </div>
            <CardDescription>إدارة كيفية استقبال الإشعارات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>تنبيهات النظام</Label>
                <p className="text-xs text-muted-foreground">استقبال تنبيهات داخل التطبيق</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(v) => setSettings({ ...settings, notifications: v })}
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="space-y-0.5">
                <Label>تنبيهات البريد</Label>
                <p className="text-xs text-muted-foreground">إرسال ملخص يومي عبر البريد</p>
              </div>
              <Switch
                checked={settings.emailAlerts}
                onCheckedChange={(v) => setSettings({ ...settings, emailAlerts: v })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-accent" />
              <CardTitle className="text-lg">المظهر واللغة</CardTitle>
            </div>
            <CardDescription>تغيير مظهر التطبيق واللغة المفضلة</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>الوضع الليلي</Label>
                <p className="text-xs text-muted-foreground">تفعيل المظهر الداكن</p>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(v) => setSettings({ ...settings, darkMode: v })}
              />
            </div>
            <div className="space-y-2 pt-4 border-t">
              <Label>لغة النظام</Label>
              <Select
                value={settings.language}
                onValueChange={(v) => setSettings({ ...settings, language: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر اللغة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية (Arabic)</SelectItem>
                  <SelectItem value="fr">Français (French)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="shadow-card overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-warning" />
              <CardTitle className="text-lg">الأمان</CardTitle>
            </div>
            <CardDescription>تغيير كلمة المرور وإعدادات الدخول</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">تغيير كلمة المرور</Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-start">
        <Button onClick={handleSave} className="gap-2 px-8">
          <Save className="w-4 h-4" />
          حفظ جميع الإعدادات
        </Button>
      </div>
    </div>
  );
}
