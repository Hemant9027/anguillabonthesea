"use client";

import React, { useState } from "react";
import {
  LockOpenIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface UnblockConfirmModalProps {
  blockId: string | null;
  reason: string;
  dateRange: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (blockId: string) => Promise<void>;
}

export default function UnblockConfirmModal({
  blockId,
  reason,
  dateRange,
  isOpen,
  onClose,
  onConfirm,
}: UnblockConfirmModalProps) {
  const [isReleasing, setIsReleasing] = useState(false);

  if (!isOpen || !blockId) return null;

  const handleConfirm = async () => {
    if (isReleasing) return;
    setIsReleasing(true);
    try {
      await onConfirm(blockId);
      onClose();
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-label="Close dialog"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl p-6 overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <LockOpenIcon className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9]"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif text-lg font-bold text-[#1C1917] mb-2">
          Release Blocked Dates?
        </h3>
        <p className="text-xs text-[#78716C] leading-relaxed mb-4">
          You are about to release the manual block for{" "}
          <strong className="text-[#1C1917]">{dateRange}</strong> (
          <span className="text-[#C88A4B] font-semibold">{reason}</span>). These
          dates will immediately become available for guest inquiries and booking.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F4EFE9]">
          <button
            type="button"
            onClick={onClose}
            disabled={isReleasing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4EFE9]"
          >
            Keep Blocked
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isReleasing}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isReleasing ? "Releasing Dates..." : "Confirm & Unblock"}
          </button>
        </div>
      </div>
    </div>
  );
}
