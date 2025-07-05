"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons/index";
import { BiBuildings, BiBookContent, BiTask, BiFile, BiCreditCard } from "@/components/ui/icons/OptimizedIcons";
import { FaUsers } from "@/components/ui/icons/OptimizedIcons";
import { getUserRoleFromToken } from "@/app/(auth)/signin/login";
import { TbContract } from "@/components/ui/icons/OptimizedIcons";
import { useOptimizedData } from "@/hooks/useOptimizedData";

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: string[];
  subItems?: NavItem[];
};

// Client-specific navigation items
const clientNavItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Tableau de bord",
    path: "/dashboard",
    roles: ["CLIENT"],
  },
  {
    icon: <BiBuildings size="1.5em" />,
    name: "Mes Propriétés",
    path: "/my-properties",
    roles: ["CLIENT"],
  },
  {
    name: "Mes Contrats",
    icon: <TbContract size="1.5em" />,
    path: "/my-contracts",
    roles: ["CLIENT"],
  },
  {
    name: "Mes Paiements",
    icon: <BiCreditCard size="1.5em" />,
    path: "/my-payments",
    roles: ["CLIENT"],
  },
];

const ClientSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "support" | "others";
    index: number;
  } | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const result = await getUserRoleFromToken();
      console.log("Role fetched from token:", result);
      if (result) {
        setRole(result);
      } else {
        console.error("Failed to decode token or role not found");
      }
    };
    fetchRole();
  }, []);

  const handleSubmenuToggle = useCallback(
    (index: number, type: "main" | "support" | "others" = "main") => {
      setOpenSubmenu((prev) =>
        prev?.index === index && prev?.type === type
          ? null
          : { index, type }
      );
    },
    []
  );

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "support" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems
        .filter((nav) => !nav.roles || (role && nav.roles.includes(role)))
        .map((nav, index) => (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={` ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto transition-transform duration-200 ${
                        openSubmenu?.type === menuType && openSubmenu?.index === index
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  pathname === nav.path
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`${
                    pathname === nav.path
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )}

            {/* Submenu */}
            {nav.subItems &&
              openSubmenu?.type === menuType &&
              openSubmenu?.index === index &&
              (isExpanded || isHovered || isMobileOpen) && (
                <ul className="mt-2 ml-6 space-y-2">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`submenu-item ${
                          pathname === subItem.path
                            ? "submenu-item-active"
                            : "submenu-item-inactive"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
    </ul>
  );

  return (
    <>
      <aside
        className={`sidebar ${isExpanded ? "sidebar-expanded" : "sidebar-collapsed"} ${
          isMobileOpen ? "sidebar-mobile-open" : "sidebar-mobile-closed"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sidebar-content">
          {/* Logo */}
          <div className="sidebar-logo">
            <Link href="/dashboard" className="flex items-center">
              {isExpanded || isHovered || isMobileOpen ? (
                <>
                  <Image
                    width={154}
                    height={32}
                    className="dark:hidden"
                    src="/images/immo/immo360v3-dark.png"
                    alt="Logo"
                  />
                  <Image
                    width={154}
                    height={32}
                    className="hidden dark:block"
                    src="/images/immo/immo360v3.png"
                    alt="Logo"
                  />
                </>
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <div className="sidebar-section">
              {(isExpanded || isHovered || isMobileOpen) && (
                <h3 className="sidebar-section-title">Menu Principal</h3>
              )}
              {renderMenuItems(clientNavItems, "main")}
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default ClientSidebar;
