import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RatesHero from '@/app/villa-rental-rates/components/RatesHero';
import RatesTable from '@/app/villa-rental-rates/components/RatesTable';
import PoliciesSection from '@/app/villa-rental-rates/components/PoliciesSection';
import { listSeasonalRules, listAdditionalCharges } from '@/lib/db/services/pricingService';

export const dynamic = 'force-dynamic';

export default async function VillaRentalRatesPage() {
  const [seasons, charges] = await Promise.all([
    listSeasonalRules().catch(() => []),
    listAdditionalCharges().catch(() => []),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <RatesHero />
      <RatesTable initialSeasons={seasons} initialCharges={charges} />
      <PoliciesSection />
      <Footer />
    </main>
  );
}
