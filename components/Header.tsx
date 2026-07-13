"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  onCartClick?: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [{ href: "/shop", label: "Shop" }];

  return (
    <header className="w-full bg-header-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1240px] mx-auto">
        {/* Main Header */}
        <div className="flex items-center justify-between py-5">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Logo */}
            <Link href="/">
              <h1 className="text-[12px] sm:text-[12px] lg:text-[16px] font-extrabold text-white font-integral_cf leading-none">
                Santushti Collection
                <span className="block">Trophy Craft</span>
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 ml-8">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-white hover:text-white/70 transition-colors font-[Satoshi]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Icon */}
            <button
              className="lg:hidden hover:scale-110 transition-transform"
              aria-label="Search"
            >
              <Image
                src="/icons/search.svg"
                alt="search"
                width={24}
                height={24}
                className="invert"
              />
            </button>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block w-[500px] xl:w-[580px]">
              <SearchBar />
            </div>

            {/* Cart */}
            <button
              onClick={onCartClick}
              className="hover:scale-110 transition-transform"
              aria-label="Open cart"
            >
              <Image
                src="/icons/cart.svg"
                alt="shopping cart"
                width={24}
                height={24}
                className="invert"
              />
            </button>

            {/* User */}
            <Link
              href="/orders"
              className="hover:scale-110 transition-transform"
            >
              <Image
                src="/icons/me.svg"
                alt="user account"
                width={24}
                height={24}
                className="invert"
              />
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-white/70 transition-colors font-[Satoshi]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Divider */}
        <div className="w-full h-[1px] bg-white/10" />
      </div>
    </header>
  );
};

export default Header;
