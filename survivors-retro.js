/**
 * SURVIVORS - RETRO EDITION
 * Control principal con estilo Pac-Man
 */

// Variables globales (MISMAS QUE ANTES)
let intervaloSimulacion = null;
let opcionSeleccionada = null;
let nPersonajesConfig = null;
let arrayEntidades = null;
let arrayPersonajes = null;
let alturaActual = 30;
let anchuraActual = 30;
let velocidadActual = 150;
let nPersonajesActual = 0;
let alturaRecomendada = 30;
let anchuraRecomendada = 30;
let simulacionPausada = false;
let victoriasBuenos = 0;
let victoriasMalos = 0;

document.addEventListener('DOMContentLoaded', () => {
    calcularDimensionesRecomendadas();
    cargarVictorias();
    
    document.getElementById('alturaInput').addEventListener('input', validarInputs);
    document.getElementById('anchuraInput').addEventListener('input', validarInputs);
    document.getElementById('numPersonajes').addEventListener('input', () => {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        validarBotonInicio();
    });
    
    window.addEventListener('resize', calcularDimensionesRecomendadas);
});

// ===== FUNCIONES DE DIMENSIONES (IGUALES) =====
function calcularDimensionesRecomendadas() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const charWidth = 20;
    const charHeight = 24;
    
    const availableWidth = screenWidth * 0.8;
    const availableHeight = screenHeight * 0.6;
    
    let maxColumns = Math.floor(availableWidth / charWidth);
    let maxRows = Math.floor(availableHeight / charHeight);
    
    maxColumns = Math.min(Math.max(maxColumns, 20), 80);
    maxRows = Math.min(Math.max(maxRows, 10), 40);
    
    maxColumns = maxColumns % 2 === 0 ? maxColumns : maxColumns - 1;
    maxRows = maxRows % 2 === 0 ? maxRows : maxRows - 1;
    
    alturaRecomendada = maxRows;
    anchuraRecomendada = maxColumns;
}

function ajustarDimensionesRecomendadas() {
    document.getElementById('alturaInput').value = alturaRecomendada;
    document.getElementById('anchuraInput').value = anchuraRecomendada;
    alturaActual = alturaRecomendada;
    anchuraActual = anchuraRecomendada;
    validarInputs();
}

function validarInputs() {
    const altura = parseInt(document.getElementById('alturaInput').value);
    const anchura = parseInt(document.getElementById('anchuraInput').value);
    
    if (!isNaN(altura) && !isNaN(anchura) && 
        altura >= 10 && altura % 2 === 0 && 
        anchura >= 10 && anchura % 2 === 0) {
        alturaActual = altura;
        anchuraActual = anchura;
        validarBotonInicio();
        return true;
    }
    
    document.getElementById('startBtn').disabled = true;
    return false;
}

function validarBotonInicio() {
    const btnStart = document.getElementById('startBtn');
    
    if (opcionSeleccionada === null) {
        btnStart.disabled = true;
        return false;
    }
    
    if (opcionSeleccionada === 1) {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        btnStart.disabled = !(nPersonajesConfig >= 2 && nPersonajesConfig % 2 === 0 && nPersonajesConfig <= 200);
    } else {
        btnStart.disabled = false;
    }
    
    return !btnStart.disabled;
}

function seleccionarOpcion(opcion) {
    opcionSeleccionada = opcion;
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    
    const nPersonajesInput = document.getElementById('nPersonajesInput');
    if (opcion === 1) {
        nPersonajesInput.classList.remove('hidden');
    } else {
        nPersonajesInput.classList.add('hidden');
    }
    
    validarBotonInicio();
}

// ===== VELOCIDAD (CORREGIDA) =====
function ajustarVelocidad(cambio) {
    velocidadActual = Math.max(50, Math.min(500, velocidadActual + cambio));
    document.getElementById('velocidadDisplay').textContent = velocidadActual + 'ms';
    
    if (intervaloSimulacion) {
        detenerSimulacion();
        continuarSimulacion();
    }
}

// ===== VICTORIAS =====
function actualizarVictoriasVisuales() {
    document.getElementById('victoriasBuenos').textContent = victoriasBuenos;
    document.getElementById('victoriasMalos').textContent = victoriasMalos;
}

function guardarVictorias() {
    localStorage.setItem('victoriasBuenos', victoriasBuenos);
    localStorage.setItem('victoriasMalos', victoriasMalos);
}

function cargarVictorias() {
    const guardadasBuenos = localStorage.getItem('victoriasBuenos');
    const guardadasMalos = localStorage.getItem('victoriasMalos');
    
    if (guardadasBuenos !== null) victoriasBuenos = parseInt(guardadasBuenos);
    if (guardadasMalos !== null) victoriasMalos = parseInt(guardadasMalos);
    
    actualizarVictoriasVisuales();
}

function reiniciarVictorias() {
    if (confirm('RESET HIGH SCORES?')) {
        victoriasBuenos = 0;
        victoriasMalos = 0;
        actualizarVictoriasVisuales();
        guardarVictorias();
    }
}

// ===== CONTADORES =====
// ===== ACTUALIZAR CONTADORES VISUALES =====
function actualizarContadoresVisuales() {
    const total = Personajes.getnPersonajes();
    const buenos = Buenos.getnBuenos();
    const malos = Malos.getnMalos();
    
    // Actualizar estadísticas principales
    const totalStats = document.getElementById('totalStats');
    const buenosStats = document.getElementById('buenosStats');
    const malosStats = document.getElementById('malosStats');
    
    if (totalStats) totalStats.textContent = total;
    if (buenosStats) buenosStats.textContent = buenos;
    if (malosStats) malosStats.textContent = malos;
    
    // Mostrar/ocultar panel de estadísticas
    const statsPanel = document.getElementById('statsPanel');
    if (statsPanel) {
        if (total > 0) {
            statsPanel.classList.remove('hidden');
        } else {
            statsPanel.classList.add('hidden');
        }
    }
    
    // Mostrar/ocultar contadores de personajes (si existen)
    const charCounters = document.getElementById('charCounters');
    if (charCounters) {
        if (total > 0) {
            charCounters.classList.remove('hidden');
        } else {
            charCounters.classList.add('hidden');
        }
    }
}

// ===== INICIAR =====
function iniciarSimulacion() {
    if (!validarInputs()) {
        alert('INVALID DIMENSIONS');
        return;
    }
    
    detenerSimulacion();
    simulacionPausada = false;
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    const altura = alturaActual;
    const anchura = anchuraActual;
    const porBuenos = Funciones.numPorcent(altura, anchura);
    const porMalos = Funciones.numPorcent(altura, anchura);
    
    let nPersonajes;
    if (opcionSeleccionada === 1) {
        nPersonajes = nPersonajesConfig;
    } else if (opcionSeleccionada === 2) {
        nPersonajes = porMalos + porBuenos;
    } else {
        const areaDefault = altura * anchura;
        nPersonajes = Math.floor(Math.random() * (areaDefault * 0.01)) + 1;
        while (nPersonajes % 2 !== 0) {
            nPersonajes = Math.floor(Math.random() * (areaDefault * 0.01)) + 1;
        }
    }
    
    nPersonajesActual = nPersonajes;
    alturaActual = altura;
    anchuraActual = anchura;
    
    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    arrayPersonajes = Array(nPersonajes).fill(null);
    Funciones.generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcionSeleccionada);
    
    actualizarContadoresVisuales();
    document.getElementById('menuPanel').classList.add('hidden');
    document.getElementById('tablero').classList.remove('hidden');
    document.getElementById('resultadoPanel').classList.add('hidden');
    
    intervaloSimulacion = setInterval(() => actualizarJuego(altura, anchura, nPersonajes), velocidadActual);
}

// ===== ACTUALIZAR JUEGO =====
function actualizarJuego(altura, anchura, nPersonajes) {
    Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Buenos", "Malos");
    Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Malos", "Buenos");
    
    Funciones.movimiento(altura, anchura, arrayEntidades);
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            if (arrayEntidades[i][j] !== null) {
                const entidad = arrayEntidades[i][j];
                const auxX = entidad.getX();
                const auxY = entidad.getY();
                
                if (auxX !== j || auxY !== i) {
                    if (arrayEntidades[auxY][auxX] === null) {
                        arrayEntidades[auxY][auxX] = entidad;
                        arrayEntidades[i][j] = null;
                    } 
                    else if ((arrayEntidades[auxY][auxX] instanceof Malos && entidad instanceof Buenos) ||
                               (arrayEntidades[auxY][auxX] instanceof Buenos && entidad instanceof Malos)) {
                        
                        const defensor = arrayEntidades[auxY][auxX];
                        const resultado = Math.floor(Math.random() * (entidad.getVida() + defensor.getVida()));
                        
                        if (resultado < entidad.getVida()) {
                            Funciones.eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, defensor, auxX, auxY);
                        } else {
                            Funciones.eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, entidad, j, i);
                        }
                        
                        actualizarContadoresVisuales();
                    }
                }
            }
        }
    }
    
    document.getElementById('tableroContainer').innerHTML = Funciones.pintarTablero(altura, anchura, arrayEntidades);
    actualizarContadoresVisuales();
    
    if (Buenos.getnBuenos() <= 0 || Malos.getnMalos() <= 0) {
        detenerSimulacion();
        mostrarResultado();
    }
}

// ===== CONTROL =====
function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
        simulacionPausada = true;
    }
}

function continuarSimulacion() {
    if (simulacionPausada && arrayEntidades && arrayPersonajes) {
        intervaloSimulacion = setInterval(
            () => actualizarJuego(alturaActual, anchuraActual, nPersonajesActual), 
            velocidadActual
        );
        simulacionPausada = false;
    }
}

// ===== RESULTADO =====
function mostrarResultado() {
    const total = Personajes.getnPersonajes();
    const buenos = Buenos.getnBuenos();
    const malos = Malos.getnMalos();
    
    const resultadoPanel = document.getElementById('resultadoPanel');
    const titulo = document.getElementById('resultadoTitulo');
    const color = buenos <= 0 ? '#f00' : '#0f0';
    
    if (buenos <= 0) {
        victoriasMalos++;
    } else {
        victoriasBuenos++;
    }
    
    guardarVictorias();
    actualizarVictoriasVisuales();
    
    titulo.textContent = buenos <= 0 ? 'BAD WIN!' : 'GOOD WIN!';
    titulo.style.color = color;
    
    document.getElementById('resultadoTotal').textContent = total;
    document.getElementById('resultadoBuenos').textContent = buenos;
    document.getElementById('resultadoMalos').textContent = malos;
    
    document.getElementById('tablero').classList.add('hidden');
    resultadoPanel.classList.remove('hidden');
}

// ===== VOLVER AL MENÚ =====
function volverAlMenu() {
    detenerSimulacion();
    simulacionPausada = false;
    
    opcionSeleccionada = null;
    nPersonajesConfig = null;
    arrayEntidades = null;
    arrayPersonajes = null;
    
    document.getElementById('tablero').classList.add('hidden');
    document.getElementById('resultadoPanel').classList.add('hidden');
    document.getElementById('menuPanel').classList.remove('hidden');
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('nPersonajesInput').classList.add('hidden');
    document.getElementById('startBtn').disabled = true;
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    if (document.getElementById('tableroContainer')) {
        document.getElementById('tableroContainer').innerHTML = '';
    }
}

// ===== GLOBALES =====
window.iniciarSimulacion = iniciarSimulacion;
window.detenerSimulacion = detenerSimulacion;
window.continuarSimulacion = continuarSimulacion;
window.volverAlMenu = volverAlMenu;
window.seleccionarOpcion = seleccionarOpcion;
window.ajustarDimensionesRecomendadas = ajustarDimensionesRecomendadas;
window.ajustarVelocidad = ajustarVelocidad;
window.reiniciarVictorias = reiniciarVictorias;

// ===== VALIDAR BOTÓN DE INICIO =====
function validarBotonInicio() {
    const btnStart = document.getElementById('startBtn');
    
    if (opcionSeleccionada === null) {
        btnStart.disabled = true;
        return false;
    }
    
    if (opcionSeleccionada === 1) {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        btnStart.disabled = !(nPersonajesConfig >= 2 && nPersonajesConfig % 2 === 0 && nPersonajesConfig <= 200);
    } else {
        btnStart.disabled = false;
    }
    
    return !btnStart.disabled;
}

// ===== SELECCIONAR OPCIÓN =====
function seleccionarOpcion(opcion) {
    opcionSeleccionada = opcion;
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
    
    const nPersonajesInput = document.getElementById('nPersonajesInput');
    if (opcion === 1) {
        nPersonajesInput.classList.remove('hidden');
    } else {
        nPersonajesInput.classList.add('hidden');
    }
    
    validarBotonInicio();
}

// ===== VALIDAR INPUTS =====
function validarInputs() {
    const altura = parseInt(document.getElementById('alturaInput').value);
    const anchura = parseInt(document.getElementById('anchuraInput').value);
    
    if (!isNaN(altura) && !isNaN(anchura) && 
        altura >= 10 && altura % 2 === 0 && 
        anchura >= 10 && anchura % 2 === 0) {
        alturaActual = altura;
        anchuraActual = anchura;
        validarBotonInicio();
        return true;
    }
    
    document.getElementById('startBtn').disabled = true;
    return false;
}