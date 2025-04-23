import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <section className="container py-6">
      <div className="flex flex-col items-center text-center">
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

        <p className="mt-3 mb-4.5 text-xl text-gray-700">
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
      <div className="relative overflow-hidden py-6">
        <div className="marquee-track flex gap-4">
          <Image
            src="/home/banner/banner1.jpg"
            className="h-72 w-56 rounded-t-full object-cover"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner2.jpg"
            className="h-72 w-56 object-cover [clip-path:circle(50%)]"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner3.jpg"
            className="h-72 w-56 rounded-2xl object-cover"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner4.jpg"
            className="h-72 w-56 rounded-[50%_50%_0_0] object-cover"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner5.jpg"
            className="h-72 w-56 rounded-tl-[80%] rounded-br-[80%] object-cover"
            alt="banner"
            width={300}
            height={300}
          />

          <Image
            src="/home/banner/banner1.jpg"
            className="h-72 w-56 rounded-t-full object-cover"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner2.jpg"
            className="h-72 w-56 object-cover [clip-path:circle(50%)]"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner3.jpg"
            className="h-72 w-56 rounded-2xl object-cover"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner4.jpg"
            className="h-72 w-56 rounded-[50%_50%_0_0] object-cover"
            alt="banner"
            width={300}
            height={300}
          />
          <Image
            src="/home/banner/banner5.jpg"
            className="h-72 w-56 rounded-tl-[80%] rounded-br-[80%] object-cover"
            alt="banner"
            width={300}
            height={300}
          />
        </div>
      </div>
    </section>
  );
};

export default Header;
