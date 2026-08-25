import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/app/components/HeroSection";
import IntroSection from "@/app/components/IntroSection";
import FeatureBento from "@/app/components/FeatureBento";
import HowToGetHere from "@/app/components/HowToGetHere";
import CtaStrip from "@/app/components/CtaStrip";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <IntroSection />
      <FeatureBento />
      <HowToGetHere />
      <CtaStrip />
      <Footer />
    </main>
  );
}
