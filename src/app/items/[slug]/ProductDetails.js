"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { usePathname } from "next/navigation";

import {
    FaPlay,
    FaShareAlt,
    FaWhatsapp,
    FaFacebook,
    FaInstagram,
    FaLink,
} from "react-icons/fa";

import {
    doc,
    getDoc,
    getDocs,
    addDoc,
    collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
const makeSlug = (text = "") =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
export default function ProductDetails({ slug }) {
    const [product, setProduct] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedMedia, setSelectedMedia] = useState("image");
    const [showShare, setShowShare] = useState(false);

    const shareRef = useRef();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [submitting, setSubmitting] =
        useState(false);
    const pathname = usePathname();

    const pathParts = pathname
        .split("/")
        .filter(Boolean);

    const city =
        pathParts.length > 1
            ? pathParts[0]
            : "India";

    const cityName =
        city.charAt(0).toUpperCase() +
        city.slice(1);

    useEffect(() => {
        const loadProduct = async () => {
            try {

                // NORMAL PRODUCTS
                const snap = await getDoc(
                    doc(
                        db,
                        "websites",
                        "centralbiomedicals",
                        "pages",
                        "products"
                    )
                );

                let allProducts = [];

                if (snap.exists()) {
                    allProducts = (snap.data().products || []).map((item) => ({
                        ...item,
                        slug:
                            item.slug ||
                            item.productSlug ||
                            makeSlug(item.title),
                    }));
                }

                // CATEGORY PRODUCTS
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

                categorySnap.forEach((docSnap) => {
                    const data = docSnap.data();

                    if (data.products?.length) {
                        allProducts.push(
                            ...(data.products || []).map((item) => ({
                                ...item,
                                slug:
                                    item.slug ||
                                    item.productSlug ||
                                    makeSlug(item.title),
                            }))
                        );
                    }
                });

                const found = allProducts.find(
                    (p) => p.slug === slug
                );
                console.log("URL SLUG:", slug);

                allProducts.forEach((p) => {
                    console.log("PRODUCT:", p.title);
                    console.log("PRODUCT SLUG:", p.slug);
                });
                console.log("SLUG FROM URL:", slug);
                console.log(
                    "TOTAL PRODUCTS:",
                    allProducts.length
                );
                console.log(
                    "FOUND PRODUCT:",
                    found
                );

                setProduct(found || null);

                if (found) {

                    if (
                        found.images?.length > 0
                    ) {
                        setSelectedImage(
                            found.images[0]
                        );
                    } else {
                        setSelectedImage(
                            found.image || ""
                        );
                    }

                    setSelectedMedia("image");
                }

            } catch (error) {
                console.error(error);
            }
        };

        loadProduct();
    }, [slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!form.name.trim()) {
            return toast.error(
                "Name is required"
            );
        }

        if (!emailRegex.test(form.email)) {
            return toast.error(
                "Enter valid email"
            );
        }

        if (!phoneRegex.test(form.phone)) {
            return toast.error(
                "Enter valid mobile number"
            );
        }

        try {
            setSubmitting(true);

            await addDoc(
                collection(
                    db,
                    "websitesQueries",
                    "centralbiomedicals",
                    "productQueries"
                ),
                {
                    ...form,
                    productName: product.title,
                    productSlug: product.slug,
                    brand: product.brand || "",
                    model: product.model || "",
                    createdAt: new Date(),
                }
            );

            toast.success(
                "Your enquiry has been submitted successfully."
            );

            setForm({
                name: "",
                email: "",
                phone: "",
            });
        } catch (error) {
            console.error(error);
            toast.error(
                "Something went wrong"
            );
        } finally {
            setSubmitting(false);
        }
    };
    const productSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            image: product.image ? [product.image] : [],
            description:
                product.desc ||
                product.description ||
                product.title,
            brand: {
                "@type": "Brand",
                name: product.brand || "Central Biomedicals",
            },
        }
        : null;

    const faqSchema = product
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
                {
                    "@type": "Question",
                    name: `What is ${product.title} used for?`,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: `${product.title} is used in hospitals, pathology labs and diagnostic centres.`,
                    },
                },
                {
                    "@type": "Question",
                    name: "Do you provide installation support?",
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: "Yes, installation and technical support are available.",
                    },
                },
            ],
        }
        : null;

    const handleCopy = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied");
        setShowShare(false);
    };

    const handleWhatsapp = () => {
        const shareText = `🔬 ${product?.title}

${product?.desc}

🌐 ${window.location.href}`;

        window.open(
            `https://wa.me/?text=${encodeURIComponent(shareText)}`,
            "_blank"
        );
    };

    const handleFacebook = () => {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                window.location.href
            )}`,
            "_blank"
        );
    };

    const handleInstagram = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Instagram direct sharing available nahi hai. Link copied.");
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: product.title,
                text: product.desc,
                url: window.location.href,
            });
        } else {
            setShowShare(!showShare);
        }
    };

    useEffect(() => {
        const close = (e) => {
            if (
                shareRef.current &&
                !shareRef.current.contains(e.target)
            ) {
                setShowShare(false);
            }
        };

        document.addEventListener("mousedown", close);

        return () =>
            document.removeEventListener("mousedown", close);
    }, []);

    if (!product) {
        return (
       <section className="bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10 py-10 md:py-20">

  <div className="container-custom">

    {/* Top Section */}

    <div className="grid gap-12 lg:grid-cols-2">

      {/* Image Skeleton */}

      <div className="overflow-hidden rounded-[36px] border border-[#DDD6C2] bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

        <div className="h-[420px] md:h-[520px] animate-pulse rounded-[28px] bg-gradient-to-br from-[#ECE7DA] via-[#F8F6F2] to-white" />

      </div>

      {/* Content Skeleton */}

      <div>

        <div className="mb-8 h-12 w-3/4 animate-pulse rounded-xl bg-[#DDD6C2]" />

        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="mb-4 h-6 animate-pulse rounded-lg bg-[#ECE7DA]"
          />
        ))}

      </div>

    </div>

    {/* Bottom Section */}

    <div className="mt-16 grid gap-8 lg:grid-cols-[600px_1fr]">

      {/* Specifications */}

      <div className="rounded-[32px] border border-[#DDD6C2] bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.06)] md:p-8">

        <div className="mb-8 h-10 w-48 animate-pulse rounded-lg bg-[#DDD6C2]" />

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="mb-4 h-14 animate-pulse rounded-2xl bg-[#ECE7DA]"
          />
        ))}

      </div>

      {/* Description */}

      <div className="rounded-[32px] border border-[#DDD6C2] bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.06)] md:p-8">

        <div className="mb-8 h-10 w-60 animate-pulse rounded-lg bg-[#DDD6C2]" />

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="mb-4 h-5 animate-pulse rounded bg-[#ECE7DA]"
          />
        ))}

      </div>

    </div>

  </div>

</section>
        );
    }
    return (
        <section className="py-10 md:py-20 bg-slate-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(productSchema),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqSchema),
                }}
            />
            <div className="container-custom">
                <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-medium text-[#777777]">
                    Home / Products / {product.title}
                </div>
                {/* Top Section */}

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Image */}

              <div>

  {/* Main Image */}

  <div className="group relative h-[340px] overflow-hidden rounded-[36px] border border-[#DDD6C2] bg-gradient-to-br from-[#F2F0EF] via-white to-[#B2AC88]/10 shadow-[0_25px_70px_rgba(0,0,0,0.08)] sm:h-[420px] md:h-[500px] lg:h-[580px]">

    {/* Premium Badge */}

    <div className="absolute left-5 top-5 z-20 rounded-full border border-[#B2AC88]/40 bg-[#4B6E48] px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">

      Premium Quality

    </div>

    {selectedMedia === "video" && product.video ? (

      <video
        controls
        autoPlay
        className="h-full w-full object-contain p-6"
      >
        <source
          src={product.video}
          type="video/mp4"
        />
      </video>

    ) : (

      <>

        {/* Loading */}

        {!imageLoaded && (

          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#ECE7DA] via-[#F8F6F2] to-white">

            <div className="h-20 w-20 animate-spin rounded-full border-4 border-[#DDD6C2] border-t-[#4B6E48]" />

          </div>

        )}

        {/* Product Image */}

        <Image
          src={selectedImage || product.image}
          alt={product.title}
          fill
          priority
          onLoad={() => setImageLoaded(true)}
          className={`object-contain p-6 transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

      </>

    )}

  </div>

  {/* Gallery */}

  <div className="mt-6 flex flex-wrap gap-4">

    {(product.images?.length
      ? product.images
      : [product.image]
    ).map((img, index) => (

      <button
        key={index}
        onClick={() => {
          setSelectedImage(img);
          setSelectedMedia("image");
        }}
        className={`group relative h-20 w-20 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg

        ${
          selectedMedia === "image" &&
          selectedImage === img
            ? "border-[#4B6E48] shadow-lg shadow-[#4B6E48]/20"
            : "border-[#DDD6C2] hover:border-[#B2AC88]"
        }`}
      >

        <Image
          src={img}
          alt={`Thumbnail ${index + 1}`}
          width={80}
          height={80}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

      </button>

    ))}

    {/* Video */}

    {product.video && (

      <button
        onClick={() => setSelectedMedia("video")}
        className={`group flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg

        ${
          selectedMedia === "video"
            ? "border-[#4B6E48] bg-[#F2F0EF] shadow-lg shadow-[#4B6E48]/20"
            : "border-[#DDD6C2] hover:border-[#B2AC88] hover:bg-[#F8F6F2]"
        }`}
      >

        <FaPlay
          size={20}
          className="text-[#4B6E48]"
        />

        <span className="mt-2 text-xs font-semibold text-[#2F3E2E]">

          Video

        </span>

      </button>

    )}

    {/* PDF */}

    {product.pdf && (

      <a
        href={product.pdf}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 border-[#DDD6C2] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:bg-[#F8F6F2] hover:shadow-lg"
      >

        <span className="text-2xl">

          📄

        </span>

        <span className="mt-2 text-xs font-semibold text-[#2F3E2E]">

          PDF

        </span>

      </a>

    )}

  </div>

</div>

                    {/* Product Details */}

                    <div>

                       <div className="relative flex items-start justify-between gap-4">

  {/* Product Title */}

  <div>

    <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

      Premium Biomedical Equipment

    </span>

    <h1 className="mt-5 text-2xl font-black leading-tight tracking-tight text-[#2F3E2E] sm:text-3xl md:text-4xl lg:text-5xl">

      {product.title}

    </h1>

  </div>

  {/* Share */}

  <div
    ref={shareRef}
    className="relative flex-shrink-0"
  >

    <button
      onClick={handleNativeShare}
      aria-label="Share Product"
      className="group flex h-14 w-14 items-center justify-center rounded-full border border-[#DDD6C2] bg-white text-[#4B6E48] shadow-[0_15px_45px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:bg-[#F8F6F2] hover:shadow-[0_20px_50px_rgba(75,110,72,0.20)]"
    >

      <FaShareAlt
        size={18}
        className="transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
      />

    </button>

    {showShare && (

      <div className="absolute right-0 top-16 z-50 w-64 overflow-hidden rounded-[24px] border border-[#DDD6C2] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">

        <button
          onClick={handleCopy}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#2F3E2E] transition-all duration-300 hover:bg-[#F2F0EF] hover:text-[#4B6E48]"
        >

          <FaLink className="text-[#4B6E48]" />

          Copy Link

        </button>

        <button
          onClick={handleWhatsapp}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#2F3E2E] transition-all duration-300 hover:bg-[#F2F0EF] hover:text-[#4B6E48]"
        >

          <FaWhatsapp className="text-[#25D366]" />

          WhatsApp

        </button>

        <button
          onClick={handleFacebook}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#2F3E2E] transition-all duration-300 hover:bg-[#F2F0EF] hover:text-[#4B6E48]"
        >

          <FaFacebook className="text-[#1877F2]" />

          Facebook

        </button>

        <button
          onClick={handleInstagram}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[#2F3E2E] transition-all duration-300 hover:bg-[#F2F0EF] hover:text-[#4B6E48]"
        >

          <FaInstagram className="text-[#E4405F]" />

          Instagram

        </button>

      </div>

    )}

  </div>

</div>

                     <div className="mt-6 rounded-[36px] border border-[#DDD6C2] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:mt-8 md:p-8">

  {/* Heading */}

  <div className="mb-8 flex items-center justify-between">

    <div>

      <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

        Technical Details

      </span>

      <h3 className="mt-4 text-3xl font-black text-[#2F3E2E]">

        Product Specifications

      </h3>

    </div>

  </div>

  {/* Specifications */}

  <div className="grid gap-5 sm:grid-cols-2">

    {[
      {
        label: "Brand",
        value: product.brand || "N/A",
      },
      {
        label: "Model",
        value: product.model || "N/A",
      },
      {
        label: "Instrument",
        value: product.instrument || "N/A",
      },
      {
        label: "Capacity",
        value: product.capacity || "N/A",
      },
      {
        label: "Throughput",
        value: product.throughput || "N/A",
      },
      {
        label: "Usage",
        value: product.usage || "N/A",
      },
      {
        label: "Automation",
        value: product.automation || "N/A",
      },
      {
        label: "Availability",
        value: product.availability || "N/A",
      },
    ].map((item, index) => (

      <div
        key={index}
        className="group rounded-[24px] border border-[#DDD6C2] bg-[#F8F6F2] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:bg-white hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
      >

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4B6E48]">

          {item.label}

        </p>

        <p className="mt-3 text-lg font-bold text-[#2F3E2E] break-words">

          {item.value}

        </p>

      </div>

    ))}

  </div>

</div>

                    </div>

                </div>

                {/* Description + Form */}

                <div className="mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] xl:grid-cols-[600px_1fr] gap-6 md:gap-8">

                        {/* Quote Form */}

                     <div className="h-fit rounded-[40px] border border-[#DDD6C2] bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.08)] lg:sticky lg:top-24 sm:p-6 md:p-8">

  {/* Header */}

  <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

    Quick Enquiry

  </span>

  <h2 className="mt-5 text-2xl font-black text-[#2F3E2E] md:text-3xl">

    Request A Quote

  </h2>

  <p className="mt-4 leading-7 text-[#666666]">

    Interested in this product?

  </p>

  <div className="mt-4 inline-flex rounded-full border border-[#DDD6C2] bg-[#F2F0EF] px-4 py-2 text-sm font-semibold text-[#4B6E48]">

    {product.title}

  </div>

  {/* Form */}

  <form
    onSubmit={handleSubmit}
    className="mt-8 space-y-5"
  >

    {/* Name */}

    <input
      type="text"
      placeholder="Your Name"
      value={form.name}
      onChange={(e) =>
        setForm({
          ...form,
          name: e.target.value,
        })
      }
      className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] placeholder:text-[#8A8A8A] shadow-sm outline-none transition-all duration-300 hover:border-[#B2AC88] hover:shadow-md focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
    />

    {/* Email */}

    <input
      type="email"
      placeholder="Email Address"
      value={form.email}
      onChange={(e) =>
        setForm({
          ...form,
          email: e.target.value,
        })
      }
      className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] placeholder:text-[#8A8A8A] shadow-sm outline-none transition-all duration-300 hover:border-[#B2AC88] hover:shadow-md focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
    />

    {/* Phone */}

    <input
      type="tel"
      placeholder="Phone Number"
      maxLength={10}
      value={form.phone}
      onChange={(e) =>
        setForm({
          ...form,
          phone: e.target.value.replace(/\D/g, ""),
        })
      }
      className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] placeholder:text-[#8A8A8A] shadow-sm outline-none transition-all duration-300 hover:border-[#B2AC88] hover:shadow-md focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
    />

    {/* Submit */}

    <button
      type="submit"
      disabled={submitting}
      className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#4B6E48] py-4 font-semibold text-white shadow-[0_15px_40px_rgba(75,110,72,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-[0_20px_50px_rgba(75,110,72,0.35)] disabled:cursor-not-allowed disabled:opacity-70"
    >

      {submitting ? (
        "Submitting..."
      ) : (
        <>
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
        </>
      )}

    </button>

  </form>

  {/* Bottom Trust Section */}

  <div className="mt-8 rounded-[24px] border border-[#DDD6C2] bg-[#F8F6F2] p-5">

    <div className="flex items-center gap-3">

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B2AC88]/20 text-[#4B6E48]">

        ✓

      </div>

      <div>

        <h4 className="font-bold text-[#2F3E2E]">

          Trusted Biomedical Partner

        </h4>

        <p className="mt-1 text-sm leading-6 text-[#666666]">

          Quick response, genuine products and nationwide delivery.

        </p>

      </div>

    </div>

  </div>

</div>
                        {/* Description */}

                        <div className="rounded-[36px] border border-[#DDD6C2] bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-[#B2AC88] hover:shadow-[0_25px_70px_rgba(75,110,72,0.12)] sm:p-6 md:p-10">

                            {/* Header */}

                            {/* Product Description */}

                                <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

                                Product Details

                                </span>

                                <h3 className="mt-5 text-3xl font-black tracking-tight text-[#2F3E2E]">

                                Product Description

                                </h3>

                                <p className="mt-6 text-base leading-8 text-[#666666] md:text-lg md:leading-9">

                                {product.desc ||
                                    product.description ||
                                    "No description available."}

                                </p>

                            {/* Specifications */}

                      <div className="mt-10 overflow-hidden rounded-[28px] border border-[#DDD6C2] bg-white shadow-[0_15px_45px_rgba(0,0,0,0.06)]">

  <table className="w-full border-collapse">

    <tbody>

      {[
        {
          label: "Brand",
          value: product.brand || "N/A",
        },
        {
          label: "Model",
          value: product.model || "N/A",
        },
        {
          label: "Usage",
          value: product.usage || "N/A",
        },
        {
          label: "Automation",
          value: product.automation || "N/A",
        },
        {
          label: "Capacity",
          value: product.capacity || "N/A",
        },
        {
          label: "Throughput",
          value: product.throughput || "N/A",
        },
      ].map((item, index) => (

        <tr
          key={index}
          className="border-b border-[#EEE7D8] transition-all duration-300 hover:bg-[#F8F6F2] last:border-b-0"
        >

          {/* Label */}

          <td className="w-1/3 border-r border-[#EEE7D8] bg-[#F2F0EF] px-6 py-5 font-semibold uppercase tracking-wide text-[#4B6E48]">

            {item.label}

          </td>

          {/* Value */}

          <td className="px-6 py-5 font-medium text-[#2F3E2E]">

            {item.value}

          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>


                            {/* SEO Content */}

                    <div className="mt-12 rounded-[40px] border border-[#DDD6C2] bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:p-10">

  {/* Header */}

  <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

    Product Information

  </span>

  <h2 className="mt-5 text-3xl font-black text-[#2F3E2E]">

    Everything You Need to Know

  </h2>

  <p className="mt-3 max-w-3xl leading-8 text-[#666666]">

    Explore detailed information about {product.title}, including
    features, applications, pricing, supplier details and healthcare
    solutions available in {cityName}.

  </p>

  {/* Information Cards */}

  <div className="mt-10 space-y-6">

    {[
      {
        title: `Why Choose Central Biomedicals in ${cityName}?`,
        content: `Central Biomedicals is a trusted supplier and distributor of ${product.title} in ${cityName}. We provide high-quality biomedical and laboratory equipment for hospitals, pathology laboratories, diagnostic centres and healthcare facilities.`,
      },
      {
        title: `Features of ${product.title}`,
        content: `${product.title} offers reliable performance, accurate results, user-friendly operation, long service life and efficient workflow for laboratories, hospitals and healthcare professionals.`,
      },
      {
        title: `Applications of ${product.title}`,
        content: `Widely used in hospitals, pathology laboratories, diagnostic centres, blood banks, research institutes and healthcare facilities for accurate and efficient diagnostics.`,
      },
      {
        title: `${product.title} Supplier in ${cityName}`,
        content: `Central Biomedicals supplies ${product.title} in ${cityName} with expert consultation, installation support, technical guidance and dependable after-sales service.`,
      },
      {
        title: `${product.title} Dealer in ${cityName}`,
        content: `We are a trusted dealer of ${product.title} in ${cityName}, offering premium biomedical equipment, laboratory instruments and diagnostic systems at competitive prices.`,
      },
      {
        title: `${product.title} Distributor in ${cityName}`,
        content: `Looking for a reliable distributor of ${product.title} in ${cityName}? We provide fast delivery, installation support, maintenance assistance and professional customer service.`,
      },
      {
        title: `Buy ${product.title} in ${cityName}`,
        content: `Purchase high-quality ${product.title} in ${cityName} from Central Biomedicals with genuine products, competitive pricing and reliable nationwide support.`,
      },
      {
        title: `${product.title} Price in ${cityName}`,
        content: `The price of ${product.title} depends on the selected model, specifications and configuration. Contact our team for the latest quotation, availability and delivery information.`,
      },
    ].map((item, index) => (

      <div
        key={index}
        className="group rounded-[28px] border border-[#DDD6C2] bg-[#F8F6F2] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:bg-white hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
      >

        {/* Heading */}

        <div className="flex items-start gap-4">

          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#B2AC88]/20 text-[#4B6E48]">

            ✓

          </div>

          <div>

            <h3 className="text-2xl font-bold leading-snug text-[#2F3E2E] transition-colors duration-300 group-hover:text-[#4B6E48]">

              {item.title}

            </h3>

            <p className="mt-4 leading-8 text-[#666666]">

              {item.content}

            </p>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>

                            {/* FAQ Section */}

                           <div className="mt-12 rounded-[40px] border border-[#DDD6C2] bg-white p-6 shadow-[0_24px_70px_rgba(0,0,0,0.08)] md:p-10">

  {/* Header */}

  <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

    Help Center

  </span>

  <h3 className="mt-5 text-3xl font-black text-[#2F3E2E]">

    Frequently Asked Questions

  </h3>

  <p className="mt-3 max-w-3xl leading-8 text-[#666666]">

    Find answers to the most common questions about{" "}
    <strong>{product.title}</strong>, including pricing, applications,
    warranty, installation and delivery in{" "}
    <strong>{cityName}</strong>.

  </p>

  {/* FAQ */}

  <div className="mt-10 space-y-5">

    {[
      {
        question: `What is ${product.title} used for in ${cityName}?`,
        answer: `${product.title} is commonly used in hospitals, pathology laboratories, diagnostic centres and healthcare facilities for accurate diagnostic and laboratory applications.`,
      },
      {
        question: `What is the price of ${product.title} in ${cityName}?`,
        answer: `The price depends on the model, configuration and specifications. Contact our team for the latest quotation and availability.`,
      },
      {
        question: `Are you an authorized supplier of ${product.title}?`,
        answer: `Yes. We supply genuine biomedical and laboratory equipment sourced from trusted manufacturers and brands.`,
      },
      {
        question: `Can hospitals in ${cityName} order this product?`,
        answer: `Yes. Hospitals, pathology laboratories, diagnostic centres, research institutes and healthcare facilities can purchase this product.`,
      },
      {
        question: "Do you provide installation support?",
        answer: `Yes. Installation guidance, technical assistance and after-sales support are available for eligible products.`,
      },
      {
        question: "Can I request a quotation?",
        answer: `Absolutely. Simply submit the enquiry form on this page and our team will provide pricing, availability and product details.`,
      },
      {
        question: "Do you provide warranty?",
        answer: `Warranty coverage depends on the manufacturer and selected product model. Our team will share complete warranty information.`,
      },
      {
        question: "Do you deliver across India?",
        answer: `Yes. We provide safe packaging and reliable delivery services across India.`,
      },
      {
        question: "How can I contact Central Biomedicals?",
        answer: `You can submit the enquiry form on this page or contact our sales team directly for quotations, product information and technical assistance.`,
      },
    ].map((item, index) => (

      <div
        key={index}
        className="group rounded-[28px] border border-[#DDD6C2] bg-[#F8F6F2] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:bg-white hover:shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
      >

        <div className="flex items-start gap-4">

          {/* Icon */}

          <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#B2AC88]/20 text-[#4B6E48] font-bold">

            ?

          </div>

          {/* Content */}

          <div>

            <h4 className="text-xl font-bold leading-7 text-[#2F3E2E] transition-colors duration-300 group-hover:text-[#4B6E48]">

              {item.question}

            </h4>

            <p className="mt-4 leading-8 text-[#666666]">

              {item.answer}

            </p>

          </div>

        </div>

      </div>

    ))}

  </div>

</div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
}