/**
 * CLASE MALOS
 * Representa a los personajes malos (M en el tablero)
 */
class Malos extends Personajes {
    static nMalos = 0;

    constructor(y, x) {
        super(y, x, 1, 1);
        this.bueno = null;  // Referencia al bueno más cercano
        Malos.nMalos++;
    }

    getBuenos() { return this.bueno; }
    setBuenos(bueno) { this.bueno = bueno; }
    
    static getnMalos() { return Malos.nMalos; }
    static setnMalos(n) { Malos.nMalos = n; }

    /**
     * Movimiento especializado de Malos
     * Si hay buenos cerca, se mueve HACIA ellos
     */
    mover(ancho, alto, arrayEntidades) {
        if (this.bueno === null) {
            super.mover(ancho, alto, arrayEntidades);
            return;
        } else if (this.estaCercaDe(this.bueno, 10)) {
            // Calcular dirección hacia el bueno
            if (this.x < this.bueno.x) {
                this.setVx(1);
            } else if (this.x > this.bueno.x) {
                this.setVx(-1);
            } else {
                this.setVx(0);
            }

            if (this.y < this.bueno.y) {
                this.setVy(1);
            } else if (this.y > this.bueno.y) {
                this.setVy(-1);
            } else {
                this.setVy(0);
            }

            const auxX = this.x + this.vx;
            const auxY = this.y + this.vy;

            if (auxX >= 0 && auxX < ancho && auxY >= 0 && auxY < alto) {
                if (arrayEntidades[auxY][auxX] === null || 
                    arrayEntidades[auxY][auxX].constructor.name !== 'Obstaculos') {
                    this.x = auxX;
                    this.y = auxY;
                } else {
                    super.mover(ancho, alto, arrayEntidades);
                }
            } else {
                super.mover(ancho, alto, arrayEntidades);
            }
        } else {
            super.mover(ancho, alto, arrayEntidades);
        }
    }

    toString() {
        return 'M';
    }
}