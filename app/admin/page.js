'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Request')

  const fetchBookings = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al cargar reservas:', error)
    } else {
      setBookings(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      alert('Error al actualizar: ' + error.message)
    } else {
      fetchBookings()
    }
  }

  const filteredBookings = bookings.filter((b) => b.status === activeTab)

  return (
    <main className="min-h-screen bg-[#0F0F11] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <div>
            <h1 className="text-3xl font-black text-cyan-400">GASPER ADMIN</h1>
            <p className="text-xs text-zinc-400">Gestión de Clientes y Reservas</p>
          </div>
          <button
            onClick={fetchBookings}
            className="bg-zinc-800 hover:bg-zinc-700 text-xs px-3 py-2 rounded-lg border border-zinc-700"
          >
            🔄 Actualizar
          </button>
        </div>

        {/* Pestañas de estado */}
        <div className="flex space-x-2 border-b border-zinc-800 pb-2">
          {['Request', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => {
            const count = bookings.filter((b) => b.status === tab).length
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === tab
                    ? 'bg-cyan-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {tab === 'Request' && 'Solicitudes'}
                {tab === 'Upcoming' && 'Próximas'}
                {tab === 'Completed' && 'Completadas'}
                {tab === 'Cancelled' && 'Canceladas'} ({count})
              </button>
            )
          })}
        </div>

        {/* Lista de reservas */}
        {loading ? (
          <p className="text-sm text-zinc-500">Cargando citas...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay citas en esta sección.</p>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#1A1A1E] border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-white">{b.customer_name}</span>
                    <span className="text-xs bg-zinc-800 text-cyan-400 px-2 py-0.5 rounded border border-zinc-700">
                      {b.service_name}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    📱 {b.customer_phone} | 🚗 {b.vehicle_type} | 💵 ${b.price}
                  </p>
                  <p className="text-xs text-zinc-400">
                    📅 {b.booking_date} a las {b.booking_time}
                  </p>
                  <p className="text-xs text-zinc-500">📍 {b.address}</p>
                </div>

                <div className="flex gap-2">
                  {b.status === 'Request' && (
                    <button
                      onClick={() => updateStatus(b.id, 'Upcoming')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      Aceptar Cita
                    </button>
                  )}
                  {b.status === 'Upcoming' && (
                    <button
                      onClick={() => updateStatus(b.id, 'Completed')}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                    >
                      Marcar Completada
                    </button>
                  )}
                  {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                    <button
                      onClick={() => updateStatus(b.id, 'Cancelled')}
                      className="bg-zinc-800 hover:bg-red-900/50 text-red-400 border border-zinc-700 text-xs px-3 py-1.5 rounded-lg"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
