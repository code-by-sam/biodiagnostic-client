import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const CrearCitaconCitaPendiente = () => {
  const moment = require("moment-timezone");
  const { register, handleSubmit, setValue, reset } = useForm();
  const [citasPendientes, setCitasPendientes] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [examenes, setExamenes] = useState([]);
  const [perfiles, setPerfiles] = useState([]);
  const [filteredExamenes, setFilteredExamenes] = useState([]);
  const [filteredPerfiles, setFilteredPerfiles] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [selectedExamenes, setSelectedExamenes] = useState([]);
  const [selectedPerfiles, setSelectedPerfiles] = useState([]);
  const [totalCosto, setTotalCosto] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    // Fetch all citas pendientes
    axios
      .get("/api/citas-pendientes")
      .then((response) => {
        console.log("Fetched citas pendientes:", response.data);
        setCitasPendientes(response.data);
        setFilteredCitas(response.data);
      })
      .catch((error) =>
        console.error("Error fetching citas pendientes:", error)
      );

    // Fetch all examenes and perfiles
    axios
      .get("/api/examenes")
      .then((response) => {
        setExamenes(response.data);
        setFilteredExamenes(response.data);
      })
      .catch((error) => console.error("Error fetching examenes:", error));

    axios
      .get("/api/perfiles")
      .then((response) => {
        setPerfiles(response.data);
        setFilteredPerfiles(response.data);
      })
      .catch((error) => console.error("Error fetching perfiles:", error));
  }, []);

  const handleSearchExamen = (searchTerm) => {
    const filtered = searchTerm
      ? examenes.filter((examen) =>
          examen.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : examenes;
    setFilteredExamenes(filtered);
  };

  const handleSearchPerfil = (searchTerm) => {
    const filtered = searchTerm
      ? perfiles.filter((perfil) =>
          perfil.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : perfiles;
    setFilteredPerfiles(filtered);
  };

  const handleSearchCita = (searchTerm) => {
    const filtered = searchTerm
      ? citasPendientes.filter(
          (cita) =>
            cita.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cita.apellido_pat
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            cita.apellido_mat.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : citasPendientes;
    setFilteredCitas(filtered);
  };
  const handleSelectCita = (cita) => {
    setSelectedCita(cita);
    setSelectedExamenes(cita.examenes || []);
    setSelectedPerfiles(cita.perfiles || []);
    setValue("nombres", cita.nombres);
    setValue("apellido_pat", cita.apellido_pat);
    setValue("apellido_mat", cita.apellido_mat);
    setValue("email", cita.email);
    setValue("telefono", cita.telefono);
    setValue("direccion", cita.direccion);
    setValue("fecha_nacimiento", cita.fecha_nacimiento.substring(0, 10)); // Formatting date
    setValue("modalidad", cita.modalidad); // Asegúrate de añadir esta línea
    setValue("sexo", cita.sexo); // Añadido aquí
    setValue("tipo_documento", cita.tipo_documento); // Añadido aquí
    setValue("documento_identidad", cita.documento_identidad); // Añadido aquí

    // Recalcular el costo al seleccionar una cita
    calculateTotalCosto(cita.examenes || [], cita.perfiles || []);
  };
  const handleAddExamen = (examen) => {
    setSelectedExamenes((prev) => {
      const updatedExamenes = [...prev, examen]; // Permite duplicados
      calculateTotalCosto(updatedExamenes, selectedPerfiles);
      return updatedExamenes;
    });
  };

  const handleAddPerfil = (perfil) => {
    setSelectedPerfiles((prev) => {
      const updatedPerfiles = [...prev, perfil]; // Permite duplicados
      calculateTotalCosto(selectedExamenes, updatedPerfiles);
      return updatedPerfiles;
    });
  };

  const handleRemoveExamen = (id) => {
    setSelectedExamenes((prev) => {
      const indexToRemove = prev.findIndex((examen) => examen._id === id);
      if (indexToRemove !== -1) {
        const updatedExamenes = [...prev];
        updatedExamenes.splice(indexToRemove, 1); // Remove only the first occurrence
        calculateTotalCosto(updatedExamenes, selectedPerfiles);
        return updatedExamenes;
      }
      return prev;
    });
  };

  const handleRemovePerfil = (id) => {
    setSelectedPerfiles((prev) => {
      const indexToRemove = prev.findIndex((perfil) => perfil._id === id);
      if (indexToRemove !== -1) {
        const updatedPerfiles = [...prev];
        updatedPerfiles.splice(indexToRemove, 1); // Remove only the first occurrence
        calculateTotalCosto(selectedExamenes, updatedPerfiles);
        return updatedPerfiles;
      }
      return prev;
    });
  };

  const calculateTotalCosto = (examenes, perfiles) => {
    const total = [
      ...examenes.map((ex) => ex.costo),
      ...perfiles.map((per) => per.costo),
    ].reduce((sum, costo) => sum + costo, 0);
    setTotalCosto(total);
  };

  const onSubmit = async (data) => {
    console.log("Datos enviados:", data);

    if (
      !data.documento_identidad ||
      !data.nombres ||
      !data.apellido_pat ||
      !data.apellido_mat ||
      !data.email ||
      !data.telefono ||
      !data.direccion ||
      !data.fecha_nacimiento ||
      !data.tipo_documento ||
      !data.sexo ||
      !data.modalidad
    ) {
      console.error("Faltan campos requeridos.");
      return;
    }

    const tipo_persona = "Cliente";
    console.log("Tipo persona:", tipo_persona);

    // Obtener la fecha y hora actual en la zona horaria de Perú
    const nowPeru = moment().tz("America/Lima");

    // Formatear la fecha en formato 'YYYY-MM-DDTHH:MM:SS.sss-05:00'
    const formattedDate = nowPeru.format("YYYY-MM-DD") + "T00:00:00.000-05:00";

    // Formatear la hora en formato 'HH:MM:SS'
    const formattedTime = nowPeru.format("HH:mm:ss");

    console.log("Fecha actual en Perú:", formattedDate);
    console.log("Hora actual en Perú:", formattedTime);

    try {
      // Buscar el cliente por Documento de identidad
      const response = await axios.get(
        `/api/personas?documento_identidad=${data.documento_identidad}`
      );
      let clienteId;

      if (response.data.personas.length > 0) {
        clienteId = response.data.personas[0]._id;
        console.log("Cliente existente:", response.data.personas[0]);
      } else {
        // Crear un nuevo cliente
        const nuevoCliente = await axios.post("/api/personas", {
          nombres: data.nombres,
          apellido_pat: data.apellido_pat,
          apellido_mat: data.apellido_mat,
          documento_identidad: data.documento_identidad,
          email: data.email,
          telefono: data.telefono,
          direccion: data.direccion,
          tipo_documento:data.tipo_documento,
          sexo:data.sexo,
          fecha_nacimiento: data.fecha_nacimiento,
          tipo_persona: tipo_persona,
        });

        clienteId = nuevoCliente.data._id;
        console.log("Nuevo cliente registrado:", nuevoCliente.data);
      }

      // Crear la cita con el cliente (nuevo o existente)
      await axios.post("/api/citas", {
        cliente: clienteId,
        fecha: data.fecha
          ? moment(data.fecha).tz("America/Lima").format("YYYY-MM-DD") +
            "T00:00:00.000-05:00"
          : formattedDate,
        hora: data.hora || formattedTime, // Usa la hora proporcionada o la hora actual
        perfiles: selectedPerfiles.map((perfil) => perfil._id),
        examenes: selectedExamenes.map((examen) => examen._id),
        estado: "Pendiente",
        costo_total: totalCosto,
        resultados: [],
        modalidad: data.modalidad, // Añadir modalidad aquí
      });

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // Mensaje desaparecerá después de 5 segundos
      reset();
      setSelectedCita(null);
      setSelectedExamenes([]);
      setSelectedPerfiles([]);
      setTotalCosto(0);
      console.log("Cita guardada con éxito");
    } catch (error) {
      console.error(
        "Error al guardar la cita:",
        error.response?.data || error.message
      );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Gestión de Citas Pendientes</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() =>
            document.getElementById("modal").classList.remove("hidden")
          }
        >
          Buscar Cita Pendiente
        </button>
      </div>

      {/* Modal para seleccionar citas pendientes */}
      <div
        id="modal"
        className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center hidden"
      >
        <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg">
          <h2 className="text-lg font-semibold mb-4">Buscar Cita Pendiente</h2>
          <input
            type="text"
            className="border p-2 rounded w-full mb-4"
            placeholder="Buscar por nombre o Documento de Identidad"
            onChange={(e) => handleSearchCita(e.target.value)}
          />
          <div className="border border-gray-300 rounded max-h-80 overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Nombres</th>
                  <th className="border p-2">Apellido Paterno</th>
                  <th className="border p-2">Apellido Materno</th>
                  <th className="border p-2">Fecha de la cita</th>
                  <th className="border p-2">Hora</th>
                </tr>
              </thead>
              <tbody>
                {filteredCitas.map((cita) => (
                  <tr key={cita._id}>
                    <td className="border p-2">{cita.nombres}</td>
                    <td className="border p-2">{cita.apellido_pat}</td>
                    <td className="border p-2">{cita.apellido_mat}</td>
                    <td className="border p-2">{formatDate(cita.fecha)}</td>
                    <td className="border p-2">{cita.hora}</td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          handleSelectCita(cita);
                          document
                            .getElementById("modal")
                            .classList.add("hidden");
                        }}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
            onClick={() =>
              document.getElementById("modal").classList.add("hidden")
            }
          >
            Cerrar
          </button>
        </div>
      </div>

      {showSuccessMessage && (
        <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <svg
            className="w-5 h-5 text-green-500 mr-3"
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
            ></path>
          </svg>
          <span>Cita registrada con éxito.</span>
        </div>
      )}

      {/* Formulario para gestionar la cita */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Datos del Cliente</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Nombres</label>
              <input
                {...register("nombres")}
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Nombres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Apellido Paterno
              </label>
              <input
                {...register("apellido_pat")}
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Apellido Paterno"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Apellido Materno
              </label>
              <input
                {...register("apellido_mat")}
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Apellido Materno"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                className="border p-2 rounded w-full"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                {...register("telefono")}
                type="tel"
                className="border p-2 rounded w-full"
                placeholder="Teléfono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Dirección
              </label>
              <input
                {...register("direccion")}
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Dirección"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de Nacimiento
              </label>
              <input
                {...register("fecha_nacimiento")}
                type="date"
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Tipo de Documento
              </label>
              <select
                {...register("tipo_documento")} // Registra el campo tipo_documento
                className="border p-2 rounded w-full"
              >
                <option value="">Seleccionar Tipo de Documento</option>
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
              <label className="block text-sm font-medium mb-1">Sexo</label>
              <select
                {...register("sexo")} // Registra el campo sexo
                className="border p-2 rounded w-full"
              >
                <option value="">Seleccionar Sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="No especificado">No especificado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Documento de identidad
              </label>
              <input
                {...register("documento_identidad")} // Registra el campo Documento de identidad
                type="text"
                className="border p-2 rounded w-full"
                placeholder="Documento de identidad"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Modalidad
              </label>
              <select
                {...register("modalidad")} // Registra el campo modalidad
                className="border p-2 rounded w-full"
              >
                <option value="">Seleccionar Modalidad</option>
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
                            type="button"
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
                            type="button"
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

          {/* Tabla de Exámenes y Perfiles Seleccionados */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Exámenes y Perfiles Seleccionados
            </h2>
            <div className="border border-gray-300 rounded">
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-800 text-white">
                    <th className="border p-2">Nombre</th>
                    <th className="border p-2">Descripción</th>
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
                          type="button"
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
                          type="button"
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

            {/* Costo Final */}
            <div className="border border-gray-300 rounded p-4">
              <h2 className="text-lg font-semibold">Costo Final</h2>
              <div className="flex justify-between">
                <span>Total:</span>
                <span>S/.{totalCosto}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
};

export default CrearCitaconCitaPendiente;
