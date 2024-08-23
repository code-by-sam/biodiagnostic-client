import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faChevronDown,
  faChevronUp,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const CitaPendienteList = () => {
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [searchDocumentoIdentidad, setSearchDocumentoIdentidad] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterStatus, setFilterStatus] = useState({
    Pendiente: true,
    Confirmada: true,
    Cancelada: true,
  });
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [citasPerPage] = useState(10);

  const fetchCitasPendientes = async () => {
    try {
      const response = await axios.get("/api/citas-pendientes");
      console.log("Datos de respuesta:", response.data);

      const citasData = response.data;
      if (Array.isArray(citasData)) {
        setCitasPendientes(citasData);
      } else {
        console.error(
          "La respuesta no contiene un arreglo de citas pendientes"
        );
      }
    } catch (error) {
      console.error("Error fetching citas pendientes:", error);
    }
  };

  useEffect(() => {
    fetchCitasPendientes();
  }, []);

  useEffect(() => {
    if (Array.isArray(citasPendientes)) {
      let filtered = citasPendientes
        .filter((cita) => {
          // Verificar que 'cita.cliente' y 'cita.cliente.documento_identidad' existen
          return (
            cita.documento_identidad.includes(searchDocumentoIdentidad) &&
            filterStatus[cita.estado]
          );
        })
        .sort((a, b) =>
          sortOrder === "asc"
            ? new Date(a.fecha) - new Date(b.fecha)
            : new Date(b.fecha) - new Date(a.fecha)
        );

      console.log("Citas filtradas:", filtered); // Verificar filtrado

      // Paginación
      const startIndex = (currentPage - 1) * citasPerPage;
      const endIndex = startIndex + citasPerPage;
      const paginatedCitas = filtered.slice(startIndex, endIndex);
      setFilteredCitas(paginatedCitas);

      console.log("Citas paginadas:", paginatedCitas); // Verificar paginación
    }
  }, [
    citasPendientes,
    searchDocumentoIdentidad,
    sortOrder,
    filterStatus,
    currentPage,
  ]);

  const handleStatusChange = (id, newStatus) => {
    axios
      .put(`/api/citas-pendientes/${id}`, { estado: newStatus })
      .then((response) => {
        console.log("Estado actualizado exitosamente", response.data);
        setCitasPendientes(
          citasPendientes.map((cita) =>
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

  const handleShowStatusMenu = (citaId) => {
    setShowStatusMenu((prev) => (prev === citaId ? null : citaId));
    if (showStatusMenu === citaId) setStatusOptions([]);
    else setStatusOptions(["Pendiente","Confirmada", "Cancelada"]);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmada":
        return "bg-green-500 text-white";
      case "Cancelada":
        return "bg-red-500 text-white";
      case "Pendiente":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getFilterButtonClass = (status) => {
    switch (status) {
      case "Confirmada":
        return filterStatus[status] ? "bg-green-500" : "bg-gray-500";
      case "Cancelada":
        return filterStatus[status] ? "bg-red-500" : "bg-gray-500";
      case "Pendiente":
        return filterStatus[status] ? "bg-blue-500" : "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const totalPages = Math.ceil(filteredCitas.length / citasPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Citas Pendientes</h1>

      <div className="mb-4 flex items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por Documento de identidad..."
            value={searchDocumentoIdentidad}
            onChange={(e) => setSearchDocumentoIdentidad(e.target.value)}
            className="border p-2 rounded w-full"
          />
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
            onClick={() => handleFilterChange("Confirmada")}
            className={`px-4 py-2 rounded ${getFilterButtonClass(
              "Confirmada"
            )} text-white`}
          >
            Confirmada
          </button>
          <button
            onClick={() => handleFilterChange("Cancelada")}
            className={`px-4 py-2 rounded ${getFilterButtonClass(
              "Cancelada"
            )} text-white`}
          >
            Cancelada
          </button>
          <button
            onClick={() => handleFilterChange("Pendiente")}
            className={`px-4 py-2 rounded ${getFilterButtonClass(
              "Pendiente"
            )} text-white`}
          >
            Pendiente
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
          </tr>
        </thead>
        <tbody>
          {filteredCitas.length > 0 ? (
            filteredCitas.map((cita) => (
              <React.Fragment key={cita._id}>
                <tr className="cursor-pointer hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">
                    {cita.documento_identidad || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {`${cita.nombres || ""} ${cita.apellido_pat || ""}`}
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
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center">
                No se encontraron citas pendientes.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CitaPendienteList;
