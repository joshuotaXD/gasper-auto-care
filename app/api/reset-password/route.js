import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Faltan datos requeridos.' }, { status: 400 })
    }

    const data = await resend.emails.send({
      from: 'Gasper Auto Detailing <onboarding@resend.dev>',
      to: [email],
      subject: 'Código de recuperación de contraseña - GASPER',
      html: `
        <div style="font-family: sans-serif; background-color: #0f0f11; color: #ffffff; padding: 20px; border-radius: 10px;">
          <h2 style="color: #22d3ee;">GASPER AUTO DETAILING</h2>
          <p>Has solicitado restablecer tu contraseña. Usa el siguiente código de verificación:</p>
          <div style="background-color: #1a1a1e; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; color: #22d3ee; margin: 20px 0;">
            ${code}
          </div>
          <p style="font-size: 12px; color: #a1a1aa;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
