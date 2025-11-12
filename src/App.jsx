import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Formulario from "./components/Formulario.jsx";
import TablaResultados from "./components/TablaResultados.jsx";
import TablaEmitirBoleto from "./components/TablaEmitirBoleto.jsx";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Formulario />} />
            <Route path="/resultados" element={<TablaResultados />} />
            <Route path="/resultados-emision" element={<TablaEmitirBoleto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
