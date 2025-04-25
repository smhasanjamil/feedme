import { FaInstagram } from "react-icons/fa";
import { BsPinterest } from "react-icons/bs";
import { BiLogoTelegram } from "react-icons/bi";
import { RiTwitterXFill } from "react-icons/ri";
import Image from "next/image";

interface OurTeamCardProps {
  num: number;
  name: string;
  description: string;
}

const OurTeamCard: React.FC<OurTeamCardProps> = ({
  num,
  name,
  description,
}) => {
  const socialIconStyle =
    "text-feed-lime hover:bg-feed-black bg-feed-jungle p-1.5 text-[35px] cursor-pointer rounded-full duration-300";

  return (
    <div className="col-span-2 rounded-full bg-gray-100 p-5 md:col-span-1">
      <Image
        className="w-full rounded-full"
        src={`/home/ourTeam/team-person-${num}.jpg`}
        alt=""
        height={300}
        width={250}
      />
      <div className="pt-2 pb-5 text-center">
        <h3 className="text-2xl font-medium">{name}</h3>
        <p className="mx-auto mt-1 mb-2.5 w-10/12 text-center text-[17px]">
          {description}
        </p>
        <div className="flex justify-center gap-2 text-xl">
          <FaInstagram className={socialIconStyle} />
          <BsPinterest className={socialIconStyle} />
          <BiLogoTelegram className={socialIconStyle} />
          <RiTwitterXFill className={socialIconStyle} />
        </div>
      </div>
    </div>
  );
};

const ourTeamCardData: OurTeamCardProps[] = [
  {
    num: 1,
    name: "MD Jabed Hasan",
    description: "Founder & CEO, leads overall vision",
  },
  {
    num: 2,
    name: "Nasifa Kabir",
    description: "Designs product experience and features",
  },
  {
    num: 3,
    name: "Md Saiful Islam Rafel",
    description: "Builds and maintains core platform",
  },
  {
    num: 4,
    name: "Mosayeba Mehenaz",
    description: "Drives marketing, branding, and content",
  },
];

const OurTeam = () => {
  return (
    <div className="container my-10">
      <div className="mb-10 flex flex-col items-center gap-4">
        <h3 className="text-4xl font-medium">Meet Our Team</h3>
        <div className="bg-feed-jungle h-1.5 w-30 rounded-full" />
      </div>
      <div className="grid grid-cols-4 gap-6">
        {ourTeamCardData.map((masterChef) => (
          <OurTeamCard
            key={masterChef.num}
            num={masterChef.num}
            name={masterChef.name}
            description={masterChef.description}
          />
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
