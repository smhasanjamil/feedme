import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const About = () => {
  return (
    <section className="container my-20 grid grid-cols-5 gap-20">
      <div className="bg-feed-lime relative col-span-2 aspect-square rounded-[60px_100%_60px_60px]">
        <Image
          className="absolute top-0 right-0 aspect-square h-11/12 w-11/12 rounded-full border-[15px] border-white"
          src="/home/about/about.jpg"
          alt="about us"
          width={250}
          height={250}
        />
      </div>
      <div className="col-span-3 flex flex-col items-start justify-center gap-5.5">
        <h5 className="text-feed-jungle text-3xl font-medium">About Us</h5>
        <h6 className="text-4xl font-medium">
          Food is an Important Part of your Health
        </h6>
        <p className="text-[19px] 2xl:text-[21px] text-gray-700">
          At Feedme, we believe that no two appetites are the same. That&apos;s
          why we specialize in handcrafted, fully customizable meals designed to
          match your tastes, lifestyle, and dietary needs. Whether you&apos;re
          fueling a workout, managing allergies, or just craving something
          different, we&apos;ve got you covered. Our team is passionate about
          making healthy eating simple, flavorful, and 100% yours. No preset
          menus, no one-size-fits-all. Just real food made your way—fresh, fast,
          and fuss-free. Welcome to the future of meal prep, where your plate
          reflects you.
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
