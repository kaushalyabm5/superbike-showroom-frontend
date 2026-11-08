'use client';

import { useState, FormEvent } from 'react';
import jsPDF from 'jspdf';

interface Bike {
  bike_id: number;
  brand: string;
  model: string;
  price: number;
  stock: number;
}

interface BikeCardProps {
  bike: Bike;
  onDelete: (id: number) => void;
  onUpdate: (updatedBike: Bike) => void;
  onSale: () => void;
}

export default function BikeCard({ bike, onDelete, onUpdate, onSale }: BikeCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Edit states
  const [brand, setBrand] = useState(bike.brand);
  const [model, setModel] = useState(bike.model);
  const [price, setPrice] = useState(bike.price.toString());
  const [stock, setStock] = useState(bike.stock.toString());

  // Buyer states
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');

  // Function to generate and download PDF invoice
  const generatePDFInvoice = (customerName: string, customerPhone: string) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Header styling
    doc.setFillColor(20, 20, 20);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('SUPERBIKE SHOWROOM', 14, 25);

    // Invoice Meta
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, 150, 25);

    // Bill To Section
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Details:', 14, 60);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${customerName}`, 14, 70);
    doc.text(`Phone: ${customerPhone}`, 14, 78);

    // Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 95, 182, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item Description', 20, 102);
    doc.text('Price ($)', 160, 102);

    // Item Details
    doc.setFont('helvetica', 'normal');
    doc.text(`${bike.brand} ${bike.model} (Superbike)`, 20, 115);
    doc.text(`$${Number(bike.price).toLocaleString()}`, 160, 115);

    // Divider Line
    doc.setLineWidth(0.5);
    doc.line(14, 130, 196, 130);

    // Total Amount
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Total Amount:', 120, 145);
    doc.setTextColor(220, 38, 38);
    doc.text(`$${Number(bike.price).toLocaleString()}`, 160, 145);

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text('Thank you for your business with Superbike Showroom!', 14, 180);

    // Save PDF
    doc.save(`Invoice_${bike.brand}_${bike.model}.pdf`);
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${bike.brand} ${bike.model}?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bikes/${bike.bike_id}`, {
        method: 'DELETE',
      });
      if (response.ok) onDelete(bike.bike_id);
    } catch (err) {
      console.error('Error deleting bike:', err);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/bikes/${bike.bike_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          model,
          price: parseFloat(price),
          stock: parseInt(stock),
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        onUpdate({
          bike_id: bike.bike_id,
          brand,
          model,
          price: parseFloat(price),
          stock: parseInt(stock),
        });
      }
    } catch (err) {
      console.error('Error updating bike:', err);
    }
  };

  const handleBuy = async (e: FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) {
      alert('Please enter buyer name and phone number.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bike_id: bike.bike_id,
          name: buyerName,
          phone: buyerPhone,
          email: buyerEmail,
        }),
      });

      if (response.ok) {
        alert('Purchase successful! Generating PDF Invoice...');
        
        // Generate and download PDF receipt
        generatePDFInvoice(buyerName, buyerPhone);

        setIsBuying(false);
        setBuyerName('');
        setBuyerPhone('');
        setBuyerEmail('');
        onSale();
      } else {
        alert('Failed to process purchase.');
      }
    } catch (err) {
      console.error('Error processing sale:', err);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-red-500 transition-all flex flex-col justify-between">
      {isEditing ? (
        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-red-400">Edit Bike Details</h4>
          <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Brand" />
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Model" />
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Price" />
          <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Stock" />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded">Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-3 rounded">Cancel</button>
          </div>
        </form>
      ) : isBuying ? (
        <form onSubmit={handleBuy} className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-green-400">Customer Checkout</h4>
          <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Customer Name" required />
          <input type="text" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Phone Number" required />
          <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white" placeholder="Email (Optional)" />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-3 rounded">Confirm & Download Invoice</button>
            <button type="button" onClick={() => setIsBuying(false)} className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-2 px-3 rounded">Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400 bg-red-950/50 px-3 py-1 rounded-full">
              {bike.brand}
            </span>
            <div className="flex gap-2 items-center">
              <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-blue-400 transition-colors p-1 text-xs font-bold" title="Edit Bike">Edit</button>
              <button onClick={handleDelete} className="text-gray-500 hover:text-red-500 transition-colors p-1 text-sm font-bold" title="Delete Bike">✕</button>
            </div>
          </div>
          <h3 className="text-2xl font-bold mt-4 mb-2">{bike.model}</h3>
          <p className="text-xl font-semibold text-green-400 mb-4">
            ${Number(bike.price).toLocaleString()}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-800 pt-4 mt-4">
        <div>
          <span>Stock: </span>
          <span className="font-bold text-white">{bike.stock} units</span>
        </div>
        {!isEditing && !isBuying && bike.stock > 0 && (
          <button
            onClick={() => setIsBuying(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all"
          >
            Buy Bike
          </button>
        )}
      </div>
    </div>
  );
}