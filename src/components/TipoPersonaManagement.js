// src/components/TipoPersonaManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TipoPersonaManagement = () => {
  const [tiposPersona, setTiposPersona] = useState([]);
  const [tipo, setTipo] = useState("");
  const [selectedTipoPersonaId, setSelectedTipoPersonaId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(""); // "update" or "delete"

  useEffect(() => {
    fetchTiposPersona();
  }, []);

  const fetchTiposPersona = async () => {
    try {
      const response = await axios.get("/api/tipo-personas");
      setTiposPersona(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de persona", error);
    }
  };

  const handleSelectTipoPersona = (tipoPersona) => {
    setTipo(tipoPersona.tipo);
    setSelectedTipoPersonaId(tipoPersona._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedTipoPersonaId) {
      // If there is a selected tipoPersona, update it
      setAction("update");
      setShowConfirm(true);
    } else {
      // If no tipoPersona is selected, create a new one
      try {
        const response = await axios.post("/api/tipo-personas", { tipo });
        setTiposPersona([...tiposPersona, response.data]);
        setTipo("");
      } catch (error) {
        console.error("Error al crear el tipo de persona", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `/api/tipo-personas/${selectedTipoPersonaId}`,
        {
          tipo,
        }
      );
      setTiposPersona(
        tiposPersona.map((tipoPersona) =>
          tipoPersona._id === selectedTipoPersonaId
            ? response.data
            : tipoPersona
        )
      );
      setSelectedTipoPersonaId(null);
      setTipo("");
    } catch (error) {
      console.error("Error al actualizar el tipo de persona", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/tipo-personas/${selectedTipoPersonaId}`);
      setTiposPersona(
        tiposPersona.filter(
          (tipoPersona) => tipoPersona._id !== selectedTipoPersonaId
        )
      );
      setSelectedTipoPersonaId(null);
      setTipo("");
    } catch (error) {
      console.error("Error al eliminar el tipo de persona", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setAction("");
    setSelectedTipoPersonaId(null);
    setTipo("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Tipos de Persona</h1>

      {/* Formulario para crear o editar tipo de persona */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-gray-700">Tipo</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {selectedTipoPersonaId ? (
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Actualizar Tipo de Persona
            </button>
            <button
              type="button"
              onClick={() => {
                setAction("delete");
                setShowConfirm(true);
              }}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Eliminar Tipo de Persona
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black p-2 rounded ml-2"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Crear Tipo de Persona
          </button>
        )}
      </form>

      {/* Tabla de tipos de persona existentes */}

      <h2 className="text-xl font-bold mb-4">Lista de Tipos de persona</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="py-2">Tipo</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tiposPersona.map((tipoPersona) => (
            <tr key={tipoPersona._id}>
              <td className="border px-4 py-2">{tipoPersona.tipo}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleSelectTipoPersona(tipoPersona)}
                  className="bg-red-400 text-white p-1 rounded mr-2"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-2">
              {action === "update"
                ? "Actualizar Tipo de Persona"
                : "Eliminar Tipo de Persona"}
            </h3>
            <p>
              {action === "update"
                ? "¿Estás seguro de que deseas actualizar este tipo de persona?"
                : "¿Estás seguro de que deseas eliminar este tipo de persona?"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black p-2 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={action === "update" ? handleUpdate : handleDelete}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TipoPersonaManagement;
