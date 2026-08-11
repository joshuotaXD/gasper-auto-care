'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabase';

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
      'Motorcycle': 45,
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
      'Motorcycle': 70,
    },
  }
];

const VEHICLES = ['Coupe / Sedan', 'Mid-Sized SUV', 'Large SUV / Truck', 'Motorcycle'];

export default function Home() {
  const [openServices, setOpenServices] = useState({
    [SERVICES[0].name]: true
  });

  const toggleServiceAccordion = (serviceName) => {
    setOpenServices(prev => ({
      ...prev,
      [serviceName]: !prev[serviceName]
    }));
  };

  return (
    <main className="min-h-screen p-8 bg-[#0F0F11] text-white">
      <h1 className="text-2xl font-bold mb-6">Panel de Servicios</h1>
      
      <div className="space-y-4">
        {SERVICES.map((service) => {
          const isOpen = !!openServices[service.name];
          return (
            <div key={service.name} className={`rounded-2xl border transition overflow-hidden ${
              isOpen ? 'border-cyan-400 bg-cyan-500/10' : 'border-zinc-800 bg-[#0F0F11]'
            }`}>
              <button
                type="button"
                onClick={() => toggleServiceAccordion(service.name)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-base font-bold text-white">{service.name}</p>
                  <p className="text-xs text-zinc-400">{service.duration}</p>
                </div>
                <span className="text-xs font-bold text-cyan-300">
                  {isOpen ? 'OCULTAR ▲' : 'VER ▼'}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-6 pt-1 border-t border-zinc-800/60 bg-[#111318]/40">
                  <p className="text-sm text-zinc-300 mb-4">{service.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}