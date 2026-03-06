class Tanque extends Malos {
    constructor(y, x) {
        super(y, x);
        this.vida = 200;
        this.vidaMax = 200;
        this.clase = 'TANQUE';
    }
    
    calcularDaño() {
        return 10; // 10% de daño
    }
    
    toString() { return 'T'; }
}