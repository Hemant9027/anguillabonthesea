import React from "react";
import { UserCircleIcon, ShieldCheckIcon, KeyIcon } from "@heroicons/react/24/outline";

export const metadata = {
  title: "Admin Profile — Villa B Admin",
};

export default function AdminProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E7E5E4] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#E7E5E4]">
          <div className="w-20 h-20 rounded-2xl bg-[#1C1917] text-[#C88A4B] flex items-center justify-center font-serif text-3xl font-bold shadow-md shrink-0">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
                Administrator
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                Active Session
              </span>
            </div>
            <p className="text-sm text-[#78716C] mt-1">
              Superadmin account for Villa B on the Sea console
            </p>
          </div>
        </div>

        {/* Security Overview */}
        <div className="mt-6 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
            Authentication Settings
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E7E5E4]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#44403C] mb-1">
                <ShieldCheckIcon className="w-4 h-4 text-[#C88A4B]" />
                <span>Session Type</span>
              </div>
              <p className="text-sm font-medium text-[#1C1917]">
                HTTP-Only Cryptographic Cookie (7-day duration)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-[#E7E5E4]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#44403C] mb-1">
                <KeyIcon className="w-4 h-4 text-[#C88A4B]" />
                <span>Credentials Configuration</span>
              </div>
              <p className="text-sm font-medium text-[#1C1917]">
                Managed securely via centralized environment variables
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
