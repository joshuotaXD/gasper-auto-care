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
    const { name, phone, address, vehicleType, serviceName, price, date, timeslot } = data;

    // 1. Guardar en Supabase usando los nombres exactos de columnas
    const { error: dbError } = await supabase
      .from('bookings')
      .insert([{ 
        customer_name: name, 
        customer_phone: phone, 
        address: address,
        vehicle_type: vehicleType, 
        service_name: serviceName,
        price: price ? parseFloat(price) : null,
        booking_date: date, 
        booking_time: timeslot,
        status: 'pending' // Estado inicial por defecto
      }])
      .select();

    if (dbError) {
      console.error("Error en Supabase:", dbError);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 400 });
    }

    // 2. Enviar correo con Resend
    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'tu-correo@ejemplo.com', // Pon aquí tu correo para recibir las alertas
        subject: `Nueva Reserva: ${serviceName || 'Auto Detailing'}`,
        html: `
          <h2>¡Tienes una nueva reserva!</h2>
          <p><strong>Cliente:</strong> ${name}</p>
          <p><strong>Teléfono:</strong> ${phone}</p>
          <p><strong>Dirección:</strong> ${address}</p>
          <p><strong>Vehículo:</strong> ${vehicleType}</p>
          <p><strong>Servicio:</strong> ${serviceName}</p>
          <p><strong>Precio:</strong> $${price || '0'}</p>
          <p><strong>Fecha y Hora:</strong> ${date} a las ${timeslot}</p>
        `,
      });
    } catch (emailErr) {
      console.error("Error al enviar correo:", emailErr);
    }

    return NextResponse.json({ success: true, message: "Reserva guardada con éxito" });

  } catch (error) {
    console.error("Error general:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}