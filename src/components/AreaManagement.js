import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const AreaManagement = () => {
  const [areas, setAreas] = useState([]);
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(""); // "update", "delete", or "create"
  const [currentPage, setCurrentPage] = useState(1);
  const [areasPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showList, setShowList] = useState(false); // New state to handle list visibility
  const [listButtonColor, setListButtonColor] = useState("bg-green-500"); // State for button color
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("/api/areas");
        setAreas(response.data);
        setFilteredAreas(response.data);
      } catch (error) {
        console.error("Error al obtener las áreas", error);
      }
    };

    fetchAreas();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredAreas(
        areas.filter((area) =>
          area.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredAreas(areas);
    }
  }, [searchTerm, areas]);

  const handleSelectArea = (area) => {
    setNombre(area.nombre);
    setDescripcion(area.descripcion);
    setSelectedAreaId(area._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedAreaId) {
      setAction("update");
      setShowConfirm(true);
    } else {
      setAction("create");
      setShowConfirm(true);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/areas", { nombre, descripcion });
      setAreas([...areas, response.data]);
      setSuccessMessage("Área creada exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al crear el área", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/areas/${selectedAreaId}`, {
        nombre,
        descripcion,
      });
      setAreas(
        areas.map((area) =>
          area._id === selectedAreaId ? response.data : area
        )
      );
      setSuccessMessage("Área actualizada exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el área", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/areas/${selectedAreaId}`);
      setAreas(areas.filter((area) => area._id !== selectedAreaId));
      setSuccessMessage("Área eliminada exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al eliminar el área", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const resetForm = () => {
    setSelectedAreaId(null);
    setNombre("");
    setDescripcion("");
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setAction("");
    resetForm();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Pagination logic
  const indexOfLastArea = currentPage * areasPerPage;
  const indexOfFirstArea = indexOfLastArea - areasPerPage;
  const currentAreas = filteredAreas.slice(indexOfFirstArea, indexOfLastArea);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredAreas.length / areasPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Áreas de Examen</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Descripción</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        {selectedAreaId ? (
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Actualizar Área
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
            Crear Área
          </button>
        )}
      </form>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setShowList(!showList);
            setListButtonColor(showList ? "bg-green-500" : "bg-red-500"); // Change button color
          }}
          className={`${listButtonColor} text-white p-2 rounded hover:bg-opacity-80`}
        >
          {showList ? "Ocultar Áreas" : "Listar Áreas"}
        </button>
      </div>

      {showList && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700">Buscar por nombre</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <h2 className="text-xl font-bold mb-4">Lista de Áreas</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">
                  Descripción
                </th>
                <th className="border border-gray-300 px-4 py-2">Editar</th>
                <th className="border border-gray-300 px-4 py-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {currentAreas.map((area) => (
                <tr key={area._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {area.nombre}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {area.descripcion}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleSelectArea(area)}
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
                        setSelectedAreaId(area._id);
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

          {/* Pagination controls */}
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
                ? "Actualizar Área"
                : action === "delete"
                ? "Eliminar Área"
                : "Crear Área"}
            </h3>
            <p>
              {action === "update"
                ? "¿Estás seguro de que deseas actualizar esta área?"
                : action === "delete"
                ? "¿Estás seguro de que deseas eliminar esta área?"
                : "¿Seguro que deseas crear esta área?"}
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

export default AreaManagement;
