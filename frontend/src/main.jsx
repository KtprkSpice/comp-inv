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
import LoanManagement from "./pages/main/loanManagement.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Login />} path="/login" />
        <Route element={<Dashboard />} path="/" />
        <Route element={<Employees />} path="/employee" />
        <Route element={<Inventory />} path="/item" />
        <Route element={<LoanManagement />} path="/loan" />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
