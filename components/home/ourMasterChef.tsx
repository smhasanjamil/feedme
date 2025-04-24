import { FaInstagram } from "react-icons/fa";
import { BsPinterest } from "react-icons/bs";
import { BiLogoTelegram } from "react-icons/bi";
import { RiTwitterXFill } from "react-icons/ri";
import Image from "next/image";

const OurMasterChef = () => {
  return (
    <div className="container mx-auto px-3 py-5 md:px-0 md:py-10">
      <h3 className="font-cursive semibold mb-5 inline-block rounded-2xl border-4 bg-white px-4 py-3 md:mb-10 md:text-base lg:text-lg">
        OUR MASTER CHEFS
      </h3>
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-2 rounded-3xl shadow-lg md:col-span-1">
          <Image
            className="w-full rounded-2xl"
            src="/home/ourTeam/team-person-1.jpg"
            alt=""
            height={300}
            width={250}
          />
          <div className="my-4 space-y-2 text-center text-[#626262]">
            <h3 className="font-semibold">Gordon Ramsay</h3>
            <div className="flex justify-center gap-3 text-xl">
              <FaInstagram className="hover:text-primary duration-300"></FaInstagram>
              <BsPinterest className="hover:text-primary duration-300"></BsPinterest>
              <BiLogoTelegram className="hover:text-primary duration-300"></BiLogoTelegram>
              <RiTwitterXFill className="hover:text-primary duration-300"></RiTwitterXFill>
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-3xl shadow-lg md:col-span-1">
          <Image
            className="w-full rounded-2xl"
            src="/home/ourTeam/team-person-1.jpg"
            alt=""
            height={300}
            width={250}
          />
          <div className="my-4 space-y-2 text-center text-[#626262]">
            <h3 className="font-semibold">Gigachad</h3>
            <div className="flex justify-center gap-3 text-xl">
              <FaInstagram className="hover:text-primary duration-300"></FaInstagram>
              <BsPinterest className="hover:text-primary duration-300"></BsPinterest>
              <BiLogoTelegram className="hover:text-primary duration-300"></BiLogoTelegram>
              <RiTwitterXFill className="hover:text-primary duration-300"></RiTwitterXFill>
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-3xl shadow-lg md:col-span-1">
          <Image
            className="w-full rounded-2xl"
            src="/home/ourTeam/team-person-1.jpg"
            alt=""
            height={300}
            width={250}
          />
          <div className="my-4 space-y-2 text-center text-[#626262]">
            <h3 className="font-semibold">Salt Bae</h3>
            <div className="flex justify-center gap-3 text-xl">
              <FaInstagram className="hover:text-primary duration-300"></FaInstagram>
              <BsPinterest className="hover:text-primary duration-300"></BsPinterest>
              <BiLogoTelegram className="hover:text-primary duration-300"></BiLogoTelegram>
              <RiTwitterXFill className="hover:text-primary duration-300"></RiTwitterXFill>
            </div>
          </div>
        </div>
        <div className="col-span-2 rounded-3xl shadow-lg md:col-span-1">
          <Image
            className="w-full rounded-2xl"
            src="/home/ourTeam/team-person-1.jpg"
            alt=""
            height={300}
            width={250}
          />
          <div className="my-4 space-y-2 text-center text-[#626262]">
            <h3 className="font-semibold">CZN Burak</h3>
            <div className="flex justify-center gap-3 text-xl">
              <FaInstagram className="hover:text-primary duration-300"></FaInstagram>
              <BsPinterest className="hover:text-primary duration-300"></BsPinterest>
              <BiLogoTelegram className="hover:text-primary duration-300"></BiLogoTelegram>
              <RiTwitterXFill className="hover:text-primary duration-300"></RiTwitterXFill>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMasterChef;
