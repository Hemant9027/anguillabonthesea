"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ReviewItem } from "@/lib/types/review";

interface DeleteReviewModalProps {
  isOpen: boolean;
  review: ReviewItem | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteReviewModal({
  isOpen,
  review,
  onClose,
  onConfirm,
}: DeleteReviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  if (!mounted || !isOpen || !review) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      await onConfirm(review._id);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to delete review. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E7E5E4] shadow-2xl p-6 sm:p-7 z-10 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-[#F5F5F4] mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#F5F5F4] hover:text-[#1C1917] transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-serif text-xl font-semibold text-[#1C1917] mb-2">
          Delete Testimonial?
        </h3>
        <p className="text-xs text-[#78716C] leading-relaxed mb-4">
          Are you sure you want to permanently remove the review by{" "}
          <strong className="text-[#1C1917] font-semibold">{review.guestName}</strong>?
          This action cannot be undone.
        </p>

        <div className="p-3 bg-[#FBFBFA] border border-[#E7E5E4] rounded-xl mb-4 text-xs text-[#57534E] italic">
          &ldquo;{review.reviewText.length > 120
            ? `${review.reviewText.slice(0, 120)}...`
            : review.reviewText}&rdquo;
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:bg-[#F5F5F4] hover:text-[#1C1917] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
