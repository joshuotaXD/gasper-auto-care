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
    <main className="min-h-screen bg-[#0F0F11] text-white px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-3 border-b border-zinc-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-cyan-400 sm:text-3xl">GASPER ADMIN</h1>
            <p className="text-[11px] text-zinc-400 sm:text-xs">Gestión de Clientes y Reservas</p>
          </div>
          <button
            onClick={fetchBookings}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-700 sm:w-auto"
          >
            🔄 Actualizar
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-2">
          {['Request', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => {
            const count = bookings.filter((b) => b.status === tab).length
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-2 text-[10px] font-bold transition sm:px-4 sm:text-xs ${
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

        {loading ? (
          <p className="text-sm text-zinc-500">Cargando citas...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-sm text-zinc-500">No hay citas en esta sección.</p>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="rounded-xl border border-zinc-800 bg-[#1A1A1E] p-4 shadow-xl shadow-black/10"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white sm:text-lg">{b.customer_name}</span>
                      <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-[10px] text-cyan-400">
                        {b.service_name}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 sm:text-xs">
                      📱 {b.customer_phone} | 🚗 {b.vehicle_type} | 💵 ${b.price}
                    </p>
                    <p className="text-[11px] text-zinc-400 sm:text-xs">
                      📅 {b.booking_date} a las {b.booking_time}
                    </p>
                    <p className="text-[11px] text-zinc-500 sm:text-xs">📍 {b.address}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {b.status === 'Request' && (
                      <button
                        onClick={() => updateStatus(b.id, 'Upcoming')}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-emerald-500 sm:text-xs"
                      >
                        Aceptar Cita
                      </button>
                    )}
                    {b.status === 'Upcoming' && (
                      <button
                        onClick={() => updateStatus(b.id, 'Completed')}
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-blue-500 sm:text-xs"
                      >
                        Marcar Completada
                      </button>
                    )}
                    {b.status !== 'Cancelled' && b.status !== 'Completed' && (
                      <button
                        onClick={() => updateStatus(b.id, 'Cancelled')}
                        className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-[10px] font-bold text-red-400 transition hover:bg-red-900/50 sm:text-xs"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
