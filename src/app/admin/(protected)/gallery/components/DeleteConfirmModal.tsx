"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { GalleryItem } from "@/lib/types/gallery";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GalleryItem | null;
  onConfirmDelete: (id: string) => Promise<void>;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  item,
  onConfirmDelete,
}: DeleteConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !item || !mounted) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(item._id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-md w-full border border-[#E7E5E4] shadow-2xl p-6 space-y-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <TrashIcon className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Delete Gallery Image?
          </h3>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-left">
            <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 font-semibold leading-relaxed">
              This image may be removed from the website.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-left mt-2">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-200 shrink-0">
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-stone-800 truncate">{item.title}</p>
              <p className="text-[11px] text-stone-500 truncate">{item.fileName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm & Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
