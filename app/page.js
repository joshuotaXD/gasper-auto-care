'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [openServices, setOpenServices] = useState({});
  const [selectedServiceToQuote, setSelectedServiceToQuote] = useState('');
  
  // Estado para alternar entre la vista de "servicios" y "contacto" en la página principal
  const [mainView, setMainView] = useState('servicios'); // 'servicios' o 'contacto'
  
  // Estados para el formulario de cotización
  const [vehicleType, setVehicleType] = useState('Mid-Sized SUV');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  // Estados de autenticación (Supabase)
  const [identifier, setIdentifier] = useState(''); // Puede ser correo o número de teléfono
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Estado para el modal de la galería (Lightbox)
  const [selectedImage, setSelectedImage] = useState(null);

  const vehicleOptions = [
    { label: 'Coupe/Sedan', icon: '🚗' },
    { label: 'Mid-Sized SUV', icon: '🚙' },
    { label: 'Large SUV/Truck', icon: '🚐' },
  ];

  // Lista de imágenes de la galería basadas en los archivos proporcionados
  const galleryImages = [
    { src: '/gallery/cybertruck.jpeg', title: 'Cybertruck Detailing', category: 'Protección y Estética' },
    { src: '/gallery/corvette_back.jpeg', title: 'Corvette C8 - Vista Trasera', category: 'Lavado y Brillo' },
    { src: '/gallery/corvette_front.jpeg', title: 'Corvette C8 - Vista Frontal', category: 'Corrección de Pintura' },
    { src: '/gallery/corvette_emblem.jpeg', title: 'Detalle de Emblema Corvette', category: 'Acabado Meticuloso' },
    { src: '/gallery/corvette_foam.jpeg', title: 'Proceso de Espumado Activo', category: 'Lavado Pro' },
    { src: '/gallery/interior.jpeg', title: 'Limpieza Profunda de Interiores', category: 'Interior Detailing' },
    { src: '/gallery/wheels.jpeg', title: 'Restauración y Brillo de Rines', category: 'Rines y Neumáticos' },
    { src: '/gallery/tesla_red_front.jpeg', title: 'Tesla Model Y - Frente', category: 'Ceramic Coating' },
    { src: '/gallery/tesla_red_back.jpeg', title: 'Tesla Model Y - Trasera', category: 'Protección UV' },
    { src: '/gallery/tesla_red_side.jpeg', title: 'Tesla Model Y - Perfil', category: 'Brillo Espejo' },
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

  // Iniciar sesión con Correo o Número de Teléfono
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    let loginEmail = identifier.trim();
    
    if (!loginEmail.includes('@')) {
      loginEmail = `phone_${loginEmail}@gasper.com`;
    }

    const { error } = await supabase.auth.signInWithPassword({ 
      email: loginEmail, 
      password 
    });
    
    if (error) {
      setAuthError('Credenciales incorrectas o usuario no registrado.');
    } else {
      setActiveSection('inicio');
      setIdentifier('');
      setPassword('');
    }
    setAuthLoading(false);
  };

  // Registrarse pidiendo teléfono y guardándolo en la metadata de Supabase
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    let signupEmail = identifier.trim();
    let userPhone = phone.trim();

    if (!signupEmail.includes('@')) {
      userPhone = signupEmail;
      signupEmail = `phone_${userPhone}@gasper.com`;
    }

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password,
      options: {
        data: { 
          full_name: fullName,
          phone: userPhone 
        }
      }
    });

    if (error) {
      setAuthError(error.message);
    } else {
      alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
      setActiveSection('login');
      setIdentifier('');
      setPassword('');
      setFullName('');
      setPhone('');
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
            onClick={() => { setActiveSection('inicio'); setMainView('servicios'); }}
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

          {/* Botón de galería centrado un poco más a la derecha mediante ml-8 md:ml-16 */}
          <nav className="hidden md:flex items-center pl-12 md:pl-24 ml-8 md:ml-16">
            <button 
              onClick={() => setActiveSection('galeria')}
              className={`relative px-5 py-2 rounded-xl font-extrabold text-sm tracking-widest uppercase transition-all duration-300 shadow-lg animate-pulse ${
                activeSection === 'galeria' 
                  ? 'bg-cyan-500 text-black shadow-cyan-500/50 scale-105' 
                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/50 hover:border-cyan-400 hover:scale-105 shadow-cyan-500/20'
              }`}
            >
              ✨ Galería
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-cyan-400 hidden md:inline">
                  Hola, {user.user_metadata?.full_name || 'Usuario'}
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
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Correo Electrónico o Número de Teléfono</label>
                  <input 
                    type="text" 
                    required 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="correo@ejemplo.com o 9981234567" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contraseña</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-cyan-400" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-bold px-2 py-1"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
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
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="correo@ejemplo.com" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Número de Teléfono</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 9981234567" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Contraseña</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-cyan-400" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs font-bold px-2 py-1"
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
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
                    <p className="text-sm text-zinc-300">📧 {user.email?.startsWith('phone_') ? 'Teléfono registrado' : user.email}</p>
                    {user.user_metadata?.phone && (
                      <p className="text-sm text-zinc-300">📞 {user.user_metadata.phone}</p>
                    )}
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
          /* APARTADO DE GALERÍA DISEÑADO HERMOSO Y ATRACTIVO */
          <section className="px-6 py-20 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-cyan-400 font-semibold tracking-widest text-xs uppercase bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-800/50">
                Portafolio Visual
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4">
                Nuestra <span className="text-cyan-400">Galería</span> de Trabajos
              </h2>
              <p className="text-zinc-400 mt-4 text-base md:text-lg">
                Explora el nivel de detalle, acabado espejo y protección profesional que aplicamos en cada vehículo.
              </p>
            </div>

            {/* Grid de imágenes con diseño moderno y hover atractivo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className="group relative bg-[#16181d] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-cyan-500/20"
                >
                  <div className="relative h-72 w-full overflow-hidden bg-zinc-900">
                    <Image
                      src={img.src}
                      alt={img.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#16181d] via-[#16181d]/90 to-transparent">
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-800/40">
                      {img.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-2 group-hover:text-cyan-300 transition">
                      {img.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <button 
                onClick={() => setActiveSection('inicio')} 
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold px-8 py-3 rounded-2xl transition border border-zinc-700 shadow-xl"
              >
                ← Volver a Servicios
              </button>
            </div>

            {/* Lightbox / Modal para ver imagen ampliada */}
            {selectedImage && (
              <div 
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
              >
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="relative max-w-4xl w-full bg-[#16181d] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-4 md:p-6"
                >
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 z-10 bg-zinc-800 hover:bg-zinc-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition border border-zinc-700"
                  >
                    ✕
                  </button>
                  <div className="relative h-[60vh] w-full rounded-2xl overflow-hidden bg-black">
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                      {selectedImage.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{selectedImage.title}</h3>
                  </div>
                </div>
              </div>
            )}
          </section>
        ) : (
          /* APARTADO PRINCIPAL (BIENVENIDA + BOTONES JUNTOS QUE ALTERNAN ENTRE SERVICIOS Y CONTACTO) */
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

                {/* BOTONES JUNTOS QUE ALTERNAN EL CONTENIDO DE ABAJO (SERVICIOS / CONTACTO) */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <button 
                    onClick={() => setMainView('servicios')}
                    className={`font-extrabold px-6 py-3 rounded-xl transition text-sm tracking-wider uppercase shadow-lg ${
                      mainView === 'servicios'
                        ? 'bg-cyan-500 text-black shadow-cyan-500/20'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700'
                    }`}
                  >
                    Services ↓
                  </button>
                  <button 
                    onClick={() => setMainView('contacto')}
                    className={`font-extrabold px-6 py-3 rounded-xl transition text-sm tracking-wider uppercase shadow-lg ${
                      mainView === 'contacto'
                        ? 'bg-cyan-500 text-black shadow-cyan-500/20'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700'
                    }`}
                  >
                    Contáctanos
                  </button>
                </div>
              </div>
            </section>

            {/* SECCIÓN CONDICIONAL INFERIOR: MUESTRA SERVICIOS O CONTACTO SEGÚN EL BOTÓN CLICKEADO */}
            {mainView === 'servicios' ? (
              <section id="services-section" className="px-6 py-20 max-w-3xl mx-auto scroll-mt-20">
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
            ) : (
              <section className="px-6 py-20 max-w-xl mx-auto">
                <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl text-center">
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
                    Ponte en contacto
                  </span>
                  <h2 className="text-3xl font-bold mt-4 text-white">Contáctanos</h2>
                  <p className="text-zinc-400 mt-2 text-sm">¿Tienes dudas o necesitas atención personalizada? Escríbenos o visítanos.</p>
                  
                  <div className="mt-6 space-y-4 text-left bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800">
                    <p className="text-sm text-zinc-300">📞 <strong className="text-white">Teléfono:</strong> +52 998 123 4567</p>
                    <p className="text-sm text-zinc-300">📧 <strong className="text-white">Correo:</strong> contacto@gasperdetailing.com</p>
                    <p className="text-sm text-zinc-300">📍 <strong className="text-white">Ubicación:</strong> Cancún, Q.R., México</p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

      </main>
    </>
  );
}