import React from "react";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Pricing & Rates — Villa B Admin",
};

export default function AdminPricingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F4EFE9] text-[#C88A4B] flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CurrencyDollarIcon className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[#1C1917] mb-2">
          Rates & Pricing Management
        </h2>
        <p className="text-sm text-[#78716C] leading-relaxed mb-6">
          The route structure and authentication guard for Rates & Pricing are active. High/Low season configurations, holiday tier rates, and minimum night requirements will be implemented in subsequent steps.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Route Guard & Layout Active</span>
        </div>
      </div>
    </div>
  );
}
