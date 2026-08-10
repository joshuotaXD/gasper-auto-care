import { NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function POST(request) {
  try {
    const { phone, code } = await request.json()

    await client.messages.create({
      body: `Tu código de recuperación para Gasper es: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error enviando SMS:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
