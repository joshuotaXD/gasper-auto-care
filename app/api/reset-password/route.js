import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Inicializa Resend con tu API Key (debes obtenerla en resend.com)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // Envía el correo usando Resend
    const data = await resend.emails.send({
      from: 'Gasper <onboarding@resend.dev>', // Puedes cambiarlo por tu dominio verificado después
      to: [email],
      subject: 'Código de recuperación de contraseña - Gasper',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #0F0F11; color: #ffffff; padding: 24px; border-radius: 12px;">
          <h2 style="color: #22d3ee; margin-top: 0;">Recuperación de Contraseña</h2>
          <p style="color: #a1a1aa;">Has solicitado restablecer tu contraseña en Gasper. Utiliza el siguiente código de verificación:</p>
          <div style="background-color: #1a1a1e; border: 1px solid #27272a; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #22d3ee; border-radius: 8px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #71717a; font-size: 12px;">Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}