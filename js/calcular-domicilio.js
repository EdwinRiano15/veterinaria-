// Requerimiento 12: Calcular domicilio de ejemplo
// Tiempo de viaje aproximado desde Ibagué (valores fijos, solo de ejemplo).
const CLAVE_CIUDAD = "veterinary-clinic-ciudad";
const TIEMPOS_DOMICILIO = {
    ibague:   { nombre: "Ibagué",   texto: "30 minutos", costo: 5000 },
    bogota:   { nombre: "Bogotá",   texto: "aprox. 5 horas", costo: 18000 },
    medellin: { nombre: "Medellín", texto: "aprox. 8 horas", costo: 25000 },
    cali:     { nombre: "Cali",     texto: "aprox. 6 horas", costo: 22000 }
};

let ciudadElegida = cargarCiudadGuardada();

function calcularDomicilio(ciudad) {
    const destino = TIEMPOS_DOMICILIO[ciudad];
    if (!destino) return "Ciudad no disponible para domicilio";

    return `Tiempo estimado de Ibagué a ${destino.nombre}: ${destino.texto}`;
}

function calcularCostoDomicilio(ciudad) {
    return TIEMPOS_DOMICILIO[ciudad]?.costo || 0;
}

function cargarCiudadGuardada() {
    try {
        const ciudad = window.localStorage.getItem(CLAVE_CIUDAD);
        return TIEMPOS_DOMICILIO[ciudad] ? ciudad : "ibague";
    } catch (error) {
        return "ibague";
    }
}

function renderizarDomicilio() {
    const select = document.getElementById("pedido-ciudad");
    const tiempo = document.getElementById("domicilio-tiempo");
    const costo = document.getElementById("carrito-domicilio");

    if (select) {
        if (select.options.length === 0) {
            Object.keys(TIEMPOS_DOMICILIO).forEach((clave) => {
                const opcion = document.createElement("option");
                opcion.value = clave;
                opcion.textContent = TIEMPOS_DOMICILIO[clave].nombre;
                select.append(opcion);
            });
        }
        select.value = ciudadElegida;
    }

    if (tiempo) tiempo.textContent = calcularDomicilio(ciudadElegida);
    if (costo) {
        const formatoDinero = typeof formatearMoneda === "function"
            ? formatearMoneda(calcularCostoDomicilio(ciudadElegida))
            : `$${calcularCostoDomicilio(ciudadElegida).toLocaleString("es-CO")}`;
        costo.textContent = formatoDinero;
    }
}

document.addEventListener("change", (evento) => {
    if (evento.target.id !== "pedido-ciudad") return;

    ciudadElegida = TIEMPOS_DOMICILIO[evento.target.value] ? evento.target.value : "ibague";
    try {
        window.localStorage.setItem(CLAVE_CIUDAD, ciudadElegida);
    } catch (error) {
        console.error("No se pudo guardar la ciudad en este navegador.", error);
    }
    renderizarDomicilio();
    if (typeof renderizarCarrito === "function") renderizarCarrito();
});

renderizarDomicilio();
