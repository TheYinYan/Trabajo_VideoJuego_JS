/**
 * CLASE OBSTACULOS
 * Entidades estáticas que bloquean el paso
 */
class Obstaculos extends Entidad {
    constructor(y, x) {
        super(y, x, 0, 0);  // Velocidad 0 (no se mueven)
    }

    getVida() {
        throw new Error('Los obstáculos no tienen vida');
    }

    toString() {
        return '#';
    }
}