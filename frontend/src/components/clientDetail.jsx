import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const BASE = import.meta.env.VITE_ADDS;

const RISK_CONFIG = {
    Low:      { color: "#02c202", bg: "bg-green-100",  text: "text-green-700" },
    Moderate: { color: "#d68b01", bg: "bg-yellow-100", text: "text-yellow-700" },
    High:     { color: "#ef4444", bg: "bg-red-100",    text: "text-red-600" },
    Critical: { color: "#8b0000", bg: "bg-red-200",    text: "text-red-900" },
};

const SEX_MAP      = { 1: "Male", 2: "Female" };
const EDU_MAP      = { 1: "Graduate", 2: "University", 3: "High School", 4: "Others" };
const MARRIAGE_MAP = { 1: "Married", 2: "Single", 3: "Others" };
const PAY_MAP      = { "-2": "No consumption", "-1": "Paid in full", 0: "Revolving credit", 1: "1 month late", 2: "2 months late", 3: "3 months late" };

export default function ClientDetail() {
    const { clientId } = useParams();
    const [client, setClient] = useState(null);

    useEffect(() => {
        fetch(`${BASE}/api/clients/${clientId}`)
            .then((res) => res.json())
            .then(setClient)
            .catch((err) => console.error(err));
    }, [clientId]);

    if (!client) return <p className="p-6 text-gray-400">Loading client details...</p>;

    const risk = RISK_CONFIG[client.risk_label] || RISK_CONFIG.Low;

    const billData = [1,2,3,4,5,6].map((i) => ({
        month: `M-${i}`,
        bill: client[`BILL_AMT${i}`],
        paid: client[`PAY_AMT${i}`],
    }));

    const payHistory = [0,2,3,4,5,6].map((i) => ({
        month: i === 0 ? "M-1" : `M-${i+1}`,
        status: client[i === 0 ? "PAY_0" : `PAY_${i}`],
        label: PAY_MAP[client[i === 0 ? "PAY_0" : `PAY_${i}`]] || "Unknown",
    }));

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Link to="/" className="text-blue-500 text-sm mb-6 inline-block">← Back to Dashboard</Link>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Client #{clientId}</h2>
                    <p className="text-gray-400 text-sm">Credit Risk Profile</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm ${risk.bg} ${risk.text}`}>
                    {client.risk_label} Risk — {(client.risk_score * 100).toFixed(0)}%
                </div>
            </div>

            {/* Risk Score Bar */}
            <div className="bg-white rounded-2xl shadow p-5 mb-5">
                <p className="text-sm text-gray-500 mb-2">Risk Score</p>
                <div className="w-full bg-gray-100 rounded-full h-4">
                    <div
                        className="h-4 rounded-full transition-all"
                        style={{ width: `${client.risk_score * 100}%`, backgroundColor: risk.color }}
                    />
                </div>
                <p className="text-right text-sm mt-1 font-semibold" style={{ color: risk.color }}>
                    {(client.risk_score * 100).toFixed(1)}%
                </p>
            </div>

            {/* Profile Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                {[
                    { label: "Age",        value: client.AGE },
                    { label: "Sex",        value: SEX_MAP[client.SEX] },
                    { label: "Education",  value: EDU_MAP[client.EDUCATION] },
                    { label: "Marriage",   value: MARRIAGE_MAP[client.MARRIAGE] },
                    { label: "Credit Limit", value: `$${client.LIMIT_BAL.toLocaleString()}` },
                    { label: "Defaulted",  value: client["default payment next month"] === 1 ? "Yes" : "No" },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-2xl shadow p-4">
                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                        <p className="text-lg font-semibold">{value}</p>
                    </div>
                ))}
            </div>

            {/* Bill vs Payment Chart */}
            <div className="bg-white rounded-2xl shadow p-5 mb-5">
                <h3 className="font-semibold mb-4">Bill Amount vs Payment (6 Months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={billData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
                        <Bar dataKey="bill" name="Bill Amount" fill="#ef4444" radius={[4,4,0,0]} barSize={20} />
                        <Bar dataKey="paid" name="Amount Paid" fill="#02c202" radius={[4,4,0,0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-2xl shadow p-5">
                <h3 className="font-semibold mb-4">Payment Status History</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {payHistory.map(({ month, status, label }) => (
                        <div key={month} className={`rounded-xl p-3 text-center text-xs ${
                            status <= 0 ? "bg-green-50 text-green-700" :
                            status === 1 ? "bg-yellow-50 text-yellow-700" :
                            "bg-red-50 text-red-600"
                        }`}>
                            <p className="font-bold text-sm mb-1">{month}</p>
                            <p>{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}