import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";

import { useForm } from "react-hook-form";

function CitaPendienteManagement() {
  const [examenes, setExamenes] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [filteredExamenes, setFilteredExamenes] = useState([]);
  const [filteredPerfiles, setFilteredPerfiles] = useState([]);
  const [selectedExamenes, setSelectedExamenes] = useState([]);
  const [selectedPerfiles, setSelectedPerfiles] = useState([]);
  const [totalCosto, setTotalCosto] = useState(0);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { register, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0], // Fecha actual
      hora: new Date().toTimeString().split(" ")[0], // Hora actual
      modalidad: "Presencial", // Valor predeterminado para modalidad
      tipo_documento: "DNI", // Valor predeterminado para tipo de documento
      sexo: "No especificado", // Valor predeterminado para sexo
    },
  });

  useEffect(() => {
    // Fetch examenes and perfiles
    const fetchData = async () => {
      try {
        const [examenesResponse, perfilesResponse] = await Promise.all([
          axios.get("/api/examenes"),
          axios.get("/api/perfiles"),
        ]);

        setExamenes(examenesResponse.data);
        setFilteredExamenes(examenesResponse.data);

        setPerfiles(perfilesResponse.data);
        setFilteredPerfiles(perfilesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddExamen = (examen) => {
    setSelectedExamenes((prev) => {
      const updated = [...prev, examen];
      updateTotalCosto(updated, selectedPerfiles);
      return updated;
    });
  };

  const handleAddPerfil = (perfil) => {
    setSelectedPerfiles((prev) => {
      const updated = [...prev, perfil];
      updateTotalCosto(selectedExamenes, updated);
      return updated;
    });
  };

  const updateTotalCosto = (examenesList, perfilesList) => {
    const totalExamenes = examenesList.reduce(
      (total, examen) => total + examen.costo,
      0
    );
    const totalPerfiles = perfilesList.reduce(
      (total, perfil) => total + perfil.costo,
      0
    );
    setTotalCosto(totalExamenes + totalPerfiles);
  };

  const handleRemoveExamen = (examenId) => {
    setSelectedExamenes((prev) => {
      const indexToRemove = prev.findIndex((examen) => examen._id === examenId);
      if (indexToRemove !== -1) {
        const updated = [...prev];
        updated.splice(indexToRemove, 1); // Elimina solo la primera instancia
        updateTotalCosto(updated, selectedPerfiles);
        return updated;
      }
      return prev;
    });
  };

  const handleRemovePerfil = (perfilId) => {
    setSelectedPerfiles((prev) => {
      const indexToRemove = prev.findIndex((perfil) => perfil._id === perfilId);
      if (indexToRemove !== -1) {
        const updated = [...prev];
        updated.splice(indexToRemove, 1); // Elimina solo la primera instancia
        updateTotalCosto(selectedExamenes, updated);
        return updated;
      }
      return prev;
    });
  };

  const handleSearchExamen = (searchTerm) => {
    if (searchTerm) {
      const filtered = examenes.filter((examen) =>
        examen.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExamenes(filtered);
    } else {
      setFilteredExamenes(examenes);
    }
  };

  const handleSearchPerfil = (searchTerm) => {
    if (searchTerm) {
      const filtered = perfiles.filter((perfil) =>
        perfil.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPerfiles(filtered);
    } else {
      setFilteredPerfiles(perfiles);
    }
  };

  const onSubmit = async (data) => {
    const citaData = {
      nombres: data.nombres,
      apellido_pat: data.apellidoPat,
      apellido_mat: data.apellidoMat,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      fecha_nacimiento: data.fecha_nacimiento,
      fecha: data.fecha,
      hora: data.hora,
      perfiles: selectedPerfiles.map((perfil) => perfil._id),
      examenes: selectedExamenes.map((examen) => examen._id),
      costo_total: totalCosto,
      modalidad: data.modalidad,
      tipo_documento: data.tipo_documento,
      documento_identidad: data.documento_identidad,
      sexo: data.sexo,
    };

    try {
      // Realiza la solicitud POST para crear una nueva cita
      const response = await axios.post("/api/citas-pendientes", citaData);
      setSuccessMessage("Cita Agendada exitosamente!");
      setConfirmModalOpen(false); // Cierra el modal de confirmación
      reset(); // Opcional: reinicia el formulario
      setSelectedExamenes([]);
      setSelectedPerfiles([]);
      setTotalCosto(0);
    } catch (error) {
      console.error(
        "Error al agendar la cita:",
        error.response?.data || error.message
      );
      // Manejar el error según sea necesario
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Agendamiento de Citas</h1>

      {/* Información del Cliente */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Información del Cliente</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Nombres</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              {...register("nombres", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Apellido Paterno</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              {...register("apellidoPat", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Apellido Materno</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              {...register("apellidoMat", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              className="border p-2 rounded w-full"
              {...register("email", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Teléfono</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              {...register("telefono", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Dirección</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              {...register("direccion", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Fecha de Nacimiento</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              {...register("fecha_nacimiento", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Tipo de Documento</label>
            <select
              className="border p-2 rounded w-full"
              {...register("tipo_documento", { required: true })}
            >
              <option value="DNI">DNI</option>
              <option value="Carnet de Extranjería">
                Carnet de Extranjería
              </option>
              <option value="RUC">RUC</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Partida de Nacimiento">
                Partida de Nacimiento
              </option>
              <option value="Otros">Otros</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Documento de Identidad</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              {...register("documento_identidad", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Sexo</label>
            <select
              className="border p-2 rounded w-full"
              {...register("sexo", { required: true })}
            >
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fecha y Hora de la Cita */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Fecha y Hora de la Cita</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Fecha</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              {...register("fecha", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Hora</label>
            <input
              type="time"
              className="border p-2 rounded w-full"
              {...register("hora", { required: true })}
            />
          </div>
          <div>
            <label className="block font-medium">Modalidad</label>
            <select
              className="border p-2 rounded w-full"
              {...register("modalidad", { required: true })}
            >
              <option value="Presencial">Presencial</option>
              <option value="En casa">En casa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Añadir Exámenes y Perfiles */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <h2 className="text-lg font-semibold">Añadir Exámenes</h2>
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="Buscar exámenes"
              onChange={(e) => handleSearchExamen(e.target.value)}
            />
            <div className="border border-gray-300 rounded max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Nombre</th>
                    <th className="border p-2">Costo</th>
                    <th className="border p-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExamenes.map((examen) => (
                    <tr key={examen._id}>
                      <td className="border p-2">{examen.nombre}</td>
                      <td className="border p-2">S/.{examen.costo}</td>
                      <td className="border p-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleAddExamen(examen)}
                        >
                          Añadir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="w-1/2">
            <h2 className="text-lg font-semibold">Añadir Perfiles</h2>
            <input
              type="text"
              className="border p-2 rounded w-full mb-2"
              placeholder="Buscar perfiles"
              onChange={(e) => handleSearchPerfil(e.target.value)}
            />
            <div className="border border-gray-300 rounded max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Nombre</th>
                    <th className="border p-2">Costo</th>
                    <th className="border p-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPerfiles.map((perfil) => (
                    <tr key={perfil._id}>
                      <td className="border p-2">{perfil.nombre}</td>
                      <td className="border p-2">S/.{perfil.costo}</td>
                      <td className="border p-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => handleAddPerfil(perfil)}
                        >
                          Añadir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Exámenes y Perfiles Seleccionados */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Exámenes y Perfiles Seleccionados
        </h2>
        <div className="border border-gray-300 rounded">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Nombre</th>
                <th className="border p-2">Costo</th>
                <th className="border p-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {selectedExamenes.map((examen, index) => (
                <tr key={`${examen._id}-${index}`}>
                  <td className="border p-2">Examen</td>
                  <td className="border p-2">{examen.nombre}</td>
                  <td className="border p-2">S/.{examen.costo}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleRemoveExamen(examen._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {selectedPerfiles.map((perfil, index) => (
                <tr key={`${perfil._id}-${index}`}>
                  <td className="border p-2">Perfil</td>
                  <td className="border p-2">{perfil.nombre}</td>
                  <td className="border p-2">S/.{perfil.costo}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleRemovePerfil(perfil._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border border-gray-300 rounded mt-2">
          <h3 className="bg-gray-200 p-2 text-lg font-semibold text-right">
            Costo Final: S/.{totalCosto}
          </h3>
        </div>
      </div>

      {/* Botón para Guardar Cita */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => setConfirmModalOpen(true)}
      >
        Registrar Cita
      </button>

      {/* Modal de Confirmación */}
      {confirmModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-3/4 max-w-sm">
            <h2 className="text-lg font-semibold mb-2">
              ¿Seguro desea registrar la cita?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit(onSubmit)}
              >
                Sí
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setConfirmModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de Confirmación Exitosa */}
      {successMessage && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded w-3/4 max-w-sm text-center">
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
            <h2 className="text-lg font-semibold mb-2">
              Cita registrada exitosamente
            </h2>
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
}

export default CitaPendienteManagement;
