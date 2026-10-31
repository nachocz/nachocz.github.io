// Configuración de balance usada por el juego.
// Archivo generado por herramientas/balance.js (ajustar --n 300 --iter 120) o
// exportado desde herramientas/balanceador.html. Los puntos que no aparecen
// en `puntos` conservan su valor nominal de reglas.js.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};

    HA.BALANCE = {
        "puntos": {
            "C01": 10,
            "C02": 10,
            "C03": 10,
            "C05": 5,
            "C06": 5,
            "C07": 5,
            "C08": -10,
            "C09": 10,
            "C10": 10,
            "C11": 10,
            "C12": 5,
            "C13": 5,
            "C14": -5,
            "C15": 5,
            "C17": 10,
            "C18": 5,
            "C20": 10,
            "O01": 35,
            "O02": -250,
            "O03": 25,
            "O04": -175,
            "O05": -175,
            "O06": -200,
            "O07": -150,
            "O08": 60,
            "O09-A": -135,
            "O09-B": 45,
            "O10": 50,
            "O11-A": -175,
            "O11-B": 30,
            "O12": 50,
            "O13-A": 45,
            "O13-B": 25,
            "O14": 55,
            "O15-A": 25,
            "O15-B": -50,
            "P01": -110,
            "P02": -200,
            "P09": -145,
            "P11": -130,
            "P14": -130,
            "P17": -165
        },
        "pesosTipo": {
            "C01": 2.285
        },
        "pesosObjeto": {
            "O02": 2.6,
            "O04": 2.6,
            "O05": 2.6,
            "O06": 2.6,
            "O07": 2.6
        },
        "objetos": {
            "ninguno": 0.202,
            "uno": 0.694,
            "dos": 0.104
        },
        "director": 0.308,
        "directorObjetos": 2,
        "poseido": 0.25,
        "pistaPoseido": 0.7,
        "pistaFalsa": 0.1,
        "version": "ajustado 2026-10-31",
        "perillas": {
            "base": 0.4,
            "parPos": 1.013,
            "parNeg": 2.2,
            "grupo": 1,
            "objPos": 0.879,
            "objNeg": 2.499,
            "luna": 1.002,
            "pesoNegativos": 2.6,
            "director": 0.308,
            "pesoBruja": 2.285,
            "sinObjeto": 0.202
        }
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = HA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
