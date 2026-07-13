"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { API_URL } from "@/lib/api";

type Step = "email" | "otp" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Step 1 — Send OTP ──────────────────────────────────────────
  // Separated into sendOtp() so both the form submit AND the
  // "Resend OTP" button can call it without needing a FormEvent.
  const sendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send OTP");
      setStep("otp");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp();
  };

  // ── Step 2 — Verify OTP ────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid OTP");
      setStep("reset");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3 — Reset Password ────────────────────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otp.join(""),
          new_password: password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to reset password");
      setStep("done");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input handlers ─────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError(null);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Handles paste on any OTP box — fills all 6 digits at once
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    setError(null);
    // Focus the box after the last pasted digit (or the last box)
    const focusIndex = Math.min(pasted.length, 5);
    document.getElementById(`otp-${focusIndex}`)?.focus();
  };

  const steps = ["Email", "Verify", "Reset"];
  const currentStepIndex = step === "email" ? 0 : step === "otp" ? 1 : 2;

  return (
    <main className="min-h-screen bg-secondary-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* ── Left — Branding ──────────────────────────────────── */}
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
            RESET YOUR ACCESS
          </h1>

          <p className="text-base font-normal leading-[22px] text-text-muted font-satoshi mt-6 max-w-[420px]">
            Don't worry — it happens to everyone. We'll help you securely
            recover your account in just a few steps.
          </p>

          {/* Steps guide */}
          <div className="flex flex-col gap-4 mt-10">
            {[
              {
                label: "Enter your email address",
                done: currentStepIndex >= 0,
              },
              {
                label: "Verify the OTP sent to your inbox",
                done: currentStepIndex >= 1,
              },
              {
                label: "Set a strong new password",
                done: currentStepIndex >= 2,
              },
              { label: "Sign in and you're back!", done: step === "done" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                    item.done
                      ? "bg-black"
                      : "bg-border-primary border border-border-primary"
                  }`}
                >
                  {item.done && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm font-satoshi ${item.done ? "text-text-primary" : "text-text-muted"}`}
                >
                  {item.label}
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

        {/* ── Right — Form card ─────────────────────────────────── */}
        <div className="w-full lg:w-[52%] bg-white rounded-[20px] p-8 sm:p-10 shadow-sm border border-border-primary">
          {/* Progress bar */}
          {step !== "done" && (
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {steps.map((s, i) => (
                  <span
                    key={s}
                    className={`text-xs font-satoshi font-medium ${
                      i <= currentStepIndex
                        ? "text-text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="w-full h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${((currentStepIndex + 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-[12px] text-sm text-red-600 font-satoshi">
              {error}
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <>
              <h2 className="text-[28px] sm:text-[32px] font-bold leading-[34px] sm:leading-[39px] text-text-primary font-integral mb-2">
                Forgot Password?
              </h2>
              <p className="text-sm text-text-muted font-satoshi mb-8">
                Enter the email linked to your account and we'll send you a
                one-time verification code.
              </p>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
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
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="w-full border border-border-primary rounded-[12px] px-4 py-3.5 text-sm font-satoshi text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-satoshi font-medium text-base leading-[22px] py-4 rounded-[26px] mt-2 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <p className="text-sm text-text-muted font-satoshi text-center mt-6">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-text-primary font-medium underline underline-offset-2 hover:opacity-70 transition"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <>
              <h2 className="text-[28px] sm:text-[32px] font-bold leading-[34px] sm:leading-[39px] text-text-primary font-integral mb-2">
                Enter OTP
              </h2>
              <p className="text-sm text-text-muted font-satoshi mb-8">
                We sent a 6-digit code to{" "}
                <span className="text-text-primary font-medium">{email}</span>.
                Check your inbox (and spam folder).
              </p>

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                {/* OTP boxes */}
                <div className="flex gap-3 justify-between">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={handleOtpPaste}
                      className="w-full max-w-[52px] aspect-square text-center text-xl font-bold font-satoshi text-text-primary border border-border-primary rounded-[12px] outline-none focus:border-text-primary transition"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-satoshi font-medium text-base leading-[22px] py-4 rounded-[26px] mt-2 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

              <p className="text-sm text-text-muted font-satoshi text-center mt-6">
                Didn't receive it?{" "}
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="text-text-primary font-medium underline underline-offset-2 hover:opacity-70 transition disabled:opacity-40"
                >
                  {loading ? "Sending..." : "Resend OTP"}
                </button>
              </p>
            </>
          )}

          {/* ── STEP 3: Reset ── */}
          {step === "reset" && (
            <>
              <h2 className="text-[28px] sm:text-[32px] font-bold leading-[34px] sm:leading-[39px] text-text-primary font-integral mb-2">
                New Password
              </h2>
              <p className="text-sm text-text-muted font-satoshi mb-8">
                Choose a strong password you haven't used before.
              </p>

              <form
                onSubmit={handleResetPassword}
                className="flex flex-col gap-5"
              >
                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-text-primary font-satoshi"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPass ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
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
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        setError(null);
                      }}
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

                  {confirm && (
                    <p
                      className={`text-xs font-satoshi mt-1 ${password === confirm ? "text-green-600" : "text-red-500"}`}
                    >
                      {password === confirm
                        ? "✓ Passwords match"
                        : "✗ Passwords do not match"}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white font-satoshi font-medium text-base leading-[22px] py-4 rounded-[26px] mt-2 hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 4: Done ── */}
          {step === "done" && (
            <div className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-6">
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
                  <path
                    d="M2 11L10 19L26 2"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="text-[28px] sm:text-[32px] font-bold text-text-primary font-integral mb-3">
                Password Reset!
              </h2>
              <p className="text-sm text-text-muted font-satoshi max-w-[320px] mb-8">
                Your password has been updated successfully. You can now sign in
                with your new password.
              </p>
              <Link
                href="/signin"
                className="w-full bg-black text-white font-satoshi font-medium text-base leading-[22px] py-4 rounded-[26px] hover:opacity-80 transition text-center block"
              >
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
