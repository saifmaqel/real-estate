import HeroSection from "@/app/(nondashboard)/landing/HeroSection";
import React from "react";
import FeatureSection from "./FeatureSection";
import DiscoverSection from "./DiscoverSection";
import CallToActionSection from "./CallToActionSection";
import FooterSection from "./FooterSection";

function Landing() {
  return (
    <div className="h-full">
      <HeroSection />
      <FeatureSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
}

export default Landing;
