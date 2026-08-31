import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import VoucherEmail from '@/emails/VoucherEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    console.log("1. Entró a la ruta /api/send-voucher");
    const data = await request.json();
    console.log("2. Datos recibidos del cliente:", data);

    const clientName = data.clientName || "Cliente";
    const clientEmail = data.clientEmail || data.clientContact;
    const { clientAddress, vehicleType, selectedService, selectedDate, selectedTime, paymentMethod, total, clientPhone } = data;

    const emailHtml = await render(
      <VoucherEmail
        clientName={clientName}
        clientAddress={clientAddress}
        vehicleType={vehicleType}
        selectedService={selectedService}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        paymentMethod={paymentMethod}
        total={total}
      />
    );

    console.log("3. HTML del correo renderizado con éxito");

    const recipientEmail = clientEmail || 'gasper@gasperautodetailing.com';

    // Envío del correo con Resend
    const response = await resend.emails.send({
      from: 'Gasper Auto Detailing <gasper@gasperautodetailing.com>',
      to: [recipientEmail, 'gasper@gasperautodetailing.com'],
      subject: 'Booking Confirmation - Gasper Auto Detailing',
      html: emailHtml,
    });

    console.log("4. Respuesta de Resend:", response);

    // 👉 AQUÍ PUEDES CONECTAR TU API DE SENDPULSE POR HTTP POST DE MANERA LIMPIA
    /*
    try {
      const cleanPhone = clientPhone.replace(/\D/g, '');
      await fetch('AQUÍ_LA_URL_DE_LA_API_DE_SENDPULSE', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer TU_TOKEN_DE_SENDPULSE',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phone: cleanPhone,
          message: `¡Hola ${clientName}! Tu cita para ${selectedService} está confirmada para el ${selectedDate} a las ${selectedTime}.`
        })
      });
    } catch (msgErr) {
      console.log("Error mandando mensaje alternativo:", msgErr);
    }
    */

    return NextResponse.json({ success: true, response });

  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN EL CATCH:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}