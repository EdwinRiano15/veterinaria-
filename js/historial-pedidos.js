// Requerimiento 19: guardar compras de prueba en el historial local del navegador.
const CLAVE_HISTORIAL_PEDIDOS = "veterinary-clinic-historial-pedidos";
let historialPedidos = cargarHistorialPedidos();

function cargarHistorialPedidos() {
    try {
        const guardados = JSON.parse(window.localStorage.getItem(CLAVE_HISTORIAL_PEDIDOS) || "[]");
        if (!Array.isArray(guardados)) return [];

        return guardados.filter((pedido) =>
            pedido &&
            typeof pedido.id === "string" &&
            typeof pedido.fecha === "string" &&
            typeof pedido.ciudad === "string" &&
            Array.isArray(pedido.productos) &&
            Number.isFinite(pedido.subtotal) &&
            Number.isFinite(pedido.descuento) &&
            Number.isFinite(pedido.domicilio) &&
            Number.isFinite(pedido.total)
        );
    } catch (error) {
        console.error("No se pudo leer el historial de pedidos.", error);
        return [];
    }
}

function guardarPedidoEnHistorial(pedido) {
    const nuevoHistorial = [pedido, ...historialPedidos].slice(0, 50);

    try {
        window.localStorage.setItem(CLAVE_HISTORIAL_PEDIDOS, JSON.stringify(nuevoHistorial));
        historialPedidos = nuevoHistorial;
        renderizarHistorialPedidos();
        return true;
    } catch (error) {
        console.error("No se pudo guardar la compra en el historial.", error);
        return false;
    }
}

function crearFilaTotalPedido(etiqueta, valor, clase = "") {
    const fila = document.createElement("p");
    if (clase) fila.className = clase;

    const nombre = document.createElement("span");
    nombre.textContent = etiqueta;
    const monto = document.createElement("strong");
    monto.textContent = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
    fila.append(nombre, monto);
    return fila;
}

function renderizarHistorialPedidos() {
    const lista = document.getElementById("historial-lista");
    const vacio = document.getElementById("historial-vacio");
    const contador = document.getElementById("historial-cantidad");
    if (!lista || !vacio || !contador) return;

    lista.replaceChildren();
    contador.textContent = String(historialPedidos.length);
    vacio.hidden = historialPedidos.length > 0;

    const indicadorPedidos = document.getElementById("pedidos-indicador");
    const botonPedidos = document.getElementById("pedidos-toggle");
    if (indicadorPedidos) indicadorPedidos.textContent = historialPedidos.length > 99 ? "99+" : String(historialPedidos.length);
    if (botonPedidos) botonPedidos.setAttribute(
        "aria-label",
        `Abrir historial, ${historialPedidos.length} ${historialPedidos.length === 1 ? "compra" : "compras"}`
    );

    historialPedidos.forEach((pedido) => {
        const tarjeta = document.createElement("li");
        tarjeta.className = "clinic-order-card";

        const encabezado = document.createElement("div");
        encabezado.className = "clinic-order-header";
        const titulo = document.createElement("strong");
        titulo.textContent = `Compra ${pedido.id}`;
        const fecha = document.createElement("time");
        fecha.dateTime = pedido.fecha;
        const fechaValida = new Date(pedido.fecha);
        fecha.textContent = Number.isNaN(fechaValida.getTime())
            ? "Fecha no disponible"
            : fechaValida.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
        encabezado.append(titulo, fecha);

        const productos = document.createElement("ul");
        productos.className = "clinic-order-products";
        pedido.productos.forEach((producto) => {
            const linea = document.createElement("li");
            linea.textContent = `${producto.cantidad} × ${producto.nombre}`;
            productos.append(linea);
        });

        const entrega = document.createElement("p");
        entrega.className = "clinic-order-delivery";
        entrega.textContent = `Entrega estimada en ${pedido.ciudad}`;

        const resumen = document.createElement("div");
        resumen.className = "clinic-order-summary";
        resumen.append(
            crearFilaTotalPedido("Subtotal", pedido.subtotal),
            crearFilaTotalPedido("Descuento", -pedido.descuento),
            crearFilaTotalPedido("Domicilio", pedido.domicilio),
            crearFilaTotalPedido("Total", pedido.total, "clinic-order-total")
        );

        tarjeta.append(encabezado, productos, entrega, resumen);
        lista.append(tarjeta);
    });
}

window.addEventListener("storage", (evento) => {
    if (evento.key !== CLAVE_HISTORIAL_PEDIDOS) return;
    historialPedidos = cargarHistorialPedidos();
    renderizarHistorialPedidos();
});

renderizarHistorialPedidos();
