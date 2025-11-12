import React from "react";
import { descargarPDF, pagarBoleto } from "../services/services";
import { useLocation, useNavigate } from "react-router-dom";

const TablaEmitirBoleto = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultados = location.state?.resultados || [];
  const handleVolver = () => navigate("/resultados");
  const serializedId = location.state?.resultados[0]?.serializedId || null;

  const handlePagarOnline = async(resultados) => {
    console.log(resultados.serializedId);
    
    await pagarBoleto({ serializedId: resultados.serializedId });
  };
  const handleDescargarPDF = async (serializedId) => {
    await descargarPDF(serializedId);
  };

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

      <h2 className="tabla-title">Boleto</h2>

      {resultados.length > 0 ? (
        <>
          <div className="tabla-wrapper">
            <table className="tabla-resultados">
              <thead>
                <tr>
                  <th>Emisión</th>
                  <th>Vencimiento</th>
                  <th>Detalle</th>
                  <th>Número</th>
                  <th>Importe</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {resultados.map((item, index) => (
                  <tr key={index}>
                    <td data-label={"Periodo"}>
                      {item.periodo || item.emision}
                    </td>
                    <td data-label={"Fecha"}>
                      {item.fecha || item.vencimiento}
                    </td>
                    <td data-label={"Detalle"}>
                      {item.concepto || item.detalle}
                    </td>
                    <td data-label={"Número"}>{item.numero}</td>
                    <td className="importe" data-label={"Importe"}>
                      {item.saldo || item.importe}
                    </td>
                    <td>
                      <button
                        className="btn-pagar"
                        onClick={() => handlePagarOnline(item)}
                      >
                        Pagar Online
                      </button>
                      <button
                        className="btn-pdf"
                        onClick={() => handleDescargarPDF(serializedId)}
                      >
                        Descargar PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="no-resultados">
          <p>No hay resultados para mostrar.</p>
        </div>
      )}
    </div>
  );
};

export default TablaEmitirBoleto;
