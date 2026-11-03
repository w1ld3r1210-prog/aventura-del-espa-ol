// Retos del Rascacielos Gramatical
const retosModulo3 = [
    {
        sustantivo: "gato",
        verbo: "duerme",
        adjetivo: "negro",
        palabras: ["gato", "duerme", "negro", "corre", "veloz"]
    },
    {
        sustantivo: "niño",
        verbo: "juega",
        adjetivo: "alegre",
        palabras: ["alegre", "juega", "niño", "pelota", "salta"]
    },
    {
        sustantivo: "mariposa",
        verbo: "vuela",
        adjetivo: "amarilla",
        palabras: ["vuela", "amarilla", "mariposa", "flor", "rápido"]
    },
    {
        sustantivo: "auto",
        verbo: "corre",
        adjetivo: "veloz",
        palabras: ["veloz", "auto", "corre", "pista", "rojo"]
    }
];

let retosMezcladosM3 = [];
let indiceRetoActualM3 = 0;
let palabraSeleccionada = null;
let elementoPalabraSeleccionada = null;
let colocaciones = {
    sustantivo: null,
    verbo: null,
    adjetivo: null
};

function mostrarJuegoM3() {
    document.getElementById("btn-iniciar-m3").style.display = "none";
    document.getElementById("contenedor-juego-m3").style.display = "block";
    
    retosMezcladosM3 = [...retosModulo3].sort(() => Math.random() - 0.5);
    indiceRetoActualM3 = 0;
    cargarRetoM3();
}

function cargarRetoM3() {
    palabraSeleccionada = null;
    elementoPalabraSeleccionada = null;
    colocaciones = { sustantivo: null, verbo: null, adjetivo: null };

    const reto = retosMezcladosM3[indiceRetoActualM3];
    
    document.getElementById("num-reto-m3").innerText = indiceRetoActualM3 + 1;
    document.getElementById("total-retos-m3").innerText = retosMezcladosM3.length;
    document.getElementById("mensaje-juego-m3").innerText = "";

    // Limpiar pisos del rascacielos
    document.getElementById("piso-sustantivo").innerText = "Haz clic aquí para colocar bloque";
    document.getElementById("piso-sustantivo").classList.remove("ocupado");
    document.getElementById("piso-verbo").innerText = "Haz clic aquí para colocar bloque";
    document.getElementById("piso-verbo").classList.remove("ocupado");
    document.getElementById("piso-adjetivo").innerText = "Haz clic aquí para colocar bloque";
    document.getElementById("piso-adjetivo").classList.remove("ocupado");

    // Cargar bloques de palabras mezclados
    const contenedorBloques = document.getElementById("bloques-disponibles");
    contenedorBloques.innerHTML = "";
    
    const palabrasMezcladas = [...reto.palabras].sort(() => Math.random() - 0.5);
    palabrasMezcladas.forEach(palabra => {
        const btn = document.createElement("button");
        btn.className = "btn-bloque-palabra";
        btn.innerText = palabra;
        btn.onclick = () => seleccionarBloque(palabra, btn);
        contenedorBloques.appendChild(btn);
    });
}

function seleccionarBloque(palabra, elemento) {
    document.querySelectorAll(".btn-bloque-palabra").forEach(b => b.classList.remove("seleccionado"));
    palabraSeleccionada = palabra;
    elementoPalabraSeleccionada = elemento;
    elemento.classList.add("seleccionado");
}

function colocarEnPiso(categoria) {
    const pisoDiv = document.getElementById(`piso-${categoria}`);
    
    // Si el piso ya tiene una palabra, al hacer clic la devolvemos / quitamos para corregir
    if (colocaciones[categoria]) {
        const palabraAnterior = colocaciones[categoria];
        colocaciones[categoria] = null;
        pisoDiv.innerText = "Haz clic aquí para colocar bloque";
        pisoDiv.classList.remove("ocupado");
        
        // Reactivar el botón de esa palabra en la lista inferior
        const botones = document.querySelectorAll(".btn-bloque-palabra");
        botones.forEach(b => {
            if (b.innerText === palabraAnterior && b.style.opacity === "0.4") {
                b.style.opacity = "1";
                b.style.pointerEvents = "auto";
            }
        });
        document.getElementById("mensaje-juego-m3").innerText = "";
        return;
    }

    // Si no ha seleccionado ninguna palabra de la lista inferior
    if (!palabraSeleccionada) {
        const msg = document.getElementById("mensaje-juego-m3");
        msg.innerText = "⚠️ Primero haz clic en un bloque de palabras abajo.";
        msg.style.color = "#d97706";
        return;
    }

    // Colocar la palabra seleccionada en el piso
    colocaciones[categoria] = palabraSeleccionada;
    pisoDiv.innerText = `🧱 ${palabraSeleccionada}`;
    pisoDiv.classList.add("ocupado");

    // Deshabilitar visualmente el botón usado
    if (elementoPalabraSeleccionada) {
        elementoPalabraSeleccionada.style.opacity = "0.4";
        elementoPalabraSeleccionada.style.pointerEvents = "none";
    }

    palabraSeleccionada = null;
    elementoPalabraSeleccionada = null;
    document.getElementById("mensaje-juego-m3").innerText = "";
}

function verificarRascacielos() {
    const msg = document.getElementById("mensaje-juego-m3");
    const reto = retosMezcladosM3[indiceRetoActualM3];

    if (!colocaciones.sustantivo || !colocaciones.verbo || !colocaciones.adjetivo) {
        msg.innerText = "⚠️ ¡Faltan pisos por construir! Coloca bloques en los tres pisos del edificio.";
        msg.style.color = "#ef4444";
        return;
    }

    const esCorrectoSustantivo = (colocaciones.sustantivo === reto.sustantivo);
    const esCorrectoVerbo = (colocaciones.verbo === reto.verbo);
    const esCorrectoAdjetivo = (colocaciones.adjetivo === reto.adjetivo);

    if (esCorrectoSustantivo && esCorrectoVerbo && esCorrectoAdjetivo) {
        msg.innerText = "🎉 ¡Increíble! El rascacielos quedó perfecto y muy firme.";
        msg.style.color = "#10b981";

        setTimeout(() => {
            indiceRetoActualM3++;
            if (indiceRetoActualM3 < retosMezcladosM3.length) {
                cargarRetoM3();
            } else {
                finalizarJuegoM3();
            }
        }, 1800);
    } else {
        msg.innerText = "❌ ¡Estructura inestable! Haz clic en los pisos para retirar las palabras incorrectas y reacomodarlas.";
        msg.style.color = "#ef4444";
    }
}

function finalizarJuegoM3() {
    const zonaJuego = document.getElementById("contenedor-juego-m3");
    zonaJuego.innerHTML = `
        <div class="tarjeta-victoria-m3 aparecer-frase">
            <h2 style="color: #10b981; margin-top: 0;">🏆 ¡Maestro Ingeniero! Rascacielos Completado 🏗️</h2>
            <p style="font-size: 1.15rem; color: #475569; margin: 10px 0 20px 0;">
                Has demostrado ser un experto combinando sustantivos, verbos y adjetivos en la construcción de oraciones.
            </p>
            <button class="btn-final-inicio" onclick="completarModulo3()">
                🏠 Guardar Logro y Volver al Inicio
            </button>
        </div>
    `;
}