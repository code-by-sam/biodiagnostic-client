import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendarAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import moment from "moment";
import "moment/locale/es";

function ResultadoCliente() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [citas, setCitas] = useState([]);
  const [filteredCitas, setFilteredCitas] = useState([]);
  const [selectedCita, setSelectedCita] = useState(null);
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewType, setViewType] = useState(""); // nuevo estado para el tipo de vista
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [citasPerPage, setCitasPerPage] = useState(5); // Citas por página
  const navigate = useNavigate();
  const { citaId } = useParams();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");

    if (storedUserName) setUserName(storedUserName);
    if (storedUserRole) setUserRole(storedUserRole);

    if (storedUserRole === "Cliente" && storedUserId) {
      fetch(`https://biodiagnostic.onrender.com/api/citas/usuario/${storedUserId}`)
        .then((response) => {
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setCitas(data);
          setFilteredCitas(data);
          setLoading(false);
          if (citaId) {
            const cita = data.find((cita) => cita._id === citaId);
            setSelectedCita(cita);
            fetchResultados(cita._id); // Fetch results for the selected cita
          }
        })
        .catch((error) => {
          setError("Error fetching citas.");
          console.error("Error fetching citas:", error);
        });
    }
  }, [citaId]);

  useEffect(() => {
    let filtered = citas;

    if (searchTerm) {
      filtered = filtered.filter(
        (cita) =>
          cita.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cita.perfiles.some((perfil) =>
            perfil.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          cita.examenes.some((examen) =>
            examen.nombre.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (searchDate) {
      const formattedSearchDate = moment(searchDate).format("DD/MM/YYYY");
      filtered = filtered.filter((cita) => {
        const formattedCitaDate = moment(cita.fecha).format("DD/MM/YYYY");
        return formattedSearchDate === formattedCitaDate;
      });
    }

    if (filterStatus) {
      filtered = filtered.filter((cita) =>
        cita.estado.toLowerCase().includes(filterStatus.toLowerCase())
      );
    }

    setFilteredCitas(filtered);
  }, [searchTerm, searchDate, filterStatus, citas]);

  const fetchResultados = async (citaId) => {
    try {
      const response = await fetch(
        `https://biodiagnostic.onrender.com/api/resultados/cita/${citaId}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Datos recibidos:", data); // Verifica los datos recibidos
      // Asegúrate de que `data` sea un array
      if (!Array.isArray(data)) {
        setResultados([data]); // Convierte el objeto en un array
      } else {
        setResultados(data);
      }
    } catch (error) {
      setError("Error fetching resultados.");
      console.error("Error fetching resultados:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const handleVerDetalle = (cita) => {
    setSelectedCita(cita);
    setResultados([]); // Limpiar resultados cuando se vea el detalle
    setViewType("detalle"); // Establecer el tipo de vista
  };

  const handleVerResultados = (cita) => {
    fetchResultados(cita._id);
    setSelectedCita(cita);
    setViewType("resultados"); // Añade esta línea para actualizar el tipo de vista
  };

  const handleCloseModal = () => {
    setSelectedCita(null);
    setResultados([]);
    setViewType(""); // Resetear el tipo de vista
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
  };

  // Obtener citas para la página actual
  const indexOfLastCita = currentPage * citasPerPage;
  const indexOfFirstCita = indexOfLastCita - citasPerPage;
  const currentCitas = filteredCitas.slice(indexOfFirstCita, indexOfLastCita);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex">
      <aside className="fixed top-0 left-0 h-screen w-52 bg-gray-800 text-white p-4 shadow-lg overflow-y-auto">
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
          <span className="text-lg font-bold">Panel de Resultados</span>
        </div>
        <nav>
          <h2 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
            Opciones
          </h2>
          <ul>
            <li>
              <Link
                to="/resultados"
                className={`block py-2 px-4 rounded ${
                  window.location.pathname === "/resultados"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                Historial de Citas
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="ml-52 flex-grow p-8 transition-transform duration-500">
        <div className="flex justify-between items-center mb-6 p-4 bg-gray-100 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-gray-800">
              <span className="text-gray-600">Hola,</span>{" "}
              {userName || "Usuario"}
            </div>
            <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando...</p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Historial de Citas</h2>
              <div className="flex space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar por estado, exámenes o perfiles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 pl-8"
                  />
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute top-2 left-2 text-gray-500"
                  />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <button
                onClick={() => handleStatusFilter("En Curso")}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === "En Curso"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                En Curso
              </button>
              <button
                onClick={() => handleStatusFilter("Completada")}
                className={`ml-2 px-4 py-2 rounded-lg ${
                  filterStatus === "Completada"
                    ? "bg-green-500 text-white"
                    : "bg-green-200 text-green-800"
                }`}
              >
                Completada
              </button>
              <button
                onClick={() => handleStatusFilter("")}
                className="ml-2 px-4 py-2 rounded-lg bg-gray-200 text-gray-800"
              >
                Todos
              </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
              {currentCitas.length > 0 ? (
                currentCitas.map((cita) => (
                  <li
                    key={cita._id}
                    className="p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
                  >
                    <p className="font-semibold">
                      Fecha: {moment(cita.fecha).format("DD/MM/YYYY")}
                    </p>
                    <p className="mt-2 font-semibold">Hora: {cita.hora}</p>
                    <p className="mt-2 font-semibold">Estado: {cita.estado}</p>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => handleVerDetalle(cita)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => handleVerResultados(cita)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                      >
                        Ver Resultados
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No hay citas que coincidan con los criterios de búsqueda.</p>
              )}
            </ul>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage * citasPerPage >= filteredCitas.length}
                className="px-4 py-2 mx-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </main>

      {selectedCita && (
        <div
          id="modal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-2xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition duration-300 transform hover:scale-105"
            >
              Cerrar
            </button>
            {viewType === "resultados" && (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Resultados de la Cita
                </h2>
                {resultados && resultados.length > 0 ? (
                  <ul>
                    {resultados.map((resultado) => (
                      <li key={resultado._id} className="text-gray-700 mb-4">
                        <p>
                          <strong>Descripción:</strong> {resultado.descripcion}
                        </p>
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {moment(resultado.fecha).format("DD/MM/YYYY")}
                        </p>
                        <p>
                          <strong>Hora:</strong> {resultado.hora}
                        </p>
                        <p>
                          <strong>Archivo:</strong>
                          {resultado.archivo && (
                            <a
                              href={`https://biodiagnostic.onrender.com/uploads/resultados/${resultado.archivo}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              Ver Archivo
                            </a>
                          )}
                        </p>
                        {/* Vista previa del archivo si es PDF */}
                        {resultado.archivo &&
                          resultado.archivo.endsWith(".pdf") && (
                            <iframe
                              src={`https://biodiagnostic.onrender.com/uploads/resultados/${resultado.archivo}`}
                              className="w-full h-60 mt-2 border border-gray-300"
                              title="Vista previa del archivo"
                            />
                          )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay resultados disponibles para esta cita.</p>
                )}
              </>
            )}
            {viewType === "detalle" && (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  Detalles de la Cita
                </h2>
                <div className="mb-4">
                  <p className="text-lg">
                    <strong>Fecha:</strong>{" "}
                    {moment(selectedCita.fecha).format("DD/MM/YYYY")}
                  </p>
                  <p className="text-lg">
                    <strong>Hora:</strong> {selectedCita.hora}
                  </p>
                  <p className="text-lg">
                    <strong>Estado:</strong> {selectedCita.estado}
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Perfiles</h3>
                  <ul className="list-disc list-inside">
                    {selectedCita.perfiles.map((perfil) => (
                      <li key={perfil._id} className="text-gray-700">
                        {perfil.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">Exámenes</h3>
                  <ul className="list-disc list-inside">
                    {selectedCita.examenes.map((examen) => (
                      <li key={examen._id} className="text-gray-700">
                        {examen.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultadoCliente;
