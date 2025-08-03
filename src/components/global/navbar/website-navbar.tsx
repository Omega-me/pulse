"use client";
import usePaths from "@/hooks/use-navs";
import React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { PUBLIC_ROUTES } from "@/constants/public-routes";

const WebsiteNavbar = () => {
  const { isPrivateRoute, handleGoToRoute } = usePaths();

  return (
    !isPrivateRoute && (
      <div
        // className="p-2 w-full flex justify-center sticky top-0 bg-[#09090B]/50 backdrop-blur-sm"
        className="p-2 w-full flex justify-center sticky top-0 bg-[#09090B]/50 backdrop-blur-sm"
      >
        <NavigationMenu>
          <NavigationMenuList>
            {PUBLIC_ROUTES.map((r) => (
              <NavigationMenuItem key={r.id}>
                <div
                  className="cursor-pointer"
                  onClick={() => handleGoToRoute(r.href)}
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {r.icon} {r.title}
                  </NavigationMenuLink>
                </div>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    )
  );
};

export default WebsiteNavbar;
