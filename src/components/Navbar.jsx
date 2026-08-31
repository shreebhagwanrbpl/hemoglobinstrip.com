"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Products", path: "/items" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#DDD6C2] bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

      <div className="container-custom flex h-20 items-center justify-between">

        {/* Logo */}

        <Link href={makeLink("/")}>
          <Image
            src="/logo.png"
            alt="Raj Biosis"
            width={90}
            height={35}
            priority
            className="h-auto w-[70px] md:w-[90px] object-contain"
          />
        </Link>


        {/* Desktop Menu */}

        <nav className="hidden items-center gap-10 lg:flex">

          {navLinks.map((link) => (

            <Link
              key={link.name}
              href={makeLink(link.path)}
              className="group relative font-semibold text-[#666666] transition-all duration-300 hover:text-[#4B6E48]"
            >

              {link.name}

              <span className="absolute -bottom-2 left-0 h-[2px] w-0 rounded-full bg-[#B2AC88] transition-all duration-300 group-hover:w-full" />

            </Link>

          ))}

        </nav>

        {/* Desktop Button */}

        <div className="hidden lg:block">

          <Link href={makeLink("/contact")}>

            <button className="group flex items-center gap-2 rounded-2xl bg-[#4B6E48] px-7 py-3 font-semibold text-white shadow-[0_12px_35px_rgba(75,110,72,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-[0_18px_45px_rgba(75,110,72,0.35)]">

              Get Quote

              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>

            </button>

          </Link>

        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] p-3 transition-all duration-300 hover:border-[#B2AC88] hover:bg-white lg:hidden"
        >

          {menuOpen ? (

            <X
              size={24}
              className="text-[#4B6E48]"
            />

          ) : (

            <Menu
              size={24}
              className="text-[#4B6E48]"
            />

          )}

        </button>

      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${menuOpen ? "max-h-[500px]" : "max-h-0"
          }`}
      >

        <div className="border-t border-[#DDD6C2] bg-white px-6 py-6">

          <nav className="flex flex-col gap-5">

            {navLinks.map((link) => (

              <Link
                key={link.name}
                href={makeLink(link.path)}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-2 font-medium text-[#666666] transition-all duration-300 hover:bg-[#F8F6F2] hover:text-[#4B6E48]"
              >

                {link.name}

              </Link>

            ))}

            <Link
              href={makeLink("/contact")}
              onClick={() => setMenuOpen(false)}
            >

              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4B6E48] py-3 font-semibold text-white shadow-[0_12px_35px_rgba(75,110,72,0.25)] transition-all duration-300 hover:bg-[#3F5D3C]">

                Get Quote

                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>

              </button>

            </Link>

          </nav>

        </div>

      </div>

    </header>
  );
}