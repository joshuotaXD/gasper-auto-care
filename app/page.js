'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SERVICES = [
  { name: 'Engine wash', basePrice: 60 },
  { name: 'Headlight restoration', basePrice: 90 },
  { name: 'Standard Wash / Regular cleaning', basePrice: 120 },
  { name: 'Deep cleaning', basePrice: 220 },
  { name: 'Polishing and waxing', basePrice: 550 },
  { name: 'CERAMIC COATING', basePrice: 1100 },
]

const VEHICLES = ['Coupe / Sedan', 'Mid-Sized SUV', 'Large SUV / Truck', 'Motorcycle']

function BrandLogo() {
  return (
    <div className="mb-6 flex justify-center">
      <svg viewBox="0 0 720 520" className="w-full max-w-[420px] drop-shadow-[0_0_22px_rgba(34,211,238,0.35)]">
        <circle cx="360" cy="260" r="240" fill="none" stroke="#F4F4F5" strokeWidth="12" />
        <rect x="110" y="210" width="500" height="110" rx="18" fill="#0B0B0D" stroke="#F4F4F5" strokeWidth="6" />
        <path d="M200 232 L265 200 L420 200 L505 232 L545 232 L545 290 L170 290 L170 232 Z" fill="#07B6D6" opacity="0.92" />
        <path d="M225 234 L275 206 H420 L480 234" fill="none" stroke="#E5F9FF" strokeWidth="8" strokeLinecap="round" />
        <path d="M200 286 H530" stroke="#E5F9FF" strokeWidth="8" strokeLinecap="round" />
        <circle cx="240" cy="302" r="36" fill="#0B0B0D" stroke="#E5F9FF" strokeWidth="8" />
        <circle cx="240" cy="302" r="14" fill="#E5F9FF" />
        <circle cx="480" cy="302" r="36" fill="#0B0B0D" stroke="#E5F9FF" strokeWidth="8" />
        <circle cx="480" cy="302" r="14" fill="#E5F9FF" />
        <path d="M260 180 L280 155 L300 180" stroke="#F4F4F5" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M420 180 L440 155 L460 180" stroke="#F4F4F5" strokeWidth="6" fill="none" strokeLinecap="round" />
        <text x="360" y="175" textAnchor="middle" fontSize="90" fontWeight="900" fill="#1ED9FF" letterSpacing="4">GASPER</text>
        <text x="360" y="420" textAnchor="middle" fontSize="56" fontWeight="800" fill="#F4F4F5" letterSpacing="6">AUTO DETAILING</text>
      </svg>
    </div>
  )
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authMode, setAuthMode] = useState('login') // 'login', 'register', 'forgot', 'verify_code'
  
  // Campos del usuario
  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [password, setPassword] = useState('')
  
  // Recuperación
  const [resetEmail, setResetEmail] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const [authError, setAuthError] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  // Formulario de Reserva
  const [formData, setFormData] = useState({
    vehicle_type: VEHICLES[0],
    service_name: SERVICES[0].name,
    price: SERVICES[0].basePrice,
    booking_date: '',
    booking_time: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Manejar Registro / Login
  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthMessage('')
    setAuthLoading(true)

    if (authMode === 'register') {
      if (!firstName || !lastName || !email || !phone || !password) {
        setAuthError('Por favor completa todos los campos obligatorios.')
        setAuthLoading(false)
        return
      }

      const cleanFirstName = firstName.trim()
      const cleanMiddleName = middleName.trim()
      const cleanLastName = lastName.trim()
      const cleanEmail = email.trim().toLowerCase()
      const cleanPhone = phone.trim()

      const fullName = [cleanFirstName, cleanMiddleName, cleanLastName].filter(Boolean).join(' ')

      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`phone.eq.${cleanPhone},email.eq.${cleanEmail}`)
        .maybeSingle()

      if (existingUser) {
        setAuthError('El número de teléfono o correo ya está registrado.')
        setAuthLoading(false)
        return
      }

      const { error } = await supabase.from('users').insert([
        {
          first_name: cleanFirstName,
          middle_name: cleanMiddleName || null,
          last_name: cleanLastName,
          email: cleanEmail,
          phone: cleanPhone,
          password: password,
        },
      ])

      if (error) {
        setAuthError('Error al registrarse: ' + error.message)
      } else {
        setCurrentUser({ fullName, firstName: cleanFirstName, email: cleanEmail, phone: cleanPhone })
      }
    } else if (authMode === 'login') {
      if (!loginIdentifier || !password) {
        setAuthError('Por favor ingresa tus datos y contraseña.')
        setAuthLoading(false)
        return
      }

      const cleanInput = loginIdentifier.trim()

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('password', password)
        .or(`first_name.ilike.${cleanInput},last_name.ilike.${cleanInput},email.ilike.${cleanInput},phone.eq.${cleanInput}`)
        .maybeSingle()

      if (error || !data) {
        setAuthError('Datos o contraseña incorrectos.')
      } else {
        const full = [data.first_name, data.middle_name, data.last_name].filter(Boolean).join(' ')
        setCurrentUser({ fullName: full || data.first_name, firstName: data.first_name, email: data.email, phone: data.phone })
      }
    }

    setAuthLoading(false)
  }

  // Solicitud de Código de Recuperación (Paso 1)
  const handleSendResetCode = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthMessage('')
    setAuthLoading(true)

    const cleanEmail = resetEmail.trim().toLowerCase()

    if (!cleanEmail) {
      setAuthError('Ingresa tu correo registrado.')
      setAuthLoading(false)
      return
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (fetchError || !user) {
      setAuthError('No se encontró ninguna cuenta registrada con este correo.')
      setAuthLoading(false)
      return
    }

    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()

    const { error: updateError } = await supabase
      .from('users')
      .update({ reset_code: generatedCode })
      .eq('id', user.id)

    if (updateError) {
      setAuthError('Error al guardar el código: ' + updateError.message)
      setAuthLoading(false)
      return
    }

    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, code: generatedCode }),
    })

    if (res.ok) {
      setAuthMessage('Código enviado a tu correo. Revisa tu bandeja de entrada o spam.')
      setAuthMode('verify_code')
    } else {
      setAuthError('Error al enviar el correo. Verifica tu configuración.')
    }

    setAuthLoading(false)
  }

  // Verificar Código y Cambiar Contraseña (Paso 2)
  const handleVerifyAndReset = async (e) => {
    e.preventDefault()
    setAuthError('')
    setAuthMessage('')
    setAuthLoading(true)

    const cleanEmail = resetEmail.trim().toLowerCase()
    const cleanInputCode = inputCode.trim().replace(/\s+/g, '')

    if (!cleanEmail) {
      setAuthError('Debes ingresar el correo usado para recuperar la contraseña.')
      setAuthLoading(false)
      return
    }

    if (!/^\d{6}$/.test(cleanInputCode)) {
      setAuthError('El código de verificación debe contener solo 6 números.')
      setAuthLoading(false)
      return
    }

    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, email, reset_code')
      .eq('email', cleanEmail)
      .maybeSingle()

    if (fetchError || !user) {
      setAuthError('No se encontró una cuenta con este correo.')
      setAuthLoading(false)
      return
    }

    const savedCode = user.reset_code == null ? '' : String(user.reset_code).trim().replace(/\s+/g, '')
    const inputCodeNormalized = cleanInputCode

    console.log('DEBUG RESET:', {
      savedCode,
      inputCodeNormalized,
      rawSavedCode: user.reset_code,
      rawInputCode: inputCode,
      typeSavedCode: typeof user.reset_code,
    })

    if (!savedCode || savedCode !== inputCodeNormalized) {
      setAuthError('El código de verificación es incorrecto.')
      console.log('JSON DEBUG:', JSON.stringify({ savedCode, inputCodeNormalized, userId: user.id, email: cleanEmail }, null, 2))
      setAuthLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: newPassword, reset_code: null })
      .eq('id', user.id)

    if (updateError) {
      setAuthError('Error al actualizar contraseña: ' + updateError.message)
    } else {
      setAuthMessage('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.')
      setAuthMode('login')
      setNewPassword('')
      setInputCode('')
      setResetEmail('')
    }

    setAuthLoading(false)
  }

  const activeUser = currentUser || {
    fullName: 'Cliente',
    firstName: 'Cliente',
    email: '',
    phone: '',
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      customer_name: currentUser.fullName,
      customer_phone: currentUser.phone,
      address: formData.address,
      vehicle_type: formData.vehicle_type,
      service_name: formData.service_name,
      price: formData.price,
      booking_date: formData.booking_date,
      booking_time: formData.booking_time,
    }

    const { error } = await supabase.from('bookings').insert([payload])

    setLoading(false)
    if (error) {
      alert('Error al enviar la reserva: ' + error.message)
    } else {
      setSuccess(true)
    }
  }

  // PANTALLAS DE AUTENTICACIÓN
  if (!currentUser && showAuth) {
    return (
      <main className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1A1A1E] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
          <div className="mb-6">
            <BrandLogo />
            <div className="text-center">
              <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">
                {authMode === 'login' && 'Iniciar Sesión'}
                {authMode === 'register' && 'Crear Cuenta'}
                {authMode === 'forgot' && 'Recuperar Contraseña'}
                {authMode === 'verify_code' && 'Restablecer Contraseña'}
              </p>
            </div>
          </div>

          {/* MENSAJE GENERAL */}
          {authMessage && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-lg text-xs">
              {authMessage}
            </div>
          )}

          {/* VISTA 1: RECUPERAR CONTRASEÑA (Paso 1: Solicitar Correo) */}
          {authMode === 'forgot' && (
            <form onSubmit={handleSendResetCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">
                  Correo Electrónico Registrado
                </label>
                <input
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {authError && <p className="text-xs text-red-400 font-medium">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition duration-200"
              >
                {authLoading ? 'Enviando código...' : 'Enviar Código de Verificación'}
              </button>

              <div className="text-center text-xs mt-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthMessage(''); }}
                  className="text-zinc-400 hover:text-white underline"
                >
                  Volver al Inicio de Sesión
                </button>
              </div>
            </form>
          )}

          {/* VISTA 2: RESTABLECER CONTRASEÑA (Paso 2: Código + Nueva Contraseña) */}
          {authMode === 'verify_code' && (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  placeholder="123456"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-center font-mono tracking-widest text-cyan-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 pr-12 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 uppercase"
                    aria-label={showNewPassword ? 'Ocultar nueva contraseña' : 'Mostrar nueva contraseña'}
                  >
                    {showNewPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              {authError && <p className="text-xs text-red-400 font-medium">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition duration-200"
              >
                {authLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
              </button>

              <div className="text-center text-xs mt-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); setAuthMessage(''); }}
                  className="text-zinc-400 hover:text-white underline"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* VISTA 3: LOGIN / REGISTRO */}
          {(authMode === 'login' || authMode === 'register') && (
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Nombre</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Juan"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">
                        Segundo Nombre <span className="text-[10px] text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Carlos"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Apellidos</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Pérez Gómez"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Teléfono</label>
                    <input
                      type="tel"
                      required
                      placeholder="Número de teléfono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">
                    Nombre, Correo o Teléfono
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre, correo o teléfono"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-zinc-400 uppercase">Contraseña</label>
                  {authMode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setAuthMode('forgot'); setAuthError(''); setAuthMessage(''); }}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 pr-12 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 uppercase"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>

              {authError && <p className="text-xs text-red-400 font-medium">{authError}</p>}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition duration-200 mt-2 disabled:opacity-50"
              >
                {authLoading ? 'Verificando...' : authMode === 'login' ? 'Entrar' : 'Registrarse'}
              </button>
            </form>
          )}

          {/* CAMBIAR ENTRE LOGIN Y REGISTRO */}
          {(authMode === 'login' || authMode === 'register') && (
            <div className="mt-6 text-center text-xs text-zinc-400">
              {authMode === 'login' ? (
                <p>
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(''); setAuthMessage(''); }}
                    className="text-cyan-400 underline font-semibold ml-1"
                  >
                    Regístrate aquí
                  </button>
                </p>
              ) : (
                <p>
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); setAuthMessage(''); }}
                    className="text-cyan-400 underline font-semibold ml-1"
                  >
                    Inicia sesión
                  </button>
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    )
  }

  // PANTALLA DE RESERVA
  return (
    <main className="min-h-screen bg-[#0F0F11] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A1A1E] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-cyan-400">GASPER</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Auto Detailing</p>
            <p className="text-xs text-zinc-400">
              Cliente: <span className="text-white font-semibold capitalize">{activeUser.fullName}</span>
            </p>
          </div>
          {currentUser ? (
            <button
              type="button"
              onClick={() => { setCurrentUser(null); setPassword(''); setLoginIdentifier(''); setShowAuth(false); }}
              className="text-xs text-zinc-500 hover:text-red-400 underline"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setShowAuth(true); setAuthMode('login'); setAuthError(''); setAuthMessage(''); }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline"
            >
              Iniciar sesión
            </button>
          )}
        </div>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="text-4xl">✅</div>
            <h2 className="text-xl font-bold text-white">¡Reserva enviada!</h2>
            <p className="text-sm text-zinc-400">Nos pondremos en contacto contigo pronto.</p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-4 bg-cyan-500 text-black font-bold px-4 py-2 rounded-xl text-sm"
            >
              Hacer otra reserva
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Servicio</label>
              <select
                className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                value={formData.service_name}
                onChange={(e) => {
                  const selected = SERVICES.find((s) => s.name === e.target.value)
                  setFormData({ ...formData, service_name: selected.name, price: selected.basePrice })
                }}
              >
                {SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} (${s.basePrice}+)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Tipo de Vehículo</label>
              <select
                className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                value={formData.vehicle_type}
                onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
              >
                {VEHICLES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Fecha</label>
                <input
                  type="date"
                  required
                  className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  value={formData.booking_date}
                  onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Hora</label>
                <input
                  type="time"
                  required
                  className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                  value={formData.booking_time}
                  onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1 uppercase">Dirección del servicio</label>
              <input
                type="text"
                required
                placeholder="Calle, número, colonia..."
                className="w-full bg-[#0F0F11] border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="p-3 bg-[#0F0F11] border border-zinc-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Métodos de pago aceptados
              </span>
              <p className="text-[11px] text-zinc-400">El pago se realiza en persona al completar el servicio:</p>
              <p className="text-xs font-medium text-zinc-200">💵 Cash  💳 Visa / MC / Amex  📱 Zelle  🌆 Venmo</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition duration-200"
            >
              {loading ? 'Procesando...' : 'Confirmar Reserva'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
