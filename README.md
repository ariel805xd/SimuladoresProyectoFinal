# Simulador web de abastecimiento, precios y consumo familiar

Proyecto final de **Programacion Web I** basado en el documento **"Desafio Final de Programacion Web I: Pagina web interactiva para simular problemas reales del contexto actual"**.

La pagina representa problemas del contexto de crisis mediante modelos matematicos sencillos, formularios interactivos, validaciones, manipulacion del DOM y resultados visibles en pantalla. La finalidad es educativa: ayudar a comprender como el abastecimiento, los precios y las decisiones de compra pueden cambiar en una situacion de bloqueo, escasez o tension social.

## Escenarios sugeridos que se tomaron



- **Escenario A: Simulador de abastecimiento de carburantes**
  - Archivo: `carburantes.html`
  - JavaScript: `js/carburantes.js`
  - Problema: una estacion de servicio tiene una reserva limitada.
  - Calcula: reserva restante por dia, dia critico, agotamiento, deficit diario y comparacion entre consumo normal y consumo alto.

- **Escenario B: Simulador de precios de alimentos**
  - Archivo: `alimentos.html`
  - JavaScript: `js/alimentos.js`
  - Problema: los productos de la canasta familiar suben de precio.
  - Calcula: incremento, porcentaje de aumento, gasto anterior, gasto actual y diferencia mensual.

- **Escenario E: Simulador de rumor de escasez y compras por panico**
  - Archivo: `panico.html`
  - JavaScript: `js/panico.js`
  - Problema: un rumor aumenta la demanda y puede volver insuficiente el stock.
  - Calcula: nueva demanda, diferencia con la demanda normal, stock restante, deficit y familias afectadas.


## Como cumple con el documento

| Requisito del documento | Cumplimiento en el proyecto |
| --- | --- |
| Pagina web interactiva | Los tres simuladores reciben datos del usuario y generan resultados dinamicos. |
| HTML5 semantico | Las paginas usan `header`, `nav`, `main`, `section`, `article` y `footer`. |
| CSS externo | Los estilos estan separados en `styles/estilos.css`. |
| JavaScript externo | Cada simulador tiene su archivo propio en la carpeta `js`. |
| Uso del DOM | Los JS usan `document.getElementById`, actualizan `innerHTML`, agregan clases y muestran resultados. |
| Formularios | Hay formularios con `input`, `select`, botones de calcular, limpiar y aplicar casos de estudio. |
| Validaciones basicas | Se validan campos vacios, numeros invalidos, valores negativos y condiciones logicas. |
| Resultados visibles | Los resultados aparecen en tarjetas, tablas, alertas y barras visuales, no solo en consola. |
| Alertas e interpretacion | Cada simulador muestra mensajes de estado normal, advertencia o critico. |
| Cambio dinamico de estilos | Las clases `normal`, `advertencia` y `critico` cambian colores de tarjetas, filas y alertas. |
| Casos de estudio | Cada pagina incluye casos ya definidos con resultado esperado y boton para probarlos. |
| Diseno responsivo | Se usa Bootstrap y media queries en CSS para celular, tablet y escritorio. |
| Paleta y contraste | La paleta combina azul institucional, rojo de alerta, amarillo de advertencia y verde de estado normal. |
| Organizacion en carpetas | El proyecto separa HTML, CSS, JS e imagenes. |
| README | Este archivo describe el proyecto, los casos, la estructura y la forma de entrega. |

## Contenido minimo pedido

El documento pide que la pagina incluya Inicio, Contexto, Simulador, Resultados, Casos de estudio, Conclusiones y Creditos.

- **Inicio:** `index.html` presenta el titulo, el objetivo, el contexto general y acceso a los tres escenarios.
- **Contexto:** cada pagina explica la situacion del escenario elegido.
- **Simulador:** cada escenario tiene formulario propio y boton para calcular.
- **Resultados:** cada pagina tiene un area oculta que JavaScript muestra con resultados dinamicos.
- **Casos de estudio:** cada simulador incluye ejemplos con datos ya definidos.
- **Conclusiones:** cada pagina explica que se aprende del modelo.
- **Creditos:** el pie de pagina incluye materia, gestion y espacio para el nombre del estudiante.

## Casos de estudio incorporados

### Caso sugerido 1: Reserva de carburante

- Reserva inicial: 10.000 litros
- Consumo diario: 1.200 litros
- Reabastecimiento diario: 300 litros
- Nivel critico: 2.000 litros
- Resultado esperado: la reserva llega al nivel critico alrededor del dia 9 y se agota alrededor del dia 12.

### Caso sugerido 2: Aumento del precio de alimentos

- Arroz: 8 Bs a 11 Bs, 10 unidades/mes
- Papa: 7 Bs a 10 Bs, 8 unidades/mes
- Aceite: 12 Bs a 18 Bs, 4 unidades/mes
- Resultado esperado: gasto anterior 190 Bs, gasto actual 254 Bs, diferencia 64 Bs.

### Caso sugerido 5: Rumor de escasez

- Demanda normal: 100 unidades
- Aumento por rumor: 40%
- Stock disponible: 120 unidades
- Familias: 50
- Resultado esperado: nueva demanda 140 unidades, deficit de 20 unidades y stock insuficiente.

Tambien se agregaron casos secundarios para probar escenarios mas amplios y demostrar que los calculos funcionan con diferentes datos.

## Modelos matematicos usados

### Carburantes

```text
Reserva final = Reserva inicial + Reabastecimiento diario - Consumo diario
Deficit diario = Consumo diario - Reabastecimiento diario
Dia critico = (Reserva inicial - Nivel critico) / Deficit diario
```

### Alimentos

```text
Incremento = Precio actual - Precio anterior
Porcentaje de aumento = (Incremento / Precio anterior) x 100
Gasto anterior = Precio anterior x Cantidad mensual
Gasto actual = Precio actual x Cantidad mensual
Diferencia = Gasto actual - Gasto anterior
```

### Rumor de escasez

```text
Nueva demanda = Demanda normal + (Demanda normal x Porcentaje de aumento / 100)
Stock restante = Stock disponible - Nueva demanda
Deficit = Nueva demanda - Stock disponible
```

## Estructura del proyecto

```text
Proyecto fina/
├── index.html
├── carburantes.html
├── alimentos.html
├── panico.html
├── styles/
│   └── estilos.css
├── js/
│   ├── carburantes.js
│   ├── alimentos.js
│   └── panico.js
├── img/
│   ├── bloqueo1.jpg
│   └── README-imagenes.md
└── README.md
```

## Como probar el proyecto

1. Abrir `index.html` en el navegador.
2. Entrar a Carburantes, Alimentos o Panico desde la navegacion.
3. Llenar el formulario manualmente o presionar un boton de caso de estudio.
4. Revisar las tarjetas, tablas, alertas y barras generadas por JavaScript.
5. Probar el boton de limpiar para verificar que el formulario y resultados se reinicien.

## Imagenes

La carpeta `img` contiene `bloqueo1.jpg`, usada como imagen principal del inicio. Tambien incluye `img/README-imagenes.md`, donde se indican imagenes recomendadas para completar el contexto visual:

- Filas en gasolineras.
- Mercados con precios altos.
- Productos de canasta familiar.
- Estantes vacios o productos racionados.
- Bloqueos o calles afectadas por protestas.

## Checklist de autoevaluacion

| Pregunta del checklist | Estado |
| --- | --- |
| Titulo claro | Cumplido |
| Problema real explicado | Cumplido |
| HTML5 semantico | Cumplido |
| CSS separado | Cumplido |
| JavaScript separado | Cumplido |
| Carpetas organizadas | Cumplido |
| Paleta adecuada y contraste | Cumplido |
| Responsive | Cumplido |
| Formularios con datos | Cumplido |
| Calculos con JavaScript | Cumplido |
| DOM para capturar y mostrar | Cumplido |
| Resultados en pantalla | Cumplido |
| Validaciones | Cumplido |
| Alertas o interpretacion | Cumplido |
| Casos de estudio | Cumplido |
| Codigo ordenado y comentado | Cumplido |
| README | Cumplido |
| Repositorio Git | Pendiente de subir por el estudiante |
| Pagina publicada | Pendiente de publicar por el estudiante |
| Enlaces de entrega | Pendiente de completar cuando se publique |

## Entrega final sugerida

Completar estos datos antes de entregar:

```text
Nombre completo: Ariel Orlando Bustillos Cadena
Materia: Programacion Web I
Titulo del proyecto: Simulador web de abastecimiento, precios y consumo familiar
Enlace de la pagina web: https://ariel805xd.github.io/SimuladoresProyectoFinal/index.html
Enlace del repositorio Git: https://github.com/ariel805xd/SimuladoresProyectoFinal
```

## Creditos

- Estudiante: `Ariel Orlando Bustillos Cadena`
- Materia: Programacion Web I
- Gestion: 2026
