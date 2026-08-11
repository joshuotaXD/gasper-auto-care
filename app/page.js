'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function Home() {
  // Todos los estados dentro del componente
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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (authMode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert("Error al registrarse: " + error.message);
      } else {
        alert("¡Registro exitoso! Revisa tu correo o inicia sesión.");
        setIsAuthModalOpen(false);
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Error al iniciar sesión: " + error.message);
      } else {
        alert("¡Bienvenido!");
        setIsAuthModalOpen(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#090a0f] text-white">
      {/* Tu botón de la galería que usa activeSection */}
      <button 
        onClick={() => setActiveSection('galeria')}
        className={`transition font-medium text-sm ${
          activeSection === 'galeria' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
        }`}
      >
        Galería
      </button>
    </main>
  );
}



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
    { 
      name: 'Headlight restoration', 
      duration: '60 min', 
      isHeadlight: true,
      bullet1: '1. Assessment and preparation: Deep cleaning of the headlight to remove dirt and grease. The surrounding paintwork is protected with special tape to prevent damage to the bodywork.',
      bullet2: '2. Sanding and polishing: Yellowing and cloudiness are removed through a multi-stage sanding process (ranging from coarse to fine grit), followed by machine polishing to restore original clarity and shine.',
      bullet3: '3. Sealing and UV protection: A sealant with UV protection is applied to prevent future yellowing. This restores the headlight to a like-new appearance, improves night-time visibility, and ensures it passes inspection.'
    },
    { 
      name: 'Standard Wash - Regular Cleaning', 
      duration: '60-120 min', 
      isStandard: true,
      bullet1: 'Our ideal maintenance service to keep your car clean, shiny, and presentable week after week.',
      exterior: 'Hand wash with pH-neutral shampoo, cleaning of rims and tires, exterior window cleaning, and hand drying to prevent streaks.',
      interior: 'Thorough vacuuming of seats, carpets, and trunk; cleaning of dashboard, doors, and console; interior window cleaning; and air freshener application.',
      bullet4: 'Perfect for daily use. Removes dust and light dirt while preserving your vehicle\'s value without damaging the paint.'
    },
    { 
      name: 'Deep Cleaning', 
      duration: '120-180 min', 
      isDeep: true,
      intro: '100% Detailed Interior:',
      interiorItems: [
        'Deep vacuuming of seats, carpets, trunk, and every nook and cranny',
        'Upholstery cleaning to remove stains and odors',
        'Cleaning of dashboard, door panels, console, and cup holders',
        'Spotless interior windows',
        'Sanitization and long-lasting fresh scent'
      ],
      exteriorIntro: 'Exterior with Premium Finish:',
      exteriorItems: [
        'Hand wash with foam',
        'Deep cleaning of rims and tires',
        'Tires conditioned and blackened',
        'Finishing touches that make the difference'
      ],
      footer1: 'Book your appointment today.',
      footer2: 'Ideal for daily drivers, vehicles being prepared for sale, or after a long road trip. Your car will look showroom-fresh!',
      footer3: 'Recommended every 6 months.'
    },
    { 
      name: 'Polishing and waxing', 
      duration: '300-540 min', 
      isPolish: true,
      intro: 'Does your paint look dull, scratched, and lifeless?',
      restore: 'Restore that showroom shine.',
      overview: 'Our Polishing and Waxing service removes sun damage, wash-induced micro-scratches, and oxidation, leaving a protected, mirror-like finish.',
      polishingTitle: 'What does POLISHING do?',
      polishingSub: "It's not just about shine; it's about correction. We remove:",
      polishingItems: [
        'Surface scratches and swirl marks',
        'Dull and sun-damaged paint',
        'Water spots, mineral deposits, and dried bird droppings'
      ],
      waxingTitle: 'What does WAXING do?',
      waxingSub: 'We seal and protect the finish:',
      waxingItems: [
        'Deep, mirror-like shine',
        'Protection against sun, dust, and rain',
        'Silky-smooth paint that repels water',
        'Your car stays clean longer'
      ],
      conclusion: 'The result: Vibrant color, intense shine, and months of protection. Ideal for getting rid of imperfections and turning heads wherever you go!'
    },
    { 
      name: 'CERAMIC COATING', 
      duration: '300-600 min', 
      isCeramic: true,
      title: 'CERAMIC COATING 💎🚗',
      intro: 'Ultimate protection for your paintwork.',
      description: 'Our ceramic coating creates a hard, glossy layer that protects your car for months against the sun, rain, dust, and minor scratches.',
      benefits: [
        'Intense, mirror-like shine',
        'Extreme protection against sun and water',
        'Keeps your car cleaner for longer',
        'Hydrophobic effect—water simply slides off'
      ],
      note: 'It\'s not wax; it\'s professional, long-lasting protection.',
      includes: 'Includes polishing and waxing',
      durability: '(The price may vary depending on the durability period: 3 years or 5 years.)'
    }
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
        
        {/* Izquierda: Logo y Nombre */}
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

        {/* Centro: Navegación */}
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

                          <div className="w-full flex justify-center mt-6 pt-4 border-t border-zinc-800">
                            <button 
    onClick={(e) => {
      e.stopPropagation();
      alert("Servicio de " + service.name + " confirmado con éxito.");
    }}
    className="bg-white hover:bg-zinc-200 text-black font-bold py-3 px-10 rounded-xl transition duration-200 text-sm shadow-lg mx-auto"
  >
    Confirmar Servicio
  </button>
</div>
 
  
                       

                          {/* ENGINE WASH */}
                          {service.isEngineWash && (
                            <div className="space-y-2">
                              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                <li>{service.bullet1}</li>
                                <li>{service.bullet2}</li>
                              </ul>

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
                                        setSelectedVehicleTypeEngine(vType);
                                      }}
                                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                                        selectedVehicleTypeEngine === vType
                                          ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
                                          : 'bg-[#111318] text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                                      }`}
                                    >
                                      {vType}
                                    </button>
                                  ))}
                            <div className="w-full flex justify-center items-center mt-6 pt-4 border-t border-zinc-800">
 
</div>
            </div>
          </div>
        </div>

                            
                    
                            

                            
                          )}

                          {/* CERAMIC COATING */}
                          {service.isCeramic && (
                            <div className="space-y-3">
                              <p className="font-bold text-white text-lg">{service.title}</p>
                              <p className="text-cyan-400">{service.intro}</p>
                              <p className="text-zinc-300">{service.description}</p>

                              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                {service.benefits.map((bItem, bIndex) => (
                                  <li key={bIndex}>{bItem}</li>
                                ))}
                              </ul>

                              <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                                <p className="text-zinc-300 font-medium">{service.note}</p>
                                <p className="text-white font-bold">{service.includes}</p>
                                <p className="text-zinc-400 text-sm italic">{service.durability}</p>
                              </div>

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
                                        setSelectedVehicleTypeCeramic(vType);
                                      }}
                                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                                        selectedVehicleTypeCeramic === vType
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
                          )}

                          {/* HEADLIGHT RESTORATION */}
                          {service.isHeadlight && (
                            <div className="space-y-2">
                              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                <li>{service.bullet1}</li>
                                <li>{service.bullet2}</li>
                                <li>{service.bullet3}</li>
                              </ul>

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
                                        setSelectedVehicleTypeHeadlight(vType);
                                      }}
                                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                                        selectedVehicleTypeHeadlight === vType
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
                          )}

                          {/* STANDARD WASH */}
                          {service.isStandard && (
                            <div className="space-y-3">
                              <p className="text-zinc-300">{service.bullet1}</p>
                              <div>
                                <p className="font-bold text-white mb-1">What&apos;s included?</p>
                                <ul className="list-disc list-inside space-y-1.5 text-zinc-300">
                                  <li><strong className="text-white">Exterior:</strong> {service.exterior}</li>
                                  <li><strong className="text-white">Interior:</strong> {service.interior}</li>
                                </ul>
                              </div>
                              <p className="text-zinc-400 text-xs italic">{service.bullet4}</p>

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
                                        setSelectedVehicleTypeStandard(vType);
                                      }}
                                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                                        selectedVehicleTypeStandard === vType
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
                          )}

                          {/* DEEP CLEANING */}
                          {service.isDeep && (
                            <div className="space-y-3">
                              <div>
                                <p className="font-bold text-white mb-1">{service.intro}</p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                  {service.interiorItems.map((item, iIndex) => (
                                    <li key={iIndex}>{item}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <p className="font-bold text-white mb-1 mt-3">{service.exteriorIntro}</p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                  {service.exteriorItems.map((extItem, eIndex) => (
                                    <li key={eIndex}>{extItem}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="space-y-1 pt-2 text-xs text-zinc-400">
                                <p>✨ {service.footer1}</p>
                                <p>🚗 {service.footer2}</p>
                                <p>🔄 <strong className="text-white">{service.footer3}</strong></p>
                              </div>

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
                                        setSelectedVehicleTypeDeep(vType);
                                      }}
                                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                                        selectedVehicleTypeDeep === vType
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
                          )}

                          {/* POLISHING AND WAXING */}
                          {service.isPolish && (
                            <div className="space-y-3">
                              <p className="text-zinc-300 font-medium">{service.intro}</p>
                              <p className="text-cyan-400 font-semibold">{service.restore}</p>
                              <p className="text-zinc-300">{service.overview}</p>

                              <div className="pt-2">
                                <p className="font-bold text-white mb-1">{service.polishingTitle}</p>
                                <p className="text-zinc-400 text-xs mb-1.5">{service.polishingSub}</p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                  {service.polishingItems.map((pItem, pIndex) => (
                                    <li key={pIndex}>{pItem}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="pt-2">
                                <p className="font-bold text-white mb-1">{service.waxingTitle}</p>
                                <p className="text-zinc-400 text-xs mb-1.5">{service.waxingSub}</p>
                                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                                  {service.waxingItems.map((wItem, wIndex) => (
                                    <li key={wIndex}>{wItem}</li>
                                  ))}
                                </ul>
                              </div>

                              <p className="text-zinc-300 italic pt-2 border-t border-zinc-800/80">{service.conclusion}</p>

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
                                        setSelectedVehicleTypePolish(vType);
                                      }}
                                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-center ${
                                        selectedVehicleTypePolish === vType
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
                <textarea rows={4} required className="w-full rounded-xl border border-zinc-800 bg-[#111318] px-4 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none" placeholder="¿En qué podemos ayudarte?"></textarea>
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
