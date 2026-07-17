"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Building2,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Wrench,
  Activity,
} from "lucide-react";

import Image from "next/image";
import {



  Truck,
} from "lucide-react";

const stats = [
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
    title: "Support",
    icon: Truck,
  },
];

export default function HeroSection({
}) {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const pathname = usePathname();

  const pathParts = pathname.split("/").filter(Boolean);
  const [loading, setLoading] = useState(true);

  const [heroData, setHeroData] = useState({
    title: "",
    description: "",
    button1Text: "",
    button2Text: "",
  });
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
  const city = district
    ? district
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  const makeLink = (path) => {
    if (!district) return path;

    if (path === "/") {
      return `/${district}`;
    }

    return `/${district}${path}`;
  };
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "home"
          )
        );

        if (snap.exists()) {
          setHeroData(snap.data());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {

        // Services

        const serviceSnap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "services"
          )
        );

        if (serviceSnap.exists()) {
          setServices(serviceSnap.data().services || []);
        }

        // Products

        const productSnap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "products"
          )
        );

        if (productSnap.exists()) {

          const data = (productSnap.data().products || []).map((item) => ({
            ...item,
            slug:
              item.slug ||
              item.title
                ?.toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-"),
          }));

          setProducts(data);

        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];
  return (
    <>
  <section className="relative overflow-hidden bg-gradient-to-br from-[#F2F0EF] via-white to-[#B2AC88]/20">

  {/* Background Blur */}
  <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#B2AC88]/30 blur-[150px]" />
  <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#4B6E48]/20 blur-[150px]" />

  <div className="container-custom relative py-24">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* Left */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        {/* Badge */}
        <span className="inline-flex items-center rounded-full border border-[#B2AC88]/50 bg-[#B2AC88]/15 px-5 py-2 text-sm font-semibold text-[#4B6E48] backdrop-blur-sm">
          India's Trusted Biomedical Partner
        </span>

        {/* Heading */}
        <h1 className="mt-8 text-5xl lg:text-7xl font-black leading-tight text-[#2F3E2E]">

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-12 w-3/4 rounded bg-[#DDD6C2]" />
              <div className="h-12 w-2/3 rounded bg-[#DDD6C2]" />
            </div>
          ) : (
            <>
              {heroData.title}

              {city && (
                <span className="block mt-3 text-2xl lg:text-4xl font-bold text-[#4B6E48]">
                  in {city}
                </span>
              )}
            </>
          )}

        </h1>

        {/* Description */}
        {loading ? (
          <div className="mt-8 space-y-3 animate-pulse">
            <div className="h-4 rounded bg-[#DDD6C2]" />
            <div className="h-4 w-11/12 rounded bg-[#DDD6C2]" />
            <div className="h-4 w-8/12 rounded bg-[#DDD6C2]" />
          </div>
        ) : (
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#666666]">

            {heroData.description}

            {city && (
              <>
                {" "}
                across <strong className="text-[#4B6E48]">{city}</strong>
              </>
            )}

          </p>
        )}

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap gap-5">

          {loading ? (
            <>
              <div className="h-14 w-48 rounded-xl bg-[#DDD6C2] animate-pulse" />
              <div className="h-14 w-40 rounded-xl bg-[#DDD6C2] animate-pulse" />
            </>
          ) : (
            <>
              <Link href={makeLink("/items")}>

                <button className="rounded-xl bg-[#4B6E48] px-8 py-4 font-semibold text-white shadow-xl shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C]">
                  {heroData.button1Text || "Explore Products"}
                </button>

              </Link>

              <Link href={makeLink("/contact")}>

                <button className="rounded-xl border-2 border-[#4B6E48] bg-white px-8 py-4 font-semibold text-[#4B6E48] transition-all duration-300 hover:bg-[#B2AC88]/15">
                  {heroData.button2Text || "Get Quote"}
                </button>

              </Link>
            </>
          )}

        </div>

      </motion.div>

      {/* Right */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >

        <div className="grid grid-cols-2 gap-6">

          {/* Card 1 */}
          <div className="rounded-[32px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

            <h2 className="text-5xl font-black text-[#4B6E48]">
              5000+
            </h2>

            <p className="mt-3 text-[#666666]">
              Happy Customers
            </p>

          </div>

          {/* Card 2 */}
          <div className="rounded-[32px] bg-[#4B6E48] p-8 text-white shadow-[0_20px_60px_rgba(75,110,72,0.25)]">

            <h2 className="text-5xl font-black">
              10+
            </h2>

            <p className="mt-3 text-white/90">
              Years Experience
            </p>

          </div>

          {/* Why Choose */}
          <div className="col-span-2 rounded-[32px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

            <h3 className="text-2xl font-bold text-[#2F3E2E]">
              Why Customers Choose Us
            </h3>

            <div className="mt-8 space-y-6">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-2xl">
                  ✅
                </div>

                <div>
                  <h4 className="font-semibold text-[#2F3E2E]">
                    Premium Quality
                  </h4>

                  <p className="text-sm text-[#777777]">
                    Genuine biomedical equipment.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-2xl">
                  🚚
                </div>

                <div>
                  <h4 className="font-semibold text-[#2F3E2E]">
                    Fast Delivery
                  </h4>

                  <p className="text-sm text-[#777777]">
                    Delivery across India.
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-2xl">
                  🛠
                </div>

                <div>
                  <h4 className="font-semibold text-[#2F3E2E]">
                    Service Support
                  </h4>

                  <p className="text-sm text-[#777777]">
                    Installation & maintenance.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </motion.div>

    </div>

  </div>

</section>

  <section className="bg-[#F2F0EF] py-20">

  <div className="container-custom">

    {/* Heading */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: .6 }}
      viewport={{ once: true }}
      className="text-center"
    >

      <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-5 py-2 text-sm font-semibold text-[#4B6E48]">

        TRUSTED ACROSS INDIA

      </span>

      <h2 className="mt-6 text-4xl lg:text-5xl font-black leading-tight text-[#2F3E2E]">

        Trusted By Hospitals,
        <br />
        Laboratories & Healthcare Professionals

      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#666666]">

        Delivering reliable biomedical equipment with quality,
        innovation and nationwide service support.

      </p>

    </motion.div>

    {/* Stats */}
    <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">

      {stats.map((item, index) => {

        const Icon = item.icon;

        return (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * .15 }}
            viewport={{ once: true }}
            className="group rounded-[32px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48]"
          >

            {/* Icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B2AC88]/20 transition-all duration-300 group-hover:bg-white">

              <Icon
                size={30}
                className="text-[#4B6E48]"
              />

            </div>

            {/* Number */}
            <h3 className="mt-8 text-5xl font-black text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

              {item.number}

            </h3>

            {/* Title */}
            <p className="mt-4 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

              {item.title}

            </p>

          </motion.div>

        );

      })}

    </div>

  </div>

</section>

    <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom">

    <SectionTitle
      badge="Our Services"
      title="Professional Biomedical Services"
      description="Comprehensive biomedical solutions for hospitals, laboratories and healthcare institutions."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

      {services.slice(0, 3).map((service, index) => (

        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
          viewport={{ once: true }}
          className="group rounded-[32px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48]"
        >

          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B2AC88]/20 transition-all duration-300 group-hover:bg-white">

            {/* {React.createElement(icons[index], {
              size: 30,
              className: "text-[#4B6E48]",
            })} */}

          </div>

          {/* Title */}
          <h3 className="mt-8 text-2xl font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

            {service.title}

          </h3>

          {/* Description */}
          <p className="mt-4 leading-7 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

            {service.desc}

          </p>

        </motion.div>

      ))}

    </div>

    {/* Button */}
    <div className="mt-16 text-center">

      <Link href={makeLink("/services")}>

        <button className="inline-flex items-center gap-3 rounded-2xl bg-[#4B6E48] px-8 py-4 font-semibold text-white shadow-xl shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C]">

          View All Services

          <ArrowRight size={18} />

        </button>

      </Link>

    </div>

  </div>

</section>

     <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom">

    <SectionTitle
      badge="Featured Products"
      title="Popular Biomedical Equipment"
      description="Explore our most demanded biomedical and diagnostic equipment."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

      {products.slice(0, 3).map((product) => (

        <div
          key={product.slug || product.id || product.title}
          className="group overflow-hidden rounded-[32px] border border-[#DDD6C2] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:shadow-[0_25px_70px_rgba(75,110,72,0.18)]"
        >

          {/* Product Image */}

          <div className="flex h-72 items-center justify-center overflow-hidden bg-gradient-to-br from-[#F2F0EF] to-[#B2AC88]/10 p-8">

            <img
              src={product.images?.[0] || product.image}
              alt={product.title}
              className="max-h-56 object-contain transition-all duration-500 group-hover:scale-110"
            />

          </div>

          {/* Content */}

          <div className="p-8">

            {/* Category */}

            <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[#4B6E48]">

              {product.category}

            </span>

            {/* Title */}

            <h3 className="mt-5 text-2xl font-bold leading-snug text-[#2F3E2E] transition-colors duration-300 group-hover:text-[#4B6E48]">

              {product.title}

            </h3>

            {/* Description */}

            <p className="mt-4 line-clamp-3 leading-7 text-[#666666]">

              {product.description || product.desc}

            </p>

            {/* Button */}

            <Link
              href={makeLink(`/items/${product.slug}`)}
              className="mt-8 inline-flex items-center gap-2 font-semibold text-[#4B6E48] transition-all duration-300 hover:gap-3"
            >

              View Product

              <ArrowRight size={18} />

            </Link>

          </div>

        </div>

      ))}

    </div>

    {/* Bottom Button */}

    <div className="mt-16 text-center">

      <Link href={makeLink("/items")}>

        <button className="inline-flex items-center gap-3 rounded-2xl bg-[#4B6E48] px-8 py-4 font-semibold text-white shadow-xl shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-[#4B6E48]/30">

          View All Products

          <ArrowRight size={18} />

        </button>

      </Link>

    </div>

  </div>

</section>
    </>
  );
}