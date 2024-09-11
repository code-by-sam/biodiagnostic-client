import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import bannerImage from "../assets/banner1.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import lab1 from "../assets/lab1.jpg";
import lab2 from "../assets/lab2.jpg";
import lab3 from "../assets/lab3.jpg";
import lab4 from "../assets/lab4.jpg";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
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

      {/* Banner con Efecto de Tarjeta Desplegable */}
      <div className="relative w-full h-auto flex items-center justify-center text-white bg-blue-800 py-16">
        <img
          src={bannerImage}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="relative z-10 bg-blue-900 bg-opacity-80 p-8 sm:p-12 rounded-xl shadow-2xl transform transition-transform hover:scale-105">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Bienvenido a BioDiagnostic
          </h1>
          <p className="text-lg sm:text-xl mb-4">
            Tu laboratorio clínico de confianza
          </p>
          <p className="text-base sm:text-lg mb-6">
            Excelencia en análisis clínicos
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <Link
              to="/agenda"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              Agendar Cita
            </Link>
            <Link
              to="/login"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              Ver Resultados
            </Link>
          </div>
        </div>
      </div>

      {/* Beneficios de Elegirnos */}
      <div className="container mx-auto py-16 px-6 bg-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-800">
            Beneficios de Elegirnos
          </h2>
          <p className="text-base sm:text-lg mt-4 text-gray-600 max-w-xl mx-auto">
            Al elegir BioDiagnostic, obtienes acceso a servicios de análisis
            clínicos de primer nivel con un enfoque en la calidad, precisión, y
            satisfacción del cliente. Descubre por qué somos la opción
            preferida.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Benefit Card 1 */}
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
            <img
              src={lab1}
              alt="Calidad Asegurada"
              className="mb-4 w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Calidad Asegurada</h3>
            <p>
              Utilizamos tecnologías confiables para asegurar resultados
              precisos.
            </p>
          </div>
          {/* Benefit Card 2 */}
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
            <img
              src={lab2}
              alt="Equipo Profesional"
              className="mb-4 w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Equipo Profesional</h3>
            <p>
              Nuestro equipo está compuesto por profesionales altamente
              calificados y comprometidos con la excelencia.
            </p>
          </div>
          {/* Benefit Card 3 */}
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
            <img
              src={lab3}
              alt="Rapidez en Resultados"
              className="mb-4 w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Rapidez en Resultados</h3>
            <p>
              Entregamos resultados de manera rápida y eficiente, sin
              comprometer la calidad.
            </p>
          </div>
          {/* Benefit Card 4 */}
          <div className="bg-blue-800 p-6 rounded-lg shadow-lg text-white transition-transform transform hover:scale-105 duration-300">
            <img
              src={lab4}
              alt="Atención Personalizada"
              className="mb-4 w-full h-48 object-cover rounded-lg"
            />
            <h3 className="text-xl font-bold mb-2">Atención Personalizada</h3>
            <p>
              Cada cliente es único, y adaptamos nuestros servicios para
              satisfacer sus necesidades.
            </p>
          </div>
        </div>
      </div>

      {/* Preguntas Frecuentes (FAQ) */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-800">
              Preguntas Frecuentes
            </h2>
            <p className="text-base sm:text-lg mt-4 text-gray-600 max-w-xl mx-auto">
              Aquí respondemos a algunas de las preguntas más comunes que tienen
              nuestros clientes sobre nuestros servicios y procesos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* FAQ Item 1 */}
            <div className="p-6 bg-blue-900 text-white rounded-lg shadow-2xl transition-transform transform hover:-translate-y-2 duration-300">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                ¿Qué tipos de análisis ofrecen?
              </h3>
              <p>
                Ofrecemos una amplia gama de análisis clínicos, incluyendo
                pruebas de laboratorio de rutina, pruebas especializadas, y
                análisis genéticos.
              </p>
            </div>
            {/* FAQ Item 2 */}
            <div className="p-6 bg-blue-900 text-white rounded-lg shadow-2xl transition-transform transform hover:-translate-y-2 duration-300">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                ¿Cómo puedo agendar una cita?
              </h3>
              <p>
                Puedes agendar una cita fácilmente a través de nuestro sitio web
                o llamando a nuestro número de atención al cliente. Estamos
                disponibles para ayudarte.
              </p>
            </div>
            {/* FAQ Item 3 */}
            <div className="p-6 bg-blue-900 text-white rounded-lg shadow-2xl transition-transform transform hover:-translate-y-2 duration-300">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                ¿Dónde están ubicados?
              </h3>
              <p>
                Nos encontramos en el distrito de San Martín de Porres, Lima
                Metropolitana. Puedes ver nuestra ubicación exacta en el mapa en
                la sección de contacto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Mapa con Azul Coordinado */}
      <div className="text-center mt-12 mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-800">
          Ubicación
        </h2>
      </div>
      <div className="container mx-auto my-12 p-6 flex flex-col md:flex-row bg-blue-800 rounded-lg shadow-lg">
        <div className="w-full md:w-1/2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15610.903393675891!2d-77.09831777632387!3d-11.993462063864843!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105ce7ed7bc5de9%3A0x4c279daac3e59e75!2sBiodiagnostic%20Laboratorio%20Cl%C3%ADnico!5e0!3m2!1ses-419!2spe!4v1724436591608!5m2!1ses-419!2spe"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg shadow-md border border-blue-600"
          ></iframe>
        </div>
        <div className="w-full md:w-1/2 md:pl-6 mt-6 md:mt-0">
          <h3 className="text-2xl font-bold mb-4 text-white">Encuéntranos</h3>
          <p className="text-white">
            Estamos ubicados en el corazón de la ciudad, fácilmente accesible
            por transporte público y con estacionamiento disponible. Visítanos
            para recibir la mejor atención clínica en un ambiente moderno y
            cómodo.
          </p>
          <div className="text-center mt-6">
            <Link
              to="/encuentranos"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Más Información
            </Link>
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
          <div className="text-center md:text-right">
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

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/1234567890"
        className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        title="Contáctanos en WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} size="lg" />
      </a>
    </div>
  );
}

export default HomePage;
