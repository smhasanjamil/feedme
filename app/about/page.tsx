// pages/about.js
import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import Head from "next/head";
import Image from "next/image";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | Feedme</title>
        <meta
          name="description"
          content="Learn more about our story, our passion for bread, and what makes us special."
        />
      </Head>

      <main className="text-feed-jungle">
        {/* Hero Section */}
        <section className="bg-[#f7fbe9] px-4 pt-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-[#2b4717]">About Us</h1>
          <p className="mx-auto max-w-2xl text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="mt-2 hidden md:block">
            <div className="flex justify-center">
              <Image src="/breads_1.png" width={700} height={200} alt="" />
              <Image src="/breads_1.png" width={700} height={200} alt="" />
            </div>
          </div>
        </section>

        {/* Home Sweet Bakery Section */}
        <section className="mx-auto grid max-w-[1050px] flex-col gap-5 py-12 md:flex-row lg:grid-cols-2">
          <Image
            src="/chef.jpg"
            alt="Bakery Man"
            width={600}
            height={400}
            className="aspect-square rounded-xl object-cover"
          />
          <div className="bg-feed-lime/30 flex flex-col justify-between rounded-xl p-13">
            <h2 className="text-feed-jungle mb-4 text-5xl font-semibold">
              Home Sweet Bakery
            </h2>
            <p className="text-lg leading-6">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Repudiandae obcaecati explicabo, quia id nam blanditiis eligendi
              consequatur sed fugiat dolorum in laudantium ducimus, odio rem,
              dignissimos itaque illum sint rerum!
            </p>
            <h3 className="text-xl font-bold">Opening Hours :</h3>
            <div className="text-lg font-medium">
              <p>
                Monday - Friday{" "}
                <span className="ml-2 text-orange-400">09.00 - 16.00</span>
              </p>
              <p>
                Saturday - Sunday{" "}
                <span className="ml-2 text-orange-400">10.00 - 19.00</span>
              </p>
            </div>
            <div className="text-feed-jungle mt-4 flex space-x-4 text-2xl">
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
        <section className="bg-[#f7fbe9] px-6 py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-[#2b4717]">
                Freshly Baked Bread Every Morning
              </h2>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                ultrices ligula nec lectus accumsan, id ultricies ex porttitor.
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
        <section className="bg-white px-6 py-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-[#2b4717]">
            Benefits Of Breads
          </h2>
          <p className="mx-auto mb-10 max-w-2xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis.
          </p>

          {/* <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              "There’s so much choice",
              "It tastes great",
              "Prebiotic properties",
              "Fuel for longer",
              "Folic acid boost",
              "It’s cost effective",
            ].map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl bg-[#fffbea] p-4 shadow-sm"
              >
                <h3 className="mb-2 text-lg font-semibold">{benefit}</h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>
            ))}
          </div> */}
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <div className="mb-4 rounded-xl bg-[#fffbea] p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  There’s so much choice
                </h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>

              <div className="mb-4 rounded-xl bg-[#fffbea] p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  There’s so much choice
                </h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>
              <div className="mb-4 rounded-xl bg-[#fffbea] p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  There’s so much choice
                </h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>
            </div>

            <div>
              <Image
                src="/single_bread.png"
                alt="Fresh Bread"
                width={600}
                height={400}
                className="rounded-xl"
              />
            </div>

            <div>
              <div className="mb-4 rounded-xl bg-[#fffbea] p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  There’s so much choice
                </h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>

              <div className="mb-4 rounded-xl bg-[#fffbea] p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  There’s so much choice
                </h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>
              <div className="mb-4 rounded-xl bg-[#fffbea] p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">
                  There’s so much choice
                </h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
