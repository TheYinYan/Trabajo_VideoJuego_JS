class Buenos extends Personajes {
    static nBuenos = 0;

    constructor(y, x) {
        super(y, x, 1, 1);
        this.malos = null;
        this.clase = 'BUENO';
        this.vida = 100;
        this.vidaMax = 100;
        Buenos.nBuenos++;
    }

    getMalos() { return this.malos; }
    setMalos(malos) { this.malos = malos; }
    
    static getnBuenos() { return Buenos.nBuenos; }
    static setnBuenos(n) { Buenos.nBuenos = n; }

    mover(ancho, alto, arrayEntidades) {
        // Pequeña probabilidad de no moverse (30%)
        if (Math.random() < 0.3) {
            return; // No se mueve en este turno
        }
        
        if (this.malos === null) {
            super.mover(ancho, alto, arrayEntidades);
            return;
        }
        
        let dx = 0, dy = 0;
        
        if (this.x < this.malos.x) dx = 1;
        else if (this.x > this.malos.x) dx = -1;
        
        if (this.y < this.malos.y) dy = 1;
        else if (this.y > this.malos.y) dy = -1;
        
        const auxX = this.x + dx;
        const auxY = this.y + dy;
        
        if (auxX >= 0 && auxX < ancho && auxY >= 0 && auxY < alto) {
            const destino = arrayEntidades[auxY][auxX];
            if (destino === null || destino instanceof Malos) {
                this.x = auxX;
                this.y = auxY;
                return;
            }
        }
        
        super.mover(ancho, alto, arrayEntidades);
    }

    toString() {
        return 'B';
    }
}