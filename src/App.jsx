import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Formulario from "./components/Formulario.jsx";

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Formulario />
      </main>
      <Footer />
    </div>
  );
}

export default App;
