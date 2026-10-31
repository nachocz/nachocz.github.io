// Controlador del juego: pantallas, rondas de tres candidatos, escena 3D,
// avisos de eventos, crónica siempre visible, cronómetro, final, álbum y
// preferencias guardadas.
//
// Parámetros de URL:
//   ?fiesta=CODIGO   juega la fiesta de esa semilla (mismos iniciales; con las
//                    mismas elecciones, los mismos candidatos)
//   ?debug           muestra los identificadores de las reglas en los avisos
//   ?pruebas         usa el balance exportado por herramientas/balanceador.html
(function () {
    'use strict';
    const HA = window.HA;
    const M = HA.motor;
    const A = HA.arte;
    const S = HA.audio;
    const $ = (id) => document.getElementById(id);
    const params = new URLSearchParams(location.search);
    const DEBUG = params.has('debug');
    const REDUCIDO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const esperar = (ms) => new Promise((ok) => setTimeout(ok, REDUCIDO ? Math.min(ms, 120) : ms));

    // ------------------------------------------------------------------
    // datos guardados
    // ------------------------------------------------------------------
    const CLAVE = 'habra-akelarre-v2';
    const datos = (() => {
        const base = { descubiertas: {}, partidas: 0, mejor: null, introVista: false, sonido: 2, akelarres: 0 };
        try { return Object.assign(base, JSON.parse(localStorage.getItem(CLAVE) || '{}')); } catch (error) { return base; }
    })();
    const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (error) { /* almacenamiento bloqueado */ } };

    // ranking de la sesión: dura mientras la pestaña siga abierta
    const CLAVE_RANKING = 'habra-akelarre-ranking';
    const leerSesion = (clave, defecto) => { try { return JSON.parse(sessionStorage.getItem(clave)) || defecto; } catch (error) { return defecto; } };
    const escribirSesion = (clave, valor) => { try { sessionStorage.setItem(clave, JSON.stringify(valor)); } catch (error) { /* almacenamiento bloqueado */ } };
    let ranking = leerSesion(CLAVE_RANKING, []);
    const ordenRanking = (a, b) => b.puntos - a.puntos || a.t - b.t;

    function balanceActivo() {
        if (params.has('pruebas')) {
            try {
                const b = JSON.parse(localStorage.getItem('habra-akelarre-balance-pruebas'));
                if (b) return b;
            } catch (error) { /* sin balance de pruebas */ }
        }
        return HA.BALANCE;
    }

    // ------------------------------------------------------------------
    // estado de la sesión
    // ------------------------------------------------------------------
    let partida = null;
    let estado = 'portada'; // portada | intro | llegando | decidiendo | resolviendo | final
    let rondaInfo = null; // { grupos, frases }
    let foco = -1;
    let cicloHabla = null;
    let introPaso = 0;
    let escena = null;
    let puntosMostrados = M.INICIO;
    let nuevasPartida = 0;
    const ultimaVariante = {};

    // ------------------------------------------------------------------
    // utilidades
    // ------------------------------------------------------------------
    function mostrar(id) {
        for (const s of document.querySelectorAll('.pantalla')) s.classList.toggle('activa', s.id === id);
        window.scrollTo(0, 0);
        if (escena) (id === 'juego' ? escena.reanudar() : escena.pausar());
    }

    function toast(texto) {
        const t = $('toast');
        t.textContent = texto;
        t.hidden = false;
        clearTimeout(toast.id);
        toast.id = setTimeout(() => { t.hidden = true; }, 3200);
    }

    const signo = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${Math.abs(v)}` : '0');
    const claseValor = (v) => (v > 0 ? 'pos' : v < 0 ? 'neg' : 'cero');
    const tipo = (id) => HA.tipoPorId[id];
    const azar = (lista) => lista[Math.floor(Math.random() * lista.length)];
    const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    function nombreVisitante(v) {
        const t = tipo(v.tipo);
        return t.nombres[v.aspecto % t.nombres.length];
    }

    function nombreGrupo(g) {
        return g.map(nombreVisitante).join(' y ');
    }

    // frase de llegada, fija para cada visitante
    function fraseVisitante(v) {
        const t = tipo(v.tipo);
        const rng = M.crearAzar(`frase-${v.aspecto}`);
        if (v.pista && t.lineasRaras && rng() < 0.65) return { texto: rng.elegir(t.lineasRaras), raro: true };
        if (v.objetos.length && rng() < 0.4) return { texto: HA.objetoPorId[rng.elegir(v.objetos)].linea };
        return { texto: rng.elegir(t.lineas) };
    }

    const caraSVG = (persona) => A.personajeSVG(persona, { mini: true });

    function nombreJugador() {
        return $('nombre-jugador').value.trim().replace(/\s+/g, ' ').slice(0, 16) || 'Sin nombre';
    }

    // las 10 mejores fiestas de la sesión; `actual` se resalta (y se añade al
    // final si queda fuera de las 10). Devuelve su puesto (desde 0).
    function pintarRanking(lista, actual) {
        const orden = ranking.slice().sort(ordenRanking);
        const filas = orden.slice(0, 10).map((r, i) => [r, i]);
        const pos = actual ? orden.indexOf(actual) : -1;
        if (pos >= 10) filas.push([actual, pos]);
        const medalla = ['🥇', '🥈', '🥉'];
        lista.innerHTML = filas.map(([r, i]) => `<li class="${r === actual ? 'actual' : ''}${i >= 10 ? ' fuera' : ''}"><span class="ranking-pos">${medalla[i] || i + 1}</span><b>${esc(r.nombre)}</b><small>${esc(r.cat)}${r.akelarre ? ' · 🧹' : ''}</small><span class="ranking-pts">${r.puntos}</span></li>`).join('');
        return pos;
    }

    // ------------------------------------------------------------------
    // portada
    // ------------------------------------------------------------------
    function prepararPortada() {
        $('portada-luna').innerHTML = A.lunaSVG('llena', 120);
        $('portada-claudia').innerHTML = A.claudiaSVG({ bolsa: 'vacia', gesto: 'normal' });
        $('portada-nebu').innerHTML = A.nebuSVG('reposo');
        const vistas = Object.keys(datos.descubiertas).length;
        $('album-progreso').textContent = vistas ? `${vistas}/${HA.REGLAS.length}` : '';
        const partes = [];
        if (datos.mejor !== null) partes.push(`Mejor fiesta: ${datos.mejor}/1000`);
        if (params.get('fiesta')) partes.push(`Fiesta compartida: ${params.get('fiesta').toUpperCase()}`);
        $('portada-mejor').textContent = partes.join(' · ');
        $('portada-ranking').hidden = !ranking.length;
        if (ranking.length) pintarRanking($('portada-ranking-lista'));
        if (!$('nombre-jugador').value) $('nombre-jugador').value = leerSesion('habra-akelarre-nombre', '');
        actualizarBotonSonido();
        mostrar('portada');
        estado = 'portada';
    }

    // ------------------------------------------------------------------
    // sonido: 2 = todo, 1 = solo efectos, 0 = silencio
    // ------------------------------------------------------------------
    function aplicarSonido() {
        S.configurar({ musica: datos.sonido === 2, efectos: datos.sonido >= 1 });
        actualizarBotonSonido();
    }

    function actualizarBotonSonido() {
        const b = $('btn-sonido');
        const est = [['🔇', 'Sonido desactivado'], ['🔈', 'Solo efectos'], ['🔊', 'Música y efectos']][datos.sonido];
        b.textContent = est[0];
        b.title = est[1];
        b.setAttribute('aria-label', est[1]);
    }

    // ------------------------------------------------------------------
    // nueva partida e introducción
    // ------------------------------------------------------------------
    function nuevaPartida(semilla) {
        S.desbloquear();
        aplicarSonido();
        partida = M.crearPartida({ semilla: semilla || undefined, cfg: M.configurar(balanceActivo()) });
        partida.jugador = nombreJugador();
        escribirSesion('habra-akelarre-nombre', $('nombre-jugador').value.trim());
        nuevasPartida = 0;
        S.musica('menu');
        mostrar('intro');
        estado = 'intro';
        $('intro-claudia').classList.remove('se-va');
        $('intro-claudia').innerHTML = A.claudiaSVG({ bolsa: 'vacia', gesto: 'normal' });
        $('intro-nebu').innerHTML = A.nebuSVG('reposo');
        $('intro-invitados').hidden = true;
        $('intro-bocadillo').hidden = false;
        introPaso = datos.introVista ? HA.TEXTOS.intro.length : 0;
        avanzarIntro();
    }

    function avanzarIntro() {
        const lineas = HA.TEXTOS.intro;
        if (introPaso < lineas.length) {
            $('intro-linea').textContent = lineas[introPaso];
            $('btn-intro-seguir').textContent = 'Siguiente';
            $('btn-intro-saltar').hidden = false;
            if (introPaso === lineas.length - 1) {
                $('intro-nebu').innerHTML = A.nebuSVG('ladra');
                S.tocar('ladrido');
            }
            introPaso++;
            return;
        }
        if (introPaso === lineas.length) {
            $('intro-claudia').classList.add('se-va');
            $('intro-nebu').innerHTML = A.nebuSVG('reposo');
            $('intro-bocadillo').hidden = true;
            $('intro-invitados').hidden = false;
            $('intro-lista').innerHTML = partida.asistentes.map((p, i) => `<li style="animation-delay:${i * 90}ms">${caraSVG(p)}<b>${nombreVisitante(p)}</b><small>${tipo(p.tipo).nombre}</small></li>`).join('');
            $('intro-mision').textContent = HA.TEXTOS.mision;
            $('btn-intro-seguir').textContent = '¡A la puerta!';
            $('btn-intro-saltar').hidden = true;
            S.tocar('puerta_cierra', { retardo: 0.6 });
            introPaso++;
            datos.introVista = true;
            guardar();
            return;
        }
        empezarJuego();
    }

    // ------------------------------------------------------------------
    // marcador, luna y fiesta
    // ------------------------------------------------------------------
    function ponerPuntos(valor, delta) {
        const v = Math.max(0, Math.min(M.MAXIMO, valor));
        const el = $('puntos');
        const desde = puntosMostrados;
        puntosMostrados = v;
        const t0 = performance.now();
        const paso = (t) => {
            const k = Math.min(1, (t - t0) / (REDUCIDO ? 1 : 450));
            el.textContent = Math.round(desde + (v - desde) * k);
            if (k < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
        const color = v < 200 ? 'var(--malo)' : v < 400 ? '#ff9f43' : v < 600 ? 'var(--oro)' : v < 800 ? 'var(--bueno)' : v < 950 ? 'var(--lima)' : 'var(--morado)';
        $('puntos-relleno').style.width = `${v / 10}%`;
        $('puntos-relleno').style.backgroundColor = color;
        if (delta) {
            const d = $('puntos-delta');
            d.textContent = signo(delta);
            d.className = `puntos-delta ${delta > 0 ? 'sube' : 'baja'}`;
            void d.offsetWidth;
            const hud = $('hud-puntos');
            hud.classList.remove('sube', 'baja');
            void hud.offsetWidth;
            hud.classList.add(delta > 0 ? 'sube' : 'baja');
            clearTimeout(ponerPuntos.id);
            ponerPuntos.id = setTimeout(() => hud.classList.remove('sube', 'baja'), 700);
        }
    }

    function actualizarLuna(animar) {
        const f = M.fase(partida);
        $('hud-luna-icono').innerHTML = A.lunaSVG(f, 30);
        $('hud-luna-nombre').textContent = HA.FASES.find((x) => x.id === f).nombre;
        $('luna-escena').innerHTML = `${A.lunaSVG(f, 22)}${HA.FASES.find((x) => x.id === f).nombre}`;
        escena.ponerFase(f);
        if (animar) {
            $('hud-luna').classList.remove('cambia');
            void $('hud-luna').offsetWidth;
            $('hud-luna').classList.add('cambia');
            S.tocar('luna', { volumen: 0.7 });
        }
    }

    function actualizarFiesta(nuevosTipos) {
        const cuenta = {};
        const orden = [];
        for (const p of partida.asistentes) {
            if (!cuenta[p.tipo]) { cuenta[p.tipo] = { n: 0, ejemplo: p }; orden.push(p.tipo); }
            cuenta[p.tipo].n++;
        }
        $('fiesta-lista').innerHTML = orden.map((id) => {
            const t = tipo(id);
            const c = cuenta[id];
            const nombre = c.n > 1 ? t.plural : t.nombre;
            const nueva = nuevosTipos && nuevosTipos.includes(id) ? ' nueva' : '';
            return `<li class="ficha-tipo${nueva}" style="--color:${t.color}" title="${nombre}"><span class="cara">${caraSVG(c.ejemplo)}</span><span>${nombre}</span>${c.n > 1 ? `<span class="num">×${c.n}</span>` : ''}</li>`;
        }).join('');
        $('fiesta-total').textContent = partida.asistentes.length;
        escena.ponerInvitados(partida.asistentes.length);
    }

    // ------------------------------------------------------------------
    // crónica siempre visible
    // ------------------------------------------------------------------
    const cronica = []; // HTML de cada línea, para el final

    function cronicaAgregar(html) {
        cronica.push(html);
        const ol = $('cronica');
        ol.insertAdjacentHTML('beforeend', html);
        ol.scrollTop = ol.scrollHeight;
    }

    function cronicaReiniciar() {
        cronica.length = 0;
        $('cronica').innerHTML = '';
        const nombres = partida.asistentes.map((p) => `<b>${nombreVisitante(p)}</b> <small>(${tipo(p.tipo).nombre})</small>`).join(', ');
        cronicaAgregar(`<li class="cr-linea cr-decision"><span class="cr-icono">${A.nebuSVG('reposo')}</span><span class="cr-texto">Claudia se va al Scaryfour. Ya están dentro: ${nombres}. Popularidad inicial: <b>666</b>.</span><span></span></li>`);
    }

    function lineaEvento(e, visitantes, m, nuevo) {
        const quien = m.quien === 'Narración' ? '' : `<b>${esc(m.quien)}:</b> `;
        const texto = m.quien === 'Narración' ? esc(m.texto) : `«${esc(m.texto)}»`;
        return `<li class="cr-linea cr-evento"><span class="cr-icono">${iconoEvento(e, visitantes)}</span><span class="cr-texto">${quien}${texto}${nuevo ? ' <span class="aviso-nuevo">¡NUEVO!</span>' : ''}</span><span class="valor ${claseValor(e.pts)}">${signo(e.pts)}</span></li>`;
    }

    // ------------------------------------------------------------------
    // ronda
    // ------------------------------------------------------------------
    function empezarJuego() {
        mostrar('juego');
        S.musica('fiesta');
        if (!escena) {
            escena = HA.escena3d.crear($('lienzo'), { reducido: REDUCIDO });
            $('lienzo').addEventListener('pointerdown', tocarEscena);
        }
        escena.limpiar();
        escena.redimensionar();
        puntosMostrados = partida.puntos;
        ponerPuntos(partida.puntos);
        actualizarFiesta();
        actualizarLuna(false);
        cronicaReiniciar();
        iniciarRonda(true);
    }

    async function iniciarRonda(primera) {
        estado = 'llegando';
        relojParado();
        const r = partida.ronda;
        $('hud-ronda').textContent = `${r + 1}/${M.RONDAS}`;
        if (!primera) actualizarLuna(true);
        const grupos = M.candidatos(partida);
        rondaInfo = { grupos, frases: grupos.map((g) => g.map((v) => fraseVisitante(v))) };
        $('banner-doble').hidden = grupos[0].length < 2;
        $('candidatos').innerHTML = '<p class="esperando">Llaman a la puerta…</p>';
        foco = -1;

        const fase = HA.FASES.find((f) => f.id === M.fase(partida));
        cronicaAgregar(`<li class="cr-ronda">${A.lunaSVG(fase.id, 18)}Ronda ${r + 1} · ${fase.nombre}${grupos[0].length > 1 ? ' · parejas' : ''}</li>`);

        S.tocar(Math.random() < 0.6 ? 'timbre' : 'llamada');
        if (Math.random() < 0.4) S.tocar('llamada', { retardo: 0.22 });
        await escena.ponerCandidatos(grupos);
        grupos.forEach((g, k) => S.tocar(g[0].pista && g[0].poseido && Math.random() < 0.5 ? 'poseido' : tipo(g[0].tipo).sonido, { retardo: k * 0.45, volumen: 0.75 }));

        pintarCandidatos();
        // lo que dice cada candidato queda en la crónica
        grupos.forEach((g, k) => g.forEach((v, i) => {
            const f = rondaInfo.frases[k][i];
            cronicaAgregar(`<li class="cr-linea cr-dialogo"><span class="cr-icono">${caraSVG(v)}</span><span class="cr-texto"><b>${nombreVisitante(v)}</b> <small>${tipo(v.tipo).nombre}${v.objetos.length ? ` · trae ${v.objetos.map((o) => HA.objetoPorId[o].nombre).join(' y ')}` : ''}</small><br><q>${esc(f.texto)}</q></span><span></span></li>`);
        }));
        empezarCicloHabla();

        estado = 'decidiendo';
        relojIniciar();
    }

    function pintarCandidatos() {
        const { grupos, frases } = rondaInfo;
        $('candidatos').innerHTML = grupos.map((g, k) => {
            const t = tipo(g[0].tipo);
            const objetos = g.flatMap((v) => v.objetos);
            const lista = objetos.length
                ? objetos.map((o) => `<li title="${HA.objetoPorId[o].nombre}">${A.objetoSVG(o, 24)}<span>${HA.objetoPorId[o].nombre}</span></li>`).join('')
                : '<li class="vacio">sin objetos</li>';
            const nombres = g.length > 1 ? g.map(nombreVisitante).join(' y ') : nombreVisitante(g[0]);
            const tipos = g.map((v) => tipo(v.tipo).nombre).join(' + ');
            return `<button class="candidato" type="button" data-k="${k}" style="--color:${t.color}" aria-label="Dejar pasar a ${nombres} (${tipos})">` +
                `<span class="cand-tecla" aria-hidden="true">${k + 1}</span>` +
                `<span class="cand-caras${g.length > 1 ? ' doble' : ''}">${g.map((v) => caraSVG(v)).join('')}</span>` +
                `<span class="cand-nombre">${nombres}</span><span class="cand-tipo">${tipos}</span>` +
                `<ul class="cand-objetos">${lista}</ul>` +
                `<span class="cand-frase">«${esc(frases[k].map((f) => f.texto).join(' / '))}»</span>` +
                `<span class="cand-accion">${g.length > 1 ? 'Dejar pasar a la pareja' : 'Dejar pasar'}</span></button>`;
        }).join('');
        for (const b of $('candidatos').querySelectorAll('.candidato')) {
            const k = Number(b.dataset.k);
            b.addEventListener('click', () => decidir(k));
            b.addEventListener('pointerenter', (ev) => { if (ev.pointerType === 'mouse') enfocar(k); });
            b.addEventListener('focus', () => enfocar(k));
        }
    }

    // a quién mira Nebu y quién habla en la escena
    function enfocar(k, desdeCiclo) {
        if (!rondaInfo || (estado !== 'decidiendo' && estado !== 'llegando')) return;
        if (!desdeCiclo) pararCicloHabla();
        foco = k;
        const f = k >= 0 ? rondaInfo.frases[k] : null;
        escena.enfocar(k, f ? f.map((x) => x.texto).join(' / ') : null, f ? f.some((x) => x.raro) : false);
        for (const b of $('candidatos').querySelectorAll('.candidato')) b.classList.toggle('foco', Number(b.dataset.k) === k);
    }

    // al llegar, cada candidato dice su frase por turnos
    function empezarCicloHabla() {
        pararCicloHabla();
        let k = 0;
        enfocar(0, true);
        cicloHabla = setInterval(() => {
            k = (k + 1) % rondaInfo.grupos.length;
            enfocar(k, true);
        }, 2600);
    }

    function pararCicloHabla() {
        clearInterval(cicloHabla);
        cicloHabla = null;
    }

    function tocarEscena(ev) {
        if (saltarAviso) { saltarAviso(); return; }
        if (estado !== 'decidiendo') return;
        const r = $('lienzo').getBoundingClientRect();
        const k = escena.indiceEn(ev.clientX - r.left, ev.clientY - r.top);
        if (k >= 0) {
            enfocar(k);
            S.tocar('seleccion', { volumen: 0.5 });
        }
    }

    // ------------------------------------------------------------------
    // cronómetro (se detiene durante animaciones y avisos)
    // ------------------------------------------------------------------
    const reloj = { fin: 0, id: null, ultimo: null };
    const CIRC = 2 * Math.PI * 19;

    function relojIniciar() {
        reloj.fin = performance.now() + M.SEGUNDOS * 1000;
        reloj.ultimo = null;
        $('hud-reloj').classList.remove('parado', 'aviso', 'urgente');
        clearInterval(reloj.id);
        reloj.id = setInterval(relojTic, 100);
        relojTic();
    }

    function relojParado() {
        clearInterval(reloj.id);
        reloj.id = null;
        $('hud-reloj').classList.add('parado');
        $('hud-reloj').classList.remove('aviso', 'urgente');
        $('hud-segundos').textContent = M.SEGUNDOS;
        $('reloj-arco').style.strokeDashoffset = '0';
    }

    function relojTic() {
        const restante = Math.max(0, (reloj.fin - performance.now()) / 1000);
        const seg = Math.ceil(restante);
        $('hud-segundos').textContent = seg;
        $('reloj-arco').style.strokeDashoffset = String(CIRC * (1 - restante / M.SEGUNDOS));
        $('hud-reloj').classList.toggle('aviso', seg <= 7 && seg > 4);
        $('hud-reloj').classList.toggle('urgente', seg <= 4);
        if (seg !== reloj.ultimo && seg <= 7 && seg > 0) S.tocar(seg <= 4 ? 'tic_urgente' : 'tic', { volumen: seg <= 4 ? 0.9 : 0.6 });
        reloj.ultimo = seg;
        $('hud-reloj').setAttribute('aria-label', `Quedan ${seg} segundos`);
        if (restante <= 0) decidir('tiempo');
    }

    // ------------------------------------------------------------------
    // decisión
    // ------------------------------------------------------------------
    async function decidir(eleccion) {
        if (estado !== 'decidiendo') return;
        estado = 'resolviendo';
        pararCicloHabla();
        relojParado();
        const grupos = rondaInfo.grupos;
        for (const b of $('candidatos').querySelectorAll('.candidato')) {
            b.disabled = true;
            b.classList.remove('foco');
            if (eleccion !== 'tiempo') b.classList.add(Number(b.dataset.k) === eleccion ? 'elegido' : 'descartado');
        }
        const entrada = M.decidir(partida, eleccion);

        if (eleccion === 'tiempo') {
            S.tocar('huevo_lanzar');
            const huevo = escena.huevo();
            setTimeout(() => { S.tocar('huevo_splat'); S.tocar('huevo_chof', { retardo: 0.08, volumen: 0.7 }); }, REDUCIDO ? 0 : 760);
            cronicaAgregar(`<li class="cr-linea cr-decision"><span class="cr-icono">${A.huevoSVG()}</span><span class="cr-texto">Se acaba el tiempo: nadie entra y los tres se van enfadados.</span><span></span></li>`);
            await huevo;
        } else {
            const elegidos = grupos[eleccion];
            const otros = grupos.filter((_, k) => k !== eleccion).map(nombreGrupo).join(' y ');
            S.tocar(Math.random() < 0.5 ? 'ladrido' : 'ladrido2');
            setTimeout(() => S.tocar(Math.random() < 0.6 ? 'grunido' : 'grunido2', { volumen: 0.6 }), REDUCIDO ? 0 : 450);
            cronicaAgregar(`<li class="cr-linea cr-decision"><span class="cr-icono">${A.nebuSVG('ladra')}</span><span class="cr-texto">Nebu deja pasar a <b>${nombreGrupo(elegidos)}</b>. ${otros} se marchan refunfuñando.</span><span></span></li>`);
            S.tocar('puerta_abre', { volumen: 0.6, retardo: 0.3 });
            await escena.elegir(eleccion);
            actualizarFiesta(elegidos.map((v) => v.tipo));
        }

        await mostrarAvisos(entrada);
        ponerPuntos(partida.puntos);
        const d = entrada.delta;
        $('cronica').lastElementChild && cronicaAgregar(`<li class="cr-linea cr-decision"><span></span><span class="cr-texto">Balance de la ronda${entrada.tope ? ' (tope de 1000 alcanzado)' : ''}: popularidad <b>${partida.puntos}</b></span><span class="valor ${claseValor(d)}">${signo(d)}</span></li>`);

        if (partida.terminada) {
            if (partida.fracaso) {
                S.tocar('desastre');
                escena.efecto('malo');
                cronicaAgregar('<li class="cr-linea cr-evento"><span class="cr-icono">💥</span><span class="cr-texto"><b>¡La fiesta se ha arruinado!</b> Los invitados huyen por las ventanas…</span><span></span></li>');
                await esperar(1600);
            }
            finalizar();
        } else {
            iniciarRonda(false);
        }
    }

    // ------------------------------------------------------------------
    // avisos de eventos: uno tras otro sobre la escena, con su valor
    // ------------------------------------------------------------------
    let saltarAviso = null;

    function elegirMensaje(id) {
        const vars = HA.MENSAJES[id];
        let i = Math.floor(Math.random() * vars.length);
        if (vars.length > 1 && i === ultimaVariante[id]) i = (i + 1) % vars.length;
        ultimaVariante[id] = i;
        return { quien: vars[i][0], texto: vars[i][1], variante: 'ABC'[i] };
    }

    function iconoEvento(e, visitantes) {
        const r = HA.reglaPorId[e.id];
        if (r.cat === 'C') return caraSVG(visitantes[e.visitante] || { tipo: r.tipo, aspecto: 1 });
        if (r.cat === 'L') return A.lunaSVG(r.fase, 44);
        if (r.cat === 'D') return e.id === 'D02' ? A.huevoSVG() : A.nebuSVG('grune');
        if (e.objeto || (r.cat === 'O' && r.cond)) {
            const o = e.objeto || Object.keys(r.cond[0]).find((k) => k[0] === 'O');
            return A.objetoSVG(o, 44);
        }
        const tipos = Object.keys(r.cond[0]).map((k) => (k === 'POS' ? 'C15' : k)).filter((k) => k[0] === 'C').slice(0, 2);
        return `<span class="doble">${tipos.map((t) => caraSVG({ tipo: t, aspecto: 3 })).join('')}</span>`;
    }

    function sonidoEvento(e) {
        const r = HA.reglaPorId[e.id];
        const especiales = { G01: 'risa_bruja', G02: 'risa_bruja', L03: 'risa_bruja', L01: 'aullido', P10: 'risa_malvada', G07: 'risa_malvada', P16: 'risa_malvada', O08: 'grimorio', O14: 'caldero' };
        if (especiales[e.id]) S.tocar(especiales[e.id], { retardo: 0.15, volumen: 0.85 });
        if (r.cat === 'D') return;
        if (r.cat === 'C') { S.tocar(e.pts >= 0 ? 'seleccion' : 'evento_malo2', { volumen: 0.6 }); return; }
        if (e.pts >= 100 || r.cat === 'G') S.tocar('combo');
        else if (e.pts <= -100) S.tocar('desastre', { volumen: 0.85 });
        else if (e.pts > 0) S.tocar(Math.random() < 0.5 ? 'evento_bueno' : 'evento_bueno2', { volumen: 0.8 });
        else S.tocar(Math.random() < 0.5 ? 'evento_malo' : 'evento_malo2', { volumen: 0.8 });
    }

    function efectoEscena(e) {
        const r = HA.reglaPorId[e.id];
        if (e.id === 'G01' || e.id === 'G02') escena.efecto('akelarre');
        else if (r.cat === 'G' || e.pts >= 100) escena.efecto('combo');
        else if (r.cat !== 'C' && e.pts > 0) escena.efecto('bueno');
        else if (e.pts < 0 && (r.cat !== 'C' || e.pts <= -20)) escena.efecto('malo');
    }

    async function mostrarAvisos(entrada) {
        const visitantes = entrada.visitantes || [];
        const lista = [];
        for (const e of entrada.eventos) {
            const m = elegirMensaje(e.id);
            const nuevo = !datos.descubiertas[e.id];
            datos.descubiertas[e.id] = (datos.descubiertas[e.id] || 0) + 1;
            if (nuevo) nuevasPartida++;
            lista.push({ e, r: HA.reglaPorId[e.id], m, nuevo });
        }
        guardar();
        const cont = $('avisos');
        let k = 0;
        let acumulado = entrada.antes;
        $('btn-saltar-avisos').hidden = false;
        for (const { e, r, m, nuevo } of lista) {
            k++;
            const clase = `${e.pts > 0 ? 'positivo' : e.pts < 0 ? 'negativo' : 'neutro'}${r.cat === 'G' || Math.abs(e.pts) >= 100 ? ' especial' : ''}`;
            const quien = m.quien === 'Narración' ? '' : m.quien;
            cont.innerHTML = `<div class="aviso ${clase}"><span class="aviso-icono">${iconoEvento(e, visitantes)}</span>` +
                `<div class="aviso-cuerpo"><span class="aviso-quien">${esc(quien)}${nuevo ? '<span class="aviso-nuevo">¡NUEVO!</span>' : ''}${DEBUG ? ` <span class="aviso-id">${e.id}·${m.variante}</span>` : ''}</span><p class="aviso-texto">${quien ? `«${esc(m.texto)}»` : esc(m.texto)}</p></div>` +
                `<span class="aviso-valor">${signo(e.pts)}</span></div>`;
            $('btn-saltar-avisos').textContent = k < lista.length ? `Toca para seguir › ${k}/${lista.length}` : 'Toca para seguir ›';
            sonidoEvento(e);
            efectoEscena(e);
            acumulado += e.pts;
            ponerPuntos(acumulado, e.pts);
            cronicaAgregar(lineaEvento(e, visitantes, m, nuevo));
            const dur = Math.min(4200, Math.max(1700, 1300 + m.texto.length * 30));
            await new Promise((ok) => {
                const t = setTimeout(ok, REDUCIDO ? dur + 600 : dur);
                saltarAviso = () => { clearTimeout(t); ok(); };
            });
            saltarAviso = null;
            const el = cont.firstElementChild;
            if (el) {
                el.classList.add('sale');
                await esperar(180);
            }
        }
        if (entrada.tope) {
            cont.innerHTML = '<div class="aviso especial positivo"><span class="aviso-icono">⭐</span><div class="aviso-cuerpo"><p class="aviso-texto">Popularidad máxima: 1000</p></div><span></span></div>';
            await esperar(1500);
        }
        cont.innerHTML = '';
        $('btn-saltar-avisos').hidden = true;
    }

    // ------------------------------------------------------------------
    // final
    // ------------------------------------------------------------------
    function finalizar() {
        estado = 'final';
        relojParado();
        const pts = partida.puntos;
        const cat = M.categoriaFinal(pts);
        const textos = HA.TEXTOS.categorias[cat.id];
        datos.partidas++;
        if (datos.mejor === null || pts > datos.mejor) datos.mejor = Math.max(0, pts);
        const g02 = partida.activadas.has('G02');
        const g01 = partida.activadas.has('G01');
        if (g01 || g02) datos.akelarres++;
        guardar();
        const entrada = { nombre: partida.jugador, puntos: Math.max(0, pts), cat: cat.nombre, akelarre: g01 || g02, t: Date.now() };
        ranking.push(entrada);
        escribirSesion(CLAVE_RANKING, ranking);
        const puesto = pintarRanking($('final-ranking-lista'), entrada);
        $('final-ranking-puesto').textContent = ranking.length > 1
            ? `${entrada.nombre}: puesto ${puesto + 1} de ${ranking.length}${puesto === 0 ? ' — ¡en cabeza!' : ''}`
            : `${entrada.nombre} abre el ranking. ¿Quién da más?`;

        S.musica(cat.id === 'desastre' ? 'desastre' : 'final');
        S.tocar(cat.id === 'leyenda' ? 'final_leyenda' : cat.id === 'fieston' || cat.id === 'aceptable' ? 'final_bueno' : 'final_malo');

        const gesto = { desastre: 'enfadada', floja: 'sorprendida', aceptable: 'normal', fieston: 'contenta', leyenda: 'contenta' }[cat.id];
        const nebu = { desastre: 'triste', floja: 'triste', aceptable: 'reposo', fieston: 'feliz', leyenda: 'feliz' }[cat.id];
        $('final-claudia').innerHTML = A.claudiaSVG({ bolsa: 'scaryfour', gesto });
        $('final-nebu').innerHTML = A.nebuSVG(nebu);

        const ak = $('final-akelarre');
        ak.textContent = g02 ? '¡Hubo GRAN akelarre!' : g01 ? '¡Hubo akelarre!' : 'No hubo akelarre… esta vez';
        ak.classList.toggle('hubo', g01 || g02);
        $('final-titulo').textContent = textos.titulo;
        $('final-sub').textContent = textos.sub;

        const esp = HA.TEXTOS.especiales;
        let comentario = azar(HA.TEXTOS.finales[cat.id]);
        if (g02) comentario = esp.G02;
        else if (g01 && pts > 0) comentario = esp.G01;
        else if (partida.huevos >= 3) comentario = esp.huevos;
        else if (pts >= 1000) comentario = `${comentario} ${esp.tope}`;
        $('final-comentario').querySelector('p').textContent = comentario;

        const admitidos = partida.historial.reduce((n, h) => n + h.visitantes.length, 0);
        const vistas = Object.keys(datos.descubiertas).length;
        $('final-resumen').innerHTML = [
            `✓ ${admitidos} invitados nuevos`,
            `🥚 ${partida.huevos} huevos`,
            `✨ ${nuevasPartida} sucesos nuevos`,
            `📖 Álbum ${vistas}/${HA.REGLAS.length}`,
            `Código de fiesta: <b>${partida.semilla}</b>`,
        ].map((t) => `<li>${t}</li>`).join('');

        $('final-cronica').innerHTML = cronica.join('');
        mostrar('final');
        contar($('final-puntos'), M.INICIO, Math.max(0, pts), 1400);
    }

    function contar(el, desde, hasta, ms) {
        const t0 = performance.now();
        const paso = (t) => {
            const k = Math.min(1, (t - t0) / (REDUCIDO ? 1 : ms));
            el.textContent = Math.round(desde + (hasta - desde) * (1 - (1 - k) ** 3));
            if (k < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
    }

    // ------------------------------------------------------------------
    // álbum
    // ------------------------------------------------------------------
    function mostrarAlbum(volverA) {
        const cfg = partida ? partida.cfg : M.configurar(balanceActivo());
        const total = HA.REGLAS.length;
        const vistas = HA.REGLAS.filter((r) => datos.descubiertas[r.id]).length;
        $('album-barra').style.width = `${(vistas / total) * 100}%`;
        $('album-cuenta').textContent = `${vistas}/${total}`;
        const secciones = [['G', 'Grupos'], ['P', 'Parejas'], ['O', 'Objetos'], ['L', 'La luna'], ['C', 'Entradas'], ['D', 'En la puerta']];
        $('album-contenido').innerHTML = secciones.map(([cat, titulo]) => {
            const cartas = HA.REGLAS.filter((r) => r.cat === cat && r.id !== 'D01').map((r) => {
                const n = datos.descubiertas[r.id];
                if (!n) return `<div class="carta oculta"><span class="icono-carta">❔</span><span><b>???</b><small>${HA.TEXTOS.pistasAlbum[cat]}</small></span><span class="valor-carta">?</span></div>`;
                const icono = iconoEvento({ id: r.id, visitante: 0, objeto: r.objeto }, [{ tipo: r.tipo || 'C01', aspecto: 5 }]);
                const v = cfg.puntos[r.id];
                const m = HA.MENSAJES[r.id][1][1];
                return `<div class="carta" title="${m.replace(/"/g, '&quot;')}"><span class="icono-carta">${icono}</span><span><b>${r.nombre}</b><small>${r.resultado || ''} · visto ${n}×</small></span><span class="valor-carta" style="color:${v > 0 ? 'var(--bueno)' : v < 0 ? 'var(--malo)' : 'var(--neutro)'}">${signo(v)}</span></div>`;
            }).join('');
            return `<section class="album-seccion"><h2>${titulo}</h2><div class="album-grid">${cartas}</div></section>`;
        }).join('');
        $('btn-album-volver').onclick = () => (volverA === 'final' ? mostrar('final') : prepararPortada());
        mostrar('album');
    }

    // ------------------------------------------------------------------
    // compartir
    // ------------------------------------------------------------------
    async function compartir() {
        const url = `${location.origin}${location.pathname}?fiesta=${partida.semilla}`;
        const texto = `He sacado ${Math.max(0, partida.puntos)}/1000 en «¿Habrá akelarre?». ¿Lo superas en la misma fiesta?`;
        try {
            if (navigator.share) { await navigator.share({ title: '¿Habrá akelarre?', text: texto, url }); return; }
            await navigator.clipboard.writeText(`${texto} ${url}`);
            toast('Enlace copiado: quien lo abra empezará con los mismos invitados.');
        } catch (error) {
            toast(`Código de fiesta: ${partida.semilla}`);
        }
    }

    // ------------------------------------------------------------------
    // eventos de la interfaz
    // ------------------------------------------------------------------
    $('btn-jugar').addEventListener('click', () => { S.tocar('boton'); nuevaPartida(params.get('fiesta') ? params.get('fiesta').toUpperCase() : undefined); });
    $('btn-album').addEventListener('click', () => { S.desbloquear(); mostrarAlbum('portada'); });
    $('btn-ayuda').addEventListener('click', () => $('dlg-ayuda').showModal());
    for (const b of document.querySelectorAll('[data-abrir]')) b.addEventListener('click', () => $(b.dataset.abrir).showModal());
    $('btn-intro-seguir').addEventListener('click', () => { S.tocar('boton', { volumen: 0.6 }); avanzarIntro(); });
    $('btn-intro-saltar').addEventListener('click', () => { introPaso = HA.TEXTOS.intro.length; avanzarIntro(); });
    $('btn-saltar-avisos').addEventListener('click', () => saltarAviso && saltarAviso());
    $('avisos').addEventListener('click', () => saltarAviso && saltarAviso());
    $('btn-sonido').addEventListener('click', () => {
        datos.sonido = (datos.sonido + 2) % 3;
        guardar();
        S.desbloquear();
        aplicarSonido();
        if (datos.sonido === 2) S.musica(estado === 'final' ? 'final' : estado === 'portada' ? null : 'fiesta');
    });
    $('btn-otra').addEventListener('click', () => nuevaPartida());
    $('btn-repetir').addEventListener('click', () => nuevaPartida(partida.semilla));
    $('btn-compartir').addEventListener('click', compartir);
    $('btn-final-album').addEventListener('click', () => mostrarAlbum('final'));
    $('btn-otro-jugador').addEventListener('click', () => {
        $('nombre-jugador').value = '';
        escribirSesion('habra-akelarre-nombre', '');
        prepararPortada();
        $('nombre-jugador').focus();
    });
    $('btn-borrar-ranking').addEventListener('click', () => {
        if (!confirm('¿Borrar el ranking de esta sesión?')) return;
        ranking = [];
        escribirSesion(CLAVE_RANKING, ranking);
        prepararPortada();
    });
    $('nombre-jugador').addEventListener('keydown', (ev) => { if (ev.key === 'Enter') $('btn-jugar').click(); });

    document.addEventListener('keydown', (ev) => {
        if (document.querySelector('dialog[open]')) return;
        const k = ev.key.toLowerCase();
        if (estado === 'decidiendo') {
            if (['1', '2', '3'].includes(k)) { ev.preventDefault(); decidir(Number(k) - 1); }
            if (k === 'arrowleft' || k === 'arrowright') {
                ev.preventDefault();
                const n = rondaInfo.grupos.length;
                enfocar(foco < 0 ? (k === 'arrowleft' ? n - 1 : 0) : (foco + (k === 'arrowleft' ? n - 1 : 1)) % n);
            }
            if (k === 'enter' && foco >= 0 && !(document.activeElement && document.activeElement.classList.contains('candidato'))) { ev.preventDefault(); decidir(foco); }
        } else if (saltarAviso && (k === ' ' || k === 'enter')) {
            ev.preventDefault();
            saltarAviso();
        }
    });

    // el reloj no corre con la pestaña oculta: al volver, se reanuda donde estaba
    document.addEventListener('visibilitychange', () => {
        if (estado !== 'decidiendo') return;
        if (document.hidden) {
            reloj.pausaRestante = reloj.fin - performance.now();
            clearInterval(reloj.id);
        } else if (reloj.pausaRestante !== undefined) {
            reloj.fin = performance.now() + reloj.pausaRestante;
            reloj.pausaRestante = undefined;
            reloj.id = setInterval(relojTic, 100);
        }
    });

    // acceso para pruebas automatizadas
    window.HA.juego = { decidir, estado: () => estado, partida: () => partida, nuevaPartida, saltar: () => saltarAviso && saltarAviso() };

    prepararPortada();
})();
