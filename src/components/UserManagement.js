import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const UserManagement = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState(""); // Estado para la contraseña
  const [rol, setRol] = useState(""); // Estado para el rol
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(""); // "update", "delete" o "create"
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showList, setShowList] = useState(false); // Estado para manejar la visibilidad de la lista
  const [listButtonColor, setListButtonColor] = useState("bg-green-500"); // Estado para el color del botón de la lista
  const [roles, setRoles] = useState([]); // Estado para los roles
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener usuarios
        const usuariosResponse = await axios.get("/api/usuarios");
        setUsuarios(usuariosResponse.data);
        setFilteredUsuarios(usuariosResponse.data);

        // Obtener roles
        const rolesResponse = await axios.get("/api/roles");
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error("Error al obtener datos", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredUsuarios(
        usuarios.filter((usuario) =>
          usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUsuarios(usuarios);
    }
  }, [searchTerm, usuarios]);

  const handleSelectUser = (usuario) => {
    console.log("Selected username:", usuario); // Añadir esta línea para verificar
    setUsername(usuario.username);
    setContraseña(""); // No mostrar la contraseña actual
    setRol(usuario.rol._id); // Asumiendo que rol es un objeto con _id
    setSelectedUserId(usuario._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUserId) {
      setAction("update");
      setShowConfirm(true);
    } else {
      setAction("create");
      setShowConfirm(true);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post("/api/usuarios", {
        username,
        contraseña,
        rol,
      });
      // Refrescar la lista de usuarios
      const usuariosResponse = await axios.get("/api/usuarios");
      setUsuarios(usuariosResponse.data);
      setFilteredUsuarios(usuariosResponse.data);
      setSuccessMessage("Usuario creado exitosamente");
      resetForm();
    } catch (error) {
      if (error.response) {
        console.error("Error al crear el usuario:", error.response.data);
      } else {
        console.error("Error al crear el usuario:", error.message);
      }
    } finally {
      setShowConfirm(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/usuarios/${selectedUserId}`, {
        username,
        contraseña, // Solo actualizar la contraseña si se proporciona
        rol,
      });

      // Realiza una nueva solicitud para obtener los usuarios actualizados
      const usuariosResponse = await axios.get("/api/usuarios");
      setUsuarios(usuariosResponse.data);
      setFilteredUsuarios(usuariosResponse.data);

      setSuccessMessage("Usuario actualizado exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el usuario", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/usuarios/${selectedUserId}`);

      // Realiza una nueva solicitud para obtener los usuarios actualizados
      const usuariosResponse = await axios.get("/api/usuarios");
      setUsuarios(usuariosResponse.data);
      setFilteredUsuarios(usuariosResponse.data);

      setSuccessMessage("Usuario eliminado exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al eliminar el usuario", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const resetForm = () => {
    setSelectedUserId(null);
    setUsername("");
    setContraseña("");
    setRol("");
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setAction("");
    resetForm();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página en la búsqueda
  };

  // Lógica de paginación
  const indexOfLastUser = currentPage * usuariosPerPage;
  const indexOfFirstUser = indexOfLastUser - usuariosPerPage;
  const currentUsuarios = filteredUsuarios.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-gray-700">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Contraseña</label>
          <input
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder={
              selectedUserId ? "Ingrese nueva contraseña" : "Ingrese Contraseña"
            }
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Seleccionar rol</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </div>
        {selectedUserId ? (
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Actualizar Usuario
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black p-2 rounded ml-2 hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Crear Usuario
          </button>
        )}
      </form>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setShowList(!showList);
            setListButtonColor(showList ? "bg-green-500" : "bg-red-500"); // Cambiar color según estado
          }}
          className={`${listButtonColor} text-white p-2 rounded hover:bg-opacity-80`}
        >
          {showList ? "Ocultar Usuarios" : "Listar Usuarios"}
        </button>
      </div>

      {showList && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Buscar por user</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <h2 className="text-xl font-bold mb-4">Lista de Usuarios</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Usuario</th>
                <th className="border border-gray-300 px-4 py-2">Rol</th>
                <th className="border border-gray-300 px-4 py-2">Editar</th>
                <th className="border border-gray-300 px-4 py-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {currentUsuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {usuario.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {usuario.rol?.nombre}{" "}
                    {/* Asumiendo que rol tiene una propiedad 'nombre' */}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleSelectUser(usuario)}
                      className="bg-amber-600 text-white p-3 rounded-full hover:bg-black flex items-center justify-center w-12 h-12"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ fontSize: "1.5rem" }}
                      />
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        setSelectedUserId(usuario._id);
                        setAction("delete");
                        setShowConfirm(true);
                      }}
                      className="bg-red-500 text-white p-3 rounded-full hover:bg-black flex items-center justify-center w-12 h-12"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        style={{ fontSize: "1.5rem" }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Controles de paginación */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 mr-2"
            >
              Anterior
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`p-2 rounded mx-1 ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                } hover:bg-blue-600`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 ml-2"
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {/* Modal de confirmación */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-bold mb-2">
              {action === "update"
                ? "Actualizar Usuario"
                : action === "delete"
                ? "Eliminar Usuario"
                : "Crear Usuario"}
            </h3>
            <p>
              {action === "update"
                ? "¿Estás seguro de que deseas actualizar este usuario?"
                : action === "delete"
                ? "¿Estás seguro de que deseas eliminar este usuario?"
                : "¿Seguro que deseas crear este usuario?"}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={
                  action === "update"
                    ? handleUpdate
                    : action === "delete"
                    ? handleDelete
                    : handleCreate
                }
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <div className="mb-4 text-green-500">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">{successMessage}</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setSuccessMessage("")}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
