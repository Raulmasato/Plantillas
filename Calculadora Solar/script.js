const radios = document.querySelectorAll('input[name="tipo"]');
const camposComunes = document.getElementById('campos-comunes');
const camposSuperficie = document.getElementById('campos-superficie');
const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');
const resultadoTexto = document.getElementById('resultado-texto');
const btnLimpiar = document.getElementById('btn-limpiar');

let tipoCalculo = null;

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    tipoCalculo = radio.value;
    camposComunes.classList.remove('hidden');
    resultado.classList.add('hidden');

    if (tipoCalculo === 'superficie') {
      camposSuperficie.classList.remove('hidden');
    } else {
      camposSuperficie.classList.add('hidden');
    }

    limpiarErrores();
  });
});

formulario.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!tipoCalculo) return;

  const valido = validarCampos();
  if (!valido) return;

  const consumo = parseFloat(document.getElementById('consumo').value);
  const compensacion = parseFloat(document.getElementById('compensacion').value) / 100;
  const factor = parseFloat(document.getElementById('factor').value) / 100;
  const horas = parseFloat(document.getElementById('horas').value);

  if (tipoCalculo === 'campo') {
    const campoSolar = (consumo * compensacion * factor) / (horas * 365);
    mostrarResultado(
      campoSolar.toFixed(3) + ' kW',
      'Potencia estimada del campo solar necesaria'
    );
  } else {
    const potenciaPanel = parseFloat(document.getElementById('potencia-panel').value);
    const superficiePanel = parseFloat(document.getElementById('superficie-panel').value);

    const superficieTotal = (consumo * compensacion * factor * superficiePanel) / (horas * 365 * potenciaPanel);
    mostrarResultado(
      superficieTotal.toFixed(2) + ' m²',
      'Superficie de tejado requerida'
    );
  }
});

btnLimpiar.addEventListener('click', () => {
  formulario.reset();
  resultado.classList.add('hidden');
  limpiarErrores();

  // deseleccionar radios y ocultar el form
  radios.forEach(r => r.checked = false);
  camposComunes.classList.add('hidden');
  camposSuperficie.classList.add('hidden');
  tipoCalculo = null;
});

function mostrarResultado(valor, descripcion) {
  resultadoTexto.innerHTML = valor + '<p class="detalle">' + descripcion + '</p>';
  resultado.classList.remove('hidden');
}

function validarCampos() {
  let ok = true;
  limpiarErrores();

  const campos = [
    { id: 'consumo', errId: 'err-consumo', label: 'Consumo anual', min: 0 },
    { id: 'compensacion', errId: 'err-compensacion', label: 'Porcentaje de compensación', min: 0, max: 100 },
    { id: 'factor', errId: 'err-factor', label: 'Factor medioambiental', min: 0, max: 100 },
    { id: 'horas', errId: 'err-horas', label: 'Horas solares por día', min: 0, max: 24 },
  ];

  if (tipoCalculo === 'superficie') {
    campos.push({ id: 'potencia-panel', errId: 'err-potencia-panel', label: 'Potencia por panel', min: 0.001 });
    campos.push({ id: 'superficie-panel', errId: 'err-superficie-panel', label: 'Superficie por panel', min: 0.001 });
  }

  campos.forEach(campo => {
    const input = document.getElementById(campo.id);
    const errSpan = document.getElementById(campo.errId);
    const val = input.value.trim();

    if (val === '') {
      errSpan.textContent = campo.label + ' es obligatorio.';
      input.classList.add('input-error');
      ok = false;
      return;
    }

    const num = parseFloat(val);
    if (isNaN(num)) {
      errSpan.textContent = 'Ingresá un número válido.';
      input.classList.add('input-error');
      ok = false;
      return;
    }

    if (campo.min !== undefined && num < campo.min) {
      errSpan.textContent = 'El valor debe ser mayor a ' + campo.min + '.';
      input.classList.add('input-error');
      ok = false;
      return;
    }

    if (campo.max !== undefined && num > campo.max) {
      errSpan.textContent = 'El valor no puede superar ' + campo.max + '.';
      input.classList.add('input-error');
      ok = false;
    }
  });

  return ok;
}

function limpiarErrores() {
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}
