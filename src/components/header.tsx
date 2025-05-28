"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  MoveRight,
  X,
  Github,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SignOutButton from "./sign-out-button";
import Logo from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";

export const Header = () => {
  const { data: session } = useSession();
  const user = session?.user || {
    name: "Guest",
    email: "guest@gmail.com",
  };

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-2 items-center">
        <Logo />
        <div className="flex justify-end w-full gap-4">
          {session && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="hover:cursor-pointer">
                    <AvatarImage src={user?.image ?? ""} alt="" />
                    <AvatarFallback>
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="border-r hidden md:inline"></div>
            </>
          )}

          <Button variant="outline" size="icon">
            <Link
              href="https://github.com/Bruvato/spotify-data-visualizer"
              target="_blank"
            >
              <Github className="w-4 h-4" />
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
