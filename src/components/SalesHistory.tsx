'use client';

import { useEffect, useState } from 'react';

interface Sale {
  sale_id: number;
  sale_date: string;
  customer_name: string;
  customer_phone: string;
  brand: string;
  model: string;
  price: number;
}

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = () => {
    fetch('http://localhost:5000/api/sales')
      .then((res) => res.json())
      .then((data) => {
        setSales(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sales history:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl mt-12">
      <h2 className="text-2xl font-bold mb-6 text-red-400">Sales History & Reports</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Loading sales history...</p>
      ) : sales.length === 0 ? (
        <p className="text-gray-500 text-center">No sales records found yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-800 text-xs uppercase text-gray-400">
              <tr>
                <th className="p-3">Sale ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Bike</th>
                <th className="p-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale.sale_id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-3 font-bold text-white">#{sale.sale_id}</td>
                  <td className="p-3">{new Date(sale.sale_date).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold text-white">{sale.customer_name}</td>
                  <td className="p-3">{sale.customer_phone}</td>
                  <td className="p-3 text-red-400 font-medium">{sale.brand} {sale.model}</td>
                  <td className="p-3 text-right font-semibold text-green-400">${Number(sale.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}