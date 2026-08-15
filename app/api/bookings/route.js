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
    const { name, vehicleType, date, timeslot } = data;

    // 1. Guardar en Supabase (agregamos .select() para forzar la ejecución)
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([{ name, vehicle_type: vehicleType, date, time_slot: timeslot }])
      .select();

    if (dbError) {
      console.error("Error en Supabase:", dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 400 });
    }

    // 2. Enviar correo con Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'tu-correo@ejemplo.com', // Asegúrate de poner tu correo real aquí
      subject: `Nueva Reserva: ${vehicleType || 'Auto Detailing'}`,
      html: `
        <h2>Tienes una nueva reserva!</h2>
        <p><strong>Cliente:</strong> ${name}</p>
        <p><strong>Vehículo:</strong> ${vehicleType}</p>
        <p><strong>Fecha:</strong> ${date}</p>
        <p><strong>Hora:</strong> ${timeslot}</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Reserva guardada y correo enviado" });

  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}