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
import { listGalleryItems } from "@/lib/db/services/galleryService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let reviews: any[] = [];
  let galleryItems: any[] = [];

  try {
    reviews = await listReviews({ status: "published" });
  } catch (err) {
    console.warn("Could not load reviews for homepage:", err);
  }

  try {
    galleryItems = await listGalleryItems({ status: "active" });
  } catch (err) {
    console.warn("Could not load gallery items for homepage:", err);
  }

  // Dynamic gallery images
  const exteriorImages = galleryItems.filter(
    (i) => i.section === "villa_exterior" || i.section === "entertainment_deck"
  );
  const heroSlides = (exteriorImages.length > 0 ? exteriorImages : galleryItems)
    .slice(0, 5)
    .map((i) => ({ src: i.url, alt: i.altText || i.title }));

  const mainLevelImage = galleryItems.find((i) => i.section === "main_level");
  const introImage = mainLevelImage
    ? { src: mainLevelImage.url, alt: mainLevelImage.altText || mainLevelImage.title }
    : undefined;

  const beachItem =
    galleryItems.find((i) => i.section === "attractions") ||
    galleryItems.find((i) => i.section === "villa_exterior");
  const poolItem =
    galleryItems.find((i) => i.section === "entertainment_deck" || /pool/i.test(i.title || "")) ||
    galleryItems.find((i) => i.section === "amenities");
  const theaterItem =
    galleryItems.find((i) => i.section === "amenities" && /theater|cinema/i.test(i.title || "")) ||
    galleryItems.find((i) => i.section === "amenities");
  const kitchenItem =
    galleryItems.find((i) => i.section === "main_level" && /kitchen|dining/i.test(i.title || "")) ||
    galleryItems.find((i) => i.section === "main_level");

  const bentoImages = {
    beachfront: beachItem ? { src: beachItem.url, alt: beachItem.altText || beachItem.title } : undefined,
    pools: poolItem ? { src: poolItem.url, alt: poolItem.altText || poolItem.title } : undefined,
    theater: theaterItem ? { src: theaterItem.url, alt: theaterItem.altText || theaterItem.title } : undefined,
    amenities: kitchenItem ? { src: kitchenItem.url, alt: kitchenItem.altText || kitchenItem.title } : undefined,
  };

  const ctaItem =
    galleryItems.find((i) => i.section === "entertainment_deck" && i !== poolItem) ||
    galleryItems[0];
  const ctaImage = ctaItem ? { src: ctaItem.url, alt: ctaItem.altText || ctaItem.title } : undefined;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection slides={heroSlides.length > 0 ? heroSlides : undefined} />
      <IntroSection image={introImage} />
      <FeatureBento images={bentoImages} />
      <HowToGetHere />
      <TestimonialsSection reviews={reviews} />
      <CtaStrip image={ctaImage} />
      <Footer />
    </main>
  );
}

