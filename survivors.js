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

// Dimensiones variables - se calcularán automáticamente
let alturaActual = 0;
let anchuraActual = 0;

// Referencias DOM
let gameBoard = null;

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
        if (arrayEntidades) {
            recalcularDimensiones();
            redimensionarTablero();
        }
    });
});

// ===== FUNCIÓN PARA CALCULAR DIMENSIONES ÓPTIMAS =====
function recalcularDimensiones() {
    if (!gameBoard) return;
    
    // Obtener dimensiones del game-board
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    if (boardWidth === 0 || boardHeight === 0) return;
    
    // TAMAÑO MÍNIMO DE CELDA - AUMENTADO a 16px (antes 10px)
    const MIN_CELL_SIZE = 16;
    
    // Calcular cuántas celdas caben en el espacio disponible
    // Usamos un factor de escala para que las celdas sean más grandes
    const maxCellsWidth = Math.floor(boardWidth / MIN_CELL_SIZE);
    const maxCellsHeight = Math.floor(boardHeight / MIN_CELL_SIZE);
    
    // REDUCCIÓN DEL 20% para que las celdas sean más grandes
    // (menos celdas, pero más grandes)
    alturaActual = Math.floor(maxCellsHeight * 0.8);
    anchuraActual = Math.floor(maxCellsWidth * 0.8);
    
    // Asegurar que sean pares para el equilibrio del juego
    if (alturaActual % 2 !== 0) alturaActual--;
    if (anchuraActual % 2 !== 0) anchuraActual--;
    
    // Límites mínimos
    alturaActual = Math.max(alturaActual, 8);
    anchuraActual = Math.max(anchuraActual, 8);
    
    console.log(`📏 Dimensiones calculadas: ${anchuraActual}x${alturaActual} (${anchuraActual * alturaActual} celdas)`);
}

// ===== FUNCIÓN PARA REDIMENSIONAR EL TABLERO =====
function redimensionarTablero() {
    if (!gameBoard || !arrayEntidades) return;
    
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    
    // Obtener dimensiones del game-board
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    if (boardWidth === 0 || boardHeight === 0) return;
    
    // Calcular tamaño de celda para que OCUPE TODO el espacio
    const cellSizeByWidth = Math.floor(boardWidth / anchura);
    const cellSizeByHeight = Math.floor(boardHeight / altura);
    
    // Usar el tamaño más pequeño para mantener celdas cuadradas
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    
    // TAMAÑO MÍNIMO AUMENTADO a 14px (antes 8px)
    cellSize = Math.max(cellSize, 14);
    
    // TAMAÑO MÁXIMO para no ser demasiado grandes
    cellSize = Math.min(cellSize, 45);
    
    const fontSize = Math.floor(cellSize * 0.6);
    
    // Actualizar el grid con el nuevo tamaño
    gameBoard.style.gridTemplateColumns = `repeat(${anchura}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${altura}, ${cellSize}px)`;
    
    // Actualizar todas las celdas
    const cells = gameBoard.children;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${fontSize}px`;
    }
}

// ===== FUNCIÓN PARA APLICAR COLOR A UNA CELDA =====
function aplicarColorCelda(cellDiv, celda) {
    if (!celda) {
        cellDiv.style.backgroundColor = '#24408e';
        cellDiv.style.color = '#ffff00';
        cellDiv.textContent = '·';
        cellDiv.style.textShadow = '0 0 5px #ffff00';
        cellDiv.style.borderRadius = '50%';
    } else if (celda instanceof Buenos) {
        cellDiv.style.backgroundColor = '#24408e';
        cellDiv.style.color = '#ffff00';
        cellDiv.textContent = 'B';
        cellDiv.style.textShadow = '0 0 8px #ffff00';
        cellDiv.style.borderRadius = '0';
    } else if (celda instanceof Malos) {
        cellDiv.style.backgroundColor = '#24408e';
        cellDiv.style.color = '#ff0000';
        cellDiv.textContent = 'M';
        cellDiv.style.textShadow = '0 0 8px #ff0000';
        cellDiv.style.borderRadius = '0';
    } else if (celda instanceof Obstaculos) {
        cellDiv.style.backgroundColor = '#0a1a4a';
        cellDiv.style.color = '#4a6c8f';
        cellDiv.textContent = '█';
        cellDiv.style.textShadow = 'none';
        cellDiv.style.borderRadius = '0';
    }
}

// ===== FUNCIÓN PARA CREAR EL TABLERO =====
function crearTablero() {
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;
    }
    
    gameBoard.innerHTML = '';
    
    // Configuración base del grid
    gameBoard.style.display = 'grid';
    gameBoard.style.gap = '1px';
    gameBoard.style.backgroundColor = '#24408e';
    gameBoard.style.padding = '5px';
    gameBoard.style.borderRadius = '10px';
    gameBoard.style.margin = '0';
    gameBoard.style.width = '100%';
    gameBoard.style.height = '100%';
    
    // Calcular dimensiones si no existen
    if (alturaActual === 0 || anchuraActual === 0) {
        recalcularDimensiones();
    }
    
    // Crear celdas con tamaño temporal
    for (let i = 0; i < alturaActual; i++) {
        for (let j = 0; j < anchuraActual; j++) {
            const cellDiv = document.createElement('div');
            
            cellDiv.style.display = 'flex';
            cellDiv.style.alignItems = 'center';
            cellDiv.style.justifyContent = 'center';
            cellDiv.style.fontWeight = 'bold';
            
            gameBoard.appendChild(cellDiv);
        }
    }
    
    // Redimensionar al tamaño correcto
    setTimeout(() => redimensionarTablero(), 10);
    
    console.log(`✅ Tablero creado: ${alturaActual * anchuraActual} celdas (${anchuraActual}x${alturaActual})`);
}

// ===== FUNCIÓN PARA ACTUALIZAR TODO EL TABLERO =====
function actualizarTodoElTablero() {
    if (!arrayEntidades || !gameBoard) return;
    
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    const cells = gameBoard.children;
    
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
function actualizarCelda(row, col, celda) {
    if (!gameBoard) return;
    const anchura = arrayEntidades[0].length;
    const index = row * anchura + col;
    const cells = gameBoard.children;
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
                        
                        actualizarCelda(i, j, null);
                        actualizarCelda(newY, newX, entidad);
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
                            
                            actualizarCelda(newY, newX, null);
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
                            
                            actualizarCelda(i, j, null);
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
    
    // Recalcular dimensiones basadas en el tamaño actual de la pantalla
    recalcularDimensiones();
    
    const altura = alturaActual;
    const anchura = anchuraActual;
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
    
    crearTablero();
    actualizarTodoElTablero();
    
    actualizarContadoresVisuales();
    document.getElementById('gameOverPanel').classList.add('hidden');
    document.getElementById('simulationControls').classList.remove('hidden');
    
    intervaloSimulacion = setInterval(() => actualizarJuego(altura, anchura, nPersonajes), velocidadActual);
}

// ===== RESTO DE FUNCIONES (sin cambios) =====
// ... (detenerSimulacion, continuarSimulacion, ajustarVelocidad, insertCoin, useCoin, 
//      actualizarCoinDisplay, actualizarGameOverCoins, actualizarBotonReintentar,
//      seleccionarOpcion, validarBotonInicio, actualizarVictoriasVisuales,
//      guardarVictorias, cargarVictorias, reiniciarVictorias,
//      actualizarContadoresVisuales, iniciarJuego, reintentarPartida,
//      mostrarResultado, volverAlMenu)

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