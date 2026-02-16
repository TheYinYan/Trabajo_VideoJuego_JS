class Malos extends Personajes {
    // Contador estático específico para Malos
    static nMalos = 0;

    /**
     * Constructor de Malos
     * @param {number} y - Posición Y
     * @param {number} x - Posición X
     */
    constructor(y, x) {
        super(y, x, 1, 1);  // Velocidad base 1,1
        this.bueno = null;   // Referencia al bueno más cercano
        Malos.nMalos++;       // Incrementar contador de Malos
    }

    // Getters y Setters
    getBuenos() { return this.bueno; }
    setBuenos(bueno) { this.bueno = bueno; }
    
    // Métodos estáticos para el contador
    static getnMalos() { return Malos.nMalos; }
    static setnMalos(n) { Malos.nMalos = n; }

    /**
     * MOVIMIENTO ESPECÍFICO DE MALOS
     * 
     * Lógica:
     * - Si no hay buenos cerca: movimiento aleatorio
     * - Si hay buenos cerca: se mueve HACIA el bueno (persecución)
     * - Nota: Los malos persiguen a los buenos (al revés que en Buenos)
     * 
     * @override
     */
    mover(ancho, alto, arrayEntidades) {
        // Caso 1: No hay buenos asignados -> movimiento aleatorio
        if (this.bueno === null) {
            super.mover(ancho, alto, arrayEntidades);
            return;
        } 
        // Caso 2: Hay buenos y están cerca (distancia <= 10)
        else if (this.estaCercaDe(this.bueno, 10)) {
            // Calcular dirección hacia el bueno
            // En X: +1 para derecha, -1 para izquierda
            if (this.x < this.bueno.x) {
                this.setVx(1);   // Bueno está a la derecha
            } else if (this.x > this.bueno.x) {
                this.setVx(-1);  // Bueno está a la izquierda
            } else {
                this.setVx(0);
            }

            // En Y: +1 para abajo, -1 para arriba
            if (this.y < this.bueno.y) {
                this.setVy(1);   // Bueno está abajo
            } else if (this.y > this.bueno.y) {
                this.setVy(-1);  // Bueno está arriba
            } else {
                this.setVy(0);
            }

            // Calcular nueva posición
            const auxX = this.x + this.vx;
            const auxY = this.y + this.vy;

            // Verificar validez del movimiento
            if (auxX >= 0 && auxX < ancho && auxY >= 0 && auxY < alto) {
                if (arrayEntidades[auxY][auxX] === null || 
                    arrayEntidades[auxY][auxX].constructor.name !== 'Obstaculos') {
                    this.x = auxX;
                    this.y = auxY;
                } else {
                    super.mover(ancho, alto, arrayEntidades);
                    return;
                }
            } else {
                super.mover(ancho, alto, arrayEntidades);
                return;
            }
        } 
        // Caso 3: Buenos lejos -> movimiento aleatorio
        else {
            super.mover(ancho, alto, arrayEntidades);
            return;
        }
    }

    /**
     * Representación en string del Malo
     * @returns {string} 'M' para mostrar en el tablero
     */
    toString() {
        return 'M';
    }
}