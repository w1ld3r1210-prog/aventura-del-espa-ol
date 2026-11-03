// Banco de 10 frases para el juego (Corregido y optimizado)
const bancoDeFrases = [
    { fraseInicial: "El pajaro canta en el arbol", fraseCorrecta: "El pájaro canta en el árbol" },
    { fraseInicial: "Ayer comi una rica manzana", fraseCorrecta: "Ayer comí una rica manzana" },
    { fraseInicial: "Mi mama me compro un boligrafo", fraseCorrecta: "Mi mamá me compró un bolígrafo" },
    { fraseInicial: "El camion azul llego temprano", fraseCorrecta: "El camión azul llegó temprano" },
    { fraseInicial: "El telefono sono en la fantastica noche", fraseCorrecta: "El teléfono sonó en la fantástica noche" },
    { fraseInicial: "El medico reviso al paciente rapidamente", fraseCorrecta: "El médico revisó al paciente rápidamente" },
    { fraseInicial: "Sofia jugo futbol con sus amigos", fraseCorrecta: "Sofía jugó fútbol con sus amigos" },
    { fraseInicial: "La musica suena muy bonito aqui", fraseCorrecta: "La música suena muy bonito aquí" },
    { fraseInicial: "El examen de ingles estuvo facil", fraseCorrecta: "El examen de inglés estuvo fácil" },
    { fraseInicial: "El murcielago volaba cerca del jardin", fraseCorrecta: "El murciélago volaba cerca del jardín" }
];

let preguntasSeleccionadas = [];
let indiceActual = 0;
let errores = 0;
let tildeActiva = false;
let fraseModificada = [];

const partesAhorcado = ["cabeza", "cuerpo", "brazo-izq", "brazo-der", "pierna-izq", "pierna-der"];

function mostrarJuego() {
    // Se corrigió el ID a "btn-iniciar-m1" para que coincida con el HTML
    document.getElementById("btn-iniciar-m1").style.display = "none"; 
    document.getElementById("contenedor-juego").style.display = "block";
    reiniciarJuego();
}

function reiniciarJuego() {
    // 1. Escoger 3 frases aleatorias del banco de 10 sin repetir
    const copiaBanco = [...bancoDeFrases].sort(() => 0.5 - Math.random());
    preguntasSeleccionadas = copiaBanco.slice(0, 3);
    
    // 2. Reiniciar variables de control
    indiceActual = 0;
    errores = 0;
    
    // 3. Ocultar monito del ahorcado
    partesAhorcado.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    
    // 4. Mostrar panel de herramientas
    document.querySelector(".herramientas-juego").style.display = "flex";
    
    // Ocultar botones especiales si existían de una partida previa
    const btnReiniciar = document.getElementById("btn-reiniciar-juego");
    if (btnReiniciar) btnReiniciar.style.display = "none";
    
    const btnInicio = document.getElementById("btn-volver-inicio");
    if (btnInicio) btnInicio.style.display = "none";

    cargarFrase();
}

function cargarFrase() {
    tildeActiva = false;
    document.getElementById("herramienta-tilde").classList.remove("activo");
    document.getElementById("mensaje-juego").innerText = "";
    document.getElementById("num-frase").innerText = indiceActual + 1;
    
    const fraseTexto = preguntasSeleccionadas[indiceActual].fraseInicial;
    fraseModificada = fraseTexto.split("");
    
    dibujarFrase();
}

function dibujarFrase() {
    const contenedor = document.getElementById("frase-juego");
    contenedor.innerHTML = "";
    
    fraseModificada.forEach((letra, index) => {
        const span = document.createElement("span");
        if (letra !== " ") {
            span.classList.add("letra-click");
            span.innerText = letra;
            if ("áéíóúÁÉÍÓÚ".includes(letra)) {
                span.classList.add("letra-con-tilde");
            }
            span.onclick = () => modificarLetra(index);
        } else {
            span.innerHTML = "&nbsp;";
        }
        contenedor.appendChild(span);
    });
}

function activarTilde() {
    tildeActiva = !tildeActiva;
    const boton = document.getElementById("herramienta-tilde");
    if (tildeActiva) {
        boton.classList.add("activo");
    } else {
        boton.classList.remove("activo");
    }
}

function modificarLetra(index) {
    if (!tildeActiva) {
        const msg = document.getElementById("mensaje-juego");
        msg.innerText = "⚠️ ¡Primero haz clic abajo en 'Usar Tilde'!";
        msg.style.color = "#e67e22";
        return;
    }
    
    let letra = fraseModificada[index];
    
    // AQUÍ ESTÁ EL CAMBIO: Se corrigió 'ú':'u' al final para que la 'u' y la 'ú' funcionen perfectamente
    const conTilde = { 
        'a':'á', 'e':'é', 'i':'í', 'o':'ó', 'u':'ú', 
        'á':'a', 'é':'e', 'í':'i', 'ó':'o', 'ú':'u' 
    };
    
    if (conTilde[letra.toLowerCase()]) {
        const esMayuscula = letra === letra.toUpperCase();
        let nuevaLetra = conTilde[letra.toLowerCase()];
        fraseModificada[index] = esMayuscula ? nuevaLetra.toUpperCase() : nuevaLetra;
        dibujarFrase();
        document.getElementById("mensaje-juego").innerText = "";
    }
}

function verificarRespuesta() {
    const tuFrase = fraseModificada.join("");
    const correcta = preguntasSeleccionadas[indiceActual].fraseCorrecta;
    const msg = document.getElementById("mensaje-juego");
    
    if (tuFrase === correcta) {
        msg.innerText = "🎉 ¡Excelente! Colocaste las tildes correctamente.";
        msg.style.color = "#2ecc71";
        
        setTimeout(() => {
            indiceActual++;
            if (indiceActual < preguntasSeleccionadas.length) {
                cargarFrase();
            } else {
                // ¡GANÓ EL JUEGO COMPLETO!
                msg.innerHTML = "🏆 ¡Felicidades! Completaste todo el test. ¡Módulo 1 superado!";
                msg.style.color = "#2ecc71";
                document.querySelector(".herramientas-juego").style.display = "none";
                
                // CAMBIO AQUÍ: Usamos sessionStorage en vez de localStorage
                sessionStorage.setItem("modulo1_completado", "true");
                
                mostrarBotonVolverInicio();
            }
        }, 1500);
        
    } else {
        // Error en la frase
        if (errores < partesAhorcado.length) {
            document.getElementById(partesAhorcado[errores]).style.display = "block";
            errores++;
        }
        
        if (errores >= partesAhorcado.length) {
            // PERDIÓ EL JUEGO
            msg.innerHTML = `💀 <strong>¡El ahorcado se completó! Has perdido.</strong><br>
                             <span style="color: #2d3436; font-size: 1.1rem;">La respuesta correcta era: </span>
                             <strong style="color: #0984e3; font-size: 1.2rem;">"${correcta}"</strong>`;
            
            document.querySelector(".herramientas-juego").style.display = "none";
            mostrarBotonReiniciar();
        } else {
            msg.innerText = "❌ Ups, esa no es la colocación correcta. ¡El ahorcado avanzó!";
            msg.style.color = "#e74c3c";
        }
    }
}

function mostrarBotonReiniciar() {
    let btn = document.getElementById("btn-reiniciar-juego");
    if (!btn) {
        btn = document.createElement("button");
        btn.id = "btn-reiniciar-juego";
        btn.className = "boton-reiniciar";
        btn.onclick = reiniciarJuego;
        document.getElementById("contenedor-juego").appendChild(btn);
    }
    btn.innerText = "🔄 Intentar de nuevo";
    btn.style.display = "block";
}

function mostrarBotonVolverInicio() {
    let btn = document.getElementById("btn-volver-inicio");
    if (!btn) {
        btn = document.createElement("a");
        btn.id = "btn-volver-inicio";
        btn.className = "boton-exito-inicio";
        btn.href = "index.html";
        document.getElementById("contenedor-juego").appendChild(btn);
    }
    btn.innerHTML = "🏠 Volver al Inicio (Módulo Completado ✔️)";
    btn.style.display = "inline-block";
}