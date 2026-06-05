const formatoUnidades = new Intl.NumberFormat("es-BO", {
  maximumFractionDigits: 1
});

function numeroPanico(id) {
  return Number(document.getElementById(id).value);
}

function marcarPanico(id, invalido) {
  document.getElementById(id).classList.toggle("is-invalid", invalido);
}

function alertaPanico(tipo, mensaje) {
  const contenedor = document.getElementById("alerta-panico-container");
  contenedor.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

function limpiarAlertaPanico() {
  document.getElementById("alerta-panico-container").innerHTML = "";
}

function validarPanico() {
  const reglas = [
    { id: "demandaNormal", valido: (v) => v > 0 },
    { id: "aumentoRumor", valido: (v) => v >= 0 },
    { id: "stockDisponible", valido: (v) => v >= 0 },
    { id: "numeroFamilias", valido: (v) => v > 0 }
  ];

  let valido = true;
  reglas.forEach((regla) => {
    const valor = numeroPanico(regla.id);
    const campoValido = Number.isFinite(valor) && regla.valido(valor);
    marcarPanico(regla.id, !campoValido);
    if (!campoValido) valido = false;
  });

  if (!valido) {
    alertaPanico("danger", "Completa todos los campos con números válidos antes de calcular.");
  }

  return valido;
}

function construirBarra(nombre, valor, maximo, clase) {
  const ancho = maximo > 0 ? Math.min((valor / maximo) * 100, 100) : 0;
  return `
    <div class="mb-3">
      <div class="d-flex justify-content-between mb-1" style="font-size:0.86rem;">
        <strong>${nombre}</strong>
        <span>${formatoUnidades.format(valor)} unidades</span>
      </div>
      <div class="barra-contenedor">
        <div class="barra-relleno ${clase}" style="width:${ancho}%;">
          ${formatoUnidades.format(valor)}
        </div>
      </div>
    </div>
  `;
}

function calcularPanico() {
  if (!validarPanico()) return;
  limpiarAlertaPanico();

  const productoSelect = document.getElementById("productoAnalizado");
  const productoAnalizado = productoSelect.options[productoSelect.selectedIndex].text;
  const demandaNormal = numeroPanico("demandaNormal");
  const aumentoRumor = numeroPanico("aumentoRumor");
  const stockDisponible = numeroPanico("stockDisponible");
  const numeroFamilias = numeroPanico("numeroFamilias");

  const nuevaDemanda = demandaNormal + (demandaNormal * aumentoRumor / 100);
  const diferenciaDemanda = nuevaDemanda - demandaNormal;
  const stockRestante = stockDisponible - nuevaDemanda;
  const deficit = Math.max(nuevaDemanda - stockDisponible, 0);
  const demandaPromedioFamilia = nuevaDemanda / numeroFamilias;
  const familiasAfectadas = demandaPromedioFamilia > 0 ? Math.ceil(deficit / demandaPromedioFamilia) : 0;
  const cobertura = nuevaDemanda > 0 ? (stockDisponible / nuevaDemanda) * 100 : 0;

  let clase = "normal";
  let titulo = "Stock suficiente";
  let mensaje = `Para ${productoAnalizado}, el stock cubre la nueva demanda y quedarían ${formatoUnidades.format(stockRestante)} unidades disponibles.`;

  if (stockRestante < 0) {
    clase = "critico";
    titulo = "La demanda supera el stock";
    mensaje = `Para ${productoAnalizado}, faltan ${formatoUnidades.format(deficit)} unidades. Aproximadamente ${familiasAfectadas} familias podrían quedar sin abastecimiento si todas intentan comprar al mismo tiempo.`;
  } else if (cobertura <= 115) {
    clase = "advertencia";
    titulo = "Stock muy ajustado";
    mensaje = `Para ${productoAnalizado}, el stock alcanza, pero queda un margen pequeño de ${formatoUnidades.format(stockRestante)} unidades. Un nuevo rumor podría volverlo insuficiente.`;
  }

  const maximoBarras = Math.max(demandaNormal, nuevaDemanda, stockDisponible);
  const contenido = `
    <div class="alerta-resultado ${clase}">
      <div class="icono-alerta"><i class="bi bi-megaphone-fill"></i></div>
      <div class="texto-alerta">
        <div class="titulo">${titulo}</div>
        <p>${mensaje}</p>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica info">
          <div class="valor">${formatoUnidades.format(demandaNormal)}</div>
          <div class="etiqueta">Demanda normal</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica advertencia">
          <div class="valor">${formatoUnidades.format(nuevaDemanda)}</div>
          <div class="etiqueta">Nueva demanda</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica ${clase}">
          <div class="valor">${stockRestante >= 0 ? formatoUnidades.format(stockRestante) : formatoUnidades.format(deficit)}</div>
          <div class="etiqueta">${stockRestante >= 0 ? "Stock restante" : "Déficit"}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica ${clase}">
          <div class="valor">${familiasAfectadas}</div>
          <div class="etiqueta">Familias afectadas</div>
        </div>
      </div>
    </div>

    <h5 class="mb-3">Comparación visual de demanda y stock</h5>
    <div class="caja-simulador mb-4" style="padding:24px;">
      ${construirBarra("Demanda normal", demandaNormal, maximoBarras, "barra-normal")}
      ${construirBarra("Demanda con rumor", nuevaDemanda, maximoBarras, stockRestante < 0 ? "barra-critica" : "barra-nueva")}
      ${construirBarra("Stock disponible", stockDisponible, maximoBarras, "barra-stock")}
    </div>

    <div class="table-responsive">
      <table class="tabla-resultado">
        <thead>
          <tr>
            <th>Indicador</th>
            <th>Valor</th>
            <th>Interpretación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Producto analizado</strong></td>
            <td>${productoAnalizado}</td>
            <td>Permite clasificar el tipo de bien afectado por el rumor de escasez.</td>
          </tr>
          <tr>
            <td><strong>Aumento por rumor</strong></td>
            <td>${formatoUnidades.format(diferenciaDemanda)} unidades (${aumentoRumor}%)</td>
            <td>Compra adicional provocada por temor a quedarse sin producto.</td>
          </tr>
          <tr>
            <td><strong>Cobertura del stock</strong></td>
            <td>${formatoUnidades.format(cobertura)}%</td>
            <td>Porcentaje de la nueva demanda que puede cubrirse con el stock actual.</td>
          </tr>
          <tr class="fila-${clase}">
            <td><strong>Resultado final</strong></td>
            <td>${stockRestante >= 0 ? `${formatoUnidades.format(stockRestante)} unidades restantes` : `${formatoUnidades.format(deficit)} unidades faltantes`}</td>
            <td>${stockRestante >= 0 ? "El abastecimiento alcanza para el escenario ingresado." : "La comunidad entra en desabastecimiento por exceso de demanda."}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("contenido-resultados-panico").innerHTML = contenido;
  document.getElementById("resultados-panico").classList.add("visible");
  document.getElementById("resultados-panico").scrollIntoView({ behavior: "smooth", block: "start" });
}

function limpiarFormularioPanico() {
  document.getElementById("formulario-panico").reset();
  ["demandaNormal", "aumentoRumor", "stockDisponible", "numeroFamilias"].forEach((id) => marcarPanico(id, false));
  limpiarAlertaPanico();
  document.getElementById("contenido-resultados-panico").innerHTML = "";
  document.getElementById("resultados-panico").classList.remove("visible");
}

function aplicarCasoPanico1() {
  document.getElementById("productoAnalizado").value = "alimentos";
  document.getElementById("demandaNormal").value = 100;
  document.getElementById("aumentoRumor").value = 40;
  document.getElementById("stockDisponible").value = 120;
  document.getElementById("numeroFamilias").value = 50;
  calcularPanico();
}

function aplicarCasoPanico2() {
  document.getElementById("productoAnalizado").value = "aceite";
  document.getElementById("demandaNormal").value = 180;
  document.getElementById("aumentoRumor").value = 65;
  document.getElementById("stockDisponible").value = 240;
  document.getElementById("numeroFamilias").value = 80;
  calcularPanico();
}
