// Requerimiento 13: Calcular total
// Total = subtotal - descuento + domicilio (nunca menor que 0).
function calcularTotal(subtotal, descuento = 0, domicilio = 0) {
    return Math.max(0, subtotal - descuento + domicilio);
}
