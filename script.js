// Elementos de la página
var btnGenerar = document.getElementById("btnGenerar");
var valorB = document.getElementById("valorB");
var valorC = document.getElementById("valorC");
var funcionActual = document.getElementById("funcionActual");
var mensaje = document.getElementById("mensaje");
var cajaLineal = document.getElementById("cajaLineal");
var cajaAfin = document.getElementById("cajaAfin");
var listaLineal = document.getElementById("listaLineal");
var listaAfin = document.getElementById("listaAfin");
var archivoGgb = document.getElementById("archivoGgb");
var infoArchivo = document.getElementById("infoArchivo");

// Textos por defecto de las cajas
var textoLinealInicial = "<li>Se muestra cuando c = 0.</li>";
var textoAfinInicial = "<li>Se muestra cuando c ≠ 0.</li>";

// Número entero aleatorio entre -3 y 3
function numeroAleatorio() {
  return Math.floor(Math.random() * 7) - 3;
}

// Deja las dos cajas apagadas
function limpiarCajas() {
  cajaLineal.classList.remove("activa");
  cajaAfin.classList.remove("activa");
  listaLineal.innerHTML = textoLinealInicial;
  listaAfin.innerHTML = textoAfinInicial;
}

// Arma el texto de la función, por ejemplo: f(x) = -2x + 3
function escribirFuncion(b, c) {
  if (c === 0) {
    return "f(x) = " + b + "x";
  }
  var signo = c > 0 ? "+ " + c : "- " + Math.abs(c);
  if (b === 0) {
    return "f(x) = " + c;
  }
  return "f(x) = " + b + "x " + signo;
}

// Dice cómo es la función según la pendiente
function describirPendiente(b) {
  if (b > 0) {
    return "Pendiente b = " + b + " > 0: función creciente (sube de izquierda a derecha).";
  } else if (b < 0) {
    return "Pendiente b = " + b + " < 0: función decreciente (baja de izquierda a derecha).";
  } else {
    return "Pendiente b = 0: la recta es horizontal (ni crece ni decrece).";
  }
}

// Evento del botón
btnGenerar.addEventListener("click", function () {
  var b = numeroAleatorio();
  var c = numeroAleatorio();

  valorB.textContent = b;
  valorC.textContent = c;
  limpiarCajas();

  // Caso especial: b = 0 y c = 0 -> no hay función
  if (b === 0 && c === 0) {
    funcionActual.textContent = "f(x) = ?";
    mensaje.textContent = "b y c valen 0: no se forma ninguna función. Presiona de nuevo.";
    return;
  }

  mensaje.textContent = "";
  funcionActual.textContent = escribirFuncion(b, c);

  if (c === 0) {
    // FUNCIÓN LINEAL
    cajaLineal.classList.add("activa");
    listaLineal.innerHTML =
      "<li>Expresión: f(x) = " + b + "x</li>" +
      "<li>Gráfica: línea recta continua.</li>" +
      "<li>Pasa por el origen (0, 0).</li>" +
      "<li>" + describirPendiente(b) + "</li>";
  } else {
    // FUNCIÓN AFÍN
    cajaAfin.classList.add("activa");
    listaAfin.innerHTML =
      "<li>Expresión: " + escribirFuncion(b, c) + "</li>" +
      "<li>Gráfica: línea recta que no pasa por el origen.</li>" +
      "<li>Corta el eje Y en (0, " + c + ").</li>" +
      "<li>" + describirPendiente(b) + "</li>" +
      "<li>Es una traslación vertical de f(x) = " + b + "x en " + c + " unidades.</li>";
  }
});

// Subir el archivo .ggb (se muestra el nombre y un enlace para descargarlo)
archivoGgb.addEventListener("change", function () {
  var archivo = archivoGgb.files[0];
  if (!archivo) {
    return;
  }
  if (!archivo.name.endsWith(".ggb")) {
    infoArchivo.textContent = "El archivo debe tener extensión .ggb";
    return;
  }
  var url = URL.createObjectURL(archivo);
  infoArchivo.innerHTML = 'Archivo cargado: <a href="' + url + '" download="' + archivo.name + '">' + archivo.name + "</a>";
});

