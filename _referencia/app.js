(function () {
    "use strict";

    /* ===== UTILIDADES ===== */
    function escaparTexto(texto) {
      const nodo = document.createElement("span");
      nodo.textContent = String(texto ?? "");
      return nodo.textContent;
    }

    function esEmailValido(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

  /* ===== NAVEGACIÓN ===== */
    const navPrincipal = document.getElementById("navPrincipal");
    const btnLoginNav = document.getElementById("btnLoginNav");
    const btnLoginComunidad = document.getElementById("btnLoginComunidad");
    navPrincipal.classList.add("visible");
    const menuNav = document.getElementById("menuNav");
    const btnMenu = document.getElementById("btnMenu");

    const CLAVE_SESION = "alternaUsuario";
    const CLAVE_SESION_LEGACY = "puntoCiegoUsuario";
    btnMenu.addEventListener("click", function () {
      const abierto = menuNav.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", String(abierto));
    });
    document.addEventListener("click", function (e) {
      if (!menuNav.classList.contains("abierto")) return;
      const clickDentroNav = menuNav.contains(e.target);
      const clickBotonMenu = btnMenu.contains(e.target);
      if (!clickDentroNav && !clickBotonMenu) {
        menuNav.classList.remove("abierto");
        btnMenu.setAttribute("aria-expanded", "false");
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 767) {
        menuNav.classList.remove("abierto");
        btnMenu.setAttribute("aria-expanded", "false");
      }
    });

    const heroVideo = document.getElementById("heroVideo");
    if (heroVideo) {
      const heroSection = heroVideo.closest(".hero-inicio");
      function marcarHeroSinVideo() {
        if (heroSection) heroSection.classList.add("hero-inicio--sin-video");
      }
      heroVideo.addEventListener("error", marcarHeroSinVideo);
      const intentoPlay = heroVideo.play();
      if (intentoPlay && typeof intentoPlay.catch === "function") {
        intentoPlay.catch(marcarHeroSinVideo);
      }
    }

    document.querySelectorAll(".nav-principal__links a[href^='#']").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        menuNav.classList.remove("abierto");
        btnMenu.setAttribute("aria-expanded", "false");
      });
    });

    const enlacesSeccion = Array.from(document.querySelectorAll(".nav-principal__links a[href^='#']"));
    const seccionesIds = enlacesSeccion
      .map(function (a) { return a.getAttribute("href"); })
      .filter(function (href) { return href && href !== "#" && document.querySelector(href); });

    function actualizarNavActiva() {
      const y = window.scrollY + (window.innerHeight * 0.24);
      let idActiva = "#inicio";
      seccionesIds.forEach(function (id) {
        const sec = document.querySelector(id);
        if (sec && sec.offsetTop <= y) idActiva = id;
      });
      enlacesSeccion.forEach(function (a) {
        a.classList.toggle("activo", a.getAttribute("href") === idActiva);
      });
      navPrincipal.classList.toggle("compacta", window.scrollY > 16);
    }
    window.addEventListener("scroll", actualizarNavActiva, { passive: true });
    actualizarNavActiva();

  /* ===== ANIMACIONES AL SCROLL ===== */
    let observadorRevelar = null;

    function observarRevelar() {
      if (observadorRevelar) observadorRevelar.disconnect();
      observadorRevelar = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            observadorRevelar.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(".revelar:not(.visible)").forEach(function (el) {
        observadorRevelar.observe(el);
      });
    }
    observarRevelar();

  /* ===== FORMULARIO CONTACTO ===== */
    const formContacto = document.getElementById("formContacto");
    const msgExitoContacto = document.getElementById("msgExitoContacto");
    const dialogoLogin = document.getElementById("dialogoLogin");
    const formLogin = document.getElementById("formLogin");
    const btnCancelarLogin = document.getElementById("btnCancelarLogin");
    let accionPendiente = null;
    let usuarioLogueado = null;

    function cargarSesion() {
      try {
        let guardado = localStorage.getItem(CLAVE_SESION);
        if (!guardado) {
          guardado = localStorage.getItem(CLAVE_SESION_LEGACY);
          if (guardado) {
            localStorage.setItem(CLAVE_SESION, guardado);
            localStorage.removeItem(CLAVE_SESION_LEGACY);
          }
        }
        usuarioLogueado = guardado ? JSON.parse(guardado) : null;
      } catch (_) {
        usuarioLogueado = null;
      }
      if (btnLoginNav) {
        btnLoginNav.textContent = usuarioLogueado ? ("Hola, " + usuarioLogueado.nombre) : "Ingresar";
      }
      if (usuarioLogueado) {
        setEstadoComentario("Sesión iniciada como " + usuarioLogueado.nombre + ".", "ok");
      }
    }

    function requerirLogin(accion) {
      if (usuarioLogueado) return true;
      accionPendiente = accion || null;
      dialogoLogin.showModal();
      return false;
    }

    formContacto.addEventListener("submit", function (e) {
      e.preventDefault();
      let valido = true;
      formContacto.querySelectorAll("label").forEach(function (lbl) { lbl.classList.remove("invalido"); });

      const nombre = formContacto.elements.nombre;
      const email = formContacto.elements.email;
      const interes = formContacto.elements.interes;
      const mensaje = formContacto.elements.mensaje;

      if (nombre.value.trim().length < 2) {
        nombre.closest("label").classList.add("invalido");
        valido = false;
      }
      if (!esEmailValido(email.value.trim())) {
        email.closest("label").classList.add("invalido");
        valido = false;
      }
      if (!interes.value) {
        interes.closest("label").classList.add("invalido");
        valido = false;
      }
      if (mensaje.value.trim().length < 10) {
        mensaje.closest("label").classList.add("invalido");
        valido = false;
      }
      if (!valido) return;

      /* FUTURO: fetch('/api/contacto', { method:'POST', body: JSON.stringify(...) }) */
      msgExitoContacto.classList.add("visible");
      formContacto.reset();
    });

    function abrirLogin() {
      if (usuarioLogueado) {
        localStorage.removeItem(CLAVE_SESION);
        cargarSesion();
        return;
      }
      dialogoLogin.showModal();
    }

    if (btnLoginNav) btnLoginNav.addEventListener("click", abrirLogin);
    if (btnLoginComunidad) btnLoginComunidad.addEventListener("click", abrirLogin);

    btnCancelarLogin.addEventListener("click", function () {
      dialogoLogin.close();
      accionPendiente = null;
    });

    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      const nombre = String(formLogin.elements.nombreLogin.value || "").trim();
      const email = String(formLogin.elements.emailLogin.value || "").trim();
      formLogin.querySelectorAll("label").forEach(function (lbl) { lbl.classList.remove("invalido"); });
      let ok = true;
      if (nombre.length < 2) { formLogin.elements.nombreLogin.closest("label").classList.add("invalido"); ok = false; }
      if (!esEmailValido(email)) { formLogin.elements.emailLogin.closest("label").classList.add("invalido"); ok = false; }
      if (!ok) return;
      usuarioLogueado = { nombre: nombre, email: email };
      localStorage.setItem(CLAVE_SESION, JSON.stringify(usuarioLogueado));
      cargarSesion();
      dialogoLogin.close();
      if (accionPendiente === "agregarDeporte") dialogoDeporte.showModal();
      if (accionPendiente === "comentarMapa" && formComentarioMapa && actividadSeleccionada) {
        formComentarioMapa.elements.comentarioMapa.focus();
        setEstadoComentario("Ya podés comentar en este punto.", "ok");
      }
      accionPendiente = null;
    });

  /* ===== MAPA LEAFLET ===== */
    const COLORES_DEPORTE = {
      "Ultimate Frisbee": "#2d6a4f",
      "Newcom": "#e07a2f",
      "Wingfoil": "#1d7596",
      "Deporte comunitario": "#6b7280"
    };

    /* FUTURO: reemplazar por fetch('/api/actividades') */
    const ACTIVIDADES = [
      { id: 1, deporte: "Ultimate Frisbee", lugar: "Parque Federal", direccion: "Salvador del Carril 2200", horarios: "Lun y jue 20:00", lat: -31.6176, lng: -60.6992, contacto: "@ultimate.sf", historia: "Entrenan con foco en juego limpio y mixto.", mediaUrl: "https://www.youtube.com/", comentarios: [{ autor: "Tomás", texto: "Fui un jueves y me explicaron todo de una." }], recienAgregado: false },
      { id: 2, deporte: "Newcom", lugar: "Club Regatas Santa Fe", direccion: "Av. Alem 3288", horarios: "Mar y vie 18:30", lat: -31.6406, lng: -60.7001, contacto: "@newcom.sf", historia: "Grupo abierto con fuerte espíritu comunitario.", mediaUrl: "https://www.youtube.com/", comentarios: [{ autor: "Mónica", texto: "Muy buen ambiente para sumarse." }], recienAgregado: false },
      { id: 3, deporte: "Wingfoil", lugar: "Laguna Setúbal", direccion: "Costanera Este", horarios: "Sáb y dom 10:00", lat: -31.6253, lng: -60.6618, contacto: "wingfoil.sf@gmail.com", historia: "Iniciación progresiva en aguas de la región.", mediaUrl: "https://www.youtube.com/", comentarios: [{ autor: "Lucio", texto: "Hay clases para principiantes." }], recienAgregado: false },
      { id: 4, deporte: "Ultimate Frisbee", lugar: "Parque Garay", direccion: "Av. Perón 3600", horarios: "Mié 19:00", lat: -31.6547, lng: -60.7118, contacto: "@ultimate.garay", historia: "Entrenamientos recreativos para sumarse desde cero.", mediaUrl: "https://www.youtube.com/", comentarios: [], recienAgregado: false },
      { id: 5, deporte: "Newcom", lugar: "C.I.C. Facundo Zuviría", direccion: "Facundo Zuviría 8000", horarios: "Lun, mié y vie 17:00", lat: -31.5848, lng: -60.6904, contacto: "@newcom.zuviria", historia: "Participación intergeneracional y torneos barriales.", mediaUrl: "https://www.youtube.com/", comentarios: [], recienAgregado: false }
    ];

    let actividades = ACTIVIDADES.slice();
    let actividadSeleccionada = null;
    let filtroDeporte = "Todos";
    let posicionUsuario = { lat: -31.6333, lng: -60.7 };
    let mapa, capaMarcadores, marcadorUsuario, circuloRadio;

    const radioBusqueda = document.getElementById("radioBusqueda");
    const valorRadio = document.getElementById("valorRadio");
    const contadorActividades = document.getElementById("contadorActividades");
    const listaLugares = document.getElementById("listaLugares");
    const filtrosDeporte = document.getElementById("filtrosDeporte");
    const hojaInferior = document.getElementById("hojaInferior");
    const toggleHoja = document.getElementById("toggleHoja");
    const agarreHoja = document.getElementById("agarreHoja");
    const dialogoDeporte = document.getElementById("dialogoDeporte");
    const formAgregarDeporte = document.getElementById("formAgregarDeporte");
    const btnAgregarDeporte = document.getElementById("btnAgregarDeporte");
    const btnCancelarDeporte = document.getElementById("btnCancelarDeporte");
    const tituloActividad = document.getElementById("tituloActividad");
    const metaActividad = document.getElementById("metaActividad");
    const comentariosMapa = document.getElementById("comentariosMapa");
    const formComentarioMapa = document.getElementById("formComentarioMapa");
    const estadoComentarioMapa = document.getElementById("estadoComentarioMapa");
    const comentarioMapaTextarea = formComentarioMapa ? formComentarioMapa.elements.comentarioMapa : null;
    const comentarioMapaBtn = formComentarioMapa ? formComentarioMapa.querySelector("button[type='submit']") : null;

    function setEstadoComentario(texto, tipo) {
      if (!estadoComentarioMapa) return;
      estadoComentarioMapa.textContent = texto;
      estadoComentarioMapa.classList.remove("ok", "warn");
      if (tipo) estadoComentarioMapa.classList.add(tipo);
    }

    function actualizarHabilitadoComentario() {
      const habilitado = Boolean(actividadSeleccionada);
      if (comentarioMapaTextarea) comentarioMapaTextarea.disabled = !habilitado;
      if (comentarioMapaBtn) comentarioMapaBtn.disabled = !habilitado;
      if (!habilitado) setEstadoComentario("Seleccioná un punto para comentar.", "warn");
    }

    function distanciaKm(a, b) {
      const rad = function (v) { return v * Math.PI / 180; };
      const R = 6371;
      const dLat = rad(b.lat - a.lat);
      const dLng = rad(b.lng - a.lng);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
      return R * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
    }

    function crearIconoDeporte(deporte, recien) {
      const color = COLORES_DEPORTE[deporte] || "#6b7280";
      const html = '<div class="marcador-deporte" style="background:' + color + '"></div>';
      return L.divIcon({ html: html, className: "", iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -28] });
    }

    function renderizarPanelActividad() {
      if (!actividadSeleccionada) {
        tituloActividad.textContent = "Seleccioná un punto";
        metaActividad.textContent = "Al tocar un marcador vas a ver comentarios de la comunidad.";
        comentariosMapa.textContent = "";
        actualizarHabilitadoComentario();
        return;
      }
      tituloActividad.textContent = actividadSeleccionada.deporte + " · " + actividadSeleccionada.lugar;
      metaActividad.textContent = actividadSeleccionada.horarios + " · " + actividadSeleccionada.direccion;
      comentariosMapa.textContent = "";
      actualizarHabilitadoComentario();
      const lista = actividadSeleccionada.comentarios || [];
      if (!lista.length) {
        const vacio = document.createElement("p");
        vacio.className = "comentario-chip";
        vacio.textContent = "Todavía no hay comentarios en este punto.";
        comentariosMapa.appendChild(vacio);
      } else {
        lista.forEach(function (c) {
          const item = document.createElement("article");
          item.className = "comentario-chip";
          item.textContent = c.autor + ": " + c.texto;
          comentariosMapa.appendChild(item);
        });
      }
    }

    function crearPopupSeguro(act) {
      const cont = document.createElement("div");
      cont.className = "popup-mapa";
      const titulo = document.createElement("p");
      titulo.className = "popup-titulo";
      titulo.textContent = act.deporte;
      const lugar = document.createElement("p");
      lugar.textContent = act.lugar + " · " + act.direccion;
      const horario = document.createElement("p");
      horario.style.fontSize = "0.85rem";
      horario.textContent = act.horarios;
      const historia = document.createElement("p");
      historia.style.fontSize = "0.84rem";
      historia.textContent = act.historia || "Historia en construcción.";
      const dist = document.createElement("p");
      dist.style.fontSize = "0.85rem";
      dist.textContent = distanciaKm(posicionUsuario, act).toFixed(1) + " km de vos";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "popup-btn";
      btn.textContent = "Quiero sumarme";
      btn.addEventListener("click", function () {
        document.getElementById("contacto").scrollIntoView({ behavior: "smooth" });
      });
      const link = document.createElement("a");
      link.className = "popup-link";
      link.href = act.mediaUrl || "https://www.youtube.com/";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Ver clip / testimonio";
      cont.append(titulo, lugar, horario, historia, dist, btn, link);
      if (act.recienAgregado) {
        const badge = document.createElement("span");
        badge.className = "etiqueta-nuevo";
        badge.textContent = "Recién agregado";
        cont.appendChild(badge);
      }
      return cont;
    }

    function actividadesVisibles() {
      const radio = Number(radioBusqueda.value);
      return actividades.filter(function (a) {
        const okFiltro = filtroDeporte === "Todos" || a.deporte === filtroDeporte;
        return okFiltro && distanciaKm(posicionUsuario, a) <= radio;
      });
    }

    function renderizarLista(items) {
      listaLugares.textContent = "";
      if (!items.length) {
        const vacio = document.createElement("p");
        vacio.className = "hoja-item";
        vacio.textContent = "No hay actividades en este rango. Probá ampliar el radio.";
        listaLugares.appendChild(vacio);
        return;
      }
      items.forEach(function (act) {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "hoja-item";
        item.setAttribute("role", "listitem");
        const dist = distanciaKm(posicionUsuario, act).toFixed(1);
        const strong = document.createElement("strong");
        strong.textContent = act.deporte;
        const br1 = document.createElement("br");
        const lugarTxt = document.createTextNode(act.lugar);
        const br2 = document.createElement("br");
        const small = document.createElement("small");
        small.textContent = act.horarios + " · " + dist + " km";
        item.append(strong, br1, lugarTxt, br2, small);
        item.addEventListener("click", function () {
          mapa.setView([act.lat, act.lng], 15);
          actividadSeleccionada = act;
          renderizarPanelActividad();
        });
        listaLugares.appendChild(item);
      });
    }

    function renderizarActividades() {
      const visibles = actividadesVisibles();
      capaMarcadores.clearLayers();
      visibles.forEach(function (act) {
        const marcador = L.marker([act.lat, act.lng], {
          icon: crearIconoDeporte(act.deporte, act.recienAgregado)
        });
        marcador.on("click", function () {
          actividadSeleccionada = act;
          renderizarPanelActividad();
        });
        marcador.bindPopup(crearPopupSeguro(act));
        capaMarcadores.addLayer(marcador);
      });
      contadorActividades.textContent = visibles.length + " actividad" + (visibles.length === 1 ? "" : "es") + " cerca";
      renderizarLista(visibles);
      if (circuloRadio) circuloRadio.setRadius(Number(radioBusqueda.value) * 1000);
      radioBusqueda.setAttribute("aria-valuenow", radioBusqueda.value);
    }

    function iniciarMapa() {
      if (mapa) return;
      mapa = L.map("mapaLeaflet", { zoomControl: true }).setView([posicionUsuario.lat, posicionUsuario.lng], 12);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: "&copy; OpenStreetMap &copy; CARTO"
      }).addTo(mapa);
      capaMarcadores = L.layerGroup().addTo(mapa);
      const iconoUsuario = L.divIcon({
        html: '<div class="marcador-usuario"></div>',
        className: "",
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });
      marcadorUsuario = L.marker([posicionUsuario.lat, posicionUsuario.lng], { icon: iconoUsuario }).addTo(mapa);
      marcadorUsuario.bindPopup("Tu ubicación");
      circuloRadio = L.circle([posicionUsuario.lat, posicionUsuario.lng], {
        radius: Number(radioBusqueda.value) * 1000,
        color: "#1a1f2e", weight: 2, fillColor: "#e85d2c", fillOpacity: 0.08
      }).addTo(mapa);
      renderizarActividades();
    }

    function pedirGeolocalizacion() {
      if (!navigator.geolocation) {
        iniciarMapa();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          posicionUsuario = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          iniciarMapa();
          mapa.setView([posicionUsuario.lat, posicionUsuario.lng], 13);
          marcadorUsuario.setLatLng([posicionUsuario.lat, posicionUsuario.lng]);
          circuloRadio.setLatLng([posicionUsuario.lat, posicionUsuario.lng]);
          renderizarActividades();
        },
        function () { iniciarMapa(); },
        { enableHighAccuracy: true, timeout: 9000 }
      );
    }

    filtrosDeporte.addEventListener("click", function (e) {
      const chip = e.target.closest(".filtro-chip");
      if (!chip) return;
      filtroDeporte = chip.getAttribute("data-filtro");
      filtrosDeporte.querySelectorAll(".filtro-chip").forEach(function (c) { c.classList.remove("activo"); });
      chip.classList.add("activo");
      renderizarActividades();
    });

    radioBusqueda.addEventListener("input", function () {
      valorRadio.textContent = radioBusqueda.value + " km";
      renderizarActividades();
    });

    toggleHoja.addEventListener("click", function () {
      hojaInferior.classList.toggle("abierta");
      toggleHoja.textContent = hojaInferior.classList.contains("abierta") ? "Ocultar lista" : "Ver lista";
    });

    (function iniciarArrastreHoja() {
      let inicioY = 0;
      agarreHoja.addEventListener("pointerdown", function (e) {
        if (window.innerWidth >= 768) return;
        inicioY = e.clientY;
        agarreHoja.setPointerCapture(e.pointerId);
      });
      agarreHoja.addEventListener("pointermove", function (e) {
        if (window.innerWidth >= 768) return;
        const delta = e.clientY - inicioY;
        if (delta > 60) hojaInferior.classList.remove("abierta");
        if (delta < -40) hojaInferior.classList.add("abierta");
      });
    })();

    btnAgregarDeporte.addEventListener("click", function () {
      if (!requerirLogin("agregarDeporte")) return;
      dialogoDeporte.showModal();
    });
    btnCancelarDeporte.addEventListener("click", function () { dialogoDeporte.close(); });

    formComentarioMapa.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!actividadSeleccionada) return;
      if (!requerirLogin("comentarMapa")) return;
      const txt = String(formComentarioMapa.elements.comentarioMapa.value || "").trim();
      if (txt.length < 6) return;
      if (!actividadSeleccionada.comentarios) actividadSeleccionada.comentarios = [];
      actividadSeleccionada.comentarios.unshift({ autor: usuarioLogueado.nombre, texto: txt });
      formComentarioMapa.reset();
      renderizarPanelActividad();
      setEstadoComentario("Comentario publicado correctamente.", "ok");
    });

    formAgregarDeporte.addEventListener("submit", function (e) {
      e.preventDefault();
      formAgregarDeporte.querySelectorAll("label").forEach(function (l) { l.classList.remove("invalido"); });
      const data = new FormData(formAgregarDeporte);
      let ok = true;
      ["deporte", "lugar", "direccion", "horarios", "contacto"].forEach(function (campo) {
        const val = String(data.get(campo) || "").trim();
        const min = campo === "lugar" ? 3 : campo === "direccion" ? 5 : 4;
        if (val.length < min) {
          formAgregarDeporte.querySelector("[name=" + campo + "]").closest("label").classList.add("invalido");
          ok = false;
        }
      });
      if (!ok) return;

      const deporteVal = data.get("deporte") === "Otro" ? "Deporte comunitario" : String(data.get("deporte"));
      const nueva = {
        id: Date.now(),
        deporte: deporteVal,
        lugar: String(data.get("lugar")).trim(),
        direccion: String(data.get("direccion")).trim(),
        horarios: String(data.get("horarios")).trim(),
        contacto: String(data.get("contacto")).trim(),
        lat: posicionUsuario.lat + (Math.random() - 0.5) * 0.018,
        lng: posicionUsuario.lng + (Math.random() - 0.5) * 0.018,
        comentarios: [],
        recienAgregado: true
      };
      /* FUTURO: POST /api/actividades con nueva */
      actividades.unshift(nueva);
      dialogoDeporte.close();
      formAgregarDeporte.reset();
      renderizarActividades();
      hojaInferior.classList.add("abierta");
    });

    cargarSesion();
    renderizarPanelActividad();
    actualizarHabilitadoComentario();
    pedirGeolocalizacion();
  })();
