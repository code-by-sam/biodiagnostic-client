import React, { useState, useEffect } from "react";
import axios from "../config/axiosClient";

import logo from "../assets/logo.png"; // Suponiendo que tienes un logo en assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function AgendaTuCita() {
  const [perfiles, setPerfiles] = useState([]);
  const [examenes, setExamenes] = useState([]);
  const [formData, setFormData] = useState({
    nombres: "",
    apellido_pat: "",
    apellido_mat: "",
    email: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    fecha: "",
    hora: "",
    tipo_documento: "", // Campo para Tipo de Documento
    documento_identidad: "", // Campo para Documento de Identidad
    perfiles: [],
    examenes: [],
    modalidad: "Presencial", // Valor por defecto
    sexo: "", // Nuevo campo para Sexo
  });

  const [costoTotal, setCostoTotal] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch perfiles and examenes data
    axios
      .get("/api/perfiles")
      .then((response) => setPerfiles(response.data))
      .catch((error) => console.error("Error fetching perfiles:", error));

    axios
      .get("/api/examenes")
      .then((response) => setExamenes(response.data))
      .catch((error) => console.error("Error fetching examenes:", error));
  }, []);

  useEffect(() => {
    // Calculate total cost based on selected profiles and exams
    const selectedPerfiles = perfiles.filter((perfil) =>
      formData.perfiles.includes(perfil._id)
    );
    const selectedExamenes = examenes.filter((examen) =>
      formData.examenes.includes(examen._id)
    );

    const totalPerfilesCost = selectedPerfiles.reduce(
      (total, perfil) => total + perfil.costo,
      0
    );

    const totalExamenesCost = selectedExamenes.reduce(
      (total, examen) => total + examen.costo,
      0
    );

    setCostoTotal(totalPerfilesCost + totalExamenesCost);
  }, [formData.perfiles, formData.examenes, perfiles, examenes]);

  const handleFormChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedSelection = prevData[name].includes(value)
        ? prevData[name].filter((item) => item !== value)
        : [...prevData[name], value];
      return {
        ...prevData,
        [name]: updatedSelection,
      };
    });
  };

  const validateDocument = () => {
    const { tipo_documento, documento_identidad } = formData;
    let isValid = true;
    const newErrors = {};

    const validDNI = /^\d{8}$/;
    const validCarnet = /^[a-zA-Z0-9]{1,12}$/;
    const validRUC = /^\d{11}$/;
    const validPasaporte = /^[a-zA-Z0-9]{1,12}$/;
    const validPartida = /^[a-zA-Z0-9]{1,15}$/;
    const validOtros = /^[a-zA-Z0-9]{1,15}$/;

    switch (tipo_documento) {
      case "DNI":
        if (!validDNI.test(documento_identidad)) {
          newErrors.documento_identidad = "El DNI debe tener 8 dígitos.";
          isValid = false;
        }
        break;
      case "Carnet de Extranjería":
        if (!validCarnet.test(documento_identidad)) {
          newErrors.documento_identidad =
            "El Carnet de Extranjería debe tener entre 1 y 12 caracteres alfanuméricos.";
          isValid = false;
        }
        break;
      case "RUC":
        if (!validRUC.test(documento_identidad)) {
          newErrors.documento_identidad = "El RUC debe tener 11 dígitos.";
          isValid = false;
        }
        break;
      case "Pasaporte":
        if (!validPasaporte.test(documento_identidad)) {
          newErrors.documento_identidad =
            "El Pasaporte debe tener entre 1 y 12 caracteres alfanuméricos.";
          isValid = false;
        }
        break;
      case "Partida de Nacimiento":
        if (!validPartida.test(documento_identidad)) {
          newErrors.documento_identidad =
            "La Partida de Nacimiento debe tener entre 1 y 15 caracteres alfanuméricos.";
          isValid = false;
        }
        break;
      case "Otros":
        if (!validOtros.test(documento_identidad)) {
          newErrors.documento_identidad =
            "El documento de identidad en Otros debe tener entre 1 y 15 caracteres alfanuméricos.";
          isValid = false;
        }
        break;
      default:
        newErrors.documento_identidad = "Tipo de documento no válido.";
        isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateDocument()) {
      axios
        .post("/api/citas-pendientes", { ...formData, costo_total: costoTotal })
        .then((response) => {
          console.log("Cita agendada:", response.data);
          alert("Cita agendada exitosamente");
          setFormData({
            nombres: "",
            apellido_pat: "",
            apellido_mat: "",
            email: "",
            telefono: "",
            direccion: "",
            fecha_nacimiento: "",
            fecha: "",
            hora: "",
            tipo_documento: "", // Resetear nuevo campo
            documento_identidad: "", // Resetear nuevo campo
            perfiles: [],
            examenes: [],
            modalidad: "Presencial",
            sexo: "Masculino", // Resetear a valor por defecto
          });
        })
        .catch((error) => {
          console.error("Error al agendar cita:", error);
          alert("Hubo un error al agendar la cita");
        });
    }
  };

  const selectedPerfiles = perfiles.filter((perfil) =>
    formData.perfiles.includes(perfil._id)
  );

  const selectedExamenes = examenes.filter((examen) =>
    formData.examenes.includes(examen._id)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-800 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo del Laboratorio"
              className="w-12 h-12 mr-2"
            />
            <span className="text-white text-2xl font-bold">BioDiagnostic</span>
          </div>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="text-white hover:bg-red-600 transition-colors"
            >
              Inicio
            </Link>
            <Link
              to="/servicios"
              className="text-white hover:bg-red-600 transition-colors"
            >
              Servicios
            </Link>
            <Link
              to="/agenda"
              className="text-white hover:bg-red-600 transition-colors"
            >
              Agenda Tu Cita
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/login"
              className="text-white hover:bg-red-600 transition-colors flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faUser} />
              <span>Ingresar</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <div className="relative w-full h-32 flex flex-col items-center justify-center text-white bg-blue-800">
        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-bold">Agenda Tu Cita</h1>
          <p className="text-md mt-1">
            Puedes agendar tu cita de manera fácil y rápida
          </p>
        </div>
        <div className="absolute inset-0 bg-blue-800 opacity-30"></div>
      </div>

      {/* Formulario de Agendamiento */}
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-3/4 xl:w-2/3 mx-auto flex flex-col">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos del Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Nombres:
                </label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Apellido Paterno:
                </label>
                <input
                  type="text"
                  name="apellido_pat"
                  value={formData.apellido_pat}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Apellido Materno:
                </label>
                <input
                  type="text"
                  name="apellido_mat"
                  value={formData.apellido_mat}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Teléfono:
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Dirección:
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Fecha de Nacimiento:
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Sexo:
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="No especificado">No especificado</option>
                  </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Fecha de Cita:
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Hora de Cita:
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Modalidad:
                </label>
                <select
                  name="modalidad"
                  value={formData.modalidad}
                  onChange={handleFormChange}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Presencial">Presencial</option>
                  <option value="En casa">En casa</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Tipo de Documento:
                </label>
                <select
                  name="tipo_documento"
                  value={formData.tipo_documento}
                  onChange={(e) => {
                    handleFormChange(e);
                    validateDocument(); // Validate on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Seleccionar</option>
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
                {errors.tipo_documento && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tipo_documento}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Documento de Identidad:
                </label>
                <input
                  type="text"
                  name="documento_identidad"
                  value={formData.documento_identidad}
                  onChange={(e) => {
                    handleFormChange(e);
                    validateDocument(); // Validate on change
                  }}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                {errors.documento_identidad && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.documento_identidad}
                  </p>
                )}
              </div>
            </div>

            {/* Selección de Perfiles y Exámenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Selecciona Perfiles:
                </label>
                <div className="overflow-y-auto max-h-48 border border-gray-300 rounded p-2">
                  {perfiles.map((perfil) => (
                    <div key={perfil._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        name="perfiles"
                        value={perfil._id}
                        checked={formData.perfiles.includes(perfil._id)}
                        onChange={handleSelectionChange}
                        className="mr-2"
                      />
                      <span>
                        {perfil.nombre} - S/.{perfil.costo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">
                  Selecciona Exámenes:
                </label>
                <div className="overflow-y-auto max-h-48 border border-gray-300 rounded p-2">
                  {examenes.map((examen) => (
                    <div key={examen._id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        name="examenes"
                        value={examen._id}
                        checked={formData.examenes.includes(examen._id)}
                        onChange={handleSelectionChange}
                        className="mr-2"
                      />
                      <span>
                        {examen.nombre} - S/.{examen.costo}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Costos Totales */}
            <div className="flex flex-col items-center border-t border-gray-300 pt-4 mt-4">
              <h2 className="text-lg font-bold text-gray-800">
                Resumen de Costo Total:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <h3 className="text-md font-semibold text-gray-700">
                    Perfiles Seleccionados:
                  </h3>
                  {selectedPerfiles.map((perfil) => (
                    <div key={perfil._id} className="flex justify-between">
                      <span>{perfil.nombre}</span>
                      <span>S/.{perfil.costo}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-700">
                    Exámenes Seleccionados:
                  </h3>
                  {selectedExamenes.map((examen) => (
                    <div key={examen._id} className="flex justify-between">
                      <span>{examen.nombre}</span>
                      <span>S/.{examen.costo}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xl font-bold mt-4">
                Costo Total: S/.{costoTotal}
              </div>
            </div>

            {/* Botón de Envío */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-800 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
              >
                Agendar Cita
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-blue-800 py-8 mt-auto">
        <div className="container mx-auto text-white flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img src={logo} alt="Logo del Laboratorio" className="w-12 h-12" />
            <span className="text-xl font-bold">BioDiagnostic</span>
          </div>
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Contáctanos</h3>
            <p>Teléfono: +51 987 654 321</p>
            <p>Email: contacto@biodiagnostic.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Síguenos</h3>
            <div className="flex space-x-4 mt-2 justify-center md:justify-end">
              <Link
                to="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
              <Link
                to="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </Link>
              <Link
                to="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
              <Link
                to="#"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-white">
            © 2024 BioDiagnostic. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default AgendaTuCita;
