// ============================================
// SURVIVORS - VERSIÓN FINAL CORREGIDA
// ============================================

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

// ===== VARIABLES PARA ESTADÍSTICAS =====
let totalCombates = 0;
let dañoTotal = 0;
let totalMuertes = 0;
let tiempoInicio = null;
let intervaloReloj = null;

// ===== VARIABLES MODO SURVIVOR =====
let modoSurvivorActivo = false;
let rondasSuperadas = 0;
let puntosTotales = 0;
let monedasSurvivor = 125;
let malosEnRonda = 3;
let rankingJugadores = [];

// Variables para selección de casillas
let personajeSeleccionado = null;
let costoseleccionado = 0;

// Claves localStorage
const STORAGE_RANKING = 'survivor_ranking';

// ===== CONSTANTES DE VELOCIDAD =====
const VELOCIDADES = {
    LENTA: 300,
    NORMAL: 200,
    RAPIDA: 120,
    MUY_RAPIDA: 70
};

// ===== CONFIGURACIÓN DE CLASES PARA TOOLTIPS =====
const CLASES_CONFIG = {
    curandero: { nombre: 'CURANDERO', vida: 120, dano: 5, habilidad: 'Cura +10%' },
    paladin: { nombre: 'PALADÍN', vida: 150, dano: 10, habilidad: '-50% daño' },
    mago: { nombre: 'MAGO', vida: 80, dano: 20, habilidad: 'Daño mágico' },
    asesino: { nombre: 'ASESINO', vida: 70, dano: 30, habilidad: '15% crítico x2' },
    tanque: { nombre: 'TANQUE', vida: 200, dano: 10, habilidad: 'Alta resistencia' },
    brujo: { nombre: 'BRUJO', vida: 90, dano: 25, habilidad: 'Roba 10% vida' }
};

// ===== FUNCIÓN PARA GENERAR TOOLTIP =====
function generarTooltipClase(clase) {
    const c = CLASES_CONFIG[clase];
    if (!c) return '';
    return `${c.nombre}\n❤️ ${c.vida}  ⚔️ ${c.dano}%\n✨ ${c.habilidad}`;
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

// ===== FUNCIÓN PARA VALIDAR BOTÓN DE INICIO =====
function validarBotonInicio() {
    const btnStart = document.getElementById('startBtn');

    if (opcionSeleccionada === null) {
        btnStart.disabled = true;
        añadirLog('❌ Selecciona un modo de juego', 'info');
        return;
    }

    if (opcionSeleccionada === 'survivor') {
        btnStart.disabled = false;
        añadirLog(`✅ Modo SURVIVOR listo para jugar`, 'system');
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
        añadirLog(`✅ Modo ${opcionSeleccionada} listo para jugar`, 'system');
    }
}

// ===== FUNCIÓN PARA CALCULAR DIMENSIONES - CORREGIDA (PRIORIZA ANCHO) =====
function recalcularDimensiones() {
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;
    }

    const container = document.querySelector('.game-board-container');
    if (!container) return;

    // Obtener dimensiones del contenedor restando paddings
    const style = getComputedStyle(container);
    const padX = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
    const padY = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
    
    const containerWidth = container.clientWidth - padX;
    const containerHeight = container.clientHeight - padY;

    console.log(`📏 Contenedor útil: ${containerWidth}x${containerHeight}`);

    if (containerWidth === 0 || containerHeight === 0) {
        console.warn('⚠️ Contenedor sin dimensiones');
        alturaActual = 15;
        anchuraActual = 20;
        return;
    }

    // ===== PRIORIZAR ANCHO =====
    // Queremos que el tablero ocupe TODO el ancho disponible
    // Calculamos el tamaño de celda basado en el ancho deseado
    let tamanoObjetivo;
    if (window.innerWidth <= 480) {
        tamanoObjetivo = 28;   // móvil: celdas de 28px
    } else if (window.innerWidth <= 768) {
        tamanoObjetivo = 32;   // tablet: celdas de 32px
    } else {
        tamanoObjetivo = 36;   // desktop: celdas de 36px
    }

    // Calcular cuántas celdas caben en el ancho (para OCUPAR TODO EL ANCHO)
    let celdasPorAncho = Math.floor(containerWidth / tamanoObjetivo);
    
    // Ahora calculamos el tamaño REAL de celda para que ocupe exactamente el ancho
    let tamañoRealCelda = containerWidth / celdasPorAncho;
    
    // Con ese tamaño, calculamos cuántas celdas caben en el alto
    let celdasPorAlto = Math.floor(containerHeight / tamañoRealCelda);

    // Ajustar si el alto se desborda
    if (celdasPorAlto * tamañoRealCelda > containerHeight) {
        // Si no cabe, reducimos una fila
        celdasPorAlto--;
    }

    // Establecer mínimos y máximos razonables
    celdasPorAncho = Math.min(45, Math.max(12, celdasPorAncho));
    celdasPorAlto = Math.min(30, Math.max(6, celdasPorAlto));

    // Verificar que el alto no se desborde con los nuevos valores
    let altoTotal = celdasPorAlto * tamañoRealCelda;
    if (altoTotal > containerHeight) {
        // Si aún se desborda, reducir hasta que quepa
        while (altoTotal > containerHeight && celdasPorAlto > 6) {
            celdasPorAlto--;
            altoTotal = celdasPorAlto * tamañoRealCelda;
        }
    }

    alturaActual = celdasPorAlto;
    anchuraActual = celdasPorAncho;

    // Asegurar que sean números pares para el modo normal
    if (opcionSeleccionada !== 'survivor') {
        if (alturaActual % 2 !== 0) alturaActual--;
        if (anchuraActual % 2 !== 0) anchuraActual--;
    }

    console.log(`📏 Dimensiones finales: ${anchuraActual}x${alturaActual} (${anchuraActual * alturaActual} celdas)`);
    console.log(`📐 Tamaño celda: ${tamañoRealCelda.toFixed(1)}px`);
    console.log(`📊 Total ocupado: ${anchuraActual * tamañoRealCelda}x${alturaActual * tamañoRealCelda}`);
}

// ===== FUNCIÓN PARA REDIMENSIONAR EL TABLERO - CORREGIDA =====
function redimensionarTablero() {
    if (!gameBoard) return;

    const container = gameBoard.parentElement;
    if (!container) return;

    const style = getComputedStyle(container);
    const padX = parseInt(style.paddingLeft) + parseInt(style.paddingRight);
    const padY = parseInt(style.paddingTop) + parseInt(style.paddingBottom);
    
    const containerWidth = container.clientWidth - padX;
    const containerHeight = container.clientHeight - padY;
    
    if (containerWidth === 0 || containerHeight === 0) return;

    // modo normal
    if (!arrayEntidades) return;
    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;

    // Calcular tamaño de celda para ocupar TODO el ancho
    let cellSize = containerWidth / anchura;
    
    // Verificar si cabe en el alto
    let altoTotal = cellSize * altura;
    
    if (altoTotal > containerHeight) {
        // Si no cabe, reducir tamaño
        cellSize = containerHeight / altura;
    }

    // Tamaños mínimos para legibilidad
    cellSize = Math.max(16, cellSize);
    
    const fontSize = Math.floor(cellSize * 0.6);

    // Aplicar tamaño
    gameBoard.style.gridTemplateColumns = `repeat(${anchura}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${altura}, ${cellSize}px)`;
    
    gameBoard.style.width = '100%';
    gameBoard.style.height = '100%';

    const cells = gameBoard.children;
    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.fontSize = `${fontSize}px`;
        cell.style.lineHeight = `${cellSize}px`;
    }
    
    console.log(`📏 Celda redimensionada: ${cellSize.toFixed(1)}px`);
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

// ===== FUNCIÓN PARA CREAR TABLERO CON DIMENSIONES =====
function crearTableroConDimensiones(altura, anchura) {
    if (!gameBoard) {
        gameBoard = document.getElementById('gameBoard');
        if (!gameBoard) return;
    }

    console.log(`📋 Creando tablero con dimensiones: ${anchura}x${altura}`);

    gameBoard.innerHTML = '';
    gameBoard.style = '';

    gameBoard.style.display = 'grid';
    gameBoard.style.backgroundColor = '#24408e';
    gameBoard.style.width = '100%';
    gameBoard.style.height = '100%';
    gameBoard.style.boxSizing = 'border-box';
    gameBoard.style.gap = '0px';
    gameBoard.style.padding = '0px';
    gameBoard.style.borderRadius = '0px';

    gameBoard.style.gridTemplateColumns = `repeat(${anchura}, 1fr)`;
    gameBoard.style.gridTemplateRows = `repeat(${altura}, 1fr)`;

    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            const cellDiv = document.createElement('div');
            cellDiv.style.display = 'flex';
            cellDiv.style.alignItems = 'center';
            cellDiv.style.justifyContent = 'center';
            cellDiv.style.fontWeight = 'bold';
            cellDiv.style.width = '100%';
            cellDiv.style.height = '100%';
            cellDiv.style.boxSizing = 'border-box';
            cellDiv.textContent = '·';
            cellDiv.style.color = '#ffff00';
            cellDiv.style.backgroundColor = '#24408e';

            gameBoard.appendChild(cellDiv);
        }
    }

    console.log(`✅ Tablero creado con ${altura * anchura} celdas`);

    setTimeout(() => redimensionarTablero(), 10);
    setTimeout(() => redimensionarTablero(), 50);
    setTimeout(() => redimensionarTablero(), 150);

    if (modoSurvivorActivo) {
        setTimeout(() => hacerCeldaClickeable(), 200);
    }
}

// ===== FUNCIÓN PARA HACER CELDAS CLICKEABLES - CORREGIDA =====
function hacerCeldaClickeable() {
    if (!gameBoard || !arrayEntidades) return;

    const cells = gameBoard.children;

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const fila = Math.floor(i / anchuraActual);
        const columna = i % anchuraActual;

        // Eliminar onclick anterior para evitar duplicados
        cell.onclick = null;
        
        // Añadir nuevo onclick con validación
        cell.onclick = (e) => {
            e.stopPropagation();
            
            // Solo procesar si:
            // 1. Está en modo survivor
            // 2. El juego está pausado
            // 3. Hay un personaje seleccionado en la tienda
            // 4. La celda está vacía (esta validación ya está en comprarPersonaje)
            if (modoSurvivorActivo && simulacionPausada && personajeSeleccionado) {
                console.log(`👆 Clic en celda [${fila},${columna}] con personaje: ${personajeSeleccionado}`);
                comprarPersonaje(personajeSeleccionado, fila, columna);
            } else if (!personajeSeleccionado) {
                // Si no hay personaje seleccionado, mostrar mensaje informativo
                añadirLog('⚠️ Primero selecciona un personaje en la tienda', 'info');
            }
        };
        cell.style.cursor = 'pointer';
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

// ===== FUNCIÓN DE COMBATE - CORREGIDA CON PALADINES =====
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

    // Si el defensor es un Paladín, aplica su reducción de daño
    if (defensor instanceof Paladin) {
        const dañoOriginal = daño;
        daño = defensor.recibirDaño(daño);
        console.log(`🛡️ Paladín reduce daño de ${dañoOriginal} a ${daño}`);
    }

    totalCombates++;
    dañoTotal += daño;

    const vidaAntes = defensor.vida;
    defensor.vida = Math.max(defensor.vida - daño, 0);

    console.log(`💔 ${defensor.clase}: ${vidaAntes} → ${defensor.vida} (daño: ${daño})`);

    if (defensor.vida <= 0) {
        totalMuertes++;

        if (modoSurvivorActivo && defensor instanceof Malos) {
            let recompensa = 10;
            if (defensor instanceof Asesino) recompensa = 15;
            else if (defensor instanceof Tanque) recompensa = 20;
            else if (defensor instanceof Brujo) recompensa = 25;

            monedasSurvivor += recompensa;
            puntosTotales += recompensa * 2;
            añadirLog(`💰 +${recompensa} monedas por eliminar ${defensor.clase}`, 'system');
            actualizarPanelSurvivor();
        }
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
    if (!arrayEntidades || !gameBoard) return;

    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;
    const cells = gameBoard.children;

    if (cells.length === 0) return;

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

                        console.log(`⚔️ COMBATE: ${entidad.clase} vs ${defensor.clase}`);
                        console.log(`   Defensor vida antes: ${defensor.vida}/${defensor.vidaMax}`);

                        marcarDaño(i, j);
                        marcarDaño(newY, newX);

                        if (combatirConClases(entidad, defensor)) {
                            console.log(`💀 ${defensor.clase} ha muerto`);

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
                            console.log(`❤️ ${defensor.clase} sobrevive con ${defensor.vida} vida`);
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

    // ===== LÓGICA DE GAME OVER CORREGIDA =====
    if (modoSurvivorActivo) {
        // En survivor, game over cuando NO hay buenos
        if (Buenos.getnBuenos() <= 0) {
            // Si es la primera ronda y aún no ha comprado personajes, NO es game over
            if (rondasSuperadas === 0 && arrayPersonajes.length === malosEnRonda) {
                // Es normal, el jugador aún no ha comprado personajes
                console.log('⏳ Esperando que el jugador compre personajes...');
            } else {
                // Ya sea porque:
                // - Los buenos murieron en combate
                // - El jugador nunca compró personajes después de la ronda 1
                console.log('💀 GAME OVER - No quedan buenos');
                detenerSimulacion();
                mostrarResultadoSurvivor();
            }
        }
        // Verificar fin de ronda (no quedan malos)
        else if (Malos.getnMalos() <= 0 && Buenos.getnBuenos() > 0) {
            verificarRondaCompletada();
        }
    } else {
        // Modo normal: game over cuando un bando se queda sin personajes
        if (Buenos.getnBuenos() <= 0) {
            victoriasMalos++;
            detenerSimulacion();
            mostrarResultado();
        } else if (Malos.getnMalos() <= 0) {
            victoriasBuenos++;
            detenerSimulacion();
            mostrarResultado();
        }
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

    if (opcionSeleccionada === 'survivor') {
        modoSurvivorActivo = true;
        rondasSuperadas = 0;
        puntosTotales = 0;
        monedasSurvivor = 125;
        malosEnRonda = 3;
        personajeSeleccionado = null;

        document.getElementById('survivorPanel')?.classList.remove('hidden');
        actualizarPanelSurvivor();
    }

    esperarDimensionesYIniciar();
}

// ===== FUNCIÓN PARA ESPERAR DIMENSIONES =====
function esperarDimensionesYIniciar(intentos = 0) {
    const container = document.querySelector('.game-board-container');
    if (!container) {
        if (intentos < 20) {
            setTimeout(() => esperarDimensionesYIniciar(intentos + 1), 100);
        }
        return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    if (containerWidth > 50 && containerHeight > 50) {
        console.log(`✅ Contenedor listo: ${containerWidth}x${containerHeight}`);
        recalcularDimensiones();

        if (opcionSeleccionada === 'survivor') {
            crearTableroSurvivor();
        } else {
            crearTableroNormal();
        }
        return;
    }

    if (intentos < 20) {
        setTimeout(() => esperarDimensionesYIniciar(intentos + 1), 100);
    } else {
        console.warn('⚠️ Usando dimensiones por defecto');
        alturaActual = 12;
        anchuraActual = 16;

        if (opcionSeleccionada === 'survivor') {
            crearTableroSurvivor();
        } else {
            crearTableroNormal();
        }
    }
}

// ===== FUNCIÓN PARA CREAR TABLERO NORMAL =====
function crearTableroNormal() {
    // recalcular dimensiones cada vez
    recalcularDimensiones();
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

    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);

    const numObstaculos = Math.floor(totalCeldas * 0.01);

    for (let i = 0; i < numObstaculos; i++) {
        let x, y;
        let intentos = 0;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
            intentos++;
        } while (arrayEntidades[y] && arrayEntidades[y][x] !== null && intentos < 1000);

        if (intentos < 1000 && arrayEntidades[y]) {
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
        } while (arrayEntidades[y] && arrayEntidades[y][x] !== null && intentos < 1000);

        if (intentos < 1000 && arrayEntidades[y]) {
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

    crearTableroConDimensiones(altura, anchura);
    actualizarTodoElTablero();

    intervaloSimulacion = setInterval(() => {
        actualizarJuego(altura, anchura, nPersonajesActual);
    }, velocidadActual);
}

// ===== FUNCIÓN PARA CREAR TABLERO SURVIVOR =====
function crearTableroSurvivor() {
    console.log('🎮 Creando tablero survivor...');

    const altura = alturaActual;
    const anchura = anchuraActual;

    if (altura === 0 || anchura === 0) {
        alturaActual = 12;
        anchuraActual = 16;
        altura = 12;
        anchura = 16;
    }

    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    arrayPersonajes = [];

    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);

    const totalCeldas = altura * anchura;
    const numObstaculos = Math.floor(totalCeldas * 0.1);

    for (let i = 0; i < numObstaculos; i++) {
        let x, y;
        let intentos = 0;
        do {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);
            intentos++;
        } while (arrayEntidades[y][x] !== null && intentos < 1000);

        if (intentos < 1000) {
            arrayEntidades[y][x] = new Obstaculos(y, x);
        }
    }

    crearTableroConDimensiones(altura, anchura);

    generarOleadaMalos();

    actualizarTodoElTablero();
    iniciarReloj();
    actualizarContadoresVisuales();
    actualizarEstadisticasClases();
    actualizarPanelSurvivor();

    setTimeout(() => {
        detenerSimulacion();
        añadirLog('⏸️ TIEMPO DE PREPARACIÓN - Compra y coloca tus personajes', 'system');
        añadirLog(`💰 Monedas iniciales: ${monedasSurvivor}`, 'system');
        
        // ACTUALIZAR VISIBILIDAD DE CONTROLES
        actualizarVisibilidadControles();

        setTimeout(() => {
            hacerCeldaClickeable();
        }, 200);
    }, 500);

    intervaloSimulacion = setInterval(() => {
        actualizarJuego(altura, anchura, arrayPersonajes.length);
    }, velocidadActual);
}

// ===== FUNCIONES SURVIVOR =====

function seleccionarModoSurvivor() {
    opcionSeleccionada = 'survivor';
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    document.getElementById('nPersonajesRow').classList.add('hidden');
    document.getElementById('startBtn').disabled = false;
    añadirLog('⚔️ MODO SURVIVOR seleccionado', 'system');
}

function iniciarSurvivor() {
    if (coins <= 0) {
        alert('¡NECESITAS UNA MONEDA! 🪙');
        return;
    }

    coins--;
    actualizarCoinDisplay();

    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('arcadeMachine').classList.remove('hidden');

    iniciarSimulacion();
}

// ===== SELECCIONAR PERSONAJE EN TIENDA =====
function seleccionarPersonajeTienda(tipo, costo) {
    // Validar modo survivor
    if (!modoSurvivorActivo) {
        añadirLog('❌ Modo survivor no activo', 'info');
        return;
    }
    
    // Validar que el juego esté pausado
    if (!simulacionPausada) {
        añadirLog('❌ Debes estar en pausa para comprar', 'info');
        return;
    }

    // Mostrar mensaje con el costo actual
    añadirLog(`💰 Monedas disponibles: ${monedasSurvivor} - Costo: ${costo}`, 'info');

    // Establecer personaje seleccionado
    personajeSeleccionado = tipo;
    costoseleccionado = costo;
    
    // Actualizar interfaz
    document.getElementById('shopStatus').innerHTML = `✅ ${tipo.toUpperCase()} seleccionado - Haz clic en una casilla vacía (${costo}💰)`;
    añadirLog(`🛒 Selecciona una casilla para colocar ${tipo} (${costo}💰)`, 'system');
}

// ===== COMPRAR PERSONAJE - CORREGIDO (CREACIÓN DESPUÉS DE VERIFICAR) =====
function comprarPersonaje(tipo, fila, columna) {
    // Validar modo survivor
    if (!modoSurvivorActivo) {
        console.log('❌ No se puede comprar: modo survivor inactivo');
        return false;
    }
    
    // Validar que el juego esté pausado
    if (!simulacionPausada) {
        añadirLog('❌ Debes estar en pausa para comprar', 'info');
        return false;
    }
    
    // Validar que haya un personaje seleccionado
    if (!personajeSeleccionado) {
        añadirLog('❌ No hay personaje seleccionado', 'info');
        return false;
    }
    
    // Validar que el tipo coincida con el seleccionado
    if (tipo !== personajeSeleccionado) {
        console.log('⚠️ Tipo de personaje no coincide con el seleccionado');
        return false;
    }
    
    // Validar coordenadas
    if (fila === undefined || columna === undefined) {
        añadirLog('❌ Debes seleccionar una casilla', 'info');
        return false;
    }

    // Validar que arrayEntidades existe
    if (!arrayEntidades) {
        añadirLog('❌ No hay tablero activo', 'info');
        return false;
    }

    const altura = arrayEntidades.length;
    const anchura = arrayEntidades[0].length;

    // Validar límites del tablero
    if (fila < 0 || fila >= altura || columna < 0 || columna >= anchura) {
        añadirLog('❌ Casilla fuera del tablero', 'info');
        return false;
    }

    // Validar que la casilla esté vacía
    if (arrayEntidades[fila][columna] !== null) {
        añadirLog('❌ Casilla ocupada', 'info');
        return false;
    }

    // Determinar costo
    let costo = 20;
    switch (tipo) {
        case 'curandero': costo = 25; break;
        case 'paladin': costo = 30; break;
        case 'mago': costo = 35; break;
        case 'soldado': costo = 20; break;
        default: 
            añadirLog('❌ Tipo de personaje no válido', 'info');
            return false;
    }

    // ===== IMPORTANTE: Verificar monedas ANTES de crear el personaje =====
    if (monedasSurvivor < costo) {
        añadirLog(`❌ Monedas insuficientes (tienes ${monedasSurvivor}💰, necesitas ${costo}💰)`, 'info');
        return false;
    }

    // ===== AHORA SÍ, crear el personaje (después de verificar monedas) =====
    let nuevoPersonaje = null;
    switch (tipo) {
        case 'curandero': 
            nuevoPersonaje = new Curandero(fila, columna); 
            break;
        case 'paladin': 
            nuevoPersonaje = new Paladin(fila, columna); 
            break;
        case 'mago': 
            nuevoPersonaje = new Mago(fila, columna); 
            break;
        case 'soldado': 
            nuevoPersonaje = new Buenos(fila, columna); 
            break;
    }

    // Realizar la compra (restar monedas)
    monedasSurvivor -= costo;
    
    // Colocar el personaje en el tablero
    arrayEntidades[fila][columna] = nuevoPersonaje;
    arrayPersonajes.push(nuevoPersonaje);

    // Actualizar celda visualmente
    actualizarCelda(fila, columna, nuevoPersonaje);
    
    // Logs y actualizaciones
    añadirLog(`✅ Colocado: ${nuevoPersonaje.clase} en [${fila},${columna}] (${costo}💰)`, 'system');
    añadirLog(`💰 Monedas restantes: ${monedasSurvivor}`, 'system');
    
    actualizarPanelSurvivor();
    actualizarContadoresVisuales();

    // Limpiar selección
    personajeSeleccionado = null;
    document.getElementById('shopStatus').innerHTML = '⬆️ Selecciona un personaje y haz clic en una casilla';

    return true;
}

function iniciarRonda() {
    if (!modoSurvivorActivo) return;

    if (simulacionPausada) {
        if (Buenos.getnBuenos() === 0) {
            añadirLog('❌ Necesitas al menos un personaje para comenzar', 'info');
            return;
        }

        if (gameBoard) {
            const cells = gameBoard.children;
            for (let i = 0; i < cells.length; i++) {
                cells[i].onclick = null;
                cells[i].style.cursor = 'default';
            }
        }

        continuarSimulacion();
        añadirLog(`⚔️ ¡RONDA ${rondasSuperadas + 1} COMENZADA!`, 'system');
        document.getElementById('shopStatus').innerHTML = '⚔️ Batalla en curso...';
        
        // ACTUALIZAR VISIBILIDAD DE CONTROLES (vuelve al modo normal)
        actualizarVisibilidadControles();
    }
}

function generarOleadaMalos() {
    const altura = alturaActual;
    const anchura = anchuraActual;
    let malosColocados = 0;

    let espaciosVacios = 0;
    for (let i = 0; i < altura; i++) {
        for (let j = 0; j < anchura; j++) {
            if (arrayEntidades[i][j] === null) espaciosVacios++;
        }
    }

    let malosAGenerar = Math.min(malosEnRonda, espaciosVacios);

    añadirLog(`👹 Generando ${malosAGenerar} malos (${espaciosVacios} espacios disponibles)`, 'combat');

    for (let i = 0; i < malosAGenerar; i++) {
        let x, y;
        let encontrado = false;

        for (let intento = 0; intento < 2000; intento++) {
            x = Math.floor(Math.random() * anchura);
            y = Math.floor(Math.random() * altura);

            if (arrayEntidades[y][x] === null) {
                encontrado = true;
                break;
            }
        }

        if (encontrado) {
            const rand = Math.random();
            let malo;

            if (rondasSuperadas < 3) {
                if (rand < 0.2) malo = new Asesino(y, x);
                else if (rand < 0.4) malo = new Tanque(y, x);
                else malo = new Malos(y, x);
            } else if (rondasSuperadas < 6) {
                if (rand < 0.25) malo = new Asesino(y, x);
                else if (rand < 0.5) malo = new Tanque(y, x);
                else if (rand < 0.75) malo = new Brujo(y, x);
                else malo = new Malos(y, x);
            } else {
                if (rand < 0.3) malo = new Asesino(y, x);
                else if (rand < 0.6) malo = new Tanque(y, x);
                else if (rand < 0.9) malo = new Brujo(y, x);
                else malo = new Malos(y, x);
            }

            arrayEntidades[y][x] = malo;
            arrayPersonajes.push(malo);
            malosColocados++;
        }
    }

    añadirLog(`👹 Generados ${malosColocados} malos`, 'combat');
    return malosColocados;
}

// ===== VERIFICAR RONDA COMPLETADA - CORREGIDO =====
function verificarRondaCompletada() {
    if (!modoSurvivorActivo) return;

    // Solo verificar si hay buenos vivos
    if (Buenos.getnBuenos() === 0) {
        console.log('⚠️ No se puede completar ronda: no hay buenos');
        return;
    }

    if (Malos.getnMalos() === 0) {
        rondasSuperadas++;
        puntosTotales += 100 * rondasSuperadas;
        monedasSurvivor += 50 * rondasSuperadas;

        malosEnRonda = Math.floor(3 + rondasSuperadas * 1.5);

        añadirLog(`🎉 ¡RONDA ${rondasSuperadas} COMPLETADA! +${50 * rondasSuperadas}💰`, 'victory');
        añadirLog(`⏸️ PAUSA - Coloca tus nuevos personajes`, 'system');
        añadirLog(`👹 Próxima ronda: ${malosEnRonda} malos`, 'system');

        detenerSimulacion();
        document.getElementById('shopStatus').innerHTML = '⬆️ Selecciona un personaje y haz clic en una casilla';
        
        // ACTUALIZAR VISIBILIDAD DE CONTROLES (vuelve a modo survivor)
        actualizarVisibilidadControles();

        setTimeout(() => {
            hacerCeldaClickeable();
        }, 200);

        setTimeout(() => {
            if (modoSurvivorActivo && Buenos.getnBuenos() > 0) {
                generarOleadaMalos();
                actualizarTodoElTablero();
            }
        }, 500);

        actualizarPanelSurvivor();
    }
}

function actualizarPanelSurvivor() {
    const monedasEl = document.getElementById('survivorMonedas');
    const puntosEl = document.getElementById('survivorPuntos');
    const rondaEl = document.getElementById('survivorRonda');
    const malosEl = document.getElementById('survivorMalosRestantes');

    if (monedasEl) monedasEl.textContent = monedasSurvivor;
    if (puntosEl) puntosEl.textContent = puntosTotales;
    if (rondaEl) rondaEl.textContent = rondasSuperadas + 1;
    if (malosEl) malosEl.textContent = Malos.getnMalos();
}

// ===== FUNCIONES DE CONTROL =====
function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
        simulacionPausada = true;
        añadirLog('⏸️ Juego pausado', 'system');
        
        // ACTUALIZAR VISIBILIDAD DE CONTROLES (modo survivor si aplica)
        actualizarVisibilidadControles();
    }
}

function continuarSimulacion() {
    if (simulacionPausada && arrayEntidades) {
        intervaloSimulacion = setInterval(
            () => actualizarJuego(alturaActual, anchuraActual, arrayPersonajes.length),
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

    if (intervaloSimulacion) {
        detenerSimulacion();
        continuarSimulacion();
    }
}

function actualizarIndicadorVelocidad() {
    const display = document.getElementById('velocidadDisplay');
    if (!display) return;

    if (velocidadActual >= 250) display.setAttribute('data-speed', 'lenta');
    else if (velocidadActual >= 150) display.setAttribute('data-speed', 'normal');
    else display.setAttribute('data-speed', 'rapida');
}

// ===== FUNCIÓN DE RELOJ - CORREGIDA =====
function iniciarReloj() {
    // Detener cualquier reloj anterior
    if (intervaloReloj) {
        clearInterval(intervaloReloj);
        intervaloReloj = null;
    }
    
    // Establecer tiempo de inicio AHORA MISMO
    tiempoInicio = Date.now();
    
    // Mostrar 00:00 inmediatamente
    const relojDisplay = document.getElementById('tiempoPartida');
    if (relojDisplay) {
        relojDisplay.textContent = '00:00';
    }
    
    // Crear nuevo intervalo
    intervaloReloj = setInterval(() => {
        // No actualizar si el juego está pausado o no hay entidades
        if (!arrayEntidades || simulacionPausada) return;
        
        // Calcular tiempo transcurrido desde tiempoInicio
        const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        const minutos = Math.floor(tiempoTranscurrido / 60).toString().padStart(2, '0');
        const segundos = (tiempoTranscurrido % 60).toString().padStart(2, '0');
        
        const relojDisplay = document.getElementById('tiempoPartida');
        if (relojDisplay) {
            relojDisplay.textContent = `${minutos}:${segundos}`;
        }
    }, 1000);
    
    console.log('⏱️ Reloj iniciado desde 00:00');
}

// ===== DETENER RELOJ =====
function detenerReloj() {
    if (intervaloReloj) {
        clearInterval(intervaloReloj);
        intervaloReloj = null;
    }
    console.log('⏱️ Reloj detenido');
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

        document.querySelectorAll('#menuCard .mode-btn').forEach(btn => {
            btn.disabled = false;
        });

        document.querySelectorAll('#menuCard input').forEach(el => {
            el.disabled = false;
        });

        añadirLog('🔓 Menú desbloqueado - Todos los modos disponibles', 'system');
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
    const panelCoinEl = document.getElementById('panelCoinCount');
    const menuCoinEl = document.getElementById('coinCount');

    if (gameCoinEl) gameCoinEl.textContent = coins;
    if (panelCoinEl) panelCoinEl.textContent = coins;
    if (menuCoinEl) menuCoinEl.textContent = coins;

    actualizarGameOverCoins();
    actualizarBotonReintentar();
}

function actualizarGameOverCoins() {
    const gameOverCoinSpan = document.getElementById('gameOverCoinCount');
    if (gameOverCoinSpan) gameOverCoinSpan.textContent = coins;
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

    console.log(`🎮 Iniciando juego en modo: ${opcionSeleccionada}`);

    if (opcionSeleccionada === 'survivor') {
        iniciarSurvivor();
        return;
    }

    if (opcionSeleccionada === 1) {
        nPersonajesConfig = parseInt(document.getElementById('numPersonajes').value);
        if (nPersonajesConfig < 2 || nPersonajesConfig % 2 !== 0) {
            alert('Número de personajes inválido (debe ser par y ≥2)');
            return;
        }
    }

    coins--;
    actualizarCoinDisplay();
    añadirLog(`🎮 Partida iniciada (monedas restantes: ${coins})`, 'system');

    document.getElementById('menuScreen').classList.add('hidden');
    document.getElementById('arcadeMachine').classList.remove('hidden');

    setTimeout(() => iniciarSimulacion(), 50);
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

    if (opcionSeleccionada === 'survivor') {
        iniciarSurvivor();
    } else {
        iniciarSimulacion();
    }
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

    document.getElementById('resultadoTitulo').textContent = buenos <= 0 ? '💀 MALOS GANAN 💀' : '✨ BUENOS GANAN ✨';
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

// ===== MOSTRAR RESULTADO SURVIVOR - CORREGIDO =====
function mostrarResultadoSurvivor() {
    if (modoSurvivorActivo) {
        detenerSimulacion();
        detenerReloj();

        // Determinar quién ganó
        if (Buenos.getnBuenos() <= 0) {
            añadirLog(`💀 MALOS GANAN - Rondas: ${rondasSuperadas} | Puntuación: ${puntosTotales}`, 'victory');
        } else {
            añadirLog(`✨ BUENOS GANAN - Rondas: ${rondasSuperadas} | Puntuación: ${puntosTotales}`, 'victory');
        }

        // SIEMPRE mostrar ranking si ha superado al menos 1 ronda
        if (rondasSuperadas > 0) {
            console.log('🏆 Mostrando ranking por haber superado', rondasSuperadas, 'rondas');
            mostrarRanking();
        } else {
            console.log('🔄 No se superaron rondas, volviendo al menú');
            volverAlMenu();
        }

        modoSurvivorActivo = false;
        document.getElementById('survivorPanel')?.classList.add('hidden');
        document.getElementById('simulationControls').classList.add('hidden');
        
        // ACTUALIZAR VISIBILIDAD DE CONTROLES (modo normal)
        actualizarVisibilidadControles();
    }
}

function volverAlMenu() {
    detenerSimulacion();
    detenerReloj();

    opcionSeleccionada = null;
    nPersonajesConfig = null;
    arrayEntidades = null;
    arrayPersonajes = null;
    modoSurvivorActivo = false;
    personajeSeleccionado = null;

    document.getElementById('arcadeMachine').classList.add('hidden');
    document.getElementById('menuScreen').classList.remove('hidden');
    document.getElementById('survivorPanel')?.classList.add('hidden');

    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('nPersonajesRow').classList.add('hidden');
    document.getElementById('startBtn').disabled = true;

    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);

    actualizarContadoresVisuales();
    actualizarCoinDisplay();

    if (gameBoard) gameBoard.innerHTML = '';

    // ACTUALIZAR VISIBILIDAD DE CONTROLES (modo normal)
    actualizarVisibilidadControles();

    añadirLog('🏠 Volviendo al menú principal', 'system');
}

// ===== SISTEMA DE LOGS =====
function añadirLog(mensaje, tipo = 'info') {
    const logContainer = document.getElementById('logContainer');
    if (!logContainer) return;

    const ahora = new Date();
    const timestamp = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:${ahora.getSeconds().toString().padStart(2, '0')}`;

    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${tipo}`;
    logEntry.innerHTML = `<span style="color: #888; margin-right: 5px;">[${timestamp}]</span> ${mensaje}`;

    logContainer.appendChild(logEntry);

    logs.push({ mensaje, tipo, timestamp });
    if (logs.length > 50) {
        logs.shift();
        if (logContainer.children.length > 50) logContainer.removeChild(logContainer.firstChild);
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

    document.querySelectorAll('.filter-dot').forEach(dot => dot.classList.remove('active'));
    if (event?.target) event.target.classList.add('active');

    filtroActivo = tipo;
    const logs = logContainer.children;
    for (let i = 0; i < logs.length; i++) {
        logs[i].style.display = (tipo === 'todos' || logs[i].classList.contains(tipo)) ? 'block' : 'none';
    }
}

// ===== CONTROLES DE TECLADO =====
function iniciarControlesTeclado() {
    document.addEventListener('keydown', (e) => {
        // IMPORTANTE: Verificar si hay un input enfocado (como el del ranking)
        const inputActivo = document.activeElement && 
                           (document.activeElement.tagName === 'INPUT' || 
                            document.activeElement.tagName === 'TEXTAREA');
        
        // Si hay un input activo, permitir escribir sin interferencias
        if (inputActivo) {
            // Solo prevenir teclas específicas que podrían cerrar el modal
            if (e.key === 'Escape') {
                // Cerrar ranking si está abierto
                cerrarRanking();
                cerrarControlesEmergente();
                e.preventDefault();
            }
            return; // No procesar más atajos de teclado
        }
        
        // Resto del código solo se ejecuta si NO hay input activo
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        const tecla = e.key.toLowerCase();
        const juegoActivo = !document.getElementById('menuScreen').classList.contains('hidden');
        const gameOverVisible = !document.getElementById('gameOverPanel').classList.contains('hidden');

        if (tecla === 'f1' || tecla === '?') {
            e.preventDefault();
            mostrarAyudaTeclado();
            return;
        }

        // Atajos globales (funcionan siempre que no haya input)
        switch (tecla) {
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

        // Atajos solo cuando el juego está activo
        if (juegoActivo) {
            switch (tecla) {
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

        // Atajo para game over
        if (gameOverVisible && tecla === 'enter') {
            e.preventDefault();
            reintentarPartida();
        }
    });
}

// ===== CERRAR CONTROLES EMERGENTE =====
function cerrarControlesEmergente() {
    console.log('🔚 Cerrando controles emergentes');
    const modal = document.querySelector('.controls-modal');
    if (modal) {
        modal.remove();
        añadirLog('📋 Controles cerrados', 'system');
    }
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

// ===== CARGAR RANKING =====
function cargarRanking() {
    const guardado = localStorage.getItem(STORAGE_RANKING);
    if (guardado) {
        try {
            rankingJugadores = JSON.parse(guardado);
        } catch (e) {
            console.error('Error al cargar ranking:', e);
            rankingJugadores = [];
        }
    } else {
        rankingJugadores = [];
    }
}

// ===== GUARDAR RANKING =====
function guardarRanking() {
    // Ordenar por puntos (mayor a menor)
    rankingJugadores.sort((a, b) => b.puntos - a.puntos);
    // Mantener solo top 10
    rankingJugadores = rankingJugadores.slice(0, 10);
    localStorage.setItem(STORAGE_RANKING, JSON.stringify(rankingJugadores));
}

// ===== AÑADIR PUNTUACIÓN =====
function añadirPuntuacion(nombre, puntos) {
    rankingJugadores.push({
        nombre: nombre,
        puntos: puntos,
        fecha: new Date().toLocaleDateString()
    });
    guardarRanking();
}

// ===== MOSTRAR RANKING =====
function mostrarRanking() {
    cargarRanking();

    const rankingHTML = rankingJugadores.map((entry, index) => {
        let clase = '';
        if (index === 0) clase = 'top1';
        else if (index === 1) clase = 'top2';
        else if (index === 2) clase = 'top3';

        return `<div class="ranking-item ${clase}">
            <span class="ranking-position">#${index + 1}</span>
            <span class="ranking-name">${entry.nombre}</span>
            <span class="ranking-score">${entry.puntos}</span>
        </div>`;
    }).join('');

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'ranking-modal';
    modal.innerHTML = `
        <div class="ranking-container">
            <div class="ranking-title">🏆 RANKING</div>
            <div class="ranking-list">
                ${rankingHTML || '<div style="color: #888; text-align: center; padding: 20px;">No hay puntuaciones</div>'}
            </div>
            <div class="ranking-input">
                <input type="text" id="rankingName" placeholder="TU NOMBRE" maxlength="8" autocomplete="off">
                <button onclick="guardarPuntuacion()">GUARDAR</button>
            </div>
            <button onclick="cerrarRanking()" style="width:100%; margin-top:10px; padding:8px; background:var(--red); border:none; border-radius:8px; color:white; cursor:pointer;">CERRAR</button>
        </div>
    `;

    // Asegurar que no haya otros modales
    const modalExistente = document.querySelector('.ranking-modal');
    if (modalExistente) {
        modalExistente.remove();
    }

    document.body.appendChild(modal);

    // Enfocar el input automáticamente
    setTimeout(() => {
        const input = document.getElementById('rankingName');
        if (input) {
            input.focus();
            
            // IMPORTANTE: Prevenir que el modal se cierre al escribir
            input.addEventListener('keydown', (e) => {
                e.stopPropagation(); // Evita que el evento llegue a los controles globales
            });
        }
    }, 100);
}

// ===== GUARDAR PUNTUACIÓN - CORREGIDO =====
function guardarPuntuacion() {
    const input = document.getElementById('rankingName');
    if (!input) {
        console.error('❌ No se encuentra el input de nombre');
        return;
    }

    const nombre = input.value.trim().toUpperCase();

    if (nombre) {
        // Limitar a 8 caracteres
        const nombreCorto = nombre.substring(0, 8);

        añadirPuntuacion(nombreCorto, puntosTotales);
        añadirLog(`🏆 Puntuación guardada: ${nombreCorto} - ${puntosTotales} puntos`, 'victory');

        cerrarRanking();
        volverAlMenu();
    } else {
        alert('Por favor, introduce tu nombre');
    }
}

// ===== CERRAR RANKING =====
function cerrarRanking() {
    const modal = document.querySelector('.ranking-modal');
    if (modal) {
        modal.remove();
    }
}

// ===== FUNCIÓN DE DEPURACIÓN PARA PALADINES =====
function debugPaladin() {
    console.log('=== DEBUG PALADINES ===');
    let paladines = [];
    for (let i = 0; i < arrayPersonajes.length; i++) {
        if (arrayPersonajes[i] instanceof Paladin) {
            paladines.push({
                pos: [arrayPersonajes[i].y, arrayPersonajes[i].x],
                vida: arrayPersonajes[i].vida,
                vidaMax: arrayPersonajes[i].vidaMax
            });
        }
    }
    console.log('Paladines encontrados:', paladines.length);
    console.log(paladines);
    console.log('======================');
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
            redimensionarTablero();
        }
    });

    actualizarTooltipsClases();

    if (coins === 0) {
        document.querySelectorAll('#menuCard .mode-btn').forEach(btn => {
            btn.disabled = true;
        });
        document.querySelectorAll('#menuCard input').forEach(el => {
            el.disabled = true;
        });
        document.getElementById('startBtn').disabled = true;
    }

    console.log('✅ Inicialización completa');
});

// ===== ACTUALIZAR VISIBILIDAD DE CONTROLES =====
function actualizarVisibilidadControles() {
    const helpPanel = document.getElementById('helpPanel');
    const survivorBtn = document.getElementById('survivorControlsBtn');
    const survivorPanel = document.getElementById('survivorPanel');
    
    if (!helpPanel || !survivorBtn) return;
    
    // Verificar si estamos en modo survivor con tienda visible
    const tiendaVisible = survivorPanel && !survivorPanel.classList.contains('hidden');
    
    if (modoSurvivorActivo && tiendaVisible) {
        // En survivor con tienda visible: ocultar panel de ayuda, mostrar botón
        helpPanel.classList.add('hidden');
        survivorBtn.classList.remove('hidden');
    } else {
        // En cualquier otro caso: mostrar panel de ayuda, ocultar botón
        helpPanel.classList.remove('hidden');
        survivorBtn.classList.add('hidden');
    }
}

// ===== MOSTRAR CONTROLES EMERGENTE (SOLO EN SURVIVOR) =====
function mostrarControlesEmergente() {
    // Solo abrir si estamos en modo survivor con tienda visible
    const survivorPanel = document.getElementById('survivorPanel');
    const tiendaVisible = survivorPanel && !survivorPanel.classList.contains('hidden');
    
    if (!modoSurvivorActivo || !tiendaVisible) {
        console.log('❌ Controles emergentes solo disponibles en modo survivor');
        return;
    }
    
    // Crear modal de controles
    const modal = document.createElement('div');
    modal.className = 'controls-modal';
    modal.innerHTML = `
        <div class="controls-container">
            <div class="controls-title">🎮 CONTROLES</div>
            <div class="controls-content">
                <div class="controls-grid">
                    <div class="controls-item">
                        <span class="controls-key">ESPACIO</span>
                        <span class="controls-desc">Insertar moneda</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">ENTER</span>
                        <span class="controls-desc">Jugar / Reintentar</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">P</span>
                        <span class="controls-desc">Pausar juego</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">C</span>
                        <span class="controls-desc">Continuar juego</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">R</span>
                        <span class="controls-desc">Reiniciar / Menú</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">ESC</span>
                        <span class="controls-desc">Volver al menú</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">+ / -</span>
                        <span class="controls-desc">Velocidad</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">0</span>
                        <span class="controls-desc">Velocidad normal</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">1</span>
                        <span class="controls-desc">Velocidad lenta</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">2</span>
                        <span class="controls-desc">Velocidad rápida</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">L</span>
                        <span class="controls-desc">Limpiar bitácora</span>
                    </div>
                    <div class="controls-item">
                        <span class="controls-key">F1</span>
                        <span class="controls-desc">Mostrar ayuda</span>
                    </div>
                </div>
                <div class="controls-footer">
                    ⚔️ Modo SURVIVOR - Controles rápidos ⚔️
                </div>
            </div>
            <button class="controls-close" onclick="cerrarControlesEmergente()">CERRAR</button>
        </div>
    `;
    
    // Asegurar que no haya otros modales
    const modalExistente = document.querySelector('.controls-modal');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    document.body.appendChild(modal);
    
    // Añadir evento para cerrar con Escape
    const cerrarEsc = (e) => {
        if (e.key === 'Escape') {
            cerrarControlesEmergente();
            document.removeEventListener('keydown', cerrarEsc);
        }
    };
    document.addEventListener('keydown', cerrarEsc);
    
    añadirLog('📋 Controles emergentes - Modo survivor', 'system');
}

// ===== MOSTRAR RANKING SOLO VER (SIN INPUT) =====
function mostrarRankingSoloVer() {
    cargarRanking();
    
    const rankingHTML = rankingJugadores.map((entry, index) => {
        let clase = '';
        if (index === 0) clase = 'top1';
        else if (index === 1) clase = 'top2';
        else if (index === 2) clase = 'top3';
        
        return `<div class="ranking-item ${clase}">
            <span class="ranking-position">#${index + 1}</span>
            <span class="ranking-name">${entry.nombre}</span>
            <span class="ranking-score">${entry.puntos}</span>
        </div>`;
    }).join('');
    
    // Crear modal solo para visualización (sin input)
    const modal = document.createElement('div');
    modal.className = 'ranking-modal';
    modal.innerHTML = `
        <div class="ranking-container">
            <div class="ranking-title">🏆 RANKING</div>
            <div class="ranking-list">
                ${rankingHTML || '<div style="color: #888; text-align: center; padding: 30px; font-size: 1.2rem;">No hay puntuaciones aún</div>'}
            </div>
            <div style="text-align: center; margin: 20px 0; color: var(--gold); font-size: 1rem;">
                ⭐ Top 10 mejores puntuaciones ⭐
            </div>
            <button class="ranking-close" onclick="cerrarRanking()">CERRAR</button>
        </div>
    `;
    
    // Asegurar que no haya otros modales
    const modalExistente = document.querySelector('.ranking-modal');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    document.body.appendChild(modal);
    
    // Añadir evento para cerrar con Escape
    const cerrarEsc = (e) => {
        if (e.key === 'Escape') {
            cerrarRanking();
            document.removeEventListener('keydown', cerrarEsc);
        }
    };
    document.addEventListener('keydown', cerrarEsc);
    
    añadirLog('👀 Visualizando ranking', 'system');
}

// ===== CONTROLES DE TECLADO =====
function iniciarControlesTeclado() {
    document.addEventListener('keydown', (e) => {
        // IMPORTANTE: Verificar si hay un input enfocado (como el del ranking)
        const inputActivo = document.activeElement && 
                           (document.activeElement.tagName === 'INPUT' || 
                            document.activeElement.tagName === 'TEXTAREA' ||
                            document.activeElement.tagName === 'BUTTON');
        
        // Si hay un input activo, permitir escribir sin interferencias
        if (inputActivo) {
            // Solo prevenir teclas específicas que podrían cerrar el modal
            if (e.key === 'Escape') {
                // Cerrar ranking si está abierto
                cerrarRanking();
                cerrarControlesEmergente();
                e.preventDefault();
            }
            return; // No procesar más atajos de teclado
        }
        
        // Resto del código solo se ejecuta si NO hay input activo
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        const tecla = e.key.toLowerCase();
        
        // Obtener el estado actual de las pantallas
        const menuVisible = !document.getElementById('menuScreen').classList.contains('hidden');
        const gameOverVisible = !document.getElementById('gameOverPanel').classList.contains('hidden');
        const rankingVisible = !!document.querySelector('.ranking-modal');
        const controlesVisible = !!document.querySelector('.controls-modal');
        
        // Tecla F1 o ? siempre muestra ayuda
        if (tecla === 'f1' || tecla === '?') {
            e.preventDefault();
            mostrarAyudaTeclado();
            return;
        }

        // ===== ATAJOS GLOBALES (funcionan siempre) =====
        switch (tecla) {
            case ' ':
            case 'space':
                e.preventDefault();
                insertCoin();
                break;
                
            case 'l':
                e.preventDefault();
                limpiarLogs();
                break;
        }

        // ===== ATAJOS QUE FUNCIONAN EN EL MENÚ PRINCIPAL =====
        if (menuVisible) {
            // En el menú, las teclas numéricas seleccionan modos
            if (tecla === '1' || tecla === '2' || tecla === '3') {
                e.preventDefault();
                // Simular clic en el botón correspondiente
                const btn = document.getElementById(`opcion${tecla}Btn`);
                if (btn && !btn.disabled) {
                    btn.click();
                }
            }
            
            // ENTER inicia el juego si hay monedas
            if (tecla === 'enter') {
                e.preventDefault();
                if (coins > 0) {
                    iniciarJuego();
                } else {
                    añadirLog('❌ Inserta una moneda primero', 'info');
                }
            }
            
            // ESC no hace nada en el menú (ya está)
        }
        
        // ===== ATAJOS QUE FUNCIONAN EN EL JUEGO (máquina recreativa) =====
        if (!menuVisible) {
            switch (tecla) {
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

        // ===== ATAJO PARA GAME OVER =====
        if (gameOverVisible && tecla === 'enter') {
            e.preventDefault();
            reintentarPartida();
        }
        
        // ===== ATAJO PARA CERRAR MODALES CON ESC =====
        if (tecla === 'escape') {
            if (rankingVisible) {
                cerrarRanking();
                e.preventDefault();
            } else if (controlesVisible) {
                cerrarControlesEmergente();
                e.preventDefault();
            } else if (!menuVisible) {
                // Si no hay modales y no estamos en el menú, volver al menú
                volverAlMenu();
                e.preventDefault();
            }
        }
    });
}

// ===== FUNCIÓN PARA SELECCIONAR OPCIÓN - CORREGIDA =====
function seleccionarOpcion(opcion) {
    console.log(`🎮 Seleccionando modo: ${opcion}`);
    opcionSeleccionada = opcion;
    
    // Quitar clase selected de todos los botones
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Añadir clase selected al botón actual
    const botones = {
        1: document.getElementById('opcion1Btn'),
        2: document.getElementById('opcion2Btn'),
        3: document.getElementById('opcion3Btn'),
        'survivor': document.getElementById('survivorBtn')
    };
    
    if (botones[opcion]) {
        botones[opcion].classList.add('selected');
    }
    
    // Mostrar/ocultar campo de número de personajes
    const nPersonajesRow = document.getElementById('nPersonajesRow');
    if (opcion === 1) {
        nPersonajesRow.classList.remove('hidden');
        añadirLog('⚙️ Modo 1: Necesitas especificar número de personajes', 'info');
    } else {
        nPersonajesRow.classList.add('hidden');
        añadirLog(`⚙️ Modo ${opcion} seleccionado`, 'info');
    }
    
    // Habilitar botón START
    validarBotonInicio();
}

// ===== EXPORTAR FUNCIONES GLOBALES =====
window.iniciarJuego = iniciarJuego;
window.seleccionarOpcion = seleccionarOpcion;
window.seleccionarModoSurvivor = seleccionarModoSurvivor;
window.seleccionarPersonajeTienda = seleccionarPersonajeTienda;
window.comprarPersonaje = comprarPersonaje;
window.iniciarRonda = iniciarRonda;
window.guardarPuntuacion = guardarPuntuacion;
window.cerrarRanking = cerrarRanking;
window.mostrarRankingSoloVer = mostrarRankingSoloVer;
window.mostrarControlesEmergente = mostrarControlesEmergente;
window.cerrarControlesEmergente = cerrarControlesEmergente;
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
window.debugPaladin = debugPaladin;