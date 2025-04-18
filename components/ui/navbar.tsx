import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="container flex items-center justify-between bg-red-50 py-3">
      {/* Logo */}
      <Link href="/">
        <h2 className="text-3xl font-semibold">feedme.</h2>
      </Link>
    </nav>
  );
};

export default Navbar;
