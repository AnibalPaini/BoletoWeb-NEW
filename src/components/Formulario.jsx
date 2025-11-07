import { useEffect, useState } from "react";
import axios from "axios";

function Formulario() {
  const [sector, setSector] = useState(1);
  const [referencia, setReferencia] = useState("");
  const [emision, setEmision] = useState("total");
  const [fecha, setFecha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { sector, referencia, emision, fecha };

    try {
      const res = await axios.post("http://localhost:8080/api/deuda", data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res.data);
      // optional: handle res.data (show success message, navigate, etc.)
    } catch (error) {
      console.error(
        "Error posting deuda:",
        error?.response?.data ?? error.message ?? error
      );
    }
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
