import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading.jsx";
import { descargarPDF } from "../services/services.js";


function TablaResultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultados = location.state?.resultados || [];
  const tipoEmision = location.state?.tipoEmision || "total";
  const sector = location.state?.sector || "";
  const referencia = location.state?.referencia || "";
  const fecha = location.state?.fecha || "";
  const [loading, setLoading] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState(null);   


  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const url = "http://localhost:8080/api/";

  const handlePagarOnline = async() => {
    try {
      const res = await axios.post(url+"pagar", {
        concepto:1,
        action: "EPagosPagoSolicitud",
      });
      console.log(res);
    
    } catch (error) {
      console.log(error);
      
    }
  };

  const handleDescargarPDF = async(item) => {
    await descargarPDF(item.serializedId);
  };

  const handleVolver = () => navigate("/");

  // Manejar selección de checkbox
  const handleCheckboxChange = (index, item) => {
    // Para getSeleccion, usar saldo; para otros, usar importe
    const importeStr = item.saldo || item.importe || "0";

    // Limpiar el string: remover $, puntos de miles, y convertir coma decimal a punto
    const importeLimpio = importeStr
      .replace(/\$/g, "") // Quitar símbolo $
      .replace(/\./g, "") // Quitar puntos de miles (13.682,50 -> 13682,50)
      .replace(/,/g, ".") // Convertir coma decimal a punto (13682,50 -> 13682.50)
      .trim();

    const importeNumerico = parseFloat(importeLimpio) || 0;

    console.log(
      `Procesando: ${importeStr} -> ${importeLimpio} -> ${importeNumerico}`
    );

    if (itemsSeleccionados.some((sel) => sel.index === index)) {
      setItemsSeleccionados(
        itemsSeleccionados.filter((sel) => sel.index !== index)
      );
    } else {
      setItemsSeleccionados([
        ...itemsSeleccionados,
        {
          index,
          importe: importeNumerico,
          checkbox: item.checkbox, // Guardar el value del checkbox
        },
      ]);
    }
  };

  const calcularTotal = () => {
    return itemsSeleccionados.reduce((sum, item) => sum + item.importe, 0);
  };

  // Función para seleccionar/deseleccionar todos
  const handleSeleccionarTodos = () => {
    if (itemsSeleccionados.length === resultados.length) {
      // Si ya están todos seleccionados, deseleccionar todos
      setItemsSeleccionados([]);
    } else {
      // Seleccionar todos
      const todosSeleccionados = resultados.map((item, index) => {
        const importeStr = item.saldo || item.importe || "0";
        const importeLimpio = importeStr
          .replace(/\$/g, "")
          .replace(/\./g, "")
          .replace(/,/g, ".")
          .trim();
        const importeNumerico = parseFloat(importeLimpio) || 0;

        return {
          index,
          importe: importeNumerico,
          checkbox: item.checkbox,
        };
      });
      setItemsSeleccionados(todosSeleccionados);
    }
  };

  const handlerEmitirBoleto = async () => {
    if (itemsSeleccionados.length === 0) {
      alert("Por favor, seleccione al menos un item para emitir el boleto.");
      return;
    }
    setLoading(true);
    setErrorMensaje(null);

    try {
      const formData = new URLSearchParams();
      // Movimientos seleccionados
      const movimientos = itemsSeleccionados.map((item) => item.checkbox);
      if (Array.isArray(movimientos)) {
        movimientos.forEach((m) => {
          const limpio = m.split("_")[0];
          formData.append("movimientos", limpio);
          console.log(limpio);
        });
      } else if (movimientos) {
        const limpio = movimientos.split(",").slice(0, 4).join(",");
        console.log(limpio);

        formData.append("movimientos", limpio);
      }

      // Creamos el formulario igual al backend original

      formData.append("action", "getDeudaSeleccionada");
      formData.append("padron", referencia);
      formData.append("fvtoStr", fecha || ""); // por si es vacío
      formData.append("ofic99", sector || ""); // por si es vacío

      console.log("📤 Enviando payload (form):", formData.toString());

      const res = await axios.post(url+"deuda", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        responseType: "blob",
      });

      const textData = await res.data.text();
      const resultadosEmision = JSON.parse(textData);
      console.log("Resultados recibidos:", resultadosEmision);
      if (!resultadosEmision || resultadosEmision.length === 0) {
        setErrorMensaje(
          "No se han encontrado registros de deuda para la referencia ingresada."
        );
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/resultados-emision", {
        state: {
          resultados: resultadosEmision,
        },
      });
    } catch (error) {
      console.error("❌ Error al emitir boleto:", error);
      if (error.res?.data) {
        console.log("🪵 Respuesta del backend (error):", error.res.data);
      }
      alert("Error al emitir el boleto. Por favor, intente nuevamente.");
    }
  };

  // 🔹 Mostrar checkboxes solo si es tipo selección (getSeleccion)
  const mostrarCheckboxes = tipoEmision === "getSeleccion";

  // 🔹 Detectar columnas dinámicamente según el tipo
  const columnas = mostrarCheckboxes
    ? [
        "Seleccionar",
        "Periodo",
        "Fecha",
        "Concepto",
        "Débito",
        "Saldo",
        "Plan",
        "Apremio",
      ]
    : ["Emisión", "Vencimiento", "Detalle", "Número", "Importe", "Acciones"];

  return (
    <div className="tabla-container">
      <button
        className="btn-volver-flecha"
        onClick={handleVolver}
        title="Volver"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <h2 className="tabla-title">
        {tipoEmision === "getSeleccion"
          ? "Seleccionar Deuda por Mes"
          : "Deuda Total"}
      </h2>
      <div className="datos-referencia-tabla">
        <p>Sector:{sector}</p>
        <p>Padron: {referencia}</p>
        <p>Vencimiento: {fecha}</p>
      </div>

      {resultados.length > 0 ? (
        <>
          <div className="tabla-wrapper">
            <table className="tabla-resultados">
              <thead>
                <tr>
                  {columnas.map((col, i) => (
                    <th key={i}>{col}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {resultados.map((item, index) => (
                  <tr key={index}>
                    {mostrarCheckboxes && (
                      <td className="checkbox-cell">
                        <input
                          type="checkbox"
                          value={item.checkbox}
                          checked={itemsSeleccionados.some(
                            (sel) => sel.index === index
                          )}
                          onChange={() => handleCheckboxChange(index, item)}
                        />
                      </td>
                    )}

                    <td data-label={mostrarCheckboxes ? "Periodo" : "Emisión"}>
                      {item.periodo || item.emision}
                    </td>
                    <td
                      data-label={mostrarCheckboxes ? "Fecha" : "Vencimiento"}
                    >
                      {item.fecha || item.vencimiento}
                    </td>
                    <td data-label={mostrarCheckboxes ? "Concepto" : "Detalle"}>
                      {item.concepto || item.detalle}
                    </td>
                    <td data-label={mostrarCheckboxes ? "Débito" : "Número"}>
                      {mostrarCheckboxes ? item.debito : item.numero}
                    </td>
                    <td
                      className="importe"
                      data-label={mostrarCheckboxes ? "Saldo" : "Importe"}
                    >
                      {item.saldo || item.importe}
                    </td>

                    {mostrarCheckboxes && (
                      <>
                        <td data-label="Plan">{item.plan || "-"}</td>
                        <td data-label="Apremio">{item.apremio || "-"}</td>
                      </>
                    )}

                    {!mostrarCheckboxes && (
                      <td className="acciones">
                        <button
                          className="btn-pagar"
                          onClick={() => handlePagarOnline(item)}
                        >
                          Pagar Online
                        </button>
                        <button
                          className="btn-pdf"
                          onClick={() => handleDescargarPDF(item)}
                        >
                          Descargar PDF
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mostrarCheckboxes && (
            <div className="total-seleccionado">
              <div className="total-header">
                <button
                  className="btn-seleccionar-todos"
                  onClick={handleSeleccionarTodos}
                >
                  {itemsSeleccionados.length === resultados.length
                    ? "Deseleccionar Todos"
                    : "Seleccionar Todos"}
                </button>
                <h3>
                  Total Seleccionado:{" "}
                  <span className="total-monto">
                    $
                    {calcularTotal().toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h3>
              </div>

              {itemsSeleccionados.length > 0 && (
                <div className="botones-seleccionados">
                  <button
                    className="btn-emitir-boleto"
                    onClick={handlerEmitirBoleto}
                  >
                    Emitir Boleto
                  </button>
                  <button
                    className="btn-pagar-seleccionados"
                    onClick={() =>
                      handlePagarOnline()
                    }
                  >
                    Pagar Seleccionados
                  </button>
                </div>
              )}
              {loading && <Loading />}
            </div>
          )}
        </>
      ) : (
        <div className="no-resultados">
          <p>No hay resultados para mostrar.</p>
        </div>
      )}
    </div>
  );
}

export default TablaResultados;
