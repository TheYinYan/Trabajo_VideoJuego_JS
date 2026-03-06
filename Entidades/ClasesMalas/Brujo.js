class Brujo extends Malos {
    constructor(y, x) {
        super(y, x);
        this.vida = 90;
        this.vidaMax = 90;
        this.clase = 'BRUJO';
    }
    
    calcularDaño() {
        return 25; // 25% de daño
    }
    
    toString() { return 'U'; }
}