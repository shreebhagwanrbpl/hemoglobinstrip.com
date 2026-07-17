"use client";

import { motion } from "framer-motion";

export default function PageBanner({
  title,
  subtitle,
}) {
  return (
 <section className="relative overflow-hidden bg-gradient-to-br from-[#FDFCF9] via-white to-[#F2F0EF] py-28 lg:py-36">

  {/* Background Blur */}

  <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-[#B2AC88]/20 blur-[150px]" />

  <div className="absolute -bottom-32 -right-32 h-[450px] w-[450px] rounded-full bg-[#4B6E48]/10 blur-[170px]" />

  {/* Premium Grid */}

  <div className="absolute inset-0 bg-[linear-gradient(#B2AC8815_1px,transparent_1px),linear-gradient(90deg,#B2AC8815_1px,transparent_1px)] bg-[size:42px_42px]" />

  <div className="container-custom relative z-10">

    <motion.div
      initial={{
        opacity: 0,
        y: 50,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      className="mx-auto max-w-5xl text-center"
    >

      {/* Badge */}

      <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-6 py-2 text-sm font-semibold tracking-wide text-[#4B6E48]">

        Welcome to Our Company

      </span>

      {/* Title */}

      <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight text-[#2F3E2E] lg:text-7xl">

        {title}

      </h1>

      {/* Subtitle */}

      <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-[#666666]">

        {subtitle}

      </p>

      {/* Decorative Line */}

      <div className="mx-auto mt-10 h-1.5 w-24 rounded-full bg-gradient-to-r from-[#4B6E48] via-[#B2AC88] to-[#4B6E48]" />

    </motion.div>

  </div>

</section>
  );
}