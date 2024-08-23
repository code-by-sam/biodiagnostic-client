import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";

import { format, parseISO, isValid } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const EmpleadoManagement = () => {
  const [empleados, setEmpleados] = useState([]);
  const [nombres, setNombres] = useState("");
  const [apellidoPat, setApellidoPat] = useState("");
  const [apellidoMat, setApellidoMat] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [documentoIdentidad, setDocumentoIdentidad] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");

  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState(""); // "update" or "delete"
  const [showList, setShowList] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [empleadosPerPage] = useState(10);
  const [totalEmpleados, setTotalEmpleados] = useState(0);

  // Estado para el filtro por DNI
  const [filterDocumentoIdentidad, setFilterDocumentoIdentidad] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showList) {
      fetchEmpleados();
    }
  }, [showList, currentPage, filterDocumentoIdentidad]);

  const fetchEmpleados = async () => {
    try {
      console.log(
        "Fetching empleados with filterDocumentoIDentidad:",
        filterDocumentoIdentidad
      );
      const response = await axios.get("/api/personas", {
        params: {
          tipo_persona: "Empleado",
          page: currentPage,
          limit: empleadosPerPage,
          documento_identidad: filterDocumentoIdentidad,
        },
      });
      // Comprobar la estructura de la respuesta
      console.log("Empleados fetched:", response.data);
      setEmpleados(
        Array.isArray(response.data.personas) ? response.data.personas : []
      );
      setTotalEmpleados(response.data.total || 0);
    } catch (error) {
      console.error("Error al obtener los empleados", error);
      setErrorMessage("Error al obtener los empleados.");
    }
  };

  const handleSelectEmpleado = (empleado) => {
    // Manejo robusto de fechas
    const parsedDate = empleado.fecha_nacimiento
      ? parseISO(empleado.fecha_nacimiento)
      : null;
    const formattedDate = isValid(parsedDate)
      ? format(parsedDate, "yyyy-MM-dd") // Usamos yyyy-MM-dd para manejar fechas en el formulario
      : "";

    setNombres(empleado.nombres);
    setApellidoPat(empleado.apellido_pat);
    setApellidoMat(empleado.apellido_mat);
    setTipoDocumento(empleado.tipo_documento);
    setDocumentoIdentidad(empleado.documento_identidad);
    setEmail(empleado.email);
    setTelefono(empleado.telefono);
    setDireccion(empleado.direccion);
    setFechaNacimiento(formattedDate);
    setSexo(empleado.sexo);

    setSelectedEmpleadoId(empleado._id);
  };
  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/personas", {
        nombres,
        apellido_pat: apellidoPat,
        apellido_mat: apellidoMat,
        tipo_documento: tipoDocumento,
        documento_identidad: documentoIdentidad,
        email,
        telefono,
        direccion,
        fecha_nacimiento: fechaNacimiento,
        sexo: sexo,
        tipo_persona: "Empleado",
      });
      setEmpleados([...empleados, response.data]);
      resetForm();
      setShowSuccess("Empleado creado con éxito.");
    } catch (error) {
      console.error("Error al crear el Empleado", error);
      // Extraer el mensaje de error del backend y mostrarlo
      const errorMessage =
        error.response?.data?.message || "Error al crear el Empleado";
      setErrorMessage(`Error: ${errorMessage}`);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`/api/personas/${selectedEmpleadoId}`, {
        nombres,
        apellido_pat: apellidoPat,
        apellido_mat: apellidoMat,
        tipo_documento: tipoDocumento,
        documento_identidad: documentoIdentidad,
        email,
        telefono,
        direccion,
        fecha_nacimiento: fechaNacimiento,
        sexo: sexo,
        tipo_persona: "Empleado",
      });
      setEmpleados(
        empleados.map((empleado) =>
          empleado._id === selectedEmpleadoId ? response.data : empleado
        )
      );

      resetForm();
      setShowSuccess("Empleado actualizado con éxito."); // Mostrar mensaje de éxito
      setShowConfirm(false);
    } catch (error) {
      setErrorMessage("Error al actualizar el Empleado.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/personas/${selectedEmpleadoId}`);
      setEmpleados(
        empleados.filter((empleado) => empleado._id !== selectedEmpleadoId)
      );
      resetForm();
      setShowSuccess("Empleado eliminado con éxito."); // Mostrar mensaje de éxito
      setShowConfirm(false);
    } catch (error) {
      setErrorMessage("Error al eliminar el Empleado.");
    }
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (selectedEmpleadoId) {
      setAction("update");
      setShowConfirm(true);
    } else {
      setAction("create");
      setShowConfirm(true);
    }
  };

  const handleCancel = () => {
    resetForm();
    setAction("");
    setSelectedEmpleadoId(null);
  };

  const resetForm = () => {
    setSelectedEmpleadoId(null);
    setNombres("");
    setApellidoPat("");
    setApellidoMat("");
    setEmail("");
    setTelefono("");
    setDireccion("");
    setFechaNacimiento("");
    setSexo("Masculino");
  };

  const handleFilterChange = (e) => {
    setFilterDocumentoIdentidad(e.target.value);
    setCurrentPage(1);
  };

  const toggleListVisibility = () => {
    setShowList(!showList);
  };

  // Función para paginar
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(totalEmpleados / empleadosPerPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Empleados</h1>

      {/* Formulario para crear o editar empleado */}
      <form
        onSubmit={handleSubmit}
        className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="mb-2">
          <label className="block text-gray-700">Nombres</label>
          <input
            type="text"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Apellido Paterno</label>
          <input
            type="text"
            value={apellidoPat}
            onChange={(e) => setApellidoPat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Apellido Materno</label>
          <input
            type="text"
            value={apellidoMat}
            onChange={(e) => setApellidoMat(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Tipo de Documento</label>
          <select
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="DNI">DNI</option>
            <option value="Carnet de Extranjería">Carnet de Extranjería</option>
            <option value="RUC">RUC</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Partida de Nacimiento">Partida de Nacimiento</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Documento de Identidad</label>
          <input
            type="text"
            value={documentoIdentidad}
            onChange={(e) => setDocumentoIdentidad(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Sexo</label>
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Seleccionar</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="No especificado">No especificado</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-2 col-span-2">
          <label className="block text-gray-700">Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4 col-span-2">
          <label className="block text-gray-700">Fecha de Nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4 col-span-2 flex justify-end gap-2">
          {selectedEmpleadoId ? (
            <>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Actualizar Empleado
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-300 text-black p-2 rounded"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Crear empleado
            </button>
          )}
          <button
            type="button"
            onClick={toggleListVisibility}
            className={`ml-auto p-2 rounded ${
              showList ? "bg-red-500" : "bg-green-500"
            } text-white`}
          >
            {showList
              ? "Ocultar Lista de Empleados"
              : "Mostrar Lista de Empleados"}
          </button>
        </div>
      </form>

      {/* Filtro por Documento de Identidad*/}
      {showList && (
        <div className="mb-4">
          <label className="block text-gray-700">Filtrar por DNI</label>
          <input
            type="text"
            value={filterDocumentoIdentidad}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      )}

      {/* Subtítulo y tabla de Empleados existentes */}
      {showList && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-4">Lista de Empleados</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Nombres
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Apellido Paterno
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Apellido Materno
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Tipo de Documento
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Documento de Identidad
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Sexo
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Email
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Teléfono
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Dirección
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Fecha de Nacimiento
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Acciones
                </th>
                <th className="border border-gray-300 px-2 py-2 text-xs">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((empleado) => {
                // Manejo robusto de fechas
                const parsedDate = empleado.fecha_nacimiento
                  ? parseISO(empleado.fecha_nacimiento)
                  : null;
                const formattedDate = isValid(parsedDate)
                  ? format(parsedDate, "dd/MM/yyyy") // Se usa dd/MM/yyyy para mostrar la fecha en la tabla
                  : "No disponible";

                return (
                  <tr key={empleado._id}>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.nombres}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.apellido_pat}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.apellido_mat}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.tipo_documento}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.documento_identidad}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.sexo}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.email}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.telefono}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {empleado.direccion}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-xs">
                      {formattedDate}
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <button
                        onClick={() => handleSelectEmpleado(empleado)}
                        className="bg-amber-600 text-white p-3 rounded-full hover:bg-black flex items-center justify-center w-12 h-12"
                      >
                        <FontAwesomeIcon
                          icon={faEdit}
                          style={{ fontSize: "1.5rem" }}
                        />
                      </button>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <button
                        onClick={() => {
                          setSelectedEmpleadoId(empleado._id);
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
                );
              })}
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
        </div>
      )}

      {/* Confirmación para eliminar o crear empleado */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <p className="mb-4">
              {action === "delete"
                ? "¿Estás seguro de que deseas eliminar este empleado?"
                : action === "update"
                ? "¿Estás seguro de que deseas actualizar este empleado?"
                : action === "create"
                ? "¿Estás seguro de que deseas crear este empleado?"
                : ""}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  if (action === "delete") {
                    handleDelete();
                  } else if (action === "update") {
                    handleUpdate();
                  } else if (action === "create") {
                    handleCreate();
                  }
                  setShowConfirm(false);
                }}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Sí
              </button>
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setAction("");
                }}
                className="bg-gray-300 text-black p-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmación de éxito al crear empleado */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
            <h2 className="text-lg font-bold mb-4">Éxito</h2>
            <p>{showSuccess}</p>
            <button
              onClick={() => setShowSuccess("")}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-0 right-0 mt-4 mr-4 p-4 bg-red-100 text-red-800 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default EmpleadoManagement;
