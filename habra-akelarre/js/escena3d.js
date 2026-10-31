// Escena pseudo-3D de la puerta (Canvas 2D con proyección en perspectiva).
//
// La cámara está dentro de la casa, detrás de Nebu y un poco por encima,
// mirando a través del umbral hacia el porche, donde esperan los candidatos.
// Ejes del mundo en metros: x a la derecha, y hacia fuera de la casa, z arriba.
// La cara interior de la pared está en y = −GROSOR y la exterior en y = 0.
//
// Capas: el exterior (cielo, jardín, porche) y el interior (pared, marco,
// puertas, suelo) se pintan una vez en lienzos auxiliares; en cada fotograma
// se componen con lo que se mueve: personajes, sombras de la fiesta, luces,
// partículas y bocadillos.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};

    const GROSOR = 0.28;
    const PUERTA = { x: 1.25, z: 2.35 };
    const ALTO_PERSONA = 1.72;
    const POS_NEBU = [0, -1.02, 0];
    const ALTO_NEBU = 1.0;
    const ESPERA_Y = 1.15;
    const LEJOS_Y = 13;
    const LUNA = [-6.5, 60, 6.9];
    const CALDERO = [1.62, -0.86, 0.3]; // x, y, radio

    // ---------------- vectores ----------------
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
    const lerp = (a, b, t) => a + (b - a) * t;
    const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
    const suave = (t) => t * t * (3 - 2 * t);

    // generador reproducible para la decoración
    function azar(sem) {
        let a = sem >>> 0;
        return () => {
            a = (a + 0x6D2B79F5) | 0;
            let t = Math.imul(a ^ (a >>> 15), 1 | a);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // ---------------- sprites a partir del SVG ----------------
    const cacheSprites = new Map();
    function sprite(clave, svg, ancho, alto) {
        if (cacheSprites.has(clave)) return cacheSprites.get(clave);
        const img = new Image();
        const s = { img, listo: false };
        img.onload = () => { s.listo = true; };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg.replace('<svg ', `<svg width="${ancho}" height="${alto}" `));
        cacheSprites.set(clave, s);
        return s;
    }

    function spritePersona(p, pista) {
        const clave = `${p.tipo}-${p.aspecto}-${p.objetos.join('.')}-${pista ? 1 : 0}`;
        return sprite(clave, HA.arte.personajeSVG(Object.assign({}, p, { pista }), { objetos: true }), 240, 320);
    }

    function spriteNebu(mira, estado) {
        return sprite(`nebu-${mira}-${estado}`, HA.arte.nebuEspaldaSVG(mira, estado), 320, 340);
    }

    // ------------------------------------------------------------------
    function crear(canvas, opciones) {
        const op = Object.assign({ reducido: false }, opciones);
        const ctx = canvas.getContext('2d');
        let W = 0, H = 0, DPR = 1;
        let cam = null;
        let fase = 'llena';
        let exterior = null;
        let interior = null;
        let actores = [];
        let foco = -1;
        let bocadillo = null; // { k, texto, raro }
        let nebu = { mira: 0, estado: 'reposo', salto: 0 };
        let invitados = 5;
        let particulas = [];
        let fuegos = [];
        let brujas = [];
        let manchas = [];
        let huevos = [];
        let temblor = 0;
        let destello = null; // { color, t0, dur }
        let tweens = [];
        let activo = true;
        let ultimo = performance.now();
        let reloj = 0;
        const rngDeco = azar(20261031);
        const estrellas = Array.from({ length: 90 }, () => [rngDeco(), rngDeco(), 0.4 + rngDeco() * 1.2, rngDeco() * 6]);

        // ---------------- cámara ----------------
        function prepararCamara() {
            const C = [0, -3.05, 2.02];
            const T = [0, 2.6, 0.72];
            const f = norm(sub(T, C));
            const r = norm(cross(f, [0, 0, 1]));
            const u = cross(r, f);
            cam = { C, f, r, u, F: 1, ox: 0, oy: 0 };
            const ajuste = [[-1.55, -GROSOR, 0], [1.55, -GROSOR, 0], [-1.55, -GROSOR, 2.62], [1.55, -GROSOR, 2.62], [0, -0.9, 0]];
            let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
            for (const P of ajuste) {
                const v = sub(P, C);
                const x = dot(v, r) / dot(v, f), y = dot(v, u) / dot(v, f);
                x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
            }
            cam.F = Math.min(W * 0.98 / (x1 - x0), H * 1.0 / (y1 - y0));
            cam.ox = W / 2 - cam.F * (x0 + x1) / 2;
            cam.oy = H / 2 + cam.F * (y0 + y1) / 2 + H * 0.01;
        }

        // x, y de pantalla, píxeles por metro a esa distancia, profundidad
        function pr(P) {
            const v = sub(P, cam.C);
            const z = Math.max(0.05, dot(v, cam.f));
            return [cam.ox + cam.F * dot(v, cam.r) / z, cam.oy - cam.F * dot(v, cam.u) / z, cam.F / z, z];
        }

        function camino(c, pts) {
            c.beginPath();
            pts.forEach((P, i) => {
                const [x, y] = pr(P);
                if (i) c.lineTo(x, y); else c.moveTo(x, y);
            });
            c.closePath();
        }

        function relleno(c, pts, color) {
            camino(c, pts);
            c.fillStyle = color;
            c.fill();
        }

        function linea(c, a, b, color, ancho) {
            const [x0, y0] = pr(a), [x1, y1] = pr(b);
            c.beginPath();
            c.moveTo(x0, y0);
            c.lineTo(x1, y1);
            c.strokeStyle = color;
            c.lineWidth = ancho;
            c.stroke();
        }

        function lienzo() {
            const cv = document.createElement('canvas');
            cv.width = W * DPR;
            cv.height = H * DPR;
            const c = cv.getContext('2d');
            c.setTransform(DPR, 0, 0, DPR, 0, 0);
            return [cv, c];
        }

        function recortePuerta(c, yPlano) {
            camino(c, [[-PUERTA.x, yPlano, 0], [PUERTA.x, yPlano, 0], [PUERTA.x, yPlano, PUERTA.z], [-PUERTA.x, yPlano, PUERTA.z]]);
            c.clip();
        }

        // ---------------- exterior (estático) ----------------
        function pintarExterior() {
            const [cv, c] = lienzo();
            c.save();
            recortePuerta(c, 0);
            // cielo
            const hz = pr([0, 80, 0])[1];
            const g = c.createLinearGradient(0, 0, 0, hz);
            g.addColorStop(0, '#0a0620');
            g.addColorStop(0.6, '#22134a');
            g.addColorStop(1, '#4a2a6e');
            c.fillStyle = g;
            c.fillRect(0, 0, W, H);
            // luna
            pintarLuna(c);
            // colinas lejanas
            const rr = azar(7);
            for (const [y, alto, color] of [[70, 4.2, '#2a1846'], [45, 2.8, '#21123a'], [30, 1.8, '#1a0e2e']]) {
                const pts = [[-60, y, 0]];
                for (let x = -60; x <= 60; x += 4) pts.push([x, y, alto * (0.5 + 0.5 * Math.sin(x * 0.11 + y) * Math.cos(x * 0.05)) + rr() * 0.6]);
                pts.push([60, y, 0]);
                relleno(c, pts, color);
            }
            // árboles secos y pinos en silueta
            const ra = azar(11);
            for (let i = 0; i < 26; i++) {
                const x = (ra() - 0.5) * 50, y = 16 + ra() * 14, h = 3 + ra() * 4;
                if (Math.abs(x) < 3) continue;
                relleno(c, [[x - h * 0.22, y, 0], [x + h * 0.22, y, 0], [x, y, h]], '#170b29');
                relleno(c, [[x - h * 0.16, y, h * 0.35], [x + h * 0.16, y, h * 0.35], [x, y, h * 1.12]], '#170b29');
            }
            // niebla en el horizonte
            const gn = c.createLinearGradient(0, hz - H * 0.12, 0, hz + H * 0.05);
            gn.addColorStop(0, 'rgba(120, 90, 170, 0)');
            gn.addColorStop(1, 'rgba(120, 90, 170, 0.28)');
            c.fillStyle = gn;
            c.fillRect(0, hz - H * 0.12, W, H * 0.17);
            // césped
            relleno(c, [[-60, 3.4, 0], [60, 3.4, 0], [60, 80, 0], [-60, 80, 0]], '#1b2a22');
            const gc = c.createLinearGradient(0, pr([0, 3.4, 0])[1], 0, hz);
            gc.addColorStop(0, 'rgba(40, 60, 46, 0.9)');
            gc.addColorStop(1, 'rgba(26, 14, 46, 0.95)');
            camino(c, [[-60, 3.4, 0], [60, 3.4, 0], [60, 80, 0], [-60, 80, 0]]);
            c.fillStyle = gc;
            c.fill();
            // camino de baldosas
            const rp = azar(3);
            for (let y = 3.6; y < 16; y += 0.62) {
                const w = 0.55 + rp() * 0.1;
                const dx = (rp() - 0.5) * 0.12;
                relleno(c, [[dx - w, y, 0], [dx + w, y, 0], [dx + w * 0.95, y + 0.5, 0], [dx - w * 0.95, y + 0.5, 0]], `rgb(${92 + rp() * 20}, ${84 + rp() * 16}, ${108 + rp() * 20})`);
            }
            // lápidas decorativas
            for (const [x, y] of [[-3.2, 6.5], [-4.6, 9.2], [3.6, 7.4], [5.2, 11]]) {
                relleno(c, [[x - 0.32, y, 0], [x + 0.32, y, 0], [x + 0.32, y, 0.6], [x, y, 0.82], [x - 0.32, y, 0.6]], '#6c6782');
                linea(c, [x - 0.12, y - 0.01, 0.5], [x + 0.12, y - 0.01, 0.5], '#45405a', 1.2);
                linea(c, [x, y - 0.01, 0.36], [x, y - 0.01, 0.64], '#45405a', 1.2);
            }
            // valla
            for (let x = -7; x <= 7; x += 0.36) {
                if (Math.abs(x) < 0.8) continue;
                relleno(c, [[x - 0.05, 12, 0], [x + 0.05, 12, 0], [x + 0.05, 12, 0.9], [x, 12, 1.02], [x - 0.05, 12, 0.9]], '#3a2c4e');
            }
            linea(c, [-7, 12, 0.7], [-0.8, 12, 0.7], '#3a2c4e', 2);
            linea(c, [0.8, 12, 0.7], [7, 12, 0.7], '#3a2c4e', 2);
            // farola
            linea(c, [2.6, 9, 0], [2.6, 9, 3.1], '#1e1430', 3);
            const [fx, fy, fs] = pr([2.6, 9, 3.1]);
            const gf = c.createRadialGradient(fx, fy, 0, fx, fy, fs * 1.6);
            gf.addColorStop(0, 'rgba(255, 214, 140, 0.9)');
            gf.addColorStop(0.15, 'rgba(255, 200, 120, 0.45)');
            gf.addColorStop(1, 'rgba(255, 200, 120, 0)');
            c.fillStyle = gf;
            c.fillRect(fx - fs * 2, fy - fs * 2, fs * 4, fs * 4);
            // jirones de niebla sobre el jardín
            const rn = azar(17);
            for (let i = 0; i < 16; i++) {
                const [nx, ny, ns] = pr([(rn() - 0.5) * 16, 4 + rn() * 10, 0.15]);
                const r = ns * (1.2 + rn() * 1.6);
                const gn2 = c.createRadialGradient(nx, ny, 0, nx, ny, r);
                gn2.addColorStop(0, `rgba(170, 150, 210, ${0.1 + rn() * 0.1})`);
                gn2.addColorStop(1, 'rgba(170, 150, 210, 0)');
                c.fillStyle = gn2;
                c.beginPath();
                c.ellipse(nx, ny, r, r * 0.28, 0, 0, Math.PI * 2);
                c.fill();
            }
            // porche de tablones
            relleno(c, [[-3, 0, 0], [3, 0, 0], [3, 2.9, 0], [-3, 2.9, 0]], '#5a3d2e');
            for (let x = -3; x <= 3; x += 0.2) linea(c, [x, 0, 0], [x, 2.9, 0], 'rgba(30, 16, 12, 0.55)', 1);
            relleno(c, [[-3, 2.9, 0], [3, 2.9, 0], [3, 2.9, -0.2], [-3, 2.9, -0.2]], '#3e2a20');
            relleno(c, [[-1.4, 2.9, -0.2], [1.4, 2.9, -0.2], [1.4, 3.3, -0.2], [-1.4, 3.3, -0.2]], '#4c3427');
            // charco de luz de la puerta sobre el porche
            const [lx, ly, ls] = pr([0, 1.4, 0]);
            const gl = c.createRadialGradient(lx, ly, 0, lx, ly, ls * 2.4);
            gl.addColorStop(0, 'rgba(255, 196, 120, 0.42)');
            gl.addColorStop(1, 'rgba(255, 196, 120, 0)');
            c.fillStyle = gl;
            camino(c, [[-3, 0, 0], [3, 0, 0], [3, 3.3, 0], [-3, 3.3, 0]]);
            c.fill();
            // barandilla, pilares y farolillos del porche (hueco central para la escalera)
            for (const k of [-1, 1]) {
                for (let x = 1.32; x <= 3; x += 0.2) relleno(c, [[k * x - 0.025, 2.85, 0], [k * x + 0.025, 2.85, 0], [k * x + 0.025, 2.85, 0.72], [k * x - 0.025, 2.85, 0.72]], '#3b2840');
                relleno(c, [[k * 1.15, 2.85, 0.72], [k * 3, 2.85, 0.72], [k * 3, 2.85, 0.8], [k * 1.15, 2.85, 0.8]], '#4d3654');
                linea(c, [k * 1.15, 2.84, 0.8], [k * 3, 2.84, 0.8], 'rgba(255, 200, 140, 0.25)', 1);
                relleno(c, [[k * 1.15 - 0.11, 2.85, 0], [k * 1.15 + 0.11, 2.85, 0], [k * 1.15 + 0.11, 2.85, 1.0], [k * 1.15 - 0.11, 2.85, 1.0]], '#2c1f33');
                relleno(c, [[k * 1.15 - 0.15, 2.84, 1.0], [k * 1.15 + 0.15, 2.84, 1.0], [k * 1.15 + 0.15, 2.84, 1.07], [k * 1.15 - 0.15, 2.84, 1.07]], '#4d3654');
                linea(c, [k * 1.15 - k * 0.05, 2.84, 0], [k * 1.15 - k * 0.05, 2.84, 1.0], 'rgba(255, 190, 120, 0.3)', 1.2);
                // farolillo sobre el pilar
                const [fx2, fy2, fs2] = pr([k * 1.15, 2.84, 1.16]);
                const gl2 = c.createRadialGradient(fx2, fy2, 0, fx2, fy2, fs2 * 0.9);
                gl2.addColorStop(0, 'rgba(255, 190, 90, 0.7)');
                gl2.addColorStop(0.25, 'rgba(255, 150, 60, 0.25)');
                gl2.addColorStop(1, 'rgba(255, 150, 60, 0)');
                c.fillStyle = gl2;
                c.fillRect(fx2 - fs2, fy2 - fs2, fs2 * 2, fs2 * 2);
                const lw = fs2 * 0.07, lh = fs2 * 0.11;
                c.fillStyle = '#ffcf70';
                c.fillRect(fx2 - lw / 2, fy2 - lh / 2, lw, lh);
                c.strokeStyle = '#1a1220';
                c.lineWidth = Math.max(1, fs2 * 0.012);
                c.strokeRect(fx2 - lw / 2, fy2 - lh / 2, lw, lh);
                c.beginPath();
                c.moveTo(fx2 - lw * 0.7, fy2 - lh / 2); c.lineTo(fx2, fy2 - lh); c.lineTo(fx2 + lw * 0.7, fy2 - lh / 2);
                c.fillStyle = '#1a1220';
                c.fill();
            }
            // calabazas a los lados del porche
            for (const [x, y, r] of [[-1.05, 2.45, 0.22], [1.1, 2.55, 0.26], [1.45, 2.2, 0.16]]) calabaza(c, x, y, r);
            c.restore();
            exterior = cv;
        }

        function pintarLuna(c) {
            const [mx, my, ms] = pr(LUNA);
            const R = Math.max(9, ms * 2.4);
            const gl = c.createRadialGradient(mx, my, R * 0.6, mx, my, R * 3.2);
            gl.addColorStop(0, `rgba(255, 243, 196, ${fase === 'nueva' ? 0.05 : 0.22})`);
            gl.addColorStop(1, 'rgba(255, 243, 196, 0)');
            c.fillStyle = gl;
            c.fillRect(mx - R * 3.2, my - R * 3.2, R * 6.4, R * 6.4);
            c.beginPath();
            c.arc(mx, my, R, 0, Math.PI * 2);
            c.fillStyle = '#2d2650';
            c.fill();
            c.strokeStyle = 'rgba(200, 190, 240, 0.35)';
            c.lineWidth = 1;
            c.stroke();
            c.fillStyle = '#fff3c4';
            if (fase === 'llena') {
                c.beginPath(); c.arc(mx, my, R, 0, Math.PI * 2); c.fill();
                c.fillStyle = '#e9dca8';
                for (const [dx, dy, rr] of [[-0.3, -0.2, 0.18], [0.25, 0.25, 0.24], [0.2, -0.35, 0.1]]) { c.beginPath(); c.arc(mx + dx * R, my + dy * R, rr * R, 0, Math.PI * 2); c.fill(); }
            } else if (fase === 'creciente' || fase === 'menguante') {
                const s = fase === 'creciente' ? 1 : -1;
                c.beginPath();
                c.arc(mx, my, R, -Math.PI / 2, Math.PI / 2, s < 0);
                c.ellipse(mx, my, R * 0.45, R, 0, Math.PI / 2, -Math.PI / 2, s > 0);
                c.fill();
            }
        }

        function calabaza(c, x, y, r) {
            const [px, py, ps] = pr([x, y, r * 0.9]);
            const rx = ps * r * 1.25, ry = ps * r * 0.95;
            const g = c.createRadialGradient(px, py, 0, px, py, rx * 2.6);
            g.addColorStop(0, 'rgba(255, 170, 60, 0.35)');
            g.addColorStop(1, 'rgba(255, 170, 60, 0)');
            c.fillStyle = g;
            c.fillRect(px - rx * 3, py - ry * 3, rx * 6, ry * 6);
            c.beginPath();
            c.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2);
            c.fillStyle = '#e8700c';
            c.fill();
            c.strokeStyle = '#7a3405';
            c.lineWidth = Math.max(1, rx * 0.06);
            c.stroke();
            c.beginPath();
            c.ellipse(px, py, rx * 0.45, ry, 0, 0, Math.PI * 2);
            c.stroke();
            c.fillStyle = '#ffd23f';
            c.beginPath();
            c.moveTo(px - rx * 0.5, py - ry * 0.15); c.lineTo(px - rx * 0.28, py - ry * 0.45); c.lineTo(px - rx * 0.08, py - ry * 0.15);
            c.moveTo(px + rx * 0.08, py - ry * 0.15); c.lineTo(px + rx * 0.28, py - ry * 0.45); c.lineTo(px + rx * 0.5, py - ry * 0.15);
            c.fill();
            c.beginPath();
            c.moveTo(px - rx * 0.5, py + ry * 0.2);
            c.quadraticCurveTo(px, py + ry * 0.75, px + rx * 0.5, py + ry * 0.2);
            c.quadraticCurveTo(px, py + ry * 0.4, px - rx * 0.5, py + ry * 0.2);
            c.fill();
            c.fillStyle = '#3a5a40';
            c.fillRect(px - rx * 0.08, py - ry * 1.2, rx * 0.16, ry * 0.3);
        }

        // escoba de Claudia apoyada en la hoja izquierda
        function pintarEscoba(c) {
            const pie = [-1.1, -0.72, 0.04], tope = [-1.34, -0.62, 1.8];
            const punto = (t) => pr([lerp(pie[0], tope[0], t), lerp(pie[1], tope[1], t), lerp(pie[2], tope[2], t)]);
            const [ax, ay, as] = punto(0.2), [bx, by] = punto(1);
            c.lineCap = 'round';
            for (const [col, w, dx] of [['#2a160a', 0.06, 0], ['#9a6a3e', 0.04, 0], ['rgba(255, 225, 180, 0.35)', 0.012, -1]]) {
                c.beginPath();
                c.moveTo(ax + dx, ay);
                c.lineTo(bx + dx, by);
                c.strokeStyle = col;
                c.lineWidth = Math.max(1, as * w);
                c.stroke();
            }
            // cerdas en abanico hasta el suelo
            const [px, py, ps] = pr([pie[0], pie[1], 0]);
            const ancho = ps * 0.2;
            const g = c.createLinearGradient(ax, ay, px, py);
            g.addColorStop(0, '#d9a441');
            g.addColorStop(1, '#a8741f');
            c.beginPath();
            c.moveTo(ax - ancho * 0.25, ay);
            c.quadraticCurveTo(px - ancho * 1.1, py - ps * 0.12, px - ancho, py);
            c.quadraticCurveTo(px, py + ps * 0.03, px + ancho, py);
            c.quadraticCurveTo(px + ancho * 1.1, py - ps * 0.12, ax + ancho * 0.25, ay);
            c.closePath();
            c.fillStyle = g;
            c.fill();
            c.strokeStyle = '#5c3a10';
            c.lineWidth = 1.2;
            c.stroke();
            c.lineWidth = 0.8;
            c.strokeStyle = 'rgba(90, 55, 10, 0.55)';
            for (let i = -4; i <= 4; i++) {
                c.beginPath();
                c.moveTo(ax + i * ancho * 0.05, ay + 2);
                c.quadraticCurveTo(px + i * ancho * 0.18, py - ps * 0.1, px + i * ancho * 0.22, py - 1);
                c.stroke();
            }
            // lazo morado
            c.beginPath();
            c.ellipse(ax, ay + 1, ancho * 0.32, ps * 0.025, 0, 0, Math.PI * 2);
            c.fillStyle = '#7b2cbf';
            c.fill();
            c.lineCap = 'butt';
        }

        // caldero de hierro con poción verde (las burbujas y el vapor, en cada fotograma)
        // en pantallas estrechas se acerca al centro para que no quede cortado
        // (la x de pantalla es lineal en la x del mundo a profundidad fija)
        function geoCaldero() {
            const [, y, R] = CALDERO;
            const prof = pr([0, y, R * 0.95])[3];
            const x = Math.min(CALDERO[0], ((W * 0.84 - cam.ox) * prof) / cam.F);
            const [cx, cy, cs] = pr([x, y, R * 0.95]);
            const rx = cs * R * 1.08, ry = cs * R * 0.9;
            return { x, cx, cy, cs, rx, ry, bocaY: cy - ry * 0.68, bocaX: rx * 0.8, bocaR: rx * 0.24 };
        }

        function pintarCaldero(c) {
            const y = CALDERO[1];
            const { x, cx, cy, cs, rx, ry, bocaY, bocaX, bocaR } = geoCaldero();
            const [sx, sy] = pr([x, y, 0]);
            // resplandor verde y sombra en el suelo
            const gg = c.createRadialGradient(sx, sy, 0, sx, sy, cs * 0.95);
            gg.addColorStop(0, 'rgba(130, 255, 120, 0.3)');
            gg.addColorStop(1, 'rgba(130, 255, 120, 0)');
            c.fillStyle = gg;
            c.beginPath();
            c.ellipse(sx, sy, cs * 0.95, cs * 0.42, 0, 0, Math.PI * 2);
            c.fill();
            c.fillStyle = 'rgba(0, 0, 0, 0.5)';
            c.beginPath();
            c.ellipse(sx, sy, rx * 1.05, rx * 0.32, 0, 0, Math.PI * 2);
            c.fill();
            // patas
            for (const d of [-0.62, 0.62]) {
                c.beginPath();
                c.moveTo(cx + d * rx - rx * 0.1, cy + ry * 0.6);
                c.lineTo(cx + d * rx * 1.12 - rx * 0.06, sy + 1);
                c.lineTo(cx + d * rx * 1.12 + rx * 0.08, sy + 1);
                c.lineTo(cx + d * rx + rx * 0.1, cy + ry * 0.6);
                c.fillStyle = '#121016';
                c.fill();
            }
            // cuerpo panzudo
            const gc = c.createRadialGradient(cx - rx * 0.38, cy - ry * 0.3, rx * 0.05, cx, cy, rx * 1.1);
            gc.addColorStop(0, '#6a6280');
            gc.addColorStop(0.35, '#2c2636');
            gc.addColorStop(1, '#09070c');
            c.beginPath();
            c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
            c.fillStyle = gc;
            c.fill();
            c.strokeStyle = '#050407';
            c.lineWidth = 1.5;
            c.stroke();
            // reflejo verde de la poción en la panza
            c.beginPath();
            c.ellipse(cx + rx * 0.35, cy - ry * 0.05, rx * 0.35, ry * 0.55, 0, -1.2, 1.2);
            c.strokeStyle = 'rgba(140, 255, 140, 0.25)';
            c.lineWidth = Math.max(1.5, rx * 0.06);
            c.stroke();
            // boca: borde grueso y poción
            c.beginPath();
            c.ellipse(cx, bocaY, bocaX * 1.08, bocaR * 1.25, 0, 0, Math.PI * 2);
            c.fillStyle = '#3a3346';
            c.fill();
            c.strokeStyle = '#7d7494';
            c.lineWidth = Math.max(1, rx * 0.04);
            c.stroke();
            const gp = c.createRadialGradient(cx - bocaX * 0.2, bocaY, 0, cx, bocaY, bocaX);
            gp.addColorStop(0, '#e4ffa0');
            gp.addColorStop(0.45, '#6be05a');
            gp.addColorStop(1, '#1f7a34');
            c.beginPath();
            c.ellipse(cx, bocaY + bocaR * 0.1, bocaX * 0.9, bocaR * 0.95, 0, 0, Math.PI * 2);
            c.fillStyle = gp;
            c.fill();
            // caramelos desperdigados
            const rc = azar(23);
            for (const [dx, dy] of [[-0.42, 0.18], [-0.3, -0.22], [0.45, -0.15], [-0.52, -0.02]]) {
                const [qx, qy, qs] = pr([x + dx, y + dy, 0.02]);
                const r = qs * 0.035;
                c.fillStyle = ['#ef476f', '#ffd166', '#4cc9f0', '#b5179e'][Math.floor(rc() * 4)];
                c.beginPath();
                c.moveTo(qx - r * 2.4, qy - r * 0.8); c.lineTo(qx - r, qy); c.lineTo(qx - r * 2.4, qy + r * 0.8); c.closePath();
                c.moveTo(qx + r * 2.4, qy - r * 0.8); c.lineTo(qx + r, qy); c.lineTo(qx + r * 2.4, qy + r * 0.8); c.closePath();
                c.fill();
                c.beginPath();
                c.ellipse(qx, qy, r * 1.2, r * 0.9, 0, 0, Math.PI * 2);
                c.fill();
                c.fillStyle = 'rgba(255, 255, 255, 0.5)';
                c.beginPath();
                c.arc(qx - r * 0.4, qy - r * 0.3, r * 0.35, 0, Math.PI * 2);
                c.fill();
            }
        }

        // burbujas que revientan y vapor verde que sube del caldero
        function dibujarCaldero(c) {
            const { cx, rx, bocaY, bocaX, bocaR } = geoCaldero();
            const g = c.createRadialGradient(cx, bocaY, 0, cx, bocaY, bocaX * 2.2);
            g.addColorStop(0, `rgba(150, 255, 130, ${0.16 + 0.06 * Math.sin(reloj * 3)})`);
            g.addColorStop(1, 'rgba(150, 255, 130, 0)');
            c.fillStyle = g;
            c.fillRect(cx - bocaX * 2.2, bocaY - bocaX * 2.2, bocaX * 4.4, bocaX * 4.4);
            for (let i = 0; i < 5; i++) {
                const t = (reloj * 0.7 + i * 0.37) % 1;
                const bx = cx + Math.sin(i * 2.3) * bocaX * 0.6;
                const by = bocaY + Math.cos(i * 1.7) * bocaR * 0.45;
                c.beginPath();
                c.arc(bx, by, rx * 0.07 * Math.sin(t * Math.PI), 0, Math.PI * 2);
                c.fillStyle = 'rgba(220, 255, 180, 0.85)';
                c.fill();
            }
            for (let i = 0; i < 3; i++) {
                const t = (reloj * 0.25 + i / 3) % 1;
                const vx = cx + Math.sin(reloj * 1.3 + i * 2) * rx * 0.25 + (i - 1) * bocaX * 0.4;
                const vy = bocaY - t * rx * 2.6;
                const r = rx * (0.18 + t * 0.35);
                const gv = c.createRadialGradient(vx, vy, 0, vx, vy, r);
                gv.addColorStop(0, `rgba(170, 255, 160, ${0.22 * (1 - t)})`);
                gv.addColorStop(1, 'rgba(170, 255, 160, 0)');
                c.fillStyle = gv;
                c.fillRect(vx - r, vy - r, r * 2, r * 2);
            }
        }

        // ---------------- interior (estático, con el hueco de la puerta) ----------------
        function pintarInterior() {
            const [cv, c] = lienzo();
            const y = -GROSOR;
            // suelo de madera
            const suelo = [[-7, -2.7, 0], [7, -2.7, 0], [7, y, 0], [-7, y, 0]];
            relleno(c, suelo, '#4a2f22');
            const rs = azar(5);
            for (let x = -7; x <= 7; x += 0.17) {
                const t = rs();
                relleno(c, [[x, -2.7, 0], [x + 0.17, -2.7, 0], [x + 0.17, y, 0], [x, y, 0]], `rgb(${66 + t * 22}, ${40 + t * 14}, ${28 + t * 9})`);
            }
            for (let x = -7; x <= 7; x += 0.17) {
                linea(c, [x, -2.7, 0], [x, y, 0], 'rgba(20, 10, 6, 0.6)', 1.1);
                const corte = -2.7 + rs() * 2.4;
                linea(c, [x, corte, 0], [x + 0.17, corte, 0], 'rgba(20, 10, 6, 0.5)', 1);
            }
            // brillo cálido de la fiesta que viene de detrás
            const [bx, by] = pr([0, -1.6, 0]);
            const gb = c.createRadialGradient(bx, by, 0, bx, by, W * 0.7);
            gb.addColorStop(0, 'rgba(255, 170, 90, 0.28)');
            gb.addColorStop(1, 'rgba(255, 170, 90, 0)');
            camino(c, suelo);
            c.fillStyle = gb;
            c.fill();
            // umbral de piedra
            relleno(c, [[-PUERTA.x, y, 0.02], [PUERTA.x, y, 0.02], [PUERTA.x, 0, 0.02], [-PUERTA.x, 0, 0.02]], '#8a7f96');
            linea(c, [-PUERTA.x, y, 0.02], [PUERTA.x, y, 0.02], '#b3a9c2', 1.4);
            for (const x of [-0.42, 0.46]) linea(c, [x, y, 0.021], [x, 0, 0.021], 'rgba(40, 30, 50, 0.6)', 1.2);
            linea(c, [-PUERTA.x, -0.01, 0.021], [PUERTA.x, -0.01, 0.021], 'rgba(30, 20, 40, 0.7)', 2);
            // felpudo
            const fel = [[-0.62, -0.95, 0.01], [0.62, -0.95, 0.01], [0.62, y - 0.04, 0.01], [-0.62, y - 0.04, 0.01]];
            relleno(c, fel, '#8a5a2b');
            camino(c, [[-0.55, -0.9, 0.012], [0.55, -0.9, 0.012], [0.55, y - 0.09, 0.012], [-0.55, y - 0.09, 0.012]]);
            c.strokeStyle = '#5a3818';
            c.lineWidth = 2;
            c.stroke();
            const [tx, ty, ts] = pr([0, -0.62, 0.01]);
            c.save();
            c.translate(tx, ty);
            c.scale(1, 0.55);
            c.fillStyle = '#3b230e';
            c.font = `700 ${Math.max(8, ts * 0.13)}px Fredoka, system-ui, sans-serif`;
            c.textAlign = 'center';
            c.fillText('BIENVENIDOS (O NO)', 0, 0);
            c.restore();

            // pared interior alrededor del hueco
            c.save();
            camino(c, [[-8, y, -0.5], [8, y, -0.5], [8, y, 5], [-8, y, 5]]);
            const [a0x, a0y] = pr([-PUERTA.x, y, 0]);
            const [a1x, a1y] = pr([PUERTA.x, y, PUERTA.z]);
            c.rect(a0x, a1y, a1x - a0x, a0y - a1y);
            c.fillStyle = '#3a2142';
            c.fill('evenodd');
            c.clip('evenodd');
            // papel pintado: rayas y motivo de murciélagos
            for (let x = -8; x <= 8; x += 0.3) linea(c, [x, y, 1.05], [x, y, 5], 'rgba(120, 70, 140, 0.35)', 1.4);
            const rm = azar(9);
            c.fillStyle = 'rgba(160, 110, 190, 0.22)';
            for (let i = 0; i < 70; i++) {
                const x = -7 + rm() * 14, z = 1.2 + rm() * 3.4;
                if (Math.abs(x) < PUERTA.x + 0.3 && z < PUERTA.z + 0.3) continue;
                const [px, py, ps] = pr([x, y, z]);
                const s = ps * 0.07;
                c.beginPath();
                c.moveTo(px - s * 2, py); c.quadraticCurveTo(px - s, py - s * 0.8, px, py + s * 0.2); c.quadraticCurveTo(px + s, py - s * 0.8, px + s * 2, py);
                c.quadraticCurveTo(px + s, py + s * 0.5, px, py + s * 0.8); c.quadraticCurveTo(px - s, py + s * 0.5, px - s * 2, py);
                c.fill();
            }
            // zócalo de madera
            relleno(c, [[-8, y, 0], [8, y, 0], [8, y, 1.0], [-8, y, 1.0]], '#2b1a2a');
            for (let x = -7.6; x < 8; x += 0.9) {
                camino(c, [[x, y, 0.15], [x + 0.7, y, 0.15], [x + 0.7, y, 0.85], [x, y, 0.85]]);
                c.strokeStyle = 'rgba(255, 200, 150, 0.12)';
                c.lineWidth = 1.4;
                c.stroke();
            }
            linea(c, [-8, y, 1.0], [8, y, 1.0], '#5c3a4e', 3);
            // luz cálida de la fiesta sobre la pared
            const [wx, wy] = pr([0, y, 1.2]);
            const gw = c.createRadialGradient(wx, wy, 0, wx, wy, W * 0.75);
            gw.addColorStop(0, 'rgba(255, 160, 90, 0.2)');
            gw.addColorStop(1, 'rgba(255, 160, 90, 0)');
            c.fillStyle = gw;
            c.fillRect(0, 0, W, H);
            c.restore();

            // jambas y dintel (grosor de la pared)
            relleno(c, [[-PUERTA.x, y, 0], [-PUERTA.x, 0, 0], [-PUERTA.x, 0, PUERTA.z], [-PUERTA.x, y, PUERTA.z]], '#2a1720');
            relleno(c, [[PUERTA.x, y, 0], [PUERTA.x, 0, 0], [PUERTA.x, 0, PUERTA.z], [PUERTA.x, y, PUERTA.z]], '#2a1720');
            relleno(c, [[-PUERTA.x, y, PUERTA.z], [PUERTA.x, y, PUERTA.z], [PUERTA.x, 0, PUERTA.z], [-PUERTA.x, 0, PUERTA.z]], '#1f1018');
            // moldura del marco
            const m = 0.13;
            for (const pts of [
                [[-PUERTA.x - m, y - 0.01, 0], [-PUERTA.x, y - 0.01, 0], [-PUERTA.x, y - 0.01, PUERTA.z], [-PUERTA.x - m, y - 0.01, PUERTA.z + m]],
                [[PUERTA.x, y - 0.01, 0], [PUERTA.x + m, y - 0.01, 0], [PUERTA.x + m, y - 0.01, PUERTA.z + m], [PUERTA.x, y - 0.01, PUERTA.z]],
                [[-PUERTA.x - m, y - 0.01, PUERTA.z + m], [-PUERTA.x, y - 0.01, PUERTA.z], [PUERTA.x, y - 0.01, PUERTA.z], [PUERTA.x + m, y - 0.01, PUERTA.z + m]],
            ]) {
                relleno(c, pts, '#6b3e26');
                camino(c, pts);
                c.strokeStyle = '#2e170c';
                c.lineWidth = 1.2;
                c.stroke();
            }
            linea(c, [-PUERTA.x - m * 0.5, y - 0.012, 0], [-PUERTA.x - m * 0.5, y - 0.012, PUERTA.z + m * 0.5], 'rgba(255, 210, 160, 0.25)', 1.5);
            linea(c, [PUERTA.x + m * 0.5, y - 0.012, 0], [PUERTA.x + m * 0.5, y - 0.012, PUERTA.z + m * 0.5], 'rgba(255, 210, 160, 0.25)', 1.5);
            // hojas de la puerta abiertas hacia dentro: tablas con vetas, paneles en
            // relieve (el de arriba en arco), bisagras de hierro y pomo de latón
            for (const k of [-1, 1]) {
                // bisagra en el borde del hueco; la hoja gira 100° hacia dentro
                const hx = k * PUERTA.x;
                const ang = (100 * Math.PI) / 180;
                const fin = [hx - k * PUERTA.x * Math.cos(ang), y - PUERTA.x * Math.sin(ang)];
                const P = (t, z) => [lerp(hx, fin[0], t), lerp(y, fin[1], t), z];
                const zA = 0.02, zB = PUERTA.z - 0.02;
                // canto de la hoja (grosor)
                const n = [k * Math.sin(ang) * 0.07, -Math.cos(ang) * 0.07];
                const canto = [P(1, zA), [fin[0] + n[0], fin[1] + n[1], zA], [fin[0] + n[0], fin[1] + n[1], zB], P(1, zB)];
                relleno(c, canto, '#3a1e10');
                camino(c, canto);
                c.strokeStyle = '#1c0d06';
                c.lineWidth = 1.4;
                c.stroke();
                const hoja = [P(0, zA), P(1, zA), P(1, zB), P(0, zB)];
                const [gx0, gy0] = pr(P(0, 1.2)), [gx1, gy1] = pr(P(1, 1.2));
                const gm = c.createLinearGradient(gx0, gy0, gx1, gy1);
                gm.addColorStop(0, '#3a1d12');
                gm.addColorStop(0.5, '#6a3820');
                gm.addColorStop(1, '#8e5534');
                relleno(c, hoja, gm);
                // tablas y vetas
                c.save();
                camino(c, hoja);
                c.clip();
                for (let i = 1; i < 6; i++) linea(c, P(i / 6, zA), P(i / 6, zB), 'rgba(26, 10, 4, 0.55)', 1.3);
                const rv = azar(k > 0 ? 31 : 37);
                for (let i = 0; i < 34; i++) {
                    const t = rv(), z0 = zA + rv() * (zB - zA), largo = 0.25 + rv() * 0.6;
                    const [ax, ay] = pr(P(t, z0)), [bx, by] = pr(P(t, z0 + largo));
                    c.beginPath();
                    c.moveTo(ax, ay);
                    c.quadraticCurveTo(ax + (rv() - 0.5) * 5, (ay + by) / 2, bx, by);
                    c.strokeStyle = rv() < 0.5 ? 'rgba(255, 200, 150, 0.09)' : 'rgba(20, 8, 4, 0.28)';
                    c.lineWidth = 1;
                    c.stroke();
                }
                c.restore();
                // paneles en relieve
                const panel = (t0, t1, z0, z1, arco) => {
                    const pts = [P(t0, z0), P(t1, z0)];
                    if (!arco) return pts.concat([P(t1, z1), P(t0, z1)]);
                    const zh = z1 - 0.3;
                    pts.push(P(t1, zh));
                    for (let i = 1; i < 14; i++) pts.push(P(lerp(t1, t0, i / 14), zh + 0.3 * Math.pow(Math.sin((Math.PI * i) / 14), 0.7)));
                    pts.push(P(t0, zh));
                    return pts;
                };
                for (const [z0, z1, arco] of [[0.24, 1.0, false], [1.2, 2.14, true]]) {
                    const fuera = panel(0.15, 0.85, z0, z1, arco);
                    relleno(c, fuera, 'rgba(22, 8, 3, 0.32)');
                    camino(c, fuera);
                    c.strokeStyle = 'rgba(16, 6, 2, 0.85)';
                    c.lineWidth = 1.6;
                    c.stroke();
                    const dentro = panel(0.22, 0.78, z0 + 0.08, z1 - 0.08, arco);
                    relleno(c, dentro, 'rgba(255, 190, 130, 0.08)');
                    c.save();
                    c.translate(0, 1.6);
                    camino(c, dentro);
                    c.strokeStyle = 'rgba(16, 6, 2, 0.6)';
                    c.lineWidth = 1.6;
                    c.stroke();
                    c.restore();
                    camino(c, dentro);
                    c.strokeStyle = 'rgba(255, 210, 160, 0.22)';
                    c.lineWidth = 1.1;
                    c.stroke();
                }
                // bisagras de hierro con remaches
                for (const zc of [0.55, 1.9]) {
                    const tira = [P(0, zc - 0.035), P(0.26, zc - 0.03), P(0.31, zc), P(0.26, zc + 0.03), P(0, zc + 0.035)];
                    relleno(c, tira, '#2a2530');
                    camino(c, tira);
                    c.strokeStyle = '#0d0b10';
                    c.lineWidth = 1;
                    c.stroke();
                    linea(c, P(0.02, zc + 0.022), P(0.25, zc + 0.018), 'rgba(210, 200, 240, 0.3)', 1);
                    for (const t of [0.06, 0.14, 0.22]) {
                        const [rx, ry, rs2] = pr(P(t, zc));
                        c.beginPath();
                        c.arc(rx, ry, Math.max(1.1, rs2 * 0.011), 0, Math.PI * 2);
                        c.fillStyle = '#8a82a0';
                        c.fill();
                    }
                }
                // bocallave y pomo de latón
                const [kx, ky, ks] = pr(P(0.88, 1.04));
                const kr = Math.max(2.2, ks * 0.04);
                c.beginPath();
                c.ellipse(kx, ky + kr * 1.5, kr * 0.85, kr * 2.9, 0, 0, Math.PI * 2);
                c.fillStyle = '#8a5f1c';
                c.fill();
                c.strokeStyle = '#3a2408';
                c.lineWidth = 1;
                c.stroke();
                c.fillStyle = '#140a04';
                c.beginPath();
                c.arc(kx, ky + kr * 2.6, kr * 0.26, 0, Math.PI * 2);
                c.fill();
                c.fillRect(kx - kr * 0.11, ky + kr * 2.6, kr * 0.22, kr * 0.75);
                const gk = c.createRadialGradient(kx - kr * 0.35, ky - kr * 0.35, kr * 0.1, kx, ky, kr);
                gk.addColorStop(0, '#fff4c4');
                gk.addColorStop(0.4, '#e2aa3c');
                gk.addColorStop(1, '#6b4310');
                c.beginPath();
                c.arc(kx, ky, kr, 0, Math.PI * 2);
                c.fillStyle = gk;
                c.fill();
                c.strokeStyle = '#3a2408';
                c.stroke();
            }
            pintarEscoba(c);
            pintarCaldero(c);
            // telarañas en las esquinas del dintel
            for (const k of [-1, 1]) {
                const o = [k * (PUERTA.x + 0.13), y - 0.02, PUERTA.z + 0.13];
                c.strokeStyle = 'rgba(220, 210, 240, 0.4)';
                c.lineWidth = 0.9;
                for (let i = 0; i < 5; i++) {
                    const ang = (i / 4) * (Math.PI / 2);
                    linea(c, o, [o[0] - k * Math.cos(ang) * 0.5, y - 0.02, o[2] - Math.sin(ang) * 0.5], 'rgba(220, 210, 240, 0.4)', 0.9);
                }
                for (const rr of [0.15, 0.3, 0.45]) {
                    const pts = [];
                    for (let i = 0; i <= 4; i++) {
                        const ang = (i / 4) * (Math.PI / 2);
                        pts.push(pr([o[0] - k * Math.cos(ang) * rr, y - 0.02, o[2] - Math.sin(ang) * rr]));
                    }
                    c.beginPath();
                    pts.forEach(([px, py], i) => (i ? c.quadraticCurveTo((pts[i - 1][0] + px) / 2 + 2, (pts[i - 1][1] + py) / 2 + 2, px, py) : c.moveTo(px, py)));
                    c.stroke();
                }
            }
            interior = cv;
        }

        // ---------------- actores ----------------
        function posicionesEspera(n, grupo) {
            const xs = [-0.82, 0, 0.82];
            if (grupo === 1) return xs.map((x) => [[x, ESPERA_Y]]);
            return xs.map((x) => [[x - 0.2, ESPERA_Y - 0.15], [x + 0.2, ESPERA_Y + 0.25]]);
        }

        function ponerCandidatos(grupos) {
            actores = [];
            const pos = posicionesEspera(grupos.length, grupos[0].length);
            const promesas = [];
            grupos.forEach((g, k) => {
                g.forEach((p, i) => {
                    const [x, y] = pos[k][i];
                    const a = {
                        p, k, x: x + (k - 1) * 1.6, y: LEJOS_Y + k * 0.9 + i * 0.5, flip: false, alfa: 1, alto: g.length > 1 ? ALTO_PERSONA * 0.9 : ALTO_PERSONA,
                        paso: 0, sprite: spritePersona(p, false), spritePista: p.pista ? spritePersona(p, true) : null, fase: Math.random() * 6,
                    };
                    actores.push(a);
                    promesas.push(mover(a, { x, y }, op.reducido ? 1 : 1700 + k * 260 + i * 120, true));
                });
            });
            foco = -1;
            bocadillo = null;
            return Promise.all(promesas);
        }

        function mover(a, destino, dur, caminando) {
            return new Promise((ok) => {
                const ini = { x: a.x, y: a.y, alfa: a.alfa };
                tweens.push({ a, ini, fin: Object.assign({}, ini, destino), t0: reloj, dur: dur / 1000, caminando, ok });
            });
        }

        function elegir(k) {
            const promesas = [];
            foco = -1;
            bocadillo = null;
            nebu.mira = [-1, 0, 1][k];
            nebu.estado = 'ladra';
            nebu.salto = reloj;
            for (const a of actores) {
                if (a.k === k) {
                    // entra: pasa junto a Nebu y sale por debajo del encuadre
                    const lado = a.x >= 0 ? 0.62 : -0.62;
                    promesas.push(mover(a, { x: lado, y: 0.4 }, op.reducido ? 1 : 900, true).then(() => mover(a, { x: lado * 1.35, y: -1.9, alfa: 0 }, op.reducido ? 1 : 900, true)));
                } else {
                    a.flip = true;
                    promesas.push(esperarMs(380).then(() => mover(a, { x: a.x * 1.6 + (a.x >= 0 ? 0.8 : -0.8), y: LEJOS_Y, alfa: 0.2 }, op.reducido ? 1 : 1900, true)));
                }
            }
            return Promise.all(promesas).then(() => {
                actores = [];
                nebu.estado = 'reposo';
            });
        }

        function esperarMs(ms) {
            return new Promise((ok) => setTimeout(ok, op.reducido ? 1 : ms));
        }

        // un visitante enfadado lanza un huevo contra el marco y todos se van
        function huevo() {
            nebu.estado = 'grune';
            const lanzador = actores[Math.floor(Math.random() * actores.length)] || { x: 0, y: ESPERA_Y, alto: ALTO_PERSONA };
            const destino = [(Math.random() - 0.5) * 2 * (PUERTA.x + 0.06), -GROSOR - 0.02, 1.4 + Math.random() * 0.9];
            const desde = [lanzador.x + 0.2, lanzador.y, lanzador.alto * 0.75];
            return new Promise((ok) => {
                huevos.push({ desde, destino, t0: reloj, dur: op.reducido ? 0.01 : 0.75, ok });
            }).then(() => {
                manchas.push({ P: destino, rot: Math.random() * 6, s: 0.22 + Math.random() * 0.08 });
                temblor = 0.35;
                const promesas = actores.map((a) => { a.flip = true; return mover(a, { x: a.x * 1.4, y: LEJOS_Y, alfa: 0.2 }, op.reducido ? 1 : 1600, true); });
                return Promise.all(promesas);
            }).then(() => {
                actores = [];
                nebu.estado = 'reposo';
            });
        }

        // ---------------- efectos ----------------
        function efecto(tipo) {
            if (op.reducido && tipo !== 'malo') return;
            if (tipo === 'bueno' || tipo === 'combo') {
                const n = tipo === 'combo' ? 90 : 36;
                for (let i = 0; i < n; i++) {
                    particulas.push({
                        x: W * (0.15 + Math.random() * 0.7), y: H + 10, vx: (Math.random() - 0.5) * W * 0.5, vy: -H * (0.9 + Math.random() * 0.8),
                        r: 2 + Math.random() * 3.5, color: ['#ffd166', '#8cff6b', '#b47cff', '#ff8a1f', '#4cc9f0', '#ff5d73'][i % 6], vida: 1.8 + Math.random(), t0: reloj, giro: Math.random() * 6,
                    });
                }
                destello = { color: 'rgba(255, 220, 140,', t0: reloj, dur: 0.6, max: tipo === 'combo' ? 0.35 : 0.18 };
            }
            if (tipo === 'combo') {
                for (let i = 0; i < 4; i++) fuegos.push({ t0: reloj + i * 0.35, P: [(Math.random() - 0.5) * 2, 30, 7 + Math.random() * 6], color: ['#ffd166', '#8cff6b', '#b47cff', '#ff5d73'][i] });
            }
            if (tipo === 'akelarre') {
                brujas.push({ t0: reloj, dur: 4.2 });
                efecto('combo');
            }
            if (tipo === 'malo') {
                temblor = 0.4;
                destello = { color: 'rgba(255, 50, 80,', t0: reloj, dur: 0.7, max: 0.3 };
            }
        }

        // ---------------- dibujo por fotograma ----------------
        function dibujarActor(c, a, recortar) {
            if (recortar && a.y < 0) return;
            if (!recortar && a.y >= 0) return;
            const P = [a.x, a.y, 0];
            const [fx, fy, s] = pr(P);
            const alto = a.alto * s * (1 + (a.k === foco ? 0.03 : 0));
            const ancho = alto * 0.75;
            const bob = a.andando ? Math.abs(Math.sin(a.paso * 9)) * alto * 0.025 : Math.sin(reloj * 2.2 + a.fase) * alto * 0.006;
            // sombra
            c.save();
            c.globalAlpha = 0.45 * a.alfa;
            c.beginPath();
            c.ellipse(fx, fy, ancho * 0.36, ancho * 0.1, 0, 0, Math.PI * 2);
            c.fillStyle = '#000';
            c.fill();
            c.restore();
            // anillo de foco
            if (a.k === foco && foco >= 0) {
                c.save();
                c.beginPath();
                c.ellipse(fx, fy, ancho * 0.5, ancho * 0.15, 0, 0, Math.PI * 2);
                c.strokeStyle = 'rgba(255, 209, 102, 0.9)';
                c.lineWidth = Math.max(2, s * 0.03);
                c.shadowColor = '#ffd166';
                c.shadowBlur = 14;
                c.stroke();
                c.restore();
            }
            const pistaVisible = a.spritePista && (reloj + a.fase) % 5.5 > 5.15;
            const sp = pistaVisible ? a.spritePista : a.sprite;
            if (!sp.listo) return;
            c.save();
            // niebla: lo lejano se apaga
            const niebla = clamp((a.y - 3) / 10, 0, 0.75);
            c.globalAlpha = a.alfa * (1 - niebla * 0.6) * (foco >= 0 && a.k !== foco ? 0.82 : 1);
            c.translate(fx, fy + alto * (5 / 160) - bob);
            if (a.flip) c.scale(-1, 1);
            c.drawImage(sp.img, -ancho / 2, -alto, ancho, alto);
            if (niebla > 0.05) {
                c.globalCompositeOperation = 'source-atop';
                c.fillStyle = `rgba(40, 24, 70, ${niebla})`;
                c.fillRect(-ancho / 2, -alto, ancho, alto);
            }
            c.restore();
        }

        function dibujarBocadillo(c) {
            if (!bocadillo) return;
            const a = actores.find((x) => x.k === bocadillo.k);
            if (!a) return;
            const [fx, fy, s] = pr([a.x, a.y, 0]);
            const cabeza = fy - a.alto * s * 0.98;
            const fs = clamp(W * 0.034, 11, 16);
            c.save();
            c.font = `${bocadillo.raro ? 'italic ' : ''}500 ${fs}px Fredoka, system-ui, sans-serif`;
            const maxW = Math.min(W * 0.5, 300);
            const palabras = bocadillo.texto.split(' ');
            const lineas = [];
            let actual = '';
            for (const p of palabras) {
                const prueba = actual ? `${actual} ${p}` : p;
                if (c.measureText(prueba).width > maxW && actual) { lineas.push(actual); actual = p; } else actual = prueba;
            }
            if (actual) lineas.push(actual);
            const lh = fs * 1.25;
            const bw = Math.max(...lineas.map((l) => c.measureText(l).width)) + fs * 1.2;
            const bh = lineas.length * lh + fs * 0.8;
            let bx = clamp(fx - bw / 2, 6, W - bw - 6);
            let by = clamp(cabeza - bh - 14, 6, H - bh - 6);
            c.shadowColor = 'rgba(0, 0, 0, 0.35)';
            c.shadowBlur = 10;
            c.fillStyle = '#fbf6ff';
            c.beginPath();
            if (c.roundRect) c.roundRect(bx, by, bw, bh, fs * 0.7); else c.rect(bx, by, bw, bh);
            c.fill();
            c.shadowBlur = 0;
            c.beginPath();
            const pico = clamp(fx, bx + 14, bx + bw - 14);
            c.moveTo(pico - 7, by + bh - 1);
            c.lineTo(pico, by + bh + 9);
            c.lineTo(pico + 7, by + bh - 1);
            c.fill();
            c.fillStyle = bocadillo.raro ? '#6b0f2a' : '#24123d';
            c.textBaseline = 'top';
            lineas.forEach((l, i) => c.fillText(l, bx + fs * 0.6, by + fs * 0.4 + i * lh));
            c.restore();
        }

        function dibujarSombrasFiesta(c) {
            const n = Math.min(12, invitados);
            c.save();
            for (let i = 0; i < n; i++) {
                const base = ((i + 0.5) / n - 0.5) * 3.2;
                const sway = Math.sin(reloj * (1.4 + (i % 3) * 0.3) + i * 1.7) * 0.18;
                const x0 = base * 0.7 + sway * 0.4, x1 = base * 1.05 + sway;
                const pts = [[x0 - 0.1, -2.6, 0.005], [x0 + 0.1, -2.6, 0.005], [x1 + 0.2, -1.05 - (i % 2) * 0.2, 0.005], [x1 - 0.2, -1.05 - (i % 2) * 0.2, 0.005]];
                camino(c, pts);
                c.fillStyle = 'rgba(10, 4, 16, 0.16)';
                c.fill();
                const [hx, hy, hs] = pr([x1, -1.1 - (i % 2) * 0.2, 0.005]);
                c.beginPath();
                c.ellipse(hx, hy, hs * 0.18, hs * 0.1, 0, 0, Math.PI * 2);
                c.fill();
            }
            // focos de colores de la fiesta barriendo la pared
            const colores = ['255, 93, 115', '140, 255, 107', '180, 124, 255', '255, 209, 102'];
            for (let i = 0; i < 3; i++) {
                const x = Math.sin(reloj * 0.6 + i * 2.1) * 3.2;
                const z = 1.7 + Math.cos(reloj * 0.45 + i) * 0.6;
                if (Math.abs(x) < PUERTA.x && z < PUERTA.z) continue;
                const [px, py, ps] = pr([x, -GROSOR - 0.02, z]);
                const g = c.createRadialGradient(px, py, 0, px, py, ps * 0.6);
                g.addColorStop(0, `rgba(${colores[(i + Math.floor(reloj / 4)) % 4]}, 0.16)`);
                g.addColorStop(1, `rgba(${colores[(i + Math.floor(reloj / 4)) % 4]}, 0)`);
                c.fillStyle = g;
                c.fillRect(px - ps * 0.6, py - ps * 0.6, ps * 1.2, ps * 1.2);
            }
            c.restore();
        }

        function dibujarGuirnalda(c) {
            const y = -GROSOR - 0.03;
            const n = 17;
            const colores = ['#ff8a1f', '#b47cff', '#8cff6b', '#ff5d73', '#ffd166'];
            let prev = null;
            for (let i = 0; i <= n; i++) {
                const t = i / n;
                const x = lerp(-PUERTA.x - 0.12, PUERTA.x + 0.12, t);
                const z = PUERTA.z + 0.24 - Math.sin(t * Math.PI * 3) ** 2 * 0.12;
                const P = pr([x, y, z]);
                if (prev) {
                    c.beginPath();
                    c.moveTo(prev[0], prev[1]);
                    c.lineTo(P[0], P[1]);
                    c.strokeStyle = '#120a18';
                    c.lineWidth = 1.2;
                    c.stroke();
                }
                prev = P;
                const brillo = 0.55 + 0.45 * Math.sin(reloj * 3 + i * 1.3);
                const r = Math.max(2, P[2] * 0.035);
                const g = c.createRadialGradient(P[0], P[1], 0, P[0], P[1], r * 4);
                g.addColorStop(0, colores[i % 5]);
                g.addColorStop(0.25, colores[i % 5] + '99');
                g.addColorStop(1, colores[i % 5] + '00');
                c.globalAlpha = brillo;
                c.fillStyle = g;
                c.fillRect(P[0] - r * 4, P[1] - r * 4, r * 8, r * 8);
                c.globalAlpha = 1;
                c.beginPath();
                c.arc(P[0], P[1], r, 0, Math.PI * 2);
                c.fillStyle = colores[i % 5];
                c.fill();
            }
        }

        function dibujarNebu(c) {
            const sp = spriteNebu(nebu.mira, nebu.estado);
            if (!sp.listo) return;
            const [fx, fy, s] = pr(POS_NEBU);
            const alto = ALTO_NEBU * s;
            const ancho = alto * (160 / 170);
            const salto = nebu.estado === 'ladra' ? Math.abs(Math.sin((reloj - nebu.salto) * 12)) * alto * 0.04 * Math.max(0, 1 - (reloj - nebu.salto) * 0.8) : 0;
            const tiembla = nebu.estado === 'grune' ? Math.sin(reloj * 60) * alto * 0.006 : 0;
            c.drawImage(sp.img, fx - ancho / 2 + tiembla, fy - alto * (160 / 170) - salto, ancho, alto);
        }

        function dibujarHuevos(c) {
            for (const h of huevos.slice()) {
                const t = clamp((reloj - h.t0) / h.dur, 0, 1);
                const P = [lerp(h.desde[0], h.destino[0], t), lerp(h.desde[1], h.destino[1], t), lerp(h.desde[2], h.destino[2], t) + Math.sin(t * Math.PI) * 0.9];
                const [px, py, ps] = pr(P);
                c.save();
                c.translate(px, py);
                c.rotate(t * 9);
                c.beginPath();
                c.ellipse(0, 0, ps * 0.05, ps * 0.065, 0, 0, Math.PI * 2);
                c.fillStyle = '#fff8e7';
                c.fill();
                c.strokeStyle = '#20132c';
                c.lineWidth = 1.2;
                c.stroke();
                c.restore();
                if (t >= 1) {
                    huevos.splice(huevos.indexOf(h), 1);
                    h.ok();
                }
            }
        }

        const spriteMancha = sprite('mancha', HA.arte.huevoSVG(), 120, 120);
        function dibujarManchas(c) {
            if (!spriteMancha.listo) return;
            for (const m of manchas) {
                const [px, py, ps] = pr(m.P);
                const t = ps * m.s;
                c.save();
                c.translate(px, py);
                c.rotate(m.rot);
                c.drawImage(spriteMancha.img, -t / 2, -t / 2, t, t);
                c.restore();
            }
        }

        function dibujarFuegos(c) {
            for (const f of fuegos.slice()) {
                const t = reloj - f.t0;
                if (t < 0) continue;
                if (t > 1.8) { fuegos.splice(fuegos.indexOf(f), 1); continue; }
                const [px, py, ps] = pr(f.P);
                const R = ps * 2.4 * suave(clamp(t / 0.8, 0, 1));
                c.save();
                c.globalAlpha = clamp(1.6 - t, 0, 1);
                for (let i = 0; i < 18; i++) {
                    const ang = (i / 18) * Math.PI * 2;
                    c.beginPath();
                    c.arc(px + Math.cos(ang) * R, py + Math.sin(ang) * R + t * t * ps * 0.5, Math.max(1.2, ps * 0.06), 0, Math.PI * 2);
                    c.fillStyle = f.color;
                    c.shadowColor = f.color;
                    c.shadowBlur = 8;
                    c.fill();
                }
                c.restore();
            }
        }

        function dibujarBrujas(c) {
            for (const b of brujas.slice()) {
                const t = (reloj - b.t0) / b.dur;
                if (t > 1) { brujas.splice(brujas.indexOf(b), 1); continue; }
                const P = [lerp(-16, 12, t), 60, LUNA[2] + Math.sin(t * 9) * 0.8];
                const [px, py, ps] = pr(P);
                const s = ps * 2.2;
                c.save();
                c.translate(px, py);
                c.fillStyle = '#0b0614';
                c.beginPath();
                c.moveTo(-s, s * 0.1); c.lineTo(s * 0.9, -s * 0.05); c.lineTo(s * 0.9, s * 0.05); c.closePath();
                c.fill();
                c.beginPath();
                c.moveTo(-s * 1.4, s * 0.15); c.lineTo(-s, -s * 0.05); c.lineTo(-s, s * 0.25); c.closePath();
                c.fill();
                c.beginPath();
                c.ellipse(-s * 0.1, -s * 0.3, s * 0.22, s * 0.35, 0, 0, Math.PI * 2);
                c.fill();
                c.beginPath();
                c.moveTo(-s * 0.35, -s * 0.6); c.lineTo(s * 0.15, -s * 0.6); c.lineTo(-s * 0.05, -s * 1.3); c.closePath();
                c.fill();
                c.restore();
            }
        }

        function dibujarParticulas(c, dt) {
            for (const p of particulas.slice()) {
                const t = reloj - p.t0;
                if (t > p.vida) { particulas.splice(particulas.indexOf(p), 1); continue; }
                p.vy += H * 1.4 * dt;
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.giro += dt * 8;
                c.save();
                c.globalAlpha = clamp(p.vida - t, 0, 1);
                c.translate(p.x, p.y);
                c.rotate(p.giro);
                c.fillStyle = p.color;
                c.fillRect(-p.r, -p.r * 0.5, p.r * 2, p.r);
                c.restore();
            }
        }

        function actualizarTweens(dt) {
            for (const tw of tweens.slice()) {
                const t = clamp((reloj - tw.t0) / tw.dur, 0, 1);
                const e = tw.caminando ? t : suave(t);
                tw.a.x = lerp(tw.ini.x, tw.fin.x, e);
                tw.a.y = lerp(tw.ini.y, tw.fin.y, e);
                tw.a.alfa = lerp(tw.ini.alfa, tw.fin.alfa, e);
                tw.a.andando = t < 1;
                tw.a.paso += dt;
                if (t >= 1) {
                    tweens.splice(tweens.indexOf(tw), 1);
                    tw.a.andando = false;
                    tw.ok();
                }
            }
        }

        function fotograma(ahora) {
            if (!activo) return;
            requestAnimationFrame(fotograma);
            const dt = Math.min(0.05, (ahora - ultimo) / 1000);
            ultimo = ahora;
            reloj += dt;
            if (!W || !H || !exterior || !interior) return;
            actualizarTweens(dt);
            const c = ctx;
            c.setTransform(DPR, 0, 0, DPR, 0, 0);
            c.clearRect(0, 0, W, H);
            if (temblor > 0) {
                temblor = Math.max(0, temblor - dt);
                c.translate((Math.random() - 0.5) * temblor * 22, (Math.random() - 0.5) * temblor * 22);
            }
            // exterior y lo que ocurre fuera, recortado al hueco de la puerta
            c.drawImage(exterior, 0, 0, W, H);
            c.save();
            recortePuerta(c, 0);
            for (const [ex, ey, er, ef] of estrellas) {
                const hz = pr([0, 80, 0])[1];
                const y = ey * hz * 0.95;
                const [mx, my] = pr(LUNA);
                if (Math.hypot(ex * W - mx, y - my) < 30) continue;
                c.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(reloj * 0.8 + ef));
                c.fillStyle = '#fff';
                c.fillRect(ex * W, y, er, er);
            }
            c.globalAlpha = 1;
            dibujarBrujas(c);
            dibujarFuegos(c);
            const orden = actores.slice().sort((a, b) => b.y - a.y);
            for (const a of orden) dibujarActor(c, a, true);
            c.restore();
            // interior
            c.drawImage(interior, 0, 0, W, H);
            dibujarCaldero(c);
            dibujarSombrasFiesta(c);
            dibujarManchas(c);
            dibujarGuirnalda(c);
            for (const a of orden) dibujarActor(c, a, false);
            dibujarNebu(c);
            dibujarHuevos(c);
            dibujarBocadillo(c);
            dibujarParticulas(c, dt);
            // destello de color y viñeta
            if (destello) {
                const t = (reloj - destello.t0) / destello.dur;
                if (t > 1) destello = null;
                else {
                    const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
                    g.addColorStop(0, `${destello.color} 0)`);
                    g.addColorStop(1, `${destello.color} ${destello.max * (1 - t)})`);
                    c.fillStyle = g;
                    c.fillRect(-20, -20, W + 40, H + 40);
                }
            }
            const v = c.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.35, W / 2, H * 0.5, Math.max(W, H) * 0.8);
            v.addColorStop(0, 'rgba(8, 3, 18, 0)');
            v.addColorStop(1, 'rgba(8, 3, 18, 0.55)');
            c.fillStyle = v;
            c.fillRect(-20, -20, W + 40, H + 40);
        }

        // ---------------- tamaño ----------------
        function redimensionar() {
            const r = canvas.getBoundingClientRect();
            const w = Math.round(r.width), h = Math.round(r.height);
            if (!w || !h || (w === W && h === H)) return;
            W = w;
            H = h;
            DPR = Math.min(root.devicePixelRatio || 1, 2);
            canvas.width = Math.round(W * DPR);
            canvas.height = Math.round(H * DPR);
            prepararCamara();
            pintarExterior();
            pintarInterior();
        }

        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(redimensionar) : null;
        if (ro) ro.observe(canvas);
        root.addEventListener('resize', redimensionar);
        redimensionar();
        // repintar las capas cuando llegue la tipografía del felpudo
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (W) pintarInterior(); });
        requestAnimationFrame(fotograma);

        // índice del candidato bajo el punto (x, y) en píxeles CSS del lienzo
        function indiceEn(x, y) {
            let mejor = -1, prof = Infinity;
            for (const a of actores) {
                const [fx, fy, s] = pr([a.x, a.y, 0]);
                const alto = a.alto * s, ancho = alto * 0.6;
                if (x > fx - ancho / 2 && x < fx + ancho / 2 && y > fy - alto && y < fy + 6 && a.y < prof) { mejor = a.k; prof = a.y; }
            }
            return mejor;
        }

        return {
            ponerFase(f) { fase = f; if (W) pintarExterior(); },
            ponerCandidatos,
            enfocar(k, texto, raro) {
                foco = k;
                nebu.mira = k < 0 ? 0 : [-1, 0, 1][k];
                bocadillo = k >= 0 && texto ? { k, texto, raro } : null;
            },
            elegir,
            huevo,
            efecto,
            nebuEstado(e) { nebu.estado = e; if (e === 'ladra') nebu.salto = reloj; },
            ponerInvitados(n) { invitados = n; },
            limpiar() { manchas = []; actores = []; particulas = []; fuegos = []; brujas = []; foco = -1; bocadillo = null; nebu = { mira: 0, estado: 'reposo', salto: 0 }; },
            indiceEn,
            pausar() { activo = false; },
            reanudar() { if (!activo) { activo = true; ultimo = performance.now(); requestAnimationFrame(fotograma); } },
            redimensionar,
        };
    }

    HA.escena3d = { crear };
})(typeof globalThis !== 'undefined' ? globalThis : this);
