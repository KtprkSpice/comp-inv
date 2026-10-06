import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/auth/login.jsx";
import Dashboard from "./pages/main/dashboard.jsx";
import "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Employees from "./pages/main/employee.jsx";
import Inventory from "./pages/main/item.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<Employees />} path="/employee" />
        <Route element={<Dashboard />} path="/" />
        <Route element={<Inventory />} path="/item" />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
