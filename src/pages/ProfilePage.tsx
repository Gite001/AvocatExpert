import { useState, useRef, useEffect } from "react";
import { User, Mail, Phone, MapPin, Camera, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState({
    name: "الأستاذ محمد",
    email: "mohamed@example.com",
    phone: "0612345678",
    address: "Casablanca, Morocco",
    bio: "محامي بهيئة الدار البيضاء، متخصص في القانون التجاري والمدني.",
    avatarUrl: "",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("user-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("user-profile", JSON.stringify(profile));
    // Trigger storage event for other components (like Header)
    window.dispatchEvent(new Event("storage"));
    toast.success("تم حفظ التغييرات بنجاح");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        setProfile((prev) => {
          const updated = { ...prev, avatarUrl: newAvatarUrl };
          // Auto-save image to localStorage to keep it sync
          localStorage.setItem("user-profile", JSON.stringify(updated));
          window.dispatchEvent(new Event("storage"));
          return updated;
        });
        toast.info("تم تحميل الصورة بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setProfile(prev => {
      const updated = { ...prev, avatarUrl: "" };
      localStorage.setItem("user-profile", JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      return updated;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-7 h-7 text-primary" />
          الملف الشخصي
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          إدارة معلوماتك الشخصية وصورة الحساب
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Bio */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-muted">
                    <AvatarImage src={profile.avatarUrl} className="object-cover" />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-4xl font-bold">
                      م
                    </AvatarFallback>
                  </Avatar>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  <div className="absolute bottom-0 right-0 flex gap-1">
                    {profile.avatarUrl && (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full w-8 h-8 border-2 border-background"
                        onClick={removeAvatar}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      className="rounded-full w-9 h-9 border-4 border-background"
                      onClick={triggerFileInput}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <h2 className="text-xl font-bold mt-4">{profile.name}</h2>
                <p className="text-muted-foreground text-sm font-mono" dir="ltr">{profile.email}</p>
                <div className="w-full mt-6 pt-6 border-t">
                  <Label className="text-sm font-semibold mb-2 block text-right">السيرة المهنية</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed text-right">
                    {profile.bio}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">تعديل المعلومات</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الاسم الكامل</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>البريد الإلكتروني</Label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الهاتف</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pr-10"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pr-10"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>السيرة المهنية</Label>
                <Textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>
              <Button onClick={handleSave} className="w-full sm:w-auto gap-2">
                <Save className="w-4 h-4" />
                حفظ التغييرات
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
