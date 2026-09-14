interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function BrandTable({ brands }: { brands: Brand[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#111111]/10 bg-white shadow-sm">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f5f0]">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#111111]/60">Name</th>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-[#111111]/60">Slug</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-t border-[#111111]/10 hover:bg-[#f5f5f0]">
                <td className="p-4 text-sm font-medium text-[#111111]">{brand.name}</td>
                <td className="p-4 text-sm text-[#111111]/60">{brand.slug}</td>
              </tr>
            ))}

            {brands.length === 0 && (
              <tr>
                <td colSpan={2} className="p-8 text-center text-[#111111]/50">
                  No Brands
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-[#111111]/10">
        {brands.length === 0 ? (
          <div className="p-8 text-center text-[#111111]/50">
            No Brands
          </div>
        ) : (
          brands.map((brand) => (
            <div
              key={brand.id}
              className="p-4 hover:bg-[#f5f5f0] transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium text-[#111111]">{brand.name}</h3>
                  <p className="mt-1 text-xs text-[#111111]/50">{brand.slug}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}