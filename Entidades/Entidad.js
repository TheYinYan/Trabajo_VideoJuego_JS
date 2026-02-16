/**
 * CLASE BASE ENTIDAD
 * Todas las entidades del juego heredan de esta clase
 */
class Entidad {
    constructor(y, x, vx, vy) {
        this.y = y;        // Posición Y (fila)
        this.x = x;        // Posición X (columna)
        this.vy = vy;      // Velocidad en Y
        this.vx = vx;      // Velocidad en X
    }

    // Getters
    getY() { return this.y; }
    getX() { return this.x; }
    getVy() { return this.vy; }
    getVx() { return this.vx; }

    // Setters
    setVy(vy) { this.vy = vy; }
    setVx(vx) { this.vx = vx; }

    /**
     * Calcula la distancia euclidiana entre esta entidad y otra
     */
    distanciaCon(ent) {
        return Math.sqrt(
            Math.pow(this.x - ent.x, 2) + 
            Math.pow(this.y - ent.y, 2)
        );
    }

    /**
     * Verifica si está cerca de otra entidad
     */
    estaCercaDe(ent, distancia) {
        return this.distanciaCon(ent) <= distancia;
    }

    /**
     * Movimiento aleatorio en 8 direcciones
     */
    mover(ancho, alto, arrayEntidades) {
        // Las 8 direcciones posibles: [dy, dx]
        const direcciones = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],          [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];

        // Mezclar direcciones para movimiento aleatorio
        for (let i = 0; i < direcciones.length; i++) {
            const d = Math.floor(Math.random() * direcciones.length);
            [direcciones[i], direcciones[d]] = [direcciones[d], direcciones[i]];
        }

        // Probar cada dirección
        for (const d of direcciones) {
            const auxX = this.x + d[0];
            const auxY = this.y + d[1];

            // Verificar límites del tablero
            if (auxX < 0 || auxX >= ancho || auxY < 0 || auxY >= alto) continue;
            
            // Verificar si hay obstáculo
            if (arrayEntidades[auxY][auxX] && 
                arrayEntidades[auxY][auxX].constructor.name === 'Obstaculos') continue;

            // Movimiento exitoso
            this.x = auxX;
            this.y = auxY;
            return;
        }
    }
}