
// Constantes: referencias a los elementos de la página que vamos a actualizar.
const botonGenerar = document.getElementById("btn-generar");
const valorB = document.getElementById("valor-b");
const valorC = document.getElementById("valor-c");
const mensaje = document.getElementById("mensaje");

// Tarjetas y etiquetas que indican qué clasificación corresponde.
const tarjetaLineal = document.getElementById("tarjeta-lineal");
const tarjetaAfin = document.getElementById("tarjeta-afin");
const tarjetaConstante = document.getElementById("tarjeta-constante");
const estadoLineal = document.getElementById("estado-lineal");
const estadoAfin = document.getElementById("estado-afin");
const estadoConstante = document.getElementById("estado-constante");

// Elementos usados para dibujar el plano cartesiano.
const canvas = document.getElementById("plano-cartesiano");
const ctx = canvas.getContext("2d");
const expresionGrafica = document.getElementById("expresion-grafica");
const ayudaGrafica = document.getElementById("ayuda-grafica");

// let permite cambiar estos valores durante el funcionamiento de la página.
let funcionActual = null; // Guarda b y c de la función que se dibujará.
let escala = 10; // Controla el zoom del plano cartesiano.


// ==================================================
// 2. GENERAR NÚMEROS ALEATORIOS ENTRE -3 Y 3
// ==================================================

function numeroAleatorio() {
  // Math.random() genera un decimal entre 0 y 1.
  // Con Math.floor y las operaciones siguientes obtenemos enteros de -3 a 3.
  return Math.floor(Math.random() * 7) - 3;
}


// ==================================================
// 3. REINICIAR LAS TARJETAS DE CLASIFICACIÓN
// ==================================================

function limpiarClasificacion() {
  // Quitamos el resaltado de las tres tarjetas.
  tarjetaLineal.classList.remove("activa");
  tarjetaAfin.classList.remove("activa");
  tarjetaConstante.classList.remove("activa");

  // Indicamos que ninguna clasificación está seleccionada todavía.
  estadoLineal.textContent = "No corresponde";
  estadoAfin.textContent = "No corresponde";
  estadoConstante.textContent = "No corresponde";
}


// ==================================================
// 4. GENERAR Y CLASIFICAR LA FUNCIÓN
// ==================================================

function generarFuncion() {
  // Creamos dos coeficientes aleatorios.
  const b = numeroAleatorio();
  const c = numeroAleatorio();

  // Mostramos los coeficientes en pantalla.
  valorB.textContent = b;
  valorC.textContent = c;
  limpiarClasificacion();

  // Si ambos son cero, no se crea ni se dibuja ninguna función.
  if (b === 0 && c === 0) {
    mensaje.textContent = "b y c son 0: no se genera ninguna función.";
    funcionActual = null;
    expresionGrafica.textContent = "f(x) = —";
    ayudaGrafica.textContent = "No se dibuja ninguna función porque b y c son 0.";
    dibujarPlano();
    return; // Detiene aquí la función para no entrar en las otras condiciones.
  }

  // FUNCIÓN LINEAL: pendiente b distinta de cero y término independiente c igual a cero.
  if (b !== 0 && c === 0) {
    tarjetaLineal.classList.add("activa");
    estadoLineal.textContent = "Función obtenida";
    mensaje.textContent = `La función es lineal: f(x) = ${b}x.`;
  }

  // FUNCIÓN AFÍN: pendiente b y término independiente c distintos de cero.
  else if (b !== 0 && c !== 0) {
    tarjetaAfin.classList.add("activa");
    estadoAfin.textContent = "Función obtenida";
    const signo = c > 0 ? "+" : "−";
    mensaje.textContent = `La función es afín: f(x) = ${b}x ${signo} ${Math.abs(c)}.`;
  }

  // FUNCIÓN CONSTANTE: pendiente b igual a cero y c distinto de cero.
  else if (b === 0 && c !== 0) {
    tarjetaConstante.classList.add("activa");
    estadoConstante.textContent = "Función obtenida";
    mensaje.textContent = `La función es constante: f(x) = ${c}.`;
  }

  // Guardamos los valores para que la función de dibujo pueda usarlos.
  funcionActual = { b, c };

  // Preparamos la expresión que se verá encima del gráfico.
  const signo = c > 0 ? "+" : "−";
  if (b === 0) {
    expresionGrafica.textContent = `f(x) = ${c}`;
  } else if (c === 0) {
    expresionGrafica.textContent = `f(x) = ${b}x`;
  } else {
    expresionGrafica.textContent = `f(x) = ${b}x ${signo} ${Math.abs(c)}`;
  }

  ayudaGrafica.textContent = "La recta representa la función en el plano cartesiano.";
  dibujarPlano(); // Actualiza el plano con la nueva función.
}


// ==================================================
// 5. DIBUJAR EL PLANO CARTESIANO
// ==================================================

function dibujarPlano() {
  // Leemos el ancho y alto del espacio disponible para el gráfico.
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;
  if (!ancho || !alto) return; // Evita dibujar si el canvas todavía no tiene tamaño.

  // Ajustamos la resolución para que el dibujo se vea nítido.
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(ancho * dpr);
  canvas.height = Math.round(alto * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // El punto (0,0) se ubica en el centro del canvas.
  const centroX = ancho / 2;
  const centroY = alto / 2;
  const pixelesPorUnidad = Math.min(ancho, alto) / escala;

  // Estas funciones convierten coordenadas matemáticas en píxeles.
  const px = x => centroX + x * pixelesPorUnidad;
  const py = y => centroY - y * pixelesPorUnidad;

  // Pintamos el fondo blanco del gráfico.
  ctx.clearRect(0, 0, ancho, alto);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, ancho, alto);

  // Dibujamos la cuadrícula vertical y horizontal.
  const paso = escala <= 8 ? 2 : 1;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#e8eeeb";

  for (let x = Math.ceil(-centroX / pixelesPorUnidad);
       x <= Math.floor((ancho - centroX) / pixelesPorUnidad); x += paso) {
    ctx.beginPath();
    ctx.moveTo(px(x), 0);
    ctx.lineTo(px(x), alto);
    ctx.stroke();
  }

  for (let y = Math.ceil(-centroY / pixelesPorUnidad);
       y <= Math.floor(centroY / pixelesPorUnidad); y += paso) {
    ctx.beginPath();
    ctx.moveTo(0, py(y));
    ctx.lineTo(ancho, py(y));
    ctx.stroke();
  }

  // Dibujamos los ejes X e Y.
  ctx.strokeStyle = "#394b46";
  ctx.lineWidth = 1.7;
  ctx.beginPath();
  ctx.moveTo(0, centroY);
  ctx.lineTo(ancho, centroY);
  ctx.moveTo(centroX, 0);
  ctx.lineTo(centroX, alto);
  ctx.stroke();

  // Escribimos las coordenadas sobre el eje X.
  ctx.fillStyle = "#596b65";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const xInicio = Math.ceil(-centroX / pixelesPorUnidad);
  const xFin = Math.floor((ancho - centroX) / pixelesPorUnidad);

  for (let x = xInicio; x <= xFin; x++) {
    if (x !== 0 && x % paso === 0) {
      ctx.fillText(String(x), px(x), centroY + 7);
    }
  }

  // Escribimos las coordenadas sobre el eje Y.
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  const yInicio = Math.ceil(-centroY / pixelesPorUnidad);
  const yFin = Math.floor(centroY / pixelesPorUnidad);

  for (let y = yInicio; y <= yFin; y++) {
    if (y !== 0 && y % paso === 0) {
      ctx.fillText(String(y), centroX - 8, py(y));
    }
  }

  // Etiquetas de los ejes y número cero en el origen.
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("x", ancho - 17, centroY + 9);
  ctx.fillText("y", centroX + 9, 5);
  ctx.textAlign = "right";
  ctx.fillText("0", centroX - 8, centroY + 7);


  // ==================================================
  // 6. DIBUJAR LA RECTA DE LA FUNCIÓN
  // ==================================================

  // Si no existe una función actual, dejamos solamente el plano vacío.
  if (funcionActual) {
    const { b, c } = funcionActual;

    // Calculamos hasta dónde llega el eje X en la parte visible del gráfico.
    const xIzq = -centroX / pixelesPorUnidad;
    const xDer = (ancho - centroX) / pixelesPorUnidad;

    // Usamos la fórmula y = bx + c para obtener los puntos de la recta.
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

    // Marcamos el corte con el eje Y, que corresponde al punto (0,c).
    ctx.fillStyle = "#16866b";
    ctx.beginPath();
    ctx.arc(px(0), py(c), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}


// ==================================================
// 7. BOTONES DE ZOOM DEL PLANO
// ==================================================

// Acercar: aumenta el tamaño visual de las unidades.
document.getElementById("zoom-mas").addEventListener("click", () => {
  escala = Math.max(4, escala - 2);
  dibujarPlano();
});

// Alejar: reduce el tamaño visual de las unidades.
document.getElementById("zoom-menos").addEventListener("click", () => {
  escala = Math.min(30, escala + 2);
  dibujarPlano();
});

// Restablecer: devuelve el zoom al valor inicial.
document.getElementById("zoom-reset").addEventListener("click", () => {
  escala = 10;
  dibujarPlano();
});


// ==================================================
// 8. ACTIVAR EVENTOS Y DIBUJAR EL PLANO INICIAL
// ==================================================

// Al pulsar el botón se ejecuta la generación y clasificación.
botonGenerar.addEventListener("click", generarFuncion);

// Redibujamos el plano si cambia el tamaño de la ventana.
window.addEventListener("resize", dibujarPlano);

// Mostramos el plano vacío cuando se abre la página.
dibujarPlano();


// ==================================================
// 9. MOSTRAR EL NOMBRE DEL ARCHIVO .GGB SELECCIONADO
// ==================================================

const selectorArchivo = document.getElementById("archivo-ggb");
const nombreArchivo = document.getElementById("nombre-archivo");

selectorArchivo.addEventListener("change", () => {
  // Obtenemos el archivo elegido por el usuario.
  const archivo = selectorArchivo.files[0];

  // Si hay archivo, mostramos su nombre; si no, dejamos el texto inicial.
  nombreArchivo.textContent = archivo ? archivo.name : "Ningún archivo seleccionado";
});
