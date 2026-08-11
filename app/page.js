'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [openServices, setOpenServices] = useState({});
  const [selectedVehicleTypeEngine, setSelectedVehicleTypeEngine] = useState('Coupe/Sedan');
  const [selectedVehicleTypeHeadlight, setSelectedVehicleTypeHeadlight] = useState('Coupe/Sedan');
  const [selectedVehicleTypeStandard, setSelectedVehicleTypeStandard] = useState('Coupe/Sedan');
  const [selectedVehicleTypeDeep, setSelectedVehicleTypeDeep] = useState('Coupe/Sedan');
  const [selectedVehicleTypePolish, setSelectedVehicleTypePolish] = useState('Coupe/Sedan');
  const [selectedVehicleTypeCeramic, setSelectedVehicleTypeCeramic] = useState('Coupe/Sedan');
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const toggleService = (id) => {
    setOpenServices(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const servicesList = [
    {
      id: 'motor',
      title: 'Limpieza y Detallado de Motor',
      description: 'Lavado especializado, desengrasado profundo y protección de componentes plásticos y gomas del vano motor.',
    },
    {
      id: 'faros',
      title: 'Restauración de Faros',
      description: 'Pulido, lijado y aplicación de capa protectora UV para recuperar la transparencia y mejorar la visibilidad nocturna.',
    },
    {
      id: 'interior',
      title: 'Lavado de Interior Profundo',
      description: 'Extracción de suciedad en asientos de tela, limpieza y acondicionamiento de piel, tableros y aspirado a fondo.',
    },
    {
      id: 'pintura',
      title: 'Corrección de Pintura y Pulido',
      description: 'Eliminación de rayones superficiales, remoción de remolinos (swirl marks) y devolución de brillo espejo a la carrocería.',
    },
    {
      id: 'ceramico',
      title: 'Protección Cerámica',
      description: 'Aplicación de recubrimiento cerámico de alta durabilidad para repeler agua, polvo y proteger la pintura contra los rayos UV.',
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#0F0F11] text-white">
        
        {/* HEADER Y NAVEGACIÓN */}
        <header className="sticky top-0 z-50 bg-[#111318]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between shadow-xl">
          
          {/* LOGO REDONDO + TEXTO AL LADO */}
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

        {/* 2. SECCIÓN DE SERVICIOS (Desplegables / Acordeón) */}
        <section className="px-6 py-20 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">Nuestros Servicios</h2>
            <p className="text-zinc-400 mt-2">Haz clic en cualquier servicio para conocer los detalles</p>
          </div>

          <div className="space-y-4">
            {servicesList.map((service) => (
              <div 
                key={service.id}
                className="bg-[#16181d] border border-zinc-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleService(service.id)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-zinc-800/40 transition"
                >
                  <span className="font-semibold text-lg text-white">{service.title}</span>
                  <span className={`transform transition-transform duration-300 text-cyan-400 font-bold text-xl ${openServices[service.id] ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>

                {openServices[service.id] && (
                  <div className="px-6 pb-6 pt-2 text-zinc-400 border-t border-zinc-800/60 text-sm md:text-base leading-relaxed">
                    <p>{service.description}</p>
                    <div className="mt-4">
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