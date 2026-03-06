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

// ===== FUNCIÓN PARA GENERAR PERSONAJE CON CLASE ALEATORIA =====
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

// ===== FUNCIÓN DE COMBATE CON CLASES =====
function combatirConClases(atacante, defensor) {
    // Calcular daño base según clase
    let dañoPorcentaje;
    
    if (atacante instanceof Curandero) dañoPorcentaje = 5;
    else if (atacante instanceof Paladin) dañoPorcentaje = 10;
    else if (atacante instanceof Mago) dañoPorcentaje = 20;
    else if (atacante instanceof Asesino) {
        dañoPorcentaje = atacante.calcularDaño(); // Ya incluye crítico
    }
    else if (atacante instanceof Tanque) dañoPorcentaje = 10;
    else if (atacante instanceof Brujo) dañoPorcentaje = 25;
    else dañoPorcentaje = 15; // Soldado normal
    
    // Calcular daño como porcentaje de la vida actual del defensor
    let daño = Math.floor(defensor.vida * (dañoPorcentaje / 100));
    
    // Aplicar reducción de daño si el defensor es Paladín
    if (defensor instanceof Paladin) {
        daño = defensor.recibirDaño(daño);
    }
    
    // Aplicar daño
    const vidaAnterior = defensor.vida;
    defensor.vida = Math.max(defensor.vida - daño, 0);
    
    console.log(`⚔️ ${atacante.clase} ataca a ${defensor.clase}: ${vidaAnterior} → ${defensor.vida} (-${daño}) [${dañoPorcentaje}%]`);
    
    // Habilidades especiales post-ataque
    if (atacante instanceof Brujo && daño > 0) {
        const vidaRobada = Math.floor(daño * 0.1);
        atacante.vida = Math.min(atacante.vida + vidaRobada, atacante.vidaMax);
        console.log(`🧙 Brujo roba ${vidaRobada} vida`);
    }
    
    // Devolver true si el defensor murió
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
    } else if (celda instanceof Obstaculos) {
        cellDiv.style.backgroundColor = '#0a1a4a';
        cellDiv.style.color = '#4a6c8f';
        cellDiv.textContent = '█';
        cellDiv.style.textShadow = 'none';
        cellDiv.style.borderRadius = '0';
        cellDiv.title = '🧱 Obstáculo';
    }
}

// ===== FUNCIÓN PARA CREAR EL TABLERO =====
function crearTablero() {
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;
    }
    
    gameBoard.innerHTML = '';
    
    gameBoard.style.display = 'grid';
    gameBoard.style.gap = '1px';
    gameBoard.style.backgroundColor = '#24408e';
    gameBoard.style.padding = '5px';
    gameBoard.style.borderRadius = '10px';
    gameBoard.style.margin = '0';
    gameBoard.style.width = '100%';
    gameBoard.style.height = '100%';
    
    if (alturaActual === 0 || anchuraActual === 0) {
        recalcularDimensiones();
    }
    
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
    
    setTimeout(() => redimensionarTablero(), 10);
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
    if (!arrayEntidades) return;
    const anchura = arrayEntidades[0].length;
    const index = row * anchura + col;
    const cells = gameBoard.children;
    if (index >= cells.length) return;
    aplicarColorCelda(cells[index], celda);
}

// ===== FUNCIÓN PRINCIPAL DEL JUEGO (CORREGIDA) =====
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
    
    // 2. PRIMERO MOVER TODOS
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            if (arrayEntidades[i][j] instanceof Personajes) {
                arrayEntidades[i][j].mover(anchura, altura, arrayEntidades);
            }
        }
    }
    
    // 3. LUEGO COMBATIR (después de mover)
    let huboCombate = false;
    
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            if (arrayEntidades[i][j] instanceof Personajes) {
                const entidad = arrayEntidades[i][j];
                const newX = entidad.getX();
                const newY = entidad.getY();
                
                // Si la entidad se movió a una nueva posición
                if (newX !== j || newY !== i) {
                    // Caso 1: La casilla destino está vacía
                    if (arrayEntidades[newY][newX] === null) {
                        arrayEntidades[newY][newX] = entidad;
                        arrayEntidades[i][j] = null;
                        
                        actualizarCelda(i, j, null);
                        actualizarCelda(newY, newX, entidad);
                    } 
                    // Caso 2: Hay combate (Bueno vs Malo)
                    else if (
                        (arrayEntidades[newY][newX] instanceof Malos && entidad instanceof Buenos) ||
                        (arrayEntidades[newY][newX] instanceof Buenos && entidad instanceof Malos)
                    ) {
                        huboCombate = true;
                        const defensor = arrayEntidades[newY][newX];
                        
                        console.log(`⚔️ COMBATE: ${entidad.clase} vs ${defensor.clase}`);
                        
                        // Combatir con el sistema de clases
                        if (combatirConClases(entidad, defensor)) {
                            // El defensor murió - el atacante ocupa su lugar
                            for (let k = 0; k < nPersonajes; k++) {
                                if (arrayPersonajes[k] === defensor) {
                                    arrayPersonajes[k] = null;
                                    break;
                                }
                            }
                            
                            // El atacante se mueve a la casilla del defensor
                            arrayEntidades[newY][newX] = entidad;
                            arrayEntidades[i][j] = null;
                            
                            Personajes.setnPersonajes(Personajes.getnPersonajes() - 1);
                            if (defensor instanceof Buenos) Buenos.setnBuenos(Buenos.getnBuenos() - 1);
                            else Malos.setnMalos(Malos.getnMalos() - 1);
                            
                            actualizarCelda(i, j, null);
                            actualizarCelda(newY, newX, entidad);
                            
                            console.log(`💀 Muere ${defensor.clase}`);
                        } else {
                            // Nadie murió - ambos se quedan donde están
                            console.log(`🤝 Empate - ambos sobreviven`);
                            // No hay movimiento
                        }
                        
                        actualizarContadoresVisuales();
                    }
                }
            }
        }
    }
    
    // 4. ACTUALIZAR VISUALIZACIÓN
    actualizarContadoresVisuales();
    
    // 5. VERIFICAR FIN DEL JUEGO
    if (Buenos.getnBuenos() <= 0 || Malos.getnMalos() <= 0) {
        console.log('🏁 JUEGO TERMINADO');
        detenerSimulacion();
        mostrarResultado();
    } else if (huboCombate) {
        // Si hubo combate, actualizar las celdas de los combatientes
        // (ya se actualizaron individualmente)
    }
}

// ===== FUNCIÓN DE COMBATE MEJORADA =====
function combatirConClases(atacante, defensor) {
    // Calcular daño base según clase del atacante
    let dañoPorcentaje;
    
    if (atacante instanceof Curandero) dañoPorcentaje = 5;
    else if (atacante instanceof Paladin) dañoPorcentaje = 10;
    else if (atacante instanceof Mago) dañoPorcentaje = 20;
    else if (atacante instanceof Asesino) {
        dañoPorcentaje = atacante.calcularDaño(); // 30% o 60% con crítico
    }
    else if (atacante instanceof Tanque) dañoPorcentaje = 10;
    else if (atacante instanceof Brujo) dañoPorcentaje = 25;
    else dañoPorcentaje = 15; // Soldado normal
    
    // Calcular daño como porcentaje de la vida actual del defensor
    let daño = Math.floor(defensor.vida * (dañoPorcentaje / 100));
    daño = Math.max(1, daño); // Mínimo 1 de daño
    
    // Aplicar reducción de daño si el defensor es Paladín
    if (defensor instanceof Paladin) {
        daño = defensor.recibirDaño(daño);
    }
    
    // Registrar el combate
    console.log(`   ${atacante.clase} ataca: ${daño} daño (${dañoPorcentaje}%)`);
    console.log(`   ${defensor.clase} vida: ${defensor.vida} → ${defensor.vida - daño}`);
    
    // Aplicar daño
    defensor.vida = Math.max(defensor.vida - daño, 0);
    
    // Habilidades especiales post-ataque
    if (atacante instanceof Brujo && daño > 0) {
        const vidaRobada = Math.floor(daño * 0.1);
        atacante.vida = Math.min(atacante.vida + vidaRobada, atacante.vidaMax);
        console.log(`   🧙 Brujo roba ${vidaRobada} vida`);
    }
    
    // Devolver true si el defensor murió
    return defensor.vida <= 0;
}

// ===== FUNCIÓN INICIAR SIMULACIÓN =====
function iniciarSimulacion() {
    detenerSimulacion();
    simulacionPausada = false;
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
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
    
    const numObstaculos = Math.floor(totalCeldas * 0.01);
    for (let i = 0; i < numObstaculos; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
        } while (arrayEntidades[y][x] !== null);
        arrayEntidades[y][x] = new Obstaculos(y, x);
    }
    
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
    
    crearTablero();
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

// ===== FUNCIONES DE MONEDAS =====
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