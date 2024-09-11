import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const ExamenManagement = () => {
  const [examenes, setExamenes] = useState([]);
  const [filteredExamenes, setFilteredExamenes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(""); // New state for the selected area
  const [selectedExamenId, setSelectedExamenId] = useState(null);
  const [estado, setEstado] = useState("habilitado");
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(""); // "update", "delete", or "create"
  const [currentPage, setCurrentPage] = useState(1);
  const [examenesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showList, setShowList] = useState(false); // New state to handle list visibility
  const [listButtonColor, setListButtonColor] = useState("bg-green-500"); // State for button color
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  useEffect(() => {
    const fetchExamenes = async () => {
      try {
        const response = await axios.get("/api/examenes");
        setExamenes(response.data);
        setFilteredExamenes(response.data);
      } catch (error) {
        console.error("Error al obtener los exámenes", error);
      }
    };

    fetchExamenes();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("/api/areas");
        const areasData = response.data;
        if (Array.isArray(areasData)) {
          setAreas(areasData);
        } else {
          console.error(
            "Los datos de áreas no son una lista válida",
            areasData
          );
        }
      } catch (error) {
        console.error("Error al obtener las áreas", error);
      }
    };

    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchExamenes = async () => {
      try {
        const response = await axios.get("/api/examenes");
        const examenesData = response.data;
        if (Array.isArray(examenesData)) {
          setExamenes(examenesData);
          setFilteredExamenes(examenesData);
        } else {
          console.error(
            "Los datos de exámenes no son una lista válida",
            examenesData
          );
        }
      } catch (error) {
        console.error("Error al obtener los exámenes", error);
      }
    };

    fetchExamenes();
  }, []);

  const handleSelectExamen = (examen) => {
    setNombre(examen.nombre);
    setDescripcion(examen.descripcion);
    setCosto(examen.costo);
    setSelectedArea(examen.area._id); // Set the selected area
    setEstado(examen.estado);
    setSelectedExamenId(examen._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedExamenId) {
      setAction("update");
      setShowConfirm(true);
    } else {
      setAction("create");
      setShowConfirm(true);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/examenes", {
        nombre,
        descripcion,
        costo,
        estado,
        area: selectedArea,
      });
      const newExamen = response.data;
      // Asegúrate de que el examen tiene el objeto de área completo
      const areaResponse = await axios.get(`/api/areas/${newExamen.area}`);
      newExamen.area = areaResponse.data;

      setExamenes([...examenes, newExamen]);
      setFilteredExamenes([...examenes, newExamen]);
      setSuccessMessage("Examen creado exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al crear el examen", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/examenes/${selectedExamenId}`, {
        nombre,
        descripcion,
        costo,
        estado,
        area: selectedArea,
      });
      const updatedExamen = response.data;
      // Asegúrate de que el examen tiene el objeto de área completo
      const areaResponse = await axios.get(`/api/areas/${updatedExamen.area}`);
      updatedExamen.area = areaResponse.data;

      setExamenes(
        examenes.map((examen) =>
          examen._id === selectedExamenId ? updatedExamen : examen
        )
      );
      setFilteredExamenes(
        examenes.map((examen) =>
          examen._id === selectedExamenId ? updatedExamen : examen
        )
      );
      setSuccessMessage("Examen actualizado exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el examen", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const handleEstadoToggle = async (examen) => {
    const nuevoEstado =
      examen.estado === "habilitado" ? "inhabilitado" : "habilitado";

    try {
      await axios.put(`/api/examenes/${examen._id}`, { estado: nuevoEstado });
      // Actualiza el estado local después de la solicitud exitosa
      setExamenes((prevExamenes) =>
        prevExamenes.map((p) =>
          p._id === examen._id ? { ...p, estado: nuevoEstado } : p
        )
      );
      setFilteredExamenes((prevFilteredExamenes) =>
        prevFilteredExamenes.map((p) =>
          p._id === examen._id ? { ...p, estado: nuevoEstado } : p
        )
      );
    } catch (error) {
      console.error("Error al cambiar el estado del examen:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/examenes/${selectedExamenId}`);
      // Actualizar el estado de los exámenes
      setExamenes(examenes.filter((examen) => examen._id !== selectedExamenId));
      setFilteredExamenes(
        filteredExamenes.filter((examen) => examen._id !== selectedExamenId)
      ); // Actualizar filteredExamenes también
      setSuccessMessage("Examen eliminado exitosamente");
      resetForm();
    } catch (error) {
      console.error("Error al eliminar el examen", error);
    } finally {
      setShowConfirm(false);
    }
  };

  const resetForm = () => {
    setSelectedExamenId(null);
    setNombre("");
    setDescripcion("");
    setCosto("");
    setEstado("habilitado");
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
  const indexOfLastExamen = currentPage * examenesPerPage;
  const indexOfFirstExamen = indexOfLastExamen - examenesPerPage;
  const currentExamenes = filteredExamenes.slice(
    indexOfFirstExamen,
    indexOfLastExamen
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredExamenes.length / examenesPerPage);
  if (!examenes) {
    return <div>No se encontraron exámenes.</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Exámenes</h1>

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
        <div className="mb-2">
          <label className="block text-gray-700">Costo</label>
          <input
            type="number"
            value={costo}
            onChange={(e) => setCosto(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Área</label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="" disabled>
              Selecciona un Área
            </option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="habilitado">Habilitado</option>
            <option value="inhabilitado">Inhabilitado</option>
          </select>
        </div>
        {selectedExamenId ? (
          <div className="flex items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Actualizar Examen
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
            Crear Examen
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
          {showList ? "Ocultar Exámenes" : "Listar Exámenes"}
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

          <h2 className="text-xl font-bold mb-4">Lista de Exámenes</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Nombre</th>
                <th className="border border-gray-300 px-4 py-2">
                  Descripción
                </th>
                <th className="border border-gray-300 px-4 py-2">Costo</th>
                <th className="border border-gray-300 px-4 py-2">Área</th>
                <th className="border border-gray-300 px-4 py-2">Estado</th>
                <th className="border border-gray-300 px-4 py-2">Editar</th>
                <th className="border border-gray-300 px-4 py-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {currentExamenes.map((examen) =>
                examen && examen.nombre ? (
                  <tr key={examen._id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {examen.nombre}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {examen.descripcion}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      S/.{examen.costo}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {examen.area?.nombre || "Área no disponible"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button
                        type="button"
                        className={`px-2 py-1 rounded text-white ${
                          examen.estado === "habilitado"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                        onClick={() => handleEstadoToggle(examen)}
                      >
                        {examen.estado === "habilitado"
                          ? "Habilitado"
                          : "Inhabilitado"}
                      </button>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleSelectExamen(examen)}
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
                          setSelectedExamenId(examen._id);
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
                ) : null
              )}
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
                ? "Actualizar Examen"
                : action === "delete"
                ? "Eliminar Examen"
                : "Crear Examen"}
            </h3>
            <p>
              {action === "update"
                ? "¿Estás seguro de que deseas actualizar este examen?"
                : action === "delete"
                ? "¿Estás seguro de que deseas eliminar este examen?"
                : "¿Seguro que deseas crear este examen?"}
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

export default ExamenManagement;
