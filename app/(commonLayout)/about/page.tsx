import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";

interface HealthyFoodCardProps {
  heading: string;
  description: string;
}

const HealthyFoodCard: React.FC<HealthyFoodCardProps> = ({
  heading,
  description,
}) => {
  return (
    <div className="space-y-1 rounded-2xl bg-gray-100 p-4 shadow-sm">
      <h3 className="text-feed-jungle text-xl font-semibold">{heading}</h3>
      <p className="opacity-70">{description}</p>
    </div>
  );
};

const healthyFoodCardData: HealthyFoodCardProps[] = [
  {
    heading: "Energy Boost",
    description:
      "Keeps you active and energized all day long with natural nutrients.",
  },
  {
    heading: "Immune Support",
    description:
      "Strengthens your body’s natural defense system and wards off infections.",
  },
  {
    heading: "Mental Clarity",
    description:
      "Improves focus, mood, and mental performance throughout your daily tasks.",
  },
  {
    heading: "Better Digestion",
    description:
      "Supports smooth and healthy digestive function for better nutrient absorption.",
  },
  {
    heading: "Weight Control",
    description:
      "Helps maintain a balanced, healthy weight with nutrient-dense meals.",
  },
  {
    heading: "Disease Prevention",
    description:
      "Reduces risk of major chronic diseases through consistent healthy eating.",
  },
];
export default function About() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="flex flex-col items-center bg-gray-100/60 px-4 py-10 md:py-16 text-center">
        <h1 className="mb-4 text-2xl md:text-3xl lg:text-5xl font-semibold">About Us</h1>
        <div className="bg-feed-lime h-1 md:h-2 w-20 rounded-full" />
      </section>

      {/* Home Sweet Bakery Section */}
      <section className="relative container mx-auto my-10 md:my-20 grid max-w-[1050px] flex-col gap-5 md:grid-cols-2 md:flex-row">
        <Image
          src="/about/chef.jpg"
          alt="Bakery Man"
          width={600}
          height={400}
          className="aspect-square w-full rounded-xl object-cover"
        />
        <div className="relative flex flex-col justify-between rounded-xl bg-gray-100/60 p-5 lg:p-13">
          {/* Large orange circle top-right */}
          <div className="bg-feed-lime absolute top-[-30px] right-[-30px] z-0 hidden h-24 w-24 rounded-full opacity-100 blur-lg lg:block" />

          {/* Small dot above "Opening Hours" */}
          <div className="bg-feed-jungle absolute top-[55%] left-[5%] z-10 h-3 w-3 rounded-full blur-xs"></div>

          {/* Small bottom right dot */}
          <div className="bg-feed-jungle absolute right-3 bottom-3 z-10 h-2 w-2 rounded-full blur-xs"></div>

          <h2 className="text-feed-jungle relative z-10 mb-4 text-2xl font-medium lg:text-5xl">
            We&apos;re here when you&apos;re hungry!
          </h2>
          <p className="relative z-10 leading-6 lg:text-lg">
            Feedme is here to satisfy your cravings! We&apos;re open Monday to
            Friday from 9 AM to 4 PM, and Saturday to Sunday from 10 AM to 7 PM.
            Come hungry, leave happy!
          </p>
          <h3 className="relative z-10 text-lg font-semibold lg:text-xl">
            Opening Hours :
          </h3>
          <div className="relative z-10 font-medium lg:text-lg">
            <p>
              Monday - Friday{" "}
              <span className="text-feed-jungle/70 ml-2 font-semibold">
                09.00 - 04.00
              </span>
            </p>
            <p>
              Saturday - Sunday{" "}
              <span className="text-feed-jungle/70 ml-2 font-semibold">
                10.00 - 07.00
              </span>
            </p>
          </div>
          <div className="text-feed-jungle relative z-10 mt-4 flex space-x-3 text-[20px]">
            <a
              href="#"
              className="bg bg-feed-black hover: hover:text-feed-lime rounded-full p-1.5 text-gray-50 duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="bg bg-feed-black hover: hover:text-feed-lime rounded-full p-1.5 text-gray-50 duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="bg bg-feed-black hover: hover:text-feed-lime rounded-full p-1.5 text-gray-50 duration-300"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </section>

      {/* Freshly Baked Section */}
      <section className="my-10 md:my-20 bg-gray-100/60 p-3 sm:p-5 md:p-0">
        <div className="relative container">
          {/* Half circle left side */}
          <div className="bg-feed-lime shadow-feed-lime absolute top-[-50px] left-[-50px] z-0 size-25 rounded-full opacity-100 shadow-2xl blur-lg" />

          <div className="relative z-10 mx-auto grid items-center gap-5 md:grid-cols-2 lg:gap-10">
            <div className="space-y-3 lg:space-y-7">
              <h2 className="text-feed-jungle mb-4 text-3xl font-medium lg:text-5xl">
                Freshly made meal <br className="hidden lg:block" />
                everyday
              </h2>
              <p className="opacity-80 lg:text-lg">
                At Feedme, we prioritize your health by offering freshly
                prepared, nutritious meals every day. Our menu is carefully
                crafted to provide balanced, wholesome options that fuel your
                body and mind. We believe in the power of healthy eating and
                make it our mission to serve meals made with fresh, high-quality
                ingredients. Every dish is designed to support your well-being,
                helping you feel your best, one bite at a time.
              </p>
              <Button className="bg-feed-lime hover:text-feed-lime border-feed-jungle text-feed-jungle hover:bg-feed-black h-11 rounded-full border-[1.5px] text-lg">
                Visit Us
              </Button>
            </div>

            <Image
              src="/about/fresh-food.png"
              alt="fresh food"
              width={600}
              height={400}
              className="rounded-xl hidden md:block"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container my-10 md:my-20 bg-white">
        <div className="mb-8 space-y-3 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium">Benefits Of Healthy Food</h2>
          <p className="md:text-lg text-gray-700">
            Discover how healthy food fuels your body, sharpens your mind, and
            supports overall
            <br />
            wellness—helping you live a vibrant, energetic, and balanced life
            every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col justify-center gap-3">
            {healthyFoodCardData.slice(0, 3).map((eachItem, index) => (
              <HealthyFoodCard
                key={index}
                heading={eachItem.heading}
                description={eachItem.description}
              />
            ))}
          </div>
          <Image
            src="/about/healthy-food.png"
            alt="Fresh Bread"
            width={500}
            height={500}
            className="w-full"
          />
          <div className="flex flex-col justify-center gap-3">
            {healthyFoodCardData.slice(3, 6).map((eachItem, index) => (
              <HealthyFoodCard
                key={index}
                heading={eachItem.heading}
                description={eachItem.description}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
