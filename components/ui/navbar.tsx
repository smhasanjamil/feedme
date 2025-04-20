'use client';
import Link from "next/link";
import { buttonVariants } from "./button";
import { useAppSelector } from "@/redux/hooks";
import { currentUser } from "@/redux/features/auth/authSlice";

const Navbar = () => {
  const user = useAppSelector(currentUser);
  console.log(user);
  return (
    <nav className="container flex items-center justify-between bg-red-50 py-3">
      {/* Logo */}
      <Link href="/">
        <h2 className="text-3xl font-semibold">feedme.</h2>
      </Link>

      {/* Menu Links */}
      <ul className="flex items-center space-x-8 text-[17px] font-medium text-gray-800">
        <li>
          <Link href="/about" className="hover:text-feed-">
            About
          </Link>
        </li>
        <li>
          <Link href="#menu" className="hover:text-feed-">
            Menu
          </Link>
        </li>
        <li>
          <Link href="#pricing" className="hover:text-feed-">
            Pricing
          </Link>
        </li>
        <li>
          <Link href="#services" className="hover:text-feed-">
            Services
          </Link>
        </li>

        <li>
          <Link
            href="/"
            className={`${buttonVariants({ variant: "outline" })} hover:text-feed-jungle border-feed-black hover:border-feed-jungle hover:bg-feed-lime h-10 !rounded-full border-[1.5px] !text-lg`}
          >
            Get Started
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
