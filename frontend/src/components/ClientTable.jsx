import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
export default function ClientTable() {
    const [clients, setClients] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 10;

    useEffect(() => {
        fetch(`/api/clients?limit=${limit}&offset=${offset}`)
            .then((res) => res.json())
            .then((data) => setClients(data.clients))
            .catch((error) => console.error('Error fetching clients:', error));
    }, [offset]);

    const handNext = () => setOffset((prevOffset) => prevOffset + limit);
    const handPrev = () => setOffset((prevOffset) => Math.max(0, prevOffset - limit));

    return (
        <div className='mt-6'>
            <h2 className='text-xl font-semibold mb-2'> Client Table</h2>
            <table className='min-w-full bg-white shadow rounded-lg overflow-hidden'>
                <thead className='bg-gray-100 text-gray-600 text-left'>
                    <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Credit Limit</th>
                        <th className="px-4 py-2">Age</th>
                        <th className="px-4 py-2">Default?</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id} className='border-t'>
                            <td className='px-4 py-2'>{client.id}</td>
                            <td className='px-4 py-2'>₹{client.LIMIT_BAL}</td>
                            <td className='px-4 py-2'>{client.AGE}</td>
                            <td className='px-4 py-2'>
                                {client.default === 1 ? 'Yes' : 'No'}
                            </td>
                            <td className='px-4 py-2'>
                                <Link to={`/clients/${client.id}`} className='text-blue-600 hover:underline' >View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex gap-4 mt-4'>
                <button
                    onClick={handPrev}
                    disabled={offset === 0}
                    className='px-3 py-2 bg-gray-300 rounded hover:bg-gray-300 disabled:opacity-50'
                >
                    Prev
                </button>
                <button
                    onClick={handNext}
                    className='px-3 py-2 bg-gray-300 rounded hover:bg-gray-300 disabled:opacity-50'
                >
                    Next
                </button>
            </div>
        </div>
    )
}