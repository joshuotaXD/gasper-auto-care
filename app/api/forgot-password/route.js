import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// HTML template with the verification code design in English
const getEmailTemplate = (code) => {
  return `
    <div style="background-color: #0f0f11; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 16px; max-width: 500px; margin: auto;">
      <h2 style="color: #06b6d4; font-size: 24px; margin-bottom: 16px;">Password Recovery</h2>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
        You have requested to reset your password on Gasper. Use the following verification code:
      </p>
      <div style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <span style="color: #06b6d4; font-size: 36px; font-weight: bold; letter-spacing: 6px;">${code}</span>
      </div>
      <p style="color: #71717a; font-size: 12px;">
        If you did not request this change, you can safely ignore this message.
      </p>
    </div>
  `;
};

export async function POST(request) {
  try {
    const { email } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    if (!supabaseUrl || !serviceKey || !resendKey) {
      throw new Error('Missing server environment variables.');
    }

    const resend = new Resend(resendKey);
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);

    // 1. Usamos Supabase para generar el código OTP de recuperación real
    const { data, error } = await supabaseAdmin.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false, // Evita registrar cuentas nuevas si el correo no existe
      },
    });

    if (error) throw error;

    // Nota: Como Supabase envía su propio correo por defecto al usar signInWithOtp,
    // para evitar que le llegue el correo feo de Supabase y mandarle SÓLO el tuyo de Resend,
    // puedes configurar un "Custom Mailer" en Supabase o usar la generación de tokens por base de datos.
    // Sin embargo, para capturar el código exacto que manda Supabase y pintarlo en tu diseño de Resend:
    
    // (Opcional si quieres usar un número aleatorio controlado por ti y validarlo manualmente en tu BD):
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // 2. Enviamos el correo exclusivamente con Resend usando tu diseño estilizado
    await resend.emails.send({
      from: 'Gasper <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Recovery Code - Gasper',
      html: getEmailTemplate(verificationCode),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}