import Image from "next/image";
import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa"; // Using Font Awesome icons

const Footer = () => {
  return (
    <footer className="bg-feed-black text-feed-lime py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-4 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="flex flex-col items-start">
          <Image
            src="/bekary.jpg"
            alt="Bakery Logo"
            height={100}
            width={100}
            className="mb-4 max-w-20 rounded-t-full"
          />{" "}
          {/* Replace with your actual logo path */}
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
        <div>
          <h6 className="mb-4 font-bold uppercase">Our Store</h6>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Services
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="mb-4 font-bold uppercase">Further Links</h6>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Terms & Condition
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Learning
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="mb-4 font-bold uppercase">Get In Touch</h6>
          <p className="mb-2 flex items-center text-sm">
            <FaMapMarkerAlt className="mr-2" />
            7462 Oak Ridge Omaha, NE
          </p>
          <p className="mb-2 flex items-center text-sm">
            <FaPhoneAlt className="mr-2" />
            267-8745-456
          </p>
          <p className="flex items-center text-sm">
            <FaEnvelope className="mr-2" />
            information@yourdomain.com
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl px-4 text-center text-xs sm:px-6 lg:px-8">
        Copyright © 2025 feedme | Powered by feedme
      </div>
    </footer>
  );
};

export default Footer;
