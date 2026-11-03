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
// BANCO AMPLIADO DE 9 CASOS (DETECTIVE)
// ==========================================
const casosDetective = [
    {
        pregunta: "Encuentra la oración que cumple todas las reglas de ortografía, mayúsculas y puntuación:",
        opciones: [
            { texto: "El perro de juan es rapido juguetón y bonito", correcta: false },
            { texto: "El perro de Juan es rapido, juguetón y bonito.", correcta: false },
            { texto: "El perro de Juan es rápido, juguetón y bonito.", correcta: true }
        ],
        explicacion: "¡Excelente! 'Juan' lleva mayúscula por nombre propio, 'rápido' lleva tilde por ser esdrújula, hay comas de enumeración y termina en punto."
    },
    {
        pregunta: "¿Qué oración está escrita correctamente con signos de interrogación y tildes?",
        opciones: [
            { texto: "cuando llegaras a la fiesta de maria?", correcta: false },
            { texto: "¿Cuando llegaras a la fiesta de maria?", correcta: false },
            { texto: "¿Cuándo llegarás a la fiesta de María?", correcta: true }
        ],
        explicacion: "¡Muy bien! Las preguntas llevan signos de apertura y cierre (¿?), tilde interrogativa en 'Cuándo', tilde en el futuro 'llegarás' y mayúscula en 'María'."
    },
    {
        pregunta: "Selecciona la oración con puntuación y acentos impecables:",
        opciones: [
            { texto: "compramos manzanas peras y bananos en el mercado", correcta: false },
            { texto: "Compramos manzanas, peras y bananos en el mercado", correcta: false },
            { texto: "Compramos manzanas, peras y bananos en el mercado.", correcta: true }
        ],
        explicacion: "¡Impecable! Inicia con mayúscula, usa comas para separar los elementos de la lista y cierra con un punto final."
    },
    {
        pregunta: "Encuentra la opción correcta sobre las reglas de exclamación:",
        opciones: [
            { texto: "que alegria verte por aqui", correcta: false },
            { texto: "¡Que alegria verte por aqui!", correcta: false },
            { texto: "¡Qué alegría verte por aquí!", correcta: true }
        ],
        explicacion: "¡Genial! Las exclamaciones requieren signos dobles (¡ !), tilde diacrítica en 'Qué' y tilde en 'alegría' e 'aquí'."
    },
    {
        pregunta: "Identifica la frase con uso correcto de la mayúscula inicial y el punto:",
        opciones: [
            { texto: "la capital de colombia es bogota", correcta: false },
            { texto: "La capital de Colombia es bogota.", correcta: false },
            { texto: "La capital de Colombia es Bogotá.", correcta: true }
        ],
        explicacion: "¡Correcto! Los nombres propios geográficos ('Colombia', 'Bogotá') siempre exigen mayúscula inicial y tilde."
    },
    {
        pregunta: "¿Cuál oración utiliza correctamente los dos puntos y la coma?",
        opciones: [
            { texto: "Querido abuelo te escribo esta carta para saludarte", correcta: false },
            { texto: "Querido abuelo te escribo esta carta.", correcta: false },
            { texto: "Querido abuelo: te escribo esta carta para saludarte.", correcta: true }
        ],
        explicacion: "¡Exacto! Después de un vocativo en cartas se emplean dos puntos (:)."
    },
    {
        pregunta: "Selecciona el enunciado correctamente acentuado y puntuado:",
        opciones: [
            { texto: "El leon rugio fuerte en la jaula del zoologico.", correcta: false },
            { texto: "El león rugio fuerte en la jaula del zoológico.", correcta: false },
            { texto: "El león rugió fuerte en la jaula del zoológico.", correcta: true }
        ],
        explicacion: "¡Muy bien! 'león', 'rugió' y 'zoológico' llevan tildes obligatorias."
    },
    {
        pregunta: "Encuentra la oración que separa correctamente las ideas con punto y seguido:",
        opciones: [
            { texto: "El sol brilla hoy vamos al parque.", correcta: false },
            { texto: "El sol brilla hoy. vamos al parque.", correcta: false },
            { texto: "El sol brilla hoy. Vamos al parque.", correcta: true }
        ],
        explicacion: "¡Excelente! Después de un punto, la siguiente palabra debe iniciar con letra mayúscula ('Vamos')."
    },
    {
        pregunta: "Identifica la estructura gramatical perfecta:",
        opciones: [
            { texto: "Ayer comi manzana pera y limon.", correcta: false },
            { texto: "Ayer comí manzana pera y limón.", correcta: false },
            { texto: "Ayer comí manzana, pera y limón.", correcta: true }
        ],
        explicacion: "¡Perfecto! 'comí' y 'limón' llevan tilde, y las frutas van separadas por comas."
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
    verificarEstadoRetosUI();
});

function comenzarInvestigacion() {
    iniciarAudio();
    
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.remove("oculto");

    casosMezclados = [...casosDetective].sort(() => Math.random() - 0.5);
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
        finalizarDetective(true);
        return;
    }

    actualizarHUD();
    const caso = casosMezclados[indiceCasoActual];
    
    const elemNumCaso = document.getElementById("num-caso");
    if (elemNumCaso) elemNumCaso.innerText = indiceCasoActual + 1;
    
    const elemTotalCasos = document.getElementById("total-casos");
    if (elemTotalCasos) elemTotalCasos.innerText = casosMezclados.length;
    
    const zonaJuego = document.getElementById("contenedor-juego-detective");
    if (zonaJuego) {
        zonaJuego.innerHTML = `
            <div class="pantalla-caso">
                <div class="pregunta-detective">
                    <h3>🔍 Caso ${indiceCasoActual + 1} de ${casosMezclados.length}</h3>
                    <p>${caso.pregunta}</p>
                </div>
                <div class="lista-opciones-detective" id="contenedor-opciones-det"></div>
                <div id="mensaje-detective" class="mensaje-alerta-detective"></div>
            </div>
        `;

        const contenedorOpciones = document.getElementById("contenedor-opciones-det");
        caso.opciones.forEach((opcion, index) => {
            const btn = document.createElement("button");
            btn.className = "btn-opcion-detective";
            btn.innerHTML = `🔍 <span>${opcion.texto}</span>`;
            btn.onclick = () => verificarOpcionDetective(index, btn);
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

            const msg = document.getElementById("mensaje-detective");

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
                    msg.innerText = "⏱️ ¡Se agotó el tiempo de análisis! Perdiste una vida.";
                    msg.style.color = "#ef4444";
                }
            }

            actualizarHUD();

            setTimeout(() => {
                if (vidas <= 0) {
                    finalizarDetective(false);
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
    const barra = document.getElementById("barra-tiempo-detective");
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

function verificarOpcionDetective(indiceElegido, btnElement) {
    clearInterval(temporizadorInterval);
    const caso = casosMezclados[indiceCasoActual];
    const msg = document.getElementById("mensaje-detective");
    
    const botones = document.querySelectorAll(".btn-opcion-detective");
    botones.forEach(b => b.style.pointerEvents = "none");

    if (caso.opciones[indiceElegido].correcta) {
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
                finalizarDetective(true);
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
                msg.innerText = "❌ Pista incorrecta. ¡Esa oración tiene errores ortográficos!";
                msg.style.color = "#ef4444";
            }
        }

        actualizarHUD();
        
        setTimeout(() => {
            if (vidas <= 0) {
                finalizarDetective(false);
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
    let perfecto = localStorage.getItem("retos_detective_perfecto") === "true";
    let veloz = localStorage.getItem("retos_detective_veloz") === "true";

    if (perfecto) {
        const tarjeta = document.getElementById("tarjeta-reto-perfecto");
        const status = document.getElementById("status-perfecto");
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

function finalizarDetective(ganado = true) {
    clearInterval(temporizadorInterval);
    const zonaJuego = document.getElementById("contenedor-juego-detective");
    
    const hudContainer = document.getElementById("hud-juego-container");
    if (hudContainer) hudContainer.classList.add("oculto");

    if (ganado) {
        tocarSonido('victoria');
        localStorage.setItem("juego_detective_completado", "true");

        let mensajesRetosHTML = "";
        
        if (vidasPerdidasTotales === 0) {
            localStorage.setItem("retos_detective_perfecto", "true");
            mensajesRetosHTML += `<p style="color: #059669; font-weight: bold;">🔍 ¡Logro Superado: Ojo de Halcón!</p>`;
        }

        if (!tiempoAgotadoAlgunaVez) {
            localStorage.setItem("retos_detective_veloz", "true");
            mensajesRetosHTML += `<p style="color: #f59e0b; font-weight: bold;">⚡ ¡Logro Superado: Detective Relámpago!</p>`;
        }

        verificarEstadoRetosUI();

        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 25px;">
                    <h2 style="color: #38bdf8; margin-top: 0; font-size: 1.8rem;">🏆 ¡Caso Resuelto con Éxito!</h2>
                    <p style="font-size: 1.15rem; color: #94a3b8; margin: 15px 0;">
                        Has completado los 9 expedientes ortográficos como un verdadero experto. ¡La agencia está orgullosa de ti!
                    </p>
                    <div style="margin: 15px 0;">${mensajesRetosHTML}</div>
                    <button onclick="comenzarInvestigacion()" class="btn-accion-detective" style="margin-right: 10px;">
                        🔄 Reabrir Caso
                    </button>
                    <a href="index.html" class="btn-accion-detective" style="display: inline-block; text-decoration: none; background: #38bdf8; color: #0f172a;">
                        🏠 Volver al Inicio
                    </a>
                </div>
            `;
        }
    } else {
        if (zonaJuego) {
            zonaJuego.innerHTML = `
                <div style="text-align: center; padding: 25px;">
                    <h2 style="color: #ef4444; margin-top: 0; font-size: 1.8rem;">❌ Investigación Archivada</h2>
                    <p style="font-size: 1.15rem; color: #94a3b8; margin: 15px 0;">
                        Te has quedado sin vidas analizando las pistas. ¡Repasa las reglas y vuelve a intentarlo!
                    </p>
                    <button onclick="comenzarInvestigacion()" class="btn-accion-detective" style="background: #ef4444;">
                        🔄 Reintentar Caso
                    </button>
                </div>
            `;
        }
    }
}