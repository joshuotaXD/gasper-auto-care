'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [openServices, setOpenServices] = useState({});
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const toggleService = (id) => {
    setOpenServices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Servicios actualizados tal cual la imagen (con sus precios, tiempos y logo integrado)
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
          
          {/* LOGO REDONDO + TEXTO */}
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

          {/* Menú de Navegación central (SOLO GALERÍA) */}
          <nav className="hidden md:flex items-center">
            <button 
              onClick={() => setActiveSection('galeria')}
              className={`transition font-bold text-sm tracking-widest uppercase ${
                activeSection === 'galeria' ? 'text-cyan-400' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Galería
            </button>
          </nav>

          {/* Botones de Sesión */}
          <div className="flex items-center gap-3">
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
          </div>
        </header>

        {/* 1. SECCIÓN DE BIENVENIDA */}
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
            <div className="mt-10 flex justify-center gap-4">
              <button 
                onClick={() => setActiveSection('servicios')}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20"
              >
                Ver Servicios
              </button>
              <button 
                onClick={() => setActiveSection('contacto')}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-8 py-3.5 rounded-xl transition border border-zinc-700"
              >
                Contáctanos
              </button>
            </div>
          </div>
        </section>

        {/* 2. SECCIÓN DE SERVICIOS (Estilo Tarjetas Preview con Logo y Tiempos) */}
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
                {/* Cabecera / Tarjeta Principal del Servicio */}
                <div className="px-5 py-4 flex items-center justify-between">
                  
                  {/* Izquierda: Mini Logo circular + Título y Precio */}
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

                  {/* Derecha: Tiempo estimado + Botón Desplegable */}
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

                {/* Contenido desplegable con la descripción detallada */}
                {openServices[service.id] && (
                  <div className="px-6 pb-5 pt-2 text-zinc-400 border-t border-zinc-800/60 text-sm leading-relaxed bg-[#111318]/50">
                    <p>{service.description}</p>
                    <div className="mt-3 flex justify-end">
                      <button 
                        onClick={() => setActiveSection('contacto')}
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

      </main>
    </>
  );
}