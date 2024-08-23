import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const PerfilManagement = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [imagen, setImagen] = useState(null);
  const [estado, setEstado] = useState("habilitado");
  const [selectedPerfilId, setSelectedPerfilId] = useState(null);
  const [selectedExamenes, setSelectedExamenes] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState("");
  const [searchNombre, setSearchNombre] = useState("");
  const [showList, setShowList] = useState(false);
  const [listButtonColor, setListButtonColor] = useState("bg-green-500");
  const [currentPage, setCurrentPage] = useState(1);
  const [perfilesPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState(""); // Estado para el mensaje de éxito

  useEffect(() => {
    fetchPerfiles();
    fetchExamenes();
  }, []);

  const fetchPerfiles = async () => {
    try {
      const res = await axios.get("/api/perfiles");
      setPerfiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExamenes = async () => {
    try {
      const res = await axios.get("/api/examenes");
      setExamenes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectExamen = (id) => {
    if (!selectedExamenes.includes(id)) {
      setSelectedExamenes([...selectedExamenes, id]);
    }
  };

  const handleDeselectExamen = (id) => {
    setSelectedExamenes(selectedExamenes.filter((examenId) => examenId !== id));
  };

  const handleCreateOrUpdatePerfil = (e) => {
    e.preventDefault();
    setShowConfirm(true);
    setAction(selectedPerfilId ? "update" : "create");
  };

  const handleConfirmAction = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("descripcion", descripcion);
      formData.append("costo", costo);
      if (imagen) formData.append("imagen", imagen);
      formData.append("estado", estado);
      formData.append("examenes", JSON.stringify(selectedExamenes));

      if (selectedPerfilId) {
        await axios.put(`/api/perfiles/${selectedPerfilId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Perfil actualizado con éxito.");
      } else {
        await axios.post("/api/perfiles", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Perfil creado con éxito.");
      }

      resetForm();
      fetchPerfiles();
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleDeletePerfil = async () => {
    try {
      await axios.delete(`/api/perfiles/${selectedPerfilId}`);
      setSuccessMessage("Perfil eliminado con éxito.");
      setShowConfirm(false);
      fetchPerfiles();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPerfil = (perfil) => {
    setSelectedPerfilId(perfil._id);
    setNombre(perfil.nombre);
    setDescripcion(perfil.descripcion);
    setCosto(perfil.costo);
    setImagen(null);
    setEstado(perfil.estado || "habilitado");
    setSelectedExamenes(perfil.examenes.map((examen) => examen._id));
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleEstadoToggle = async (perfil) => {
    const nuevoEstado =
      perfil.estado === "habilitado" ? "inhabilitado" : "habilitado";

    try {
      await axios.put(`/api/perfiles/${perfil._id}`, { estado: nuevoEstado });
      setPerfiles(
        perfiles.map((p) =>
          p._id === perfil._id ? { ...p, estado: nuevoEstado } : p
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado del perfil:", error);
    }
  };

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setCosto("");
    setImagen(null);
    setEstado("habilitado");
    setSelectedExamenes([]);
    setSelectedPerfilId(null);
  };

  const filteredExamenes = examenes.filter((examen) => {
    const nombreExamen =
      typeof examen.nombre === "string" ? examen.nombre.toLowerCase() : "";
    return nombreExamen.includes(searchNombre.toLowerCase());
  });

  const totalPages = Math.ceil(perfiles.length / perfilesPerPage);
  const currentPerfiles = perfiles.slice(
    (currentPage - 1) * perfilesPerPage,
    currentPage * perfilesPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleListVisibility = () => {
    setShowList(!showList);
    setListButtonColor(showList ? "bg-green-500" : "bg-red-500");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Perfiles</h1>

      <form onSubmit={handleCreateOrUpdatePerfil} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Costo</label>
          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Imagen</label>
          <input
            type="file"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {imagen && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imagen)}
                alt="Vista previa"
                className="h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => setImagen(null)}
                className="bg-red-500 text-white px-2 py-1 rounded mt-2"
              >
                Quitar Imagen
              </button>
            </div>
          )}
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="habilitado">Habilitado</option>
            <option value="inhabilitado">Inhabilitado</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">Buscar Exámenes</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium">Nombre</label>
            <input
              type="text"
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">Exámenes Disponibles</h3>
          <div className="overflow-y-auto max-h-60">
            <ul>
              {filteredExamenes.map((examen) => (
                <li
                  key={examen._id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{examen.nombre}</span>
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleSelectExamen(examen._id)}
                  >
                    Seleccionar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">Exámenes Seleccionados</h3>
          <div className="overflow-y-auto max-h-60">
            <ul>
              {selectedExamenes.map((examenId) => {
                const examen = examenes.find((e) => e._id === examenId);
                return (
                  <li
                    key={examenId}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>{examen?.nombre}</span>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDeselectExamen(examenId)}
                    >
                      Deseleccionar
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          {selectedPerfilId ? (
            <>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Actualizar Perfil
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crear Perfil
            </button>
          )}
        </div>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">
              {action === "create"
                ? "¿Estás seguro que deseas crear un perfil?"
                : action === "update"
                ? "¿Estás seguro que deseas actualizar el perfil?"
                : action === "delete"
                ? "¿Estás seguro que deseas eliminar el perfil?"
                : ""}
            </h2>
            <p className="mb-4">
              {action === "delete"
                ? "Esta acción eliminará el perfil permanentemente."
                : ""}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  if (action === "delete") handleDeletePerfil();
                  else handleConfirmAction();
                }}
              >
                Confirmar
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
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

      <div className="mt-4 flex justify-end">
        <button
          onClick={toggleListVisibility}
          className={`${listButtonColor} text-white px-4 py-2 rounded mb-4`}
        >
          {showList ? "Ocultar Perfiles" : "Listar Perfiles"}
        </button>
      </div>

      {showList && (
        <>
          <h2 className="text-xl font-bold mb-4">Lista de Perfiles</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">
                  Descripción
                </th>
                <th className="border border-gray-300 px-4 py-2">Costo</th>
                <th className="border border-gray-300 px-4 py-2">Imagen</th>
                <th className="border border-gray-300 px-4 py-2">Exámenes</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
                <th className="border border-gray-300 px-4 py-2">Editar</th>
                <th className="border border-gray-300 px-4 py-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {currentPerfiles.map((perfil) => (
                <tr key={perfil._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {perfil.nombre}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {perfil.descripcion}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    S/.&nbsp;{perfil.costo.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {perfil.imagen && (
                      <img
                        src={`/uploads/perfiles/${perfil.imagen}`}
                        alt={perfil.nombre}
                        className="h-16 object-cover"
                      />
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {perfil.examenes.map((examen) => (
                      <div key={examen._id}>{examen.nombre}</div>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      type="button"
                      className={`px-2 py-1 rounded text-white ${
                        perfil.estado === "habilitado"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      onClick={() => handleEstadoToggle(perfil)}
                    >
                      {perfil.estado === "habilitado"
                        ? "Habilitado"
                        : "Inhabilitado"}
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => handleEditPerfil(perfil)}
                      className="bg-amber-600 text-white p-3 rounded-full hover:bg-black flex items-center justify-center w-12 h-12"
                    >
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ fontSize: "1.5rem" }}
                      />
                    </button>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPerfilId(perfil._id);
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

          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mx-1"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded mx-1 ${
                  index + 1 === currentPage
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded mx-1"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PerfilManagement;
