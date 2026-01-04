'use client';
import Link from'next/link';
 import Image from'next/image';

const Footer = () => {
  return (
    <footer className="w-full bg-footer-background mt-[170px] py-[80px] bg-[#f2f0f1]">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="flex flex-col">
          
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full gap-8 lg:gap-0">
            
            {/* Brand Section */}
            <div className="flex flex-col gap-[34px] w-full lg:w-[20%]">
              <div className="flex flex-col gap-[12px]">
                <h2 className="text-[28px] md:text-[33px] font-bold leading-[35px] md:leading-[41px] text-text-primary font-[IntegralCF]">
                  SHOP.CO
                </h2>
                <p className="text-sm font-normal leading-[22px] text-text-muted font-[Satoshi] w-full">
                  We have clothes that suits your style and which you are proud to wear. From women to men.
                </p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-[12px]">
                <Link href="/social/twitter" className="w-[28px] h-[28px] hover:scale-110 transition-transform">
                  <Image 
                    src="/icons/twitter.svg" 
                    alt="Twitter" 
                    width={28} 
                    height={28}
                    className="w-full h-full"
                  />
                </Link>
                <Link href="/social/facebook" className="w-[28px] h-[28px] hover:scale-110 transition-transform">
                  <Image 
                    src="/icons/fb.svg" 
                    alt="Facebook" 
                    width={28} 
                    height={28}
                    className="w-full h-full"
                  />
                </Link>
                <Link href="/social/instagram" className="w-[28px] h-[28px] hover:scale-110 transition-transform">
                  <Image 
                    src="/icons/instagram.svg" 
                    alt="Instagram" 
                    width={28} 
                    height={28}
                    className="w-full h-full"
                  />
                </Link>
              </div>
            </div>

            {/* Links Section */}
            <div className="flex flex-col sm:flex-row justify-between lg:justify-end items-start lg:items-center w-full lg:w-[70%] gap-8 sm:gap-4">
              
              {/* Company Links */}
              <div className="flex flex-col gap-[22px] w-full sm:w-[24%]">
                <h3 className="text-base font-medium leading-[22px] tracking-[3px] text-text-primary uppercase font-[Satoshi]">
                  Company
                </h3>
                <ul className="flex flex-col gap-[12px]">
                  <li>
                    <Link href="/about" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/features" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/works" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/career" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Career
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Help Links */}
              <div className="flex flex-col gap-[22px] w-full sm:w-[28%]">
                <h3 className="text-base font-medium leading-[22px] tracking-[3px] text-text-primary uppercase font-[Satoshi]">
                  Help
                </h3>
                <ul className="flex flex-col gap-[12px]">
                  <li>
                    <Link href="/support" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Poppins]">
                      Customer Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/delivery" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Poppins]">
                      Delivery Details
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Poppins]">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Poppins]">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* FAQ Links */}
              <div className="flex flex-col gap-[22px] w-full sm:w-[30%]">
                <h3 className="text-base font-medium leading-[22px] tracking-[3px] text-text-primary uppercase font-[Satoshi]">
                  FAQ
                </h3>
                <ul className="flex flex-col gap-[12px]">
                  <li>
                    <Link href="/account" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link href="/deliveries" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Manage Deliveries
                    </Link>
                  </li>
                  <li>
                    <Link href="/orders" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link href="/payments" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Payments
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources Links */}
              <div className="flex flex-col gap-[22px] w-full sm:w-auto">
                <h3 className="text-base font-medium leading-[22px] tracking-[3px] text-text-primary uppercase font-[Satoshi]">
                  Resources
                </h3>
                <ul className="flex flex-col gap-[12px]">
                  <li>
                    <Link href="/ebooks" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Free eBooks
                    </Link>
                  </li>
                  <li>
                    <Link href="/tutorial" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Development Tutorial
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      How to - Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/youtube" className="text-base font-normal leading-[19px] text-text-muted hover:text-text-primary transition-colors font-[Satoshi]">
                      Youtube Playlist
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-full h-[1px] bg-border-primary mt-[50px]"></div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4 mt-[18px]">
            
            {/* Copyright */}
            <p className="text-sm font-normal leading-[19px] text-text-muted font-[Satoshi] text-center sm:text-right">
              Shop.co © 2000-2023, All Rights Reserved
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-[12px]">
              <div className="flex justify-center items-center bg-secondary-background border-0 border-border-secondary rounded-[5px] shadow-[0px_1px_4px_#b7b7b714] px-[6px] py-[8px]">
                <Image 
                  src="/icons/visa.svg" 
                  alt="Visa" 
                  width={32} 
                  height={10}
                  className="w-[32px] h-[10px]"
                />
              </div>
              <div className="flex justify-center items-center bg-secondary-background border-0 border-border-secondary rounded-[5px] shadow-[0px_1px_4px_#b7b7b714] px-[6px] py-[6px]">
                <Image 
                  src="/icons/Mastercard.svg" 
                  alt="Mastercard" 
                  width={24} 
                  height={14}
                  className="w-[24px] h-[14px]"
                />
              </div>
              <div className="flex justify-center items-center bg-secondary-background border-0 border-border-secondary rounded-[5px] shadow-[0px_1px_4px_#b7b7b714] px-[6px] py-[10px]">
                <Image 
                  src="/icons/Paypal.svg" 
                  alt="PayPal" 
                  width={34} 
                  height={8}
                  className="w-[34px] h-[8px]"
                />
              </div>
              <div className="flex justify-center items-center bg-secondary-background border-0 border-border-secondary rounded-[5px] shadow-[0px_1px_4px_#b7b7b714] px-[8px] py-[8px]">
                <Image 
                  src="/icons/Gpay.svg" 
                  alt="Apple Pay" 
                  width={26} 
                  height={10}
                  className="w-[26px] h-[10px]"
                />
              </div>
              <div className="flex justify-center items-center bg-secondary-background border-0 border-border-secondary rounded-[5px] shadow-[0px_1px_4px_#b7b7b714] px-[8px] py-[8px]">
                <Image 
                  src="/icons/Applepay.svg" 
                  alt="Google Pay" 
                  width={28} 
                  height={10}
                  className="w-[28px] h-[10px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer