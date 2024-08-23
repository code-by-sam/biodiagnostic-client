import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faFlask,
  faUser,
  faVials,
  faUserFriends,
  faUserTie,
  faUserMd,
  faFileAlt,
  faPeopleArrows,
  faPlus,
  faUserTag,
  faHeartbeat,
  faCalendarPlus,
  faClipboardCheck,
  faList,
} from "@fortawesome/free-solid-svg-icons";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("clientes");
  const [showUserOptions, setShowUserOptions] = useState(false);
  const [showExamOptions, setShowExamOptions] = useState(false);
  const [userName, setUserName] = useState(""); // Para almacenar el nombre del usuario
  const [userRole, setUserRole] = useState(""); // Para almacenar el rol del usuario
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Elimina el token del localStorage o del estado
    localStorage.removeItem("token");
    localStorage.removeItem("userRole"); // Elimina el rol del localStorage
    // Redirige al usuario a la página principal
    navigate("/");
  };

  useEffect(() => {
    // Recupera el nombre y rol del usuario del localStorage
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName("Usuario"); // Valor por defecto si no hay nombre guardado
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const handleTabClick = (tab) => {
    if (tab === "usuarios") {
      setShowUserOptions(!showUserOptions);
    } else {
      setShowUserOptions(false);
    }

    if (tab === "realizar-cita") {
      setShowExamOptions(!showExamOptions);
    } else {
      setShowExamOptions(false);
    }

    setActiveTab(tab);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-52 bg-gray-800 text-white p-4 shadow-lg overflow-y-auto">
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
          <span className="text-lg font-bold">Admin Panel</span>
        </div>
        <nav>
          {/* Laboratorio Section */}
          <h2 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
            <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-gray-400" />
            Laboratorio
          </h2>
          <ul>
            <li>
              <Link
                to="/admin/clientes"
                className={`block py-2 px-4 rounded ${
                  activeTab === "clientes" ? "bg-gray-600" : "hover:bg-gray-700"
                }`}
                onClick={() => handleTabClick("clientes")}
              >
                <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                Clientes
              </Link>
            </li>
            <li>
              <Link
                to="/admin/citas/lista/"
                className={`block py-2 px-4 rounded ${
                  activeTab === "lista-citas"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => handleTabClick("lista-citas")}
              >
                <FontAwesomeIcon icon={faList} className="mr-2" />
                Lista de Citas Registradas
              </Link>
            </li>
            <li>
              <Link
                to="/admin/citas/lista-pendiente"
                className={`block py-2 px-4 rounded ${
                  activeTab === "lista-pendiente"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => handleTabClick("lista-pendiente")}
              >
                <FontAwesomeIcon icon={faList} className="mr-2" />
                Lista de Citas Agendadas
              </Link>
            </li>
            <li>
              <Link
                to="/admin/citas/crear-pendiente"
                className={`block py-2 px-4 rounded ${
                  activeTab === "crear-pendiente"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                }`}
                onClick={() => handleTabClick("crear-pendiente")}
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
                Agendar Cita
              </Link>
            </li>
            <li className="relative">
              <button
                className={`block py-2 px-4 rounded ${
                  activeTab === "realizar-cita"
                    ? "bg-gray-600"
                    : "hover:bg-gray-700"
                } flex items-center`}
                onClick={() => handleTabClick("realizar-cita")}
              >
                <FontAwesomeIcon icon={faHeartbeat} className="mr-1" />
                Realizar Exámenes
              </button>
              <div
                className={`transition-max-height duration-300 ease-in-out ${
                  showExamOptions ? "max-h-40" : "max-h-0"
                } overflow-hidden`}
              >
                <ul className="bg-gray-700 rounded shadow-lg">
                  <li>
                    <Link
                      to="/admin/citas/realizar-cita/"
                      className="block py-2 px-4 rounded hover:bg-gray-600 flex items-center"
                      onClick={() => handleTabClick("nueva-cita")}
                    >
                      <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
                      Registrar Cita
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/citas/cita-pendiente"
                      className="block py-2 px-4 rounded hover:bg-gray-600 flex items-center"
                      onClick={() => handleTabClick("citas-por-confirmar")}
                    >
                      <FontAwesomeIcon
                        icon={faClipboardCheck}
                        className="mr-2"
                      />
                      Registrar citas con citas agendadas
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>

          {/* Configuración Section */}
          {userRole === "Administrador" && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                <FontAwesomeIcon icon={faCog} className="mr-2 text-gray-400" />
                Configuración
              </h2>
              <ul className="mb-4">
                <li>
                  <Link
                    to="/admin/areas"
                    className={`block py-2 px-4 rounded ${
                      activeTab === "areas"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("areas")}
                  >
                    <FontAwesomeIcon icon={faVials} className="mr-2" />
                    Áreas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/examenes"
                    className={`block py-2 px-4 rounded ${
                      activeTab === "examenes"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("examenes")}
                  >
                    <FontAwesomeIcon icon={faFlask} className="mr-2" />
                    Exámenes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/perfiles"
                    className={`block py-2 px-4 rounded ${
                      activeTab === "perfiles"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("perfiles")}
                  >
                    <FontAwesomeIcon icon={faUserMd} className="mr-2" />
                    Perfiles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/tipo-personas"
                    className={`block py-2 px-4 rounded ${
                      activeTab === "tipo-personas"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("tipo-personas")}
                  >
                    <FontAwesomeIcon icon={faPeopleArrows} className="mr-2" />
                    Tipo Personas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/roles"
                    className={`block py-2 px-4 rounded ${
                      activeTab === "roles"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("roles")}
                  >
                    <FontAwesomeIcon icon={faUserTie} className="mr-2" />
                    Roles
                  </Link>
                </li>
                <li className="relative">
                  <button
                    className={`block py-2 px-4 rounded ${
                      activeTab === "usuarios"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    } flex items-center`}
                    onClick={() => handleTabClick("usuarios")}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Usuarios
                  </button>
                  <div
                    className={`transition-max-height duration-300 ease-in-out ${
                      showUserOptions ? "max-h-40" : "max-h-0"
                    } overflow-hidden`}
                  >
                    <ul className="bg-gray-700 rounded shadow-lg">
                      <li>
                        <Link
                          to="/admin/usuarios/crear"
                          className="block py-2 px-4 rounded hover:bg-gray-600 flex items-center"
                          onClick={() => {
                            handleTabClick("usuarios");
                            setShowUserOptions(false);
                          }}
                        >
                          <FontAwesomeIcon icon={faPlus} className="mr-2" />
                          Crear usuario
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/usuarios/asignar"
                          className="block py-2 px-4 rounded hover:bg-gray-600 flex items-center"
                          onClick={() => {
                            handleTabClick("usuarios");
                            setShowUserOptions(false);
                          }}
                        >
                          <FontAwesomeIcon icon={faUserTag} className="mr-2" />
                          Asignar usuario
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <Link
                    to="/admin/empleados"
                    className={`block py-2 px-4 rounded ${
                      activeTab === "empleados"
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                    }`}
                    onClick={() => handleTabClick("empleados")}
                  >
                    <FontAwesomeIcon icon={faUserTie} className="mr-2" />
                    Empleados
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-52 flex-grow p-8">
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
        <Outlet />
      </main>
    </div>
  );
}

export default AdminPanel;
