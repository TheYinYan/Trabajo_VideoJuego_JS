/**
 * OBJETO FUNCIONES
 * Contiene métodos estáticos para el juego
 */
const Funciones = {
    CLEAN_SCREEN: '\n'.repeat(50),

    /**
     * Calcula número aleatorio basado en el área
     */
    numPorcent(altura, anchura) {
        const area = altura * anchura;
        return Math.floor(Math.random() * (area * 0.005)) + 1;
    },

    /**
     * Generador principal del mundo
     */
    generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcion) {
        // Generar obstáculos (1% del área)
        this.generadorEntidades(altura, anchura, arrayEntidades, 0.01);
        
        // Generar personajes según opción
        if (opcion === 1 || opcion === 3) {
            this.generadorPersonajesMitad(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes);
        } else if (opcion === 2) {
            this.generadorPersonajesPorcentaje(altura, anchura, arrayEntidades, arrayPersonajes, porBuenos, nPersonajes);
        }
    },

    /**
     * Generar obstáculos aleatoriamente
     */
    generadorEntidades(altura, anchura, arrayEntidades, porcentaje) {
        const nEnt = Math.floor(Math.random() * (altura * anchura * porcentaje)) + 1;
        
        for (let i = 0; i < nEnt; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * anchura);
                y = Math.floor(Math.random() * altura);
            } while (arrayEntidades[y][x] !== null);
            
            arrayEntidades[y][x] = new Obstaculos(y, x);
        }
    },

    /**
     * Generar personajes mitad y mitad
     */
    generadorPersonajesMitad(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes) {
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
    },

    /**
     * Generar personajes por porcentaje
     */
    generadorPersonajesPorcentaje(altura, anchura, arrayEntidades, arrayPersonajes, porcentaje, nPersonajes) {
        for (let i = 0; i < nPersonajes; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * anchura);
                y = Math.floor(Math.random() * altura);
            } while (arrayEntidades[y][x] !== null);
            
            if (i < porcentaje) {
                arrayEntidades[y][x] = new Buenos(y, x);
                arrayPersonajes[i] = arrayEntidades[y][x];
            } else {
                arrayEntidades[y][x] = new Malos(y, x);
                arrayPersonajes[i] = arrayEntidades[y][x];
            }
        }
    },

    /**
     * Pinta el tablero usando toString() de cada entidad
     */
    pintarTablero(altura, anchura, arrayEntidades) {
        let sb = '╔' + '═'.repeat(anchura) + '╗\n';
        for (let i = 0; i < altura; i++) {
            sb += '║';
            for (let j = 0; j < anchura; j++) {
                const celda = arrayEntidades[i][j];
                if (celda === null) {
                    sb += ' ';
                } else if (celda instanceof Buenos) {
                    sb += `<span style="color: #00ff00">${celda}</span>`;
                } else if (celda instanceof Malos) {
                    sb += `<span style="color: #ff0000">${celda}</span>`;
                } else if (celda instanceof Obstaculos) {
                    sb += celda;
                }
            }
            sb += '║\n';
        }
        sb += '╚' + '═'.repeat(anchura) + '╝';
        
        return '<div class="board-content">' + sb + '</div>';
    },

    /**
     * Asigna a cada personaje su enemigo más cercano
     */
    asignarPersonajesCercanos(nPersonajes, arrayPersonajes, tipoPersonaje, tipoPersonajeCerca) {
        for (let i = 0; i < nPersonajes; i++) {
            if (arrayPersonajes[i] === null) continue;
            
            if (arrayPersonajes[i].constructor.name === tipoPersonaje) {
                let distanciaMin = Infinity;
                let entidadCerca = null;
                
                for (let j = 0; j < nPersonajes; j++) {
                    if (arrayPersonajes[j] === null) continue;
                    
                    if (arrayPersonajes[j].constructor.name === tipoPersonajeCerca) {
                        const distancia = arrayPersonajes[i].distanciaCon(arrayPersonajes[j]);
                        if (distancia < distanciaMin) {
                            distanciaMin = distancia;
                            entidadCerca = arrayPersonajes[j];
                        }
                    }
                }
                
                if (tipoPersonaje === 'Malos') {
                    arrayPersonajes[i].setBuenos(entidadCerca);
                } else if (tipoPersonaje === 'Buenos') {
                    arrayPersonajes[i].setMalos(entidadCerca);
                }
            }
        }
    },

    /**
     * Elimina un personaje del juego
     */
    eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, entidad, x, y) {
        for (let i = 0; i < nPersonajes; i++) {
            if (arrayPersonajes[i] === entidad) {
                arrayPersonajes[i] = null;
                arrayEntidades[y][x] = null;
                
                Personajes.setnPersonajes(Personajes.getnPersonajes() - 1);
                if (entidad instanceof Buenos) {
                    Buenos.setnBuenos(Buenos.getnBuenos() - 1);
                } else if (entidad instanceof Malos) {
                    Malos.setnMalos(Malos.getnMalos() - 1);
                }
                break;
            }
        }
    },

    /**
     * Mueve todos los personajes
     */
    movimiento(altura, anchura, arrayEntidades) {
        for (let i = 0; i < altura; i++) {
            for (let j = 0; j < anchura; j++) {
                if (arrayEntidades[i][j] !== null && 
                    arrayEntidades[i][j] instanceof Personajes) {
                    arrayEntidades[i][j].mover(anchura, altura, arrayEntidades);
                }
            }
        }
    },

    /**
     * Verifica si el juego ha terminado
     */
    terminar() {
        if (Buenos.getnBuenos() <= 0) {
            console.log('%cLos Malos han Eliminado a los Buenos', 'color: #ff0000');
            return true;
        } else if (Malos.getnMalos() <= 0) {
            console.log('%cLos Buenos han Sobrevivido', 'color: #00ff00');
            return true;
        }
        return false;
    }
};