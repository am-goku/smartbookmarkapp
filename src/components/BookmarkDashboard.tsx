"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Bookmark } from "@/types/types";
import type { User } from "@supabase/supabase-js";

export default function BookmarkDashboard({ user }: { user: User }) {
    const supabase = useMemo(() => createClient(), []);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Fetch + real-time subscription + tab-focus refetch
    useEffect(() => {
        let cancelled = false;

        const fetchBookmarks = async () => {
            const { data } = await supabase
                .from("bookmarks")
                .select("*")
                .order("created_at", { ascending: false });
            if (data && !cancelled) setBookmarks(data);
            if (!cancelled) setIsLoading(false);
        };

        // Initial fetch
        fetchBookmarks();

        // Refetch when this tab regains focus (cross-tab sync)
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") fetchBookmarks();
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Subscribe for real-time changes
        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                () => {
                    fetchBookmarks();
                }
            )
            .subscribe();

        return () => {
            cancelled = true;
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    // Cross-tab sign-out: redirect when session is revoked from another tab
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === "SIGNED_OUT") {
                window.location.href = "/";
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || !title.trim()) return;
        setIsAdding(true);

        const { data, error } = await supabase
            .from("bookmarks")
            .insert({
                url: url.trim(),
                title: title.trim(),
                user_id: user.id,
            })
            .select()
            .single();

        if (!error && data) {
            setBookmarks((prev) => [data, ...prev]);
            setUrl("");
            setTitle("");
            setShowForm(false);
        }
        setIsAdding(false);
    };

    const handleDelete = async (id: string) => {
        // Optimistic: remove from UI immediately
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        await supabase.from("bookmarks").delete().eq("id", id);
    };

    const handleSignOut = async () => {
        setIsSigningOut(true);
        await supabase.auth.signOut();
        window.location.reload();
    };

    return (
        <div className="flex min-h-screen flex-col bg-linear-to-br from-slate-950 via-indigo-950 to-purple-950 font-sans">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6">
                <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                    📑 Smart Bookmark
                </h1>
                <div className="flex items-center gap-3 sm:gap-4">
                    <span className="hidden text-sm text-indigo-300/60 sm:block">
                        {user.email}
                    </span>
                    <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-indigo-200 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 cursor-pointer"
                    >
                        {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                </div>
            </header>

            {/* Main content */}
            <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
                {/* Add bookmark button / form */}
                {!showForm ? (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/2 py-4 text-sm font-medium text-indigo-300/60 transition-all hover:border-indigo-500/30 hover:bg-white/5 hover:text-indigo-200 cursor-pointer"
                    >
                        <span className="text-lg">+</span> Add a bookmark
                    </button>
                ) : (
                    <form
                        onSubmit={handleAdd}
                        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                    >
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Bookmark title"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                            autoFocus
                        />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-colors focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={isAdding}
                                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                            >
                                {isAdding ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setUrl("");
                                    setTitle("");
                                }}
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-indigo-200 transition-all hover:bg-white/10 cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Bookmarks list */}
                {isLoading ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
                        <svg className="h-8 w-8 animate-spin text-indigo-400/60" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-sm text-indigo-300/50">Loading bookmarks...</p>
                    </div>
                ) : bookmarks.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20 text-center">
                        <span className="text-4xl">📭</span>
                        <p className="text-sm text-indigo-300/50">
                            No bookmarks yet. Add your first one!
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="group flex items-start justify-between gap-3 rounded-2xl border border-white/5 bg-white/3 p-4 transition-all hover:border-white/10 hover:bg-white/5 sm:items-center"
                            >
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-w-0 flex-1 flex-col gap-1"
                                >
                                    <span className="truncate text-sm font-medium text-white transition-colors group-hover:text-indigo-300">
                                        {bookmark.title}
                                    </span>
                                    <span className="truncate text-xs text-indigo-400/40">
                                        {bookmark.url}
                                    </span>
                                </a>
                                <button
                                    onClick={() => handleDelete(bookmark.id)}
                                    className="shrink-0 rounded-lg p-1.5 text-white/20 transition-all hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                                    title="Delete bookmark"
                                >
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
