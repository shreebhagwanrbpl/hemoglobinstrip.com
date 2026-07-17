"use client";
import {
  Microscope,
  FlaskConical,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Activity,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";
import ServiceCard from "@/components/ServiceCard";
// import CTASection from "@/components/CTASection";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const icons = [
    <Microscope size={30} />,
    <FlaskConical size={30} />,
    <ShieldCheck size={30} />,
    <Stethoscope size={30} />,
    <Wrench size={30} />,
    <Activity size={30} />,
  ];
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "pages",
            "services"
          )
        );

        if (snap.exists()) {
          setServices(snap.data().services || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Our Services"
        subtitle="Delivering trusted biomedical and diagnostic services with innovation, precision, and healthcare excellence."
      />

      {/* Services Grid */}
     <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom">

    <SectionTitle
      badge="What We Offer"
      title="Premium Biomedical Services"
      description="We provide innovative healthcare and biomedical solutions tailored to modern diagnostics and laboratory excellence."
      center
    />

    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-[36px] border border-[#DDD6C2] bg-white p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            >
              {/* Icon */}

              <div className="mb-8 h-20 w-20 rounded-[24px] bg-[#ECE7DA]"></div>

              {/* Title */}

              <div className="mb-6 h-8 w-2/3 rounded-lg bg-[#DDD6C2]"></div>

              {/* Description */}

              <div className="space-y-3">

                <div className="h-4 rounded bg-[#ECE7DA]"></div>

                <div className="h-4 w-11/12 rounded bg-[#ECE7DA]"></div>

                <div className="h-4 w-8/12 rounded bg-[#ECE7DA]"></div>

              </div>

            </div>
          ))
        : services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={icons[index]}
              title={service.title}
              description={service.desc}
            />
          ))}

    </div>

  </div>

</section>

      {/* Working Process */}
  <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom">

    <SectionTitle
      badge="How We Work"
      title="Simple & Professional Process"
      description="We follow a streamlined process to deliver reliable biomedical and healthcare solutions with precision and excellence."
      center
    />

    <div className="mt-16 grid gap-8 lg:grid-cols-3">

      {[
        {
          step: "01",
          title: "Consultation",
          desc:
            "Understanding healthcare requirements, laboratory needs and recommending the most suitable biomedical solutions.",
        },
        {
          step: "02",
          title: "Implementation",
          desc:
            "Supplying, installing and configuring biomedical equipment with complete technical guidance.",
        },
        {
          step: "03",
          title: "Support",
          desc:
            "Providing ongoing maintenance, expert assistance and after-sales support for long-term reliability.",
        },
      ].map((item, index) => (

        <div
          key={index}
          className="group relative overflow-hidden rounded-[36px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48] hover:shadow-[0_25px_70px_rgba(75,110,72,0.18)]"
        >

          {/* Decorative Circle */}

          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#B2AC88]/10 transition-all duration-500 group-hover:bg-white/10" />

          {/* Step Number */}

          <span className="relative text-6xl font-black tracking-tight text-[#B2AC88]/50 transition-all duration-300 group-hover:text-white/20">

            {item.step}

          </span>

          {/* Title */}

          <h3 className="relative mt-6 text-2xl font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

            {item.title}

          </h3>

          {/* Description */}

          <p className="relative mt-5 leading-8 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

            {item.desc}

          </p>

          {/* Bottom Accent */}

          <div className="relative mt-8 h-1.5 w-16 rounded-full bg-[#B2AC88] transition-all duration-300 group-hover:w-28 group-hover:bg-white"></div>

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