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
        iniciarJuego();
    } else {
        alert('¡INSERTA UNA MONEDA PRIMERO! 🪙');
    }
}

function actualizarCoinDisplay() {
    document.getElementById('coinCount').textContent = coins;
    document.getElementById('gameCoinCount').textContent = coins;
    actualizarGameOverCoins();
    
    // Actualizar estado del botón REINTENTAR si game over está visible
    if (!document.getElementById('gameOverPanel').classList.contains('hidden')) {
        const retryBtn = document.getElementById('gameOverRetry');
        if (coins <= 0) {
            retryBtn.classList.add('disabled');
        } else {
            retryBtn.classList.remove('disabled');
        }
    }
}

function actualizarGameOverCoins() {
    const gameOverCoinSpan = document.getElementById('gameOverCoinCount');
    if (gameOverCoinSpan) {
        gameOverCoinSpan.textContent = coins;
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
    
    // Generar obstáculos
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
    
    // ===== TABLERO DINÁMICO =====
    const container = document.getElementById('tableroContainer');
    
    // Obtener dimensiones reales del contenedor
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    // Calcular tamaño máximo de celda
    const maxCellWidth = Math.floor(containerWidth / anchura) - 2;
    const maxCellHeight = Math.floor(containerHeight / altura) - 2;
    
    // Usar el tamaño más pequeño para mantener celdas cuadradas
    let cellSize = Math.min(maxCellWidth, maxCellHeight);
    
    // Asegurar un tamaño mínimo
    cellSize = Math.max(cellSize, 12);
    
    // Calcular el ancho total del tablero
    const totalWidth = (cellSize * anchura) + (2 * (anchura - 1));
    const totalHeight = (cellSize * altura) + (2 * (altura - 1));
    
    // Crear el tablero con grid CSS
    let tableroHTML = `<div class="board-grid" style="grid-template-columns: repeat(${anchura}, ${cellSize}px); gap: 2px; width: ${totalWidth}px; height: ${totalHeight}px; margin: auto;">`;
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const celda = arrayEntidades[i][j];
            let cellClass = 'board-cell empty';
            let content = '';
            
            if (celda instanceof Buenos) {
                cellClass = 'board-cell good';
                content = 'B';
            } else if (celda instanceof Malos) {
                cellClass = 'board-cell bad';
                content = 'M';
            } else if (celda instanceof Obstaculos) {
                cellClass = 'board-cell obstacle';
                content = '#';
            }
            
            tableroHTML += `<div class="${cellClass}" style="width: ${cellSize}px; height: ${cellSize}px; line-height: ${cellSize}px; font-size: ${cellSize * 0.7}px;">${content}</div>`;
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
    if (coins > 0) {
        // Gastar una moneda
        coins--;
        actualizarCoinDisplay();
        
        // Cerrar game over
        document.getElementById('gameOverPanel').classList.add('hidden');
        
        // Resetear contadores de partida
        Personajes.setnPersonajes(0);
        Buenos.setnBuenos(0);
        Malos.setnMalos(0);
        actualizarContadoresVisuales();
        
        // Iniciar nueva simulación
        iniciarSimulacion();
    } else {
        // Mostrar mensaje de que no hay monedas
        const msg = document.getElementById('noCoinsMessage');
        if (msg) {
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 2000);
        }
    }
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
    
    // Actualizar monedas en game over
    actualizarGameOverCoins();
    
    // Deshabilitar REINTENTAR si no hay monedas
    const retryBtn = document.getElementById('gameOverRetry');
    if (retryBtn) {
        if (coins <= 0) {
            retryBtn.classList.add('disabled');
        } else {
            retryBtn.classList.remove('disabled');
        }
    }
    
    document.getElementById('gameOverPanel').classList.remove('hidden');
    document.getElementById('simulationControls').classList.add('hidden');
}

// ===== VOLVER AL MENÚ =====
function volverAlMenu() {
    detenerSimulacion();
    
    // Resetear todo
    opcionSeleccionada = null;
    nPersonajesConfig = null;
    arrayEntidades = null;
    arrayPersonajes = null;
    
    // Volver al menú
    document.getElementById('arcadeMachine').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    
    // Resetear selecciones
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('nPersonajesRow').classList.add('hidden');
    document.getElementById('startBtn').disabled = true;
    
    // Resetear contadores
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