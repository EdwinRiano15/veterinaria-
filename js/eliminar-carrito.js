 // Requerimiento 8: Eliminar del carrito
function eliminarDelCarrito(productoId) {
    const carritoActualizado = carrito.filter((item) => item.productoId !== productoId);
    if (carritoActualizado.length === carrito.length) return;

    carrito = carritoActualizado;
    guardarYActualizarCarrito();
}