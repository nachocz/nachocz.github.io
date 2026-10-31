// Reglas de puntuación. Los puntos «nominales» son los del borrador de diseño
// (personajes_y_puntos.md); los que se usan en el juego salen de balance.js.
//
// Categorías:
//   C  base por personaje admitido (se repite)
//   L  luna: personaje admitido en su fase (se repite)
//   O  objeto: consumible (por copia admitida) o persistente (una vez por partida)
//   P  pareja de tipos (una vez por partida)
//   G  grupo de tres o más (una vez por partida)
//   D  decisión sin admisión
//
// `cond` es una lista de alternativas (O lógica); cada alternativa es un mapa
// de recuentos mínimos (Y lógica). Las claves son tipos (C01…C20), objetos
// persistentes presentes en la fiesta (O05…O14) o POS, el número de niños poseídos.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};

    const base = (id, pts) => ({ id, cat: 'C', tipo: id, pts, repetible: true });

    HA.REGLAS = [
        base('C01', 20), base('C02', 30), base('C03', 25), base('C04', 5), base('C05', 15),
        base('C06', 10), base('C07', 15), base('C08', -25), base('C09', 25), base('C10', 20),
        base('C11', 20), base('C12', 10), base('C13', 15), base('C14', -15), base('C15', 10),
        base('C16', 5), base('C17', 20), base('C18', 10), base('C19', 5), base('C20', 20),

        { id: 'P01', cat: 'P', nombre: 'Vampiro + hombre lobo', resultado: 'Discusión territorial', pts: -50, cond: [{ C02: 1, C03: 1 }] },
        { id: 'P02', cat: 'P', nombre: 'Fantasma + cazafantasmas', resultado: 'Persecución paranormal', pts: -90, cond: [{ C05: 1, C14: 1 }] },
        { id: 'P03', cat: 'P', nombre: 'Vampiro + gárgola', resultado: 'Guardia nocturna de lujo', pts: 55, cond: [{ C02: 1, C18: 1 }] },
        { id: 'P04', cat: 'P', nombre: 'Alien + científico loco', resultado: 'Demostración tecnológica', pts: 80, cond: [{ C09: 1, C20: 1 }] },
        { id: 'P05', cat: 'P', nombre: 'Momia + científico loco', resultado: 'Exhibición arqueológica', pts: 50, cond: [{ C06: 1, C20: 1 }], arbitraria: true },
        { id: 'P06', cat: 'P', nombre: 'Monstruo cosido + científico loco', resultado: 'Reencuentro con su creador', pts: 45, cond: [{ C10: 1, C20: 1 }] },
        { id: 'P07', cat: 'P', nombre: 'Bruja + hada oscura', resultado: 'Espectáculo de magia', pts: 55, cond: [{ C01: 1, C17: 1 }] },
        { id: 'P08', cat: 'P', nombre: 'Esqueleto + pirata fantasma', resultado: 'Baile de cubierta', pts: 65, cond: [{ C07: 1, C13: 1 }] },
        { id: 'P09', cat: 'P', nombre: 'Payaso siniestro + niño', resultado: 'Pánico ante los globos', pts: -65, cond: [{ C12: 1, C15: 1 }] },
        { id: 'P10', cat: 'P', nombre: 'Demonio + cultista', resultado: 'Invocación con coreografía', pts: 70, cond: [{ C08: 1, C16: 1 }] },
        { id: 'P11', cat: 'P', nombre: 'Demonio + hada oscura', resultado: 'Competición de maldiciones', pts: -60, cond: [{ C08: 1, C17: 1 }] },
        { id: 'P12', cat: 'P', nombre: 'Espantapájaros + calabaza', resultado: 'Decoración viviente', pts: 50, cond: [{ C19: 1, C11: 1 }] },
        { id: 'P13', cat: 'P', nombre: 'Fantasma + pirata fantasma', resultado: 'Coro de marineros etéreos', pts: 45, cond: [{ C05: 1, C13: 1 }] },
        { id: 'P14', cat: 'P', nombre: 'Zombi + científico loco', resultado: 'Experimento fuera de control', pts: -60, cond: [{ C04: 1, C20: 1 }], arbitraria: true },
        { id: 'P15', cat: 'P', nombre: 'Alien + payaso siniestro', resultado: 'Actuación incomprensible pero viral', pts: 45, cond: [{ C09: 1, C12: 1 }], arbitraria: true },
        { id: 'P16', cat: 'P', nombre: 'Niño poseído + demonio', resultado: 'Dueto de travesuras', pts: 80, cond: [{ POS: 1, C08: 1 }] },
        { id: 'P17', cat: 'P', nombre: 'Niño poseído + cazafantasmas', resultado: 'Exorcismo chapucero', pts: -75, cond: [{ POS: 1, C14: 1 }] },

        { id: 'G01', cat: 'G', nombre: 'Tres brujas', resultado: 'Aquelarre de aperitivo', pts: 70, cond: [{ C01: 3 }] },
        { id: 'G02', cat: 'G', nombre: 'Cinco brujas', resultado: 'Gran aquelarre', pts: 200, cond: [{ C01: 5 }] },
        { id: 'G03', cat: 'G', nombre: 'Tres esqueletos + calabaza', resultado: 'Comparsa de huesos', pts: 100, cond: [{ C07: 3, C11: 1 }] },
        { id: 'G04', cat: 'G', nombre: 'Zombi + momia + monstruo cosido', resultado: 'Desfile remendado', pts: 110, cond: [{ C04: 1, C06: 1, C10: 1 }] },
        { id: 'G05', cat: 'G', nombre: 'Tres niños + calabaza', resultado: 'Concurso de disfraces', pts: 85, cond: [{ C15: 3, C11: 1 }] },
        { id: 'G06', cat: 'G', nombre: 'Alien + fantasma + hada oscura', resultado: 'Convención interdimensional', pts: 100, cond: [{ C09: 1, C05: 1, C17: 1 }], arbitraria: true },
        { id: 'G07', cat: 'G', nombre: 'Demonio + dos cultistas', resultado: 'Ritual multitudinario', pts: 95, cond: [{ C08: 1, C16: 2 }] },
        { id: 'G08', cat: 'G', nombre: 'Payaso + espantapájaros + calabaza', resultado: 'Carnaval del huerto', pts: 75, cond: [{ C12: 1, C19: 1, C11: 1 }] },

        { id: 'O01', cat: 'O', nombre: 'Caramelos artesanos', resultado: 'Éxito entre los invitados', pts: 40, objeto: 'O01', consumible: true },
        { id: 'O02', cat: 'O', nombre: 'Caramelos con laxantes', resultado: 'Estampida hacia el baño', pts: -100, objeto: 'O02', consumible: true },
        { id: 'O03', cat: 'O', nombre: 'Confeti embrujado', resultado: 'Fiesta más vistosa', pts: 30, objeto: 'O03', consumible: true },
        { id: 'O04', cat: 'O', nombre: 'Yugo de cebada falsificado', resultado: 'Brindis arruinado', pts: -70, objeto: 'O04', consumible: true },
        { id: 'O05', cat: 'O', nombre: 'Ristra de ajos + vampiro', resultado: 'Vampiros desterrados de la pista', pts: -70, cond: [{ O05: 1, C02: 1 }] },
        { id: 'O06', cat: 'O', nombre: 'Crucifijo + demonio o niño poseído', resultado: 'Revuelo sobrenatural', pts: -80, cond: [{ O06: 1, C08: 1 }, { O06: 1, POS: 1 }] },
        { id: 'O07', cat: 'O', nombre: 'Pulgas + hombre lobo', resultado: 'Rascado colectivo', pts: -60, cond: [{ O07: 1, C03: 1 }] },
        { id: 'O08', cat: 'O', nombre: 'Grimorio + bruja', resultado: 'Mesa de aperitivos mágica', pts: 70, cond: [{ O08: 1, C01: 1 }] },
        { id: 'O09-A', cat: 'O', nombre: 'Espejo encantado + vampiro', resultado: 'Vampiro sin reflejo', pts: -55, cond: [{ O09: 1, C02: 1 }] },
        { id: 'O09-B', cat: 'O', nombre: 'Espejo encantado + fantasma', resultado: 'Fotomatón espectral', pts: 50, cond: [{ O09: 1, C05: 1 }], arbitraria: true },
        { id: 'O10', cat: 'O', nombre: 'Hueso luminoso + lobo o esqueleto', resultado: 'Trofeo de baile', pts: 55, cond: [{ O10: 1, C03: 1 }, { O10: 1, C07: 1 }] },
        { id: 'O11-A', cat: 'O', nombre: 'Detector + fantasma', resultado: 'Pitido interminable', pts: -70, cond: [{ O11: 1, C05: 1 }] },
        { id: 'O11-B', cat: 'O', nombre: 'Detector + cazafantasmas', resultado: 'Demostración del detector', pts: 35, cond: [{ O11: 1, C14: 1 }] },
        { id: 'O12', cat: 'O', nombre: 'Radiocasete + zombi, esqueleto o pirata', resultado: 'Coreografía de ultratumba', pts: 55, cond: [{ O12: 1, C04: 1 }, { O12: 1, C07: 1 }, { O12: 1, C13: 1 }] },
        { id: 'O13-A', cat: 'O', nombre: 'Antena cósmica + alien', resultado: 'Emisora espacial', pts: 50, cond: [{ O13: 1, C09: 1 }] },
        { id: 'O13-B', cat: 'O', nombre: 'Antena cósmica + científico', resultado: 'Música cuántica', pts: 30, cond: [{ O13: 1, C20: 1 }], arbitraria: true },
        { id: 'O14', cat: 'O', nombre: 'Caldero + dos brujas', resultado: 'Catering mágico', pts: 60, cond: [{ O14: 1, C01: 2 }] },
        { id: 'O15-A', cat: 'O', nombre: 'Pastelitos de ectoplasma con fantasma', resultado: 'Postre espectral', pts: 30, objeto: 'O15', consumible: true, conFantasma: true },
        { id: 'O15-B', cat: 'O', nombre: 'Pastelitos de ectoplasma sin fantasma', resultado: 'Postre intocable', pts: -20, objeto: 'O15', consumible: true, conFantasma: false },

        { id: 'L01', cat: 'L', nombre: 'Hombre lobo en luna llena', resultado: 'Transformación espectacular', pts: 150, tipo: 'C03', fase: 'llena', repetible: true },
        { id: 'L02', cat: 'L', nombre: 'Vampiro en luna nueva', resultado: 'Estrella de la noche oscura', pts: 70, tipo: 'C02', fase: 'nueva', repetible: true },
        { id: 'L03', cat: 'L', nombre: 'Bruja en luna creciente', resultado: 'Hechizo luminoso', pts: 40, tipo: 'C01', fase: 'creciente', repetible: true },
        { id: 'L04', cat: 'L', nombre: 'Fantasma en luna menguante', resultado: 'Brillo espectral', pts: 35, tipo: 'C05', fase: 'menguante', repetible: true },

        { id: 'D01', cat: 'D', nombre: 'Rechazar', resultado: 'Nadie entra', pts: 0 },
        { id: 'D02', cat: 'D', nombre: 'Tiempo agotado', resultado: '¡Huevazo!', pts: -100 },
    ];

    for (const r of HA.REGLAS) {
        if (r.cat === 'C') r.nombre = HA.tipoPorId ? HA.tipoPorId[r.tipo].nombre : r.id;
    }
    HA.reglaPorId = Object.fromEntries(HA.REGLAS.map((r) => [r.id, r]));
    // reglas que se cobran una sola vez por partida, al cumplirse por primera vez
    HA.REGLAS_UNICAS = HA.REGLAS.filter((r) => r.cond);
    HA.CATEGORIAS = {
        C: 'Entrada de personaje',
        L: 'Efecto de la luna',
        O: 'Objeto',
        P: 'Pareja',
        G: 'Grupo',
        D: 'Decisión sin admisión',
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = HA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
