'use client';
import Image from 'next/image';

export default function Gallery({ galleryImages, onImageClick }) {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Nuestros Trabajos</h2>
        <p className="text-zinc-400 mt-2 text-sm md:text-base">Explora los resultados de nuestro detallado automotriz.</p>
      </div>

      {/* Grid de imágenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((img, index) => (
          <div 
            key={index} 
            onClick={() => onImageClick(img)}
            className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-[1.02] hover:border-zinc-700"
          >
            {/* Contenedor de la imagen */}
            <div className="relative h-64 w-full overflow-hidden">
              <Image 
                src={img.src} 
                alt={img.title} 
                fill 
                className="object-cover transition duration-500 group-hover:scale-110" 
              />
            </div>
            
            {/* Título y categoría */}
            <div className="p-4 bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{img.category}</span>
              <h3 className="text-white font-bold text-lg mt-1">{img.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}