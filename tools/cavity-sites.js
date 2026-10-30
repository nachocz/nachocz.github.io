// Generates the sites of cavity-inspection.html and writes them into its SITES
// literal: node tools/cavity-sites.js
//
// For each theme: the contents of the housing, intact decoys on viewable spots,
// three viewpoints sampled from collision-free null-space motions, a closed-loop
// run of the controller to the viewpoints, and the damaged parts placed on the
// optical axis of the configurations that the controller reached. A site is kept
// only if a second run, with every part in place, reports the three defects.
const fs = require('fs');
const path = require('path');

const PAGE = path.join(__dirname, '..', 'cavity-inspection.html');
const page = fs.readFileSync(PAGE, 'utf8');
const coreStart = page.indexOf('const Core = (() => {');
const coreEnd = page.indexOf('// end of the simulation core', coreStart);
const C = Function(`${page.slice(coreStart, coreEnd)}\nreturn Core;`)();
const { add, sub, scale, dot, norm } = C;
const FLOOR = C.ROOM.min[2];

const world = C.createWorld();
const startTip = world.start.p_D;

const round = (v, k = 4) => Number(v.toFixed(k));
const roundVec = (v, k = 4) => v.map((x) => round(x, k));

function rng(seed) {
    const r = new C.Random(seed);
    const shuffle = (list) => {
        const out = list.slice();
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(r.uniform() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    };
    return { u: () => r.uniform(), range: (a, b) => a + (b - a) * r.uniform(), shuffle, normals: (n) => r.normals(n) };
}

// ---- contents of the housing for each theme ----
const floorCable = (pts, mat, r = 0.006) => ({ type: 'cable', points: pts.map(([x, y]) => [round(x), round(y), round(FLOOR + r)]), r, mat });

const THEMES = [
    {
        name: { en: 'Junction box bay', es: 'Nicho de cajas de conexiones' },
        components: (g) => [
            { type: 'jbox', x: round(g.range(-0.62, -0.58)), y: round(g.range(0.0, 0.02)), size: [0.12, 0.09, 0.075], spin: round(g.range(-0.2, 0.2), 3) },
            { type: 'jbox', x: round(g.range(-1.1, -1.06)), y: round(g.range(-0.40, -0.36)), size: [0.10, 0.08, 0.06], spin: 0 },
            { type: 'tray', wall: 'x+', from: -0.40, to: -0.06, z: round(g.range(0.17, 0.2)) },
            floorCable([[-1.16, -0.29], [-0.95, -0.24], [-0.78, -0.30], [-0.51, -0.27]], 'cableBlack'),
            floorCable([[-0.66, 0.06], [-0.70, -0.10], [-0.67, -0.25], [-0.72, -0.44]], 'cableGrey'),
            { type: 'tape', a: [-1.16, 0.045], b: [-0.70, 0.045] }
        ]
    },
    {
        name: { en: 'Pump housing', es: 'Carcasa de bombas' },
        components: (g) => [
            { type: 'pipe', a: [round(g.range(-0.57, -0.56)), -0.45, 0.04], b: [round(g.range(-0.57, -0.56)), 0.07, 0.04], r: 0.032 },
            { type: 'column', x: round(g.range(-1.06, -1.02)), y: round(g.range(-0.06, -0.02)), r: 0.035 },
            floorCable([[-1.16, -0.17], [-0.96, -0.12], [-0.80, -0.19], [-0.64, -0.15]], 'cableBlue'),
            floorCable([[-0.95, -0.44], [-0.88, -0.30], [-0.92, -0.16], [-0.86, 0.06]], 'cableBlack'),
            { type: 'tape', a: [-1.16, -0.43], b: [-0.62, -0.43] }
        ]
    },
    {
        name: { en: 'Cable trench', es: 'Canal de cables' },
        components: (g) => [
            { type: 'tray', wall: 'y+', from: -1.12, to: -0.56, z: round(g.range(0.15, 0.18)) },
            { type: 'tray', wall: 'x+', from: -0.42, to: -0.10, z: round(g.range(0.07, 0.09)) },
            floorCable([[-1.16, -0.05], [-0.98, -0.02], [-0.82, -0.06], [-0.66, -0.02], [-0.51, -0.05]], 'cableBlack', 0.007),
            floorCable([[-1.16, -0.09], [-0.98, -0.065], [-0.82, -0.10], [-0.66, -0.065], [-0.51, -0.09]], 'cableGrey', 0.007),
            floorCable([[-0.84, -0.44], [-0.80, -0.32], [-0.86, -0.22]], 'cableGreen', 0.005)
        ]
    },
    {
        name: { en: 'Pipe crossing', es: 'Cruce de tuberías' },
        components: (g) => {
            const y = round(g.range(-0.38, -0.36));
            return [
                { type: 'pipe', a: [-1.17, y, round(g.range(0.11, 0.13))], b: [-0.50, y, round(g.range(0.11, 0.13))], r: 0.03 },
                { type: 'jbox', x: round(g.range(-0.60, -0.58)), y: round(g.range(-0.10, -0.06)), size: [0.08, 0.12, 0.07], spin: 0 },
                floorCable([[-1.16, -0.20], [-1.0, -0.15], [-0.85, -0.21], [-0.70, -0.13], [-0.64, -0.08]], 'cableBlack'),
                { type: 'tape', a: [-1.0, 0.045], b: [-0.52, 0.045] }
            ];
        }
    },
    {
        name: { en: 'Switchgear base', es: 'Base de aparamenta' },
        components: (g) => [
            { type: 'jbox', x: round(g.range(-0.60, -0.57)), y: round(g.range(-0.30, -0.26)), size: [0.09, 0.14, 0.085], spin: 0 },
            { type: 'column', x: round(g.range(-0.62, -0.60)), y: round(g.range(0.0, 0.02)), r: 0.03 },
            { type: 'tray', wall: 'y+', from: -1.10, to: -0.70, z: round(g.range(0.12, 0.15)) },
            floorCable([[-1.16, -0.33], [-1.0, -0.26], [-0.86, -0.31], [-0.65, -0.28]], 'cableGrey'),
            floorCable([[-0.75, 0.06], [-0.79, -0.06], [-0.74, -0.16], [-0.78, -0.44]], 'cableBlue'),
            { type: 'tape', a: [-1.16, -0.43], b: [-0.75, -0.43] }
        ]
    }
];

// ---- collision-free configurations reached by random null-space walks ----
function sampleCloud(scene, seed, walks = 70, steps = 360) {
    const g = rng(seed);
    world.scene = scene;
    const cloud = [];
    for (let w = 0; w < walks; w++) {
        world.plant.reset();
        let q = world.plant.q0.slice();
        world.plant.evaluate(q);
        let dir = g.normals(6);
        for (let k = 0; k < steps; k++) {
            if (k % 30 === 0) dir = g.normals(6);
            const r = C.playerStep(world, q, dir, 0.05);
            if (r.status !== 'moved') { dir = g.normals(6); continue; }
            q = r.q;
            if (k % 12 === 0) cloud.push({ q: q.slice(), state: r.state });
        }
    }
    return cloud;
}

// a spot on the floor or on the +x/+y walls, 7 to 17 cm along the optical
// axis and 9 cm away from the edges of that surface
function surfaceSpot(scene, camera) {
    const hit = C.raycast(scene, camera.p, camera.axis);
    if (hit.prim || ![1, 3, 4].includes(hit.face)) return null;
    if (hit.t < 0.07 || hit.t > 0.17) return null;
    const along = { 1: 0, 3: 1, 4: 2 }[hit.face];
    for (let i = 0; i < 3; i++) {
        if (i === along) continue;
        if (hit.x[i] - C.ROOM.min[i] < 0.09 || C.ROOM.max[i] - hit.x[i] < 0.09) return null;
    }
    return { x: hit.x, n: hit.n, t: hit.t };
}

// 6 cm from anything standing out of a surface, 3.5 cm from cables lying on it
function clearOf(scene, x) {
    for (const g of scene.groups) {
        const need = g.flush ? 0.035 : 0.06;
        for (const p of g.prims) if (C.primDistance(p, x) < need) return false;
    }
    return true;
}

// anchor of a part whose damage point lies on the optical axis
function anchorOnAxis(kind, camera, spot, angle) {
    const F = C.surfaceFrame(spot.x, spot.n, angle);
    const [a, b, c] = C.PART_CENTERS[kind];
    const s = (c - dot(sub(camera.p, spot.x), spot.n)) / dot(camera.axis, spot.n);
    const centre = add(camera.p, scale(camera.axis, s));
    return sub(centre, add(add(scale(F.u, a), scale(F.v, b)), scale(F.n, c)));
}

function runSolution(site) {
    world.scene = C.buildScene(site);
    world.plant.reset();
    const run = new C.SolutionRun(world, site);
    const reached = [];
    while (!run.finished) {
        const e = run.step();
        if (e) reached.push({ ...e, state: run.state });
    }
    world.plant.reset();
    return { reached, time: run.time };
}

function generate(theme, seed, index) {
    const g = rng(seed);
    const site = { name: theme.name, components: theme.components(g), decoys: [], defects: [], targets: [] };
    let scene = C.buildScene(site);
    const startView = C.cameraOf(world.start);
    const startHit = C.raycast(scene, startView.p, startView.axis).x;
    const spots = [];
    for (const s of sampleCloud(scene, seed + 1)) {
        const camera = C.cameraOf(s.state);
        const spot = surfaceSpot(scene, camera);
        if (spot && clearOf(scene, spot.x)) spots.push({ ...s, camera, spot });
    }
    if (spots.length < 20) return { error: `${spots.length} spots` };
    // three viewpoints with well separated spots, away from the start view
    const order = spots.map((s, i) => [g.u(), i]).sort((a, b) => a[0] - b[0]).map(([, i]) => spots[i]);
    const chosen = [];
    for (const s of order) {
        if (norm(sub(s.spot.x, startHit)) < 0.16) continue;
        if (chosen.some((c) => norm(sub(c.spot.x, s.spot.x)) < 0.2 || norm(sub(c.state.p_D, s.state.p_D)) < 0.07)) continue;
        if (chosen.length && chosen.every((c) => c.spot.n.join() === s.spot.n.join()) && chosen.length === 2 && s.spot.n[2] > 0.5 && g.u() < 0.5) continue;
        chosen.push(s);
        if (chosen.length === 3) break;
    }
    if (chosen.length < 3) return { error: 'viewpoints' };
    // visiting order: nearest neighbour from the start tip
    const tour = [];
    let from = startTip;
    while (chosen.length) {
        chosen.sort((a, b) => norm(sub(a.state.p_D, from)) - norm(sub(b.state.p_D, from)));
        const next = chosen.shift();
        tour.push(next);
        from = next.state.p_D;
    }
    // intact decoys on other viewable spots, none at the centre of the start view
    const kinds = g.shuffle(C.PART_KINDS);
    for (const s of order) {
        if (site.decoys.length >= 6) break;
        if (norm(sub(s.spot.x, startHit)) < 0.09) continue;
        if (tour.some((t) => norm(sub(t.spot.x, s.spot.x)) < 0.16)) continue;
        if (site.decoys.some((d) => norm(sub(d.at, s.spot.x)) < 0.15)) continue;
        if (!clearOf(scene, s.spot.x)) continue;
        const kind = kinds[site.decoys.length % kinds.length];
        site.decoys.push({ kind, at: roundVec(s.spot.x), n: s.spot.n.slice(), angle: round(g.range(-Math.PI, Math.PI), 3) });
        scene = C.buildScene(site);
    }
    site.targets = tour.map((t) => roundVec(t.state.p_D));
    // first run: viewpoints with the contents and the decoys in place
    const first = runSolution(site);
    if (!first.reached.every((e) => e.arrived)) return { error: 'first run' };
    // each site leaves out a different kind of damage
    const defectKinds = g.shuffle(C.PART_KINDS.filter((_, k) => k !== (index + 3) % C.PART_KINDS.length));
    scene = C.buildScene(site);
    for (let i = 0; i < 3; i++) {
        const camera = C.cameraOf(first.reached[i].state);
        const spot = surfaceSpot(scene, camera);
        if (!spot || !clearOf(scene, spot.x)) return { error: `spot ${i} after the run` };
        const angle = g.range(-Math.PI, Math.PI);
        site.defects.push({ kind: defectKinds[i], at: roundVec(anchorOnAxis(defectKinds[i], camera, spot, angle)), n: spot.n.slice(), angle: round(angle, 3) });
        scene = C.buildScene(site);
    }
    world.scene = scene;
    if (C.defectsInView(scene, startView, new Set()).length) return { error: 'defect in the start view' };
    // second run with every part in place
    const second = runSolution(site);
    if (!second.reached.every((e) => e.arrived && e.found)) return { error: 'second run' };
    if (C.rodContact(scene, world.start.centerline)) return { error: 'contact at the start' };
    return { site, time: second.time };
}

// one key per line; objects and number arrays that fit on a line stay on it
function format(value, level = 0) {
    const pad = ' '.repeat(12 + 4 * level);
    const numbers = (v) => `[${v.map((x) => (Array.isArray(x) ? numbers(x) : JSON.stringify(x))).join(', ')}]`;
    if (typeof value === 'string') return `'${value}'`;
    if (!Array.isArray(value) && typeof value === 'object') {
        const flat = `{ ${Object.entries(value).map(([k, x]) => `${k}: ${format(x, level + 1)}`).join(', ')} }`;
        if (flat.length < 118 && !flat.includes('\n')) return flat;
        return `{\n${Object.entries(value).map(([k, x]) => `${pad}    ${k}: ${format(x, level + 1)}`).join(',\n')}\n${pad}}`;
    }
    if (Array.isArray(value)) {
        const plain = value.every((x) => typeof x === 'number' || (Array.isArray(x) && x.every((y) => typeof y === 'number')));
        if (plain && numbers(value).length < 110) return numbers(value);
        return `[\n${value.map((x) => `${pad}    ${format(x, level + 1)}`).join(',\n')}\n${pad}]`;
    }
    return JSON.stringify(value);
}

const sites = THEMES.map((theme, index) => {
    for (let attempt = 0; attempt < 30; attempt++) {
        const seed = 1000 * (index + 1) + attempt;
        const result = generate(theme, seed, index);
        if (result.site) {
            console.log(`${theme.name.en}: seed ${seed}, solution ${result.time.toFixed(1)} s, defects ${result.site.defects.map((d) => d.kind).join(', ')}`);
            return result.site;
        }
        console.log(`${theme.name.en}: seed ${seed} rejected (${result.error})`);
    }
    throw new Error(`no site for ${theme.name.en}`);
});

const literal = /const SITES = \[[\s\S]*?\n {12}\];/;
if (!literal.test(page)) throw new Error('SITES literal not found');
const eol = page.includes('\r\n') ? '\r\n' : '\n';
const updated = page.replace(literal, `const SITES = ${format(sites).replace(/\n/g, eol)};`);
fs.writeFileSync(PAGE, updated);
console.log(updated === page ? 'cavity-inspection.html: sites unchanged' : 'cavity-inspection.html: sites updated');
