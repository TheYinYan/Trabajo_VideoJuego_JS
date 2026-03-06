## 📄 **README.md (ACTUALIZADO - VERSIÓN 2.4.1)**

# [⚔️ SURVIVORS - Batalla Épica](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)

Juego de simulación donde personajes Buenos (B) y Malos (M) luchan en un tablero con obstáculos (#). Los personajes se mueven, persiguen a sus enemigos y combaten hasta que solo queda un bando.

![Versión](https://img.shields.io/badge/Versión-2.4.2-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-success)

---

## 📑 ÍNDICE

- [🎮 DESCRIPCIÓN DEL JUEGO](#-descripción-del-juego)
- [✨ NOVEDADES EN VERSIÓN 2.4.1](#-novedades-en-versión-241)
- [📁 ESTRUCTURA DE ARCHIVOS](#-estructura-de-archivos)
- [🚀 CÓMO EJECUTAR](#-cómo-ejecutar)
  - [Desde Local](#desde-local)
  - [Desde la WEB (Sin descargar nada)](#desde-la-web-sin-descargar-nada)
- [🎯 CARACTERÍSTICAS PRINCIPALES](#-características-principales)
- [🎮 CONTROLES DEL JUEGO](#-controles-del-juego)
  - [Botones en pantalla](#botones-en-pantalla)
  - [Controles de teclado](#controles-de-teclado)
- [📚 EXPLICACIÓN DEL CÓDIGO](#-explicación-del-código)
  - [1. HTML (index.html)](#1-html-indexhtml)
  - [2. CSS (style.css)](#2-css-stylecss)
  - [3. Clases JavaScript](#3-clases-javascript)
  - [4. Funciones Utilitarias (Funciones.js)](#4-funciones-utilitarias-funcionesjs)
  - [5. Control Principal (survivors.js)](#5-control-principal-survivorsjs)
- [🔄 FLUJO DEL JUEGO](#-flujo-del-juego)
- [⚙️ OPCIONES DE CONFIGURACIÓN](#-opciones-de-configuración)
- [🏆 SISTEMA DE VICTORIAS](#-sistema-de-victorias)
- [📋 BITÁCORA DE COMBATE](#-bitácora-de-combate)
- [🎨 TEMAS DISPONIBLES](#-temas-disponibles)
- [🚀 HOJA DE RUTA - FUTURAS EXPANSIONES](#-hoja-de-ruta---futuras-expansiones)
- [🎨 PERSONALIZACIÓN](#-personalización)
- [🐛 SOLUCIÓN DE PROBLEMAS COMUNES](#-solución-de-problemas-comunes)
- [📝 NOTAS PARA DESARROLLADORES](#-notas-para-desarrolladores)
- [📄 LICENCIA](#-licencia)

---

## 🎮 DESCRIPCIÓN DEL JUEGO

**Survivors** es una simulación de batalla entre dos bandos con sistema de clases y combate por turnos:

- **Buenos (B)** - Representados en color amarillo 🟡 (o verde en tema clásico)
- **Malos (M)** - Representados en color rojo 🔴
- **Obstáculos (#)** - Elementos estáticos que bloquean el paso
- **Clases especiales** - Cada personaje puede tener habilidades únicas

Los personajes se mueven, persiguen a sus enemigos y combaten hasta que solo queda un bando. El combate se resuelve mediante un sistema de porcentajes de daño basado en la clase de cada personaje.

---

## ✨ NOVEDADES EN VERSIÓN 2.4.1

- ✅ **Sistema de clases** - 7 clases diferentes con habilidades únicas
- ✅ **Bitácora de combate** - Panel lateral con registro de eventos
- ✅ **Dos temas visuales** - Pac-Man (amarillo/azul) y Clásico (verde/negro)
- ✅ **Controles de teclado** - Juega sin usar el ratón
- ✅ **Animaciones de movimiento** - Desplazamiento suave entre celdas
- ✅ **Barras de vida** - Información detallada al pasar el ratón
- ✅ **Panel de control responsive** - Se adapta a cualquier pantalla
- ✅ **Múltiples contadores de monedas** - Sincronizados en toda la interfaz
- ✅ **Sistema de pausa/continuar** - Control total de la simulación
- ✅ **Almacenamiento local** - Las victorias persisten entre sesiones

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
survivors-js/
│
├── 📄 index.html                          # Interfaz de usuario
├── 📄 survivors.js                        # Control principal
├── 📁 css/
│   ├── 📄 style.css                        # Estilos principales
│   ├── 📄 style-pacman.css                  # Tema Pac-Man
│   └── 📄 style-classic.css                 # Tema Clásico
├── 📁 assets/
│   └── 📁 images/
│       └── 📄 favicon.svg                    # Icono de la pestaña
├── 📁 Entidades/                            # Clases del juego
│   ├── 📄 Entidad.js                          # Clase base
│   ├── 📄 Personajes.js                       # Clase para personajes
│   ├── 📄 Buenos.js                           # Buenos (hereda de Personajes)
│   ├── 📄 Malos.js                            # Malos (hereda de Personajes)
│   ├── 📄 Obstaculos.js                       # Obstáculos (hereda de Entidad)
│   ├── 📁 ClasesBuenas/                       # Subclases de Buenos
│   │   ├── 📄 Curandero.js
│   │   ├── 📄 Paladin.js
│   │   └── 📄 Mago.js
│   ├── 📁 ClasesMalas/                        # Subclases de Malos
│   │   ├── 📄 Asesino.js
│   │   ├── 📄 Tanque.js
│   │   └── 📄 Brujo.js
│   └── 📁 ListFunciones/
│       └── 📄 Funciones.js                    # Utilidades del juego
```

---

## 🚀 CÓMO EJECUTAR

### Desde Local

1. **Descarga todos los archivos** manteniendo la estructura de carpetas
2. **Abre el archivo `index.html`** en cualquier navegador moderno
3. **Inserta una moneda** 🪙 haciendo clic en el botón o presionando ESPACIO
4. **Selecciona un modo de juego** y configura los personajes
5. **Haz clic en "COMENZAR BATALLA"** o presiona ENTER
6. **Observa la batalla** en tiempo real

### Desde la WEB (Sin descargar nada)

Puedes jugar directamente desde GitHub Pages:

👉 **[JUGAR AHORA - SURVIVORS ONLINE](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)**

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

- ✅ **Interfaz responsive** - Se adapta a móviles, tablets y desktop
- ✅ **Sistema de monedas** - Necesitas monedas para jugar
- ✅ **7 clases diferentes** - Cada una con estadísticas y habilidades únicas
- ✅ **Bitácora de eventos** - Registro de todos los combates
- ✅ **Dos temas visuales** - Cambia entre Pac-Man y Clásico
- ✅ **Controles por teclado** - Atajos para todas las acciones
- ✅ **Barras de vida** - Información detallada al pasar el ratón
- ✅ **Animaciones suaves** - Movimiento fluido de personajes
- ✅ **Estadísticas en tiempo real** - Total, Buenos, Malos y victorias
- ✅ **Control de velocidad** - Ajusta la velocidad de la simulación

---

## 🎮 CONTROLES DEL JUEGO

### Botones en pantalla

| Botón | Función | Descripción |
|-------|---------|-------------|
| **INSERT** | `insertCoin()` | Inserta una moneda (también con ESPACIO) |
| **PLAY** | `useCoin()` | Usa una moneda y comienza la partida |
| **PAUSA** | `detenerSimulacion()` | Pausa la simulación actual |
| **CONTINUAR** | `continuarSimulacion()` | Reanuda la simulación pausada |
| **SALIR** | `volverAlMenu()` | Vuelve al menú principal |
| **⚡ - / ⚡ +** | `ajustarVelocidad()` | Cambia la velocidad de la simulación |
| **↺ (victorias)** | `reiniciarVictorias()` | Resetea los contadores de victorias |
| **Temas** | `cambiarTema()` | Cambia entre Pac-Man y Clásico |

### Controles de teclado

| Tecla | Función |
|-------|---------|
| **ESPACIO** | Insertar moneda |
| **ENTER** | Jugar / Reintentar |
| **P** | Pausar juego |
| **C** | Continuar juego |
| **R** | Reiniciar (volver al menú) |
| **ESC** | Volver al menú principal |
| **+ / -** | Aumentar/Disminuir velocidad |
| **0** | Velocidad normal (200ms) |
| **1** | Velocidad lenta (300ms) |
| **2** | Velocidad rápida (120ms) |
| **L** | Limpiar bitácora |
| **F1** | Mostrar ayuda en consola |

---

## ⚔️ SISTEMA DE CLASES

### Clases de Buenos

| Clase | Icono | Daño | Vida | Habilidad |
|-------|-------|------|------|-----------|
| **Soldado** | B | 15% | 100 | - |
| **Curandero** | C | 5% | 120 | Cura 10% a aliados cercanos |
| **Paladín** | P | 10% | 150 | Reduce el daño recibido 50% |
| **Mago** | W | 20% | 80 | Daño mágico (sin resistencia) |

### Clases de Malos

| Clase | Icono | Daño | Vida | Habilidad |
|-------|-------|------|------|-----------|
| **Soldado** | M | 15% | 100 | - |
| **Asesino** | A | 30% | 70 | 15% de probabilidad de crítico (x2) |
| **Tanque** | T | 10% | 200 | Contraataca con 10% de daño |
| **Brujo** | U | 25% | 90 | Roba 10% de la vida infligida |

---

## 📋 BITÁCORA DE COMBATE

El panel lateral izquierdo incluye una **bitácora** que registra todos los eventos importantes:

- ⚔️ Combates y daño infligido
- 💀 Muertes de personajes
- 🧙 Habilidades especiales (robo de vida, curaciones)
- 🏆 Victorias al final de la partida
- 🪙 Inserción y uso de monedas
- ⚡ Cambios de velocidad

Puedes filtrar los mensajes por tipo usando los puntos de colores:
- 🟡 **Sistema** - Eventos del juego
- 🔴 **Combate** - Batallas y daño
- 🔵 **Información** - Mensajes generales
- 🟢 **Victoria** - Resultados de partidas

---

## 🎨 TEMAS DISPONIBLES

### Tema Pac-Man 👻
- Colores principales: Amarillo (#ffff00) y Azul Pac-Man (#24408e)
- Ambiente arcade clásico de los 80
- Efectos de neón y brillos dorados

### Tema Clásico 🕹️
- Colores principales: Verde fosforito (#33ff33) y Negro
- Estilo terminal/matrix
- Efectos de brillo en verde

Puedes cambiar entre temas en cualquier momento desde el panel lateral izquierdo.

---

## 🚀 HOJA DE RUTA - FUTURAS EXPANSIONES

### Fase 1 - Mejoras Visuales (Corto plazo)
- [ ] **Logo del juego** - `assets/images/logo.png`
- [ ] **Iconos SVG** - `assets/icons/bueno.svg`, `assets/icons/malo.svg`
- [ ] **Fondos dinámicos** - `assets/images/backgrounds/`
- [ ] **Efectos de partículas** para combates

### Fase 2 - Efectos de Sonido (Medio plazo)
- [ ] `battle-start.mp3` - Sonido al comenzar
- [ ] `victory.mp3` - Fanfarria de victoria
- [ ] `combat.mp3` - Efecto de combate
- [ ] `coin.mp3` - Sonido al insertar moneda

### Fase 3 - Nuevas Funcionalidades (Largo plazo)
- [ ] **Más clases** - Añadir nuevas subclases
- [ ] **Modo torneo** - Series de batallas
- [ ] **Guardar partidas** - Exportar/importar configuraciones
- [ ] **Modo multijugador** - Dos jugadores locales

---

## 🎨 PERSONALIZACIÓN

### Cambiar colores del tema actual
En `css/style-pacman.css` o `css/style-classic.css`, modifica las variables:

```css
:root {
    --primary-color: #ffff00;  /* Color principal del tema */
    --secondary-color: #24408e; /* Color secundario */
    --panel-bg: linear-gradient(145deg, #0a1a3a, #0a1a2a);
}
```

### Añadir nuevas clases
1. Crea un nuevo archivo en `Entidades/ClasesBuenas/` o `Entidades/ClasesMalas/`
2. Implementa la clase heredando de `Buenos` o `Malos`
3. Define su método `calcularDaño()` y opcionalmente habilidades especiales
4. Actualiza `generarPersonajeConClase()` en `survivors.js`

---

## 🐛 SOLUCIÓN DE PROBLEMAS COMUNES

| Problema | Posible solución |
|----------|------------------|
| El tablero no se ve al iniciar | Espera un momento, hay múltiples actualizaciones automáticas |
| Los contadores de monedas no se actualizan | Verifica los IDs: `coinCount`, `gameCoinCount`, `panelCoinCount` |
| Los personajes no se mueven | Comprueba que hay enemigos cerca (distancia < 10) |
| No se puede insertar moneda | Usa el botón INSERT o la barra espaciadora |
| El botón START no se habilita | Selecciona un modo de juego primero |
| Error "X is not defined" | Verifica el orden de los scripts en el HTML |
| Las clases no funcionan | Asegúrate de que los archivos de clases se cargan después de las clases base |

---

## 📝 NOTAS PARA DESARROLLADORES

### Estructura de clases
```
Entidad (clase base)
├── Personajes
│   ├── Buenos
│   │   ├── Curandero
│   │   ├── Paladin
│   │   └── Mago
│   └── Malos
│       ├── Asesino
│       ├── Tanque
│       └── Brujo
└── Obstaculos
```

### IDs importantes en el HTML
| ID | Ubicación |
|-----|-----------|
| `coinCount` | Menú principal |
| `gameCoinCount` | Marquesina |
| `panelCoinCount` | Panel de control |
| `gameOverCoinCount` | Pantalla de Game Over |
| `logContainer` | Contenedor de la bitácora |

### Funciones clave
- `combatirConClases()` - Lógica de combate con clases
- `actualizarCoinDisplay()` - Actualiza todos los contadores de monedas
- `añadirLog()` - Añade entradas a la bitácora
- `cambiarTema()` - Cambia entre temas visuales

---

## 📄 LICENCIA

MIT © 2026 - Libre uso, modificación y distribución

---

¡Gracias por usar Survivors! ⚔️✨

**Juega ahora online:** [https://theyinyan.github.io/Trabajo_VideoJuego_JS/](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)

**¿Preguntas o sugerencias?** Abre un issue en el repositorio.

**Última actualización:** Febrero 2026
```

## ✅ **PRINCIPALES ACTUALIZACIONES**

| Sección | Novedades |
|---------|-----------|
| **Versión** | Actualizada a 2.4.1 |
| **Novedades** | Sistema de clases, bitácora, temas, controles teclado |
| **Controles** | Añadida tabla completa de teclado |
| **Sistema de clases** | Tabla con todas las clases y habilidades |
| **Bitácora** | Explicación del sistema de logs |
| **Temas** | Descripción de los dos temas disponibles |
| **Solución de problemas** | Nuevos casos específicos |
