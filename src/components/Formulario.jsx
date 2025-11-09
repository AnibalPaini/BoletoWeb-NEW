import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; // Descomentar cuando se use la API real

function Formulario() {
  const navigate = useNavigate();
  const [sector, setSector] = useState(1);
  const [referencia, setReferencia] = useState("");
  const [emision, setEmision] = useState("total");
  const [fecha, setFecha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ============================================
    // OPCIÓN 1: Datos ficticios (ACTIVO AHORA)
    // ============================================
    const datosFicticios = [
      {
        emision: "08/11/2025",
        vencimiento: "10/11/2025",
        detalle: "Emision de Deuda WEB",
        numero: "122542/0-2025",
        importe: "$28.777,93",
      },
    ];

    // Navegar a la tabla con los datos ficticios
    navigate("/resultados", { state: { resultados: datosFicticios } });

    // ============================================
    // OPCIÓN 2: Uso de API real (COMENTADO)
    // ============================================
    // Para activar la API real:
    // 1. Descomentar el import de axios arriba
    // 2. Comentar el código de datos ficticios (líneas 15-26)
    // 3. Descomentar el código a continuación
    /*
    const data = { 
      sector, 
      referencia, 
      emision, 
      fecha 
    };

    try {
      const res = await axios.post("http://localhost:8080/api/deuda", data, {
        headers: { "Content-Type": "application/json" },
      });
      
      // Asumiendo que la API devuelve un array de resultados
      // Ajustar según la estructura real de la respuesta
      const resultados = res.data.resultados || res.data;
      
      // Navegar a la tabla con los datos de la API
      navigate("/resultados", { state: { resultados } });
      
    } catch (error) {
      console.error(
        "Error obteniendo deuda:",
        error?.response?.data ?? error.message ?? error
      );
      
      // Opcional: Mostrar mensaje de error al usuario
      // alert("Error al obtener los datos. Por favor, intente nuevamente.");
    }
    */
  };

  useEffect(() => {
    console.log(sector);
    console.log(fecha);
  }, [sector, fecha]);

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
            name="emision"
            value="total"
            checked={emision === "total"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Deuda Total
        </label>
        <label className="radio">
          <input
            type="radio"
            name="emision"
            value="moratoria"
            checked={emision === "moratoria"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Moratoria 2024
        </label>
        <label className="radio">
          <input
            type="radio"
            name="duplicado"
            value="duplicado"
            checked={emision === "duplicado"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Duplicado última facturación
        </label>
        <label className="radio">
          <input
            type="radio"
            name="seleccion_deuda"
            value="seleccion_deuda"
            checked={emision === "seleccion_deuda"}
            onChange={(e) => setEmision(e.target.value)}
          />{" "}
          Selección de Deuda
        </label>
      </fieldset>

      <label className="field">
        <span>Fecha Vencimiento</span>
        <select
          name=""
          id=""
          className="input"
          onChange={(e) => setFecha(e.target.value)}
        >
          <option value="1">Opción 1</option>
          <option value="2">Opción 2</option>
          <option value="3">Opción 3</option>
        </select>
      </label>

      <button className="btn-primary" type="submit">
        Procesar
      </button>
    </form>
  );
}

export default Formulario;
