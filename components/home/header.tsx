import Link from "next/link";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <section className="container py-10">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-6xl leading-tight font-medium">
          Fresh and healthy
          <br />
          food for your{" "}
          <span className="relative inline-block">
            <span className="relative z-10">table</span>
            <span
              className="absolute -inset-2 top-0 z-0 -rotate-4 transform rounded-[28px] bg-lime-400/40"
              style={{
                filter: "blur(1px)",
                boxShadow: "0 0 6px rgba(163, 230, 53, 0.3)",
              }}
            />
          </span>
        </h2>

        <p className="mt-3 mb-4.5 text-lg text-gray-700">
          Order healthy and delicious dishes at any time,
          <br />
          and we&apos;ll make sure it is safely delivered to your home
        </p>

        <div className="flex items-center gap-4">
          <Button className="border-feed-jungle text-feed hover:bg-feed-jungle bg-feed-lime h-11 rounded-full border-2 px-6 text-lg font-medium transition-colors hover:text-lime-400">
            Order now
          </Button>
          <Link
            className="hover:text-feed-jungle border-feed-jungle text-lg font-medium text-gray-800 duration-200 hover:border-b-2 ease-in-out"
            href="/"
          >
            See the menu
          </Link>
        </div>
      </div>

      <div className="mt-12 flex justify-center gap-4">
        {/* This would be where your food images would go */}
      </div>
    </section>
  );
};

export default Header;
