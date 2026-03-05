class Obstaculos extends Entidad {
    constructor(y, x) {
        super(y, x, 0, 0);
    }

    getVida() {
        throw new Error('Los obstáculos no tienen vida');
    }

    toString() {
        return '#';
    }
}