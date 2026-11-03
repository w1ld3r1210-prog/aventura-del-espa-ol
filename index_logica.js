// ==========================================
// LÓGICA PRINCIPAL - AVENTURA DEL ESPAÑOL
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    let trofeosConseguidos = 0;

    // 1. Verificar Módulo 1
    const mod1Completado = localStorage.getItem("modulo1_completado") === "true" || sessionStorage.getItem("modulo1_completado") === "true";
    if (mod1Completado) {
        const tarjetaMod1 = document.getElementById("tarjeta-mod-1");
        if (tarjetaMod1) {
            tarjetaMod1.classList.add("completado");
            if (!document.getElementById("etiqueta-completado-mod1")) {
                const etiqueta = document.createElement("div");
                etiqueta.id = "etiqueta-completado-mod1";
                etiqueta.className = "etiqueta-completado";
                etiqueta.innerHTML = "✔️ Módulo Completado";
                tarjetaMod1.appendChild(etiqueta);
            }
        }
        trofeosConseguidos++;
    }

    // 2. Verificar Módulo 2
    const mod2Completado = localStorage.getItem("modulo2_completado") === "true";
    if (mod2Completado) {
        const tarjetaMod2 = document.getElementById("tarjeta-mod-2");
        if (tarjetaMod2) {
            tarjetaMod2.classList.add("completado");
            if (!document.getElementById("etiqueta-completado-mod2")) {
                const etiquetaMod2 = document.createElement("div");
                etiquetaMod2.id = "etiqueta-completado-mod2";
                etiquetaMod2.className = "etiqueta-completado";
                etiquetaMod2.innerHTML = "✔️ Módulo Completado";
                tarjetaMod2.appendChild(etiquetaMod2);
            }
        }
        trofeosConseguidos++;
    }

    // Función auxiliar para verificar y pintar tarjetas de juegos completados
    function verificarJuegoCompletado(storageKey, tarjetaId, etiquetaId) {
        const completado = localStorage.getItem(storageKey) === "true";
        if (completado) {
            const tarjeta = document.getElementById(tarjetaId);
            if (tarjeta) {
                tarjeta.style.background = "linear-gradient(135deg, #059669, #10b981)";
                tarjeta.style.borderColor = "#34d399";
                if (!document.getElementById(etiquetaId)) {
                    const etiqueta = document.createElement("div");
                    etiqueta.id = etiquetaId;
                    etiqueta.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                    etiqueta.style.color = "#ffffff";
                    etiqueta.style.padding = "6px 12px";
                    etiqueta.style.borderRadius = "8px";
                    etiqueta.style.marginTop = "12px";
                    etiqueta.style.fontWeight = "bold";
                    etiqueta.style.display = "inline-block";
                    etiqueta.innerHTML = "✔️ Juego Completado";
                    tarjeta.appendChild(etiqueta);
                }
            }
            trofeosConseguidos++;
        }
    }

    // 3. Verificar Juegos Individuales
    verificarJuegoCompletado("juego_marciano_completado", "tarjeta-juego-marciano", "etiqueta-completado-juego");
    verificarJuegoCompletado("juego_detective_completado", "tarjeta-juego-detective", "etiqueta-completado-detective");
    verificarJuegoCompletado("juego_explorador_completado", "tarjeta-juego-explorador", "etiqueta-completado-explorador");
    verificarJuegoCompletado("juego_tesoro_completado", "tarjeta-juego-tesoro", "etiqueta-completado-tesoro");
    verificarJuegoCompletado("juego_guardian_completado", "tarjeta-juego-guardian", "etiqueta-completado-guardian");

    // 4. Sumar Retos y Logros Especiales Opcionales
    if (localStorage.getItem("retos_marciano_completos") === "true") trofeosConseguidos++;
    if (localStorage.getItem("trofeo_alien_completado") === "true") trofeosConseguidos++;
    if (localStorage.getItem("trofeo_velocidad_completado") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_detective_perfecto") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_detective_veloz") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_tesoro_pirata") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_tesoro_veloz") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_explorador_experto") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_explorador_veloz") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_guardian_sabio") === "true") trofeosConseguidos++;
    if (localStorage.getItem("retos_guardian_agudo") === "true") trofeosConseguidos++;

    // Actualizar el contador de logros en pantalla
    const contador = document.getElementById("contador-logros");
    if (contador) contador.innerHTML = `🏆 ${trofeosConseguidos}`;

    iniciarLluviaLetras();
    efectoMaquina();
});

// Función para reiniciar todo el progreso del estudiante
function reiniciarProgreso() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
}

// ==========================================
// EFECTOS VISUALES (LLUVIA Y MÁQUINA DE ESCRIBIR)
// ==========================================

function iniciarLluviaLetras() {
    const contenedor = document.getElementById('lluvia-letras');
    if (!contenedor) return;
    const abecedario = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    setInterval(() => {
        const letra = document.createElement('span');
        letra.classList.add('letra-cayendo');
        letra.innerText = abecedario[Math.floor(Math.random() * abecedario.length)];
        letra.style.left = `${Math.random() * 92 + 2}%`;
        letra.style.fontSize = `${Math.floor(Math.random() * 16) + 16}px`;
        const duracion = (Math.random() * 2.5 + 2.5).toFixed(2);
        letra.style.animationDuration = `${duracion}s`;
        if (Math.random() > 0.5) letra.style.animationDirection = 'reverse';
        contenedor.appendChild(letra);
        setTimeout(() => letra.remove(), duracion * 1000);
    }, 180);
}

// Frases dinámicas para Lulo el Búho
const frasesLulo = [
    "Elige un módulo o minijuego abajo para comenzar tu aventura.",
    "¡Supera todos los desafíos y completa tus retos ortográficos!",
    "Pon a prueba tus conocimientos sobre acentos, comas y tilde diacrítica.",
    "¡Gana trofeos y llena tu central de retos con orgullo!"
];

let indiceFrase = 0;
let indiceLetra = 0;
let borrandoTexto = false;

function efectoMaquina() {
    const elementoTexto = document.getElementById("texto-maquina");
    if (!elementoTexto) return;

    const textoCompleto = frasesLulo[indiceFrase];

    if (borrandoTexto) {
        elementoTexto.innerHTML = textoCompleto.substring(0, indiceLetra - 1);
        indiceLetra--;
    } else {
        elementoTexto.innerHTML = textoCompleto.substring(0, indiceLetra + 1);
        indiceLetra++;
    }

    let velocidad = borrandoTexto ? 40 : 80;

    if (!borrandoTexto && indiceLetra === textoCompleto.length) {
        velocidad = 2500;
        borrandoTexto = true;
    } else if (borrandoTexto && indiceLetra === 0) {
        borrandoTexto = false;
        indiceFrase = (indiceFrase + 1) % frasesLulo.length;
        velocidad = 500;
    }

    setTimeout(efectoMaquina, velocidad);
}