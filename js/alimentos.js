let productos = [];

const moneda = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  minimumFractionDigits: 2
});

const porcentaje = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

function valorNumerico(id) {
  return Number(document.getElementById(id).value);
}

function escaparHtml(texto) {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mostrarAlertaAlimentos(tipo, mensaje) {
  const contenedor = document.getElementById("alerta-alim-container");
  contenedor.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

function limpiarAlertaAlimentos() {
  document.getElementById("alerta-alim-container").innerHTML = "";
}

function validarProducto() {
  const nombre = document.getElementById("nombreProducto").value.trim();
  const precioAnterior = valorNumerico("precioAnterior");
  const precioActual = valorNumerico("precioActual");
  const cantidadMensual = valorNumerico("cantidadMensual");

  const valido = nombre.length > 0
    && Number.isFinite(precioAnterior) && precioAnterior > 0
    && Number.isFinite(precioActual) && precioActual > 0
    && Number.isFinite(cantidadMensual) && cantidadMensual > 0;

  if (!valido) {
    mostrarAlertaAlimentos("danger", "Completa el nombre, los precios y la cantidad mensual con datos válidos.");
  }

  return valido;
}

function agregarProducto() {
  if (!validarProducto()) return;

  const producto = {
    nombre: document.getElementById("nombreProducto").value.trim(),
    precioAnterior: valorNumerico("precioAnterior"),
    precioActual: valorNumerico("precioActual"),
    cantidadMensual: valorNumerico("cantidadMensual")
  };

  productos.push(producto);
  limpiarCamposProducto();
  limpiarAlertaAlimentos();
  renderizarProductos();
}

function limpiarCamposProducto() {
  document.getElementById("nombreProducto").value = "";
  document.getElementById("precioAnterior").value = "";
  document.getElementById("precioActual").value = "";
  document.getElementById("cantidadMensual").value = "";
  document.getElementById("nombreProducto").focus();
}

function eliminarProducto(indice) {
  productos.splice(indice, 1);
  renderizarProductos();
}

function renderizarProductos() {
  const lista = document.getElementById("lista-productos");
  const contador = document.getElementById("contador-productos");
  contador.textContent = productos.length;

  if (productos.length === 0) {
    lista.innerHTML = `
      <div class="text-center py-4" style="color:var(--color-muted); border:2px dashed #d0d9e8; border-radius:8px;">
        <i class="bi bi-basket" style="font-size:2rem; opacity:0.3;"></i>
        <p class="mt-2 mb-0" style="font-size:0.9rem;">
          Aún no hay productos. Agrega productos en el Paso 1.
        </p>
      </div>
    `;
    return;
  }

  lista.innerHTML = productos.map((producto, indice) => {
    const aumento = producto.precioActual - producto.precioAnterior;
    const aumentoPct = (aumento / producto.precioAnterior) * 100;

    return `
      <article class="producto-item">
        <div>
          <div class="nombre-producto">${escaparHtml(producto.nombre)}</div>
          <div class="detalle-producto">
            ${moneda.format(producto.precioAnterior)} → ${moneda.format(producto.precioActual)}
            · ${producto.cantidadMensual} u/mes · ${porcentaje.format(aumentoPct)}% de variación
          </div>
        </div>
        <button class="btn-eliminar-producto" onclick="eliminarProducto(${indice})" aria-label="Eliminar ${escaparHtml(producto.nombre)}">
          <i class="bi bi-x-circle-fill"></i>
        </button>
      </article>
    `;
  }).join("");
}

function calcularProducto(producto) {
  const incremento = producto.precioActual - producto.precioAnterior;
  const porcentajeAumento = (incremento / producto.precioAnterior) * 100;
  const gastoAnterior = producto.precioAnterior * producto.cantidadMensual;
  const gastoActual = producto.precioActual * producto.cantidadMensual;
  const diferencia = gastoActual - gastoAnterior;

  let estado = "normal";
  if (porcentajeAumento >= 50 || diferencia >= 80) estado = "critico";
  else if (porcentajeAumento >= 20 || diferencia >= 30) estado = "advertencia";

  return {
    ...producto,
    incremento,
    porcentajeAumento,
    gastoAnterior,
    gastoActual,
    diferencia,
    estado
  };
}

function calcularAlimentos() {
  if (productos.length === 0) {
    mostrarAlertaAlimentos("warning", "Agrega al menos un producto antes de calcular el impacto.");
    return;
  }

  limpiarAlertaAlimentos();
  const calculados = productos.map(calcularProducto);
  const totalAnterior = calculados.reduce((suma, p) => suma + p.gastoAnterior, 0);
  const totalActual = calculados.reduce((suma, p) => suma + p.gastoActual, 0);
  const diferenciaTotal = totalActual - totalAnterior;
  const porcentajeTotal = totalAnterior > 0 ? (diferenciaTotal / totalAnterior) * 100 : 0;
  const productoMayorAumento = calculados.reduce((mayor, actual) => (
    actual.porcentajeAumento > mayor.porcentajeAumento ? actual : mayor
  ), calculados[0]);

  let clase = "normal";
  let titulo = "Impacto controlado";
  let mensaje = "El aumento todavía es bajo, pero conviene seguir registrando precios para tomar decisiones familiares.";

  if (porcentajeTotal >= 50 || diferenciaTotal >= 150) {
    clase = "critico";
    titulo = "Impacto crítico en la canasta";
    mensaje = `La familia necesita ${moneda.format(diferenciaTotal)} adicionales para comprar la misma cantidad de productos.`;
  } else if (porcentajeTotal >= 20 || diferenciaTotal >= 50) {
    clase = "advertencia";
    titulo = "Aumento importante del gasto";
    mensaje = `El gasto subió ${porcentaje.format(porcentajeTotal)}%. La diferencia mensual ya afecta el presupuesto familiar.`;
  }

  const filas = calculados.map((producto) => `
    <tr class="fila-${producto.estado}">
      <td><strong>${escaparHtml(producto.nombre)}</strong></td>
      <td>${moneda.format(producto.precioAnterior)}</td>
      <td>${moneda.format(producto.precioActual)}</td>
      <td>${producto.cantidadMensual}</td>
      <td>${moneda.format(producto.incremento)}</td>
      <td>${porcentaje.format(producto.porcentajeAumento)}%</td>
      <td>${moneda.format(producto.gastoAnterior)}</td>
      <td>${moneda.format(producto.gastoActual)}</td>
      <td><strong>${moneda.format(producto.diferencia)}</strong></td>
    </tr>
  `).join("");

  const contenido = `
    <div class="alerta-resultado ${clase}">
      <div class="icono-alerta"><i class="bi bi-graph-up-arrow"></i></div>
      <div class="texto-alerta">
        <div class="titulo">${titulo}</div>
        <p>${mensaje}</p>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica info">
          <div class="valor">${moneda.format(totalAnterior)}</div>
          <div class="etiqueta">Gasto anterior</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica advertencia">
          <div class="valor">${moneda.format(totalActual)}</div>
          <div class="etiqueta">Gasto actual</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica ${clase}">
          <div class="valor">${moneda.format(diferenciaTotal)}</div>
          <div class="etiqueta">Diferencia mensual</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica ${clase}">
          <div class="valor">${porcentaje.format(porcentajeTotal)}%</div>
          <div class="etiqueta">Aumento total</div>
        </div>
      </div>
    </div>

    <div class="alerta-resultado info">
      <div class="icono-alerta"><i class="bi bi-info-circle-fill"></i></div>
      <div class="texto-alerta">
        <div class="titulo">Producto con mayor variación</div>
        <p>${escaparHtml(productoMayorAumento.nombre)} subió ${porcentaje.format(productoMayorAumento.porcentajeAumento)}%, generando ${moneda.format(productoMayorAumento.diferencia)} extra en el periodo mensual.</p>
      </div>
    </div>

    <div class="table-responsive">
      <table class="tabla-resultado">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio anterior</th>
            <th>Precio actual</th>
            <th>Cantidad/mes</th>
            <th>Incremento</th>
            <th>% aumento</th>
            <th>Gasto anterior</th>
            <th>Gasto actual</th>
            <th>Diferencia</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;

  document.getElementById("contenido-resultados-alimentos").innerHTML = contenido;
  document.getElementById("resultados-alimentos").classList.add("visible");
  document.getElementById("resultados-alimentos").scrollIntoView({ behavior: "smooth", block: "start" });
}

function limpiarListaProductos() {
  productos = [];
  renderizarProductos();
  document.getElementById("contenido-resultados-alimentos").innerHTML = "";
  document.getElementById("resultados-alimentos").classList.remove("visible");
}

function limpiarTodoAlimentos() {
  productos = [];
  limpiarCamposProducto();
  limpiarAlertaAlimentos();
  renderizarProductos();
  document.getElementById("contenido-resultados-alimentos").innerHTML = "";
  document.getElementById("resultados-alimentos").classList.remove("visible");
}

function aplicarCasoAlimentos1() {
  productos = [
    { nombre: "Arroz (kg)", precioAnterior: 8, precioActual: 11, cantidadMensual: 10 },
    { nombre: "Papa (kg)", precioAnterior: 7, precioActual: 10, cantidadMensual: 8 },
    { nombre: "Aceite (lt)", precioAnterior: 12, precioActual: 18, cantidadMensual: 4 }
  ];
  renderizarProductos();
  calcularAlimentos();
}

function aplicarCasoAlimentos2() {
  productos = [
    { nombre: "Arroz (kg)", precioAnterior: 8, precioActual: 11, cantidadMensual: 10 },
    { nombre: "Papa (kg)", precioAnterior: 7, precioActual: 10, cantidadMensual: 8 },
    { nombre: "Aceite (lt)", precioAnterior: 12, precioActual: 18, cantidadMensual: 4 },
    { nombre: "Azúcar (kg)", precioAnterior: 5, precioActual: 8, cantidadMensual: 5 },
    { nombre: "Harina (kg)", precioAnterior: 6, precioActual: 9, cantidadMensual: 6 },
    { nombre: "Leche (lt)", precioAnterior: 7, precioActual: 10, cantidadMensual: 15 }
  ];
  renderizarProductos();
  calcularAlimentos();
}

document.addEventListener("DOMContentLoaded", renderizarProductos);
