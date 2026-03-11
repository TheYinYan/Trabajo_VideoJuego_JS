class Malos extends Personajes {
    static nMalos = 0;

    constructor(y, x) {
        super(y, x, 1, 1);
        this.bueno = null;
        this.clase = 'MALO';
        this.vida = 100;
        this.vidaMax = 100;
        Malos.nMalos++;
    }

    getBuenos() { return this.bueno; }
    setBuenos(bueno) { this.bueno = bueno; }
    
    static getnMalos() { return Malos.nMalos; }
    static setnMalos(n) { Malos.nMalos = n; }

    mover(ancho, alto, arrayEntidades) {
        if (Math.random() < 0.3) return;
        
        if (this.bueno === null) {
            super.mover(ancho, alto, arrayEntidades);
            return;
        }
        
        let dx = 0, dy = 0;
        
        if (this.x < this.bueno.x) dx = 1;
        else if (this.x > this.bueno.x) dx = -1;
        
        if (this.y < this.bueno.y) dy = 1;
        else if (this.y > this.bueno.y) dy = -1;
        
        const auxX = this.x + dx;
        const auxY = this.y + dy;
        
        if (auxX >= 0 && auxX < ancho && auxY >= 0 && auxY < alto) {
            const destino = arrayEntidades[auxY][auxX];
            if (destino === null || destino instanceof Buenos) {
                this.x = auxX;
                this.y = auxY;
                return;
            }
        }
        
        super.mover(ancho, alto, arrayEntidades);
    }

    toString() {
        return 'M';
    }
}