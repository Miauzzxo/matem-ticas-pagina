const botonGenerar = document.getElementById("btn-generar");
const valorB = document.getElementById("valor-b");
const valorC = document.getElementById("valor-c");
const mensaje = document.getElementById("mensaje");

const tarjetaLineal = document.getElementById("tarjeta-lineal");
const tarjetaAfin = document.getElementById("tarjeta-afin");
const estadoLineal = document.getElementById("estado-lineal");
const estadoAfin = document.getElementById("estado-afin");

function numeroAleatorio() {
  // Math.random() permite obtener enteros entre -3 y 3, incluyendo ambos extremos.
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

  // Si los dos coeficientes son cero, no se muestra ninguna clasificación.
  if (b === 0 && c === 0) {
    mensaje.textContent = "b y c son 0: no se genera ninguna función.";
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
}

botonGenerar.addEventListener("click", generarFuncion);

const selectorArchivo = document.getElementById("archivo-ggb");
const nombreArchivo = document.getElementById("nombre-archivo");

selectorArchivo.addEventListener("change", () => {
  const archivo = selectorArchivo.files[0];

  if (!archivo) {
    nombreArchivo.textContent = "Ningún archivo seleccionado";
    return;
  }

  nombreArchivo.textContent = archivo.name;
});


// Plano cartesiano: dibuja automáticamente la recta de la función generada.
const canvas = document.getElementById("plano-cartesiano");
const contexto = canvas.getContext("2d");
const expresionGrafica = document.getElementById("expresion-grafica");
const ayudaGrafica = document.getElementById("ayuda-grafica");
let funcionActual = null;

function dibujarPlano() {
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;
  const dpi = window.devicePixelRatio || 1;
  canvas.width = Math.round(ancho * dpi);
  canvas.height = Math.round(alto * dpi);
  contexto.setTransform(dpi, 0, 0, dpi, 0, 0);

  const margen = 34, min = -5, max = 5;
  const px = x => margen + ((x - min) / (max - min)) * (ancho - margen * 2);
  const py = y => alto - margen - ((y - min) / (max - min)) * (alto - margen * 2);

  contexto.clearRect(0, 0, ancho, alto);
  contexto.fillStyle = "#fbfefd";
  contexto.fillRect(0, 0, ancho, alto);

  contexto.strokeStyle = "#e4eeea";
  contexto.lineWidth = 1;
  for (let n = -5; n <= 5; n++) {
    contexto.beginPath(); contexto.moveTo(px(n), margen); contexto.lineTo(px(n), alto - margen); contexto.stroke();
    contexto.beginPath(); contexto.moveTo(margen, py(n)); contexto.lineTo(ancho - margen, py(n)); contexto.stroke();
  }

  contexto.strokeStyle = "#385b53";
  contexto.lineWidth = 1.8;
  contexto.beginPath();
  contexto.moveTo(px(min), py(0)); contexto.lineTo(px(max), py(0));
  contexto.moveTo(px(0), py(min)); contexto.lineTo(px(0), py(max));
  contexto.stroke();

  contexto.fillStyle = "#71817c";
  contexto.font = "11px Arial";
  contexto.textAlign = "center"; contexto.textBaseline = "top";
  for (let n = -5; n <= 5; n++) if (n !== 0) contexto.fillText(String(n), px(n), py(0) + 7);
  contexto.textAlign = "right"; contexto.textBaseline = "middle";
  for (let n = -5; n <= 5; n++) if (n !== 0) contexto.fillText(String(n), px(0) - 7, py(n));
  contexto.textAlign = "left"; contexto.textBaseline = "top";
  contexto.fillText("x", px(max) - 12, py(0) + 8);
  contexto.fillText("y", px(0) + 8, py(max) + 4);

  if (funcionActual) {
    const { b, c } = funcionActual;
    contexto.save();
    contexto.beginPath(); contexto.rect(margen, margen, ancho - 2*margen, alto - 2*margen); contexto.clip();
    contexto.strokeStyle = "#16866b"; contexto.lineWidth = 3; contexto.beginPath();
    for (let i = 0; i <= 400; i++) {
      const x = min + (max - min) * i / 400;
      const y = b * x + c;
      if (i === 0) contexto.moveTo(px(x), py(y)); else contexto.lineTo(px(x), py(y));
    }
    contexto.stroke(); contexto.restore();
  }
}

function actualizarGrafica(b, c) {
  funcionActual = { b, c };
  const signo = c > 0 ? "+" : "−";
  expresionGrafica.textContent = c === 0
    ? `f(x) = ${b}x`
    : `f(x) = ${b}x ${signo} ${Math.abs(c)}`;
  ayudaGrafica.textContent = "La recta representa la función en el plano cartesiano.";
  dibujarPlano();
}

function borrarGrafica() {
  funcionActual = null;
  expresionGrafica.textContent = "f(x) = —";
  ayudaGrafica.textContent = "No se dibuja ninguna función porque b y c son 0.";
  dibujarPlano();
}

window.addEventListener("resize", dibujarPlano);
dibujarPlano();

// Integra la gráfica con el botón generador ya definido.
const generarFuncionConGrafica = generarFuncion;
generarFuncion = function () {
  generarFuncionConGrafica();
  const b = Number(valorB.textContent);
  const c = Number(valorC.textContent);
  if (b === 0 && c === 0) borrarGrafica();
  else actualizarGrafica(b, c);
};


// El botón también actualiza el plano después de generar los nuevos coeficientes.
botonGenerar.addEventListener("click", () => {
  const bActual = Number(valorB.textContent);
  const cActual = Number(valorC.textContent);
  if (bActual === 0 && cActual === 0) {
    borrarGrafica();
  } else {
    actualizarGrafica(bActual, cActual);
  }
});
