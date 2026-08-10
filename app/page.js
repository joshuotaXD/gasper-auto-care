'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const VEHICLES = ['Coupe / Sedan', 'Mid-Sized SUV', 'Large SUV / Truck', 'Motorcycle']

const SERVICES = [
  {
    name: 'Engine wash',
    basePrice: 60,
    duration: '40 min',
    description: 'Lavado exterior e interior con espuma activa, enjuague detallado y secado para devolver el brillo original del vehículo.',
    vehiclePricing: {
      'Coupe / Sedan': 60,
      'Mid-Sized SUV': 80,
      'Large SUV / Truck': 90,
      Motorcycle: 45,
    },
  },
  {
    name: 'Headlight restoration',
    basePrice: 90,
    duration: '60 min',
    description: 'Recuperación de faros opacos con pulido profesional para mejorar la visibilidad, el estilo y la apariencia general del auto.',
    vehiclePricing: {
      'Coupe / Sedan': 90,
      'Mid-Sized SUV': 110,
      'Large SUV / Truck': 130,
      Motorcycle: 70,
    },
  },
  {
    name: 'Standard Wash / Regular cleaning',
    basePrice: 120,
    duration: '60-120 min',
    description: 'Limpieza regular completa con lavado exterior, interior básico y atención a superficies clave para mantener tu auto impecable.',
    vehiclePricing: {
      'Coupe / Sedan': 120,
      'Mid-Sized SUV': 160,
      'Large SUV / Truck': 200,
      Motorcycle: 90,
    },
  },
  {
    name: 'Deep cleaning',
    basePrice: 220,
    duration: '120-180 min',
    description: 'Cleaning profundo para interiores y exteriores con enfoque en detalles difíciles, tapicería, molduras y acabados delicados.',
    vehiclePricing: {
      'Coupe / Sedan': 220,
      'Mid-Sized SUV': 260,
      'Large SUV / Truck': 320,
      Motorcycle: 180,
    },
  },
  {
    name: 'Polishing and waxing',
    basePrice: 550,
    duration: '300-540 min',
    description: 'Pulido profesional y cera protectora para restaurar brillo, suavidad y protección avanzada del acabado del vehículo.',
    vehiclePricing: {
      'Coupe / Sedan': 550,
      'Mid-Sized SUV': 650,
      'Large SUV / Truck': 800,
      Motorcycle: 420,
    },
  },
  {
    name: 'CERAMIC COATING',
    basePrice: 1100,
    duration: '300-600 min',
    description: 'Protección premium con cerámica de alto rendimiento para una capa duradera, brillo intenso y resistencia a los elementos.',
    vehiclePricing: {
      'Coupe / Sedan': 1100,
      'Mid-Sized SUV': 1300,
      'Large SUV / Truck': 1600,
      Motorcycle: 900,
    },
  },
]

function BrandLogo() {
  return (
    <div className="mb-4 flex justify-center">
      <div className="text-center">
        <div className="text-3xl font-black tracking-[0.18em] text-cyan-400 sm:text-4xl md:text-5xl">
          GASPER
        </div>
        <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-zinc-400 sm:text-[11px]">
          AUTO DETAILING
        </div>
      </div>
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
      customer_name: activeUser.fullName,
      customer_phone: activeUser.phone,
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

  const renderAuthCard = () => (
    <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-[#1A1A1E] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="mb-2">
            <BrandLogo />
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest">
              {authMode === 'login' && 'Iniciar Sesión'}
              {authMode === 'register' && 'Crear Cuenta'}
              {authMode === 'forgot' && 'Recuperar Contraseña'}
              {authMode === 'verify_code' && 'Restablecer Contraseña'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowAuth(false)}
          className="rounded-full border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300 hover:border-cyan-400 hover:text-cyan-300"
          aria-label="Volver a la página anterior"
        >
          ✕
        </button>
      </div>

      {authMessage && (
        <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-lg text-xs">
          {authMessage}
        </div>
      )}

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
  )

  const [selectedService, setSelectedService] = useState(SERVICES[0].name)

  const activeService = SERVICES.find((service) => service.name === selectedService) || SERVICES[0]

  const getServicePrice = (serviceName, vehicleType) => {
    const service = SERVICES.find((item) => item.name === serviceName) || SERVICES[0]
    return service.vehiclePricing[vehicleType] || service.basePrice
  }

  const handleServiceSelect = (serviceName) => {
    const selected = SERVICES.find((service) => service.name === serviceName) || SERVICES[0]
    setSelectedService(serviceName)
    setFormData((previous) => ({
      ...previous,
      service_name: selected.name,
      price: selected.vehiclePricing[previous.vehicle_type] || selected.basePrice,
    }))
  }

  // PANTALLA DE RESERVA
  return (
    <main className="min-h-screen bg-[#0F0F11] text-white">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <header className="mx-auto mb-6 w-full rounded-2xl border border-zinc-800 bg-[#111318]/90 px-4 py-4 shadow-xl shadow-cyan-950/20 backdrop-blur-sm sm:px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-1 text-center md:items-start md:text-left">
              <h1 className="text-xl font-black tracking-[0.14em] text-cyan-400">GASPER</h1>
              <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-400">AUTO DETAILING</p>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-zinc-300 sm:gap-5 sm:text-sm md:justify-start">
              <button type="button" className="transition hover:text-cyan-300">INICIO</button>
              <button type="button" className="transition hover:text-cyan-300">CONTACTO</button>
              <button type="button" className="transition hover:text-cyan-300">GALERIA</button>
            </nav>

            <div className="flex items-center justify-center gap-2 sm:gap-3 md:justify-end">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => { setCurrentUser(null); setPassword(''); setLoginIdentifier(''); setShowAuth(false); }}
                  className="text-xs text-zinc-400 hover:text-red-400 underline"
                >
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setShowAuth(true); setAuthMode('login'); setAuthError(''); setAuthMessage(''); }}
                    className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-[11px] font-semibold text-zinc-200 transition hover:border-cyan-400 hover:text-cyan-300 sm:px-4 sm:text-xs"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAuth(true); setAuthMode('register'); setAuthError(''); setAuthMessage(''); }}
                    className="rounded-lg bg-cyan-500 px-3 py-2 text-[11px] font-bold text-black transition hover:bg-cyan-400 sm:px-4 sm:text-xs"
                  >
                    Crear cuenta
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[0.98fr_1.3fr]">
            <aside className="rounded-3xl border border-zinc-800 bg-[#111318] p-4 shadow-2xl shadow-cyan-950/20 sm:p-5 lg:p-6">
              <div className="mb-5 flex justify-center lg:justify-start">
                <div className="w-full max-w-[420px] lg:max-w-[360px]">
                  <BrandLogo />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-400">SERVICIO PREMIUM</p>
                  <h2 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl">
                    Cuidado perfecto para tu vehículo.
                  </h2>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-2xl border border-zinc-800 bg-[#0F0F11] p-3">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">DETALLE</p>
                    <p className="mt-2 text-base font-semibold text-white">Lavado profundo y protección</p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-[#0F0F11] p-3">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">TIEMPO</p>
                    <p className="mt-2 text-base font-semibold text-white">Agendamiento rápido y flexible</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-3 text-sm text-zinc-200">
                  <p className="font-semibold text-cyan-300">ATENCIÓN PERSONALIZADA</p>
                  <p className="mt-1 text-zinc-300">Reserva en minutos y recibe un servicio de alto nivel.</p>
                </div>

                <div className="pt-2">
                  <h3 className="text-2xl font-black text-white sm:text-3xl">SERVICIOS DISPONIBLES</h3>
                  <div className="mt-4 space-y-3">
                    {SERVICES.map((service) => {
                      const isSelected = selectedService === service.name

                      return (
                        <button
                          key={service.name}
                          type="button"
                          onClick={() => handleServiceSelect(service.name)}
                          className={`w-full rounded-2xl border p-3 text-left transition ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-950/20'
                              : 'border-zinc-800 bg-[#0F0F11] hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-base font-bold text-white">{service.name}</p>
                              <p className="mt-1 text-xs text-zinc-400">{service.duration}</p>
                            </div>
                            <span className="text-sm font-bold text-cyan-300">${service.basePrice}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </aside>

            <div className="rounded-3xl border border-zinc-800 bg-[#1A1A1E] p-4 shadow-2xl sm:p-5 lg:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-zinc-400">Cliente</p>
                  <p className="text-base font-semibold capitalize text-white">{activeUser.fullName}</p>
                </div>
                <div className="rounded-full border border-zinc-700 bg-[#0F0F11] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  {activeService.name}
                </div>
              </div>

              {success ? (
                <div className="space-y-3 py-8 text-center">
                  <div className="text-4xl">✅</div>
                  <h2 className="text-xl font-bold text-white">¡Reserva enviada!</h2>
                  <p className="text-sm text-zinc-400">Nos pondremos en contacto contigo pronto.</p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="mt-4 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-400"
                  >
                    Hacer otra reserva
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="rounded-2xl border border-zinc-800 bg-[#0F0F11] p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">Servicio seleccionado</p>
                    <h3 className="mt-2 text-2xl font-black text-white">{activeService.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">{activeService.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1">⏱ {activeService.duration}</span>
                      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1">💲 Desde ${activeService.basePrice}</span>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Tipo de Vehículo</label>
                    <select
                      className="w-full rounded-lg border border-zinc-800 bg-[#0F0F11] px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      value={formData.vehicle_type}
                      onChange={(e) => {
                        const nextVehicle = e.target.value
                        setFormData({ ...formData, vehicle_type: nextVehicle, price: getServicePrice(selectedService, nextVehicle) })
                      }}
                    >
                      {VEHICLES.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-[#0F0F11] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">Precios por vehículo</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {VEHICLES.map((vehicle) => (
                        <div
                          key={vehicle}
                          className={`rounded-xl border px-3 py-2 text-xs ${
                            formData.vehicle_type === vehicle
                              ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                              : 'border-zinc-700 bg-zinc-950 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span>{vehicle}</span>
                            <span className="font-bold">${getServicePrice(selectedService, vehicle)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Fecha</label>
                      <input
                        type="date"
                        required
                        className="w-full rounded-lg border border-zinc-800 bg-[#0F0F11] px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        value={formData.booking_date}
                        onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Hora</label>
                      <input
                        type="time"
                        required
                        className="w-full rounded-lg border border-zinc-800 bg-[#0F0F11] px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                        value={formData.booking_time}
                        onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400">Dirección del servicio</label>
                    <input
                      type="text"
                      required
                      placeholder="Calle, número, colonia..."
                      className="w-full rounded-lg border border-zinc-800 bg-[#0F0F11] px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-[#0F0F11] p-3">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                      MÉTODOS DE PAGO ACEPTADOS
                    </span>
                    <p className="mt-2 text-[11px] text-zinc-400">El pago se realiza en persona al completar el servicio:</p>
                    <p className="mt-1 text-xs font-medium text-zinc-200">💵 Cash  💳 Visa / MC / Amex  📱 Zelle  🌆 Venmo</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-cyan-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Procesando...' : 'RESERVAR / CONFIRMAR RESERVA'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {!currentUser && showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3 py-6 backdrop-blur-sm">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl p-2 sm:p-3">
            {renderAuthCard()}
          </div>
        </div>
      )}
    </main>
  )
}
