'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Ajusta la ruta a tu cliente de supabase

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('booking_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0F0F11] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard: Bookings</h1>
      
      {loading ? (
        <p className="text-zinc-400">Loading bookings...</p>
      ) : (
        <div className="bg-[#16181d] border border-zinc-800 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-400">
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Client</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Service</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
                  <td className="p-4 text-sm font-medium">{apt.booking_date}</td>
                  <td className="p-4 text-sm text-cyan-400">{apt.booking_time}</td>
                  <td className="p-4 text-sm">
                    <div className="font-bold">{apt.client_name}</div>
                    <div className="text-xs text-zinc-500">{apt.client_contact}</div>
                  </td>
                  <td className="p-4 text-sm">{apt.vehicle_type}</td>
                  <td className="p-4 text-sm">{apt.service_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}