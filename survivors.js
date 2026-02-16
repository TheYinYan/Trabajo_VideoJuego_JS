/**
 * ARCHIVO PRINCIPAL
 */

let intervaloSimulacion = null;

/**
 * ACTUALIZAR CONTADORES VISUALES
 */
function actualizarContadoresVisuales() {
    document.getElementById('totalStats').textContent = Personajes.getnPersonajes();
    document.getElementById('buenosStats').textContent = Buenos.getnBuenos();
    document.getElementById('malosStats').textContent = Malos.getnMalos();
}

/**
 * INICIAR SIMULACIÓN
 */
function iniciarSimulacion() {
    detenerSimulacion();
    
    const altura = parseInt(document.getElementById('alturaInput').value);
    const anchura = parseInt(document.getElementById('anchuraInput').value);
    
    if (altura < 30 || altura % 2 !== 0 || anchura < 30 || anchura % 2 !== 0) {
        alert('La altura y anchura deben ser números pares mayores o iguales a 30');
        return;
    }
    
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
    
    const porBuenos = Funciones.numPorcent(altura, anchura);
    const porMalos = Funciones.numPorcent(altura, anchura);
    
    const { nPersonajes, opcion } = Funciones.menu(null, altura, anchura, porBuenos, porMalos);
    
    const arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    const arrayPersonajes = Array(nPersonajes).fill(null);
    
    Funciones.generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcion);
    
    actualizarContadoresVisuales();
    
    function actualizarJuego() {
        Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Buenos", "Malos");
        Funciones.asignarPersonajesCercanos(nPersonajes, arrayPersonajes, "Malos", "Buenos");
        
        Funciones.movimiento(altura, anchura, arrayEntidades);
        
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
                            } else {
                                Funciones.eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, entidad, j, i);
                            }
                            
                            actualizarContadoresVisuales();
                        }
                    }
                }
            }
        }
        
        // Ahora SOLO pintamos el tablero, las estadísticas ya están separadas
        document.getElementById('tablero').innerHTML = Funciones.pintarTablero(altura, anchura, arrayEntidades);
        
        actualizarContadoresVisuales();
        
        if (Funciones.terminar()) {
            detenerSimulacion();
            setTimeout(() => {
                alert(Funciones.terminar() ? 
                      (Buenos.getnBuenos() <= 0 ? '💀 Los Malos han ganado 💀' : '✨ Los Buenos han sobrevivido ✨') : 
                      '');
            }, 200);
        }
    }
    
    intervaloSimulacion = setInterval(actualizarJuego, 150);
}

function detenerSimulacion() {
    if (intervaloSimulacion) {
        clearInterval(intervaloSimulacion);
        intervaloSimulacion = null;
    }
}

function reiniciarSimulacion() {
    detenerSimulacion();
    document.getElementById('tablero').innerHTML = '';
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    actualizarContadoresVisuales();
}