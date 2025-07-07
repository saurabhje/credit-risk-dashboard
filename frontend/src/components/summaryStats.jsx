import { useEffect, useState } from "react";

export default function SummaryStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/summary")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load summary", err));
  }, []);

  if (!data) return <p>Loading summary...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm">Total Clients</h2>
        <p className="text-xl font-bold">{data.total_clients}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm">Defaulted</h2>
        <p className="text-xl font-bold">{data.defaulted_clients}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm">Default Rate</h2>
        <p className="text-xl font-bold">{data.default_rate_percent}%</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm">Avg Credit Limit</h2>
        <p className="text-xl font-bold">₹{data.avg_limit_balance.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-gray-500 text-sm">Avg Age</h2>
        <p className="text-xl font-bold">{data.avg_age} yrs</p>
      </div>
    </div>
  );
}
