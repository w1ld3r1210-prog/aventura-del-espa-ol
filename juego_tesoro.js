// ==========================================
// SISTEMA DE SONIDOS (WEB AUDIO API)
// ==========================================
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function iniciarAudio() {
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
}

function tocarSonido(tipo) {
    iniciarAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const ahora = audioCtx.currentTime;

    if (tipo === 'acierto') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ahora);
        osc.frequency.setValueAtTime(659.25, ahora + 0.08);
        gain.gain.setValueAtTime(0.15, ahora);
        gain.gain.exponentialRampToValueAtTime(0.001, ahora + 0.35);
        osc.start(ahora);
        osc.stop(ahora + 0.35);
    } else if (tipo === 'escudo') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ahora);
        osc.frequency.setValueAtTime(554.37, ahora + 0.1);
        osc.frequency.setValueAtTime(659.25, ahora + 0.2);
        gain.gain.setValueAtTime(0.2, ahora);
        gain.gain.exponentialRampToValueAtTime(0.001, ahora + 0.5);
        osc.start(ahora);
        osc.stop(ahora + 0.5);
    } else if (tipo === 'victoria') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ahora);
        osc.frequency.setValueAtTime(783.99, ahora + 0.12);
        osc.frequency.setValueAtTime(1046.50, ahora + 0.24);
        gain.gain.setValueAtTime(0.2, ahora);
        gain.gain.exponentialRampToValueAtTime(0.001, ahora + 0.6);
        osc.start(ahora);
        osc.stop(ahora + 0.6);
    } else { // error
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ahora);
        osc.frequency.linearRampToValueAtTime(80, ahora + 0.25);
        gain.gain.setValueAtTime(0.2, ahora);
        gain.gain.exponentialRampToValueAtTime(0.001, ahora + 0.25);
        osc.start(ahora);
        osc.stop(ahora + 0.25);
    }
}

// ==========================================
// LLUVIA DE EMOJIS DE TESORO (ENCIMA DEL TÍTULO)
// ==========================================
function iniciarLluviaTesoro() {
    const contenedor = document.getElementById('lluvia-tesoro');
    if (!contenedor) return;

    const elementosTesoro = ["🪙", "💰", "🏴‍☠️", "💎", "🪙"];

    setInterval(() => {
        const item = document.createElement('span');
        item.classList.add('item-cayendo-tesoro');
        item.innerText = elementosTesoro[Math.floor(Math.random() * elementosTesoro.length)];
        item.style.left = `${Math.random() * 92 + 2}%`;
        item.style.fontSize = `${Math.floor(Math.random() * 14) + 18}px`;
        const duracion = (Math.random() * 2.5 + 2.5).toFixed(2);
        item.style.animationDuration = `${duracion}s`;

        contenedor.appendChild(item);
        setTimeout(() => item.remove(), duracion * 1000);
    }, 220);
}

// ==========================================
// BANCO DE PALABRAS PARA CLASIFICAR
// ==========================================
const tesorosBanco = [
    { palabra: "Café", tipo: "Aguda", explicacion: "¡Correcto! 'Café' lleva la fuerza de voz en la última sílaba y termina en vocal." },
    { palabra: "Canción", tipo: "Aguda", explicacion: "¡Muy bien! 'Canción' es aguda porque acentúa la última sílaba y termina en N." },
    { palabra: "Árbol", tipo: "Grave", explicacion: "¡Exacto! 'Árbol' tiene la fuerza en la penúltima sílaba y no termina en N, S o vocal." },
    { palabra: "Lápiz", tipo: "Grave", explicacion: "¡Correcto! 'Lápiz' es grave y lleva tilde porque termina en consonante diferente a N o S." },
    { palabra: "Plátano", tipo: "Esdrújula", explicacion: "¡Perfecto! 'Plátano' tiene el acento en la antepenúltima sílaba; ¡todas las esdrújulas llevan tilde!" },
    { palabra: "Música", tipo: "Esdrújula", explicacion: "¡Muy bien! 'Música' es esdrújula, por lo que su tilde es obligatoria." },
    { palabra: "Pared", tipo: "Aguda", explicacion: "¡Excelente! 'Pared' es aguda pero no lleva tilde porque termina en consonante distinta de N o S." },
    { palabra: "Fácil", tipo: "Grave", explicacion: "¡Impecable! 'Fácil' es grave con acento en la penúltima sílaba." }
];

let indiceTesoroActual = 0;
let tesorosMezclados = [];
const tiempoMaximo = 12;
let vidas = 3;
let tiempoRestante = 12;
let temporizadorInterval = null;

let rachaAciertos = 0;
let tieneEscudo = false;

let vidasPerdidasTotales = 0;
let tiempoAgotadoAlgunaVez = false;

window.addEventListener("DOMContentLoaded", () => {
    verificarEstadoRetosUI();
    iniciarLluviaTesoro();
});

function comenzarTesoro() {
    iniciarAudio();
    
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.remove("oculto");

    tesorosMezclados = [...tesorosBanco].sort(() => Math.random() - 0.5);
    indiceTesoroActual = 0;
    vidas = 3;
    rachaAciertos = 0;
    tieneEscudo = false;
    vidasPerdidasTotales = 0;
    tiempoAgotadoAlgunaVez = false;
    
    cargarTesoro();
}

function cargarTesoro() {
    if (indiceTesoroActual >= tesorosMezclados.length) {
        finalizarTesoro(true);
        return;
    }

    actualizarHUD();
    const item = tesorosMezclados[indiceTesoroActual];
    
    const elemNum = document.getElementById("num-tesoro");
    if (elemNum) elemNum.innerText = indiceTesoroActual + 1;
    
    const elemTotal = document.getElementById("total-tesoros");
    if (elemTotal) elemTotal.innerText = tesorosMezclados.length;
    
    const zonaJuego = document.getElementById("contenedor-juego-tesoro");
    if (zonaJuego) {
        zonaJuego.innerHTML = `
            <div class="pantalla-tesoro">
                <p style="color: #94a3b8; font-size: 1.1rem; margin-bottom: 5px;">¿Qué tipo de palabra es?</p>
                <div class="caja-palabra-tesoro">🪙 ${item.palabra}</div>
                <div class="lista-opciones-tesoro" id="contenedor-opciones-tesoro">
                    <button class="btn-opcion-tesoro" onclick="verificarClasificacion('Aguda', this)">⚡ Aguda</button>
                    <button class="btn-opcion-tesoro" onclick="verificarClasificacion('Grave', this)">🐢 Grave</button>
                    <button class="btn-opcion-tesoro" onclick="verificarClasificacion('Esdrújula', this)">👑 Esdrújula</button>
                </div>
                <div id="mensaje-tesoro" class="mensaje-alerta-tesoro"></div>
            </div>
        `;
    }

    tiempoRestante = tiempoMaximo;
    actualizarRelojUI();
    actualizarBarraTiempo();
    iniciarReloj();
}

function iniciarReloj() {
    clearInterval(temporizadorInterval);

    temporizadorInterval = setInterval(() => {
        tiempoRestante--;
        actualizarRelojUI();
        actualizarBarraTiempo();

        if (tiempoRestante <= 0) {
            clearInterval(temporizadorInterval);
            tocarSonido('error');
            rachaAciertos = 0;

            const msg = document.getElementById("mensaje-tesoro");

            if (tieneEscudo) {
                tieneEscudo = false;
                if (msg) {
                    msg.innerText = "🛡️ ¡El Escudo de Corazones protegió tus vidas del tiempo agotado!";
                    msg.style.color = "#d97706";
                }
            } else {
                vidas--;
                vidasPerdidasTotales++;
                tiempoAgotadoAlgunaVez = true;
                if (msg) {
                    msg.innerText = "⏱️ ¡Se agotó el tiempo! Perdiste una vida.";
                    msg.style.color = "#ef4444";
                }
            }

            actualizarHUD();

            setTimeout(() => {
                if (vidas <= 0) {
                    finalizarTesoro(false);
                } else {
                    indiceTesoroActual++;
                    cargarTesoro();
                }
            }, 1800);
        }
    }, 1000);
}

function actualizarRelojUI() {
    const elemTiempo = document.getElementById("temporizador");
    if (elemTiempo) elemTiempo.innerText = `⏱️ ${tiempoRestante}s`;
}

function actualizarBarraTiempo() {
    const porcentaje = (tiempoRestante / tiempoMaximo) * 100;
    const barra = document.getElementById("barra-tiempo-tesoro");
    if (barra) {
        barra.style.width = `${porcentaje}%`;
        if (porcentaje < 30) {
            barra.style.backgroundColor = "#ef4444";
        } else if (porcentaje < 60) {
            barra.style.backgroundColor = "#f59e0b";
        } else {
            barra.style.backgroundColor = "#10b981";
        }
    }
}

function actualizarHUD() {
    const elemVidas = document.getElementById("contador-vidas");
    if (elemVidas) {
        let textoVidas = `Vidas: ${"💖".repeat(Math.max(0, vidas))}`;
        if (tieneEscudo) {
            textoVidas += " 🛡️ (Escudo Activo)";
        }
        elemVidas.innerText = textoVidas;
    }
}

function verificarClasificacion(eleccion, btnElement) {
    clearInterval(temporizadorInterval);
    const item = tesorosMezclados[indiceTesoroActual];
    const msg = document.getElementById("mensaje-tesoro");
    
    const botones = document.querySelectorAll(".btn-opcion-tesoro");
    botones.forEach(b => b.style.pointerEvents = "none");

    if (eleccion === item.tipo) {
        tocarSonido('acierto');
        btnElement.classList.add("correcto");
        
        rachaAciertos++;
        let mensajeExtra = "";

        if (rachaAciertos === 3 && !tieneEscudo) {
            tieneEscudo = true;
            tocarSonido('escudo');
            mensajeExtra = " 🛡️ ¡Racha de 3! ¡Has ganado un Escudo de Corazones!";
        }

        if (msg) {
            msg.innerHTML = `✅ ${item.explicacion}${mensajeExtra}`;
            msg.style.color = "#10b981";
        }

        setTimeout(() => {
            indiceTesoroActual++;
            if (indiceTesoroActual < tesorosMezclados.length) {
                cargarTesoro();
            } else {
                finalizarTesoro(true);
            }
        }, 2200);
    } else {
        tocarSonido('error');
        btnElement.classList.add("incorrecto");
        rachaAciertos = 0;

        if (tieneEscudo) {
            tieneEscudo = false;
            if (msg) {
                msg.innerText = "🛡️ ¡Tu Escudo de Corazones se rompió pero protegió tu vida!";
                msg.style.color = "#d97706";
            }
        } else {
            vidas--;
            vidasPerdidasTotales++;
            if (msg) {
                msg.innerText = `❌ Clasificación incorrecta. Era una palabra ${item.tipo}.`;
                msg.style.color = "#ef4444";
            }
        }

        actualizarHUD();
        
        setTimeout(() => {
            if (vidas <= 0) {
                finalizarTesoro(false);
            } else {
                botones.forEach(b => {
                    b.style.pointerEvents = "auto";
                    b.classList.remove("incorrecto");
                });
                if (msg) msg.innerText = "";
                iniciarReloj();
            }
        }, 1800);
    }
}

function verificarEstadoRetosUI() {
    let pirata = localStorage.getItem("retos_tesoro_pirata") === "true";
    let veloz = localStorage.getItem("retos_tesoro_veloz") === "true";

    if (pirata) {
        const tarjeta = document.getElementById("tarjeta-reto-pirata");
        const status = document.getElementById("status-pirata");
        if (tarjeta) {
            tarjeta.style.background = "rgba(16, 185, 129, 0.15)";
            tarjeta.style.borderColor = "#10b981";
        }
        if (status) {
            status.innerHTML = "✔️ ¡Superado!";
            status.style.color = "#059669";
            status.style.background = "#d1fae5";
        }
    }

    if (veloz) {
        const tarjeta = document.getElementById("tarjeta-reto-veloz");
        const status = document.getElementById("status-veloz");
        if (tarjeta) {
            tarjeta.style.background = "rgba(16, 185, 129, 0.15)";
            tarjeta.style.borderColor = "#10b981";
        }
        if (status) {
            status.innerHTML = "✔️ ¡Superado!";
            status.style.color = "#059669";
            status.style.background = "#d1fae5";
        }
    }
}

function finalizarTesoro(ganado = true) {
    clearInterval(temporizadorInterval);
    const zonaJuego = document.getElementById("contenedor-juego-tesoro");
    
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.add("oculto");

    if (ganado) {
        tocarSonido('victoria');
        localStorage.setItem("juego_tesoro_completado", "true");

        let mensajesRetosHTML = "";
        
        if (vidasPerdidasTotales === 0) {
            localStorage.setItem("retos_tesoro_pirata", "true");
            mensajesRetosHTML += `<p style="color: #059669; font-weight: bold;">🪙 ¡Logro Superado: Capitán Impecable!</p>`;
        }

        if (!tiempoAgotadoAlgunaVez) {
            localStorage.setItem("retos_tesoro_veloz", "true");
            mensajesRetosHTML += `<p style="color: #f59e0b; font-weight: bold;">⛵ ¡Logro Superado: Navegante Veloz!</p>`;
        }

        verificarEstadoRetosUI();

        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 25px;">
                    <h2 style="color: #f59e0b; margin-top: 0; font-size: 1.8rem;">🏴‍☠️ ¡Tesoro Encontrado con Éxito!</h2>
                    <p style="font-size: 1.15rem; color: #94a3b8; margin: 15px 0;">
                        Has abierto el cofre clasificando perfectamente todas las palabras agudas, graves y esdrújulas. ¡Eres un maestro de los acentos!
                    </p>
                    <div style="margin: 15px 0;">${mensajesRetosHTML}</div>
                    <button onclick="comenzarTesoro()" class="btn-accion-tesoro" style="margin-right: 10px;">
                        🔄 Navegar de Nuevo
                    </button>
                    <a href="index.html" class="btn-accion-tesoro" style="display: inline-block; text-decoration: none; background: #38bdf8; color: #0f172a;">
                        🏠 Volver al Inicio
                    </a>
                </div>
            `;
        }
    } else {
        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 25px;">
                    <h2 style="color: #ef4444; margin-top: 0; font-size: 1.8rem;">⚓ El Cofre Permaneció Cerrado</h2>
                    <p style="font-size: 1.15rem; color: #94a3b8; margin: 15px 0;">
                        Te has quedado sin vidas clasificando los tesoros. ¡Repasa las reglas de acentuación y vuelve a intentarlo!
                    </p>
                    <button onclick="comenzarTesoro()" class="btn-accion-tesoro" style="background: #ef4444;">
                        🔄 Reintentar Expedición
                    </button>
                </div>
            `;
        }
    }
}