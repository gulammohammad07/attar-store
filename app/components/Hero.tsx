import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen overflow-hidden bg-[#faf8f4]">
      {/* Hero Image */}
      <div className="absolute inset-0 absolute inset-0 bg-black/20">
        <Image
          src="/images/hero/hero-attar.png"
          alt="Premium Attar"
          fill
          priority
          className="object-contain object-center scale-110"
        />
      </div>

      {/* Dark/Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <p className="uppercase tracking-[8px] text-amber-500 text-sm font-medium">
          Premium Collection
        </p>

        <h1 className="mt-4 text-6xl md:text-8xl font-bold text-white ">
          Premium Attars
        </h1>

        <p className="mt-4 text-white/90 text-lg">Crafted For Every Occasion</p>

        <button className="mt-8 px-8 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition">
          Explore Collection
        </button>
      </div>
    </section>
  );
}

