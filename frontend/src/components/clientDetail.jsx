import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatValue } from '../utils/fieldVals';

const BASE = import.meta.env.VITE_ADDS;
export default function ClientDetail() {
    const { clientId } = useParams();
    const [client, setClient] = useState(null);

    useEffect(() => {
        fetch(`${BASE}/api/clients/${clientId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(setClient)
            .catch((error) => console.error('Error fetching client details:', error));
    }, [clientId]);

    if (!client) return <p className='p-6'>Loading client details...</p>;
    return (
        <div className='p-6'>
            <Link to="/" className="text-blue-600 underline mb-4 inline-block">
                ← Back to Dashboard
            </Link>
            <h2 className='text-xl font-bold mb-4'>Client #{clientId}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {Object.entries(client).map(([key, value]) => (
                    <div key={key} className='p-4 rounded shadow'>
                        <p className='text-gray-500 text-sm'>{key}</p>
                        <p className='text-lg font-semibold'>{formatValue(key,value)}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}   