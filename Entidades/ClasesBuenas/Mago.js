class Mago extends Buenos {
    constructor(y, x) {
        super(y, x);
        this.vida = 80;
        this.vidaMax = 80;
        this.clase = 'MAGO';
    }
    
    calcularDaño() {
        return 20; // 20% de daño
    }
    
    toString() { return 'W'; }
}