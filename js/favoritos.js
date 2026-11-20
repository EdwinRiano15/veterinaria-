// Requerimiento 15: Favoritos
// Cada tarjeta de producto recibe un corazón. Los favoritos se guardan en
// LocalStorage y se ven en la pestaña "Favoritos" del panel de pedidos.
// Debe cargarse DESPUÉS de funcion-carrito.js.
const CLAVE_FAVORITOS = "veterinary-clinic-favoritos";
let favoritos = cargarFavoritosGuardados();

function cargarFavoritosGuardados() {
    try {
        const guardados = JSON.parse(window.localStorage.getItem(CLAVE_FAVORITOS) || "[]");
        if (!Array.isArray(guardados)) return [];

        return guardados.filter((item) =>
            item &&
            typeof item.productoId === "string" &&
            typeof item.nombre === "string" &&
            Number.isSafeInteger(item.precio) &&
            item.precio >= 0
        ).map((item) => ({
            productoId: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            imagen: typeof item.imagen === "string" && item.imagen.startsWith("../images/")
                ? item.imagen
                : ""
        }));
    } catch (error) {
        console.error("No se pudo leer la lista de favoritos de este navegador.", error);
        return [];
    }
}

function guardarFavoritos() {
    try {
        window.localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
    } catch (error) {
        console.error("No se pudo guardar la lista de favoritos en este navegador.", error);
    }
}

function esFavorito(productoId) {
    return favoritos.some((item) => item.productoId === productoId);
}

// Agrega el producto a favoritos o lo quita si ya estaba.
function alternarFavorito(producto) {
    if (esFavorito(producto.productoId)) {
        favoritos = favoritos.filter((item) => item.productoId !== producto.productoId);
    } else {
        favoritos.push(producto);
    }

    guardarFavoritos();
    actualizarCorazones();
    renderizarFavoritos();
}

function leerProductoDeTarjeta(tarjeta) {
    const nombre = tarjeta.querySelector("h4, h2").textContent.trim();
    const precio = Number(tarjeta.querySelector(".price, .precio").textContent.replace(/[^\d]/g, ""));
    const imagen = tarjeta.querySelector("img")?.getAttribute("src") || "";
    const productoId = tarjeta.dataset.id || tarjeta.dataset.productId ||
        obtenerIdentificadorProducto(tarjeta, nombre, precio);

    return {
        productoId,
        nombre,
        precio,
        imagen: imagen.startsWith("../images/") ? imagen : ""
    };
}

function conectarFavoritos() {
    document.querySelectorAll(".product-card, #content .producto").forEach((tarjeta) => {
        if (tarjeta.querySelector(".btn-favorito")) return;
        if (!tarjeta.querySelector("h4, h2") || !tarjeta.querySelector(".price, .precio")) return;

        const producto = leerProductoDeTarjeta(tarjeta);
        const corazon = document.createElement("button");
        corazon.type = "button";
        corazon.className = "btn-favorito";
        corazon.dataset.productId = producto.productoId;
        corazon.setAttribute("aria-label", `Guardar ${producto.nombre} en favoritos`);
        corazon.addEventListener("click", () => alternarFavorito(leerProductoDeTarjeta(tarjeta)));
        tarjeta.append(corazon);
    });

    actualizarCorazones();
}

function actualizarCorazones() {
    document.querySelectorAll(".btn-favorito").forEach((corazon) => {
        const activo = esFavorito(corazon.dataset.productId);
        corazon.classList.toggle("activo", activo);
        corazon.setAttribute("aria-pressed", String(activo));
    });
}

function renderizarFavoritos() {
    const lista = document.getElementById("favoritos-lista");
    const vacio = document.getElementById("favoritos-vacio");
    const cantidad = document.getElementById("favoritos-cantidad");
    if (!lista || !vacio || !cantidad) return;

    lista.replaceChildren();
    cantidad.textContent = String(favoritos.length);
    vacio.hidden = favoritos.length > 0;

    favoritos.forEach((item) => {
        const fila = document.createElement("li");
        fila.className = "fav-item";

        if (item.imagen) {
            const imagen = document.createElement("img");
            imagen.className = "cart-item-image";
            imagen.src = item.imagen;
            imagen.alt = "";
            fila.append(imagen);
        }

        const info = document.createElement("div");
        info.className = "fav-item-info";
        const nombre = document.createElement("strong");
        nombre.textContent = item.nombre;
        const precio = document.createElement("span");
        precio.textContent = formatearMoneda(item.precio);
        info.append(nombre, precio);

        const agregar = document.createElement("button");
        agregar.type = "button";
        agregar.className = "cart-extra-boton";
        agregar.dataset.favAccion = "agregar";
        agregar.dataset.productId = item.productoId;
        agregar.textContent = "Al carrito";

        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "cart-remove-button";
        quitar.dataset.favAccion = "quitar";
        quitar.dataset.productId = item.productoId;
        quitar.setAttribute("aria-label", `Quitar ${item.nombre} de favoritos`);
        quitar.textContent = "Quitar";

        const acciones = document.createElement("div");
        acciones.className = "fav-item-acciones";
        acciones.append(agregar, quitar);

        fila.append(info, acciones);
        lista.append(fila);
    });
}

function conectarListaFavoritos() {
    const lista = document.getElementById("favoritos-lista");
    if (!lista) return;

    lista.addEventListener("click", (evento) => {
        const boton = evento.target.closest("button[data-fav-accion]");
        if (!boton) return;

        const item = favoritos.find((favorito) => favorito.productoId === boton.dataset.productId);
        if (!item) return;

        if (boton.dataset.favAccion === "agregar") {
            agregarAlCarrito(item.productoId, item.nombre, item.precio, item.imagen);
        } else {
            alternarFavorito(item);
        }
    });
}

conectarFavoritos();
conectarListaFavoritos();
renderizarFavoritos();
