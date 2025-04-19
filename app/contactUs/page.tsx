import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const page = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-feed-lime py-24 text-feed-jungle relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-75 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
        </div>
        {/* Image Overlay (adjust path as needed) */}
        <div className="absolute top-0 right-0 h-full w-1/2 bg-cover bg-center opacity-100" style={{ backgroundImage: 'url(/building.png)' }}></div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Map Section (Left) */}
          <div className="mt-8  overflow-hidden p-40 pt-[-10] rounded-4xl">
          <iframe className="rounded-2xl" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d187566.50169733484!2d34.3886928!3d31.410245850000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14fd844104b258a9%3A0xfddcb14b194be8e7!2sGaza%20Strip!5e1!3m2!1sen!2sbd!4v1745052832191!5m2!1sen!2sbd" width="300" height="450" style={{border:0}} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
            

          {/* Get in Touch and Form (Right) */}
          <div>
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-feed-jungle mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Facilisis leo vel
                fringilla est ullamcorper eget nulla facilisi etiam dignissim diam.
                Purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus.
              </p>
              <div className="space-y-4">
                <p className="flex items-center text-gray-700">
                  <FaMapMarkerAlt className="mr-3 text-feed-jungle" />
                  4140 Rd. Richardson California 62639
                </p>
                <p className="flex items-center text-gray-700">
                  <FaPhoneAlt className="mr-3 text-feed-jungle" />
                  +1 125 456 7890
                </p>
                <p className="flex items-center text-gray-700">
                  <FaEnvelope className="mr-3 text-feed-jungle" />
                  hello@modulus.io
                </p>
                <p className="text-feed-jungle font-semibold">@Modular Official</p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-feed-jungle mb-6">Send us a message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Your Name</label>
                  <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input type="email" id="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone</label>
                    <input type="tel" id="phone" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                  </div>
                </div>
                <div>
                  <label htmlFor="service" className="block text-gray-700 text-sm font-bold mb-2">Select Service</label>
                  <select id="service" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option>General Inquiry</option>
                    <option>Architecture</option>
                    <option>Renovation</option>
                    <option>Interior Design</option>
                    <option>Consultation</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                  <textarea id="message" rows={5} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
                <button type="submit" className="bg-feed-jungle hover:bg-feed-black text-feed-lime font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
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