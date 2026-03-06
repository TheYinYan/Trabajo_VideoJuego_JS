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
        return Math.floor(daño * 0.5); // Reduce daño 50%
    }
    
    toString() { return 'P'; }
}