const formatoLitros = new Intl.NumberFormat("es-BO", {
  maximumFractionDigits: 0
});

function obtenerNumero(id) {
  const input = document.getElementById(id);
  return Number(input.value);
}

function marcarInvalido(id, invalido) {
  const input = document.getElementById(id);
  input.classList.toggle("is-invalid", invalido);
}

function mostrarAlertaCarb(tipo, mensaje) {
  const contenedor = document.getElementById("alerta-container");
  contenedor.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

function limpiarAlertaCarb() {
  document.getElementById("alerta-container").innerHTML = "";
}

function calcularDiaLimite(reserva, perdidaDiaria, limite) {
  if (reserva <= limite) return 0;
  if (perdidaDiaria <= 0) return null;
  return Math.ceil((reserva - limite) / perdidaDiaria);
}

function calcularDiaAgotamiento(reserva, perdidaDiaria) {
  if (reserva <= 0) return 0;
  if (perdidaDiaria <= 0) return null;
  return Math.ceil(reserva / perdidaDiaria);
}

function textoDia(valor) {
  if (valor === null) return "No llega";
  if (valor === 0) return "Hoy";
  return `Día ${valor}`;
}

function estadoReserva(reserva, nivelCritico) {
  if (reserva <= nivelCritico) return "critico";
  if (reserva <= nivelCritico * 1.5) return "advertencia";
  return "normal";
}

function simularDias(reservaInicial, consumoDiario, reabastecimiento, nivelCritico) {
  const perdidaDiaria = consumoDiario - reabastecimiento;
  const dias = [];
  let reserva = reservaInicial;
  const limite = perdidaDiaria <= 0 ? 15 : 30;

  for (let dia = 1; dia <= limite; dia += 1) {
    const reservaAnterior = reserva;
    reserva = Math.max(0, reserva + reabastecimiento - consumoDiario);

    dias.push({
      dia,
      reservaAnterior,
      reabastecimiento,
      consumoDiario,
      reservaFinal: reserva,
      estado: estadoReserva(reserva, nivelCritico)
    });

    if (reserva <= 0) break;
  }

  return dias;
}

function validarCarburante() {
  const campos = [
    { id: "reservaInicial", valor: obtenerNumero("reservaInicial"), valido: (v) => v > 0 },
    { id: "consumoDiario", valor: obtenerNumero("consumoDiario"), valido: (v) => v > 0 },
    { id: "reabastecimiento", valor: obtenerNumero("reabastecimiento"), valido: (v) => v >= 0 },
    { id: "nivelCritico", valor: obtenerNumero("nivelCritico"), valido: (v) => v >= 0 }
  ];

  let valido = true;
  campos.forEach((campo) => {
    const campoValido = Number.isFinite(campo.valor) && campo.valido(campo.valor);
    marcarInvalido(campo.id, !campoValido);
    if (!campoValido) valido = false;
  });

  const reservaInicial = campos[0].valor;
  const nivelCritico = campos[3].valor;
  if (Number.isFinite(reservaInicial) && Number.isFinite(nivelCritico) && nivelCritico >= reservaInicial) {
    marcarInvalido("nivelCritico", true);
    mostrarAlertaCarb("warning", "El nivel crítico debe ser menor que la reserva inicial.");
    return false;
  }

  if (!valido) {
    mostrarAlertaCarb("danger", "Completa todos los campos con números válidos antes de calcular.");
  }

  return valido;
}

function construirTablaCarburante(dias) {
  const filas = dias.map((registro) => `
    <tr class="fila-${registro.estado}">
      <td><strong>${registro.dia}</strong></td>
      <td>${formatoLitros.format(registro.reservaAnterior)} L</td>
      <td>+${formatoLitros.format(registro.reabastecimiento)} L</td>
      <td>-${formatoLitros.format(registro.consumoDiario)} L</td>
      <td><strong>${formatoLitros.format(registro.reservaFinal)} L</strong></td>
      <td><span class="badge-estado badge-${registro.estado}">${registro.estado}</span></td>
    </tr>
  `).join("");

  return `
    <div class="table-responsive">
      <table class="tabla-resultado">
        <thead>
          <tr>
            <th>Día</th>
            <th>Reserva inicial del día</th>
            <th>Reabastecimiento</th>
            <th>Consumo</th>
            <th>Reserva final</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>${filas}</tbody>
      </table>
    </div>
  `;
}

function calcularCarburante() {
  if (!validarCarburante()) return;
  limpiarAlertaCarb();

  const reservaInicial = obtenerNumero("reservaInicial");
  const consumoDiario = obtenerNumero("consumoDiario");
  const reabastecimiento = obtenerNumero("reabastecimiento");
  const nivelCritico = obtenerNumero("nivelCritico");
  const perdidaDiaria = consumoDiario - reabastecimiento;
  const consumoAlto = consumoDiario * 1.3;
  const perdidaAlta = consumoAlto - reabastecimiento;

  const diaCritico = calcularDiaLimite(reservaInicial, perdidaDiaria, nivelCritico);
  const diaAgotamiento = calcularDiaAgotamiento(reservaInicial, perdidaDiaria);
  const diaCriticoAlto = calcularDiaLimite(reservaInicial, perdidaAlta, nivelCritico);
  const diaAgotamientoAlto = calcularDiaAgotamiento(reservaInicial, perdidaAlta);
  const dias = simularDias(reservaInicial, consumoDiario, reabastecimiento, nivelCritico);

  let claseAlerta = "normal";
  let tituloAlerta = "Reserva controlada";
  let mensajeAlerta = "El reabastecimiento cubre el consumo diario. La reserva no baja hacia el nivel crítico con los datos ingresados.";

  if (perdidaDiaria > 0 && diaAgotamiento !== null) {
    claseAlerta = diaAgotamiento <= 7 ? "critico" : "advertencia";
    tituloAlerta = diaAgotamiento <= 7 ? "Agotamiento inminente" : "Reserva en descenso";
    mensajeAlerta = `Cada día se pierden ${formatoLitros.format(perdidaDiaria)} L netos. La reserva llega al nivel crítico en ${textoDia(diaCritico)} y se agota en ${textoDia(diaAgotamiento)}.`;
  }

  const contenido = `
    <div class="alerta-resultado ${claseAlerta}">
      <div class="icono-alerta"><i class="bi bi-exclamation-triangle-fill"></i></div>
      <div class="texto-alerta">
        <div class="titulo">${tituloAlerta}</div>
        <p>${mensajeAlerta}</p>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica info">
          <div class="valor">${formatoLitros.format(Math.abs(perdidaDiaria))}</div>
          <div class="etiqueta">${perdidaDiaria > 0 ? "Déficit diario (L)" : "Superávit diario (L)"}</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica ${diaCritico === null ? "normal" : "advertencia"}">
          <div class="valor">${textoDia(diaCritico)}</div>
          <div class="etiqueta">Llega a nivel crítico</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica ${diaAgotamiento === null ? "normal" : "critico"}">
          <div class="valor">${textoDia(diaAgotamiento)}</div>
          <div class="etiqueta">Agotamiento total</div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="tarjeta-metrica advertencia">
          <div class="valor">${formatoLitros.format(consumoAlto)}</div>
          <div class="etiqueta">Consumo alto (+30%)</div>
        </div>
      </div>
    </div>

    <h5 class="mt-2 mb-3">Comparación entre consumo normal y consumo alto</h5>
    <div class="table-responsive mb-4">
      <table class="tabla-resultado">
        <thead>
          <tr>
            <th>Escenario</th>
            <th>Consumo diario</th>
            <th>Pérdida neta diaria</th>
            <th>Día crítico</th>
            <th>Día de agotamiento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Consumo normal</strong></td>
            <td>${formatoLitros.format(consumoDiario)} L</td>
            <td>${perdidaDiaria > 0 ? formatoLitros.format(perdidaDiaria) : "0"} L</td>
            <td>${textoDia(diaCritico)}</td>
            <td>${textoDia(diaAgotamiento)}</td>
          </tr>
          <tr class="fila-advertencia">
            <td><strong>Consumo alto (+30%)</strong></td>
            <td>${formatoLitros.format(consumoAlto)} L</td>
            <td>${perdidaAlta > 0 ? formatoLitros.format(perdidaAlta) : "0"} L</td>
            <td>${textoDia(diaCriticoAlto)}</td>
            <td>${textoDia(diaAgotamientoAlto)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h5 class="mb-3">Evolución diaria de la reserva</h5>
    ${construirTablaCarburante(dias)}
  `;

  document.getElementById("contenido-resultados").innerHTML = contenido;
  document.getElementById("resultados").classList.add("visible");
  document.getElementById("resultados").scrollIntoView({ behavior: "smooth", block: "start" });
}

function limpiarFormularioCarb() {
  document.getElementById("formulario-carburante").reset();
  ["reservaInicial", "consumoDiario", "reabastecimiento", "nivelCritico"].forEach((id) => marcarInvalido(id, false));
  limpiarAlertaCarb();
  document.getElementById("contenido-resultados").innerHTML = "";
  document.getElementById("resultados").classList.remove("visible");
}

function aplicarCasoCarb1() {
  document.getElementById("reservaInicial").value = 10000;
  document.getElementById("consumoDiario").value = 1200;
  document.getElementById("reabastecimiento").value = 300;
  document.getElementById("nivelCritico").value = 2000;
  calcularCarburante();
}

function aplicarCasoCarb2() {
  document.getElementById("reservaInicial").value = 5000;
  document.getElementById("consumoDiario").value = 800;
  document.getElementById("reabastecimiento").value = 500;
  document.getElementById("nivelCritico").value = 1000;
  calcularCarburante();
}
