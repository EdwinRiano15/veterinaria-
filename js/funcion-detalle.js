 // Requerimiento 6: Detalle del producto (Ver más / Ver menos)
function toggleDetalle(idProducto) {
    const elementoDetalle = document.getElementById(`detalle-${idProducto}`);
    const boton = document.getElementById(`btn-${idProducto}`);

    if (!elementoDetalle || !boton) return;

    elementoDetalle.hidden = !elementoDetalle.hidden;
    boton.innerText = elementoDetalle.hidden ? "Ver detalles" : "Ocultar detalles";
    boton.setAttribute("aria-expanded", String(!elementoDetalle.hidden));
}

function inicializarDetallesProductos() {
    const tarjetas = document.querySelectorAll(".product-card, #content .producto");

    tarjetas.forEach((tarjeta, indice) => {
        if (tarjeta.querySelector(".detalle-producto")) return;

        const nombre = tarjeta.querySelector("h4, h2");
        const precio = tarjeta.querySelector(".price, .precio");
        const descripcionCorta = tarjeta.querySelector(".subtext");
        const imagen = tarjeta.querySelector("img");
        const descripcion = tarjeta.dataset.details ||
            (descripcionCorta && descripcionCorta.textContent.trim()) ||
            (imagen && imagen.alt.trim()) ||
            "Consulta el empaque para conocer más información del producto.";
        const idProducto = `producto-${indice}`;

        const boton = document.createElement("button");
        boton.id = `btn-${idProducto}`;
        boton.className = "btn-ver-mas";
        boton.type = "button";
        boton.textContent = "Ver detalles";
        boton.setAttribute("aria-expanded", "false");
        boton.setAttribute("aria-controls", `detalle-${idProducto}`);
        boton.addEventListener("click", () => toggleDetalle(idProducto));

        const detalle = document.createElement("div");
        detalle.id = `detalle-${idProducto}`;
        detalle.className = "detalle-producto";
        detalle.hidden = true;

        const descripcionDetalle = document.createElement("p");
        const etiquetaDescripcion = document.createElement("strong");
        etiquetaDescripcion.textContent = "Descripción: ";
        descripcionDetalle.append(etiquetaDescripcion, document.createTextNode(descripcion));
        detalle.append(descripcionDetalle);

        if (tarjeta.dataset.category) {
            const categoria = document.createElement("p");
            const etiquetaCategoria = document.createElement("strong");
            etiquetaCategoria.textContent = "Categoría: ";
            categoria.append(
                etiquetaCategoria,
                document.createTextNode(tarjeta.dataset.category === "alimento" ? "Alimento" : "Accesorio")
            );
            detalle.append(categoria);
        }

        if (precio) {
            const precioDetalle = document.createElement("p");
            const etiquetaPrecio = document.createElement("strong");
            etiquetaPrecio.textContent = "Precio: ";
            precioDetalle.append(etiquetaPrecio, document.createTextNode(precio.textContent.trim()));
            detalle.append(precioDetalle);
        }

        const botonCarrito = tarjeta.querySelector(".btn-cart, .btn-carrito");
        if (!nombre || !botonCarrito) return;

        tarjeta.insertBefore(boton, botonCarrito);
        tarjeta.insertBefore(detalle, botonCarrito);
    });
}

inicializarDetallesProductos();