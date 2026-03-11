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

// ===== NUEVAS VARIABLES PARA ESTADÍSTICAS =====
let totalCombates = 0;
let dañoTotal = 0;
let totalMuertes = 0;
let tiempoInicio = null;
let intervaloReloj = null;

// ===== CONSTANTES DE VELOCIDAD =====
const VELOCIDADES = {
    LENTA: 300,
    NORMAL: 200,
    RAPIDA: 120,
    MUY_RAPIDA: 70
};

// ===== CONFIGURACIÓN DE CLASES PARA TOOLTIPS MINIMALISTAS =====
const CLASES_CONFIG = {
    curandero: {
        nombre: 'CURANDERO',
        vida: 120,
        dano: 5,
        habilidad: 'Cura +10%'
    },
    paladin: {
        nombre: 'PALADÍN',
        vida: 150,
        dano: 10,
        habilidad: '-50% daño'
    },
    mago: {
        nombre: 'MAGO',
        vida: 80,
        dano: 20,
        habilidad: 'Daño mágico'
    },
    asesino: {
        nombre: 'ASESINO',
        vida: 70,
        dano: 30,
        habilidad: '15% crítico x2'
    },
    tanque: {
        nombre: 'TANQUE',
        vida: 200,
        dano: 10,
        habilidad: 'Alta resistencia'
    },
    brujo: {
        nombre: 'BRUJO',
        vida: 90,
        dano: 25,
        habilidad: 'Roba 10% vida'
    }
};

// ===== FUNCIÓN PARA GENERAR TOOLTIP MINIMALISTA =====
function generarTooltipClase(clase) {
    const c = CLASES_CONFIG[clase];
    if (!c) return '';
    
    return `${c.nombre}
❤️ ${c.vida}  ⚔️ ${c.dano}%
✨ ${c.habilidad}`;
}

// ===== FUNCIÓN PARA ACTUALIZAR TOOLTIPS =====
function actualizarTooltipsClases() {
    const clases = ['curandero', 'paladin', 'mago', 'asesino', 'tanque', 'brujo'];
    clases.forEach(clase => {
        const elemento = document.querySelector(`[data-class="${clase}"]`);
        if (elemento) {
            elemento.setAttribute('data-tooltip', generarTooltipClase(clase));
        }
    });
}

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
    
    // ===== INICIALIZAR TOOLTIPS MINIMALISTAS =====
    actualizarTooltipsClases();
    
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
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;
    }
    
    const container = document.querySelector('.game-board-container');
    if (!container) return;
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    console.log(`📏 Contenedor: ${containerWidth}x${containerHeight}`);
    
    if (containerWidth === 0 || containerHeight === 0) {
        console.warn('⚠️ Contenedor sin dimensiones, usando valores por defecto');
        alturaActual = 20;
        anchuraActual = 20;
        return;
    }
    
    const MIN_CELL_SIZE = 20;
    const MAX_CELL_SIZE = 45;
    
    const maxCellsWidth = Math.floor(containerWidth / MIN_CELL_SIZE);
    const maxCellsHeight = Math.floor(containerHeight / MIN_CELL_SIZE);
    
    alturaActual = Math.floor(maxCellsHeight * 0.8);
    anchuraActual = Math.floor(maxCellsWidth * 0.8);
    
    if (alturaActual % 2 !== 0) alturaActual--;
    if (anchuraActual % 2 !== 0) anchuraActual--;
    
    alturaActual = Math.max(alturaActual, 16);
    anchuraActual = Math.max(anchuraActual, 16);
    alturaActual = Math.min(alturaActual, 40);
    anchuraActual = Math.min(anchuraActual, 40);
    
    console.log(`📏 Dimensiones calculadas: ${anchuraActual}x${alturaActual}`);
}

// ===== FUNCIÓN PARA REDIMENSIONAR EL TABLERO =====
function redimensionarTablero() {
    if (!gameBoard || !arrayEntidades) return;
    
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    
    const boardWidth = gameBoard.clientWidth;
    const boardHeight = gameBoard.clientHeight;
    
    if (boardWidth === 0 || boardHeight === 0) {
        console.warn('⚠️ Tablero sin dimensiones, reintentando...');
        setTimeout(redimensionarTablero, 100);
        return;
    }
    
    const cellSizeByWidth = Math.floor(boardWidth / anchura);
    const cellSizeByHeight = Math.floor(boardHeight / altura);
    
    let cellSize = Math.min(cellSizeByWidth, cellSizeByHeight);
    cellSize = Math.max(cellSize, 16);
    cellSize = Math.min(cellSize, 45);
    
    const fontSize = Math.floor(cellSize * 0.5);
    
    gameBoard.style.gridTemplateColumns = `repeat(${anchura}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${altura}, ${cellSize}px)`;
    
    const cells = gameBoard.children;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${fontSize}px`;
    }
    
    console.log(`📏 Celdas redimensionadas: ${cellSize}px`);
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

// ===== FUNCIÓN DE COMBATE CON ESTADÍSTICAS =====
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
    
    totalCombates++;
    dañoTotal += daño;
    
    const vidaAnterior = defensor.vida;
    defensor.vida = Math.max(defensor.vida - daño, 0);
    
    if (defensor.vida <= 0) {
        totalMuertes++;
    }
    
    const resultado = defensor.vida <= 0 ? '💀 ELIMINADO' : `❤️ ${defensor.vida} restante`;
    añadirLog(`⚔️ ${atacante.clase} ataca a ${defensor.clase}: ${daño} daño (${dañoPorcentaje}%) - ${resultado}`, 'combat');
    
    if (atacante instanceof Brujo && daño > 0) {
        const vidaRobada = Math.floor(daño * 0.1);
        atacante.vida = Math.min(atacante.vida + vidaRobada, atacante.vidaMax);
        añadirLog(`🧙 Brujo roba ${vidaRobada} vida`, 'combat');
    }
    
    actualizarEstadisticasCombate();
    actualizarEstadisticasClases();
    
    return defensor.vida <= 0;
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
    
    if (cells.length !== altura * anchura) {
        console.warn(`⚠️ Número de celdas incorrecto: ${cells.length} vs ${altura * anchura}`);
        return;
    }
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const index = i * anchura + j;
            if (index >= cells.length) continue;
            
            const celda = arrayEntidades[i][j];
            const cellDiv = cells[index];
            
            if (!celda) {
                cellDiv.style.backgroundColor = 'var(--pacman-blue)';
                cellDiv.style.color = '#ffff00';
                cellDiv.textContent = '·';
                cellDiv.style.textShadow = '0 0 5px #ffff00';
                cellDiv.style.borderRadius = '50%';
                cellDiv.title = '';
            } else if (celda instanceof Buenos || celda instanceof Malos) {
                cellDiv.style.backgroundColor = 'var(--pacman-blue)';
                cellDiv.style.color = celda instanceof Buenos ? '#ffff00' : '#ff0000';
                cellDiv.textContent = celda.toString();
                cellDiv.style.textShadow = celda instanceof Buenos ? 
                    '0 0 8px #ffff00' : '0 0 8px #ff0000';
                cellDiv.style.borderRadius = '0';
                
                const porcentaje = Math.floor((celda.vida / celda.vidaMax) * 100);
                const barrasLlenas = Math.floor(porcentaje / 10);
                const barrasVacias = 10 - barrasLlenas;
                const barra = '█'.repeat(barrasLlenas) + '░'.repeat(barrasVacias);
                cellDiv.title = `${celda.clase}\n❤️ Vida: ${celda.vida}/${celda.vidaMax} (${porcentaje}%)\n[${barra}]`;
            } else if (celda instanceof Obstaculos) {
                cellDiv.style.backgroundColor = '#0a1a4a';
                cellDiv.style.color = '#4a6c8f';
                cellDiv.textContent = '█';
                cellDiv.style.textShadow = 'none';
                cellDiv.style.borderRadius = '0';
                cellDiv.title = '🧱 Obstáculo';
            }
        }
    }
    
    actualizarContadoresVisuales();
}

// ===== FUNCIÓN PARA ACTUALIZAR UNA CELDA =====
function actualizarCelda(row, col, celda) {
    if (!gameBoard) return;
    if (!arrayEntidades) return;
    const anchura = arrayEntidades[0].length;
    const index = row * anchura + col;
    const cells = gameBoard.children;
    if (index >= cells.length) return;
    
    const cellDiv = cells[index];
    
    if (!celda) {
        cellDiv.style.backgroundColor = 'var(--pacman-blue)';
        cellDiv.style.color = '#ffff00';
        cellDiv.textContent = '·';
        cellDiv.style.textShadow = '0 0 5px #ffff00';
        cellDiv.style.borderRadius = '50%';
        cellDiv.title = '';
    } else if (celda instanceof Buenos || celda instanceof Malos) {
        cellDiv.style.backgroundColor = 'var(--pacman-blue)';
        cellDiv.style.color = celda instanceof Buenos ? '#ffff00' : '#ff0000';
        cellDiv.textContent = celda.toString();
        cellDiv.style.textShadow = celda instanceof Buenos ? 
            '0 0 8px #ffff00' : '0 0 8px #ff0000';
        cellDiv.style.borderRadius = '0';
        
        const porcentaje = Math.floor((celda.vida / celda.vidaMax) * 100);
        const barrasLlenas = Math.floor(porcentaje / 10);
        const barrasVacias = 10 - barrasLlenas;
        const barra = '█'.repeat(barrasLlenas) + '░'.repeat(barrasVacias);
        cellDiv.title = `${celda.clase}\n❤️ Vida: ${celda.vida}/${celda.vidaMax} (${porcentaje}%)\n[${barra}]`;
    } else if (celda instanceof Obstaculos) {
        cellDiv.style.backgroundColor = '#0a1a4a';
        cellDiv.style.color = '#4a6c8f';
        cellDiv.textContent = '█';
        cellDiv.style.textShadow = 'none';
        cellDiv.style.borderRadius = '0';
        cellDiv.title = '🧱 Obstáculo';
    }
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
    actualizarEstadisticasClases();
    actualizarEstadisticasCombate();
    
    if (Buenos.getnBuenos() <= 0 || Malos.getnMalos() <= 0) {
        detenerSimulacion();
        mostrarResultado();
    }
}

// ===== FUNCIÓN INICIAR SIMULACIÓN =====
function iniciarSimulacion() {
    console.log('🎮 INICIANDO SIMULACIÓN...');
    
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
    }
    simulacionPausada = false;
    
    totalCombates = 0;
    dañoTotal = 0;
    totalMuertes = 0;
    detenerReloj();
    iniciarReloj();
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    
    document.getElementById('gameOverPanel').classList.add('hidden');
    document.getElementById('simulationControls').classList.remove('hidden');
    
    esperarDimensionesYIniciar();
}

// ===== FUNCIÓN PARA ESPERAR DIMENSIONES DEL CONTENEDOR =====
function esperarDimensionesYIniciar(intentos = 0) {
    const container = document.querySelector('.game-board-container');
    if (!container) {
        console.error('❌ No se encuentra el contenedor del tablero');
        return;
    }
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    if (containerWidth > 50 && containerHeight > 50) {
        console.log(`📏 Contenedor listo: ${containerWidth}x${containerHeight}`);
        crearTableroConDimensionesReales();
        return;
    }
    
    if (intentos < 20) {
        console.log(`⏳ Esperando dimensiones... Intento ${intentos + 1}/20`);
        setTimeout(() => esperarDimensionesYIniciar(intentos + 1), 100);
    } else {
        console.warn('⚠️ No se obtuvieron dimensiones, usando valores por defecto');
        usarDimensionesPorDefecto();
    }
}

// ===== FUNCIÓN PARA USAR DIMENSIONES POR DEFECTO =====
function usarDimensionesPorDefecto() {
    console.log('📏 Usando dimensiones por defecto: 20x20');
    alturaActual = 20;
    anchuraActual = 20;
    continuarCreacionTablero();
}

// ===== FUNCIÓN PARA CREAR TABLERO CON DIMENSIONES REALES =====
function crearTableroConDimensionesReales() {
    recalcularDimensiones();
    
    if (alturaActual < 8 || anchuraActual < 8) {
        console.warn('⚠️ Dimensiones muy pequeñas, ajustando...');
        alturaActual = Math.max(alturaActual, 16);
        anchuraActual = Math.max(anchuraActual, 16);
    }
    
    if (alturaActual % 2 !== 0) alturaActual--;
    if (anchuraActual % 2 !== 0) anchuraActual--;
    
    console.log(`📏 Dimensiones finales: ${anchuraActual}x${alturaActual}`);
    continuarCreacionTablero();
}

// ===== FUNCIÓN PARA CONTINUAR LA CREACIÓN DEL TABLERO =====
function continuarCreacionTablero() {
    const altura = alturaActual;
    const anchura = anchuraActual;
    const totalCeldas = altura * anchura;
    
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
    
    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    arrayPersonajes = Array(nPersonajes).fill(null);
    
    const numObstaculos = Math.floor(totalCeldas * 0.01);
    for (let i = 0; i < numObstaculos; i++) {
        let x, y;
        let intentos = 0;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
            intentos++;
            if (intentos > 1000) break;
        } while (arrayEntidades[y] && arrayEntidades[y][x] !== null);
        
        if (intentos <= 1000 && arrayEntidades[y]) {
            arrayEntidades[y][x] = new Obstaculos(y, x);
        }
    }
    añadirLog(`🧱 Obstáculos: ${numObstaculos}`, 'system');
    
    for (let i = 0; i < nPersonajes; i++) {
        let x, y;
        let intentos = 0;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
            intentos++;
            if (intentos > 1000) break;
        } while (arrayEntidades[y] && arrayEntidades[y][x] !== null);
        
        if (intentos <= 1000 && arrayEntidades[y]) {
            if (i % 2 === 0) {
                arrayEntidades[y][x] = generarPersonajeConClase('bueno', y, x);
                arrayPersonajes[i] = arrayEntidades[y][x];
            } else {
                arrayEntidades[y][x] = generarPersonajeConClase('malo', y, x);
                arrayPersonajes[i] = arrayEntidades[y][x];
            }
        }
    }
    
    añadirLog(`👥 Buenos: ${Buenos.getnBuenos()} | Malos: ${Malos.getnMalos()}`, 'system');
    
    crearTableroVisual(altura, anchura);
}

// ===== FUNCIÓN PARA CREAR TABLERO VISUAL =====
function crearTableroVisual(altura, anchura) {
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
    }
    
    gameBoard.innerHTML = '';
    
    gameBoard.style.display = 'grid';
    gameBoard.style.gridTemplateColumns = `repeat(${anchura}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${altura}, 1fr)`;
    gameBoard.style.gap = '1px';
    gameBoard.style.backgroundColor = 'var(--pacman-blue)';
    gameBoard.style.padding = '5px';
    gameBoard.style.borderRadius = '10px';
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.style.display = 'flex';
            cellDiv.style.alignItems = 'center';
            cellDiv.style.justifyContent = 'center';
            cellDiv.style.fontWeight = 'bold';
            cellDiv.style.width = '100%';
            cellDiv.style.height = '100%';
            cellDiv.style.backgroundColor = 'var(--pacman-blue)';
            cellDiv.style.color = '#ffff00';
            cellDiv.textContent = '·';
            gameBoard.appendChild(cellDiv);
        }
    }
    
    console.log(`✅ Tablero creado: ${altura}x${anchura} (${altura * anchura} celdas)`);
    
    actualizarTodoElTablero();
    
    setTimeout(() => {
        redimensionarTablero();
    }, 50);
    
    setTimeout(() => {
        actualizarTodoElTablero();
        redimensionarTablero();
    }, 150);
    
    setTimeout(() => {
        actualizarTodoElTablero();
        redimensionarTablero();
    }, 500);
    
    intervaloSimulacion = setInterval(() => {
        actualizarJuego(altura, anchura, nPersonajesActual);
    
    añadirLog('▶️ Batalla comenzada', 'system');
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

// ===== FUNCIONES DE RELOJ =====
function iniciarReloj() {
    tiempoInicio = Date.now();
    if (intervaloReloj) clearInterval(intervaloReloj);
    
    intervaloReloj = setInterval(() => {
        if (!arrayEntidades || simulacionPausada) return;
        
        const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        const minutos = Math.floor(tiempoTranscurrido / 60).toString().padStart(2, '0');
        const segundos = (tiempoTranscurrido % 60).toString().padStart(2, '0');
        
        const relojDisplay = document.getElementById('tiempoPartida');
        if (relojDisplay) {
            relojDisplay.textContent = `${minutos}:${segundos}`;
        }
    }, 1000);
}

function detenerReloj() {
    if (intervaloReloj) {
        clearInterval(intervaloReloj);
        intervaloReloj = null;
    }
}

// ===== FUNCIONES DE ESTADÍSTICAS =====
function actualizarEstadisticasClases() {
    if (!arrayEntidades) return;
    
    let curanderos = 0, paladines = 0, magos = 0;
    let asesinos = 0, tanques = 0, brujos = 0;
    
    for (let i = 0; i < arrayPersonajes.length; i++) {
        const p = arrayPersonajes[i];
        if (!p) continue;
        
        if (p instanceof Curandero) curanderos++;
        else if (p instanceof Paladin) paladines++;
        else if (p instanceof Mago) magos++;
        else if (p instanceof Asesino) asesinos++;
        else if (p instanceof Tanque) tanques++;
        else if (p instanceof Brujo) brujos++;
    }
    
    document.getElementById('curanderoCount').textContent = curanderos;
    document.getElementById('paladinCount').textContent = paladines;
    document.getElementById('magoCount').textContent = magos;
    document.getElementById('asesinoCount').textContent = asesinos;
    document.getElementById('tanqueCount').textContent = tanques;
    document.getElementById('brujoCount').textContent = brujos;
}

function actualizarEstadisticasCombate() {
    document.getElementById('totalCombates').textContent = totalCombates;
    document.getElementById('dañoTotal').textContent = dañoTotal;
    document.getElementById('totalMuertes').textContent = totalMuertes;
    document.getElementById('supervivientes').textContent = Personajes.getnPersonajes() || 0;
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
    const gameCoinEl = document.getElementById('gameCoinCount');
    if (gameCoinEl) gameCoinEl.textContent = coins;
    
    const panelCoinEl = document.getElementById('panelCoinCount');
    if (panelCoinEl) panelCoinEl.textContent = coins;
    
    const menuCoinEl = document.getElementById('coinCount');
    if (menuCoinEl) menuCoinEl.textContent = coins;
    
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
    const total = Personajes.getnPersonajes() || 0;
    const buenos = Buenos.getnBuenos() || 0;
    const malos = Malos.getnMalos() || 0;
    
    document.getElementById('totalStats').textContent = total;
    document.getElementById('buenosStats').textContent = buenos;
    document.getElementById('malosStats').textContent = malos;
    document.getElementById('buenosStatsCard').textContent = buenos;
    document.getElementById('malosStatsCard').textContent = malos;
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
    
    setTimeout(() => {
        iniciarSimulacion();
    }, 50);
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
    
    actualizarEstadisticasCombate();
    
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
    detenerReloj();
}

function volverAlMenu() {
    detenerSimulacion();
    detenerReloj();
    
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