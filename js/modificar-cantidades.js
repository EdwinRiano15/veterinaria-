 // Requerimiento 9: Modificar cantidades
function modificarCantidad(productoId, nuevaCantidad) {
    const cantidad = Number(nuevaCantidad);
    if (!Number.isSafeInteger(cantidad)) {
        mostrarEstadoCarrito("La cantidad debe ser un número entero válido.");
        return;
    }

    const item = carrito.find((producto) => producto.productoId === productoId);
    if (!item) return;

    if (cantidad <= 0) {
        eliminarDelCarrito(productoId);
        return;
    }

    const datosStock = window.datosProductos?.find((producto) => producto.id === productoId);
    if (datosStock && cantidad > item.cantidad && cantidad > datosStock.stock) {
        mostrarEstadoCarrito(`Solo hay ${datosStock.stock} unidades disponibles de ${item.nombre}.`);
        return;
    }

    item.cantidad = cantidad;
    item.subtotal = item.precio * cantidad;
    guardarYActualizarCarrito();
}
