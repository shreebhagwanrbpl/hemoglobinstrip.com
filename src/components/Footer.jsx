"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const [contactInfo, setContactInfo] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] =
    useState(null);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const staticRoutes = [
    "about",
    "services",
    "products",
    "contact",
    "items",
  ];

  const district =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "contact"
          )
        );

        if (snap.exists()) {
          setContactInfo(
            snap.data().contactInfo || []
          );
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    loadContact();
  }, []);

  useEffect(() => {
    const loadDistrict = async () => {
      if (!district) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "districts",
            district
          )
        );

        if (snap.exists()) {
          setDistrictData(snap.data());
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadDistrict();
  }, [district]);

  const phone =
    contactInfo.find(
      (x) => x.label === "Phone Number"
    )?.value || "";

  const email =
    contactInfo.find(
      (x) => x.label === "Email Address"
    )?.value || "";

  const address =
    contactInfo.find(
      (x) => x.label === "Office Address"
    )?.value || "";

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };
  if (loading) {
    return (
<footer className="border-t border-[#DDD6C2] bg-gradient-to-b from-white to-[#F2F0EF]">

  <div className="container-custom py-16">

    <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

      {[...Array(4)].map((_, i) => (

        <div key={i}>

          {/* Heading */}

          <div className="mb-7 h-8 w-40 animate-pulse rounded-lg bg-[#DDD6C2]" />

          {/* Links */}

          {[...Array(5)].map((_, j) => (

            <div
              key={j}
              className="mb-4 h-5 animate-pulse rounded bg-[#ECE7DA]"
            />

          ))}

        </div>

      ))}

    </div>

    {/* Bottom */}

    <div className="mt-14 border-t border-[#DDD6C2] pt-8">

      <div className="mx-auto h-5 w-72 animate-pulse rounded bg-[#DDD6C2]" />

    </div>

  </div>

</footer>
    );
  }
  return (
   <footer className="border-t border-[#DDD6C2] bg-gradient-to-b from-white via-[#FDFCF9] to-[#F2F0EF]">

  <div className="container-custom py-20">

    <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

      {/* Company */}

      <div>

        <div className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

          Trusted Since 2016

        </div>

        <h2 className="mt-6 text-3xl font-black tracking-tight">

          <span className="text-[#4B6E48]">
            Central
          </span>

          <span className="text-[#2F3E2E]">
            {" "}Biomedicals
          </span>

        </h2>

        <p className="mt-6 leading-8 text-[#666666]">

          Delivering trusted biomedical, laboratory and diagnostic
          solutions with innovation, precision and dependable
          healthcare support across India.

        </p>

      </div>

      {/* Quick Links */}

      <div>

        <h3 className="mb-6 text-xl font-bold text-[#2F3E2E]">

          Quick Links

        </h3>

        <div className="flex flex-col gap-4">

          {[
            { name: "Home", link: "/" },
            { name: "About", link: "/about" },
            { name: "Services", link: "/services" },
            { name: "Products", link: "/items" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (

            <Link
              key={item.name}
              href={makeLink(item.link)}
              className="flex items-center gap-2 text-[#666666] transition-all duration-300 hover:translate-x-2 hover:text-[#4B6E48]"
            >

              <span className="h-2 w-2 rounded-full bg-[#B2AC88]" />

              {item.name}

            </Link>

          ))}

        </div>

      </div>

      {/* Services */}

      <div>

        <h3 className="mb-6 text-xl font-bold text-[#2F3E2E]">

          Our Services

        </h3>

        <div className="space-y-4">

          {[
            "Diagnostic Equipment",
            "Laboratory Solutions",
            "Biomedical Instruments",
            "Maintenance Support",
          ].map((service) => (

            <p
              key={service}
              className="flex items-center gap-2 text-[#666666] transition-all duration-300 hover:translate-x-2 hover:text-[#4B6E48]"
            >

              <span className="h-2 w-2 rounded-full bg-[#B2AC88]" />

              {service}

            </p>

          ))}

        </div>

      </div>

      {/* Contact */}

      <div>

        <h3 className="mb-6 text-xl font-bold text-[#2F3E2E]">

          Contact Info

        </h3>

        <div className="space-y-6">

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-[#4B6E48]">

              <MapPin size={20} />

            </div>

            <p className="leading-7 text-[#666666]">

              {dynamicAddress}

            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-[#4B6E48]">

              <Phone size={20} />

            </div>

            <p className="text-[#666666]">

              {phone}

            </p>

          </div>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-[#4B6E48]">

              <Mail size={20} />

            </div>

            <p className="break-all text-[#666666]">

              {email}

            </p>

          </div>

        </div>

      </div>

    </div>

    {/* Bottom */}

    <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-[#DDD6C2] pt-8 text-sm md:flex-row">

      <p className="text-[#666666]">

        © 2026 <span className="font-semibold text-[#4B6E48]">Central Biomedicals</span>. All Rights Reserved.

      </p>

      <p className="text-[#666666]">

        Designed with <span className="text-red-500">❤</span> for Modern Healthcare.

      </p>

    </div>

  </div>

</footer>
  );
}