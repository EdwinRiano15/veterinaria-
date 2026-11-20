// Requerimiento 20: preparar un mensaje de WhatsApp con el carrito actual.
function crearMensajeCarritoWhatsApp() {
    if (carrito.length === 0) return "";

    const ciudadSelect = document.getElementById("pedido-ciudad");
    const ciudad = ciudadSelect?.value || "ibague";
    const nombreCiudad = ciudadSelect?.selectedOptions[0]?.textContent || "Ibagué";
    const subtotal = calcularResumenPedido(carrito).subtotal;
    const descuento = aplicarDescuento(subtotal);
    const domicilio = calcularCostoDomicilio(ciudad);
    const total = calcularTotal(subtotal, descuento, domicilio);
    const productos = carrito.map((item) =>
        `• ${item.cantidad} × ${item.nombre} (${formatearMoneda(item.precio * item.cantidad)})`
    );

    return [
        "Hola, quiero hacer este pedido:",
        ...productos,
        "",
        `Subtotal: ${formatearMoneda(subtotal)}`,
        `Descuento: −${formatearMoneda(descuento)}`,
        `Domicilio estimado a ${nombreCiudad}: ${formatearMoneda(domicilio)}`,
        calcularDomicilio(ciudad),
        `Total: ${formatearMoneda(total)}`
    ].join("\n");
}

function abrirWhatsAppConCarrito() {
    const mensaje = crearMensajeCarritoWhatsApp();
    if (!mensaje) return;

    const enlace = document.createElement("a");
    enlace.href = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
}

document.getElementById("btn-whatsapp-carrito")?.addEventListener("click", abrirWhatsAppConCarrito);
