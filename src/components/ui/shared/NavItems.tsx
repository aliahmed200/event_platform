"use client";
import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavItems = () => {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col md:flex-row w-full justify-between md:items-center ">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li
            className={`${isActive && "text-blue-900"} p-2 md:p-0 `}
            key={link.label}  
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
