export type ChargeType = "fixed" | "percentage" | "per_night" | "per_guest";

export interface BaseRateConfig {
  villaName: string;
  nightlyRate: number;
  minStay: number;
  currency: string;
  updatedAt: string;
}

export interface SeasonalRule {
  _id: string;
  name: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  nightlyRate: number;
  minStay: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdditionalCharge {
  _id: string;
  name: string;
  amount: number;
  type: ChargeType;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NightRateBreakdown {
  date: string;
  rate: number;
  seasonName?: string;
}

export interface ChargeBreakdown {
  id: string;
  name: string;
  type: ChargeType;
  rateValue: number;
  calculatedAmount: number;
}

export interface PricingCalculationResult {
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  nightlyBreakdown: NightRateBreakdown[];
  subtotal: number;
  averageNightlyRate: number;
  chargesBreakdown: ChargeBreakdown[];
  totalCharges: number;
  grandTotal: number;
}

export interface CreateSeasonDto {
  name: string;
  startDate: string;
  endDate: string;
  nightlyRate: number;
  minStay: number;
  description?: string;
  isActive?: boolean;
}

export interface CreateChargeDto {
  name: string;
  amount: number;
  type: ChargeType;
  description?: string;
  isActive?: boolean;
}
