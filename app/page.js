'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [openServices, setOpenServices] = useState({});
  const [selectedServiceToQuote, setSelectedServiceToQuote] = useState('');
  
  // Estados para el formulario de cotización
  const [vehicleType, setVehicleType] = useState('Mid-Sized SUV');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  // Estados de autenticación (Supabase)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const vehicleOptions = [
    { label: 'Coupe/Sedan', icon: '🚗' },
    { label: 'Mid-Sized SUV', icon: '🚙' },
    { label: 'Large SUV/Truck', icon: '🚐' },
  ];

  // Comprobar sesión activa al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setAuthError(error.message);
    } else {
      setActiveSection('inicio');
      setEmail('');
      setPassword('');
    }
    setAuthLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });

    if (error) {
      setAuthError(error.message);
    } else {
      alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión o has sido logueado.');
      setActiveSection('inicio');
      setEmail('');
      setPassword('');
      setFullName('');
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setActiveSection('inicio');
  };

  const toggleService = (id) => {
    setOpenServices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleQuoteClick = (serviceTitle) => {
    setSelectedServiceToQuote(serviceTitle);
    setActiveSection('cotizar');
  };

  const servicesList = [
    {
      id: 'engine',
      title: 'Engine wash',
      price: '$60',
      time: '40 min',
      description: 'Lavado especializado y desengrasado profundo del motor.',
      borderColor: 'border-cyan-400/40',
    },
    {
      id: 'headlight',
      title: 'Headlight restoration',
      price: '$90 - $120',
      time: '60 min',
      description: 'Pulido, lijado y aplicación de capa protectora UV para recuperar la transparencia de los faros.',
      borderColor: 'border-yellow-400/40',
    },
    {
      id: 'standard',
      title: 'Standard Wash – Regular Cleaning',
      price: '$120 - $200',
      time: '60-120 min',
      description: 'Lavado exterior detallado y limpieza interior regular.',
      borderColor: 'border-red-400/40',
    },
    {
      id: 'deep',
      title: 'Deep cleaning',
      price: '$220 - $310',
      time: '120-180 min',
      description: 'Limpieza profunda integral de tapicería, alfombras y rincones difíciles.',
      borderColor: 'border-zinc-400/40',
    },
    {
      id: 'polishing',
      title: 'Polishing and waxing',
      price: '$550 - $1300',
      time: '300-540 min',
      description: 'Corrección de pintura, remoción de remolinos y encerado de alta durabilidad.',
      borderColor: 'border-purple-400/40',
    },
    {
      id: 'ceramic',
      title: 'CERAMIC COATING',
      price: '$1100 - $1800',
      time: '300-600 min',
      description: 'Aplicación de recubrimiento cerámico profesional para máxima protección y brillo espejo.',
      borderColor: 'border-amber-400/40',
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#0F0F11] text-white">
        
        {/* HEADER Y NAVEGACIÓN */}
        <header className="sticky top-0 z-50 bg-[#111318]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between shadow-xl">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setActiveSection('inicio')}
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/40 group-hover:border-cyan-400 transition shadow-md shadow-cyan-500/10">
              <Image
                src="/logo.png"
                alt="Gasper Auto Detailing Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="font-extrabold text-base md:text-lg tracking-wider text-white group-hover:text-cyan-400 transition">
              GASPER <span className="text-cyan-400 text-[10px] block font-normal tracking-widest uppercase">Auto Detailing</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setActiveSection('inicio')}
              className={`transition font-bold text-sm tracking-widest uppercase ${
                activeSection === 'inicio' ? 'text-cyan-400' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Servicios
            </button>
            <button 
              onClick={() => setActiveSection('galeria')}
              className={`transition font-bold text-sm tracking-widest uppercase ${
                activeSection === 'galeria' ? 'text-cyan-400' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Galería
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-cyan-400 hidden md:inline">
                  Hola, {user.user_metadata?.full_name || user.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition border border-zinc-700"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setActiveSection('login')}
                  className="text-sm font-semibold text-zinc-300 hover:text-white px-4 py-2 rounded-xl transition hover:bg-zinc-800/50"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setActiveSection('register')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-5 py-2 rounded-xl transition shadow-md shadow-cyan-500/20"
                >
                  Crear Cuenta
                </button>
              </>
            )}
          </div>
        </header>

        {/* CONTENIDO CONDICIONAL SEGÚN activeSection */}

        {activeSection === 'login' ? (
          /* APARTADO DE INICIAR SESIÓN */
          <section className="px-6 py-20 max-w-md mx-auto">
            <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
                Acceso a tu cuenta
              </span>
              <h2 className="text-2xl font-bold mt-4 text-white">Iniciar Sesión</h2>
              
              {authError && (
                <div className="mt-4 bg-red-950/50 border border-red-800 text-red-400 text-xs p-3 rounded-xl">
                  {authError}
                </div>
              )}

              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {authLoading ? 'Iniciando sesión...' : 'Entrar'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-zinc-400">
                ¿No tienes cuenta?{' '}
                <button 
                  onClick={() => { setActiveSection('register'); setAuthError(''); }}
                  className="text-cyan-400 font-bold hover:underline ml-1"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </section>
        ) : activeSection === 'register' ? (
          /* APARTADO DE REGISTRO */
          <section className="px-6 py-20 max-w-md mx-auto">
            <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
                Únete a Gasper
              </span>
              <h2 className="text-2xl font-bold mt-4 text-white">Crear Cuenta</h2>
              
              {authError && (
                <div className="mt-4 bg-red-950/50 border border-red-800 text-red-400 text-xs p-3 rounded-xl">
                  {authError}
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Juan Pérez" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Correo Electrónico</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contraseña</label>
                  <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {authLoading ? 'Registrando...' : 'Registrar Cuenta'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-zinc-400">
                ¿Ya tienes cuenta?{' '}
                <button 
                  onClick={() => { setActiveSection('login'); setAuthError(''); }}
                  className="text-cyan-400 font-bold hover:underline ml-1"
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </section>
        ) : activeSection === 'cotizar' ? (
          /* APARTADO DE COTIZACIÓN INTELIGENTE */
          <section className="px-6 py-20 max-w-xl mx-auto">
            <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
                Solicitud de Cita / Cotización
              </span>
              <h2 className="text-2xl font-bold mt-4 text-white">Cotizar: {selectedServiceToQuote || 'Servicio General'}</h2>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('¡Solicitud enviada con éxito!'); setActiveSection('inicio'); }} className="mt-6 space-y-4">
                
                {/* SELECTOR TIPO DE VEHÍCULO */}
                <div className="relative">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Vehicle Type</label>
                  <div 
                    onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between cursor-pointer hover:border-cyan-400 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 text-base">
                        {vehicleType === 'Coupe/Sedan' ? '🚗' : vehicleType === 'Mid-Sized SUV' ? '🚙' : '🚐'}
                      </span>
                      <span>{vehicleType}</span>
                    </div>
                    <span className={`transform transition-transform duration-300 text-zinc-400 ${isVehicleDropdownOpen ? 'rotate-180' : ''}`}>
                      ⌄
                    </span>
                  </div>

                  {isVehicleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#16181d] border border-zinc-700 rounded-xl overflow-hidden shadow-2xl z-20">
                      {vehicleOptions.map((option) => (
                        <div
                          key={option.label}
                          onClick={() => {
                            setVehicleType(option.label);
                            setIsVehicleDropdownOpen(false);
                          }}
                          className={`px-4 py-3 text-sm flex items-center gap-2 cursor-pointer transition ${
                            vehicleType === option.label ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                        >
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {user ? (
                  /* SI ESTÁ LOGUEADO: Muestra sus datos precargados automáticamente */
                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 mt-4">
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Datos de tu cuenta:</p>
                    <p className="text-sm font-bold text-white mt-1">👤 {user.user_metadata?.full_name || 'Usuario'}</p>
                    <p className="text-sm text-zinc-300">📧 {user.email}</p>
                    <p className="text-xs text-cyan-400 mt-2">✓ Tus datos se usarán automáticamente para esta cita.</p>
                  </div>
                ) : (
                  /* SI NO ESTÁ LOGUEADO: Pide obligatoriamente nombre y teléfono o correo */
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Tu Nombre *</label>
                      <input type="text" required placeholder="Ej. Juan Pérez" className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1">Número de Teléfono o Correo electrónico *</label>
                      <input type="text" required placeholder="Ej. 9981234567 o correo@gmail.com" className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" />
                    </div>
                  </>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20">
                    Enviar Cotización
                  </button>
                  <button type="button" onClick={() => setActiveSection('inicio')} className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-5 py-3 rounded-xl transition">
                    Volver
                  </button>
                </div>
              </form>
            </div>
          </section>
        ) : activeSection === 'galeria' ? (
          /* APARTADO DE GALERÍA */
          <section className="px-6 py-20 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold">Galería de Trabajos</h2>
            <p className="text-zinc-400 mt-2">Pronto verás aquí las fotos de nuestros mejores detallados.</p>
            <button onClick={() => setActiveSection('inicio')} className="mt-6 bg-cyan-500 text-black font-bold px-6 py-2.5 rounded-xl">
              Volver a Servicios
            </button>
          </section>
        ) : (
          /* APARTADO PRINCIPAL (BIENVENIDA + SERVICIOS) */
          <>
            <section className="px-6 py-20 text-center bg-gradient-to-b from-[#0F0F11] to-[#16181d] border-b border-zinc-800">
              <div className="max-w-4xl mx-auto">
                <span className="text-cyan-400 font-semibold tracking-widest text-xs uppercase bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-800/50">
                  Excelencia en estética automotriz
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-6">
                  Devuélvele el brillo y la elegancia a tu <span className="text-cyan-400">vehículo</span>
                </h1>
                <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Cuidado profesional de alto nivel con productos especializados, protección cerámica y detallado meticuloso en cada rincón.
                </p>
              </div>
            </section>

            <section className="px-6 py-20 max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold tracking-tight text-white">Services</h2>
                <p className="text-zinc-400 text-sm mt-1">Preview Sample Profile</p>
              </div>

              <div className="space-y-4">
                {servicesList.map((service) => (
                  <div 
                    key={service.id}
                    className={`bg-[#16181d] border-2 ${service.borderColor} rounded-2xl overflow-hidden transition shadow-lg`}
                  >
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-400/50 flex-shrink-0 bg-black">
                          <Image
                            src="/logo.png"
                            alt="Service Logo"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-base md:text-lg">{service.title}</h3>
                          <div className="flex items-center gap-1.5 text-cyan-400 text-sm font-bold mt-0.5">
                            <span className="text-xs">💲</span>
                            <span>{service.price}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-zinc-400 text-xs md:text-sm flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1.5 rounded-full border border-zinc-800">
                          <span>⏱️</span>
                          <span>{service.time}</span>
                        </div>

                        <button
                          onClick={() => toggleService(service.id)}
                          className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
                          aria-label="Opciones"
                        >
                          <span className={`transform inline-block transition-transform duration-300 text-lg font-bold ${openServices[service.id] ? 'rotate-180' : ''}`}>
                            ⋮
                          </span>
                        </button>
                      </div>
                    </div>

                    {openServices[service.id] && (
                      <div className="px-6 pb-5 pt-2 text-zinc-400 border-t border-zinc-800/60 text-sm leading-relaxed bg-[#111318]/50">
                        <p>{service.description}</p>
                        <div className="mt-3 flex justify-end">
                          <button 
                            onClick={() => handleQuoteClick(service.title)}
                            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
                          >
                            Cotizar este servicio →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

      </main>
    </>
  );
}