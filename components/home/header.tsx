import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <section className="py-10">
      {/* Text */}
      <div className="container flex flex-col items-center text-center">
        <h2 className="text-7xl leading-[80px] font-medium">
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

        <p className="my-5 text-xl text-gray-700">
          Order healthy and delicious dishes at any time,
          <br />
          and we&apos;ll make sure it is safely delivered to your home
        </p>

        <div className="flex items-center gap-4">
          <Button className="border-feed-jungle text-feed hover:bg-feed-jungle bg-feed-lime h-11 rounded-full border-2 text-[17px] font-medium transition-colors hover:text-lime-400">
            Order now
          </Button>
          <Link
            className="hover:text-feed-jungle border-feed-jungle text-[17px] font-medium text-gray-800 duration-100 ease-in-out hover:border-b-2"
            href="/"
          >
            See the menu
          </Link>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative container mt-12 flex items-center overflow-hidden">
        <div className="absolute left-0 z-10 h-full w-20 bg-linear-to-r from-white to-transparent" />
        <div className="marquee flex w-max items-center gap-7 overflow-visible">
          {[1, 2, 3, 4, 5, 1, 2, 3, 4, 5].map((i, idx) => (
            <Image
              key={idx}
              src={`/home/banner/banner${i % 5 || 5}.png`}
              alt={`banner${i}`}
              className="w-[250px] object-cover"
              width={200}
              height={200}
            />
          ))}
        </div>
        <div className="absolute right-0 z-10 h-full w-20 bg-linear-to-r from-transparent to-white" />
      </div>
    </section>
  );
};

export default Header;
