export default function Categories() {
  const categories = [
    "Oud",
    "Musk",
    "Rose",
    "Amber",
    "Floral",
    "Gift Sets",
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900">
          Shop By Category
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
          {categories.map((category) => (
            <div
              key={category}
              className="bg-[#FAF8F4] rounded-2xl p-8 text-center cursor-pointer hover:shadow-xl transition-all duration-300"
            >
              <h3 className="font-semibold text-gray-800">
                {category}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}