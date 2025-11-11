import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function TablaResultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultados = location.state?.resultados || [];
  const tipoEmision = location.state?.tipoEmision || "total";
  const sector = location.state?.sector || "";
  const referencia = location.state?.referencia || "";
  const fecha = location.state?.fecha || "";

  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

  const handlePagarOnline = (item) => {
    console.log("🪙 Pagar online:", item, location.state);
  };

  const handleDescargarPDF = (item) => {
    console.log("📄 Descargar PDF:", item);
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
                    onClick={() =>
                      console.log("🎫 Emitir boleto:", itemsSeleccionados)
                    }
                  >
                    Emitir Boleto
                  </button>
                  <button
                    className="btn-pagar-seleccionados"
                    onClick={() =>
                      console.log("💳 Pagar seleccionados:", itemsSeleccionados)
                    }
                  >
                    Pagar Seleccionados
                  </button>
                </div>
              )}
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
