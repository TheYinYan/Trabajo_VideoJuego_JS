class Asesino extends Malos {
    constructor(y, x) {
        super(y, x);
        this.vida = 70;
        this.vidaMax = 70;
        this.clase = 'ASESINO';
    }
    
    calcularDaño() {
        // 15% de probabilidad de crítico (x2)
        if (Math.random() < 0.15) {
            console.log('🗡️ ¡GOLPE CRÍTICO!');
            return 60; // 30% * 2 = 60%
        }
        return 30; // 30% de daño
    }
    
    toString() { return 'A'; }
}