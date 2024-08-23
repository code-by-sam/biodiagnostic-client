import React from "react";

const UnauthorizedPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-red-600">
          Acceso Denegado
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          No tienes permisos para acceder a esta página.
        </p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
