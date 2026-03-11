class Paladin extends Buenos {
    constructor(y, x) {
        super(y, x);
        this.vida = 150;
        this.vidaMax = 150;
        this.clase = 'PALADÍN';
    }
    
    calcularDaño() {
        return 10; // 10% de daño
    }
    
    recibirDaño(daño) {
        // Reducir el daño en un 50% (redondeado hacia arriba para que siempre haga al menos 1 de daño)
        return Math.max(1, Math.floor(daño * 0.5));
    }
    
    toString() {
        return 'P';
    }
}