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
import { BiBuildings, BiBookContent, BiTask } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import {getUserRoleFromToken} from "@/app/(auth)/signin/login";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  roles?: string[];
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/home",
    roles: ["ADMIN", "AGENT"],
  },
  {
    icon: <BiBuildings size="1.5em" />,
    name: "Projects",
    path: "/projects",
    roles: ["ADMIN", "AGENT"],
  },
  // {
  //   icon: <BiBuildings size="1.5em" />,
  //   name: "Projects",
  //   subItems: [
  //     { name: "A Doha-Massira", path: "/D", pro: false },
  //     { name: "A Doha-Massira 2", path: "/analytics", pro: false },
  //     { name: "A Doha-Casablanca 1", path: "/marketing", pro: false },
  //     { name: "A Doha-Casablanca 2", path: "/crm", pro: false },
  //     { name: "A Doha-Casablanca 3", path: "/stocks", new: false, pro: false },
  //     // { name: "+", path: "/saas", new: true, pro: true },
  //   ],
  // },
  {
    icon: <BiBookContent size="1.5em" />,
    name: "Properties",
    path: "/properties",
    roles: ["ADMIN", "AGENT"],
  },
  {
    icon: <UserCircleIcon />,
    name: "Clients",
    path: "/clients",
    roles: ["ADMIN", "AGENT"],
  },
  {
    name: "Task",
    icon: <BiTask size="1.5em"/>,
    path: "/tasks",
    roles: ["ADMIN", "AGENT"],
  },
  // {
  //   name: "Analytics",
  //   icon: <BiBarChartAlt2 size="1.5em" />,
  //   path: "/analytics",
  // },
  {
    name: "User Management",
    icon: <FaUsers size="1.5em" />,
    path: "/agents",
    roles: ["ADMIN"],
  },
];


const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    const fetchRole = async () => {
      // You may need to import AUTHENTICATION_COOKIE and provide a suitable prevState (e.g., null or {})
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
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge `}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;

  const isActive = useCallback((path: string) => {
    // Exact path match
    if (path === pathname) {
      return true;
    }
    
    // Special case for projects with ID: /projects/123 should mark the Projects menu as active
    if (path === '/projects' && pathname.startsWith('/projects/')) {
      // This handles routes like /projects/1, /projects/abc, etc.
      return true;
    }
    
    return false;
  }, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
  
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({
              type: "main", // Only "main" exists
              index,
            });
            submenuMatched = true;
          }
        });
      }
    });
  
    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: "main", index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-9 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link href="/home">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden mx-4"
                src="/images/immo/immo360v3-dark.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block mx-4"
                src="/images/immo/immo360v3.png"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <>
              <Image
                className="dark:hidden"
                src="/images/immo/immo360-icon-dark.png"
                alt="Logo"
                width={32}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src="/images/immo/immo360-icon.png"
                alt="Logo"
                width={32}
                height={32}
              />
            </>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto  duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
