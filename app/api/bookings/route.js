import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const handleConfirmBooking = async () => {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: nameState,
      vehicleType: vehicleState,
      date: dateState,
      timeSlot: timeSlotState
    })
  });

  const result = await response.json();
  if (result.success) {
    alert("Booking confirmed successfully!");
  }
};

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, vehicleType, date, timeSlot } = data;

    // 1. Guardar la reservación en tu tabla de Supabase (reemplaza 'bookings' por el nombre real de tu tabla)
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([{ name, vehicle_type: vehicleType, date, time_slot: timeSlot }]);

    if (dbError) throw dbError;

    // 2. Enviar el correo de notificación al administrador con Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev', // O tu dominio verificado
      to: 'tu-correo@ejemplo.com', // Tu correo de administrador
      subject: `Nueva Reserva: ${service || 'Auto Detailing'}`,
      html: `
        <h2>¡Tienes una nueva reserva!</h2>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Vehículo:</strong> ${vehicleType}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${timeSlot}</p>
      `
    });

    return NextResponse.json({ success: true, message: 'Booking confirmed successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}