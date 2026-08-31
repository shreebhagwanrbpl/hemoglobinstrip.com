import Image from "next/image";

import PageBanner from "@/components/PageBanner";
import SectionTitle from "@/components/SectionTitle";


export default function AboutPage() {
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="About Hemoglobin Strip Solutions"
        subtitle="A focused source for hemoglobin testing essentials, laboratory supplies and practical diagnostic support."
      />

      {/* About Section */}
      <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

        <div className="container-custom grid lg:grid-cols-2 gap-20 items-center">

          {/* Left Image */}
          <div className="relative">

            <div className="flex h-[600px] items-center justify-center overflow-hidden rounded-[36px] border border-[#DDD6C2] bg-gradient-to-br from-[#F2F0EF] via-white to-[#B2AC88]/10 p-10 shadow-[0_25px_70px_rgba(0,0,0,0.08)]">

              <Image
                src="/about.png"
                alt="About"
                width={1200}
                height={900}
                className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-105"
              />

            </div>

            {/* Floating Experience Card */}

            <div className="absolute bottom-8 left-8 hidden rounded-[28px] border border-[#DDD6C2] bg-white px-8 py-6 shadow-[0_20px_50px_rgba(0,0,0,0.12)] lg:block">

              <h3 className="text-4xl font-black text-[#4B6E48]">

                10+

              </h3>

              <p className="mt-2 text-[#666666]">

                Years of Excellence

              </p>

            </div>

          </div>

          {/* Right Content */}

          <div>

            <SectionTitle
              badge="Who We Are"
              title="Focused on Practical Diagnostic Testing"
              description="Helping laboratories and healthcare teams source testing essentials with clear information, dependable coordination and application-focused support."
            />

            <p className="mt-8 leading-8 text-[#666666]">

              At Raj Biosis, we specialize in providing
              premium biomedical and diagnostic equipment that
              enhances laboratory performance, healthcare accuracy
              and clinical efficiency across hospitals, laboratories
              and healthcare institutions.

            </p>

            <p className="mt-6 leading-8 text-[#666666]">

              Our mission is to empower healthcare professionals
              through advanced technology, reliable products and
              dedicated after-sales support while maintaining the
              highest standards of quality and innovation.

            </p>

            {/* Features */}

            <div className="mt-10 grid gap-6 sm:grid-cols-2">

              {/* Card 1 */}

              <div className="group rounded-[30px] border border-[#DDD6C2] bg-white p-7 shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48]">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-3xl transition-all duration-300 group-hover:bg-white">

                  🏥

                </div>

                <h4 className="text-xl font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

                  Testing Essentials

                </h4>

                <p className="mt-4 leading-7 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

                  High-quality laboratory and diagnostic
                  instruments designed for maximum
                  precision and long-term reliability.

                </p>

              </div>

              {/* Card 2 */}

              <div className="group rounded-[30px] border border-[#DDD6C2] bg-white p-7 shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48]">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-3xl transition-all duration-300 group-hover:bg-white">

                  🤝

                </div>

                <h4 className="text-xl font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

                  Responsive Assistance

                </h4>

                <p className="mt-4 leading-7 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

                  Professional consultation, installation,
                  maintenance and dedicated customer
                  support across India.

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>
    </>
  );
}