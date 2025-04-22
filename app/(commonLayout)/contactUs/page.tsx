import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section className="text-feed-jungle relative overflow-hidden bg-[#f7fbe9] py-24">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="mx-auto max-w-xl text-lg opacity-75">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>
        {/* Image Overlay (adjust path as needed) */}
        <div
          className="absolute top-0 right-0 h-full w-1/2 bg-cover bg-center opacity-100"
          style={{ backgroundImage: "url(/building.png)" }}
        ></div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="mx-auto max-w-7xl py-16">
        <div className="container mx-auto grid grid-cols-1 gap-12 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {/* Map Section (Left) */}
          <div className="mt-8 overflow-hidden rounded-4xl p-20 md:p-10">
            <iframe
              className="rounded-2xl"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187566.50169733484!2d34.3886928!3d31.410245850000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd844104b258a9%3A0xfddcb14b194be8e7!2sGaza%20Strip!5e1!3m2!1sen!2sbd!4v1745052832191!5m2!1sen!2sbd"
              width="500"
              height="600"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* Get in Touch and Form (Right) */}
          <div>
            <div className="mb-10">
              <h2 className="text-feed-jungle mb-6 text-2xl font-bold">
                Get in Touch
              </h2>
              <p className="mb-4 text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Facilisis leo vel fringilla est ullamcorper eget nulla facilisi
                etiam dignissim diam. Purus faucibus ornare suspendisse sed nisi
                lacus sed viverra tellus.
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
                  <input
                    type="text"
                    id="name"
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
                    <input
                      type="email"
                      id="email"
                      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-bold text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
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
                    className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="mt-4 rounded-full bg-[#2b4717] px-6 py-3 text-white transition hover:bg-[#1f3512]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
