/*!
 * Obsidiana · comportamientos (JavaScript puro, sin dependencias).
 *
 * Un solo archivo clásico: funciona con file:// y por http. Expone window.Obsidiana y se
 * autoinicializa al cargar el documento leyendo atributos data-ob-*. Lo que se añada después al
 * DOM se inicializa solo (MutationObserver) o llamando a Obsidiana.iniciar(elemento).
 *
 *   <link rel="stylesheet" href="css/obsidiana.css">
 *   <script src="js/obsidiana.js" defer></script>
 *
 * Fragmento para evitar el parpadeo de tema: ponlo en <head>, antes de cualquier hoja de estilo.
 *   <script>
 *     try { var t = localStorage.getItem("obsidiana:tema");
 *       document.documentElement.setAttribute("data-theme", t === "claro" ? "claro" : "oscuro");
 *     } catch (e) { document.documentElement.setAttribute("data-theme", "oscuro"); }
 *   </script>
 *
 * No depende de iconos/iconos.js: si existe Obsidiana.icono(nombre, { tamano }) lo usa para los
 * iconos que crea; si no, usa un juego mínimo propio con el mismo trazo.
 */
(function () {
  "use strict";

  var O = (window.Obsidiana = window.Obsidiana || {});
  O.version = "1.0.0";

  var doc = document;
  var raiz = doc.documentElement;
  var iniciados = typeof WeakSet === "function" ? new WeakSet() : null;

  /* ======================================================================================== */
  /* Utilidades                                                                                */
  /* ======================================================================================== */

  function $(sel, ctx) {
    return (ctx || doc).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
  }
  function crear(etiqueta, clase, html) {
    var e = doc.createElement(etiqueta);
    if (clase) e.className = clase;
    if (html != null) e.innerHTML = html;
    return e;
  }
  var contadorId = 0;
  function uid(prefijo) {
    contadorId += 1;
    return (prefijo || "ob") + "-" + contadorId.toString(36) + Math.random().toString(36).slice(2, 6);
  }
  function asegurarId(el, prefijo) {
    if (!el.id) el.id = uid(prefijo);
    return el.id;
  }
  function limitar(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }
  function escapar(t) {
    return String(t == null ? "" : t)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  /** Texto sin mayúsculas ni tildes, para buscar como en las listas. */
  function normalizar(t) {
    return String(t == null ? "" : t)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function emitir(el, nombre, detalle) {
    var ev;
    try {
      ev = new CustomEvent("ob:" + nombre, { bubbles: true, detail: detalle });
    } catch (e) {
      ev = doc.createEvent("CustomEvent");
      ev.initCustomEvent("ob:" + nombre, true, false, detalle);
    }
    el.dispatchEvent(ev);
    return ev;
  }
  function reducido() {
    if (raiz.getAttribute("data-movimiento") === "reducido") return true;
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }
  function visible(el) {
    return !!(el && el.getClientRects && el.getClientRects().length);
  }
  function reflujo(el) {
    return el.offsetWidth;
  }
  /** Vuelve a reproducir la animación CSS de un elemento. */
  function reanimar(el) {
    if (!el) return;
    el.style.animation = "none";
    reflujo(el);
    el.style.animation = "";
  }

  var almacen = {
    leer: function (clave) {
      try {
        return window.localStorage.getItem(clave);
      } catch (e) {
        return null;
      }
    },
    guardar: function (clave, valor) {
      try {
        window.localStorage.setItem(clave, valor);
      } catch (e) {
        /* almacenamiento bloqueado: la preferencia vive solo en esta sesión */
      }
    }
  };

  var LOCALE = raiz.getAttribute("data-locale") || "es-CO";
  var formatos = {};
  function formatear(valor, decimales) {
    var d = decimales == null ? -1 : decimales;
    var clave = String(d);
    if (!formatos[clave]) {
      formatos[clave] =
        d < 0
          ? new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 })
          : new Intl.NumberFormat(LOCALE, { minimumFractionDigits: d, maximumFractionDigits: d });
    }
    return formatos[clave].format(valor);
  }
  /** Lee un número escrito en formato colombiano ("1.234,5") o internacional ("1234.5"). */
  function leerNumero(texto) {
    var t = String(texto == null ? "" : texto).replace(/[^\d,.\-]/g, "");
    if (t === "" || t === "-") return null;
    if (t.indexOf(",") >= 0) t = t.replace(/\./g, "").replace(",", ".");
    else if ((t.match(/\./g) || []).length > 1) t = t.replace(/\./g, "");
    var n = Number(t);
    return isFinite(n) ? n : null;
  }

  /** Curva del resorte 420/36 tal como la define tokens.css (linear()), con respaldo. */
  var curvaCache = null;
  function curvaResorte() {
    if (curvaCache) return curvaCache;
    var c = getComputedStyle(raiz).getPropertyValue("--curva-resorte").trim();
    curvaCache = c || "cubic-bezier(0.16, 1, 0.3, 1)";
    return curvaCache;
  }
  function animar(el, fotogramas, opciones) {
    if (!el.animate) return null;
    try {
      return el.animate(fotogramas, opciones);
    } catch (e) {
      opciones.easing = "cubic-bezier(0.16, 1, 0.3, 1)";
      try {
        return el.animate(fotogramas, opciones);
      } catch (e2) {
        return null;
      }
    }
  }

  /* ======================================================================================== */
  /* Iconos internos (mismo trazo que el juego del sistema: 1,5 px, extremos redondeados)     */
  /* ======================================================================================== */
  var TRAZOS = {
    "chevron-abajo": '<path d="m6 9 6 6 6-6"/>',
    "chevron-arriba": '<path d="m6 15 6-6 6 6"/>',
    "chevron-izquierda": '<path d="m15 6-6 6 6 6"/>',
    "chevron-derecha": '<path d="m9 6 6 6-6 6"/>',
    check: '<path d="M5 12.5 10 17.5 19 7" stroke-width="2"/>',
    cerrar: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    buscar: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    flechas: '<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>',
    calendario:
      '<rect x="3.5" y="5" width="17" height="15" rx="3" fill="currentColor" fill-opacity=".12"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    exito: '<circle cx="12" cy="12" r="8.5" fill="currentColor" fill-opacity=".12"/><path d="m8.5 12.2 2.4 2.4 4.6-5"/>',
    error: '<circle cx="12" cy="12" r="8.5" fill="currentColor" fill-opacity=".12"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5"/>',
    alerta:
      '<path d="M10.3 4.6a2 2 0 0 1 3.4 0l7 12.2A2 2 0 0 1 19 20H5a2 2 0 0 1-1.7-3.2z" fill="currentColor" fill-opacity=".12"/><path d="M12 10v3.5M12 16.5v.01"/>',
    info: '<circle cx="12" cy="12" r="8.5" fill="currentColor" fill-opacity=".12"/><path d="M12 11v5M12 8v.01"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    ordenar: '<path d="M12 5v14M6.5 13.5 12 19l5.5-5.5"/>',
    documento:
      '<path d="M7 3.5h7l4.5 4.5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" fill="currentColor" fill-opacity=".12"/><path d="M14 3.5V8h4.5M9 13h6M9 16.5h4"/>',
    sol: '<circle cx="12" cy="12" r="3.6" fill="currentColor" fill-opacity=".12"/><path d="M12 3v1.8M12 19.2V21M3 12h1.8M19.2 12H21M5.6 5.6l1.3 1.3M17.1 17.1l1.3 1.3M5.6 18.4l1.3-1.3M17.1 6.9l1.3-1.3"/>',
    luna: '<path d="M19.5 14.6A7.5 7.5 0 0 1 9.4 4.5a7.5 7.5 0 1 0 10.1 10.1Z" fill="currentColor" fill-opacity=".12"/>',
    lateral: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M9.5 4.5v15"/>',
    subir: '<path d="M12 15V4.5M7.5 9 12 4.5 16.5 9M5 15v2.5A2 2 0 0 0 7 19.5h10a2 2 0 0 0 2-2V15"/>'
  };
  function iconoInterno(nombre, tamano) {
    var t = tamano || 16;
    var trazo = TRAZOS[nombre] || TRAZOS.info;
    return (
      '<svg viewBox="0 0 24 24" width="' + t + '" height="' + t + '" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + trazo + "</svg>"
    );
  }
  /** SVG de un icono: el del juego del sistema si está cargado, si no el interno. */
  function icono(nombre, tamano) {
    if (typeof O.icono === "function" && O.icono !== iconoPublico) {
      try {
        var s = O.icono(nombre, { tamano: tamano || 16 });
        if (s && typeof s === "string") return s;
      } catch (e) {
        /* sigue con el interno */
      }
    }
    return iconoInterno(nombre, tamano);
  }
  // Si nadie más define Obsidiana.icono, se expone el interno (iconos.js lo sustituye al cargar).
  function iconoPublico(nombre, opciones) {
    return iconoInterno(nombre, opciones && opciones.tamano);
  }
  if (typeof O.icono !== "function") O.icono = iconoPublico;

  /* ======================================================================================== */
  /* Foco                                                                                      */
  /* ======================================================================================== */
  var ENFOCABLES =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), ' +
    'textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable="true"], summary';
  function enfocables(ctx) {
    return $$(ENFOCABLES, ctx).filter(function (el) {
      return visible(el) && !el.closest("[inert]") && !el.closest("[hidden]");
    });
  }
  function enfocar(el) {
    if (!el) return;
    try {
      el.focus({ preventScroll: true });
    } catch (e) {
      el.focus();
    }
  }

  /* Documento inerte detrás de una capa modal (se apilan) */
  var pilaInerte = [];
  function inertizarFuera(conservar) {
    var cambiados = [];
    Array.prototype.forEach.call(doc.body.children, function (hijo) {
      if (conservar.indexOf(hijo) >= 0) return;
      if (hijo.classList.contains("ob-avisos") || hijo.classList.contains("ob-pista")) return;
      if (hijo.tagName === "SCRIPT" || hijo.tagName === "STYLE") return;
      if (!hijo.hasAttribute("inert")) {
        hijo.setAttribute("inert", "");
        cambiados.push(hijo);
      }
    });
    pilaInerte.push(cambiados);
  }
  function restaurarInerte() {
    var cambiados = pilaInerte.pop() || [];
    cambiados.forEach(function (h) {
      h.removeAttribute("inert");
    });
  }

  /* ======================================================================================== */
  /* Indicadores que se deslizan (FLIP con la curva del resorte)                              */
  /* ======================================================================================== */
  var indicadores = [];
  var observadorTam =
    typeof ResizeObserver === "function"
      ? new ResizeObserver(function (entradas) {
          entradas.forEach(function (en) {
            var g = en.target.__obIndicador;
            if (g) colocarIndicador(g, false);
          });
        })
      : null;

  /**
   * Crea (o recupera) un indicador dentro de un contenedor y lo coloca bajo el elemento activo.
   * modo "caja": copia posición y tamaño. modo "linea": solo posición horizontal y ancho.
   */
  function indicador(cont, clase, activo, modo) {
    if (cont.__obIndicador) return cont.__obIndicador;
    var ind = cont.querySelector(":scope > ." + clase);
    if (!ind) {
      ind = crear("span", clase);
      cont.insertBefore(ind, cont.firstChild);
    }
    ind.setAttribute("aria-hidden", "true");
    var g = { cont: cont, ind: ind, activo: activo, modo: modo || "caja", r: null, anim: null };
    cont.__obIndicador = g;
    cont.setAttribute("data-ob-listo", "");
    colocarIndicador(g, false);
    if (observadorTam) observadorTam.observe(cont);
    indicadores.push(g);
    return g;
  }
  function transformacion(g, r) {
    return g.modo === "linea"
      ? "translateX(" + r.x + "px)"
      : "translate(" + r.x + "px, " + r.y + "px)";
  }
  function colocarIndicador(g, animarlo) {
    var dest = g.activo();
    var ind = g.ind;
    if (!dest || !visible(dest) || !visible(g.cont)) {
      if (!dest) {
        ind.style.opacity = "0";
        g.r = null;
      }
      return;
    }
    var c = g.cont;
    var cr = c.getBoundingClientRect();
    var dr = dest.getBoundingClientRect();
    var r = {
      x: Math.round((dr.left - cr.left - c.clientLeft + c.scrollLeft) * 100) / 100,
      y: Math.round((dr.top - cr.top - c.clientTop + c.scrollTop) * 100) / 100,
      w: dr.width,
      h: dr.height
    };
    var previo = g.r;
    var desdeVivo = null;
    if (g.anim && g.anim.playState === "running") {
      desdeVivo = getComputedStyle(ind).transform;
      g.anim.cancel();
    }
    ind.style.width = r.w + "px";
    if (g.modo !== "linea") ind.style.height = r.h + "px";
    ind.style.transform = transformacion(g, r);
    ind.style.opacity = "";
    g.r = r;
    if (!animarlo || !previo || reducido()) return;
    if (previo.x === r.x && previo.y === r.y && previo.w === r.w && previo.h === r.h) return;
    var sx = previo.w / (r.w || 1);
    var sy = g.modo === "linea" ? 1 : previo.h / (r.h || 1);
    var desde = desdeVivo && desdeVivo !== "none" ? desdeVivo : transformacion(g, previo) + " scale(" + sx + ", " + sy + ")";
    if (previo.w === 0 && !desdeVivo) return;
    g.anim = animar(ind, [{ transform: desde }, { transform: ind.style.transform }], {
      duration: 320,
      easing: curvaResorte()
    });
  }
  /** Vuelve a colocar todos los indicadores sin animar (tras cambiar de vista o de tamaño). */
  function recolocar() {
    indicadores = indicadores.filter(function (g) {
      return g.cont.isConnected;
    });
    indicadores.forEach(function (g) {
      colocarIndicador(g, false);
    });
  }
  O.recolocar = recolocar;

  /* ======================================================================================== */
  /* Posicionamiento de flotantes (sin librerías): volteo y desplazamiento en los bordes      */
  /* ======================================================================================== */
  function rectDe(ancla) {
    if (ancla && ancla.getBoundingClientRect) return ancla.getBoundingClientRect();
    if (ancla && typeof ancla.left === "number") return ancla;
    if (ancla && typeof ancla.x === "number")
      return { left: ancla.x, right: ancla.x, top: ancla.y, bottom: ancla.y, width: 0, height: 0 };
    return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };
  }
  var OPUESTO = { top: "bottom", bottom: "top", left: "right", right: "left" };

  /**
   * Coloca un elemento position: fixed junto a su ancla.
   * opciones: lado (bottom), alinear (start|center|end), separacion (6), margen (12),
   * anchoAncla (true: como mínimo el ancho del ancla).
   */
  function posicionar(flot, ancla, opciones) {
    var op = opciones || {};
    var lado = op.lado || "bottom";
    var alinear = op.alinear || "start";
    var sep = op.separacion == null ? 6 : op.separacion;
    var margen = op.margen == null ? 12 : op.margen;
    var r = rectDe(ancla);
    var vw = doc.documentElement.clientWidth;
    var vh = window.innerHeight;
    flot.style.left = "0px";
    flot.style.top = "0px";
    flot.style.maxHeight = "";
    if (op.anchoAncla) flot.style.minWidth = Math.round(r.width) + "px";
    var w = flot.offsetWidth;
    var h = flot.offsetHeight;
    var vertical = lado === "top" || lado === "bottom";
    function espacio(l) {
      return l === "bottom" ? vh - r.bottom : l === "top" ? r.top : l === "right" ? vw - r.right : r.left;
    }
    var necesario = (vertical ? h : w) + sep + margen;
    if (espacio(lado) < necesario && espacio(OPUESTO[lado]) > espacio(lado)) lado = OPUESTO[lado];
    var x;
    var y;
    if (vertical) {
      var disponible = espacio(lado) - sep - margen;
      if (h > disponible) {
        flot.style.maxHeight = Math.max(120, disponible) + "px";
        h = flot.offsetHeight;
      }
      y = lado === "bottom" ? r.bottom + sep : r.top - sep - h;
      x = alinear === "end" ? r.right - w : alinear === "center" ? r.left + r.width / 2 - w / 2 : r.left;
      x = limitar(x, margen, Math.max(margen, vw - margen - w));
    } else {
      x = lado === "right" ? r.right + sep : r.left - sep - w;
      y = alinear === "end" ? r.bottom - h : alinear === "center" ? r.top + r.height / 2 - h / 2 : r.top;
      y = limitar(y, margen, Math.max(margen, vh - margen - h));
    }
    flot.style.left = Math.round(x) + "px";
    flot.style.top = Math.round(y) + "px";
    var ox = vertical ? limitar(r.left + r.width / 2 - x, 0, w) : lado === "right" ? 0 : w;
    var oy = vertical ? (lado === "bottom" ? 0 : h) : limitar(r.top + r.height / 2 - y, 0, h);
    flot.style.setProperty("--ob-origen", Math.round(ox) + "px " + Math.round(oy) + "px");
    flot.setAttribute("data-lado", lado);
  }
  O.posicionar = posicionar;

  /* ======================================================================================== */
  /* Capa de flotantes: menú, popover, lista del selector, calendario                         */
  /* ======================================================================================== */
  var flotantes = []; // { el, ancla, op, alCerrar }

  function flotanteAbierto(el) {
    for (var i = 0; i < flotantes.length; i++) if (flotantes[i].el === el) return flotantes[i];
    return null;
  }
  function abrirFlotante(el, ancla, op) {
    op = op || {};
    if (flotanteAbierto(el)) return;
    // Los flotantes viven en <body> para que position: fixed no dependa de ningún antecesor.
    if (el.parentNode !== doc.body) doc.body.appendChild(el);
    if (el.__obCierre) {
      clearTimeout(el.__obCierre);
      el.__obCierre = null;
    }
    el.hidden = false;
    el.removeAttribute("data-estado");
    posicionar(el, ancla, op);
    reflujo(el);
    el.setAttribute("data-estado", "abierto");
    if (ancla && ancla.setAttribute && op.expandir !== false) ancla.setAttribute("aria-expanded", "true");
    flotantes.push({ el: el, ancla: ancla, op: op });
  }
  function cerrarFlotante(el, devolverFoco) {
    var f = flotanteAbierto(el);
    if (!f) return;
    flotantes.splice(flotantes.indexOf(f), 1);
    if (f.ancla && f.ancla.setAttribute && f.op.expandir !== false) f.ancla.setAttribute("aria-expanded", "false");
    if (f.op.alCerrar) f.op.alCerrar();
    var terminar = function () {
      if (flotanteAbierto(el)) return;
      el.hidden = true;
      el.removeAttribute("data-estado");
      el.__obCierre = null;
    };
    if (reducido()) terminar();
    else {
      el.setAttribute("data-estado", "cerrando");
      el.__obCierre = setTimeout(terminar, 120);
    }
    if (devolverFoco && f.ancla && f.ancla.focus) enfocar(f.ancla);
  }
  function cerrarFlotantes(excepto) {
    flotantes.slice().forEach(function (f) {
      if (f.el !== excepto) cerrarFlotante(f.el, false);
    });
  }
  function recolocarFlotantes() {
    flotantes.forEach(function (f) {
      if (f.ancla && f.ancla.isConnected === false) return cerrarFlotante(f.el, false);
      if (f.ancla && f.ancla.getBoundingClientRect) posicionar(f.el, f.ancla, f.op);
    });
  }
  O.flotante = { abrir: abrirFlotante, cerrar: cerrarFlotante, cerrarTodos: cerrarFlotantes };

  doc.addEventListener(
    "pointerdown",
    function (e) {
      if (!flotantes.length) return;
      var t = e.target;
      flotantes.slice().forEach(function (f) {
        if (f.el.contains(t)) return;
        if (f.ancla && f.ancla.contains && f.ancla.contains(t)) return;
        // Un flotante abierto desde dentro de otro (submenús, calendario en popover) no cierra al padre.
        var dentroDeOtro = flotantes.some(function (o) {
          return o !== f && o.el.contains(t) && f.el.contains(o.ancla);
        });
        if (dentroDeOtro) return;
        cerrarFlotante(f.el, false);
      });
    },
    true
  );
  window.addEventListener("resize", function () {
    recolocarFlotantes();
    ocultarPista(true);
  });
  doc.addEventListener(
    "scroll",
    function (e) {
      if (flotantes.length) {
        // un desplazamiento dentro del propio flotante no lo mueve
        var dentro = flotantes.some(function (f) {
          return f.el.contains(e.target);
        });
        if (!dentro) recolocarFlotantes();
      }
      ocultarPista(true);
    },
    true
  );

  /* ======================================================================================== */
  /* Pista (tooltip)                                                                           */
  /* ======================================================================================== */
  var pista = null;
  var pistaAncla = null;
  var pistaTemporizador = null;
  var pistaUltima = 0;

  function elementoPista() {
    if (!pista) {
      pista = crear("div", "ob-pista");
      pista.id = uid("pista");
      pista.setAttribute("role", "tooltip");
      pista.hidden = true;
      doc.body.appendChild(pista);
    }
    return pista;
  }
  function contenidoPista(el) {
    var texto = el.getAttribute("data-ob-pista") || "";
    var html = escapar(texto);
    var sec = el.getAttribute("data-pista-secundario");
    if (sec) html += '<span class="ob-pista__secundario">' + escapar(sec) + "</span>";
    var atajo = el.getAttribute("data-pista-atajo");
    if (atajo) {
      html +=
        '<span class="ob-teclas">' +
        atajo
          .split(/\s+/)
          .map(function (t) {
            return '<kbd class="ob-tecla ob-tecla--sm">' + escapar(t) + "</kbd>";
          })
          .join("") +
        "</span>";
    }
    return html;
  }
  /** Muestra la pista junto a un ancla (elemento o rectángulo). */
  function mostrarPista(ancla, html, opciones) {
    var op = opciones || {};
    var p = elementoPista();
    p.innerHTML = html;
    p.hidden = false;
    p.removeAttribute("data-estado");
    p.style.animation = op.inmediata ? "none" : "";
    posicionar(p, ancla, { lado: op.lado || "top", alinear: "center", separacion: 8, margen: 8 });
    reflujo(p);
    p.setAttribute("data-estado", "abierto");
    pistaUltima = Date.now();
  }
  function ocultarPista(inmediata) {
    clearTimeout(pistaTemporizador);
    if (pistaAncla) {
      var desc = (pistaAncla.getAttribute("aria-describedby") || "")
        .split(" ")
        .filter(function (x) {
          return x && x !== (pista && pista.id);
        })
        .join(" ");
      if (desc) pistaAncla.setAttribute("aria-describedby", desc);
      else pistaAncla.removeAttribute("aria-describedby");
      pistaAncla = null;
      pistaUltima = Date.now();
    }
    if (!pista || pista.hidden) return;
    if (inmediata || reducido()) {
      pista.hidden = true;
      pista.removeAttribute("data-estado");
    } else {
      pista.setAttribute("data-estado", "cerrando");
      var p = pista;
      setTimeout(function () {
        if (!pistaAncla) {
          p.hidden = true;
          p.removeAttribute("data-estado");
        }
      }, 100);
    }
  }
  function pistaActiva(el) {
    var solo = el.getAttribute("data-pista-solo");
    if (solo === "plegada") {
      var app = el.closest("[data-ob-app], .ob-app");
      return !!(app && app.getAttribute("data-lateral") === "plegada");
    }
    return true;
  }
  function programarPista(el) {
    if (!pistaActiva(el) || !el.getAttribute("data-ob-pista")) return;
    clearTimeout(pistaTemporizador);
    var reciente = Date.now() - pistaUltima < 250 || (pista && !pista.hidden);
    var mostrar = function () {
      if (!el.isConnected) return;
      pistaAncla = el;
      var p = elementoPista();
      var desc = el.getAttribute("aria-describedby");
      if (!desc || desc.split(" ").indexOf(p.id) < 0) el.setAttribute("aria-describedby", (desc ? desc + " " : "") + p.id);
      mostrarPista(el, contenidoPista(el), { lado: el.getAttribute("data-pista-lado") || "top", inmediata: reciente });
    };
    if (reciente) mostrar();
    else pistaTemporizador = setTimeout(mostrar, 450);
  }
  doc.addEventListener("pointerover", function (e) {
    if (e.pointerType === "touch") return;
    var el = e.target.closest && e.target.closest("[data-ob-pista]");
    if (!el || el === pistaAncla) return;
    programarPista(el);
  });
  doc.addEventListener("pointerout", function (e) {
    var el = e.target.closest && e.target.closest("[data-ob-pista]");
    if (!el) return;
    if (e.relatedTarget && el.contains(e.relatedTarget)) return;
    if (el === pistaAncla || pistaTemporizador) ocultarPista(false);
  });
  doc.addEventListener("focusin", function (e) {
    var el = e.target.closest && e.target.closest("[data-ob-pista]");
    if (!el) return;
    var foco = false;
    try {
      foco = el.matches(":focus-visible");
    } catch (er) {
      foco = true;
    }
    if (foco) programarPista(el);
  });
  doc.addEventListener("focusout", function (e) {
    var el = e.target.closest && e.target.closest("[data-ob-pista]");
    if (el && el === pistaAncla) ocultarPista(false);
  });
  doc.addEventListener("pointerdown", function () {
    ocultarPista(true);
  });
  O.pista = { mostrar: mostrarPista, ocultar: ocultarPista };

  /* ======================================================================================== */
  /* Menú desplegable                                                                          */
  /* ======================================================================================== */
  function elementosMenu(menu) {
    return $$('[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]', menu).filter(function (el) {
      return !el.disabled && el.getAttribute("aria-disabled") !== "true";
    });
  }
  function iniciarDisparadorMenu(boton) {
    var menu = doc.getElementById(boton.getAttribute("data-ob-menu"));
    if (!menu) return;
    boton.setAttribute("aria-haspopup", "menu");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-controls", menu.id);
    iniciarMenu(menu, boton);
    boton.addEventListener("click", function () {
      if (flotanteAbierto(menu)) cerrarFlotante(menu, false);
      else abrirMenu(menu, boton, null);
    });
    boton.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        abrirMenu(menu, boton, e.key === "ArrowUp" ? "ultimo" : "primero");
      }
    });
  }
  function abrirMenu(menu, boton, foco) {
    cerrarFlotantes();
    abrirFlotante(menu, boton, {
      lado: menu.getAttribute("data-lado") || "bottom",
      alinear: menu.getAttribute("data-alinear") || "start"
    });
    var items = elementosMenu(menu);
    items.forEach(function (it) {
      it.tabIndex = -1;
    });
    var destino = foco === "ultimo" ? items[items.length - 1] : items[0];
    // Con el ratón, el foco va al menú (sin marcar ningún elemento); con teclado, al primero.
    if (foco) enfocar(destino);
    else {
      menu.tabIndex = -1;
      enfocar(menu);
    }
  }
  function iniciarMenu(menu, boton) {
    if (menu.__obMenu) return;
    menu.__obMenu = true;
    menu.hidden = true;
    menu.setAttribute("role", "menu");
    if (boton) menu.setAttribute("aria-labelledby", asegurarId(boton, "menu-disparador"));
    $$('[role="menuitemcheckbox"], [role="menuitemradio"]', menu).forEach(function (it) {
      if (!it.querySelector(".ob-menu__marca")) {
        var m = crear("span", "ob-menu__marca", icono("check", 14));
        m.setAttribute("aria-hidden", "true");
        it.appendChild(m);
      }
      if (!it.hasAttribute("aria-checked")) it.setAttribute("aria-checked", "false");
    });
    var busqueda = "";
    var busquedaTemp = null;
    menu.addEventListener("keydown", function (e) {
      var items = elementosMenu(menu);
      var i = items.indexOf(doc.activeElement);
      var destino = null;
      if (e.key === "ArrowDown") destino = items[(i + 1) % items.length];
      else if (e.key === "ArrowUp") destino = items[(i - 1 + items.length) % items.length];
      else if (e.key === "Home") destino = items[0];
      else if (e.key === "End") destino = items[items.length - 1];
      else if (e.key === "Tab") {
        cerrarFlotante(menu, false);
        return;
      } else if (e.key.length === 1 && /\S/.test(e.key) && !e.ctrlKey && !e.metaKey) {
        // Búsqueda por letra inicial
        clearTimeout(busquedaTemp);
        busqueda += normalizar(e.key);
        busquedaTemp = setTimeout(function () {
          busqueda = "";
        }, 500);
        var orden = items.slice(i + 1).concat(items.slice(0, i + 1));
        destino =
          orden.filter(function (it) {
            return normalizar(it.textContent).indexOf(busqueda) === 0;
          })[0] || null;
      }
      if (destino) {
        e.preventDefault();
        enfocar(destino);
      }
    });
    menu.addEventListener("click", function (e) {
      var it = e.target.closest('[role^="menuitem"]');
      if (!it || !menu.contains(it) || it.disabled || it.getAttribute("aria-disabled") === "true") return;
      var rol = it.getAttribute("role");
      var mantener = it.hasAttribute("data-mantener");
      if (rol === "menuitemcheckbox") {
        it.setAttribute("aria-checked", it.getAttribute("aria-checked") === "true" ? "false" : "true");
        mantener = true;
      } else if (rol === "menuitemradio") {
        var grupo = it.closest('[role="group"]') || menu;
        $$('[role="menuitemradio"]', grupo).forEach(function (r) {
          r.setAttribute("aria-checked", r === it ? "true" : "false");
        });
      }
      emitir(menu, "seleccion", {
        elemento: it,
        valor: it.getAttribute("data-valor") || it.textContent.trim(),
        marcado: it.getAttribute("aria-checked") === "true"
      });
      if (!mantener) cerrarFlotante(menu, true);
    });
    menu.addEventListener("pointermove", function (e) {
      var it = e.target.closest('[role^="menuitem"]');
      if (it && doc.activeElement !== it && !it.disabled) enfocar(it);
    });
  }

  /* ======================================================================================== */
  /* Popover                                                                                   */
  /* ======================================================================================== */
  function iniciarPopover(boton) {
    var pop = doc.getElementById(boton.getAttribute("data-ob-popover"));
    if (!pop) return;
    pop.hidden = true;
    if (!pop.getAttribute("role")) pop.setAttribute("role", "dialog");
    if (!pop.hasAttribute("tabindex")) pop.tabIndex = -1;
    boton.setAttribute("aria-haspopup", "dialog");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-controls", pop.id);
    boton.addEventListener("click", function () {
      if (flotanteAbierto(pop)) cerrarFlotante(pop, false);
      else abrirPopover(pop, boton);
    });
    if (!pop.__obPop) {
      pop.__obPop = true;
      pop.addEventListener("focusout", function (e) {
        // Tab fuera del popover lo cierra (no es modal)
        var destino = e.relatedTarget;
        if (!destino || pop.contains(destino)) return;
        var f = flotanteAbierto(pop);
        if (!f) return;
        var enHijo = flotantes.some(function (o) {
          return o.el !== pop && o.el.contains(destino);
        });
        if (enHijo || (f.ancla && f.ancla.contains(destino))) return;
        cerrarFlotante(pop, false);
      });
      pop.addEventListener("click", function (e) {
        if (e.target.closest("[data-ob-cerrar]")) {
          var f = flotanteAbierto(pop);
          if (f) cerrarFlotante(pop, true);
        }
      });
    }
  }
  function abrirPopover(pop, boton) {
    cerrarFlotantes();
    abrirFlotante(pop, boton, {
      lado: pop.getAttribute("data-lado") || "bottom",
      alinear: pop.getAttribute("data-alinear") || "start"
    });
    var inicial = pop.querySelector("[data-ob-foco-inicial]") || pop;
    enfocar(inicial);
    emitir(pop, "abrir", { disparador: boton });
  }
  O.popover = {
    abrir: function (pop, ancla) {
      abrirPopover(typeof pop === "string" ? doc.getElementById(pop) : pop, ancla);
    },
    cerrar: function (pop) {
      cerrarFlotante(typeof pop === "string" ? doc.getElementById(pop) : pop, true);
    }
  };

  /* ======================================================================================== */
  /* Capas modales: ventana, diálogo, alerta, cajón                                           */
  /* ======================================================================================== */
  var modales = []; // { el, velo, disparador }

  function modalAbierto(el) {
    for (var i = 0; i < modales.length; i++) if (modales[i].el === el) return modales[i];
    return null;
  }
  function abrirModal(el, opciones) {
    if (typeof el === "string") el = doc.getElementById(el);
    if (!el || modalAbierto(el)) return;
    var op = opciones || {};
    cerrarFlotantes();
    ocultarPista(true);
    if (el.parentNode !== doc.body) doc.body.appendChild(el);
    if (el.__obCierre) {
      clearTimeout(el.__obCierre);
      el.__obCierre = null;
    }
    var esAlerta = el.classList.contains("ob-dialogo--alerta") || el.getAttribute("role") === "alertdialog";
    if (!el.getAttribute("role")) el.setAttribute("role", esAlerta ? "alertdialog" : "dialog");
    el.setAttribute("aria-modal", "true");
    if (!el.hasAttribute("tabindex")) el.tabIndex = -1;
    var titulo = el.querySelector(".ob-ventana__titulo, .ob-dialogo__titulo, .ob-cajon__titulo");
    if (titulo && !el.getAttribute("aria-labelledby") && !el.getAttribute("aria-label"))
      el.setAttribute("aria-labelledby", asegurarId(titulo, "titulo"));
    var desc = el.querySelector(".ob-dialogo__descripcion, .ob-cajon__descripcion");
    if (desc && !el.getAttribute("aria-describedby")) el.setAttribute("aria-describedby", asegurarId(desc, "desc"));

    var velo = el.__obVelo;
    if (!velo) {
      velo = crear("div", "ob-velo");
      velo.setAttribute("aria-hidden", "true");
      el.__obVelo = velo;
      velo.addEventListener("click", function () {
        var m = modalAbierto(el);
        if (!m || m !== modales[modales.length - 1]) return;
        if (esAlerta || el.hasAttribute("data-ob-fijo")) {
          // Una alerta exige elegir: un leve gesto de "aquí" en lugar de cerrarse
          if (!reducido()) animar(el, [{ scale: "1" }, { scale: "1.01" }, { scale: "1" }], { duration: 200, easing: "ease-out" });
          return;
        }
        cerrarModal(el);
      });
    }
    var nivel = modales.length;
    velo.style.zIndex = String(50 + nivel * 2);
    el.style.zIndex = String(51 + nivel * 2);
    doc.body.insertBefore(velo, el);

    // La ventana nace del punto pulsado
    var origen = op.origen;
    if (!origen && op.disparador && op.disparador.getBoundingClientRect) {
      var r = op.disparador.getBoundingClientRect();
      origen = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    if (origen && !el.classList.contains("ob-cajon")) {
      var dx = Math.round(origen.x - window.innerWidth / 2);
      var dy = Math.round(origen.y - window.innerHeight / 2);
      el.style.setProperty("--ob-origen", "calc(50% + " + dx + "px) calc(50% + " + dy + "px)");
    } else el.style.removeProperty("--ob-origen");

    velo.hidden = false;
    el.hidden = false;
    velo.setAttribute("data-estado", "abierta");
    el.setAttribute("data-estado", "abierta");
    reanimar(velo);
    reanimar(el);
    var entrada = { el: el, velo: velo, disparador: op.disparador || doc.activeElement };
    modales.push(entrada);
    inertizarFuera([el, velo]);

    // Foco inicial: el indicado; en una alerta, "Cancelar" (Enter nunca confirma por descuido);
    // en una ventana de detalle, la propia ventana; en el resto, el primer control.
    var inicial = el.querySelector("[data-ob-foco-inicial]");
    if (!inicial && esAlerta) inicial = el.querySelector(".ob-dialogo__pie [data-ob-cerrar]");
    if (!inicial && !el.classList.contains("ob-ventana")) {
      var cuerpo = el.querySelector(".ob-dialogo__cuerpo, .ob-cajon__cuerpo");
      inicial = cuerpo ? enfocables(cuerpo)[0] : null;
    }
    enfocar(inicial || el);
    recolocar();
    emitir(el, "abrir", { disparador: entrada.disparador });
  }
  function cerrarModal(el, forzar) {
    if (typeof el === "string") el = doc.getElementById(el);
    var m = modalAbierto(el);
    if (!m) return Promise.resolve(false);
    if (!forzar && el.hasAttribute("data-sucia") && el.getAttribute("data-sucia") !== "false") {
      return O.confirmar({
        titulo: el.getAttribute("data-sucia-titulo") || "¿Descartar los cambios?",
        descripcion:
          el.getAttribute("data-sucia-texto") || "Hay cambios sin guardar en esta ventana. Si la cierras ahora, se perderán.",
        textoConfirmar: "Descartar cambios",
        textoCancelar: "Seguir editando",
        peligro: true
      }).then(function (ok) {
        if (ok) {
          el.removeAttribute("data-sucia");
          return cerrarModal(el, true);
        }
        return false;
      });
    }
    cerrarFlotantes();
    modales.splice(modales.indexOf(m), 1);
    restaurarInerte();
    var velo = m.velo;
    var terminar = function () {
      if (modalAbierto(el)) return;
      el.hidden = true;
      velo.hidden = true;
      el.removeAttribute("data-estado");
      velo.removeAttribute("data-estado");
      el.__obCierre = null;
      if (el.hasAttribute("data-ob-efimero")) {
        el.remove();
        velo.remove();
      }
    };
    if (reducido()) terminar();
    else {
      el.setAttribute("data-estado", "cerrando");
      velo.setAttribute("data-estado", "cerrando");
      el.__obCierre = setTimeout(terminar, el.classList.contains("ob-cajon") ? 190 : 150);
    }
    if (m.disparador && m.disparador.isConnected && m.disparador.focus) enfocar(m.disparador);
    emitir(el, "cerrar", {});
    return Promise.resolve(true);
  }
  O.modal = { abrir: abrirModal, cerrar: cerrarModal };

  doc.addEventListener("click", function (e) {
    var abrir = e.target.closest && e.target.closest("[data-ob-abrir]");
    if (abrir) {
      e.preventDefault();
      var destino = doc.getElementById(abrir.getAttribute("data-ob-abrir"));
      if (destino) {
        var origen = e.clientX || e.clientY ? { x: e.clientX, y: e.clientY } : null;
        abrirModal(destino, { disparador: abrir, origen: origen });
      }
      return;
    }
    var cerrar = e.target.closest && e.target.closest("[data-ob-cerrar]");
    if (cerrar) {
      var capa = cerrar.closest(".ob-ventana, .ob-dialogo, .ob-cajon");
      if (capa && modalAbierto(capa)) {
        e.preventDefault();
        cerrarModal(capa);
      }
    }
  });

  /** Diálogo de confirmación creado al vuelo. Devuelve una promesa con true o false. */
  O.confirmar = function (opciones) {
    var op = opciones || {};
    return new Promise(function (resolver) {
      var d = crear("div", "ob-dialogo ob-dialogo--alerta" + (op.peligro ? " ob-dialogo--peligro" : ""));
      d.setAttribute("role", "alertdialog");
      d.setAttribute("data-ob-efimero", "");
      d.hidden = true;
      d.innerHTML =
        '<div class="ob-dialogo__encabezado">' +
        '<span class="ob-dialogo__icono">' + icono("alerta", 18) + "</span>" +
        '<div class="ob-dialogo__textos"><h2 class="ob-dialogo__titulo">' + escapar(op.titulo || "¿Confirmar?") + "</h2>" +
        (op.descripcion ? '<p class="ob-dialogo__descripcion">' + escapar(op.descripcion) + "</p>" : "") +
        "</div></div>" +
        '<div class="ob-dialogo__pie"><div class="ob-dialogo__pie-acciones">' +
        '<button type="button" class="ob-boton ob-boton--secundario" data-ob-cerrar>' + escapar(op.textoCancelar || "Cancelar") + "</button>" +
        '<button type="button" class="ob-boton ' + (op.peligro ? "ob-boton--destructivo" : "ob-boton--primario") + '" data-ob-confirmar>' +
        escapar(op.textoConfirmar || "Confirmar") + "</button></div></div>";
      doc.body.appendChild(d);
      var resuelto = false;
      var fin = function (v) {
        if (resuelto) return;
        resuelto = true;
        resolver(v);
      };
      d.addEventListener("ob:cerrar", function () {
        fin(false);
      });
      d.querySelector("[data-ob-confirmar]").addEventListener("click", function () {
        fin(true);
        cerrarModal(d, true);
      });
      abrirModal(d, { disparador: doc.activeElement });
    });
  };

  /* Trampa de foco y Escape (capa de arriba primero) */
  doc.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      ocultarPista(true);
      if (paletaAbierta) {
        e.preventDefault();
        cerrarPaleta();
        return;
      }
      if (flotantes.length) {
        e.preventDefault();
        var f = flotantes[flotantes.length - 1];
        cerrarFlotante(f.el, true);
        return;
      }
      if (modales.length) {
        e.preventDefault();
        cerrarModal(modales[modales.length - 1].el);
      }
      return;
    }
    if (e.key === "Tab" && modales.length && !paletaAbierta) {
      var arriba = modales[modales.length - 1].el;
      var lista = enfocables(arriba);
      if (!lista.length) {
        e.preventDefault();
        enfocar(arriba);
        return;
      }
      var primero = lista[0];
      var ultimo = lista[lista.length - 1];
      if (e.shiftKey && (doc.activeElement === primero || doc.activeElement === arriba)) {
        e.preventDefault();
        enfocar(ultimo);
      } else if (!e.shiftKey && doc.activeElement === ultimo) {
        e.preventDefault();
        enfocar(primero);
      } else if (!arriba.contains(doc.activeElement)) {
        e.preventDefault();
        enfocar(primero);
      }
    }
  });

  /* ======================================================================================== */
  /* Pestañas (también el carril de la ventana de detalle)                                    */
  /* ======================================================================================== */
  function iniciarPestanas(lista) {
    var vertical = lista.getAttribute("aria-orientation") === "vertical" || lista.classList.contains("ob-ventana__pestanas");
    if (vertical) lista.setAttribute("aria-orientation", "vertical");
    lista.setAttribute("role", "tablist");
    var tabs = function () {
      return $$('[role="tab"]', lista);
    };
    var activa = function () {
      return lista.querySelector('[role="tab"][aria-selected="true"]');
    };
    tabs().forEach(function (t, i) {
      if (!t.hasAttribute("aria-selected")) t.setAttribute("aria-selected", i === 0 ? "true" : "false");
    });
    if (!activa() && tabs()[0]) tabs()[0].setAttribute("aria-selected", "true");
    var sincronizar = function () {
      tabs().forEach(function (t) {
        var sel = t.getAttribute("aria-selected") === "true";
        t.tabIndex = sel ? 0 : -1;
        var panel = doc.getElementById(t.getAttribute("aria-controls"));
        if (panel) {
          panel.setAttribute("role", "tabpanel");
          panel.setAttribute("aria-labelledby", asegurarId(t, "pestana"));
          if (!panel.hasAttribute("tabindex")) panel.tabIndex = 0;
          if (sel) panel.hidden = false;
          else panel.hidden = true;
        }
      });
    };
    sincronizar();
    var clase = lista.classList.contains("ob-ventana__pestanas") ? "ob-ventana__indicador" : "ob-pestanas__indicador";
    var linea = clase === "ob-pestanas__indicador" && !lista.classList.contains("ob-pestanas--pildora");
    var g = indicador(lista, clase, activa, linea ? "linea" : "caja");
    var elegir = function (t, foco) {
      if (!t || t.disabled) return;
      if (t.getAttribute("aria-selected") === "true") {
        if (foco) enfocar(t);
        return;
      }
      tabs().forEach(function (x) {
        x.setAttribute("aria-selected", x === t ? "true" : "false");
      });
      sincronizar();
      colocarIndicador(g, true);
      if (foco) enfocar(t);
      emitir(lista, "cambio", { id: t.getAttribute("aria-controls") || t.id, pestana: t });
    };
    lista.addEventListener("click", function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t && lista.contains(t)) elegir(t, false);
    });
    lista.addEventListener("keydown", function (e) {
      var lst = tabs().filter(function (t) {
        return !t.disabled;
      });
      var i = lst.indexOf(doc.activeElement);
      if (i < 0) return;
      var sig = vertical ? "ArrowDown" : "ArrowRight";
      var ant = vertical ? "ArrowUp" : "ArrowLeft";
      var destino = null;
      if (e.key === sig) destino = lst[(i + 1) % lst.length];
      else if (e.key === ant) destino = lst[(i - 1 + lst.length) % lst.length];
      else if (e.key === "Home") destino = lst[0];
      else if (e.key === "End") destino = lst[lst.length - 1];
      if (destino) {
        e.preventDefault();
        elegir(destino, true);
      }
    });
  }
  O.pestanas = {
    elegir: function (pestana) {
      var t = typeof pestana === "string" ? doc.getElementById(pestana) : pestana;
      if (t) t.click();
    }
  };

  /* ======================================================================================== */
  /* Grupos de una sola opción con indicador: segmentado, tira de cifras                      */
  /* ======================================================================================== */
  function iniciarSegmentado(grupo) {
    var opciones = function () {
      return $$(".ob-segmentado__opcion", grupo);
    };
    var radio = opciones()[0] && opciones()[0].getAttribute("role") === "radio";
    if (radio) grupo.setAttribute("role", "radiogroup");
    var atributo = radio ? "aria-checked" : "aria-pressed";
    var activa = function () {
      return grupo.querySelector(".ob-segmentado__opcion[" + atributo + '="true"]');
    };
    if (!activa() && opciones()[0]) opciones()[0].setAttribute(atributo, "true");
    var roving = function () {
      opciones().forEach(function (o) {
        if (radio) o.tabIndex = o.getAttribute(atributo) === "true" ? 0 : -1;
      });
    };
    roving();
    var g = indicador(grupo, "ob-segmentado__indicador", activa, "caja");
    var elegir = function (o, foco) {
      if (!o || o.disabled) return;
      if (foco) enfocar(o);
      if (o.getAttribute(atributo) === "true") return;
      opciones().forEach(function (x) {
        x.setAttribute(atributo, x === o ? "true" : "false");
      });
      roving();
      colocarIndicador(g, true);
      emitir(grupo, "cambio", { valor: o.getAttribute("data-valor") || o.textContent.trim(), opcion: o });
    };
    grupo.addEventListener("click", function (e) {
      var o = e.target.closest(".ob-segmentado__opcion");
      if (o && grupo.contains(o)) elegir(o, false);
    });
    grupo.addEventListener("keydown", function (e) {
      if (!radio) return;
      var lst = opciones();
      var i = lst.indexOf(doc.activeElement);
      if (i < 0) return;
      var d = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") d = lst[(i + 1) % lst.length];
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") d = lst[(i - 1 + lst.length) % lst.length];
      else if (e.key === "Home") d = lst[0];
      else if (e.key === "End") d = lst[lst.length - 1];
      if (d) {
        e.preventDefault();
        elegir(d, true);
      }
    });
    grupo.__obElegir = elegir;
  }
  O.segmentado = {
    elegir: function (grupo, valor) {
      var o = $$(".ob-segmentado__opcion", grupo).filter(function (x) {
        return (x.getAttribute("data-valor") || x.textContent.trim()) === valor;
      })[0];
      if (o && grupo.__obElegir) grupo.__obElegir(o, false);
    }
  };

  function iniciarTira(tira) {
    var botones = function () {
      return $$("button.ob-tira__elemento", tira);
    };
    if (!botones().length) return;
    var activa = function () {
      return tira.querySelector('button.ob-tira__elemento[aria-pressed="true"]');
    };
    botones().forEach(function (b) {
      if (!b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", "false");
    });
    var g = indicador(tira, "ob-tira__indicador", activa, "caja");
    tira.addEventListener("click", function (e) {
      var b = e.target.closest("button.ob-tira__elemento");
      if (!b || b.getAttribute("aria-pressed") === "true") return;
      botones().forEach(function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      colocarIndicador(g, true);
      emitir(tira, "cambio", { valor: b.getAttribute("data-valor") || "", elemento: b });
    });
  }

  /* ======================================================================================== */
  /* Tema                                                                                      */
  /* ======================================================================================== */
  var CLAVE_TEMA = "obsidiana:tema";
  function temaActual() {
    return raiz.getAttribute("data-theme") === "claro" ? "claro" : "oscuro";
  }
  function fijarTema(tema, opciones) {
    var op = opciones || {};
    if (tema !== "claro" && tema !== "oscuro") return;
    if (tema === temaActual()) return;
    var aplicar = function () {
      raiz.setAttribute("data-theme", tema);
      almacen.guardar(CLAVE_TEMA, tema);
    };
    // Fundido cruzado con View Transitions; sin soporte o con movimiento reducido, al instante.
    if (op.animar !== false && !reducido() && typeof doc.startViewTransition === "function") {
      try {
        doc.startViewTransition(aplicar);
        return;
      } catch (e) {
        /* respaldo */
      }
    }
    aplicar();
  }
  O.tema = {
    actual: temaActual,
    fijar: fijarTema,
    alternar: function () {
      fijarTema(temaActual() === "claro" ? "oscuro" : "claro");
    }
  };
  function iniciarConmutadorTema(caja) {
    var opciones = $$("[data-tema]", caja);
    var activa = function () {
      return caja.querySelector('[data-tema="' + temaActual() + '"]');
    };
    var sincronizar = function () {
      opciones.forEach(function (o) {
        o.setAttribute("aria-pressed", o.getAttribute("data-tema") === temaActual() ? "true" : "false");
      });
    };
    sincronizar();
    var g = indicador(caja, "ob-tema__pulgar", activa, "caja");
    caja.addEventListener("click", function (e) {
      var o = e.target.closest("[data-tema]");
      if (!o) return;
      var t = o.getAttribute("data-tema");
      if (t === temaActual()) return;
      o.setAttribute("data-gesto", "");
      setTimeout(function () {
        o.removeAttribute("data-gesto");
      }, 460);
      fijarTema(t);
    });
    caja.__obSincronizar = function () {
      sincronizar();
      colocarIndicador(g, true);
    };
  }
  if (typeof MutationObserver === "function") {
    new MutationObserver(function () {
      $$("[data-ob-tema]").forEach(function (c) {
        if (c.__obSincronizar) c.__obSincronizar();
      });
      $$("[data-ob-grafica]").forEach(function (g) {
        if (g.__obRedibujar) g.__obRedibujar();
      });
    }).observe(raiz, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ======================================================================================== */
  /* Armazón: barra lateral plegable y vistas por ancla (#id)                                 */
  /* ======================================================================================== */
  var CLAVE_LATERAL = "obsidiana:lateral";
  function appRaiz() {
    return $("[data-ob-app]");
  }
  function plegarLateral(plegar) {
    var app = appRaiz();
    if (!app) return;
    var actual = app.getAttribute("data-lateral") === "plegada";
    var nuevo = plegar == null ? !actual : !!plegar;
    if (nuevo) app.setAttribute("data-lateral", "plegada");
    else app.removeAttribute("data-lateral");
    almacen.guardar(CLAVE_LATERAL, nuevo ? "plegada" : "abierta");
    $$("[data-ob-plegar]", app).forEach(function (b) {
      b.setAttribute("aria-expanded", nuevo ? "false" : "true");
    });
    ocultarPista(true);
    recolocar();
    emitir(app, "lateral", { plegada: nuevo });
  }
  O.lateral = {
    plegar: function () {
      plegarLateral(true);
    },
    desplegar: function () {
      plegarLateral(false);
    },
    alternar: function () {
      plegarLateral();
    },
    plegada: function () {
      var app = appRaiz();
      return !!(app && app.getAttribute("data-lateral") === "plegada");
    }
  };
  function iniciarApp(app) {
    if (almacen.leer(CLAVE_LATERAL) === "plegada") app.setAttribute("data-lateral", "plegada");
    $$(".ob-lateral__nav", app).forEach(function (nav) {
      indicador(nav, "ob-lateral__indicador", function () {
        return nav.querySelector('.ob-lateral__enlace[aria-current="page"]');
      });
    });
    $$("[data-ob-plegar]", app).forEach(function (b) {
      b.setAttribute("aria-expanded", app.getAttribute("data-lateral") === "plegada" ? "false" : "true");
      b.addEventListener("click", function () {
        plegarLateral();
      });
    });
  }
  /** Marca el enlace activo de la barra lateral y desliza el indicador. */
  function activarEnlace(href) {
    $$(".ob-lateral__enlace").forEach(function (a) {
      if (a.getAttribute("href") === href) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $$(".ob-lateral__nav").forEach(function (nav) {
      if (nav.__obIndicador) colocarIndicador(nav.__obIndicador, true);
    });
  }
  O.lateral.activar = activarEnlace;

  /* Vistas: [data-ob-vistas] con hijos [data-vista="id"]; los enlaces href="#id" las abren. */
  function iniciarVistas(cont) {
    var vistas = function () {
      return $$(":scope > [data-vista]", cont);
    };
    var mostrar = function (id, primera) {
      var lista = vistas();
      var destino = lista.filter(function (v) {
        return v.getAttribute("data-vista") === id;
      })[0];
      if (!destino) destino = lista[0];
      if (!destino) return;
      id = destino.getAttribute("data-vista");
      lista.forEach(function (v) {
        if (v === destino) {
          v.hidden = false;
          v.setAttribute("data-ob-vista", "");
          reanimar(v);
        } else {
          v.hidden = true;
        }
      });
      activarEnlace("#" + id);
      $$('.ob-subnav__enlace[href^="#"], [data-ob-enlace-vista]').forEach(function (a) {
        if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      var titulo = destino.getAttribute("data-titulo");
      $$("[data-ob-miga-actual]").forEach(function (m) {
        if (titulo) m.textContent = titulo;
      });
      var desplazable = cont.closest(".ob-app__contenido") || cont;
      if (!primera) desplazable.scrollTop = 0;
      setTimeout(recolocar, 0);
      $$("[data-ob-cifra]", destino).forEach(function (c) {
        if (c.__obCifra) c.__obCifra.reproducir();
      });
      emitir(cont, "vista", { id: id, vista: destino });
    };
    cont.__obMostrar = mostrar;
    var desdeHash = function (primera) {
      var id = decodeURIComponent((location.hash || "").slice(1)).split("/")[0];
      mostrar(id, primera);
    };
    window.addEventListener("hashchange", function () {
      desdeHash(false);
    });
    desdeHash(true);
  }
  O.vistas = {
    ir: function (id) {
      if (location.hash === "#" + id) {
        var c = $("[data-ob-vistas]");
        if (c && c.__obMostrar) c.__obMostrar(id);
      } else location.hash = id;
    }
  };

  /* ======================================================================================== */
  /* Paleta de comandos (Ctrl K)                                                               */
  /* ======================================================================================== */
  var paleta = null;
  var paletaVelo = null;
  var paletaAbierta = false;
  var paletaDisparador = null;
  var paletaGrupos = [];
  var paletaActivo = 0;
  var paletaVisibles = [];
  var MAX_POR_GRUPO = 8;

  function construirPaleta() {
    if (paleta) return;
    paletaVelo = crear("div", "ob-velo ob-velo--paleta");
    paletaVelo.hidden = true;
    paletaVelo.setAttribute("aria-hidden", "true");
    paletaVelo.addEventListener("pointerdown", cerrarPaleta);
    paleta = crear("div", "ob-paleta");
    paleta.hidden = true;
    paleta.setAttribute("role", "dialog");
    paleta.setAttribute("aria-modal", "true");
    paleta.setAttribute("aria-label", "Paleta de comandos");
    var idLista = uid("paleta-lista");
    paleta.innerHTML =
      '<div class="ob-paleta__buscar">' + icono("buscar", 18) +
      '<input class="ob-paleta__entrada" type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" ' +
      'aria-controls="' + idLista + '" autocomplete="off" spellcheck="false" placeholder="Buscar o ir a…">' +
      '<kbd class="ob-tecla ob-tecla--sm">Esc</kbd></div>' +
      '<div class="ob-paleta__lista" role="listbox" id="' + idLista + '" aria-label="Resultados"></div>' +
      '<div class="ob-paleta__pie">' +
      '<span><kbd class="ob-tecla ob-tecla--sm">↑</kbd><kbd class="ob-tecla ob-tecla--sm">↓</kbd>para moverte</span>' +
      '<span><kbd class="ob-tecla ob-tecla--sm">Enter</kbd>para elegir</span>' +
      '<span><kbd class="ob-tecla ob-tecla--sm">Ctrl</kbd><kbd class="ob-tecla ob-tecla--sm">K</kbd>abre y cierra</span></div>';
    doc.body.appendChild(paletaVelo);
    doc.body.appendChild(paleta);
    var entrada = $(".ob-paleta__entrada", paleta);
    entrada.addEventListener("input", function () {
      paletaActivo = 0;
      pintarPaleta();
    });
    entrada.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!paletaVisibles.length) return;
        var n = paletaVisibles.length;
        paletaActivo = (paletaActivo + (e.key === "ArrowDown" ? 1 : -1) + n) % n;
        marcarActivo(true);
      } else if (e.key === "Home" && e.ctrlKey) {
        paletaActivo = 0;
        marcarActivo(true);
      } else if (e.key === "Enter") {
        e.preventDefault();
        elegirPaleta(paletaVisibles[paletaActivo]);
      } else if (e.key === "Tab") {
        // La búsqueda es el único control con foco: Tab no sale de la paleta.
        e.preventDefault();
      }
    });
    var lista = $(".ob-paleta__lista", paleta);
    lista.addEventListener("pointermove", function (e) {
      var it = e.target.closest(".ob-paleta__elemento");
      if (!it) return;
      var i = Number(it.getAttribute("data-indice"));
      if (i !== paletaActivo) {
        paletaActivo = i;
        marcarActivo(false);
      }
    });
    lista.addEventListener("click", function (e) {
      var it = e.target.closest(".ob-paleta__elemento");
      if (it) elegirPaleta(paletaVisibles[Number(it.getAttribute("data-indice"))]);
    });
  }
  function gruposPorDefecto() {
    var ir = $$(".ob-lateral__enlace[href]").map(function (a) {
      var ic = a.querySelector(".ob-lateral__icono") || a.querySelector("svg");
      var texto = a.querySelector(".ob-lateral__texto");
      var htmlIcono = ic ? (ic.tagName.toLowerCase() === "svg" || !ic.innerHTML ? ic.outerHTML : ic.innerHTML) : "";
      return {
        titulo: (texto ? texto.textContent : a.textContent).trim(),
        iconoHtml: htmlIcono.replace(/\sclass="[^"]*"/, ' class="ob-paleta__svg"'),
        claves: a.getAttribute("data-claves") || "",
        detalle: icono("flecha", 14),
        alElegir: function () {
          a.click();
        }
      };
    });
    var acciones = [
      {
        titulo: temaActual() === "claro" ? "Cambiar a tema oscuro" : "Cambiar a tema claro",
        icono: temaActual() === "claro" ? "luna" : "sol",
        claves: "tema apariencia modo claro oscuro",
        alElegir: function () {
          O.tema.alternar();
        }
      }
    ];
    if (appRaiz()) {
      acciones.push({
        titulo: O.lateral.plegada() ? "Desplegar barra lateral" : "Plegar barra lateral",
        icono: "lateral",
        claves: "barra lateral menú navegación",
        atajo: ["Ctrl", "B"],
        alElegir: function () {
          O.lateral.alternar();
        }
      });
    }
    var grupos = [];
    if (ir.length) grupos.push({ titulo: "Ir a", elementos: ir, fijo: true });
    grupos.push({ titulo: "Acciones", elementos: acciones, fijo: true });
    return grupos;
  }
  function resaltar(titulo, termino) {
    if (!termino) return escapar(titulo);
    var norm = normalizar(titulo);
    // normalizar conserva la longitud en el texto latino habitual (las tildes se separan y se quitan)
    var i = norm.indexOf(termino);
    if (i < 0 || norm.length !== titulo.length) return escapar(titulo);
    return (
      escapar(titulo.slice(0, i)) + "<mark>" + escapar(titulo.slice(i, i + termino.length)) + "</mark>" + escapar(titulo.slice(i + termino.length))
    );
  }
  function pintarPaleta() {
    var entrada = $(".ob-paleta__entrada", paleta);
    var lista = $(".ob-paleta__lista", paleta);
    var termino = normalizar(entrada.value);
    var grupos = gruposPorDefecto().concat(
      paletaGrupos.map(function (g) {
        return typeof g === "function" ? g(termino) : g;
      })
    );
    var html = "";
    paletaVisibles = [];
    var resultado = [];
    grupos.forEach(function (g) {
      if (!g || !g.elementos) return;
      if (!termino && !g.fijo && !g.sinTermino) return;
      var coinciden = g.elementos
        .map(function (el) {
          var texto = normalizar(el.titulo + " " + (el.subtitulo || "") + " " + (el.claves || ""));
          var pos = termino ? texto.indexOf(termino) : 0;
          var inicio = termino ? (" " + normalizar(el.titulo)).indexOf(" " + termino) : 0;
          return { el: el, pos: pos, puntos: pos < 0 ? -1 : normalizar(el.titulo).indexOf(termino) === 0 ? 0 : inicio >= 0 ? 1 : 2 };
        })
        .filter(function (x) {
          return x.pos >= 0;
        });
      if (termino) coinciden.sort(function (a, b) { return a.puntos - b.puntos; });
      if (!coinciden.length) return;
      var mejor = coinciden[0].puntos;
      resultado.push({ g: g, items: coinciden.slice(0, g.max || MAX_POR_GRUPO), total: coinciden.length, mejor: mejor });
    });
    // Con un término, los grupos de datos van primero y el que mejor coincide encabeza
    if (termino)
      resultado.sort(function (a, b) {
        if (!!a.g.fijo !== !!b.g.fijo) return a.g.fijo ? 1 : -1;
        return a.mejor - b.mejor;
      });
    resultado.forEach(function (r) {
      var idG = uid("grupo");
      html += '<div class="ob-paleta__grupo" role="group" aria-labelledby="' + idG + '">';
      html += '<div class="ob-paleta__grupo-titulo" id="' + idG + '">' + escapar(r.g.titulo) + "</div>";
      r.items.forEach(function (x) {
        var el = x.el;
        var i = paletaVisibles.length;
        paletaVisibles.push(el);
        var ic = el.iconoHtml || (el.icono ? icono(el.icono, 16) : "");
        html +=
          '<div class="ob-paleta__elemento" role="option" id="' + "ob-pal-" + i + '" data-indice="' + i + '" aria-selected="false">' +
          (ic ? '<span class="ob-paleta__icono">' + ic + "</span>" : "") +
          '<span class="ob-paleta__titulo">' + resaltar(el.titulo, termino) + "</span>" +
          (el.subtitulo ? '<span class="ob-paleta__subtitulo">' + escapar(el.subtitulo) + "</span>" : "") +
          '<span class="ob-paleta__detalle">' + (el.detalle || "") + "</span>" +
          (el.atajo
            ? '<span class="ob-teclas">' + el.atajo.map(function (t) { return '<kbd class="ob-tecla ob-tecla--sm">' + escapar(t) + "</kbd>"; }).join("") + "</span>"
            : "") +
          "</div>";
      });
      if (r.total > r.items.length && r.g.verTodos) {
        var i2 = paletaVisibles.length;
        paletaVisibles.push({ titulo: "", alElegir: r.g.verTodos.bind(null, entrada.value.trim()) });
        html +=
          '<div class="ob-paleta__elemento" role="option" id="ob-pal-' + i2 + '" data-indice="' + i2 + '" aria-selected="false">' +
          '<span class="ob-paleta__icono">' + icono("buscar", 16) + "</span>" +
          '<span class="ob-paleta__titulo ob-texto-2">Ver las ' + formatear(r.total, 0) + " coincidencias en " + escapar(r.g.titulo.toLowerCase()) + "</span>" +
          '<span class="ob-paleta__detalle">' + icono("flecha", 14) + "</span></div>";
      }
      html += "</div>";
    });
    if (!paletaVisibles.length)
      html = '<div class="ob-paleta__vacio">Nada coincide con «' + escapar(entrada.value.trim()) + "»</div>";
    lista.innerHTML = html;
    paletaActivo = limitar(paletaActivo, 0, Math.max(0, paletaVisibles.length - 1));
    marcarActivo(true);
  }
  function marcarActivo(desplazar) {
    var entrada = $(".ob-paleta__entrada", paleta);
    $$(".ob-paleta__elemento", paleta).forEach(function (it) {
      var act = Number(it.getAttribute("data-indice")) === paletaActivo;
      it.setAttribute("aria-selected", act ? "true" : "false");
      if (act) {
        entrada.setAttribute("aria-activedescendant", it.id);
        if (desplazar) it.scrollIntoView({ block: "nearest" });
      }
    });
    if (!paletaVisibles.length) entrada.removeAttribute("aria-activedescendant");
  }
  function elegirPaleta(el) {
    if (!el) return;
    cerrarPaleta();
    // La acción corre después de cerrar, para que el foco vuelva antes a su sitio.
    requestAnimationFrame(function () {
      if (el.alElegir) el.alElegir();
    });
  }
  function abrirPaleta() {
    construirPaleta();
    if (paletaAbierta) return;
    cerrarFlotantes();
    ocultarPista(true);
    paletaDisparador = doc.activeElement;
    paletaAbierta = true;
    paletaVelo.hidden = false;
    paleta.hidden = false;
    inertizarFuera([paleta, paletaVelo]);
    var entrada = $(".ob-paleta__entrada", paleta);
    entrada.value = "";
    paletaActivo = 0;
    pintarPaleta();
    enfocar(entrada);
  }
  function cerrarPaleta() {
    if (!paletaAbierta) return;
    paletaAbierta = false;
    paleta.hidden = true;
    paletaVelo.hidden = true;
    restaurarInerte();
    if (paletaDisparador && paletaDisparador.isConnected) enfocar(paletaDisparador);
  }
  O.paleta = {
    abrir: abrirPaleta,
    cerrar: cerrarPaleta,
    alternar: function () {
      if (paletaAbierta) cerrarPaleta();
      else abrirPaleta();
    },
    /**
     * Añade un grupo: { titulo, elementos: [{ titulo, subtitulo, icono, iconoHtml, claves, atajo, alElegir }],
     * sinTermino (mostrarlo sin búsqueda), max, verTodos(termino) } o una función (termino) => grupo.
     */
    registrar: function (grupo) {
      paletaGrupos.push(grupo);
    },
    limpiar: function () {
      paletaGrupos = [];
    }
  };

  /* Atajos globales: Ctrl K (paleta) y Ctrl B (barra lateral), también desde los campos */
  doc.addEventListener("keydown", function (e) {
    if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
    var k = (e.key || "").toLowerCase();
    if (k === "k" && O.config.paleta !== false) {
      e.preventDefault();
      O.paleta.alternar();
    } else if (k === "b" && appRaiz() && !paletaAbierta && !modales.length) {
      e.preventDefault();
      plegarLateral();
    }
  });
  doc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-ob-paleta-abrir]");
    if (b) {
      e.preventDefault();
      abrirPaleta();
    }
  });

  /* ======================================================================================== */
  /* Selector y combobox (a partir de un <select> nativo)                                     */
  /* ======================================================================================== */
  function iniciarSelector(sel) {
    var buscar = sel.getAttribute("data-ob-selector") === "buscar";
    var caja = sel.closest(".ob-selector-caja");
    if (!caja) {
      caja = crear("div", "ob-selector-caja");
      sel.parentNode.insertBefore(caja, sel);
      caja.appendChild(sel);
    }
    var boton = crear("button", "ob-selector__disparador");
    boton.type = "button";
    boton.setAttribute("role", "combobox");
    boton.setAttribute("aria-haspopup", "listbox");
    boton.setAttribute("aria-expanded", "false");
    var idLista = uid("lista");
    boton.setAttribute("aria-controls", idLista);
    // La etiqueta del <select> pasa al disparador
    if (sel.id) {
      var etiqueta = doc.querySelector('label[for="' + sel.id + '"]');
      boton.id = sel.id + "-disparador";
      if (etiqueta) {
        etiqueta.setAttribute("for", boton.id);
        boton.setAttribute("aria-labelledby", asegurarId(etiqueta, "etiqueta"));
      }
    }
    if (sel.getAttribute("aria-label")) boton.setAttribute("aria-label", sel.getAttribute("aria-label"));
    if (sel.getAttribute("aria-describedby")) boton.setAttribute("aria-describedby", sel.getAttribute("aria-describedby"));
    boton.innerHTML =
      '<span class="ob-selector__valor"></span>' +
      '<span class="ob-selector__chevron"' + (buscar ? "" : " data-gira") + ">" + icono(buscar ? "flechas" : "chevron-abajo", 14) + "</span>";
    caja.appendChild(boton);
    caja.setAttribute("data-ob-listo", "");

    var lista = crear("div", "ob-lista-flotante");
    lista.hidden = true;
    var opcionesCaja = crear("div", "ob-lista-flotante__opciones");
    opcionesCaja.id = idLista;
    opcionesCaja.setAttribute("role", "listbox");
    opcionesCaja.tabIndex = -1;
    var entradaBusqueda = null;
    if (buscar) {
      var cabeza = crear("div", "ob-lista-flotante__buscar", icono("buscar", 14));
      entradaBusqueda = crear("input");
      entradaBusqueda.type = "text";
      entradaBusqueda.setAttribute("role", "combobox");
      entradaBusqueda.setAttribute("aria-controls", idLista);
      entradaBusqueda.setAttribute("aria-expanded", "true");
      entradaBusqueda.setAttribute("aria-autocomplete", "list");
      entradaBusqueda.setAttribute("autocomplete", "off");
      entradaBusqueda.setAttribute("aria-label", "Buscar");
      entradaBusqueda.placeholder = sel.getAttribute("data-marcador-busqueda") || "Buscar…";
      cabeza.appendChild(entradaBusqueda);
      lista.appendChild(cabeza);
    }
    lista.appendChild(opcionesCaja);
    doc.body.appendChild(lista);

    var activo = -1;
    var visibles = [];
    var marcador = "Seleccionar";
    var datos = function () {
      var ops = Array.prototype.slice.call(sel.options);
      var res = [];
      ops.forEach(function (o, i) {
        if (o.value === "" && i === 0) {
          marcador = o.textContent.trim() || marcador;
          return;
        }
        res.push({ valor: o.value, texto: o.textContent.trim(), meta: o.getAttribute("data-meta"), deshabilitada: o.disabled });
      });
      return res;
    };
    var pintarBoton = function () {
      var o = sel.options[sel.selectedIndex];
      var vacio = !o || (o.value === "" && sel.selectedIndex === 0);
      if (vacio) datos();
      $(".ob-selector__valor", boton).textContent = vacio ? marcador : o.textContent.trim();
      if (vacio) boton.setAttribute("data-vacio", "");
      else boton.removeAttribute("data-vacio");
      boton.disabled = sel.disabled;
      if (sel.getAttribute("aria-invalid")) boton.setAttribute("aria-invalid", sel.getAttribute("aria-invalid"));
      else boton.removeAttribute("aria-invalid");
    };
    var pintarLista = function () {
      var termino = entradaBusqueda ? normalizar(entradaBusqueda.value) : "";
      visibles = datos().filter(function (d) {
        return !termino || normalizar(d.texto + " " + (d.meta || "")).indexOf(termino) >= 0;
      });
      if (!visibles.length) {
        opcionesCaja.innerHTML = '<div class="ob-lista-flotante__vacio">' + escapar(sel.getAttribute("data-texto-vacio") || "Sin resultados") + "</div>";
        activo = -1;
        return;
      }
      opcionesCaja.innerHTML = visibles
        .map(function (d, i) {
          var elegida = d.valor === sel.value;
          return (
            '<div class="ob-opcion" role="option" id="' + idLista + "-" + i + '" data-i="' + i + '" aria-selected="' + elegida + '"' +
            (d.deshabilitada ? ' aria-disabled="true"' : "") + ">" +
            '<span class="ob-opcion__texto">' + escapar(d.texto) + "</span>" +
            (d.meta ? '<span class="ob-opcion__meta">' + escapar(d.meta) + "</span>" : "") +
            '<span class="ob-opcion__marca" aria-hidden="true">' + icono("check", 14) + "</span></div>"
          );
        })
        .join("");
    };
    var marcar = function (i, desplazar) {
      activo = i;
      var focoEn = entradaBusqueda || opcionesCaja;
      $$(".ob-opcion", opcionesCaja).forEach(function (op) {
        var es = Number(op.getAttribute("data-i")) === i;
        if (es) {
          op.setAttribute("data-activo", "");
          focoEn.setAttribute("aria-activedescendant", op.id);
          if (desplazar) op.scrollIntoView({ block: "nearest" });
        } else op.removeAttribute("data-activo");
      });
      if (i < 0) focoEn.removeAttribute("aria-activedescendant");
    };
    var elegir = function (i) {
      var d = visibles[i];
      if (!d || d.deshabilitada) return;
      var nuevo = d.valor;
      // En el combobox, elegir la opción ya marcada la deja sin valor (si hay marcador)
      if (buscar && nuevo === sel.value && sel.options[0] && sel.options[0].value === "") nuevo = "";
      if (sel.value !== nuevo) {
        sel.value = nuevo;
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        emitir(sel, "cambio", { valor: nuevo });
      }
      pintarBoton();
      cerrarFlotante(lista, true);
    };
    var abrir = function () {
      if (sel.disabled) return;
      cerrarFlotantes();
      if (entradaBusqueda) entradaBusqueda.value = "";
      pintarLista();
      abrirFlotante(lista, boton, { lado: "bottom", alinear: "start", anchoAncla: true });
      if (buscar) lista.style.minWidth = Math.max(240, boton.getBoundingClientRect().width) + "px";
      var idx = 0;
      visibles.forEach(function (d, i) {
        if (d.valor === sel.value) idx = i;
      });
      marcar(idx, true);
      enfocar(entradaBusqueda || opcionesCaja);
    };
    boton.addEventListener("click", function () {
      if (flotanteAbierto(lista)) cerrarFlotante(lista, false);
      else abrir();
    });
    boton.addEventListener("keydown", function (e) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].indexOf(e.key) >= 0) {
        e.preventDefault();
        abrir();
      }
    });
    var teclado = function (e) {
      var n = visibles.length;
      if (e.key === "ArrowDown" && n) {
        e.preventDefault();
        marcar((activo + 1) % n, true);
      } else if (e.key === "ArrowUp" && n) {
        e.preventDefault();
        marcar((activo - 1 + n) % n, true);
      } else if (e.key === "Home" && n && !entradaBusqueda) {
        e.preventDefault();
        marcar(0, true);
      } else if (e.key === "End" && n && !entradaBusqueda) {
        e.preventDefault();
        marcar(n - 1, true);
      } else if (e.key === "Enter" || (e.key === " " && !entradaBusqueda)) {
        e.preventDefault();
        if (activo >= 0) elegir(activo);
      } else if (e.key === "Tab") {
        cerrarFlotante(lista, false);
      }
    };
    (entradaBusqueda || opcionesCaja).addEventListener("keydown", teclado);
    if (entradaBusqueda) {
      opcionesCaja.addEventListener("keydown", teclado);
      entradaBusqueda.addEventListener("input", function () {
        pintarLista();
        marcar(visibles.length ? 0 : -1, true);
      });
    }
    opcionesCaja.addEventListener("pointermove", function (e) {
      var op = e.target.closest(".ob-opcion");
      if (op && Number(op.getAttribute("data-i")) !== activo) marcar(Number(op.getAttribute("data-i")), false);
    });
    opcionesCaja.addEventListener("click", function (e) {
      var op = e.target.closest(".ob-opcion");
      if (op) elegir(Number(op.getAttribute("data-i")));
    });
    sel.addEventListener("change", pintarBoton);
    pintarBoton();
    sel.__obActualizar = pintarBoton;
  }
  O.selector = {
    actualizar: function (sel) {
      if (sel && sel.__obActualizar) sel.__obActualizar();
    }
  };

  /* ======================================================================================== */
  /* Campo de fecha con calendario                                                             */
  /* ======================================================================================== */
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var DIAS = ["lu", "ma", "mi", "ju", "vi", "sá", "do"];
  function dos(n) {
    return (n < 10 ? "0" : "") + n;
  }
  function diaISO(d) {
    return d.a + "-" + dos(d.m) + "-" + dos(d.d);
  }
  function diaVista(d) {
    return dos(d.d) + "/" + dos(d.m) + "/" + d.a;
  }
  function diasMes(a, m) {
    return new Date(a, m, 0).getDate();
  }
  function diaValido(d) {
    return d && d.a >= 1900 && d.a <= 2200 && d.m >= 1 && d.m <= 12 && d.d >= 1 && d.d <= diasMes(d.a, d.m);
  }
  function deISO(t) {
    var r = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t || "");
    return r ? { a: +r[1], m: +r[2], d: +r[3] } : null;
  }
  /** Lee dd/mm/aaaa, d/m/aa, dd-mm-aaaa o aaaa-mm-dd. Devuelve aaaa-mm-dd o null. */
  function leerFecha(texto) {
    var t = String(texto || "").trim();
    var iso = deISO(t);
    if (iso) return diaValido(iso) ? diaISO(iso) : null;
    var r = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})$/.exec(t);
    if (!r) return null;
    var a = +r[3];
    if (a < 100) a += 2000;
    var d = { a: a, m: +r[2], d: +r[1] };
    return diaValido(d) ? diaISO(d) : null;
  }
  function hoy() {
    var f = new Date();
    return { a: f.getFullYear(), m: f.getMonth() + 1, d: f.getDate() };
  }
  function sumarDias(d, n) {
    var f = new Date(d.a, d.m - 1, d.d + n);
    return { a: f.getFullYear(), m: f.getMonth() + 1, d: f.getDate() };
  }
  function sumarMeses(d, n) {
    var f = new Date(d.a, d.m - 1 + n, 1);
    var a = f.getFullYear();
    var m = f.getMonth() + 1;
    return { a: a, m: m, d: Math.min(d.d, diasMes(a, m)) };
  }
  function igualDia(x, y) {
    return !!x && !!y && x.a === y.a && x.m === y.m && x.d === y.d;
  }
  O.fecha = { leer: leerFecha };

  function iniciarFecha(caja) {
    var entrada = caja.querySelector("input");
    if (!entrada) return;
    entrada.setAttribute("inputmode", "numeric");
    entrada.setAttribute("autocomplete", "off");
    if (!entrada.placeholder) entrada.placeholder = "dd/mm/aaaa";
    var oculto = null;
    if (caja.getAttribute("data-nombre")) {
      oculto = crear("input");
      oculto.type = "hidden";
      oculto.name = caja.getAttribute("data-nombre");
      caja.appendChild(oculto);
    }
    var boton = crear("button", "ob-boton ob-boton--icono ob-boton--sm ob-fecha__boton", icono("calendario", 16));
    boton.type = "button";
    boton.setAttribute("aria-label", "Abrir calendario");
    caja.appendChild(boton);
    var flot = crear("div", "ob-calendario-flotante");
    flot.hidden = true;
    flot.setAttribute("role", "dialog");
    flot.setAttribute("aria-label", "Elegir fecha");
    doc.body.appendChild(flot);
    var enfocado = null;

    var elegido = function () {
      return deISO(caja.getAttribute("data-valor"));
    };
    var fijar = function (iso, emitirCambio) {
      if (iso) caja.setAttribute("data-valor", iso);
      else caja.removeAttribute("data-valor");
      if (oculto) oculto.value = iso || "";
      var d = deISO(iso);
      entrada.value = d ? diaVista(d) : "";
      entrada.removeAttribute("aria-invalid");
      if (emitirCambio) emitir(caja, "cambio", { valor: iso || null });
    };
    fijar(caja.getAttribute("data-valor") || leerFecha(entrada.value), false);

    var confirmarTexto = function () {
      var t = entrada.value.trim();
      if (t === "") return fijar(null, true);
      var f = leerFecha(t);
      if (f) fijar(f, f !== caja.getAttribute("data-valor") || true);
      else entrada.setAttribute("aria-invalid", "true");
    };
    entrada.addEventListener("blur", function () {
      if (!flotanteAbierto(flot)) confirmarTexto();
    });
    entrada.addEventListener("keydown", function (e) {
      if (e.key === "Enter") confirmarTexto();
      if (e.key === "ArrowDown" && e.altKey) {
        e.preventDefault();
        abrir();
      }
    });

    var pintar = function (enfocarDia) {
      var sel = elegido();
      var h = hoy();
      var primero = new Date(enfocado.a, enfocado.m - 1, 1);
      var desfase = (primero.getDay() + 6) % 7;
      var inicio = sumarDias({ a: enfocado.a, m: enfocado.m, d: 1 }, -desfase);
      var html =
        '<div class="ob-calendario"><div class="ob-calendario__cabeza">' +
        '<span class="ob-calendario__mes" aria-live="polite">' + MESES[enfocado.m - 1].charAt(0).toUpperCase() + MESES[enfocado.m - 1].slice(1) + " " + enfocado.a + "</span>" +
        '<div class="ob-calendario__navegar">' +
        '<button type="button" class="ob-boton ob-boton--icono ob-boton--sm" data-mes="-1" aria-label="Mes anterior">' + icono("chevron-izquierda", 16) + "</button>" +
        '<button type="button" class="ob-boton ob-boton--icono ob-boton--sm" data-mes="1" aria-label="Mes siguiente">' + icono("chevron-derecha", 16) + "</button>" +
        '</div></div><div class="ob-calendario__rejilla" role="grid">';
      DIAS.forEach(function (d) {
        html += '<span class="ob-calendario__dia-semana" aria-hidden="true">' + d + "</span>";
      });
      for (var i = 0; i < 42; i++) {
        var c = sumarDias(inicio, i);
        var es = igualDia(sel, c);
        html +=
          '<button type="button" class="ob-calendario__dia" data-dia="' + diaISO(c) + '" tabindex="' + (igualDia(enfocado, c) ? 0 : -1) + '"' +
          ' aria-pressed="' + es + '" aria-label="' + c.d + " de " + MESES[c.m - 1] + " de " + c.a + '"' +
          (c.m !== enfocado.m ? " data-fuera" : "") + (igualDia(h, c) ? ' data-hoy aria-current="date"' : "") + ">" + c.d + "</button>";
      }
      html +=
        '</div><div class="ob-calendario__pie"><button type="button" class="ob-calendario__hoy" data-hoy-boton>Hoy</button>' +
        (sel ? '<button type="button" class="ob-calendario__hoy" data-borrar>Borrar</button>' : "") + "</div></div>";
      flot.innerHTML = html;
      if (enfocarDia) enfocar(flot.querySelector('[data-dia="' + diaISO(enfocado) + '"]'));
    };
    var abrir = function () {
      if (entrada.disabled) return;
      cerrarFlotantes();
      var f = leerFecha(entrada.value);
      if (f && f !== caja.getAttribute("data-valor")) fijar(f, true);
      enfocado = elegido() || hoy();
      pintar(false);
      abrirFlotante(flot, caja, { lado: "bottom", alinear: "end", expandir: false });
      boton.setAttribute("aria-expanded", "true");
      enfocar(flot.querySelector('[data-dia="' + diaISO(enfocado) + '"]'));
    };
    boton.addEventListener("click", function () {
      if (flotanteAbierto(flot)) cerrarFlotante(flot, false);
      else abrir();
    });
    flot.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.hasAttribute("data-mes")) {
        enfocado = sumarMeses(enfocado, Number(b.getAttribute("data-mes")));
        pintar(false);
        enfocar(flot.querySelector('[data-mes="' + b.getAttribute("data-mes") + '"]'));
        return;
      }
      var iso = b.getAttribute("data-dia") || (b.hasAttribute("data-hoy-boton") ? diaISO(hoy()) : null);
      if (iso || b.hasAttribute("data-borrar")) {
        fijar(iso, true);
        cerrarFlotante(flot, false);
        boton.setAttribute("aria-expanded", "false");
        enfocar(entrada);
      }
    });
    flot.addEventListener("keydown", function (e) {
      if (!e.target.classList.contains("ob-calendario__dia")) return;
      var ds = (new Date(enfocado.a, enfocado.m - 1, enfocado.d).getDay() + 6) % 7;
      var nuevo = null;
      if (e.key === "ArrowLeft") nuevo = sumarDias(enfocado, -1);
      else if (e.key === "ArrowRight") nuevo = sumarDias(enfocado, 1);
      else if (e.key === "ArrowUp") nuevo = sumarDias(enfocado, -7);
      else if (e.key === "ArrowDown") nuevo = sumarDias(enfocado, 7);
      else if (e.key === "PageUp") nuevo = sumarMeses(enfocado, -1);
      else if (e.key === "PageDown") nuevo = sumarMeses(enfocado, 1);
      else if (e.key === "Home") nuevo = sumarDias(enfocado, -ds);
      else if (e.key === "End") nuevo = sumarDias(enfocado, 6 - ds);
      if (!nuevo) return;
      e.preventDefault();
      enfocado = nuevo;
      pintar(true);
    });
    caja.__obFijar = function (iso) {
      fijar(iso, true);
    };
  }

  /* ======================================================================================== */
  /* Controles nativos: casilla, radio, interruptor, deslizador                               */
  /* ======================================================================================== */
  var SVG_CASILLA =
    '<svg viewBox="0 0 12 12" aria-hidden="true"><path class="ob-casilla__check" pathLength="1" d="M2.5 6.25 5 8.75l4.5-5.5"/><path class="ob-casilla__guion" d="M3 6h6"/></svg>';
  function iniciarControles(ctx) {
    $$(".ob-casilla > input", ctx).forEach(function (inp) {
      if (iniciados && iniciados.has(inp)) return;
      if (iniciados) iniciados.add(inp);
      if (!inp.nextElementSibling || inp.nextElementSibling.tagName.toLowerCase() !== "svg")
        inp.insertAdjacentHTML("afterend", SVG_CASILLA);
      if (inp.hasAttribute("data-indeterminada")) inp.indeterminate = true;
    });
    $$(".ob-radio > input", ctx).forEach(function (inp) {
      if (!inp.nextElementSibling) inp.insertAdjacentHTML("afterend", '<span class="ob-radio__punto"></span>');
    });
    $$(".ob-interruptor > input", ctx).forEach(function (inp) {
      if (!inp.getAttribute("role")) inp.setAttribute("role", "switch");
      if (!inp.nextElementSibling) inp.insertAdjacentHTML("afterend", '<span class="ob-interruptor__pulgar"></span>');
    });
  }
  function iniciarDeslizador(r) {
    var salida = r.getAttribute("data-salida") ? $(r.getAttribute("data-salida")) : null;
    var pintar = function () {
      var min = Number(r.min || 0);
      var max = Number(r.max || 100);
      var p = ((Number(r.value) - min) / (max - min || 1)) * 100;
      r.style.setProperty("--ob-valor", p + "%");
      if (salida) salida.textContent = (r.getAttribute("data-prefijo") || "") + formatear(Number(r.value)) + (r.getAttribute("data-sufijo") || "");
    };
    r.addEventListener("input", pintar);
    pintar();
  }

  /* ======================================================================================== */
  /* Carga de archivo                                                                          */
  /* ======================================================================================== */
  function peso(b) {
    if (b < 1024) return formatear(b, 0) + " B";
    if (b < 1048576) return formatear(b / 1024, 0) + " KB";
    return formatear(b / 1048576, 1) + " MB";
  }
  function iniciarArchivo(zona) {
    var input = zona.querySelector('input[type="file"]');
    if (!input) return;
    var lista = zona.getAttribute("data-lista") ? $(zona.getAttribute("data-lista")) : zona.nextElementSibling;
    if (lista && !lista.classList.contains("ob-archivo__lista")) lista = null;
    var pintar = function () {
      if (!lista) return;
      lista.innerHTML = "";
      Array.prototype.forEach.call(input.files || [], function (f, i) {
        var li = crear(
          "li",
          "ob-archivo__elemento",
          icono("documento", 16) +
            '<span class="ob-archivo__nombre">' + escapar(f.name) + "</span>" +
            '<span class="ob-archivo__peso">' + peso(f.size) + "</span>" +
            '<button type="button" class="ob-boton ob-boton--icono ob-boton--xs" aria-label="Quitar ' + escapar(f.name) + '">' + icono("cerrar", 14) + "</button>"
        );
        li.style.setProperty("--ob-i", i);
        li.querySelector("button").addEventListener("click", function () {
          try {
            var dt = new DataTransfer();
            Array.prototype.forEach.call(input.files, function (g, j) {
              if (j !== i) dt.items.add(g);
            });
            input.files = dt.files;
          } catch (e) {
            input.value = "";
          }
          pintar();
          emitir(zona, "archivos", { archivos: Array.prototype.slice.call(input.files || []) });
          enfocar(input);
        });
        lista.appendChild(li);
      });
    };
    var dentro = 0;
    zona.addEventListener("dragenter", function (e) {
      e.preventDefault();
      dentro += 1;
      zona.setAttribute("data-estado", "arrastrando");
    });
    zona.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    zona.addEventListener("dragleave", function () {
      dentro -= 1;
      if (dentro <= 0) {
        dentro = 0;
        zona.removeAttribute("data-estado");
      }
    });
    zona.addEventListener("drop", function (e) {
      e.preventDefault();
      dentro = 0;
      zona.removeAttribute("data-estado");
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        try {
          input.files = e.dataTransfer.files;
        } catch (er) {
          /* navegadores antiguos */
        }
        pintar();
        emitir(zona, "archivos", { archivos: Array.prototype.slice.call(e.dataTransfer.files) });
      }
    });
    input.addEventListener("change", function () {
      pintar();
      emitir(zona, "archivos", { archivos: Array.prototype.slice.call(input.files || []) });
    });
  }

  /* ======================================================================================== */
  /* Acordeón                                                                                  */
  /* ======================================================================================== */
  function iniciarAcordeon(ac) {
    var uno = ac.getAttribute("data-ob-acordeon") === "uno";
    var disparadores = function () {
      return $$(".ob-acordeon__disparador", ac);
    };
    var sincronizar = function (d) {
      var panel = doc.getElementById(d.getAttribute("aria-controls"));
      if (!panel) return;
      panel.setAttribute("aria-labelledby", asegurarId(d, "acordeon"));
      if (d.getAttribute("aria-expanded") === "true") panel.removeAttribute("inert");
      else panel.setAttribute("inert", "");
    };
    disparadores().forEach(function (d) {
      if (!d.hasAttribute("aria-expanded")) d.setAttribute("aria-expanded", "false");
      if (!d.querySelector(".ob-acordeon__chevron")) d.insertAdjacentHTML("beforeend", '<span class="ob-acordeon__chevron">' + icono("chevron-abajo", 16) + "</span>");
      sincronizar(d);
    });
    ac.addEventListener("click", function (e) {
      var d = e.target.closest(".ob-acordeon__disparador");
      if (!d || !ac.contains(d)) return;
      var abrir = d.getAttribute("aria-expanded") !== "true";
      if (uno && abrir)
        disparadores().forEach(function (x) {
          if (x !== d) {
            x.setAttribute("aria-expanded", "false");
            sincronizar(x);
          }
        });
      d.setAttribute("aria-expanded", abrir ? "true" : "false");
      sincronizar(d);
      emitir(ac, "cambio", { disparador: d, abierto: abrir });
    });
  }

  /* ======================================================================================== */
  /* Botón con estados de acción                                                               */
  /* ======================================================================================== */
  function prepararCaras(btn) {
    if (btn.querySelector(":scope > .ob-boton__caras")) return;
    var reposo = crear("span", "ob-boton__cara ob-boton__cara--reposo");
    while (btn.firstChild) reposo.appendChild(btn.firstChild);
    var caras = crear("span", "ob-boton__caras");
    caras.appendChild(reposo);
    var cargando = crear("span", "ob-boton__cara ob-boton__cara--cargando", '<span class="ob-indicador"></span><span class="ob-boton__texto-cargando"></span>');
    cargando.setAttribute("aria-hidden", "true");
    var listo = crear(
      "span",
      "ob-boton__cara ob-boton__cara--listo",
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M5 12.5 10 17.5 19 7" pathLength="1"/></svg><span class="ob-boton__texto-listo"></span>'
    );
    listo.setAttribute("aria-hidden", "true");
    caras.appendChild(cargando);
    caras.appendChild(listo);
    btn.appendChild(caras);
  }
  /** Cambia el estado de un botón: "reposo", "cargando" o "listo". El ancho no cambia. */
  function estadoBoton(btn, estado, opciones) {
    var op = opciones || {};
    prepararCaras(btn);
    var tc = btn.querySelector(".ob-boton__texto-cargando");
    var tl = btn.querySelector(".ob-boton__texto-listo");
    tc.textContent = op.textoCargando || btn.getAttribute("data-texto-cargando") || "";
    tl.textContent = op.textoListo || btn.getAttribute("data-texto-listo") || "Listo";
    if (!tc.textContent) tc.hidden = true;
    else tc.hidden = false;
    btn.setAttribute("data-estado", estado);
    $$(".ob-boton__cara", btn).forEach(function (c) {
      var activa = c.classList.contains("ob-boton__cara--" + estado);
      if (activa) c.removeAttribute("aria-hidden");
      else c.setAttribute("aria-hidden", "true");
    });
    if (estado === "cargando") {
      if (!btn.hasAttribute("data-ob-deshabilitado-previo")) btn.setAttribute("data-ob-deshabilitado-previo", btn.disabled ? "1" : "0");
      btn.disabled = true;
      btn.setAttribute("aria-busy", "true");
    } else {
      btn.removeAttribute("aria-busy");
      if (btn.hasAttribute("data-ob-deshabilitado-previo")) {
        btn.disabled = btn.getAttribute("data-ob-deshabilitado-previo") === "1";
        btn.removeAttribute("data-ob-deshabilitado-previo");
      }
    }
  }
  O.boton = {
    estado: estadoBoton,
    /**
     * Secuencia completa: cargando → listo (1,6 s) → reposo. `trabajo` es una promesa o una función
     * que la devuelve. Si falla, vuelve a reposo y la promesa devuelta se rechaza.
     */
    guardar: function (btn, trabajo, opciones) {
      var op = opciones || {};
      estadoBoton(btn, "cargando", op);
      var p = typeof trabajo === "function" ? trabajo() : trabajo;
      return Promise.resolve(p).then(
        function (v) {
          estadoBoton(btn, "listo", op);
          setTimeout(function () {
            estadoBoton(btn, "reposo", op);
          }, op.duracionListo || 1600);
          return v;
        },
        function (err) {
          estadoBoton(btn, "reposo", op);
          throw err;
        }
      );
    }
  };

  /* ======================================================================================== */
  /* Copiar al portapapeles                                                                    */
  /* ======================================================================================== */
  O.copiar = function (texto) {
    var respaldo = function () {
      return new Promise(function (resolver, rechazar) {
        var t = crear("textarea");
        t.value = texto;
        t.setAttribute("readonly", "");
        t.style.position = "fixed";
        t.style.opacity = "0";
        doc.body.appendChild(t);
        t.select();
        var ok = false;
        try {
          ok = doc.execCommand("copy");
        } catch (e) {
          ok = false;
        }
        t.remove();
        if (ok) resolver();
        else rechazar(new Error("No se pudo copiar"));
      });
    };
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(texto).catch(respaldo);
    return respaldo();
  };
  doc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-ob-copiar]");
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    var sel = b.getAttribute("data-ob-copiar");
    var texto = b.getAttribute("data-texto");
    if (texto == null) {
      var origen = sel ? $(sel) : (b.closest(".ob-bloque-codigo") || b.parentNode).querySelector("code");
      texto = origen ? origen.textContent : "";
    }
    O.copiar(texto).then(
      function () {
        if (b.classList.contains("ob-boton")) {
          estadoBoton(b, "listo", { textoListo: b.getAttribute("data-texto-listo") || "Copiado" });
          clearTimeout(b.__obCopia);
          b.__obCopia = setTimeout(function () {
            estadoBoton(b, "reposo");
          }, 1400);
        } else O.aviso({ titulo: "Copiado", descripcion: texto.length < 60 ? texto : undefined, tono: "exito", duracion: 2200 });
      },
      function () {
        O.aviso({ titulo: "No se pudo copiar", descripcion: "El navegador no dejó usar el portapapeles.", tono: "error" });
      }
    );
  });

  /* ======================================================================================== */
  /* Avisos (toasts)                                                                           */
  /* ======================================================================================== */
  var contenedorAvisos = null;
  var MAX_AVISOS = 4;
  function asegurarAvisos() {
    if (contenedorAvisos && contenedorAvisos.isConnected) return contenedorAvisos;
    contenedorAvisos = crear("section", "ob-avisos");
    contenedorAvisos.setAttribute("aria-label", "Avisos");
    contenedorAvisos.setAttribute("aria-live", "polite");
    contenedorAvisos.setAttribute("aria-relevant", "additions text");
    doc.body.appendChild(contenedorAvisos);
    return contenedorAvisos;
  }
  /** Mueve con suavidad los avisos que cambian de sitio al entrar o salir otro (FLIP). */
  function flipAvisos(cambio) {
    var c = asegurarAvisos();
    var antes = new Map();
    $$(".ob-aviso", c).forEach(function (a) {
      antes.set(a, a.getBoundingClientRect().top);
    });
    cambio();
    if (reducido()) return;
    antes.forEach(function (top, a) {
      if (!a.isConnected) return;
      var d = top - a.getBoundingClientRect().top;
      if (Math.abs(d) < 1) return;
      animar(a, [{ translate: "0 " + d + "px" }, { translate: "0 0" }], { duration: 240, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    });
  }
  var ICONO_TONO = { exito: "exito", error: "error", alerta: "alerta", info: "info" };
  /**
   * Muestra un aviso abajo a la derecha. opciones: titulo, descripcion, tono (exito, error,
   * alerta, info, cargando), duracion (ms; 0 = hasta cerrarlo), progreso (0–1, operaciones largas),
   * accion { texto, alHacer }, cerrable. Devuelve { elemento, actualizar(opciones), cerrar() }.
   */
  O.aviso = function (opciones) {
    var op = typeof opciones === "string" ? { titulo: opciones } : opciones || {};
    var c = asegurarAvisos();
    var el = crear("div", "ob-aviso");
    el.setAttribute("role", op.tono === "error" ? "alert" : "status");
    var temporizador = null;
    var restante = 0;
    var inicio = 0;
    var cerrado = false;
    var pintar = function () {
      var tono = op.tono || "info";
      el.setAttribute("data-tono", tono);
      var ic = tono === "cargando" ? '<span class="ob-indicador"></span>' : icono(ICONO_TONO[tono] || "info", 16);
      var duracion = duracionDe();
      el.innerHTML =
        '<span class="ob-aviso__icono">' + ic + "</span>" +
        '<div class="ob-aviso__cuerpo"><p class="ob-aviso__titulo">' + escapar(op.titulo || "") + "</p>" +
        (op.descripcion ? '<p class="ob-aviso__descripcion">' + escapar(op.descripcion) + "</p>" : "") + "</div>" +
        (op.accion || op.cerrable
          ? '<div class="ob-aviso__acciones">' +
            (op.accion ? '<button type="button" class="ob-boton ob-boton--primario ob-boton--sm" data-accion>' + escapar(op.accion.texto) + "</button>" : "") +
            (op.cerrable ? '<button type="button" class="ob-boton ob-boton--icono ob-boton--xs" data-cerrar aria-label="Cerrar aviso">' + icono("cerrar", 14) + "</button>" : "") +
            "</div>"
          : "") +
        (typeof op.progreso === "number"
          ? '<div class="ob-aviso__progreso" role="progressbar" aria-label="Progreso" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
            Math.round(op.progreso * 100) + '"><div class="ob-aviso__progreso-barra" style="--ob-progreso:' + limitar(op.progreso, 0, 1) + '"></div></div>'
          : duracion && op.cuentaAtras !== false
            ? '<div class="ob-aviso__progreso" data-cuenta aria-hidden="true" style="--ob-duracion:' + duracion + 'ms"><div class="ob-aviso__progreso-barra"></div></div>'
            : "");
      var acc = el.querySelector("[data-accion]");
      if (acc)
        acc.addEventListener("click", function () {
          if (op.accion.alHacer) op.accion.alHacer();
          cerrar();
        });
      var x = el.querySelector("[data-cerrar]");
      if (x) x.addEventListener("click", cerrar);
    };
    var duracionDe = function () {
      if (op.duracion != null) return op.duracion;
      if (op.tono === "cargando" || typeof op.progreso === "number") return 0;
      return op.tono === "error" ? 8000 : 5000;
    };
    var programar = function () {
      clearTimeout(temporizador);
      restante = duracionDe();
      if (!restante) return;
      inicio = Date.now();
      temporizador = setTimeout(cerrar, restante);
    };
    el.addEventListener("mouseenter", function () {
      if (!temporizador) return;
      clearTimeout(temporizador);
      temporizador = null;
      restante -= Date.now() - inicio;
    });
    el.addEventListener("mouseleave", function () {
      if (cerrado || !duracionDe() || temporizador) return;
      inicio = Date.now();
      temporizador = setTimeout(cerrar, Math.max(800, restante));
    });
    function cerrar() {
      if (cerrado) return;
      cerrado = true;
      clearTimeout(temporizador);
      el.setAttribute("data-estado", "saliendo");
      setTimeout(
        function () {
          flipAvisos(function () {
            el.remove();
          });
        },
        reducido() ? 0 : 180
      );
    }
    pintar();
    flipAvisos(function () {
      c.appendChild(el);
      var vivos = $$('.ob-aviso:not([data-estado="saliendo"])', c);
      if (vivos.length > MAX_AVISOS) vivos[0].remove();
    });
    reflujo(el);
    el.setAttribute("data-estado", "visible");
    programar();
    return {
      elemento: el,
      actualizar: function (nuevas) {
        var tenia = typeof op.progreso === "number";
        for (var k in nuevas) if (Object.prototype.hasOwnProperty.call(nuevas, k)) op[k] = nuevas[k];
        // Solo el progreso: se mueve la barra sin redibujar (la transición se ve)
        var soloProgreso = tenia && Object.keys(nuevas).length === 1 && "progreso" in nuevas;
        if (soloProgreso) {
          var b = el.querySelector(".ob-aviso__progreso-barra");
          var pb = el.querySelector(".ob-aviso__progreso");
          if (b) b.style.setProperty("--ob-progreso", limitar(op.progreso, 0, 1));
          if (pb) pb.setAttribute("aria-valuenow", Math.round(op.progreso * 100));
          return;
        }
        if ("tono" in nuevas && nuevas.tono !== "cargando" && !("progreso" in nuevas)) delete op.progreso;
        pintar();
        programar();
      },
      cerrar: cerrar
    };
  };
  /** Aviso ligado a una promesa: cargando → éxito o error. */
  O.aviso.promesa = function (promesa, textos) {
    var t = textos || {};
    var a = O.aviso({ titulo: t.cargando || "Procesando…", tono: "cargando" });
    return Promise.resolve(promesa).then(
      function (v) {
        a.actualizar({ titulo: typeof t.exito === "function" ? t.exito(v) : t.exito || "Listo", tono: "exito", descripcion: t.descripcionExito });
        return v;
      },
      function (e) {
        a.actualizar({ titulo: t.error || "Algo falló", tono: "error", descripcion: e && e.message });
        throw e;
      }
    );
  };

  /* ======================================================================================== */
  /* Cifras: rodillo de dígitos                                                                */
  /* ======================================================================================== */
  var COLUMNA = (function () {
    var s = "";
    for (var i = 0; i < 10; i++) s += "<span>" + i + "</span>";
    return s;
  })();
  function iniciarCifra(el) {
    var decimales = el.hasAttribute("data-decimales") ? Number(el.getAttribute("data-decimales")) : 0;
    var valorActual = null;
    var digitosPrevios = "";
    var pintar = function (valor, desde) {
      if (valor == null || !isFinite(valor)) {
        el.innerHTML = '<span class="ob-cifra__vacio">—</span>';
        valorActual = null;
        digitosPrevios = "";
        return;
      }
      var texto = formatear(valor, decimales);
      var previo = desde == null ? "" : desde;
      var html = '<span class="ob-solo-lector">' + texto + '</span><span class="ob-rodillo" aria-hidden="true">';
      // Se alinean por la derecha los dígitos anteriores y los nuevos
      var soloPrev = previo.replace(/\D/g, "");
      var soloNuevo = texto.replace(/\D/g, "");
      var offset = soloNuevo.length - soloPrev.length;
      var k = 0;
      for (var i = 0; i < texto.length; i++) {
        var ch = texto[i];
        if (/\d/.test(ch)) {
          var j = k - offset;
          var inicial = j >= 0 && j < soloPrev.length ? Number(soloPrev[j]) : 0;
          html +=
            '<span class="ob-rodillo__digito"><span class="ob-rodillo__sombra">' + ch + "</span>" +
            '<span class="ob-rodillo__columna" data-d="' + ch + '" style="--ob-d:' + inicial + '">' + COLUMNA + "</span></span>";
          k++;
        } else html += '<span class="ob-rodillo__signo">' + ch + "</span>";
      }
      html += "</span>";
      el.innerHTML = html;
      reflujo(el);
      var columnas = $$(".ob-rodillo__columna", el);
      columnas.forEach(function (c) {
        c.style.setProperty("--ob-d", c.getAttribute("data-d"));
      });
      var digitos = $$(".ob-rodillo__digito", el);
      setTimeout(function () {
        digitos.forEach(function (d) {
          d.setAttribute("data-quieto", "");
        });
      }, reducido() ? 0 : 640);
      valorActual = valor;
      digitosPrevios = texto;
    };
    var api = {
      fijar: function (valor) {
        var desde = digitosPrevios;
        pintar(valor, reducido() ? null : desde || null);
        if (reducido()) return;
      },
      reproducir: function () {
        if (valorActual == null) return;
        pintar(valorActual, reducido() ? formatear(valorActual, decimales) : "");
      },
      valor: function () {
        return valorActual;
      }
    };
    el.__obCifra = api;
    var inicial = el.getAttribute("data-ob-cifra");
    var v = inicial === "" ? leerNumero(el.textContent) : Number(inicial);
    // Se anima al entrar en la vista (una vez)
    if (typeof IntersectionObserver === "function" && !reducido()) {
      el.innerHTML = '<span class="ob-solo-lector">' + (v == null ? "—" : formatear(v, decimales)) + "</span>" + '<span aria-hidden="true" style="visibility:hidden">' + (v == null ? "—" : formatear(v, decimales)) + "</span>";
      valorActual = v;
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) {
            io.disconnect();
            pintar(v, "");
          }
        });
      });
      io.observe(el);
    } else pintar(v, null);
  }
  /** Cambia el valor de una cifra con rodillo: Obsidiana.cifra(el, 3412875). */
  O.cifra = function (el, valor) {
    if (typeof el === "string") el = $(el);
    if (!el) return;
    if (!el.__obCifra) {
      el.setAttribute("data-ob-cifra", valor);
      iniciarCifra(el);
    } else el.__obCifra.fijar(valor);
  };

  /* ======================================================================================== */
  /* Escalonado y reproducción de animaciones                                                  */
  /* ======================================================================================== */
  function escalonar(el) {
    Array.prototype.forEach.call(el.children, function (h, i) {
      h.style.setProperty("--ob-i", Math.min(i, 8));
    });
    el.classList.remove("ob-escalonar");
    reflujo(el);
    el.classList.add("ob-escalonar");
  }
  O.escalonar = function (el) {
    if (typeof el === "string") el = $(el);
    if (el) escalonar(el);
  };
  O.reanimar = function (el) {
    if (typeof el === "string") el = $(el);
    if (!el) return;
    reanimar(el);
    $$("*", el).forEach(function (h) {
      if (getComputedStyle(h).animationName !== "none") reanimar(h);
    });
  };

  /* ======================================================================================== */
  /* Tabla de datos                                                                            */
  /* ======================================================================================== */
  function textoCelda(td) {
    return td ? (td.getAttribute("data-valor") != null ? td.getAttribute("data-valor") : td.textContent.trim()) : "";
  }
  function iniciarTabla(marco) {
    var desp = marco.querySelector(".ob-tabla-desplazable");
    var tabla = marco.querySelector("table.ob-tabla");
    if (!desp || !tabla) return;
    // Ventana con sombra de borde derecho
    var ventana = desp.parentNode.classList.contains("ob-tabla-ventana") ? desp.parentNode : null;
    if (!ventana) {
      ventana = crear("div", "ob-tabla-ventana");
      desp.parentNode.insertBefore(ventana, desp);
      ventana.appendChild(desp);
    }
    var sombra = ventana.querySelector(".ob-tabla__sombra-derecha");
    if (!sombra) {
      sombra = crear("span", "ob-tabla__sombra-derecha");
      sombra.setAttribute("aria-hidden", "true");
      ventana.insertBefore(sombra, desp);
    }
    var medir = function () {
      if (desp.scrollLeft > 0) desp.setAttribute("data-desplazada", "");
      else desp.removeAttribute("data-desplazada");
      if (desp.scrollLeft + desp.clientWidth < desp.scrollWidth - 1) sombra.setAttribute("data-visible", "");
      else sombra.removeAttribute("data-visible");
    };
    desp.addEventListener("scroll", medir, { passive: true });
    if (typeof ResizeObserver === "function") new ResizeObserver(medir).observe(desp);
    medir();

    var cuerpo = tabla.tBodies[0];
    var filas = function () {
      return $$("tr[data-fila]", cuerpo);
    };
    // Celdas vacías: "—" en texto-3
    var rellenarVacias = function () {
      $$("td", cuerpo).forEach(function (td) {
        if (!td.children.length && td.textContent.trim() === "" && !td.classList.contains("ob-tabla__celda-completa"))
          td.innerHTML = '<span class="ob-vacio-valor">—</span>';
        var fija = td.querySelector(":scope > .ob-tabla__celda-fija");
        if (fija && !fija.children.length && fija.textContent.trim() === "") fija.innerHTML = '<span class="ob-vacio-valor">—</span>';
      });
    };
    rellenarVacias();
    // Texto completo al pasar por celdas que pueden recortarse
    $$("td", cuerpo).forEach(function (td) {
      if (!td.title && !td.querySelector("button, a, .ob-pildora") && td.textContent.trim().length > 14) td.title = td.textContent.trim();
    });

    var abrible = marco.hasAttribute("data-seleccionable") || filas().some(function (f) {
      return f.hasAttribute("data-ob-abrir");
    });
    filas().forEach(function (f, i) {
      f.tabIndex = i === 0 ? 0 : -1;
      if (abrible) f.setAttribute("data-abrible", "");
    });

    var seleccionar = function (fila) {
      if (marco.hasAttribute("data-seleccionable")) {
        filas().forEach(function (f) {
          if (f === fila) {
            f.setAttribute("aria-selected", "true");
            f.setAttribute("data-seleccionada", "");
          } else {
            f.removeAttribute("aria-selected");
            f.removeAttribute("data-seleccionada");
          }
        });
      }
    };
    var abrirFila = function (fila) {
      var r = fila.getBoundingClientRect();
      var origen = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      seleccionar(fila);
      emitir(marco, "abrir", { fila: fila, id: fila.getAttribute("data-id"), origen: origen });
      var destino = fila.getAttribute("data-ob-abrir");
      if (destino) abrirModal(destino, { disparador: fila, origen: origen });
    };
    cuerpo.addEventListener("click", function (e) {
      var fila = e.target.closest("tr[data-fila]");
      if (!fila || e.target.closest("button, a, input, label, select")) return;
      filas().forEach(function (f) {
        f.tabIndex = f === fila ? 0 : -1;
      });
      if (abrible) abrirFila(fila);
    });
    cuerpo.addEventListener("keydown", function (e) {
      var lista = filas();
      var i = lista.indexOf(doc.activeElement);
      if (i < 0) return;
      var destino = null;
      var paso = Math.max(1, Math.floor(desp.clientHeight / 44) - 1);
      if (e.key === "ArrowDown") destino = lista[Math.min(i + 1, lista.length - 1)];
      else if (e.key === "ArrowUp") destino = lista[Math.max(i - 1, 0)];
      else if (e.key === "Home") destino = lista[0];
      else if (e.key === "End") destino = lista[lista.length - 1];
      else if (e.key === "PageDown") destino = lista[Math.min(i + paso, lista.length - 1)];
      else if (e.key === "PageUp") destino = lista[Math.max(i - paso, 0)];
      else if (e.key === "Enter" || e.key === " ") {
        if (abrible) {
          e.preventDefault();
          abrirFila(lista[i]);
        }
        return;
      }
      if (destino) {
        e.preventDefault();
        lista.forEach(function (f) {
          f.tabIndex = f === destino ? 0 : -1;
        });
        enfocar(destino);
        destino.scrollIntoView({ block: "nearest" });
      }
    });

    // Orden por columna: ascendente → descendente → sin orden
    var ths = $$("thead th", tabla);
    ths.forEach(function (th, col) {
      var b = th.querySelector(".ob-tabla__orden");
      if (!b) return;
      if (!b.querySelector(".ob-tabla__orden-texto")) {
        var texto = b.textContent.trim();
        b.innerHTML = '<span class="ob-tabla__orden-texto">' + escapar(texto) + "</span>";
        b.title = texto;
      }
      if (!b.querySelector(".ob-tabla__orden-flecha"))
        b.insertAdjacentHTML("beforeend", '<span class="ob-tabla__orden-flecha" aria-hidden="true">' + icono("ordenar", 12) + "</span>");
      b.type = "button";
      b.addEventListener("click", function () {
        var actual = th.getAttribute("aria-sort");
        var nuevo = actual === "ascending" ? "descending" : actual === "descending" ? null : "ascending";
        ths.forEach(function (o) {
          o.removeAttribute("aria-sort");
        });
        if (nuevo) th.setAttribute("aria-sort", nuevo);
        if (!marco.hasAttribute("data-orden-externo")) ordenar(col, nuevo);
        emitir(marco, "orden", { columna: col, id: th.getAttribute("data-id") || b.textContent.trim(), direccion: nuevo });
      });
    });
    var original = filas();
    var ordenar = function (col, dir) {
      var lista = dir ? filas().slice() : original.slice();
      if (dir) {
        var numerica = lista.every(function (f) {
          var t = textoCelda(f.cells[col]);
          return t === "" || t === "—" || leerNumero(t) !== null;
        });
        lista.sort(function (a, b) {
          var x = textoCelda(a.cells[col]);
          var y = textoCelda(b.cells[col]);
          var vx = x === "" || x === "—";
          var vy = y === "" || y === "—";
          if (vx !== vy) return vx ? 1 : -1; // vacías al final
          var r = numerica
            ? leerNumero(x) - leerNumero(y)
            : normalizar(x).localeCompare(normalizar(y), "es", { numeric: true });
          return dir === "descending" ? -r : r;
        });
      }
      lista.forEach(function (f) {
        cuerpo.appendChild(f);
      });
    };

    // Columnas redimensionables (data-redimensionable en la tabla)
    if (tabla.hasAttribute("data-redimensionable")) {
      var cols = $$("colgroup col", tabla);
      ths.forEach(function (th, i) {
        var col = cols[i];
        if (!col) return;
        var asa = crear("span", "ob-tabla__asa");
        asa.setAttribute("aria-hidden", "true");
        th.appendChild(asa);
        var inicial = col.style.width;
        asa.addEventListener("pointerdown", function (e) {
          e.preventDefault();
          asa.setPointerCapture(e.pointerId);
          asa.setAttribute("data-activa", "");
          var x0 = e.clientX;
          var w0 = th.getBoundingClientRect().width;
          var mover = function (ev) {
            col.style.width = Math.max(64, Math.round(w0 + ev.clientX - x0)) + "px";
            ajustarAncho();
          };
          var soltar = function () {
            asa.removeAttribute("data-activa");
            asa.removeEventListener("pointermove", mover);
            asa.removeEventListener("pointerup", soltar);
            medir();
          };
          asa.addEventListener("pointermove", mover);
          asa.addEventListener("pointerup", soltar);
        });
        asa.addEventListener("dblclick", function () {
          col.style.width = inicial;
          ajustarAncho();
          medir();
        });
      });
      var ajustarAncho = function () {
        var total = cols.reduce(function (s, c) {
          return s + (parseFloat(c.style.width) || 120);
        }, 0);
        tabla.style.width = "max(" + total + "px, 100%)";
      };
      ajustarAncho();
    }
    marco.__obRellenar = rellenarVacias;
  }

  /* ======================================================================================== */
  /* Paginación                                                                                */
  /* ======================================================================================== */
  function paginasVisibles(actual, total) {
    var i;
    if (total <= 7) {
      var t = [];
      for (i = 0; i < total; i++) t.push(i);
      return t;
    }
    var set = [0, total - 1, actual - 1, actual, actual + 1];
    if (actual <= 2) set.push(1, 2, 3);
    if (actual >= total - 3) set.push(total - 4, total - 3, total - 2);
    var lista = set
      .filter(function (p, idx) {
        return p >= 0 && p < total && set.indexOf(p) === idx;
      })
      .sort(function (a, b) {
        return a - b;
      });
    var salida = [];
    lista.forEach(function (p, idx) {
      if (idx > 0 && p - lista[idx - 1] > 1) salida.push("hueco");
      salida.push(p);
    });
    return salida;
  }
  /** Dibuja la paginación: Obsidiana.paginacion(nav, { pagina: 0, total: 12, alCambiar }). */
  O.paginacion = function (nav, opciones) {
    if (typeof nav === "string") nav = $(nav);
    if (!nav) return;
    var op = opciones || {};
    var estado = { pagina: op.pagina || 0, total: Math.max(1, op.total || 1) };
    nav.classList.add("ob-paginacion");
    nav.setAttribute("aria-label", nav.getAttribute("aria-label") || "Paginación");
    var pintar = function () {
      var p = estado.pagina;
      var html =
        '<button type="button" class="ob-paginacion__boton" data-p="' + (p - 1) + '" aria-label="Página anterior"' + (p === 0 ? " disabled" : "") + ">" + icono("chevron-izquierda", 16) + "</button>";
      paginasVisibles(p, estado.total).forEach(function (x) {
        if (x === "hueco") html += '<span class="ob-paginacion__hueco" aria-hidden="true">·</span>';
        else
          html +=
            '<button type="button" class="ob-paginacion__boton" data-p="' + x + '"' + (x === p ? ' aria-current="page"' : "") + ' aria-label="Página ' + (x + 1) + '">' + (x + 1) + "</button>";
      });
      html +=
        '<button type="button" class="ob-paginacion__boton" data-p="' + (p + 1) + '" aria-label="Página siguiente"' + (p >= estado.total - 1 ? " disabled" : "") + ">" + icono("chevron-derecha", 16) + "</button>";
      nav.innerHTML = html;
    };
    if (!nav.__obPaginacion) {
      nav.addEventListener("click", function (e) {
        var b = e.target.closest("[data-p]");
        if (!b || b.disabled) return;
        var n = limitar(Number(b.getAttribute("data-p")), 0, estado.total - 1);
        if (n === estado.pagina) return;
        estado.pagina = n;
        pintar();
        var foco = nav.querySelector('[aria-current="page"]');
        enfocar(foco);
        if (nav.__obPaginacion.alCambiar) nav.__obPaginacion.alCambiar(n);
        emitir(nav, "pagina", { pagina: n });
      });
    }
    nav.__obPaginacion = { alCambiar: op.alCambiar };
    pintar();
    return {
      fijar: function (pagina, total) {
        if (total != null) estado.total = Math.max(1, total);
        estado.pagina = limitar(pagina, 0, estado.total - 1);
        pintar();
      }
    };
  };

  /* ======================================================================================== */
  /* Filtros de dos niveles con fichas                                                         */
  /* ======================================================================================== */
  function iniciarFiltros(pop) {
    var cats = $$(".ob-filtros__categoria", pop);
    var paneles = $$(".ob-filtros__panel", pop);
    var umbral = Number(pop.getAttribute("data-umbral") || 6);
    var fichas = pop.getAttribute("data-fichas") ? $(pop.getAttribute("data-fichas")) : null;
    var contador = pop.getAttribute("data-contador") ? $(pop.getAttribute("data-contador")) : null;
    var resumen = pop.querySelector(".ob-filtros__resumen");
    var limpiar = pop.querySelector("[data-ob-filtros-limpiar]");
    var nombreDe = function (id) {
      var c = cats.filter(function (x) {
        return x.getAttribute("data-categoria") === id;
      })[0];
      return c ? (c.querySelector(".ob-filtros__categoria-texto") || c).textContent.trim() : id;
    };
    var opcionesDe = function (panel) {
      return $$(".ob-filtros__lista .ob-filtros__opcion:not(.ob-filtros__opcion--todo)", panel);
    };
    // Estructura: búsqueda, "Seleccionar todo" y lista
    paneles.forEach(function (panel) {
      var labels = $$(":scope > .ob-filtros__opcion", panel);
      var lista = panel.querySelector(".ob-filtros__lista");
      if (!lista) {
        lista = crear("div", "ob-filtros__lista");
        labels.forEach(function (l) {
          lista.appendChild(l);
        });
        panel.appendChild(lista);
      }
      var cat = nombreDe(panel.getAttribute("data-categoria"));
      var todo = crear(
        "label",
        "ob-filtros__opcion ob-filtros__opcion--todo",
        '<span class="ob-casilla"><input type="checkbox" data-todo>' + SVG_CASILLA + "</span>Seleccionar todo"
      );
      lista.insertBefore(crear("div", "ob-filtros__division"), lista.firstChild);
      lista.insertBefore(todo, lista.firstChild);
      if (opcionesDe(panel).length >= umbral) {
        var b = crear("div", "ob-filtros__buscar", icono("buscar", 14));
        var inp = crear("input");
        inp.type = "text";
        inp.placeholder = "Buscar en " + cat.toLowerCase();
        inp.setAttribute("aria-label", "Buscar en " + cat.toLowerCase());
        b.appendChild(inp);
        panel.insertBefore(b, lista);
        inp.addEventListener("input", function () {
          var t = normalizar(inp.value);
          var hay = 0;
          opcionesDe(panel).forEach(function (o) {
            var ok = !t || normalizar(o.textContent).indexOf(t) >= 0;
            o.hidden = !ok;
            if (ok) hay++;
          });
          var vacio = lista.querySelector(".ob-filtros__vacio");
          if (!hay && !vacio) lista.appendChild(crear("p", "ob-filtros__vacio", "Sin resultados"));
          if (hay && vacio) vacio.remove();
          sincronizar();
        });
      }
      panel.setAttribute("role", "tabpanel");
    });
    var seleccion = function () {
      var s = {};
      paneles.forEach(function (panel) {
        var v = opcionesDe(panel)
          .map(function (o) {
            return o.querySelector("input");
          })
          .filter(function (i) {
            return i && i.checked;
          })
          .map(function (i) {
            return i.value;
          });
        if (v.length) s[panel.getAttribute("data-categoria")] = v;
      });
      return s;
    };
    var etiquetaDe = function (panel, valor) {
      var o = opcionesDe(panel).filter(function (x) {
        return x.querySelector("input").value === valor;
      })[0];
      var t = o && o.querySelector(".ob-filtros__opcion-texto");
      return t ? t.textContent.trim() : valor;
    };
    var pintarFichas = function (s) {
      if (!fichas) return;
      var existentes = {};
      $$(".ob-ficha[data-categoria]", fichas).forEach(function (f) {
        existentes[f.getAttribute("data-categoria")] = f;
      });
      paneles.forEach(function (panel) {
        var id = panel.getAttribute("data-categoria");
        var v = s[id];
        var f = existentes[id];
        if (!v) {
          if (f && f.getAttribute("data-estado") !== "saliendo") {
            f.setAttribute("data-estado", "saliendo");
            setTimeout(function () {
              f.remove();
            }, reducido() ? 0 : 140);
          }
          return;
        }
        var etiquetas = v.map(function (x) {
          return etiquetaDe(panel, x);
        });
        var texto = etiquetas.length <= 2 ? etiquetas.join(", ") : etiquetas[0] + " y " + (etiquetas.length - 1) + " más";
        var nombre = nombreDe(id);
        if (!f) {
          f = crear("span", "ob-ficha");
          f.setAttribute("data-categoria", id);
          f.setAttribute("data-estado", "entrando");
          f.innerHTML =
            '<span class="ob-ficha__categoria">' + escapar(nombre) + '</span><span class="ob-ficha__valor"></span>' +
            '<button type="button" class="ob-ficha__cerrar" aria-label="Quitar filtro ' + escapar(nombre) + '">' + icono("cerrar", 12) + "</button>";
          f.querySelector("button").addEventListener("click", function () {
            opcionesDe(panel).forEach(function (o) {
              o.querySelector("input").checked = false;
            });
            sincronizar(true);
          });
          fichas.appendChild(f);
        }
        f.querySelector(".ob-ficha__valor").textContent = texto;
        f.title = nombre + ": " + etiquetas.join(", ");
      });
    };
    var sincronizar = function (emitirCambio) {
      var s = seleccion();
      var total = 0;
      paneles.forEach(function (panel) {
        var id = panel.getAttribute("data-categoria");
        var n = (s[id] || []).length;
        total += n;
        var cat = cats.filter(function (c) {
          return c.getAttribute("data-categoria") === id;
        })[0];
        if (cat) {
          var cont = cat.querySelector(".ob-contador");
          if (n && !cont) {
            cont = crear("span", "ob-contador");
            cat.appendChild(cont);
          }
          if (cont) {
            if (n) cont.textContent = n;
            else cont.remove();
          }
        }
        var visiblesOps = opcionesDe(panel).filter(function (o) {
          return !o.hidden;
        });
        var alcance = pop.getAttribute("data-seleccionar-todo") === "visibles" ? visiblesOps : opcionesDe(panel);
        var marcadas = alcance.filter(function (o) {
          return o.querySelector("input").checked;
        }).length;
        var todo = panel.querySelector("[data-todo]");
        if (todo) {
          todo.checked = alcance.length > 0 && marcadas === alcance.length;
          todo.indeterminate = marcadas > 0 && marcadas < alcance.length;
        }
      });
      if (contador) {
        contador.textContent = total;
        contador.hidden = !total;
      }
      if (resumen) resumen.textContent = total === 0 ? "Sin filtros activos" : total + (total === 1 ? " valor elegido" : " valores elegidos");
      if (limpiar) limpiar.disabled = total === 0;
      pintarFichas(s);
      if (emitirCambio) emitir(pop, "filtros", { seleccion: s, total: total });
    };
    pop.addEventListener("change", function (e) {
      var inp = e.target;
      if (inp.hasAttribute("data-todo")) {
        var panel = inp.closest(".ob-filtros__panel");
        var vis = pop.getAttribute("data-seleccionar-todo") === "visibles";
        var objetivo = opcionesDe(panel).filter(function (o) {
          return !vis || !o.hidden;
        });
        var completo = objetivo.every(function (o) {
          return o.querySelector("input").checked;
        });
        if (vis && !completo)
          opcionesDe(panel).forEach(function (o) {
            o.querySelector("input").checked = false;
          });
        objetivo.forEach(function (o) {
          o.querySelector("input").checked = !completo;
        });
      }
      sincronizar(true);
    });
    // Categorías como pestañas verticales
    var mostrarCat = function (cat, foco) {
      cats.forEach(function (c) {
        var es = c === cat;
        c.setAttribute("aria-selected", es ? "true" : "false");
        c.tabIndex = es ? 0 : -1;
      });
      paneles.forEach(function (p) {
        p.hidden = p.getAttribute("data-categoria") !== cat.getAttribute("data-categoria");
      });
      if (foco) enfocar(cat);
    };
    cats.forEach(function (c) {
      c.setAttribute("role", "tab");
      var panel = paneles.filter(function (p) {
        return p.getAttribute("data-categoria") === c.getAttribute("data-categoria");
      })[0];
      if (panel) {
        c.setAttribute("aria-controls", asegurarId(panel, "filtro-panel"));
        panel.setAttribute("aria-labelledby", asegurarId(c, "filtro-cat"));
      }
      c.addEventListener("click", function () {
        mostrarCat(c, false);
      });
    });
    var lista = pop.querySelector(".ob-filtros__categorias");
    if (lista) {
      lista.setAttribute("role", "tablist");
      lista.setAttribute("aria-orientation", "vertical");
      lista.addEventListener("keydown", function (e) {
        var i = cats.indexOf(doc.activeElement);
        if (i < 0) return;
        var d = e.key === "ArrowDown" ? cats[(i + 1) % cats.length] : e.key === "ArrowUp" ? cats[(i - 1 + cats.length) % cats.length] : null;
        if (d) {
          e.preventDefault();
          mostrarCat(d, true);
        }
      });
    }
    mostrarCat(
      cats.filter(function (c) {
        return c.getAttribute("aria-selected") === "true";
      })[0] || cats[0],
      false
    );
    if (limpiar)
      limpiar.addEventListener("click", function () {
        $$('.ob-filtros__lista input[type="checkbox"]', pop).forEach(function (i) {
          i.checked = false;
        });
        sincronizar(true);
      });
    sincronizar(false);
    pop.__obLimpiar = function () {
      $$('.ob-filtros__lista input[type="checkbox"]', pop).forEach(function (i) {
        i.checked = false;
      });
      sincronizar(true);
    };
  }
  O.filtros = {
    limpiar: function (pop) {
      if (typeof pop === "string") pop = doc.getElementById(pop);
      if (pop && pop.__obLimpiar) pop.__obLimpiar();
    }
  };

  /* ======================================================================================== */
  /* Gráficas mínimas en SVG                                                                   */
  /* ======================================================================================== */
  function escalaBonita(max, pasos) {
    if (max <= 0) return { tope: 1, paso: 1 };
    var bruto = max / pasos;
    var mag = Math.pow(10, Math.floor(Math.log10(bruto)));
    var norm = bruto / mag;
    var paso = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
    return { tope: Math.ceil(max / paso) * paso, paso: paso };
  }
  function abreviar(v) {
    var a = Math.abs(v);
    if (a >= 1e9) return formatear(v / 1e9, a >= 1e10 ? 0 : 1) + " mil M";
    if (a >= 1e6) return formatear(v / 1e6, a >= 1e7 ? 0 : 1) + " M";
    if (a >= 1e4) return formatear(v / 1e3, 0) + " mil";
    return formatear(v);
  }
  function datosDe(el, op) {
    var valores = op.valores || (el.getAttribute("data-valores") || "").split(",").filter(Boolean).map(Number);
    var etiquetas = op.etiquetas || (el.getAttribute("data-etiquetas") ? el.getAttribute("data-etiquetas").split(",") : []);
    var comparacion = op.comparacion || (el.getAttribute("data-comparacion") ? el.getAttribute("data-comparacion").split(",").map(Number) : null);
    var prefijo = op.prefijo != null ? op.prefijo : el.getAttribute("data-prefijo") || "";
    var unidad = op.unidad != null ? op.unidad : el.getAttribute("data-unidad") || "";
    return { valores: valores, etiquetas: etiquetas, comparacion: comparacion, prefijo: prefijo, unidad: unidad };
  }
  function textoValor(d, v) {
    return (d.prefijo ? d.prefijo + " " : "") + formatear(v) + (d.unidad ? " " + d.unidad : "");
  }
  function graficaBarras(el, op) {
    op = op || {};
    var d = datosDe(el, op);
    var W = Math.max(120, el.clientWidth);
    var H = Math.max(80, el.clientHeight || 180);
    var izq = 44;
    var abajo = 22;
    var arriba = 6;
    var e = escalaBonita(Math.max.apply(null, d.valores.concat([0])), 4);
    var alto = H - abajo - arriba;
    var banda = (W - izq) / Math.max(1, d.valores.length);
    var ancho = Math.min(36, banda * 0.56);
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
    for (var t = 0; t <= e.tope + 1e-9; t += e.paso) {
      var y = Math.round(arriba + alto - (t / e.tope) * alto) + 0.5;
      s += '<line class="' + (t === 0 ? "ob-grafica__base" : "ob-grafica__rejilla") + '" x1="' + izq + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>';
      s += '<text class="ob-grafica__eje" x="' + (izq - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + abreviar(t) + "</text>";
    }
    d.valores.forEach(function (v, i) {
      var h = Math.max(0, (v / e.tope) * alto);
      var x = izq + banda * i + (banda - ancho) / 2;
      var y0 = arriba + alto;
      var r = Math.min(3, ancho / 2, h);
      var path =
        "M" + x + " " + y0 + "V" + (y0 - h + r) + "Q" + x + " " + (y0 - h) + " " + (x + r) + " " + (y0 - h) +
        "H" + (x + ancho - r) + "Q" + (x + ancho) + " " + (y0 - h) + " " + (x + ancho) + " " + (y0 - h + r) + "V" + y0 + "Z";
      var serie = op.resaltar != null ? (i === op.resaltar ? "" : " ob-grafica__barra--tenue") : "";
      s += '<path class="ob-grafica__barra' + serie + '" data-i="' + i + '" style="--ob-i:' + i + '" d="' + path + '"/>';
      if (d.etiquetas[i] != null)
        s += '<text class="ob-grafica__eje" x="' + (x + ancho / 2) + '" y="' + (H - 6) + '" text-anchor="middle">' + escapar(d.etiquetas[i]) + "</text>";
      s += '<rect class="ob-grafica__zona" data-i="' + i + '" x="' + (izq + banda * i) + '" y="' + arriba + '" width="' + banda + '" height="' + alto + '"/>';
    });
    s += "</svg>";
    el.innerHTML = s;
    el.onpointermove = function (ev) {
      var z = ev.target.closest && ev.target.closest(".ob-grafica__zona");
      if (!z) return;
      var i = Number(z.getAttribute("data-i"));
      if (el.__obActiva === i) return;
      el.__obActiva = i;
      el.setAttribute("data-activa", "");
      $$(".ob-grafica__barra", el).forEach(function (b) {
        if (Number(b.getAttribute("data-i")) === i) b.setAttribute("data-activa", "");
        else b.removeAttribute("data-activa");
      });
      var barra = el.querySelector('.ob-grafica__barra[data-i="' + i + '"]');
      mostrarPista(barra, escapar(d.etiquetas[i] || "") + '<span class="ob-pista__secundario">' + escapar(textoValor(d, d.valores[i])) + "</span>", { inmediata: true });
    };
    el.onpointerleave = function () {
      el.__obActiva = null;
      el.removeAttribute("data-activa");
      ocultarPista(true);
    };
  }
  function graficaLineas(el, op) {
    op = op || {};
    var d = datosDe(el, op);
    var W = Math.max(120, el.clientWidth);
    var H = Math.max(80, el.clientHeight || 180);
    var izq = 44;
    var der = 8;
    var abajo = 22;
    var arriba = 8;
    var todos = d.valores.concat(d.comparacion || []);
    var e = escalaBonita(Math.max.apply(null, todos.concat([0])), 4);
    var alto = H - abajo - arriba;
    var n = d.valores.length;
    var px = function (i) {
      return izq + ((W - izq - der) * i) / Math.max(1, n - 1);
    };
    var py = function (v) {
      return arriba + alto - (v / e.tope) * alto;
    };
    var s = '<svg viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '" aria-hidden="true">';
    for (var t = 0; t <= e.tope + 1e-9; t += e.paso) {
      var y = Math.round(py(t)) + 0.5;
      s += '<line class="' + (t === 0 ? "ob-grafica__base" : "ob-grafica__rejilla") + '" x1="' + izq + '" x2="' + W + '" y1="' + y + '" y2="' + y + '"/>';
      s += '<text class="ob-grafica__eje" x="' + (izq - 8) + '" y="' + (y + 4) + '" text-anchor="end">' + abreviar(t) + "</text>";
    }
    var saltoEtiqueta = Math.ceil(n / Math.max(1, Math.floor((W - izq) / 56)));
    d.etiquetas.forEach(function (et, i) {
      if (i % saltoEtiqueta === 0 || i === n - 1)
        s += '<text class="ob-grafica__eje" x="' + px(i) + '" y="' + (H - 6) + '" text-anchor="' + (i === 0 ? "start" : i === n - 1 ? "end" : "middle") + '">' + escapar(et) + "</text>";
    });
    var linea = function (vals) {
      return vals
        .map(function (v, i) {
          return (i ? "L" : "M") + px(i).toFixed(1) + " " + py(v).toFixed(1);
        })
        .join(" ");
    };
    if (d.comparacion) s += '<path class="ob-grafica__linea ob-grafica__linea--comparacion" d="' + linea(d.comparacion) + '"/>';
    var camino = linea(d.valores);
    s += '<path class="ob-grafica__area" d="' + camino + " L" + px(n - 1).toFixed(1) + " " + py(0) + " L" + px(0) + " " + py(0) + ' Z"/>';
    s += '<path class="ob-grafica__linea" pathLength="1" d="' + camino + '"/>';
    s += '<circle class="ob-grafica__punto--final" r="3" cx="' + px(n - 1) + '" cy="' + py(d.valores[n - 1]) + '"/>';
    s += '<line class="ob-grafica__guia" x1="0" x2="0" y1="' + arriba + '" y2="' + (arriba + alto) + '"/>';
    s += '<circle class="ob-grafica__marcador" r="4" cx="0" cy="0"/>';
    s += "</svg>";
    el.innerHTML = s;
    var guia = el.querySelector(".ob-grafica__guia");
    var marca = el.querySelector(".ob-grafica__marcador");
    el.onpointermove = function (ev) {
      var r = el.getBoundingClientRect();
      var x = ((ev.clientX - r.left) / r.width) * W;
      var i = limitar(Math.round(((x - izq) / (W - izq - der)) * (n - 1)), 0, n - 1);
      if (el.__obActiva === i) return;
      el.__obActiva = i;
      el.setAttribute("data-activa", "");
      guia.setAttribute("x1", px(i));
      guia.setAttribute("x2", px(i));
      marca.setAttribute("cx", px(i));
      marca.setAttribute("cy", py(d.valores[i]));
      var html = escapar(d.etiquetas[i] || "") + '<span class="ob-pista__secundario">' + escapar(textoValor(d, d.valores[i])) + "</span>";
      if (d.comparacion) html += '<span class="ob-pista__secundario">antes ' + escapar(formatear(d.comparacion[i])) + "</span>";
      mostrarPista(marca, html, { inmediata: true });
    };
    el.onpointerleave = function () {
      el.__obActiva = null;
      el.removeAttribute("data-activa");
      ocultarPista(true);
    };
  }
  function graficaSparkline(el, op) {
    op = op || {};
    var d = datosDe(el, op);
    var W = el.clientWidth || 72;
    var H = el.clientHeight || 24;
    if (d.valores.length < 2) return;
    var min = Math.min.apply(null, d.valores);
    var max = Math.max.apply(null, d.valores);
    var rango = max - min || 1;
    var pts = d.valores.map(function (v, i) {
      return [(i / (d.valores.length - 1)) * W, H - 2 - ((v - min) / rango) * (H - 4)];
    });
    var camino = pts
      .map(function (p, i) {
        return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      })
      .join(" ");
    var u = pts[pts.length - 1];
    el.innerHTML =
      '<svg viewBox="0 0 ' + W + " " + H + '" aria-hidden="true"><path class="ob-grafica__linea" pathLength="1" d="' + camino + '"/>' +
      '<circle class="ob-grafica__punto--final" r="2" cx="' + u[0] + '" cy="' + u[1] + '"/></svg>';
  }
  function graficaAnillo(el, op) {
    op = op || {};
    var segmentos = op.segmentos;
    if (!segmentos) {
      var vals = (el.getAttribute("data-valores") || "").split(",").map(Number);
      var ets = (el.getAttribute("data-etiquetas") || "").split(",");
      var series = (el.getAttribute("data-series") || "").split(",").filter(Boolean).map(Number);
      segmentos = vals.map(function (v, i) {
        return { valor: v, etiqueta: ets[i] || "", serie: series[i] || i + 1 };
      });
    }
    var tam = op.tamano || Number(el.getAttribute("data-tamano")) || 120;
    var grosor = op.grosor || Number(el.getAttribute("data-grosor")) || 12;
    var r = (tam - grosor) / 2;
    var total = segmentos.reduce(function (s, x) {
      return s + x.valor;
    }, 0) || 1;
    var hueco = segmentos.length > 1 ? 1.2 : 0;
    var acum = 0;
    var s = '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 ' + tam + " " + tam + '" aria-hidden="true">';
    s += '<circle class="ob-dona__carril" cx="' + tam / 2 + '" cy="' + tam / 2 + '" r="' + r + '" stroke-width="' + grosor + '" pathLength="100"/>';
    segmentos.forEach(function (sg, i) {
      var largo = Math.max(0, (sg.valor / total) * 100 - hueco);
      s +=
        '<circle class="ob-dona__segmento" data-i="' + i + '" data-serie="' + (sg.serie || i + 1) + '" style="--ob-i:' + i + '" cx="' + tam / 2 + '" cy="' + tam / 2 + '" r="' + r +
        '" stroke-width="' + grosor + '" pathLength="100" stroke-dasharray="' + largo.toFixed(2) + " " + (100 - largo).toFixed(2) + '" stroke-dashoffset="' + (-acum).toFixed(2) + '"/>';
      acum += (sg.valor / total) * 100;
    });
    s += "</svg>";
    var centroValor = op.centro != null ? op.centro : el.getAttribute("data-centro");
    var centroEtiqueta = op.centroEtiqueta != null ? op.centroEtiqueta : el.getAttribute("data-centro-etiqueta");
    if (centroValor != null)
      s += '<div class="ob-dona__centro"><span class="ob-dona__valor">' + escapar(centroValor) + "</span>" +
        (centroEtiqueta ? '<span class="ob-dona__etiqueta">' + escapar(centroEtiqueta) + "</span>" : "") + "</div>";
    el.classList.add("ob-dona");
    el.innerHTML = s;
    el.onpointerover = function (ev) {
      var sg = ev.target.closest && ev.target.closest(".ob-dona__segmento");
      if (!sg) return;
      var i = Number(sg.getAttribute("data-i"));
      el.setAttribute("data-activa", "");
      $$(".ob-dona__segmento", el).forEach(function (x) {
        if (x === sg) x.setAttribute("data-activa", "");
        else x.removeAttribute("data-activa");
      });
      var x = segmentos[i];
      mostrarPista({ x: ev.clientX, y: ev.clientY - 4 }, escapar(x.etiqueta) + '<span class="ob-pista__secundario">' + formatear(x.valor) + " · " + formatear((x.valor / total) * 100, 0) + " %</span>", { inmediata: true });
    };
    el.onpointerleave = function () {
      el.removeAttribute("data-activa");
      ocultarPista(true);
    };
  }
  var DIBUJANTES = { barras: graficaBarras, lineas: graficaLineas, sparkline: graficaSparkline, anillo: graficaAnillo };
  function iniciarGrafica(el) {
    var tipo = el.getAttribute("data-ob-grafica");
    var f = DIBUJANTES[tipo];
    if (!f) return;
    var primera = true;
    var dibujar = function () {
      if (!visible(el)) return;
      if (!primera) el.setAttribute("data-ob-dibujada", "");
      f(el, el.__obOpciones || {});
      primera = false;
    };
    el.__obRedibujar = dibujar;
    if (tipo !== "anillo" && typeof ResizeObserver === "function") {
      var ancho = 0;
      new ResizeObserver(function () {
        if (el.clientWidth === ancho) return;
        var antes = ancho;
        ancho = el.clientWidth;
        if (antes === 0) {
          primera = true;
          el.removeAttribute("data-ob-dibujada");
        }
        dibujar();
      }).observe(el);
    } else dibujar();
  }
  O.graficas = {};
  Object.keys(DIBUJANTES).forEach(function (tipo) {
    O.graficas[tipo] = function (el, opciones) {
      if (typeof el === "string") el = $(el);
      if (!el) return;
      el.__obOpciones = opciones || {};
      if (!el.getAttribute("data-ob-grafica")) {
        el.setAttribute("data-ob-grafica", tipo);
        iniciarGrafica(el);
        if (iniciados) iniciados.add(el);
      } else {
        el.removeAttribute("data-ob-dibujada");
        DIBUJANTES[tipo](el, el.__obOpciones);
      }
    };
  });
  O.graficas.reproducir = function (el) {
    if (typeof el === "string") el = $(el);
    if (!el || !el.__obRedibujar) return;
    el.removeAttribute("data-ob-dibujada");
    DIBUJANTES[el.getAttribute("data-ob-grafica")](el, el.__obOpciones || {});
  };

  /* ======================================================================================== */
  /* Estado vacío: dibujos                                                                     */
  /* ======================================================================================== */
  var MARCO = "M24 10h72a10 10 0 0 1 10 10v48a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V20a10 10 0 0 1 10-10Z";
  var DIBUJOS = {
    lista: [[MARCO, 0], ["M14 28h92", 150], ["M28 42h40M28 54h28M28 66h34", 300], ["M84 42h8", 450, 1]],
    busqueda: [[MARCO, 0], ["M28 30h36M28 42h24M28 54h30", 150], ["M86 54a10 10 0 1 1-20 0a10 10 0 1 1 20 0Z", 300, 1], ["m83.5 61.5 8 8", 500, 1]],
    documento: [
      ["M40 10h28l16 16v42a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10V20a10 10 0 0 1 10-10Z", 0],
      ["M68 10v16h16", 150],
      ["M42 44h28M42 56h18", 300],
      ["M42 32h10", 450, 1]
    ],
    ruta: [["M24 64c18-2 22-30 42-34s22-14 30-16", 100, 1], ["M24 64a4 4 0 1 1 0 0.01M96 14a4 4 0 1 1 0 0.01", 0]]
  };
  O.vacio = {
    /** SVG del estado vacío: "lista", "busqueda", "documento" o "ruta". Se traza una vez. */
    dibujo: function (tipo) {
      var trazos = DIBUJOS[tipo] || DIBUJOS.lista;
      return (
        '<svg class="ob-vacio__dibujo" viewBox="0 0 120 88" aria-hidden="true"><rect class="ob-vacio__fondo" x="14" y="10" width="92" height="68" rx="10"/>' +
        trazos
          .map(function (t) {
            return '<path class="ob-trazar' + (t[2] ? " ob-vacio__acento" : "") + '" pathLength="1" style="--ob-retraso:' + t[1] + 'ms" d="' + t[0] + '"/>';
          })
          .join("") +
        "</svg>"
      );
    }
  };

  /** Barra de progreso: Obsidiana.progreso(el, 0.4). */
  O.progreso = function (el, valor) {
    if (typeof el === "string") el = $(el);
    if (!el) return;
    var v = limitar(Number(valor) || 0, 0, 1);
    el.removeAttribute("data-estado");
    el.style.setProperty("--valor", v);
    el.setAttribute("aria-valuenow", Math.round(v * 100));
  };

  /* ======================================================================================== */
  /* Inicialización                                                                            */
  /* ======================================================================================== */
  O.config = O.config || {};
  var INICIADORES = [
    ["[data-ob-app]", iniciarApp],
    ["[data-ob-menu]", iniciarDisparadorMenu],
    ["[data-ob-popover]", iniciarPopover],
    ["[data-ob-pestanas]", iniciarPestanas],
    ["[data-ob-segmentado]", iniciarSegmentado],
    ["[data-ob-tira]", iniciarTira],
    ["[data-ob-tema]", iniciarConmutadorTema],
    ["select[data-ob-selector]", iniciarSelector],
    ["[data-ob-fecha]", iniciarFecha],
    ["[data-ob-deslizador]", iniciarDeslizador],
    ["[data-ob-archivo]", iniciarArchivo],
    ["[data-ob-acordeon]", iniciarAcordeon],
    ["[data-ob-tabla]", iniciarTabla],
    ["[data-ob-filtros]", iniciarFiltros],
    ["[data-ob-cifra]", iniciarCifra],
    ["[data-ob-escalonar]", escalonar],
    ["[data-ob-grafica]", iniciarGrafica],
    ["[data-ob-vistas]", iniciarVistas]
  ];
  function iniciar(ctx) {
    var base = ctx || doc;
    iniciarControles(base);
    INICIADORES.forEach(function (par) {
      var lista = $$(par[0], base);
      if (base !== doc && base.matches && base.matches(par[0])) lista.unshift(base);
      lista.forEach(function (el) {
        if (iniciados) {
          if (iniciados.has(el)) return;
          iniciados.add(el);
        } else {
          if (el.__obIniciado) return;
          el.__obIniciado = true;
        }
        try {
          par[1](el);
        } catch (e) {
          if (window.console) console.error("Obsidiana: no se pudo iniciar", par[0], e);
        }
      });
    });
  }
  O.iniciar = iniciar;
  O.utilidades = { normalizar: normalizar, formatear: formatear, leerNumero: leerNumero, escapar: escapar, icono: icono, almacen: almacen };

  function arrancar() {
    if (!raiz.getAttribute("data-theme")) {
      var t = almacen.leer(CLAVE_TEMA);
      raiz.setAttribute("data-theme", t === "claro" ? "claro" : "oscuro");
    }
    iniciar(doc);
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(recolocar);
    if (typeof MutationObserver === "function") {
      var pendientes = [];
      var programado = false;
      new MutationObserver(function (mutaciones) {
        mutaciones.forEach(function (m) {
          Array.prototype.forEach.call(m.addedNodes, function (n) {
            if (n.nodeType === 1) pendientes.push(n);
          });
        });
        if (programado || !pendientes.length) return;
        programado = true;
        Promise.resolve().then(function () {
          programado = false;
          var lista = pendientes;
          pendientes = [];
          lista.forEach(function (n) {
            if (n.isConnected && !n.classList.contains("ob-pista") && !n.classList.contains("ob-aviso")) iniciar(n);
          });
        });
      }).observe(doc.body, { childList: true, subtree: true });
    }
    raiz.setAttribute("data-ob-listo", "");
    emitir(doc, "listo", { version: O.version });
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", arrancar);
  else arrancar();
})();
