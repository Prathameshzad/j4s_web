'use client';

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  Separator,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Input,
} from "@/component/ui/CustomUI"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useEffect } from "react"
import { Search, Bell, HelpCircle, LayoutGrid, Menu } from "lucide-react"
import { ChildSwitcher } from "@/component/dashboard/ChildSwitcher"
import NotificationDropdown from "@/component/dashboard/NotificationDropdown"

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Simple logic to get current page title for breadcrumb
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Overview';
    const parts = pathname.split('/');
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50 dark:bg-slate-950/50">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b bg-white/80 dark:bg-slate-950/80 px-4 backdrop-blur-xl transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 group shrink-0">
                <Menu className="h-4.5 w-4.5 md:h-5 md:w-5 text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors" />
              </Button>
            </SidebarTrigger>
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1 truncate">Student</h1>
              <h2 className="text-[11px] sm:text-[13px] font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none truncate">Dashboard</h2>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <div className="scale-90 sm:scale-100 origin-right">
              <ChildSwitcher />
            </div>
            
            <div className="flex items-center gap-1 sm:gap-1.5 ml-1 sm:ml-2 border-l border-slate-200 dark:border-slate-800 pl-1 sm:pl-3">
              <NotificationDropdown />
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 shrink-0 hidden xs:flex">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full bg-slate-50/50 dark:bg-slate-950/50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Breadcrumbs moved here, above the header of the feature pages */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList className="flex flex-row items-center flex-wrap gap-1">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" asChild>
                      <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary transition-colors">
                        <LayoutGrid size={14} className="shrink-0" />
                        <span className="leading-none">Home</span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {pathname !== '/dashboard' && (
                    <>
                      <BreadcrumbSeparator className="opacity-20" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-[10px] font-black uppercase tracking-widest text-primary">{getPageTitle()}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
