/**
 * ARCHIVO PRINCIPAL
 * Versión con interfaz gráfica completa
 */

let intervaloSimulacion = null;
let opcionSeleccionada = null;
let nPersonajesConfig = null;
let arrayEntidades = null;
let arrayPersonajes = null;
let alturaActual = 30;
let anchuraActual = 30;

/**
 * INICIALIZACIÓN
 */
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar menú inicial
    mostrarMenu();
    
    // Configurar eventos de inputs
    document.getElementById('alturaInput').addEventListener('input', validarInputs);
    document.getElementById('anchuraInput').addEventListener('input', validarInputs);
    document.getElementById('numPersonajes').addEventListener('input', () => {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        validarBotonInicio();
    });
});

/**
 * VALIDAR INPUTS
 */
function validarInputs() {
    const altura = parseInt(document.getElementById('alturaInput').value);
    const anchura = parseInt(document.getElementById('anchuraInput').value);
    
    // Validar que sean pares y >= 30
    if (altura >= 30 && altura % 2 === 0 && anchura >= 30 && anchura % 2 === 0) {
        alturaActual = altura;
        anchuraActual = anchura;
        validarBotonInicio();
    } else {
        document.getElementById('startBtn').disabled = true;
    }
}

/**
 * VALIDAR BOTÓN DE INICIO
 */
function validarBotonInicio() {
    const btnStart = document.getElementById('startBtn');
    
    if (opcionSeleccionada === null) {
        btnStart.disabled = true;
        return;
    }
    
    if (opcionSeleccionada === 1) {
        // Para opción 1, necesitamos número de personajes
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        btnStart.disabled = !(nPersonajesConfig >= 2 && nPersonajesConfig % 2 === 0);
    } else {
        // Para opciones 2 y 3, solo necesitamos altura y anchura válidas
        btnStart.disabled = false;
    }
}

/**
 * SELECCIONAR OPCIÓN DEL MENÚ
 */
function seleccionarOpcion(opcion) {
    opcionSeleccionada = opcion;
    
    // Quitar selección de todos los botones
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Añadir selección al botón clickeado
    event.target.closest('.menu-btn').classList.add('selected');
    
    // Mostrar/ocultar input de número de personajes
    const nPersonajesInput = document.getElementById('nPersonajesInput');
    if (opcion === 1) {
        nPersonajesInput.classList.remove('hidden');
    } else {
        nPersonajesInput.classList.add('hidden');
    }
    
    validarBotonInicio();
}

/**
 * INICIAR SIMULACIÓN
 */
function iniciarSimulacion() {
    // Resetear contadores
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    
    // Obtener valores
    const altura = alturaActual;
    const anchura = anchuraActual;
    
    // Calcular porcentajes
    const porBuenos = Funciones.numPorcent(altura, anchura);
    const porMalos = Funciones.numPorcent(altura, anchura);
    
    // Determinar número de personajes
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
    
    // Crear arrays
    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    arrayPersonajes = Array(nPersonajes).fill(null);
    
    // Generar mundo
    Funciones.generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcionSeleccionada);
    
    // Actualizar contadores
    actualizarContadoresVisuales();
    
    // Ocultar menú, mostrar tablero y controles
    document.getElementById('menuPanel').classList.add('hidden');
    document.getElementById('tablero').classList.remove('hidden');
    document.getElementById('simulationControls').classList.remove('hidden');
    document.getElementById('resultadoPanel').classList.add('hidden');
    
    // Iniciar simulación
    intervaloSimulacion = setInterval(() => actualizarJuego(altura, anchura, nPersonajes), 150);
}

/**
 * ACTUALIZAR JUEGO
 */
function actualizarJuego(altura, anchura, nPersonajes) {
    // Actualizar referencias de enemigos
    Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Buenos", "Malos");
    Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Malos", "Buenos");
    
    // Mover personajes
    Funciones.movimiento(altura, anchura, arrayEntidades);
    
    // Procesar combates
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
    
    // Pintar tablero
    document.getElementById('tablero').innerHTML = Funciones.pintarTablero(altura, anchura, arrayEntidades);
    actualizarContadoresVisuales();
    
    // Verificar fin del juego
    if (Buenos.getnBuenos() <= 0 || Malos.getnMalos() <= 0) {
        detenerSimulacion();
        mostrarResultado();
    }
}

/**
 * ACTUALIZAR CONTADORES
 */
function actualizarContadoresVisuales() {
    document.getElementById('totalStats').textContent = Personajes.getnPersonajes();
    document.getElementById('buenosStats').textContent = Buenos.getnBuenos();
    document.getElementById('malosStats').textContent = Malos.getnMalos();
}

/**
 * DETENER SIMULACIÓN
 */
function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
    }
}

/**
 * MOSTRAR RESULTADO FINAL
 */
function mostrarResultado() {
    const total = Personajes.getnPersonajes();
    const buenos = Buenos.getnBuenos();
    const malos = Malos.getnMalos();
    
    const resultadoPanel = document.getElementById('resultadoPanel');
    const titulo = document.getElementById('resultadoTitulo');
    const color = buenos <= 0 ? '#ff0000' : '#00ff00';
    
    titulo.textContent = buenos <= 0 ? '💀 VICTORIA DE LOS MALOS 💀' : '✨ VICTORIA DE LOS BUENOS ✨';
    titulo.style.color = color;
    titulo.style.textShadow = `0 0 20px ${color}`;
    
    resultadoPanel.style.borderColor = color;
    
    document.getElementById('resultadoTotal').textContent = total;
    document.getElementById('resultadoBuenos').textContent = buenos;
    document.getElementById('resultadoMalos').textContent = malos;
    
    document.getElementById('tablero').classList.add('hidden');
    document.getElementById('simulationControls').classList.add('hidden');
    resultadoPanel.classList.remove('hidden');
}

/**
 * VOLVER AL MENÚ
 */
function volverAlMenu() {
    detenerSimulacion();
    
    // Resetear variables
    opcionSeleccionada = null;
    nPersonajesConfig = null;
    
    // Ocultar paneles
    document.getElementById('tablero').classList.add('hidden');
    document.getElementById('simulationControls').classList.add('hidden');
    document.getElementById('resultadoPanel').classList.add('hidden');
    
    // Mostrar menú
    document.getElementById('menuPanel').classList.remove('hidden');
    
    // Resetear selecciones
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('nPersonajesInput').classList.add('hidden');
    document.getElementById('startBtn').disabled = true;
    
    // Resetear contadores
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
}

// Las funciones deben estar globales para los botones HTML
window.iniciarSimulacion = iniciarSimulacion;
window.detenerSimulacion = detenerSimulacion;
window.volverAlMenu = volverAlMenu;
window.seleccionarOpcion = seleccionarOpcion;