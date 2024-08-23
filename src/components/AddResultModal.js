import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const AddResultModal = ({ citaId, onClose }) => {
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const formattedTime = now.toTimeString().split(" ")[0].slice(0, 5); // HH:MM
    setFecha(formattedDate);
    setHora(formattedTime);
  }, []);

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("citaId en handleSubmit:", citaId); // Verifica el ID aquí

    if (!descripcion || !archivo || !fecha || !hora) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const formData = new FormData();
    formData.append("descripcion", descripcion);
    formData.append("archivo", archivo);
    formData.append("fecha", fecha);
    formData.append("hora", hora);

    try {
      const resultResponse = await axios.post(`/api/resultados`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const resultadoId = resultResponse.data.resultado._id;

      if (!citaId) {
        throw new Error("ID de cita no proporcionado.");
      }

      await axios.post(`/api/resultados/${resultadoId}/cita/${citaId}`);
      onClose(true); // Indicar que el resultado se ha añadido
    } catch (err) {
      setError("Error al añadir el resultado.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Añadir Resultado</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Descripción
            </label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Archivo (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Hora</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="border p-2 rounded w-full"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Añadir
          </button>
          <button
            type="button"
            onClick={() => onClose(false)} // Indicar que no se ha añadido correctamente
            className="ml-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResultModal;
