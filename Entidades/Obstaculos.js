class Obstaculos extends Entidad {
    /**
     * Constructor de Obstaculos
     * @param {number} y - Posición Y
     * @param {number} x - Posición X
     */
    constructor(y, x) {
        // Los obstáculos no se mueven: velocidad 0,0
        super(y, x, 0, 0);
    }

    /**
     * Los obstáculos no tienen vida, pero como Entidad requiere
     * el método getVida(), lanzamos error si alguien lo llama.
     * @throws {Error} Siempre, porque obstáculos no participan en combates
     */
    getVida() {
        throw new Error('Los obstáculos no tienen vida');
    }

    /**
     * Representación en string del Obstáculo
     * @returns {string} '#' para mostrar en el tablero
     */
    toString() {
        return '#';
    }
}