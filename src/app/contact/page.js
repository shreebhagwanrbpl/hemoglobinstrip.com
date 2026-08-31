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
import PageBanner from "@/components/PageBanner";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
} from "lucide-react";

const findContactField = (contactInfo, keywords, defaultValue = "") => {
  if (!Array.isArray(contactInfo)) return defaultValue;
  const found = contactInfo.find(item => {
    const label = String(item.label || "").toLowerCase().trim();
    return keywords.some(keyword => label.includes(keyword.toLowerCase()));
  });
  return found ? found.value : defaultValue;
};

const parsePhoneNumbers = (phoneStr) => {
  if (!phoneStr) return [];
  const str = typeof phoneStr === "string" ? phoneStr : String(phoneStr);
  return str
    .split(/[\n,/;|]+|\s+and\s+|\s+&\s+/i)
    .map((num) => num.trim())
    .filter(Boolean);
};

export default function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [districtData, setDistrictData] = useState(null);
  const [contactInfo, setContactInfo] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const pathname = usePathname();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

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
      : null;

  /* ==========================================================
     FORM CHANGE
  ========================================================== */

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ==========================================================
     FORM SUBMIT
  ========================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex =
      /^[6-9]\d{9}$/;

    if (!form.name.trim()) {
      return toast.error("Name is required");
    }

    if (!emailRegex.test(form.email)) {
      return toast.error("Enter valid email");
    }

    if (!phoneRegex.test(form.phone)) {
      return toast.error("Enter valid mobile number");
    }

    if (!form.message.trim()) {
      return toast.error("Message is required");
    }

    try {
      setSubmitting(true);

      await addDoc(
        collection(
          db,
          "websitesQueries",
          "hemoglobinstripcom",
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

  /* ==========================================================
     LOAD DISTRICT
  ========================================================== */

  useEffect(() => {
    const loadDistrict = async () => {
      if (!currentDistrict) return;

      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "hemoglobinstripcom",
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

  /* ==========================================================
     LOAD CONTACT
  ========================================================== */

  useEffect(() => {
    const loadContact = async () => {
      try {
        const snap = await getDoc(
          doc(
            db,
            "websites",
            "hemoglobinstripcom",
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

  /* ==========================================================
     CONTACT DATA
  ========================================================== */

  const phone = findContactField(
    contactInfo,
    ["phone", "call", "mobile", "contact", "tel"],
    "+91 9983123469\n+91 9983333489"
  );

  const email = findContactField(
    contactInfo,
    ["email", "mail", "write"],
    "rajbiosis@yahoo.in"
  );

  const address = findContactField(
    contactInfo,
    ["address", "location", "office", "business", "map", "place"],
    "F-4, 1st Floor, Plot No. 16, D-Block Tagor Nagar, on Ajmer-Delhi, 200 Feet Bypass Rd, Jaipur, Rajasthan 302021"
  );

  const hours = findContactField(
    contactInfo,
    ["hour", "avail", "time", "working", "open", "day"],
    "Mon - Sat (10AM - 6PM)"
  );

  const dynamicAddress = districtData
    ? `${districtData.district}, ${districtData.state}, India`
    : address;

  const phoneNumbers = parsePhoneNumbers(phone);

  const mapAddress =
    encodeURIComponent(dynamicAddress);

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <section className="section-padding bg-white">

        <div className="container-custom">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>

              <div className="mb-8 h-12 w-64 animate-pulse rounded bg-[#F8F6F2]" />

              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="mb-6 h-28 animate-pulse rounded-3xl bg-[#F8F6F2]"
                />
              ))}

            </div>

            <div className="rounded-3xl border border-[#DDD6C2] bg-white p-10">

              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="mb-5 h-14 animate-pulse rounded-2xl bg-[#F8F6F2]"
                />
              ))}

            </div>

          </div>

        </div>

      </section>
    );
  }

  return (
    <>
      {/* ======================================================
          CONTACT SECTION
      ====================================================== */}
      <PageBanner
        title="Connect With Our Team"
        subtitle="Send your laboratory requirement to the Hemoglobin Strip team and receive practical assistance with products and enquiries."
      />
      <section className="section-padding bg-[#F8F6F2]">

        <div className="container-custom grid gap-14 lg:grid-cols-2">

          {/* ==================================================
              LEFT INFO
          ================================================== */}

          <div>

            {/* Badge */}

            <span className="mb-5 inline-block rounded-full border border-[#DDD6C2] bg-white px-5 py-2 font-semibold text-[#4B6E48]">

              Reach Us Directly

            </span>


            {/* Heading */}

            <h2 className="section-title text-[#3F5D3C]">
              Tell Us What You Need
            </h2>


            {/* Description */}

            <p className="section-subtitle text-slate-600">
              Share your testing requirement, preferred product, quantity or application and our team can help with the next step.
            </p>


            {/* ==================================================
                CONTACT CARDS
            ================================================== */}

            <div className="mt-10 space-y-6">

              {/* Phone */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#DDD6C2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:shadow-[0_15px_40px_rgba(75,110,72,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#4B6E48] text-white shadow-md shadow-[#4B6E48]/20">

                  <Phone size={24} />

                </div>

                <div>

                  <h4 className="text-lg font-semibold text-slate-900">
                    Call Our Team
                  </h4>

                  <div className="mt-2 space-y-1">

                    {phoneNumbers.map(
                      (num, i) => (
                        <p
                          key={i}
                          className="text-[#4B6E48]"
                        >

                          <a
                            href={`tel:${num}`}
                            className="transition hover:text-[#3F5D3C]"
                          >
                            {num}
                          </a>

                        </p>
                      )
                    )}

                  </div>

                </div>

              </div>


              {/* Email */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#DDD6C2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:shadow-[0_15px_40px_rgba(75,110,72,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#4B6E48] text-white shadow-md shadow-[#4B6E48]/20">

                  <Mail size={24} />

                </div>

                <div>

                  <h4 className="text-lg font-semibold text-slate-900">
                    Write To Us
                  </h4>

                  <p className="mt-2 break-all text-[#4B6E48]">
                    {email}
                  </p>

                </div>

              </div>


              {/* Address */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#DDD6C2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:shadow-[0_15px_40px_rgba(75,110,72,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#4B6E48] text-white shadow-md shadow-[#4B6E48]/20">

                  <MapPin size={24} />

                </div>

                <div>

                  <h4 className="text-lg font-semibold text-slate-900">
                    Business Location
                  </h4>

                  <p className="mt-2 leading-7 text-slate-600">
                    {dynamicAddress}
                  </p>

                </div>

              </div>


              {/* Availability */}

              <div className="flex items-start gap-5 rounded-[28px] border border-[#DDD6C2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#B2AC88] hover:shadow-[0_15px_40px_rgba(75,110,72,0.12)]">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#4B6E48] text-white shadow-md shadow-[#4B6E48]/20">

                  <Clock3 size={24} />

                </div>

                <div>

                  <h4 className="text-lg font-semibold text-slate-900">
                    Availability
                  </h4>

                  <p className="mt-2 text-[#4B6E48]">
                    {hours}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ==================================================
              RIGHT FORM
          ================================================== */}

          <div className="rounded-[40px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(75,110,72,0.10)] lg:p-10">

            <h3 className="text-3xl font-bold text-slate-900">
              Send Your Requirement
            </h3>

            <p className="mt-3 text-slate-600">
              Add the key details of your requirement below so we can understand your enquiry clearly.
            </p>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              {/* Name */}

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4B6E48] focus:ring-2 focus:ring-[#4B6E48]/15"
              />


              {/* Email */}

              <input
                type="email"
                name="email"
                placeholder="Write To Us"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4B6E48] focus:ring-2 focus:ring-[#4B6E48]/15"
              />


              {/* Phone */}

              <input
                type="tel"
                name="phone"
                placeholder="Call Our Team"
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value.replace(
                      /\D/g,
                      ""
                    ),
                  })
                }
                className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4B6E48] focus:ring-2 focus:ring-[#4B6E48]/15"
              />


              {/* Subject */}

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4B6E48] focus:ring-2 focus:ring-[#4B6E48]/15"
              />


              {/* Message */}

              <textarea
                rows={5}
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                className="w-full resize-none rounded-2xl border border-[#DDD6C2] bg-[#F8F6F2] px-5 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4B6E48] focus:ring-2 focus:ring-[#4B6E48]/15"
              />


              {/* Submit */}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#4B6E48] py-4 font-semibold !text-white shadow-lg shadow-[#4B6E48]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F5D3C] hover:shadow-xl hover:shadow-[#4B6E48]/25 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >

                {submitting
                  ? "Submitting..."
                  : "Send Message"}

              </button>

            </form>

          </div>

        </div>

      </section>


      {/* ======================================================
          GOOGLE MAP
      ====================================================== */}

      <section className="bg-white pb-24">

        <div className="container-custom">

          <div className="overflow-hidden rounded-[40px] border border-[#DDD6C2] shadow-lg shadow-[#4B6E48]/10">

            <iframe
              src={`https://maps.google.com/maps?q=${mapAddress}&z=13&output=embed`}
              width="100%"
              height="500"
              loading="lazy"
              className="w-full border-0"
            />

          </div>

        </div>

      </section>

    </>
  );
}