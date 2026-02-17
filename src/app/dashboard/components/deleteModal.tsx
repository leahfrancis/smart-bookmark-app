"use client";

import { motion } from "framer-motion";
import { Bookmark } from "../hooks/useBookmark";

type Props = {
  bookmark: Bookmark | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
};

export function DeleteModal({ bookmark, onClose, onConfirm }: Props) {
  if (!bookmark) return null; 

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-slate-900 border border-white/10 text-white
        rounded-xl p-6 w-80 shadow-2xl"
      >
        <h3 className="text-lg font-semibold mb-3">Delete Bookmark?</h3>

        <p className="text-sm text-gray-400 mb-6">
          Are you sure you want to delete
          <span className="block mt-2 text-indigo-400 font-medium">
            {bookmark.title}
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              await onConfirm(bookmark.id);
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
