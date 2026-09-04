import {
  BaseRateConfig,
  SeasonalRule,
  AdditionalCharge,
  PricingCalculationResult,
  NightRateBreakdown,
  ChargeBreakdown,
} from "../types/pricing";

function parseDateStr(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function calculateStayQuote({
  checkIn,
  checkOut,
  guests = 2,
  baseRate,
  seasons = [],
  charges = [],
}: {
  checkIn: string;
  checkOut: string;
  guests?: number;
  baseRate: BaseRateConfig;
  seasons?: SeasonalRule[];
  charges?: AdditionalCharge[];
}): PricingCalculationResult {
  const start = parseDateStr(checkIn);
  const end = parseDateStr(checkOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    throw new Error("Invalid stay dates: Check-out must be after check-in.");
  }

  const activeSeasons = seasons.filter((s) => s.isActive);
  const activeCharges = charges.filter((c) => c.isActive);

  const nightlyBreakdown: NightRateBreakdown[] = [];
  let subtotal = 0;

  // Iterate night by night (from checkIn date up to day before checkOut)
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dStr = formatDateStr(d);

    // Check if date falls within an active seasonal rule
    const matchedSeason = activeSeasons.find(
      (s) => s.startDate <= dStr && s.endDate >= dStr
    );

    const rate = matchedSeason
      ? Number(matchedSeason.nightlyRate)
      : Number(baseRate.nightlyRate);

    nightlyBreakdown.push({
      date: dStr,
      rate,
      seasonName: matchedSeason ? matchedSeason.name : undefined,
    });

    subtotal += rate;
  }

  const nights = nightlyBreakdown.length;
  const averageNightlyRate = nights > 0 ? Math.round(subtotal / nights) : 0;

  // Calculate additional charges
  const chargesBreakdown: ChargeBreakdown[] = activeCharges.map((charge) => {
    let calculatedAmount = 0;

    switch (charge.type) {
      case "fixed":
        calculatedAmount = Number(charge.amount);
        break;
      case "percentage":
        calculatedAmount = Math.round((subtotal * Number(charge.amount)) / 100);
        break;
      case "per_night":
        calculatedAmount = Number(charge.amount) * nights;
        break;
      case "per_guest":
        calculatedAmount = Number(charge.amount) * Math.max(1, Number(guests));
        break;
    }

    return {
      id: charge._id,
      name: charge.name,
      type: charge.type,
      rateValue: Number(charge.amount),
      calculatedAmount,
    };
  });

  const totalCharges = chargesBreakdown.reduce(
    (sum, c) => sum + c.calculatedAmount,
    0
  );
  const grandTotal = subtotal + totalCharges;

  return {
    checkIn,
    checkOut,
    nights,
    guests: Math.max(1, Number(guests)),
    nightlyBreakdown,
    subtotal,
    averageNightlyRate,
    chargesBreakdown,
    totalCharges,
    grandTotal,
  };
}
