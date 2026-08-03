export default function AddProductPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Add Product</h1>

      <form className="bg-white rounded-3xl p-8 shadow-sm max-w-3xl space-y-6">
        <div>
          <label className="block mb-2 font-medium">Product Name</label>

          <input
            type="text"
            className="w-full border rounded-xl p-3"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Slug</label>

          <input
            type="text"
            className="w-full border rounded-xl p-3"
            placeholder="hawas-attar"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Price</label>

          <input
            type="number"
            className="w-full border rounded-xl p-3"
            placeholder="1999"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>

          <textarea rows={5} className="w-full border rounded-xl p-3" />
        </div>

        <div>
          <label className="block mb-2 font-medium">Image URL</label>

          <input
            type="text"
            className="w-full border rounded-xl p-3"
            placeholder="https://..."
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-8 py-3 rounded-xl"
        >
          Save Product
        </button>
      </form>
    </div>
  );
}
