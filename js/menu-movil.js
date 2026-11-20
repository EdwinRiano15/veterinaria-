// Requisito 1: desplegar y cerrar la navegación en pantallas pequeñas.
(function conectarMenuMovil() {
    const navegacion = document.querySelector(".principal_nav");
    const lista = navegacion?.querySelector(".principal_lista");
    if (!navegacion || !lista) return;

    if (!lista.id) lista.id = "menu-principal-enlaces";

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "principal-menu-toggle";
    boton.setAttribute("aria-controls", lista.id);
    boton.setAttribute("aria-expanded", "false");
    boton.innerHTML = '<span class="principal-menu-icon" aria-hidden="true">☰</span><span>Menú</span>';
    navegacion.insertBefore(boton, lista);

    const cambiarEstadoMenu = (abierto) => {
        navegacion.classList.toggle("menu-abierto", abierto);
        boton.setAttribute("aria-expanded", String(abierto));
    };

    boton.addEventListener("click", () => {
        cambiarEstadoMenu(boton.getAttribute("aria-expanded") !== "true");
    });

    lista.addEventListener("click", (evento) => {
        if (evento.target.closest("a, #carrito-toggle, #pedidos-toggle")) {
            cambiarEstadoMenu(false);
        }
    });

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") cambiarEstadoMenu(false);
    });
})();
