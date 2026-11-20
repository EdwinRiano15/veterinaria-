// Requerimiento 11: aplicar el cupón VET20; conserva el descuento automático existente.
const MONTO_MINIMO_DESCUENTO = 80000;
const PORCENTAJE_DESCUENTO = 0.20;
const CODIGO_CUPON = "VET20";
let codigoDescuentoIntentado = "";
let codigoDescuentoAplicado = "";

function aplicarDescuento(subtotal) {
    if (codigoDescuentoAplicado === CODIGO_CUPON) {
        return Math.round(subtotal * PORCENTAJE_DESCUENTO);
    }
    if (codigoDescuentoIntentado) return 0;
    return subtotal > MONTO_MINIMO_DESCUENTO
        ? Math.round(subtotal * PORCENTAJE_DESCUENTO)
        : 0;
}

function renderizarDescuento(subtotal) {
    const mensaje = document.getElementById("descuento-mensaje");
    if (!mensaje) return;

    const porcentaje = Math.round(PORCENTAJE_DESCUENTO * 100);
    const descuentoActivo = aplicarDescuento(subtotal) > 0;
    mensaje.classList.toggle("activo", descuentoActivo);

    if (codigoDescuentoAplicado === CODIGO_CUPON) {
        mensaje.textContent = `Cupón ${CODIGO_CUPON} aplicado: ${porcentaje} % de descuento.`;
    } else if (codigoDescuentoIntentado) {
        mensaje.textContent = `El cupón no es válido. Prueba con ${CODIGO_CUPON}.`;
    } else if (subtotal > MONTO_MINIMO_DESCUENTO) {
        mensaje.textContent = `Descuento automático del ${porcentaje} % aplicado por superar $${MONTO_MINIMO_DESCUENTO.toLocaleString("es-CO")}.`;
    } else {
        mensaje.textContent = `Ingresa ${CODIGO_CUPON} para recibir ${porcentaje} % de descuento.`;
    }
}

function conectarCuponDescuento() {
    const entrada = document.getElementById("codigo-descuento");
    const boton = document.getElementById("btn-aplicar-descuento");
    if (!entrada || !boton) return;

    const aplicarCupon = () => {
        codigoDescuentoIntentado = entrada.value.trim().toUpperCase();
        codigoDescuentoAplicado = codigoDescuentoIntentado === CODIGO_CUPON
            ? CODIGO_CUPON
            : "";
        if (typeof renderizarCarrito === "function") renderizarCarrito();
        else renderizarDescuento(0);
    };

    boton.addEventListener("click", aplicarCupon);
    entrada.addEventListener("keydown", (evento) => {
        if (evento.key !== "Enter") return;
        evento.preventDefault();
        aplicarCupon();
    });
}

conectarCuponDescuento();
