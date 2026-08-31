import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    console.log("--> 1. Entró a la API de bookings (Guardando en Supabase)");
    const data = await request.json();
    const { name, phone, address, vehicleType, serviceName, price, date, timeslot } = data;

    // Guardar en Supabase usando tus columnas reales
    const { error: dbError } = await supabase
      .from('appointments')
      .insert([{
        client_name: name,
        client_contact: phone,
        client_address: address,
        vehicle_type: vehicleType,
        service_name: serviceName,
        booking_date: date,
        booking_time: timeslot,
      }])
      .select();

    if (dbError) {
      console.log("--> Error en Supabase:", dbError.message);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 400 });
    }
    
    console.log("--> 2. Se guardó en Supabase con éxito");
    return NextResponse.json({ success: true, message: 'Reserva guardada correctamente en la base de datos.' });

  } catch (error) {
    console.error("Error general en bookings:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}