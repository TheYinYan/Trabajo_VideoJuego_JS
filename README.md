# Trabajo del Video Juego

## Notas para actualizar

- Conversión Java a JavaScript
- Mirar si se pueden Poner Funciones en private o protejido 
- Hacer los Arrays -> ArrayLists

## [Codigo Java del MAIN](src/App.java) 

### Funcionamiento 

1. Pedir Por consola el **anchura y altura del tablero**
    - *Comprobando que el número introducido:*
        - Sea mayor que 0
        - Sea un número par

2. Eliges **opción:**
    1. Mitad Buenos y Mitad Malos 
    2. Numero Personaje Aleatorios
    3. Mitad Buenos y Mitad Malos Aleatorios

3. Si **opción**: 
    - Es **1** pedir por consola el **Nº Personajes**
        - De los cuales la mitad son **Buenos** y la otra mitad son **Malos** 
        - *Comprobando que el número introducido*
    - Es **2** Nª Aleatorios para **Buenos** y Nª Aleatorios para **Malos**
    - Es **3** Nª Aleatorios de personajes, de los cuales la mitad son **Buenos** y la otra mitad son **Malos**

4. Crear de forma aleatoria los obstáculos en función de las dimensiones del tablero

5. Crear array del **arrayPersonajes** y **arrayEntidades** con los datos recibidos  

6. Pintar Tablero con las entidades 

7. **Mover los Personajes** para que no colisionen con un **Personaje** del mismo tipo o con un **Obstaculo**

8. **Actualizar de el array** se comprueba **arrayEntidades** para saber si:
    
    - La posición esta libre se moverse
    - La posición esta ocupada por un **Personaje** de distinto tipo pelear

9. **Pelear** es sumar las vidas de los **Personaje** y aleatorizarla un resultado con ella haciedo que si:

    - El resultado es menor que la vida del atacante gana él.
    - El resultado es menor que la vida del atacante gana el defensor.

10. Comprobar el número de Personajes **Buenos** y **Malos**  para saber quien gana si no, se sigue el código


### Atributos static
- **AZUL** -> Cambia a color Azul para el texto
- **NARANJA** -> Cambia a color Naranja para el texto

## [Clase Funciones](src/Entidades/ListFunciones/Funciones.java)

Equivalente a la clase estática Funciones de Java.
Contiene todas las funciones utilitarias del juego:

- Generación de tablero y personajes
- Visualización
- Lógica de combate
- Movimiento global
- Detección de fin de juego

### Atributos static
- **CLEAN_SCREEN** -> Limpia la consola
- **RED** -> Cambia a color Rojo para el texto
- **AZUL** -> Cambia a color Azul para el texto
- **RESET** -> Resetea el formato del texto al por defecto
- **opcion** -> Opciones para el **menu**

### Funciones
- **CLEANSCREEN** -> Limpiar Pantalla con flush
- **titulo** -> Pintar un titulo en un cuadrado dinamicamente de pendiendo del texto
- **menu** -> Pinta un menu con las opciones de Crear **Personajes**
- **coprobaciones** -> Comprueba que los número introducido:
    - Sea mayor que 0
    - Sea un número par
- **generador** -> Dependiendo de la **Opcion** llama a un **generadorEntidades** distinto 
- **generadorEntidades** -> Genera **Obstaculos** o **Personajes** o **Buenos** y **Malos**, dependiendo:
    - Si introduces un array de **Personajes** y pones el **porcentaje** genera genera **Buenos** y **Malos** con es porcentaje
    - Si introduces un array de **Personajes** y no pones el **porcentaje** genera **Buenos** y **Malos** mitad y mitad 
    - Sino genera **Obstaculos**
- **pintarTablero** -> Pinta el Tablero
- **asignarPersonajesCercanos** -> Asigna a los personajes otro personaje dependiendo de la distancia
- **eliminarPersonaje** -> Elimina un personaje del ArrayPersonajes y de ArrayEntidades
- **movimento** -> Mueve el personaje
- **terminar** -> Si uno de los **Bunenos** o los **Malos** se quedan sin personajes ganando el contario 

## [Clase Entidad](src/Entidades/Entidad.java) 

Esta es la clase padre de todas las entidades del juego.
En Java era abstracta, en JavaScript es una clase normal.
Define las propiedades y comportamientos básicos que todas
las entidades (personajes y obstáculos) comparten.

### Atributos: 
- **y** -> Posición vertical 
- **x** -> Posición horizontal
- **vy** -> Velocidad vertical
- **vx** -> Velocidad horizontal

### Funciones
-  **Getters y Setters (y - x - vy - vx )** --> Obtienes y modificas esos **Atributos**
- **distaciaCon** -> Opciones la distancia con otro **Entidad**
- **estaCercaDe** -> Te devuelve **true** o **false** si está cerca de la distancia proporcionada
- **mover** -> Hace que se mueva la entidad sin tocar **Entidades**, ni los bordes del tablero

### Lo Heredan
- **Personajes**
- **Obstaculos**

## [Clase Obstaculos](src/Entidades/Obstaculos.java)

Representa los obstáculos estáticos del tablero (#)
Hereda de Entidad pero no se mueve.
Los personajes no pueden atravesarlos.

### Atributos: 
- Atributos heredados de **Entidad**

### Funciones
- Funciones heredados de **Personajes**
- **toString** -> Como se va a ver cuando lo imprimas

## [Clase Personajes](src/Entidades/Personajes.java)

Hereda de Entidad y representa a todos los personajes (Buenos y Malos)
En Java era abstracta, aquí es clase normal.
Añade la vida y el contador estático de personajes.

### Atributos: 
- Atributos heredados de **Entidad**
- **Vida** -> El porcentaje de vida del personaje
- **nPersonajes** -> Números de personajes totales 

### Funciones
- Funciones heredados de **Personajes**
- **getVida** -> Obtienes la **vida** del **Personaje**
- **getnPersonajes** -> Obtienes el número de **Personaje**
- **setnPersonajes** -> Modifica el número de **Personaje**

### Lo Heredan
- **Malos**
- **Buenos**

## [Clase Malos](src/Entidades/Malos.java)

Representa a los personajes malos (M en el tablero)
Hereda de Personajes.
Tienen la capacidad de detectar y perseguir a los buenos cercanos.

### Atributos 
- Atributos heredados de **Personajes**
- **RED** -> Cambia a color Rojo para el texto
- Al **Bueno** al que persigue
- **nMalos** -> Número de **Malos** totales

### Funciones
- Funciones heredados de **Personajes**
- **getBuenos** -> Obtienes al **Bueno** que persigue
- **setBuenos** -> Modificas al **Bueno** que persigue
- **getnMalos** -> Obtienes el número de **Malos** totales
- **setnMalos** -> Modificas el número de **Malos** totales
- **mover** -> Modificar la función **mover** del padre para perseguir al **Bueno** 
- **toString** -> Como se va a ver cuando lo imprimas

## [Clase Buenos](src/Entidades/Buenos.java)
Representa a los personajes buenos (B en el tablero)
Hereda de Personajes.
Tienen la capacidad de detectar y perseguir a los malos cercanos.

- Atributos heredados de **Personajes**
- El **Malo** del que huye 

### Funciones
- Funciones heredados de **Personajes**
- **getMalos** -> Obtienes al **Malo** al que huye
- **setMalos** -> Modificas al **Malo** al que huye
 **getnBuenos** -> Obtienes el número de **Buenos** totales
- **setnBuenos** -> Modificas el número de **Buenos** totales
- **mover** -> Modificar la función **mover** del padre para huir del **Malo** 
- **toString** -> Como se va a ver cuando lo imprimas
