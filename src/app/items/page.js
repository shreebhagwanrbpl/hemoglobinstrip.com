"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ShieldCheck,
  Truck,
  BadgeCheck,
  PackageCheck,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { usePathname } from "next/navigation";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
// import CTASection from "@/components/CTASection";

const makeSlug = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");



export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categorySearch, setCategorySearch] =
    useState("");

  const [productSearch, setProductSearch] =
    useState("");
  const [loading, setLoading] = useState(true);



  const [openedCategory, setOpenedCategory] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("");

  const [pendingScroll, setPendingScroll] =
    useState(null);

  const [loadedImages, setLoadedImages] =
    useState({});

  const [showTopButton, setShowTopButton] =
    useState(false);

  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const district =
    pathParts[0] === "items"
      ? null
      : pathParts[0];

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const categorySnap = await getDocs(
          collection(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "categoryproducts",
            "categories"
          )
        );

        const allProducts = [];

        categorySnap.forEach((categoryDoc) => {

          const data = categoryDoc.data();

          const categoryProducts =
            (data.products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `${categoryDoc.id}-${index}`,
                category:
                  data.category ||
                  categoryDoc.id,
                slug:
                  item.slug ||
                  makeSlug(item.title),
              }));

          allProducts.push(
            ...categoryProducts
          );

        });

        const oldSnap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "products"
          )
        );

        if (oldSnap.exists()) {

          const oldProducts =
            (oldSnap.data().products || [])
              .filter(
                (p) => p.isPublished !== false
              )
              .map((item, index) => ({
                ...item,
                uid: `other-${index}`,
                category:
                  "Other Products",
                slug:
                  item.slug ||
                  makeSlug(item.title),
              }));

          allProducts.push(
            ...oldProducts
          );

        }
        console.log("ALL PRODUCTS", allProducts);
        setProducts(allProducts);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const text = `
      ${item.title}
      ${item.brand}
      ${item.model}
      ${item.category}
      `
        .toLowerCase();

      return text.includes(
        productSearch.toLowerCase()
      );
    });
  }, [products, productSearch]);

  const groupedProducts = useMemo(() => {
    const obj = {};

    filteredProducts.forEach((item) => {
      if (!obj[item.category]) {
        obj[item.category] = [];
      }

      obj[item.category].push(item);
    });

    return obj;
  }, [filteredProducts]);

  const sortedGroupedProducts =
    useMemo(() => {

      const entries =
        Object.entries(
          groupedProducts
        );

      entries.sort(([a], [b]) => {

        if (
          a === "Other Products"
        )
          return 1;

        if (
          b === "Other Products"
        )
          return -1;

        return a.localeCompare(b);

      });

      return Object.fromEntries(
        entries
      );

    }, [groupedProducts]);
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
    setPendingScroll(slug);
  };

  useEffect(() => {
    if (!pendingScroll) return;

    const timer = setTimeout(() => {
      const el =
        document.getElementById(
          pendingScroll
        );

      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      setPendingScroll(null);
    }, 300);

    return () => clearTimeout(timer);
  }, [openedCategory, pendingScroll]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(
        window.scrollY > 500
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[420px] rounded-[32px] bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Our Products"
        subtitle="Explore advanced biomedical and diagnostic equipment designed for modern healthcare excellence."
      />

      {/* Products */}
      <section className="section-padding bg-white">
        <div className="container-custom">

          <SectionTitle
            badge="Our Product Collection"
            title="Advanced Biomedical & Diagnostic Equipment"
            description="Explore our comprehensive range of premium biomedical, laboratory, pathology, and diagnostic equipment engineered for precision, reliability, and exceptional performance. Designed to meet the evolving needs of hospitals, laboratories, clinics, and healthcare professionals across India."
            center
          />

        </div>

        {/* Search */}
        <div className="relative mx-auto mt-6 max-w-2xl px-4 lg:mt-10 lg:px-0">

          <Search
            size={22}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-green-500"
          />

          <input
            type="text"
            placeholder="Search biomedical products..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="h-16 w-full rounded-2xl border border-green-200 bg-white pl-14 pr-5 text-slate-700 shadow-lg shadow-green-100 transition-all duration-300 placeholder:text-slate-400 focus:border-green-500 focus:bg-green-50 focus:outline-none focus:ring-4 focus:ring-green-100"
          />

        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-10 mt-8 lg:mt-16 items-start px-4 lg:px-0">

          {/* Sidebar */}

     <aside
  className="
    self-start
    rounded-[36px]
    border
    border-[#DDD6C2]
    bg-white
    p-5
    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
    lg:sticky
    lg:top-24
    lg:p-6
  "
>

  {/* Heading */}

  <div className="mb-8">

    <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

      Browse

    </span>

    <h3 className="mt-5 text-2xl font-black text-[#2F3E2E]">

      Categories

    </h3>

    <p className="mt-2 text-sm leading-6 text-[#666666]">

      Browse products category wise.

    </p>

  </div>

  {/* Search */}

  <div className="mb-7">

    <input
      type="text"
      placeholder="Search Categories..."
      value={categorySearch}
      onChange={(e) => setCategorySearch(e.target.value)}
  className="
h-14
w-full
rounded-2xl
border
border-[#DDD6C2]
bg-white
px-5
text-[#2F3E2E]
placeholder:text-[#8A8A8A]
shadow-sm
outline-none
transition-all
duration-300
hover:border-[#B2AC88]
hover:shadow-md
focus:border-[#4B6E48]
focus:bg-white
focus:ring-4
focus:ring-[#B2AC88]/20
focus:shadow-lg" />

  </div>

  {/* Category List */}

  <div className="space-y-4">

    {Object.keys(sortedGroupedProducts)
      .filter((category) =>
        category
          .toLowerCase()
          .includes(categorySearch.toLowerCase())
      )
      .map((category) => (

      

      <div
  key={category}
  className="overflow-hidden rounded-[28px] border border-[#DDD6C2] bg-[#FCFBF8] shadow-sm transition-all duration-300 hover:border-[#B2AC88] hover:shadow-md"
>

  {/* Category Button */}

  <button
    onClick={() => toggleCategory(category)}
    className={`flex w-full items-center justify-between px-6 py-5 transition-all duration-300

    ${
      activeCategory === category
        ? "bg-[#4B6E48] text-white"
        : "bg-white text-[#2F3E2E] hover:bg-[#F6F3EC]"
    }`}
  >

    <span className="flex items-center gap-4">

      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300

        ${
          activeCategory === category
            ? "bg-white/20"
            : "bg-[#B2AC88]/20 text-[#4B6E48]"
        }`}
      >
        {openedCategory === category ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </div>

      <span className="font-semibold">
        {category}
      </span>

    </span>

    <span
      className={`rounded-full px-3 py-1 text-xs font-bold transition-all

      ${
        activeCategory === category
          ? "bg-white/20 text-white"
          : "bg-[#B2AC88]/20 text-[#4B6E48]"
      }`}
    >
      {groupedProducts[category].length}
    </span>

  </button>

  {/* Products */}

  <div
    className={`custom-scrollbar overflow-y-auto bg-white transition-all duration-500

    ${
      openedCategory === category
        ? "max-h-72"
        : "max-h-0 overflow-hidden"
    }`}
  >

    {groupedProducts[category].map((item) => (

      <button
        key={item.uid}
        onClick={() => scrollToProduct(item.slug, category)}
        className="flex w-full items-center justify-between border-t border-[#EEE7D8] px-6 py-3 text-left text-sm text-[#666666] transition-all duration-300 hover:bg-[#F2F0EF] hover:pl-8 hover:text-[#4B6E48]"
      >

        <span>{item.title}</span>

        <ChevronRight
          size={15}
          className="opacity-0 transition-all duration-300 group-hover:opacity-100"
        />

      </button>

    ))}

  </div>

</div>

      ))}

  </div>

</aside>





          {/* ==========================
                RIGHT SIDE START
            ========================== */}

          <div className="space-y-16">
            {filteredProducts.length === 0 ? (

          <div className="rounded-[36px] border border-[#DDD6C2] bg-white p-10 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:p-16">

  {/* Icon */}

  <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#B2AC88]/20 text-5xl text-[#4B6E48] shadow-lg shadow-[#B2AC88]/20">

    🔍

  </div>

  {/* Title */}

  <h2 className="text-3xl font-black text-[#2F3E2E] lg:text-4xl">

    Product Not Found

  </h2>

  {/* Description */}

  <p className="mx-auto mt-6 max-w-2xl leading-8 text-[#666666]">

    We couldn't find any biomedical products matching

    <span className="mx-1 rounded-full bg-[#B2AC88]/20 px-2 py-1 font-semibold text-[#4B6E48]">

      "{productSearch}"

    </span>

    Please try another keyword, browse a different category, or clear the search to explore all available products.

  </p>

  {/* Button */}

  <button
    onClick={() => setProductSearch("")}
    className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-[#4B6E48] px-8 py-4 font-semibold text-white shadow-xl shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-[#4B6E48]/30"
  >

    View All Products

  </button>

</div>

            ) : (

              Object.entries(groupedProducts).map(
                ([category, list]) => (

                  <section
                    key={category}
                    id={category
                      .replace(/\s+/g, "-")
                      .toLowerCase()}
                  >

                    {/* Category Header */}

                <div className="mb-10 flex flex-col gap-6 border-b border-[#DDD6C2] pb-6 sm:flex-row sm:items-center sm:justify-between">

  {/* Left */}

  <div>

    <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

      Product Category

    </span>

    <h2 className="mt-5 text-3xl font-black tracking-tight text-[#2F3E2E] lg:text-4xl">

      {category}

    </h2>

  </div>

  {/* Right */}

  <div className="inline-flex items-center rounded-full border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-3 font-semibold text-[#4B6E48] shadow-sm transition-all duration-300 hover:border-[#B2AC88] hover:bg-white hover:shadow-md">

    <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#B2AC88]/20 text-sm font-bold text-[#4B6E48]">

      {list.length}

    </span>

    Products

  </div>

</div>

                    {/* Product List */}

                    <div className="space-y-8">

                      {list.map((product) => (
<div
  key={product.uid}
  id={product.slug}
  className="group rounded-[36px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 hover:border-[#4B6E48] hover:shadow-[0_25px_70px_rgba(75,110,72,0.18)]"
>

  <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[240px_1fr_190px] lg:gap-8">

    {/* Image */}

    <div className="relative flex h-[220px] items-center justify-center overflow-hidden rounded-[28px] border border-[#DDD6C2] bg-gradient-to-br from-[#F2F0EF] via-white to-[#B2AC88]/10">

      {!loadedImages[product.uid] && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#ECE7DA] via-[#F8F6F2] to-white" />
      )}

      <img
        src={product.images?.[0] || product.image || "/placeholder.jpg"}
        alt={product.title}
        loading="lazy"
        onLoad={() =>
          setLoadedImages((prev) => ({
            ...prev,
            [product.uid]: true,
          }))
        }
        onError={(e) => {
          e.currentTarget.src = "/placeholder.jpg";
        }}
        className={`relative z-10 max-h-[180px] max-w-[85%] object-contain p-4 transition-all duration-500 group-hover:scale-110 ${
          loadedImages[product.uid] ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Premium Badge */}

      <div className="absolute right-4 top-4 rounded-full border border-[#B2AC88]/40 bg-[#4B6E48] px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow-lg">

        Premium

      </div>

    </div>

    {/* Content */}

    <div>

      <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#4B6E48]">

        Biomedical Equipment

      </span>

      <h3 className="mt-4 text-2xl lg:text-3xl font-black leading-tight text-[#2F3E2E] transition-colors duration-300 group-hover:text-[#4B6E48]">

        {product.title}

      </h3>

      <p className="mt-5 leading-8 text-[#666666]">

        {product.description ||
          product.desc ||
          "Premium biomedical equipment designed for hospitals, laboratories, diagnostic centres and healthcare professionals."}

      </p>

      {/* Product Information */}

      <div className="mt-8 grid gap-4 md:grid-cols-2">

        {[
          { label: "Brand", value: product.brand || "N/A" },
          { label: "Model", value: product.model || "N/A" },
          { label: "Instrument", value: product.instrument || "N/A" },
          { label: "Category", value: product.category || "N/A" },
        ].map((info) => (

          <div
            key={info.label}
            className="rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] p-5 transition-all duration-300 hover:border-[#B2AC88] hover:bg-white hover:shadow-md"
          >

            <p className="text-xs font-semibold uppercase tracking-widest text-[#4B6E48]">

              {info.label}

            </p>

            <p className="mt-2 text-lg font-bold text-[#2F3E2E]">

              {info.value}

            </p>

          </div>

        ))}

      </div>

    </div>

    {/* Button */}

    <div className="flex justify-center lg:justify-end">

      <Link
        href={
          district
            ? `/${district}/items/${product.slug}`
            : `/items/${product.slug}`
        }
        className="w-full lg:w-auto"
      >

        <button className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4B6E48] px-8 py-4 font-semibold text-white shadow-xl shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-[#4B6E48]/30 lg:w-auto">

          Get Quote

          <svg
            className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
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

  </div>

</div>

                      ))}

                    </div>

                  </section>

                ))
            )}

          </div>

        </div>

      </section>

      {/* Why Choose Products */}
      <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom">

    <SectionTitle
      badge="Why Choose Our Products"
      title="Trusted Quality & Innovation"
      description="We deliver premium biomedical and diagnostic equipment engineered for precision, reliability, and exceptional healthcare performance."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

      {[
        {
          icon: <ShieldCheck size={30} />,
          title: "Certified Quality",
          desc: "Manufactured and tested under strict international quality standards.",
        },
        {
          icon: <Truck size={30} />,
          title: "Fast Delivery",
          desc: "Safe and timely delivery with reliable logistics across India.",
        },
        {
          icon: <BadgeCheck size={30} />,
          title: "Trusted Support",
          desc: "Dedicated technical guidance and responsive after-sales service.",
        },
        {
          icon: <PackageCheck size={30} />,
          title: "Premium Equipment",
          desc: "Advanced biomedical solutions for hospitals and laboratories.",
        },
      ].map((item, index) => (

        <div
          key={index}
          className="group overflow-hidden rounded-[36px] border border-[#DDD6C2] bg-white p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48] hover:shadow-[0_25px_70px_rgba(75,110,72,0.18)]"
        >

          {/* Icon */}

          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[24px] bg-[#B2AC88]/20 text-[#4B6E48] transition-all duration-300 group-hover:scale-110 group-hover:bg-white">

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

      {/* Back To Top */}

  {showTopButton && (

  <button
    onClick={scrollToTop}
    aria-label="Scroll to top"
    className="
      group
      fixed
      bottom-8
      right-8
      z-50
      flex
      h-16
      w-16
      items-center
      justify-center
      rounded-full
      border
      border-[#DDD6C2]
      bg-[#4B6E48]
      text-white
      shadow-[0_15px_45px_rgba(75,110,72,0.30)]
      backdrop-blur-md
      transition-all
      duration-300
      hover:-translate-y-2
      hover:scale-110
      hover:bg-[#3F5D3C]
      hover:shadow-[0_20px_60px_rgba(75,110,72,0.45)]
      active:scale-95
    "
  >

    {/* Outer Ring */}

    <span className="absolute inset-0 rounded-full border border-[#B2AC88]/40 transition-all duration-300 group-hover:scale-110"></span>

    <ChevronUp
      size={26}
      className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
    />

  </button>

)}

    </>

  );

}