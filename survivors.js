/**
 * ARCHIVO PRINCIPAL
 * 
 * Controla el flujo del juego:
 * - Inicialización
 * - Bucle principal (con setInterval)
 * - Manejo de eventos de UI
 */

// Variable global para controlar la simulación
let intervaloSimulacion = null;

/**
 * INICIAR SIMULACIÓN
 * Configura y comienza el juego
 */
function iniciarSimulacion() {
    // Detener simulación anterior si existe
    detenerSimulacion();
    
    // Obtener valores de los inputs
    const altura = parseInt(document.getElementById('alturaInput').value);
    const anchura = parseInt(document.getElementById('anchuraInput').value);
    
    // Resetear contadores estáticos
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    
    // Calcular porcentajes
    const porBuenos = Funciones.numPorcent(altura, anchura);
    const porMalos = Funciones.numPorcent(altura, anchura);
    
    // Mostrar menú y obtener configuración
    const { nPersonajes, opcion } = Funciones.menu(null, altura, anchura, porBuenos, porMalos);
    
    // Crear arrays del juego
    const arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    const arrayPersonajes = Array(nPersonajes).fill(null);
    
    // Generar el mundo
    Funciones.generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcion);
    
    /**
     * ACTUALIZAR JUEGO (Cada tick)
     * Esta función se ejecuta cada 150ms
     */
    function actualizarJuego() {
        // 1. Actualizar referencias de enemigos cercanos
        Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Buenos", "Malos");
        Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Malos", "Buenos");
        
        // 2. Mover todos los personajes
        Funciones.movimiento(altura, anchura, arrayEntidades);
        
        // 3. Procesar colisiones y combates
        for (let i = 0; i < altura; i++) {
            for (let j = 0; j < anchura; j++) {
                if (arrayEntidades[i][j] !== null) {
                    const entidad = arrayEntidades[i][j];
                    const auxX = entidad.getX();
                    const auxY = entidad.getY();
                    
                    // Si la entidad cambió de posición
                    if (auxX !== j || auxY !== i) {
                        // Caso 1: Casilla destino vacía -> mover
                        if (arrayEntidades[auxY][auxX] === null) {
                            arrayEntidades[auxY][auxX] = entidad;
                            arrayEntidades[i][j] = null;
                        } 
                        // Caso 2: Hay combate (Bueno vs Malo)
                        else if ((arrayEntidades[auxY][auxX] instanceof Malos && entidad instanceof Buenos) ||
                                   (arrayEntidades[auxY][auxX] instanceof Buenos && entidad instanceof Malos)) {
                            
                            const defensor = arrayEntidades[auxY][auxX];
                            // Combate: resultado aleatorio ponderado por vida
                            const resultado = Math.floor(Math.random() * (entidad.getVida() + defensor.getVida()));
                            
                            if (resultado < entidad.getVida()) {
                                // Gana el atacante
                                Funciones.eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, defensor, auxX, auxY);
                            } else {
                                // Gana el defensor
                                Funciones.eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, entidad, j, i);
                            }
                        }
                    }
                }
            }
        }
        
        // 4. Actualizar visualización
        document.getElementById('tablero').innerHTML = Funciones.pintarTablero(altura, anchura, arrayEntidades);
        
        // 5. Verificar si el juego terminó
        if (Funciones.terminar()) {
            detenerSimulacion();
        }
    }
    
    // Iniciar el bucle del juego
    intervaloSimulacion = setInterval(actualizarJuego, 150);
}

/**
 * DETENER SIMULACIÓN
 * Pausa el juego
 */
function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
    }
}

/**
 * REINICIAR SIMULACIÓN
 * Vuelve al estado inicial
 */
function reiniciarSimulacion() {
    detenerSimulacion();
    document.getElementById('tablero').innerHTML = '';
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
}

// Las funciones están disponibles globalmente para los botones HTML