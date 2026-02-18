import Image from "next/image";

export default function Home() {
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
        <button
          type="button"
          className="group inline-flex h-12 w-full max-w-xs items-center justify-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white shadow-lg backdrop-blur transition-all hover:border-white/20 hover:bg-white/10 hover:shadow-indigo-500/10 hover:scale-105 active:scale-[0.98] sm:h-14 sm:w-auto sm:px-10"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="transition-transform group-hover:translate-x-0.5">
            Continue with Google
          </span>
        </button>

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
