import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../config/axiosClient";
 // Asegúrate de instalar axios para las solicitudes HTTP
import logo from "../assets/logo.png"; // Ruta de tu logo

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(""); // Mensaje de error

  // En tu Login.js
  const handleLogin = async () => {
    if (!username || !contraseña) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://biodiagnostic.onrender.com/api/login", {
        username,
        contraseña,
      });
      const { token, role,userId } = response.data;

      // Guardar el token y el rol en el almacenamiento local
      // Al hacer login, guarda el nombre de usuario y rol en el localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", username); // Asegúrate de que `username` es correcto
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", userId); // Guarda el userId


      // Redirigir al usuario según el rol
      if (role === "Administrador") {
        navigate("/admin");
      } else if (role === "Empleado") {
        navigate("/admin");
      } else if (role === "Cliente") {
        navigate("/resultados");
      } else {
        navigate("/"); // Redirigir a una página por defecto si el rol no es reconocido
      }
    } catch (error) {
      console.error(
        "Error de autenticación:",
        error.response?.data || error.message
      );
      setError("Error de autenticación. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center">
        <div className="flex items-center justify-center h-full bg-black bg-opacity-60">
          <div className="text-white text-center p-12 max-w-sm">
            <img src={logo} alt="Company Logo" className="w-32 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold mb-4">
              Bienvenido a Biodiagnostic
            </h1>
            <p className="text-lg">Gestione sus citas y más desde aquí.</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="Company Logo" className="w-24 mx-auto mb-4" />
            <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
              Iniciar Sesión
            </h1>
          </div>

          {/* Formulario de Inicio de Sesión */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-600 text-sm font-medium mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition duration-300"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
