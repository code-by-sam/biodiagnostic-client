import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ViewResultModal = ({ resultado, onClose }) => {
  // URL base del servidor donde están almacenados los archivos PDF
  const baseUrl = "https://biodiagnostic.onrender.com/uploads/resultados/"; // Cambia esta URL según tu configuración
  const pdfUrl = resultado.archivo ? `${baseUrl}${resultado.archivo}` : "";

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full">
        <h2 className="text-xl font-bold mb-4">Detalles del Resultado</h2>
        <div className="mb-4">
          <p>
            <strong>Descripción:</strong> {resultado.descripcion}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(resultado.fecha).toLocaleDateString()}
          </p>
          <p>
            <strong>Hora:</strong> {resultado.hora}
          </p>
          <p>
            <strong>Archivo:</strong>{" "}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Ver PDF
            </a>
          </p>
        </div>
        <div className="mb-4">
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              width="100%"
              height="400px"
              title="Resultado PDF"
              className="border border-gray-300"
            ></iframe>
          )}
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-500 text-white rounded mt-4"
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2" />
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ViewResultModal;
