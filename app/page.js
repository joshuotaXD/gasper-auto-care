'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [openServices, setOpenServices] = useState({});
  const [selectedServiceToQuote, setSelectedServiceToQuote] = useState('');
  const [resetEmail, setResetEmail] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const [selectedDate, setSelectedDate] = useState('');
const [selectedTime, setSelectedTime] = useState('');
const [authView, setAuthView] = useState('login');
const [password, setPassword] = useState('');
const [identifier, setIdentifier] = useState('');
const [bookingMessage, setBookingMessage] = useState(null); // { type: 'success' | 'error', text: '...' }
const [clientAddress, setClientAddress] = useState('');
const [address, setAddress] = useState('');
const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
const [selectedVehicle, setSelectedVehicle] = useState('Coupe/Sedan');
const today = new Date().toISOString().split('T')[0];
const [paymentMethod, setPaymentMethod] = useState('Zelle');
const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
const [ceramicYears, setCeramicYears] = useState(2); // Por defecto en 2 años


// Ejemplo: Guardar un registro en la tabla de citas
const guardarCita = async (datos) => {
  const { data, error } = await supabase
    .from('citas') // Nombre de tu tabla en Supabase
    .insert([datos]);
    
  if (error) console.error('Error:', error);
  else alert('¡Cita guardada!');
};


const handleBookingSubmit = async (e) => {
  e.preventDefault();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    
    // Si no es usuario, usamos la dirección que escribió en el input.
    // Si es usuario, usamos la dirección de su perfil o la que escribió si la cambió.
    const finalAddress = address; 

   const payload = {
      service_name: selectedServiceToQuote,
      booking_date: selectedDate,
      booking_time: selectedTime,
      vehicle_type: selectedVehicle, // 👈 Agregamos esta línea con tu estado real de vehículo
      payment_method: paymentMethod,
      client_name: user ? user.user_metadata?.full_name : 'Invitado',
      client_contact: user ? user.user_metadata?.phone : 'Sin contacto',
      client_address: finalAddress,
      user_id: user?.id || null
    };

   const { data, error } = await supabase.from('appointments').insert([payload]);
    
    if (error) throw error;
    
    setBookingMessage({ type: 'success', text: 'Appointment booked!' });
setTimeout(() => {
      setBookingMessage(null);
      setActiveSection('inicio');
    }, 1500);

  } catch (err) {
    

    
    setBookingMessage({ type: 'error', text: err.message });
  }
};

// Manejar la recuperación de contraseña
const handlePasswordReset = async (e) => {
  e.preventDefault();
  setAuthError('');
  setSuccessMessage('');

  try {
    const response = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: resetEmail }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to send recovery code.');

    // 1. Muestra el mensaje de éxito en la interfaz
    setSuccessMessage('Recovery code sent successfully!');

  } catch (error) { // <--- ESTO ES LO QUE FALTA
    setAuthError(error.message);
  }
};
  
 const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      // Como estamos enviando un código personalizado mediante Resend, 
      // actualizamos directamente la contraseña usando la sesión de recuperación o el token.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      alert('Password updated successfully!');
      setAuthView('login');
      setVerificationCode('');
      setNewPassword('');
    } catch (error) {
      setAuthError(error.message);
    }
  };



  const [profileAddress, setProfileAddress] = useState('');

// Cargar la dirección actual al iniciar sesión
useEffect(() => {
  const fetchAddress = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('address')
          .eq('id', session.user.id)
          .single();
        if (data?.address) setProfileAddress(data.address);
      }
    } catch (err) {
      console.error(err);
    }
  };
  fetchAddress();
}, []);

// Función para guardar la dirección en Supabase
const handleUpdateProfileAddress = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) throw new Error("No user logged in");

    const { error } = await supabase
      .from('profiles')
      .update({ address: profileAddress })
      .eq('id', session.user.id);

    if (error) throw error;
    
    // Mostramos mensaje de éxito integrado
    setProfileMessage({ text: 'Address updated successfully!', type: 'success' });
    
    // Opcional: lo regresa al inicio automáticamente después de 1.5 segundos
    setTimeout(() => {
      setActiveSection('inicio');
    }, 1500);

  } catch (err) {
    setProfileMessage({ text: err.message, type: 'error' });
  }
};

const getCeramicPrice = (vehicle, years) => {
  let basePrice = 800;
  switch (vehicle) {
    case 'Coupe/Sedan': basePrice = 800; break;
    case 'Compact SUV': basePrice = 950; break;
    case 'Mid-Sized SUV': basePrice = 1100; break;
    case 'Large SUV/Truck': basePrice = 1300; break;
    case 'Trucks, Suburbans, Minivans': basePrice = 1500; break;
    case 'Motorcycle': basePrice = 500; break;
    case 'RVs': basePrice = 1600; break;
    default: basePrice = 800;
  }
  
  // Si elige más de 2 años, se incrementa $100 por cada año extra sobre la base de 2 años
  const extraYears = Math.max(0, years - 2);
  const finalPrice = basePrice + (extraYears * 100);
  
  return `$${finalPrice}`;
};

const calculateTotalPrice = (service, vehicle, years, paymentMethod) => {
  let basePrice = 0;
  const isDeepCleaning = service?.toLowerCase().includes('deep cleaning');
  const isCeramic = service?.toLowerCase().includes('ceramic');

  if (isDeepCleaning) {
    switch (vehicle) {
      case 'Coupe/Sedan': basePrice = 220; break;
      case 'Compact SUV': basePrice = 240; break;
      case 'Mid-Sized SUV': basePrice = 260; break;
      case 'Large SUV/Truck': basePrice = 270; break;
      case 'Trucks, Suburbans, Minivans': basePrice = 310; break;
      case 'Motorcycle': basePrice = 70; break;
      case 'RVs': basePrice = 150; break; // Tomamos el inicio del rango
      default: basePrice = 220;
    }
  } else if (isCeramic) {
    switch (vehicle) {
      case 'Coupe/Sedan': basePrice = 800; break;
      case 'Compact SUV': basePrice = 950; break;
      case 'Mid-Sized SUV': basePrice = 1100; break;
      case 'Large SUV/Truck': basePrice = 1300; break;
      case 'Trucks, Suburbans, Minivans': basePrice = 1500; break;
      case 'Motorcycle': basePrice = 500; break;
      case 'RVs': basePrice = 1600; break;
      default: basePrice = 800;
    }
    const extraYears = Math.max(0, years - 2);
    basePrice += (extraYears * 100);
  }

  const isCard = paymentMethod?.toLowerCase().includes('card');
  const tax = isCard ? basePrice * 0.0975 : 0;
  const total = basePrice + tax;

  return {
    subtotal: basePrice,
    tax: tax.toFixed(2),
    total: total.toFixed(2),
    hasTax: isCard
  };
};
  

  {authView === 'verify-code' && (
  <form onSubmit={handleVerifyAndReset} className="space-y-4">
    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
      Verification
    </span>
    <h2 className="text-2xl font-bold mt-4 text-white">Enter Code</h2>
    <p className="text-zinc-400 text-xs mt-1 mb-6">Enter the 6-digit code sent to your email and your new password.</p>

    <div>
      <label className="block text-xs font-semibold text-zinc-300 mb-1">6-Digit Code</label>
      <input 
        type="text" 
        maxLength={6}
        required
        value={verificationCode} 
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="123456"
        className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-center text-xl text-cyan-400 font-bold tracking-widest focus:outline-none focus:border-cyan-400"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold text-zinc-300 mb-1">New Password</label>
      <input 
        type="password" 
        required
        value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 mt-2"
    >
      Reset Password
    </button>
  </form>
)}





  // State to toggle between "services" and "contact" view on the main page
  const [mainView, setMainView] = useState('servicios'); // 'servicios' or 'contacto'
  
  // State to toggle between social media cards in the contact view
  const [socialTab, setSocialTab] = useState('whatsapp'); // 'whatsapp' or 'instagram'

  // States for the quote form
  const [vehicleType, setVehicleType] = useState('Mid-Sized SUV');
  const [isVehicleDropdownOpen, setIsVehicleDropdownOpen] = useState(false);

  // Authentication states (Supabase)
   // Can be email or phone number
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
// 'login' o 'forgot'
  const [authLoading, setAuthLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
const [newPassword, setNewPassword] = useState('');

  // State for gallery modal (Lightbox)
  const [selectedImage, setSelectedImage] = useState(null);

  const vehicleOptions = [
   { label: 'Coupe/Sedan', icon: '🚗' },
  { label: 'Compact SUV', icon: '🚙' },         // <-- SUV chicas
  { label: 'Mid-Sized SUV', icon: '🚙' },
  { label: 'Large SUV/Truck', icon: '🚚' },
  { label: 'Trucks, Suburbans, Minivans', icon: '🚐' }, // <-- Nueva categoría
  { label: 'RVs', icon: '🚌' },                     // <-- RVs
  { label: 'Motorcycle', icon: '🏍️' },
  ];

  // List of gallery images based on provided files
  const galleryImages = [
    { src: '/gallery/cybertruck.jpeg', title: 'Cybertruck Detailing', category: 'Protection & Aesthetics' },
    { src: '/gallery/corvette_back.jpeg', title: 'Corvette C8 - Rear View', category: 'Wash & Shine' },
    { src: '/gallery/corvette_front.jpeg', title: 'Corvette C8 - Front View', category: 'Paint Correction' },
    { src: '/gallery/corvette_emblem.jpeg', title: 'Corvette Emblem Detail', category: 'Meticulous Finish' },
    { src: '/gallery/corvette_foam.jpeg', title: 'Active Foaming Process', category: 'Pro Wash' },
    { src: '/gallery/interior.jpeg', title: 'Deep Interior Cleaning', category: 'Interior Detailing' },
    { src: '/gallery/wheels.jpeg', title: 'Wheel Restoration & Shine', category: 'Wheels & Tires' },
    { src: '/gallery/tesla_red_front.jpeg', title: 'Tesla Model Y - Front', category: 'Ceramic Coating' },
    { src: '/gallery/tesla_red_back.jpeg', title: 'Tesla Model Y - Rear', category: 'UV Protection' },
    { src: '/gallery/tesla_red_side.jpeg', title: 'Tesla Model Y - Profile', category: 'Mirror Shine' },
  ];

  // Check active session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
{/* Sección de Galería de Trabajos */}
<section className="py-16 px-4 max-w-7xl mx-auto flex flex-col items-center">
  <div className="flex flex-col items-center text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Nuestros Trabajos</h2>
    <p className="text-zinc-400 mt-2 text-sm md:text-base">Explora los resultados de nuestro detallado automotriz.</p>
  </div>

  {/* Grid que recorre tu arreglo galleryImages */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {galleryImages.map((img, index) => (
     <div
  key={index}
  onClick={() => setSelectedImage(img)}
  className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:border-zinc-700"
>
        <div className="relative h-64 w-full overflow-hidden">
          <Image 
            src={img.src} 
            alt={img.title} 
            fill 
            className="object-cover transition duration-500 group-hover:scale-110" 
          />
        </div>
        <div className="p-4 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{img.category}</span>
          <h3 className="text-white font-bold text-lg mt-1">{img.title}</h3>
        </div>
      </div>
    ))}
  </div>
</section>

{/* Modal para ver la imagen en grande */}
{selectedImage && (
  <div 
 className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
    onClick={() => setSelectedImage(null)}
  >
    <div 
      className="relative max-w-4xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        onClick={() => setSelectedImage(null)}
     className="absolute top-4 right-4 z-10 bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold transition"
      >
        ✕
      </button>

      <div className="relative w-full h-[60vh] md:h-[70vh] rounded-2xl overflow-hidden">
        <Image 
          src={selectedImage.src} 
          alt={selectedImage.title} 
          fill 
          className="object-contain"
        />
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{selectedImage.category}</span>
        <h3 className="text-white font-bold text-xl mt-1">{selectedImage.title}</h3>
      </div>
    </div>
  </div>
)}
  // Sign in with Email or Phone Number
 const handleLogin = async (e) => {
  e.preventDefault();
  setAuthError('');
  setAuthLoading(true);

  let loginEmail = identifier.trim();

  // Si el usuario ingresó un teléfono (no tiene '@'), buscamos su correo real en la tabla profiles
  if (!loginEmail.includes('@')) {
   const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .select('email')
  .eq('phone', loginEmail)
  .maybeSingle(); // <--- Así

    if (profileError || !profileData) {
      setAuthError('Número de teléfono no encontrado o no registrado.');
      setAuthLoading(false);
      return;
    }
    loginEmail = profileData.email; // Usamos el correo real encontrado en la base de datos
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password,
  });

  if (error) {
    setAuthError('Incorrect credentials or unregistered user.');
  } else {
    setActiveSection('inicio');
    setIdentifier('');
    setPassword('');
  }
  setAuthLoading(false);
};

  // Sign up asking for phone and saving it in Supabase metadata
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

 const { data, error } = await supabase.auth.signUp({
  email: signupEmail,
  password,
  options: {
    data: {
      full_name: fullName,
      phone: userPhone,
    }
  }
});

if (error) {
  console.error("Error detallado al registrarse:", error); // <--- Añade esto
  setAuthError(error.message);
  setAuthLoading(false);
  return;
}

    if (error) {
      setAuthError(error.message);
    } else {
      alert('Account created successfully! You can now sign in.');
      setActiveSection('login');
      setIdentifier('');
      setPassword('');
      setFullName('');
      setPhone('');
    }
    setAuthLoading(false);
  };


const handleForgotPassword = async (e) => {
  e.preventDefault();
  setAuthError('');

  if (!identifier) {
    setAuthError('Por favor ingresa tu correo.');
    return;
  }

  try {
    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: identifier.trim() }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    alert('¡Correo de recuperación enviado con éxito!');
  } catch (err) {
    setAuthError(err.message);
  }
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
      title: 'Engine Wash',
      price: '$60',
      time: '40 min',
      details: [
        'We protect the delicate parts of the water engine by covering them.',
        'We use a degreaser and finish with a glossy look.'
      ],
      borderColor: 'border-cyan-400/40',
    },
    {
      id: 'headlight',
      title: 'Headlight Restoration',
      price: '$90 - $120',
      time: '60 min',
      details: [
        '1. Assessment and preparation: Deep cleaning of the headlight to remove dirt and grease, while the surrounding paintwork is protected with special tape to prevent damage to the bodywork.',
        '2. Sanding and polishing: Yellowing and cloudiness are removed through a multi-stage sanding process (ranging from coarse to fine grit), followed by machine polishing to restore original clarity and shine.',
        '3. Sealing and UV protection: A sealant with UV protection is applied to prevent future yellowing, which restores the headlight to a like-new appearance, improves night-time visibility, and ensures it passes inspection.'
      ],
      borderColor: 'border-yellow-400/40',
    },
    {
      id: 'standard',
      title: 'Standard Wash',
      price:'$35 - $200',
      time: '60-120 min',
      details: [
        'Our ideal maintenance service to keep your car clean, shiny, and presentable week after week.',
        'Exterior: Hand wash with pH-neutral shampoo, cleaning of rims and tires, exterior window cleaning, and hand drying to prevent streaks.',
        'Interior: Thorough vacuuming of seats, carpets, and trunk; cleaning of dashboard, doors, and console; interior window cleaning; and air freshener application.',
        'Perfect for daily use, removing dust and light dirt while preserving your vehicle\'s value without damaging the paint.'
      ],
      borderColor: 'border-red-400/40',
    },
    {
      id: 'deep',
      title: 'Deep Cleaning',
      price: '$70 - $310',
      time: '120-180 min',
      details: [
        '100% Detailed Interior: Deep vacuuming of seats, carpets, trunk, and every nook and cranny; upholstery cleaning to remove stains and odors; cleaning of dashboard, door panels, console, and cup holders; spotless interior windows; and sanitization and long-lasting fresh scent.',
        'Exterior with Premium Finish: Hand wash with foam, deep cleaning of rims and tires, tires conditioned and blackened, and finishing touches that make the difference.',
        'Ideal for daily drivers, vehicles being prepared for sale, or after a long road trip to make your car look showroom-fresh (recommended every 6 months).'
      ],
      borderColor: 'border-zinc-400/40',
    },
    {
      id: 'polishing',
      title: 'Polishing and Waxing',
      price: '$250 - $1300',
      time: '300-540 min',
      details: [
        'Designed to restore a showroom shine when paint looks dull, scratched, and lifeless by removing sun damage, wash-induced micro-scratches, and oxidation, leaving a protected, mirror-like finish.',
        'What does POLISHING do?: Focuses on correction by removing surface scratches, swirl marks, dull and sun-damaged paint, water spots, mineral deposits, and dried bird droppings.',
        'What does WAXING do?: Seals and protects the finish to provide a deep, mirror-like shine, protection against sun, dust, and rain, silky-smooth paint that repels water, and longer-lasting cleanliness.',
        'The result is vibrant color, intense shine, and months of protection.'
      ],
      borderColor: 'border-purple-400/40',
    },
    {
      id: 'ceramic',
      title: 'Ceramic Coating 💎🚗',
      price: '$1100 - $1800',
      time: '300-600 min',
      details: [
        'Ultimate protection for your paintwork that creates a hard, glossy layer protecting your car for months against the sun, rain, dust, and minor scratches.',
        'Delivers an intense, mirror-like shine with extreme protection against sun and water, keeping your car cleaner for longer through a hydrophobic effect where water simply slides off.',
        'It\'s not wax; it\'s professional, long-lasting protection that includes polishing and waxing.',
        'The price may vary depending on the durability period (3 years or 5 years).'
      ],
      borderColor: 'border-amber-400/40',
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#0F0F11] text-white">
        
        {/* HEADER AND NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#111318]/90 backdrop-blur-md border-b border-zinc-800 px-3 sm:px-6 py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 shadow-xl">
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
           <span className="font-extrabold text-xs sm:text-base md:text-lg tracking-wider text-white group-hover:text-cyan-400 transition">
              GASPER <span className="text-cyan-400 text-[10px] block font-normal tracking-widest uppercase">Auto Detailing</span>
            </span>
          </div>

        <nav className="flex flex-col md:flex-row items-center gap-2 md:pl-12">
            <button 
              onClick={() => setActiveSection('galeria')}
              className={`relative px-5 py-2 rounded-xl font-extrabold text-sm tracking-widest uppercase transition-all duration-300 shadow-lg animate-pulse ${
                activeSection === 'galeria' 
                  ? 'bg-cyan-500 text-black shadow-cyan-500/50 scale-105' 
                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/50 hover:border-cyan-400 hover:scale-105 shadow-cyan-500/20'
              }`}
            >
              ✨ Gallery
            </button>
          </nav>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
            {user ? (
             <div className="flex items-center gap-3">
       <button
  onClick={() => setActiveSection('perfil')}
  className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition inline cursor-pointer"
>
  Hello, {user.user_metadata?.full_name || 'User'}
</button>
        <button
          onClick={handleLogout}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-bold px-4 py-2 rounded-xl transition border border-zinc-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setActiveSection('login')}
                  className="text-sm font-semibold text-zinc-300 hover:text-white px-4 py-2 rounded-xl transition hover:bg-zinc-800/50"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setActiveSection('register')}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold px-5 py-2 rounded-xl transition shadow-md shadow-cyan-500/20"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </header>





{activeSection === 'perfil' && (
  <section className="px-6 py-20 max-w-xl mx-auto">
    <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>

      {profileMessage.text && (
  <div className={`mb-4 p-3 rounded-xl text-xs font-semibold ${
    profileMessage.type === 'success' 
      ? 'bg-cyan-950/50 border border-cyan-800 text-cyan-400' 
      : 'bg-red-950/50 border border-red-800 text-red-400'
  }`}>
    {profileMessage.text}
  </div>
)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">   
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name</label>
          <input 
            type="text" 
            disabled 
            value={user?.user_metadata?.full_name || ''} 
            className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-400 cursor-not-allowed" 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Email / Contact</label>
          <input 
            type="text" 
            disabled 
            value={user?.email || user?.user_metadata?.phone || ''} 
            className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-400 cursor-not-allowed" 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Delivery / Home Address</label>
          <input 
            type="text" 
            value={profileAddress} 
            onChange={(e) => setProfileAddress(e.target.value)} 
            placeholder="E.g. 123 Main Street" 
            className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
          />
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            onClick={handleUpdateProfileAddress}
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20"
          >
            Save Address
          </button>
          <button 
            type="button" 
            onClick={() => setActiveSection('inicio')} 
            className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl transition border border-zinc-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  </section>
)}



     

    {activeSection === 'login' ? (
  <section className="px-6 py-20 max-w-md mx-auto">
    <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
      
      {/* AQUí HACEMOS EL CAMBIO DE APARTADO: Validamos si muestra el Login o la Recuperación */}
      {authView === 'login' ? (
        
        /* ---------------- VISTA 1: LOGIN NORMAL ---------------- */
        <div>
          <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
            Account Access
          </span>
          <h2 className="text-2xl font-bold mt-4 text-white">Sign In</h2>

          {authError && (
            <div className="mt-4 bg-red-950/50 border border-red-800 text-red-400 text-xs p-3 rounded-xl">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Email or Phone Number</label>
              <input 
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="email@example.com or +16154292253"
                className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-zinc-400 hover:text-white text-xs font-bold px-2 py-1"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Botón para cambiar al apartado de Forgot Password */}
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => { setAuthView('forgot'); setAuthError(''); }}
                className="text-xs text-cyan-400 hover:underline bg-transparent border-none cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {authLoading ? 'Signing in...' : 'Enter'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <button
              onClick={() => { setActiveSection('register'); setAuthError(''); }}
              className="text-cyan-400 font-bold hover:underline ml-1"
            >
              Register
            </button>
          </div>
        </div>

    ) : authView === 'forgot' ? (

  /* ------------ VISTA 2: RECUPERACIÓN POR CORREO ------------ */
  <form onSubmit={handlePasswordReset} className="space-y-4">
    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
      Recovery
    </span>
    <h2 className="text-2xl font-bold mt-4 text-white">Reset Password</h2>
    <p className="text-zinc-400 text-xs mt-1 mb-6">Enter your registered email to receive recovery instructions.</p>

    {successMessage && (
      <div className="mb-4 bg-emerald-950/50 border border-emerald-800 text-emerald-400 text-xs p-3 rounded-xl text-center">
        {successMessage}
      </div>
    )}

    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-300 mb-1">Email</label>
        <input 
          type="email" 
          required
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          placeholder="email@example.com"
          className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
        />
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 mt-2"
    >
      Send Instructions
    </button>

    <button
      type="button"
      onClick={() => { setAuthView('login'); setAuthError(''); }}
      className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold py-3 rounded-xl transition border border-zinc-700 mt-2"
    >
      Back to Sign In
    </button>
  </form>

) : (

  /* ------------ VISTA 3: VERIFICACIÓN DEL CÓDIGO DE 6 DÍGITOS ------------ */
  <form onSubmit={handleVerifyAndReset} className="space-y-4">
    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
      Verification
    </span>
    <h2 className="text-2xl font-bold mt-4 text-white">Enter Code</h2>
    <p className="text-zinc-400 text-xs mt-1 mb-6">Enter the 6-digit code sent to your email and your new password.</p>

    <div>
      <label className="block text-xs font-semibold text-zinc-300 mb-1">6-Digit Code</label>
      <input 
        type="text" 
        maxLength={6}
        required
        value={verificationCode} 
        onChange={(e) => setVerificationCode(e.target.value)}
        placeholder="123456"
        className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-center text-xl text-cyan-400 font-bold tracking-widest focus:outline-none focus:border-cyan-400"
      />
    </div>

    <div>
      <label className="block text-xs font-semibold text-zinc-300 mb-1">New Password</label>
      <input 
        type="password" 
        required
        value={newPassword} 
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="••••••••"
        className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400"
      />
    </div>

    <button
      type="submit"
      className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 mt-2"
    >
      Reset Password
    </button>
  </form>

)}

  
</div>
</section>

        ) : activeSection === 'register' ? (
          <section className="px-6 py-20 max-w-md mx-auto">
            <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
              <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
                Join Gasper
              </span>
              <h2 className="text-2xl font-bold mt-4 text-white">Create Account</h2>
              
              {authError && (
                <div className="mt-4 bg-red-950/50 border border-red-800 text-red-400 text-xs p-3 rounded-xl">
                  {authError}
                </div>
              )}

              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="E.g. John Smith" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="email@example.com" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="E.g. +1 615 429 2253" 
                    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
                  />
                </div>

<div style={{ marginBottom: '16px' }}>
  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Address *</label>
  <input 
    type="text" 
    placeholder="E.g. 123 Main Street" 
    value={clientAddress}
    onChange={(e) => setClientAddress(e.target.value)}
    style={{ width: '100%', padding: '12px', background: '#1a1a1e', border: '1px solid #2a2a30', borderRadius: '8px', color: '#fff' }}
    required
  />
</div>


                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
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
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={authLoading}
                    className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {authLoading ? 'Registering...' : 'Register Account'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-zinc-400">
                Already have an account?{' '}
                <button 
                  onClick={() => { setActiveSection('login'); setAuthError(''); }}
                  className="text-cyan-400 font-bold hover:underline ml-1"
                >
                  Sign In
                </button>
              </div>
            </div>
          </section>
          
        ) : activeSection === 'cotizar' ? (
<section className="px-6 py-20 max-w-xl mx-auto">
  <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 shadow-2xl">
    <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-800/40">
      Appointment / Booking
    </span>
    <h2 className="text-2xl font-bold mt-4 text-white">Book: {selectedServiceToQuote || 'General Service'}</h2>

   <form onSubmit={handleBookingSubmit} className="mt-6 space-y-4">
{/* Pégalo aquí */}
  {bookingMessage && (
    <div className={`p-3 rounded-xl text-xs font-semibold ${
      bookingMessage.type === 'success' 
        ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-400' 
        : 'bg-red-950/50 border border-red-800 text-red-400'
    }`}>
      {bookingMessage.text}
    </div>
  )}



 {/* Precio dinámico y selector de años para Ceramic Coating */}
{selectedServiceToQuote?.toLowerCase().includes('ceramic') && (
  <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl space-y-4">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <p className="text-xs text-zinc-400">Package & Protection:</p>
        <p className="text-sm font-semibold text-white">Polishing + Ceramic Coating ({ceramicYears} Years Protection)</p>
      </div>
      <div className="text-left sm:text-right w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-cyan-500/20">
        <span className="text-lg font-bold text-cyan-400">
          {getCeramicPrice(vehicleType, ceramicYears)}
        </span>
      </div>
    </div>

    {/* Selector de Años (De 2 a 10 años) */}
    <div>
      <label className="block text-xs font-medium text-zinc-300 mb-2">Select Duration (Years):</label>
      <div className="flex flex-wrap gap-2">
        {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((year) => (
          <button
            key={year}
            type="button"
            onClick={() => setCeramicYears(year)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              ceramicYears === year
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
                : 'bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-cyan-400'
            }`}
          >
            {year} Years
          </button>
        ))}
      </div>
    </div>
  </div>
)}

      {/* Selector de Vehículo */}
      <div className="relative">
        <label className="block text-xs font-semibold text-zinc-300 mb-1">Vehicle Type</label>
        <div 
          onClick={() => setIsVehicleDropdownOpen(!isVehicleDropdownOpen)}
          className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between cursor-pointer hover:border-cyan-400 transition"
        >
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 text-base">
 {vehicleType === 'Coupe/Sedan' ? '🚗' : 
     vehicleType === 'Compact SUV' ? '🚙' : 
     vehicleType === 'Mid-Sized SUV' ? '🚙' : 
     vehicleType === 'Large SUV/Truck' ? '🚚' : 
     vehicleType === 'Trucks, Suburbans, Minivans' ? '🚐' : 
     vehicleType === 'RVs' ? '🚌' : 
     vehicleType === 'Motorcycle' ? '🏍️' : '❓'}
  </span>
            <span>{vehicleType}</span>
          </div>
          <span className={`transform transition-transform duration-300 text-zinc-400 ${isVehicleDropdownOpen ? 'rotate-180' : ''}`}>
            v
          </span>
        </div>

        {isVehicleDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#16181d] border border-zinc-700 rounded-xl overflow-hidden shadow-2xl z-20">
         {vehicleOptions
    .filter((option) => {
  // Si la opción es la moto, validamos si se permite
  if (option.label === 'Motorcycle') {
    const isCeramic = selectedServiceToQuote?.toLowerCase().includes('ceramic');
    const allowedServicesForMoto = ['standard wash', 'deep cleaning', 'polishing and waxing'];
    
    // Se muestra si es Ceramic o si está en la lista de permitidos
    return isCeramic || allowedServicesForMoto.some(s => selectedServiceToQuote?.toLowerCase().includes(s));
  }
  return true;
})
      .map((option) => (
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

      {/* CALENDARIO INTERACTIVO EN TIEMPO REAL (En Inglés) */}
      <div className="bg-[#0F0F11] border border-zinc-700 rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-white">
            {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <span className="text-xs text-cyan-400 font-semibold">{selectedDate ? `Selected: ${selectedDate}` : 'Select a date'}</span>
        </div>

        {/* Días de la semana en Inglés */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <span key={day} className="text-[10px] font-bold text-zinc-500 uppercase">{day}</span>
          ))}
        </div>

     {/* Generador dinámico de días del mes actual */}
  <div className="grid grid-cols-7 gap-1">
    {(() => {
      const nowLocal = new Date();
      const currentYear = nowLocal.getFullYear();
      const currentMonth = nowLocal.getMonth();
      
      const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; 
      const computedTotalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

      const daysArray = [];
      
      // Espacios vacíos antes del primer día del mes
      for (let i = 0; i < firstDayIndex; i++) {
        daysArray.push(<div key={`empty-${i}`} />);
      }

      // Variables de fecha y hora actual
      const todayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(nowLocal.getDate()).padStart(2, '0')}`;
      const currentHour = nowLocal.getHours();
      const currentMinute = nowLocal.getMinutes();
      const isTodayExpired = currentHour >= 12 && currentMinute > 0;

      // Días del mes
      for (let d = 1; d <= computedTotalDays; d++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isSelected = selectedDate === dateStr;
        const isPast = dateStr < todayStr || (dateStr === todayStr && isTodayExpired);

        daysArray.push(
          <button
            key={d}
            type="button"
            disabled={isPast}
            onClick={() => setSelectedDate(dateStr)}
            className={`py-2 text-xs rounded-xl font-semibold transition ${
              isPast 
                ? 'bg-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed' 
                : isSelected 
                  ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20' 
                  : 'text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            {d}
          </button>
        );
      }

      return daysArray;
    })()}
  </div>  
      </div>

 {/* Horarios Disponibles de 6:00 AM a 12:00 PM */}
<div>
  <label className="block text-xs font-semibold text-zinc-300 mb-1">Available Time Slots (6:00 AM - 12:00 PM)</label>
  <div className="grid grid-cols-3 gap-2">
    {[
      '06:00 AM',
      '07:00 AM',
      '08:00 AM',
      '09:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM'
    ].map((time) => {
      const isSelected = selectedTime === time;
      return (
        <button
          key={time}
          type="button"
          onClick={() => setSelectedTime(time)}
          className={`py-2 text-xs rounded-xl font-semibold transition ${
            isSelected 
              ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20' 
              : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800'
          }`}
        >
          {time}
        </button>
      );
    })}
  </div>
</div>

      {/* Datos del usuario */}
      {user ? (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 mt-4">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Your account details:</p>
          <p className="text-sm font-bold text-white mt-1">{user.user_metadata?.full_name || 'User'}</p>
          <p className="text-sm text-zinc-300">{user.email?.startsWith('phone_') ? 'Registered phone' : user.email}</p>
          {user.user_metadata?.phone && (
            <p className="text-sm text-zinc-300">📞 {user.user_metadata.phone}</p>
          )}
          <p className="text-xs text-cyan-400 mt-2">✓ Your details will be used automatically for this appointment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Your Name *</label>
            <input type="text" required placeholder="E.g. John Smith" className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Phone Number or Email *</label>
            <input type="text" required placeholder="E.g. +1 615 429 2253 or email@gmail.com" className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Address *</label>
            <input 
              type="text" 
              required 
              value={clientAddress} 
              onChange={(e) => setClientAddress(e.target.value)} 
              placeholder="E.g. 123 Main Street" 
              className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400" 
            />
          </div>
        </div>
      )}


      {/* Selector de Método de Pago */}
<div className="relative mb-4">
  <label className="block text-xs font-semibold text-zinc-300 mb-1">Payment Method *</label>
  <div
    onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
    className="w-full bg-[#0F0F11] border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white flex items-center justify-between cursor-pointer hover:border-cyan-400 transition"
  >
    <span className="text-cyan-400 font-medium">{paymentMethod}</span>
    <span className={`transform transition-transform duration-300 text-zinc-400 ${isPaymentDropdownOpen ? 'rotate-180' : ''}`}>
      v
    </span>
  </div>

  {isPaymentDropdownOpen && (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#16181d] border border-zinc-700 rounded-xl overflow-hidden shadow-2xl z-20">
      {[
        'Zelle',
        'Venmo',
        'Cash',
        'Credit Card (Visa, MC, AMEX) - PLUS TAX',
        'Debit Card - PLUS TAX'
      ].map((method) => (
        <div
          key={method}
          onClick={() => {
            setPaymentMethod(method);
            setIsPaymentDropdownOpen(false);
          }}
          className={`px-4 py-3 text-sm cursor-pointer transition ${
            paymentMethod === method ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-zinc-300 hover:bg-zinc-800'
          }`}
        >
          {method}
        </div>
      ))}
    </div>
  )}
</div>

{/* Resumen de Estimación de Precio y Taxes (Para Ceramic y Deep Cleaning) */}
{(selectedServiceToQuote?.toLowerCase().includes('ceramic') || selectedServiceToQuote?.toLowerCase().includes('deep cleaning')) && (
  <div className="mb-6 p-4 bg-zinc-900/80 border border-zinc-700/80 rounded-xl space-y-2 text-sm">
    <div className="flex justify-between text-zinc-400">
      <span>Service Subtotal:</span>
      <span>${calculateTotalPrice(selectedServiceToQuote, vehicleType, ceramicYears, paymentMethod).subtotal}</span>
    </div>

    {calculateTotalPrice(selectedServiceToQuote, vehicleType, ceramicYears, paymentMethod).hasTax && (
      <div className="flex justify-between text-zinc-400 text-xs">
        <span>Estimated Tax (9.75%):</span>
        <span>+${calculateTotalPrice(selectedServiceToQuote, vehicleType, ceramicYears, paymentMethod).tax}</span>
      </div>
    )}

    <div className="pt-2 border-t border-zinc-800 flex justify-between items-center font-bold text-white">
      <span>Estimated Total:</span>
      <span className="text-cyan-400 text-lg">
        ${calculateTotalPrice(selectedServiceToQuote, vehicleType, ceramicYears, paymentMethod).total} USD
      </span>
    </div>
    
    <p className="text-[11px] text-zinc-500 text-right">
      {calculateTotalPrice(selectedServiceToQuote, vehicleType, ceramicYears, paymentMethod).hasTax 
        ? 'Tax applied for Card payment.' 
        : 'No taxes applied for Cash/Zelle/Venmo.'}
    </p>
  </div>
)}
      

      {/* Botones de Acción */}
      <div className="pt-4 flex gap-3">
        <button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20">
          Confirm Booking
        </button>
        <button type="button" onClick={() => setActiveSection('inicio')} className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold px-6 py-3 rounded-xl transition border border-zinc-700">
          Back
        </button>
      </div>
    </form>
  </div>
</section>
          
        ) : activeSection === 'galeria' ? (
          <section className="px-6 py-20 max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-cyan-400 font-semibold tracking-widest text-xs uppercase bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-800/50">
                Visual Portfolio
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-4">
                Our Work <span className="text-cyan-400">Gallery</span>
              </h2>
              <p className="text-zinc-400 mt-4 text-base md:text-lg">
                Explore the level of detail, mirror finish, and professional protection we apply to every vehicle.
              </p>
            </div>

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
                ← Back to Services
              </button>
            </div>

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
          <>
            <section className="px-6 py-20 text-center bg-gradient-to-b from-[#0F0F11] to-[#16181d] border-b border-zinc-800">
              <div className="max-w-4xl mx-auto">
                <span className="text-cyan-400 font-semibold tracking-widest text-xs uppercase bg-cyan-950/50 px-3 py-1.5 rounded-full border border-cyan-800/50">
                  Automotive detailing excellence
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mt-6">
                  Bring back the shine and elegance to your <span className="text-cyan-400">vehicle</span>
                </h1>
                <p className="mt-6 text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  High-level professional care with specialized products, ceramic protection, and meticulous detailing in every corner.
                </p>

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
                    Contact Us
                  </button>
                </div>
              </div>
            </section>

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
                    <div className="px-4 py-4 sm:px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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

                    <div className="w-full md:w-auto flex flex-wrap sm:flex-nowrap items-center justify-between md:justify-end gap-3 mt-3 md:mt-0">
                          <div className="text-zinc-400 text-xs md:text-sm flex items-center gap-1.5 bg-zinc-900/60 px-3 py-1.5 rounded-full border border-zinc-800">
                            <span>⏱️</span>
                            <span>{service.time}</span>
                          </div>

                          <button
                            onClick={() => toggleService(service.id)}
                            className="text-zinc-400 hover:text-white p-1 rounded-lg transition"
                            aria-label="Options"
                          >
                            <span className={`transform inline-block transition-transform duration-300 text-lg font-bold ${openServices[service.id] ? 'rotate-180' : ''}`}>
                              ⋮
                            </span>
                          </button>
                        </div>
                      </div>

                      {openServices[service.id] && (
                        <div className="px-6 pb-5 pt-2 text-zinc-400 border-t border-zinc-800/60 text-sm leading-relaxed bg-[#111318]/50">
                          <ul className="space-y-2 list-disc pl-4 mt-2">
                            {service.details.map((detail, idx) => (
                              <li key={idx}>{detail}</li>
                            ))}
                          </ul> 

                          {/* Accepted Payment Methods */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80">
        <p className="text-xs text-zinc-400 font-medium mb-2">Accepted Payment Methods:</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700/60 rounded-md text-[11px] text-zinc-300">Zelle</span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700/60 rounded-md text-[11px] text-zinc-300">Venmo</span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700/60 rounded-md text-[11px] text-zinc-300">Cash</span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700/60 rounded-md text-[11px] text-zinc-300">Credit Card (Visa, MC, AMEX) - PLUS TAX</span>
          <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-700/60 rounded-md text-[11px] text-zinc-300">Debit Card - PLUS TAX</span>
        </div>
      </div>
                          <div className="mt-4 flex justify-end">
                            <button 
                              onClick={() => handleQuoteClick(service.title)}
                              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
                            >
                              Quote this service →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="px-6 py-20 max-w-2xl mx-auto">
                <div className="bg-[#16181d] border border-zinc-800 rounded-3xl p-8 md:p-10 shadow-2xl text-center">
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-800/40">
                    Get in touch
                  </span>
                  <h2 className="text-3xl font-bold mt-4 text-white">Contact Us</h2>
                  <p className="text-zinc-400 mt-2 text-sm max-w-md mx-auto">
                    Have questions or need personalized assistance? Scan the QR code or click the buttons to connect directly with us.
                  </p>
                  
                  {/* Tab selector for Social Media / Contact Channels */}
                 <div className="mt-8 flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setSocialTab('whatsapp')}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
                        socialTab === 'whatsapp'
                          ? 'bg-[#25D366] text-black shadow-lg shadow-green-500/20'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                      }`}
                    >
                      <span>💬</span> WhatsApp
                    </button>
                    <button
                      onClick={() => setSocialTab('instagram')}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
                        socialTab === 'instagram'
                          ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-lg shadow-pink-500/20'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                      }`}
                    >
                      <span>📸</span> Instagram
                    </button>
                    <button
                      onClick={() => setSocialTab('facebook')}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 ${
                        socialTab === 'facebook'
                          ? 'bg-[#1877F2] text-white shadow-lg shadow-blue-500/20'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                      }`}
                    >
                      <span>👥</span> Facebook
                    </button>
                  </div>

               {/* Dynamic Content Card according to socialTab */}
{socialTab === 'whatsapp' ? (
   <div className="mt-6 mx-4 sm:mx-auto bg-[#111318] border border-zinc-700/80 rounded-3xl p-5 sm:p-8 shadow-xl max-w-sm flex flex-col items-center relative overflow-hidden group">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/60 flex items-center justify-center shadow-md mb-4">
            <span className="text-2xl">👤</span>
        </div>

        <h3 className="text-xl font-bold text-white tracking-wide">Gasper Auto Care</h3>
        <p className="text-xs text-zinc-400 mt-1 mb-6">WhatsApp Business Account</p>

        {/* --- REEMPLAZA DESDE AQUÍ --- */}
        <div className="bg-white p-4 rounded-2xl shadow-inner border border-zinc-200 flex flex-col items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
            <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/16154292253" 
                alt="QR WhatsApp Gasper Auto Care" 
                className="w-36 h-36 object-contain rounded-lg"
            />
        </div>

                      <p className="text-xs text-zinc-400 mt-6 leading-relaxed px-2">
                        Scan this code to start a WhatsApp chat with Gasper Auto Care.
                      </p>

                      <div className="mt-6 w-full">
                        <a 
                          href="https://wa.me/16154292253" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-black font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 text-sm tracking-wide"
                        >
                          <span>💬</span> Send message via WhatsApp
                        </a>
                      </div>
                    </div>
                  ) : socialTab === 'instagram' ? (
                    <div className="mt-6 bg-[#111318] border border-zinc-700/80 rounded-3xl p-6 md:p-8 shadow-xl max-w-sm mx-auto flex flex-col items-center relative overflow-hidden group">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20 border-2 border-pink-500/60 flex items-center justify-center shadow-md mb-4">
                        <span className="text-2xl">📸</span>
                      </div>

                      <h3 className="text-xl font-bold text-white tracking-wide">@gasper.auto.detailing</h3>
                      <p className="text-xs text-zinc-400 mt-1 mb-6">Follow us on Instagram</p>

                      <div className="bg-white p-4 rounded-2xl shadow-inner border border-zinc-200 flex flex-col items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
                       <div className="bg-white p-4 rounded-2xl shadow-inner border border-zinc-200 flex flex-col items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
            <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/gasper.auto.detailing" 
                alt="QR Instagram Gasper Auto Detailing" 
                className="w-36 h-36 object-contain rounded-lg"
            />
        </div>
                      </div>

                      <p className="text-xs text-zinc-400 mt-6 leading-relaxed px-2">
                        Scan the QR code to check out our stories, reels, and recent work on Instagram.
                      </p>

                      <div className="mt-6 w-full">
                        <a 
                          href="https://www.instagram.com/gasper.auto.detailing?utm_source=qr&igsh=bnZ6MmM3YWQwaHds" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 text-sm tracking-wide"
                        >
                          <span>✨</span> Visit Instagram
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 bg-[#111318] border border-zinc-700/80 rounded-3xl p-6 md:p-8 shadow-xl max-w-sm mx-auto flex flex-col items-center relative overflow-hidden group">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500/20 to-blue-700/20 border-2 border-blue-500/60 flex items-center justify-center shadow-md mb-4">
                        <span className="text-2xl">👥</span>
                      </div>

                      <h3 className="text-xl font-bold text-white tracking-wide">Gasper Auto Detailing</h3>
                      <p className="text-xs text-zinc-400 mt-1 mb-6">Facebook Community</p>

                     <div className="bg-white p-4 rounded-2xl shadow-inner border border-zinc-200 flex flex-col items-center justify-center relative group-hover:scale-105 transition-transform duration-300">
    <img 
        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.facebook.com/share/1Bqg4ox7YS/"
        alt="QR Facebook Gasper Auto Detailing" 
        className="w-36 h-36 object-contain rounded-lg"
    />
</div>
                      <p className="text-xs text-zinc-400 mt-6 leading-relaxed px-2">
                        Visit our Facebook page to check out promotions and reviews.
                      </p>

                      <div className="mt-6 w-full">
                        <a 
                          href="https://www.facebook.com/share/1Bqg4ox7YS/"
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-extrabold py-3.5 px-6 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm tracking-wide"
                        >
                          <span>👥</span> Visit us on Facebook
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800">
                    <p className="text-sm text-zinc-300">📞 <strong className="text-white">Phone:</strong> +1 (615) 429-2253</p>
                    <p className="text-sm text-zinc-300">📧 <strong className="text-white">Email:</strong> contacto@gasperdetailing.com</p>
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