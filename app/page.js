'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [openServices, setOpenServices] = useState({});
  
  // Estados para el selector de vehículos de cada servicio
  const [vehicleSelection, setVehicleSelection] = useState({
    engine: 'Coupe/Sedan',
    headlight: 'Coupe/Sedan',
    standard: 'Coupe/Sedan',
    deep: 'Coupe/Sedan',
    polish: 'Coupe/Sedan',
    ceramic: 'Coupe/Sedan'
  });

  const toggleServiceAccordion = (serviceName) => {
    setOpenServices(prev => ({ ...prev, [serviceName]: !prev[serviceName] }));
  };

  const handleVehicleSelect = (serviceKey, type) => {
    setVehicleSelection(prev => ({ ...prev, [serviceKey]: type }));
  };

  const servicesList = [
    { 
      id: 'engine',
      name: 'Engine wash', 
      duration: '40 min', 
      bullet1: 'We protect the delicate parts of the engine by covering them.',
      bullet2: 'We use a degreaser and finish with a glossy look.'
    },
    { 
      id: 'headlight',
      name: 'Headlight restoration', 
      duration: '60 min', 
      bullet1: '1. Assessment and preparation: Deep cleaning of the headlight to remove dirt and grease. The surrounding paintwork is protected with special tape to prevent damage to the bodywork.',
      bullet2: '2. Sanding and polishing: Yellowing and cloudiness are removed through a multi-stage sanding process, followed by machine polishing to restore original clarity and shine.',
      bullet3: '3. Sealing and UV protection: A sealant with UV protection is applied to prevent future yellowing. This restores the headlight to a like-new appearance and improves night-time visibility.'
    },
    { 
      id: 'standard',
      name: 'Standard Wash - Regular Cleaning', 
      duration: '60-120 min', 
      bullet1: 'Our ideal maintenance service to keep your car clean, shiny, and presentable week after week.',
      exterior: 'Hand wash with pH-neutral shampoo, cleaning of rims and tires, exterior window cleaning, and hand drying.',
      interior: 'Thorough vacuuming of seats, carpets, and trunk; cleaning of dashboard, doors, and console; interior window cleaning; and air freshener.',
      bullet4: 'Perfect for daily use. Removes dust and light dirt while preserving your vehicle\'s value.'
    },
    { 
      id: 'deep',
      name: 'Deep Cleaning', 
      duration: '120-180 min', 
      intro: '100% Detailed Interior:',
      interiorItems: ['Deep vacuuming of seats, carpets, and trunk', 'Upholstery cleaning to remove stains', 'Cleaning of dashboard, door panels, and console', 'Sanitization and long-lasting fresh scent'],
      exteriorIntro: 'Exterior with Premium Finish:',
      exteriorItems: ['Hand wash with foam', 'Deep cleaning of rims and tires', 'Tires conditioned and blackened'],
      footer: 'Ideal for daily drivers, vehicles being prepared for sale, or after a road trip.'
    },
    { 
      id: 'polish',
      name: 'Polishing and waxing', 
      duration: '300-540 min', 
      intro: 'Does your paint look dull, scratched, and lifeless?',
      restore: 'Restore that showroom shine.',
      overview: 'Our Polishing and Waxing service removes sun damage, wash-induced micro-scratches, and oxidation, leaving a protected, mirror-like finish.',
      polishingItems: ['Surface scratches and swirl marks', 'Dull and sun-damaged paint', 'Water spots, mineral deposits, and dried bird droppings'],
      waxingItems: ['Deep, mirror-like shine', 'Protection against sun, dust, and rain', 'Silky-smooth paint that repels water', 'Your car stays clean longer'],
      conclusion: 'The result: Vibrant color, intense shine, and months of protection. Ideal for getting rid of imperfections and turning heads wherever you go!'
    },
    { 
      id: 'ceramic',
      name: 'CERAMIC COATING', 
      duration: '300-600 min', 
      title: 'CERAMIC COATING 💎🚗',
      intro: 'Ultimate protection for your paintwork.',
      description: 'Our ceramic coating creates a hard, glossy layer that protects your car for months against the sun, rain, dust, and minor scratches.',
      benefits: ['Intense, mirror-like shine', 'Extreme protection against sun and water', 'Keeps your car cleaner for longer', 'Hydrophobic effect—water simply slides off'],
      note: 'It\'s not wax; it\'s professional, long-lasting protection.',
      includes: 'Includes polishing and waxing',
      durability: '(The price may vary depending on the durability period: 3 years or 5 years.)'
    }
  ];

  const vehicleTypes = ['Coupe/Sedan', 'Mid-Sized SUV', 'Large- SUV/Truck'];

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold border-b border-zinc-800 pb-4">Nuestros Servicios</h1>
        
        <div className="space-y-4">
          {servicesList.map((service) => (
            <div key={service.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <div onClick={() => toggleServiceAccordion(service.name)} className="flex justify-between items-center cursor-pointer">
                <h3 className="font-bold text-lg">{service.name}</h3>
                <span className="text-cyan-400 text-sm">{openServices[service.name] ? '▲' : '▼'}</span>
              </div>

              {openServices[service.name] && (
                <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3 text-sm text-zinc-300">
                  {/* Contenido dinámico según el ID del servicio */}
                  {service.id === 'engine' && <ul className="list-disc pl-4 space-y-1"><li>{service.bullet1}</li><li>{service.bullet2}</li></ul>}
                  
                  {service.id === 'headlight' && <ul className="list-disc pl-4 space-y-1"><li>{service.bullet1}</li><li>{service.bullet2}</li><li>{service.bullet3}</li></ul>}
                  
                  {service.id === 'standard' && (
                    <>
                      <p>{service.bullet1}</p>
                      <p><strong>Exterior:</strong> {service.exterior}</p>
                      <p><strong>Interior:</strong> {service.interior}</p>
                    </>
                  )}

                  {service.id === 'deep' && (
                    <>
                      <p className="font-bold text-white">{service.intro}</p>
                      <ul className="list-disc pl-4">{service.interiorItems.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                      <p className="font-bold text-white mt-2">{service.exteriorIntro}</p>
                      <ul className="list-disc pl-4">{service.exteriorItems.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                    </>
                  )}

                  {service.id === 'polish' && (
                    <>
                      <p className="text-white italic">{service.intro}</p>
                      <p className="text-cyan-400 font-bold">{service.restore}</p>
                      <p>{service.overview}</p>
                      <p className="font-bold text-white mt-2">What does POLISHING do?</p>
                      <ul className="list-disc pl-4">{service.polishingItems.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                      <p className="font-bold text-white mt-2">What does WAXING do?</p>
                      <ul className="list-disc pl-4">{service.waxingItems.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                      <p className="mt-2 italic">{service.conclusion}</p>
                    </>
                  )}

                  {service.id === 'ceramic' && (
                    <>
                      <p className="font-bold text-lg text-white">{service.title}</p>
                      <p className="text-cyan-400 font-semibold">{service.intro}</p>
                      <p>{service.description}</p>
                      <ul className="list-disc pl-4">{service.benefits.map((b, idx) => <li key={idx}>{b}</li>)}</ul>
                      <div className="pt-2 border-t border-zinc-800 italic">
                        <p>{service.note}</p>
                        <p className="font-bold text-white">{service.includes}</p>
                        <p className="text-xs text-zinc-500">{service.durability}</p>
                      </div>
                    </>
                  )}

                  {/* Selector de Vehículo */}
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-xs font-bold text-cyan-400 uppercase mb-2">Selecciona tu vehículo:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {vehicleTypes.map(v => (
                        <button 
                          key={v}
                          onClick={() => handleVehicleSelect(service.id, v)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold border transition ${
                            vehicleSelection[service.id] === v 
                              ? 'bg-cyan-500 text-black border-cyan-500' 
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}