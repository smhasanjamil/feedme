"use client";

import Link from "next/link";
import { buttonVariants } from "./button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { currentUser, logout } from "@/redux/features/auth/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { FaArrowRightLong } from "react-icons/fa6";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import {
  MdOutlineAccountCircle,
  MdOutlineAppRegistration,
} from "react-icons/md";
import { TbLayoutDashboard } from "react-icons/tb";

const Navbar = () => {
  const user = useAppSelector(currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.refresh();
    setIsMenuOpen(false);
  };

  // Only render auth-dependent content after mounting to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const navItems = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Menu",
      link: "/menu",
    },
    {
      name: "Pricing",
      link: "/pricing",
    },
    {
      name: "Services",
      link: "/services",
    },
  ];

  return (
    <nav className="bg-white">
      <div className="container">
        <div className="flex items-center justify-between py-3.5">
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold">
              feedme.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navItems.map((navItem, index) => {
              const isActive = pathname === navItem.link;
              return (
                <div key={index} className="group flex flex-col items-center">
                  <div className="size-1.5" />
                  <Link
                    href={navItem.link}
                    className={`text-[17px] font-medium duration-300 ease-in-out ${
                      isActive && "text-feed-jungle/60"
                    } group-hover:text-feed-jungle/50`}
                  >
                    {navItem.name}
                  </Link>
                  <div
                    className={`size-1.5 rounded-full duration-300 ease-in-out ${
                      isActive
                        ? "bg-feed-jungle/40"
                        : "group-hover:bg-feed-jungle/40"
                    }`}
                  />
                </div>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger className="text-feed-black border-feed-black hover:bg-feed-lime flex h-10 cursor-pointer items-center gap-1 rounded-full border-[1.9px] bg-transparent px-2 text-lg font-medium caret-neutral-50 outline-0 duration-300">
                {user ? (
                  <>
                    <MdOutlineAccountCircle className="size-5" />
                    <span>Account</span>
                  </>
                ) : (
                  <>
                    <span>Get Started</span>{" "}
                    <FaArrowRightLong className="ml-1" />
                  </>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="border-feed-black w-fit space-y-1 rounded-2xl border">
                <DropdownMenuItem className="bg-feed-lime/50 hover:!bg-feed-jungle group w-ful h-9 rounded-[11px] text-lg font-medium duration-300">
                  {user ? (
                    <>
                      <TbLayoutDashboard className="text-feed-jungle group-hover:text-feed-lime size-5.5" />
                      <Link
                        href="/dashboard"
                        className="text-feed-jungle group-hover:text-feed-lime"
                      >
                        Dashboard
                      </Link>
                    </>
                  ) : (
                    <>
                      <CgLogIn className="text-feed-jungle group-hover:text-feed-lime size-5.5" />
                      <Link
                        href="/login"
                        className="text-feed-jungle group-hover:text-feed-lime"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem className="bg-feed-jungle hover:!bg-feed-black w-ful h-9 rounded-[11px] text-lg font-medium duration-300">
                  {user ? (
                    <>
                      <CgLogOut className="text-feed-lime size-5.5" />
                      <span onClick={handleLogout} className="text-feed-lime">
                        Sign Out
                      </span>
                    </>
                  ) : (
                    <>
                      <MdOutlineAppRegistration className="text-feed-lime size-5.5" />
                      <Link href="/register" className="text-feed-lime">
                        Sign Up
                      </Link>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-[#FF0000] focus:outline-none focus:ring-inset"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            <Link
              href="/about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#menu"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="#pricing"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#services"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-[#FF0000]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
