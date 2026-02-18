import Image from "next/image";
import GoogleSignInButton from "@/components/GoogleSignInButton";
import BookmarkDashboard from "@/components/BookmarkDashboard";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If logged in, show the bookmark dashboard
  if (user) {
    return <BookmarkDashboard user={user} />;
  }

  // Otherwise, show the landing page
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-indigo-950 to-purple-950 font-sans">
      <main className="flex w-full max-w-4xl flex-col items-center gap-8 px-4 py-12 text-center sm:gap-10 sm:px-6 sm:py-16 md:py-20">
        {/* Logo */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-2xl bg-indigo-500/20 blur-xl sm:-inset-4" />
          <Image
            src="/logo.svg"
            alt="Smart Bookmark logo"
            width={80}
            height={80}
            priority
            className="relative h-14 w-14 drop-shadow-2xl sm:h-16 sm:w-16 md:h-20 md:w-20"
          />
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Smart Bookmark
          </h1>
          <p className="max-w-xs text-base leading-relaxed text-indigo-200/70 sm:max-w-md sm:text-lg">
            Save, organize, and access your bookmarks in real-time — powered by
            Supabase and Next.js.
          </p>
        </div>

        {/* Google Sign-In */}
        <GoogleSignInButton />

        {/* Feature highlights */}
        <div className="mt-4 grid w-full max-w-2xl grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-3 sm:gap-6">
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="mb-2 text-xl sm:mb-3 sm:text-2xl">🔐</div>
            <h3 className="text-sm font-semibold text-white">Google Auth</h3>
            <p className="mt-1 text-xs text-indigo-300/60">
              Sign in securely with your Google account
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="mb-2 text-xl sm:mb-3 sm:text-2xl">⚡</div>
            <h3 className="text-sm font-semibold text-white">Real-time Sync</h3>
            <p className="mt-1 text-xs text-indigo-300/60">
              Bookmarks update instantly across all tabs
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur sm:p-6">
            <div className="mb-2 text-xl sm:mb-3 sm:text-2xl">🔒</div>
            <h3 className="text-sm font-semibold text-white">Private</h3>
            <p className="mt-1 text-xs text-indigo-300/60">
              Your bookmarks are visible only to you
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
