var IDS_2D = ['ax2', 'ay2', 'bx2', 'by2'];
var IDS_3D = ['ax3', 'ay3', 'az3', 'bx3', 'by3', 'bz3'];

function getVal(id) {
  return document.getElementById(id).value.trim();
}

function validate(ids) {
  var errors = [];

  ids.forEach(function(id) {
    var el = document.getElementById(id);
    el.classList.remove('input-error');

    var raw = getVal(id);

    if (raw === '' || isNaN(Number(raw))) {
      el.classList.add('input-error');
      errors.push('El campo <strong>' + id.toUpperCase() + '</strong> contiene un valor no numérico o está vacío.');
      return;
    }

    var num = parseFloat(raw);
    if (num <= 0) {
      el.classList.add('input-error');
      errors.push('El campo <strong>' + id.toUpperCase() + '</strong> debe ser mayor a cero (valor ingresado: ' + num + ').');
    }
  });

  return errors;
}

function showError(boxId, listId, errors) {
  var box = document.getElementById(boxId);
  var list = document.getElementById(listId);
  list.innerHTML = errors.map(function(e) { return '<li>' + e + '</li>'; }).join('');
  box.style.display = 'block';
}

function hideError(boxId) {
  document.getElementById(boxId).style.display = 'none';
}

function showResult(boxId, valueId, dist) {
  document.getElementById(valueId).textContent = dist;
  document.getElementById(boxId).style.display = 'block';
}

function hideResult(boxId) {
  document.getElementById(boxId).style.display = 'none';
}

function calculate2D() {
  hideError('errorBox2D');
  hideResult('resultBox2D');

  var errors = validate(IDS_2D);
  if (errors.length > 0) {
    showError('errorBox2D', 'errorList2D', errors);
    return;
  }

  var ax = parseFloat(getVal('ax2'));
  var ay = parseFloat(getVal('ay2'));
  var bx = parseFloat(getVal('bx2'));
  var by = parseFloat(getVal('by2'));

  var dist = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
  showResult('resultBox2D', 'resultValue2D', dist);
}

function calculate3D() {
  hideError('errorBox3D');
  hideResult('resultBox3D');

  var errors = validate(IDS_3D);
  if (errors.length > 0) {
    showError('errorBox3D', 'errorList3D', errors);
    return;
  }

  var ax = parseFloat(getVal('ax3'));
  var ay = parseFloat(getVal('ay3'));
  var az = parseFloat(getVal('az3'));
  var bx = parseFloat(getVal('bx3'));
  var by = parseFloat(getVal('by3'));
  var bz = parseFloat(getVal('bz3'));

  var dist = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2) + Math.pow(bz - az, 2));
  showResult('resultBox3D', 'resultValue3D', dist);
}

function drawSegment(canvasId) {
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  var pax = W * 0.75, pay = H * 0.15;
  var pbx = W * 0.15, pby = H * 0.82;

  ctx.beginPath();
  ctx.moveTo(pbx, pby);
  ctx.lineTo(pax, pay);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(pax, pay, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#000';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(pbx, pby, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '13px Arial';
  ctx.fillText('A', pax + 7, pay + 4);
  ctx.fillText('B', pbx - 18, pby + 4);
}

drawSegment('canvas2D');
drawSegment('canvas3D');
