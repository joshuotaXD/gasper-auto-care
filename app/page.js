'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      {/* HEADER / MENÚ DE NAVEGACIÓN */}
      <header className="sticky top-0 z-50 bg-[#111318]/90 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        
        {/* Izquierda: Logo y Nombre de la empresa */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveSection('inicio')}>
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-cyan-500/40">
            <Image 
              src="/logo.png" 
              alt="Gasper Auto Detailing Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            GASPER <span className="text-cyan-400 text-xs block font-normal tracking-widest">AUTO DETAILING</span>
          </span>
        </div>

        {/* Centro: Navegación (Galería, Contacto, etc.) */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveSection('inicio')}
            className={`transition font-medium text-sm ${
              activeSection === 'inicio' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Inicio
          </button>
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
          <section className="space-y-6">
            <h1 className="text-4xl font-extrabold text-white">Servicios Profesionales de Detailing</h1>
            <p className="text-zinc-400 text-lg">
              Bienvenido a Gasper Auto Detailing. Cuidamos cada detalle de tu vehículo con los mejores estándares de calidad.
            </p>
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