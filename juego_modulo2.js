// Lista ampliada de retos para el Módulo 2
const retosModulo2 = [
    {
        textoInicio: "Fui a la tienda y compré manzanas",
        textoFin: "peras y uvas.",
        opciones: [",", ".", "¡!", "¿?"],
        correcta: ",",
        explicacion: "¡Bien hecho! Usamos la **coma** para enumerar cosas en una lista."
    },
    {
        textoInicio: "El perro corrió por el parque",
        textoFin: "Luego se acostó a descansar.",
        opciones: [".", ",", "¿?", "¡!"],
        correcta: ".",
        explicacion: "¡Excelente! El **punto** frena la oración para cerrar una idea completa."
    },
    {
        textoInicio: "",
        textoFin: "Cómo te llamas?",
        opciones: ["¿?", "¡!", ",", "."],
        correcta: "¿?",
        explicacion: "¡Muy bien! Los **signos de interrogación** sirven para hacer preguntas."
    },
    {
        textoInicio: "Ganamos el partido de fútbol",
        textoFin: "",
        opciones: ["¡!", "¿?", ",", "."],
        correcta: "¡!",
        explicacion: "¡Genial! Los **signos de exclamación** expresan emoción y alegría."
    },
    {
        textoInicio: "Hola Sofía",
        textoFin: "vamos a jugar al parque de niños.",
        opciones: [",", ".", "¿?", "¡!"],
        correcta: ",",
        explicacion: "¡Correcto! Usamos **coma** para hacer una pequeña pausa al dirigirte a alguien."
    },
    {
        textoInicio: "Me encanta leer cuentos de misterio",
        textoFin: "Todos los días aprendo cosas nuevas.",
        opciones: [".", ",", "¡!", "¿?"],
        correcta: ".",
        explicacion: "¡Súper! El **punto** separa dos oraciones independientes."
    },
    {
        textoInicio: "",
        textoFin: "Quieres ir por un helado de fresa?",
        opciones: ["¿?", "¡!", ".", ","],
        correcta: "¿?",
        explicacion: "¡Exacto! Las preguntas siempre van entre **signos de interrogación**."
    },
    {
        textoInicio: "En la granja vimos vacas",
        textoFin: "caballos y ovejas.",
        opciones: [",", ".", "¡!", "¿?"],
        correcta: ",",
        explicacion: "¡Muy bien! Usamos **coma** para separar elementos de una lista."
    }
];

let retosMezclados = [];
let indiceRetoActual = 0;
let signoSeleccionado = null;

function mostrarJuegoM2() {
    document.getElementById("btn-iniciar-m2").style.display = "none";
    document.getElementById("contenedor-juego-m2").style.display = "block";
    
    // Mezclar las preguntas en orden aleatorio
    retosMezclados = [...retosModulo2].sort(() => Math.random() - 0.5);
    indiceRetoActual = 0;
    
    cargarRetoM2();
}

function cargarRetoM2() {
    signoSeleccionado = null;
    const reto = retosMezclados[indiceRetoActual];
    
    document.getElementById("num-reto-m2").innerText = indiceRetoActual + 1;
    document.getElementById("total-retos-m2").innerText = retosMezclados.length;
    document.getElementById("mensaje-juego-m2").innerText = "";
    document.getElementById("mensaje-juego-m2").className = "mensaje-alerta";

    // Preparar la frase con animación de entrada
    const contenedorFrase = document.getElementById("frase-juego-m2");
    contenedorFrase.classList.remove("triturar-frase", "aparecer-frase");
    
    contenedorFrase.innerHTML = `
        <span>${reto.textoInicio}</span>
        <span id="hueco-signo" class="hueco-vacio">[ ? ]</span>
        <span>${reto.textoFin}</span>
    `;
    
    // Forzar reinicio de animación
    void contenedorFrase.offsetWidth;
    contenedorFrase.classList.add("aparecer-frase");

    // Generar opciones
    const contenedorOpciones = document.getElementById("opciones-signos");
    contenedorOpciones.innerHTML = "";
    
    reto.opciones.forEach(opcion => {
        const btn = document.createElement("button");
        btn.className = "btn-signo-opcion";
        btn.innerText = opcion;
        btn.onclick = () => seleccionarSignoOp(opcion, btn);
        contenedorOpciones.appendChild(btn);
    });
}

function seleccionarSignoOp(signo, elementoBoton) {
    signoSeleccionado = signo;
    
    const botones = document.querySelectorAll(".btn-signo-opcion");
    botones.forEach(b => b.classList.remove("activo"));
    elementoBoton.classList.add("activo");

    const hueco = document.getElementById("hueco-signo");
    hueco.innerText = `[ ${signo} ]`;
    hueco.classList.add("lleno");
}

function verificarRespuestaM2() {
    const msg = document.getElementById("mensaje-juego-m2");
    
    if (!signoSeleccionado) {
        msg.innerText = "⚠️ Por favor, selecciona un signo antes de comprobar.";
        msg.style.color = "#e67e22";
        return;
    }

    const reto = retosMezclados[indiceRetoActual];

    if (signoSeleccionado === reto.correcta) {
        msg.innerHTML = `✅ ${reto.explicacion}`;
        msg.style.color = "#10b981";

        setTimeout(() => {
            // Aplicar efecto de triturado visual antes de cambiar
            const contenedorFrase = document.getElementById("frase-juego-m2");
            contenedorFrase.classList.remove("aparecer-frase");
            contenedorFrase.classList.add("triturar-frase");

            setTimeout(() => {
                indiceRetoActual++;
                if (indiceRetoActual < retosMezclados.length) {
                    cargarRetoM2();
                } else {
                    finalizarJuegoM2();
                }
            }, 600); // Duración de la animación de triturado

        }, 1800);
    } else {
        msg.innerText = "❌ Signo incorrecto. ¡Prueba con otro signo!";
        msg.style.color = "#ef4444";
    }
}

function finalizarJuegoM2() {
    const zonaJuego = document.getElementById("contenedor-juego-m2");
    zonaJuego.innerHTML = `
        <div class="tarjeta-victoria-m2 aparecer-frase">
            <h2 style="color: #10b981; margin-top: 0;">🎉 ¡Felicitaciones! Has reparado todas las señales 🚦</h2>
            <p style="font-size: 1.15rem; color: #475569; margin: 10px 0 20px 0;">
                Demostraste un excelente dominio de la coma, el punto y los signos de puntuación.
            </p>
            <button class="btn-final-inicio" onclick="completarModulo2()">
                🏠 Guardar Logro y Volver al Inicio
            </button>
        </div>
    `;
}

function completarModulo2() {
    localStorage.setItem("modulo2_completado", "true");
    alert("¡Felicidades! Has completado el Módulo 2. ¡Tu trofeo y retos se han actualizado!");
    window.location.href = "index.html";
}