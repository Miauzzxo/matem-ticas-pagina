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
