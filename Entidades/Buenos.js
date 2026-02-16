/**
 * CLASE BUENOS
 * Representa a los personajes buenos (B en el tablero)
 */
class Buenos extends Personajes {
    static nBuenos = 0;

    constructor(y, x) {
        super(y, x, 1, 1);
        this.malos = null;  // Referencia al malo más cercano
        Buenos.nBuenos++;
    }

    getMalos() { return this.malos; }
    setMalos(malos) { this.malos = malos; }
    
    static getnBuenos() { return Buenos.nBuenos; }
    static setnBuenos(n) { Buenos.nBuenos = n; }

    /**
     * Movimiento especializado de Buenos
     * Si hay malos cerca, se mueve HACIA ellos
     */
    mover(ancho, alto, arrayEntidades) {
        if (this.malos === null) {
            super.mover(ancho, alto, arrayEntidades);
            return;
        } else if (this.estaCercaDe(this.malos, 10)) {
            // Calcular dirección hacia el malo
            if (this.x < this.malos.x) {
                this.setVx(-1);
            } else if (this.x > this.malos.x) {
                this.setVx(1);
            } else {
                this.setVx(0);
            }

            if (this.y < this.malos.y) {
                this.setVy(-1);
            } else if (this.y > this.malos.y) {
                this.setVy(1);
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
        return 'B';
    }
}