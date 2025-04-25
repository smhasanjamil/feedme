import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import React from "react";

interface HealthyFoodCardProps {
  heading: string;
  description: string;
}

const HealthyFoodCard: React.FC<HealthyFoodCardProps> = ({
  heading,
  description,
}) => {
  return (
    <div className="bg-feed-lime/40 border-feed-jungle space-y-1 rounded-2xl border-2 p-4 shadow-sm">
      <h3 className="text-xl font-medium">{heading}</h3>
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
      <section className="bg-[#f7fbe9] px-4 pt-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-[#2b4717]">About Us</h1>
        <p className="mx-auto max-w-2xl text-lg">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
          tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
        </p>
      </section>

      {/* Home Sweet Bakery Section */}
      <section className="relative mx-auto grid max-w-[1050px] flex-col gap-5 my-20 md:flex-row lg:grid-cols-2">
        <Image
          src="/chef.jpg"
          alt="Bakery Man"
          width={600}
          height={400}
          className="aspect-square rounded-xl object-cover"
        />
        <div className="bg-feed-lime/30 relative flex flex-col justify-between rounded-xl p-13">
          {/* Large orange circle top-right */}
          <div className="absolute top-[-30px] right-[-30px] z-0 h-24 w-24 rounded-full bg-orange-300 opacity-100 blur-lg"></div>

          {/* Small dot above "Opening Hours" */}
          <div className="absolute top-[55%] left-[5%] z-10 h-3 w-3 rounded-full bg-orange-400 blur-xs"></div>

          {/* Small bottom right dot */}
          <div className="absolute right-3 bottom-3 z-10 h-2 w-2 rounded-full bg-orange-400 blur-xs"></div>

          <h2 className="text-feed-jungle relative z-10 mb-4 text-5xl font-semibold">
          We&apos;re here when you&apos;re hungry!
          </h2>
          <p className="relative z-10 text-lg leading-6">
          Feedme is here to satisfy your cravings! We're open Monday to Friday from 9 AM to 4 PM, and Saturday to Sunday from 10 AM to 7 PM. Come hungry, leave happy!
          </p>
          <h3 className="relative z-10 text-xl font-bold">Opening Hours :</h3>
          <div className="relative z-10 text-lg font-medium">
            <p>
              Monday - Friday{" "}
              <span className="ml-2 text-orange-400">09.00 - 04.00</span>
            </p>
            <p>
              Saturday - Sunday{" "}
              <span className="ml-2 text-orange-400">10.00 - 07.00</span>
            </p>
          </div>
          <div className="text-feed-jungle relative z-10 mt-4 flex space-x-4 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-feed-lime bg bg-feed-jungle rounded-full p-1"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-feed-lime bg bg-feed-jungle rounded-full p-1"
            >
              <FaTwitter />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-feed-lime bg bg-feed-jungle rounded-full p-1"
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </section>

      {/* Freshly Baked Section */}
      <section className="relative overflow-hidden bg-[#f7fbe9] px-6 py-16">
        {/* Half circle left side */}
        <div className="absolute top-[-50px] left-[-50px] z-0 h-40 w-40 rounded-r-full bg-orange-400 opacity-100 shadow-2xl shadow-amber-600 blur-lg"></div>

        {/* Small orange circle right */}
        <div className="absolute top-[38%] left-[60%] z-0 h-4 w-4 rounded-full bg-orange-400 blur-xs lg:top-[35%] lg:left-[45%]"></div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-[#2b4717]">
              Freshly Baked Bread Every Morning
            </h2>
            <p className="mb-4">
              Start your day with the aroma of oven-fresh bread. Our bakers rise
              early so you can enjoy a crisp crust and fluffy inside every
              morning.
            </p>
            <button className="mt-4 rounded-full bg-[#2b4717] px-6 py-3 text-white transition hover:bg-[#1f3512]">
              Visit Us
            </button>
          </div>
          <div>
            <Image
              src="/bread.jpeg"
              alt="Fresh Bread"
              width={600}
              height={400}
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container my-20 bg-white">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-4xl font-medium">Benefits Of Healthy Food</h2>
          <p className="text-lg text-gray-700">
            Discover how healthy food fuels your body, sharpens your mind, and
            supports overall
            <br />wellness—helping you live a vibrant, energetic, and balanced
            life every single day.
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
