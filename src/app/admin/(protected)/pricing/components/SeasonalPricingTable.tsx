"use client";

import React from "react";
import {
  CalendarDaysIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { SeasonalRule } from "@/lib/types/pricing";

interface SeasonalPricingTableProps {
  seasons: SeasonalRule[];
  onAddSeason: () => void;
  onEditSeason: (season: SeasonalRule) => void;
  onDeleteSeason: (id: string, name: string) => void;
  onToggleActive: (season: SeasonalRule) => void;
  isLoading?: boolean;
}

export default function SeasonalPricingTable({
  seasons,
  onAddSeason,
  onEditSeason,
  onDeleteSeason,
  onToggleActive,
  isLoading,
}: SeasonalPricingTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-[#F4EFE9] rounded w-1/4" />
        <div className="h-24 bg-[#F4EFE9] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E7E5E4] p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4EFE9]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A4B] block">
            Dynamic Rules
          </span>
          <h3 className="font-serif text-lg font-bold text-[#1C1917]">
            Seasonal Rates & Holidays
          </h3>
          <p className="text-xs text-[#78716C]">
            Custom rate tiers that automatically override base pricing during specific dates
          </p>
        </div>

        <button
          type="button"
          onClick={onAddSeason}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#2B2623] text-white text-xs font-semibold transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <PlusIcon className="w-4 h-4 text-[#C88A4B]" />
          <span>Add Seasonal Rate</span>
        </button>
      </div>

      {seasons.length > 0 ? (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[580px]">
            <thead>
              <tr className="border-b border-[#F4EFE9] text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
                <th className="pb-3">Season Name</th>
                <th className="pb-3">Date Window</th>
                <th className="pb-3">Nightly Rate</th>
                <th className="pb-3">Min Stay</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE9] text-xs">
              {seasons.map((season) => (
                <tr key={season._id} className="hover:bg-[#FDFBF7] transition-colors">
                  {/* Name */}
                  <td className="py-3.5 font-semibold text-[#1C1917]">
                    <div>{season.name}</div>
                    {season.description && (
                      <div className="text-[11px] font-normal text-[#78716C] truncate max-w-[180px]">
                        {season.description}
                      </div>
                    )}
                  </td>

                  {/* Date window */}
                  <td className="py-3.5 text-[#44403C]">
                    <span className="font-medium text-[#1C1917]">
                      {season.startDate}
                    </span>{" "}
                    &rarr;{" "}
                    <span className="font-medium text-[#1C1917]">
                      {season.endDate}
                    </span>
                  </td>

                  {/* Nightly rate */}
                  <td className="py-3.5 font-serif font-bold text-sm text-[#1C1917]">
                    {formatCurrency(season.nightlyRate)}
                    <span className="text-[10px] font-normal text-[#78716C] ml-1">
                      / nt
                    </span>
                  </td>

                  {/* Min stay */}
                  <td className="py-3.5 text-[#44403C] font-medium">
                    {season.minStay} Nights
                  </td>

                  {/* Status Toggle */}
                  <td className="py-3.5">
                    <button
                      type="button"
                      onClick={() => onToggleActive(season)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                        season.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-stone-100 text-stone-500 border border-stone-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          season.isActive ? "bg-emerald-500" : "bg-stone-400"
                        }`}
                      />
                      <span>{season.isActive ? "Active" : "Disabled"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEditSeason(season)}
                        className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C88A4B] hover:bg-[#F4EFE9] transition-colors"
                        title="Edit Season"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSeason(season._id, season.name)}
                        className="p-1.5 rounded-lg text-[#78716C] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Season"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty state */
        <div className="py-10 px-4 rounded-2xl bg-[#FDFBF7] border border-dashed border-[#E7E5E4] text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F4EFE9] text-[#78716C] flex items-center justify-center mb-3">
            <CalendarDaysIcon className="w-6 h-6 text-[#C88A4B]" />
          </div>
          <h4 className="font-serif text-base font-semibold text-[#1C1917] mb-1">
            No seasonal pricing rules configured
          </h4>
          <p className="text-xs text-[#78716C] max-w-sm mb-4 leading-relaxed">
            Configure Holiday, Festive, or Summer seasons to automatically apply premiums or promotional nightly rates.
          </p>
          <button
            type="button"
            onClick={onAddSeason}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#2B2623] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <PlusIcon className="w-4 h-4 text-[#C88A4B]" />
            <span>Create First Season</span>
          </button>
        </div>
      )}
    </div>
  );
}
