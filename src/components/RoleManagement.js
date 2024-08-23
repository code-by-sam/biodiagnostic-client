// src/components/RoleManagement.js
import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";


const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(""); // "update" or "delete"

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener los roles", error);
    }
  };

  const handleSelectRole = (role) => {
    setNombre(role.nombre);
    setSelectedRoleId(role._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRoleId) {
      // If there is a selected role, update it
      setAction("update");
      setShowConfirm(true);
    } else {
      // If no role is selected, create a new one
      try {
        const response = await axios.post("/api/roles", { nombre });
        setRoles([...roles, response.data]);
        setNombre("");
      } catch (error) {
        console.error("Error al crear el rol", error);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/roles/${selectedRoleId}`, {
        nombre,
      });
      setRoles(
        roles.map((role) =>
          role._id === selectedRoleId ? response.data : role
        )
      );
      setSelectedRoleId(null);
      setNombre("");
    } catch (error) {
      console.error("Error al actualizar el rol", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/roles/${selectedRoleId}`);
      setRoles(roles.filter((role) => role._id !== selectedRoleId));
      setSelectedRoleId(null);
      setNombre("");
    } catch (error) {
      console.error("Error al eliminar el rol", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setAction("");
    setSelectedRoleId(null);
    setNombre("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Gestión de Roles</h1>

      {/* Formulario para crear o editar rol */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {selectedRoleId ? (
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Actualizar Rol
            </button>
            <button
              type="button"
              onClick={() => {
                setAction("delete");
                setShowConfirm(true);
              }}
              className="bg-red-500 text-white p-2 rounded ml-2"
            >
              Eliminar Rol
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
            Crear Rol
          </button>
        )}
      </form>

      {/* Tabla de roles existentes */}

      <h2 className="text-xl font-bold mb-4">Lista de Roles de Usuario</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role._id}>
              <td className="border px-4 py-2">{role.nombre}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleSelectRole(role)}
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
              {action === "update" ? "Actualizar Rol" : "Eliminar Rol"}
            </h3>
            <p>
              {action === "update"
                ? "¿Estás seguro de que deseas actualizar este rol?"
                : "¿Estás seguro de que deseas eliminar este rol?"}
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

export default RoleManagement;
