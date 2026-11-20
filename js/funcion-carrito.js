const CLAVE_CARRITO = "veterinary-clinic-carrito";
let carrito = [];
let errorAlmacenamientoCarrito = "";

function normalizarProductosCarrito(productos) {
    if (!Array.isArray(productos)) {
        throw new Error("El contenido guardado del carrito no es válido.");
    }

    const productosValidos = productos.filter((item) =>
        item &&
        typeof item.productoId === "string" &&
        typeof item.nombre === "string" &&
        Number.isSafeInteger(item.precio) &&
        item.precio >= 0 &&
        Number.isSafeInteger(item.cantidad) &&
        item.cantidad > 0 &&
        Number.isSafeInteger(item.precio * item.cantidad)
    );
    if (productosValidos.length !== productos.length) {
        throw new Error("El carrito guardado contiene productos con datos inválidos.");
    }

    return productosValidos.map((item) => ({
        ...item,
        imagen: typeof item.imagen === "string" && item.imagen.startsWith("../images/")
            ? item.imagen
            : "",
        subtotal: item.precio * item.cantidad
    }));
}

function cargarCarritoGuardado() {
    try {
        const carritoGuardado = window.localStorage.getItem(CLAVE_CARRITO);
        if (!carritoGuardado) return [];

        return normalizarProductosCarrito(JSON.parse(carritoGuardado));
    } catch (error) {
        errorAlmacenamientoCarrito = "No se pudo leer el carrito guardado en este navegador.";
        console.error(errorAlmacenamientoCarrito, error);
        return [];
    }
}

function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
    }).format(valor);
}

function mostrarEstadoCarrito(mensaje) {
    const estado = document.getElementById("carrito-estado");
    if (estado) estado.textContent = mensaje;
}

function guardarYActualizarCarrito() {
    try {
        window.localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
        errorAlmacenamientoCarrito = "";
    } catch (error) {
        errorAlmacenamientoCarrito = "No se pudo guardar el carrito en este navegador.";
        console.error(errorAlmacenamientoCarrito, error);
    }

    renderizarCarrito();
}

function crearControlCantidad(item) {
    const control = document.createElement("div");
    control.className = "cart-quantity-control";

    const disminuir = document.createElement("button");
    disminuir.type = "button";
    disminuir.className = "cart-quantity-button";
    disminuir.dataset.action = "decrease";
    disminuir.dataset.productId = item.productoId;
    disminuir.setAttribute("aria-label", `Disminuir cantidad de ${item.nombre}`);
    disminuir.textContent = "−";

    const cantidad = document.createElement("input");
    cantidad.type = "number";
    cantidad.min = "1";
    cantidad.step = "1";
    cantidad.value = String(item.cantidad);
    cantidad.className = "cart-quantity-input";
    cantidad.dataset.productId = item.productoId;
    cantidad.setAttribute("aria-label", `Cantidad de ${item.nombre}`);

    const aumentar = document.createElement("button");
    aumentar.type = "button";
    aumentar.className = "cart-quantity-button";
    aumentar.dataset.action = "increase";
    aumentar.dataset.productId = item.productoId;
    aumentar.setAttribute("aria-label", `Aumentar cantidad de ${item.nombre}`);
    aumentar.textContent = "+";

    control.append(disminuir, cantidad, aumentar);
    return control;
}

function renderizarCarrito() {
    const lista = document.getElementById("carrito-items");
    const subtotalElemento = document.getElementById("carrito-subtotal");
    const cantidadElemento = document.getElementById("carrito-cantidad");
    if (!lista || !subtotalElemento || !cantidadElemento) return;

    lista.replaceChildren();
    const unidades = carrito.reduce((total, item) => total + item.cantidad, 0);
    const ciudad = document.getElementById("pedido-ciudad")?.value || "ibague";
    const domicilio = carrito.length > 0 ? calcularCostoDomicilio(ciudad) : 0;
    const subtotal = calcularResumenPedido(carrito).subtotal;
    const descuento = aplicarDescuento(subtotal);
    const resumen = calcularResumenPedido(carrito, domicilio, descuento);
    cantidadElemento.textContent = String(unidades);
    subtotalElemento.textContent = formatearMoneda(resumen.subtotal);

    const descuentoElemento = document.getElementById("carrito-descuento");
    const domicilioElemento = document.getElementById("carrito-domicilio");
    const totalElemento = document.getElementById("carrito-total");
    if (descuentoElemento) descuentoElemento.textContent = `−${formatearMoneda(resumen.descuento)}`;
    if (domicilioElemento) domicilioElemento.textContent = formatearMoneda(resumen.domicilio);
    if (totalElemento) totalElemento.textContent = formatearMoneda(resumen.total);
    renderizarDescuento(resumen.subtotal);

    const indicador = document.getElementById("carrito-indicador");
    const botonCarrito = document.getElementById("carrito-toggle");
    if (indicador) indicador.textContent = unidades > 99 ? "99+" : String(unidades);
    if (botonCarrito) botonCarrito.setAttribute(
        "aria-label",
        `Abrir carrito, ${unidades} ${unidades === 1 ? "producto" : "productos"}`
    );

    carrito.forEach((item) => {
        const fila = document.createElement("li");
        fila.className = "cart-item";

        if (item.imagen) {
            const imagen = document.createElement("img");
            imagen.className = "cart-item-image";
            imagen.src = item.imagen;
            imagen.alt = "";
            fila.append(imagen);
        }

        const informacion = document.createElement("div");
        informacion.className = "cart-item-info";

        const nombre = document.createElement("strong");
        nombre.textContent = item.nombre;

        const precio = document.createElement("span");
        precio.textContent = `${formatearMoneda(item.precio)} c/u`;
        informacion.append(nombre, precio);

        const controles = crearControlCantidad(item);
        const total = document.createElement("strong");
        total.className = "cart-item-subtotal";
        total.textContent = formatearMoneda(item.precio * item.cantidad);

        const eliminar = document.createElement("button");
        eliminar.type = "button";
        eliminar.className = "cart-remove-button";
        eliminar.dataset.action = "remove";
        eliminar.dataset.productId = item.productoId;
        eliminar.setAttribute("aria-label", `Eliminar ${item.nombre} del carrito`);
        eliminar.textContent = "Quitar";

        fila.append(informacion, controles, total, eliminar);
        lista.append(fila);
    });

    const vacio = document.getElementById("carrito-vacio");
    if (vacio) vacio.hidden = carrito.length > 0;
    lista.hidden = carrito.length === 0;

    const botonValidarPedido = document.getElementById("btn-validar-pedido");
    if (botonValidarPedido) botonValidarPedido.disabled = carrito.length === 0;
    const botonWhatsapp = document.getElementById("btn-whatsapp-carrito");
    if (botonWhatsapp) botonWhatsapp.disabled = carrito.length === 0;

    if (errorAlmacenamientoCarrito) {
        mostrarEstadoCarrito(errorAlmacenamientoCarrito);
    } else if (carrito.length === 0) {
        mostrarEstadoCarrito("Tu carrito está vacío.");
    } else {
        mostrarEstadoCarrito("Los productos de tu carrito se guardan en este navegador.");
    }

    if (typeof actualizarDisponibilidadProductosEnPagina === "function") {
        actualizarDisponibilidadProductosEnPagina();
    }
}

function agregarAlCarrito(productoId, nombre, precio, imagen) {
    if (typeof productoId !== "string" || !productoId || typeof nombre !== "string" ||
        !Number.isFinite(precio) || precio < 0) {
        console.error("No se pudo agregar el producto: sus datos no son válidos.");
        mostrarEstadoCarrito("No se pudo agregar el producto. Verifica sus datos.");
        return;
    }

    const itemExistente = carrito.find((item) => item.productoId === productoId);
    const datosStock = window.datosProductos?.find((producto) => producto.id === productoId);
    if (datosStock && (itemExistente?.cantidad || 0) >= datosStock.stock) {
        mostrarEstadoCarrito(`No hay más unidades disponibles de ${nombre}.`);
        actualizarDisponibilidadProductosEnPagina();
        return;
    }

    if (itemExistente) {
        itemExistente.cantidad += 1;
        itemExistente.subtotal = itemExistente.precio * itemExistente.cantidad;
        if (!itemExistente.imagen && imagen) itemExistente.imagen = imagen;
    } else {
        carrito.push({
            productoId,
            nombre,
            precio,
            imagen,
            cantidad: 1,
            subtotal: precio
        });
    }

    guardarYActualizarCarrito();
}

function obtenerIdentificadorProducto(producto, nombre, precio) {
    const normalizar = (texto) => texto
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const imagen = producto.querySelector("img");
    const origenImagen = imagen ? imagen.getAttribute("src") || "" : "";
    return `producto-${normalizar(nombre)}-${precio}-${normalizar(origenImagen)}`;
}

function conectarProductosConCarrito() {
    const selectores = ".product-card, #content .producto";
    let imagenesActualizadas = false;

    document.querySelectorAll(selectores).forEach((producto) => {
        const nombreElemento = producto.querySelector("h4, h2");
        const precioElemento = producto.querySelector(".price, .precio");
        const boton = producto.querySelector(".btn-cart, .btn-carrito");
        if (!nombreElemento || !precioElemento || !boton) return;

        const nombre = nombreElemento.textContent.trim();
        const precio = Number(precioElemento.textContent.replace(/[^\d]/g, ""));
        if (!nombre || !Number.isFinite(precio)) {
            boton.disabled = true;
            console.error("No se pudo activar el botón de un producto con datos incompletos.", producto);
            return;
        }

    const productoId = producto.dataset.id || producto.dataset.productId ||
            obtenerIdentificadorProducto(producto, nombre, precio);
        const imagen = producto.querySelector("img")?.getAttribute("src") || "";
        producto.dataset.productId = productoId;
        const productoEnCarrito = carrito.find((item) => item.productoId === productoId);
        if (productoEnCarrito && !productoEnCarrito.imagen && imagen.startsWith("../images/")) {
            productoEnCarrito.imagen = imagen;
            imagenesActualizadas = true;
        }
        boton.type = "button";
        boton.addEventListener("click", () => agregarAlCarrito(productoId, nombre, precio, imagen));
    });

    if (imagenesActualizadas) guardarYActualizarCarrito();
}

function conectarControlesCarrito() {
    const lista = document.getElementById("carrito-items");
    if (!lista) return;

    lista.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-action]");
        if (!boton || !lista.contains(boton)) return;

        const productoId = boton.dataset.productId;
        const item = carrito.find((producto) => producto.productoId === productoId);
        if (!item) return;

        if (boton.dataset.action === "remove") {
            eliminarDelCarrito(productoId);
        } else if (boton.dataset.action === "increase") {
            modificarCantidad(productoId, item.cantidad + 1);
        } else if (boton.dataset.action === "decrease") {
            modificarCantidad(productoId, item.cantidad - 1);
        }
    });

    lista.addEventListener("change", (evento) => {
        const entrada = evento.target.closest("input[data-product-id]");
        if (!entrada || !lista.contains(entrada)) return;
        modificarCantidad(entrada.dataset.productId, Number(entrada.value));
    });
}

function conectarFormularioPedido() {
    const formulario = document.getElementById("formulario-pedido");
    const estado = document.getElementById("pedido-estado");
    if (!formulario || !estado) return;

    formulario.addEventListener("input", () => {
        formulario.querySelectorAll("input, textarea").forEach((campo) => campo.setCustomValidity(""));
        estado.textContent = "";
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        if (!validarDatosCliente(formulario)) return;

        const campoInvalido = formulario.querySelector(":invalid");
        if (campoInvalido) {
            const detalles = campoInvalido.closest("details");
            if (detalles) detalles.open = true;
            campoInvalido.reportValidity();
            return;
        }
        if (carrito.length === 0) {
            estado.textContent = "Agrega al menos un producto antes de comprar.";
            return;
        }

        const ciudad = document.getElementById("pedido-ciudad");
        const subtotal = calcularResumenPedido(carrito).subtotal;
        const descuento = aplicarDescuento(subtotal);
        const domicilio = calcularCostoDomicilio(ciudad?.value || "ibague");
        const resumen = calcularResumenPedido(carrito, domicilio, descuento);
        const compra = {
            ...resumen,
            id: `pedido-${Date.now()}`,
            fecha: new Date().toISOString(),
            ciudad: ciudad?.selectedOptions[0]?.textContent || "Ibagué",
            productos: carrito.map((item) => ({ ...item }))
        };

        if (!guardarPedidoEnHistorial(compra)) {
            estado.textContent = "No se pudo guardar la compra. El carrito sigue intacto; intenta de nuevo.";
            return;
        }

        carrito = [];
        guardarYActualizarCarrito();
        estado.textContent = "Compra guardada en el historial.";
        document.querySelector('[data-cart-tab="historial"]')?.click();
    });
}

function conectarPanelCarrito() {
    const panel = document.getElementById("carrito");
    const botonesAbrir = [...document.querySelectorAll("#carrito-toggle, #pedidos-toggle")];
    const botonCerrar = document.getElementById("carrito-cerrar");
    if (!panel || botonesAbrir.length === 0 || !botonCerrar) return;

    let ultimoBotonAbrir = botonesAbrir[0];

    const actualizarEstadoPanel = () => {
        botonesAbrir.forEach((boton) => boton.setAttribute("aria-expanded", String(panel.open)));
    };

    const cerrarPanel = () => {
        if (panel.open) panel.close();
        actualizarEstadoPanel();
        ultimoBotonAbrir.focus();
    };

    botonesAbrir.forEach((boton) => boton.addEventListener("click", () => {
        ultimoBotonAbrir = boton;
        const vista = boton.id === "pedidos-toggle" ? "historial" : "pedido";
        const pestana = panel.querySelector(`[data-cart-tab="${vista}"]`);
        const vistaActual = panel.querySelector("[data-cart-tab].activo")?.dataset.cartTab;
        if (panel.open && vistaActual === vista) return cerrarPanel();

        pestana?.click();
        if (!panel.open) panel.showModal();
        actualizarEstadoPanel();
        botonCerrar.focus();
    }));

    botonCerrar.addEventListener("click", cerrarPanel);
    panel.addEventListener("close", () => {
        actualizarEstadoPanel();
        ultimoBotonAbrir.focus();
    });
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && panel.open) {
            evento.preventDefault();
            cerrarPanel();
        }
    });
    panel.addEventListener("click", (evento) => {
        if (evento.target !== panel) return;
        const limites = panel.getBoundingClientRect();
        if (
            evento.clientX < limites.left ||
            evento.clientX > limites.right ||
            evento.clientY < limites.top ||
            evento.clientY > limites.bottom
        ) {
            cerrarPanel();
        }
    });
}

carrito = cargarCarritoGuardado();
conectarProductosConCarrito();
conectarControlesCarrito();
renderizarCarrito();
conectarFormularioPedido();
conectarPanelCarrito();

window.addEventListener("storage", (evento) => {
    if (evento.key !== CLAVE_CARRITO) return;
    try {
        const productosGuardados = evento.newValue ? JSON.parse(evento.newValue) : [];
        carrito = normalizarProductosCarrito(productosGuardados);
        errorAlmacenamientoCarrito = "";
        renderizarCarrito();
    } catch (error) {
        errorAlmacenamientoCarrito = "No se pudo sincronizar el carrito entre pestañas.";
        console.error(errorAlmacenamientoCarrito, error);
        renderizarCarrito();
    }
});
