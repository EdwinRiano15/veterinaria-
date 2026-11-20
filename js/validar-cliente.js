// Valida y normaliza los datos del cliente antes de confirmar un pedido.
function validarDatosCliente(formulario) {
    const nombre = formulario.elements.namedItem("nombre");
    const correo = formulario.elements.namedItem("correo");
    const telefono = formulario.elements.namedItem("telefono");
    const direccion = formulario.elements.namedItem("direccion");
    const campos = [nombre, correo, telefono, direccion];

    campos.forEach((campo) => campo.setCustomValidity(""));

    nombre.value = nombre.value.trim().replace(/\s+/g, " ");
    correo.value = correo.value.trim();
    telefono.value = telefono.value.trim();
    direccion.value = direccion.value.trim().replace(/\s+/g, " ");

    if (nombre.value.length < 2) {
        nombre.setCustomValidity("Escribe tu nombre completo (mínimo 2 caracteres).");
    } else if (nombre.value.length > 100) {
        nombre.setCustomValidity("El nombre no puede superar 100 caracteres.");
    } else if (!/^[\p{L}]+(?:[ '\u2019-][\p{L}]+)*$/u.test(nombre.value)) {
        nombre.setCustomValidity("Usa solo letras, espacios, guiones o apóstrofes en el nombre.");
    }

    if (!correo.value) {
        correo.setCustomValidity("Escribe tu correo electrónico.");
    } else if (/\s/.test(correo.value) || correo.validity.typeMismatch) {
        correo.setCustomValidity("Escribe un correo válido, por ejemplo nombre@dominio.com.");
    } else if (correo.value.length > 150) {
        correo.setCustomValidity("El correo no puede superar 150 caracteres.");
    }

    const digitosTelefono = telefono.value.replace(/\D/g, "");
    if (!telefono.value) {
        telefono.setCustomValidity("Escribe tu número de teléfono.");
    } else if (!/^\+?[0-9][0-9 ()-]*[0-9]$/.test(telefono.value) || digitosTelefono.length < 7 || digitosTelefono.length > 15) {
        telefono.setCustomValidity("Escribe un teléfono válido con entre 7 y 15 dígitos.");
    }

    if (direccion.value.length < 8) {
        direccion.setCustomValidity("Escribe una dirección completa (mínimo 8 caracteres).");
    } else if (direccion.value.length > 200) {
        direccion.setCustomValidity("La dirección no puede superar 200 caracteres.");
    }

    const primerCampoInvalido = campos.find((campo) => !campo.validity.valid);
    if (!primerCampoInvalido) return true;

    const detalles = primerCampoInvalido.closest("details");
    if (detalles) detalles.open = true;
    primerCampoInvalido.focus();
    primerCampoInvalido.reportValidity();
    return false;
}
