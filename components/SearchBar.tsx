"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchView from "@/components/ui/SearchView";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface Suggestion {
  name: string;
  slug: string;
  category_name: string;
  image_url: string | null;
  price: number;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // ── Fetch suggestions ─────────────────────────────────────
  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/search/suggestions?q=${encodeURIComponent(q)}`,
      );
      const data = await res.json();
      setSuggestions(data);
      setOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce 250ms
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 250);
    return () => clearTimeout(debounceRef.current);
  }, [query, fetchSuggestions]);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // ── Handlers ──────────────────────────────────────────────
  function handleSelect(slug: string) {
    setOpen(false);
    setQuery("");
    router.push(`/shop/${slug}`);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div ref={wrapRef} style={{ position: "relative", width: "100%" }}>
      <SearchView
        placeholder="Search for products..."
        text_font_size="text-base"
        text_font_family="Satoshi"
        text_font_weight="font-normal"
        text_line_height="leading-normal"
        text_color="text-white" // ← was: text-search-text
        fill_background_color="bg-white/10" // ← was: bg-[#f2f0f1]
        border_border_radius="rounded-full"
        className="rounded-full border border-white/15 focus-within:border-white/40 focus-within:bg-white/15 transition-all"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        leftIcon={
          // invert turns the black SVG white — same technique as cart/me icons
          <img
            src="/icons/magnifing_glass.svg"
            alt="search icon"
            className="w-[24px] h-[20px] invert opacity-60" // ← added invert + opacity
          />
        }
        rightIcon={
          loading ? (
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.2)", // ← was rgba(0,0,0,0.15)
                borderTopColor: "#ffffff", // ← was #000
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }}
            />
          ) : undefined
        }
      />

      {/* Dropdown — white card, unchanged */}
      {open && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e8e8e8",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            zIndex: 999,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {suggestions.map((s, i) => (
            <div
              key={s.slug}
              onClick={() => handleSelect(s.slug)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                cursor: "pointer",
                borderBottom:
                  i < suggestions.length - 1 ? "1px solid #f5f5f5" : "none",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#f5f5f5",
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: 8,
                }}
              >
                {s.image_url ? (
                  <img
                    src={s.image_url}
                    alt={s.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    📦
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#000",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#888",
                    marginTop: 2,
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {s.category_name}
                </div>
              </div>

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#000",
                  flexShrink: 0,
                  fontFamily: "Satoshi, sans-serif",
                }}
              >
                ₹{Number(s.price).toLocaleString("en-IN")}
              </div>
            </div>
          ))}

          {/* View all */}
          <div
            onClick={() => handleSubmit()}
            style={{
              padding: "10px 14px",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#000",
              cursor: "pointer",
              background: "#fafafa",
              borderTop: "1px solid #f0f0f0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              fontFamily: "Satoshi, sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fafafa")}
          >
            See all results for "{query}" →
          </div>
        </div>
      )}

      {/* No results */}
      {open && query.length >= 2 && !loading && suggestions.length === 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 20,
            padding: "14px 16px",
            fontSize: 13,
            color: "#888",
            zIndex: 999,
            fontFamily: "Satoshi, sans-serif",
          }}
        >
          No products found for "
          <strong style={{ color: "#000" }}>{query}</strong>"
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
