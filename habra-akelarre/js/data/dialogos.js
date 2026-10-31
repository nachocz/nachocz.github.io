// Mensajes de los eventos (informacion/dialogos_actualizado.md): tres variantes
// intercambiables por regla, como [quién habla, texto]. 'Narración' es texto en
// pantalla sin personaje. Además: introducción de Claudia y finales.
(function (root) {
    'use strict';
    const HA = root.HA = root.HA || {};
    const N = 'Narración';
    const I = 'Invitados';

    HA.MENSAJES = {
        C01: [['Bruja', 'He traído hechizos de fiesta. ¡Los malos se quedan en la escoba!'], [N, 'Una bruja enciende velas flotantes. El salón gana ambiente.'], [I, '¡Por fin alguien que sabe servir ponche con humo!']],
        C02: [['Vampiro', 'Buenas noches. El código de vestimenta es exquisito.'], [N, 'Entra un vampiro impecable y sube el nivel de elegancia.'], [I, '¡Qué capa! La Calf Queen ha reunido a la aristocracia de ultratumba.']],
        C03: [['Hombre lobo', 'Aaaanimaaaal, ¡qué barbaridad de canapés! Prometo no morder a nadie... salvo a uno.'], [N, 'El nuevo invitado pone los bailes salvajes de moda.'], [I, '¡Qué pelazo! ¿Dónde se compra ese acondicionador?']],
        C04: [['Zombi', 'Cereee... cereales. ¿Y queso manchego para picar?'], [N, 'Un zombi aporta un pasito de baile sorprendentemente contagioso.'], [I, 'No habla mucho, pero marca bien el ritmo.']],
        C05: [['Fantasma', '¡Buuuenas! ¿Hay guardarropa para las sábanas?'], [N, 'La fiesta gana un invitado que no ocupa sitio en el sofá.'], [I, '¡Genial! Alguien que puede llevar bebidas atravesando la multitud.']],
        C06: [['Momia', 'Perdón por llegar tarde. Tenía que ponerme las vendas.'], [N, 'Una momia entra con elegancia milenaria y olor a incienso.'], [I, '¡Es vintage de verdad! Y viene envuelta para regalo.']],
        C07: [['Esqueleto', '¡A bailar! Hoy vengo con todo el cuerpo.'], [N, 'Un esqueleto sacude los huesos al compás de la música.'], [I, 'No tiene músculos, pero tiene un ritmo espectacular.']],
        C08: [['Demonio', 'Un contrato de diversión eterna. La letra pequeña no importa.'], [N, 'Aparecen cláusulas infernales en las servilletas. Baja la confianza.'], [I, '¿Por qué para pedir una bebida hay que firmar con sangre?']],
        C09: [['Alien', '¡Bip! Civilización detectada. Fiesta aceptable. Inicio del baile.'], [N, 'El alien enseña un paso de baile de seis extremidades.'], [I, 'No entendemos nada, ¡pero queremos otra demostración!']],
        C10: [['Monstruo cosido', 'Me han montado por piezas. La fiesta también parece bien montada.'], [N, 'Un invitado de retales causa sensación con su atuendo único.'], [I, '¡Ese disfraz está hecho a mano! Literalmente.']],
        C11: [['Calabaza', 'He venido con la sonrisa tallada de serie.'], [N, 'La nueva calabaza ilumina el salón con luz anaranjada.'], [I, '¡La Calf Queen ha conseguido que hasta la decoración baile!']],
        C12: [['Payaso', '¡Tacháaan! ¿Quién quiere un globo con forma de pesadilla?'], [N, 'El payaso estrena un espectáculo de humor inquietante.'], [I, '¡Hagamos una porra! ¿Quién se atreve a aceptar su globo con forma de pesadilla?']],
        C13: [['Pirata fantasma', '¡Arrr! ¡La Calf Queen tiene tesoros y pista de baile! ¡A bordo!'], [N, 'Un corsario espectral convierte la entrada en cubierta de barco.'], [I, '¡Tiene un loro invisible! ¡Eso es ahorrar en alpiste!']],
        C14: [['Cazafantasmas', '¡Inspección paranormal! Nadie se mueva hasta nuevo aviso.'], [N, 'Su equipo de inspección corta el ambiente de la fiesta.'], [I, 'Genial, otra persona que viene a una fiesta con normas.']],
        C15: [['Niño', '¿Truco, trato o me puedo quedar a bailar?'], [N, 'Un pequeño disfrazado aporta entusiasmo y energía.'], [I, '¡Qué bien se ha currado el disfraz! ¡Que pase!']],
        C16: [['Cultista', 'Gloria a... digo, ¿dónde dejamos los abrigos?'], [N, 'Un encapuchado aporta misterio y una vela aromática.'], [I, 'Habla muy raro, pero ha traído su propia túnica de gala.']],
        C17: [['Hada oscura', 'Mis bendiciones incluyen purpurina. No hay devoluciones.'], [N, 'Las alas del hada convierten la entrada en un espectáculo.'], [I, '¡Chiquis, venid a ver ese brillo! ¿Eso se quita de las cortinas?']],
        C18: [['Gárgola', 'No prometo bailar mucho, pero posar se me da de piedra.'], [N, 'Una gárgola aporta una presencia monumental al salón.'], [I, '¡Qué postura! Lleva siglos entrenando.']],
        C19: [['Espantapájaros', 'Vengo del campo. Tranquilos: hoy no espanto a nadie.'], [N, 'Un espantapájaros añade un toque rústico a la decoración.'], [I, '¡Trae paja hasta en los bolsillos! Qué compromiso con el disfraz.']],
        C20: [['Científico loco', '¡Hagamos una porra! ¿Cuánto tarda mi invento en poner a bailar a todos?'], [N, 'El científico instala una pequeña demostración chispeante.'], [I, '¡Por fin alguien que sabe explicar por qué humea el ponche!']],

        P01: [['Vampiro', '¡Acaba de entrar alguien que se sacude sobre mi capa!'], [N, 'Vampiros y hombres lobo discuten por el territorio del sofá.'], ['Hombre lobo', 'Aaaanimaaaal, ¡qué descaro! ¡Ese murciélago me ha llamado mascota!']],
        P02: [['Fantasma', '¡Socorro! ¡Hay alguien intentando meterme en una aspiradora!'], [N, 'Se desata una persecución paranormal entre las mesas.'], ['Cazafantasmas', '¡Contacto ectoplásmico! ¡Apartad los canapés!']],
        P03: [['Vampiro', 'Con esa gárgola vigilando, esta es una fiesta de categoría.'], [N, 'Vampiro y gárgola forman una guardia nocturna elegantísima.'], ['Gárgola', 'Yo cuido la puerta interior. Tú encárgate de la capa.']],
        P04: [['Científico loco', '¡Por fin alguien que entiende mi máquina de bailar al revés!'], [N, 'La demostración alienígena-científica deja al público boquiabierto.'], ['Alien', 'Tecnología terrestre aprobada. Resultado: ¡fiestón!']],
        P05: [['Científico loco', '¡Un museo viviente! ¿Puedo analizar esas vendas?'], [N, 'La momia protagoniza una exposición arqueológica improvisada.'], ['Momia', 'Si quieren una visita guiada, cobro en aceitunas y queso manchego.']],
        P06: [['Monstruo cosido', '¡Doctor! ¡Mire, sigo teniendo todas mis piezas!'], [N, 'El reencuentro del monstruo con su creador provoca aplausos.'], ['Científico loco', '¡Mi mejor experimento! ¡Y hoy viene de etiqueta!']],
        P07: [['Bruja', 'Tú pones el brillo y yo las explosiones controladas.'], [N, 'Un dúo de magia oscura ilumina el techo con estrellas.'], ['Hada oscura', '¡Jamás había visto un hechizo combinar tan bien con mis alas!']],
        P08: [['Pirata fantasma', '¡Arrr! ¡Marinero, a mover esos huesos por cubierta!'], [N, 'Un esqueleto y un corsario espectral inauguran el baile pirata.'], ['Esqueleto', '¡Este pirata sí que sabe hacer crujir las tablas!']],
        P09: [['Niño', '¡NO QUIERO UN GLOBO CON DIENTES!'], [N, 'El número del payaso provoca un ataque de pánico infantil.'], [I, '¡Que alguien guarde esa nariz roja antes de que lloren todos!']],
        P10: [['Cultista', '¡Oh, gran señor infernal! ¿Nos sabe enseñar esa coreografía?'], [N, 'Una invocación acaba convertida en baile sincronizado.'], ['Demonio', 'Se suponía que era un ritual solemne... ¡pero qué ritmo!']],
        P11: [['Hada oscura', '¡Tu maldición combina fatal con mi purpurina!'], [N, 'Dos hechizos rivales estropean los adornos del techo.'], ['Demonio', '¡Yo pedí oscuridad eterna, no confeti venenoso!']],
        P12: [['Calabaza', '¡Con tanta paja, por fin parecemos un huerto respetable!'], [N, 'El espantapájaros y la calabaza montan un decorado viviente.'], [I, '¡Es el rincón de fotos más otoñal de la historia!']],
        P13: [['Pirata fantasma', '¡Tripulación de ultratumba, todos al estribillo!'], [N, 'Un coro de marineros etéreos se oye por toda la casa.'], ['Fantasma', '¡Por fin alguien que canta sin necesidad de pulmones!']],
        P14: [['Científico loco', '¡Quieto! ¡Esa palanca no era para tocarla!'], [N, 'Un experimento con el zombi llena la pista de espuma verde.'], ['Zombi', 'Cere... ¿por qué me salen chispas de las orejas?']],
        P15: [['Alien', 'Su nariz roja es un dispositivo de comunicación superior.'], [N, 'Un espectáculo alienígena y payaso causa furor incomprensible.'], ['Payaso', '¡Mi público favorito! ¡Se ríen antes de entender el chiste!']],
        P16: [['Niño (voz doble)', '¿Una travesura? ¡Yo pongo el plan y tú los rayos!'], [N, 'El demonio descubre al espíritu del niño: nace un dúo diabólicamente divertido.'], ['Demonio', '¡Por fin alguien de mi edad mental para gastar bromas!']],
        P17: [['Niño (voz cavernosa)', '¡No me rocíes con agua bendita de pistola!'], [N, 'Un exorcismo improvisado convierte el salón en un campo de batalla de cojines.'], ['Cazafantasmas', '¡El disfraz se mueve solo! ¡Repito: se mueve solo!']],

        G01: [['Bruja', '¡Flor, ya somos tres! ¡Aquelarre de aperitivo junto al ponche!'], [N, 'Tres escobas forman un círculo y aparece una bandeja infinita de canapés.'], [I, '¡Las brujas han montado un aquelarre con servicio de catering!']],
        G02: [['Bruja', '¡Flor, cinco sombreros, un solo caldero! ¡Que empiece el gran aquelarre!'], [N, 'Cinco brujas elevan el salón y convierten la fiesta en leyenda.'], [I, '¡El aquelarre definitivo! ¡Hasta la casa está bailando!']],
        G03: [['Esqueleto', '¡Tres pares de fémures y una calabaza directora! ¡Música!'], [N, 'Nace una comparsa de huesos iluminada por una calabaza sonriente.'], ['Calabaza', '¡Yo marco el compás! ¡Vosotros haced sonar las costillas!']],
        G04: [['Momia', 'Entre tus costuras y mis vendas, ¡montamos un desfile!'], [N, 'Zombi, momia y monstruo cosido triunfan en la pasarela remendada.'], [I, '¡Alta costura de ultratumba! ¡Ni una puntada fuera de sitio!']],
        G05: [['Niño', '¡La calabaza es el jurado! ¡Concurso de disfraces, ya!'], [N, 'Tres pequeños organizan un concurso ante una calabaza luminosa.'], ['Calabaza', '¡Chiquis, primer premio para... todos! ¡Así nadie llora!']],
        G06: [['Alien', 'Portal dimensional estable. Invitados imposibles: confirmados.'], [N, 'Un alien, un fantasma y un hada abren una convención interdimensional.'], ['Fantasma', '¡Esta reunión es tan rara que hasta yo me siento normal!']],
        G07: [['Cultistas', '¡Uno, dos, tres, invocación! ¡Y giro a la derecha!'], [N, 'Dos túnicas y un demonio convierten un ritual en número musical.'], ['Demonio', '¡Dos acólitos! Ahora sí: un ritual con coreografía completa.']],
        G08: [['Payaso', '¡Bienvenidos al carnaval del huerto! ¡No pisen las calabazas!'], [N, 'El payaso, el espantapájaros y la calabaza montan una feria otoñal.'], ['Espantapájaros', 'Yo pongo la paja, la calabaza las luces y tú... el susto.']],

        O01: [[I, '¡Menudo adubir! ¡No damos abasto repartiendo estos caramelos!'], [N, 'Se reparte una bolsa de caramelos artesanos y todos celebran el sabor.'], ['Bruja', '¡Por una vez, un dulce sin hechizos secundarios!']],
        O02: [[I, '¡APARTAD! ¡EL BAÑO ES MÍO!'], [N, 'Los caramelos sorpresa provocan una estampida hacia el único aseo.'], [I, '¡Ese caramelo tenía más velocidad que sabor!']],
        O03: [[N, 'El confeti flota, dibuja calabazas y hace brillar el techo.'], [I, '¡La decoración se está poniendo sola! ¡Qué maravilla!'], ['Fantasma', '¡Hasta el confeti atraviesa las paredes! ¡Arte moderno!']],
        O04: [[I, '¡Puaj! ¿Esto es yugo de cebada o agua de calcetín? ¡Que no se entere la Calf Queen!'], [N, 'La bebida sospechosa crea espuma verde y arruina el brindis.'], ['Momia', 'Llevo siglos bebiendo cosas raras, ¡pero esto es demasiado!']],
        O05: [['Vampiro', '¡¿QUIÉN HA COLGADO AJOS JUNTO AL PONCHE?!'], [N, 'El olor a ajo obliga a los vampiros a alejarse de la pista.'], [I, 'Los vampiros han declarado la cocina zona prohibida.']],
        O06: [[N, 'El crucifijo brilla y desata un revuelo sobrenatural.'], [I, '¡Guardad ese crucifijo! ¡Acaba de empezar un escándalo demoníaco!'], [N, 'Una luz sagrada hace retroceder a los espíritus traviesos y estropea el ambiente.']],
        O07: [['Hombre lobo', '¡Me pica todo! ¡Y no me puedo rascar con educación!'], [N, 'Las pulgas del hombre lobo contagian una ola de rascado colectivo.'], [I, '¡Esto no es un baile nuevo! ¡Tenemos pulgas!']],
        O08: [['Bruja', '¡Mi hechizo favorito! ¡El que rellena solo la mesa de aperitivos!'], [N, 'Una bruja abre el grimorio y el salón se llena de efectos mágicos.'], [I, '¡Por fin un libro que pone música y no pide exámenes!']],
        'O09-A': [['Vampiro', '¡Mi reflejo no sale! ¡Este espejo me está humillando!'], [N, 'El espejo muestra el salón vacío donde debería verse el vampiro.'], [I, '¡El vampiro se ha enfadado con su propio no-reflejo!']],
        'O09-B': [['Fantasma', '¡Mira! ¡En este espejo sí salgo en las fotos!'], [N, 'El espejo revela espectros sonrientes y se convierte en un fotomatón.'], [I, '¡Selfis con fantasmas! ¡Este espejo es el alma de la fiesta!']],
        O10: [[N, 'El hueso gigante se convierte en un trofeo de baile irresistible.'], [I, '¡Ese hueso brilla tanto que ya es la atracción principal!'], [N, 'Lobos y huesudos encuentran entretenimiento alrededor del hueso luminoso.']],
        'O11-A': [['Fantasma', '¡Dejad de pitarme! ¡Solo estaba sirviéndome ponche!'], [N, 'El detector no deja de sonar ante los espectros y rompe el ambiente.'], [I, '¡Ese pitido lleva diez minutos! ¡Que alguien lo apague!']],
        'O11-B': [['Cazafantasmas', '¡Mi detector funciona! ¡Por fin un aparato que no es de cartón!'], [N, 'El cazafantasmas presume de su nuevo detector ante los curiosos.'], [I, '¡Qué demostración más curiosa! ¡Hasta tiene luces!']],
        O12: [[N, 'Suena el radiocasete maldito y comienza una coreografía de ultratumba.'], [I, '¡Esa cinta vieja ha despertado la pista de baile!'], [N, 'El radiocasete encuentra bailarines cadavéricos y la fiesta se anima.']],
        'O13-A': [['Alien', '¡Señal recibida! ¡La galaxia entera está escuchando esta fiesta!'], [N, 'La antena conecta con una emisora espacial de música irresistible.'], [I, '¡Chiquis, la radio del espacio tiene temazos! ¡Subid el volumen!']],
        'O13-B': [['Científico loco', '¡Una antena perfecta para mi experimento de música cuántica!'], [N, 'El científico mejora la antena y proyecta chispas danzantes.'], [I, '¡El invento del científico hasta sintoniza la nevera!']],
        O14: [['Bruja', '¡Flor, por fin un caldero para dos! ¡Remueve tú, que yo bailo!'], [N, 'Dos brujas preparan en el caldero un ponche que cambia de color.'], [I, '¡El catering mágico ha abierto! ¡Y no hay que hacer cola!']],
        'O15-A': [['Fantasma', '¡Por fin unos pastelitos que no se me atraviesan!'], [N, 'Los fantasmas descubren un postre que pueden saborear de verdad.'], [I, '¡Los espectros han aprobado el menú! ¡Hasta repiten!']],
        'O15-B': [[I, '¡Ese pastelito atraviesa el tenedor! ¡Imposible comérselo!'], [N, 'Sin fantasmas que los disfruten, los pastelitos verdes quedan intactos.'], [I, '¿Quién ha traído un postre que se escapa del plato?']],

        L01: [['Hombre lobo', 'Aaaanimaaaal, ¡qué barbaridad! ¡Con esta luna llena me sale el gran número!'], [N, 'La luna llena provoca una transformación espectacular. El público enloquece.'], [I, '¡Mirad cómo se transforma! ¡Esto vale la entrada a la fiesta!']],
        L02: [['Vampiro', 'Sin luna en el cielo, mi elegancia brilla el doble.'], [N, 'La oscuridad de la luna nueva convierte al vampiro en estrella nocturna.'], [I, '¡Ese vampiro sabe aparecer justo en la noche más oscura!']],
        L03: [['Bruja', '¡Luna creciente! ¡La noche ideal para trucos con chispas!'], [N, 'La bruja aprovecha la luna creciente para un hechizo luminoso.'], [I, '¡Ha dibujado una media luna de estrellas sobre la pista!']],
        L04: [['Fantasma', '¡Con luna menguante, mi brillo queda de maravilla!'], [N, 'La luna menguante hace relucir al fantasma entre las ventanas.'], [I, '¡Qué efecto tan bonito! ¡Parece una linterna de otro mundo!']],

        D01: [[N, 'Nebu gruñe. Los visitantes se marchan refunfuñando.'], ['Visitante', '¡Pues me voy a otra fiesta! ¡Seguro que hay mejores galletas!'], [N, 'Puerta cerrada. La fiesta continúa con los que ya están dentro.']],
        D02: [['Visitante', '¡Treinta segundos esperando! ¡Toma huevazo!'], [N, '¡Demasiado tarde! Un huevo impacta en la puerta y arruina el ambiente.'], ['Nebu', '«¡Grruf!» El visitante se larga tras lanzar un huevo. ¡Qué desastre!']],
    };

    HA.TEXTOS = {
        intro: [
            '¡Nebu! ¡Me he olvidado del yugo de cebada! ¡Con lo que les gusta a estos monstruos!',
            'Voy un momento al Scaryfour. Tú vigila la puerta, ¿vale? Que no entre cualquiera… aunque tampoco sé quién estaba invitado.',
            'Fíjate en quién está dentro, en lo que traen y en esa luna. ¡Confío en tu olfato!',
        ],
        mision: 'Claudia vuelve después de 10 decisiones. ¡Mantén viva la fiesta!',
        // comentario de Claudia al volver, por categoría final
        finales: {
            desastre: [
                '¡¿PERO QUÉ HA PASADO AQUÍ?! ¡Si solo he ido a por yugo de cebada!',
                'Nebu... ¿por qué hay invitados saliendo por la ventana?',
            ],
            floja: [
                'Bueno... al menos queda yugo de cebada para mañana.',
                '¿Esto era una fiesta o una reunión de la comunidad de vecinos?',
            ],
            aceptable: [
                '¡No está mal, Nebu! La fiesta sigue viva.',
                'Ambiente correcto. Ahora con el yugo de cebada esto despega.',
            ],
            fieston: [
                '¡Menudo fiestón! ¡Flor, qué ambiente! ¡Nebu, eres la mejor portera!',
                '¡Chiquis, cómo está esto! ¡Nebu, te ganas una salchicha extra!',
            ],
            leyenda: [
                '¡Aaaanimaaaal, qué barbaridad! ¡La Calf Queen te nombra portera oficial del Apocalipsis!',
                '¡Esta fiesta va a salir en Sobrarbe Digital! ¡Nebu, eres una leyenda!',
            ],
        },
        // comentarios especiales que sustituyen o acompañan al final
        especiales: {
            G02: '¡¿UN GRAN AQUELARRE?! ¡Y yo comprando yugo de cebada!',
            G01: '¡Ha habido aquelarre! ¡Sabía que podía confiar en ti!',
            huevos: '¿Cuántos huevos hay en la fachada? ¡Esto parece una tortilla gigante!',
            tope: '¡La popularidad ha tocado techo! Más no cabe.',
        },
        categorias: {
            desastre: { titulo: 'Fiesta arruinada', sub: 'La fiesta no ha sobrevivido a la noche.' },
            floja: { titulo: 'Fiesta floja', sub: 'Más bostezos que sustos.' },
            aceptable: { titulo: 'Fiesta aceptable', sub: 'Nadie se ha aburrido demasiado.' },
            fieston: { titulo: '¡Fiestón!', sub: 'El barrio entero habla de la casa de la Calf Queen.' },
            leyenda: { titulo: 'Leyenda del barrio', sub: 'Esta noche se contará durante siglos.' },
        },
        // estados del medidor cualitativo de ambiente
        ambiente: [
            [0, '¡Se hunde!'],
            [200, 'Se está torciendo'],
            [400, 'Tibia'],
            [600, 'Buen rollo'],
            [750, '¡Fiestón!'],
            [900, '¡Leyenda!'],
        ],
        // pistas del álbum para reglas aún no descubiertas
        pistasAlbum: {
            C: 'Alguien llega por primera vez…',
            L: 'Algo pasa cuando la luna está así…',
            O: 'Algo que alguien trajo…',
            P: 'Dos invitados que se conocen…',
            G: 'Cuando se junta un grupo…',
            D: 'Una decisión en la puerta…',
        },
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = HA;
})(typeof globalThis !== 'undefined' ? globalThis : this);
