class Personajes extends Entidad {
    static nPersonajes = 0;

    constructor(y, x, vx, vy) {
        super(y, x, vx, vy);
        this.vida = 100;
        this.vidaMax = 100;
        this.clase = 'BASE';
        Personajes.nPersonajes++;
    }

    getVida() { return this.vida; }
    getVidaMax() { return this.vidaMax; }
    
    // Métodos para el sistema de clases
    calcularDaño() {
        return 15; // 15% por defecto
    }
    
    recibirDaño(daño) {
        return daño; // Por defecto, recibe daño completo
    }
    
    static getnPersonajes() { return Personajes.nPersonajes; }
    static setnPersonajes(n) { Personajes.nPersonajes = n; }
}