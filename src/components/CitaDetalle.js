import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function CitaDetalle() {
  const { citaId } = useParams();
  const [cita, setCita] = useState(null);

  useEffect(() => {
    fetch(`/api/citas/${citaId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCita(data))
      .catch((error) => console.error("Error fetching cita details:", error));
  }, [citaId]);

  if (!cita) return <p>Cargando detalles de la cita...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Detalles de la Cita</h1>
      <p>
        <strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString()}
      </p>
      <p>
        <strong>Hora:</strong> {cita.hora}
      </p>
      <p>
        <strong>Estado:</strong> {cita.estado}
      </p>
      <p>
        <strong>Modalidad:</strong> {cita.modalidad}
      </p>
      <p>
        <strong>Costo Total:</strong> {cita.costo_total}
      </p>
      <p>
        <strong>Perfiles:</strong>{" "}
        {cita.perfiles.map((p) => p.nombre).join(", ")}
      </p>
      <p>
        <strong>Exámenes:</strong>{" "}
        {cita.examenes.map((e) => e.nombre).join(", ")}
      </p>
    </div>
  );
}

export default CitaDetalle;
