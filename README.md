# [⚔️ SURVIVORS - Batalla Épica](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)

Juego de simulación donde personajes Buenos y Malos luchan en un tablero con obstáculos. Los personajes se mueven, persiguen a sus enemigos y combaten hasta que solo queda un bando.

![Versión](https://img.shields.io/badge/Versión-2.6.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-success)
![Sonidos](https://img.shields.io/badge/Sonidos-Integrados-orange)

---

## 📑 ÍNDICE

- [🎮 DESCRIPCIÓN DEL JUEGO](#-descripción-del-juego)
- [✨ NOVEDADES EN VERSIÓN 2.6.0](#-novedades-en-versión-260)
- [📁 ESTRUCTURA DE ARCHIVOS](#-estructura-de-archivos)
- [🚀 CÓMO EJECUTAR](#-cómo-ejecutar)
- [🎯 CARACTERÍSTICAS PRINCIPALES](#-características-principales)
- [🎮 CONTROLES DEL JUEGO](#-controles-del-juego)
- [⚔️ SISTEMA DE CLASES](#-sistema-de-clases)
- [🎮 MODOS DE JUEGO](#-modos-de-juego)
- [📊 PANEL DE ESTADÍSTICAS](#-panel-de-estadísticas)
- [📋 BITÁCORA DE COMBATE](#-bitácora-de-combate)
- [🏆 SISTEMA DE RANKING](#-sistema-de-ranking)
- [🔊 SISTEMA DE SONIDOS](#-sistema-de-sonidos)
- [🛠️ PERSONALIZACIÓN](#️-personalización)
- [🐛 SOLUCIÓN DE PROBLEMAS](#-solución-de-problemas)
- [📝 NOTAS PARA DESARROLLADORES](#-notas-para-desarrolladores)
- [🚀 HOJA DE RUTA](#-hoja-de-ruta)
- [📄 LICENCIA](#-licencia)

---

## 🎮 DESCRIPCIÓN DEL JUEGO

**Survivors** es una simulación de batalla entre dos bandos con sistema de clases y combate por turnos:

- **Buenos** - Representados en color amarillo 🟡
- **Malos** - Representados en color rojo 🔴
- **Obstáculos (█)** - Elementos estáticos que bloquean el paso
- **7 clases únicas** - Cada una con estadísticas y habilidades especiales
- **4 modos de juego** - Diferentes formas de jugar y estrategias
- **Sistema de sonidos** - Experiencia arcade completa 🔊

Los personajes se mueven en 8 direcciones, persiguen a sus enemigos naturales y combaten automáticamente hasta que solo queda un bando.

---

## ✨ NOVEDADES EN VERSIÓN 2.6.0

### 🔊 Sistema de Sonidos Completo
- ✅ **Sonido al insertar moneda** - Feedback inmediato 🪙
- ✅ **Fanfarria de victoria** - Celebración al ganar una partida 🎉
- ✅ **Música de fondo ambiental** - Inmersión total durante el juego 🎵
- ✅ **Pausa/Reanudación de música** - Al pausar el juego, la música también se pausa
- ✅ **Detección automática** - Si faltan archivos de sonido, el juego continúa sin errores

### 🎯 Mejoras en Game Over de SURVIVOR
- ✅ **Panel de Game Over mejorado** con diseño arcade
- ✅ **Botón "VER RANKING"** siempre visible (sin opción de guardar)
- ✅ **Botón "GUARDAR PUNTUACIÓN"** visible solo si se superó al menos 1 ronda
- ✅ **Los puntos se muestran** directamente en el botón de guardar

### 🚀 Mejoras Técnicas
- ✅ **Sistema de sonidos robusto** con manejo de errores
- ✅ **Volumen configurable** para cada tipo de sonido
- ✅ **Música en loop** para ambiente continuo
- ✅ **Sin saturación de sonidos** - Optimizado para múltiples eventos

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
survivors-js/
│
├── 📄 index.html                          # Interfaz de usuario
├── 📄 survivors.js                        # Control principal (v2.6.0)
├── 📁 css/
│   ├── 📄 style.css                        # Estilos principales
├── 📁 assets/
│   ├── 📁 images/
│   │   └── 📄 favicon.svg                    # Icono de la pestaña
│   └── 📁 sounds/                             # NUEVO - Sonidos del juego
│       ├── 📄 coin.mp3                         # Sonido al insertar moneda
│       ├── 📄 victory.mp3                      # Fanfarria de victoria
│       └── 📄 bgm.mp3                          # Música de fondo
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
2. **Asegúrate de tener los archivos de sonido** en `assets/sounds/` (opcional - el juego funciona sin ellos)
3. **Abre `index.html`** en cualquier navegador moderno (Chrome, Firefox, Edge, Safari)
4. **Inserta una moneda** 🪙 (haciendo clic en INSERT o presionando ESPACIO)
5. **Selecciona un modo de juego** y configura los parámetros
6. **Haz clic en COMENZAR** o presiona ENTER
7. **¡Disfruta la batalla con sonidos!** ⚔️🔊

### Online
👉 **[JUGAR AHORA - SURVIVORS ONLINE](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)**

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

| Característica | Descripción |
|----------------|-------------|
| **Interfaz Arcade** | Diseño de máquina recreativa con luces, efectos y paneles laterales |
| **Sistema de Monedas** | Necesitas monedas para jugar (como en los arcades clásicos) |
| **4 Modos de Juego** | Diferentes formas de jugar: 1, 2, 3 y SURVIVOR |
| **7 Clases Únicas** | Cada clase tiene estadísticas y habilidades diferentes |
| **Tooltips Informativos** | Info detallada al pasar el ratón sobre clases y personajes |
| **Bitácora de Eventos** | Registro de todos los combates con filtros por tipo |
| **Ranking Local** | Top 10 puntuaciones guardadas en localStorage |
| **2 Temas Visuales** | Pac-Man (amarillo/azul) y Clásico (verde/negro) |
| **Controles Teclado** | Atajos para todas las acciones del juego |
| **Barras de Vida** | Información detallada en tooltips con barra de progreso |
| **Estadísticas Tiempo Real** | Total, Buenos, Malos, victorias, combates, daño |
| **Control de Velocidad** | Ajusta la velocidad de la simulación en tiempo real |
| **Persistencia Local** | Las victorias y rankings se guardan entre sesiones |
| **Sistema de Sonidos** | Efectos de moneda, victoria y música ambiental |
| **Sin Redundancias** | Código optimizado sin elementos duplicados |
| **Responsive Design** | Se adapta perfectamente a móviles, tablets y desktop |

---

## 🎮 CONTROLES DEL JUEGO

### Botones en pantalla
| Botón | Función |
|-------|---------|
| **INSERT** | Insertar moneda (con sonido) |
| **PLAY** | Usar moneda y jugar |
| **PAUSA** | Pausar simulación (pausa la música) |
| **CONTINUAR** | Reanudar simulación (reanuda la música) |
| **SALIR** | Volver al menú principal (detiene la música) |
| **⚔️ - / +** | Cambiar velocidad de simulación |
| **↺** | Reiniciar contadores de victorias |
| **🏆 VER RANKING** | Mostrar ranking (solo visualización) |

### Controles de teclado
| Tecla | Función |
|-------|---------|
| **ESPACIO** | Insertar moneda (con sonido) |
| **ENTER** | Jugar / Reintentar |
| **P** | Pausar juego (pausa la música) |
| **C** | Continuar juego (reanuda la música) |
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
| Clase | Icono | Vida | Daño | Habilidad |
|-------|-------|------|------|-----------|
| **Soldado** | `B` | 100 | 15% | - |
| **Curandero** | `C` | 120 | 5% | Cura 10% a aliados cercanos |
| **Paladín** | `P` | 150 | 10% | Reduce el daño recibido 50% |
| **Mago** | `W` | 80 | 20% | Daño mágico (sin resistencia) |

### Clases de Malos
| Clase | Icono | Vida | Daño | Habilidad |
|-------|-------|------|------|-----------|
| **Soldado** | `M` | 100 | 15% | - |
| **Asesino** | `A` | 70 | 30% | 15% de probabilidad de crítico (x2 daño) |
| **Tanque** | `T` | 200 | 10% | Alta resistencia |
| **Brujo** | `U` | 90 | 25% | Roba 10% de la vida infligida |

---

## 🎮 MODOS DE JUEGO

| Modo | Nombre | Descripción | Características |
|------|--------|-------------|-----------------|
| **1** | Mitad y mitad | Número configurable de personajes | Requiere número par ≥2, mitad buenos y mitad malos |
| **2** | Totalmente aleatorio | Número y distribución aleatoria | Número aleatorio entre 5 y 2% del tablero |
| **3** | Mitad aleatoria | Número aleatorio pero equilibrado | Número par aleatorio, mitad buenos y mitad malos |
| **⚔️ SURVIVOR** | Supervivencia | Compra personajes y sobrevive oleadas | Monedas iniciales: 125, tienda con 4 clases |

### Modo SURVIVOR
- **Monedas iniciales**: 125💰
- **Tienda**: Soldado (20💰), Curandero (25💰), Paladín (30💰), Mago (35💰)
- **Oleadas**: Los malos aumentan cada ronda
- **Recompensas**: +10-25💰 por eliminar malos según su clase
- **Puntuación**: Se guarda en el ranking al finalizar (solo si hay al menos 1 ronda)
- **Game Over**: Panel especial con opciones de ranking

---

## 📊 PANEL DE ESTADÍSTICAS

El panel lateral derecho muestra información en tiempo real, **sin redundancias**:

### HIGH SCORE (Panel Único)
- **TOTAL** - Número total de personajes vivos
- **😇 BUENOS** - Contador de Buenos (mismo ID que en tarjetas)
- **😈 MALOS** - Contador de Malos (mismo ID que en tarjetas)

### Tarjetas de Jugadores (Usan los mismos IDs)
- **1UP** - Buenos con icono y contador (usa `buenosStats`)
- **2UP** - Malos con icono y contador (usa `malosStats`)
- **🏆** - Victorias acumuladas (persisten entre sesiones)

### CLASES (Con tooltips interactivos)
- **C Curandero** - Información detallada al pasar el ratón
- **P Paladín** - Tooltip con estadísticas y habilidades
- **W Mago** - Color específico por clase (púrpura)
- **A Asesino** - Tooltip minimalista con daño crítico
- **T Tanque** - Borde de color naranja
- **U Brujo** - Flecha indicadora y color rosa

### COMBATES (Cuadrícula)
- **Total** - Número de combates realizados
- **Daño** - Daño total infligido
- **Muertes** - Personajes eliminados
- **Vivos** - Supervivientes actuales

### TIEMPO
- ⏱️ **00:00** - Tiempo de partida actual (se actualiza cada segundo)

### BOTÓN DE RANKING
- 🏆 **VER RANKING** - Muestra el top 10 de puntuaciones (solo visualización)

---

## 📋 BITÁCORA DE COMBATE

El panel lateral izquierdo incluye una bitácora con registro de eventos:

### Tipos de eventos
- 🟡 **Sistema** - Inicio/pausa, inserción de monedas, configuración
- 🔴 **Combate** - Ataques, daño infligido, habilidades especiales
- 🔵 **Información** - Modos de juego seleccionados, opciones
- 🟢 **Victoria** - Resultados de partidas y fin de juego

### Controles de la bitácora
- **🗑️** - Limpiar todos los registros
- **Puntos de color** - Filtrar por tipo de evento
- **Scroll automático** - Siempre muestra el último evento registrado

---

## 🏆 SISTEMA DE RANKING

### Características
- **Almacenamiento**: localStorage del navegador
- **Top 10**: Solo se guardan las 10 mejores puntuaciones
- **Colores especiales**:
  - 🥇 **#1 Oro** - Fondo dorado
  - 🥈 **#2 Plata** - Fondo plateado
  - 🥉 **#3 Bronce** - Fondo bronce

### Acceso al ranking
- **Automático**: Al terminar una partida en modo SURVIVOR con ronda > 0 (con opción de guardar)
- **Manual**: Botón "VER RANKING" en la barra lateral derecha (solo visualización)
- **Game Over**: Botón "VER RANKING" siempre visible / "GUARDAR PUNTUACIÓN" si hay rondas

### Formato de puntuación
- **Nombre**: 8 caracteres máximo (mayúsculas)
- **Puntos**: Puntuación total de la partida
- **Fecha**: Se guarda automáticamente

---

## 🔊 SISTEMA DE SONIDOS

### Efectos implementados
| Sonido | Cuándo se reproduce | Archivo |
|--------|---------------------|---------|
| **Moneda** | Al insertar moneda (clic o ESPACIO) | `coin.mp3` |
| **Victoria** | Al terminar una partida (cualquier modo) | `victory.mp3` |
| **Música fondo** | Durante toda la partida (loop) | `bgm.mp3` |

### Comportamiento inteligente
- ✅ **La música se pausa** cuando el juego está en pausa
- ✅ **La música se reanuda** al continuar el juego
- ✅ **La música se detiene** al volver al menú principal
- ✅ **Tolerancia a fallos** - Si falta un archivo, el juego continúa sin errores
- ✅ **Volumen balanceado** - Configurado para no saturar

### Estructura de sonidos
```
assets/
└── sounds/
    ├── coin.mp3      # Sonido corto (0.2-0.5s)
    ├── victory.mp3   # Fanfarria (2-3s)
    └── bgm.mp3       # Música ambiental (loop)
```

---

## 🛠️ PERSONALIZACIÓN

### Configuración de Clases (survivors.js)
```javascript
const CLASES_CONFIG = {
    curandero: {
        nombre: 'CURANDERO',
        vida: 120,
        dano: 5,
        habilidad: 'Cura +10%'
    },
    // ... más clases
};
```

### Configuración de Sonidos
```javascript
// Ajustar volúmenes
this.coin.volume = 0.5;      // 50%
this.victory.volume = 0.7;    // 70%
this.bgm.volume = 0.3;        // 30%
```

### Añadir Nueva Clase
1. Crear archivo en `Entidades/ClasesBuenas/` o `ClasesMalas/`
2. Definir clase con herencia correcta
3. Añadir configuración a `CLASES_CONFIG`
4. Actualizar `generarPersonajeConClase()` en survivors.js
5. Añadir tooltip en el HTML correspondiente

---

## 🐛 SOLUCIÓN DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| **Tablero no se ve al iniciar** | Espera 1 segundo, hay múltiples actualizaciones automáticas (10ms, 50ms, 150ms) |
| **Personajes no se mueven** | Verifica que hay enemigos cerca (distancia de detección) |
| **Tooltips no aparecen** | Comprueba que los atributos `data-class` y `data-tooltip` están correctos |
| **Botón START deshabilitado** | Selecciona un modo de juego primero (modo 1 requiere número par) |
| **Error de dimensiones** | El sistema usa valores por defecto (12x16) después de 20 intentos |
| **Clases no se muestran** | Verifica el orden de carga de scripts en el HTML |
| **Monedas no se actualizan** | Revisa los IDs en el HTML: `coinCount`, `gameCoinCount`, `panelCoinCount` |
| **Ranking no aparece** | Asegura que localStorage está habilitado en el navegador |
| **No se escuchan sonidos** | Verifica que los archivos están en `assets/sounds/` (el juego funciona igual) |
| **Las victorias suman de más** | Verifica que no haya game over duplicado (usar flag `gameOverProcesado`) |
| **Datos duplicados en panel** | Actualiza a v2.6.0 que elimina todas las redundancias |

---

## 📝 NOTAS PARA DESARROLLADORES

### Estructura de Clases
```
Entidad
├── Personajes
│   ├── Buenos
│   │   ├── Curandero (C)
│   │   ├── Paladin (P)
│   │   └── Mago (W)
│   └── Malos
│       ├── Asesino (A)
│       ├── Tanque (T)
│       └── Brujo (U)
└── Obstaculos (█)
```

### IDs Importantes (v2.6.0)
```html
<!-- Monedas -->
<span id="coinCount">0</span>
<span id="gameCoinCount">0</span>
<span id="panelCoinCount">0</span>

<!-- Estadísticas (SIN REDUNDANCIAS) -->
<span id="totalStats">0</span>
<span id="buenosStats">0</span>  <!-- Usado en contadores y tarjetas -->
<span id="malosStats">0</span>   <!-- Usado en contadores y tarjetas -->

<!-- Clases -->
<span id="curanderoCount">0</span>
<span id="paladinCount">0</span>
<span id="magoCount">0</span>
```

### Funciones Clave
```javascript
iniciarSimulacion()      // Inicia la batalla con música de fondo
combatirConClases()      // Lógica de combate entre clases
actualizarTooltipsClases() // Actualiza tooltips dinámicamente
recalcularDimensiones()  // Calcula dimensiones del tablero
redimensionarTablero()   // Ajusta el tamaño de las celdas
actualizarContadoresVisuales() // Actualiza estadísticas (sin redundancias)
mostrarRankingSoloVer()  // Muestra ranking sin opción de guardar
sonidos.playCoin()       // Reproduce sonido de moneda
sonidos.playVictory()    // Reproduce fanfarria de victoria
```

### Variables Importantes
```javascript
simulacionPausada        // true/false - Estado de pausa
modoSurvivorActivo       // true/false - Modo survivor activo
monedasSurvivor = 125    // Monedas iniciales en modo SURVIVOR
rondasSuperadas          // Número de rondas completadas en survivor
puntosTotales            // Puntuación acumulada en survivor
```

---

## 🚀 HOJA DE RUTA

### ✅ Completado en v2.6.0
- [x] **Sistema de sonidos completo** - Moneda, victoria y música ambiental
- [x] **Control de música** - Pausa/reanudación al pausar el juego
- [x] **Game Over mejorado** - Botones de ranking según contexto
- [x] **Guardado inteligente** - Solo guarda puntuación si hay al menos 1 ronda
- [x] **Visualización siempre disponible** - Botón VER RANKING en Game Over
- [x] **Tolerancia a fallos** - El juego funciona sin archivos de sonido

### ✅ Completado en v2.5.7
- [x] Implementación del Game Over en modo SURVIVOR con panel
- [x] Guardado de puntuación en ranking solo si se superó al menos una ronda
- [x] Botón de ranking visible siempre pero solo funcional según contexto

### ✅ Completado en v2.5.6
- [x] Eliminadas todas las redundancias del panel HIGH SCORE
- [x] Unificados los IDs de estadísticas (buenosStats y malosStats)
- [x] Código más limpio y eficiente sin elementos duplicados
- [x] Panel más compacto con mejor organización visual

### ✅ Completado en v2.5.1
- [x] Panel de estadísticas compacto y rediseñado
- [x] Tooltips minimalistas por clase con colores identificativos
- [x] Sistema de espera de dimensiones (hasta 20 intentos)
- [x] Carga inicial corregida con múltiples reintentos
- [x] Sistema de ranking local con top 10
- [x] Modos 1, 2, 3 y SURVIVOR completamente funcionales

---

## 📄 LICENCIA

MIT © 2026 - Libre uso, modificación y distribución

---

## 👏 CRÉDITOS

- **Desarrollador principal**: TheYinYan
- **Inspiración**: Juegos arcade clásicos de los 80 y 90
- **Tecnologías utilizadas**: HTML5, CSS3, JavaScript ES6+
- **Sonidos**: Pixabay, Freesound (licencias libres)
- **Almacenamiento**: localStorage para persistencia de datos
- **Diseño**: Inspirado en máquinas recreativas retro

---

## 🤝 CONTRIBUIR

¿Quieres contribuir al proyecto? ¡Genial! Puedes:

1. Hacer un fork del repositorio
2. Crear una rama para tu función (`git checkout -b feature/AmazingFeature`)
3. Commitear tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

¡Gracias por jugar a SURVIVORS! ⚔️✨🔊

**[🎮 JUGAR AHORA](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)** | **[🐛 Reportar Bug](https://github.com/TheYinYan/Trabajo_VideoJuego_JS/issues)** | **[⭐ Star en GitHub](https://github.com/TheYinYan/Trabajo_VideoJuego_JS)**

---

*Última actualización: Marzo 2026 - Versión 2.6.0*

## Principales novedades en v2.6.0:

### 🔊 Sistema de Sonidos
- **Sonido al insertar moneda** - Feedback inmediato
- **Fanfarria de victoria** - Celebración épica
- **Música ambiental** - Inmersión total
- **Pausa musical** - La música se detiene al pausar el juego

### 🎮 Game Over Mejorado
- **Botón VER RANKING** - Siempre visible para consultar puntuaciones
- **Botón GUARDAR PUNTUACIÓN** - Aparece solo si superaste al menos 1 ronda
- **Puntos visibles** - Se muestran directamente en el botón

### 🚀 Experiencia Arcade Completa
- **Sonidos sin saturación** - Optimizados para no molestar
- **Tolerante a errores** - Si faltan sonidos, el juego sigue funcionando
- **Inmersión total** - La música y efectos crean ambiente de arcade auténtico