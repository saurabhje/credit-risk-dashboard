import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, LabelList, Cell } from "recharts";
const BASE = import.meta.env.VITE_ADDS;

export default function RiskGraph() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`${BASE}/api/summary/risk-score`)
            .then((res) => res.json())
            .then((raw) => {
                console.log(Object.keys(raw[0]))
                const transformed = raw.map((item) => ({
                    name: item.risk_label,
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
                                    fill={
                                        entry.name === "Critical" ? "#8b0000" :
                                            entry.name === "High" ? "#ef4444" :
                                                entry.name === "Moderate" ? "#d68b01" :
                                                    "#02c202"
                                    }
                                />
                            ))
                        }
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}