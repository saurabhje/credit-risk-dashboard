import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect, useState } from "react";

const BASE = import.meta.env.VITE_ADDS;
export default function BarGraph() {
    const [barData, setBarData] = useState([]);

    useEffect(() => {
        fetch(`${BASE}/api/summary/education`)
            .then((res) => res.json())
            .then(setBarData)
            .catch((err) => console.error("Failed to load bar chart data", err))
    }, []);

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold mb-4">Default Rate by Education</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                    <XAxis
                        dataKey="education"
                        interval={0}
                        angle={-20}
                        dy={10}
                    />

                    <YAxis unit="% " />
                    <Tooltip />
                    <Bar dataKey="default_rate" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}