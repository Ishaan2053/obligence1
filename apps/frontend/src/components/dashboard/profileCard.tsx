import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth, signOut } from "@/auth";

import { LogOut, User } from "lucide-react";
import SettingsDialog from "./settings";

export default async function Header() {
  const session = await auth();
  const user = session?.user as {
    image?: string | null;
    name?: string | null;
    id?: string;
    email?: string | null;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-2xl cursor-pointer">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={user?.image ?? undefined}
                  alt={user?.name || ""}
                />
                {user?.name ? (
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                ) : (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-lg font-light">{user?.name}</p>
                <p className="text-xs text-muted-foreground font-extralight tracking-wider">
                  {user?.email}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-fit p-0 rounded-2xl" align="end">
            <DropdownMenuItem asChild>
              <SettingsDialog />
            </DropdownMenuItem>
            <DropdownMenuItem className="p-2 m-1" asChild>
              <form
                className="w-full"
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button className="w-full text-left hover:text-red-500 transition flex items-center">
                  {" "}
                  <LogOut className="mr-4" />
                  Logout
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
