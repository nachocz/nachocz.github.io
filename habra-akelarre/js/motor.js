// Motor de reglas de «¿Habrá akelarre?».
// Sin dependencias del navegador: lo usan el juego, el simulador de Node
// (herramientas/balance.js) y el balanceador web.
//
// Cada ronda llegan tres candidatos y solo entra el elegido (en la ronda 5,
// cada candidato es una pareja). Los candidatos se generan al empezar cada
// ronda a partir de la fiesta real, así que con la misma semilla y las mismas
// elecciones una partida se reproduce exactamente.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};

    const INICIO = 666;
    const MAXIMO = 1000;
    const RONDAS = 10;
    const RONDA_DOBLE = 4; // índice de la ronda 5/10: los candidatos son parejas
    const CANDIDATOS = 3;
    const SEGUNDOS = 15;

    // ------------------------------------------------------------------
    // azar reproducible
    // ------------------------------------------------------------------
    function hashTexto(texto) {
        let h = 1779033703 ^ texto.length;
        for (let i = 0; i < texto.length; i++) {
            h = Math.imul(h ^ texto.charCodeAt(i), 3432918353);
            h = (h << 13) | (h >>> 19);
        }
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }

    function mulberry32(a) {
        return function () {
            a |= 0;
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    function crearAzar(semilla) {
        const rng = mulberry32(hashTexto(String(semilla)));
        rng.entero = (n) => Math.floor(rng() * n);
        rng.elegir = (lista) => lista[Math.floor(rng() * lista.length)];
        rng.ponderado = (pares) => {
            let total = 0;
            for (const [, w] of pares) total += w;
            let x = rng() * total;
            for (const [v, w] of pares) {
                x -= w;
                if (x < 0) return v;
            }
            return pares[pares.length - 1][0];
        };
        return rng;
    }

    function semillaAleatoria() {
        const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let s = '';
        for (let i = 0; i < 6; i++) s += letras[Math.floor(Math.random() * letras.length)];
        return s;
    }

    // ------------------------------------------------------------------
    // configuración y puntos efectivos
    // ------------------------------------------------------------------
    function configurar(balance) {
        const b = balance || HA.BALANCE || {};
        const puntos = {};
        for (const r of HA.REGLAS) puntos[r.id] = (b.puntos && b.puntos[r.id] !== undefined) ? b.puntos[r.id] : r.pts;
        const pesosTipo = {};
        for (const t of HA.TIPOS) pesosTipo[t.id] = (b.pesosTipo && b.pesosTipo[t.id] !== undefined) ? b.pesosTipo[t.id] : 1;
        const pesosObjeto = {};
        for (const o of HA.OBJETOS) pesosObjeto[o.id] = (b.pesosObjeto && b.pesosObjeto[o.id] !== undefined) ? b.pesosObjeto[o.id] : 1;
        return {
            puntos,
            pesosTipo,
            pesosObjeto,
            objetos: Object.assign({ ninguno: 0.25, uno: 0.65, dos: 0.10 }, b.objetos),
            director: b.director !== undefined ? b.director : 0.35,
            directorObjetos: b.directorObjetos !== undefined ? b.directorObjetos : 2,
            poseido: b.poseido !== undefined ? b.poseido : 0.25,
            pistaPoseido: b.pistaPoseido !== undefined ? b.pistaPoseido : 0.7,
            pistaFalsa: b.pistaFalsa !== undefined ? b.pistaFalsa : 0.1,
        };
    }

    // ------------------------------------------------------------------
    // recuentos y condiciones
    // ------------------------------------------------------------------
    function sumarPersona(cuenta, persona) {
        cuenta[persona.tipo] = (cuenta[persona.tipo] || 0) + 1;
        if (persona.poseido) cuenta.POS = (cuenta.POS || 0) + 1;
        for (const o of persona.objetos || []) {
            if (HA.objetoPorId[o].clase === 'persistente') cuenta[o] = (cuenta[o] || 0) + 1;
        }
    }

    function cumple(regla, cuenta) {
        for (const alt of regla.cond) {
            let ok = true;
            for (const k in alt) {
                if ((cuenta[k] || 0) < alt[k]) { ok = false; break; }
            }
            if (ok) return true;
        }
        return false;
    }

    // ------------------------------------------------------------------
    // generación de una partida
    // ------------------------------------------------------------------
    function elegirTipo(rng, cfg, cuentaPotencial) {
        // el «director» favorece a quien completaría una regla pendiente
        if (cuentaPotencial && rng() < cfg.director) {
            const candidatos = [];
            for (const t of HA.TIPOS) {
                const rel = relevancia(t.id, cuentaPotencial);
                if (rel > 0) candidatos.push([t.id, cfg.pesosTipo[t.id] * rel]);
            }
            if (candidatos.length) return rng.ponderado(candidatos);
        }
        return rng.ponderado(HA.TIPOS.map((t) => [t.id, cfg.pesosTipo[t.id]]));
    }

    // número de reglas pendientes que este tipo completaría (o dejaría a un paso en los grupos)
    function relevancia(tipo, cuenta) {
        let rel = 0;
        for (const r of HA.REGLAS_UNICAS) {
            if (cumple(r, cuenta)) continue;
            for (const alt of r.cond) {
                if (!alt[tipo] || (cuenta[tipo] || 0) >= alt[tipo]) continue;
                let faltanTipos = 0;
                let faltanObjetos = 0;
                for (const k in alt) {
                    const falta = Math.max(0, alt[k] - (cuenta[k] || 0) - (k === tipo ? 1 : 0));
                    if (k[0] === 'O') faltanObjetos += falta;
                    else faltanTipos += falta;
                }
                const umbral = r.cat === 'G' ? 1 : 0;
                if (faltanObjetos === 0 && faltanTipos <= umbral) { rel++; break; }
            }
        }
        return rel;
    }

    function elegirObjetos(rng, cfg, persona, cuentaPotencial) {
        const n = rng.ponderado([[0, cfg.objetos.ninguno], [1, cfg.objetos.uno], [2, cfg.objetos.dos]]);
        const tipo = HA.tipoPorId[persona.tipo];
        const elegidos = [];
        for (let i = 0; i < n; i++) {
            const pares = [];
            for (const o of HA.OBJETOS) {
                if (elegidos.includes(o.id) || tipo.prohibidos.includes(o.id)) continue;
                if (o.id === 'O06' && persona.poseido) continue;
                let w = (tipo.afines[o.id] || 1) * cfg.pesosObjeto[o.id];
                if (cuentaPotencial && o.clase === 'persistente' && completaConObjeto(o.id, persona, cuentaPotencial)) w *= 1 + cfg.directorObjetos;
                pares.push([o.id, w]);
            }
            elegidos.push(rng.ponderado(pares));
        }
        return elegidos;
    }

    function completaConObjeto(objeto, persona, cuenta) {
        const c = Object.assign({}, cuenta);
        sumarPersona(c, { tipo: persona.tipo, poseido: persona.poseido, objetos: [] });
        c[objeto] = (c[objeto] || 0) + 1;
        for (const r of HA.REGLAS_UNICAS) {
            if (!r.cond.some((alt) => alt[objeto])) continue;
            if (!cumple(r, cuenta) && cumple(r, c)) return true;
        }
        return false;
    }

    function crearPersona(rng, cfg, tipo) {
        const poseido = tipo === 'C15' && rng() < cfg.poseido;
        return {
            tipo,
            poseido,
            // pista ambigua: la muestran casi todos los poseídos y algún niño normal
            pista: tipo === 'C15' && rng() < (poseido ? cfg.pistaPoseido : cfg.pistaFalsa),
            aspecto: Math.floor(rng() * 2147483647),
            objetos: [],
        };
    }

    function crearPartida(opciones) {
        const op = opciones || {};
        const semilla = op.semilla || semillaAleatoria();
        const cfg = op.cfg || configurar(op.balance);
        const rng = crearAzar(semilla);
        const fase0 = rng.entero(4);

        // cinco asistentes iniciales sin ninguna regla ya cumplida
        let iniciales = null;
        for (let intento = 0; intento < 500 && !iniciales; intento++) {
            const lista = [];
            const cuenta = {};
            while (lista.length < 5) {
                const tipo = elegirTipo(rng, cfg, null);
                if ((cuenta[tipo] || 0) >= 2) continue;
                const p = crearPersona(rng, cfg, tipo);
                p.inicial = true;
                lista.push(p);
                sumarPersona(cuenta, p);
            }
            if (!HA.REGLAS_UNICAS.some((r) => cumple(r, cuenta))) iniciales = lista;
        }

        const cuenta = {};
        for (const p of iniciales) sumarPersona(cuenta, p);

        return {
            semilla,
            cfg,
            fase0,
            ronda: 0,
            puntos: INICIO,
            asistentes: iniciales.slice(),
            cuenta,
            activadas: new Set(),
            rng,
            visitas: [],
            historial: [],
            terminada: false,
            fracaso: false,
            huevos: 0,
        };
    }

    // ------------------------------------------------------------------
    // resolución
    // ------------------------------------------------------------------
    function fase(partida, ronda) {
        const r = ronda === undefined ? partida.ronda : ronda;
        return HA.FASES[(partida.fase0 + r) % 4].id;
    }

    // tres candidatos de la ronda actual (cada uno, una lista de 1 o 2 personas),
    // generados la primera vez que se piden; el director mira la fiesta real
    function candidatos(partida) {
        const r = partida.ronda;
        if (!partida.visitas[r]) partida.visitas[r] = generarRonda(partida, r);
        return partida.visitas[r];
    }

    function generarRonda(partida, r) {
        const { rng, cfg, cuenta } = partida;
        const n = r === RONDA_DOBLE ? 2 : 1;
        const grupos = [];
        const usados = new Set();
        for (let k = 0; k < CANDIDATOS; k++) {
            const grupo = [];
            for (let i = 0; i < n; i++) {
                // se evita repetir tipo entre los candidatos de una misma ronda
                let tipo = elegirTipo(rng, cfg, cuenta);
                for (let intento = 0; intento < 6 && usados.has(tipo); intento++) tipo = elegirTipo(rng, cfg, cuenta);
                usados.add(tipo);
                const p = crearPersona(rng, cfg, tipo);
                p.objetos = elegirObjetos(rng, cfg, p, cuenta);
                grupo.push(p);
            }
            grupos.push(grupo);
        }
        return grupos;
    }

    function evaluarCandidatos(partida) {
        return candidatos(partida).map((g) => evaluarAdmision(partida, g));
    }

    // efectos de admitir a `visitantes` sin modificar la partida
    function evaluarAdmision(partida, visitantes) {
        const pts = partida.cfg.puntos;
        const faseActual = fase(partida);
        const cuenta = Object.assign({}, partida.cuenta);
        for (const v of visitantes) sumarPersona(cuenta, v);

        const eventos = [];
        // (2) bases
        visitantes.forEach((v, i) => eventos.push({ id: v.tipo, pts: pts[v.tipo], visitante: i }));
        // (3) luna
        for (const r of LUNARES) {
            visitantes.forEach((v, i) => {
                if (v.tipo === r.tipo && faseActual === r.fase) eventos.push({ id: r.id, pts: pts[r.id], visitante: i });
            });
        }
        // (4) consumibles, con el estado ya actualizado
        visitantes.forEach((v, i) => {
            for (const o of v.objetos) {
                if (o === 'O15') {
                    const id = (cuenta.C05 || 0) > 0 ? 'O15-A' : 'O15-B';
                    eventos.push({ id, pts: pts[id], visitante: i, objeto: o });
                } else if (HA.objetoPorId[o].clase === 'consumible') {
                    eventos.push({ id: o, pts: pts[o], visitante: i, objeto: o });
                }
            }
        });
        // (5) sinergias de una vez por partida
        for (const r of HA.REGLAS_UNICAS) {
            if (partida.activadas.has(r.id)) continue;
            if (cumple(r, cuenta)) eventos.push({ id: r.id, pts: pts[r.id] });
        }

        let delta = 0;
        for (const e of eventos) delta += e.pts;
        return { eventos, delta, cuenta };
    }

    // eleccion: índice del candidato que entra (0, 1, 2) o 'tiempo' si se agota
    // el reloj; `evaluacion` (la del candidato elegido) evita repetir el cálculo
    function decidir(partida, eleccion, evaluacion) {
        if (partida.terminada) throw new Error('La partida ya ha terminado');
        const grupos = candidatos(partida);
        const accion = eleccion === 'tiempo' ? 'tiempo' : 'pasar';
        const visitantes = accion === 'pasar' ? grupos[eleccion] : [];
        const antes = partida.puntos;
        let eventos = [];
        let delta = 0;

        if (accion === 'pasar') {
            const ev = evaluacion || evaluarAdmision(partida, visitantes);
            eventos = ev.eventos;
            delta = ev.delta;
            partida.cuenta = ev.cuenta;
            for (const e of eventos) if (HA.reglaPorId[e.id].cond) partida.activadas.add(e.id);
            for (const v of visitantes) partida.asistentes.push(Object.assign({ ronda: partida.ronda }, v));
        } else {
            delta = partida.cfg.puntos.D02;
            eventos = [{ id: 'D02', pts: delta }];
            partida.huevos++;
        }

        const bruto = antes + delta;
        partida.puntos = Math.min(MAXIMO, bruto);
        const entrada = {
            ronda: partida.ronda,
            fase: fase(partida),
            accion,
            eleccion,
            candidatos: grupos,
            visitantes,
            eventos,
            delta,
            antes,
            despues: partida.puntos,
            tope: bruto > MAXIMO,
        };
        partida.historial.push(entrada);
        partida.ronda++;
        if (partida.puntos <= 0) {
            partida.fracaso = true;
            partida.terminada = true;
        } else if (partida.ronda >= RONDAS) {
            partida.terminada = true;
        }
        return entrada;
    }

    const LUNARES = HA.REGLAS.filter((r) => r.cat === 'L');

    function categoriaFinal(puntos) {
        if (puntos <= 0) return { id: 'desastre', nombre: 'Fiesta arruinada' };
        if (puntos < 400) return { id: 'floja', nombre: 'Fiesta floja' };
        if (puntos < 700) return { id: 'aceptable', nombre: 'Fiesta aceptable' };
        if (puntos < 900) return { id: 'fieston', nombre: '¡Fiestón!' };
        return { id: 'leyenda', nombre: 'Leyenda del barrio' };
    }

    HA.motor = {
        INICIO, MAXIMO, RONDAS, RONDA_DOBLE, CANDIDATOS, SEGUNDOS,
        crearAzar, semillaAleatoria, hashTexto,
        configurar, crearPartida, candidatos, evaluarAdmision, evaluarCandidatos, decidir, fase,
        cumple, sumarPersona, relevancia, categoriaFinal,
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = HA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
