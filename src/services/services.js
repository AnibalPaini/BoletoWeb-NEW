import axios from "axios";

// Descarga el PDF y maneja la sesión de calentamiento
export const descargarPDF = async (serializedId, concepto, boletoBPStr) => {
  try {
    // La llamada al API que devuelve el PDF binario
    const res = await axios.post(
      "http://localhost:8080/api/pdf",
      {
        serializedId,
        concepto,
        boletoBPStr,
      },
      {
        responseType: "blob",
      }
    );

    const pdfBlob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdfBlob);

    // Crear un enlace temporal (<a>) para forzar la descarga
    const a = document.createElement("a");
    a.href = url;
    a.download = "boleto_deuda_seleccionada.pdf";
    document.body.appendChild(a);
    a.click();

    // Limpieza
    a.remove();
    window.URL.revokeObjectURL(url);
    console.log("PDF descargado con éxito.");
  } catch (error) {
    // Mejor manejo de errores para mostrar el detalle del backend
    const errorDetail =
      error.response && error.response.data
        ? JSON.parse(await error.response.data.text()).error
        : "No se pudo conectar con el servidor.";

    console.error("Error en la descarga de PDF:", errorDetail);
    alert(`No se pudo descargar el PDF. Detalle: ${errorDetail}`);
  }
};

export const pagarBoleto = async ({ serializedId, concepto, boletoBPStr }) => {
  const API_URL = "http://localhost:8080/api/pagar";

  try {
    const res = await axios.post(
      API_URL,
      {
        boletoSerializedId: serializedId,
        concepto: concepto || 1,
        boletoBPStr,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { redirectUrl, fields } = res.data;

    if (!redirectUrl || !fields) {
      alert("No se pudo obtener la información de E-Pagos.");
      return;
    }

    // 🧾 Crear formulario temporal y enviarlo
    const form = document.createElement("form");
    form.method = "POST";
    form.action = redirectUrl;
    form.target = "_blank"; // abre en nueva pestaña

    for (const [key, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    form.remove();

    console.log("✅ Redirigido a E-Pagos");
  } catch (error) {
    console.error("❌ Error al procesar el pago:", error.message);
    alert("Error al intentar pagar. Revisá la consola.");
  }
};
