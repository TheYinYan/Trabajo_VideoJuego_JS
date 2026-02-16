/**
 * CLASE PERSONAJES
 * Hereda de Entidad. Añade vida y contador global.
 */
class Personajes extends Entidad {
    static nPersonajes = 0;

    constructor(y, x, vx, vy) {
        super(y, x, vx, vy);
        // Vida aleatoria entre 10 y 100
        this.vida = Math.floor(Math.random() * 91) + 10;
        Personajes.nPersonajes++;
    }

    getVida() { return this.vida; }

    static getnPersonajes() { return Personajes.nPersonajes; }
    static setnPersonajes(n) { Personajes.nPersonajes = n; }
}