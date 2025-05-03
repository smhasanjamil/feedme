import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const page = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center bg-gray-100/60 px-4 py-10 text-center md:py-16">
        <h1 className="mb-4 text-2xl font-semibold md:text-3xl lg:text-5xl">
          Contact Us
        </h1>
        <div className="bg-feed-lime h-1 w-20 rounded-full md:h-2" />
      </section>

      {/* Contact Information and Form Section */}
      <section className="container my-10 md:my-20">
        <div className="grid w-full grid-cols-1 gap-7 md:grid-cols-5 md:gap-12">
          {/* Map Section (Left) */}
          <div className="col-span-1 overflow-hidden rounded-2xl md:col-span-2">
            <iframe
              className="h-[200px] w-full rounded-2xl lg:h-[500px]"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187566.50169733484!2d34.3886928!3d31.410245850000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd844104b258a9%3A0xfddcb14b194be8e7!2sGaza%20Strip!5e1!3m2!1sen!2sbd!4v1745052832191!5m2!1sen!2sbd"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Get in Touch and Form (Right) */}
          <div className="col-span-1 md:col-span-3">
            <div className="mb-10">
              <h2 className="text-feed-jungle mb-6 text-2xl font-bold">
                Get in Touch
              </h2>
              <p className="mb-4 text-gray-600">
                Have questions or need assistance? Contact us at
                support@feedme.com. We’re here to help and ensure you have the
                best experience with our delicious, healthy meals. Reach out
                today!
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="text-feed-jungle mr-3" />
                  4140 Rd. Richardson California 62639
                </p>
                <p className="flex items-center text-gray-700">
                  <FaPhoneAlt className="text-feed-jungle mr-3" />
                  +1 125 456 7890
                </p>
                <p className="flex items-center text-gray-700">
                  <FaEnvelope className="text-feed-jungle mr-3" />
                  hello@feedme.io
                </p>
                <p className="text-feed-jungle font-semibold">
                  @feedme Official
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-feed-jungle mb-6 text-2xl font-bold">
                Send us a message
              </h2>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    className="w-full appearance-none border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      Email
                    </label>
                    <Input
                      type="email"
                      id="email"
                      className="focus:shadow-outline leading-tightt-gray-700 w-full appearance-none border px-3 py-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      Phone
                    </label>
                    <Input
                      type="tel"
                      id="phone"
                      className="focus:shadow-outline leading-tightt-gray-700 w-full appearance-none border px-3 py-2 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Select Service
                  </label>
                  <select
                    id="service"
                    className="focus:shadow-outline w-full appearance-none rounded-lg border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
                  >
                    <option>General Inquiry</option>
                    <option>Architecture</option>
                    <option>Renovation</option>
                    <option>Interior Design</option>
                    <option>Consultation</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-bold text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="focus:shadow-outline w-full appearance-none rounded-lg border px-3 py-2 leading-tight text-gray-700 focus:outline-none"
                  ></textarea>
                </div>
                <Button
                  type="submit"
                  className="bg-feed-lime hover:text-feed-lime border-feed-jungle text-feed-jungle hover:bg-feed-black h-11 rounded-full border-[1.5px] text-lg"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
