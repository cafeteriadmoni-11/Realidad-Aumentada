
document.addEventListener("DOMContentLoaded", () => {
    const estado = document.getElementById("estado");
    const contenedor = document.getElementById("contenedor-escena");
    const botones = document.querySelectorAll("[data-imagen]");

    if (!estado || !contenedor) {
        console.error("Faltan #estado o #contenedor-escena en el HTML.");
        return;
    }

    // =========================================
    // CONFIGURACIÓN DE LAS 20 IMÁGENES
    // =========================================

    const configuraciones = {
        1:  { nombre: "Evolución de la educación", archivo: "./imagen1/imagen1/Imagen1.mind", plantilla: "contenidoImagen1" },
        2:  { nombre: "Reflexión educativa", archivo: "./imagen1/imagen2/Imagen2.mind", plantilla: "contenidoImagen2" },
        3:  { nombre: "Diálogo en el tiempo", archivo: "./imagen1/imagen3/Imagen3.mind", plantilla: "contenidoImagen3" },
        4:  { nombre: "Fe y razón", archivo: "./imagen1/imagen4/Imagen4.mind", plantilla: "contenidoImagen4" },
        5:  { nombre: "Renacimiento", archivo: "./imagen1/imagen5/Imagen5.mind", plantilla: "contenidoImagen5" },
        6:  { nombre: "La imprenta", archivo: "./imagen1/imagen6/Imagen6.mind", plantilla: "contenidoImagen6" },
        7:  { nombre: "La Ilustración", archivo: "./imagen1/imagen7/Imagen7.mind", plantilla: "contenidoImagen7" },
        8:  { nombre: "Rousseau", archivo: "./imagen1/imagen8/Imagen8.mind", plantilla: "contenidoImagen8" },
        9:  { nombre: "Locke", archivo: "./imagen1/imagen9/Imagen9.mind", plantilla: "contenidoImagen9" },
        10: { nombre: "Tabla rasa", archivo: "./imagen1/imagen10/Imagen10.mind", plantilla: "contenidoImagen10" },
        11: { nombre: "Kant", archivo: "./imagen1/imagen11/Imagen11.mind", plantilla: "contenidoImagen11" },
        12: { nombre: "Dewey", archivo: "./imagen1/imagen12/Imagen12.mind", plantilla: "contenidoImagen12" },
        13: { nombre: "Montessori", archivo: "./imagen1/imagen13/Imagen13.mind", plantilla: "contenidoImagen13" },
        14: { nombre: "Piaget", archivo: "./imagen1/imagen14/Imagen14.mind", plantilla: "contenidoImagen14" },
        15: { nombre: "Etapas del desarrollo", archivo: "./imagen1/imagen15/Imagen15.mind", plantilla: "contenidoImagen15" },
        16: { nombre: "Legado educativo", archivo: "./imagen1/imagen16/Imagen16.mind", plantilla: "contenidoImagen16" },
        17: { nombre: "Educación actual", archivo: "./imagen1/imagen17/Imagen17.mind", plantilla: "contenidoImagen17" },
        18: { nombre: "Reflexión final", archivo: "./imagen1/imagen18/Imagen18.mind", plantilla: "contenidoImagen18" },
        19: { nombre: "Conclusión", archivo: "./imagen1/imagen19/Imagen19.mind", plantilla: "contenidoImagen19" },
        20: { nombre: "Despedida", archivo: "./imagen1/imagen20/Imagen20.mind", plantilla: "contenidoImagen20" }
    };

    // Contenido básico para las imágenes que no tengan plantilla.
    const descripciones = {
        4: "La fe y la razón se complementan en la búsqueda de la verdad.",
        5: "El Renacimiento impulsó el humanismo y el interés por el conocimiento.",
        6: "La imprenta permitió difundir libros e ideas a más personas.",
        7: "La Ilustración destacó la razón, la libertad y el pensamiento crítico.",
        8: "Rousseau propuso respetar el desarrollo natural de cada niño.",
        9: "Locke destacó la experiencia como fuente del conocimiento.",
        10: "La tabla rasa representa la idea de que la experiencia influye en el conocimiento.",
        11: "Kant destacó la autonomía y la capacidad de pensar por uno mismo.",
        12: "Dewey relacionó el aprendizaje con la experiencia y la práctica.",
        13: "Montessori promovió la autonomía y un ambiente preparado para aprender.",
        14: "Piaget explicó cómo cambia el pensamiento durante el desarrollo.",
        15: "Las etapas del desarrollo ayudan a comprender las necesidades de aprendizaje.",
        16: "Las ideas de grandes pensadores siguen influyendo en la educación.",
        17: "La educación actual integra conocimientos, valores y herramientas digitales.",
        18: "Reflexionar sobre la educación permite reconocer su importancia en la sociedad.",
        19: "La educación contribuye al desarrollo de las personas y la sociedad.",
        20: "Gracias por acompañarnos en este recorrido por la filosofía educativa."
    };

    let escenaActual = null;
    let sistemaActual = null;
    let numeroActual = 0;
    let generacion = 0;
    let temporizadores = [];

    // =========================================
    // UTILIDADES
    // =========================================

    function programar(callback, demora) {
        const id = setTimeout(callback, demora);
        temporizadores.push(id);
        return id;
    }

    function limpiarTemporizadores() {
        temporizadores.forEach(id => clearTimeout(id));
        temporizadores = [];
    }

    function elemento(id) {
        return escenaActual
            ? escenaActual.querySelector("#" + id)
            : null;
    }

    function visible(id, valor) {
        const nodo = elemento(id);
        if (nodo) nodo.setAttribute("visible", valor);
    }

    function cambiarTexto(id, texto) {
        const nodo = elemento(id);
        if (nodo) nodo.setAttribute("value", texto);
    }

    function reiniciarContenido() {
        limpiarTemporizadores();

        [
            "cajaInfo",
            "textoInfo",
            "bocadillo",
            "textoMensaje",
            "mensajeFinalReflexion",
            "bocadilloPregunta",
            "textoPregunta",
            "bocadilloRespuesta",
            "textoRespuesta",
            "mensajeFinalDialogo",
            "libroDialogo1",
            "libroDialogo2",
            "libroDialogo3"
        ].forEach(id => visible(id, false));

        ["textoMensaje", "textoPregunta", "textoRespuesta"].forEach(id => {
            cambiarTexto(id, "");
        });

        if (escenaActual) {
            escenaActual.querySelectorAll(".nota").forEach(nota => {
                nota.setAttribute("visible", false);
            });
        }
    }

    // =========================================
    // CREAR LAS PLANTILLAS
    // =========================================

    function crearPlantillas() {
        const escenaPlantilla = document.getElementById("escenaPlantilla");

        const contenidosOriginales = {
            contenidoImagen1: "contenidoAntiguedad",
            contenidoImagen2: "contenidoReflexion",
            contenidoImagen3: "contenidoDialogo"
        };

        // Recuperar los tres contenidos que ya existen en el HTML.
        Object.entries(contenidosOriginales).forEach(([idPlantilla, idContenido]) => {
            if (document.getElementById(idPlantilla)) return;

            const contenido = escenaPlantilla
                ? escenaPlantilla.querySelector("#" + idContenido)
                : document.getElementById(idContenido);

            if (!contenido) {
                console.warn("No se encontró el contenido:", idContenido);
                return;
            }

            const plantilla = document.createElement("template");
            plantilla.id = idPlantilla;
            plantilla.content.appendChild(contenido.cloneNode(true));
            document.body.appendChild(plantilla);
        });

        // Crear plantillas sencillas para las imágenes 4 a 20
        // únicamente cuando todavía no existan en el HTML.
        Object.entries(configuraciones).forEach(([numero, config]) => {
            if (document.getElementById(config.plantilla)) return;

            const plantilla = document.createElement("template");

            plantilla.id = config.plantilla;

            const titulo = document.createElement("a-text");
            titulo.setAttribute("value", config.nombre.toUpperCase());
            titulo.setAttribute("position", "0 0.45 0");
            titulo.setAttribute("align", "center");
            titulo.setAttribute("color", "#7c3aed");
            titulo.setAttribute("width", "3.5");
            titulo.setAttribute("wrap-count", "25");

            const descripcion = document.createElement("a-text");
            descripcion.setAttribute(
                "value",
                descripciones[numero] || config.nombre
            );
            descripcion.setAttribute("position", "0 0 0");
            descripcion.setAttribute("align", "center");
            descripcion.setAttribute("color", "#334155");
            descripcion.setAttribute("width", "2.5");
            descripcion.setAttribute("wrap-count", "35");

            plantilla.content.appendChild(titulo);
            plantilla.content.appendChild(descripcion);

            document.body.appendChild(plantilla);
        });

        // La escena original solo se usa para obtener los contenidos.
        if (escenaPlantilla) {
            escenaPlantilla.style.display = "none";
        }
    }

    // =========================================
    // IMAGEN 1: INFORMACIÓN DE LAS ÉPOCAS
    // =========================================

    function configurarImagen1() {
        const info = {
            libroAntiguedad: {
                titulo: "🏛️ Antigüedad",
                texto:
                    "Sócrates, Platón y Aristóteles sentaron las bases de la educación.\n" +
                    "Buscaban formar el carácter, la razón y la virtud.\n" +
                    "Se estudiaban filosofía, retórica, política y gimnasia."
            },
            libroMedia: {
                titulo: "⛪ Edad Media",
                texto:
                    "La educación estuvo muy ligada a la religión.\n" +
                    "Monasterios y catedrales fueron centros de conocimiento.\n" +
                    "Se enseñaban latín, teología y escritura."
            },
            libroModerna: {
                titulo: "🏫 Actualidad",
                texto:
                    "La educación busca ser inclusiva y aprovechar herramientas digitales.\n" +
                    "Se fomenta el pensamiento crítico, la tecnología y los valores."
            }
        };

        function mostrar(clave) {
            const datos = info[clave];
            if (!datos) return;

            limpiarTemporizadores();

            visible("cajaInfo", true);
            visible("textoInfo", true);
            cambiarTexto("textoInfo", datos.titulo + "\n\n" + datos.texto);

            programar(() => {
                visible("cajaInfo", false);
                visible("textoInfo", false);
            }, 7000);
        }

        Object.keys(info).forEach(id => {
            const libro = elemento(id);
            if (!libro || libro.dataset.eventoRegistrado === "true") return;

            libro.classList.add("clickeable");
            libro.dataset.eventoRegistrado = "true";

            libro.addEventListener("click", () => mostrar(id));
        });
    }

    // =========================================
    // IMAGEN 2: REFLEXIÓN ANIMADA
    // =========================================

    function configurarImagen2() {
        const textoCompleto =
            "Desde tiempos antiguos, la filosofía ha buscado entender el papel crucial de la educación en el desarrollo humano. Un medio para iluminar el pensamiento, fortalecer la personalidad y preparar a las personas para enfrentar los desafíos de la vida.";

        let animacionActiva = false;

        function escribirTexto(texto, indice, alTerminar) {
            if (numeroActual !== 2) return;

            if (indice < texto.length) {
                cambiarTexto("textoMensaje", texto.substring(0, indice + 1));

                programar(() => {
                    escribirTexto(texto, indice + 1, alTerminar);
                }, 35);
            } else if (alTerminar) {
                alTerminar();
            }
        }

        function iniciarAnimacion() {
            if (animacionActiva) return;

            animacionActiva = true;
            reiniciarContenido();

            programar(() => {
                visible("bocadillo", true);
                visible("textoMensaje", true);

                escribirTexto(textoCompleto, 0, () => {
                    programar(() => {
                        const notas = escenaActual
                            ? escenaActual.querySelectorAll(".nota")
                            : [];

                        notas.forEach((nota, indice) => {
                            programar(() => {
                                nota.setAttribute("visible", true);
                            }, indice * 200);
                        });
                    }, 500);

                    programar(() => {
                        visible("mensajeFinalReflexion", true);
                    }, 2500);
                });
            }, 600);
        }

        window.reiniciarAnimacionActual = () => {
            animacionActiva = false;
            iniciarAnimacion();
        };

        iniciarAnimacion();
    }

    // =========================================
    // IMAGEN 3: DIÁLOGO ANIMADO
    // =========================================

    function configurarImagen3() {
        const pregunta = "¿Cómo se originó...?";

        const respuesta =
            "Para entender la educación de hoy, viajaremos al pasado, donde grandes pensadores sentaron sus bases...";

        let animacionActiva = false;

        function escribirTexto(texto, indice, destino, alTerminar) {
            if (numeroActual !== 3) return;

            if (indice < texto.length) {
                destino.setAttribute("value", texto.substring(0, indice + 1));

                programar(() => {
                    escribirTexto(texto, indice + 1, destino, alTerminar);
                }, 40);
            } else if (alTerminar) {
                alTerminar();
            }
        }

        function iniciarDialogo() {
            if (animacionActiva) return;

            animacionActiva = true;
            reiniciarContenido();

            const textoPregunta = elemento("textoPregunta");
            const textoRespuesta = elemento("textoRespuesta");

            if (!textoPregunta || !textoRespuesta) {
                estado.textContent =
                    "⚠️ La plantilla 3 necesita textoPregunta y textoRespuesta.";
                return;
            }

            programar(() => {
                visible("bocadilloPregunta", true);
                visible("textoPregunta", true);

                escribirTexto(pregunta, 0, textoPregunta, () => {
                    programar(() => {
                        visible("bocadilloRespuesta", true);
                        visible("textoRespuesta", true);

                        escribirTexto(respuesta, 0, textoRespuesta, () => {
                            programar(() => {
                                [
                                    "libroDialogo1",
                                    "libroDialogo2",
                                    "libroDialogo3"
                                ].forEach((id, indice) => {
                                    programar(() => visible(id, true), indice * 250);
                                });
                            }, 600);

                            programar(() => {
                                visible("mensajeFinalDialogo", true);
                            }, 2000);
                        });
                    }, 800);
                });
            }, 700);
        }

        window.reiniciarAnimacionActual = () => {
            animacionActiva = false;
            iniciarDialogo();
        };

        iniciarDialogo();
    }

    // =========================================
    // DETENER LA ESCENA ANTERIOR
    // =========================================

    async function detenerEscenaActual() {
        limpiarTemporizadores();
        window.reiniciarAnimacionActual = null;

        const escenaAnterior = escenaActual;
        const sistemaAnterior = sistemaActual;

        escenaActual = null;
        sistemaActual = null;

        if (escenaAnterior && sistemaAnterior) {
            try {
                await sistemaAnterior.stop();
            } catch (error) {
                console.warn("No se pudo detener la cámara anterior:", error);
            }
        }

        contenedor.replaceChildren();
    }

    // =========================================
    // CARGAR UNA DE LAS 20 IMÁGENES
    // =========================================

    async function cargarImagen(numero) {
        numero = Number(numero);

        const config = configuraciones[numero];
        if (!config) return;

        const miGeneracion = ++generacion;
        numeroActual = numero;

        estado.textContent = "⏳ Cargando " + config.nombre + "...";
        estado.style.color = "#475569";

        await detenerEscenaActual();

        if (miGeneracion !== generacion) return;

        const plantilla = document.getElementById(config.plantilla);

        if (!plantilla) {
            estado.textContent = "❌ No existe la plantilla " + config.plantilla;
            return;
        }

        const escena = document.createElement("a-scene");

        escena.setAttribute(
            "mindar-image",
            `imageTargetSrc: ${config.archivo}; autoStart: true; uiLoading: yes; uiScanning: yes; maxTrack: 1;`
        );

        escena.setAttribute("embedded", "");
        escena.setAttribute("color-space", "sRGB");
        escena.setAttribute("renderer", "colorManagement: true");
        escena.setAttribute("vr-mode-ui", "enabled: false");
        escena.setAttribute(
            "device-orientation-permission-ui",
            "enabled: false"
        );

        const marcador = document.createElement("a-entity");
        marcador.setAttribute("id", "marcadorActivo");
        marcador.setAttribute("mindar-image-target", "targetIndex: 0");

        marcador.appendChild(plantilla.content.cloneNode(true));
        escena.appendChild(marcador);

        const camara = document.createElement("a-camera");
        camara.setAttribute("position", "0 0 0");
        camara.setAttribute("look-controls", "enabled: false");
        camara.setAttribute("cursor", "rayOrigin: mouse");
        camara.setAttribute("raycaster", "objects: .clickeable");

        escena.appendChild(camara);

        escenaActual = escena;
        contenedor.appendChild(escena);

        marcador.addEventListener("targetFound", () => {
            if (miGeneracion !== generacion) return;

            estado.textContent = "✅ Imagen detectada: " + config.nombre;
            estado.style.color = "#15803d";

            if (numero === 1) configurarImagen1();
            if (numero === 2) configurarImagen2();
            if (numero === 3) configurarImagen3();
        });

        marcador.addEventListener("targetLost", () => {
            if (miGeneracion !== generacion) return;

            limpiarTemporizadores();

            estado.textContent =
                "🔍 Apunta la cámara hacia la imagen de " + config.nombre + ".";
            estado.style.color = "#475569";
        });

        try {
            await new Promise((resolve, reject) => {
                if (escena.hasLoaded) {
                    resolve();
                    return;
                }

                escena.addEventListener("loaded", resolve, { once: true });

                escena.addEventListener("error", reject, { once: true });
            });

            if (miGeneracion !== generacion) return;

            sistemaActual = escena.systems["mindar-image-system"] || null;

            estado.textContent =
                "📷 Cámara preparada. Muestra la imagen de " + config.nombre + ".";
        } catch (error) {
            console.error("Error al inicializar MindAR:", error);

            if (miGeneracion === generacion) {
                estado.textContent =
                    "❌ No se pudo iniciar la escena. Revisa la cámara y el archivo .mind.";
            }
        }
    }

    // =========================================
    // BOTONES DE SELECCIÓN
    // =========================================

    crearPlantillas();

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            botones.forEach(otro => {
                otro.classList.toggle("seleccionado", otro === boton);
            });

            cargarImagen(boton.dataset.imagen);
        });
    });

    // =========================================
    // BOTÓN DE AYUDA
    // =========================================

    const botonInfo = document.getElementById("btnInfo");

    if (botonInfo) {
        botonInfo.addEventListener("click", () => {
            alert(
                "📖 Cómo funciona:\n\n" +
                "1. Permite el acceso a la cámara.\n" +
                "2. Selecciona una imagen.\n" +
                "3. Apunta la cámara hacia la imagen correspondiente.\n" +
                "4. Interactúa con los elementos que aparezcan.\n\n" +
                "Utiliza buena iluminación y muestra la imagen completa."
            );
        });
    }

    // =========================================
    // REINICIAR
    // =========================================

    const botonReiniciar = document.getElementById("btnReiniciar");

    if (botonReiniciar) {
        botonReiniciar.addEventListener("click", () => {
            if (typeof window.reiniciarAnimacionActual === "function") {
                window.reiniciarAnimacionActual();
            } else {
                cargarImagen(numeroActual || 1);
            }
        });
    }

    // Iniciar con la imagen 1.
    cargarImagen(1);
});

  // Crear plantillas a partir del contenido que ya existe en el HTML.
    const escenaPlantilla = document.getElementById("escenaPlantilla");

    const contenidosOriginales = {
        contenidoImagen1: "contenidoAntiguedad",
        contenidoImagen2: "contenidoReflexion",
        contenidoImagen3: "contenidoDialogo"
    };

    Object.entries(contenidosOriginales).forEach(([idPlantilla, idContenido]) => {
        const contenido = escenaPlantilla?.querySelector("#" + idContenido);

        if (contenido && !document.getElementById(idPlantilla)) {
            const plantilla = document.createElement("template");
            plantilla.id = idPlantilla;
            plantilla.content.appendChild(contenido.cloneNode(true));
            document.body.appendChild(plantilla);
        }
    });

    // Ocultar la escena original: solo se usará como fuente.
    if (escenaPlantilla) {
        escenaPlantilla.style.display = "none";
    }