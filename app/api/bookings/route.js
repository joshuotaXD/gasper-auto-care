import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, vehicleType, date, timeSlot } = data;

    // 1. Guardar en Supabase
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([{ name, vehicle_type: vehicleType, date, time_slot: timeSlot }]);

    if (dbError) throw dbError;

    // 2. Enviar correo con Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tu-correo@ejemplo.com',
      subject: `Nueva Reserva: ${vehicleType || 'Auto Detailing'}`,
      html: `
        <h2>Tienes una nueva reserva!</h2>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Vehículo:</strong> ${vehicleType}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${timeSlot}</p>
      `,
    });

    return NextResponse.json({ success: true, message: 'Booking confirmed successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}