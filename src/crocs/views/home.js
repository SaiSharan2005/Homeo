import React from "react";
import { Helmet } from "react-helmet";
import Navbar from "../components/navbar";
import HeroPage from "../components/hero";
import Features1 from "../components/features1";
import CTA from "../components/cta";
import Features2 from "../components/features2";
import Pricing from "../components/pricing";
import Steps from "../components/steps";
import Testimonial from "../components/testimonial";
import Contact from "../components/contact";
import Footer from "../components/footer";
import AdBanner from "../../patient/Adv";
import "./home.css";

const Home = (props) => {
  return (
    <div className="flex flex-col home-container">
      <Helmet>
        <title>Healthify</title>
      </Helmet>

      <Navbar />

      <div className="flex min-h-screen">
        {/* Left Banner */}
        <div className="w-[15%] hidden lg:block">
          <AdBanner targetPage="home-left" />
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-[70vw] mx-auto py-6 sm:px-6 lg:px-8">
          <HeroPage />
          <Features1 />
        </main>

        {/* Right Banner */}
        <div className="w-[15%] hidden lg:block">
          <AdBanner targetPage="home-right" />
        </div>
      </div>

      {/* Additional Content Below Main Area */}
      <main className="flex-1 mx-auto py-6 sm:px-6 lg:px-8">
        <CTA />
        <Features2 />
        <Steps />
        <Testimonial />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

export default Home;
