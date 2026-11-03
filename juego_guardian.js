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
    } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ahora);
        osc.frequency.linearRampToValueAtTime(80, ahora + 0.25);
        gain.gain.setValueAtTime(0.2, ahora);
        gain.gain.exponentialRampToValueAtTime(0.001, ahora + 0.25);
        osc.start(ahora);
        osc.stop(ahora + 0.25);
    }
}

// Banco de preguntas sobre Módulo 1 (Tilde Diacrítica) y Módulo 2 (Signos de puntuación y comas)
const preguntasGuardian = [
    {
        categoria: "Módulo 1: Tilde Diacrítica",
        enunciado: "¿En cuál oración la palabra 'tu' lleva tilde correctamente porque es un pronombre personal?",
        opciones: [
            { texto: "Me gusta tu cuaderno nuevo.", correcta: false },
            { texto: "Tú tienes una gran inteligencia.", correcta: true },
            { texto: "Compra tu libro favorito hoy.", correcta: false }
        ],
        explicacion: "¡Correcto! 'Tú' lleva tilde cuando se refiere a la persona (pronombre), a diferencia de 'tu' que es posesivo."
    },
    {
        categoria: "Módulo 2: Signos de Lectura (La Coma)",
        enunciado: "¿Cuál es la función principal de la coma en una enumeración como: 'Compré peras, manzanas y bananos'?",
        opciones: [
            { texto: "Finalizar una idea por completo.", correcta: false },
            { texto: "Separar elementos de una misma serie o lista.", correcta: true },
            { texto: "Indicar una pregunta o duda en la lectura.", correcta: false }
        ],
        explicacion: "¡Muy bien! La coma sirve para hacer una pausa breve y separar los elementos que forman parte de una lista."
    },
    {
        categoria: "Módulo 1: Tilde Diacrítica",
        enunciado: "Selecciona la oración correcta que usa 'él' (con tilde):",
        opciones: [
            { texto: "El balón es de color rojo brillante.", correcta: false },
            { texto: "El libro pertenece a él.", correcta: true },
            { texto: "El perro corre en el parque.", correcta: false }
        ],
        explicacion: "¡Excelente! 'él' lleva tilde cuando es un pronombre que reemplaza a una persona."
    },
    {
        categoria: "Módulo 2: Signos de Puntuación (El Punto)",
        enunciado: "¿Qué indica un punto y seguido en un texto?",
        opciones: [
            { texto: "Que el texto ha terminado por completo.", correcta: false },
            { texto: "Que se separa una oración de otra dentro del mismo párrafo.", correcta: true },
            { texto: "Que sigue una pregunta importante.", correcta: false }
        ],
        explicacion: "¡Exacto! El punto y seguido separa oraciones distintas pero que tratan sobre el mismo tema en el párrafo."
    },
    {
        categoria: "Módulo 1: Tilde Diacrítica",
        enunciado: "¿Cuándo debe llevar tilde la palabra 'mas'?",
        opciones: [
            { texto: "Cuando significa lo mismo que la palabra 'pero'.", correcta: true },
            { texto: "Cuando acompaña a un sustantivo plural.", correcta: false },
            { texto: "Siempre que se encuentra al inicio de una frase.", correcta: false }
        ],
        explicacion: "¡Correcto! 'Más' (con tilde) indica cantidad, y 'mas' (sin tilde) equivale a 'pero'."
    },
    {
        categoria: "Módulo 2: Uso de la Coma",
        enunciado: "¿Cómo se debe usar la coma en un vocativo (cuando te diriges a alguien)? Ejemplo:",
        opciones: [
            { texto: "Ven aqui Carlos por favor.", correcta: false },
            { texto: "Ven aquí, Carlos, por favor.", correcta: true },
            { texto: "Ven, aquí Carlos por favor.", correcta: false }
        ],
        explicacion: "¡Muy bien! El nombre de la persona a quien llamamos (vocativo) siempre se aísla con comas."
    },
    {
        categoria: "Módulo 1: Tilde Diacrítica",
        enunciado: "Elige la oración que utiliza correctamente el monosílabo 'sí' (afirmativo):",
        opciones: [
            { texto: "Si estudias con ganas, aprobarás el examen.", correcta: false },
            { texto: "Ella dijo que sí aceptaba el reto.", correcta: true },
            { texto: "No sé si lloverá esta tarde.", correcta: false }
        ],
        explicacion: "¡Impecable! 'sí' lleva tilde cuando es afirmación o pronombre reflexivo, distinto de 'si' condicional."
    },
    {
        categoria: "Módulo 2: Signos de Exclamación",
        enunciado: "¿Qué expresan los signos de exclamación (¡ !) al leer un texto?",
        opciones: [
            { texto: "Una duda o pregunta sin resolver.", correcta: false },
            { texto: "Emociones intensas como alegría, sorpresa o enojo.", correcta: true },
            { texto: "Una lista ordenada de compras.", correcta: false }
        ],
        explicacion: "¡Perfecto! Los signos de exclamación reflejan sorpresa, entusiasmo o gritos en la lectura."
    }
];

let indiceMisionActual = 0;
let preguntasMezcladas = [];
let opcionesActuales = [];
const tiempoMaximo = 15;
let vidas = 3;
let tiempoRestante = 15;
let temporizadorInterval = null;

let rachaAciertos = 0;
let tieneEscudo = false;
let vidasPerdidasTotales = 0;
let tiempoAgotadoAlgunaVez = false;

window.addEventListener("DOMContentLoaded", () => {
    verificarEstadoRetosUI();
});

function comenzarGuardian() {
    iniciarAudio();
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.remove("oculto");

    preguntasMezcladas = [...preguntasGuardian].sort(() => Math.random() - 0.5);
    indiceMisionActual = 0;
    vidas = 3;
    rachaAciertos = 0;
    tieneEscudo = false;
    vidasPerdidasTotales = 0;
    tiempoAgotadoAlgunaVez = false;
    
    cargarMision();
}

function cargarMision() {
    if (indiceMisionActual >= preguntasMezcladas.length) {
        finalizarGuardian(true);
        return;
    }

    actualizarHUD();
    const item = preguntasMezcladas[indiceMisionActual];
    
    const elemNum = document.getElementById("num-mision");
    if (elemNum) elemNum.innerText = indiceMisionActual + 1;
    
    const elemTotal = document.getElementById("total-misiones");
    if (elemTotal) elemTotal.innerText = preguntasMezcladas.length;
    
    // Mezclar las opciones aleatoriamente para cada pregunta
    opcionesActuales = [...item.opciones].sort(() => Math.random() - 0.5);

    const zonaJuego = document.getElementById("contenedor-juego-guardian");
    if (zonaJuego) {
        zonaJuego.innerHTML = `
            <div class="pantalla-mision">
                <span style="color: #818cf8; font-weight: bold; font-size: 0.95rem; text-transform: uppercase;">${item.categoria}</span>
                <div class="caja-pregunta-guardian">${item.enunciado}</div>
                <div class="lista-opciones-guardian" id="contenedor-opciones-guardian"></div>
                <div id="mensaje-guardian" class="mensaje-alerta-guardian"></div>
            </div>
        `;

        const contenedorOpciones = document.getElementById("contenedor-opciones-guardian");
        opcionesActuales.forEach((opcion) => {
            const btn = document.createElement("button");
            btn.className = "btn-opcion-guardian";
            btn.innerText = opcion.texto;
            btn.onclick = () => verificarOpcionGuardian(opcion.correcta, btn);
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
            const msg = document.getElementById("mensaje-guardian");

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
                    finalizarGuardian(false);
                } else {
                    indiceMisionActual++;
                    cargarMision();
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
    const barra = document.getElementById("barra-tiempo-guardian");
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

function verificarOpcionGuardian(esCorrecta, btnElement) {
    clearInterval(temporizadorInterval);
    const item = preguntasMezcladas[indiceMisionActual];
    const msg = document.getElementById("mensaje-guardian");
    
    const botones = document.querySelectorAll(".btn-opcion-guardian");
    botones.forEach(b => b.style.pointerEvents = "none");

    if (esCorrecta) {
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
            indiceMisionActual++;
            if (indiceMisionActual < preguntasMezcladas.length) {
                cargarMision();
            } else {
                finalizarGuardian(true);
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
                msg.innerText = "❌ Respuesta incorrecta. ¡Analiza bien la regla!";
                msg.style.color = "#ef4444";
            }
        }

        actualizarHUD();
        
        setTimeout(() => {
            if (vidas <= 0) {
                finalizarGuardian(false);
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
    let sabio = localStorage.getItem("retos_guardian_sabio") === "true";
    let agudo = localStorage.getItem("retos_guardian_agudo") === "true";

    if (sabio) {
        const tarjeta = document.getElementById("tarjeta-reto-sabio");
        const status = document.getElementById("status-sabio");
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

    if (agudo) {
        const tarjeta = document.getElementById("tarjeta-reto-agudo");
        const status = document.getElementById("status-agudo");
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

function finalizarGuardian(ganado = true) {
    clearInterval(temporizadorInterval);
    const zonaJuego = document.getElementById("contenedor-juego-guardian");
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.add("oculto");

    if (ganado) {
        tocarSonido('victoria');
        localStorage.setItem("juego_guardian_completado", "true");

        let mensajesRetosHTML = "";
        if (vidasPerdidasTotales === 0) {
            localStorage.setItem("retos_guardian_sabio", "true");
            mensajesRetosHTML += `<p style="color: #059669; font-weight: bold;">📜 ¡Logro Superado: Sabio Supremo!</p>`;
        }
        if (!tiempoAgotadoAlgunaVez) {
            localStorage.setItem("retos_guardian_agudo", "true");
            mensajesRetosHTML += `<p style="color: #f59e0b; font-weight: bold;">⚡ ¡Logro Superado: Juicio Veloz!</p>`;
        }

        verificarEstadoRetosUI();

        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 25px;">
                    <h2 style="color: #818cf8; margin-top: 0; font-size: 1.8rem;">⚡ ¡Juicio Superado con Éxito!</h2>
                    <p style="font-size: 1.15rem; color: #94a3b8; margin: 15px 0;">
                        Has demostrado un dominio absoluto de la tilde diacrítica (Módulo 1) y de los signos de puntuación (Módulo 2). ¡El Guardián está impresionado!
                    </p>
                    <div style="margin: 15px 0;">${mensajesRetosHTML}</div>
                    <button onclick="comenzarGuardian()" class="btn-accion-guardian" style="margin-right: 10px;">
                        🔄 Repetir Juicio
                    </button>
                    <a href="index.html" class="btn-accion-guardian" style="display: inline-block; text-decoration: none; background: #38bdf8; color: #0f172a;">
                        🏠 Volver al Inicio
                    </a>
                </div>
            `;
        }
    } else {
        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 25px;">
                    <h2 style="color: #ef4444; margin-top: 0; font-size: 1.8rem;">❌ Juicio No Superado</h2>
                    <p style="font-size: 1.15rem; color: #94a3b8; margin: 15px 0;">
                        Te has quedado sin vidas en las misiones. ¡Repasa los módulos 1 y 2 y vuelve a intentarlo!
                    </p>
                    <button onclick="comenzarGuardian()" class="btn-accion-guardian" style="background: #ef4444;">
                        🔄 Reintentar Juicio
                    </button>
                </div>
            `;
        }
    }
}