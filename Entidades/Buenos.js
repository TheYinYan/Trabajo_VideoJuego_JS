class Buenos extends Personajes {
    // Contador estático específico para Buenos
    static nBuenos = 0;

    /**
     * Constructor de Buenos
     * @param {number} y - Posición Y
     * @param {number} x - Posición X
     */
    constructor(y, x) {
        super(y, x, 1, 1);  // Velocidad base 1,1
        this.malos = null;   // Referencia al malo más cercano
        Buenos.nBuenos++;     // Incrementar contador de Buenos
    }

    // Getters y Setters
    getMalos() { return this.malos; }
    setMalos(malos) { this.malos = malos; }
    
    // Métodos estáticos para el contador
    static getnBuenos() { return Buenos.nBuenos; }
    static setnBuenos(n) { Buenos.nBuenos = n; }

    /**
     * MOVIMIENTO ESPECÍFICO DE BUENOS
     * 
     * Lógica:
     * - Si no hay malos cerca: movimiento aleatorio (hereda de Entidad)
     * - Si hay malos cerca: se mueve HACIA el malo (persecución)
     * - Si encuentra obstáculo: movimiento aleatorio
     * 
     * @override
     */
    mover(ancho, alto, arrayEntidades) {
        // Caso 1: No hay malos asignados -> movimiento aleatorio
        if (this.malos === null) {
            super.mover(ancho, alto, arrayEntidades);
            return;
        } 
        // Caso 2: Hay malos y están cerca (distancia <= 10)
        else if (this.estaCercaDe(this.malos, 10)) {
            // Calcular dirección hacia el malo
            // En X: -1 para izquierda, +1 para derecha
            if (this.x < this.malos.x) {
                this.setVx(-1);  // Malo está a la derecha, voy hacia él
            } else if (this.x > this.malos.x) {
                this.setVx(1);   // Malo está a la izquierda, voy hacia él
            } else {
                this.setVx(0);   // Misma columna
            }

            // En Y: -1 para arriba, +1 para abajo
            if (this.y < this.malos.y) {
                this.setVy(-1);  // Malo está abajo, voy hacia él
            } else if (this.y > this.malos.y) {
                this.setVy(1);   // Malo está arriba, voy hacia él
            } else {
                this.setVy(0);   // Misma fila
            }

            // Calcular nueva posición
            const auxX = this.x + this.vx;
            const auxY = this.y + this.vy;

            // Verificar si el movimiento es válido
            if (auxX >= 0 && auxX < ancho && auxY >= 0 && auxY < alto) {
                // Si la casilla está vacía o no es obstáculo
                if (arrayEntidades[auxY][auxX] === null || 
                    arrayEntidades[auxY][auxX].constructor.name !== 'Obstaculos') {
                    this.x = auxX;
                    this.y = auxY;
                } else {
                    // Hay obstáculo -> movimiento aleatorio
                    super.mover(ancho, alto, arrayEntidades);
                    return;
                }
            } else {
                // Fuera de límites -> movimiento aleatorio
                super.mover(ancho, alto, arrayEntidades);
                return;
            }
        } 
        // Caso 3: Hay malos pero están lejos -> movimiento aleatorio
        else {
            super.mover(ancho, alto, arrayEntidades);
            return;
        }
    }

    /**
     * Representación en string del Buenos
     * @returns {string} 'B' para mostrar en el tablero
     */
    toString() {
        return 'B';
    }
}