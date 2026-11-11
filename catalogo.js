/* Obsidiana · catálogo: datos de ejemplo (ficticios) y demostraciones. No forma parte del sistema. */
(function () {
  "use strict";
  var O = window.Obsidiana;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var esc = O.utilidades.escapar;
  var fmt = O.utilidades.formatear;

  /* ---------- Datos de ejemplo ---------- */
  var CLIENTES = ["Altamira", "Nordika", "Brisa Textil", "Corvel Industrial", "Lumen Andino", "Ferrovía Sur", "Tessera Diseño", "Quanta Labs", "Monteverde Café", "Arco Norte"];
  var PRODUCTOS = ["Paneles acústicos", "Mobiliario modular", "Luminarias LED", "Sillas de trabajo", "Señalética interior", "Mamparas de vidrio", "Alfombra modular", "Estanterías metálicas"];
  var CIUDADES = ["Bogotá", "Medellín", "Lima", "Quito", "Santiago", "Cali", "Guadalajara", "Ciudad de Panamá"];
  var PERSONAS = ["Ana Navarro", "Bruno Salas", "Carla Ríos", "Diego Mora", ""];
  var ESTADOS = [["pendiente", "Pendiente"], ["en-proceso", "En proceso"], ["en-curso", "En curso"], ["completado", "Completado"], ["completado", "Completado"], ["completado", "Completado"], ["anulado", "Anulado"]];
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  var semilla = 7;
  function azar() { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; }
  function elegir(l) { return l[Math.floor(azar() * l.length)]; }
  var PEDIDOS = [];
  for (var i = 0; i < 48; i++) {
    var e = elegir(ESTADOS);
    var cant = Math.round(20 + azar() * 2400);
    PEDIDOS.push({
      id: "PE-" + (26014 + i), cliente: elegir(CLIENTES), estado: e[0], estadoTexto: e[1], producto: elegir(PRODUCTOS),
      cantidad: cant, valor: Math.round(cant * (180 + azar() * 520)), ciudad: elegir(CIUDADES), responsable: elegir(PERSONAS),
      dia: 1 + Math.floor(azar() * 28), mes: 10 + Math.floor(azar() * 2)
    });
  }
  function entrega(p) { return p.estado === "anulado" ? "" : (p.dia < 10 ? "0" : "") + p.dia + " " + MESES[p.mes] + " 2026"; }
  function fila(p, abrir) {
    return '<tr data-fila data-id="' + p.id + '"' + (abrir ? ' data-ob-abrir="ventana-pedido" data-abrible' : " data-abrible") + ">" +
      '<td data-fija data-codigo><div class="ob-tabla__celda-fija">' + p.id + "</div></td>" +
      "<td>" + esc(p.cliente) + "</td>" +
      '<td><span class="ob-pildora" data-estado="' + p.estado + '"><span class="ob-glifo"></span>' + p.estadoTexto + "</span></td>" +
      '<td data-tono="secundario" title="' + esc(p.producto) + '">' + esc(p.producto) + "</td>" +
      '<td data-alineacion="derecha">' + fmt(p.cantidad) + "</td>" +
      '<td data-alineacion="derecha">' + fmt(p.valor) + "</td>" +
      '<td data-tono="secundario">' + esc(p.ciudad) + "</td>" +
      (abrir ? "" : "<td>" + (p.responsable ? esc(p.responsable) : '<span class="ob-vacio-valor">—</span>') + "</td>") +
      '<td data-tono="secundario">' + (entrega(p) || '<span class="ob-vacio-valor">—</span>') + "</td></tr>";
  }

  /* ---------- Tabla de datos (Datos) ---------- */
  var td = { pagina: 0, tam: 12, busqueda: "", sel: {}, orden: { col: 5, dir: "descending" } };
  var CAMPOS = ["id", "cliente", "estadoTexto", "producto", "cantidad", "valor", "ciudad", "responsable", "dia"];
  function filtrar(lista, busqueda, sel) {
    var t = O.utilidades.normalizar(busqueda);
    return lista.filter(function (p) {
      if (t && O.utilidades.normalizar(p.id + " " + p.cliente + " " + p.ciudad + " " + p.producto).indexOf(t) < 0) return false;
      if (sel.estado && sel.estado.indexOf(p.estado) < 0) return false;
      if (sel.ciudad && sel.ciudad.indexOf(p.ciudad) < 0) return false;
      if (sel.cliente && sel.cliente.indexOf(p.cliente) < 0) return false;
      return true;
    });
  }
  function ordenar(lista, o) {
    if (!o.dir) return lista;
    var k = CAMPOS[o.col];
    return lista.slice().sort(function (a, b) {
      var x = a[k], y = b[k];
      var r = typeof x === "number" ? x - y : String(x).localeCompare(String(y), "es");
      return o.dir === "descending" ? -r : r;
    });
  }
  // Opciones de los filtros (antes de que obsidiana.js los inicie)
  function opciones(lista, clave) {
    var cuenta = {};
    PEDIDOS.forEach(function (p) { cuenta[p[clave]] = (cuenta[p[clave]] || 0) + 1; });
    return lista.filter(function (v) { return cuenta[v]; }).map(function (v) {
      return '<label class="ob-filtros__opcion"><span class="ob-casilla"><input type="checkbox" value="' + esc(v) + '"></span><span class="ob-filtros__opcion-texto">' + esc(v) + '</span><span class="ob-filtros__cuenta">' + cuenta[v] + "</span></label>";
    }).join("");
  }
  var pc = $('[data-cat-opciones="ciudad"]'); if (pc) pc.innerHTML = opciones(CIUDADES, "ciudad");
  var pcl = $('[data-cat-opciones="cliente"]'); if (pcl) pcl.innerHTML = opciones(CLIENTES, "cliente");
  $$("[data-cuenta]").forEach(function (s) {
    s.textContent = PEDIDOS.filter(function (p) { return p.estado === s.getAttribute("data-cuenta"); }).length;
  });
  var marco = $("#cat-tabla-marco");
  if (marco) marco.setAttribute("data-orden-externo", "");
  var paginaTabla = null;
  function pintarTabla() {
    var lista = ordenar(filtrar(PEDIDOS, td.busqueda, td.sel), td.orden);
    var total = Math.max(1, Math.ceil(lista.length / td.tam));
    td.pagina = Math.min(td.pagina, total - 1);
    var vista = lista.slice(td.pagina * td.tam, (td.pagina + 1) * td.tam);
    var cuerpo = $("#cat-tabla tbody");
    cuerpo.innerHTML = vista.length
      ? vista.map(function (p) { return fila(p, false); }).join("")
      : '<tr><td class="ob-tabla__celda-completa" colspan="9"><div class="ob-vacio ob-vacio--compacto">' + O.vacio.dibujo("busqueda") +
        '<div class="ob-vacio__textos"><p class="ob-vacio__titulo">Sin resultados</p><p class="ob-vacio__descripcion">Ningún pedido coincide con la búsqueda y los filtros.</p></div></div></td></tr>';
    $$("tr[data-fila]", cuerpo).forEach(function (f, i) { f.tabIndex = i === 0 ? 0 : -1; });
    var desde = lista.length ? td.pagina * td.tam + 1 : 0;
    $(".ob-tabla__conteo", marco).innerHTML = lista.length ? "<b>" + desde + "–" + (desde + vista.length - 1) + "</b> de " + lista.length + " pedidos" : "Sin pedidos";
    $("#cat-tabla-conteo").textContent = lista.length + " de " + PEDIDOS.length;
    if (paginaTabla) paginaTabla.fijar(td.pagina, total);
  }
  if (marco) {
    paginaTabla = O.paginacion("#cat-tabla-paginacion", { pagina: 0, total: 4, alCambiar: function (p) { td.pagina = p; pintarTabla(); } });
    pintarTabla();
    $("#cat-tabla-buscar").addEventListener("input", function (e) { td.busqueda = e.target.value; td.pagina = 0; pintarTabla(); });
    document.addEventListener("ob:filtros", function (e) { if (e.target.id === "filtros-pedidos") { td.sel = e.detail.seleccion; td.pagina = 0; pintarTabla(); } });
    marco.addEventListener("ob:orden", function (e) { td.orden = { col: e.detail.columna, dir: e.detail.direccion }; pintarTabla(); });
    $("#cat-densidad").addEventListener("ob:cambio", function (e) {
      $("#cat-tabla").setAttribute("data-densidad", e.detail.valor === "compacta" ? "compacta" : "normal");
    });
    $(".ob-tabla__por-pagina select", marco).addEventListener("change", function (e) { td.tam = Number(e.target.value); td.pagina = 0; pintarTabla(); });
  }

  /* ---------- Patrón: pantalla de lista ---------- */
  var pl = { estado: "todos", busqueda: "", pagina: 0 };
  var tira = $("#pl-tira");
  if (tira) {
    var grupos = [["todos", "Todos", null], ["pendiente", "Pendientes", "anillo"], ["en-proceso", "En proceso", "medio"], ["en-curso", "En curso", "rombo"], ["completado", "Completados", "lleno"]];
    var TONO = { pendiente: "--ambar", "en-proceso": "--acento", "en-curso": "--vivo", completado: "--verde" };
    var html = grupos.map(function (g) {
      var l = g[0] === "todos" ? PEDIDOS : PEDIDOS.filter(function (p) { return p.estado === g[0]; });
      var kg = l.reduce(function (s, p) { return s + p.cantidad; }, 0);
      return '<button type="button" class="ob-tira__elemento" aria-pressed="' + (g[0] === "todos") + '" data-valor="' + g[0] + '"><span class="ob-tira__etiqueta">' +
        (g[2] ? '<span class="ob-glifo" data-forma="' + g[2] + '" style="--ob-glifo: var(' + TONO[g[0]] + ')"></span>' : "") + g[1] +
        '</span><span class="ob-tira__valor"><span class="ob-tira__numero" data-ob-cifra="' + l.length + '">' + l.length + '</span><span class="ob-tira__secundario">' + fmt(kg) + " u</span></span></button>";
    }).join("");
    var saldo = PEDIDOS.filter(function (p) { return p.estado !== "completado" && p.estado !== "anulado"; }).reduce(function (s, p) { return s + p.valor; }, 0);
    html += '<div class="ob-tira__elemento"><span class="ob-tira__etiqueta">Saldo pendiente</span><span class="ob-tira__valor"><span class="ob-tira__numero"><span class="ob-tira__prefijo">USD</span><span data-ob-cifra="' + saldo + '">' + fmt(saldo) + "</span></span></span></div>";
    tira.innerHTML = html;
    var plPag = O.paginacion("#pl-paginacion", { pagina: 0, total: 3, alCambiar: function (p) { pl.pagina = p; pintarPL(); } });
    var plMarco = $("#pl-tabla-marco");
    plMarco.setAttribute("data-orden-externo", "");
    var plOrden = { col: 0, dir: null };
    var pintarPL = function () {
      var lista = ordenar(filtrar(PEDIDOS, pl.busqueda, pl.estado === "todos" ? {} : { estado: [pl.estado] }), plOrden);
      var total = Math.max(1, Math.ceil(lista.length / 16));
      pl.pagina = Math.min(pl.pagina, total - 1);
      var vista = lista.slice(pl.pagina * 16, pl.pagina * 16 + 16);
      $("#pl-tabla tbody").innerHTML = vista.map(function (p) { return fila(p, true); }).join("") ||
        '<tr><td class="ob-tabla__celda-completa" colspan="8"><div class="ob-vacio ob-vacio--compacto">' + O.vacio.dibujo("busqueda") + '<div class="ob-vacio__textos"><p class="ob-vacio__titulo">Sin resultados</p><p class="ob-vacio__descripcion">Prueba con otro término.</p></div></div></td></tr>';
      $$("#pl-tabla tr[data-fila]").forEach(function (f, i) { f.tabIndex = i === 0 ? 0 : -1; });
      var desde = lista.length ? pl.pagina * 16 + 1 : 0;
      $("#pl-pie-conteo").innerHTML = lista.length ? "<b>" + desde + "–" + (desde + vista.length - 1) + "</b> de " + lista.length + " pedidos" : "Sin pedidos";
      $("#pl-conteo").textContent = lista.length + " pedidos";
      plPag.fijar(pl.pagina, total);
    };
    CAMPOS = CAMPOS; // mismas columnas salvo «Responsable»
    plMarco.addEventListener("ob:orden", function (e) { var c = e.detail.columna; plOrden = { col: c >= 7 ? 8 : c, dir: e.detail.direccion }; pintarPL(); });
    tira.addEventListener("ob:cambio", function (e) { pl.estado = e.detail.valor; pl.pagina = 0; pintarPL(); });
    $("#pl-buscar").addEventListener("input", function (e) { pl.busqueda = e.target.value; pl.pagina = 0; pintarPL(); });
    $("#pl-actualizar").addEventListener("click", function () {
      O.boton.guardar(this, new Promise(function (r) { setTimeout(r, 900); }), { textoListo: "Actualizado" });
    });
    plMarco.addEventListener("ob:abrir", function (e) {
      var p = PEDIDOS.filter(function (x) { return x.id === e.detail.id; })[0];
      if (!p) return;
      var v = $("#ventana-pedido");
      $(".ob-ventana__antetitulo", v).innerHTML = '<span class="ob-codigo">' + p.id + '</span>·<span class="ob-pildora" data-estado="' + p.estado + '"><span class="ob-glifo"></span>' + p.estadoTexto + "</span>";
      $(".ob-ventana__titulo", v).textContent = p.cliente + " · " + p.producto;
      $("#vp-cliente").value = p.cliente;
      $("#vp-producto").value = p.producto;
      $("#vp-cantidad").value = fmt(p.cantidad);
      var dd = $$(".ob-ventana__resumen dd", v);
      dd[0].textContent = fmt(p.cantidad) + " unidades";
      dd[1].textContent = "USD " + fmt(p.valor);
      dd[2].textContent = entrega(p) || "—";
    });
    pintarPL();
  }

  /* ---------- Matriz de botones ---------- */
  var matriz = $("#cat-matriz-botones");
  if (matriz) {
    var cols = ["Reposo", "Hover", "Foco", "Deshabilitado", "Cargando", "Listo"];
    var filas = [["Primario", "primario"], ["Secundario", "secundario"], ["Fantasma", "fantasma"], ["Destructivo", "destructivo"]];
    var h = '<span></span>' + cols.map(function (c) { return '<span class="cat-matriz__cab">' + c + "</span>"; }).join("");
    filas.forEach(function (f) {
      h += '<span class="cat-matriz__fila">' + f[0] + "</span>";
      cols.forEach(function (c, j) {
        h += '<span><button type="button" tabindex="-1" class="ob-boton ob-boton--' + f[1] + (j === 1 ? " cat-hover" : j === 2 ? " cat-foco" : "") + '"' + (j === 3 ? " disabled" : "") + ' data-col="' + j + '">Guardar</button></span>';
      });
    });
    matriz.innerHTML = h;
    $$("button[data-col]", matriz).forEach(function (b) {
      var j = b.getAttribute("data-col");
      if (j === "4") O.boton.estado(b, "cargando");
      if (j === "5") O.boton.estado(b, "listo", { textoListo: "Guardado" });
    });
  }

  /* ---------- Guardar y exportar ---------- */
  function demoGuardar(b) {
    if (!b || b.getAttribute("data-estado") === "cargando") return;
    O.boton.guardar(b, new Promise(function (r) { setTimeout(r, 1100); }));
  }
  ["#cat-guardar", "#cat-exportar"].forEach(function (s) {
    var b = $(s); if (b) b.addEventListener("click", function () { demoGuardar(b); });
  });

  /* ---------- Avisos ---------- */
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-cat-aviso]");
    if (!b) return;
    var t = b.getAttribute("data-cat-aviso");
    if (t === "exito") O.aviso({ titulo: "Pedido guardado", descripcion: "PE-26014 · Altamira", tono: "exito" });
    else if (t === "error") O.aviso({ titulo: "No se pudo leer el archivo", descripcion: "La columna «Cantidad» tiene texto en la fila 14. Corrígela y vuelve a importarlo.", tono: "error" });
    else if (t === "deshacer") O.aviso({ titulo: "Pedido archivado", tono: "info", accion: { texto: "Deshacer", alHacer: function () { O.aviso({ titulo: "Pedido restaurado", tono: "exito" }); } } });
    else if (t === "progreso") {
      var a = O.aviso({ titulo: "Exportando 48 pedidos…", tono: "cargando", progreso: 0 });
      var p = 0;
      var it = setInterval(function () {
        p += 0.2;
        if (p >= 1) { clearInterval(it); a.actualizar({ titulo: "Exportación lista", descripcion: "pedidos-noviembre.xlsx", tono: "exito" }); }
        else a.actualizar({ progreso: p });
      }, 450);
    }
  });

  /* ---------- Paginación de ejemplo ---------- */
  if ($("#cat-paginacion")) O.paginacion("#cat-paginacion", { pagina: 4, total: 12 });

  /* ---------- Tokens ---------- */
  var GRUPOS = [
    ["Superficies", ["lienzo", "sup-1", "sup-2", "sup-3", "lateral", "campo", "pulgar", "boton-2"]],
    ["Líneas", ["linea", "linea-fuerte", "linea-hover", "realce"]],
    ["Texto", ["texto-1", "texto-2", "texto-3", "texto-4"]],
    ["Acento", ["acento", "acento-fuerte", "acento-suave", "acento-relleno", "acento-texto", "filo-hover"]],
    ["Estado", ["vivo", "ambar", "rojo", "verde", "gris-estado", "rojo-relleno"]],
    ["Lavados", ["lavado", "lavado-2", "lavado-3", "esqueleto"]]
  ];
  $$("[data-cat-muestras]").forEach(function (panel) {
    var cs = getComputedStyle(panel.closest("[data-theme]"));
    var h = "";
    GRUPOS.forEach(function (g) {
      h += '<div class="cat-muestras__grupo">' + g[0] + "</div>";
      g[1].forEach(function (n) {
        var v = cs.getPropertyValue("--" + n).trim();
        h += '<button type="button" class="cat-muestra" data-ob-copiar data-texto="var(--' + n + ')" data-ob-pista="Copiar var(--' + n + ')"><span class="cat-muestra__color" style="background: var(--' + n + ')"></span><span style="min-width: 0"><span class="cat-muestra__nombre">--' + n + '</span><span class="cat-muestra__valor">' + esc(v) + "</span></span></button>";
      });
    });
    panel.innerHTML = h;
  });
  var rcs = getComputedStyle(document.documentElement);
  var radios = $("[data-cat-radios]");
  if (radios) radios.innerHTML = ["mini", "elemento", "control", "interno", "tarjeta", "ventana"].map(function (r) {
    return '<div class="cat-radio"><div class="cat-radio__caja" style="border-radius: var(--r-' + r + ')"></div><span class="cat-estado__nombre">--r-' + r + " · " + rcs.getPropertyValue("--r-" + r).trim() + "</span></div>";
  }).join("");
  var esp = $("[data-cat-espacios]");
  if (esp) esp.innerHTML = ["1", "2", "3", "4", "5", "6", "8", "10", "12"].map(function (n) {
    var v = rcs.getPropertyValue("--esp-" + n).trim();
    return '<div class="cat-escala__fila"><span class="ob-codigo ob-texto-2">--esp-' + n + '</span><span class="ob-texto-3 ob-cifras">' + v + '</span><span class="cat-escala__barra" style="width: ' + v + '"></span></div>';
  }).join("");
  function pares(sel, nombres) {
    var el = $(sel);
    if (el) el.innerHTML = nombres.map(function (n) {
      return '<div class="ob-descripcion__par"><dt class="ob-codigo">--' + n + '</dt><dd data-cifras>' + esc(rcs.getPropertyValue("--" + n).trim()) + "</dd></div>";
    }).join("");
  }
  pares("[data-cat-medidas]", ["alto-control", "alto-control-compacto", "alto-fila", "alto-encabezado-tabla", "alto-superior", "ancho-lateral", "ancho-ventana", "ancho-dialogo"]);
  pares("[data-cat-capas]", ["z-lateral", "z-modal", "z-flotante", "z-avisos", "t-hover", "t-menu", "t-vista", "t-ventana"]);

  var codigoInicio = $("#cat-codigo-inicio");
  var TEXTO_ENLACES = '<link rel="stylesheet" href="css/obsidiana.css">\n<script src="iconos/iconos.js"></script>\n<script src="js/obsidiana.js" defer></script>';
  var TEXTO_TEMA = '<script>\n  try { var t = localStorage.getItem("obsidiana:tema");\n    document.documentElement.setAttribute("data-theme", t === "claro" ? "claro" : "oscuro");\n  } catch (e) { document.documentElement.setAttribute("data-theme", "oscuro"); }\n</script>';
  if (codigoInicio) codigoInicio.innerHTML = window.__catResaltar('<html lang="es" data-theme="oscuro">\n<head>\n' + TEXTO_TEMA + "\n" + TEXTO_ENLACES + '\n</head>\n<body>\n  <div class="ob-app" data-ob-app>…</div>\n</body>');
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-cat-copiar]");
    if (b) {
      var tema = b.getAttribute("data-cat-copiar") === "tema";
      O.copiar(tema ? TEXTO_TEMA : TEXTO_ENLACES).then(function () { O.aviso({ titulo: tema ? "Fragmento de tema copiado" : "Enlaces copiados", tono: "exito", duracion: 2500 }); });
    }
    var ir = ev.target.closest("[data-cat-ir]");
    if (ir) O.vistas.ir(ir.getAttribute("data-cat-ir"));
    if (ev.target.closest("[data-cat-alternar-tema]")) O.tema.alternar();
  });

  /* ---------- Iconos ---------- */
  var NOMBRES = O.iconos && typeof O.iconos === "object" ? Object.keys(O.iconos) : ["panel", "buscar", "filtro", "exportar", "descargar", "subir", "nuevo", "editar", "eliminar", "copiar", "cerrar", "check", "alerta", "info", "exito", "error"];
  var tamIcono = 20;
  function pintarIconos() {
    var t = O.utilidades.normalizar(($("#cat-iconos-buscar") || {}).value || "");
    var vis = NOMBRES.filter(function (n) {
      var meta = O.iconos && O.iconos[n];
      return !t || O.utilidades.normalizar(n + " " + (meta && meta.etiquetas ? [].concat(meta.etiquetas).join(" ") : "")).indexOf(t) >= 0;
    });
    $("#cat-iconos").innerHTML = vis.map(function (n) {
      return '<button type="button" class="cat-icono ob-icono-vivo" data-ob-copiar data-texto="' + n + '" aria-label="Copiar el nombre ' + n + '">' + O.icono(n, { tamano: tamIcono }) + '<span class="cat-icono__nombre">' + n + "</span></button>";
    }).join("") || '<p class="ob-texto-3">Ningún icono coincide.</p>';
    $("[data-cat-iconos-visibles]").textContent = vis.length + " de " + NOMBRES.length;
  }
  if ($("#cat-iconos")) {
    $("[data-cat-iconos-conteo]").textContent = NOMBRES.length + " iconos";
    pintarIconos();
    $("#cat-iconos-buscar").addEventListener("input", pintarIconos);
    $("#cat-iconos-tamano").addEventListener("ob:cambio", function (e) { tamIcono = Number(e.detail.valor); pintarIconos(); });
  }

  /* ---------- Totales y contadores ---------- */
  function contar(vista) { return $$('[data-vista="' + vista + '"] [data-cat-titulo]').length; }
  var nTokens = 0;
  try {
    var cs2 = getComputedStyle(document.documentElement);
    for (var k = 0; k < cs2.length; k++) if (cs2[k].indexOf("--") === 0 && cs2[k].indexOf("--ob-") !== 0) nTokens++;
  } catch (er) { /* sin enumeración */ }
  if (!nTokens) nTokens = 180;
  var totales = { tokens: nTokens, componentes: contar("primitivas") + contar("componentes") + contar("datos"), iconos: NOMBRES.length, animaciones: contar("movimiento") };
  $$("[data-cat-total]").forEach(function (el) { el.setAttribute("data-ob-cifra", totales[el.getAttribute("data-cat-total")]); });
  $$("[data-cat-contador]").forEach(function (el) {
    var v = el.getAttribute("data-cat-contador");
    el.textContent = v === "tokens" ? nTokens : v === "iconos" ? NOMBRES.length : contar(v);
  });

  /* ---------- Estado vacío y movimiento ---------- */
  var vb = $('[data-cat-vacio="busqueda"]');
  if (vb) vb.insertAdjacentHTML("afterbegin", O.vacio.dibujo("busqueda"));
  var filo = $("#cat-filo");
  var tFilo = $("#cat-tarjeta-filo .ob-tarjeta[data-filo]");
  if (filo && tFilo) {
    filo.checked = true;
    filo.addEventListener("change", function () { if (filo.checked) tFilo.setAttribute("data-filo", "encendido"); else tFilo.removeAttribute("data-filo"); });
  }
  var cifraAlterna = false;
  var REPETIR = {
    vista: function () { O.reanimar($('[data-cat-escena="vista"]')); },
    indicador: function () {
      var g = $('[data-cat-escena="indicador"]');
      var ops = $$(".ob-segmentado__opcion", g);
      var i = ops.findIndex(function (o) { return o.getAttribute("aria-checked") === "true"; });
      ops[(i + 1) % ops.length].click();
    },
    lista: function () { O.escalonar($('[data-cat-escena="lista"]')); },
    cifra: function () { cifraAlterna = !cifraAlterna; O.cifra($('[data-cat-escena="cifra"]'), cifraAlterna ? 3412875 : 3284120); },
    trazo: function () { O.graficas.reproducir($('[data-cat-escena="trazo"]')); },
    guardar: function () { demoGuardar($('[data-cat-escena="guardar"]')); },
    filo: function () {
      var f = $('[data-cat-escena="filo"]');
      if (f.hasAttribute("data-filo")) f.removeAttribute("data-filo"); else f.setAttribute("data-filo", "encendido");
    },
    iconos: function () {
      var c = $('[data-cat-escena="iconos"]');
      c.classList.remove("ob-icono-reproducir"); void c.offsetWidth; c.classList.add("ob-icono-reproducir");
    }
  };
  document.addEventListener("click", function (ev) {
    var r = ev.target.closest("[data-cat-repetir]");
    if (r && REPETIR[r.getAttribute("data-cat-repetir")]) REPETIR[r.getAttribute("data-cat-repetir")]();
    if (ev.target.closest("[data-cat-repetir-vacio]")) O.reanimar(ev.target.closest(".cat-demo").querySelector(".ob-vacio__dibujo"));
    if (ev.target.closest("#cat-repetir-todo")) Object.keys(REPETIR).forEach(function (k) { if (k !== "filo") REPETIR[k](); });
  });
  var bMov = $("#cat-movimiento");
  if (bMov) {
    var reducidoGuardado = O.utilidades.almacen.leer("obsidiana:catalogo-movimiento") === "reducido";
    var aplicarMov = function (red) {
      if (red) document.documentElement.setAttribute("data-movimiento", "reducido"); else document.documentElement.removeAttribute("data-movimiento");
      bMov.setAttribute("aria-pressed", red ? "true" : "false");
      bMov.querySelector(".ob-lateral__accion-texto").textContent = red ? "Movimiento reducido" : "Reducir movimiento";
    };
    aplicarMov(reducidoGuardado);
    bMov.addEventListener("click", function () {
      var red = bMov.getAttribute("aria-pressed") !== "true";
      aplicarMov(red);
      O.utilidades.almacen.guardar("obsidiana:catalogo-movimiento", red ? "reducido" : "normal");
    });
  }

  /* ---------- Paleta: componentes, tokens e iconos ---------- */
  O.paleta.registrar(function () {
    return {
      titulo: "Componentes", elementos: $$("[data-cat-titulo]").map(function (t) {
        var vista = t.closest("[data-vista]");
        return {
          titulo: t.getAttribute("data-cat-titulo"), subtitulo: vista.getAttribute("data-titulo"), icono: "panel",
          alElegir: function () {
            O.vistas.ir(vista.getAttribute("data-vista"));
            setTimeout(function () {
              t.scrollIntoView({ block: "center" });
              t.setAttribute("data-filo", "encendido");
              setTimeout(function () { t.removeAttribute("data-filo"); }, 1600);
            }, 60);
          }
        };
      })
    };
  });
  O.paleta.registrar({
    titulo: "Tokens", elementos: GRUPOS.reduce(function (a, g) { return a.concat(g[1]); }, []).map(function (n) {
      return { titulo: "--" + n, subtitulo: "Copiar la variable", icono: "capas", alElegir: function () { O.copiar("var(--" + n + ")").then(function () { O.aviso({ titulo: "Copiado var(--" + n + ")", tono: "exito", duracion: 2200 }); }); } };
    })
  });
  O.paleta.registrar({
    titulo: "Iconos", max: 6, elementos: NOMBRES.map(function (n) {
      return { titulo: n, subtitulo: "Copiar el nombre", iconoHtml: O.icono(n, { tamano: 16 }), alElegir: function () { O.copiar(n).then(function () { O.aviso({ titulo: "Copiado «" + n + "»", tono: "exito", duracion: 2200 }); }); } };
    })
  });
})();
