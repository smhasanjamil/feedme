import Image from "next/image";

const ServingCustomer = () => {
  return (
    <div className="container py-5 md:px-0 md:py-10">
      <div className="grid grid-cols-5 gap-5 md:gap-10 rounded-4xl border-[3px] p-3 md:p-10 lg:p-20">
        <div className="col-span-5 flex flex-col items-center gap-10 md:col-span-2">
          <h3 className="text-feed-black border-feed-jungle inline-block border-b-4 px-4 py-3 font-medium md:text-base text-lg lg:text-2xl">
            Serving Customer
          </h3>
          <div>
            <Image
              className="w-full rounded-2xl"
              src="/home/servingCustomer/serving-customer-1.jpg"
              alt="serving-customer-bg"
              height={400}
              width={400}
            />
          </div>
        </div>
        <div className="col-span-5 flex flex-col items-center gap-5 md:col-span-3 lg:gap-10">
          <div className="order-2 md:order-1">
            <Image
              className="w-full rounded-2xl"
              src="/home/servingCustomer/serving-customer-2.jpg"
              alt="serving-customer-bg"
              height={400}
              width={700}
            />
          </div>
          <div className="order-1 space-y-2 md:order-2 lg:space-y-5">
            <h3 className="text-2xl font-medium">Over The Years</h3>
            <div className="flex gap-10 lg:gap-20">
              <div>
                <h3 className="text-feed-jungle text-3xl font-semibold lg:text-5xl">
                  30+
                </h3>
                <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
                  BREAKFAST
                  <br />
                  OPTIONS
                </p>
              </div>
              <div>
                <h3 className="text-feed-jungle text-3xl font-semibold lg:text-5xl">
                  50+
                </h3>
                <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
                  DINNER
                  <br />
                  OPTIONS
                </p>
              </div>
              <div>
                <h3 className="text-feed-jungle text-3xl font-semibold lg:text-5xl">
                  8+
                </h3>
                <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
                  NEW
                  <br />
                  LOCATION
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-lg">
              Our menu features a variety of dishes all made with seasonal
              ingredients
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center p-3 md:p-10">
        <div className="grid grid-cols-4 gap-5 text-center md:gap-10">
          <div>
            <h3 className="text-feed-jungle text-xl font-semibold md:text-6xl">
              26
            </h3>
            <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
              YEAR EXPERIENCE
            </p>
          </div>
          <div>
            <h3 className="text-feed-jungle text-xl font-semibold md:text-6xl">
              100
            </h3>
            <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
              MENU/DISH
            </p>
          </div>
          <div>
            <h3 className="text-feed-jungle text-xl font-semibold md:text-6xl">
              50
            </h3>
            <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
              STAFFS
            </p>
          </div>
          <div>
            <h3 className="text-feed-jungle text-xl font-semibold md:text-6xl">
              15,000
            </h3>
            <p className="text-[10px] font-medium text-gray-600 sm:text-sm lg:text-base">
              HAPPY CUSTOMER
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServingCustomer;
