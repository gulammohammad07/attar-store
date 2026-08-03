import Image from "next/image";
import { Heart } from "lucide-react";
import Link from "next/link";

const products = [
  {
    name: "Hawas",
    price: "₹1,999",
    image: "/images/products/hawas.png",
    slug: "hawas",
  },
  {
    name: "Rasasi",
    price: "₹2,499",
    image: "/images/products/rasasi.png",
    slug: "rasasi",
  },
  {
    name: "Aurum",
    price: "₹1,799",
    image: "/images/products/aurum.png",
    slug: "aurum",
  },
  {
    name: "Wave",
    price: "₹1,599",
    image: "/images/products/wave.png",
    slug: "wave",
  },
];

export default function BestSellers() {
  return (
    <section className="py-24 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-5xl font-bold text-center text-gray-900 mb-14">
          Best Sellers
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 block"
            >
              <div className="relative h-[320px] bg-[#f8f5f0]">
                <button
                  type="button"
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow"
                >
                  <Heart size={18} />
                </button>

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="300px"
                  className="object-contain p-8 group-hover:scale-110 transition duration-700"
                />
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900">
                  {product.name}
                </h3>

                <p className="mt-2 text-amber-600 font-bold">{product.price}</p>

                <button
                  type="button"
                  className="mt-5 w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition"
                >
                  View Product
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
