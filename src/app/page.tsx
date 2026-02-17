"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async () => {
    setIsLoggingIn(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  if (loading) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6
      bg-[radial-gradient(circle_at_20%_20%,#3b82f640,transparent_40%),radial-gradient(circle_at_80%_80%,#9333ea40,transparent_40%),linear-gradient(135deg,#0f172a,#1e3a8a,#312e81)]"
    >
      <div
        className="backdrop-blur-xl bg-white/10 border border-white/20 
      shadow-2xl rounded-2xl p-12 max-w-lg w-full text-center animate-fadeIn"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 text-white text-2xl shadow-md backdrop-blur-md">
            🔖
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">
          Smart Bookmark App
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 mb-10 leading-relaxed">
          Save, organize, and access your personal bookmarks securely.
          <br />
          <span className="font-medium text-white">Private to you.</span> Synced
          in real-time.
        </p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full py-3 rounded-lg
  bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-600
  text-white font-medium
  hover:brightness-110
  transition-all duration-200
  active:scale-95
  disabled:opacity-70
  shadow-lg hover:shadow-indigo-500/40"
        >
          {isLoggingIn ? "Redirecting..." : "Sign in with Google"}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          Built with Next.js + Supabase
        </p>
      </div>
    </div>
  );
}
