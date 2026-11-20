// Requerimiento 10: Calcular subtotal
// El total se calcula con calcularTotal() (calcular-total.js).
function calcularResumenPedido(carritoItems, domicilio = 0, descuento = 0) {
    const subtotalGeneral = carritoItems.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    );

    const pedido = {
        id: `pedido-${Date.now()}`,
        fecha: new Date().toISOString(),
        productos: carritoItems,
        subtotal: subtotalGeneral,
        descuento: descuento,
        domicilio: domicilio,
        total: calcularTotal(subtotalGeneral, descuento, domicilio)
    };

    return pedido;
}
