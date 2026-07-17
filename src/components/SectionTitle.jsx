export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
}) {
  return (
<div
  className={`${center ? "mx-auto text-center" : ""} max-w-3xl`}
>

  {/* Badge */}

  {badge && (
    <div className="mb-6 inline-flex items-center rounded-full border border-[#B2AC88]/40 bg-[#B2AC88]/15 px-6 py-2.5 text-sm font-semibold tracking-wide text-[#4B6E48] shadow-sm">

      {badge}

    </div>
  )}

  {/* Title */}

  <h2 className="section-title text-[#2F3E2E]">

    {title}

  </h2>

  {/* Decorative Line */}

  <div
    className={`mt-5 h-1.5 rounded-full bg-gradient-to-r from-[#4B6E48] via-[#B2AC88] to-[#4B6E48] ${
      center ? "mx-auto w-24" : "w-24"
    }`}
  />

  {/* Description */}

  <p className="section-subtitle mt-6 text-[#666666] leading-8">

    {description}

  </p>

</div>
  );
}