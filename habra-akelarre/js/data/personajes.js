// Tipos de personaje, objetos y fases lunares de «¿Habrá akelarre?».
// Los textos de llegada dan pistas sin revelar los puntos; las reglas
// marcadas como arbitrarias en reglas.js no tienen pistas a propósito.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};

    HA.FASES = [
        { id: 'nueva', nombre: 'Luna nueva' },
        { id: 'creciente', nombre: 'Luna creciente' },
        { id: 'llena', nombre: 'Luna llena' },
        { id: 'menguante', nombre: 'Luna menguante' },
    ];

    HA.TIPOS = [
        {
            id: 'C01', clave: 'bruja', nombre: 'Bruja', plural: 'Brujas', color: '#9b5de5', sonido: 'risa_bruja',
            nombres: ['Meiga Remedios', 'Bruja Pilarín', 'Hechicera Maripuri', 'Doña Escobilla', 'Bruja Flor', 'Madame Caldero', 'Meiga Tuca'],
            lineas: [
                '¿Hay más brujas dentro? Con tres ya tenemos quórum.',
                'Busco a mis hermanas de aquelarre... y el ponche.',
                'He traído la escoba de gala. Aparco donde pueda.',
                'Si hay un hada por ahí, montamos espectáculo.',
                '¡Flor! Digo... buenas noches. ¿Se puede?',
            ],
            afines: { O08: 4, O14: 4, O01: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C02', clave: 'vampiro', nombre: 'Vampiro', plural: 'Vampiros', color: '#c1121f', sonido: 'vampiro',
            nombres: ['Conde Drácula de Chamberí', 'Lord Colmillos', 'Barón Von Mordisco', 'Condesa Nocturnia', 'Vlad el Elegante'],
            lineas: [
                'Buenas noches. Espero que no haya ajo en el menú.',
                'Prefiero las noches sin luna, ¿sabe usted?',
                'Si veo a un chucho peludo me voy. Sin ofender, perrita.',
                '¿Hay gárgolas? Me recuerdan a mi castillo.',
                'No me haga fotos, por favor. No salgo bien en los espejos.',
            ],
            afines: { O03: 1.5 },
            prohibidos: ['O05', 'O06', 'O09'],
        },
        {
            id: 'C03', clave: 'lobo', nombre: 'Hombre lobo', plural: 'Hombres lobo', color: '#8d6e63', sonido: 'aullido_corto',
            nombres: ['Lobo Ramón', 'Aullador Pepe', 'Licántropo Juanjo', 'Peluchín', 'Loba Marisa'],
            lineas: [
                '¡Aúúúú! ¿Esta noche hay luna llena?',
                'Aaaanimaaaal, ¡qué barbaridad! ¡Qué buena pinta tiene esto!',
                'No me gustan los murciélagos con pajarita.',
                '¿Alguien ha traído un hueso? Pregunto por un amigo.',
                'Perdona, perrita, ¿tienes champú antipulgas?',
            ],
            afines: { O07: 4, O10: 3 },
            prohibidos: [],
        },
        {
            id: 'C04', clave: 'zombi', nombre: 'Zombi', plural: 'Zombis', color: '#6a994e', sonido: 'zombi',
            nombres: ['Zombi Paco', 'Putrefacto Luis', 'Zombi Encarna', 'El Tieso', 'Zombi Mari'],
            lineas: [
                'Cereee... cerebritos de aperitivo.',
                'Muuuúsica... ¿hay radiocasete?',
                'Mis amigos... la momia... y el cosido... ¿están?',
                'Brrrr... baaaile.',
            ],
            afines: { O12: 2, O04: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C05', clave: 'fantasma', nombre: 'Fantasma', plural: 'Fantasmas', color: '#cfd8dc', sonido: 'fantasma',
            nombres: ['Fantasma Sabanito', 'Espectro Lola', 'Ánima Gertrudis', 'Ectoplasmo', 'Fantasmín'],
            lineas: [
                '¡Buuu! ¿Ya hay espectros dentro?',
                'Por favor, que no haya cazafantasmas...',
                'Me encantan las noches de luna menguante.',
                '¿Habrá pastelitos que pueda comer alguien sin cuerpo?',
                'Me apetece cantar con algún pirata.',
            ],
            afines: { O15: 3, O03: 1.5 },
            prohibidos: ['O11'],
        },
        {
            id: 'C06', clave: 'momia', nombre: 'Momia', plural: 'Momias', color: '#e9c46a', sonido: 'momia',
            nombres: ['Momia Ramsés', 'Tutan-Kamona', 'Nefer-Titi', 'Momia Vendelina', 'Faraón Pepe'],
            lineas: [
                'Perdón, me he dejado una venda colgando.',
                'Vengo del desfile de criaturas remendadas.',
                'Tres mil años esperando una fiesta así.',
                '¿Tienen música antigua? De la de antes de Cristo.',
            ],
            afines: { O12: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C07', clave: 'esqueleto', nombre: 'Esqueleto', plural: 'Esqueletos', color: '#f1faee', sonido: 'esqueleto',
            nombres: ['Huesitos', 'Calavera Manolo', 'Don Fémur', 'Costillas', 'Esqueleta Rosi'],
            lineas: [
                '¡Vengo con todos mis huesos! ¿Hay más esqueletos?',
                '¿Hay piratas? Me encantan sus bailes de cubierta.',
                '¿Alguien ha traído música de ultratumba?',
                'Una calabaza que dirija la comparsa y no paro de bailar.',
            ],
            afines: { O10: 3, O12: 3 },
            prohibidos: [],
        },
        {
            id: 'C08', clave: 'demonio', nombre: 'Demonio', plural: 'Demonios', color: '#e63946', sonido: 'risa_malvada',
            nombres: ['Belcebú Jr.', 'Asmodeo', 'Diablillo Toño', 'Lucifera', 'Mefisto'],
            lineas: [
                'Firme aquí y la fiesta será eterna.',
                '¿Hay cultistas? Me encanta tener público fiel.',
                'No soporto la purpurina de las hadas.',
                '¿Un crucifijo? Ni lo menciones.',
                'Busco a un niño travieso para gastar bromas.',
            ],
            afines: { O02: 2, O04: 2 },
            prohibidos: ['O06'],
        },
        {
            id: 'C09', clave: 'alien', nombre: 'Alien', plural: 'Aliens', color: '#80ed99', sonido: 'alien',
            nombres: ['Zorg', 'Blip-Blop', 'Xíkara', 'Glorp', 'Unidad 42'],
            lineas: [
                'Bip. Busco científico terrestre para intercambio cultural.',
                'Mi antena capta señales de fiesta.',
                'Saludos, terrícola cuadrúpeda. Llévenme ante su ponche.',
                'Bip, bop. Vengo en son de baile.',
            ],
            afines: { O13: 4 },
            prohibidos: [],
        },
        {
            id: 'C10', clave: 'cosido', nombre: 'Monstruo cosido', plural: 'Monstruos cosidos', color: '#52b788', sonido: 'monstruo',
            nombres: ['Frankie', 'El Remendado', 'Costuritas', 'Tornillo', 'Monstruo Paco'],
            lineas: [
                '¿Ha visto a mi creador? Bata blanca, pelo eléctrico.',
                'Me han cosido para esta fiesta.',
                'Busco a mis colegas remendados. Uno va en vendas.',
                'Grrr... ¿Fuego? ¡No! ¿Ponche? ¡Sí!',
            ],
            afines: { O12: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C11', clave: 'calabaza', nombre: 'Calabaza viviente', plural: 'Calabazas', color: '#f77f00', sonido: 'calabaza',
            nombres: ['Calabacín', 'Jack', 'Doña Calabaza', 'Farolillo', 'Pepita'],
            lineas: [
                '¡Feliz Halloween! Yo traigo la luz.',
                '¿Hay espantapájaros? Me sentiré como en casa.',
                'Me encanta hacer de jurado en concursos infantiles.',
                'Me han dicho que hay comparsa de huesos.',
            ],
            afines: { O01: 2, O03: 2 },
            prohibidos: [],
        },
        {
            id: 'C12', clave: 'payaso', nombre: 'Payaso siniestro', plural: 'Payasos', color: '#ef476f', sonido: 'payaso',
            nombres: ['Pennywaise', 'Payaso Risitas', 'Bozo Siniestro', 'Mister Globo', 'Payasa Chirri'],
            lineas: [
                '¿Hay niños? Tengo globos para todos... je, je.',
                '¡Soy el alma de la feria del huerto!',
                '¿Quién quiere un globo con forma de pesadilla?',
                '¡Tacháaan! ¿No se ríe, perrita?',
            ],
            afines: { O03: 3, O02: 2 },
            prohibidos: [],
        },
        {
            id: 'C13', clave: 'pirata', nombre: 'Pirata fantasma', plural: 'Piratas fantasma', color: '#4cc9f0', sonido: 'pirata',
            nombres: ['Capitán Barbaespectral', 'Pata de Palo Fantasma', 'Corsaria Bruma', 'Capitán Garfio de Niebla'],
            lineas: [
                '¡Arrr! Busco tripulación de huesos.',
                '¿Hay espectros para el coro?',
                'Si suena un radiocasete, ¡bailo hasta en cubierta!',
                '¡Arrr! Mi loro es invisible, pero existe.',
            ],
            afines: { O12: 3, O09: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C14', clave: 'cazafantasmas', nombre: 'Cazafantasmas', plural: 'Cazafantasmas', color: '#adb5bd', sonido: 'cazafantasmas',
            nombres: ['Agente Peter', 'Inspectora Ray', 'Egon Juárez', 'Técnico Winston'],
            lineas: [
                'Inspección rutinaria. ¿Ha visto algún espectro?',
                'Huele a ectoplasma por aquí.',
                '¿Algún niño raro? Traigo agua bendita de pistola.',
                'Sin mi detector me siento desnudo.',
            ],
            afines: { O11: 5, O06: 2 },
            prohibidos: [],
        },
        {
            id: 'C15', clave: 'nino', nombre: 'Niño de truco o trato', plural: 'Niños', color: '#ffd166', sonido: 'nino',
            nombres: ['Dani', 'Lucía', 'Hugo', 'Martina', 'Leo', 'Vega', 'Bruno', 'Alba'],
            lineas: [
                '¿Truco o trato?',
                '¡Mira mi disfraz! ¡Lo he hecho yo!',
                '¿Hay más niños? ¡Concurso de disfraces!',
                '¿Hay payasos? Me dan un poco de miedo...',
            ],
            // frases que solo aparecen cuando el niño muestra la pista de posesión
            lineasRaras: [
                '¿Truco o trato? ...o trato... o trato...',
                'Mamá dice que esta noche hablo con dos voces.',
                'Tengo hambre de... caramelos. Sí. Caramelos.',
                'Je, je, je... digo... ¡hola!',
            ],
            afines: { O01: 4, O02: 2, O15: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C16', clave: 'cultista', nombre: 'Cultista', plural: 'Cultistas', color: '#7f5539', sonido: 'cultista',
            nombres: ['Hermano Encapuchado', 'Acólita Puri', 'Sumo Sacerdote Ernesto', 'Novicio Tobías'],
            lineas: [
                'Gloria a... digo, ¡buenas noches!',
                '¿Ha llegado ya el Señor Oscuro? Digo... ¿el anfitrión?',
                'Siempre vamos en grupo, ¿hay más túnicas?',
                'Traigo una vela aromática. Huele a azufre y vainilla.',
            ],
            afines: { O08: 2 },
            prohibidos: [],
        },
        {
            id: 'C17', clave: 'hada', nombre: 'Hada oscura', plural: 'Hadas oscuras', color: '#b5179e', sonido: 'hada',
            nombres: ['Hada Morgana', 'Campanilla Gótica', 'Hada Nocturna', 'Purpurina Negra'],
            lineas: [
                'Traigo purpurina oscura para todos.',
                '¿Hay brujas? Hacemos un dúo de magia.',
                'Espero que no haya demonios. Nos llevamos fatal.',
                'Mis alas no caben por cualquier puerta.',
            ],
            afines: { O03: 3, O09: 2 },
            prohibidos: [],
        },
        {
            id: 'C18', clave: 'gargola', nombre: 'Gárgola', plural: 'Gárgolas', color: '#8d99ae', sonido: 'gargola',
            nombres: ['Gárgola Petra', 'Pedrusco', 'Gárgola Notre', 'Granito'],
            lineas: [
                'Vengo de la catedral. Tengo la noche libre.',
                'Un vampiro elegante y yo: guardia perfecta.',
                '...',
                'No prometo bailar. Lo mío es posar.',
            ],
            afines: { O06: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C19', clave: 'espantapajaros', nombre: 'Espantapájaros', plural: 'Espantapájaros', color: '#dda15e', sonido: 'espantapajaros',
            nombres: ['Pajarito', 'Don Paja', 'Espantajo', 'Tío Rastrojo'],
            lineas: [
                'Vengo del huerto. ¿Hay calabazas?',
                'Tranquilos, hoy no espanto a nadie.',
                'Me encantan las ferias de pueblo, con payaso y todo.',
                '¡Trae paja hasta en los bolsillos! Bueno, yo.',
            ],
            afines: { O01: 1.5, O07: 1.5 },
            prohibidos: [],
        },
        {
            id: 'C20', clave: 'cientifico', nombre: 'Científico loco', plural: 'Científicos locos', color: '#48cae4', sonido: 'cientifico',
            nombres: ['Doctor Chispas', 'Doctora Probeta', 'Profesor Voltio', 'Doctor Frankenstein Jr.'],
            lineas: [
                '¡Hagamos una porra! ¿Cuánto tarda en explotar esto?',
                '¿Hay algún alienígena? Necesito un colaborador.',
                'Busco a mi criatura. Grande, verde, con tornillos.',
                '¡Eureka! Digo... ¡buenas noches!',
            ],
            afines: { O13: 2, O11: 2 },
            prohibidos: [],
        },
    ];

    // Las etiquetas visibles son verdaderas: describen el objeto sin revelar su efecto.
    HA.OBJETOS = [
        { id: 'O01', clave: 'caramelos', nombre: 'Caramelos artesanos', clase: 'consumible', linea: 'He traído caramelos artesanos para compartir.' },
        { id: 'O02', clave: 'laxantes', nombre: 'Caramelos «sorpresa»', clase: 'consumible', linea: 'Traigo unos caramelos muy... efectivos.' },
        { id: 'O03', clave: 'confeti', nombre: 'Confeti embrujado', clase: 'consumible', linea: '¡Llevo confeti embrujado! Se lanza solo.' },
        { id: 'O04', clave: 'yugo', nombre: 'Yugo de «Cebada»', clase: 'consumible', linea: '¡Traigo yugo de cebada! Del bueno. Creo.' },
        { id: 'O05', clave: 'ajos', nombre: 'Ristra de ajos', clase: 'persistente', linea: 'Traigo ajos, que alejan los malos rollos.' },
        { id: 'O06', clave: 'crucifijo', nombre: 'Crucifijo brillante', clase: 'persistente', linea: 'Mi crucifijo brilla en la oscuridad. ¿A que mola?' },
        { id: 'O07', clave: 'pulgas', nombre: 'Pulgas saltarinas', clase: 'persistente', linea: '¿Por qué me pica tanto el cuello?' },
        { id: 'O08', clave: 'grimorio', nombre: 'Grimorio antiguo', clase: 'persistente', linea: 'Este grimorio es de mi abuela. Tiene recetas de fiesta.' },
        { id: 'O09', clave: 'espejo', nombre: 'Espejo encantado', clase: 'persistente', linea: 'Traigo un espejo encantado para hacerse fotos.' },
        { id: 'O10', clave: 'hueso', nombre: 'Hueso gigante luminoso', clase: 'persistente', linea: '¡Mirad este hueso! Brilla y todo.' },
        { id: 'O11', clave: 'detector', nombre: 'Detector de ectoplasma', clase: 'persistente', linea: 'Traigo un detector de ectoplasma. Pita bastante.' },
        { id: 'O12', clave: 'radiocasete', nombre: 'Radiocasete maldito', clase: 'persistente', linea: 'Traigo música: un radiocasete con cintas malditas.' },
        { id: 'O13', clave: 'antena', nombre: 'Antena cósmica', clase: 'persistente', linea: 'Traigo una antena para captar emisoras lejanas.' },
        { id: 'O14', clave: 'caldero', nombre: 'Caldero portátil', clase: 'persistente', linea: 'Caldero portátil: para dos brujas, como mínimo.' },
        { id: 'O15', clave: 'pastelitos', nombre: 'Pastelitos de ectoplasma', clase: 'consumible', linea: 'He traído pastelitos de ectoplasma. Para gente sin cuerpo.' },
    ];

    HA.tipoPorId = Object.fromEntries(HA.TIPOS.map((t) => [t.id, t]));
    HA.objetoPorId = Object.fromEntries(HA.OBJETOS.map((o) => [o.id, o]));

    if (typeof module !== 'undefined' && module.exports) module.exports = HA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
