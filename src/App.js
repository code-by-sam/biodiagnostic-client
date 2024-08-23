import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Servicios from "./components/Servicios";
import AdminPanel from "./components/AdminPanel";
import AreaManagement from "./components/AreaManagement";
import ExamenManagement from "./components/ExamenManagement";
import UserManagement from "./components/UserManagement";
import RoleManagement from "./components/RoleManagement";
import ClienteManagement from "./components/ClienteManagement";
import EmpleadoManagement from "./components/EmpleadoManagement";
import PerfilManagement from "./components/PerfilManagement";
import TipoPersonaManagement from "./components/TipoPersonaManagement";
import AgendaTuCita from "./components/AgendaTuCita";
import AssignUser from "./components/AssignUser";
import CitaManagement from "./components/CitaManagement";
import CrearCitaconCitaPendiente from "./components/CrearCitaconCitaPendiente";
import CitaList from "./components/CitaList";
import CitaPendienteList from "./components/CitaPendienteList";
import CitaPendienteManagement from "./components/CitaPendienteManagement";
import Login from "./components/Login";
import ResultadoCliente from "./components/ResultadoCliente";
import UnauthorizedPage from "./components/UnauthorizedPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/agenda" element={<AgendaTuCita />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resultados" element={<ResultadoCliente />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Rutas del Panel de Administración */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={AdminPanel}
                allowedRoles={["Administrador", "Empleado"]}
              />
            }
          >
            <Route
              path="citas/lista"
              element={
                <ProtectedRoute
                  element={CitaList}
                  allowedRoles={["Administrador", "Empleado"]}
                />
              }
            />
            <Route
              path="citas/lista-pendiente"
              element={
                <ProtectedRoute
                  element={CitaPendienteList}
                  allowedRoles={["Administrador", "Empleado"]}
                />
              }
            />
            <Route
              path="citas/crear-pendiente"
              element={
                <ProtectedRoute
                  element={CitaPendienteManagement}
                  allowedRoles={["Administrador", "Empleado"]}
                />
              }
            />
            <Route
              path="citas/realizar-cita"
              element={
                <ProtectedRoute
                  element={CitaManagement}
                  allowedRoles={["Administrador", "Empleado"]}
                />
              }
            />
            <Route
              path="citas/cita-pendiente"
              element={
                <ProtectedRoute
                  element={CrearCitaconCitaPendiente}
                  allowedRoles={["Administrador", "Empleado"]}
                />
              }
            />
            <Route
              path="areas"
              element={
                <ProtectedRoute
                  element={AreaManagement}
                  allowedRoles={["Administrador"]}
                />
              }
            />
            <Route
              path="examenes"
              element={
                <ProtectedRoute
                  element={ExamenManagement}
                  allowedRoles={["Administrador"]}
                />
              }
            />
            <Route
              path="usuarios/crear"
              element={
                <ProtectedRoute
                  element={UserManagement}
                  allowedRoles={["Administrador"]}
                />
              }
            />
            <Route
              path="usuarios/asignar"
              element={
                <ProtectedRoute
                  element={AssignUser}
                  allowedRoles={["Administrador"]}
                />
              }
            />
            <Route
              path="roles"
              element={
                <ProtectedRoute
                  element={RoleManagement}
                  allowedRoles={["Administrador"]}
                />
              }
            />
            <Route
              path="clientes"
              element={
                <ProtectedRoute
                  element={ClienteManagement}
                  allowedRoles={["Administrador", "Empleado"]}
                />
              }
            />
            <Route
              path="empleados"
              element={
                <ProtectedRoute
                  element={EmpleadoManagement}
                  allowedRoles={["Administrador"]}
                />
              }
            />
            <Route
              path="perfiles"
              element={
                <ProtectedRoute
                  element={PerfilManagement}
                  allowedRoles={["Administrador"]}
                />
              }
            />
            <Route
              path="tipo-personas"
              element={
                <ProtectedRoute
                  element={TipoPersonaManagement}
                  allowedRoles={["Administrador"]}
                />
              }
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
