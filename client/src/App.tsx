import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ResponsiveAppBar from "./components/headerCompo/Header";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <ToastContainer />
        <ResponsiveAppBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
