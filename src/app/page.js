"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { db, doc, collection, getDoc, getDocs, addDoc, onSnapshot } from "@/lib/firestore-shim";
import { fetchFullCatalog } from "@/lib/data-fetcher";

import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";

import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  Wrench,
  Activity,
  Truck,
  Headphones,
} from "lucide-react";

/* ==========================================================
   HOME PRODUCT CARD
========================================================== */

function HomeProductCard({
  product,
  district = null,
}) {
  if (!product) return null;

  const slug =
    product.slug ||
    product.productSlug ||
    product.title
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  const productLink = district
    ? `/${district}/items/${slug}`
    : `/items/${slug}`;

  let imageUrl = "/placeholder.png";

  if (
    Array.isArray(product.images) &&
    product.images.length > 0
  ) {
    const firstImage = product.images[0];

    if (typeof firstImage === "string") {
      imageUrl = firstImage;
    } else if (firstImage?.url) {
      imageUrl = firstImage.url;
    } else if (firstImage?.src) {
      imageUrl = firstImage.src;
    }
  } else if (product.image) {
    imageUrl = product.image;
  } else if (product.imageUrl) {
    imageUrl = product.imageUrl;
  } else if (product.imageURL) {
    imageUrl = product.imageURL;
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#DDD6C2] bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#DDD6C2]">

      {/* IMAGE */}

      <Link href={productLink}>
        <div className="relative flex h-[250px] items-center justify-center overflow-hidden bg-[#F8F6F2] p-6">

          <Image
            src={imageUrl}
            alt={
              product.title ||
              "Biomedical Testing Products"
            }
            width={500}
            height={400}
            unoptimized
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />

        </div>
      </Link>

      {/* PRODUCT DETAILS */}

      <div className="flex flex-1 flex-col p-6">

        <Link href={productLink}>
          <h3 className="line-clamp-2 min-h-[56px] text-xl font-bold leading-7 text-slate-900 transition-colors duration-300 group-hover:text-[#4B6E48]">
            {product.title ||
              "Biomedical Testing Products"}
          </h3>
        </Link>

        {/* BRAND + MODEL */}

        <div className="mt-5 space-y-2">

          <div className="flex items-center gap-2">

            <span className="shrink-0 text-sm font-semibold text-slate-500">
              Brand:
            </span>

            <span className="line-clamp-1 text-sm font-semibold text-[#3F5D3C]">
              {product.brand || "N/A"}
            </span>

          </div>

          <div className="flex items-center gap-2">

            <span className="shrink-0 text-sm font-semibold text-slate-500">
              Model:
            </span>

            <span className="line-clamp-1 text-sm font-medium text-slate-700">
              {product.model || "N/A"}
            </span>

          </div>

        </div>

        {/* BUTTON */}

        <div className="mt-auto pt-6">

          <Link
            href={productLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4B6E48] px-5 py-3 font-semibold !text-white transition-all duration-300 hover:bg-[#3F5D3C] hover:shadow-lg hover:shadow-[#B2AC88]"
          >

            <span className="!text-white">
              View Details
            </span>

            <ArrowRight
              size={17}
              className="!text-white"
            />

          </Link>

        </div>

      </div>

    </div>
  );
}


/* ==========================================================
   HOME PAGE
========================================================== */

export default function HomePage() {

  const pathname = usePathname();

  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] =
    useState(true);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });


  /* ========================================================
     CITY / DISTRICT
  ======================================================== */

  const pathParts =
    pathname?.split("/").filter(Boolean) || [];

  const staticRoutes = [
    "about",
    "services",
    "items",
    "contact",
  ];

  const currentDistrict =
    pathParts.length > 0 &&
      !staticRoutes.includes(pathParts[0])
      ? pathParts[0]
      : "";

  const currentCity = currentDistrict
    ? currentDistrict
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      )
    : "";


  /* ========================================================
     LINK HANDLER
  ======================================================== */

  const makeLink = (path) => {

    if (!currentDistrict) {
      return path;
    }

    if (path === "/") {
      return `/${currentDistrict}`;
    }

    return `/${currentDistrict}${path}`;
  };


  /* ========================================================
     LOAD HERO DATA
  ======================================================== */

  useEffect(() => {

    const loadHero = async () => {

      try {

        const snap = await getDoc(
          doc(
            db,
            "websites",
            "hemoglobinstripcom",
            "pages",
            "home"
          )
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }

      } catch (error) {

        console.error(
          "Hero data error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    loadHero();

  }, []);


  /* ========================================================
     LOAD SERVICES + PRODUCTS
  ======================================================== */

  useEffect(() => {

    const loadHomeData = async () => {

      try {

        /* SERVICES */

        const serviceSnap = await getDoc(
          doc(
            db,
            "websites",
            "hemoglobinstripcom",
            "pages",
            "services"
          )
        );

        if (serviceSnap.exists()) {

          const serviceData =
            serviceSnap.data();

          setServices(
            Array.isArray(
              serviceData.services
            )
              ? serviceData.services
              : []
          );

        }


        /* PRODUCTS */

        const allProducts =
          await fetchFullCatalog();

        const normalizedProducts =
          Array.isArray(allProducts)
            ? allProducts.map((product) => ({
              ...product,

              slug:
                product.slug ||
                product.productSlug ||
                product.title
                  ?.toLowerCase()
                  .trim()
                  .replace(
                    /[^a-z0-9\s-]/g,
                    ""
                  )
                  .replace(
                    /\s+/g,
                    "-"
                  ),
            }))
            : [];

        setProducts(
          normalizedProducts
        );

      } catch (error) {

        console.error(
          "Home data error:",
          error
        );

      } finally {

        setProductsLoading(false);

      }

    };

    loadHomeData();

  }, []);


  /* ========================================================
     ONLY 3 PRODUCTS
  ======================================================== */

  const featuredProducts = products
    .filter(
      (product) =>
        product &&
        product.title
    )
    .slice(0, 3);


  /* ========================================================
     ONLY 3 SERVICES
  ======================================================== */

  const featuredServices = services
    .filter(Boolean)
    .slice(0, 3);


  /* ========================================================
     SERVICE ICONS
  ======================================================== */

  const serviceIcons = [
    <Microscope
      key="microscope"
      size={30}
    />,
    <FlaskConical
      key="flask"
      size={30}
    />,
    <ShieldCheck
      key="shield"
      size={30}
    />,
    <Stethoscope
      key="stethoscope"
      size={30}
    />,
    <Wrench
      key="wrench"
      size={30}
    />,
    <Activity
      key="activity"
      size={30}
    />,
  ];


  return (
    <>

      {/* ====================================================
          HERO BANNER
      ==================================================== */}
      <section className="bg-white px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">

        <div className="mx-auto max-w-[1450px]">

          {/* =====================================================
        TOP CONTENT
    ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >

            {/* LABEL */}

            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#4B6E48] sm:text-sm">

              <span className="h-2 w-2 rounded-full bg-[#4B6E48]" />

              Hemoglobin Testing Essentials

            </div>


            {/* TITLE */}

            {loading ? (

              <div className="mx-auto animate-pulse space-y-3">

                <div className="mx-auto h-12 w-[90%] rounded-2xl bg-[#F8F6F2] sm:h-16" />

                <div className="mx-auto h-12 w-[65%] rounded-2xl bg-[#F8F6F2] sm:h-16" />

              </div>

            ) : (

              <h1 className="text-4xl font-black leading-[1.02] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl">

                {heroData.title ||
                  "Practical Solutions For Everyday Diagnostics"}

              </h1>

            )}


            {/* CITY */}

            {currentCity && (

              <div className="mt-5 flex items-center justify-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#4B6E48]" />

                <p className="text-base font-bold text-[#4B6E48] sm:text-lg">

                  Serving Healthcare Professionals in{" "}

                  {currentCity}

                </p>

              </div>

            )}


            {/* DESCRIPTION */}

            <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">

              {heroData.description ||
                "Explore hemoglobin testing products, laboratory essentials and procurement support designed around routine diagnostic requirements."}

            </p>


            {/* BUTTONS */}

            <div className="mt-7 flex flex-wrap justify-center gap-3">

              <Link
                href={makeLink("/items")}
                className="inline-flex items-center gap-2 rounded-xl bg-[#4B6E48] px-7 py-3.5 font-semibold !text-white shadow-lg shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-xl"
              >

                <span className="!text-white">

                  {heroData.button1Text ||
                    "Browse Testing Products"}

                </span>

                <ArrowRight
                  size={18}
                  className="!text-white"
                />

              </Link>


              <Link
                href={makeLink("/contact")}
                className="inline-flex items-center gap-2 rounded-xl border border-[#4B6E48] bg-white px-7 py-3.5 font-semibold text-[#4B6E48] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F8F6F2]"
              >

                {heroData.button2Text ||
                  "Discuss Your Requirement"}

              </Link>

            </div>

          </motion.div>


          {/* =====================================================
        IMAGE SHOWCASE
    ===================================================== */}

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
            className="relative mx-auto mt-10 max-w-6xl"
          >

            {/* TOP LINE */}

            <div className="mb-3 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#4B6E48]" />

                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Laboratory Testing Essentials
                </span>

              </div>


              <span className="hidden text-xs font-semibold text-[#4B6E48] sm:block">
                Reliable Diagnostic Supplies
              </span>

            </div>


            {/* IMAGE FRAME */}

            <div className="relative overflow-hidden rounded-[32px] border border-[#DDD6C2] bg-[#F8F6F2] shadow-[0_25px_70px_rgba(75,110,72,0.12)]">

              {/* LEFT GREEN STRIP */}

              <div className="absolute bottom-0 left-0 top-0 w-2 bg-[#4B6E48] sm:w-3" />


              {/* IMAGE */}

              <div className="relative flex h-[300px] items-center justify-center px-8 py-6 sm:h-[370px] sm:px-12 lg:h-[430px]">

                <Image
                  src="/home.png"
                  alt="Biomedical Testing Products and Diagnostic Procurement"
                  width={1400}
                  height={850}
                  priority
                  className="h-full w-full object-contain transition duration-700 hover:scale-105"
                />

              </div>


              {/* TOP RIGHT BADGE */}

              <div className="absolute right-4 top-4 rounded-xl border border-[#DDD6C2] bg-white px-4 py-3 shadow-lg sm:right-6 sm:top-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4B6E48]">

                    <ShieldCheck
                      size={18}
                      className="text-white"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-bold text-slate-900">
                      Consistent Quality
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Practical Products
                    </p>

                  </div>

                </div>

              </div>


              {/* BOTTOM INFO */}

              <div className="absolute bottom-4 left-5 right-5 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md sm:bottom-6 sm:left-7 sm:right-auto sm:min-w-[330px]">

                <div className="flex items-center justify-between gap-5">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4B6E48]">
                      Diagnostic Procurement
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                      Better Resources For Routine Testing
                    </p>

                  </div>


                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F8F6F2] text-[#4B6E48] sm:flex">

                    <Activity size={20} />

                  </div>

                </div>

              </div>

            </div>


            {/* ===================================================
          STATS BELOW IMAGE
      =================================================== */}

            <div className="grid grid-cols-2 border-b border-[#DDD6C2] sm:grid-cols-4">

              <div className="border-b border-[#DDD6C2] px-4 py-4 sm:border-b-0 sm:border-r">

                <p className="text-2xl font-black text-[#4B6E48]">
                  5000+
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Happy Clients
                </p>

              </div>


              <div className="border-b border-[#DDD6C2] px-4 py-4 sm:border-b-0 sm:border-r">

                <p className="text-2xl font-black text-[#4B6E48]">
                  3500+
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Products
                </p>

              </div>


              <div className="border-b border-[#DDD6C2] px-4 py-4 sm:border-b-0 sm:border-r">

                <p className="text-2xl font-black text-[#4B6E48]">
                  10+
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Years Experience
                </p>

              </div>


              <div className="px-4 py-4">

                <p className="text-2xl font-black text-[#4B6E48]">
                  24/7
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Enquiry Support
                </p>

              </div>

            </div>

          </motion.div>

        </div>

      </section>


      {/* ====================================================
          TRUST
      ==================================================== */}

      <section className="bg-white py-20">

        <div className="container-custom">

          <div className="text-center">

            <span className="rounded-full bg-[#F8F6F2] px-5 py-2 text-sm font-semibold text-[#3F5D3C]">
              SUPPORTING TESTING WORKFLOWS
            </span>

            <h2 className="mt-5 text-4xl font-black text-slate-900">
              Chosen By Laboratories & Healthcare Teams
            </h2>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-slate-600">
              Delivering reliable biomedical equipment with quality,
              innovation and professional service support.
            </p>

          </div>


          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

            {[
              {
                number: "5000+",
                title: "Happy Clients",
                icon: Building2,
              },
              {
                number: "3500+",
                title: "Products",
                icon: Microscope,
              },
              {
                number: "10+",
                title: "Years Experience",
                icon: ShieldCheck,
              },
              {
                number: "24/7",
                title: "Enquiry Support",
                icon: Truck,
              },
            ].map((item, index) => {

              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.15,
                  }}
                  viewport={{
                    once: true,
                  }}
                  className="group rounded-3xl border border-[#DDD6C2] bg-[#F8F6F2] p-8 transition duration-300 hover:-translate-y-2 hover:bg-[#4B6E48] hover:text-white"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow">

                    <Icon
                      size={30}
                      className="text-[#4B6E48]"
                    />

                  </div>

                  <h3 className="mt-8 text-5xl font-black">
                    {item.number}
                  </h3>

                  <p className="mt-3 text-slate-600 group-hover:text-white">
                    {item.title}
                  </p>

                </motion.div>
              );

            })}

          </div>

        </div>

      </section>


      {/* ====================================================
          FEATURED PRODUCTS
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <SectionTitle
            badge="Featured Products"
            title="Featured Testing Products"
            description="Review a selection of products from our broader hemoglobin testing and laboratory catalogue."
            center
          />


          {/* LOADING */}

          {productsLoading ? (

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {Array.from({
                length: 3,
              }).map((_, index) => (

                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-[24px] border border-[#DDD6C2] bg-white shadow-md"
                >

                  <div className="h-[250px] bg-[#F8F6F2]" />

                  <div className="p-6">

                    <div className="h-7 w-4/5 rounded bg-[#F8F6F2]" />

                    <div className="mt-5 h-4 w-3/5 rounded bg-[#F8F6F2]" />

                    <div className="mt-3 h-4 w-2/3 rounded bg-[#F8F6F2]" />

                    <div className="mt-6 h-12 w-full rounded-xl bg-[#F8F6F2]" />

                  </div>

                </div>

              ))}

            </div>

          ) : featuredProducts.length > 0 ? (

            <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {featuredProducts.map(
                (product) => (

                  <HomeProductCard
                    key={
                      product.uid ||
                      product.slug ||
                      product.id ||
                      product.title
                    }
                    product={product}
                    district={
                      currentDistrict ||
                      null
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="mt-16 rounded-[30px] border border-[#DDD6C2] bg-[#F8F6F2] p-12 text-center">

              <p className="text-lg font-semibold text-slate-600">
                No products found in the catalog.
              </p>

            </div>

          )}


          {/* VIEW ALL */}

          <div className="mt-14 text-center">

            <Link
              href={makeLink("/items")}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#4B6E48] px-8 py-4 font-semibold !text-white transition hover:bg-[#3F5D3C]"
            >

              <span className="!text-white">
                View All Products
              </span>

              <ArrowRight
                size={18}
                className="!text-white"
              />

            </Link>

          </div>

        </div>

      </section>


      {/* ====================================================
          WHY CHOOSE US
      ==================================================== */}

      <section className="section-padding bg-[#F8F6F2]">

        <div className="container-custom">

          <SectionTitle
            badge="Why Work With Us"
            title="Designed Around Real Laboratory Needs"
            description="We focus on useful product information, responsive communication and sourcing support for routine diagnostic requirements."
            center
          />


          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                icon: (
                  <ShieldCheck
                    size={30}
                  />
                ),
                title:
                  "Application-Ready Products",
                description:
                  "Products presented with laboratory use and everyday testing requirements in mind.",
              },
              {
                icon: (
                  <Truck
                    size={30}
                  />
                ),
                title:
                  "Order Coordination",
                description:
                  "Clear communication around quantities, availability and delivery requirements.",
              },
              {
                icon: (
                  <Wrench
                    size={30}
                  />
                ),
                title:
                  "Application Guidance",
                description:
                  "Helpful information for understanding product specifications and choosing suitable options.",
              },
              {
                icon: (
                  <Activity
                    size={30}
                  />
                ),
                title:
                  "Diagnostic Focus",
                description:
                  "A catalogue built around practical testing workflows and healthcare procurement needs.",
              },
            ].map(
              (item, index) => (

                <div
                  key={index}
                  className="rounded-[30px] border border-[#DDD6C2] bg-white p-8 text-center shadow-lg shadow-[#DDD6C2] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8F6F2] text-[#4B6E48]">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.description}
                  </p>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          WORKING PROCESS
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom">

          <SectionTitle
            badge="How We Enquiry Support You"
            title="From Requirement To Supply"
            description="We keep product enquiries simple by understanding the need, presenting suitable choices and staying available for follow-up."
            center
          />


          <div className="mt-16 grid gap-8 lg:grid-cols-3">

            {[
              {
                step: "01",
                title:
                  "Understand",
                desc:
                  "We review the testing application, quantity and important specifications before suggesting suitable options.",
              },
              {
                step: "02",
                title:
                  "Coordinate",
                desc:
                  "We coordinate the requested products and provide the information needed to proceed with procurement.",
              },
              {
                step: "03",
                title:
                  "Enquiry Support",
                desc:
                  "We help with product questions and follow-up requirements after the enquiry or supply.",
              },
            ].map(
              (item, index) => (

                <div
                  key={index}
                  className="group relative overflow-hidden rounded-[30px] border border-[#DDD6C2] bg-white p-8 shadow-lg shadow-[#DDD6C2] transition-all duration-300 hover:-translate-y-2 hover:border-[#B2AC88] hover:shadow-2xl hover:shadow-[#B2AC88]"
                >

                  <span className="text-6xl font-black text-[#DDD6C2] transition group-hover:text-[#B2AC88]">
                    {item.step}
                  </span>

                  <h3 className="mt-5 text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {item.desc}
                  </p>

                  <div className="mt-8 h-1 w-16 rounded-full bg-[#4B6E48] transition-all duration-300 group-hover:w-24" />

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ====================================================
          AFTER SALES SUPPORT
      ==================================================== */}

      <section className="section-padding bg-gradient-to-b from-white to-[#F8F6F2]">

        <div className="container-custom">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>

              <span className="inline-block rounded-full border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-2 font-semibold text-[#3F5D3C]">
                After-Sales Enquiry Support
              </span>

              <h2 className="mt-5 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                Enquiry Help Beyond The Initial Order
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Biomedical equipment requires proper coordination, maintenance and technical attention throughout its working life. Our support approach is designed to help healthcare facilities maintain dependable equipment performance.
              </p>


              <div className="mt-8 space-y-5">

                {[
                  "Setup and application guidance",
                  "Product-use information",
                  "Technical enquiry coordination",
                  "Product troubleshooting guidance",
                  "Follow-up communication",
                ].map(
                  (item, index) => (

                    <div
                      key={index}
                      className="flex items-start gap-4"
                    >

                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#4B6E48] text-white">

                        <ShieldCheck
                          size={15}
                        />

                      </div>

                      <p className="leading-7 text-slate-700">
                        {item}
                      </p>

                    </div>

                  )
                )}

              </div>

            </div>


            <div className="rounded-[35px] border border-[#DDD6C2] bg-white p-8 shadow-xl shadow-[#DDD6C2] md:p-10">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4B6E48] text-white shadow-lg shadow-[#B2AC88]">

                <Headphones
                  size={30}
                />

              </div>

              <h3 className="mt-7 text-2xl font-bold text-slate-900">
                Need Help Choosing A Testing Product?
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                Whether you are sourcing strips, meters or other laboratory essentials, share your requirement and we can help you review the available options.
              </p>


              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl bg-[#F8F6F2] p-5">

                  <p className="text-sm font-semibold text-[#3F5D3C]">
                    Testing Products
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    Specification Help
                  </p>

                </div>


                <div className="rounded-2xl bg-[#F8F6F2] p-5">

                  <p className="text-sm font-semibold text-[#3F5D3C]">
                    Enquiry Support
                  </p>

                  <p className="mt-2 font-bold text-slate-900">
                    Application Guidance
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ====================================================
          FINAL CONTENT
      ==================================================== */}

      <section className="section-padding bg-white">

        <div className="container-custom max-w-5xl">

          <div className="rounded-[35px] border border-[#DDD6C2] bg-gradient-to-br from-[#F8F6F2] via-white to-[#F8F6F2] p-8 text-center shadow-lg shadow-[#DDD6C2] md:p-12">

            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
              A Practical Partner For Diagnostic Supplies
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              From laboratory requirements and diagnostic equipment to installation coordination and ongoing assistance, we focus on delivering practical solutions that support efficient healthcare operations.
            </p>


            <div className="mt-8 flex flex-wrap justify-center gap-4">

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#3F5D3C] shadow-sm ring-1 ring-[#DDD6C2]">
                Biomedical Testing Products
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#3F5D3C] shadow-sm ring-1 ring-[#DDD6C2]">
                Laboratory Essentials
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#3F5D3C] shadow-sm ring-1 ring-[#DDD6C2]">
                Technical Enquiry Support
              </span>

              <span className="rounded-full bg-white px-5 py-3 font-semibold text-[#3F5D3C] shadow-sm ring-1 ring-[#DDD6C2]">
                Diagnostic Procurement
              </span>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}
