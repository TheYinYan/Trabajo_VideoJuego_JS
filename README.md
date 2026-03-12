Aquí tienes el README.md actualizado con la versión 2.5.1:

# [⚔️ SURVIVORS - Batalla Épica](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)

Juego de simulación donde personajes Buenos y Malos luchan en un tablero con obstáculos. Los personajes se mueven, persiguen a sus enemigos y combaten hasta que solo queda un bando.

![Versión](https://img.shields.io/badge/Versión-2.5.1-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-success)

---

## 📑 ÍNDICE

- [🎮 DESCRIPCIÓN DEL JUEGO](#-descripción-del-juego)
- [✨ NOVEDADES EN VERSIÓN 2.5.1](#-novedades-en-versión-251)
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

## ✨ NOVEDADES EN VERSIÓN 2.5.1

### 🎯 Mejoras Visuales

- ✅ **Nuevo sistema de tooltips** - Información detallada al pasar el ratón sobre las clases
- ✅ **Nuevo diseño de tarjetas de jugador** - Más visuales y con iconos representativos
- ✅ **Panel de estadísticas rediseñado** - Más compacto, profesional y con mejor distribución
- ✅ **Indicadores de color por clase** - Cada clase tiene su propio color para fácil identificación
- ✅ **Diseño responsive mejorado** - Mejor adaptación a móviles, tablets y pantallas grandes

### 🚀 Mejoras Técnicas

- ✅ **Corrección de carga inicial** - El tablero se muestra correctamente al cargar la página
- ✅ **Sistema de espera de dimensiones** - Espera a que el contenedor tenga tamaño real antes de crear el tablero
- ✅ **Múltiples reintentos** - Si falla la carga, usa valores por defecto para garantizar la jugabilidad
- ✅ **Código más modular** - Funciones separadas por responsabilidad para mejor mantenimiento
- ✅ **Optimización de rendimiento** - Cálculos de dimensiones más eficientes

### ⚔️ Sistema de Clases

- ✅ **Curandero (C)** - Vida: 120, Daño: 5%, Habilidad: Cura +10% a aliados cercanos
- ✅ **Paladín (P)** - Vida: 150, Daño: 10%, Habilidad: Reduce el daño recibido un 50%
- ✅ **Mago (W)** - Vida: 80, Daño: 20%, Habilidad: Daño mágico (sin resistencia)
- ✅ **Asesino (A)** - Vida: 70, Daño: 30%, Habilidad: 15% de probabilidad de crítico (x2 daño)
- ✅ **Tanque (T)** - Vida: 200, Daño: 10%, Habilidad: Alta resistencia
- ✅ **Brujo (U)** - Vida: 90, Daño: 25%, Habilidad: Roba 10% de la vida infligida

### 🎮 Modo Pixel Perfect

- ✅ **Nuevo modo de visualización** - Actívalo con el checkbox en el panel de control
- ✅ **Una celda por píxel** - Para una experiencia de juego única
- ✅ **Límite de seguridad** - Máximo 200,000 celdas para evitar congelar la página
- ✅ **Desactivación automática** - Si el contenedor es demasiado grande, se desactiva solo

### 📝 Notas de Actualización

- Se han corregido problemas de carga inicial del tablero que afectaban a algunos navegadores
- Se ha implementado un sistema de espera para asegurar que el tablero tenga dimensiones antes de iniciar la simulación
- Se han añadido múltiples reintentos para manejar casos donde el tablero no se carga correctamente
- Se ha rediseñado el panel de estadísticas para hacerlo más compacto y visualmente atractivo
- Se ha mejorado la experiencia de usuario con tooltips más informativos y mejor posicionados
- Se ha optimizado el código para mejor rendimiento y mantenibilidad

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
survivors-js/
│
├── 📄 index.html                          # Interfaz de usuario
├── 📄 survivors.js                        # Control principal (ACTUALIZADO v2.5.1)
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
2. **Abre `index.html`** en cualquier navegador moderno (Chrome, Firefox, Edge, Safari)
3. **Inserta una moneda** 🪙 (haciendo clic en INSERT o presionando ESPACIO)
4. **Selecciona un modo de juego** y configura los parámetros
5. **Haz clic en COMENZAR** o presiona ENTER
6. **¡Disfruta la batalla!** ⚔️

### Online

👉 **[JUGAR AHORA - SURVIVORS ONLINE](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)**

---

## 🎯 CARACTERÍSTICAS PRINCIPALES

| Característica | Descripción |
|----------------|-------------|
| **Interfaz Arcade** | Diseño de máquina recreativa con luces, efectos y paneles laterales |
| **Sistema de Monedas** | Necesitas monedas para jugar (como en los arcades clásicos) |
| **7 Clases Únicas** | Cada clase tiene estadísticas y habilidades diferentes |
| **Tooltips Informativos** | Info detallada al pasar el ratón sobre clases y personajes |
| **Bitácora de Eventos** | Registro de todos los combates con filtros por tipo |
| **2 Temas Visuales** | Pac-Man (amarillo/azul) y Clásico (verde/negro) |
| **Controles Teclado** | Atajos para todas las acciones del juego |
| **Barras de Vida** | Información detallada en tooltips con barra de progreso |
| **Estadísticas Tiempo Real** | Total, Buenos, Malos, victorias, combates, daño |
| **Control de Velocidad** | Ajusta la velocidad de la simulación en tiempo real |
| **Persistencia Local** | Las victorias y rankings se guardan entre sesiones |
| **Modo Pixel Perfect** | Visualización experimental con una celda por píxel |
| **Responsive Design** | Se adapta perfectamente a móviles, tablets y desktop |

---

## 🎮 CONTROLES DEL JUEGO

### Botones en pantalla

| Botón | Función |
|-------|---------|
| **INSERT** | Insertar moneda |
| **PLAY** | Usar moneda y jugar |
| **PAUSA** | Pausar simulación |
| **CONTINUAR** | Reanudar simulación |
| **SALIR** | Volver al menú principal |
| **⚔️ - / +** | Cambiar velocidad de simulación |
| **↺** | Reiniciar contadores de victorias |
| **Pixel Perfect** | Activar/desactivar modo pixel |

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

## 📊 PANEL DE ESTADÍSTICAS

El panel lateral derecho muestra información en tiempo real:

### HIGH SCORE (Compacto)
- **TOTAL** - Número total de personajes vivos
- **😇** - Contador de Buenos
- **😈** - Contador de Malos
- **↺** - Botón para reiniciar victorias

### Tarjetas de Jugadores
- **1UP** - Buenos con icono y contador
- **2UP** - Malos con icono y contador
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

## 🎨 TEMAS DISPONIBLES

### Tema Pac-Man 👻
```css
--primary: #ffff00;
--secondary: #24408e;
--accent: #ffd700;
```
- Estilo arcade clásico de los años 80
- Efectos de neón y brillos dorados
- Ambiente auténtico de sala de juegos

### Tema Clásico 🕹️
```css
--primary: #33ff33;
--secondary: #0a2a0a;
--accent: #00ff00;
```
- Estilo terminal/matrix verde
- Efectos de brillo en verde fosforito
- Ambiente hacker/retro

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
    border-radius: 6px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.7);
}
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
| **Error de dimensiones** | El sistema usa valores por defecto (15x20) después de 20 intentos |
| **Clases no se muestran** | Verifica el orden de carga de scripts en el HTML |
| **Monedas no se actualizan** | Revisa los IDs en el HTML: `coinCount`, `gameCoinCount`, `panelCoinCount` |
| **Modo pixel no funciona** | El contenedor puede ser demasiado grande (>200,000 celdas potenciales) |

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
iniciarSimulacion()      // Inicia la batalla con todas las configuraciones
combatirConClases()      // Lógica de combate entre clases
actualizarTooltipsClases() // Actualiza tooltips dinámicamente
generarTooltipClase()    // Genera tooltip minimalista
recalcularDimensiones()  // Calcula dimensiones del tablero
redimensionarTablero()   // Ajusta el tamaño de las celdas
```

---

## 🚀 HOJA DE RUTA

### ✅ Completado en v2.5.1
- [x] Panel de estadísticas compacto y rediseñado
- [x] Tooltips minimalistas por clase con colores identificativos
- [x] Sistema de espera de dimensiones (hasta 20 intentos)
- [x] Carga inicial corregida con múltiples reintentos
- [x] Código más modular y optimizado
- [x] Modo Pixel Perfect (experimental)
- [x] Sistema de ranking local con top 10
- [x] Persistencia de victorias en localStorage

### 🔜 Próximas Versiones

**v2.6.0 - Mejoras Visuales**
- [ ] Efectos de partículas en combates
- [ ] Animaciones de muerte para personajes
- [ ] Iconos SVG personalizados por clase
- [ ] Fondos dinámicos según modo de juego
- [ ] Transiciones más suaves entre estados

**v2.7.0 - Efectos de Sonido**
- [ ] Sonido al insertar moneda
- [ ] Efecto de combate y golpes
- [ ] Fanfarria de victoria
- [ ] Música de fondo ambiental
- [ ] Control de volumen en interfaz

**v3.0.0 - Nuevas Funcionalidades**
- [ ] Modo torneo con eliminatorias
- [ ] Guardar y cargar partidas
- [ ] Más clases especiales (Arquero, Guerrero, etc.)
- [ ] Modo multijugador local (2 jugadores)
- [ ] Logros y desbloqueables

---

## 📄 LICENCIA

MIT © 2026 - Libre uso, modificación y distribución

---

## 👏 CRÉDITOS

- **Desarrollador principal**: TheYinYan
- **Inspiración**: Juegos arcade clásicos de los 80 y 90
- **Tecnologías utilizadas**: HTML5, CSS3, JavaScript ES6+
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

¡Gracias por jugar a SURVIVORS! ⚔️✨

**[🎮 JUGAR AHORA](https://theyinyan.github.io/Trabajo_VideoJuego_JS/)** | **[🐛 Reportar Bug](https://github.com/TheYinYan/Trabajo_VideoJuego_JS/issues)** | **[⭐ Star en GitHub](https://github.com/TheYinYan/Trabajo_VideoJuego_JS)**

---

*Última actualización: Marzo 2026*


## Principales actualizaciones:

### 📝 **Versión actualizada a 2.5.1**
- Añadido el modo **Pixel Perfect** con su descripción
- Nuevas características de tooltips y diseño de tarjetas
- Sistema de espera de dimensiones documentado
- Hoja de ruta actualizada

### 🎯 **Secciones mejoradas:**
- **NOVEDADES** - Ahora incluye todas las características de la 2.5.1
- **CARACTERÍSTICAS** - Añadido modo Pixel Perfect a la lista
- **SOLUCIÓN DE PROBLEMAS** - Nuevos casos específicos
- **HOJA DE RUTA** - Actualizada con lo completado en 2.5.1

### 📊 **Información técnica:**
- Documentado el sistema de reintentos (20 intentos)
- Explicado el límite de 200,000 celdas en modo pixel
- Valores por defecto (15x20) cuando falla la carga
- Detalles de las clases y habilidades actualizados
