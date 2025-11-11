import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Descomentado para usar la API real
import Loading from "./Loading.jsx";

function Formulario() {
  const navigate = useNavigate();
  const [sector, setSector] = useState(1);
  const [referencia, setReferencia] = useState("");
  const [emision, setEmision] = useState("getDeuda");
  const [fecha, setFecha] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMensaje(null);
    if (!referencia) {
      setErrorMensaje("Por favor, ingrese una referencia válida.");
      setLoading(false);
      return;
    }

    try {
      const url = "http://localhost:8080/api/deuda";

      const formData = new URLSearchParams();
      formData.append("ofic99", sector);
      formData.append("padron", referencia);
      formData.append("action", emision);
      formData.append("fvtoStr", fecha || "11/11/2025");

      // Pedimos la respuesta como blob (puede ser JSON o PDF)
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        responseType: "blob",
      });

      const contentType = res.headers["content-type"];

      // 🔹 Si viene PDF → descargarlo
      if (contentType === "application/pdf") {
        const blob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `libreDeuda_${referencia}.pdf`;
        link.click();
        setLoading(false);
        return; // no seguimos a resultados
      }

      // 🔹 Si viene JSON → parsear y mostrar resultados
      const textData = await res.data.text();
      const resultados = JSON.parse(textData);

      console.log("Resultados recibidos:", resultados);

      // Verificar si hay resultados
      if (!resultados || resultados.length === 0) {
        setErrorMensaje(
          "No se han encontrado registros de deuda para la referencia ingresada."
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/resultados", {
        state: {
          resultados,
          tipoEmision: emision,
          sector,
          referencia,
          fecha,
        },
      });
    } catch (error) {
      setLoading(false);

      // Mensajes de error más específicos
      if (error.response) {
        // El servidor respondió con un código de error
        if (error.response.status === 404) {
          setErrorMensaje(
            "No se encontraron registros para la referencia ingresada."
          );
        } else if (error.response.status === 500) {
          setErrorMensaje(
            "Error en el servidor. Por favor, intente nuevamente más tarde."
          );
        } else {
          setErrorMensaje(
            `Error: ${error.response.status}. Por favor, intente nuevamente.`
          );
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        setErrorMensaje(
          "No se pudo conectar con el servidor. Verifique su conexión."
        );
      } else {
        // Algo pasó al configurar la petición
        setErrorMensaje(
          "Error al procesar la solicitud. Por favor, intente nuevamente."
        );
      }
    }
  };

  return (
    <form className="formulario" onSubmit={handleSubmit}>
      <label className="field">
        <span>Sector</span>
        <select
          className="select"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        >
          <option value={1}>Servicios Municipales</option>
          <option value={2}>Comercio</option>
          <option value={4}>Cementerio Ciudad</option>
          <option value={5}>Hornos pirolíticos</option>
          <option value={6}>Motovehículos</option>
          <option value={7}>Deudores Empadronables</option>
        </select>
      </label>

      <label className="field">
        <span>Referencia</span>
        <input
          className="input"
          type="text"
          placeholder="Referencia"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />
      </label>

      <fieldset className="field radio-group">
        <span>Emisión</span>
        <label className="radio">
          <input
            type="radio"
            name="getDeuda"
            value="getDeuda"
            checked={emision === "getDeuda"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Deuda Total
        </label>
        <label className="radio">
          <input
            type="radio"
            name="getMoratoria"
            value="getMoratoria"
            checked={emision === "getMoratoria"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Moratoria 2025
        </label>
        <label className="radio">
          <input
            type="radio"
            name="getBoletos"
            value="getBoletos"
            checked={emision === "getBoletos"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Duplicado última facturación
        </label>
        <label className="radio">
          <input
            type="radio"
            name="getSeleccion"
            value="getSeleccion"
            checked={emision === "getSeleccion"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Selección de Deuda
        </label>
      </fieldset>

      <label className="field">
        <span>Fecha Vencimiento</span>
        <select
          className="input"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        >
          <option value="11/11/2025">11/11/2025</option>
          <option value="10/12/2025">10/12/2025</option>
          <option value="09/01/2026">09/01/2026</option>
        </select>
      </label>

      <button className="btn-primary" type="submit">
        Procesar
      </button>
      {loading && <Loading />}
      {errorMensaje && <div className="error-message">{errorMensaje}</div>}
    </form>
  );
}

export default Formulario;
