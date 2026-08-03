export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow">Products</div>

        <div className="bg-white p-6 rounded-2xl shadow">Categories</div>

        <div className="bg-white p-6 rounded-2xl shadow">Orders</div>

        <div className="bg-white p-6 rounded-2xl shadow">Revenue</div>
      </div>
    </div>
  );
}
