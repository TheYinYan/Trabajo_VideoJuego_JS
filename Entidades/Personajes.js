class Personajes extends Entidad {
    // Variable estática (de clase) que cuenta el total de personajes vivos
    static nPersonajes = 0;

    /**
     * Constructor de Personajes
     * @param {number} y
     * @param {number} x
     * @param {number} vx
     * @param {number} vy
     */
    constructor(y, x, vx, vy) {
        super(y, x, vx, vy);
        
        // Vida aleatoria entre 10 y 100 (como en Java: random*91 + 10)
        this.vida = Math.floor(Math.random() * 91) + 10;
        
        // Incrementar contador de personajes
        Personajes.nPersonajes++;
    }

    // Getter para la vida
    getVida() { return this.vida; }

    // Métodos estáticos para manejar el contador global
    static getnPersonajes() { return Personajes.nPersonajes; }
    static setnPersonajes(n) { Personajes.nPersonajes = n; }
}
