// Permite comparar dos productos por nombre, precio y stock de prueba.
const productosSeleccionados = [];

function conectarComparador() {
    document.querySelectorAll(".product-card[data-id], #content .producto[data-id]").forEach((tarjeta) => {
        const producto = window.datosProductos.find((dato) => dato.id === tarjeta.dataset.id);
        if (!producto || tarjeta.querySelector(".btn-comparar")) return;

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-comparar";
        boton.textContent = "Comparar";
        boton.setAttribute("aria-pressed", "false");

        boton.addEventListener("click", () => {
            if (productosSeleccionados.length >= 2) return;

            productosSeleccionados.push(producto);
            boton.disabled = true;
            boton.setAttribute("aria-pressed", "true");
            boton.textContent = "Seleccionado";

            if (productosSeleccionados.length === 2) {
                const [primero, segundo] = productosSeleccionados;
                window.alert(
                    `${primero.nombre}: $${primero.precio.toLocaleString("es-CO")}, stock ${primero.stock}\n` +
                    `${segundo.nombre}: $${segundo.precio.toLocaleString("es-CO")}, stock ${segundo.stock}`
                );
                productosSeleccionados.length = 0;
                document.querySelectorAll(".btn-comparar").forEach((botonComparar) => {
                    botonComparar.disabled = false;
                    botonComparar.setAttribute("aria-pressed", "false");
                    botonComparar.textContent = "Comparar";
                });
            }
        });

        tarjeta.append(boton);
    });
}

conectarComparador();
