import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const About = () => {
  return (
    <section className="max-w-[1000px] px-3 mx-auto my-10 md:my-20 grid grid-cols-1 lg:grid-cols-5 gap-10 xl:gap-15">
      <div className="bg-feed-lime relative col-span-1 aspect-square rounded-[60px_100%_60px_60px] md:col-span-2 block order-2 md:order-1 sm:hidden lg:block">
        <Image
          className="absolute top-0 right-0 aspect-square h-11/12 w-11/12 rounded-full border-[15px] border-white"
          src="/home/about/about.jpg"
          alt="about us"
          width={250}
          height={250}
        />
      </div>
      <div className="col-span-1 order-1 md:order-2 flex flex-col items-start justify-center gap-4.5 lg:col-span-3 xl:gap-4">
        <h5 className="text-feed-jungle text-2xl font-medium xl:text-3xl">
          About Us
        </h5>
        <h6 className="text-3xl font-medium xl:text-4xl">
          Food is an Important Part of your Health
        </h6>
        <p className="md:text-lg text-gray-700">
          At Feedme, we believe that no two appetites are the same. That&apos;s
          why we specialize in handcrafted, fully customizable meals designed to
          match your tastes, lifestyle, and dietary needs. Whether you&apos;re
          fueling a workout, managing allergies, or just craving something
          different, we&apos;ve got you covered.
        </p>
        <Link href="/about">
          <Button className="bg-feed-lime text-feed-jungle border-feed-jungle hover:text-feed-lime hover:bg-feed-jungle h-11 rounded-full border-[1.5px] text-lg font-semibold">
            Learn More
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default About;
