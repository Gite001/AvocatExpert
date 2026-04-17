import {
  Users,
  Scale,
  Calendar,
  Wallet,
  Gavel,
  Bell,
  TrendingUp,
  Clock,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "إجمالي الزبناء", value: "0", icon: Users, change: "جديد", color: "text-primary" },
  { title: "القضايا الجارية", value: "0", icon: Scale, change: "نشطة", color: "text-accent" },
  { title: "جلسات اليوم", value: "0", icon: Calendar, change: "اليوم", color: "text-success" },
  { title: "المدفوعات المعلقة", value: "0 د.م", icon: Wallet, change: "معلقة", color: "text-warning" },
];

const quickActions = [
  { title: "إضافة زبون", icon: Users, href: "/clients", color: "bg-primary" },
  { title: "قضية جديدة", icon: Scale, href: "/cases", color: "bg-accent" },
  { title: "موعد جديد", icon: Calendar, href: "/appointments", color: "bg-success" },
  { title: "حكم جديد", icon: Gavel, href: "/judgments", color: "bg-warning" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">مرحباً بك 👋</h1>
        <p className="text-muted-foreground mt-1">إليك ملخص نشاطك اليوم</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-card hover:shadow-card-hover transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center gap-3 text-center">
                  <div className={`w-11 h-11 rounded-xl ${action.color} flex items-center justify-center`}>
                    <Plus className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-accent" />
              الجلسات القادمة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Calendar className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">لا توجد جلسات قادمة</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link to="/appointments">إضافة موعد</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reminders */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-destructive" />
              التذكيرات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">لا توجد تذكيرات</p>
              <Button variant="outline" size="sm" className="mt-3" asChild>
                <Link to="/reminders">إضافة تذكير</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
