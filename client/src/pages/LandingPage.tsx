import { Navbar } from "@/sections/Navbar";
import { Main } from "@/sections/Main";
import { Footer } from "@/sections/Footer";

const LandingPage = () => {
  return (
    <div className="text-black text-base bg-stone-50 font-inter flex flex-col min-h-screen">
      <Navbar />
      <Main />
      <Footer />
    </div>
  );
};

export default LandingPage;
