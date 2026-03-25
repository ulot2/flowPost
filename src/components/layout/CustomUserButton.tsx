"use client";

import { LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers/AuthProvider";
import { toast } from "sonner";

export function CustomUserButton() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 outline-none hover:bg-white/6 p-1 -m-1 rounded-lg transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={""} alt={user.name || ""} />
            <AvatarFallback className="bg-[#d4f24a] text-[#0f0f0f] text-xs font-bold">
              {user.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate text-sm">
            <span className="font-medium text-white truncate w-full">
              {user.name || "User"}
            </span>
            <span className="text-[11px] text-white/40 truncate w-full flex text-left">
              {user.email}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center" forceMount>
        <DropdownMenuLabel className="font-normal relative">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            toast.info("Authentication is disabled in UI-only mode.")
          }
        >
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Manage account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
