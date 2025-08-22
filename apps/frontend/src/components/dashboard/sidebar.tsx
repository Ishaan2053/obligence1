"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  BarChart2,
  Settings,
  LogOut,
  ChevronsLeft,
  NotebookTextIcon,
  ArrowUpRight,
  PlusCircleIcon,
  NotepadText,
  DumbbellIcon,
  Cog,
  ShredderIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import SettingsDialog from "./settings";
import Header from "./profileCard";

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center justify-center py-3 gap-2 flex-row w-full"
        >
          <div className=" rounded-full shadow-xl p-1">
            <ShredderIcon className=" m-0 h-6 p-0 rounded-full w-full" />
          </div>
          {isSidebarOpen && (
            <AnimatePresence>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.2 }}
                className="text-2xl tracking-tighter text-balance font-semibold"
              >
                Obligence
              </motion.span>
            </AnimatePresence>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu className="border-t border-t-neutral-700/30 dark:border-t-white/20">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create New Document"
              isActive={pathname.includes("/dashboard/add")}
              asChild
              className="flex items-center"
            >
              <Link href="/dashboard/add">
                <PlusCircleIcon className="h-4 w-4" />
                <span>Create New Document</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>{" "}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create & Run Load Tests"
              isActive={pathname.includes("/dashboard/load")}
              asChild
              className="flex items-center"
            >
              <Link href="/dashboard/load">
                <DumbbellIcon className="h-4 w-4" />
                <span>Load Test APIs</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="border-t border-t-neutral-700/30 dark:border-t-white/20">
            <SidebarMenuButton
              tooltip="Expand Sidebar"
              onClick={() => {
                toggleSidebar();
                setIsSidebarOpen(!isSidebarOpen);
              }}
              // className="flex items-center justify-center w-full"
            >
              <ChevronsLeft
                className={`h-4 w-4 ${
                  isSidebarOpen ? "" : "transform rotate-180"
                } transition-transform duration-300`}
              />
              <span>Collapse Sidebar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <Header />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
