import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts'

const COLORS = ["#ff6361", "#2f4b7c"];

export default function DashboardChat({ defaulted, total }) {
    const data = [
        { name: 'Defaulted', value: defaulted },
        { name: 'Total', value: total - defaulted}
    ]

    return (
        <div className='w-full h-80'>
        <h2 className='text-lg font-semibold mb-4'>Defaulted vs Non-Defaulted Clients</h2>
        <ResponsiveContainer>   
            <PieChart>
                <Legend verticalAlign="top" align="left" />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                </Pie>
            <Tooltip />
            </PieChart>
        </ResponsiveContainer>
        </div>
    )
}