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
  HelpCircleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import SettingsDialog from "./settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = (session?.user || {}) as {
    image?: string | null;
    name?: string | null;
    email?: string | null;
  };

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
                className="text-2xl tracking-widest text-balance font-semibold"
              >
                Obligence
              </motion.span>
            </AnimatePresence>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 overflow-hidden">
        <SidebarSeparator className=""/>
        <SidebarMenu className="">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Create New Document"
              isActive={pathname.includes("/dashboard/create")}
              asChild
              className="flex items-center"
            >
              <Link href="/dashboard/create">
                <PlusCircleIcon className="h-4 w-4" />
                <span>Create New Document</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>{" "}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Pre Assessment Clarifications"
              isActive={pathname.includes("/dashboard/clarifications")}
              asChild
              className="flex items-center"
            >
              <Link href="/dashboard/load">
                <HelpCircleIcon className="h-4 w-4" />
                <span>Pre Assessment Clarifications</span>
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
          {/* Account menu button with avatar and dropdown */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  variant="outline"
                  size="lg"
                  className="items-center"
                  tooltip={`Your Account`}
                >
                  <Avatar className="h-6 w-6 ml-1">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name || ""} />
                    <AvatarFallback>
                      {/* Use first letter of name or a fallback icon */}
                      {(user?.name?.charAt(0) || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col text-left">
                    <span className="truncate">{user?.name || "Account"}</span>
                    {user?.email && (
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    )}
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full p-0 rounded-2xl" align="end">
                <DropdownMenuLabel className="flex gap-2 items-center">
                  <div>
                  <Avatar className="h-6 w-6 ml-1">
                    <AvatarImage src={user?.image ?? undefined} alt={user?.name || ""} />
                    <AvatarFallback>
                      {/* Use first letter of name or a fallback icon */}
                      {(user?.name?.charAt(0) || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  </div>
                  <div className="flex min-w-0 flex-col text-left">
                    <span className="truncate">{user?.name || "Account"}</span>
                    {user?.email && (
                      <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem asChild>
                  <SettingsDialog />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="px-2"
                  asChild
                  onClick={() => {
                    signOut({ redirect: true, redirectTo: "/login" });
                  }}
                >
                  <button className="w-full pl-3 font-light text-left hover:text-red-500 transition flex items-center">
                    <LogOut className="mr-1" />
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
