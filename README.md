# ⚔️ SURVIVORS - Batalla Épica

Juego de simulación donde personajes Buenos (B) y Malos (M) luchan en un tablero con obstáculos (#). Los personajes se mueven, persiguen a sus enemigos y combaten hasta que solo queda un bando.

![Versión](https://img.shields.io/badge/versión-2.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Licencia](https://img.shields.io/badge/licencia-MIT-green)

---

## 📑 ÍNDICE

- [⚔️ SURVIVORS - Batalla Épica](#️-survivors---batalla-épica)
  - [📑 ÍNDICE](#-índice)
  - [🎮 DESCRIPCIÓN DEL JUEGO](#-descripción-del-juego)
  - [📁 ESTRUCTURA DE ARCHIVOS](#-estructura-de-archivos)
  - [🚀 CÓMO EJECUTAR](#-cómo-ejecutar)
  - [🎯 CARACTERÍSTICAS PRINCIPALES](#-características-principales)
  - [📚 EXPLICACIÓN DEL CÓDIGO](#-explicación-del-código)
    - [1. HTML (index.html)](#1-html-indexhtml)
    - [2. CSS (style.css)](#2-css-stylecss)
    - [3. Clases JavaScript](#3-clases-javascript)
      - [Entidad.js - Clase Base](#entidadjs---clase-base)
      - [Personajes.js](#personajesjs)
      - [Buenos.js](#buenosjs)
      - [Malos.js](#malosjs)
      - [Obstaculos.js](#obstaculosjs)
    - [4. Funciones Utilitarias (Funciones.js)](#4-funciones-utilitarias-funcionesjs)
    - [5. Control Principal (survivors.js)](#5-control-principal-survivorsjs)
  - [🔄 FLUJO DEL JUEGO](#-flujo-del-juego)
  - [⚙️ OPCIONES DE CONFIGURACIÓN](#️-opciones-de-configuración)
  - [🎨 PERSONALIZACIÓN](#-personalización)
    - [Cambiar colores](#cambiar-colores)
    - [Cambiar velocidad](#cambiar-velocidad)
    - [Cambiar tamaño del tablero](#cambiar-tamaño-del-tablero)
    - [Añadir nuevos tipos de personajes](#añadir-nuevos-tipos-de-personajes)
  - [🐛 SOLUCIÓN DE PROBLEMAS COMUNES](#-solución-de-problemas-comunes)
  - [📝 NOTAS PARA DESARROLLADORES](#-notas-para-desarrolladores)

---

## 🎮 DESCRIPCIÓN DEL JUEGO

**Survivors** es una simulación de batalla entre dos bandos:
- **Buenos (B)** - Representados en color verde 🟢
- **Malos (M)** - Representados en color rojo 🔴
- **Obstáculos (#)** - Elementos estáticos que bloquean el paso

Los personajes se mueven aleatoriamente por el tablero, pero cuando detectan un enemigo cercano, se mueven hacia él para combatir. El combate se resuelve mediante un sistema de probabilidad basado en la vida de cada personaje.

---

## 📁 ESTRUCTURA DE ARCHIVOS
survivors-js/ <br>
│<br>
├── 📄 index.html # Interfaz de usuario<br>
├── 📁 css/<br>
│ └── 📄 style.css # Estilos visuales<br>
├── 📁 Entidades/ # Clases del juego<br>
│ ├── 📄 Entidad.js # Clase base<br>
│ ├── 📄 Personajes.js # Clase para personajes<br>
│ ├── 📄 Buenos.js # Buenos (hereda de Personajes)<br>
│ ├── 📄 Malos.js # Malos (hereda de Personajes)<br>
│ ├── 📄 Obstaculos.js # Obstáculos (hereda de Entidad)<br>
│ └── 📁 ListFunciones/<br>
└── 📄 survivors.js # Control principal<br>

---

## 🚀 CÓMO EJECUTAR

1. **Descarga todos los archivos** manteniendo la estructura de carpetas
2. **Abre el archivo `index.html`** en cualquier navegador moderno (Chrome, Firefox, Edge, etc.)
3. **Configura el juego**:
   - Ajusta las dimensiones del tablero (pares, mínimo 10)
   - Selecciona el modo de generación de personajes
   - Si eliges la opción 1, introduce el número de personajes
4. **Haz clic en "COMENZAR BATALLA"**
5. **Observa la batalla** en tiempo real
6. **Usa los controles** para detener, reiniciar o ajustar la velocidad

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

- ✅ **Interfaz responsive** - Se adapta a móviles, tablets y desktop
- ✅ **Cálculo automático** de dimensiones óptimas según tu pantalla
- ✅ **Tres modos de generación** de personajes
- ✅ **Sistema de combate** basado en probabilidad
- ✅ **Persecución inteligente** - Los personajes persiguen a sus enemigos
- ✅ **Estadísticas en tiempo real** - Total, Buenos y Malos
- ✅ **Control de velocidad** - Ajusta la velocidad de la simulación
- ✅ **Diseño cyberpunk** con efectos neón y animaciones

---

## 📚 EXPLICACIÓN DEL CÓDIGO

### 1. HTML (index.html)

El HTML define la estructura visual del juego con **IDs específicos** que JavaScript utiliza para interactuar:

| ID | Propósito |
|----|-----------|
| `totalStats`, `buenosStats`, `malosStats` | Contadores que se actualizan |
| `menuPanel` | Panel de configuración (se oculta/muestra) |
| `tablero` | Contenedor del tablero (se oculta/muestra) |
| `tableroContainer` | Donde se pinta el tablero |
| `resultadoPanel` | Panel de resultados |
| `startBtn` | Botón de inicio |
| `alturaInput`, `anchuraInput` | Inputs de dimensiones |

**Conceptos clave:**
- `class="hidden"` - Clase utility para ocultar elementos
- `id=""` - Identificador único para JavaScript
- `onclick=""` - Evento que llama a funciones JavaScript

### 2. CSS (style.css)

El CSS utiliza **variables** y **media queries** para adaptarse a diferentes pantallas:

```css
/* Variables CSS para facilitar cambios */
:root {
    --color-neon-blue: #00ffff;
    --color-neon-green: #00ff00;
    --spacing-md: clamp(15px, 3vw, 25px);
}

/* Media queries para responsive */
@media (max-width: 768px) {
    .options-grid {
        grid-template-columns: 1fr; /* Una columna en móvil */
    }
}

/* Animaciones */
@keyframes neonPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}
```
### 3. Clases JavaScript

Entidad.js - Clase Base
``` javascript
class Entidad {
    constructor(y, x, vx, vy) {
        this.y = y;  // Posición Y
        this.x = x;  // Posición X
        this.vy = vy; // Velocidad Y
        this.vx = vx; // Velocidad X
    }
    
    distanciaCon(ent) {
        // Fórmula de distancia euclidiana
        return Math.sqrt(Math.pow(this.x - ent.x, 2) + Math.pow(this.y - ent.y, 2));
    }
    
    mover(ancho, alto, arrayEntidades) {
        // Movimiento aleatorio en 8 direcciones
        const direcciones = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
        // ... lógica de movimiento
    }
}
```

Personajes.js
```javascript

```

Buenos.js
```javascript
class Buenos extends Personajes {
    static nBuenos = 0;
    
    constructor(y, x) {
        super(y, x, 1, 1);
        this.malos = null; // Referencia al malo más cercano
        Buenos.nBuenos++;
    }
    
    mover(ancho, alto, arrayEntidades) {
        if (this.malos && this.estaCercaDe(this.malos, 10)) {
            // Persigue al malo
            if (this.x < this.malos.x) this.setVx(-1);
            // ... lógica de persecución
        } else {
            super.mover(ancho, alto, arrayEntidades); // Movimiento aleatorio
        }
    }
}
```

Malos.js
```javascript
class Malos extends Personajes {
    static nMalos = 0;
    
    constructor(y, x) {
        super(y, x, 1, 1);
        this.bueno = null; // Referencia al bueno más cercano
        Malos.nMalos++;
    }
    
    mover(ancho, alto, arrayEntidades) {
        // Lógica similar a Buenos pero con direcciones invertidas
    }
}
```

Obstaculos.js
```javascript
class Obstaculos extends Entidad {
    constructor(y, x) {
        super(y, x, 0, 0); // No se mueve
    }
    
    toString() { return '#'; }
}
```

### 4. Funciones Utilitarias (Funciones.js)
```javascript
const Funciones = {
    numPorcent(altura, anchura) {
        // Calcula número aleatorio basado en área
        return Math.floor(Math.random() * (altura * anchura * 0.005)) + 1;
    },
    
    generador(altura, anchura, arrayEntidades, arrayPersonajes, nPersonajes, porBuenos, opcion) {
        // Genera obstáculos primero
        this.generadorEntidades(altura, anchura, arrayEntidades, 0.01);
        // Luego personajes según opción
        // ...
    },
    
    pintarTablero(altura, anchura, arrayEntidades) {
        // Construye el HTML del tablero
        let sb = '╔' + '═'.repeat(anchura) + '╗\n';
        // ...
        return '<div class="board-content">' + sb + '</div>';
    },
    
    eliminarPersonaje(nPersonajes, arrayPersonajes, arrayEntidades, entidad, x, y) {
        // Elimina un personaje y actualiza contadores
        for (let i = 0; i < nPersonajes; i++) {
            if (arrayPersonajes[i] === entidad) {
                arrayPersonajes[i] = null;
                arrayEntidades[y][x] = null;
                // Actualizar contadores estáticos
                Personajes.setnPersonajes(Personajes.getnPersonajes() - 1);
                // ...
            }
        }
    }
};
```

### 5. Control Principal (survivors.js)
```javascript
// Variables globales
let intervaloSimulacion = null;
let opcionSeleccionada = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    calcularDimensionesRecomendadas();
    // Configurar event listeners
});

function iniciarSimulacion() {
    // Resetear contadores
    Personajes.setnPersonajes(0);
    Buenos.setnBuenos(0);
    Malos.setnMalos(0);
    
    // Crear arrays y generar mundo
    arrayEntidades = Array(altura).fill().map(() => Array(anchura).fill(null));
    
    // Iniciar bucle
    intervaloSimulacion = setInterval(() => actualizarJuego(), velocidadActual);
}

function actualizarJuego() {
    // 1. Actualizar referencias de enemigos
    // 2. Mover personajes
    // 3. Procesar combates
    // 4. Actualizar visualización
    // 5. Verificar fin del juego
}
```

## 🔄 FLUJO DEL JUEGO
```text
1. INICIO
   ↓
2. CONFIGURACIÓN (usuario elige opciones)
   ↓
3. GENERACIÓN DEL MUNDO
   ├── Obstáculos aleatorios
   └── Personajes según opción
   ↓
4. BUCLE PRINCIPAL (cada 150ms)
   ├── Asignar enemigos cercanos
   ├── Mover personajes
   ├── Detectar colisiones
   ├── Resolver combates
   └── Actualizar pantalla
   ↓
5. FIN DEL JUEGO
   ├── Victoria de Buenos
   └── Victoria de Malos
```

## ⚙️ OPCIONES DE CONFIGURACIÓN

|         Opción          |             Descripción                  |                      Cuándo usarla                    |
|-------------------------|------------------------------------------|-------------------------------------------------------|
| 1. Mitad Buenos y Malos | Tú eliges el número total (debe ser par) | Para controlar exactamente cuántos personajes quieres |
| 2. Totalmente Aleatorio | Número y distribución aleatorios         | Para partidas rápidas e impredecibles                 |
| 3. Mitad Aleatoria      | Número aleatorio pero par                | Para sorpresa pero con equilibrio                     |

## 🎨 PERSONALIZACIÓN

### Cambiar colores
En `style.css`, modifica las variables CSS:
```css
:root {
    --color-neon-blue: #00ffff;  /* Cambia este valor */
    --color-neon-green: #00ff00; /* Color de Buenos */
    --color-neon-red: #ff0000;   /* Color de Malos */
}
```

### Cambiar velocidad

Modifica `velocidadActual` en `survivors.js` (valor en milisegundos):

```javascript
let velocidadActual = 150; // Menor = más rápido
```

### Cambiar tamaño del tablero

Ajusta los límites en `calcularDimensionesRecomendadas()`:

```javascript
maxColumns = Math.min(Math.max(maxColumns, 20), 80); // Mínimo 20, máximo 80
maxRows = Math.min(Math.max(maxRows, 10), 40);       // Mínimo 10, máximo 40
```

### Añadir nuevos tipos de personajes

1. Crea una nueva clase que herede de `Personajes`

2. Implementa su lógica de movimiento específica

3. Añade su representación en `toString()`

4. Actualiza `Funciones.pintarTablero()` para mostrar el nuevo tipo

5. Añade un contador estático similar a `nBuenos`

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

| Problema | Posible solución |
|----------|------------------|
| El tablero no se ve | Verifica que `tableroContainer` existe en el HTML |
| Los contadores no se actualizan | Asegúrate de llamar a `actualizarContadoresVisuales()` |
| Los personajes no se mueven | Comprueba que `mover()` está siendo llamado en el bucle |
| El juego no termina | Verifica la condición en `if (Buenos.getnBuenos() <= 0...)` |
| Error "Obstaculos is not defined" | Ajusta el orden de los scripts en el HTML |
| El CSS no se aplica | Limpia caché del navegador (Ctrl+F5) |

## 📝 NOTAS PARA DESARROLLADORES

Conceptos importantes a recordar:

1. `static` - Variables/métodos pertenecen a la clase, no a las instancias

2. `super() `- Llama al constructor de la clase padre

3. `instanceof` - Verifica si un objeto es instancia de una clase

4. `setInterval` - Ejecuta una función cada X milisegundos

5. `classList` - Añade/elimina clases CSS (add(), remove(), toggle())

6. `addEventListener` - Escucha eventos del usuario

7. `Math.random()` - Genera número aleatorio entre 0 y 0.999...

Para modificar el comportamiento del combate:<br>
Busca en `actualizarJuego()` la sección donde se calcula resultado. La fórmula actual es:

```javascript
const resultado = Math.floor(Math.random() * (entidad.getVida() + defensor.getVida()));
if (resultado < entidad.getVida()) { /* Gana atacante */ }
```

Para cambiar la distancia de detección:
Modifica el segundo parámetro en `estaCercaDe()` (actualmente 10).

