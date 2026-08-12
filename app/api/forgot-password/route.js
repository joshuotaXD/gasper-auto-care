import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const { email } = await request.json();

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (error) throw error;

    const resetLink = data.properties.action_link;

    await resend.emails.send({
      from: 'Gasper <onboarding@resend.dev>',
      to: [email],
      subject: 'Restablece tu contraseña - Gasper',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
          <h2>¿Solicitaste restablecer tu contraseña?</h2>
          <p>Haz clic en el siguiente botón para crear una nueva contraseña para tu cuenta:</p>
          <a href="${resetLink}" style="background-color: #06b6d4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px;">Restablecer Contraseña</a>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}