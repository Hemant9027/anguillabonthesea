import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RatesHero from '@/app/villa-rental-rates/components/RatesHero';
import RatesTable from '@/app/villa-rental-rates/components/RatesTable';
import PoliciesSection from '@/app/villa-rental-rates/components/PoliciesSection';

export default function VillaRentalRatesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <RatesHero />
      <RatesTable />
      <PoliciesSection />
      <Footer />
    </main>
  );
}
