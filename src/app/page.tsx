'use client';

import { useEffect, useState } from 'react';

// බයික් එකක දත්ත ආකෘතිය (TypeScript Interface)
interface Bike {
  bike_id: number;
  brand: string;
  model: string;
  price: number;
  stock: number;
}

export default function Home() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);

  // සර්වර් එකෙන් (Backend) බයික් දත්ත ලබා ගැනීම
  useEffect(() => {
    fetch('http://localhost:5000/api/bikes')
      .then((res) => res.json())
      .then((data) => {
        setBikes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching bikes:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 tracking-wide text-red-500">
          SUPERBIKE SHOWROOM
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Explore our exclusive collection of high-performance super bikes
        </p>

        {loading ? (
          <p className="text-center text-gray-500">Loading bikes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <div 
                key={bike.bike_id} 
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-red-500 transition-all"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/50 px-3 py-1 rounded-full">
                  {bike.brand}
                </span>
                <h2 className="text-2xl font-bold mt-4 mb-2">{bike.model}</h2>
                <p className="text-xl font-semibold text-green-400 mb-4">
                  ${Number(bike.price).toLocaleString()}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-800 pt-4">
                  <span>Stock Available:</span>
                  <span className="font-bold text-white">{bike.stock} units</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}