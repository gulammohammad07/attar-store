import Image from "next/image";

const collections = [
  {
    title: "Oud Collection",
    image: "/images/products/oud.png",
  },
  {
    title: "Hawas",
    image: "/images/products/hawas.png",
  },
  {
    title: "Rasasi",
    image: "/images/products/rasasi.png",
  },
  {
    title: "Aurum",
    image: "/images/products/aurum.png",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">
          Featured Collections
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {collections.map((item) => (
            <div
              key={item.title}
              className="group relative h-[450px] overflow-hidden rounded-3xl bg-[#f8f5f0]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-10 transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/10" />

              <div className="absolute bottom-8 left-8">
                <h3 className="text-3xl font-bold text-black">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
