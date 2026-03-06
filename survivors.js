// ===== VARIABLES GLOBALES =====
let intervaloSimulacion = null;
let opcionSeleccionada = null;
let nPersonajesConfig = null;
let arrayEntidades = null;
let arrayPersonajes = null;
let velocidadActual = 150;
let nPersonajesActual = 0;
let simulacionPausada = false;
let victoriasBuenos = 0;
let victoriasMalos = 0;
let coins = 0;
let gameOverCoins = 0;

// Dimensiones FIJAS - 30x30 SIEMPRE
const ALTURA_FIJA = 30;
const ANCHURA_FIJA = 30;

// Referencias DOM
let gameBoard = null;
let cells = [];

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.getElementById('gameBoard');
    
    document.getElementById('numPersonajes').addEventListener('input', () => {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        validarBotonInicio();
    });
    
    cargarVictorias();
    actualizarCoinDisplay();
    
    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', () => {
        if (arrayEntidades && cells.length > 0) {
            redimensionarTablero();
        }
    });
});

// ===== FUNCIÓN PARA REDIMENSIONAR EL TABLERO =====
function redimensionarTablero() {
    if (!gameBoard || cells.length === 0 || !arrayEntidades) return;
    
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    
    // Obtener dimensiones del contenedor padre
    const containerWidth = gameBoard.clientWidth;
    const containerHeight = gameBoard.clientHeight;
    
    if (containerWidth === 0 || containerHeight === 0) return;
    
    // Calcular tamaño de celda basado en el espacio disponible
    const cellSizeByWidth = Math.floor(containerWidth / anchura);
    const cellSizeByHeight = Math.floor(containerHeight / altura);
    
    // Usar el tamaño más pequeño para mantener celdas cuadradas
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // Tamaños mínimos y máximos para legibilidad
    cellSize = Math.max(cellSize, 14);
    cellSize = Math.min(cellSize, 40);
    
    const fontSize = Math.floor(cellSize * 0.6);
    
    // Actualizar el grid con el nuevo tamaño
    gameBoard.style.gridTemplateColumns = `repeat(${anchura}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${altura}, ${cellSize}px)`;
    
    // Actualizar todas las celdas y mantener sus colores
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const oldWidth = cell.style.width;
        const oldHeight = cell.style.height;
        
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${fontSize}px`;
        
        // Si la celda tiene contenido, actualizar su estilo manteniendo el color
        if (cell.textContent) {
            const index = i;
            const row = Math.floor(index / anchura);
            const col = index % anchura;
            if (row < altura && col < anchura) {
                const celda = arrayEntidades[row][col];
                aplicarColorCelda(cell, celda);
            }
        }
    }
}

// ===== FUNCIÓN PARA APLICAR COLOR A UNA CELDA (VERSIÓN FORZADA) =====
function aplicarColorCelda(cellDiv, celda) {
    // FORZAR estilos inline con !important
    if (!celda) {
        cellDiv.setAttribute('style', 
            'background-color: #24408e !important; ' +
            'color: #ffff00 !important; ' +
            'text-shadow: 0 0 5px #ffff00 !important; ' +
            'border-radius: 50% !important; ' +
            'display: flex; align-items: center; justify-content: center; ' +
            'font-weight: bold; width: ' + cellDiv.style.width + '; ' +
            'height: ' + cellDiv.style.height + '; font-size: ' + cellDiv.style.fontSize + ';'
        );
        cellDiv.textContent = '·';
    } else if (celda instanceof Buenos) {
        cellDiv.setAttribute('style',
            'background-color: #24408e !important; ' +
            'color: #ffff00 !important; ' +
            'text-shadow: 0 0 8px #ffff00 !important; ' +
            'border-radius: 0 !important; ' +
            'display: flex; align-items: center; justify-content: center; ' +
            'font-weight: bold; width: ' + cellDiv.style.width + '; ' +
            'height: ' + cellDiv.style.height + '; font-size: ' + cellDiv.style.fontSize + ';'
        );
        cellDiv.textContent = 'B';
    } else if (celda instanceof Malos) {
        cellDiv.setAttribute('style',
            'background-color: #24408e !important; ' +
            'color: #ff0000 !important; ' +
            'text-shadow: 0 0 8px #ff0000 !important; ' +
            'border-radius: 0 !important; ' +
            'display: flex; align-items: center; justify-content: center; ' +
            'font-weight: bold; width: ' + cellDiv.style.width + '; ' +
            'height: ' + cellDiv.style.height + '; font-size: ' + cellDiv.style.fontSize + ';'
        );
        cellDiv.textContent = 'M';
    } else if (celda instanceof Obstaculos) {
        cellDiv.setAttribute('style',
            'background-color: #0a1a4a !important; ' +
            'color: #4a6c8f !important; ' +
            'text-shadow: none !important; ' +
            'border-radius: 0 !important; ' +
            'display: flex; align-items: center; justify-content: center; ' +
            'font-weight: bold; width: ' + cellDiv.style.width + '; ' +
            'height: ' + cellDiv.style.height + '; font-size: ' + cellDiv.style.fontSize + ';'
        );
        cellDiv.textContent = '█';
    }
}

// ===== FUNCIÓN PARA CREAR EL TABLERO =====
function crearTablero(altura, anchura) {
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;
    }
    
    gameBoard.innerHTML = '';
    cells = [];
    
    // Configuración base del grid
    gameBoard.style.display = 'grid';
    gameBoard.style.gap = '1px';
    gameBoard.style.backgroundColor = '#24408e';
    gameBoard.style.padding = '5px';
    gameBoard.style.borderRadius = '10px';
    gameBoard.style.margin = 'auto';
    
    // Tamaño temporal para crear las celdas
    const tempSize = 20;
    const tempFont = 14;
    
    // Crear celdas con tamaño temporal
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const cellDiv = document.createElement('div');
            
            cellDiv.style.width = `${tempSize}px`;
            cellDiv.style.height = `${tempSize}px`;
            cellDiv.style.fontSize = `${tempFont}px`;
            cellDiv.style.display = 'flex';
            cellDiv.style.alignItems = 'center';
            cellDiv.style.justifyContent = 'center';
            cellDiv.style.fontWeight = 'bold';
            
            gameBoard.appendChild(cellDiv);
            cells.push(cellDiv);
        }
    }
    
    // Redimensionar al tamaño correcto
    setTimeout(() => redimensionarTablero(), 10);
}

// ===== FUNCIÓN PARA ACTUALIZAR TODO EL TABLERO =====
function actualizarTodoElTablero() {
    if (!arrayEntidades || cells.length === 0) return;
    
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const index = i * anchura + j;
            if (index >= cells.length) continue;
            
            const celda = arrayEntidades[i][j];
            aplicarColorCelda(cells[index], celda);
        }
    }
}

// ===== FUNCIÓN PARA ACTUALIZAR UNA CELDA =====
function actualizarCelda(index, celda) {
    if (index >= cells.length) return;
    aplicarColorCelda(cells[index], celda);
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
                        
                        actualizarCelda(i * anchura + j, null);
                        actualizarCelda(newY * anchura + newX, entidad);
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
                            
                            actualizarCelda(newY * anchura + newX, null);
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
                            
                            actualizarCelda(i * anchura + j, null);
                        }
                        
                        actualizarContadoresVisuales();
                    }
                }
            }
        }
    }
    
    actualizarContadoresVisuales();
    
    if (Buenos.getnBuenos() <= 0 || Malos.getnMalos() <= 0) {
        detenerSimulacion();
        mostrarResultado();
    }
}

// ===== FUNCIÓN INICIAR SIMULACIÓN =====
function iniciarSimulacion() {
    detenerSimulacion();
    simulacionPausada = false;
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    const altura = ALTURA_FIJA;
    const anchura = ANCHURA_FIJA;
    const totalCeldas = altura * anchura;
    
    let nPersonajes;
    if (opcionSeleccionada === 1) {
        nPersonajes = nPersonajesConfig;
    } else if (opcionSeleccionada === 2) {
        nPersonajes = Math.floor(Math.random() * (totalCeldas * 0.02)) + 5;
    } else {
        nPersonajes = Math.floor(Math.random() * (totalCeldas * 0.02)) + 5;
        while (nPersonajes % 2 !== 0) {
            nPersonajes = Math.floor(Math.random() * (totalCeldas * 0.02)) + 5;
        }
    }
    
    nPersonajesActual = nPersonajes;
    
    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    arrayPersonajes = Array(nPersonajes).fill(null);
    
    // Generar obstáculos (1%)
    const numObstaculos = Math.floor(totalCeldas * 0.01);
    for (let i = 0; i < numObstaculos; i++) {
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
    
    crearTablero(altura, anchura);
    actualizarTodoElTablero();
    
    actualizarContadoresVisuales();
    document.getElementById('gameOverPanel').classList.add('hidden');
    document.getElementById('simulationControls').classList.remove('hidden');
    
    intervaloSimulacion = setInterval(() => actualizarJuego(altura, anchura, nPersonajes), velocidadActual);
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
            () => actualizarJuego(ALTURA_FIJA, ANCHURA_FIJA, nPersonajesActual),
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

// ===== FUNCIÓN INSERTAR MONEDA =====
function insertCoin() {
    coins++;
    actualizarCoinDisplay();
    
    if (coins > 0) {
        document.getElementById('menuCard').classList.add('active');
        document.getElementById('menuCard').style.opacity = '1';
        document.getElementById('menuCard').style.pointerEvents = 'all';
        
        document.querySelectorAll('#menuCard input, #menuCard button').forEach(el => {
            el.disabled = false;
        });
    }
    
    // SIEMPRE actualizar el botón REINTENTAR si game over está visible
    if (!document.getElementById('gameOverPanel').classList.contains('hidden')) {
        actualizarBotonReintentar();
    }
}

function useCoin() {
    if (coins > 0) {
        coins--;
        actualizarCoinDisplay();
        
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
    actualizarBotonReintentar();
}

function actualizarGameOverCoins() {
    const gameOverCoinSpan = document.getElementById('gameOverCoinCount');
    if (gameOverCoinSpan) {
        gameOverCoinSpan.textContent = coins;
    }
}

// ===== FUNCIÓN PARA ACTUALIZAR BOTÓN REINTENTAR =====
function actualizarBotonReintentar() {
    const retryBtn = document.getElementById('gameOverRetry');
    if (!retryBtn) return;
    
    // SIEMPRE actualizar el estado basado en las monedas
    if (coins > 0) {
        retryBtn.classList.remove('disabled');
        retryBtn.style.pointerEvents = 'auto';
        retryBtn.style.opacity = '1';
        retryBtn.style.filter = 'none';
        retryBtn.style.boxShadow = '0 0 20px var(--green)';
    } else {
        retryBtn.classList.add('disabled');
        retryBtn.style.pointerEvents = 'none';
        retryBtn.style.opacity = '0.4';
        retryBtn.style.filter = 'grayscale(0.8)';
        retryBtn.style.boxShadow = 'none';
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
    if (confirm('¿Reiniciar contadores?')) {
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
    
    if (opcionSeleccionada === null) {
        alert('Selecciona un modo de juego');
        return;
    }
    
    coins--;
    actualizarCoinDisplay();
    
    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('arcadeMachine').classList.remove('hidden');
    
    iniciarSimulacion();
}

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
    
    // MOSTRAR GAME OVER
    document.getElementById('gameOverPanel').classList.remove('hidden');
    document.getElementById('simulationControls').classList.add('hidden');
    
    // FORZAR que el botón REINTENTAR esté ACTIVADO si hay monedas
    const retryBtn = document.getElementById('gameOverRetry');
    if (retryBtn) {
        if (coins > 0) {
            retryBtn.classList.remove('disabled');
            retryBtn.style.pointerEvents = 'auto';
            retryBtn.style.opacity = '1';
            retryBtn.style.filter = 'brightness(1)';
        } else {
            retryBtn.classList.add('disabled');
            retryBtn.style.pointerEvents = 'none';
            retryBtn.style.opacity = '0.5';
            retryBtn.style.filter = 'grayscale(0.5)';
        }
    }
}

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
    
    if (gameBoard) {
        gameBoard.innerHTML = '';
        cells = [];
    }
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