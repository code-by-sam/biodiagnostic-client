// src/components/AssignUser.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const AssignUser = () => {
  const [personas, setPersonas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [tipoPersonas, setTipoPersonas] = useState([]);
  const [selectedTipoPersona, setSelectedTipoPersona] = useState("");
  const [error, setError] = useState(null); // Para manejar errores

  useEffect(() => {
    fetchPersonas();
    fetchUsuarios();
    fetchTipoPersonas();
  }, [selectedTipoPersona]);

  // Función para obtener las personas ordenadas por fecha de creación
  const fetchPersonas = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedTipoPersona) {
        queryParams.append("tipo_persona", selectedTipoPersona);
      }
      queryParams.append("sort", "created_at");
      queryParams.append("order", "desc");

      const url = `/api/personas?${queryParams.toString()}`;
      console.log("Fetching personas from:", url);
      const response = await axios.get(url);
      console.log("Personas obtenidas:", response.data.personas);
      setPersonas(response.data.personas);
    } catch (error) {
      console.error(
        "Error al obtener las personas:",
        error.response ? error.response.data : error.message
      );
      setError("No se pudieron obtener las personas.");
    }
  };

  // Función para obtener los tipos de personas
  const fetchTipoPersonas = async () => {
    try {
      const response = await axios.get("/api/tipo-personas");
      setTipoPersonas(response.data);
    } catch (error) {
      console.error("Error al obtener los tipos de personas", error);
      setError("No se pudieron obtener los tipos de personas.");
    }
  };

  // Función para obtener los usuarios que no están asociados a ninguna persona
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("/api/usuarios/no-asociados");
      console.log("Usuarios obtenidos:", response.data);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener los usuarios", error);
      setError("No se pudieron obtener los usuarios.");
    }
  };

  // Función para manejar la asignación de un usuario a una persona
  const handleAssignUser = async (usuarioId) => {
    try {
      await axios.put(`/api/personas/${selectedPersonaId}/asignar-usuario`, {
        usuarioId,
      });
      console.log("Usuario asignado");
      await fetchPersonas(); // Actualiza la lista de personas
      await fetchUsuarios(); // Actualiza la lista de usuarios disponibles
      setSelectedPersonaId(null);
      setIsAssigning(false);
    } catch (error) {
      console.error("Error al asignar el usuario", error);
      setError("No se pudo asignar el usuario.");
    }
  };

  // Función para manejar la desasignación de un usuario
  const handleUnassignUser = async (usuarioId) => {
    try {
      await axios.put(`/api/personas/${selectedPersonaId}/quitar-usuario`, {
        usuarioId,
      });
      console.log("Usuario desasignado");
      await fetchPersonas(); // Actualiza la lista de personas
      await fetchUsuarios(); // Actualiza la lista de usuarios disponibles
      setSelectedPersonaId(null);
      setIsAssigning(false);
    } catch (error) {
      console.error("Error al desasignar el usuario", error);
      setError("No se pudo desasignar el usuario.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Asignar Usuario</h1>

      {/* Manejo de errores */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>
      )}

      {/* Selector para elegir el tipo de persona */}
      <div className="mb-4">
        <label
          htmlFor="tipoPersona"
          className="block text-lg font-medium text-gray-700"
        >
          Filtrar por Tipo de Persona
        </label>
        <select
          id="tipoPersona"
          value={selectedTipoPersona}
          onChange={(e) => setSelectedTipoPersona(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todos</option>
          {tipoPersonas.map((tipo) => (
            <option key={tipo._id} value={tipo._id}>
              {tipo.tipo}
            </option>
          ))}
        </select>
      </div>

      {/* Lista de personas filtradas por tipo */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Personas</h2>
        <ul>
          {personas.length === 0 ? (
            <p>No hay personas disponibles.</p>
          ) : (
            personas.map((persona) => (
              <li
                key={persona._id}
                className="flex flex-col border p-4 mb-2 rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-1">
                    <p className="font-semibold">
                      {persona.nombres} {persona.apellido_pat}{" "}
                      {persona.apellido_mat}
                    </p>
                    <p>Documento de identidad: {persona.documento_identidad}</p>
                    <p>Tipo: {persona.tipo_persona?.tipo}</p>
                    <p>
                      Usuario:{" "}
                      {persona.usuario
                        ? persona.usuario.username
                        : "No asignado"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPersonaId(persona._id);
                      setIsAssigning(true);
                    }}
                    className={`p-2 rounded ${
                      persona.usuario ? "bg-red-500" : "bg-blue-500"
                    } text-white`}
                  >
                    {persona.usuario
                      ? "Desvincular Usuario"
                      : "Asignar Usuario"}
                  </button>
                </div>
                {isAssigning &&
                  selectedPersonaId === persona._id &&
                  !persona.usuario && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">
                        Usuarios Disponibles
                      </h3>
                      <ul>
                        {usuarios.map((usuario) => (
                          <li
                            key={usuario._id}
                            className="flex justify-between items-center border p-2 mb-2 rounded-lg"
                          >
                            <p>{usuario.username}</p>
                            <p>
                              Rol:{" "}
                              {usuario.rol ? usuario.rol.nombre : "Sin rol"}
                            </p>
                            <button
                              onClick={() => handleAssignUser(usuario._id)}
                              className="bg-green-500 text-white p-2 rounded"
                            >
                              Asignar
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => setIsAssigning(false)}
                        className="mt-4 bg-red-500 text-white p-2 rounded"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                {isAssigning &&
                  selectedPersonaId === persona._id &&
                  persona.usuario && (
                    <button
                      onClick={() => handleUnassignUser(persona.usuario._id)}
                      className="mt-4 bg-red-500 text-white p-2 rounded"
                    >
                      Desvincular Usuario
                    </button>
                  )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default AssignUser;
