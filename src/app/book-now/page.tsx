import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookNowHero from '@/app/book-now/components/BookNowHero';
import BookingForm from '@/app/book-now/components/BookingForm';
import AvailabilityCalendar from '@/app/villa-rental-rates/components/AvailabilityCalendar';

import { listGalleryItems } from '@/lib/db/services/galleryService';

export const dynamic = 'force-dynamic';

export default async function BookNowPage() {
  let heroImage: string | undefined;
  try {
    const items = await listGalleryItems({ status: 'active' });
    const match =
      items.find((i) => i.section === 'entertainment_deck') ||
      items.find((i) => i.section === 'villa_exterior') ||
      items[0];
    heroImage = match?.url;
  } catch (err) {
    console.warn('Failed to load hero image for book-now:', err);
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <BookNowHero image={heroImage} />
      <AvailabilityCalendar />
      <BookingForm />
      <Footer />
    </main>
  );
}
