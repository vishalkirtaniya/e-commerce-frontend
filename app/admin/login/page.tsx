"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminApi } from "@/lib/adminApi";

export default function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/admin/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { token } = await adminApi.login(email, password);
      document.cookie = `admin_token=${token}; path=/; max-age=${60 * 60 * 8}`;
      router.push(redirect);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        fontFamily: "'DM Sans', sans-serif",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .left-panel {
          width: 55%;
          background: #0f172a;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          top: -100px;
          left: -100px;
          pointer-events: none;
        }

        .glow-2 {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%);
          bottom: 100px;
          right: -50px;
          pointer-events: none;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .brand-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 700;
          color: white;
          font-family: 'DM Mono', monospace;
        }

        .brand-name {
          font-size: 16px;
          font-weight: 600;
          color: white;
          letter-spacing: -0.3px;
        }

        .brand-tag {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.5px;
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11px;
          color: #a5b4fc;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.5px;
          margin-bottom: 24px;
        }

        .hero-dot {
          width: 6px;
          height: 6px;
          background: #6366f1;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .hero-title {
          font-size: 48px;
          font-weight: 300;
          color: white;
          line-height: 1.1;
          letter-spacing: -2px;
          margin-bottom: 16px;
        }

        .hero-title strong {
          font-weight: 600;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          max-width: 360px;
        }

        .stats-row {
          display: flex;
          gap: 32px;
          position: relative;
          z-index: 1;
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 600;
          color: white;
          letter-spacing: -1px;
          font-family: 'DM Mono', monospace;
        }

        .stat-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.3px;
        }

        .stat-divider {
          width: 1px;
          background: rgba(255,255,255,0.08);
          align-self: stretch;
        }

        .right-panel {
          width: 45%;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
        }

        .form-container {
          width: 100%;
          max-width: 360px;
        }

        .form-header {
          margin-bottom: 40px;
        }

        .form-title {
          font-size: 28px;
          font-weight: 600;
          color: #0f172a;
          letter-spacing: -1px;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: #64748b;
        }

        .field {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 8px;
          letter-spacing: -0.2px;
        }

        .field-input-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          background: white;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          appearance: none;
        }

        .field-input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }

        .field-input::placeholder {
          color: #cbd5e1;
        }

        .toggle-pw {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          font-size: 13px;
          font-family: 'DM Mono', monospace;
          padding: 0;
          transition: color 0.15s;
        }

        .toggle-pw:hover { color: #6366f1; }

        .error-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #ef4444;
        }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #0f172a;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: -0.2px;
          margin-top: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #1e293b;
        }

        .submit-btn:active:not(:disabled) {
          transform: scale(0.99);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .form-footer {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
        }

        .footer-text {
          font-size: 12px;
          color: #94a3b8;
          font-family: 'DM Mono', monospace;
        }
      `}</style>

      {/* Left Panel */}
      <div className="left-panel">
        <div className="grid-bg" />
        <div className="glow" />
        <div className="glow-2" />

        <div className="brand">
          <div className="brand-icon">A</div>
          <div>
            <div className="brand-name">StoreAdmin</div>
            <div className="brand-tag">CONTROL PANEL</div>
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-label">
            <div className="hero-dot" />
            ADMIN PORTAL
          </div>
          <h1 className="hero-title">
            Manage your
            <br />
            <strong>store</strong> with
            <br />
            precision.
          </h1>
          <p className="hero-sub">
            Full control over orders, products, customers, and analytics — all
            in one place.
          </p>
        </div>

        <div className="stats-row">
          <div className="stat">
            <span className="stat-value">2.4k</span>
            <span className="stat-label">Orders today</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">₹1.2M</span>
            <span className="stat-label">Revenue MTD</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-value">98.2%</span>
            <span className="stat-label">Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Welcome back</h2>
            <p className="form-subtitle">Sign in to your admin account</p>
          </div>

          <div className="field">
            <label className="field-label">Email address</label>
            <div className="field-input-wrap">
              <input
                className="field-input"
                type="email"
                placeholder="admin@store.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <div className="field-input-wrap">
              <input
                className="field-input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: "60px" }}
              />
              <button
                className="toggle-pw"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-box">
              <span>⚠</span>
              {error}
            </div>
          )}

          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                Signing in...
              </>
            ) : (
              "Sign in to dashboard"
            )}
          </button>

          <div className="form-footer">
            <div className="footer-dot" />
            <span className="footer-text">
              Secured · Role-based access control
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
