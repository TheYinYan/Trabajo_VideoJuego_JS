class Curandero extends Buenos {
    constructor(y, x) {
        super(y, x);
        this.vida = 120;
        this.vidaMax = 120;
        this.clase = 'CURANDERO';
    }
    
    calcularDaño() {
        return 5; // 5% de daño
    }
    
    toString() { return 'C'; }
}