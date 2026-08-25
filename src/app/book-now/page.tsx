import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookNowHero from '@/app/book-now/components/BookNowHero';
import BookingForm from '@/app/book-now/components/BookingForm';
import AvailabilityCalendar from '@/app/villa-rental-rates/components/AvailabilityCalendar';

export default function BookNowPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <BookNowHero />
      <AvailabilityCalendar />
      <BookingForm />
      <Footer />
    </main>
  );
}
