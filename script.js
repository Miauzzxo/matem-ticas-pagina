const botonGenerar = document.getElementById("btn-generar");
const valorB = document.getElementById("valor-b");
const valorC = document.getElementById("valor-c");
const mensaje = document.getElementById("mensaje");
const tarjetaLineal = document.getElementById("tarjeta-lineal");
const tarjetaAfin = document.getElementById("tarjeta-afin");
const estadoLineal = document.getElementById("estado-lineal");
const estadoAfin = document.getElementById("estado-afin");

const canvas = document.getElementById("plano-cartesiano");
const ctx = canvas.getContext("2d");
const expresionGrafica = document.getElementById("expresion-grafica");
const ayudaGrafica = document.getElementById("ayuda-grafica");

let funcionActual = null;
let escala = 10;

function numeroAleatorio() {
  return Math.floor(Math.random() * 7) - 3;
}

function limpiarClasificacion() {
  tarjetaLineal.classList.remove("activa");
  tarjetaAfin.classList.remove("activa");
  estadoLineal.textContent = "No corresponde";
  estadoAfin.textContent = "No corresponde";
}

function generarFuncion() {
  const b = numeroAleatorio();
  const c = numeroAleatorio();

  valorB.textContent = b;
  valorC.textContent = c;
  limpiarClasificacion();

  if (b === 0 && c === 0) {
    mensaje.textContent = "b y c son 0: no se genera ninguna función.";
    funcionActual = null;
    expresionGrafica.textContent = "f(x) = —";
    ayudaGrafica.textContent = "No se dibuja ninguna función porque b y c son 0.";
    dibujarPlano();
    return;
  }

  if (c === 0) {
    tarjetaLineal.classList.add("activa");
    estadoLineal.textContent = "Función obtenida";
    mensaje.textContent = `La función es lineal: f(x) = ${b}x.`;
  } else {
    tarjetaAfin.classList.add("activa");
    estadoAfin.textContent = "Función obtenida";
    const signo = c > 0 ? "+" : "−";
    mensaje.textContent = `La función es afín: f(x) = ${b}x ${signo} ${Math.abs(c)}.`;
  }

  funcionActual = { b, c };
  const signo = c > 0 ? "+" : "−";
  expresionGrafica.textContent = c === 0
    ? `f(x) = ${b}x`
    : `f(x) = ${b}x ${signo} ${Math.abs(c)}`;
  ayudaGrafica.textContent = "La recta representa la función en el plano cartesiano.";
  dibujarPlano();
}

function dibujarPlano() {
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;
  if (!ancho || !alto) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(ancho * dpr);
  canvas.height = Math.round(alto * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const centroX = ancho / 2;
  const centroY = alto / 2;
  const pixelesPorUnidad = Math.min(ancho, alto) / escala;
  const px = x => centroX + x * pixelesPorUnidad;
  const py = y => centroY - y * pixelesPorUnidad;

  ctx.clearRect(0, 0, ancho, alto);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, ancho, alto);

  // Cuadrícula principal y secundaria al estilo de un graficador.
  const paso = escala <= 8 ? 2 : 1;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#e8eeeb";
  for (let x = Math.ceil(-centroX / pixelesPorUnidad); x <= Math.floor((ancho - centroX) / pixelesPorUnidad); x += paso) {
    ctx.beginPath(); ctx.moveTo(px(x), 0); ctx.lineTo(px(x), alto); ctx.stroke();
  }
  for (let y = Math.ceil(-centroY / pixelesPorUnidad); y <= Math.floor((alto - centroY) / pixelesPorUnidad); y += paso) {
    ctx.beginPath(); ctx.moveTo(0, py(y)); ctx.lineTo(ancho, py(y)); ctx.stroke();
  }

  // Ejes cartesianos.
  ctx.strokeStyle = "#394b46";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(0, centroY); ctx.lineTo(ancho, centroY);
  ctx.moveTo(centroX, 0); ctx.lineTo(centroX, alto);
  ctx.stroke();

  // Marcas, números y nombres de los ejes.
  ctx.fillStyle = "#596b65";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const xInicio = Math.ceil(-centroX / pixelesPorUnidad);
  const xFin = Math.floor((ancho - centroX) / pixelesPorUnidad);
  for (let x = xInicio; x <= xFin; x++) {
    if (x !== 0 && x % paso === 0) {
      ctx.beginPath(); ctx.moveTo(px(x), centroY - 4); ctx.lineTo(px(x), centroY + 4); ctx.stroke();
      ctx.fillText(String(x), px(x), centroY + 7);
    }
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const yInicio = Math.ceil(-centroY / pixelesPorUnidad);
  const yFin = Math.floor(centroY / pixelesPorUnidad);
  for (let y = yInicio; y <= yFin; y++) {
    if (y !== 0 && y % paso === 0) {
      ctx.beginPath(); ctx.moveTo(centroX - 4, py(y)); ctx.lineTo(centroX + 4, py(y)); ctx.stroke();
      ctx.fillText(String(y), centroX - 8, py(y));
    }
  }
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("x", ancho - 17, centroY + 9);
  ctx.fillText("y", centroX + 9, 5);
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("0", centroX - 8, centroY + 7);

  // Recta y punto de intersección con el eje Y.
  if (funcionActual) {
    const { b, c } = funcionActual;
    const xIzq = (0 - centroX) / pixelesPorUnidad;
    const xDer = (ancho - centroX) / pixelesPorUnidad;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, ancho, alto);
    ctx.clip();
    ctx.strokeStyle = "#16866b";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(px(xIzq), py(b * xIzq + c));
    ctx.lineTo(px(xDer), py(b * xDer + c));
    ctx.stroke();

    ctx.fillStyle = "#16866b";
    ctx.beginPath();
    ctx.arc(px(0), py(c), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

document.getElementById("zoom-mas").addEventListener("click", () => {
  escala = Math.max(4, escala - 2);
  dibujarPlano();
});
document.getElementById("zoom-menos").addEventListener("click", () => {
  escala = Math.min(30, escala + 2);
  dibujarPlano();
});
document.getElementById("zoom-reset").addEventListener("click", () => {
  escala = 10;
  dibujarPlano();
});

botonGenerar.addEventListener("click", generarFuncion);
window.addEventListener("resize", dibujarPlano);
dibujarPlano();

const selectorArchivo = document.getElementById("archivo-ggb");
const nombreArchivo = document.getElementById("nombre-archivo");
selectorArchivo.addEventListener("change", () => {
  const archivo = selectorArchivo.files[0];
  nombreArchivo.textContent = archivo ? archivo.name : "Ningún archivo seleccionado";
});
