// ===== VARIABLES GLOBALES =====
let intervaloSimulacion = null;
let opcionSeleccionada = null;
let nPersonajesConfig = null;
let arrayEntidades = null;
let arrayPersonajes = null;
let alturaActual = 30;
let anchuraActual = 30;
let velocidadActual = 150;
let nPersonajesActual = 0;
let simulacionPausada = false;
let victoriasBuenos = 0;
let victoriasMalos = 0;
let coins = 0;
let gameOverCoins = 0;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    // Event listeners del menú
    document.getElementById('alturaInput').addEventListener('input', validarInputs);
    document.getElementById('anchuraInput').addEventListener('input', validarInputs);
    document.getElementById('numPersonajes').addEventListener('input', () => {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        validarBotonInicio();
    });
    
    cargarVictorias();
    actualizarCoinDisplay();
});

// ===== MODO AUTOMÁTICO - CALCULAR DIMENSIONES ÓPTIMAS =====
function calcularDimensionesOptimas() {
    // Usamos el contenedor del tablero para las medidas
    const container = document.getElementById('tableroContainer');
    
    // Si no existe el contenedor, usamos dimensiones por defecto
    if (!container) {
        return { anchura: 40, altura: 20 };
    }
    
    // Obtener dimensiones del contenedor
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Tamaño mínimo de celda para legibilidad
    const MIN_CELL_SIZE = 16;
    
    // Calcular el máximo ancho posible
    const maxAnchura = Math.floor(containerWidth / MIN_CELL_SIZE);
    
    // Calcular la altura adecuada
    const alturaOptima = Math.floor(containerHeight / MIN_CELL_SIZE);
    
    // Limitar a rangos razonables (pares)
    let anchuraFinal = Math.min(Math.max(maxAnchura, 20), 60);
    let alturaFinal = Math.min(Math.max(alturaOptima, 10), 35);
    
    // Asegurar que sean pares
    if (anchuraFinal % 2 !== 0) anchuraFinal--;
    if (alturaFinal % 2 !== 0) alturaFinal--;
    
    return {
        anchura: anchuraFinal,
        altura: alturaFinal
    };
}

// ===== APLICAR DIMENSIONES AUTOMÁTICAS =====
function aplicarDimensionesAutomaticas() {
    const dimensiones = calcularDimensionesOptimas();
    
    document.getElementById('alturaInput').value = dimensiones.altura;
    document.getElementById('anchuraInput').value = dimensiones.anchura;
    
    alturaActual = dimensiones.altura;
    anchuraActual = dimensiones.anchura;
    
    // Mostrar mensaje en consola
    console.log(`📐 Modo automático: ${dimensiones.anchura} x ${dimensiones.altura}`);
    
    // Validar inputs después de cambiar
    validarInputs();
}

// ===== SISTEMA DE MONEDAS =====
function insertCoin() {
    coins++;
    actualizarCoinDisplay();
    
    if (coins > 0) {
        document.getElementById('menuCard').classList.add('active');
        document.getElementById('menuCard').style.opacity = '1';
        document.getElementById('menuCard').style.pointerEvents = 'all';
        
        // Habilitar inputs y botones
        document.querySelectorAll('#menuCard input, #menuCard button').forEach(el => {
            el.disabled = false;
        });
    }
    
    // Si game over está visible, actualizar botón REINTENTAR
    if (!document.getElementById('gameOverPanel').classList.contains('hidden')) {
        document.getElementById('gameOverRetry').classList.remove('disabled');
    }
}

function useCoin() {
    if (coins > 0) {
        coins--;
        actualizarCoinDisplay();
        
        // Si estamos en game over, reintentar directamente
        if (!document.getElementById('gameOverPanel').classList.contains('hidden')) {
            reintentarPartida();
        } else {
            iniciarJuego();
        }
    } else {
        alert('¡INSERTA UNA MONEDA PRIMERO! 🪙');
    }
}

function actualizarCoinDisplay() {
    document.getElementById('coinCount').textContent = coins;
    document.getElementById('gameCoinCount').textContent = coins;
    actualizarGameOverCoins();
    
    // Actualizar botón REINTENTAR
    actualizarBotonReintentar();
}

function actualizarGameOverCoins() {
    const gameOverCoinSpan = document.getElementById('gameOverCoinCount');
    if (gameOverCoinSpan) {
        gameOverCoinSpan.textContent = coins;
    }
}

// Actualizar estado del botón REINTENTAR
function actualizarBotonReintentar() {
    const retryBtn = document.getElementById('gameOverRetry');
    if (!retryBtn) return;
    
    if (!document.getElementById('gameOverPanel').classList.contains('hidden')) {
        if (coins <= 0) {
            retryBtn.classList.add('disabled');
            retryBtn.style.pointerEvents = 'none';
            retryBtn.style.opacity = '0.5';
        } else {
            retryBtn.classList.remove('disabled');
            retryBtn.style.pointerEvents = 'auto';
            retryBtn.style.opacity = '1';
        }
    }
}

// ===== FUNCIONES DEL MENÚ =====
function seleccionarOpcion(opcion) {
    opcionSeleccionada = opcion;
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    const nPersonajesRow = document.getElementById('nPersonajesRow');
    if (opcion === 1) {
        nPersonajesRow.classList.remove('hidden');
    } else {
        nPersonajesRow.classList.add('hidden');
    }
    
    validarBotonInicio();
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
        return;
    }
    
    if (opcionSeleccionada === 1) {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        btnStart.disabled = !(nPersonajesConfig >= 2 && nPersonajesConfig % 2 === 0);
    } else {
        btnStart.disabled = false;
    }
}

// ===== FUNCIONES DE VICTORIAS =====
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
    
    if (guardadasBuenos) victoriasBuenos = parseInt(guardadasBuenos);
    if (guardadasMalos) victoriasMalos = parseInt(guardadasMalos);
    
    actualizarVictoriasVisuales();
}

function reiniciarVictorias() {
    if (confirm('¿Reiniciar contadores de victorias?')) {
        victoriasBuenos = 0;
        victoriasMalos = 0;
        actualizarVictoriasVisuales();
        guardarVictorias();
    }
}

// ===== FUNCIONES DE JUEGO =====
function actualizarContadoresVisuales() {
    document.getElementById('totalStats').textContent = Personajes.getnPersonajes() || 0;
    document.getElementById('buenosStats').textContent = Buenos.getnBuenos() || 0;
    document.getElementById('malosStats').textContent = Malos.getnMalos() || 0;
}

function iniciarJuego() {
    if (coins <= 0) {
        alert('¡NECESITAS UNA MONEDA! 🪙');
        return;
    }
    
    if (!validarInputs()) {
        alert('Dimensiones inválidas');
        return;
    }
    
    if (opcionSeleccionada === null) {
        alert('Selecciona un modo de juego');
        return;
    }
    
    // Gastar una moneda
    coins--;
    actualizarCoinDisplay();
    
    // Ocultar menú, mostrar máquina
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('arcadeMachine').classList.remove('hidden');
    
    iniciarSimulacion();
}

function iniciarSimulacion() {
    detenerSimulacion();
    simulacionPausada = false;
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    const altura = alturaActual;
    const anchura = anchuraActual;
    const porBuenos = Math.floor(Math.random() * (altura * anchura * 0.005)) + 1;
    const porMalos = Math.floor(Math.random() * (altura * anchura * 0.005)) + 1;
    
    let nPersonajes;
    if (opcionSeleccionada === 1) {
        nPersonajes = nPersonajesConfig;
    } else if (opcionSeleccionada === 2) {
        nPersonajes = porMalos + porBuenos;
    } else {
        nPersonajes = Math.floor(Math.random() * (altura * anchura * 0.01)) + 1;
        while (nPersonajes % 2 !== 0) {
            nPersonajes = Math.floor(Math.random() * (altura * anchura * 0.01)) + 1;
        }
    }
    
    nPersonajesActual = nPersonajes;
    
    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    arrayPersonajes = Array(nPersonajes).fill(null);
    
    // Generar obstáculos (1% del área)
    for (let i = 0; i < Math.floor(altura * anchura * 0.01); i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
        } while (arrayEntidades[y][x] !== null);
        arrayEntidades[y][x] = new Obstaculos(y, x);
    }
    
    // Generar personajes
    for (let i = 0; i < nPersonajes; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
        } while (arrayEntidades[y][x] !== null);
        
        if (i % 2 === 0) {
            arrayEntidades[y][x] = new Buenos(y, x);
            arrayPersonajes[i] = arrayEntidades[y][x];
        } else {
            arrayEntidades[y][x] = new Malos(y, x);
            arrayPersonajes[i] = arrayEntidades[y][x];
        }
    }
    
    actualizarContadoresVisuales();
    document.getElementById('gameOverPanel').classList.add('hidden');
    document.getElementById('simulationControls').classList.remove('hidden');
    
    intervaloSimulacion = setInterval(() => actualizarJuego(altura, anchura, nPersonajes), velocidadActual);
}

// ===== FUNCIÓN PRINCIPAL DEL JUEGO =====
function actualizarJuego(altura, anchura, nPersonajes) {
    // Asignar enemigos cercanos
    for (let i = 0; i < nPersonajes; i++) {
        if (!arrayPersonajes[i]) continue;
        
        if (arrayPersonajes[i] instanceof Buenos) {
            let minDist = Infinity;
            let target = null;
            for (let j = 0; j < nPersonajes; j++) {
                if (!arrayPersonajes[j] || arrayPersonajes[j] instanceof Buenos) continue;
                const dist = arrayPersonajes[i].distanciaCon(arrayPersonajes[j]);
                if (dist < minDist) {
                    minDist = dist;
                    target = arrayPersonajes[j];
                }
            }
            arrayPersonajes[i].setMalos(target);
        } else {
            let minDist = Infinity;
            let target = null;
            for (let j = 0; j < nPersonajes; j++) {
                if (!arrayPersonajes[j] || arrayPersonajes[j] instanceof Malos) continue;
                const dist = arrayPersonajes[i].distanciaCon(arrayPersonajes[j]);
                if (dist < minDist) {
                    minDist = dist;
                    target = arrayPersonajes[j];
                }
            }
            arrayPersonajes[i].setBuenos(target);
        }
    }
    
    // Mover
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            if (arrayEntidades[i][j] instanceof Personajes) {
                arrayEntidades[i][j].mover(anchura, altura, arrayEntidades);
            }
        }
    }
    
    // Combatir
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            if (arrayEntidades[i][j] instanceof Personajes) {
                const entidad = arrayEntidades[i][j];
                const newX = entidad.getX();
                const newY = entidad.getY();
                
                if (newX !== j || newY !== i) {
                    if (arrayEntidades[newY][newX] === null) {
                        arrayEntidades[newY][newX] = entidad;
                        arrayEntidades[i][j] = null;
                    } else if (
                        (arrayEntidades[newY][newX] instanceof Malos && entidad instanceof Buenos) ||
                        (arrayEntidades[newY][newX] instanceof Buenos && entidad instanceof Malos)
                    ) {
                        const defensor = arrayEntidades[newY][newX];
                        const resultado = Math.floor(Math.random() * (entidad.getVida() + defensor.getVida()));
                        
                        if (resultado < entidad.getVida()) {
                            for (let k = 0; k < nPersonajes; k++) {
                                if (arrayPersonajes[k] === defensor) {
                                    arrayPersonajes[k] = null;
                                    break;
                                }
                            }
                            arrayEntidades[newY][newX] = null;
                            Personajes.setnPersonajes(Personajes.getnPersonajes() - 1);
                            if (defensor instanceof Buenos) Buenos.setnBuenos(Buenos.getnBuenos() - 1);
                            else Malos.setnMalos(Malos.getnMalos() - 1);
                        } else {
                            for (let k = 0; k < nPersonajes; k++) {
                                if (arrayPersonajes[k] === entidad) {
                                    arrayPersonajes[k] = null;
                                    break;
                                }
                            }
                            arrayEntidades[i][j] = null;
                            Personajes.setnPersonajes(Personajes.getnPersonajes() - 1);
                            if (entidad instanceof Buenos) Buenos.setnBuenos(Buenos.getnBuenos() - 1);
                            else Malos.setnMalos(Malos.getnMalos() - 1);
                        }
                        
                        actualizarContadoresVisuales();
                    }
                }
            }
        }
    }
    
    // ===== TABLERO CON CÁLCULO INTELIGENTE =====
    const container = document.getElementById('tableroContainer');
    
    // Obtener dimensiones exactas del contenedor
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Tamaño mínimo y máximo de celda
    const MIN_CELL_SIZE = 14;
    const MAX_CELL_SIZE = 40;
    
    // Calcular tamaño basado en ANCHO
    let cellSizeByWidth = Math.floor(containerWidth / anchura);
    
    // Calcular tamaño basado en ALTURA
    let cellSizeByHeight = Math.floor(containerHeight / altura);
    
    // Usar el tamaño más pequeño para que quepa todo
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // Limitar a rangos
    cellSize = Math.max(cellSize, MIN_CELL_SIZE);
    cellSize = Math.min(cellSize, MAX_CELL_SIZE);
    
    // Crear el grid con estilo Pac-Man
    let tableroHTML = `<div class="board-grid" style="display: grid; grid-template-columns: repeat(${anchura}, ${cellSize}px); gap: 0; margin: 0 auto;">`;
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const celda = arrayEntidades[i][j];
            
            let bgColor = '#24408e';
            let color = '#ffffff';
            let text = '';
            let shadow = 'none';
            let borderRadius = '0';
            
            if (!celda) {
                color = '#ffff00';
                text = '·';
                shadow = '0 0 5px #ffff00';
                borderRadius = '50%';
            } else if (celda instanceof Buenos) {
                color = '#ffff00';
                text = 'B';
                shadow = '0 0 8px #ffff00';
            } else if (celda instanceof Malos) {
                color = '#ff0000';
                text = 'M';
                shadow = '0 0 8px #ff0000';
            } else if (celda instanceof Obstaculos) {
                bgColor = '#0a1a4a';
                color = '#4a6c8f';
                text = '█';
                shadow = 'none';
            }
            
            tableroHTML += `<div style="width: ${cellSize}px; height: ${cellSize}px; display: flex; align-items: center; justify-content: center; background-color: ${bgColor}; color: ${color}; text-shadow: ${shadow}; font-size: ${Math.floor(cellSize * 0.7)}px; font-weight: bold; border-radius: ${borderRadius};">${text}</div>`;
        }
    }
    
    tableroHTML += '</div>';
    
    document.getElementById('tableroContainer').innerHTML = tableroHTML;
    actualizarContadoresVisuales();
    
    // Verificar fin
    if (Buenos.getnBuenos() <= 0 || Malos.getnMalos() <= 0) {
        detenerSimulacion();
        mostrarResultado();
    }
}

// ===== FUNCIONES DE CONTROL =====
function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
        simulacionPausada = true;
    }
}

function continuarSimulacion() {
    if (simulacionPausada && arrayEntidades) {
        intervaloSimulacion = setInterval(
            () => actualizarJuego(alturaActual, anchuraActual, nPersonajesActual),
            velocidadActual
        );
        simulacionPausada = false;
    }
}

function ajustarVelocidad(cambio) {
    velocidadActual = Math.max(50, Math.min(500, velocidadActual + cambio));
    document.getElementById('velocidadDisplay').textContent = velocidadActual + 'ms';
    
    if (intervaloSimulacion) {
        detenerSimulacion();
        continuarSimulacion();
    }
}

// ===== FUNCIÓN PARA REINTENTAR PARTIDA =====
function reintentarPartida() {
    if (coins <= 0) {
        const msg = document.getElementById('noCoinsMessage');
        if (msg) {
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 2000);
        }
        return;
    }
    
    coins--;
    actualizarCoinDisplay();
    
    document.getElementById('gameOverPanel').classList.add('hidden');
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    iniciarSimulacion();
}

// ===== MOSTRAR RESULTADO =====
function mostrarResultado() {
    const buenos = Buenos.getnBuenos() || 0;
    const malos = Malos.getnMalos() || 0;
    
    if (buenos <= 0) victoriasMalos++;
    else victoriasBuenos++;
    
    guardarVictorias();
    actualizarVictoriasVisuales();
    
    document.getElementById('resultadoTitulo').textContent = 
        buenos <= 0 ? '💀 MALOS GANAN 💀' : '✨ BUENOS GANAN ✨';
    document.getElementById('resultadoTitulo').style.color = buenos <= 0 ? '#ff0000' : '#00ff00';
    document.getElementById('resultadoTotal').textContent = Personajes.getnPersonajes() || 0;
    document.getElementById('resultadoBuenos').textContent = buenos;
    document.getElementById('resultadoMalos').textContent = malos;
    
    actualizarGameOverCoins();
    
    document.getElementById('gameOverPanel').classList.remove('hidden');
    document.getElementById('simulationControls').classList.add('hidden');
    
    actualizarBotonReintentar();
}

// ===== VOLVER AL MENÚ =====
function volverAlMenu() {
    detenerSimulacion();
    
    opcionSeleccionada = null;
    nPersonajesConfig = null;
    arrayEntidades = null;
    arrayPersonajes = null;
    
    document.getElementById('arcadeMachine').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('nPersonajesRow').classList.add('hidden');
    document.getElementById('startBtn').disabled = true;
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    actualizarCoinDisplay();
    
    document.getElementById('tableroContainer').innerHTML = '';
}

// ===== HACER FUNCIONES GLOBALES =====
window.iniciarJuego = iniciarJuego;
window.seleccionarOpcion = seleccionarOpcion;
window.detenerSimulacion = detenerSimulacion;
window.continuarSimulacion = continuarSimulacion;
window.ajustarVelocidad = ajustarVelocidad;
window.reiniciarVictorias = reiniciarVictorias;
window.volverAlMenu = volverAlMenu;
window.insertCoin = insertCoin;
window.useCoin = useCoin;
window.reintentarPartida = reintentarPartida;
window.aplicarDimensionesAutomaticas = aplicarDimensionesAutomaticas;