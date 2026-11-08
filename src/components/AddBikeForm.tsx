'use client';

import { useState, FormEvent } from 'react';

interface AddBikeFormProps {
  onBikeAdded: () => void; // බයික් එකක් එකතු වූ පසු ලැයිස්තුව රිෆ්‍රෙශ් කිරීමට
}

export default function AddBikeForm({ onBikeAdded }: AddBikeFormProps) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!brand || !model || !price || !stock) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bikes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          model,
          price: parseFloat(price),
          stock: parseInt(stock),
        }),
      });

      if (response.ok) {
        setBrand('');
        setModel('');
        setPrice('');
        setStock('');
        onBikeAdded(); // ප්‍රධාන පිටුවට දන්වා ලැයිස්තුව අලුත් කර ගනී
        alert('Bike Added Successfully!');
      } else {
        alert('Error!.');
      }
    } catch (err) {
      console.error('Error adding bike:', err);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl mb-12">
      <h2 className="text-xl font-bold mb-4 text-red-400">Add New Superbike</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Brand (e.g. Kawasaki)"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
        />
        <input
          type="text"
          placeholder="Model (e.g. H2R)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
        />
        <input
          type="number"
          placeholder="Price ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
        />
        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-red-500"
        />
        <button
          type="submit"
          className="md:col-span-4 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all"
        >
          Add Superbike to Showroom
        </button>
      </form>
    </div>
  );
}