import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/profileCard";

export const metadata = {
  title: "Dashboard - Obligence | AI-powered legal document extraction and review",
  description: "Dashboard layout",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pb-4">
      <SidebarProvider>
        <AppSidebar />

        <main className="md:flex-1 space-y-2 overflow-hidden relative z-0">
          <div className="flex items-center justify-between border-b">
            <SidebarTrigger className="flex md:hidden h-full" />
          </div>
          <div className="mx-4">{children}</div>
        </main>
      </SidebarProvider>
    </main>
  );
}
