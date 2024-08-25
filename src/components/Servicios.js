import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../config/axiosClient";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

// Component for individual exam card
const ExamCard = ({ exam }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <h2 className="text-xl font-semibold mb-2">{exam.nombre}</h2>
    <p className="mb-2">{exam.descripcion}</p>
    <p className="text-gray-600">Área: {exam.area.nombre}</p>
    <p className="font-bold">
      {" "}
      S/.&nbsp;{parseFloat(exam.costo).toFixed(2)}
    </p>{" "}
    {/* Formato en soles */}
  </div>
);

// Component for individual profile card
const ProfileCard = ({ profile }) => {
  // Extract the filename from the full path
  const imageName = profile.imagen.split("/").pop();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <img
        src={`https://biodiagnostic.onrender.com/uploads/perfiles/${imageName}`}
        alt={profile.nombre}
        className="mb-4 w-full h-48 object-cover rounded"
      />
      <h2 className="text-xl font-semibold mb-2">{profile.nombre}</h2>
      <p className="mb-2">{profile.descripcion}</p>
      <p className="text-gray-600 mb-2">
        Exámenes: {profile.examenes.map((examen) => examen.nombre).join(", ")}
      </p>
      <p className="font-bold">
        {" "}
        S/.&nbsp;{parseFloat(profile.costo).toFixed(2)}
      </p>{" "}
      {/* Formato en soles */}
    </div>
  );
};

function Servicios() {
  const [exams, setExams] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [currentPageExams, setCurrentPageExams] = useState(1);
  const [currentPageProfiles, setCurrentPageProfiles] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Fetch exams, areas, and profiles from the backend
    const fetchData = async () => {
      try {
        const examsResponse = await axios.get("/api/examenes");
        const areasResponse = await axios.get("/api/areas");
        const profilesResponse = await axios.get("/api/perfiles");

        // Filter exams with state "habilitado"
        const enabledExams = examsResponse.data.filter(
          (exam) => exam.estado === "habilitado"
        );

        // Filter profiles with state "habilitado"
        const enabledProfiles = profilesResponse.data.filter(
          (profile) => profile.estado === "habilitado"
        );

        setExams(enabledExams);
        setAreas(areasResponse.data);
        setProfiles(enabledProfiles);
        setFilteredExams(enabledExams);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter exams based on search term and selected area
    const filtered = exams.filter(
      (exam) =>
        exam.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedArea ? exam.area && exam.area._id === selectedArea : true)
    );

    setFilteredExams(filtered);
  }, [searchTerm, selectedArea, exams]);

  // Get paginated exams and profiles
  const paginatedExams = filteredExams.slice(
    (currentPageExams - 1) * itemsPerPage,
    currentPageExams * itemsPerPage
  );

  const paginatedProfiles = profiles.slice(
    (currentPageProfiles - 1) * itemsPerPage,
    currentPageProfiles * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (pageType, direction) => {
    if (pageType === "exams") {
      setCurrentPageExams((prevPage) =>
        direction === "next"
          ? Math.min(
              prevPage + 1,
              Math.ceil(filteredExams.length / itemsPerPage)
            )
          : Math.max(prevPage - 1, 1)
      );
    } else if (pageType === "profiles") {
      setCurrentPageProfiles((prevPage) =>
        direction === "next"
          ? Math.min(prevPage + 1, Math.ceil(profiles.length / itemsPerPage))
          : Math.max(prevPage - 1, 1)
      );
    }
  };

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
          <h1 className="text-3xl font-bold">Nuestros Servicios</h1>
          <p className="text-md mt-1">
            Tenemos una amplia gama de análisis para ofrecer{" "}
          </p>
        </div>
        <div className="absolute inset-0 bg-blue-800 opacity-30"></div>
      </div>

      {/* Exámenes Section */}
      <div className="container mx-auto p-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Exámenes</h2>
          <p className="mb-6">
            Escoge entre diversos exámenes por áreas. Utiliza el filtro para
            encontrar el examen que necesitas.
          </p>
          <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre de examen"
              className="p-2 border border-gray-300 rounded mb-4 md:mb-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 border border-gray-300 rounded"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              <option value="">Filtrar por área</option>
              {areas.map((area) => (
                <option key={area._id} value={area._id}>
                  {area.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedExams.map((exam) => (
              <ExamCard key={exam._id} exam={exam} />
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange("exams", "prev")}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={currentPageExams === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPageExams} de{" "}
              {Math.ceil(filteredExams.length / itemsPerPage)}
            </span>
            <button
              onClick={() => handlePageChange("exams", "next")}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={
                currentPageExams ===
                Math.ceil(filteredExams.length / itemsPerPage)
              }
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Perfiles Section */}
      <div className="container mx-auto p-6">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Perfiles</h2>
          <p className="text-lg">
            Conoce nuestros perfiles especializados y los exámenes que ofrecen.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {paginatedProfiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange("profiles", "prev")}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={currentPageProfiles === 1}
            >
              Anterior
            </button>
            <span>
              Página {currentPageProfiles} de{" "}
              {Math.ceil(profiles.length / itemsPerPage)}
            </span>
            <button
              onClick={() => handlePageChange("profiles", "next")}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={
                currentPageProfiles ===
                Math.ceil(profiles.length / itemsPerPage)
              }
            >
              Siguiente
            </button>
          </div>
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

      {/* WhatsApp Floating Button */}
      <Link
        to="https://wa.me/51987654321"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
      </Link>
    </div>
  );
}

export default Servicios;
