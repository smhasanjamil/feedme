"use client";
import Link from "next/link";
import { buttonVariants } from "./button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { currentUser, logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const user = useAppSelector(currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.refresh();
    setIsMenuOpen(false);
  };

  const primaryButtonClasses = `${buttonVariants({ variant: "default" })} bg-[#FF0000] hover:bg-[#CC0000] text-white h-10 rounded-full px-6 text-sm font-semibold transition-colors`;
  const secondaryButtonClasses = `${buttonVariants({ variant: "outline" })} border-2 border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000] hover:text-white h-10 rounded-full px-6 text-sm font-semibold transition-colors`;

  // Only render auth-dependent content after mounting to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[#FF0000]">
              feedme.
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#FF0000]"
            >
              About
            </Link>
            <Link
              href="#menu"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#FF0000]"
            >
              Menu
            </Link>
            <Link
              href="#pricing"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#FF0000]"
            >
              Pricing
            </Link>
            <Link
              href="#services"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#FF0000]"
            >
              Services
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#FF0000]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={secondaryButtonClasses}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={secondaryButtonClasses}>
                  Sign In
                </Link>
                <Link href="/register" className={primaryButtonClasses}>
                  Sign Up
                </Link>
              </>
            )}
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
