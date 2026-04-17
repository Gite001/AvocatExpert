import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ClientsPage from "@/pages/ClientsPage";
import CasesPage from "@/pages/CasesPage";
import AppointmentsPage from "@/pages/AppointmentsPage";
import PaymentsPage from "@/pages/PaymentsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import JudgmentsPage from "@/pages/JudgmentsPage";
import RemindersPage from "@/pages/RemindersPage";
import InvoicesPage from "@/pages/InvoicesPage";
import ArchivePage from "@/pages/ArchivePage";
import TeamPage from "@/pages/TeamPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/cases" element={<CasesPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/judgments" element={<JudgmentsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
