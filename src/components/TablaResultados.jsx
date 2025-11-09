import { useLocation, useNavigate } from "react-router-dom";

function TablaResultados() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultados = location.state?.resultados || [];

  const handlePagarOnline = (item) => {
    console.log("Pagar online:", item);
    // Aquí irá la lógica de pago
  };

  const handleDescargarPDF = (item) => {
    console.log("Descargar PDF:", item);
    // Aquí irá la lógica de descarga
  };

  const handleVolver = () => {
    navigate("/");
  };

  return (
    <div className="tabla-container">
      <h2 className="tabla-title">Resultados de Deuda</h2>

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
                    <td>{item.emision}</td>
                    <td>{item.vencimiento}</td>
                    <td>{item.detalle}</td>
                    <td>{item.numero}</td>
                    <td className="importe">{item.importe}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn-volver" onClick={handleVolver}>
            Volver al Formulario
          </button>
        </>
      ) : (
        <div className="no-resultados">
          <p>No hay resultados para mostrar.</p>
          <button className="btn-volver" onClick={handleVolver}>
            Volver al Formulario
          </button>
        </div>
      )}
    </div>
  );
}

export default TablaResultados;
