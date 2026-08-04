interface Brand {
  id: string;
  name: string;
  slug: string;
}

export default function BrandTable({ brands }: { brands: Brand[] }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Slug</th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} className="border-b">
              <td className="p-4">{brand.name}</td>
              <td className="p-4">{brand.slug}</td>
            </tr>
          ))}

          {brands.length === 0 && (
            <tr>
              <td colSpan={2} className="p-8 text-center">
                No Brands
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
