'use client';
import Link from "next/link";
import { buttonVariants } from "./button";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { currentUser, logout } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

const Navbar = () => {
  const user = useAppSelector(currentUser);
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-[#FF0000]">
              FeedMe
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/about" className="text-gray-700 hover:text-[#FF0000] px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/find-meals" className="text-gray-700 hover:text-[#FF0000] px-3 py-2 rounded-md text-sm font-medium">
              Menu
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-[#FF0000] px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-[#FF0000] px-3 py-2 rounded-md text-sm font-medium">
              Services
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative px-3 py-2">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-[#FF0000]" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF0000] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-[#FF0000] px-3 py-2 rounded-md text-sm font-medium">
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
          <div className="md:hidden flex items-center">
            {/* Mobile Cart Icon */}
            <Link href="/cart" className="relative mr-4">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#FF0000]"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/find-meals"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              href="#pricing"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#FF0000] hover:bg-gray-50"
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
