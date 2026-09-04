"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  TrashIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { CustomerInquiry } from "@/lib/types/inquiry";

interface DeleteInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: CustomerInquiry | null;
  onArchive: (id: string) => Promise<void>;
  onPermanentDelete: (id: string) => Promise<void>;
}

export default function DeleteInquiryModal({
  isOpen,
  onClose,
  inquiry,
  onArchive,
  onPermanentDelete,
}: DeleteInquiryModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !inquiry || !mounted) return null;

  const handleArchive = async () => {
    setIsProcessing(true);
    try {
      await onArchive(inquiry._id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePermanent = async () => {
    setIsProcessing(true);
    try {
      await onPermanentDelete(inquiry._id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full border border-[#E7E5E4] shadow-2xl p-6 space-y-5 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <ArchiveBoxIcon className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Manage Inquiry Record
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Would you like to archive or permanently remove the inquiry from{" "}
            <span className="font-bold text-stone-800">
              {inquiry.name}
            </span>
            ?
          </p>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-left text-xs space-y-0.5 mt-2">
            <p className="font-semibold text-stone-800 truncate">
              {inquiry.subject}
            </p>
            <p className="text-stone-400 text-[11px] truncate">{inquiry.email}</p>
          </div>
        </div>

        {/* Action Options */}
        <div className="space-y-2.5 pt-2">
          {/* Option 1: Archive (Recommended) */}
          <button
            type="button"
            onClick={handleArchive}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C88A4B] to-[#B07338] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArchiveBoxIcon className="w-4 h-4" />
            <span>Archive Inquiry (Recommended)</span>
          </button>

          {/* Option 2: Permanent Delete */}
          <button
            type="button"
            onClick={handlePermanent}
            disabled={isProcessing}
            className="w-full py-2 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Permanently Delete</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="w-full py-2 text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
