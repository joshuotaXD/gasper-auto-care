'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Home() {
  // 1. TODOS LOS ESTADOS VAN AQUÍ ARRIBA
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

  // 2. ÚNICO RETURN QUE ENVUELVE ABSOLUTAMENTE TODO
  return (
    <>
      <main className="min-h-screen bg-[#0F0F11] text-white">
        
        {/* HEADER Y NAVEGACIÓN */}
        <header className="sticky top-0 z-50 bg-[#111318]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveSection('inicio')}>
            <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-cyan-400 transition">
              GASPER <span className="text-cyan-400 text-xs block font-normal tracking-widest">AUTO DETAILING</span>
            </span>
          </div>

          {/* Menú de Navegación central */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => setActiveSection('galeria')}
              className={`transition font-medium text-sm ${
                activeSection === 'galeria' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Galería
            </button>
            <button 
              onClick={() => setActiveSection('contacto')}
              className={`transition font-medium text-sm ${
                activeSection === 'contacto' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Contacto
            </button>
          </nav>

          {/* Botones de Sesión */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveSection('login')}
              className="text-xs md:text-sm font-semibold text-zinc-300 hover:text-white px-3 py-2 transition"
            >
              Iniciar Sesión
            </button>
          </div>
        </header>

        {/* AQUÍ PUEDES IR AGREGANDO EL RESTO DE TUS SECCIONES */}
        <section className="p-10 text-center">
          <h1 className="text-3xl font-bold">Sección actual: {activeSection}</h1>
        </section>

      </main>
    </>
  );
}