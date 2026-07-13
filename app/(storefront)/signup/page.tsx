"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { API_URL } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Sign up failed");
      }

      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-secondary-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* ── Left — Branding ────────────────────────────────── */}
        <div className="flex flex-col justify-start items-start w-full lg:w-[44%] px-4">
          <div className="flex flex-col gap-[80px] w-full mb-8">
            <Image
              src="/icons/star.svg"
              alt="decorative star"
              width={64}
              height={64}
              className="self-end opacity-60"
            />
          </div>

          <h1 className="text-[40px] sm:text-[56px] lg:text-[64px] font-bold leading-[44px] sm:leading-[60px] lg:leading-[68px] text-text-primary font-integral">
            JOIN THE FAMILY
          </h1>

          <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mt-6 max-w-[420px]">
            Create your account and get access to exclusive deals, order
            tracking, and a fully personalised shopping experience.
          </p>

          {/* Perks list */}
          <div className="flex flex-col gap-4 mt-10">
            {[
              "Track all your orders in one place",
              "Save your favourite products",
              "Faster checkout every time",
              "Exclusive member-only offers",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-sm text-text-muted font-satoshi">
                  {perk}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Image
              src="/icons/star.svg"
              alt="decorative star"
              width={40}
              height={40}
              className="opacity-40"
            />
          </div>
        </div>

        {/* ── Right — Form card ──────────────────────────────── */}
        <div className="w-full lg:w-[52%] bg-white rounded-[20px] p-8 sm:p-10 shadow-sm border border-border-primary">
          <h2 className="text-[28px] sm:text-[32px] font-bold leading-[34px] sm:leading-[39px] text-text-primary font-integral mb-2">
            Create Account
          </h2>
          <p className="text-sm text-text-muted font-satoshi mb-8">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-text-primary font-medium underline underline-offset-2 hover:opacity-70 transition"
            >
              Sign in
            </Link>
          </p>

          {/* Error banner */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-[12px] text-sm text-red-600 font-satoshi">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Full name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="full_name"
                className="text-sm font-medium text-text-primary font-satoshi"
              >
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                placeholder="Rahul Sharma"
                value={form.full_name}
                onChange={handleChange}
                className="w-full border border-border-primary rounded-[12px] px-4 py-3.5 text-sm font-satoshi text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary transition"
              />
            </div>

            {/* Email + Phone — side by side on sm+ */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-text-primary font-satoshi"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-border-primary rounded-[12px] px-4 py-3.5 text-sm font-satoshi text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary transition"
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-text-primary font-satoshi"
                >
                  Phone
                  <span className="text-text-muted font-normal ml-1">
                    (optional)
                  </span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-border-primary rounded-[12px] px-4 py-3.5 text-sm font-satoshi text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-text-primary font-satoshi"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-border-primary rounded-[12px] px-4 py-3.5 pr-12 text-sm font-satoshi text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
                >
                  {showPass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="confirm"
                className="text-sm font-medium text-text-primary font-satoshi"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter your password"
                  value={form.confirm}
                  onChange={handleChange}
                  className="w-full border border-border-primary rounded-[12px] px-4 py-3.5 pr-12 text-sm font-satoshi text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition"
                >
                  {showConfirm ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password match indicator */}
              {form.confirm && (
                <p
                  className={`text-xs font-satoshi mt-1 ${
                    form.password === form.confirm
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {form.password === form.confirm
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-text-muted font-satoshi leading-relaxed">
              By creating an account you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-text-primary transition"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-text-primary transition"
              >
                Privacy Policy
              </Link>
              .
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-satoshi font-medium text-base leading-[22px] py-4 rounded-[26px] mt-2 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[1px] bg-border-primary" />
            <span className="text-xs text-text-muted font-satoshi">
              or continue with
            </span>
            <div className="flex-1 h-[1px] bg-border-primary" />
          </div>

          {/* Google */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 border border-border-primary rounded-[12px] py-3 text-sm font-satoshi text-text-primary hover:bg-[#f0f0f0] transition">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
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
              Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
