"use client";

import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full bg-[#f2f0f1] mt-16 lg:mt-[170px] py-10 lg:py-[80px]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-0">
            {/* Brand Section */}
            <div className="w-full lg:w-[22%]">
              <div className="flex flex-col gap-4">
                <h1 className="text-[12px] sm:text-[12px] lg:text-[16px] font-extrabold text-white font-integral_cf leading-none">
                  Santushti Collection
                  <span className="block">Trophy Craft</span>
                </h1>

                <p className="text-[14px] leading-[22px] text-[#666666] font-satoshi max-w-[248px]">
                  We have clothes that suits your style and which you're proud
                  to wear. From women to men.
                </p>

                {/* Social Icons */}
                <div className="flex items-center gap-3">
                  <Link
                    href="/social/twitter"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/icons/twitter.svg"
                      alt="Twitter"
                      width={28}
                      height={28}
                    />
                  </Link>

                  <Link
                    href="/social/facebook"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/icons/fb.svg"
                      alt="Facebook"
                      width={28}
                      height={28}
                    />
                  </Link>

                  <Link
                    href="/social/instagram"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/icons/instagram.svg"
                      alt="Instagram"
                      width={28}
                      height={28}
                    />
                  </Link>

                  <Link
                    href="/social/github"
                    className="hover:scale-110 transition-transform"
                  >
                    <Image
                      src="/icons/github.svg"
                      alt="Github"
                      width={28}
                      height={28}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            <div
              className="
                grid
                grid-cols-2
                gap-x-8
                gap-y-8
                w-full

                lg:flex
                lg:justify-end
                lg:gap-12
                lg:w-[70%]
              "
            >
              {/* Company */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm tracking-[3px] uppercase font-medium">
                  Company
                </h3>

                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/about"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      About
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/features"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Features
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/works"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Works
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/career"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Career
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Help */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm tracking-[3px] uppercase font-medium">
                  Help
                </h3>

                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/support"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Customer Support
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/delivery"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Delivery Details
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/terms"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Terms & Conditions
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/privacy"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* FAQ */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm tracking-[3px] uppercase font-medium">
                  FAQ
                </h3>

                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/account"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Account
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/deliveries"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Manage Deliveries
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/orders"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Orders
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/payments"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Payment
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm tracking-[3px] uppercase font-medium">
                  Resources
                </h3>

                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/ebooks"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Free eBook
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/tutorial"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Development Tutorial
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/blog"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      How to - Blog
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/youtube"
                      className="text-[#666666] hover:text-black transition-colors"
                    >
                      Youtube Playlist
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#d9d9d9] mt-10 lg:mt-12" />

          {/* Bottom Section */}
          <div
            className="
              flex
              flex-col
              items-center
              gap-4
              mt-5

              lg:flex-row
              lg:justify-between
            "
          >
            <p className="text-sm text-[#666666] text-center">
               Santushti Collection © 2000-2023, All Rights Reserved
            </p>

            <div className="flex flex-wrap justify-center gap-2">
              <Image src="/icons/visa.svg" alt="Visa" width={46} height={30} />

              <Image
                src="/icons/Mastercard.svg"
                alt="Mastercard"
                width={46}
                height={30}
              />

              <Image
                src="/icons/Paypal.svg"
                alt="PayPal"
                width={46}
                height={30}
              />

              <Image
                src="/icons/Applepay.svg"
                alt="Apple Pay"
                width={46}
                height={30}
              />

              <Image
                src="/icons/Gpay.svg"
                alt="Google Pay"
                width={46}
                height={30}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
