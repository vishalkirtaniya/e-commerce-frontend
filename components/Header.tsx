'use client';
import { useState } from 'react';
 import SearchView from'./ui/SearchView';
 import Link from'next/link';
 import Image from'next/image';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

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
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Brand and Navigation */}
          <div className="flex flex-col lg:flex-row items-center gap-[14px] md:gap-[28px] w-full lg:w-auto">
            
            {/* Brand Logo */}
            <h1 className="text-[24px] sm:text-[28px] lg:text-[32px] font-extrabold leading-[30px] sm:leading-[35px] lg:leading-[39px] text-left text-header-text font-interal_cf">
              SHOP.CO
            </h1>

            {/* Navigation Menu */}
            <nav className={`${menuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-center gap-[12px] lg:gap-[20px] w-full lg:w-auto`}>
              
              {/* Shop Dropdown */}
              <div className="relative group font-sans">
                <button
                  className="flex items-center gap-[4px] text-base font-normal leading-[22px] text-header-text hover:text-primary-background transition-colors font-[Satoshi] gap-1"
                  role="menuitem"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Shop
                  <Image 
                    src="/icons/down_arrow.svg" 
                    alt="dropdown arrow" 
                    width={10} 
                    height={10}
                    className=""
                  />
                </button>
                
                {/* Submenu */}
                <ul 
                  role="menu" 
                  className="absolute top-full left-0 mt-1 bg-secondary-background border border-border-secondary rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[150px] z-50"
                >
                  <li role="menuitem">
                    <Link href="/shop/men" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary-light transition-colors">
                      Men
                    </Link>
                  </li>
                  <li role="menuitem">
                    <Link href="/shop/women" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary-light transition-colors">
                      Women
                    </Link>
                  </li>
                  <li role="menuitem">
                    <Link href="/shop/accessories" className="block px-4 py-2 text-sm text-text-primary hover:bg-secondary-light transition-colors">
                      Accessories
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Other Menu Items */}
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
              <SearchView
                placeholder="Search for products..."
                text_font_size="text-base"
                text_font_family="Satoshi"
                text_font_weight="font-normal"
                text_line_height="leading-normal"
                text_color="text-search-text"
                fill_background_color="bg-[#f2f0f1]"
                border_border_radius="rounded-lg"
                className='rounded-full'
                leftIcon={
                  <Image 
                    src="/icons/magnifing_glass.svg" 
                    alt="search icon" 
                    width={24} 
                    height={20}
                    className="w-[24px] h-[20px]"
                  />
                }
              />
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
                href="/account"
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
      </div>
    </header>
  )
}

export default Header