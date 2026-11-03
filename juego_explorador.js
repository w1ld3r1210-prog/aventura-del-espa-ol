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
// BANCO AMPLIADO DE 9 RETOS (SINÓNIMOS Y ANTÓNIMOS)
// ==========================================
const retosSelva = [
    {
        pregunta: "Encuentra el SINÓNIMO de:",
        palabra: "RÁPIDO",
        opciones: ["Lento", "Veloz", "Pesado", "Triste"],
        correcta: 1,
        explicacion: "¡Correcto! **'Veloz'** significa lo mismo que rápido."
    },
    {
        pregunta: "Encuentra el ANTÓNIMO de:",
        palabra: "ALEGRE",
        opciones: ["Contento", "Feliz", "Triste", "Eufórico"],
        correcta: 2,
        explicacion: "¡Muy bien! El opuesto de alegre es **'Triste'**."
    },
    {
        pregunta: "Encuentra el SINÓNIMO de:",
        palabra: "GIGANTE",
        opciones: ["Pequeño", "Enorme", "Corto", "Débil"],
        correcta: 1,
        explicacion: "¡Excelente! **'Enorme'** es un sinónimo perfecto de gigante."
    },
    {
        pregunta: "Encuentra el ANTÓNIMO de:",
        palabra: "OSCURO",
        opciones: ["Sombrío", "Luminoso", "Negro", "Tétrico"],
        correcta: 1,
        explicacion: "¡Impecable! Lo contrario de oscuro es **'Luminoso'** o claro."
    },
    {
        pregunta: "Encuentra el SINÓNIMO de:",
        palabra: "INTELIGENTE",
        opciones: ["Brillante", "Torpe", "Lento", "Despistado"],
        correcta: 0,
        explicacion: "¡Genial! **'Brillante'** es sinónimo de una persona inteligente."
    },
    {
        pregunta: "Encuentra el ANTÓNIMO de:",
        palabra: "VALIENTE",
        opciones: ["Audaz", "Cobarde", "Heroico", "Arrojado"],
        correcta: 1,
        explicacion: "¡Muy bien! Lo opuesto a valiente es **'Cobarde'**."
    },
    {
        pregunta: "Encuentra el SINÓNIMO de:",
        palabra: "BONITO",
        opciones: ["Feo", "Horrible", "Hermoso", "Desagradable"],
        correcta: 2,
        explicacion: "¡Correcto! **'Hermoso'** comparte el significado con bonito."
    },
    {
        pregunta: "Encuentra el ANTÓNIMO de:",
        palabra: "DURO",
        opciones: ["Rígido", "Firme", "Blando", "Sólido"],
        correcta: 2,
        explicacion: "¡Exacto! El antónimo de algo duro es **'Blando'**."
    },
    {
        pregunta: "Encuentra el SINÓNIMO de:",
        palabra: "SILENCIO",
        opciones: ["Ruido", "Bullicio", "Calma", "Griterío"],
        correcta: 2,
        explicacion: "¡Excelente! La **'Calma'** o quietud se relaciona con el silencio."
    }
];

let indiceCasoActual = 0;
let casosMezclados = [];
const tiempoMaximo = 15;
let vidas = 3;
let tiempoRestante = 15;
let temporizadorInterval = null;

let rachaAciertos = 0;
let tieneEscudo = false;

let vidasPerdidasTotales = 0;
let tiempoAgotadoAlgunaVez = false;

window.addEventListener("DOMContentLoaded", () => {
    iniciarLluviaSelva();
    verificarEstadoRetosUI();
});

// Lluvia de Emojis de Selva (Palmera 🌴, Bananas 🍌, Arbusto 🌿)
function iniciarLluviaSelva() {
    const contenedor = document.getElementById('lluvia-selva');
    if (!contenedor) return;
    
    const elementosSelva = ["🌴", "🍌", "🌿", "🌴", "🍌"];
    
    setInterval(() => {
        const item = document.createElement('span');
        item.classList.add('item-cayendo-selva');
        item.innerText = elementosSelva[Math.floor(Math.random() * elementosSelva.length)];
        item.style.left = `${Math.random() * 92 + 2}%`;
        item.style.fontSize = `${Math.floor(Math.random() * 14) + 18}px`;
        const duracion = (Math.random() * 2.5 + 2.5).toFixed(2);
        item.style.animationDuration = `${duracion}s`;
        
        contenedor.appendChild(item);
        setTimeout(() => item.remove(), duracion * 1000);
    }, 220);
}

// Función que arranca el juego al presionar "¡Entrar al Templo!"
function comenzarExpedicionReal() {
    iniciarAudio();
    
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.remove("oculto");

    const zonaJuego = document.getElementById("contenedor-juego-explorador");
    if (zonaJuego) {
        zonaJuego.innerHTML = `
            <div class="pantalla-templo">
                <div class="info-templo">
                    <h3>🏛️ Templo del Vocabulario</h3>
                    <p class="instruccion-templo">Analiza la palabra en el altar sagrado y elige la opción correcta antes de que expire el tiempo.</p>
                </div>
                <div id="caja-palabra" class="caja-palabra-objetivo">Cargando desafío...</div>
                <div id="contenedor-opciones" class="lista-opciones-selva"></div>
                <div id="mensaje-explorador" class="mensaje-alerta-selva"></div>
            </div>
        `;
    }

    casosMezclados = [...retosSelva].sort(() => Math.random() - 0.5);
    indiceCasoActual = 0;
    vidas = 3;
    rachaAciertos = 0;
    tieneEscudo = false;
    vidasPerdidasTotales = 0;
    tiempoAgotadoAlgunaVez = false;
    
    cargarCaso();
}

function cargarCaso() {
    if (indiceCasoActual >= casosMezclados.length) {
        finalizarExplorador(true);
        return;
    }

    actualizarHUD();
    const caso = casosMezclados[indiceCasoActual];
    
    const elemNumCaso = document.getElementById("num-caso");
    if (elemNumCaso) elemNumCaso.innerText = indiceCasoActual + 1;
    
    const elemTotalCasos = document.getElementById("total-casos");
    if (elemTotalCasos) elemTotalCasos.innerText = casosMezclados.length;
    
    const elemMsg = document.getElementById("mensaje-explorador");
    if (elemMsg) elemMsg.innerText = "";
    
    const elemCaja = document.getElementById("caja-palabra");
    if (elemCaja) {
        elemCaja.innerHTML = `<span style="font-size: 0.9rem; display: block; color: #854d0e; font-weight: normal; margin-bottom: 5px;">${caso.pregunta}</span> ${caso.palabra}`;
        elemCaja.classList.remove("escaneando");
    }
    
    const contenedorOpciones = document.getElementById("contenedor-opciones");
    if (contenedorOpciones) {
        contenedorOpciones.innerHTML = "";
        caso.opciones.forEach((texto, index) => {
            const btn = document.createElement("button");
            btn.className = "btn-opcion-selva";
            btn.innerText = texto;
            btn.onclick = () => verificarOpcion(index, btn);
            contenedorOpciones.appendChild(btn);
        });
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

            const msg = document.getElementById("mensaje-explorador");

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
                    msg.innerText = "⏱️ ¡Se agotó el tiempo en el templo! Perdiste una vida.";
                    msg.style.color = "#ef4444";
                }
            }

            actualizarHUD();

            setTimeout(() => {
                if (vidas <= 0) {
                    finalizarExplorador(false);
                } else {
                    indiceCasoActual++;
                    cargarCaso();
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
    const barra = document.getElementById("barra-tiempo-selva");
    if (barra) {
        barra.style.width = `${porcentaje}%`;
        if (porcentaje < 30) {
            barra.style.backgroundColor = "#ef4444"; // Rojo
        } else if (porcentaje < 60) {
            barra.style.backgroundColor = "#f59e0b"; // Amarillo
        } else {
            barra.style.backgroundColor = "#10b981"; // Verde
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

function verificarOpcion(indiceElegido, btnElement) {
    clearInterval(temporizadorInterval);
    const caso = casosMezclados[indiceCasoActual];
    const msg = document.getElementById("mensaje-explorador");
    const cajaPalabra = document.getElementById("caja-palabra");
    
    const botones = document.querySelectorAll(".btn-opcion-selva");
    botones.forEach(b => b.style.pointerEvents = "none");

    if (cajaPalabra) cajaPalabra.classList.add("escaneando");
    if (msg) {
        msg.innerText = "🌿 Analizando jeroglíficos...";
        msg.style.color = "#059669";
    }

    setTimeout(() => {
        if (cajaPalabra) cajaPalabra.classList.remove("escaneando");

        if (indiceElegido === caso.correcta) {
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
                msg.innerHTML = `✅ ${caso.explicacion}${mensajeExtra}`;
                msg.style.color = "#10b981";
            }

            setTimeout(() => {
                indiceCasoActual++;
                if (indiceCasoActual < casosMezclados.length) {
                    cargarCaso();
                } else {
                    finalizarExplorador(true);
                }
            }, 2200);
        } else {
            tocarSonido('error');
            btnElement.classList.add("incorrecto");
            rachaAciertos = 0;

            const msgAlerta = document.getElementById("mensaje-explorador");

            if (tieneEscudo) {
                tieneEscudo = false;
                if (msgAlerta) {
                    msgAlerta.innerText = "🛡️ ¡Tu Escudo de Corazones se rompió pero protegió tu vida!";
                    msgAlerta.style.color = "#d97706";
                }
            } else {
                vidas--;
                vidasPerdidasTotales++;
                if (msgAlerta) {
                    msgAlerta.innerText = "❌ Mecanismo bloqueado. ¡Perdiste una vida!";
                    msgAlerta.style.color = "#ef4444";
                }
            }

            actualizarHUD();
            
            setTimeout(() => {
                if (vidas <= 0) {
                    finalizarExplorador(false);
                } else {
                    botones.forEach(b => {
                        b.style.pointerEvents = "auto";
                        b.classList.remove("incorrecto");
                    });
                    if (msgAlerta) msgAlerta.innerText = "";
                    iniciarReloj();
                }
            }, 1800);
        }
    }, 600);
}

function verificarEstadoRetosUI() {
    let experto = localStorage.getItem("retos_explorador_experto") === "true";
    let veloz = localStorage.getItem("retos_explorador_veloz") === "true";

    if (experto) {
        const tarjeta = document.getElementById("tarjeta-reto-experto");
        const status = document.getElementById("status-experto");
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

function finalizarExplorador(ganado = true) {
    clearInterval(temporizadorInterval);
    const zonaJuego = document.getElementById("contenedor-juego-explorador");
    
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.add("oculto");

    if (ganado) {
        tocarSonido('victoria');
        localStorage.setItem("juego_explorador_completado", "true");

        let mensajesRetosHTML = "";
        
        if (vidasPerdidasTotales === 0) {
            localStorage.setItem("retos_explorador_experto", "true");
            mensajesRetosHTML += `<p style="color: #059669; font-weight: bold;">🌿 ¡Logro Superado: Expedición Legendaria!</p>`;
        }

        if (!tiempoAgotadoAlgunaVez) {
            localStorage.setItem("retos_explorador_veloz", "true");
            mensajesRetosHTML += `<p style="color: #f59e0b; font-weight: bold;">⚡ ¡Logro Superado: Caminante Veloz!</p>`;
        }

        verificarEstadoRetosUI();

        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h2 style="color: #059669; margin-top: 0; font-size: 1.8rem;">🏆 ¡Tesoro del Templo Descubierto!</h2>
                    <p style="font-size: 1.15rem; color: #475569; margin: 15px 0;">
                        Has superado los 9 desafíos de sinónimos y antónimos. ¡La selva reconoce tu sabiduría!
                    </p>
                    <div style="margin: 15px 0;">${mensajesRetosHTML}</div>
                    <button onclick="comenzarExpedicionReal()" class="btn-accion-selva" style="margin-right: 10px;">
                        🔄 Jugar de nuevo
                    </button>
                    <a href="index.html" class="btn-accion-selva" style="display: inline-block; text-decoration: none; background: #38bdf8; color: #0f172a;">
                        🏠 Volver al Inicio
                    </a>
                </div>
            `;
        }
    } else {
        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <h2 style="color: #ef4444; margin-top: 0; font-size: 1.8rem;">🌿 Expedición Atrapada</h2>
                    <p style="font-size: 1.15rem; color: #475569; margin: 15px 0;">
                        Te has quedado sin vidas en el templo. ¡Sigue practicando e inténtalo de nuevo!
                    </p>
                    <button onclick="comenzarExpedicionReal()" class="btn-accion-selva" style="background: #ef4444;">
                        🔄 Intentar de nuevo
                    </button>
                </div>
            `;
        }
    }
}