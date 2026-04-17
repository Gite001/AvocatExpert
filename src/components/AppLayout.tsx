import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Users,
  Scale,
  Calendar,
  Wallet,
  FileText,
  Gavel,
  Bell,
  Receipt,
  Archive,
  UserCog,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const navItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/" },
  { title: "إدارة الزبناء", icon: Users, href: "/clients" },
  { title: "إدارة القضايا", icon: Scale, href: "/cases" },
  { title: "المواعيد والجلسات", icon: Calendar, href: "/appointments" },
  { title: "الأتعاب والمدفوعات", icon: Wallet, href: "/payments" },
  { title: "إدارة الوثائق", icon: FileText, href: "/documents" },
  { title: "إدارة الأحكام", icon: Gavel, href: "/judgments" },
  { title: "التذكيرات", icon: Bell, href: "/reminders" },
  { title: "الفواتير", icon: Receipt, href: "/invoices" },
  { title: "الأرشيف القانوني", icon: Archive, href: "/archive" },
  { title: "نظام الفريق", icon: UserCog, href: "/team" },
];

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const location = useLocation();

  // Sync avatar from localStorage
  useEffect(() => {
    const updateAvatar = () => {
      const savedProfile = localStorage.getItem("user-profile");
      if (savedProfile) {
        const { avatarUrl: savedUrl } = JSON.parse(savedProfile);
        setAvatarUrl(savedUrl || "");
      }
    };

    updateAvatar();
    window.addEventListener("storage", updateAvatar);
    return () => window.removeEventListener("storage", updateAvatar);
  }, []);

  return (
    <div className="min-h-screen flex w-full">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 border-l border-sidebar-border",
          collapsed ? "w-[68px]" : "w-64",
          mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg gradient-accent flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-accent-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-base text-sidebar-foreground">AvocatExpert</h1>
              <p className="text-[10px] text-sidebar-muted">نظام إدارة قانوني</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="p-3 border-t border-sidebar-border hidden md:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-2 rounded-lg hover:bg-sidebar-accent/50 transition-colors text-sidebar-foreground/70"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          collapsed ? "md:mr-[68px]" : "md:mr-64"
        )}
      >
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b bg-card sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث شامل..."
                className="h-10 w-64 rounded-lg border bg-muted/50 pr-10 pl-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl} alt="User" className="object-cover" />
                    <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-bold">
                      م
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1 text-right">
                    <p className="text-sm font-medium leading-none">الأستاذ محمد</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      mohamed@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to="/profile">
                    <DropdownMenuItem className="flex items-center gap-2 justify-end text-right cursor-pointer">
                      <span>الملف الشخصي</span>
                      <User className="mr-2 h-4 w-4" />
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/settings">
                    <DropdownMenuItem className="flex items-center gap-2 justify-end text-right cursor-pointer">
                      <span>الإعدادات</span>
                      <Settings className="mr-2 h-4 w-4" />
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 justify-end text-right text-destructive cursor-pointer"
                  onClick={() => toast.info("تم تسجيل الخروج بنجاح")}
                >
                    <span>تسجيل الخروج</span>
                    <LogOut className="mr-2 h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
