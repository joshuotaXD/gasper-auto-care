import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import VoucherEmail from '../../../emails/VoucherEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    console.log("1. Entró a la ruta /api/send-voucher");
    
   const data = await request.json();
    console.log("2. Datos recibidos del cliente:", data);

    // Ajustamos para leer los nombres exactos que manda tu formulario
   // 1. Extraemos también clientAddress de los datos recibidos del cliente
const clientName = data.clientName || "Cliente";
const clientEmail = data.clientContact || data.clientEmail;
const { clientAddress, vehicleType, selectedService, selectedDate, selectedTime, paymentMethod, total } = data; // <-- Añadido aquí


const emailHtml = await render(
  <VoucherEmail
    clientName={clientName}
    clientAddress={clientAddress}
    vehicleType={vehicleType} // <-- 2. Se lo pasamos al componente como propiedad
    selectedService={selectedService}
    selectedDate={selectedDate}
    selectedTime={selectedTime}
    paymentMethod={paymentMethod}
    total={total}
  />
);
    console.log("3. HTML del correo renderizado con éxito");

  // Validamos si clientContact tiene una '@', si no, te mandamos el correo a ti para que no falle
const recipientEmail = (data.clientContact && data.clientContact.includes('@')) 
  ? data.clientContact 
  : 'gasper@gasperautodetailing.com';

const response = await resend.emails.send({
  from: 'Gasper Auto Detailing <gasper@gasperautodetailing.com>',
  to: recipientEmail, // Aquí ya va un correo 100% válido garantizado
  bcc: ['gasper@gasperautodetailing.com'], 
  subject: 'Booking Confirmation - Gasper Auto Detailing',
  html: emailHtml,
});

    console.log("4. Respuesta de Resend:", response);
    return NextResponse.json({ success: true, response });

  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN EL CATCH:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}