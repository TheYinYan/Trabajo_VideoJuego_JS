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
        // Si no hay enemigo, movimiento aleatorio
        if (this.bueno === null) {
            super.mover(ancho, alto, arrayEntidades);
            return;
        }
        
        // Calcular dirección hacia el bueno
        let dx = 0, dy = 0;
        
        if (this.x < this.bueno.x) dx = 1;
        else if (this.x > this.bueno.x) dx = -1;
        
        if (this.y < this.bueno.y) dy = 1;
        else if (this.y > this.bueno.y) dy = -1;
        
        // Intentar mover en la dirección calculada
        const auxX = this.x + dx;
        const auxY = this.y + dy;
        
        // Verificar si el movimiento es válido
        if (auxX >= 0 && auxX < ancho && auxY >= 0 && auxY < alto) {
            const destino = arrayEntidades[auxY][auxX];
            // Puede moverse si está vacío o si es un enemigo (para combatir)
            if (destino === null || destino instanceof Buenos) {
                this.x = auxX;
                this.y = auxY;
                return;
            }
        }
        
        // Si no puede moverse hacia el enemigo, movimiento aleatorio
        super.mover(ancho, alto, arrayEntidades);
    }

    toString() {
        return 'M';
    }
}