// Ilustraciones vectoriales generadas por código: los 20 tipos de personaje
// (con variaciones de aspecto según la semilla del visitante), los objetos,
// Nebu, Claudia y la luna. Todo devuelve texto SVG, así que también funciona
// en Node (herramientas/exportar_svg.js) para exportar las hojas de diseño.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};

    const O = '#20132c'; // contorno
    const SW = 2.2;
    // los atributos de `extra` sustituyen a los de serie: un atributo repetido
    // invalida el SVG cuando se carga como imagen (sprites de la escena)
    const at = (fill, extra) => {
        const base = { fill, stroke: O, 'stroke-width': SW, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
        if (extra) for (const [, k] of extra.matchAll(/([\w-]+)=/g)) delete base[k];
        return Object.entries(base).map(([k, v]) => `${k}="${v}"`).join(' ') + (extra ? ' ' + extra : '');
    };
    const p = (d, fill, extra) => `<path d="${d}" ${at(fill, extra)}/>`;
    const c = (x, y, r, fill, extra) => `<circle cx="${x}" cy="${y}" r="${r}" ${at(fill, extra)}/>`;
    const e = (x, y, rx, ry, fill, extra) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" ${at(fill, extra)}/>`;
    const r = (x, y, w, h, rx, fill, extra) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" ${at(fill, extra)}/>`;
    const ln = (d, color, w) => `<path d="${d}" fill="none" stroke="${color || O}" stroke-width="${w || SW}" stroke-linecap="round" stroke-linejoin="round"/>`;
    const lisa = (d, fill, op) => `<path d="${d}" fill="${fill}"${op !== undefined ? ` opacity="${op}"` : ''}/>`;
    const sombra = (rx) => `<ellipse cx="60" cy="155" rx="${rx || 26}" ry="4.5" fill="#000" opacity="0.28"/>`;
    const hueso = (d, w) => ln(d, O, (w || 4) + 2.6) + ln(d, '#f6f1e4', w || 4);

    function ojo(x, y, rr, iris) {
        const ra = rr || 3.4;
        return `<circle cx="${x}" cy="${y}" r="${ra}" fill="#fff" stroke="${O}" stroke-width="1.6"/>` +
            `<circle cx="${x + 0.4}" cy="${y + 0.5}" r="${ra * 0.52}" fill="${iris || O}"/>` +
            `<circle cx="${x - 0.5}" cy="${y - 0.6}" r="${ra * 0.2}" fill="#fff"/>`;
    }

    function estrella(x, y, s, color) {
        return `<path d="M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z" fill="${color}"/>`;
    }

    // variaciones reproducibles a partir del número `aspecto`
    function variar(aspecto) {
        const rng = HA.motor ? HA.motor.crearAzar(`aspecto-${aspecto}`) : Math.random;
        rng.de = (lista) => lista[Math.floor(rng() * lista.length)];
        return rng;
    }

    const PIEL = ['#f2d3bd', '#e0ac85', '#b9805a', '#8a5a3c', '#f6dfcf'];

    // piernas con medias o pantalones y zapatos
    function piernas(color, zapato, raya) {
        let s = r(48, 126, 9, 26, 3, color) + r(63, 126, 9, 26, 3, color);
        if (raya) for (let y = 131; y < 150; y += 6) s += `<rect x="49" y="${y}" width="7" height="3" fill="${raya}"/><rect x="64" y="${y}" width="7" height="3" fill="${raya}"/>`;
        s += p('M45 150 Q45 145 52 146 L58 147 L58 154 L44 154 Z', zapato) + p('M62 147 L68 146 Q76 145 76 150 L76 154 L62 154 Z', zapato);
        return s;
    }

    // ------------------------------------------------------------------
    // personajes (viewBox 0 0 120 160; pies en y≈155)
    // ------------------------------------------------------------------
    const DIBUJOS = {
        C01(v) { // bruja
            const piel = v.de(['#9fd27e', '#f2d3bd', '#d9c3f2', '#c58c6a']);
            const pelo = v.de(['#ff7b25', '#2b2233', '#efefef', '#b23a8a', '#3d6b35']);
            const vestido = v.de(['#5b2a86', '#2b2440', '#1d5c5c', '#7a1f3d']);
            const sombrero = v.de(['#2b1f3a', '#3c1e5a', '#1f3d2b']);
            const cinta = v.de(['#f77f00', '#9b5de5', '#80ed99', '#ef476f']);
            const media = v.de(['#f77f00', '#9b5de5', '#80ed99', '#ffffff']);
            let s = sombra();
            if (v() < 0.6) s += ln('M96 58 L84 150', O, 6.2) + ln('M96 58 L84 150', '#8d5a3b', 3.6) + p('M76 140 L90 142 L94 158 L70 158 Z', '#e9c46a') + ln('M76 146 L74 156 M82 146 L81 157 M88 146 L89 157', '#b8902f', 1.4);
            s += piernas('#20132c', '#20132c', media);
            s += p('M41 50 Q36 80 40 100 L80 100 Q84 80 79 50 Z', pelo);
            s += p('M44 72 Q60 66 76 72 L90 138 Q60 146 30 138 Z', vestido);
            s += ln('M44 128 L50 138 L56 128 L62 138 L68 128 L74 138', O, 1.6);
            s += p('M46 76 L30 104 L40 110 L50 88 Z', vestido) + c(34, 108, 4.5, piel);
            s += p('M74 76 L90 102 L82 108 L70 88 Z', vestido) + c(87, 106, 4.5, piel);
            s += c(60, 52, 15, piel);
            s += p('M59 51 L70 58 L60 60 Z', piel);
            s += ojo(53, 49) + ojo(66, 48);
            s += ln('M53 62 Q59 66 66 61');
            s += `<circle cx="51" cy="57" r="1.3" fill="${O}" opacity="0.5"/>`;
            s += p('M46 40 Q46 54 42 62 Q50 52 52 42 Z', pelo) + p('M74 40 Q76 54 79 62 Q70 52 68 42 Z', pelo);
            s += e(60, 40, 28, 5.8, sombrero);
            s += p('M45 39 Q52 22 58 12 Q63 4 74 3 Q67 11 67 19 Q70 29 75 39 Z', sombrero);
            s += p('M46 34 Q60 31 74 34 L75 39 Q60 37 45 39 Z', cinta);
            s += r(57, 32, 6, 6, 1, '#ffd166');
            return s;
        },

        C02(v) { // vampiro
            const forro = v.de(['#c1121f', '#6a0dad', '#1d4e89', '#0b6e4f']);
            const pelo = v.de(['#15121c', '#15121c', '#cfd2dc', '#4a2c2a']);
            let s = sombra(30);
            s += p('M40 66 Q16 108 20 152 L100 152 Q104 108 80 66 Z', '#15121c');
            s += lisa('M44 72 Q28 110 30 146 L42 146 Q40 110 50 76 Z', forro) + lisa('M76 72 Q92 110 90 146 L78 146 Q80 110 70 76 Z', forro);
            s += piernas('#15121c', '#0a0a0e');
            s += p('M46 70 L74 70 L78 128 L42 128 Z', '#1f1d28');
            s += p('M53 70 L60 96 L67 70 Z', '#f6f6f6');
            s += p('M54 74 L60 79 L66 74 L66 80 L60 76 L54 80 Z', forro);
            if (v() < 0.5) s += c(60, 92, 3.4, '#ffd166');
            s += p('M46 72 L38 112 L46 114 L52 84 Z', '#1f1d28') + c(41, 116, 4.2, '#f6f6f6');
            s += p('M74 72 L82 112 L74 114 L68 84 Z', '#1f1d28') + c(79, 116, 4.2, '#f6f6f6');
            s += p('M38 46 L45 70 L60 64 L75 70 L82 46 L71 58 L60 54 L49 58 Z', forro);
            s += p('M47 44 L42 38 L48 48 Z', '#e3dff0') + p('M73 44 L78 38 L72 48 Z', '#e3dff0');
            s += c(60, 50, 14, '#e3dff0');
            s += p('M45 47 Q44 32 60 31 Q76 32 75 47 Q72 40 68 39 L60 49 L52 39 Q48 40 45 47 Z', pelo);
            s += ojo(54, 50, 3.2, '#c1121f') + ojo(66, 50, 3.2, '#c1121f');
            s += ln('M50 45 L57 47 M70 45 L63 47', O, 1.8);
            s += ln('M54 58 Q60 61 66 58');
            s += p('M56 59 L57.5 63 L59 59.5 Z', '#fff') + p('M61 59.5 L62.5 63 L64 59 Z', '#fff');
            return s;
        },

        C03(v) { // hombre lobo
            const pelo = v.de(['#8d6e63', '#9e9e9e', '#5d4037', '#4e4a52', '#c49a6c']);
            const camisa = v.de(['#c1121f', '#1d4e89', '#386641', '#6a4c93']);
            const claro = '#e8d5c0';
            let s = sombra(28);
            s += p('M45 118 L75 118 L77 142 L70 138 L64 144 L56 138 L49 144 L43 140 Z', '#3d5a80');
            s += p('M47 140 L45 152 L58 152 L56 140 Z', pelo) + p('M64 140 L62 152 L76 152 L73 140 Z', pelo);
            s += ln('M46 152 L45 155 M51 152 L51 155 M64 152 L64 155 M70 152 L71 155', O, 1.6);
            s += p('M42 72 L78 72 L82 120 L74 116 L67 122 L60 116 L53 122 L46 116 L38 120 Z', camisa);
            s += ln('M50 72 L48 118 M70 72 L72 118 M41 92 L80 92 M40 106 L81 106', '#00000055', 1.6);
            s += lisa('M54 72 L60 86 L66 72 Z', claro);
            s += p('M42 74 Q28 92 30 112 L40 112 Q40 96 50 84 Z', pelo) + p('M78 74 Q92 92 90 112 L80 112 Q80 96 70 84 Z', pelo);
            s += p('M29 110 L31 118 L34 112 L36 118 L38 111 L40 117 L41 110 Z', '#f1e3c8') + p('M79 110 L80 117 L82 111 L84 118 L86 112 L89 118 L91 110 Z', '#f1e3c8');
            s += p('M38 52 Q36 30 48 26 L44 10 L56 22 Q60 21 64 22 L76 10 L72 26 Q84 30 82 52 Q84 64 72 70 Q60 76 48 70 Q36 64 38 52 Z', pelo);
            s += lisa('M47 15 L52 22 L48 24 Z', '#f4a6a6') + lisa('M73 15 L68 22 L72 24 Z', '#f4a6a6');
            s += e(60, 59, 11, 8, claro);
            s += e(60, 53, 4.2, 3, O);
            s += p('M53 63 Q60 68 67 63 L64 66 L62 63.5 L60 67 L58 63.5 L56 66 Z', '#fff');
            s += ojo(51, 45, 3.4, '#e0a100') + ojo(69, 45, 3.4, '#e0a100');
            s += ln('M46 40 L55 42 M74 40 L65 42', O, 2);
            s += ln('M39 58 L33 60 M39 62 L34 66 M81 58 L87 60 M81 62 L86 66', pelo, 2.4);
            return s;
        },

        C04(v) { // zombi
            const piel = v.de(['#8fbf7a', '#9db7a5', '#a3b18a', '#7fa6a8']);
            const camisa = v.de(['#8d99ae', '#b5838d', '#6d6875', '#a68a64']);
            const pelo = v.de(['#3e2f2a', '#545454', '#6b4f2a']);
            let s = sombra(28);
            s += piernas('#4a4e69', '#2b2d42');
            s += p('M45 118 L75 118 L76 134 L70 130 L64 136 L58 130 L52 136 L44 132 Z', '#4a4e69');
            s += p('M44 72 L76 72 L78 122 L70 118 L64 124 L56 118 L48 124 L42 120 Z', camisa);
            s += lisa('M52 94 Q55 90 58 95 Q55 99 52 94 Z', piel) + lisa('M66 104 Q69 101 71 105 Q68 108 66 104 Z', piel);
            s += p('M74 76 L104 84 L104 94 L74 90 Z', camisa) + p('M103 83 L111 86 L110 93 L103 94 Z', piel);
            s += p('M46 76 L18 84 L18 94 L46 90 Z', camisa) + p('M19 83 L11 86 L12 93 L19 94 Z', piel);
            s += c(60, 52, 15, piel);
            s += p('M45 46 Q44 34 54 33 L56 38 L60 32 L64 38 L68 33 Q76 34 75 46 Q70 40 60 41 Q50 40 45 46 Z', pelo);
            s += ojo(53, 51, 4.2) + ojo(67, 50, 2.6);
            s += ln('M48 46 L57 47', O, 1.8);
            s += ln('M53 61 Q58 58 62 61 Q66 63 68 60');
            s += r(57, 60, 3.4, 4, 0.5, '#fff');
            s += ln('M66 40 L72 46 M67 44 L70 41 M69 46 L72 43', '#7a2e2e', 1.3);
            return s;
        },

        C05(v) { // fantasma
            const extra = v.de(['pajarita', 'cadena', 'chistera', 'gafas', 'nada']);
            let s = `<ellipse cx="60" cy="155" rx="24" ry="4" fill="#000" opacity="0.15"/>`;
            s += `<path d="M30 148 L30 70 Q30 26 60 26 Q90 26 90 70 L90 148 Q84 140 78 148 Q72 140 66 148 Q60 140 54 148 Q48 140 42 148 Q36 140 30 148 Z" fill="#f4f7fb" stroke="${O}" stroke-width="${SW}" stroke-linejoin="round" opacity="0.94"/>`;
            s += p('M31 84 Q18 90 21 101 Q27 98 31 97', '#f4f7fb') + p('M89 84 Q102 90 99 101 Q93 98 89 97', '#f4f7fb');
            s += lisa('M38 40 Q46 30 56 30', 'none') + ln('M38 46 Q44 34 54 31', '#ffffff', 3);
            s += e(50, 62, 5.4, 7.4, O) + e(70, 62, 5.4, 7.4, O);
            s += `<circle cx="48.6" cy="59" r="1.8" fill="#fff"/><circle cx="68.6" cy="59" r="1.8" fill="#fff"/>`;
            s += e(60, 80, 4.6, 6, O);
            s += `<ellipse cx="43" cy="72" rx="4" ry="2.2" fill="#f4a6c4" opacity="0.7"/><ellipse cx="77" cy="72" rx="4" ry="2.2" fill="#f4a6c4" opacity="0.7"/>`;
            if (extra === 'pajarita') s += p('M50 96 L60 101 L70 96 L70 106 L60 101 L50 106 Z', '#ef476f');
            if (extra === 'cadena') s += ln('M70 112 Q84 124 92 140', '#8d99ae', 3) + c(94, 144, 6, '#4a4e69');
            if (extra === 'chistera') s += r(46, 12, 28, 18, 2, '#22223b') + e(60, 30, 20, 4, '#22223b') + `<rect x="47" y="24" width="26" height="4" fill="#9b5de5"/>`;
            if (extra === 'gafas') s += p('M42 56 L58 56 L56 66 L44 66 Z', '#111') + p('M62 56 L78 56 L76 66 L64 66 Z', '#111') + ln('M58 58 L62 58', O, 2);
            return s;
        },

        C06(v) { // momia
            const amuleto = v.de(['#3a86ff', '#2a9d8f', '#e63946', '#ffbe0b']);
            const venda = '#efe2c0';
            const linea = '#c9b98f';
            let s = sombra();
            s += r(48, 124, 10, 28, 3, venda) + r(62, 124, 10, 28, 3, venda);
            s += ln('M49 132 L57 130 M49 140 L57 138 M63 130 L71 132 M63 138 L71 140 M49 148 L57 146', linea, 1.4);
            s += p('M44 70 L76 70 L78 128 L42 128 Z', venda);
            for (let y = 78; y < 126; y += 8) s += ln(`M44 ${y} Q60 ${y + 4} 77 ${y - 2}`, linea, 1.5);
            s += p('M45 74 L28 96 L34 102 L50 86 Z', venda) + p('M75 74 L92 96 L86 102 L70 86 Z', venda);
            s += ln('M33 88 L40 92 M85 88 L80 92', linea, 1.4);
            s += c(60, 50, 15, venda);
            s += ln('M46 42 Q60 38 74 44 M45 50 Q60 46 75 52 M47 58 Q60 54 73 60', linea, 1.6);
            s += lisa('M48 47 Q53 44 58 48 Q53 52 48 47 Z', '#20132c');
            s += ojo(53, 48, 3);
            s += ln('M62 49 Q67 47 72 50', O, 1.6);
            s += p('M72 56 Q84 62 82 76 Q78 66 70 62 Z', venda);
            s += p('M60 80 L66 86 L60 94 L54 86 Z', amuleto);
            return s;
        },

        C07(v) { // esqueleto
            const extra = v.de(['chistera', 'gafas', 'pajarita', 'flores', 'nada']);
            let s = sombra(22);
            s += hueso('M54 120 L52 150') + hueso('M66 120 L68 150');
            s += e(50, 152, 6, 3, '#f6f1e4') + e(70, 152, 6, 3, '#f6f1e4');
            s += p('M48 112 Q60 106 72 112 L70 122 Q60 126 50 122 Z', '#f6f1e4');
            s += hueso('M60 70 L60 112', 3.4);
            for (const y of [78, 86, 94, 102]) s += hueso(`M60 ${y} Q48 ${y - 2} 46 ${y + 4}`, 2.6) + hueso(`M60 ${y} Q72 ${y - 2} 74 ${y + 4}`, 2.6);
            s += hueso('M48 74 L36 96 L30 112') + hueso('M72 74 L84 96 L90 112');
            s += c(29, 114, 3.6, '#f6f1e4') + c(91, 114, 3.6, '#f6f1e4');
            s += p('M44 46 Q44 30 60 30 Q76 30 76 46 Q76 56 70 60 L70 66 L50 66 L50 60 Q44 56 44 46 Z', '#f6f1e4');
            s += e(53, 47, 4.6, 5.4, O) + e(67, 47, 4.6, 5.4, O);
            s += `<circle cx="54" cy="48" r="1.4" fill="#fff"/><circle cx="68" cy="48" r="1.4" fill="#fff"/>`;
            s += p('M60 53 L57.5 58 L62.5 58 Z', O);
            s += ln('M52 62 L68 62 M55 60 L55 65 M60 60 L60 65 M65 60 L65 65', O, 1.4);
            if (extra === 'chistera') s += r(47, 14, 26, 16, 2, '#22223b') + e(60, 30, 19, 3.6, '#22223b') + `<rect x="48" y="24" width="24" height="3.4" fill="#e63946"/>`;
            if (extra === 'gafas') s += p('M44 42 L58 42 L56 52 L46 52 Z', '#111') + p('M62 42 L76 42 L74 52 L64 52 Z', '#111') + ln('M58 44 L62 44', O, 2);
            if (extra === 'pajarita') s += p('M52 68 L60 72 L68 68 L68 77 L60 72 L52 77 Z', '#ef476f');
            if (extra === 'flores') s += c(48, 32, 4, '#ef476f') + c(56, 29, 4, '#ffd166') + c(64, 29, 4, '#9b5de5') + c(72, 32, 4, '#80ed99');
            return s;
        },

        C08(v) { // demonio
            const piel = v.de(['#e63946', '#b5179e', '#d62828', '#7b2cbf']);
            const traje = v.de(['#20132c', '#3a0ca3', '#540b0e']);
            let s = sombra();
            s += ln('M72 124 Q100 130 96 108 Q92 92 104 88', O, 5.6) + ln('M72 124 Q100 130 96 108 Q92 92 104 88', piel, 3.2) + p('M100 82 L112 86 L104 94 Z', piel);
            s += piernas(traje, '#111');
            s += p('M44 70 L76 70 L80 128 L40 128 Z', traje);
            s += p('M54 70 L60 90 L66 70 Z', '#f6f6f6') + p('M58 74 L62 74 L63 94 L60 98 L57 94 Z', '#ffd166');
            s += p('M45 72 L34 106 L42 110 L52 84 Z', traje) + c(37, 110, 4.4, piel);
            s += p('M75 72 L86 102 L78 106 L68 84 Z', traje);
            s += r(78, 92, 16, 20, 2, '#f6eedd') + ln('M81 98 L91 98 M81 102 L91 102 M81 106 L88 106', '#a68a64', 1.2) + c(83, 104, 4.4, piel);
            s += p('M48 40 Q38 32 40 16 Q48 28 55 35 Z', '#f1e3c8') + p('M72 40 Q82 32 80 16 Q72 28 65 35 Z', '#f1e3c8');
            s += p('M46 50 L38 42 L47 56 Z', piel) + p('M74 50 L82 42 L73 56 Z', piel);
            s += c(60, 52, 15, piel);
            s += ojo(54, 49, 3.2, '#ffd166') + ojo(66, 49, 3.2, '#ffd166');
            s += ln('M48 43 L57 46 M72 43 L63 46', O, 2.2);
            s += p('M51 57 Q60 66 69 57 Q60 61 51 57 Z', '#fff');
            s += p('M56 64 Q60 74 64 64 Z', O);
            return s;
        },

        C09(v) { // alien
            const piel = v.de(['#80ed99', '#b8a1ff', '#7bdff2', '#c7f464']);
            const traje = v.de(['#d8dee9', '#ffd6a5', '#bdb2ff']);
            let s = sombra(22);
            s += r(50, 124, 8, 28, 3, traje) + r(62, 124, 8, 28, 3, traje);
            s += p('M46 150 L58 150 L58 155 L45 155 Z', '#4a4e69') + p('M62 150 L74 150 L75 155 L62 155 Z', '#4a4e69');
            s += p('M47 76 L73 76 L76 128 L44 128 Z', traje);
            s += r(44, 110, 32, 6, 2, '#4a4e69') + c(60, 113, 3, '#ffd166');
            s += c(60, 90, 6, '#ffd166') + estrella(60, 90, 4, '#fff');
            s += p('M47 80 L32 104 L38 108 L52 90 Z', traje) + p('M73 80 L88 104 L82 108 L68 90 Z', traje);
            s += ln('M34 106 L30 112 M35 107 L34 113 M37 107 L38 112', piel, 2.6) + ln('M86 106 L90 112 M85 107 L86 113 M83 107 L82 112', piel, 2.6);
            s += r(56, 66, 8, 12, 2, piel);
            s += ln('M50 28 Q44 14 38 10', O, 2) + c(37, 9, 3.6, '#ffd166') + ln('M70 28 Q76 14 82 10', O, 2) + c(83, 9, 3.6, '#ffd166');
            s += p('M36 44 Q36 22 60 22 Q84 22 84 44 Q84 60 60 72 Q36 60 36 44 Z', piel);
            s += p('M41 44 Q46 36 56 44 Q52 54 44 52 Q40 50 41 44 Z', '#111') + p('M79 44 Q74 36 64 44 Q68 54 76 52 Q80 50 79 44 Z', '#111');
            s += `<ellipse cx="47" cy="44" rx="2.2" ry="1.4" fill="#fff"/><ellipse cx="73" cy="44" rx="2.2" ry="1.4" fill="#fff"/>`;
            s += ln('M56 62 Q60 64 64 62', O, 1.8);
            return s;
        },

        C10(v) { // monstruo cosido
            const piel = v.de(['#7fb77e', '#93c47d', '#8fb9a8', '#a0c4a2']);
            const chaqueta = v.de(['#2b2d42', '#3d405b', '#463f3a']);
            let s = sombra(30);
            s += r(46, 124, 12, 24, 2, '#3d405b') + r(62, 124, 12, 24, 2, '#3d405b');
            s += r(42, 144, 18, 11, 3, '#111') + r(60, 144, 18, 11, 3, '#111');
            s += p('M36 72 L84 72 L82 128 L38 128 Z', chaqueta);
            s += ln('M60 72 L60 128', O, 1.6) + c(56, 92, 1.6, '#adb5bd') + c(56, 106, 1.6, '#adb5bd');
            s += p('M37 74 L28 106 L38 108 L44 86 Z', chaqueta) + r(27, 106, 11, 10, 3, piel);
            s += p('M83 74 L92 106 L82 108 L76 86 Z', chaqueta) + r(82, 106, 11, 10, 3, piel);
            s += r(54, 62, 12, 12, 2, piel);
            s += r(36, 56, 8, 5, 1, '#adb5bd') + r(76, 56, 8, 5, 1, '#adb5bd');
            s += r(43, 24, 34, 40, 6, piel);
            s += p('M43 34 L43 24 Q43 22 47 22 L73 22 Q77 22 77 24 L77 34 L71 30 L65 35 L59 30 L53 35 L47 30 Z', '#1b1b1b');
            s += ln('M50 38 L70 38', O, 1.4) + ln('M52 36 L52 40 M56 36 L56 40 M60 36 L60 40 M64 36 L64 40 M68 36 L68 40', O, 1.2);
            s += ojo(53, 46, 3.2) + ojo(67, 46, 3.2);
            s += lisa('M49 43 L57 43 L57 46 L49 46 Z', piel) + lisa('M63 43 L71 43 L71 46 L63 46 Z', piel) + ln('M49 46 L57 46 M63 46 L71 46', O, 1.8);
            s += ln('M48 41 L58 42 M62 42 L72 41', O, 2.6);
            s += ln('M52 56 L68 56', O, 2) + ln('M55 54 L55 58 M60 54 L60 58 M65 54 L65 58', O, 1.2);
            return s;
        },

        C11(v) { // calabaza viviente
            const color = v.de(['#f77f00', '#e85d04', '#f4a261', '#f1eee4']);
            const cara = v.de([0, 1, 2]);
            const luz = '#ffd23f';
            let s = sombra(30);
            s += ln('M50 128 L48 152', '#3a5a40', 4.4) + ln('M70 128 L72 152', '#3a5a40', 4.4);
            s += e(46, 153, 6, 2.6, '#3a5a40') + e(74, 153, 6, 2.6, '#3a5a40');
            s += ln('M30 96 Q16 92 18 80 Q22 74 26 80', '#3a5a40', 3.4) + ln('M90 96 Q104 92 102 80 Q98 74 94 80', '#3a5a40', 3.4);
            s += e(60, 98, 34, 32, color);
            s += ln('M44 70 Q34 98 44 128 M60 66 L60 130 M76 70 Q86 98 76 128', '#00000030', 2);
            s += p('M56 68 Q56 58 61 54 L66 57 Q62 62 63 68 Z', '#5a7d2a') + p('M63 60 Q74 52 80 60 Q72 64 63 62 Z', '#80b918');
            if (cara === 0) s += p('M44 88 L52 78 L58 90 Z', luz) + p('M62 90 L68 78 L76 88 Z', luz) + p('M42 104 Q60 124 78 104 L72 108 L68 104 L64 110 L60 104 L56 110 L52 104 L48 108 Z', luz);
            if (cara === 1) s += e(50, 86, 6, 7, luz) + e(70, 86, 6, 7, luz) + p('M46 104 Q60 118 74 104 Q60 110 46 104 Z', luz);
            if (cara === 2) s += p('M44 84 L56 84 L50 94 Z', luz) + p('M64 84 L76 84 L70 94 Z', luz) + p('M48 104 L72 104 L68 114 L64 110 L60 116 L56 110 L52 114 Z', luz);
            return s;
        },

        C12(v) { // payaso siniestro
            const pelo = v.de(['#e63946', '#2a9d8f', '#3a86ff', '#9b5de5']);
            const traje = v.de(['#ffbe0b', '#90be6d', '#f15bb5', '#4cc9f0']);
            const globo = v.de(['#e63946', '#e63946', '#9b5de5']);
            let s = sombra(30);
            s += ln('M88 100 Q96 70 96 44', O, 1.2) + e(96, 30, 11, 13, globo) + p('M93 43 L99 43 L96 47 Z', globo) + `<ellipse cx="92" cy="25" rx="2.4" ry="4" fill="#fff" opacity="0.6"/>`;
            s += ln('M91 34 Q96 38 101 34', O, 1.4) + ln('M93 35 L94 37 M97 36 L97 38 M100 35 L99 37', '#fff', 1);
            s += piernas(traje, '#e63946');
            s += p('M41 72 L79 72 L84 130 L36 130 Z', traje);
            for (const [x, y] of [[50, 84], [68, 92], [54, 108], [70, 116], [46, 120]]) s += `<circle cx="${x}" cy="${y}" r="3" fill="#fff" opacity="0.8"/>`;
            s += c(60, 88, 3, '#e63946') + c(60, 100, 3, '#e63946');
            s += p('M42 74 L30 104 L38 108 L50 86 Z', traje) + c(34, 108, 4.6, '#fff');
            s += p('M78 74 L88 98 L82 104 L70 86 Z', traje) + c(87, 101, 4.6, '#fff');
            s += p('M40 70 L46 64 L52 70 L58 64 L64 70 L70 64 L76 70 L82 66 L78 76 L42 76 L38 66 Z', '#fff');
            s += c(40, 44, 9, pelo) + c(36, 54, 8, pelo) + c(80, 44, 9, pelo) + c(84, 54, 8, pelo);
            s += c(60, 50, 15, '#fbf8f3');
            s += p('M50 42 L53 37 L56 42 L53 52 Z', '#3a86ff') + p('M64 42 L67 37 L70 42 L67 52 Z', '#3a86ff');
            s += ojo(53, 45, 2.8) + ojo(67, 45, 2.8);
            s += c(60, 52, 3.8, '#e63946');
            s += p('M47 56 Q60 70 73 56 Q60 62 47 56 Z', '#e63946') + ln('M52 59 L68 59', '#fff', 1.6);
            s += p('M50 34 L60 22 L70 34 Z', '#ffbe0b') + c(60, 21, 2.6, '#e63946');
            return s;
        },

        C13(v) { // pirata fantasma
            const tinte = v.de(['#8fe3f5', '#a0f0d0', '#b9c8ff']);
            const abrigo = v.de(['#3d5a80', '#5e548e', '#2a6f97']);
            let s = `<ellipse cx="60" cy="155" rx="22" ry="4" fill="#4cc9f0" opacity="0.25"/>`;
            s += `<g opacity="0.88">`;
            s += p('M44 120 Q40 140 52 150 Q60 140 58 152 Q70 146 66 136 Q78 138 76 120 Z', tinte);
            s += p('M42 70 L78 70 L82 124 L38 124 Z', abrigo);
            s += lisa('M54 70 L60 84 L66 70 Z', tinte) + ln('M60 84 L60 124', '#ffd166', 1.6) + c(56, 94, 1.6, '#ffd166') + c(56, 106, 1.6, '#ffd166');
            s += r(38, 104, 44, 6, 1, '#6b4f2a');
            s += p('M42 72 L30 100 L38 104 L48 86 Z', abrigo) + c(34, 104, 4.4, tinte);
            s += p('M78 72 L88 98 L82 104 L72 86 Z', abrigo) + ln('M85 102 L86 110 Q86 116 80 114', '#adb5bd', 2.4);
            s += c(60, 50, 15, tinte);
            s += p('M48 56 Q60 74 72 56 Q66 62 60 62 Q54 62 48 56 Z', '#ffffff', 'opacity="0.9"');
            s += ojo(54, 48, 3.2, '#1d4e89');
            s += ln('M46 42 L76 52', O, 1.6) + e(66, 48, 4.6, 4, O);
            s += ln('M55 57 Q60 59 65 57');
            s += p('M36 38 Q60 24 84 38 Q76 32 72 33 L60 22 L48 33 Q44 32 36 38 Z', '#22223b');
            s += c(60, 30, 3, '#fff') + ln('M57 33 L63 33', O, 1);
            s += `</g>`;
            s += ln('M82 60 Q90 56 92 62', '#ffffff55', 2);
            return s;
        },

        C14(v) { // cazafantasmas
            const traje = v.de(['#c8b89a', '#9aa5a8', '#8a9a5b']);
            const piel = v.de(PIEL);
            const pelo = v.de(['#2b2233', '#6b4f2a', '#c49a6c', '#a23b2a']);
            let s = sombra(28);
            s += r(36, 64, 48, 52, 6, '#4a4e69') + r(40, 70, 40, 12, 2, '#6c757d') + c(46, 96, 3, '#ef476f') + c(54, 96, 3, '#ffd166');
            s += ln('M80 80 Q96 92 92 110', '#2b2d42', 4);
            s += piernas(traje, '#2b2d42');
            s += p('M44 70 L76 70 L78 128 L42 128 Z', traje);
            s += ln('M60 72 L60 124', '#00000035', 1.6);
            s += c(70, 84, 5, '#fff') + ln('M66 80 L74 88', '#e63946', 1.8) + e(70, 84, 2, 2.6, '#cfd8dc', 'stroke-width="0.8"');
            s += r(38, 70, 6, 46, 2, '#2b2d42') + r(76, 70, 6, 46, 2, '#2b2d42');
            s += p('M45 74 L34 104 L42 108 L52 86 Z', traje) + c(38, 108, 4.4, piel);
            s += p('M75 74 L90 98 L84 104 L70 86 Z', traje) + r(84, 96, 18, 7, 2, '#495057') + c(88, 104, 4.4, piel);
            s += c(60, 52, 14, piel);
            s += p('M46 50 Q44 36 60 35 Q76 36 74 50 Q70 42 60 42 Q50 42 46 50 Z', pelo);
            s += r(46, 38, 28, 7, 3, '#495057') + c(53, 41, 3.4, '#90e0ef') + c(67, 41, 3.4, '#90e0ef');
            s += ojo(54, 52, 3) + ojo(66, 52, 3);
            s += ln('M55 60 Q60 62 65 60');
            return s;
        },

        C15(v, persona) { // niño de truco o trato
            const disfraz = v.de(['dino', 'gato', 'abeja', 'super', 'robot']);
            const piel = v.de(PIEL);
            const pelo = v.de(['#2b2233', '#6b4f2a', '#e9c46a', '#a23b2a']);
            let s = sombra(20);
            let cuerpo = '#80b918';
            if (disfraz === 'gato') cuerpo = '#2b2233';
            if (disfraz === 'abeja') cuerpo = '#ffd166';
            if (disfraz === 'super') cuerpo = '#3a86ff';
            if (disfraz === 'robot') cuerpo = '#adb5bd';
            if (persona && persona.pista) s += `<g class="pista-posesion"><path d="M38 92 Q34 74 44 64 L42 54 L50 62 Q60 58 70 62 L78 54 L76 64 Q86 74 82 92 Z" fill="#3c0d2e" opacity="0.55"/></g>`;
            if (disfraz === 'super') s += p('M48 106 Q36 130 40 150 L80 150 Q84 130 72 106 Z', '#e63946');
            if (disfraz === 'gato') s += ln('M72 136 Q92 136 88 116', O, 5) + ln('M72 136 Q92 136 88 116', cuerpo, 2.6);
            s += r(51, 134, 8, 18, 3, cuerpo) + r(61, 134, 8, 18, 3, cuerpo);
            s += e(54, 153, 6, 3, '#2b2233') + e(66, 153, 6, 3, '#2b2233');
            if (disfraz === 'robot') s += r(44, 102, 32, 36, 3, cuerpo) + c(54, 114, 3, '#e63946') + c(64, 114, 3, '#80ed99') + r(52, 124, 16, 6, 1, '#495057');
            else s += p('M48 104 L72 104 L76 138 L44 138 Z', cuerpo);
            if (disfraz === 'abeja') s += `<rect x="45" y="114" width="30" height="5" fill="${O}"/><rect x="45" y="126" width="31" height="5" fill="${O}"/>` + e(42, 108, 8, 5, '#e0fbfc', 'opacity="0.8"') + e(78, 108, 8, 5, '#e0fbfc', 'opacity="0.8"');
            if (disfraz === 'dino') s += lisa('M54 108 L66 108 L68 134 L52 134 Z', '#d9ed92');
            if (disfraz === 'super') s += p('M55 112 L65 112 L60 120 Z', '#ffd166');
            s += p('M48 106 L38 124 L44 127 L52 114 Z', cuerpo) + c(40, 127, 3.6, piel);
            s += p('M72 106 L80 120 L74 124 L68 114 Z', cuerpo);
            s += ln('M80 118 Q86 108 92 118', O, 1.8) + p('M78 120 L94 120 L92 134 Q86 138 80 134 Z', '#f77f00') + p('M82 124 L84 122 L86 124 M88 124 L90 122 L92 124', 'none') + ln('M83 130 Q86 132 90 130', O, 1.4) + c(78, 122, 3.6, piel);
            s += c(60, 90, 13, piel);
            s += p('M48 88 Q48 76 60 76 Q72 76 72 88 Q66 82 60 82 Q54 82 48 88 Z', pelo);
            if (disfraz === 'dino') s += p('M44 92 Q42 70 60 68 Q78 70 76 92 Q74 80 60 79 Q46 80 44 92 Z', cuerpo) + p('M52 70 L55 62 L58 69 L61 61 L64 69 L67 63 L69 71 Z', '#f77f00');
            if (disfraz === 'gato') s += p('M48 80 L48 68 L56 77 Z', '#2b2233') + p('M72 80 L72 68 L64 77 Z', '#2b2233') + ln('M48 94 L42 93 M48 97 L42 98 M72 94 L78 93 M72 97 L78 98', O, 1.2);
            if (disfraz === 'abeja') s += ln('M54 78 Q50 68 46 66 M66 78 Q70 68 74 66', O, 1.6) + c(46, 66, 2.4, O) + c(74, 66, 2.4, O);
            if (disfraz === 'super') s += p('M47 86 Q60 82 73 86 L72 92 Q60 89 48 92 Z', '#e63946');
            if (disfraz === 'robot') s += ln('M60 77 L60 68', O, 1.8) + c(60, 66, 2.6, '#e63946');
            s += ojo(55, 90, 2.8) + ojo(65, 90, 2.8);
            s += ln('M56 97 Q60 100 64 97');
            if (persona && persona.pista) s += `<g class="pista-posesion"><circle cx="55.4" cy="90.5" r="1.7" fill="#ff1744"/><circle cx="65.4" cy="90.5" r="1.7" fill="#ff1744"/></g>`;
            return s;
        },

        C16(v) { // cultista
            const tunica = v.de(['#6a040f', '#3c096c', '#5e3023', '#283618']);
            const simbolo = v.de(['#ffd166', '#e9c46a', '#e5e5e5']);
            let s = sombra(30);
            s += p('M40 62 Q60 46 80 62 L92 152 L28 152 Z', tunica);
            s += ln('M40 100 Q60 106 80 100', '#d4a373', 2.4) + ln('M70 104 L72 118 M74 103 L77 116', '#d4a373', 2);
            s += p('M60 72 L68 86 L52 86 Z', 'none') + ln('M60 72 L68 86 L52 86 Z', simbolo, 1.6) + c(60, 81, 1.8, simbolo);
            s += p('M42 66 L34 98 L46 100 L52 80 Z', tunica) + p('M78 66 L86 98 L74 100 L68 80 Z', tunica);
            s += r(55, 92, 10, 18, 1, '#f6eedd') + p('M60 80 Q55 88 60 92 Q65 88 60 80 Z', '#ffb703') + `<circle cx="60" cy="86" r="10" fill="#ffd166" opacity="0.18"/>`;
            s += c(48, 100, 4, '#e0ac85') + c(72, 100, 4, '#e0ac85');
            s += p('M40 66 Q38 28 60 24 Q82 28 80 66 Q72 58 60 58 Q48 58 40 66 Z', tunica);
            s += e(60, 52, 13, 15, '#120a18', 'stroke-width="1.2"');
            s += `<ellipse cx="55" cy="50" rx="2.6" ry="1.6" fill="#ffd166"/><ellipse cx="65" cy="50" rx="2.6" ry="1.6" fill="#ffd166"/>`;
            return s;
        },

        C17(v) { // hada oscura
            const ala = v.de(['#b5179e', '#4cc9f0', '#7209b7', '#2a9d8f']);
            const vestido = v.de(['#20132c', '#3c096c', '#560bad']);
            const pelo = v.de(['#b5179e', '#2b2233', '#efefef', '#3a0ca3']);
            const piel = v.de(['#f6dfcf', '#e0ac85', '#cdb4db', '#8a5a3c']);
            let s = sombra(22);
            s += `<g opacity="0.78">${p('M58 80 Q26 40 18 58 Q14 82 56 92 Z', ala)}${p('M62 80 Q94 40 102 58 Q106 82 64 92 Z', ala)}${p('M58 94 Q30 100 30 118 Q46 122 58 100 Z', ala)}${p('M62 94 Q90 100 90 118 Q74 122 62 100 Z', ala)}</g>`;
            s += ln('M56 86 Q38 66 24 60 M64 86 Q82 66 96 60', '#ffffff66', 1.2);
            s += r(52, 122, 6, 28, 3, piel) + r(62, 122, 6, 28, 3, piel);
            s += p('M47 148 L58 146 L58 155 L46 155 Z', vestido) + p('M62 146 L73 148 L74 155 L62 155 Z', vestido);
            s += p('M50 74 L70 74 L72 100 L48 100 Z', vestido);
            s += p('M48 98 L72 98 L86 124 L78 120 L72 126 L66 120 L60 127 L54 120 L48 126 L42 120 L34 124 Z', vestido);
            s += p('M50 76 L38 98 L44 102 L54 86 Z', piel) + p('M70 76 L84 92 L80 98 L66 86 Z', piel);
            s += ln('M84 94 L96 70', '#c0c0c0', 2) + estrella(97, 67, 7, '#ffd166');
            s += c(60, 52, 14, piel);
            s += c(60, 30, 9, pelo) + p('M46 52 Q44 36 60 36 Q76 36 74 52 Q68 42 60 42 Q52 42 46 52 Z', pelo);
            s += p('M52 38 L56 32 L60 37 L64 32 L68 38 Z', '#c0c0c0');
            s += ojo(54, 52, 3, '#7209b7') + ojo(66, 52, 3, '#7209b7');
            s += ln('M51 48 L49 46 M53 47.6 L52 45 M69 48 L71 46 M67 47.6 L68 45', O, 1.2);
            s += p('M56 60 Q60 63 64 60 Q60 61 56 60 Z', '#9d0208');
            s += estrella(36, 46, 3, '#fff') + estrella(88, 40, 2.4, '#fff') + estrella(30, 122, 2.4, '#fff') + estrella(92, 126, 2, '#fff');
            return s;
        },

        C18(v) { // gárgola
            const piedra = v.de(['#8d99ae', '#a5a58d', '#b7a99a', '#6c757d']);
            const oscura = '#00000030';
            let s = sombra(30);
            s += r(32, 132, 56, 22, 2, '#5c677d') + ln('M32 140 L88 140', '#00000040', 1.4);
            s += p('M48 86 Q22 54 12 64 Q20 70 16 78 Q26 78 26 88 Q34 84 44 100 Z', piedra) + p('M72 86 Q98 54 108 64 Q100 70 104 78 Q94 78 94 88 Q86 84 76 100 Z', piedra);
            s += p('M40 132 Q34 104 44 84 Q60 74 76 84 Q86 104 80 132 Z', piedra);
            s += p('M38 132 Q34 118 44 112 Q52 116 52 132 Z', piedra) + p('M82 132 Q86 118 76 112 Q68 116 68 132 Z', piedra);
            s += ln('M40 132 L38 136 M44 132 L44 136 M76 132 L76 136 M80 132 L82 136', O, 1.6);
            s += p('M48 92 Q50 108 54 122 L48 124 Q42 108 44 94 Z', piedra) + p('M72 92 Q70 108 66 122 L72 124 Q78 108 76 94 Z', piedra);
            s += lisa('M52 100 Q60 96 68 100 L66 118 L54 118 Z', oscura);
            s += p('M44 54 L36 38 L50 48 Z', piedra) + p('M76 54 L84 38 L70 48 Z', piedra);
            s += p('M48 46 Q46 34 52 30 Q52 38 54 42 Z', '#e9ecef') + p('M72 46 Q74 34 68 30 Q68 38 66 42 Z', '#e9ecef');
            s += p('M42 62 Q42 42 60 42 Q78 42 78 62 Q78 78 60 80 Q42 78 42 62 Z', piedra);
            s += ln('M47 54 L56 57 M73 54 L64 57', O, 2.6);
            s += ojo(53, 60, 3, '#ef476f') + ojo(67, 60, 3, '#ef476f');
            s += p('M48 68 Q60 78 72 68 L69 70 L67 67 L64 71 L61 67 L58 71 L55 67 L52 71 Z', '#fff');
            s += lisa('M64 46 Q70 44 74 50 Q68 52 64 46 Z', '#6a994e', 0.8) + lisa('M42 112 Q48 108 50 114 Q46 118 42 112 Z', '#6a994e', 0.8);
            return s;
        },

        C19(v) { // espantapájaros
            const camisa = v.de(['#c1121f', '#1d4e89', '#386641', '#b56576']);
            const peto = v.de(['#3d5a80', '#6b705c', '#7f5539']);
            const cuervo = v() < 0.4;
            const paja = '#e9c46a';
            let s = sombra(28);
            s += p('M47 124 L45 152 L57 152 L57 124 Z', peto) + p('M63 124 L63 152 L75 152 L73 124 Z', peto);
            s += ln('M46 152 L43 156 M50 152 L50 157 M55 152 L57 156 M65 152 L63 156 M70 152 L70 157 M74 152 L77 156', paja, 2);
            s += p('M24 76 L96 76 L96 90 L24 90 Z', camisa);
            s += ln('M24 83 L96 83 M36 76 L36 90 M84 76 L84 90', '#00000040', 1.4);
            s += ln('M24 80 L14 76 M24 84 L13 86 M24 88 L16 94 M96 80 L106 76 M96 84 L107 86 M96 88 L104 94', paja, 2.2);
            s += p('M44 74 L76 74 L78 128 L42 128 Z', camisa);
            s += p('M46 96 L74 96 L76 128 L44 128 Z', peto) + ln('M48 96 L46 76 M72 96 L74 76', peto, 3);
            s += r(52, 104, 10, 9, 1, '#e9c46a') + ln('M53 105 L61 112 M61 105 L53 112', O, 0.8);
            s += ln('M52 74 L48 68 M58 74 L58 67 M66 74 L70 68', paja, 2.2);
            s += p('M44 50 Q44 32 60 32 Q76 32 76 50 Q76 68 60 70 Q44 68 44 50 Z', '#d4a373');
            s += ln('M48 40 Q52 44 48 50 M70 58 Q66 62 72 64', '#a98467', 1.2);
            s += c(53, 50, 3.6, O) + c(67, 50, 3.6, O) + ln('M51.6 48.6 L54.4 51.4 M54.4 48.6 L51.6 51.4 M65.6 48.6 L68.4 51.4 M68.4 48.6 L65.6 51.4', '#d4a373', 1);
            s += ln('M50 60 Q60 66 70 60', O, 1.6) + ln('M53 59 L52 63 M57 61 L56.6 64.6 M61 61.6 L61.4 65 M65 61 L66 64.4 M68.6 59.4 L70 62.6', O, 1.1);
            s += p('M34 36 Q60 30 86 36 Q78 40 60 39 Q42 40 34 36 Z', '#e9c46a') + p('M46 36 Q46 20 60 20 Q74 20 74 36 Z', '#e9c46a') + `<rect x="46" y="31" width="28" height="4" fill="${camisa}"/>`;
            if (cuervo) s += p('M84 68 Q86 58 94 58 Q100 58 100 64 L106 64 L100 67 Q98 74 90 74 L84 74 Z', '#22223b') + `<circle cx="95" cy="62" r="1.2" fill="#ffd166"/>`;
            return s;
        },

        C20(v) { // científico loco
            const pelo = v.de(['#f1f1f1', '#ced4da', '#ff9f1c', '#adb5bd']);
            const liquido = v.de(['#80ed99', '#f15bb5', '#4cc9f0', '#ffd166']);
            const guante = v.de(['#20132c', '#ffd166', '#2a9d8f']);
            const piel = v.de(PIEL);
            let s = sombra(28);
            s += piernas('#495057', '#20132c');
            s += p('M42 70 L78 70 L84 140 L36 140 Z', '#f8f9fa');
            s += lisa('M54 70 L60 90 L66 70 Z', '#90e0ef') + p('M58 74 L62 74 L62 92 L60 96 L58 92 Z', '#e63946');
            s += ln('M54 70 L52 140 M66 70 L68 140', '#ced4da', 1.6) + r(66, 96, 8, 6, 1, '#f8f9fa') + ln('M68 94 L68 98 M71 93 L71 98', '#3a86ff', 1.2);
            s += p('M43 72 L32 104 L40 108 L52 84 Z', '#f8f9fa') + c(36, 108, 4.6, guante);
            s += p('M77 72 L90 94 L84 100 L70 84 Z', '#f8f9fa');
            s += p('M86 70 L94 70 L94 80 L102 98 Q102 104 96 104 L84 104 Q78 104 78 98 L86 80 Z', '#e0fbfc', 'opacity="0.95"');
            s += lisa('M82 90 L98 90 L101 98 Q101 102 96 102 L84 102 Q80 102 80 98 Z', liquido);
            s += `<circle cx="88" cy="84" r="2" fill="${liquido}"/><circle cx="92" cy="76" r="1.5" fill="${liquido}"/><circle cx="89" cy="66" r="1.2" fill="${liquido}"/>`;
            s += c(86, 100, 4.6, guante);
            s += c(60, 52, 14, piel);
            s += p('M44 46 L34 40 L44 38 L36 28 L48 32 L46 20 L56 30 L60 18 L64 30 L74 20 L72 32 L84 28 L76 38 L86 40 L76 46 Q74 38 60 38 Q46 38 44 46 Z', pelo);
            s += c(53, 50, 6, '#caf0f8') + c(67, 50, 6, '#caf0f8') + ln('M59 50 L61 50 M47 49 L43 47 M73 49 L77 47', O, 2);
            s += ojo(53, 50, 2.6) + ojo(67, 50, 2.6);
            s += p('M52 59 Q60 67 68 59 Q60 62 52 59 Z', '#fff');
            return s;
        },
    };

    // recorte cuadrado [x, y, lado] de la cabeza, para las fichas pequeñas
    const MINI = {
        C01: [26, 0, 68], C02: [30, 26, 50], C03: [32, 8, 56], C04: [36, 28, 48], C05: [28, 24, 64],
        C06: [36, 32, 48], C07: [36, 24, 48], C08: [34, 14, 52], C09: [30, 6, 60], C10: [34, 18, 52],
        C11: [22, 54, 76], C12: [28, 18, 64], C13: [32, 18, 56], C14: [36, 30, 48], C15: [40, 62, 40],
        C16: [36, 24, 48], C17: [36, 20, 48], C18: [34, 28, 52], C19: [30, 16, 60], C20: [30, 14, 60],
    };

    // ------------------------------------------------------------------
    // objetos (viewBox 0 0 40 40)
    // ------------------------------------------------------------------
    const OBJ = {
        O01: () => p('M6 16 L2 11 L4 20 Z', '#f15bb5') + e(14, 17, 8, 6, '#f15bb5') + p('M22 17 L27 11 L25 22 Z', '#f15bb5') + ln('M10 13 L12 21 M16 13 L18 21', '#fff', 1.4) +
            p('M14 30 L9 25 L11 34 Z', '#4cc9f0') + e(22, 30, 8, 6, '#4cc9f0') + p('M30 30 L35 24 L33 35 Z', '#4cc9f0') + ln('M18 26 L20 34 M24 26 L26 34', '#fff', 1.4),
        O02: () => p('M6 20 L2 14 L4 26 Z', '#8a9a5b') + e(15, 20, 10, 7.5, '#8a9a5b') + p('M25 20 L30 13 L28 27 Z', '#8a9a5b') + `<text x="15" y="24.5" font-size="11" font-weight="700" text-anchor="middle" fill="#fff" font-family="sans-serif">?</text>` +
            r(26, 26, 11, 11, 3, '#fff') + c(31.5, 31.5, 2.2, '#ced4da'),
        O03: () => p('M6 34 L18 14 L26 22 Z', '#9b5de5') + ln('M10 27 L20 19 M13 31 L23 22', '#ffd166', 1.6) + r(22, 6, 4, 4, 0.5, '#ef476f', 'transform="rotate(20 24 8)"') + r(30, 14, 4, 4, 0.5, '#80ed99', 'transform="rotate(-20 32 16)"') + r(28, 4, 3, 3, 0.5, '#ffd166') + r(34, 24, 3, 3, 0.5, '#4cc9f0') + estrella(32, 8, 3, '#fff'),
        O04: () => p('M16 4 L24 4 L24 10 Q30 14 30 22 L30 36 Q30 38 28 38 L12 38 Q10 38 10 36 L10 22 Q10 14 16 10 Z', '#b5651d') + r(15, 2, 10, 4, 1, '#ffd166') + r(11, 21, 18, 11, 1, '#f6eedd') + `<text x="20" y="28" font-size="5" font-weight="800" text-anchor="middle" fill="#c1121f" font-family="sans-serif">CEBADA</text>` + lisa('M13 14 Q14 12 16 12 L16 20 L13 20 Z', '#fff', 0.3),
        O05: () => ln('M6 4 Q20 10 34 4', '#a98467', 2) + [[10, 18], [20, 24], [30, 18]].map(([x, y]) => p(`M${x} ${y - 9} Q${x + 8} ${y} ${x + 5} ${y + 7} Q${x} ${y + 10} ${x - 5} ${y + 7} Q${x - 8} ${y} ${x} ${y - 9} Z`, '#f8f4e3') + ln(`M${x} ${y - 6} L${x} ${y + 8} M${x - 3} ${y - 3} Q${x - 4} ${y + 4} ${x - 2} ${y + 8}`, '#d6ccc2', 1.1)).join(''),
        O06: () => `<circle cx="20" cy="18" r="16" fill="#ffd166" opacity="0.28"/>` + p('M17 4 L23 4 L23 12 L31 12 L31 18 L23 18 L23 36 L17 36 L17 18 L9 18 L9 12 L17 12 Z', '#ffd166') + lisa('M18 6 L20 6 L20 34 L18 34 Z', '#fff', 0.5),
        O07: () => [[10, 26], [22, 16], [30, 30]].map(([x, y]) => e(x, y, 4, 3, '#6b4f2a') + ln(`M${x - 2} ${y + 2} L${x - 5} ${y + 6} M${x + 2} ${y + 2} L${x + 5} ${y + 6} M${x + 3} ${y - 1} L${x + 6} ${y - 4}`, O, 1.1)).join('') +
            ln('M4 18 Q8 8 12 18 M16 10 Q20 2 24 8 M26 24 Q32 16 36 22', '#adb5bd', 1.2),
        O08: () => p('M6 8 L30 6 L34 32 L10 35 Z', '#5a189a') + p('M10 35 L34 32 L34 35 L10 38 Z', '#f6eedd') + e(20, 20, 6, 4, '#ffd166') + c(20, 20, 2.2, O) + ln('M8 8 L12 35', '#3c096c', 2),
        O09: () => r(17, 26, 6, 12, 2, '#c9a227') + e(20, 16, 12, 14, '#c9a227') + e(20, 16, 8.5, 10.5, '#90e0ef') + lisa('M15 10 Q18 7 22 8 L16 18 Z', '#fff', 0.6),
        O10: () => `<ellipse cx="20" cy="20" rx="19" ry="11" fill="#d9ed92" opacity="0.4"/>` + p('M8 14 Q2 10 5 6 Q9 3 12 8 L28 8 Q31 3 35 6 Q38 10 32 14 Q38 18 35 22 Q31 25 28 20 L12 20 Q9 25 5 22 Q2 18 8 14 Z', '#f4f1bb', 'transform="translate(0 6)"'),
        O11: () => r(10, 12, 20, 26, 4, '#495057') + r(13, 15, 14, 10, 2, '#d8f3dc') + ln('M15 23 Q20 16 25 23', O, 1) + ln('M20 23 L24 17', '#e63946', 1.6) + c(16, 31, 2, '#ef476f') + c(24, 31, 2, '#ffd166') + ln('M26 12 L30 2', O, 2) + c(30, 2, 2, '#80ed99'),
        O12: () => r(3, 12, 34, 22, 4, '#6c757d') + ln('M10 12 L12 6 L28 6 L30 12', O, 2) + c(11, 24, 6, '#343a40') + c(29, 24, 6, '#343a40') + c(11, 24, 2, '#adb5bd') + c(29, 24, 2, '#adb5bd') + r(16, 16, 8, 5, 1, '#f6f1e4') + c(20, 29, 2.4, '#f6f1e4') + ln('M18.6 28.6 L19.4 29.4 M21.4 28.6 L20.6 29.4', O, 0.8),
        O13: () => ln('M20 26 L14 38 M20 26 L26 38', O, 2) + p('M6 20 Q12 4 30 8 Q24 22 6 20 Z', '#ced4da') + ln('M18 14 L26 6', O, 1.6) + c(27, 5, 2.4, '#ef476f') + ln('M30 2 Q34 4 34 8 M33 0 Q38 3 38 9', '#4cc9f0', 1.4),
        O14: () => e(20, 14, 13, 4, '#80ed99') + p('M7 14 Q6 32 20 34 Q34 32 33 14 Z', '#22223b') + e(20, 14, 13, 4, 'none') + ln('M10 34 L8 38 M30 34 L32 38', O, 2) + c(15, 9, 2.4, '#b5e48c') + c(24, 6, 1.8, '#b5e48c'),
        O15: () => [[12, 0], [26, 4]].map(([x, d]) => p(`M${x - 7} ${22 + d} L${x + 7} ${22 + d} L${x + 5} ${34 + d} L${x - 5} ${34 + d} Z`, '#adb5bd') + p(`M${x - 8} ${22 + d} Q${x - 8} ${12 + d} ${x} ${12 + d} Q${x + 8} ${12 + d} ${x + 8} ${22 + d} Z`, '#80ed99', 'opacity="0.8"') + c(x, 10 + d, 2, '#e63946')).join(''),
    };

    // ------------------------------------------------------------------
    // ensamblado
    // ------------------------------------------------------------------
    // posición de la mano libre para dibujar el objeto que trae
    const MANO = {
        C01: [28, 98], C02: [70, 106], C03: [20, 104], C04: [86, 94], C05: [86, 90], C06: [84, 92], C07: [82, 104],
        C08: [24, 102], C09: [84, 98], C10: [80, 100], C11: [92, 86], C12: [22, 100], C13: [22, 96], C14: [26, 100],
        C15: [26, 120], C16: [76, 104], C17: [26, 92], C18: [82, 110], C19: [92, 82], C20: [24, 100],
    };

    function objetoSVG(id, tam) {
        const t = tam || 40;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${t}" height="${t}" aria-hidden="true">${OBJ[id]()}</svg>`;
    }

    function cuerpoPersonaje(persona) {
        const v = variar(persona.aspecto || 1);
        return DIBUJOS[persona.tipo](v, persona);
    }

    // opciones: { mini: true } recorta la cabeza; { objetos: true } dibuja lo que trae
    function personajeSVG(persona, opciones) {
        const op = opciones || {};
        let interior = cuerpoPersonaje(persona);
        if (op.objetos && persona.objetos && persona.objetos.length) {
            const [mx, my] = MANO[persona.tipo];
            persona.objetos.forEach((o, i) => {
                if (o === 'O07') {
                    interior += `<g class="pulgas">${[[40, 70], [80, 64], [70, 110], [44, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#3b2a1a"/>`).join('')}</g>`;
                    return;
                }
                const dx = i === 0 ? 0 : (mx < 60 ? -6 : 6);
                interior += `<g transform="translate(${mx - 12 + dx} ${my - 12 + i * 22}) scale(0.62)">${OBJ[o]()}</g>`;
            });
        }
        const vb = op.mini ? MINI[persona.tipo].slice(0, 2).concat([MINI[persona.tipo][2], MINI[persona.tipo][2]]).join(' ') : '0 0 120 160';
        const titulo = op.titulo ? `<title>${op.titulo}</title>` : '';
        const clase = op.clase ? ` class="${op.clase}"` : '';
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}"${clase} role="img" aria-label="${op.titulo || HA.tipoPorId[persona.tipo].nombre}">${titulo}${interior}</svg>`;
    }

    // ------------------------------------------------------------------
    // Nebu: perra negra con pecho blanco, orejas tiesas y alitas de dragón.
    // Mira a la izquierda. Estados: reposo, ladra, grune, feliz, triste, olfatea
    // ------------------------------------------------------------------
    function nebuSVG(estado) {
        const est = estado || 'reposo';
        const negro = '#26222e';
        const brillo = '#3d3848';
        const L = '#0d0b10';
        const a = (fill, extra) => `fill="${fill}" stroke="${L}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"${extra ? ' ' + extra : ''}`;
        const P = (d, fill, extra) => `<path d="${d}" ${a(fill, extra)}/>`;
        const giro = { reposo: 0, ladra: -10, grune: 10, feliz: -6, triste: 12, olfatea: 16 }[est];
        const colaArriba = est === 'ladra' || est === 'feliz';
        const colaAbajo = est === 'grune' || est === 'triste';
        let s = `<ellipse cx="66" cy="112" rx="40" ry="5" fill="#000" opacity="0.3"/>`;
        // cola
        const cola = colaArriba ? 'M94 92 Q114 80 112 56' : colaAbajo ? 'M94 98 Q110 104 116 112' : 'M94 94 Q114 92 116 74';
        s += `<g class="nebu-cola">${ln(cola, L, 7.5)}${ln(cola, negro, 4.6)}</g>`;
        // ala lejana
        s += P('M70 58 Q66 34 80 20 Q80 30 88 32 Q84 38 90 44 Q80 46 78 56 Z', '#1a1620');
        // cuerpo sentado
        s += P('M48 64 Q40 84 44 106 L60 108 Q66 110 78 108 L100 108 Q108 94 100 78 Q92 62 72 60 Q58 56 48 64 Z', negro);
        s += `<path d="M96 80 Q104 92 98 104" fill="none" stroke="${brillo}" stroke-width="2.4" stroke-linecap="round"/>`;
        // pecho blanco
        s += `<path d="M44 56 Q38 74 46 92 Q52 98 56 90 Q60 72 56 58 Z" fill="#f4f1ee"/>`;
        // patas delanteras
        s += P('M46 86 L44 108 L54 108 L54 88 Z', negro) + P('M56 88 L56 108 L66 108 L64 90 Z', negro);
        s += `<path d="M44 106 Q49 103 54 106 M56 106 Q61 103 66 106" fill="none" stroke="#f4f1ee" stroke-width="2.6" stroke-linecap="round"/>`;
        // arnés
        s += P('M50 64 Q62 70 74 62 L76 68 Q62 78 50 71 Z', '#5c5f6b') + P('M64 74 L72 100 L78 98 L70 72 Z', '#5c5f6b');
        s += `<path d="M52 68 Q62 73 74 66" fill="none" stroke="#9b5de5" stroke-width="1.6"/>`;
        // ala cercana
        s += P('M74 64 Q72 36 90 22 Q90 34 100 34 Q94 42 102 48 Q92 50 90 58 Q82 58 74 64 Z', '#1f1a26');
        s += `<path d="M78 60 Q84 44 90 26 M80 60 Q90 50 100 36 M82 60 Q92 54 101 48" fill="none" stroke="#5a189a" stroke-width="1.4" opacity="0.9"/>`;
        // erizado al gruñir
        if (est === 'grune') s += `<path d="M60 58 L62 52 L66 57 L69 51 L72 57 L76 52 L77 59" fill="none" stroke="${L}" stroke-width="2"/>`;
        // cabeza (gira alrededor del cuello)
        let h = '';
        // orejas de perro: anchas, redondeadas y con la punta doblada hacia delante
        const gacha = est === 'grune' || est === 'triste';
        const orejaIzq = gacha ? 'M50 24 Q38 16 30 20 Q30 28 44 34 Z' : 'M43 25 Q42 15 47 10 L56 9 Q61 15 57 23 Z';
        const orejaDer = gacha ? 'M60 22 Q70 12 76 16 Q76 24 66 30 Z' : 'M56 22 Q57 13 61 10 L68 10 Q71 17 67 25 Z';
        h += P(orejaDer, negro) + `<path d="${orejaDer}" fill="#6d5a6b" transform="translate(1.6 2.6) scale(0.94)" opacity="0.5"/>`;
        h += P('M30 36 Q30 20 48 18 Q66 18 68 34 Q68 50 54 54 L40 54 Q30 50 30 36 Z', negro);
        h += P(orejaIzq, negro) + `<path d="${orejaIzq}" fill="#6d5a6b" transform="translate(2.4 3.4) scale(0.9)" opacity="0.5"/>`;
        if (!gacha) h += P('M68 10 Q65 3 59 4 Q54 6 53 14 Q57 13 61 10 Z', negro) + P('M56 9 Q51 1 43 3 Q35 7 33 17 Q41 16 47 10 Z', negro);
        // hocico
        const abierta = est === 'ladra' || est === 'feliz';
        h += P('M34 36 Q22 36 14 42 Q12 48 18 50 Q28 52 36 50 Z', negro);
        h += `<path d="M18 49 Q26 50 34 49" fill="none" stroke="#f4f1ee" stroke-width="1.6" opacity="0.6"/>`;
        h += `<ellipse cx="14" cy="42" rx="4" ry="3" fill="${L}"/><circle cx="12.6" cy="41" r="1" fill="#fff" opacity="0.7"/>`;
        if (abierta) {
            h += P('M18 50 Q24 64 36 56 L36 50 Z', '#7a1f3d') + `<path d="M22 56 Q26 66 32 58 Z" fill="#ef7a9a" stroke="${L}" stroke-width="1.4"/>`;
        } else if (est === 'grune') {
            h += `<path d="M16 48 L34 48 L34 52 L16 51 Z" fill="#fff" stroke="${L}" stroke-width="1.2"/>` + `<path d="M19 48 L20 51 M23 48 L24 51.4 M27 48 L28 51.6 M31 48 L31.6 51.8" stroke="${L}" stroke-width="0.8"/>`;
        } else {
            h += `<path d="M18 50 Q26 53 34 50" fill="none" stroke="${L}" stroke-width="1.6"/>`;
        }
        // ojo
        if (est === 'feliz') h += `<path d="M38 32 Q42 27 46 32" fill="none" stroke="#f4f1ee" stroke-width="2.2" stroke-linecap="round"/>`;
        else {
            h += `<ellipse cx="42" cy="32" rx="4.4" ry="${est === 'triste' ? 3.4 : 4.6}" fill="#4a2c1a" stroke="${L}" stroke-width="1.4"/><circle cx="41.4" cy="32.4" r="2.2" fill="${L}"/><circle cx="40.6" cy="30.6" r="1.2" fill="#fff"/>`;
            if (est === 'grune') h += `<path d="M36 26 L48 30" stroke="${L}" stroke-width="2.6" stroke-linecap="round"/>`;
            if (est === 'triste') h += `<path d="M36 28 L47 25" stroke="${L}" stroke-width="2" stroke-linecap="round"/>`;
        }
        h += `<path d="M48 22 Q58 22 64 30" fill="none" stroke="${brillo}" stroke-width="2" stroke-linecap="round"/>`;
        s += `<g class="nebu-cabeza" transform="rotate(${giro} 52 54)">${h}</g>`;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124 118" role="img" aria-label="Nebu">${s}</svg>`;
    }

    // ------------------------------------------------------------------
    // Nebu de espaldas, vista desde dentro de la casa y un poco desde arriba.
    // mira: -1 izquierda, 0 al frente, 1 derecha; estado: reposo | ladra | grune
    // ------------------------------------------------------------------
    function nebuEspaldaSVG(mira, estado) {
        const m = mira || 0;
        const est = estado || 'reposo';
        const negro = '#26222e';
        const brillo = '#46405a';
        const L = '#0d0b10';
        const a = (fill, extra) => `fill="${fill}" stroke="${L}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"${extra ? ' ' + extra : ''}`;
        const P = (d, fill, extra) => `<path d="${d}" ${a(fill, extra)}/>`;
        const orejasAtras = est === 'grune';
        let s = `<ellipse cx="80" cy="160" rx="58" ry="10" fill="#000" opacity="0.35"/>`;
        // cola enroscada en el suelo, hacia un lado
        const cola = est === 'ladra' ? 'M104 150 Q138 150 140 120 Q141 104 130 98' : est === 'grune' ? 'M104 154 Q130 160 146 156' : 'M104 152 Q134 156 142 136 Q146 124 136 118';
        s += `<g class="cola">${ln(cola, L, 10)}${ln(cola, negro, 6.6)}</g>`;
        // ala izquierda y derecha (del dibujo), saliendo de los hombros
        const ala = (dir) => {
            const k = dir;
            const d = `M${80 + k * 18} 78 Q${80 + k * 34} 40 ${80 + k * 62} 20 Q${80 + k * 58} 34 ${80 + k * 72} 40 Q${80 + k * 60} 46 ${80 + k * 70} 58 Q${80 + k * 54} 58 ${80 + k * 56} 72 Q${80 + k * 40} 70 ${80 + k * 30} 90 Z`;
            return P(d, '#1d1825') + `<path d="M${80 + k * 22} 80 Q${80 + k * 40} 52 ${80 + k * 60} 24 M${80 + k * 26} 84 Q${80 + k * 48} 60 ${80 + k * 68} 42 M${80 + k * 28} 88 Q${80 + k * 44} 70 ${80 + k * 64} 60" fill="none" stroke="#6a2bb0" stroke-width="1.6" opacity="0.9"/>`;
        };
        s += ala(-1) + ala(1);
        // cuerpo sentado, ancho abajo
        s += P('M50 156 Q40 120 56 96 Q66 80 80 80 Q94 80 104 96 Q120 120 110 156 Z', negro);
        s += `<path d="M58 140 Q56 116 66 100" fill="none" stroke="${brillo}" stroke-width="3" stroke-linecap="round"/><path d="M102 140 Q104 118 96 102" fill="none" stroke="${brillo}" stroke-width="2" stroke-linecap="round" opacity="0.6"/>`;
        // patas traseras asomando
        s += P('M48 150 Q44 158 54 160 L66 160 Q64 152 58 148 Z', negro) + P('M112 150 Q116 158 106 160 L94 160 Q96 152 102 148 Z', negro);
        // arnés: tirantes cruzados en la espalda
        s += P('M58 104 Q80 112 102 104 L104 112 Q80 120 56 112 Z', '#5c5f6b') + P('M76 112 L74 140 L86 140 L84 112 Z', '#5c5f6b');
        s += `<path d="M60 108 Q80 115 100 108 M80 116 L80 138" fill="none" stroke="#9b5de5" stroke-width="1.6"/><rect x="74" y="122" width="12" height="7" rx="2" fill="#adb5bd" stroke="${L}" stroke-width="1.4"/>`;
        // erizado al gruñir
        if (est === 'grune') s += `<path d="M66 96 L68 88 L72 95 L76 86 L80 95 L84 86 L88 95 L92 88 L94 96" fill="none" stroke="${L}" stroke-width="2.4" stroke-linejoin="round"/>`;
        // cabeza: se desplaza y gira hacia donde mira
        const hx = 80 + m * 9;
        const hy = est === 'ladra' ? 50 : est === 'grune' ? 64 : 56;
        let h = '';
        // blanco del cuello que asoma por los lados
        h += `<path d="M${hx - 16} ${hy + 22} Q${hx} ${hy + 30} ${hx + 16} ${hy + 22} L${hx + 12} ${hy + 30} Q${hx} ${hy + 34} ${hx - 12} ${hy + 30} Z" fill="#f4f1ee"/>`;
        // hocico de perfil al girar
        if (m !== 0) h += P(`M${hx + m * 12} ${hy + 6} Q${hx + m * 34} ${hy + 6} ${hx + m * 40} ${hy + 14} Q${hx + m * 36} ${hy + 22} ${hx + m * 14} ${hy + 20} Z`, negro) + `<ellipse cx="${hx + m * 39}" cy="${hy + 12}" rx="3" ry="2.4" fill="${L}"/>`;
        if (m !== 0 && est === 'ladra') h += P(`M${hx + m * 16} ${hy + 20} Q${hx + m * 30} ${hy + 30} ${hx + m * 36} ${hy + 18} Z`, '#7a1f3d');
        if (m !== 0 && est === 'grune') h += `<path d="M${hx + m * 18} ${hy + 18} L${hx + m * 36} ${hy + 17}" stroke="#fff" stroke-width="2.6"/>`;
        h += P(`M${hx - 22} ${hy + 6} Q${hx - 22} ${hy - 14} ${hx} ${hy - 15} Q${hx + 22} ${hy - 14} ${hx + 22} ${hy + 6} Q${hx + 20} ${hy + 24} ${hx} ${hy + 26} Q${hx - 20} ${hy + 24} ${hx - 22} ${hy + 6} Z`, negro);
        h += `<path d="M${hx - 14} ${hy - 8} Q${hx} ${hy - 14} ${hx + 12} ${hy - 8}" fill="none" stroke="${brillo}" stroke-width="2.4" stroke-linecap="round"/>`;
        // orejas de perro: anchas y redondeadas, con la punta caída hacia fuera
        // (pegadas hacia atrás al gruñir)
        const X = (k, dx) => hx + k * dx;
        const oreja = (k) => (orejasAtras
            ? `M${X(k, 10)} ${hy - 10} Q${X(k, 24)} ${hy - 22} ${X(k, 35)} ${hy - 16} Q${X(k, 32)} ${hy - 4} ${X(k, 20)} ${hy - 2} Z`
            : `M${X(k, 5)} ${hy - 12} Q${X(k, 5)} ${hy - 26} ${X(k, 12)} ${hy - 32} L${X(k, 24)} ${hy - 31} Q${X(k, 29)} ${hy - 18} ${X(k, 22)} ${hy - 4} Z`);
        const punta = (k) => `M${X(k, 11)} ${hy - 32} Q${X(k, 20)} ${hy - 42} ${X(k, 30)} ${hy - 36} Q${X(k, 40)} ${hy - 30} ${X(k, 40)} ${hy - 14} Q${X(k, 33)} ${hy - 17} ${X(k, 24)} ${hy - 26} Z`;
        h += P(oreja(-1), negro) + P(oreja(1), negro);
        if (!orejasAtras) {
            for (const k of [-1, 1]) h += `<path d="M${X(k, 9)} ${hy - 14} Q${X(k, 9)} ${hy - 24} ${X(k, 14)} ${hy - 28} L${X(k, 21)} ${hy - 27} Q${X(k, 24)} ${hy - 16} ${X(k, 19)} ${hy - 9} Z" fill="#4a3c4f" opacity="0.6"/>`;
            h += P(punta(-1), negro) + P(punta(1), negro);
        }
        // collar con chapa
        h += `<path d="M${hx - 18} ${hy + 20} Q${hx} ${hy + 30} ${hx + 18} ${hy + 20}" fill="none" stroke="#9b5de5" stroke-width="4" stroke-linecap="round"/>`;
        s += `<g class="cabeza">${h}</g>`;
        if (est === 'ladra') s += `<path d="M${hx + m * 30 - 6} ${hy - 30} l-6 -8 M${hx + m * 30 + 4} ${hy - 34} l2 -10 M${hx + m * 30 + 12} ${hy - 28} l8 -6" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/>`;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 170" role="img" aria-label="Nebu de espaldas">${s}</svg>`;
    }

    // ------------------------------------------------------------------
    // Claudia: bruja con rastas, gafas de sol de los 2000 y tatuajes
    // opciones: { bolsa: 'vacia' | 'scaryfour', gesto: 'normal' | 'contenta' | 'enfadada' | 'sorprendida' }
    // ------------------------------------------------------------------
    function claudiaSVG(opciones) {
        const op = Object.assign({ bolsa: 'vacia', gesto: 'normal' }, opciones);
        const piel = '#f1c9a8';
        const rasta = '#6b4a33';
        const rastaOsc = '#4a3222';
        const tinta = '#2f2a3a';
        let s = `<ellipse cx="80" cy="252" rx="40" ry="6" fill="#000" opacity="0.3"/>`;
        // rastas de detrás
        for (const [x, l] of [[56, 108], [62, 118], [98, 118], [104, 108], [66, 124], [94, 124]]) {
            s += `<path d="M${x} 66 Q${x - 2} ${66 + l / 2} ${x + 1} ${66 + l}" fill="none" stroke="${L2}" stroke-width="9.6" stroke-linecap="round"/><path d="M${x} 66 Q${x - 2} ${66 + l / 2} ${x + 1} ${66 + l}" fill="none" stroke="${rastaOsc}" stroke-width="7" stroke-linecap="round"/>`;
        }
        // piernas y botas
        s += r(66, 200, 11, 40, 3, '#1d1b26') + r(84, 200, 11, 40, 3, '#1d1b26');
        s += p('M62 234 L78 234 L78 248 L58 248 Q56 240 62 234 Z', '#2b2233') + p('M83 234 L99 234 Q105 240 102 248 L83 248 Z', '#2b2233');
        // falda de bruja
        s += p('M54 148 L106 148 L124 206 L114 200 L106 212 L96 200 L86 214 L78 200 L68 212 L58 200 L48 210 L40 200 L36 206 Z', '#1d1b26');
        s += ln('M70 160 L66 196 M92 160 L96 196', '#3c3550', 1.4);
        // top halter verde azulado (como en la foto)
        s += p('M60 104 Q80 98 100 104 L104 152 L56 152 Z', '#1f5f5b');
        s += ln('M66 104 L76 86 M94 104 L84 86', '#1f5f5b', 3.4);
        s += r(55, 146, 50, 8, 2, '#2b2233') + r(76, 146, 8, 8, 1, '#ffd166');
        // brazos con tatuajes
        s += p('M58 104 Q48 106 46 118 L40 166 L50 168 L58 124 Z', piel);
        s += p('M102 104 Q112 106 114 118 L120 166 L110 168 L102 124 Z', piel);
        // hombros: trazos de pincel negros, como en la foto
        s += lisa('M47 112 Q50 100 66 102 Q58 106 57 112 Q55 118 52 124 Q50 116 47 112 Z', tinta, 0.9) + lisa('M113 112 Q110 100 94 102 Q102 106 103 112 Q105 118 108 124 Q110 116 113 112 Z', tinta, 0.9);
        s += ln('M48 108 L43 102 M53 104 L51 96 M58 103 L59 96 M112 108 L117 102 M107 104 L109 96 M102 103 L101 96', tinta, 1.6);
        // brazo izquierdo (del espectador): cabeza de ciervo y manga ornamental
        s += `<g fill="none" stroke="${tinta}" stroke-width="1.4" stroke-linecap="round">` +
            '<path d="M47 128 Q50 125 53 128 Q53 134 50 137 Q47 134 47 128 Z"/>' +
            '<path d="M48 127 L45 120 L43 122 M45 120 L46 117 M52 127 L55 120 L57 122 M55 120 L54 117"/>' +
            '<path d="M44 144 Q49 140 50 146 Q46 150 44 146 M43 152 Q48 148 49 154 Q45 158 43 154 M42 160 Q47 156 48 162"/></g>' +
            `<circle cx="47" cy="149" r="0.9" fill="${tinta}"/><circle cx="46" cy="157" r="0.9" fill="${tinta}"/>`;
        // brazo derecho: rosa y golondrina de tradicional, a color
        s += c(110, 126, 4.6, '#c1121f', 'stroke-width="1.2"') + ln('M108 124 Q111 122 112 126 Q110 129 108 127', '#7a0c14', 1) + lisa('M105 131 Q106 136 111 133 Q109 129 105 131 Z', '#386641') + lisa('M114 130 Q117 134 113 135 Z', '#386641');
        s += p('M108 146 Q114 138 121 141 L117 145 Q121 151 113 151 L111 148 L106 150 Z', '#1d4e89', 'stroke-width="1.2"') + lisa('M110 145 Q114 142 118 144 L115 147 Z', '#ffd166') + lisa('M112 148 L115 148 L114 150 Z', '#c1121f');
        // pulsera turquesa
        s += r(39, 160, 12, 5, 2, '#2ec4b6', 'stroke-width="1.2"') + r(109, 160, 12, 5, 2, '#8d99ae', 'stroke-width="1.2"');
        // manos
        s += c(45, 172, 6, piel) + c(115, 172, 6, piel);
        // bolsa
        if (op.bolsa === 'scaryfour') {
            // botellas de yugo de cebada asomando
            for (const [x, col] of [[26, '#b5651d'], [52, '#8c4a12']]) s += p(`M${x} 182 L${x} 166 Q${x} 160 ${x + 3} 158 L${x + 3} 150 L${x + 7} 150 L${x + 7} 158 Q${x + 10} 160 ${x + 10} 166 L${x + 10} 182 Z`, col) + r(x + 2.4, 147, 5.2, 4, 1, '#ffd166', 'stroke-width="1.2"');
            s += p('M20 176 L66 176 L62 230 L24 230 Z', '#d4a373');
            s += r(25, 186, 36, 16, 4, '#f77f00') + `<text x="43" y="197" font-size="6.4" font-weight="700" text-anchor="middle" textLength="31" lengthAdjust="spacingAndGlyphs" fill="#fff" font-family="Fredoka, sans-serif">SCARYFOUR</text>`;
            s += p('M38 206 Q38 200 43 200 Q48 200 48 206 L48 214 L46 212 L44 214 L42 212 L40 214 L38 212 Z', '#fff', 'stroke-width="1.2"') + `<circle cx="41.4" cy="205" r="0.9" fill="${O}"/><circle cx="44.6" cy="205" r="0.9" fill="${O}"/>`;
            s += c(45, 172, 6, piel);
        } else if (op.bolsa === 'vacia') {
            s += ln('M38 172 Q45 160 52 172', O, 2) + p('M30 176 L60 176 L58 214 L32 214 Z', '#e9e3d5') + c(45, 196, 7, '#f77f00', 'stroke-width="1.4"') + ln('M42 194 L44 192 L46 194 M42 199 Q45 201 48 199', O, 1.2);
            s += c(45, 172, 6, piel);
        }
        // escoba en la otra mano
        s += ln('M118 100 L112 240', O, 6.6) + ln('M118 100 L112 240', '#8d5a3b', 4) + c(115, 172, 6, piel);
        // cuello y cabeza
        s += r(73, 86, 14, 16, 4, piel);
        s += c(80, 70, 21, piel);
        // pendientes: aros y colgante
        s += c(58, 76, 3.4, 'none', 'stroke="#c0c0c0" stroke-width="1.6"') + c(102, 76, 3.4, 'none', 'stroke="#c0c0c0" stroke-width="1.6"') + ln('M102 79 L102 86', '#c0c0c0', 1.4) + p('M100 86 L104 86 L102 92 Z', '#2ec4b6', 'stroke-width="1"');
        s += e(59, 72, 3, 5, piel) + e(101, 72, 3, 5, piel);
        // cejas, ojos (mirada pícara de la foto), pecas
        const gesto = op.gesto;
        const ceja = gesto === 'enfadada' ? 'M66 58 L76 62 M94 58 L84 62' : gesto === 'sorprendida' ? 'M66 56 Q71 52 76 56 M84 56 Q89 52 94 56' : 'M66 60 Q71 56 77 59 M83 59 Q89 56 94 60';
        s += ln(ceja, '#3b2a1a', 3);
        s += `<ellipse cx="71" cy="68" rx="4.2" ry="${gesto === 'contenta' ? 2 : 3.8}" fill="#fff" stroke="${O}" stroke-width="1.4"/><ellipse cx="89" cy="68" rx="4.2" ry="${gesto === 'contenta' ? 2 : 3.8}" fill="#fff" stroke="${O}" stroke-width="1.4"/>`;
        if (gesto !== 'contenta') s += `<circle cx="72" cy="66.6" r="2.3" fill="#5f7f5a"/><circle cx="90" cy="66.6" r="2.3" fill="#5f7f5a"/><circle cx="72" cy="66.6" r="1" fill="${O}"/><circle cx="90" cy="66.6" r="1" fill="${O}"/>`;
        s += [[68, 76], [72, 78], [88, 78], [92, 76], [76, 74], [84, 74]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="0.8" fill="#c08457" opacity="0.8"/>`).join('');
        // nariz con aro en el septum y en la aleta
        s += ln('M80 70 Q78 78 80 80', '#c08457', 1.6);
        s += `<path d="M77.6 81.4 Q80 85 82.4 81.4" fill="none" stroke="#c0c0c0" stroke-width="1.5"/><circle cx="84" cy="78" r="1.2" fill="#c0c0c0"/>`;
        // boca
        const boca = gesto === 'contenta' ? p('M72 86 Q80 96 88 86 Q80 89 72 86 Z', '#7a2e3a') : gesto === 'enfadada' ? ln('M73 90 Q80 86 87 90', '#8a3a3a', 2.4) : gesto === 'sorprendida' ? e(80, 89, 4, 5, '#7a2e3a') : ln('M73 87 Q80 90 88 85', '#a0504a', 2.2);
        s += boca;
        // rastas de delante con cuentas
        for (const [x, l, dir] of [[60, 52, -1], [64, 64, -1], [96, 64, 1], [100, 52, 1]]) {
            const d = `M${x} 52 Q${x + dir * 4} ${52 + l / 2} ${x + dir * 2} ${52 + l}`;
            s += `<path d="${d}" fill="none" stroke="${L2}" stroke-width="9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${rasta}" stroke-width="6.6" stroke-linecap="round"/>`;
            s += `<path d="${d}" fill="none" stroke="${rastaOsc}" stroke-width="6.6" stroke-dasharray="1.4 5" stroke-linecap="butt"/>`;
        }
        s += c(62, 92, 2.4, '#ffd166', 'stroke-width="1"') + c(98, 98, 2.4, '#2ec4b6', 'stroke-width="1"');
        // flequillo de rastas recogidas
        s += p('M58 58 Q60 44 80 42 Q100 44 102 58 Q92 50 80 52 Q68 50 58 58 Z', rasta);
        // sombrero de bruja y gafas de sol de los 2000 sobre el ala
        s += e(80, 46, 44, 8, '#1b1626');
        s += p('M58 44 Q66 26 74 14 Q80 4 96 2 Q86 12 86 22 Q92 32 102 44 Z', '#1b1626');
        s += p('M60 38 Q80 34 100 38 L102 44 Q80 40 58 44 Z', '#1f5f5b');
        s += estrella(70, 30, 4, '#ffd166');
        s += p('M60 44 Q80 38 100 44 L98 52 Q90 56 82 50 L78 50 Q70 56 62 52 Z', '#0d0b10');
        s += lisa('M64 46 Q70 44 76 46 L74 48 Q70 47 65 49 Z', '#7b8cde', 0.6) + lisa('M86 46 Q92 44 97 46 L96 48 Q92 47 87 49 Z', '#7b8cde', 0.6);
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 262" role="img" aria-label="Claudia">${s}</svg>`;
    }
    const L2 = '#2b1d14';

    // ------------------------------------------------------------------
    // luna
    // ------------------------------------------------------------------
    function lunaSVG(fase, tam) {
        const t = tam || 56;
        const R = 24;
        const cx = 28, cy = 28;
        const luz = '#fff3c4';
        const sombraLuna = '#2d2650';
        let s = `<circle cx="${cx}" cy="${cy}" r="${R + 3}" fill="#fff3c4" opacity="${fase === 'nueva' ? 0.06 : 0.16}"/>`;
        s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${sombraLuna}" stroke="#8c86b5" stroke-width="${fase === 'nueva' ? 1.6 : 0.8}" stroke-dasharray="${fase === 'nueva' ? '3 3' : 'none'}"/>`;
        if (fase === 'llena') s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${luz}"/><circle cx="20" cy="22" r="4" fill="#e9dca8"/><circle cx="34" cy="34" r="5.4" fill="#e9dca8"/><circle cx="33" cy="18" r="2.4" fill="#e9dca8"/>`;
        if (fase === 'creciente') s += `<path d="M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx} ${cy + R} A${R * 0.45} ${R} 0 0 0 ${cx} ${cy - R} Z" fill="${luz}"/>`;
        if (fase === 'menguante') s += `<path d="M${cx} ${cy - R} A${R} ${R} 0 0 0 ${cx} ${cy + R} A${R * 0.45} ${R} 0 0 1 ${cx} ${cy - R} Z" fill="${luz}"/>`;
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width="${t}" height="${t}" aria-hidden="true">${s}</svg>`;
    }

    // mancha de huevo para la fachada
    function huevoSVG() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20 6 Q26 10 30 8 Q30 14 36 16 Q32 20 36 26 Q28 26 28 34 Q22 30 18 36 Q16 28 8 30 Q12 24 4 20 Q12 18 10 10 Q16 12 20 6 Z" fill="#fff8e7"/><circle cx="20" cy="20" r="7" fill="#ffb703"/><circle cx="18" cy="18" r="2" fill="#fff" opacity="0.7"/></svg>`;
    }

    HA.arte = { personajeSVG, objetoSVG, nebuSVG, nebuEspaldaSVG, claudiaSVG, lunaSVG, huevoSVG, estrella, MINI, MANO };

    if (typeof module !== 'undefined' && module.exports) module.exports = HA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
