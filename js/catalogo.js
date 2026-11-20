// Conecta búsqueda, filtro por mascota y filtro por categoría en los catálogos.
(function conectarCatalogos() {
    const buscador = document.querySelector(".search-bar-container input");
    const productos = [...document.querySelectorAll(".product-card, #content .producto")];
    const filtrosMascota = [...document.querySelectorAll(".filter-btn[data-filter-pet], .filter-btn[data-filter]")];
    const filtrosCategoria = [...document.querySelectorAll(".filter-btn[data-filter-category]")];
    if (productos.length === 0) return;

    let mascotaActiva = "all";
    let categoriaActiva = "all";
    let mensaje = document.getElementById("sin-resultados");
    if (!mensaje) {
        mensaje = document.createElement("p");
        mensaje.id = "sin-resultados";
        mensaje.className = "sin-resultados";
        mensaje.setAttribute("role", "status");
        mensaje.textContent = "No encontramos productos con esos criterios.";
        (document.querySelector("main") || productos[0].parentElement).append(mensaje);
    }

    const normalizar = (texto) => texto
        .toLocaleLowerCase("es")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const aplicarFiltros = () => {
        const consulta = normalizar(buscador ? buscador.value.trim() : "");
        let visibles = 0;

        productos.forEach((producto) => {
            const texto = normalizar(
                `${producto.innerText} ${producto.querySelector("img")?.alt || ""}`
            );
            const coincideTexto = texto.includes(consulta);
            const coincideMascota = mascotaActiva === "all" || producto.dataset.pet === mascotaActiva;
            const coincideCategoria = categoriaActiva === "all" || producto.dataset.category === categoriaActiva;
            producto.hidden = !(coincideTexto && coincideMascota && coincideCategoria);
            if (!producto.hidden) visibles += 1;
        });

        document.querySelectorAll(".section-group").forEach((seccion) => {
            const tieneProductosVisibles = seccion.querySelector(".product-card:not([hidden])");
            seccion.hidden = !tieneProductosVisibles;
        });
        mensaje.hidden = visibles > 0;
    };

    if (buscador) buscador.addEventListener("input", aplicarFiltros);
    filtrosMascota.forEach((boton) => {
        boton.addEventListener("click", () => {
            mascotaActiva = boton.dataset.filterPet || boton.dataset.filter || "all";
            filtrosMascota.forEach((filtro) => {
                const activo = filtro === boton;
                filtro.classList.toggle("active", activo);
                filtro.setAttribute("aria-pressed", String(activo));
            });
            aplicarFiltros();
        });
        boton.setAttribute("aria-pressed", String(boton.classList.contains("active")));
    });

    filtrosCategoria.forEach((boton) => {
        boton.addEventListener("click", () => {
            categoriaActiva = boton.dataset.filterCategory || "all";
            filtrosCategoria.forEach((filtro) => {
                const activo = filtro === boton;
                filtro.classList.toggle("active", activo);
                filtro.setAttribute("aria-pressed", String(activo));
            });
            aplicarFiltros();
        });
        boton.setAttribute("aria-pressed", String(boton.classList.contains("active")));
    });

    aplicarFiltros();
})();
