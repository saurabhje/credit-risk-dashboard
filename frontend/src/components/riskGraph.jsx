import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, LabelList, Cell  } from "recharts";
const BASE = import.meta.env.VITE_ADDS;
const RISK_LABELS = ["Low", "Medium", "High"];

export default function RiskGraph () {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`${BASE}/api/summary/risk-score`)
            .then((res) => res.json())
            .then((raw) => {
                const transformed = raw.map((item) => ({
                    name: RISK_LABELS[item.risk_tier] || `Tier ${item.risk_tier}`,
                    count: item.count,
                }));
                setData(transformed);
            })
            .catch((err) => console.error("Failed to load risk tier data", err));
    }, []);

    return (
        <div>
            <h2 className="font-semibold text-lg mb-4">Clients by Risk Tier</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" barSize={50}>
                        <LabelList dataKey="count" position="top" fill="#333" />
                        {
                            data.map((entry, index) => (
                                <Cell 
                                    key={index}
                                    fill={entry.name === "High" ? "#a90000ff" : entry.name === "Medium" ? "#d68b01ff" : "#02c202ff" }
                                />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}