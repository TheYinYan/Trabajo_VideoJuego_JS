class Entidad {
    /**
     * Constructor de Entidad
     * @param {number} y - Posición Y (fila) en el tablero
     * @param {number} x - Posición X (columna) en el tablero
     * @param {number} vx - Velocidad en X (dirección)
     * @param {number} vy - Velocidad en Y (dirección)
     */
    constructor(y, x, vx, vy) {
        this.y = y;        
        this.x = x;        
        this.vy = vy;      
        this.vx = vx;      
    }

    // GETTERS - Métodos para obtener valores privados
    getY() { return this.y; }
    getX() { return this.x; }
    getVy() { return this.vy; }
    getVx() { return this.vx; }

    // SETTERS - Métodos para modificar valores privados
    setVy(vy) { this.vy = vy; }
    setVx(vx) { this.vx = vx; }

    /**
     * Calcula la distancia euclidiana entre esta entidad y otra
     * @param {Entidad} ent - La otra entidad
     * @returns {number} Distancia entre ambas
     */
    distanciaCon(ent) {
        return Math.sqrt(
            Math.pow(this.x - ent.x, 2) + 
            Math.pow(this.y - ent.y, 2)
        );
    }

    /**
     * Verifica si esta entidad está cerca de otra
     * @param {Entidad} ent - La otra entidad
     * @param {number} distancia - Distancia máxima considerada "cerca"
     * @returns {boolean} true si está dentro de la distancia
     */
    estaCercaDe(ent, distancia) {
        return this.distanciaCon(ent) <= distancia;
    }

    /**
     * Movimiento aleatorio de la entidad
     * Intenta moverse en 8 direcciones posibles (incluyendo diagonales)
     * Si encuentra obstáculo, prueba otra dirección
     * 
     * @param {number} ancho - Ancho del tablero
     * @param {number} alto - Alto del tablero
     * @param {Array} arrayEntidades - Matriz del tablero
     */
    mover(ancho, alto, arrayEntidades) {
        // Las 8 direcciones posibles: [dy, dx]
        const direcciones = [
            [-1, -1], [-1, 0], [-1, 1],  // Arriba y diagonales
            [0, -1],          [0, 1],     // Izquierda y derecha
            [1, -1],  [1, 0],  [1, 1]     // Abajo y diagonales
        ];

        // Mezclar direcciones aleatoriamente (para que no siempre intente el mismo orden)
        for (let i = 0; i < direcciones.length; i++) {
            const d = Math.floor(Math.random() * direcciones.length);
            [direcciones[i], direcciones[d]] = [direcciones[d], direcciones[i]];
        }

        // Probar cada dirección una vez
        for (const d of direcciones) {
            const auxX = this.x + d[0];
            const auxY = this.y + d[1];

            // Verificar límites del tablero
            if (auxX < 0 || auxX >= ancho || auxY < 0 || auxY >= alto) continue;
            
            // Verificar si hay obstáculo (usando constructor.name para evitar dependencia circular)
            if (arrayEntidades[auxY][auxX] && 
                arrayEntidades[auxY][auxX].constructor.name === 'Obstaculos') continue;

            // Movimiento exitoso
            this.x = auxX;
            this.y = auxY;
            return;
        }
    }
}