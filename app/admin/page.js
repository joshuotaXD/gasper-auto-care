'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminBookingsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('todos');
  const router = useRouter();

  useEffect(() => {
    async function checkAdminAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      fetchAppointments();
      setLoading(false);
    }
    checkAdminAndFetch();
  }, [router]);

  // Función para obtener las reservas desde Supabase
  async function fetchAppointments() {
    // Asegúrate de tener una tabla llamada 'appointments' o 'reservas' en tu base de datos
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAppointments(data);
    }
  }

  // Función para cambiar el estado de la cita (ej. Confirmada, Cancelada, Completada)
  async function updateAppointmentStatus(id, newStatus) {
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar la cita: ' + error.message);
    } else {
      fetchAppointments(); // Recargar la lista
    }
  }

  // Función para eliminar/cancelar definitivamente una cita
  async function deleteAppointment(id) {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      fetchAppointments();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center font-bold">
        Cargando panel de administración...
      </div>
    );
  }

  const filteredAppointments = appointments.filter(item => {
    if (filterStatus === 'todos') return true;
    return item.status === filterStatus;
  });

  return (
    <main className="min-h-screen bg-[#0F0F11] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-zinc-800 pb-6 gap-4">
          <div>
            <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
              Panel de Control
            </span>
            <h1 className="text-3xl font-extrabold mt-2">Gestión de Citas y Usuarios</h1>
            <p className="text-sm text-zinc-400 mt-1">Monitorea el movimiento de reservas, cambia estados o cancela citas.</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="bg-zinc-800 hover:bg-zinc-700 text-sm font-bold px-5 py-2.5 rounded-xl transition border border-zinc-700 shadow-md"
          >
            ← Volver al Sitio Web
          </button>
        </div>

        {/* FILTROS RÁPIDOS */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-zinc-400 mr-2">Filtrar por:</span>
          {['todos', 'pendiente', 'confirmada', 'cancelada'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                filterStatus === status 
                  ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' 
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* TABLA DE MOVIMIENTO DE USUARIOS */}
        <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="border-b border-zinc-800 text-xs uppercase text-cyan-400">
                <tr>
                  <th className="py-3.5 px-4">Cliente / Contacto</th>
                  <th className="py-3.5 px-4">Vehículo</th>
                  <th className="py-3.5 px-4">Servicio</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones de Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-zinc-500">
                      No hay registros de reservas bajo este filtro. (Asegúrate de tener creada la tabla `appointments` en Supabase).
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-4 px-4">
                        <p className="font-bold text-white">{item.name || 'Sin nombre'}</p>
                        <p className="text-xs text-zinc-400">{item.phone_or_email || 'Sin contacto'}</p>
                      </td>
                      <td className="py-4 px-4 font-medium text-zinc-200">
                        {item.vehicle_type || 'No especificado'}
                      </td>
                      <td className="py-4 px-4 text-cyan-300 font-semibold">
                        {item.service_title || 'Servicio General'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          item.status === 'confirmada' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          item.status === 'cancelada' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {item.status || 'pendiente'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {/* Botón para confirmar */}
                        <button
                          onClick={() => updateAppointmentStatus(item.id, 'confirmada')}
                          className="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                          title="Confirmar cita"
                        >
                          Confirmar
                        </button>

                        {/* Botón para cancelar */}
                        <button
                          onClick={() => updateAppointmentStatus(item.id, 'cancelada')}
                          className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                          title="Cancelar cita"
                        >
                          Cancelar
                        </button>

                        {/* Botón para eliminar */}
                        <button
                          onClick={() => deleteAppointment(item.id)}
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                          title="Eliminar registro"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}