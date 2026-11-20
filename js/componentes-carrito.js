// Agrega los accesos al pedido y el panel lateral compartido en cada página.
(function crearInterfazCarrito() {
    if (document.getElementById("carrito")) return;

    const navegacion = document.querySelector(".principal_lista");
    if (navegacion) {
        const crearAcceso = (id, texto, icono, contadorId) => {
            const elemento = document.createElement("li");
            elemento.className = "clinic-cart-nav-item";
            const boton = document.createElement("button");
            boton.id = id;
            boton.className = "clinic-cart-nav-button";
            boton.type = "button";
            boton.setAttribute("aria-controls", "carrito");
            boton.setAttribute("aria-expanded", "false");
            boton.innerHTML = `${icono}<span>${texto}</span><span id="${contadorId}" class="clinic-cart-count">0</span>`;
            elemento.append(boton);
            navegacion.append(elemento);
        };

        crearAcceso(
            "carrito-toggle",
            "Carrito",
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 3h2l2.2 12.1a2 2 0 0 0 2 1.6h9.9a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>',
            "carrito-indicador"
        );
        crearAcceso(
            "pedidos-toggle",
            "Pedidos",
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"/></svg>',
            "pedidos-indicador"
        );
    }

    const panel = document.createElement("dialog");
    panel.id = "carrito";
    panel.className = "clinic-cart-panel";
    panel.setAttribute("aria-labelledby", "carrito-titulo");
    panel.innerHTML = `
        <div class="clinic-cart-heading">
            <h2 id="carrito-titulo">Mis pedidos</h2>
            <button id="carrito-cerrar" class="clinic-cart-close" type="button" aria-label="Cerrar pedidos">×</button>
        </div>
        <div class="clinic-cart-tabs" role="tablist" aria-label="Carrito, historial y favoritos">
            <button class="clinic-cart-tab activo" type="button" role="tab" aria-selected="true" aria-controls="panel-pedido" data-cart-tab="pedido">Pedido <span id="carrito-cantidad" class="clinic-cart-tab-count">0</span></button>
            <button class="clinic-cart-tab" type="button" role="tab" aria-selected="false" aria-controls="panel-historial" data-cart-tab="historial">Historial <span id="historial-cantidad" class="clinic-cart-tab-count">0</span></button>
            <button class="clinic-cart-tab" type="button" role="tab" aria-selected="false" aria-controls="panel-favoritos" data-cart-tab="favoritos">Favoritos <span id="favoritos-cantidad" class="clinic-cart-tab-count">0</span></button>
        </div>
        <section id="panel-pedido" class="clinic-cart-content" role="tabpanel" data-cart-panel="pedido">
            <p id="carrito-estado" class="clinic-cart-status" role="status" aria-live="polite">Tu carrito está vacío.</p>
            <p id="carrito-vacio" class="clinic-cart-empty">Agrega productos desde el catálogo para comenzar.</p>
            <ul id="carrito-items" class="clinic-cart-items" aria-label="Productos del pedido" hidden></ul>
            <section class="clinic-cart-coupon" aria-labelledby="cupon-titulo">
                <h3 id="cupon-titulo">Cupón de descuento</h3>
                <div class="clinic-cart-coupon-row">
                    <label class="clinic-visually-hidden" for="codigo-descuento">Código de descuento</label>
                    <input id="codigo-descuento" type="text" placeholder="VET20" autocomplete="off">
                    <button id="btn-aplicar-descuento" type="button">Aplicar</button>
                </div>
                <p id="descuento-mensaje" class="clinic-cart-discount-note" role="status" aria-live="polite">Usa VET20 para recibir 20 % de descuento.</p>
            </section>
            <section class="clinic-cart-delivery" aria-labelledby="domicilio-titulo">
                <h3 id="domicilio-titulo">Ciudad de entrega</h3>
                <label class="clinic-visually-hidden" for="pedido-ciudad">Ciudad de destino</label>
                <select id="pedido-ciudad"></select>
                <p id="domicilio-tiempo" role="status" aria-live="polite"></p>
                <small>El costo y el tiempo son estimaciones de ejemplo.</small>
            </section>
            <section class="clinic-cart-summary" aria-label="Resumen del pedido">
                <p><span>Subtotal</span><strong id="carrito-subtotal">$0</strong></p>
                <p><span>Descuento</span><strong id="carrito-descuento">$0</strong></p>
                <p><span>Domicilio estimado</span><strong id="carrito-domicilio">$0</strong></p>
                <p class="clinic-cart-total"><span>Total</span><strong id="carrito-total">$0</strong></p>
            </section>
            <form id="formulario-pedido" class="clinic-cart-form">
                <details>
                    <summary>Datos del cliente</summary>
                    <div class="clinic-cart-customer-fields">
                        <label for="pedido-nombre">Nombre completo</label>
                        <input id="pedido-nombre" name="nombre" type="text" autocomplete="name" minlength="2" maxlength="100" required>
                        <label for="pedido-correo">Correo electrónico</label>
                        <input id="pedido-correo" name="correo" type="email" autocomplete="email" maxlength="150" required>
                        <label for="pedido-telefono">Teléfono</label>
                        <input id="pedido-telefono" name="telefono" type="tel" autocomplete="tel" pattern="[0-9()+ -]{7,20}" minlength="7" maxlength="20" required>
                        <label for="pedido-direccion">Dirección</label>
                        <textarea id="pedido-direccion" name="direccion" autocomplete="street-address" rows="2" minlength="8" maxlength="200" required></textarea>
                    </div>
                </details>
                <button id="btn-validar-pedido" class="clinic-cart-submit" type="submit" disabled>Comprar</button>
                <button id="btn-whatsapp-carrito" class="clinic-whatsapp-button" type="button" disabled>Enviar carrito por WhatsApp</button>
                <small class="clinic-whatsapp-note">WhatsApp te permitirá elegir a quién enviar el mensaje.</small>
                <p id="pedido-estado" role="status" aria-live="polite"></p>
            </form>
        </section>
        <section id="panel-historial" class="clinic-cart-content" role="tabpanel" data-cart-panel="historial" hidden>
            <p id="historial-vacio" class="clinic-cart-empty">Todavía no tienes compras guardadas.</p>
            <ul id="historial-lista" class="clinic-cart-items" aria-label="Historial de compras"></ul>
        </section>
        <section id="panel-favoritos" class="clinic-cart-content" role="tabpanel" data-cart-panel="favoritos" hidden>
            <p id="favoritos-vacio" class="clinic-cart-empty">Todavía no tienes productos favoritos.</p>
            <ul id="favoritos-lista" class="clinic-cart-items" aria-label="Productos favoritos"></ul>
        </section>
    `;

    panel.addEventListener("click", (evento) => {
        const pestaña = evento.target.closest("[data-cart-tab]");
        if (!pestaña) return;

        const seleccionada = pestaña.dataset.cartTab;
        panel.querySelectorAll("[data-cart-tab]").forEach((boton) => {
            const activa = boton === pestaña;
            boton.classList.toggle("activo", activa);
            boton.setAttribute("aria-selected", String(activa));
        });
        panel.querySelectorAll("[data-cart-panel]").forEach((contenido) => {
            contenido.hidden = contenido.dataset.cartPanel !== seleccionada;
        });
    });

    document.body.append(panel);
})();
