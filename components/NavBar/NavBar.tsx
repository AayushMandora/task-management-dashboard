"use client";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center border-b border-gray-500">
      <div className="p-3 text-xl font-black">TMD</div>
      <NavigationMenu className="p-3">
        <NavigationMenuList className="gap-3">
          <NavigationMenuItem className="border rounded-xl p-3 hover:bg-white/15 hover:cursor-pointer">
            <Link href="tasks" legacyBehavior passHref>
              <NavigationMenuLink>Tasks</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="border rounded-xl p-3 hover:bg-white/15 hover:cursor-pointer">
            <Link href="kanban" legacyBehavior passHref>
              <NavigationMenuLink>Kanban Board</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem
            className="border rounded-xl p-3 hover:bg-white/15 hover:cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
            }}
          >
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink>Logout</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavBar;
