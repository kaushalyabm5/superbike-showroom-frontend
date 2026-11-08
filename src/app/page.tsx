'use client';

import { useEffect, useState } from 'react';
import AddBikeForm from '@/components/AddBikeForm';
import BikeCard from '@/components/BikeCard';

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

  const fetchBikes = () => {
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
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const handleBikeDeleted = (deletedId: number) => {
    setBikes(bikes.filter((bike) => bike.bike_id !== deletedId));
  };

  const handleBikeUpdated = (updatedBike: Bike) => {
    setBikes(
      bikes.map((bike) => (bike.bike_id === updatedBike.bike_id ? updatedBike : bike))
    );
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-2 tracking-wide text-red-500">
          SUPERBIKE SHOWROOM
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Explore and manage our exclusive collection of high-performance super bikes
        </p>

        <AddBikeForm onBikeAdded={fetchBikes} />

        <h2 className="text-2xl font-bold mb-6">Available Showroom Inventory</h2>
        
        {loading ? (
          <p className="text-center text-gray-500">Loading bikes...</p>
        ) : bikes.length === 0 ? (
          <p className="text-center text-gray-500">No bikes found in showroom.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bikes.map((bike) => (
              <BikeCard 
                key={bike.bike_id} 
                bike={bike} 
                onDelete={handleBikeDeleted}
                onUpdate={handleBikeUpdated}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}