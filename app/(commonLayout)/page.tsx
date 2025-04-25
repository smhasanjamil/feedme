import About from "@/components/home/about";
import Header from "@/components/home/header";
import OurMasterChef from "@/components/home/ourMasterChef";
import ServingCustomer from "@/components/home/servingCustomer";

const Home = () => {
  return (
    <>
      <Header />
      <About />
      <ServingCustomer />
      <OurMasterChef />
    </>
  );
};

export default Home;
