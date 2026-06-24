var IDS_2D = ['ax', 'ay', 'bx', 'by'];
var IDS_3D = ['ax', 'ay', 'az', 'bx', 'by', 'bz'];

function onDimChange() {
  var dim = parseInt(document.getElementById('dimSelect').value);
  var show3d = dim === 3;
  document.getElementById('az-wrap').style.display = show3d ? 'inline' : 'none';
  document.getElementById('bz-wrap').style.display = show3d ? 'inline' : 'none';
  hideResult();
  hideError();
  clearErrors();
  drawSegment();
}

function getVal(id) {
  return document.getElementById(id).value.trim();
}

function validate() {
  var dim = parseInt(document.getElementById('dimSelect').value);
  var ids = dim === 3 ? IDS_3D : IDS_2D;
  var errors = [];

  clearErrors();

  ids.forEach(function(id) {
    var raw = getVal(id);

    if (raw === '' || isNaN(Number(raw))) {
      markError(id);
      errors.push('El campo <strong>' + id.toUpperCase() + '</strong> contiene un valor no numérico o está vacío.');
      return;
    }

    var num = parseFloat(raw);
    if (num <= 0) {
      markError(id);
      errors.push('El campo <strong>' + id.toUpperCase() + '</strong> debe ser mayor a cero (valor ingresado: ' + num + ').');
    }
  });

  return errors;
}

function markError(id) {
  document.getElementById(id).classList.add('input-error');
}

function clearErrors() {
  var all = IDS_3D;
  all.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('input-error');
  });
}

function showError(errors) {
  var box = document.getElementById('errorBox');
  var list = document.getElementById('errorList');
  list.innerHTML = errors.map(function(e) { return '<li>' + e + '</li>'; }).join('');
  box.style.display = 'block';
}

function hideError() {
  document.getElementById('errorBox').style.display = 'none';
}

function hideResult() {
  document.getElementById('resultBox').style.display = 'none';
}

function calculate() {
  hideError();
  hideResult();

  var errors = validate();
  if (errors.length > 0) {
    showError(errors);
    return;
  }

  var dim = parseInt(document.getElementById('dimSelect').value);
  var ax = parseFloat(getVal('ax'));
  var ay = parseFloat(getVal('ay'));
  var bx = parseFloat(getVal('bx'));
  var by = parseFloat(getVal('by'));

  var dist;
  if (dim === 2) {
    dist = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
  } else {
    var az = parseFloat(getVal('az'));
    var bz = parseFloat(getVal('bz'));
    dist = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2) + Math.pow(bz - az, 2));
  }

  document.getElementById('resultValue').textContent = dist;
  document.getElementById('resultBox').style.display = 'block';

  drawSegment();
}

function drawSegment() {
  var canvas = document.getElementById('segCanvas');
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

drawSegment();
