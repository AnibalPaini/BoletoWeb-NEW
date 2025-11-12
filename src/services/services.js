import axios from "axios";

export const descargarPDF = async (serializedId) => {
  try {
    // La llamada al API que devuelve el PDF binario
    const res = await axios.post(
      "http://localhost:8080/api/pdf",
      { serializedId },
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
  } catch {
    alert("No se pudo descargar el PDF. Vuelve a intentarlo más tarde.");
  }
};

export const pagarBoleto = async ({ serializedId }) => {
  const API_URL = "http://localhost:8080/api/pagar";
  console.log(`Iniciando solicitud de pago para ID de boleto: ${serializedId}`);

  try {
    const formData = new URLSearchParams({
      boletoSerializedId: serializedId,
      concepto: 1,
      boletoBPStr: "BoletoWebSessionFactory",
      action: "EPagosPagoSolicitud",
    }).toString();

    const res = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { redirectUrl } = res.data;

    if (redirectUrl) {
      console.log(`🔗 Redirigiendo a E-Pagos: ${redirectUrl}`);
      window.open(redirectUrl, "_blank");
    } else {
      console.error("⚠️ No se encontró el link de E-Pagos.");
      alert("No se pudo obtener la URL de pago.");
    }
  } catch (error) {
    console.error("❌ Error al procesar el pago:", error.message);
    alert("Error al intentar pagar. Revisa la consola.");
  }
};
