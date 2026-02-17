"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

import { useBookmarks } from "./hooks/useBookmark";
import { useMetadata } from "./hooks/useMetadata";
import { DeleteModal } from "./components/deleteModal";

export default function Dashboard() {
  const router = useRouter();

  const { bookmarks, loading, addBookmark, deleteBookmark } = useBookmarks();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [bookmarkToDelete, setBookmarkToDelete] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTitleManuallyEdited, setIsTitleManuallyEdited] = useState(false);

  const { data: metaData, isFetchingMeta } = useMetadata(url);

  /* Auto-fill title from metadata */
  useEffect(() => {
    if (metaData?.title && !isTitleManuallyEdited && title.trim() === "") {
      setTitle(metaData.title);
    }
  }, [metaData]);

  /* Logout */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      setFormError("Title and URL are required.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);
    setTitle("");
    setUrl("");
    setIsTitleManuallyEdited(false);

    const result = await addBookmark(title, url);

    if (!result.success) {
      setFormError(result.error || "Failed to add bookmark.");
    } else {
      setTitle("");
      setUrl("");
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 py-16
        bg-[linear-gradient(135deg,#0f172a,#1e3a8a,#312e81)]"
      >
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-16
      bg-[linear-gradient(135deg,#0f172a,#1e3a8a,#312e81)]"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 
        shadow-2xl rounded-2xl p-10 max-w-xl w-full text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Your Bookmarks</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setIsTitleManuallyEdited(true);
            }}
            className="bg-white/20 border border-white/20 
  p-3 rounded-lg text-white placeholder-gray-300 
  focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="relative">
            <input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/20 border border-white/20 
              p-3 pr-16 rounded-lg text-white placeholder-gray-300 
              focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full"
            />

            {isFetchingMeta && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-300">
                Fetching...
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600
            py-3 rounded-lg font-medium transition-all duration-200
            disabled:opacity-70"
          >
            {isSubmitting ? "Adding..." : "Add Bookmark"}
          </motion.button>

          {formError && <p className="text-red-400 text-sm">{formError}</p>}
        </form>

        {/* List */}
        {bookmarks.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 
          bg-white/5 rounded-xl border border-white/10"
          >
            <span className="text-3xl mb-3">🔖</span>
            <p className="text-gray-300 text-sm">No bookmarks yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            <AnimatePresence>
              {bookmarks.map((bookmark) => (
                <motion.li
                  key={bookmark.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/10 border border-white/20
                  p-4 rounded-lg flex justify-between items-center"
                >
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-300 hover:text-white underline"
                  >
                    {bookmark.title}
                  </a>

                  <button
                    onClick={() => setBookmarkToDelete(bookmark)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.div>

      {/* Delete Modal */}
      <DeleteModal
        bookmark={bookmarkToDelete}
        onClose={() => setBookmarkToDelete(null)}
        onConfirm={async (id) => {
          await deleteBookmark(id);
          setBookmarkToDelete(null);
        }}
      />
    </div>
  );
}
