import Image from "next/image";

export default function ProductPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-16">
        <div className="relative h-[600px] bg-[#faf8f4] rounded-3xl">
          <Image
            src="/images/products/hawas.png"
            alt="Hawas"
            fill
            sizes="600px"
            className="object-contain p-10"
          />
        </div>

        <div>
          <h1 className="text-5xl font-bold">Hawas</h1>

          <p className="mt-6 text-3xl font-semibold text-amber-600">₹1,999</p>

          <p className="mt-8 text-gray-600">
            Premium luxury fragrance crafted for everyday elegance.
          </p>

          <button className="mt-10 bg-black text-white px-10 py-4 rounded-full">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
