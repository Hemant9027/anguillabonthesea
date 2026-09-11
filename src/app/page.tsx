import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/app/components/HeroSection";
import IntroSection from "@/app/components/IntroSection";
import FeatureBento from "@/app/components/FeatureBento";
import HowToGetHere from "@/app/components/HowToGetHere";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import CtaStrip from "@/app/components/CtaStrip";
import { listReviews } from "@/lib/db/services/reviewService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let reviews: any[] = [];
  try {
    reviews = await listReviews({ status: "published" });
  } catch (err) {
    console.warn("Could not load reviews for homepage:", err);
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <IntroSection />
      <FeatureBento />
      <HowToGetHere />
      <TestimonialsSection reviews={reviews} />
      <CtaStrip />
      <Footer />
    </main>
  );
}

