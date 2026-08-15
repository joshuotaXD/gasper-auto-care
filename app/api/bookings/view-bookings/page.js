const handleConfirmBooking = async () => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name,          // El estado o valor con el nombre del cliente
        vehicleType: vehicleType, // El tipo de vehículo seleccionado
        date: selectedDate,       // La fecha seleccionada en el calendario
        timeSlot: selectedTime    // La hora seleccionada
      })
    });

    const data = await response.json();

    if (data.success) {
      alert("Booking confirmed successfully!");
      // Aquí puedes limpiar el formulario o actualizar la vista
    } else {
      alert("Hubo un error al guardar la reserva: " + data.error);
    }
  } catch (err) {
    console.error(err);
  }
};