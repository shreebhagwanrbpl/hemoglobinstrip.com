import { ArrowUpRight } from "lucide-react";

export default function ServiceCard({
  icon,
  title,
  description,
  loading = false,
}) {

  if (loading) {
    return (
     <div className="animate-pulse rounded-[36px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

  {/* Icon */}

  <div className="mb-7 h-16 w-16 rounded-[22px] bg-[#ECE7DA]"></div>

  {/* Title */}

  <div className="mb-5 h-8 w-3/4 rounded-lg bg-[#DDD6C2]"></div>

  {/* Description */}

  <div className="space-y-3">

    <div className="h-4 rounded bg-[#ECE7DA]"></div>

    <div className="h-4 w-11/12 rounded bg-[#ECE7DA]"></div>

    <div className="h-4 w-8/12 rounded bg-[#ECE7DA]"></div>

  </div>

  {/* Bottom Accent */}

  <div className="mt-8 h-1.5 w-16 rounded-full bg-[#DDD6C2]"></div>

</div>
    );
  }

  return (
  <div className="group rounded-[36px] border border-[#DDD6C2] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-3 hover:border-[#4B6E48] hover:bg-[#4B6E48] hover:shadow-[0_25px_70px_rgba(75,110,72,0.18)]">

  {/* Icon */}

  <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-[24px] border border-[#DDD6C2] bg-[#F8F6F2] text-[#4B6E48] transition-all duration-500 group-hover:scale-110 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">

    {icon}

  </div>

  {/* Title */}

  <h3 className="mb-4 text-2xl font-bold text-[#2F3E2E] transition-colors duration-300 group-hover:text-white">

    {title}

  </h3>

  {/* Description */}

  <p className="leading-8 text-[#666666] transition-colors duration-300 group-hover:text-white/90">

    {description}

  </p>

  {/* Bottom Accent */}

  <div className="mt-8 h-1.5 w-16 rounded-full bg-[#B2AC88] transition-all duration-300 group-hover:w-24 group-hover:bg-white"></div>

</div>
  );
}
