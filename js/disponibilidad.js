// Muestra el stock de prueba y evita agregar más unidades que las disponibles.
function actualizarDisponibilidadProductosEnPagina() {
    document.querySelectorAll(".product-card[data-id], #content .producto[data-id]").forEach((tarjeta) => {
        const producto = window.datosProductos.find((dato) => dato.id === tarjeta.dataset.id);
        if (!producto) return;

        const estado = tarjeta.querySelector(".estado-stock");
        const boton = tarjeta.querySelector(".btn-carrito, .btn-cart");
        if (!estado || !boton) return;

        const enCarrito = typeof carrito === "undefined"
            ? 0
            : carrito.find((item) => item.productoId === producto.id)?.cantidad || 0;
        const disponible = Math.max(0, producto.stock - enCarrito);
        estado.className = disponible > 0
            ? "estado-stock disponible"
            : "estado-stock agotado";
        estado.textContent = disponible > 0
            ? `Disponible: ${disponible}`
            : producto.stock === 0 ? "Agotado" : "Todo el stock está en tu carrito";

        boton.disabled = disponible === 0;
        boton.textContent = disponible === 0
            ? producto.stock === 0 ? "Agotado" : "Máximo en carrito"
            : boton.dataset.textoOriginal || "Añadir al carrito";
    });
}

function conectarDisponibilidad() {
    document.querySelectorAll(".product-card[data-id], #content .producto[data-id]").forEach((tarjeta) => {
        const producto = window.datosProductos.find((dato) => dato.id === tarjeta.dataset.id);
        const titulo = tarjeta.querySelector("h2, h4");
        const boton = tarjeta.querySelector(".btn-carrito, .btn-cart");
        if (!producto || !titulo || !boton || tarjeta.querySelector(".estado-stock")) return;

        const estado = document.createElement("p");
        estado.className = "estado-stock";
        titulo.after(estado);
        boton.dataset.textoOriginal = boton.textContent.trim();
    });

    actualizarDisponibilidadProductosEnPagina();
}

conectarDisponibilidad();
