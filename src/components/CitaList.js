import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faPlus,
  faChevronDown,
  faChevronUp,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import AddResultModal from "./AddResultModal";
import ViewResultModal from "./ViewResultModal";

const CitaList = () => {
  const [citas, setCitas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [searchDocumentoIdentidad, setSearchDocumentoIdentidad] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState({
    "En curso": true,
    Completada: true,
    Cancelada: true,
  });
  const [selectedCita, setSelectedCita] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);
  const [showAddResultModal, setShowAddResultModal] = useState(false);
  const [showNoResultModal, setShowNoResultModal] = useState(false);
  const [viewResult, setViewResult] = useState(null);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [citasPerPage] = useState(10); // Puedes ajustar el número de citas por página

  const fetchCitas = async () => {
    try {
      const response = await axios.get("/api/citas");
      console.log("Datos de respuesta:", response.data);

      const citasData = response.data.citas;
      if (Array.isArray(citasData)) {
        setCitas(citasData);
      } else {
        console.error("La respuesta no contiene un arreglo en 'citas'");
      }
    } catch (error) {
      console.error("Error fetching citas:", error);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  useEffect(() => {
    if (Array.isArray(citas)) {
      let filtered = citas
        .filter(
          (cita) =>
            cita.cliente.documento_identidad.includes(
              searchDocumentoIdentidad
            ) && filterStatus[cita.estado]
        )
        .sort((a, b) =>
          sortOrder === "asc"
            ? new Date(a.fecha) - new Date(b.fecha)
            : new Date(b.fecha) - new Date(a.fecha)
        );

      // Paginación
      const startIndex = (currentPage - 1) * citasPerPage;
      const endIndex = startIndex + citasPerPage;
      setFilteredCitas(filtered.slice(startIndex, endIndex));
    }
  }, [citas, searchDocumentoIdentidad, sortOrder, filterStatus, currentPage]);

  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`/api/citas/${id}`, { estado: newStatus })
      .then((response) => {
        console.log("Estado actualizado exitosamente", response.data);
        setCitas(
          citas.map((cita) =>
            cita._id === id ? { ...cita, estado: newStatus } : cita
          )
        );
        setShowStatusMenu(null);
      })
      .catch((error) => {
        console.error(
          "Error updating status:",
          error.response || error.message
        );
      });
  };

  const handleFilterChange = (status) => {
    setFilterStatus((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleRowDoubleClick = (cita) => {
    setSelectedCita(cita);
  };

  const handleShowStatusMenu = (citaId) => {
    setShowStatusMenu((prev) => (prev === citaId ? null : citaId));
    if (showStatusMenu === citaId) setStatusOptions([]);
    else setStatusOptions(["En curso", "Completada", "Cancelada"]);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "En curso":
        return "bg-yellow-500 text-white";
      case "Completada":
        return "bg-green-500 text-white";
      case "Cancelada":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getFilterButtonClass = (status) => {
    switch (status) {
      case "En curso":
        return filterStatus[status] ? "bg-yellow-500" : "bg-gray-500";
      case "Completada":
        return filterStatus[status] ? "bg-green-500" : "bg-gray-500";
      case "Cancelada":
        return filterStatus[status] ? "bg-red-500" : "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddResult = () => {
    setShowAddResultModal(true);
    setShowNoResultModal(false);
  };

  const handleViewResult = (cita) => {
    if (cita.resultado) {
      const url = `/api/resultados/${cita.resultado}`;
      console.log(`Fetching result from: ${url}`);

      axios
        .get(url)
        .then((response) => {
          setViewResult(response.data);
        })
        .catch((error) => {
          console.error("Error fetching result:", error);
        });
    } else {
      setSelectedCita(cita);
      setShowNoResultModal(true);
    }
  };

  const handleAddResultClose = (isAdded) => {
    setShowAddResultModal(false);
    if (isAdded) {
      // Actualizar la cita a "Completada" después de añadir el resultado
      if (selectedCita) {
        handleStatusChange(selectedCita._id, "Completada");
      }
      fetchCitas(); // Recargar las citas si se ha añadido un resultado
    }
  };

  const handleCloseNoResultModal = () => {
    setShowNoResultModal(false);
    setSelectedCita(null); // Asegura que no se muestre ningún detalle de cita.
  };

  const totalPages = Math.ceil(citas.length / citasPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Citas Registradas</h1>

      <div className="mb-4 flex items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por Documento de identidad..."
            value={searchDocumentoIdentidad}
            onChange={(e) => setSearchDocumentoIdentidad(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <FontAwesomeIcon icon={faSearch} className="ml-2 text-gray-500" />
        </div>

        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Ordenar por Fecha (
          {sortOrder === "asc" ? "Ascendente" : "Descendente"})
        </button>
      </div>

      <div className="mb-4">
        <div className="flex gap-4 mb-2">
          <button
            onClick={() => handleFilterChange("En curso")}
            className={`px-4 py-2 rounded ${getFilterButtonClass(
              "En curso"
            )} text-white`}
          >
            En Curso
          </button>
          <button
            onClick={() => handleFilterChange("Completada")}
            className={`px-4 py-2 rounded ${getFilterButtonClass(
              "Completada"
            )} text-white`}
          >
            Completada
          </button>
          <button
            onClick={() => handleFilterChange("Cancelada")}
            className={`px-4 py-2 rounded ${getFilterButtonClass(
              "Cancelada"
            )} text-white`}
          >
            Cancelada
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">
              Documento de identidad del Cliente
            </th>
            <th className="py-2 px-4 border-b">Nombre Cliente</th>
            <th className="py-2 px-4 border-b">Fecha</th>
            <th className="py-2 px-4 border-b">Hora</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Acciones</th>
            <th className="py-2 px-4 border-b">Ver Resultado</th>
          </tr>
        </thead>
        <tbody>
          {filteredCitas.length > 0 ? (
            filteredCitas.map((cita) => (
              <React.Fragment key={cita._id}>
                <tr
                  onDoubleClick={() => handleRowDoubleClick(cita)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="py-2 px-4 border-b">
                    {cita.cliente.documento_identidad}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {`${cita.cliente.nombres} ${cita.cliente.apellido_pat}`}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(cita.fecha).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{cita.hora}</td>
                  <td
                    className={`px-2 py-1 rounded text-white text-center ${getStatusClass(
                      cita.estado
                    )} text-sm`}
                  >
                    {cita.estado}
                  </td>
                  <td className="py-2 px-4 border-b relative">
                    <button
                      onClick={() => handleShowStatusMenu(cita._id)}
                      className="flex items-center bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Cambiar Estado
                      <FontAwesomeIcon
                        icon={
                          showStatusMenu === cita._id
                            ? faChevronUp
                            : faChevronDown
                        }
                        className="ml-2"
                      />
                    </button>
                    {showStatusMenu === cita._id && (
                      <div className="absolute bg-white border border-gray-300 mt-2 shadow-lg w-40 z-10">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(cita._id, status)}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleViewResult(cita)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-2" />
                      Ver Resultado
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-2 px-4 border-b text-center">
                No hay citas
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de Paginación */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Anterior
        </button>

        <div className="flex items-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>

      {/* Modal de Detalles de Cita */}
      {selectedCita && !showAddResultModal && !showNoResultModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full">
            <h2 className="text-2xl font-bold mb-4">Detalles de la Cita</h2>
            <div className="mb-4">
              <p>
                <strong>Documento de identidad del Cliente:</strong>{" "}
                {selectedCita.cliente.documento_identidad}
              </p>
              <p>
                <strong>Nombre Cliente:</strong>{" "}
                {`${selectedCita.cliente.nombres} ${selectedCita.cliente.apellido_pat}`}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(selectedCita.fecha).toLocaleDateString()}
              </p>
              <p>
                <strong>Hora:</strong> {selectedCita.hora}
              </p>
              <p>
                <strong>Estado:</strong> {selectedCita.estado}
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Exámenes</h3>
              <ul>
                {(selectedCita.examenes || []).map((examen) => (
                  <li key={examen._id}>{examen.nombre}</li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Perfiles</h3>
              <ul>
                {(selectedCita.perfiles || []).map((perfil) => (
                  <li key={perfil._id}>{perfil.nombre}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={handleAddResult}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Añadir Resultado
            </button>
            <button
              onClick={() => setSelectedCita(null)}
              className="ml-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Modal para añadir resultados */}
      {showAddResultModal && (
        <AddResultModal
          citaId={selectedCita ? selectedCita._id : null}
          onClose={handleAddResultClose}
        />
      )}

      {/* Modal para ver el resultado */}
      {viewResult && (
        <ViewResultModal
          resultado={viewResult}
          onClose={() => setViewResult(null)}
        />
      )}

      {/* Modal para manejar caso de no tener resultado */}
      {showNoResultModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              No hay resultado disponible
            </h2>
            <p>
              La cita seleccionada no tiene un resultado asociado. ¿Desea añadir
              uno?
            </p>
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleAddResult}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Sí, añadir
              </button>
              <button
                onClick={handleCloseNoResultModal}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                No, cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitaList;
