"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Asegúrate de que tu archivo de supabase.js esté bien configurado

export default function AdminReservations() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Esta función trae los datos de Supabase
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings') // Tabla
          .select('*');     // Trae todo

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error("Error al traer reservas:", err);
        setError(err.message);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Panel de Reservas</h1>
      
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {bookings.length === 0 ? (
        <p className="text-gray-400">No hay reservas aún. Haz una prueba en la página principal.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b.id} className="border border-zinc-800 p-4 rounded bg-zinc-900">
              <p className="font-bold">{b.name}</p>
              <p className="text-sm text-gray-400">Vehículo: {b.vehicle_type} | Fecha: {b.date} | Hora: {b.time_slot}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}