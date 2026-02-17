/**
 * ARCHIVO PRINCIPAL
 * Controla el flujo del juego
 */

// Variables globales
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

/**
 * INICIALIZACIÓN
 */
document.addEventListener('DOMContentLoaded', () => {
    calcularDimensionesRecomendadas();
    
    // Cargar victorias guardadas
    cargarVictorias();
    
    // Configurar event listeners
    document.getElementById('alturaInput').addEventListener('input', validarInputs);
    document.getElementById('anchuraInput').addEventListener('input', validarInputs);
    document.getElementById('numPersonajes').addEventListener('input', () => {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        validarBotonInicio();
    });
    
    window.addEventListener('resize', calcularDimensionesRecomendadas);
});

/**
 * CALCULAR DIMENSIONES RECOMENDADAS
 */
function calcularDimensionesRecomendadas() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    document.getElementById('screenDimensions').textContent = `${screenWidth}x${screenHeight}`;
    
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
    
    document.getElementById('recommendedDimensions').textContent = `${anchuraRecomendada}x${alturaRecomendada}`;
    
    document.getElementById('alturaInput').value = alturaRecomendada;
    document.getElementById('anchuraInput').value = anchuraRecomendada;
    document.getElementById('alturaInput').max = maxRows + 20;
    document.getElementById('anchuraInput').max = maxColumns + 20;
    
    alturaActual = alturaRecomendada;
    anchuraActual = anchuraRecomendada;
}

/**
 * AJUSTAR A DIMENSIONES RECOMENDADAS
 */
function ajustarDimensionesRecomendadas() {
    document.getElementById('alturaInput').value = alturaRecomendada;
    document.getElementById('anchuraInput').value = anchuraRecomendada;
    alturaActual = alturaRecomendada;
    anchuraActual = anchuraRecomendada;
    validarInputs();
}

/**
 * VALIDAR INPUTS
 */
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

/**
 * VALIDAR BOTÓN DE INICIO
 */
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

/**
 * SELECCIONAR OPCIÓN DEL MENÚ
 */
function seleccionarOpcion(opcion) {
    opcionSeleccionada = opcion;
    
    document.querySelectorAll('.menu-btn').forEach(btn => {
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

/**
 * AJUSTAR VELOCIDAD
 */
function ajustarVelocidad(cambio) {
    velocidadActual = Math.max(50, Math.min(500, velocidadActual + cambio));
    document.getElementById('velocidadDisplay').textContent = velocidadActual + 'ms';
    
    if (intervaloSimulacion) {
        detenerSimulacion();
        continuarSimulacion();
    }
}

/**
 * ACTUALIZAR CONTADORES VISUALES
 */
function actualizarContadoresVisuales() {
    const total = Personajes.getnPersonajes();
    const buenos = Buenos.getnBuenos();
    const malos = Malos.getnMalos();
    
    document.getElementById('totalStats').textContent = total;
    document.getElementById('buenosStats').textContent = buenos;
    document.getElementById('malosStats').textContent = malos;
    
    // Mostrar u ocultar estadísticas según haya personajes
    const statsPanel = document.getElementById('statsPanel');
    if (total > 0) {
        statsPanel.classList.remove('hidden');
    } else {
        statsPanel.classList.add('hidden');
    }
}

/**
 * ACTUALIZAR CONTADORES DE VICTORIAS
 */
function actualizarVictoriasVisuales() {
    document.getElementById('victoriasBuenos').textContent = victoriasBuenos;
    document.getElementById('victoriasMalos').textContent = victoriasMalos;
}

/**
 * GUARDAR VICTORIAS EN LOCALSTORAGE
 */
function guardarVictorias() {
    localStorage.setItem('victoriasBuenos', victoriasBuenos);
    localStorage.setItem('victoriasMalos', victoriasMalos);
}

/**
 * CARGAR VICTORIAS DESDE LOCALSTORAGE
 */
function cargarVictorias() {
    const guardadasBuenos = localStorage.getItem('victoriasBuenos');
    const guardadasMalos = localStorage.getItem('victoriasMalos');
    
    if (guardadasBuenos !== null) victoriasBuenos = parseInt(guardadasBuenos);
    if (guardadasMalos !== null) victoriasMalos = parseInt(guardadasMalos);
    
    actualizarVictoriasVisuales();
}

/**
 * REINICIAR CONTADORES DE VICTORIAS
 */
function reiniciarVictorias() {
    if (confirm('¿Seguro que quieres reiniciar el contador de victorias?')) {
        victoriasBuenos = 0;
        victoriasMalos = 0;
        actualizarVictoriasVisuales();
        guardarVictorias();
        console.log('🏆 Contadores de victorias reiniciados');
    }
}

/**
 * INICIAR SIMULACIÓN
 */
function iniciarSimulacion() {
    if (!validarInputs()) {
        alert('❌ Por favor, introduce dimensiones válidas (pares y ≥10)');
        return;
    }
    
    detenerSimulacion();
    simulacionPausada = false; // Reiniciar estado de pausa
    
    // Resetear contadores
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    const altura = alturaActual;
    const anchura = anchuraActual;
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
    
    // Guardar para continuar después
    nPersonajesActual = nPersonajes;
    alturaActual = altura;
    anchuraActual = anchura;
    
    // Crear arrays y generar mundo
    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    arrayPersonajes = Array(nPersonajes).fill(null);
    Funciones.generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcionSeleccionada);
    
    // Actualizar interfaz
    actualizarContadoresVisuales();
    document.getElementById('menuPanel').classList.add('hidden');
    document.getElementById('tablero').classList.remove('hidden');
    document.getElementById('simulationControls').classList.remove('hidden');
    document.getElementById('resultadoPanel').classList.add('hidden');
    
    // Iniciar bucle
    intervaloSimulacion = setInterval(() => actualizarJuego(altura, anchura, nPersonajes), velocidadActual);
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
                            const tipoGanador = entidad instanceof Buenos ? 'BUENO' : 'MALO';
                            console.log(`⚔️ ¡VICTORIA del ${tipoGanador}! 💪`);
                        } else {
                            Funciones.eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, entidad, j, i);
                            const tipoGanador = defensor instanceof Buenos ? 'BUENO' : 'MALO';
                            console.log(`⚔️ ¡VICTORIA del ${tipoGanador}! 💪`);
                        }
                        
                        actualizarContadoresVisuales();
                    }
                }
            }
        }
    }
    
    // Actualizar visualización
    document.getElementById('tableroContainer').innerHTML = Funciones.pintarTablero(altura, anchura, arrayEntidades);
    actualizarContadoresVisuales();
    
    // Verificar fin del juego
    if (Buenos.getnBuenos() <= 0 || Malos.getnMalos() <= 0) {
        detenerSimulacion();
        mostrarResultado();
    }
}

/**
 * DETENER SIMULACIÓN (PAUSAR)
 */
function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
        simulacionPausada = true;
        console.log('⏸️ Simulación pausada');
    }
}

/**
 * CONTINUAR SIMULACIÓN
 */
function continuarSimulacion() {
    if (simulacionPausada && arrayEntidades && arrayPersonajes) {
        intervaloSimulacion = setInterval(
            () => actualizarJuego(alturaActual, anchuraActual, nPersonajesActual), 
            velocidadActual
        );
        simulacionPausada = false;
        console.log('▶️ Simulación reanudada');
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
    
    // Actualizar contadores de victorias
    if (buenos <= 0) {
        victoriasMalos++;
        console.log(`%c🏆 VICTORIA PARA LOS MALOS (Total: ${victoriasMalos})`, 'color: #ff0000; font-size: 16px');
    } else {
        victoriasBuenos++;
        console.log(`%c🏆 VICTORIA PARA LOS BUENOS (Total: ${victoriasBuenos})`, 'color: #00ff00; font-size: 16px');
    }
    
    // Guardar en localStorage
    guardarVictorias();
    
    // Actualizar visualización
    actualizarVictoriasVisuales();
    
    // Añadir animación al contador que ganó
    const victoriaElement = buenos <= 0 ? 
        document.querySelector('.victoria-item.malos') : 
        document.querySelector('.victoria-item.buenos');
    victoriaElement.classList.add('victoria-pulse');
    setTimeout(() => victoriaElement.classList.remove('victoria-pulse'), 500);
    
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
    simulacionPausada = false; // Resetear estado de pausa
    
    // Resetear variables
    opcionSeleccionada = null;
    nPersonajesConfig = null;
    arrayEntidades = null;
    arrayPersonajes = null;
    
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
    
    // Resetear contadores de partida
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    // Limpiar tablero
    if (document.getElementById('tableroContainer')) {
        document.getElementById('tableroContainer').innerHTML = '';
    }

    limpiarConsola('📋 MENÚ PRINCIPAL');
}

/**
 * LIMPIAR CONSOLA
 */
function limpiarConsola(titulo = null) {
    console.clear();
    console.log('%c' + '═'.repeat(50), 'color: #00ffff');
    if (titulo) {
        console.log(`%c${titulo}`, 'color: #00ffff; font-size: 14px; font-weight: bold');
        console.log('%c' + '═'.repeat(50), 'color: #00ffff');
    }
    console.log('');
}

// Hacer funciones globales
window.iniciarSimulacion = iniciarSimulacion;
window.detenerSimulacion = detenerSimulacion;
window.continuarSimulacion = continuarSimulacion;
window.volverAlMenu = volverAlMenu;
window.seleccionarOpcion = seleccionarOpcion;
window.ajustarDimensionesRecomendadas = ajustarDimensionesRecomendadas;
window.ajustarVelocidad = ajustarVelocidad;
window.reiniciarVictorias = reiniciarVictorias;
window.limpiarConsola = limpiarConsola;