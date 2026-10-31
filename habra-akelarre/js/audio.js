// Sonido: efectos con Web Audio (baja latencia en móvil) y música con un
// elemento <audio>. Si la página se abre como archivo local y fetch() no puede
// leer los MP3, los efectos usan también elementos <audio>.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};

    const RUTA = 'assets/audio/';
    const EFECTOS = [
        'ladrido', 'ladrido2', 'grunido', 'grunido2', 'timbre', 'llamada', 'puerta_abre', 'puerta_cierra',
        'huevo_lanzar', 'huevo_splat', 'huevo_chof', 'tic', 'tic_urgente', 'boton', 'seleccion',
        'evento_bueno', 'evento_bueno2', 'evento_malo', 'evento_malo2', 'combo', 'desastre',
        'final_bueno', 'final_leyenda', 'final_malo', 'luna', 'risa_bruja', 'risa_malvada', 'aullido',
        'aullido_corto', 'alien', 'fantasma', 'zombi', 'monstruo', 'momia', 'vampiro', 'nino', 'calabaza',
        'poseido', 'payaso', 'esqueleto', 'gargola', 'cultista', 'hada', 'cientifico', 'cazafantasmas',
        'pirata', 'espantapajaros', 'grimorio', 'caldero',
    ];

    let ctx = null;
    let maestro = null;
    const buffers = {};
    const respaldo = {};
    let usarRespaldo = false;
    let cargando = null;
    const pref = { musica: true, efectos: true };
    let pistaActual = null;
    const musica = {};

    function crearContexto() {
        if (ctx || usarRespaldo) return;
        const AC = root.AudioContext || root.webkitAudioContext;
        if (!AC) { usarRespaldo = true; return; }
        ctx = new AC();
        maestro = ctx.createGain();
        maestro.gain.value = 0.9;
        maestro.connect(ctx.destination);
    }

    function cargar() {
        if (cargando) return cargando;
        crearContexto();
        if (location.protocol === 'file:') usarRespaldo = true;
        cargando = Promise.all(EFECTOS.map(async (n) => {
            if (!usarRespaldo) {
                try {
                    const r = await fetch(`${RUTA}sfx/${n}.mp3`);
                    const datos = await r.arrayBuffer();
                    buffers[n] = await new Promise((ok, ko) => ctx.decodeAudioData(datos, ok, ko));
                    return;
                } catch (error) {
                    usarRespaldo = true;
                }
            }
            const a = new Audio(`${RUTA}sfx/${n}.mp3`);
            a.preload = 'auto';
            respaldo[n] = a;
        }));
        return cargando;
    }

    // hay que llamarlo desde un gesto del usuario (iOS/Chrome bloquean el audio antes)
    function desbloquear() {
        crearContexto();
        if (ctx && ctx.state === 'suspended') ctx.resume();
        cargar();
    }

    function tocar(nombre, opciones) {
        if (!pref.efectos || !nombre) return;
        const op = opciones || {};
        const vol = op.volumen !== undefined ? op.volumen : 1;
        if (buffers[nombre] && ctx) {
            const src = ctx.createBufferSource();
            src.buffer = buffers[nombre];
            src.playbackRate.value = op.tono || (op.variar ? 0.92 + Math.random() * 0.16 : 1);
            const g = ctx.createGain();
            g.gain.value = vol;
            src.connect(g).connect(maestro);
            src.start(ctx.currentTime + (op.retardo || 0));
            return;
        }
        const base = respaldo[nombre];
        if (!base) return;
        const a = base.cloneNode();
        a.volume = Math.min(1, vol);
        setTimeout(() => a.play().catch(() => {}), (op.retardo || 0) * 1000);
    }

    function pista(nombre) {
        if (!musica[nombre]) {
            const a = new Audio(`${RUTA}musica/${nombre}.mp3`);
            a.loop = nombre !== 'desastre';
            a.preload = 'auto';
            musica[nombre] = a;
        }
        return musica[nombre];
    }

    // cambia de pista con un fundido corto (en iOS el volumen es fijo y solo se corta)
    function musicaPoner(nombre) {
        if (pistaActual === nombre) return;
        const anterior = pistaActual ? pista(pistaActual) : null;
        pistaActual = nombre;
        if (anterior) fundir(anterior, 0, 500, () => { anterior.pause(); anterior.currentTime = 0; });
        if (!nombre || !pref.musica) return;
        const a = pista(nombre);
        a.volume = 0;
        a.play().then(() => fundir(a, 1, 800)).catch(() => {});
    }

    function fundir(a, destino, ms, fin) {
        const inicio = a.volume;
        const t0 = performance.now();
        const paso = (t) => {
            const k = Math.min(1, (t - t0) / ms);
            try { a.volume = inicio + (destino - inicio) * k; } catch (error) { /* iOS */ }
            if (k < 1) requestAnimationFrame(paso);
            else if (fin) fin();
        };
        requestAnimationFrame(paso);
    }

    function configurar(nuevas) {
        Object.assign(pref, nuevas);
        if (!pref.musica && pistaActual) {
            pista(pistaActual).pause();
        } else if (pref.musica && pistaActual) {
            const a = pista(pistaActual);
            a.volume = 1;
            a.play().catch(() => {});
        }
    }

    // pausa todo al cambiar de pestaña o bloquear el móvil
    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            if (!pistaActual) return;
            const a = pista(pistaActual);
            if (document.hidden) a.pause();
            else if (pref.musica) a.play().catch(() => {});
            if (ctx) (document.hidden ? ctx.suspend() : ctx.resume()).catch(() => {});
        });
    }

    HA.audio = { desbloquear, cargar, tocar, musica: musicaPoner, configurar, pref };
})(typeof globalThis !== 'undefined' ? globalThis : this);
