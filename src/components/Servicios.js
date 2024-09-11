import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../config/axiosClient";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

const ExamCard = ({ exam, onClick }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 cursor-pointer border border-gray-200 hover:scale-105 duration-300"
    onClick={() => onClick(exam)}
  >
    <h2 className="text-xl font-semibold mb-2">{exam.nombre}</h2>
    <p className="text-gray-600 mb-2">
      <strong>Costo:</strong> S/. {parseFloat(exam.costo).toFixed(2)}
    </p>
  </div>
);

const ProfileCard = ({ profile, onClick }) => {
  const imageName = profile.imagen.split("/").pop();

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow transform hover:-translate-y-1 cursor-pointer border border-gray-200 hover:scale-105 duration-300"
      onClick={() => onClick(profile)}
    >
      <img
        src={`https://biodiagnostic.onrender.com/uploads/perfiles/${imageName}`}
        alt={profile.nombre}
        className="mb-4 w-full h-48 object-cover rounded-lg"
      />
      <h2 className="text-xl font-semibold mb-2">{profile.nombre}</h2>
      <p className="text-gray-600 mb-2">
        <strong>Costo:</strong> S/. {parseFloat(profile.costo).toFixed(2)}
      </p>
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
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchTermProfile, setSearchTermProfile] = useState("");
  const [currentPageExams, setCurrentPageExams] = useState(1);
  const [currentPageProfiles, setCurrentPageProfiles] = useState(1);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examsResponse = await axios.get("/api/examenes");
        const areasResponse = await axios.get("/api/areas");
        const profilesResponse = await axios.get("/api/perfiles");

        const enabledExams = examsResponse.data.filter(
          (exam) => exam.estado === "habilitado"
        );

        const enabledProfiles = profilesResponse.data.filter(
          (profile) => profile.estado === "habilitado"
        );

        setExams(enabledExams);
        setAreas(areasResponse.data);
        setProfiles(enabledProfiles);
        setFilteredExams(enabledExams);
        setFilteredProfiles(enabledProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = exams.filter(
      (exam) =>
        exam.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedArea ? exam.area && exam.area._id === selectedArea : true)
    );

    setFilteredExams(filtered);
    setCurrentPageExams(1); // Reinicia la página a 1 al cambiar el área
  }, [searchTerm, selectedArea, exams]);

  useEffect(() => {
    const filtered = profiles.filter((profile) =>
      profile.nombre.toLowerCase().includes(searchTermProfile.toLowerCase())
    );

    setFilteredProfiles(filtered);
  }, [searchTermProfile, profiles]);

  const paginatedExams = filteredExams.slice(
    (currentPageExams - 1) * itemsPerPage,
    currentPageExams * itemsPerPage
  );

  const paginatedProfiles = filteredProfiles.slice(
    (currentPageProfiles - 1) * itemsPerPage,
    currentPageProfiles * itemsPerPage
  );

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
          ? Math.min(
              prevPage + 1,
              Math.ceil(filteredProfiles.length / itemsPerPage)
            )
          : Math.max(prevPage - 1, 1)
      );
    }
  };

  const renderPageNumbers = (pageType, currentPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-4 py-2 rounded-md ${
            i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
          } hover:bg-blue-400 transition-colors`}
          onClick={() => {
            if (pageType === "exams") {
              setCurrentPageExams(i);
            } else {
              setCurrentPageProfiles(i);
            }
          }}
        >
          {i}
        </button>
      );
    }

    return <div className="flex space-x-2">{pageNumbers}</div>;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <nav className="bg-blue-800 p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={logo}
              alt="Logo del Laboratorio"
              className="w-12 h-12 mr-2"
            />
            <span className="text-white text-2xl font-bold">BioDiagnostic</span>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6 w-full md:w-auto mb-4 md:mb-0">
            <Link
              to="/"
              className="text-white hover:bg-red-600 transition-colors p-2 rounded-md text-center"
            >
              Inicio
            </Link>
            <Link
              to="/servicios"
              className="text-white hover:bg-red-600 transition-colors p-2 rounded-md text-center"
            >
              Servicios
            </Link>
            <Link
              to="/agenda"
              className="text-white hover:bg-red-600 transition-colors p-2 rounded-md text-center"
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

      <div className="relative w-full h-32 flex flex-col items-center justify-center text-white bg-blue-800">
        <div className="relative z-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Nuestros Servicios</h1>
          <p className="text-md mt-1">
            Tenemos una amplia gama de análisis para ofrecer{" "}
          </p>
        </div>
        <div className="absolute inset-0 bg-blue-800 opacity-30"></div>
      </div>

      <div className="container mx-auto p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">Exámenes</h2>
          <p className="mb-4">
            Filtra y explora nuestra lista de exámenes disponibles.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre de examen"
              className="p-2 border border-gray-300 rounded mb-4 sm:mb-0 w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 border border-gray-300 rounded w-full sm:w-auto"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedExams.map((exam) => (
              <ExamCard key={exam._id} exam={exam} onClick={setSelectedExam} />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange("exams", "prev")}
              className="bg-blue-500 text-white p-2 rounded mb-2 sm:mb-0"
              disabled={currentPageExams === 1}
            >
              Anterior
            </button>
            {renderPageNumbers("exams", currentPageExams, filteredExams.length)}
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

      <div className="container mx-auto p-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-4">Perfiles</h2>
          <p className="mb-4">
            Conoce nuestros perfiles especializados y los exámenes que ofrecen.
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre de perfil"
              className="p-2 border border-gray-300 rounded mb-4 sm:mb-0 w-full sm:w-auto"
              value={searchTermProfile}
              onChange={(e) => setSearchTermProfile(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {paginatedProfiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                onClick={setSelectedProfile}
              />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange("profiles", "prev")}
              className="bg-blue-500 text-white p-2 rounded mb-2 sm:mb-0"
              disabled={currentPageProfiles === 1}
            >
              Anterior
            </button>
            {renderPageNumbers(
              "profiles",
              currentPageProfiles,
              filteredProfiles.length
            )}
            <button
              onClick={() => handlePageChange("profiles", "next")}
              className="bg-blue-500 text-white p-2 rounded"
              disabled={
                currentPageProfiles ===
                Math.ceil(filteredProfiles.length / itemsPerPage)
              }
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-blue-800 py-8 mt-auto">
        <div className="container mx-auto text-white flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <img src={logo} alt="Logo del Laboratorio" className="w-12 h-12" />
            <span className="text-xl font-bold">BioDiagnostic</span>
          </div>
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h3 className="text-lg font-semibold">Contáctanos</h3>
            <p>Teléfono: +51 987 654 321</p>
            <p>Email: contacto@biodiagnostic.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Síguenos</h3>
            <div className="flex space-x-4 mt-2 justify-center sm:justify-end">
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

      <Link
        to="https://wa.me/51987654321"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="2x" />
      </Link>

      {/* Modal for exam and profile details */}
      {(selectedExam || selectedProfile) && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-50 overflow-hidden">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative transition-transform transform scale-100 hover:scale-105 duration-300">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
              onClick={() => {
                setSelectedExam(null);
                setSelectedProfile(null);
              }}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            {selectedExam && (
              <>
                <h2 className="text-xl font-semibold mb-2">
                  {selectedExam.nombre}
                </h2>
                <p className="mb-2">
                  <strong>Descripción:</strong> {selectedExam.descripcion}
                </p>
                <p className="mb-2">
                  <strong>Área:</strong> {selectedExam.area.nombre}
                </p>
                <p className="font-bold">
                  <strong>Costo:</strong> S/.{" "}
                  {parseFloat(selectedExam.costo).toFixed(2)}
                </p>
              </>
            )}
            {selectedProfile && (
              <>
                <h2 className="text-xl font-semibold mb-2">
                  {selectedProfile.nombre}
                </h2>
                <img
                  src={`https://biodiagnostic.onrender.com/uploads/perfiles/${selectedProfile.imagen
                    .split("/")
                    .pop()}`}
                  alt={selectedProfile.nombre}
                  className="mb-4 w-full h-48 object-cover rounded-lg"
                />
                <p className="mb-2">
                  <strong>Descripción:</strong> {selectedProfile.descripcion}
                </p>
                <p className="mb-2">
                  <strong>Exámenes:</strong>{" "}
                  {selectedProfile.examenes
                    .map((examen) => examen.nombre)
                    .join(", ")}
                </p>
                <p className="font-bold">
                  <strong>Costo:</strong> S/.{" "}
                  {parseFloat(selectedProfile.costo).toFixed(2)}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Servicios;
