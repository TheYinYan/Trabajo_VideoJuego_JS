# [⚔️ SURVIVORS - Batalla Épica](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)

Juego de simulación donde personajes Buenos y Malos luchan en un tablero con obstáculos. Los personajes se mueven, persiguen a sus enemigos y combaten hasta que solo queda un bando.

![Versión](https://img.shields.io/badge/Versión-2.5-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-success)

---

## 📑 ÍNDICE

- [🎮 DESCRIPCIÓN DEL JUEGO](#-descripción-del-juego)
- [✨ NOVEDADES EN VERSIÓN 2.4.4](#-novedades-en-versión-244)
- [📁 ESTRUCTURA DE ARCHIVOS](#-estructura-de-archivos)
- [🚀 CÓMO EJECUTAR](#-cómo-ejecutar)
- [🎯 CARACTERÍSTICAS PRINCIPALES](#-características-principales)
- [🎮 CONTROLES DEL JUEGO](#-controles-del-juego)
- [⚔️ SISTEMA DE CLASES](#-sistema-de-clases)
- [📊 PANEL DE ESTADÍSTICAS](#-panel-de-estadísticas)
- [📋 BITÁCORA DE COMBATE](#-bitácora-de-combate)
- [🎨 TEMAS DISPONIBLES](#-temas-disponibles)
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

Los personajes se mueven en 8 direcciones, persiguen a sus enemigos naturales y combaten automáticamente hasta que solo queda un bando.

---

## ✨ NOVEDADES EN VERSIÓN 2.5

###  Ideas

#### Por ahora se han implementado las siguientes mejoras: 
- Nuevo diseño del panel de estadísticas, más compacto y profesional
- Tooltips de clases minimalistas con información al pasar el ratón
- Indicadores de color por clase para fácil identificación
- Sistema de espera de dimensiones para evitar problemas de carga
- Múltiples reintentos para generar el tablero si falla la carga initial
- Código más modular y organizado para mejor mantenimiento
- Corrección de errores relacionados con la carga del tablero y las estadísticas
- Optimización de la lógica de combate y generación de personajes
- Mejoras en la interfaz de usuario para una experiencia más fluida
- Parece que esta duplicando los personajes. HAY 3 MALOS Y DICE QUE hay 6 y con los buenos pasa igual ya que vas poniendo uno y dice 2 y si pones otro dice 4. Creo que el problema esta en la función generarPersonajeConClase() ya que cada vez que se llama a esa función se incrementa el contador de personajes sin importar si realmente se ha generado un nuevo personaje o no. Deberías revisar esa función para asegurarte de que solo se incrementa el contador cuando realmente se ha generado un nuevo personaje y no cuando simplemente se ha intentado generar uno.

#### Próximas mejoras visuales y de funcionalidad:

- Actualización de la documentación y README para reflejar los cambios
- Preparación para futuras mejoras visuales y de funcionalidad

### 🎯 Mejoras Visuales
- ✅ **Panel de estadísticas rediseñado** - Más compacto y profesional
- ✅ **Tooltips de clases minimalistas** - Información al pasar el ratón
- ✅ **Indicadores de color por clase** - Cada clase tiene su propio color
- ✅ **Diseño responsive mejorado** - Mejor adaptación a móviles

### 🚀 Mejoras Técnicas
- ✅ **Carga inicial corregida** - El tablero se genera correctamente a la primera
- ✅ **Sistema de espera de dimensiones** - Espera a que el contenedor tenga tamaño real
- ✅ **Múltiples reintentos** - Si falla la carga, usa valores por defecto
- ✅ **Código más modular** - Funciones separadas para mejor mantenimiento

### ⚔️ Sistema de Clases
- ✅ **Curandero (C)** - Vida: 120, Daño: 5%, Habilidad: Cura +10%
- ✅ **Paladín (P)** - Vida: 150, Daño: 10%, Habilidad: -50% daño recibido
- ✅ **Mago (W)** - Vida: 80, Daño: 20%, Habilidad: Daño mágico
- ✅ **Asesino (A)** - Vida: 70, Daño: 30%, Habilidad: 15% crítico x2
- ✅ **Tanque (T)** - Vida: 200, Daño: 10%, Habilidad: Alta resistencia
- ✅ **Brujo (U)** - Vida: 90, Daño: 25%, Habilidad: Roba 10% vida

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
survivors-js/
│
├── 📄 index.html                          # Interfaz de usuario
├── 📄 survivors.js                        # Control principal (ACTUALIZADO v2.4.4)
├── 📁 css/
│   ├── 📄 style.css                        # Estilos principales (ACTUALIZADO)
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
2. **Abre `index.html`** en cualquier navegador moderno
3. **Inserta una moneda** 🪙 (clic o ESPACIO)
4. **Selecciona modo de juego** y configura
5. **¡Disfruta la batalla!** ⚔️

### Online
👉 **[JUGAR AHORA - SURVIVORS ONLINE](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)**

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

| Característica | Descripción |
|----------------|-------------|
| **Interfaz Arcade** | Diseño de máquina recreativa con luces y efectos |
| **Sistema de Monedas** | Necesitas monedas para jugar (como en los arcades) |
| **7 Clases Únicas** | Cada clase tiene estadísticas y habilidades diferentes |
| **Tooltips Informativos** | Info detallada al pasar el ratón |
| **Bitácora de Eventos** | Registro de todos los combates |
| **2 Temas Visuales** | Pac-Man (amarillo/azul) y Clásico (verde/negro) |
| **Controles Teclado** | Atajos para todas las acciones |
| **Barras de Vida** | Información detallada en tooltips |
| **Estadísticas Tiempo Real** | Total, Buenos, Malos, victorias |
| **Control de Velocidad** | Ajusta la velocidad de la simulación |
| **Persistencia Local** | Las victorias se guardan entre sesiones |
| **Responsive Design** | Se adapta a móviles, tablets y desktop |

---

## 🎮 CONTROLES DEL JUEGO

### Botones en pantalla
| Botón | Función |
|-------|---------|
| **INSERT** | Insertar moneda |
| **PLAY** | Usar moneda y jugar |
| **PAUSA** | Pausar simulación |
| **CONTINUAR** | Reanudar simulación |
| **SALIR** | Volver al menú |
| **⚔️ - / +** | Cambiar velocidad |
| **↺** | Reiniciar victorias |

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
| **F1** | Mostrar ayuda |

---

## ⚔️ SISTEMA DE CLASES

### Clases de Buenos
| Clase | Icono | Vida | Daño | Habilidad |
|-------|-------|------|------|-----------|
| **Soldado** | `B` | 100 | 15% | - |
| **Curandero** | `C` | 120 | 5% | Cura 10% a aliados |
| **Paladín** | `P` | 150 | 10% | Reduce daño 50% |
| **Mago** | `W` | 80 | 20% | Daño mágico |

### Clases de Malos
| Clase | Icono | Vida | Daño | Habilidad |
|-------|-------|------|------|-----------|
| **Soldado** | `M` | 100 | 15% | - |
| **Asesino** | `A` | 70 | 30% | 15% crítico x2 |
| **Tanque** | `T` | 200 | 10% | Alta resistencia |
| **Brujo** | `U` | 90 | 25% | Roba 10% vida |

---

## 📊 PANEL DE ESTADÍSTICAS

El panel lateral derecho muestra:

### HIGH SCORE (Compacto)
- **TOTAL** - Número total de personajes vivos
- **😇** - Contador de Buenos
- **😈** - Contador de Malos
- **↺** - Botón reiniciar victorias

### Tarjetas de Jugadores
- **1UP** - Buenos con icono y contador
- **2UP** - Malos con icono y contador
- **🏆** - Victorias acumuladas

### CLASES (Con tooltips interactivos)
- **C Curandero** - Información al pasar el ratón
- **P Paladín** - Tooltip con estadísticas
- **W Mago** - Color específico por clase
- **A Asesino** - Tooltip minimalista
- **T Tanque** - Borde de color
- **U Brujo** - Flecha indicadora

### COMBATES (Cuadrícula)
- **Total** - Número de combates
- **Daño** - Daño total infligido
- **Muertes** - Personajes eliminados
- **Vivos** - Supervivientes actuales

### TIEMPO
- ⏱️ **00:00** - Tiempo de partida actual

---

## 📋 BITÁCORA DE COMBATE

El panel lateral izquierdo incluye una bitácora con registro de eventos:

### Tipos de eventos
- 🟡 **Sistema** - Inicio/pausa, monedas, configuración
- 🔴 **Combate** - Ataques, daño, habilidades
- 🔵 **Información** - Modos de juego, opciones
- 🟢 **Victoria** - Resultados de partidas

### Controles
- **🗑️** - Limpiar bitácora
- **Puntos de color** - Filtrar por tipo de evento
- **Scroll automático** - Siempre muestra el último evento

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

### Tooltips Minimalistas
```css
.class-stat-compact:hover::after {
    background: rgba(20, 20, 30, 0.98);
    border-left: 4px solid;
    padding: 8px 12px;
    font-size: 0.7rem;
}
```

### Añadir Nueva Clase
1. Crear archivo en `Entidades/ClasesBuenas/` o `ClasesMalas/`
2. Definir clase con herencia
3. Añadir a `CLASES_CONFIG`
4. Actualizar `generarPersonajeConClase()`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

| Problema | Solución |
|----------|----------|
| **Tablero no se ve al iniciar** | Espera 1 segundo, hay actualizaciones automáticas |
| **Personajes no se mueven** | Verifica que hay enemigos cerca |
| **Tooltips no aparecen** | Comprueba que los atributos `data-class` están correctos |
| **Botón START deshabilitado** | Selecciona un modo de juego primero |
| **Error de dimensiones** | El sistema usa valores por defecto (20x20) |
| **Clases no se muestran** | Verifica el orden de carga de scripts |
| **Monedas no se actualizan** | Revisa los IDs en el HTML |

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

### IDs Importantes
```html
<!-- Monedas -->
<span id="coinCount">0</span>
<span id="gameCoinCount">0</span>
<span id="panelCoinCount">0</span>

<!-- Estadísticas -->
<span id="totalStats">0</span>
<span id="buenosStats">0</span>
<span id="malosStats">0</span>

<!-- Clases -->
<span id="curanderoCount">0</span>
<span id="paladinCount">0</span>
<span id="magoCount">0</span>
```

### Funciones Clave
```javascript
iniciarSimulacion()      // Inicia la batalla
combatirConClases()      // Lógica de combate
actualizarTooltipsClases() // Actualiza tooltips
generarTooltipClase()    // Genera tooltip minimalista
```

---

## 🚀 HOJA DE RUTA

### ✅ Completado en v2.4.4
- [x] Panel de estadísticas compacto
- [x] Tooltips minimalistas por clase
- [x] Sistema de espera de dimensiones
- [x] Carga inicial corregida
- [x] Código más modular

### 🔜 Próximas Versiones

**v2.5.0 - Mejoras Visuales**
- [ ] Efectos de partículas en combates
- [ ] Animaciones de muerte
- [ ] Iconos SVG personalizados
- [ ] Fondos dinámicos

**v2.6.0 - Efectos de Sonido**
- [ ] Sonido al insertar moneda
- [ ] Efecto de combate
- [ ] Fanfarria de victoria
- [ ] Música de fondo

**v3.0.0 - Nuevas Funcionalidades**
- [ ] Modo torneo
- [ ] Guardar partidas
- [ ] Más clases especiales
- [ ] Modo multijugador local

---

## 📄 LICENCIA

MIT © 2026 - Libre uso, modificación y distribución

---

## 👏 CRÉDITOS

- **Desarrollador**: TheYinYan
- **Inspiración**: Juegos arcade clásicos
- **Tecnologías**: HTML5, CSS3, JavaScript ES6+

---

¡Gracias por jugar a SURVIVORS! ⚔️✨

**[🎮 JUGAR AHORA](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)** | **[🐛 Reportar Bug](https://github.com/TheYinYan/Trabajo_VideoJuego_JS/issues)** | **[⭐ Star en GitHub](https://github.com/TheYinYan/Trabajo_VideoJuego_JS)**

---

*Última actualización: Marzo 2026*
```