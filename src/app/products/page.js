"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import CTASection from "@/components/CTASection";

export default function ProductsPage() {

  const products = [

    {
      category: "Electrolyte Reagents",
      title: "Roche 9180 Electrolyte Reagent",
      image: "/images/product-1.jpg",
      description:
        "High precision electrolyte reagent for Roche analyzers.",
      brand: "Roche",
      model: "9180",
      slug: "roche-9180-electrolyte-reagent",
    },

    {
      category: "Electrolyte Reagents",
      title: "ERBA EC 90 Reagent",
      image: "/images/product-2.jpg",
      description:
        "Premium quality electrolyte reagent.",
      brand: "ERBA",
      model: "EC90",
      slug: "erba-ec90",
    },

    {
      category: "Rapid Test Kits",
      title: "COVID Rapid Test Kit",
      image: "/images/product-3.jpg",
      description:
        "Fast and reliable rapid testing solution.",
      brand: "Bio",
      model: "RT-100",
      slug: "covid-kit",
    },

    {
      category: "Rapid Test Kits",
      title: "Dengue Rapid Kit",
      image: "/images/product-4.jpg",
      description:
        "High sensitivity dengue rapid test.",
      brand: "Bio",
      model: "DG200",
      slug: "dengue-kit",
    },

    {
      category: "Hematology",
      title: "Hematology Reagent",
      image: "/images/product-5.jpg",
      description:
        "Premium hematology solution.",
      brand: "Mindray",
      model: "BC5300",
      slug: "hematology",
    },

  ];

  const [search, setSearch] =
    useState("");

  const [openedCategory, setOpenedCategory] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const filteredProducts =
    useMemo(() => {

      return products.filter((item) => {

        const text = `
        ${item.title}
        ${item.brand}
        ${item.category}
        `.toLowerCase();

        return text.includes(
          search.toLowerCase()
        );

      });

    }, [search]);

  const groupedProducts =
    useMemo(() => {

      const obj = {};

      filteredProducts.forEach((item) => {

        if (!obj[item.category]) {

          obj[item.category] = [];

        }

        obj[item.category].push(item);

      });

      return obj;

    }, [filteredProducts]);

  const categories =
    Object.keys(groupedProducts);

  const toggleCategory = (category) => {

    if (openedCategory === category) {

      setOpenedCategory("");

      return;

    }

    setOpenedCategory(category);

  };

  const scrollToProduct = (
    slug,
    category
  ) => {

    setOpenedCategory(category);

    setActiveCategory(category);

    setTimeout(() => {

      const el =
        document.getElementById(slug);

      if (el) {

        el.scrollIntoView({

          behavior: "smooth",

          block: "start",

        });

      }

    }, 250);

  };

  return (
    <>
      <PageBanner
        title="Our Products"
        subtitle="Explore advanced biomedical and diagnostic equipment designed for modern healthcare excellence."
      />

      <section className="py-24 bg-slate-50">

        <div className="max-w-7xl mx-auto px-5">

          <SectionTitle
            badge="Featured Products"
            title="Premium Biomedical Equipment"
            description="Explore our comprehensive range of high-quality biomedical and diagnostic equipment designed to deliver precision, reliability, and advanced healthcare solutions for hospitals, laboratories, clinics, and research centers across India."
            center
          />
          <div className="grid lg:grid-cols-[320px_1fr] gap-10 mt-16">

            {/* ======================
                LEFT SIDEBAR
          ====================== */}

            <aside className="sticky top-28 h-fit rounded-[30px] border border-green-100 bg-white p-6 shadow-xl shadow-green-100">

              {/* Heading */}

              <div className="mb-6">

                <span className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">

                  Browse

                </span>

                <h2 className="mt-4 text-2xl font-bold text-slate-900">

                  Categories

                </h2>

              </div>

              {/* Search */}

              <input
                type="text"
                placeholder="Search Products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-xl border border-green-200 bg-green-50 px-4 text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
              />

              {/* Categories */}

              <div className="mt-6 space-y-3">

                {categories.map((category) => (

                  <div
                    key={category}
                    className="overflow-hidden rounded-2xl border border-green-100"
                  >

                    <button
                      onClick={() => toggleCategory(category)}
                      className={`flex w-full items-center justify-between px-5 py-4 font-medium transition-all duration-300

          ${activeCategory === category
                          ? "bg-green-600 text-white shadow-lg shadow-green-200"
                          : "bg-white text-slate-700 hover:bg-green-50"
                        }`}
                    >

                      <span className="flex items-center gap-3">

                        {openedCategory === category ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}

                        {category}

                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${activeCategory === category
                          ? "bg-white/20 text-white"
                          : "bg-green-100 text-green-700"
                          }`}
                      >

                        {groupedProducts[category].length}

                      </span>

                    </button>

                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight:
                          openedCategory === category
                            ? groupedProducts[category].length * 48 + "px"
                            : "0px",
                      }}
                    >

                      {groupedProducts[category].map((item) => (

                        <button
                          key={item.slug}
                          onClick={() =>
                            scrollToProduct(item.slug, category)
                          }
                          className="block w-full border-t border-green-100 px-6 py-3 text-left text-sm text-slate-600 transition hover:bg-green-50 hover:text-green-700"
                        >

                          {item.title}

                        </button>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </aside>

            {/* ======================
                RIGHT SIDE
          ====================== */}

            <div>

             <div className="space-y-20">

  {Object.entries(groupedProducts).map(([category, list]) => (

    <section
      key={category}
      id={category.replace(/\s+/g, "-").toLowerCase()}
    >

      {/* Category Header */}

      <div className="mb-12 flex flex-col gap-6 border-b border-[#DDD6C2] pb-6 md:flex-row md:items-center md:justify-between">

        <div>

          <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

            Category

          </span>

          <h2 className="mt-5 text-4xl font-black text-[#2F3E2E]">

            {category}

          </h2>

        </div>

        <div className="inline-flex rounded-full border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-3 font-semibold text-[#4B6E48]">

          {list.length} Products

        </div>

      </div>

      {/* Products */}

      <div className="space-y-8">

        {list.map((product) => (

          <div
            key={product.slug}
            id={product.slug}
            className="group rounded-[36px] border border-[#DDD6C2] bg-white p-7 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-[#4B6E48] hover:shadow-[0_25px_70px_rgba(75,110,72,0.18)]"
          >

            <div className="grid items-center gap-8 lg:grid-cols-[260px_1fr_200px]">

              {/* Image */}

              <div className="flex h-[230px] items-center justify-center overflow-hidden rounded-[28px] border border-[#DDD6C2] bg-gradient-to-br from-[#F2F0EF] via-white to-[#B2AC88]/10 p-6">

                <Image
                  src={product.image}
                  alt={product.title}
                  width={220}
                  height={220}
                  className="max-h-[190px] object-contain transition-all duration-500 group-hover:scale-110"
                />

              </div>

              {/* Content */}

              <div>

                <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#4B6E48]">

                  Biomedical Equipment

                </span>

                <h3 className="mt-4 text-3xl font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-[#4B6E48]">

                  {product.title}

                </h3>

                <p className="mt-5 leading-8 text-[#666666]">

                  {product.description}

                </p>

                {/* Specs */}

                <div className="mt-7 grid grid-cols-2 gap-5">

                  <div className="rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] p-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-[#4B6E48]">

                      Brand

                    </p>

                    <p className="mt-2 text-lg font-bold text-[#2F3E2E]">

                      {product.brand}

                    </p>

                  </div>

                  <div className="rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] p-5">

                    <p className="text-xs font-semibold uppercase tracking-wider text-[#4B6E48]">

                      Model

                    </p>

                    <p className="mt-2 text-lg font-bold text-[#2F3E2E]">

                      {product.model}

                    </p>

                  </div>

                </div>

              </div>

              {/* Button */}

              <div className="flex items-center justify-center lg:justify-end">

                <Link
                  href={`/products/${product.slug}`}
                  className="w-full lg:w-auto"
                >

                  <button className="w-full rounded-2xl bg-[#4B6E48] px-8 py-4 font-semibold text-white shadow-xl shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-[#4B6E48]/30 lg:w-auto">

                    View Details →

                  </button>

                </Link>

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  ))}

</div>

            </div>

          </div>

        </div>

      </section>

      {/* ===========================
            WHY CHOOSE US
      =========================== */}

    <section className="py-24 bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="max-w-7xl mx-auto px-5">

    <SectionTitle
      badge="Why Choose Our Products"
      title="Trusted Quality & Innovation"
      description="Every biomedical product is engineered with precision, tested for quality, and backed by reliable support to ensure exceptional performance in hospitals and laboratories."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      {[
        {
          icon: <ShieldCheck size={32} />,
          title: "Certified Quality",
          desc: "Every product undergoes strict quality testing to ensure safety, durability and reliable performance.",
        },

        {
          icon: <Truck size={32} />,
          title: "Fast Delivery",
          desc: "Quick and secure delivery across India with safe packaging and timely logistics support.",
        },

        {
          icon: <BadgeCheck size={32} />,
          title: "Trusted Support",
          desc: "Dedicated technical assistance and after-sales service whenever you need expert guidance.",
        },

        {
          icon: <PackageCheck size={32} />,
          title: "Premium Equipment",
          desc: "Advanced biomedical equipment designed for modern laboratories, hospitals and healthcare professionals.",
        },

      ].map((item, index) => (

        <div
          key={index}
          className="group rounded-[36px] border border-[#DDD6C2] bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48] hover:shadow-[0_25px_70px_rgba(75,110,72,0.18)]"
        >

          {/* Icon */}

          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#B2AC88]/20 text-[#4B6E48] transition-all duration-300 group-hover:bg-white group-hover:text-[#4B6E48]">

            {item.icon}

          </div>

          {/* Title */}

          <h3 className="text-2xl font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

            {item.title}

          </h3>

          {/* Description */}

          <p className="mt-5 leading-7 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

            {item.desc}

          </p>

          {/* Bottom Accent */}

          <div className="mx-auto mt-8 h-1.5 w-16 rounded-full bg-[#B2AC88] transition-all duration-300 group-hover:w-28 group-hover:bg-white"></div>

        </div>

      ))}

    </div>

  </div>

</section>

      {/* CTA */}

      {/* <CTASection /> */}

    </>

  );

}