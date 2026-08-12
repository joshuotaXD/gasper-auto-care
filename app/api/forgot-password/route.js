import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

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

    // 1. Validar si el usuario existe en Supabase antes de enviar nada
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = users?.users.some(u => u.email === email);

    if (!userExists) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 400 });
    }

    // 2. Generar código de 6 dígitos
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Generar el enlace de recuperación oficial de Supabase por debajo (para aprovechar su token seguro)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (linkError) throw linkError;

    // 4. Enviar el correo personalizado con Resend
    await resend.emails.send({
      from: 'Gasper <onboarding@resend.dev>',
      to: [email],
      subject: 'Password Recovery Code - Gasper',
      html: getEmailTemplate(verificationCode),
    });

    // Guardamos temporalmente el código generado en la respuesta o metadata si lo requieres,
    // o puedes usar directamente el sistema nativo de recuperación de Supabase.
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}