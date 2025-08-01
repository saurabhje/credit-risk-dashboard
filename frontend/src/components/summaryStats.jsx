import { useEffect, useState } from "react";
import DashboardChat from "./pieChart";
import BarGraph from "./barGraph";
import RiskGraph from "./riskGraph";
const BASE = import.meta.env.VITE_ADDS;
export default function SummaryStats() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/summary`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => console.error("Failed to load summary", err));
  }, []);

  if (!data) return <p>Loading summary...</p>;

  return (
    <div>
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
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <DashboardChat defaulted={data.defaulted_clients} total={data.total_clients} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <BarGraph />
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <RiskGraph />
        </div>
      </div>

    </div>
  );
}
