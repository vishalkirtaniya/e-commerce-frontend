"use client";
import { useState } from "react";
import SearchView from "./ui/SearchView";
import SearchBar from "./SearchBar";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-header-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1240px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-[20px] md:gap-[40px]  py-5">
          {/* Mobile hamburger menu */}
          <button
            className="lg:hidden self-start p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
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

          {/* Brand and Navigation */}
          <div className="flex flex-col lg:flex-row items-center gap-[14px] md:gap-[28px] w-full lg:w-auto">
            {/* Brand Logo */}
            <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold leading-[30px] sm:leading-[35px] lg:leading-[39px] text-left text-header-text font-interal_cf">
              SHOP.CO
            </h1>

            {/* Navigation Menu */}
            <nav
              className={`${menuOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row items-center gap-[12px] lg:gap-[20px] w-full lg:w-auto`}
            >
              {/* Menu Items */}
              <Link
                href="/shop"
                className="text-base font-normal leading-[22px] text-header-text hover:text-primary-background transition-colors font-[Satoshi]"
                role="menuitem"
              >
                Shop
              </Link>
              <Link
                href="/sale"
                className="text-base font-normal leading-[22px] text-header-text hover:text-primary-background transition-colors font-[Satoshi]"
                role="menuitem"
              >
                On Sale
              </Link>

              <Link
                href="/new-arrivals"
                className="text-base font-normal leading-[22px] text-header-text hover:text-primary-background transition-colors font-[Satoshi]"
                role="menuitem"
              >
                New Arrivals
              </Link>

              <Link
                href="/brands"
                className="text-base font-normal leading-[22px] text-header-text hover:text-primary-background transition-colors font-[Satoshi]"
                role="menuitem"
              >
                Brands
              </Link>
            </nav>
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col lg:flex-row items-center gap-[12px] lg:gap-[14px] w-full lg:flex-1">
            {/* Search View */}
            <div className="w-full lg:flex-1">
              <SearchBar />
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-[14px]">
              <Link
                href="/cart"
                className="w-[24px] h-[24px] hover:scale-110 transition-transform"
              >
                <Image
                  src="/icons/cart.svg"
                  alt="shopping cart"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </Link>

              <Link
                href="/orders"
                className="w-[24px] h-[24px] hover:scale-110 transition-transform"
              >
                <Image
                  src="/icons/me.svg"
                  alt="user account"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full h-[2px] bg-[#000000] opacity-10"></div>
      </div>
    </header>
  );
};

export default Header;
