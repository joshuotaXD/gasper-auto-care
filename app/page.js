'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [openServices, setOpenServices] = useState({});
  const [selectedVehicleType, setSelectedVehicleType] = useState('Coupe/Sedan');

  const toggleServiceAccordion = (serviceName) => {
    setOpenServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  const servicesList = [
    { 
      name: 'Engine wash', 
      duration: '40 min', 
      isEngineWash: true,
      bullet1: 'We protect the delicate parts of the engine by covering them.',
      bullet2: 'We use a degreaser and finish with a glossy look.'
    },
    { name: 'Headlight restoration', duration: '60 min', description: 'Pulido y restauración de faros para recuperar la claridad y visibilidad nocturna.' },
    { name: 'Standard Wash - Regular Cleaning', duration: '60-120 min', description: 'Lavado exterior completo y aspirado interior básico de mantenimiento.' },
    { name: 'Deep Cleaning', duration: '120-180 min', description: 'Limpieza profunda de vestiduras, alfombras, tableros y desinfección a vapor.' },
    { name: 'Polishing and waxing', duration: '300-540 min', description: 'Corrección de pintura en varias etapas y aplicación de cera protectora de alto brillo.' },
    { name: 'CERAMIC COATING', duration: '300-600 min', description: 'Aplicación de recubrimiento cerámico avanzado para máxima protección de la pintura.' }
  ];

  const vehicleTypes = [
    'Coupe/Sedan',
    'Mid-Sized SUV',
    'Large- SUV/Truck'
  ];

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      {/* HEADER / MENÚ DE NAVEGACIÓN */}
      <header className="sticky top-0 z-50 bg-[#111318]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        
        {/* Izquierda: Logo y Nombre (Actúa como botón de Inicio) */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveSection('inicio')}>
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-cyan-500/40 group-hover:border-cyan-400 transition">
            <Image 
              src="/logo.png" 
              alt="Gasper Auto Detailing Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white group-hover:text-cyan-400 transition">
            GASPER <span className="text-cyan-400 text-xs block font-normal tracking-widest">AUTO DETAILING</span>
          </span>
        </div>

        {/* Centro: Navegación (Solo Galería y Contacto) */}
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

        {/* Derecha: Iniciar sesión y Crear cuenta */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveSection('login')} 
            className="text-xs md:text-sm font-semibold text-zinc-300 hover:text-white px-3 py-2 transition"
          >
            Iniciar Sesión
          </button>
          <button 
            onClick={() => setActiveSection('register')} 
            className="bg-cyan-500 hover:bg-cyan-400 text-black text-xs md:text-sm font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-cyan-500/20"
          >
            Crear Cuenta
          </button>
        </div>

      </header>

      {/* CONTENIDO DE LAS SECCIONES */}
      <main className="max-w-5xl mx-auto p-8 mt-6">
        {activeSection === 'inicio' && (
          <section className="space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-extrabold text-white">Servicios Profesionales de Detailing</h1>
              <p className="text-zinc-400 text-lg">
                Bienvenido a Gasper Auto Detailing. Cuidamos cada detalle de tu vehículo con los mejores estándares de calidad.
              </p>
            </div>

            {/* APARTADO DE SERVICIOS DISPONIBLES (ACORDEÓN) */}
            <div className="space-y-4 pt-2">
              <h2 className="text-2xl font-bold text-white border-b border-zinc-800 pb-3">Servicios Disponibles</h2>
              
              <div className="grid gap-3">
                {servicesList.map((service, index) => {
                  const isOpen = openServices[service.name];
                  return (
                    <div 
                      key={index}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 transition hover:border-zinc-700"
                    >
                      <div 
                        onClick={() => toggleServiceAccordion(service.name)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                            🚗
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-base">{service.name}</h3>
                            <p className="text-xs text-zinc-400">⏱️ Duración aproximada: {service.duration}</p>
                          </div>
                        </div>
                        <span className="text-zinc-400 text-sm font-semibold">
                          {isOpen ? '▲ Ocultar' : '▼ Ver detalle'}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4 text-sm text-zinc-300">
                          {service.isEngineWash ? (
                            <div className="space-y-2">
                              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                <li>{service.bullet1}</li>
                                <li>{service.bullet2}</li>
                              </ul>

                              {/* SELECTOR DE TIPO DE VEHICULO */}
                              <div className="mt-4 pt-3 border-t border-zinc-800/80">
                                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                                  PRICE/TIME for each vehicle type:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  {vehicleTypes.map((vType, vIndex) => (
                                    <button
                                      key={vIndex}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedVehicleType(vType);
                                      }}
                                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                                        selectedVehicleType === vType
                                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                                          : 'bg-[#111318] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                                      }`}
                                    >
                                      {vType}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p>{service.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activeSection === 'galeria' && (
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Galería de Trabajos</h1>
            <p className="text-zinc-400">Explora nuestros resultados y transformaciones.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">Trabajo 1</div>
              <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">Trabajo 2</div>
              <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-zinc-600">Trabajo 3</div>
            </div>
          </section>
        )}

        {activeSection === 'contacto' && (
          <section className="space-y-6 max-w-lg">
            <h1 className="text-3xl font-bold text-white">Contacto Directo</h1>
            <p className="text-zinc-400">Llámanos al <span className="text-cyan-400 font-semibold">615 429 2253</span> o envíanos un mensaje:</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado'); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Nombre</label>
                <input type="text" required className="w-full rounded-xl border border-zinc-800 bg-[#111318] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Mensaje</label>
                <textarea rows="4" required className="w-full rounded-xl border border-zinc-800 bg-[#111318] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition">
                Enviar Mensaje
              </button>
            </form>
          </section>
        )}

        {(activeSection === 'login' || activeSection === 'register') && (
          <section className="max-w-md mx-auto bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6 mt-10">
            <h1 className="text-2xl font-bold text-white text-center">
              {activeSection === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>
            <div className="space-y-4">
              {activeSection === 'register' && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Nombre Completo</label>
                  <input type="text" className="w-full rounded-xl border border-zinc-800 bg-[#111318] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="Tu nombre" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Correo Electrónico</label>
                <input type="email" className="w-full rounded-xl border border-zinc-800 bg-[#111318] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">Contraseña</label>
                <input type="password" className="w-full rounded-xl border border-zinc-800 bg-[#111318] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="••••••••" />
              </div>
              <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition mt-2">
                {activeSection === 'login' ? 'Entrar' : 'Registrarse'}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}