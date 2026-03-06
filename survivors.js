// ===== VARIABLES GLOBALES =====
let intervaloSimulacion = null;
let opcionSeleccionada = null;
let nPersonajesConfig = null;
let arrayEntidades = null;
let arrayPersonajes = null;
let velocidadActual = 200;
let nPersonajesActual = 0;
let simulacionPausada = false;
let victoriasBuenos = 0;
let victoriasMalos = 0;
let coins = 0;
let gameOverCoins = 0;

// Dimensiones variables
let alturaActual = 0;
let anchuraActual = 0;

// Referencias DOM
let gameBoard = null;
let logs = [];
let filtroActivo = 'todos';
let primerInicio = true; // Para controlar la primera vez

// ===== CONSTANTES DE VELOCIDAD =====
const VELOCIDADES = {
    LENTA: 300,
    NORMAL: 200,
    RAPIDA: 120,
    MUY_RAPIDA: 70
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando juego...');
    gameBoard = document.getElementById('gameBoard');
    
    document.getElementById('numPersonajes').addEventListener('input', () => {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        validarBotonInicio();
    });
    
    cargarVictorias();
    actualizarCoinDisplay();
    
    iniciarControlesTeclado();
    
    window.addEventListener('resize', () => {
        if (arrayEntidades) {
            recalcularDimensiones();
            redimensionarTablero();
        }
    });
    
    console.log('✅ Inicialización completa');
});

// ===== FUNCIÓN PARA VALIDAR BOTÓN DE INICIO =====
function validarBotonInicio() {
    const btnStart = document.getElementById('startBtn');
    
    if (opcionSeleccionada === null) {
        btnStart.disabled = true;
        añadirLog('❌ Selecciona un modo de juego', 'info');
        return;
    }
    
    if (opcionSeleccionada === 1) {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        const valido = (nPersonajesConfig >= 2 && nPersonajesConfig % 2 === 0);
        btnStart.disabled = !valido;
        
        if (!valido) {
            añadirLog('❌ Número de personajes inválido (debe ser par y ≥2)', 'info');
        } else {
            añadirLog(`✅ Modo 1 configurado: ${nPersonajesConfig} personajes`, 'system');
        }
    } else {
        btnStart.disabled = false;
        añadirLog(`✅ Modo ${opcionSeleccionada} seleccionado`, 'info');
    }
}

// ===== FUNCIÓN PARA CALCULAR DIMENSIONES =====
function recalcularDimensiones() {
    if (!gameBoard) return;
    
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    if (boardWidth === 0 || boardHeight === 0) return;
    
    const MIN_CELL_SIZE = 16;
    
    const maxCellsWidth = Math.floor(boardWidth / MIN_CELL_SIZE);
    const maxCellsHeight = Math.floor(boardHeight / MIN_CELL_SIZE);
    
    alturaActual = Math.floor(maxCellsHeight * 0.8);
    anchuraActual = Math.floor(maxCellsWidth * 0.8);
    
    if (alturaActual % 2 !== 0) alturaActual--;
    if (anchuraActual % 2 !== 0) anchuraActual--;
    
    alturaActual = Math.max(alturaActual, 8);
    anchuraActual = Math.max(anchuraActual, 8);
}

// ===== FUNCIÓN PARA REDIMENSIONAR EL TABLERO =====
function redimensionarTablero() {
    if (!gameBoard || !arrayEntidades) return;
    
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    if (boardWidth === 0 || boardHeight === 0) return;
    
    const cellSizeByWidth = Math.floor(boardWidth / anchura);
    const cellSizeByHeight = Math.floor(boardHeight / altura);
    
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    cellSize = Math.max(cellSize, 14);
    cellSize = Math.min(cellSize, 45);
    
    const fontSize = Math.floor(cellSize * 0.6);
    
    gameBoard.style.gridTemplateColumns = `repeat(${anchura}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${altura}, ${cellSize}px)`;
    
    const cells = gameBoard.children;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${fontSize}px`;
    }
}

// ===== FUNCIÓN PARA GENERAR PERSONAJE CON CLASE =====
function generarPersonajeConClase(tipo, y, x) {
    const rand = Math.random();
    
    if (tipo === 'bueno') {
        if (rand < 0.25) return new Curandero(y, x);
        else if (rand < 0.5) return new Paladin(y, x);
        else if (rand < 0.75) return new Mago(y, x);
        else return new Buenos(y, x);
    } else {
        if (rand < 0.25) return new Asesino(y, x);
        else if (rand < 0.5) return new Tanque(y, x);
        else if (rand < 0.75) return new Brujo(y, x);
        else return new Malos(y, x);
    }
}

// ===== FUNCIÓN DE COMBATE =====
function combatirConClases(atacante, defensor) {
    let dañoPorcentaje;
    
    if (atacante instanceof Curandero) dañoPorcentaje = 5;
    else if (atacante instanceof Paladin) dañoPorcentaje = 10;
    else if (atacante instanceof Mago) dañoPorcentaje = 20;
    else if (atacante instanceof Asesino) {
        dañoPorcentaje = atacante.calcularDaño();
    }
    else if (atacante instanceof Tanque) dañoPorcentaje = 10;
    else if (atacante instanceof Brujo) dañoPorcentaje = 25;
    else dañoPorcentaje = 15;
    
    let daño = Math.floor(defensor.vida * (dañoPorcentaje / 100));
    daño = Math.max(1, daño);
    
    if (defensor instanceof Paladin) {
        daño = defensor.recibirDaño(daño);
    }
    
    const vidaAnterior = defensor.vida;
    defensor.vida = Math.max(defensor.vida - daño, 0);
    
    const resultado = defensor.vida <= 0 ? '💀 ELIMINADO' : `❤️ ${defensor.vida} restante`;
    añadirLog(`⚔️ ${atacante.clase} ataca a ${defensor.clase}: ${daño} daño (${dañoPorcentaje}%) - ${resultado}`, 'combat');
    
    if (atacante instanceof Brujo && daño > 0) {
        const vidaRobada = Math.floor(daño * 0.1);
        atacante.vida = Math.min(atacante.vida + vidaRobada, atacante.vidaMax);
        añadirLog(`🧙 Brujo roba ${vidaRobada} vida`, 'combat');
    }
    
    return defensor.vida <= 0;
}

// ===== FUNCIÓN PARA APLICAR COLOR A UNA CELDA =====
function aplicarColorCelda(cellDiv, celda) {
    if (!celda) {
        cellDiv.style.backgroundColor = '#24408e';
        cellDiv.style.color = '#ffff00';
        cellDiv.textContent = '·';
        cellDiv.style.textShadow = '0 0 5px #ffff00';
        cellDiv.style.borderRadius = '50%';
        cellDiv.title = '';
        cellDiv.classList.remove('taking-damage');
    } else if (celda instanceof Buenos) {
        cellDiv.style.backgroundColor = '#24408e';
        cellDiv.style.color = '#ffff00';
        cellDiv.textContent = celda.toString();
        cellDiv.style.textShadow = '0 0 8px #ffff00';
        cellDiv.style.borderRadius = '0';
        
        const porcentaje = Math.floor((celda.vida / celda.vidaMax) * 100);
        const barrasLlenas = Math.floor(porcentaje / 10);
        const barrasVacias = 10 - barrasLlenas;
        const barra = '█'.repeat(barrasLlenas) + '░'.repeat(barrasVacias);
        
        cellDiv.title = `${celda.clase}\n❤️ Vida: ${celda.vida}/${celda.vidaMax} (${porcentaje}%)\n[${barra}]`;
        cellDiv.classList.remove('taking-damage');
    } else if (celda instanceof Malos) {
        cellDiv.style.backgroundColor = '#24408e';
        cellDiv.style.color = '#ff0000';
        cellDiv.textContent = celda.toString();
        cellDiv.style.textShadow = '0 0 8px #ff0000';
        cellDiv.style.borderRadius = '0';
        
        const porcentaje = Math.floor((celda.vida / celda.vidaMax) * 100);
        const barrasLlenas = Math.floor(porcentaje / 10);
        const barrasVacias = 10 - barrasLlenas;
        const barra = '█'.repeat(barrasLlenas) + '░'.repeat(barrasVacias);
        
        cellDiv.title = `${celda.clase}\n❤️ Vida: ${celda.vida}/${celda.vidaMax} (${porcentaje}%)\n[${barra}]`;
        cellDiv.classList.remove('taking-damage');
    } else if (celda instanceof Obstaculos) {
        cellDiv.style.backgroundColor = '#0a1a4a';
        cellDiv.style.color = '#4a6c8f';
        cellDiv.textContent = '█';
        cellDiv.style.textShadow = 'none';
        cellDiv.style.borderRadius = '0';
        cellDiv.title = '🧱 Obstáculo';
        cellDiv.classList.remove('taking-damage');
    }
}

// ===== FUNCIÓN PARA CREAR EL TABLERO =====
function crearTablero() {
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;
    }
    
    // Limpiar el tablero completamente
    gameBoard.innerHTML = '';
    
    // Configurar estilos del grid
    gameBoard.style.display = 'grid';
    gameBoard.style.gap = '1px';
    gameBoard.style.backgroundColor = '#24408e';
    gameBoard.style.padding = '5px';
    gameBoard.style.borderRadius = '10px';
    gameBoard.style.margin = '0';
    gameBoard.style.width = '100%';
    gameBoard.style.height = '100%';
    
    // Asegurar que tenemos dimensiones
    if (alturaActual === 0 || anchuraActual === 0) {
        recalcularDimensiones();
    }
    
    console.log(`📋 Creando tablero ${alturaActual}x${anchuraActual}...`);
    
    // Crear todas las celdas
    for (let i = 0; i < alturaActual; i++) {
        for (let j = 0; j < anchuraActual; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.style.display = 'flex';
            cellDiv.style.alignItems = 'center';
            cellDiv.style.justifyContent = 'center';
            cellDiv.style.fontWeight = 'bold';
            
            // Establecer contenido temporal
            cellDiv.textContent = '·';
            cellDiv.style.color = '#ffff00';
            cellDiv.style.backgroundColor = '#24408e';
            
            gameBoard.appendChild(cellDiv);
        }
    }
    
    // Redimensionar al tamaño correcto
    setTimeout(() => redimensionarTablero(), 10);
    
    console.log(`✅ Tablero creado con ${alturaActual * anchuraActual} celdas`);
}

// ===== FUNCIÓN PARA ACTUALIZAR TODO EL TABLERO =====
function actualizarTodoElTablero() {
    if (!arrayEntidades || !gameBoard) {
        console.error('❌ No hay entidades o gameBoard');
        return;
    }
    
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    const cells = gameBoard.children;
    
    if (cells.length === 0) {
        console.error('❌ No hay celdas en el tablero');
        return;
    }
    
    console.log(`🔄 Actualizando ${cells.length} celdas...`);
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const index = i * anchura + j;
            if (index >= cells.length) continue;
            
            const celda = arrayEntidades[i][j];
            const cellDiv = cells[index];
            
            aplicarColorCelda(cellDiv, celda);
        }
    }
    
    actualizarContadoresVisuales();
    console.log('✅ Tablero actualizado correctamente');
}

// ===== FUNCIÓN PARA ACTUALIZAR UNA CELDA =====
function actualizarCelda(row, col, celda) {
    if (!gameBoard) return;
    if (!arrayEntidades) return;
    const anchura = arrayEntidades[0].length;
    const index = row * anchura + col;
    const cells = gameBoard.children;
    if (index >= cells.length) return;
    aplicarColorCelda(cells[index], celda);
}

// ===== FUNCIÓN PARA MARCAR CELDA CON DAÑO =====
function marcarDaño(row, col) {
    if (!gameBoard) return;
    if (!arrayEntidades) return;
    const anchura = arrayEntidades[0].length;
    const index = row * anchura + col;
    const cells = gameBoard.children;
    if (index >= cells.length) return;
    
    const cellDiv = cells[index];
    cellDiv.classList.add('taking-damage');
    setTimeout(() => {
        cellDiv.classList.remove('taking-damage');
    }, 300);
}

// ===== FUNCIÓN PRINCIPAL DEL JUEGO =====
function actualizarJuego(altura, anchura, nPersonajes) {
    // 1. ASIGNAR ENEMIGOS CERCANOS
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
        } else if (arrayPersonajes[i] instanceof Malos) {
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
    
    // 2. MOVER PERSONAJES
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            if (arrayEntidades[i][j] instanceof Personajes) {
                if (Math.random() < 0.2) continue;
                
                const entidad = arrayEntidades[i][j];
                entidad.mover(anchura, altura, arrayEntidades);
            }
        }
    }
    
    // 3. COMBATIR
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
                    } 
                    else if (
                        (arrayEntidades[newY][newX] instanceof Malos && entidad instanceof Buenos) ||
                        (arrayEntidades[newY][newX] instanceof Buenos && entidad instanceof Malos)
                    ) {
                        const defensor = arrayEntidades[newY][newX];
                        
                        marcarDaño(i, j);
                        marcarDaño(newY, newX);
                        
                        if (combatirConClases(entidad, defensor)) {
                            // El defensor murió
                            for (let k = 0; k < nPersonajes; k++) {
                                if (arrayPersonajes[k] === defensor) {
                                    arrayPersonajes[k] = null;
                                    break;
                                }
                            }
                            
                            arrayEntidades[newY][newX] = entidad;
                            arrayEntidades[i][j] = null;
                            
                            Personajes.setnPersonajes(Personajes.getnPersonajes() - 1);
                            if (defensor instanceof Buenos) Buenos.setnBuenos(Buenos.getnBuenos() - 1);
                            else Malos.setnMalos(Malos.getnMalos() - 1);
                            
                            actualizarCelda(i, j, null);
                            actualizarCelda(newY, newX, entidad);
                        } else {
                            actualizarCelda(newY, newX, defensor);
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

// ===== FUNCIÓN INICIAR SIMULACIÓN (CORREGIDA) =====
function iniciarSimulacion() {
    console.log('🎮 INICIANDO SIMULACIÓN...');
    detenerSimulacion();
    simulacionPausada = false;
    
    // Resetear contadores
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    
    recalcularDimensiones();
    
    const altura = alturaActual;
    const anchura = anchuraActual;
    const totalCeldas = altura * anchura;
    
    // Determinar número de personajes según opción
    let nPersonajes;
    if (opcionSeleccionada === 1) {
        nPersonajes = nPersonajesConfig;
        añadirLog(`📊 Modo: Mitad y mitad (${nPersonajes} personajes)`, 'system');
    } else if (opcionSeleccionada === 2) {
        nPersonajes = Math.floor(Math.random() * (totalCeldas * 0.02)) + 5;
        añadirLog(`🎲 Modo: Totalmente aleatorio (${nPersonajes} personajes)`, 'system');
    } else {
        nPersonajes = Math.floor(Math.random() * (totalCeldas * 0.02)) + 5;
        while (nPersonajes % 2 !== 0) {
            nPersonajes = Math.floor(Math.random() * (totalCeldas * 0.02)) + 5;
        }
        añadirLog(`🔄 Modo: Mitad aleatoria (${nPersonajes} personajes)`, 'system');
    }
    
    nPersonajesActual = nPersonajes;
    
    // Crear arrays del juego
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
    añadirLog(`🧱 Obstáculos: ${numObstaculos}`, 'system');
    
    // Generar personajes con clases
    for (let i = 0; i < nPersonajes; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
        } while (arrayEntidades[y][x] !== null);
        
        if (i % 2 === 0) {
            arrayEntidades[y][x] = generarPersonajeConClase('bueno', y, x);
            arrayPersonajes[i] = arrayEntidades[y][x];
        } else {
            arrayEntidades[y][x] = generarPersonajeConClase('malo', y, x);
            arrayPersonajes[i] = arrayEntidades[y][x];
        }
    }
    
    añadirLog(`👥 Buenos: ${Buenos.getnBuenos()} | Malos: ${Malos.getnMalos()}`, 'system');
    
    // Crear el tablero
    crearTablero();
    
    // FORZAR MÚLTIPLES ACTUALIZACIONES para asegurar que se ve
    setTimeout(() => {
        console.log('🔄 Primera actualización del tablero...');
        actualizarTodoElTablero();
    }, 50);
    
    setTimeout(() => {
        console.log('🔄 Segunda actualización del tablero (por si acaso)...');
        actualizarTodoElTablero();
    }, 150);
    
    setTimeout(() => {
        console.log('🔄 Tercera actualización del tablero (aseguramiento)...');
        actualizarTodoElTablero();
        // También forzar redimensionamiento
        redimensionarTablero();
    }, 300);
    
    // Ocultar game over y mostrar controles
    document.getElementById('gameOverPanel').classList.add('hidden');
    document.getElementById('simulationControls').classList.remove('hidden');
    
    // Iniciar el intervalo del juego
    intervaloSimulacion = setInterval(() => actualizarJuego(altura, anchura, nPersonajes), velocidadActual);
    añadirLog('▶️ Batalla comenzada', 'system');
    
    // Marcar que ya no es el primer inicio
    primerInicio = false;
}

// ===== FUNCIONES DE CONTROL =====
function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
        simulacionPausada = true;
        añadirLog('⏸️ Juego pausado', 'system');
    }
}

function continuarSimulacion() {
    if (simulacionPausada && arrayEntidades) {
        intervaloSimulacion = setInterval(
            () => actualizarJuego(alturaActual, anchuraActual, nPersonajesActual),
            velocidadActual
        );
        simulacionPausada = false;
        añadirLog('▶️ Juego reanudado', 'system');
    }
}

function ajustarVelocidad(cambio) {
    velocidadActual = Math.max(70, Math.min(300, velocidadActual + cambio));
    document.getElementById('velocidadDisplay').textContent = velocidadActual + 'ms';
    actualizarIndicadorVelocidad();
    
    let velocidadTexto = '';
    if (velocidadActual >= 250) velocidadTexto = '🐢 LENTA';
    else if (velocidadActual >= 150) velocidadTexto = '⚡ NORMAL';
    else velocidadTexto = '🚀 RÁPIDA';
    
    añadirLog(`⚡ Velocidad: ${velocidadActual}ms (${velocidadTexto})`, 'system');
    
    if (intervaloSimulacion) {
        detenerSimulacion();
        continuarSimulacion();
    }
}

function actualizarIndicadorVelocidad() {
    const display = document.getElementById('velocidadDisplay');
    if (!display) return;
    
    if (velocidadActual >= 250) {
        display.setAttribute('data-speed', 'lenta');
    } else if (velocidadActual >= 150) {
        display.setAttribute('data-speed', 'normal');
    } else {
        display.setAttribute('data-speed', 'rapida');
    }
}

// ===== FUNCIONES DE MONEDAS =====
function insertCoin() {
    coins++;
    actualizarCoinDisplay();
    añadirLog(`🪙 Moneda insertada. Total: ${coins}`, 'system');
    
    if (coins > 0) {
        document.getElementById('menuCard').classList.add('active');
        document.getElementById('menuCard').style.opacity = '1';
        document.getElementById('menuCard').style.pointerEvents = 'all';
        
        document.querySelectorAll('#menuCard input, #menuCard button').forEach(el => {
            el.disabled = false;
        });
        añadirLog('🔓 Menú desbloqueado', 'system');
    }
    
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
    // Actualizar contador de la marquesina
    const gameCoinEl = document.getElementById('gameCoinCount');
    if (gameCoinEl) gameCoinEl.textContent = coins;
    
    // Actualizar contador del panel de control
    const panelCoinEl = document.getElementById('panelCoinCount');
    if (panelCoinEl) panelCoinEl.textContent = coins;
    
    // Actualizar contador del menú principal
    const menuCoinEl = document.getElementById('coinCount');
    if (menuCoinEl) menuCoinEl.textContent = coins;
    
    // Actualizar contador de game over
    actualizarGameOverCoins();
    actualizarBotonReintentar();
}

function actualizarGameOverCoins() {
    const gameOverCoinSpan = document.getElementById('gameOverCoinCount');
    if (gameOverCoinSpan) {
        gameOverCoinSpan.textContent = coins;
    }
}

function actualizarBotonReintentar() {
    const retryBtn = document.getElementById('gameOverRetry');
    if (!retryBtn) return;
    
    if (!document.getElementById('gameOverPanel').classList.contains('hidden')) {
        if (coins > 0) {
            retryBtn.classList.remove('disabled');
            retryBtn.style.pointerEvents = 'auto';
            retryBtn.style.opacity = '1';
            retryBtn.style.filter = 'none';
        } else {
            retryBtn.classList.add('disabled');
            retryBtn.style.pointerEvents = 'none';
            retryBtn.style.opacity = '0.4';
            retryBtn.style.filter = 'grayscale(0.8)';
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
        añadirLog('⚙️ Modo 1: Necesitas especificar número de personajes', 'info');
    } else {
        nPersonajesRow.classList.add('hidden');
        añadirLog(`⚙️ Modo ${opcion} seleccionado`, 'info');
    }
    
    validarBotonInicio();
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
    
    // Asegurar que los contadores de monedas se inicializan
    coins = 0;
    actualizarCoinDisplay();
}

function reiniciarVictorias() {
    if (confirm('¿Reiniciar contadores de victorias?')) {
        victoriasBuenos = 0;
        victoriasMalos = 0;
        actualizarVictoriasVisuales();
        guardarVictorias();
        añadirLog('🏆 Contadores de victorias reiniciados', 'system');
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
        añadirLog('❌ Intento de jugar sin monedas', 'info');
        return;
    }
    
    if (opcionSeleccionada === null) {
        alert('Selecciona un modo de juego');
        añadirLog('❌ Intento de jugar sin seleccionar modo', 'info');
        return;
    }
    
    coins--;
    actualizarCoinDisplay();
    añadirLog(`🎮 Partida iniciada (monedas restantes: ${coins})`, 'system');
    
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
        añadirLog('❌ No hay monedas para reintentar', 'info');
        return;
    }
    
    coins--;
    actualizarCoinDisplay();
    añadirLog(`🔄 Reintentando partida (monedas restantes: ${coins})`, 'system');
    
    document.getElementById('gameOverPanel').classList.add('hidden');
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    iniciarSimulacion();
}

function mostrarResultado() {
    const buenos = Buenos.getnBuenos() || 0;
    const malos = Malos.getnMalos() || 0;
    
    if (buenos <= 0) {
        victoriasMalos++;
        añadirLog(`💀 MALOS GANAN - Victoria #${victoriasMalos}`, 'victory');
    } else {
        victoriasBuenos++;
        añadirLog(`✨ BUENOS GANAN - Victoria #${victoriasBuenos}`, 'victory');
    }
    
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
    
    // Resetear contadores de personajes
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    
    // Actualizar contadores visuales
    actualizarContadoresVisuales();
    actualizarCoinDisplay();
    
    if (gameBoard) {
        gameBoard.innerHTML = '';
    }
    
    añadirLog('🏠 Volviendo al menú principal', 'system');
}

// ===== SISTEMA DE LOGS =====
function añadirLog(mensaje, tipo = 'info') {
    const logContainer = document.getElementById('logContainer');
    if (!logContainer) return;
    
    const ahora = new Date();
    const timestamp = `${ahora.getHours().toString().padStart(2,'0')}:${ahora.getMinutes().toString().padStart(2,'0')}:${ahora.getSeconds().toString().padStart(2,'0')}`;
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${tipo}`;
    logEntry.innerHTML = `<span style="color: #888; margin-right: 5px;">[${timestamp}]</span> ${mensaje}`;
    
    logContainer.appendChild(logEntry);
    
    logs.push({ mensaje, tipo, timestamp });
    if (logs.length > 50) {
        logs.shift();
        if (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }
    
    logContainer.scrollTop = logContainer.scrollHeight;
}

function limpiarLogs() {
    const logContainer = document.getElementById('logContainer');
    if (logContainer) {
        logContainer.innerHTML = '';
        logs = [];
        añadirLog('📋 Bitácora limpiada', 'system');
    }
}

function filtrarLogs(tipo) {
    const logContainer = document.getElementById('logContainer');
    if (!logContainer) return;
    
    document.querySelectorAll('.filter-dot').forEach(dot => {
        dot.classList.remove('active');
    });
    
    if (event?.target) event.target.classList.add('active');
    
    filtroActivo = tipo;
    const logs = logContainer.children;
    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        if (tipo === 'todos' || log.classList.contains(tipo)) {
            log.style.display = 'block';
        } else {
            log.style.display = 'none';
        }
    }
}

// ===== CONTROLES DE TECLADO =====
function iniciarControlesTeclado() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        
        const tecla = e.key.toLowerCase();
        const juegoActivo = !document.getElementById('menuScreen').classList.contains('hidden');
        const gameOverVisible = !document.getElementById('gameOverPanel').classList.contains('hidden');
        
        if (tecla === 'f1' || tecla === '?') {
            e.preventDefault();
            mostrarAyudaTeclado();
            return;
        }
        
        switch(tecla) {
            case ' ':
            case 'space':
                e.preventDefault();
                insertCoin();
                break;
                
            case 'l':
                e.preventDefault();
                limpiarLogs();
                break;
                
            case 'escape':
                e.preventDefault();
                if (!document.getElementById('menuScreen').classList.contains('hidden')) {
                    // Ya está en el menú
                } else {
                    volverAlMenu();
                }
                break;
        }
        
        if (juegoActivo) {
            switch(tecla) {
                case 'enter':
                    e.preventDefault();
                    if (coins > 0) {
                        useCoin();
                    } else {
                        añadirLog('❌ No hay monedas. Usa ESPACIO para insertar', 'info');
                    }
                    break;
                    
                case 'p':
                    e.preventDefault();
                    if (intervaloSimulacion) {
                        detenerSimulacion();
                    } else if (simulacionPausada) {
                        continuarSimulacion();
                    }
                    break;
                    
                case 'c':
                    e.preventDefault();
                    if (simulacionPausada) {
                        continuarSimulacion();
                    }
                    break;
                    
                case 'r':
                    e.preventDefault();
                    volverAlMenu();
                    break;
                    
                case '+':
                case '=':
                    e.preventDefault();
                    ajustarVelocidad(-25);
                    break;
                    
                case '-':
                case '_':
                    e.preventDefault();
                    ajustarVelocidad(25);
                    break;
                    
                case '0':
                    e.preventDefault();
                    velocidadActual = 200;
                    document.getElementById('velocidadDisplay').textContent = '200ms';
                    actualizarIndicadorVelocidad();
                    if (intervaloSimulacion) {
                        detenerSimulacion();
                        continuarSimulacion();
                    }
                    añadirLog('⚡ Velocidad normal (200ms)', 'system');
                    break;
                    
                case '1':
                    e.preventDefault();
                    velocidadActual = 300;
                    document.getElementById('velocidadDisplay').textContent = '300ms';
                    actualizarIndicadorVelocidad();
                    if (intervaloSimulacion) {
                        detenerSimulacion();
                        continuarSimulacion();
                    }
                    añadirLog('🐢 Velocidad lenta (300ms)', 'system');
                    break;
                    
                case '2':
                    e.preventDefault();
                    velocidadActual = 120;
                    document.getElementById('velocidadDisplay').textContent = '120ms';
                    actualizarIndicadorVelocidad();
                    if (intervaloSimulacion) {
                        detenerSimulacion();
                        continuarSimulacion();
                    }
                    añadirLog('🚀 Velocidad rápida (120ms)', 'system');
                    break;
            }
        }
        
        if (gameOverVisible && tecla === 'enter') {
            e.preventDefault();
            reintentarPartida();
        }
    });
}

function mostrarAyudaTeclado() {
    const ayuda = `
╔════════════════════════════╗
║     CONTROLES DE TECLADO    ║
╠════════════════════════════╣
║ ESPACIO  - Insertar moneda  ║
║ ENTER    - Jugar/Reintentar ║
║ P        - Pausar juego      ║
║ C        - Continuar juego   ║
║ R        - Reiniciar         ║
║ ESC      - Volver al menú    ║
║ + / -    - Velocidad         ║
║ 0        - Velocidad normal  ║
║ 1        - Velocidad lenta   ║
║ 2        - Velocidad rápida  ║
║ L        - Limpiar bitácora  ║
║ F1       - Mostrar esta ayuda║
╚════════════════════════════╝
    `;
    console.log(ayuda);
    añadirLog('📋 Controles mostrados en consola', 'system');
}

// ===== FUNCIÓN PARA CAMBIAR TEMA =====
function cambiarTema(tema) {
    const themeLink = document.getElementById('theme-style') || document.createElement('link');
    if (!themeLink.id) {
        themeLink.id = 'theme-style';
        themeLink.rel = 'stylesheet';
        document.head.appendChild(themeLink);
    }
    
    themeLink.href = `css/style-${tema}.css`;
    
    document.getElementById('themePacman')?.classList.remove('active');
    document.getElementById('themeClassic')?.classList.remove('active');
    document.getElementById(`theme${tema.charAt(0).toUpperCase() + tema.slice(1)}`)?.classList.add('active');
    document.getElementById('themeIndicator').textContent = tema.toUpperCase();
    
    localStorage.setItem('survivors-theme', tema);
    añadirLog(`🎨 Tema cambiado a: ${tema.toUpperCase()}`, 'system');
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
window.limpiarLogs = limpiarLogs;
window.filtrarLogs = filtrarLogs;
window.cambiarTema = cambiarTema;