"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
} from "lucide-react";

import PageBanner from "@/components/PageBanner";
// import CTASection from "@/components/CTASection";

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] =
    useState(null);
  const [contactInfo, setContactInfo] =
    useState([]);

  const [submitting, setSubmitting] =
    useState(false);
  const pathname = usePathname();

  const pathParts = pathname
    .split("/")
    .filter(Boolean);

  const currentDistrict =
    pathParts.length > 0
      ? pathParts[0]
      : null;
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

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

    if (!form.message.trim()) {
      return toast.error(
        "Message is required"
      );
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "centralbiomedicals",
          "contactQueries"
        ),
        {
          ...form,
          createdAt: new Date(),
        }
      );

      toast.success(
        "Message submitted successfully"
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(
        "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  useEffect(() => {
    const loadDistrict = async () => {
      if (!currentDistrict) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "centralbiomedicals",
            "districts",
            currentDistrict
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
  }, [currentDistrict]);
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadContact();
  }, []);



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

  const hours =
    contactInfo.find(
      (x) => x.label === "Working Hours"
    )?.value || "";

  const dynamicAddress =
    districtData
      ? `${districtData.district}, ${districtData.state}, India`
      : address;

  const mapAddress = encodeURIComponent(
    dynamicAddress
  );
  if (loading) {
    return (
    <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom">

    <div className="grid lg:grid-cols-2 gap-12">

      {/* Left */}
      <div>

        <div className="mb-8 h-12 w-64 animate-pulse rounded-2xl bg-[#DDD6C2]" />

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="mb-6 rounded-[30px] border border-[#E7DFC9] bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-5 h-5 w-40 animate-pulse rounded bg-[#DDD6C2]" />

            <div className="mb-3 h-4 w-full animate-pulse rounded bg-[#ECE7DA]" />

            <div className="mb-3 h-4 w-11/12 animate-pulse rounded bg-[#ECE7DA]" />

            <div className="h-4 w-8/12 animate-pulse rounded bg-[#ECE7DA]" />
          </div>
        ))}

      </div>

      {/* Right */}

      <div className="rounded-[32px] border border-[#DDD6C2] bg-white p-10 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="mb-5 h-14 animate-pulse rounded-2xl bg-[#DDD6C2]"
          />
        ))}

        <div className="mt-8 h-14 w-48 animate-pulse rounded-2xl bg-[#4B6E48]/20" />

      </div>

    </div>

  </div>

</section>
    );
  }
  return (
    <>
      {/* Banner */}
      <PageBanner
        title="Contact Us"
        subtitle="Get in touch with Central Biomedicals for premium diagnostic and biomedical solutions."
      />

      {/* Contact Section */}
      <section className="section-padding bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom grid lg:grid-cols-2 gap-16">

    {/* Left Info */}
    <div>

      {/* Badge */}

      <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-5 py-2 font-semibold text-[#4B6E48]">

        Contact Information

      </span>

      {/* Heading */}

      <h2 className="mt-6 text-4xl font-black leading-tight text-[#2F3E2E] lg:text-5xl">

        Let's Start a Conversation

      </h2>

      {/* Description */}

      <p className="mt-6 max-w-xl leading-8 text-[#666666]">

        Reach out to us for biomedical equipment, laboratory solutions,
        healthcare consultation, installation support, and professional
        diagnostic assistance. Our team is ready to help you choose the
        right solution for your requirements.

      </p>

      {/* Contact Cards */}

      <div className="mt-10 space-y-6">

        {/* Phone */}

        <div className="group flex items-start gap-5 rounded-[32px] border border-[#DDD6C2] bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#4B6E48] hover:bg-[#4B6E48]">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-[#4B6E48] transition-all duration-300 group-hover:bg-white">

            <Phone size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

              Phone Number

            </h4>

            <p className="mt-2 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

              {phone}

            </p>

          </div>

        </div>

        {/* Email */}

        <div className="group flex items-start gap-5 rounded-[32px] border border-[#DDD6C2] bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#4B6E48] hover:bg-[#4B6E48]">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-[#4B6E48] transition-all duration-300 group-hover:bg-white">

            <Mail size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

              Email Address

            </h4>

            <p className="mt-2 break-all text-[#666666] transition-colors duration-300 group-hover:text-white/90">

              {email}

            </p>

          </div>

        </div>

        {/* Address */}

        <div className="group flex items-start gap-5 rounded-[32px] border border-[#DDD6C2] bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#4B6E48] hover:bg-[#4B6E48]">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-[#4B6E48] transition-all duration-300 group-hover:bg-white">

            <MapPin size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

              Office Address

            </h4>

            <p className="mt-2 leading-7 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

              {dynamicAddress}

            </p>

          </div>

        </div>

        {/* Working Hours */}

        <div className="group flex items-start gap-5 rounded-[32px] border border-[#DDD6C2] bg-white p-6 shadow-[0_15px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-[#4B6E48] hover:bg-[#4B6E48]">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B2AC88]/20 text-[#4B6E48] transition-all duration-300 group-hover:bg-white">

            <Clock3 size={24} />

          </div>

          <div>

            <h4 className="text-lg font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

              Working Hours

            </h4>

            <p className="mt-2 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

              {hours}

            </p>

          </div>

        </div>

      </div>

    </div>

    {/* Right Form */}

    <div className="rounded-[36px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:p-10">

      <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-4 py-2 text-sm font-semibold text-[#4B6E48]">

        Get In Touch

      </span>

      <h3 className="mt-5 text-3xl font-black text-[#2F3E2E]">

        Send Us a Message

      </h3>

      <p className="mt-3 leading-7 text-[#666666]">

        Fill out the form below and our team will contact you shortly with
        the best biomedical solution for your requirements.

      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] outline-none transition-all duration-300 placeholder:text-[#888] focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] outline-none transition-all duration-300 placeholder:text-[#888] focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          maxLength={10}
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value.replace(/\D/g, ""),
            })
          }
          className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] outline-none transition-all duration-300 placeholder:text-[#888] focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] outline-none transition-all duration-300 placeholder:text-[#888] focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
        />

        <textarea
          rows={5}
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          className="w-full resize-none rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-[#2F3E2E] outline-none transition-all duration-300 placeholder:text-[#888] focus:border-[#4B6E48] focus:bg-white focus:ring-4 focus:ring-[#B2AC88]/20"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-[#4B6E48] py-4 font-semibold text-white shadow-xl shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F5D3C] hover:shadow-[#4B6E48]/30 disabled:cursor-not-allowed disabled:opacity-70"
        >

          {submitting ? "Submitting..." : "Send Message"}

        </button>

      </form>

    </div>

  </div>

</section>

      {/* Google Map */}
  <section className="pb-24 bg-gradient-to-b from-[#F2F0EF] via-white to-[#B2AC88]/10">

  <div className="container-custom">

    {/* Heading */}

    <div className="mb-12 text-center">

      <span className="inline-flex rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-5 py-2 text-sm font-semibold text-[#4B6E48]">

        Find Us

      </span>

      <h2 className="mt-6 text-4xl lg:text-5xl font-black text-[#2F3E2E]">

        Visit Our Office

      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#666666]">

        Locate our office easily on the map and visit us for expert
        biomedical equipment solutions and professional support.

      </p>

    </div>

    {/* Map */}

    <div className="overflow-hidden rounded-[36px] border border-[#DDD6C2] bg-white p-3 shadow-[0_25px_70px_rgba(0,0,0,0.08)]">

      <iframe
       src={`https://maps.google.com/maps?q=${mapAddress}&z=13&output=embed`}
        width="100%"
        height="550"
        loading="lazy"
        className="w-full rounded-[28px] border-0"
      />

    </div>

  </div>

</section>

      {/* CTA */}
      {/* <CTASection /> */}
    </>
  );
}