// app/admin/reservations/page.js
"use client";
import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const password = prompt("Introduce la clave de administrador:");
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true);
    }
  }, []);

  if (!auth) return <p>Acceso denegado</p>;

  return (
    <div>
      <h1>Panel de Reservas</h1>
      {/* Aquí haces el fetch a tu base de datos para mostrar la lista */}
    </div>
  );
}