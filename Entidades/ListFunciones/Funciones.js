const Funciones = {
    // Constante para "limpiar" pantalla (en consola)
    CLEAN_SCREEN: '\n'.repeat(50),

    /**
     * DIBUJAR TÍTULO CON FORMATO
     * Crea un título con bordes de asteriscos
     * @param {string} texto - Texto del título
     * @param {number} espacios - Espacios alrededor del texto
     */
    titulo(texto, espacios) {
        const ancho = espacios + texto.length + 2;
        const esp = ' '.repeat(texto.length + 2 * espacios);
        
        console.log('\n' + '*'.repeat(ancho));
        console.log('*' + esp + '*');
        console.log('*' + ' '.repeat(espacios) + texto + ' '.repeat(espacios) + '*');
        console.log('*' + esp + '*');
        console.log('*'.repeat(ancho) + '\n');
    },

    /**
     * CALCULAR PORCENTAJE DE PERSONAJES
     * Determina cuántos personajes de cada tipo generar
     * @param {number} altura - Alto del tablero
     * @param {number} anchura - Ancho del tablero
     * @returns {number} Número de personajes a generar
     */
    numPorcent(altura, anchura) {
        const area = altura * anchura;
        return Math.floor(Math.random() * (area * 0.005)) + 1;
    },

    /**
     * MENÚ DE CONFIGURACIÓN
     * Permite al usuario elegir cómo generar personajes
     * @returns {Object} { nPersonajes, opcion }
     */
    menu(nPersonajes, altura, anchura, porBuenos, porMalos) {
        console.log('=== Generar Personajes ===\n');
        console.log('1. Mitad Buenos y Mitad Malos');
        console.log('2. Numero Personaje Aleatorios');
        console.log('3. Mitad Buenos y Mitad Malos Aleatorios');
        
        let opcion = parseInt(prompt('Opción: '));
        switch(opcion) {
            case 1:
                nPersonajes = parseInt(prompt('Dame el numero de personajes: '));
                nPersonajes = this.coprobaciones(nPersonajes, 'numero de personajes', 0);
                break;
            case 2:
                nPersonajes = porMalos + porBuenos;
                break;
            case 3:
                const areaDefault = altura * anchura;
                nPersonajes = Math.floor(Math.random() * (areaDefault * 0.01)) + 1;
                while (nPersonajes % 2 !== 0) {
                    nPersonajes = Math.floor(Math.random() * (areaDefault * 0.01)) + 1;
                }
                break;
        }
        return { nPersonajes, opcion };
    },

    /**
     * VALIDAR DATOS DE ENTRADA
     * Comprueba que los números sean válidos (positivos, pares, etc)
     */
    coprobaciones(atributo, nombre, min) {
        while (atributo <= 0 || atributo % 2 !== 0 || atributo < min) {
            if (atributo <= 0) console.log(`La ${nombre} no puede ser ${atributo}`);
            else if (atributo % 2 !== 0) console.log(`La ${nombre} tiene que ser un numero par`);
            else if (atributo < min) console.log(`${nombre} debe ser mayor o igual que ${min}`);
            atributo = parseInt(prompt(`Dame ${nombre}: `));
        }
        return atributo;
    },

    /**
     * GENERADOR PRINCIPAL
     * Orquesta la generación de todo el tablero
     */
    generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcion) {
        // Generar obstáculos (1% del área)
        this.generadorEntidades(altura, anchura, arrayEntidades, 0.01);
        
        // Generar personajes según opción elegida
        if (opcion === 1 || opcion === 3) {
            this.generadorPersonajesMitad(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes);
        } else if (opcion === 2) {
            this.generadorPersonajesPorcentaje(altura, anchura, arrayEntidades, arrayPersonajes, porBuenos, nPersonajes);
        }
    },

    /**
     * GENERAR OBSTÁCULOS
     * Coloca obstáculos aleatoriamente en el tablero
     */
    generadorEntidades(altura, anchura, arrayEntidades, porcentaje) {
        const area = altura * anchura;
        const nEnt = Math.floor(Math.random() * (area * porcentaje)) + 1;
        
        for (let i = 0; i < nEnt; i++) {
            let x, y;
            // Buscar posición vacía
            do {
                x = Math.floor(Math.random() * anchura);
                y = Math.floor(Math.random() * altura);
            } while (arrayEntidades[y][x] !== null);
            
            arrayEntidades[y][x] = new Obstaculos(y, x);
        }
    },

    /**
     * GENERAR PERSONAJES MITAD Y MITAD
     * Alterna Buenos y Malos (par/impar)
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
     * GENERAR PERSONAJES POR PORCENTAJE
     * Distribuye según porcentaje dado
     */
    generadorPersonajesPorcentaje(altura, anchura, arrayEntidades, arrayPersonajes, porcentaje, nPersonajes) {
        for (let i = 0; i < nPersonajes; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * anchura);
                y = Math.floor(Math.random() * altura);
            } while (arrayEntidades[y][x] !== null);
            
            if (i <= porcentaje) {
                arrayEntidades[y][x] = new Buenos(y, x);
                arrayPersonajes[i] = arrayEntidades[y][x];
            } else {
                arrayEntidades[y][x] = new Malos(y, x);
                arrayPersonajes[i] = arrayEntidades[y][x];
            }
        }
    },

    /**
     * PINTAR TABLERO
     * Genera el HTML para mostrar el tablero
     * @returns {string} HTML del tablero
     */
    pintarTablero(altura, anchura, arrayEntidades) {
        // Crear panel de estadísticas
        const stats = document.createElement('div');
        stats.style.color = '#8888ff';
        stats.innerHTML = `Total de Personajes: ${Personajes.getnPersonajes()} | Buenos: ${Buenos.getnBuenos()} | Malos: ${Malos.getnMalos()}<br>`;
        
        // Construir tablero línea por línea
        let sb = '╔' + '═'.repeat(anchura) + '╗\n';
        for (let i = 0; i < altura; i++) {
            sb += '║';
            for (let j = 0; j < anchura; j++) {
                const celda = arrayEntidades[i][j];
                if (celda === null) {
                    sb += ' ';  // Espacio vacío
                } else if (celda instanceof Buenos) {
                    sb += '<span style="color: #00ff00">B</span>';
                } else if (celda instanceof Malos) {
                    sb += '<span style="color: #ff0000">M</span>';
                } else if (celda instanceof Obstaculos) {
                    sb += '#';
                }
            }
            sb += '║\n';
        }
        sb += '╚' + '═'.repeat(anchura) + '╝';
        
        return stats.outerHTML + '<div style="font-family: monospace; white-space: pre;">' + sb + '</div>';
    },

    /**
     * ASIGNAR PERSONAJES CERCANOS
     * Para cada personaje, encuentra el enemigo más cercano
     */
    asignarPersonajesCercanos(nPersonajes, arrayPersonajes, tipoPersonaje, tipoPersonajeCerca) {
        for (let i = 0; i < nPersonajes; i++) {
            if (arrayPersonajes[i] === null) continue;
            
            // Buscar solo para el tipo solicitado
            if (arrayPersonajes[i].constructor.name === tipoPersonaje) {
                let distanciaMin = Infinity;
                let entidadCerca = null;
                
                // Buscar enemigo más cercano
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
                
                // Asignar la referencia
                if (tipoPersonaje === 'Malos') {
                    arrayPersonajes[i].setBuenos(entidadCerca);
                } else if (tipoPersonaje === 'Buenos') {
                    arrayPersonajes[i].setMalos(entidadCerca);
                }
            }
        }
    },

    /**
     * ELIMINAR PERSONAJE
     * Cuando un personaje muere, lo elimina del juego
     */
    eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, entidad, x, y) {
        for (let i = 0; i < nPersonajes; i++) {
            if (arrayPersonajes[i] === entidad) {
                // Eliminar de los arrays
                arrayPersonajes[i] = null;
                arrayEntidades[y][x] = null;
                
                // Actualizar contadores
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
     * MOVIMIENTO GLOBAL
     * Mueve todos los personajes en el tablero
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
     * VERIFICAR FIN DEL JUEGO
     * Comprueba si un bando ha sido eliminado
     * @returns {boolean} true si el juego terminó
     */
    terminar() {
        if (Buenos.getnBuenos() <= 0) {
            console.log(this.CLEAN_SCREEN);
            console.log('%cLos Malos han Eliminado a los Buenos', 'color: #ff0000');
            return true;
        } else if (Malos.getnMalos() <= 0) {
            console.log(this.CLEAN_SCREEN);
            console.log('%cLos Buenos han Sobrevivido', 'color: #00ff00');
            return true;
        }
        return false;
    }
};