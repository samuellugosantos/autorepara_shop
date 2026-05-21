// =====================================================
// DATOS DE GUÍAS EXPANDIDAS
// =====================================================
const guidesData = [
  {
    id: 'g-filtro-aire',
    title: 'Sustitución del filtro de aire',
    description: 'El filtro de aire es uno de los mantenimientos más sencillos y económicos. Un filtro sucio reduce la potencia, aumenta el consumo y puede dañar el sensor MAF. Se recomienda inspeccionarlo cada 15.000 km y sustituirlo cada 30.000 km.',
    icon: 'fa-filter',
    badge: 'free',
    difficulty: 1,
    time: '15 min',
    system: 'Admisión',
    tags: 'admision filtro aire mantenimiento facil',
    tools: ['Destornillador plano (opcional)', 'Trapo limpio', 'Aspirador (recomendado)'],
    parts: ['Filtro de aire OEM o equivalente E-mark (ref. 5Q0-129-620 aprox.)', 'Guantes de nitrilo'],
    steps: [
      {
        title: 'Preparación y acceso',
        desc: 'Abre el capó y localiza la caja de filtro de aire, situada generalmente en la parte delantera izquierda del compartimento motor, junto al radiador. Asegúrate de que el motor esté frío para evitar quemaduras y para que el sensor MAF no esté caliente.',
        note: 'No es necesario elevar el vehículo ni desconectar la batería para este procedimiento.',
        tools: []
      },
      {
        title: 'Desconexión del conducto de admisión',
        desc: 'Afloja la abrazadera de la manguera de admisión que conecta la caja del filtro con el sensor MAF y el cuerpo de aceleración. Algunos modelos usan abrazaderas de tornillo y otros de clip de presión. Separa el conducto con cuidado para no forzar el plástico ni desconectar el conector eléctrico del MAF.',
        note: 'Si el conducto tiene una válvula de recirculación de cárter (PCV) conectada, desconecta también esa manguera fina.',
        tools: ['Destornillador plano']
      },
      {
        title: 'Apertura de la caja del filtro',
        desc: 'La tapa de la caja del filtro se sujeta normalmente con 4 a 6 clips de plástico. Ábrelos con los dedos o con un destornillador plano en palanca suave. Levanta la tapa hacia arriba con cuidado. Algunos diseños tienen un pivote trasero: en ese caso levanta primero por el lado frontal.',
        tools: ['Destornillador plano (opcional)']
      },
      {
        title: 'Extracción del filtro usado',
        desc: 'Extrae el cartucho de filtro con cuidado de no derramar la suciedad acumulada dentro de la caja. Observa el estado del filtro: si está negro o muy gris, ha cumplido su vida útil. Si está ligeramente polvoriento pero el papel del filtro no está roto, podría aguantar algo más. En caso de duda, sustitúyelo siempre.',
        note: 'Aprovecha para limpiar el interior de la caja del filtro con un trapo limpio o aspirador. No usar agua ni disolventes.'
      },
      {
        title: 'Instalación del filtro nuevo',
        desc: 'Coloca el filtro nuevo asegurándote de que encaja perfectamente en la ranura perimetral de la caja. El filtro debe quedar completamente plano y sin arrugas. Un filtro mal asentado puede permitir que el aire pase por los bordes sin filtrar, lo que dañaría el motor. Cierra la tapa y asegura todos los clips.',
        tools: []
      },
      {
        title: 'Reconexión y verificación',
        desc: 'Reconecta el conducto de admisión y aprieta la abrazadera. Si desconectaste alguna manguera de PCV, reconéctala. Arranca el motor y comprueba que no hay ruidos extraños ni fugas de aire. Si el motor parpadea o el ralentí es errático durante unos segundos, es normal: la ECU está aprendiendo el nuevo flujo de aire.',
        note: 'Si tienes un lector OBD-II, puedes borrar posibles códigos P0100-P0103 que pudieran haberse generado si el filtro estaba muy sucio.'
      }
    ]
  },
  {
    id: 'g-maf',
    title: 'Diagnóstico fallo sensor MAF (P0101)',
    description: 'El sensor de flujo de masa de aire (MAF) es fundamental para calcular la mezcla aire/combustible. Cuando falla, el motor pierde potencia, consume más y puede entrar en modo de emergencia. El código P0101 indica que la señal del MAF está fuera de rango.',
    icon: 'fa-stethoscope',
    badge: 'free',
    difficulty: 2,
    time: '30 min',
    system: 'Admisión',
    tags: 'sensor maf diagnostico codigo p0101 admision',
    tools: ['Lector OBD-II', 'Multímetro digital', 'Spray limpiador de MAF', 'Destornillador Torx T20'],
    parts: ['Spray limpiador de sensores MAF (sin residuos)', 'Sensor MAF nuevo (si es necesario)'],
    steps: [
      {
        title: 'Leer los códigos de error',
        desc: 'Conecta el lector OBD-II al puerto de diagnóstico (bajo el volante, lado izquierdo). Lee y anota todos los códigos presentes. P0101 indica "Rango/Rendimiento del Circuito del Sensor de Flujo de Masa de Aire A". Anota también si hay otros códigos relacionados como P0100, P0102, P0103 o P0104.',
        note: 'Un código P0101 junto con P0300 (misfire aleatoria) puede indicar un problema más grave de admisión de aire. Diagnostica siempre el MAF primero.',
        tools: ['Lector OBD-II']
      },
      {
        title: 'Inspección visual del sensor y circuito',
        desc: 'Localiza el sensor MAF en el conducto de admisión, entre la caja del filtro y el cuerpo de aceleración. Inspecciona: (1) el conector eléctrico debe estar bien encajado y sin corrosión, (2) el conducto no debe tener grietas o fisuras que permitan entrar aire sin filtrar, (3) el cableado no debe estar pelado ni apretado.',
        tools: ['Linterna']
      },
      {
        title: 'Limpieza del sensor MAF',
        desc: 'Desconecta el conector eléctrico del MAF. Extrae el sensor del conducto (generalmente 2 tornillos Torx T20). Con el spray limpiador de MAF específico, aplica varias ráfagas cortas sobre el filamento del sensor. NO usar otros limpiadores o disolventes: pueden dañar el filamento. Deja secar 10 minutos al aire antes de reinstalar.',
        note: 'El limpiador de MAF debe ser de tipo "sin residuos". CRC Mass Air Flow Cleaner o similar.',
        tools: ['Spray limpiador de MAF', 'Destornillador Torx T20']
      },
      {
        title: 'Reinstalación y prueba inicial',
        desc: 'Reinstala el sensor en el conducto con los tornillos Torx. Reconecta el conector eléctrico. Borra los códigos de error con el lector OBD-II. Arranca el motor y deja que alcance temperatura de funcionamiento (unos 5 minutos). Realiza una prueba de conducción con aceleraciones moderadas.',
        tools: ['Lector OBD-II']
      },
      {
        title: 'Verificación de la señal del MAF con datos en vivo',
        desc: 'Usando el modo de datos en tiempo real del lector OBD-II, observa el valor del MAF en gramos por segundo (g/s). En ralentí debe estar entre 2 y 5 g/s. A 2.000 rpm sin carga debe ser aproximadamente 15–25 g/s. A plena aceleración puede superar 60 g/s. Si los valores son anómalos o planos después de la limpieza, el sensor está defectuoso.',
        tools: ['Lector OBD-II']
      },
      {
        title: 'Sustitución del sensor (si la limpieza no resuelve)',
        desc: 'Si tras la limpieza el código P0101 regresa o los valores de datos en vivo son incorrectos, el sensor debe sustituirse. Asegúrate de comprar un sensor compatible con el motor EA888 Gen3. Tras la sustitución, borra los códigos y realiza una prueba de conducción completa con varias aceleraciones para que la ECU aprenda los nuevos parámetros.',
        note: 'Algunos sensores aftermarket de baja calidad generan problemas desde el principio. Prioriza referencias OEM o fabricantes reconocidos (Bosch, Delphi, Pierburg).',
        tools: ['Destornillador Torx T20']
      }
    ]
  },
  {
    id: 'g-cuerpo-aceleracion',
    title: 'Limpieza del cuerpo de aceleración',
    description: 'El cuerpo de aceleración electrónico puede acumular suciedad y depósitos de aceite procedentes del sistema PCV, causando ralentí irregular, tirones en la respuesta y luz de avería. La limpieza periódica (cada 40.000–60.000 km) previene estos problemas.',
    icon: 'fa-spray-can',
    badge: 'free',
    difficulty: 2,
    time: '45 min',
    system: 'Admisión',
    tags: 'cuerpo aceleracion limpieza admision mantenimiento',
    tools: ['Spray limpiador de carburadores/cuerpo de aceleración (sin cloruros)', 'Trapo de microfibra', 'Destornillador de punta plana pequeño', 'Lector OBD-II (para adaptación)'],
    parts: ['Spray limpiador de cuerpo de aceleración', 'Guantes de nitrilo'],
    steps: [
      {
        title: 'Preparación — motor frío',
        desc: 'Esta operación debe realizarse con el motor completamente frío. Nunca limpies el cuerpo de aceleración con el motor caliente: el limpiador es inflamable y los plásticos están dilatados. Desconecta el terminal negativo de la batería y espera 5 minutos para que los condensadores se descarguen.',
        note: '¡IMPORTANTE! Al desconectar la batería, la ECU y el cuerpo de aceleración perderán su adaptación. Deberás realizar el proceso de adaptación al final.',
        tools: []
      },
      {
        title: 'Acceso al cuerpo de aceleración',
        desc: 'Localiza el cuerpo de aceleración electrónico, situado en la entrada del colector de admisión. Desconecta el conducto de admisión (abrazadera). Desconecta el conector eléctrico del cuerpo (solenoide de la mariposa). En el EA888 Gen3 no es necesario desmontarlo del colector para la limpieza: puedes limpiar con el cuerpo instalado.',
        tools: ['Destornillador']
      },
      {
        title: 'Limpieza de la mariposa',
        desc: 'Aplica el limpiador en el interior del cuerpo de aceleración en ráfagas cortas. Con un trapo de microfibra limpio (no pelusa), frota suavemente los depósitos negros de las paredes internas y del plato de la mariposa. Gira el plato manualmente para limpiar ambas caras. Repite hasta que el trapo salga limpio. NO usar productos con cloruros ni disolventes fuertes.',
        note: 'El recubrimiento del cuerpo de aceleración es delicado. No uses cepillos metálicos ni estropajos abrasivos.',
        tools: ['Spray limpiador', 'Trapo de microfibra']
      },
      {
        title: 'Reconexión y adaptación del cuerpo de aceleración',
        desc: 'Reconecta todos los conductos y el conector eléctrico. Reconecta la batería. Arranca el motor — puede que el ralentí sea irregular durante 1–2 minutos mientras la ECU restablece los parámetros de base.',
        tools: []
      },
      {
        title: 'Adaptación con VAG-COM / VCDS (recomendado)',
        desc: 'Para un resultado óptimo, realiza la adaptación del cuerpo de aceleración con un lector que soporte funciones avanzadas VAG (VCDS, OBD Eleven, ODIS): Grupo Motor > Adaptación > "Cuerpo de aceleración". Este proceso tarda menos de 2 minutos y garantiza que la mariposa se posiciona correctamente en todo el rango.',
        note: 'Sin la adaptación, la ECU tardará varios ciclos de conducción en recalibrar. La adaptación manual acelera el proceso considerablemente.',
        tools: ['Lector OBD-II compatible VAG']
      }
    ]
  },
  {
    id: 'g-aceite',
    title: 'Cambio de aceite y filtro (VW 504/507)',
    description: 'El cambio de aceite es el mantenimiento más importante de cualquier motor. En el EA888 Gen3 hay que usar aceite de especificación VW 504.00 / 507.00 obligatoriamente. Un aceite inadecuado puede dañar el catalizador, el sistema de distribución y provocar el conocido problema de cadena ruidosa.',
    icon: 'fa-oil-can',
    badge: 'free',
    difficulty: 2,
    time: '45 min',
    system: 'Lubricación',
    tags: 'aceite cambio filtro lubricacion mantenimiento vag ea888',
    tools: ['Gato hidráulico y borriquetas o rampa', 'Llave de 32mm (para tapa de filtro)', 'Herramienta de tapón de cárter (plástico, cuadrado 3/8")', 'Cubo de drenaje (5L)', 'Embudo', 'Trapos', 'Guantes resistentes al aceite'],
    parts: ['4,9 L de aceite VW 504.00/507.00 0W-30 o 5W-30 long-life', 'Filtro de aceite cartucho (con juntas)', 'Tapón de drenaje de cárter nuevo (plástico, sustituir en cada cambio)'],
    steps: [
      {
        title: 'Calentamiento del aceite y preparación',
        desc: 'El aceite drena mejor cuando está caliente (o templado). Si el motor estaba frío, arráncalo 5 minutos. Apaga el motor y espera 10 minutos para que el aceite baje al cárter pero no esté demasiado caliente. Eleva el vehículo con el gato y asegúralo sobre borriquetas. NUNCA trabajes bajo un coche sostenido solo por el gato hidráulico.',
        tools: ['Gato hidráulico', 'Borriquetas']
      },
      {
        title: 'Retirada del protector del cárter',
        desc: 'El León FR lleva un protector plástico bajo el motor sujeto con tornillos de plástico o remaches. Retíralo para acceder al tapón de drenaje del cárter y a la tapa del filtro de aceite. Guarda todos los tornillos en un lugar seguro.',
        tools: ['Destornillador o llave adecuada']
      },
      {
        title: 'Drenaje del aceite',
        desc: 'Coloca el cubo de drenaje bajo el tapón del cárter. El tapón de drenaje del EA888 es de plástico y necesita una herramienta de cuadrado 3/8" o una herramienta específica VAG (T10204). Gíralo 90° en sentido antihorario para abrirlo. NUNCA uses una llave inglesa: dañarías el tapón. Deja drenar completamente (5–10 minutos).',
        note: 'El tapón de drenaje de plástico del EA888 es de un solo uso o de uso limitado. Se recomienda sustituir en cada cambio (coste aprox. 3–5€).',
        tools: ['Herramienta tapón cárter VAG', 'Cubo de drenaje']
      },
      {
        title: 'Sustitución del filtro de aceite',
        desc: 'La tapa del filtro de aceite (cartucho) está en la parte superior del motor, accesible desde arriba. Usa la llave de 32mm para aflojarla en sentido antihorario. Retira la tapa con cuidado — habrá aceite dentro del cartucho. Deja que el aceite del cartucho drene antes de sacarlo. Extrae el cartucho de filtro usado.',
        note: 'El kit de filtro incluye siempre juntas tóricas nuevas para el tapón de la tapa. Sustituye SIEMPRE estas juntas. Lubrica ligeramente las juntas nuevas con aceite nuevo antes de montar.',
        tools: ['Llave de 32mm']
      },
      {
        title: 'Montaje del filtro nuevo y tapón de cárter',
        desc: 'Introduce el cartucho de filtro nuevo en la tapa. Monta las juntas tóricas nuevas lubricadas. Enrosca la tapa a mano hasta que asiente y luego aprieta con la llave de 32mm al par especificado (25 Nm). Instala el tapón de cárter nuevo girándolo 90° en sentido horario hasta que encaje. No fuerces: es plástico.',
        tools: ['Llave de 32mm', 'Dinamométrica (recomendado)']
      },
      {
        title: 'Rellenado de aceite y verificación',
        desc: 'Introduce el embudo en el tapón de llenado de aceite (parte superior del motor, tapón de plástico negro). Añade 4,5 L de aceite VW 504/507 inicialmente. Arranca el motor 30 segundos y apágalo. Espera 2 minutos y comprueba el nivel con la varilla: debe estar entre el mínimo y el máximo. Añade el 0,4 L restante si es necesario. Comprueba que no hay fugas por el tapón del cárter ni por el filtro. Restablece el intervalo de mantenimiento en el cuadro de instrumentos.',
        note: 'El aceite usado es un residuo peligroso. Deposítalo en el punto de recogida habilitado de tu municipio o taller. Nunca lo viertas en desagüe o suelo.',
        tools: ['Embudo', 'Trapos']
      }
    ]
  },
  {
    id: 'g-purga-refrigeracion',
    title: 'Purga del sistema de refrigeración VAG',
    description: 'El sistema de refrigeración del EA888 requiere un procedimiento de purga específico para eliminar bolsas de aire, especialmente tras cambiar el refrigerante, el termostato, la bomba de agua o cualquier manguito. El aire atrapado causa sobrecalentamiento y calefacción deficiente.',
    icon: 'fa-temperature-half',
    badge: 'free',
    difficulty: 3,
    time: '1h 30 min',
    system: 'Refrigeración',
    tags: 'refrigeracion purga procedimiento vag coolant',
    tools: ['Embudo de purga VAG (T10007 o adaptador universal)', 'Cubo para refrigerante', 'Guantes resistentes a productos químicos', 'Gafas protectoras'],
    parts: ['Refrigerante VW G13 (lila/violeta) — No mezclar con otros tipos', 'Agua destilada (relación 40–60% refrigerante)', 'Tapón de depósito de expansión (si está deteriorado)'],
    steps: [
      {
        title: 'Preparación — motor completamente frío',
        desc: 'Este procedimiento debe realizarse con el motor completamente frío (al menos 4 horas desde el último uso). El sistema de refrigeración está a presión cuando está caliente: abrir el depósito de expansión en caliente puede causar quemaduras graves. Abre el capó y prepara el entorno de trabajo.',
        note: '⚠️ Nunca abras el tapón del depósito de expansión con el motor caliente. La presión puede proyectar refrigerante hirviendo.',
        tools: []
      },
      {
        title: 'Vaciado del sistema (si es cambio de refrigerante)',
        desc: 'Si vas a cambiar el refrigerante completo, localiza el tapón de vaciado del radiador (parte inferior del radiador, suele ser de mariposa o requiere una llave). Coloca el cubo debajo y abre el tapón. Si no hay tapón de vaciado, desconecta el manguito inferior del radiador con cuidado. Deja drenar completamente.',
        tools: ['Cubo para refrigerante']
      },
      {
        title: 'Instalación del embudo de purga',
        desc: 'El método de purga VAG más efectivo usa un embudo adaptador (T10007) que se atornilla en el cuello del depósito de expansión en lugar del tapón normal. Este embudo permite añadir refrigerante manteniendo la apertura hacia arriba, lo que facilita la salida del aire. Si no tienes el adaptador VAG, puedes usar un embudo universal con un cuello largo.',
        note: 'Existen kits de purga universales que incluyen adaptadores para diferentes modelos VAG por menos de 20€.',
        tools: ['Embudo de purga VAG T10007']
      },
      {
        title: 'Relleno y eliminación de aire',
        desc: 'Mezcla el refrigerante G13 con agua destilada en proporción 50/50 (o según las instrucciones del fabricante para tu clima). Vierte la mezcla lentamente por el embudo de purga hasta que el nivel esté en la marca MAX. Arranca el motor y mantenlo al ralentí. Irás viendo cómo el nivel baja en el embudo al entrar refrigerante al sistema. Sigue añadiendo refrigerante para mantener el nivel.',
        tools: ['Embudo de purga', 'Mezcla de refrigerante G13']
      },
      {
        title: 'Ciclo de temperatura y comprobación del termostato',
        desc: 'Con el motor en marcha, sube las calefacción al máximo y el ventilador al mínimo. Deja que el motor alcance la temperatura normal (90°C en el indicador). El termostato se abrirá y el refrigerante comenzará a circular por el radiador. Notarás que el nivel en el embudo baja de nuevo — añade refrigerante. Comprueba que el calefactor del habitáculo comienza a dar calor: si no da calor, hay bolsas de aire que no han salido.',
        tools: ['Embudo de purga']
      },
      {
        title: 'Finalización y verificación de fugas',
        desc: 'Una vez el motor alcanza temperatura, revisa que no hay burbujas significativas en el embudo de purga. Retira el embudo e instala el tapón del depósito. Comprueba todos los manguitos y uniones que hayas manipulado. Deja enfriar el motor completamente y verifica el nivel de refrigerante en frío: debe estar entre MIN y MAX. Ajusta si es necesario.',
        note: 'Si el refrigerante tiene burbujas persistentes que no desaparecen, puede haber una fuga de gases de combustión al circuito de refrigeración (junta de culata). Esto requiere diagnóstico profesional.'
      }
    ]
  },
  {
    id: 'g-termostato',
    title: 'Sustitución del termostato EA888',
    description: 'El termostato de mapa del EA888 Gen3 es un componente electrónico que puede fallar quedándose abierto (motor que no calienta) o cerrado (sobrecalentamiento). La sustitución requiere el drenaje parcial del circuito de refrigeración.',
    icon: 'fa-gauge',
    badge: 'pro',
    difficulty: 3,
    time: '2h',
    system: 'Refrigeración',
    tags: 'termostato sustitucion drenaje refrigeracion',
    tools: ['Gato hidráulico y borriquetas', 'Llaves de vaso y extensión', 'Alicates para abrazaderas', 'Cubo para refrigerante (3L)', 'Embudo de purga VAG', 'Torquímetro'],
    parts: ['Termostato OEM EA888 Gen3 (incluye junta)', 'Refrigerante G13 para reponer', 'Abrazaderas nuevas (si son de tipo original)'],
    steps: [
      {
        title: 'Diagnóstico previo — confirmar el fallo del termostato',
        desc: 'Antes de sustituir el termostato, confirma el fallo con datos de diagnóstico. Con el lector OBD-II, comprueba la temperatura de refrigerante en tiempo real. Si tras 10 minutos de conducción normal el indicador no sube más allá de 70–75°C, el termostato está encallado abierto. Si el indicador supera 100°C o se activa la luz de temperatura, puede estar encallado cerrado o haber otro fallo. Busca también los códigos P0597, P0598, P0599 específicos del termostato.',
        tools: ['Lector OBD-II']
      },
      {
        title: 'Localización y acceso',
        desc: 'El termostato del EA888 Gen3 se encuentra integrado en la carcasa de la bomba de agua, en el lado del bloque motor. Según la variante exacta del motor y año, puede estar más o menos accesible. En el SEAT León FR, el acceso se mejora levantando el vehículo por el lado del conductor y retirando el protector inferior.',
        tools: ['Gato hidráulico', 'Borriquetas']
      },
      {
        title: 'Drenaje parcial del refrigerante',
        desc: 'Coloca el cubo bajo el tapón de vaciado del radiador. Abre el tapón y deja drenar aproximadamente 2–3 litros para bajar el nivel del sistema y poder trabajar sin derramar demasiado refrigerante. Cierra el tapón una vez hecho el drenaje parcial.',
        tools: ['Cubo para refrigerante']
      },
      {
        title: 'Desconexión de manguitos y extracción del termostato',
        desc: 'Afloja las abrazaderas de los manguitos conectados al alojamiento del termostato. Retira los manguitos con cuidado (saldrá algo de refrigerante residual). Extrae los tornillos de la carcasa del termostato (generalmente 2–3 tornillos M6). Retira la carcasa y extrae el termostato.',
        note: 'Limpia muy bien la superficie de asiento de la junta antes de instalar el nuevo termostato. Cualquier impureza puede causar fugas.',
        tools: ['Llaves de vaso', 'Alicates para abrazaderas']
      },
      {
        title: 'Instalación del termostato nuevo',
        desc: 'Instala el termostato nuevo con su junta en la posición correcta (hay una pestaña o marca de alineación). Monta la carcasa y aprieta los tornillos al par especificado (tipicamente 10 Nm). Reconecta los manguitos y asegura las abrazaderas. Rellena el refrigerante y realiza el procedimiento de purga del sistema.',
        tools: ['Llaves de vaso', 'Torquímetro']
      },
      {
        title: 'Purga y verificación',
        desc: 'Realiza el procedimiento de purga completo (ver guía de purga). Una vez purgado, comprueba con el lector OBD-II que la temperatura de refrigerante sube hasta aproximadamente 90°C y se estabiliza. Verifica que el calefactor funciona correctamente. Comprueba que no hay fugas alrededor de la carcasa del termostato.',
        tools: ['Lector OBD-II', 'Embudo de purga']
      }
    ]
  },
  {
    id: 'g-sobrecalentamiento',
    title: 'Diagnóstico de sobrecalentamiento',
    description: 'El sobrecalentamiento es una de las situaciones más peligrosas para un motor. Un EA888 que supera los 110°C de refrigerante puede sufrir daños en la culata o junta de culata. Este diagnóstico sistemático te ayuda a encontrar la causa antes de causar daño irreparable.',
    icon: 'fa-fire',
    badge: 'free',
    difficulty: 2,
    time: '1h',
    system: 'Refrigeración',
    tags: 'sobrecalentamiento diagnostico temperatura refrigeracion',
    tools: ['Lector OBD-II', 'Linterna', 'Tiras de prueba de combustión (detector de gases)'],
    parts: [],
    steps: [
      {
        title: 'Parar el vehículo con seguridad',
        desc: 'Si el indicador de temperatura está en rojo o la luz de advertencia se enciende, detén el vehículo en el lugar seguro más próximo, apaga el motor y NO abras el capó todavía. Espera al menos 15 minutos antes de abrir. Nunca abras el tapón del depósito de expansión con el motor caliente.',
        note: '⚠️ Un motor sobrecalentado puede provocar daños graves si se apaga abruptamente a alta carga. Si puedes, reduce la marcha y baja la carga gradualmente antes de detenerte.'
      },
      {
        title: 'Inspección visual inicial',
        desc: 'Cuando el motor esté templado (no frío, no caliente), abre el capó. Busca: (1) fugas de refrigerante visibles en manguitos, radiador o uniones, (2) nivel bajo en el depósito de expansión, (3) aceite emulsionado (color café con leche) en el tapón del aceite — indicador de mezcla de aceite y refrigerante (junta de culata).',
        tools: ['Linterna']
      },
      {
        title: 'Comprobación del ventilador del radiador',
        desc: 'Con el motor en marcha y alcanzando temperatura (90°C), comprueba que el ventilador eléctrico del radiador se activa. Si el indicador supera 90°C y el ventilador no gira, el problema puede estar en el ventilador, su relé o el módulo de control. El ventilador debe activarse claramente antes de llegar a 100°C.',
        tools: ['Lector OBD-II (para ver temperatura en tiempo real)']
      },
      {
        title: 'Verificación del termostato',
        desc: 'Con el motor frío, palpa el manguito inferior del radiador. Arranca el motor. El manguito inferior debe estar frío inicialmente (termostato cerrado). A medida que el motor calienta (aprox. 85–90°C), el manguito inferior debe comenzar a calentarse bruscamente (termostato abre). Si el manguito inferior ya está caliente con el motor frío, el termostato está encallado abierto. Si nunca se calienta, puede estar encallado cerrado.',
        tools: ['Termómetro infrarrojo (opcional pero muy útil)']
      },
      {
        title: 'Detección de fuga de gases al circuito de refrigeración',
        desc: 'Si sospechas de una junta de culata dañada, usa las tiras de prueba de combustión (block check fluid). Quita el tapón del depósito de expansión con el motor frío. Introduce las tiras sobre el depósito y haz correr el motor. Si el refrigerante contiene gases de combustión (CO2), las tiras cambiarán de color (de azul a amarillo/verde). Este es el indicativo más fiable de una junta de culata en mal estado.',
        note: 'Si la prueba de gases es positiva, detén el uso del vehículo inmediatamente. Continuar conduciendo con una junta de culata dañada puede destruir el motor por completo.',
        tools: ['Tiras de prueba de combustión', 'Linterna']
      },
      {
        title: 'Plan de acción según diagnóstico',
        desc: 'Según lo encontrado: (A) Fuga de refrigerante visible → localiza y repara la fuga, rellenra y purga el circuito. (B) Ventilador no funciona → revisa fusibles, relé y motor del ventilador. (C) Termostato defectuoso → sustituir (ver guía). (D) Gases de combustión en refrigerante → junta de culata, acudir a taller especializado. (E) Sin causa aparente → puede ser un sensor de temperatura defectuoso (código P0116–P0119).',
        tools: ['Lector OBD-II']
      }
    ]
  },
  {
    id: 'g-ruido-cadena',
    title: 'Diagnóstico de ruido de cadena EA888',
    description: 'El ruido de cadena en arranque frío es el síntoma más conocido del EA888. El cascabeleo metálico en los primeros 1–3 segundos del arranque es una señal de que el tensor hidráulico tarda en activarse o de que la cadena tiene holgura excesiva. Este diagnóstico determina la urgencia de la sustitución.',
    icon: 'fa-link',
    badge: 'pro',
    difficulty: 3,
    time: '1h',
    system: 'Distribución',
    tags: 'cadena distribucion diagnostico ruido ea888 vag',
    tools: ['Lector OBD-II (con función de datos avanzados VAG)', 'Endoscopio o cámara boroscópica (muy recomendable)', 'Estetoscopio mecánico'],
    parts: [],
    steps: [
      {
        title: 'Caracterización del ruido',
        desc: 'El ruido de cadena del EA888 es un cascabeleo metálico agudo que ocurre en los primeros 1–5 segundos del arranque en frío y desaparece completamente cuando el motor calienta. Se distingue de otros ruidos por: (1) desaparece al subir las RPM, (2) se localiza en la zona trasera del motor (lado de la distribución, lado izquierdo del vehículo en el EA888), (3) es más pronunciado cuanto más frío esté el motor.',
        note: 'Si el ruido es constante y no desaparece al calentar, puede ser un problema diferente (bomba de aceite, varilla de empuje, etc.). Consulta a un mecánico.'
      },
      {
        title: 'Documentación del historial del vehículo',
        desc: 'Antes de actuar, revisa el historial de mantenimiento del vehículo. Las preguntas clave son: ¿Cuándo fue el último cambio de aceite? ¿Se ha usado siempre aceite VW 504/507? ¿Cuántos km tiene el vehículo? Los motores EA888 anteriores a 2017 con más de 80.000 km y sin mantenimiento riguroso tienen mayor riesgo de desgaste de cadena.',
        note: 'Un aceite genérico o fuera de especificación puede acelerar el desgaste del tensor y la cadena dramáticamente.'
      },
      {
        title: 'Lectura de códigos de error relacionados',
        desc: 'Conecta el lector OBD-II y busca códigos relacionados con la distribución: P0011 (árbol de levas de admisión avanzado), P0012 (árbol de levas de admisión retrasado), P0021/P0022 (árbol de levas de escape), P0016 (correlación cigüeñal/árbol de levas). Estos códigos indican desfase de distribución que puede ser consecuencia de una cadena estirada.',
        tools: ['Lector OBD-II']
      },
      {
        title: 'Inspección con boroscopio (si disponible)',
        desc: 'La inspección más directa se hace introduciendo un boroscopio por el tapón de la cabeza de válvulas o por el agujero de la bujía (con la bujía retirada). Puede observarse el estado de la cadena, las guías y el tensor. Una cadena que tiene holgura visible o guías con desgaste evidente confirman la necesidad de sustitución.',
        tools: ['Endoscopio / boroscopio']
      },
      {
        title: 'Evaluación y decisión',
        desc: 'Basándote en el diagnóstico: (A) Ruido leve < 2 seg, sin códigos, motor bien mantenido → monitorizar, cambiar aceite inmediatamente si no es reciente, verificar en 5.000 km. (B) Ruido > 3 seg, con códigos P001x → programar sustitución de cadena completa próximamente. (C) Ruido constante o muy pronunciado, con múltiples códigos → no usar el vehículo hasta sustituir la distribución. El coste de sustitución de cadena (piezas + mano de obra) oscila entre 800 y 1.500€. El coste de un motor destruido por salto de cadena es de 3.000–8.000€. La decisión es clara.',
        note: 'La sustitución de la cadena de distribución del EA888 es una operación que requiere desmontaje parcial del motor y se recomienda realizarla en un taller con experiencia VAG.'
      }
    ]
  },
  {
    id: 'g-cuando-cadena',
    title: 'Cuándo sustituir la cadena de distribución',
    description: 'Análisis técnico y económico para ayudarte a tomar la decisión más informada sobre la cadena de distribución del EA888 Gen3. Factores de riesgo, síntomas y umbrales de intervención.',
    icon: 'fa-chart-line',
    badge: 'free',
    difficulty: 1,
    time: 'Lectura 10 min',
    system: 'Distribución',
    tags: 'cadena sustitucion coste beneficio analisis distribucion',
    tools: [],
    parts: [],
    steps: [
      {
        title: 'El problema del EA888 con la cadena',
        desc: 'El motor EA888 Gen3 en versiones fabricadas antes de 2017 tiene un problema conocido y documentado de desgaste prematuro de la cadena de distribución. Volkswagen AG reconoció el problema y publicó varias actualizaciones de software (TSB — Technical Service Bulletins) y revisiones del diseño de la cadena a partir de 2016. Los motores posteriores a 2017 tienen una cadena mejorada y el problema es significativamente menor.',
        note: 'Si tu vehículo es posterior a 2017 y no ha presentado síntomas, no es necesaria una revisión urgente. Sigue el mantenimiento recomendado.'
      },
      {
        title: 'Factores de riesgo: ¿cuándo debes preocuparte?',
        desc: 'Los factores que aumentan el riesgo de fallo de cadena en el EA888 son: (1) Motor fabricado antes de 2017, (2) Más de 100.000 km, (3) Historial de cambios de aceite irregulares o con aceite fuera de especificación VW 504/507, (4) Ruido de cascabeleo en arranque frío de más de 2 segundos, (5) Códigos OBD relacionados con desfase de distribución (P0011, P0012, P0016, P0021, P0022).'
      },
      {
        title: 'Síntomas progresivos: escala de urgencia',
        desc: 'La degradación de la cadena sigue un patrón progresivo. Nivel 1 (monitorizar): Ruido de arranque < 1 segundo, sin códigos, aceite en buen estado. Nivel 2 (planificar sustitución): Ruido de arranque de 2–3 segundos, algún código de distribución puntual, >100.000 km. Nivel 3 (no conducir / sustituir urgente): Ruido de arranque > 3–4 segundos, múltiples códigos de distribución persistentes, luz de motor encendida permanente. El paso del nivel 1 al nivel 3 puede ocurrir en pocos meses si el motor trabaja en condiciones de estrés o con aceite degradado.'
      },
      {
        title: 'Análisis coste-beneficio',
        desc: 'El kit de sustitución de cadena completa (cadena, tensor, guías, piñones) cuesta entre 150 y 400€ en recambio. La mano de obra para el EA888 es de 6–10 horas dependiendo del taller, lo que se traduce en 600–1.200€ más IVA. Total aproximado: 800–1.600€. Comparado con el coste de un motor destruido (colisión de válvulas): 3.000–8.000€ sin contar el tiempo sin vehículo y los costes adicionales. La sustitución preventiva es siempre la opción económicamente más sensata cuando hay síntomas claros.',
        note: 'Si el vehículo tiene más de 150.000 km y va a someterse a una reparación mayor (culata, embrague, etc.), es muy recomendable sustituir la cadena de distribución de forma preventiva aprovechando el desmontaje.'
      },
      {
        title: 'Recomendación final y prevención',
        desc: 'La mejor prevención es: (1) Usar siempre aceite VW 504.00/507.00 de calidad (Castrol Edge 0W-30, Mobil 1 ESP, Liqui-Moly Longlife III). (2) Respetar el intervalo de cambio de aceite: máximo 15.000 km o 12 meses. (3) Calentar el motor progresivamente — no hacer esfuerzos a alta RPM con el motor frío. (4) Escuchar el arranque en frío cada mañana. Si el cascabeleo aumenta en duración, actuar. (5) Realizar diagnóstico OBD-II preventivo una vez al año. Un mantenimiento riguroso puede hacer que la cadena dure los 200.000 km sin problemas, incluso en los motores pre-2017 más susceptibles.'
      }
    ]
  }
];



// =====================================================
// VEHÍCULOS EUROPEOS — EJEMPLOS COMUNES
// =====================================================
const euroVehicles = [
  {
    name: 'Volkswagen Golf 1.5 TSI', label: 'Compacto · Grupo VAG', engine: 'EA211 evo', displacement: '1.498 cc', power: '130–150 cv', torque: '200–250 Nm', timing: 'Correa bañada / cadena según versión', oil: 'VW 508/509 0W-20', transmission: 'Manual 6v / DSG7', emissions: 'Euro 6d', repair: 7.1,
    strengths: 'Amplia disponibilidad de recambios, diagnóstico OBD sencillo y gran comunidad técnica europea.', warnings: 'Vigilar bobinas, actuadores de turbo, sistema ACT y mantenimiento estricto de aceite.'
  },
  {
    name: 'Peugeot 308 1.2 PureTech', label: 'Compacto · Stellantis', engine: 'EB2DT / EB2ADTS', displacement: '1.199 cc', power: '110–130 cv', torque: '205–230 Nm', timing: 'Correa húmeda', oil: 'PSA B71 2010 0W-30', transmission: 'Manual / EAT8', emissions: 'Euro 6d', repair: 6.0,
    strengths: 'Motor ligero, acceso razonable a mantenimiento básico y consumibles económicos.', warnings: 'Controlar desgaste de correa húmeda, consumo de aceite y restos de goma en el circuito de lubricación.'
  },
  {
    name: 'Renault Mégane 1.3 TCe', label: 'Compacto · Renault/Nissan/Mercedes', engine: 'H5Ht / HR13DDT', displacement: '1.333 cc', power: '115–160 cv', torque: '220–270 Nm', timing: 'Cadena', oil: 'RN17 5W-30', transmission: 'Manual / EDC', emissions: 'Euro 6d', repair: 6.8,
    strengths: 'Arquitectura moderna con cadena, buen equilibrio entre prestaciones y mantenimiento.', warnings: 'Revisar bobinas, sensores de presión, fugas menores y calidad del aceite en uso urbano.'
  },
  {
    name: 'Ford Focus 1.0 EcoBoost', label: 'Compacto · Ford Europa', engine: 'Fox EcoBoost', displacement: '999 cc', power: '100–155 cv', torque: '170–240 Nm', timing: 'Correa húmeda', oil: 'WSS-M2C948-B / 5W-20', transmission: 'Manual / automática', emissions: 'Euro 6d', repair: 5.9,
    strengths: 'Muy común en Europa, piezas abundantes y mantenimiento básico accesible.', warnings: 'Atención crítica a correa húmeda, refrigeración, manguitos y uso de aceite con especificación exacta.'
  },
  {
    name: 'Toyota Corolla 1.8 Hybrid', label: 'Híbrido · Toyota', engine: '2ZR-FXE', displacement: '1.798 cc', power: '122–140 cv sist.', torque: 'Híbrido e-CVT', timing: 'Cadena', oil: '0W-16 / 0W-20', transmission: 'e-CVT', emissions: 'Euro 6d', repair: 7.8,
    strengths: 'Alta fiabilidad, pocos elementos de desgaste en transmisión y mantenimiento previsible.', warnings: 'Trabajar con protocolo de alta tensión; algunas reparaciones híbridas deben hacerlas técnicos cualificados.'
  },
  {
    name: 'BMW Serie 3 320d', label: 'Berlina · BMW', engine: 'B47D20', displacement: '1.995 cc', power: '150–190 cv', torque: '350–400 Nm', timing: 'Cadena trasera', oil: 'BMW LL-04 5W-30', transmission: 'Manual / ZF 8HP', emissions: 'Euro 6d', repair: 6.2,
    strengths: 'Buena documentación, gran oferta aftermarket y motor eficiente para alto kilometraje.', warnings: 'Acceso complejo a distribución trasera, EGR, AdBlue/NOx y componentes de anticontaminación.'
  }
];

function renderEuroVehicles() {
  const grid = document.getElementById('euro-vehicles-grid');
  if (!grid) return;
  grid.innerHTML = euroVehicles.map(v => `
    <div class="euro-vehicle-card">
      <div class="vehicle-mini-label">${v.label}</div>
      <h3>${v.name}</h3>
      <p style="color:var(--text-secondary);font-size:13px;line-height:1.6">${v.strengths}</p>
      <div class="vehicle-spec-list">
        <span><strong>Motor:</strong> ${v.engine}</span>
        <span><strong>Cilindrada:</strong> ${v.displacement}</span>
        <span><strong>Potencia:</strong> ${v.power}</span>
        <span><strong>Par:</strong> ${v.torque}</span>
        <span><strong>Distribución:</strong> ${v.timing}</span>
        <span><strong>Aceite:</strong> ${v.oil}</span>
        <span><strong>Cambio:</strong> ${v.transmission}</span>
        <span><strong>Emisiones:</strong> ${v.emissions}</span>
      </div>
      <div class="alert alert-warning" style="margin:0"><i class="fa-solid fa-triangle-exclamation"></i><div>${v.warnings}</div></div>
      <div class="vehicle-score-inline">
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);text-transform:uppercase">Reparabilidad</span>
        <strong>${v.repair.toFixed(1)}/10</strong>
      </div>
      <div class="score-track" style="margin-top:10px"><div class="score-fill-row" style="width:${v.repair * 10}%"></div></div>
    </div>
  `).join('');
}

// =====================================================
// TIENDA — HERRAMIENTAS Y KITS
// =====================================================
const shopProducts = [
  { id:'kit-basico-reparacion', name:'Kit básico AutoRepara 42 piezas', category:'kits', price:34.90, sizes:['42 piezas','68 piezas','96 piezas'], keywords:'kit basico reparación herramientas carraca vasos puntas', desc:'Kit pensado para mantenimiento doméstico serio: carraca compacta, vasos métricos habituales, puntas Torx/Allen/Phillips y adaptadores. Seleccionado para cubrir filtros, tapas, abrazaderas y trabajos de interior sin comprar herramientas sueltas. Estuche rígido, piezas marcadas y garantía de sustitución ante defecto de fabricación.', features:['Acero Cr-V','Estuche ordenado','Uso principiante'] },
  { id:'destornillador-plano', name:'Destornillador plano de precisión reforzado', category:'manuales', price:4.95, sizes:['3x75 mm','5x100 mm','6x150 mm'], keywords:'destornillador plano filtro aire abrazaderas grapas', desc:'Punta endurecida y mango antideslizante para soltar grapas, tapas de filtro y abrazaderas ligeras sin dañar plásticos. Es una herramienta básica pero elegida con varilla resistente y buena ergonomía para trabajar con control.', features:['Punta magnética','Mango bimaterial','Garantía 2 años'] },
  { id:'trapo-microfibra', name:'Pack de microfibras técnicas', category:'limpieza', price:6.50, sizes:['Pack 5','Pack 10','Pack 20'], keywords:'trapo limpio microfibra limpieza motor admision aceite', desc:'Microfibra densa para limpiar alojamientos, varillas, tapas y restos de aceite o polvo. No suelta pelusa y puede lavarse varias veces, ideal para trabajos de admisión, lubricación y acabado antes de cerrar componentes.', features:['Sin pelusa','Lavable','Alta absorción'] },
  { id:'aspirador-taller', name:'Aspirador compacto para taller', category:'electricas', price:49.90, sizes:['12 L','18 L','25 L'], keywords:'aspirador polvo caja filtro aire taller', desc:'Aspirador seco/húmedo para retirar suciedad de cajas de filtro, moquetas y zonas de trabajo. Incluye boquilla estrecha para compartimento motor y filtro lavable. Precio ajustado para usuarios que necesitan fiabilidad sin pagar por potencia industrial innecesaria.', features:['Seco/húmedo','Filtro lavable','Boquilla fina'] },
  { id:'lector-obd2', name:'Lector OBD-II AutoRepara Scan', category:'diagnostico', price:24.90, sizes:['Bluetooth','USB','WiFi'], keywords:'lector obd obd2 diagnóstico códigos p0101 p0011 temperatura refrigerante', desc:'Lector OBD-II compatible con apps habituales para leer y borrar códigos, revisar datos en vivo y comprobar temperatura, caudal de aire o fallos de distribución. Incluye guía rápida en español y tabla de códigos frecuentes.', features:['Datos en vivo','Guía española','Compacto'] },
  { id:'gato-hidraulico', name:'Gato hidráulico perfil bajo', category:'elevacion', price:64.90, sizes:['2 T','2.5 T','3 T'], keywords:'gato hidráulico elevador levantar coche perfil bajo', desc:'Gato de perfil bajo para compactos europeos con faldones deportivos. Ruedas metálicas, válvula de seguridad y plato con goma. Recomendado siempre junto con borriquetas; no se vende como sustituto de apoyo seguro.', features:['Perfil bajo','Válvula seguridad','Plato goma'] },
  { id:'borriquetas', name:'Juego de borriquetas reforzadas', category:'elevacion', price:29.90, sizes:['2 T par','3 T par','6 T par'], keywords:'borriquetas caballetes seguridad elevación coche', desc:'Par de borriquetas con trinquete de bloqueo y base estable. Imprescindibles para trabajar bajo el vehículo con seguridad después de elevarlo con gato. Etiquetado visible de carga y acabado resistente a golpes.', features:['Par incluido','Bloqueo trinquete','Base ancha'] },
  { id:'llaves-vaso', name:'Juego de llaves de vaso métricas', category:'manuales', price:22.90, sizes:['1/4” 4-14 mm','3/8” 8-22 mm','1/2” 10-32 mm'], keywords:'llaves de vaso carraca tornillos termostato filtro aceite', desc:'Vasos métricos de acero cromo-vanadio con marcaje grande. Diseñado para mantenimiento de motor, tapas, termostatos y soportes. La selección evita medidas poco usadas y prioriza las más comunes en coches europeos.', features:['Cr-V','Marcaje grande','Métrico'] },
  { id:'torquimetro', name:'Torquímetro calibrado', category:'precision', price:39.90, sizes:['5-25 Nm','20-110 Nm','40-210 Nm'], keywords:'torquímetro llave dinamométrica par apriete tornillos aceite ruedas', desc:'Llave dinamométrica para apretar al par correcto y evitar roscas pasadas o fugas. Cada unidad se entrega con certificado de comprobación y estuche. Muy recomendable para termostatos, filtros de aceite, bujías y ruedas.', features:['Certificado','Click audible','Estuche'] },
  { id:'alicates-abrazaderas', name:'Alicates para abrazaderas de manguito', category:'manuales', price:13.90, sizes:['Recto','45°','Cable flexible'], keywords:'alicates abrazaderas manguitos refrigeración termostato', desc:'Alicates específicos para abrazaderas elásticas de refrigeración y admisión. Evitan pellizcos, reducen tiempo de desmontaje y permiten trabajar en zonas estrechas sin dañar el manguito.', features:['Agarre seguro','Zonas estrechas','Acero templado'] },
  { id:'cubo-refrigerante', name:'Cubo graduado para refrigerante/aceite', category:'fluidos', price:8.90, sizes:['5 L','8 L','12 L'], keywords:'cubo refrigerante aceite drenaje fluidos graduado', desc:'Recipiente graduado con pico de vertido para drenar refrigerante o aceite usado con menos derrames. Plástico resistente a hidrocarburos y marcas de capacidad visibles para medir el volumen extraído.', features:['Graduado','Pico vertido','Resistente'] },
  { id:'embudo-purga', name:'Embudo de purga para refrigeración', category:'fluidos', price:18.90, sizes:['Universal','VAG/PSA','Kit adaptadores'], keywords:'embudo purga refrigeracion anticongelante sistema vag peugeot renault', desc:'Embudo elevado con adaptadores para purgar circuitos de refrigeración evitando bolsas de aire. Especialmente útil en motores con termostato alto o circuitos complejos. Incluye tapón de cierre para retirar sin derrames.', features:['Adaptadores','Sin burbujas','Tapón cierre'] },
  { id:'boroscopio', name:'Endoscopio/boroscopio USB', category:'diagnostico', price:27.90, sizes:['1 m','3 m','5 m'], keywords:'endoscopio boroscopio inspección cilindro cadena distribución', desc:'Cámara flexible con luz LED regulable para inspeccionar cadenas, fugas, cilindros y zonas ocultas. Funciona con móvil u ordenador mediante adaptador incluido. Una herramienta económica para diagnosticar antes de desmontar.', features:['LED regulable','IP67','Adaptador incluido'] },
  { id:'termometro-infrarrojo', name:'Termómetro infrarrojo de pistola', category:'diagnostico', price:19.90, sizes:['–50 a 380°C','–50 a 550°C','–50 a 1200°C'], keywords:'termómetro infrarrojo temperatura manguito termostato radiador frenos', desc:'Termómetro láser para medir sin contacto: manguitos de refrigeración, discos de freno, colector de escape y zonas de motor. Imprescindible para diagnosticar termostatos, fugas de calor y distribución de temperatura en motores modernos. Respuesta en < 1 segundo.', features:['Sin contacto','Puntero láser','Respuesta rápida'] },
  { id:'aceite-motor-vw504', name:'Aceite motor VW 504/507 0W-30 (5L)', category:'fluidos', price:42.90, sizes:['5 L','5 L x2','20 L'], keywords:'aceite motor vw 504 507 0w30 ea888 lubricante cambio', desc:'Aceite sintético homologado VW 504.00/507.00 especificación necesaria para el EA888 Gen3 y motores VAG modernos de gasolina y diésel con filtro de partículas (DPF). Usar un aceite fuera de especificación acorta la vida del tensor de cadena. Cada lata incluye ficha técnica.', features:['VW 504.00/507.00','0W-30 sintético','Apto DPF'] },
  { id:'refrigerante-g13', name:'Refrigerante G13 concentrado (1.5L)', category:'fluidos', price:14.90, sizes:['1.5 L concentrado','5 L diluido 50%','10 L diluido 50%'], keywords:'refrigerante anticongelante g13 g12 vag purga circuito refrigeración', desc:'Refrigerante G13 violeta compatible con G12+ y G12++ para sistemas de refrigeración VAG, Seat, Skoda y Audi. Formulación sin nitritos ni aminas. Mezclar siempre con agua destilada al 50% para protección hasta –35°C. Esencial después de cualquier intervención en el circuito de refrigeración.', features:['Compatible G12+','Sin nitritos','Concentrado'] },
  { id:'limpiador-maf', name:'Limpiador sensor MAF/cuerpo de aceleración', category:'limpieza', price:9.90, sizes:['400 ml','2 × 400 ml'], keywords:'limpiador maf sensor masa aire cuerpo aceleración admisión mariposa', desc:'Spray de limpieza para sensores MAF y cuerpos de aceleración electrónicos. Fórmula sin residuos que elimina depósitos de aceite y partículas sin afectar al sensor ni descalibrar el cuerpo de aceleración. Aplicar con distancia de 5 cm, dejar secar 2 minutos antes de arrancar.', features:['Sin residuos','Seguro para sensores','Secado rápido'] },
  { id:'kit-bujias-ngk', name:'Kit bujías NGK Iridium para EA888', category:'kits', price:32.90, sizes:['4 uds. (1.4/1.6 TSI)','4 uds. (2.0 TSI EA888)','4 uds. + precalentamiento diesel'], keywords:'bujías ngk iridio bujia encendido ignición ea888 tsi vag', desc:'Bujías de iridio NGK específicas para motores TSI del grupo VAG. El electrodo de iridio garantiza encendido consistente a alta carga y mejora la eficiencia de combustión. Cambio recomendado cada 30.000–60.000 km según versión del motor. Incluye torca recomendada en la caja.', features:['Iridio NGK','OEM compatible','Par incluido'] },
  { id:'limpiacontactos', name:'Spray limpiacontactos eléctrico 400ml', category:'limpieza', price:7.90, sizes:['400 ml'], keywords:'limpiacontactos eléctrico sensor conectores oxidación contacto bornas', desc:'Limpiador de contactos eléctricos para conectores de sensores, bornas de batería, conectores ABS y módulos de control. Elimina oxidación y película de grasa sin dañar el plástico. Esencial en diagnósticos eléctricos intermitentes antes de sustituir un sensor.', features:['Dieléctrico','Secado rápido','No daña plásticos'] }
];

function productForTool(toolName) {
  const q = (toolName || '').toLowerCase();
  let product = shopProducts.find(p => p.keywords.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
  if (!product) {
    product = shopProducts.find(p => q.includes('obd') && p.id === 'lector-obd2') ||
              shopProducts.find(p => q.includes('gato') && p.id === 'gato-hidraulico') ||
              shopProducts.find(p => q.includes('borriqueta') && p.id === 'borriquetas') ||
              shopProducts.find(p => q.includes('vaso') && p.id === 'llaves-vaso') ||
              shopProducts.find(p => q.includes('torquí') && p.id === 'torquimetro') ||
              shopProducts.find(p => q.includes('abrazadera') && p.id === 'alicates-abrazaderas') ||
              shopProducts.find(p => q.includes('cubo') && p.id === 'cubo-refrigerante') ||
              shopProducts.find(p => q.includes('embudo') && p.id === 'embudo-purga') ||
              shopProducts.find(p => (q.includes('endoscopio') || q.includes('boroscopio')) && p.id === 'boroscopio') ||
              shopProducts.find(p => q.includes('destornillador') && p.id === 'destornillador-plano') ||
              shopProducts.find(p => q.includes('trapo') && p.id === 'trapo-microfibra') ||
              shopProducts.find(p => q.includes('aspirador') && p.id === 'aspirador-taller') ||
              shopProducts.find(p => q.includes('termómetro') && p.id === 'termometro-infrarrojo') ||
              shopProducts.find(p => q.includes('infrarrojo') && p.id === 'termometro-infrarrojo') ||
              shopProducts.find(p => (q.includes('aceite') || q.includes('lubricante')) && p.id === 'aceite-motor-vw504') ||
              shopProducts.find(p => (q.includes('refrigerante') || q.includes('anticongelante') || q.includes('g13')) && p.id === 'refrigerante-g13') ||
              shopProducts.find(p => (q.includes('maf') || q.includes('mariposa') || q.includes('aceleración')) && p.id === 'limpiador-maf') ||
              shopProducts.find(p => (q.includes('bujía') || q.includes('bujia') || q.includes('ngk')) && p.id === 'kit-bujias-ngk') ||
              shopProducts.find(p => (q.includes('limpiacontacto') || q.includes('contacto eléc')) && p.id === 'limpiacontactos');
  }
  return product || shopProducts[0];
}

function renderStore(query = '', category = 'all') {
  const container = document.getElementById('tienda-container');
  if (!container) return;
  const q = query.toLowerCase().trim();
  const products = shopProducts.filter(p => {
    const matchesQ = !q || `${p.name} ${p.keywords} ${p.desc}`.toLowerCase().includes(q);
    const matchesCat = category === 'all' || p.category === category;
    return matchesQ && matchesCat;
  });
  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-label">Tienda AutoRepara · Herramientas seleccionadas</div>
      <h1>Herramientas claras,<br>precios honestos</h1>
      <p>AutoRepara.es / tienda</p>
    </div>
    <div class="alert alert-success">
      <i class="fa-solid fa-shield-heart"></i>
      <div>Catálogo pensado para reparaciones reales: medidas métricas habituales en coches europeos, descripciones transparentes, kits sin relleno inútil y precios orientativos ajustados para quedar por debajo de lo que suele verse en tiendas generalistas.</div>
    </div>
    <div class="product-toolbar">
      <input class="store-search" id="store-search" value="${query.replace(/"/g, '&quot;')}" placeholder="Buscar herramienta: OBD, torquímetro, abrazaderas..." oninput="renderStore(this.value, document.getElementById('store-filter').value)">
      <select class="store-filter" id="store-filter" onchange="renderStore(document.getElementById('store-search').value, this.value)">
        ${['all','kits','manuales','diagnostico','elevacion','precision','fluidos','limpieza','electricas'].map(c => {
        const labels = {all:'Todas',kits:'Kits',manuales:'Manuales',diagnostico:'Diagnóstico',elevacion:'Elevación',precision:'Precisión',fluidos:'Fluidos',limpieza:'Limpieza',electricas:'Eléctricas'};
        return `<option value="${c}" ${c===category?'selected':''}>${labels[c]||c}</option>`;
      }).join('')}
      </select>
    </div>
    <div class="search-results-count">${products.length} producto(s) encontrados</div>
    ${products.length ? `<div class="store-grid">${products.map(p => `
      <div class="product-card" id="shop-${p.id}">
        <div class="product-kicker">${p.category}</div>
        <h3>${p.name}</h3>
        <div class="product-price">${p.price.toFixed(2).replace('.', ',')} €</div>
        <p class="product-description">${p.desc}</p>
        <div class="product-features">${p.features.map(f => `<span class="product-feature">${f}</span>`).join('')}</div>
        <select class="product-size-select" aria-label="Medida de ${p.name}">
          ${p.sizes.map(s => `<option>${s}</option>`).join('')}
        </select>
        <button class="btn-cart" onclick="addToCart(this)"><i class="fa-solid fa-cart-plus"></i> Añadir al carrito</button>
      </div>
    `).join('')}</div>` : `<div class="store-empty">No hay resultados. Prueba con “OBD”, “vaso”, “refrigerante”, “kit” o “torquímetro”.</div>`}
  `;
}

function openShopForTool(toolName) {
  const product = productForTool(toolName);
  navigate('tienda');
  setTimeout(() => {
    renderStore(toolName);
    const el = document.getElementById('shop-' + product.id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 80);
}

// Índice de búsqueda global
const searchIndex = [
  { title: 'SEAT León FR 2.0 TSI', section: 'vehiculo', icon: 'fa-car', desc: 'Ficha técnica completa' },
  { title: 'Coches europeos comunes', section: 'vehiculos', icon: 'fa-car-side', desc: 'Golf, 308, Mégane, Focus, Corolla, BMW 320d' },
  { title: 'Tienda de herramientas', section: 'tienda', icon: 'fa-cart-shopping', desc: 'Kits, OBD-II, torquímetros, elevación y fluidos' },
  { title: 'Motor EA888 Gen3 — Sistemas', section: 'motor', icon: 'fa-gear', desc: 'Mapa de sistemas del motor' },
  { title: 'Sistema de Admisión', section: 'motor', tab: 0, icon: 'fa-wind', desc: 'Filtro de aire, MAF, turbo, intercooler' },
  { title: 'Sistema de Combustible', section: 'motor', tab: 1, icon: 'fa-droplet', desc: 'HPFP, inyectores, raíl' },
  { title: 'Sistema de Refrigeración', section: 'motor', tab: 2, icon: 'fa-temperature-half', desc: 'Radiador, termostato, bomba de agua' },
  { title: 'Sistema de Lubricación', section: 'motor', tab: 3, icon: 'fa-oil-can', desc: 'Bomba de aceite, filtro, tensor' },
  { title: 'Escape y Emisiones', section: 'motor', tab: 4, icon: 'fa-smog', desc: 'Catalizador, GPF, EGR, sondas lambda' },
  { title: 'Sistema de Distribución', section: 'motor', tab: 5, icon: 'fa-link', desc: 'Cadena, tensor, guías, piñones VVT' },
  { title: 'Normativa Euro 6d', section: 'normativa', icon: 'fa-scale-balanced', desc: 'Emisiones y reformas homologadas' },
  { title: 'Homologación de reformas', section: 'normativa', icon: 'fa-file-contract', desc: 'Proceso ITV, laboratorios, RD 866/2010' },
  ...guidesData.map(g => ({ title: g.title, section: 'guias', guideId: g.id, icon: g.icon, desc: g.description.substring(0,60)+'…' }))
];

// =====================================================
// NAVEGACIÓN PRINCIPAL
// =====================================================
let currentSection = 'inicio';

function navigate(sectionId, options = {}) {
  // Ocultar todas las secciones
  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });

  const target = document.getElementById('section-' + sectionId);
  if (target) {
    target.classList.add('active');
  }

  // Actualizar nav activo
  document.querySelectorAll('nav a, .nav-mobile a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll(`[data-section="${sectionId}"]`).forEach(a => a.classList.add('active'));

  // Actualizar breadcrumb
  const labels = {
    inicio: 'Inicio',
    vehiculo: 'SEAT León FR',
    motor: 'Mapa Motor',
    guias: 'Guías',
    normativa: 'Normativa',
    vehiculos: 'Coches',
    tienda: 'Tienda',
  };
  document.getElementById('bc-current').textContent = labels[sectionId] || sectionId;

  currentSection = sectionId;

  // Inicializar sección si es guías
  if (sectionId === 'guias') {
    renderGuidesList();
    if (options.filterQuery) {
      setTimeout(() => filterGuides(options.filterQuery), 50);
    }
    if (options.guideId) {
      setTimeout(() => openGuide(options.guideId), 50);
    }
  }
  if (sectionId === 'vehiculos') {
    renderEuroVehicles();
  }
  if (sectionId === 'tienda') {
    renderStore();
  }

  window.scrollTo(0, 0);
}

// =====================================================
// TEMA (DARK/LIGHT)
// =====================================================
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeIcon').className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

// =====================================================
// TABS DEL MOTOR
// =====================================================
function switchTab(index) {
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.tab-content').forEach((content, i) => {
    content.classList.toggle('active', i === index);
  });
}

// =====================================================
// BÚSQUEDA GLOBAL (HERO)
// =====================================================
function handleHeroSearch(value) {
  const dropdown = document.getElementById('search-dropdown');
  if (!value.trim()) {
    dropdown.style.display = 'none';
    return;
  }
  const q = value.toLowerCase();
  const results = searchIndex.filter(item =>
    item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
  ).slice(0, 6);

  if (results.length === 0) {
    dropdown.style.display = 'none';
    return;
  }

  dropdown.innerHTML = results.map(r => `
    <div class="search-result-item" onclick="handleSearchResultClick('${r.section}', ${r.tab !== undefined ? r.tab : 'null'}, '${r.guideId || ''}')">
      <i class="fa-solid ${r.icon}"></i>
      <div>
        <div class="search-result-title">${r.title}</div>
        <div class="search-result-section">${r.desc}</div>
      </div>
    </div>
  `).join('');
  dropdown.style.display = 'block';
}

function handleSearchResultClick(section, tab, guideId) {
  document.getElementById('search-dropdown').style.display = 'none';
  document.getElementById('hero-search').value = '';
  if (section === 'motor' && tab !== null) {
    navigate(section);
    setTimeout(() => switchTab(tab), 100);
  } else if (section === 'guias' && guideId) {
    navigate('guias');
    setTimeout(() => openGuide(guideId), 100);
  } else {
    navigate(section);
  }
}

function doSearch() {
  const val = document.getElementById('hero-search').value.trim();
  if (!val) return;
  navigate('guias');
  setTimeout(() => filterGuides(val), 100);
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) {
    const dd = document.getElementById('search-dropdown');
    if (dd) dd.style.display = 'none';
  }
});

// =====================================================
// GUÍAS — LISTA
// =====================================================
function renderGuidesList(filterQuery) {
  const container = document.getElementById('guias-container');
  
  const searchVal = filterQuery || '';
  const filtered = searchVal
    ? guidesData.filter(g =>
        g.title.toLowerCase().includes(searchVal.toLowerCase()) ||
        g.tags.toLowerCase().includes(searchVal.toLowerCase()) ||
        g.system.toLowerCase().includes(searchVal.toLowerCase())
      )
    : guidesData;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-header-label">Biblioteca de guías · Coches europeos</div>
      <h1>Guías de<br>Reparación</h1>
      <p>AutoRepara.es / guias</p>
    </div>

    <div class="search-wrap" style="max-width:480px;margin-bottom:32px">
      <input type="text" class="search-input" id="guide-search" placeholder="Filtrar guías..." 
             oninput="filterGuides(this.value)" value="${searchVal}" autocomplete="off">
      <button class="search-btn" onclick="filterGuides(document.getElementById('guide-search').value)">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>

    <div class="search-results-count" id="guide-count">Mostrando ${filtered.length} de ${guidesData.length} guías</div>

    <div class="guides-grid" id="guides-grid">
      ${filtered.map((g, i) => `
        <div class="guide-card" style="animation-delay:${i * 0.05}s" onclick="openGuide('${g.id}')">
          <div class="guide-card-top">
            <div class="guide-icon"><i class="fa-solid ${g.icon}"></i></div>
            <span class="guide-badge badge-${g.badge}">${g.badge === 'free' ? 'Gratis' : g.badge === 'pro' ? 'Pro' : 'Próximamente'}</span>
          </div>
          <h3>${g.title}</h3>
          <div class="guide-meta">
            <div class="guide-difficulty">
              ${[1,2,3,4,5].map(n => `<i class="fa-solid fa-wrench wrench-icon${n > g.difficulty ? ' empty' : ''}"></i>`).join('')}
            </div>
            <span class="guide-time"><i class="fa-regular fa-clock"></i> ${g.time}</span>
          </div>
          <span class="guide-system-tag">${g.system}</span>
          <button class="btn-read">VER PASO A PASO →</button>
        </div>
      `).join('')}
    </div>
  `;
}

function filterGuides(query) {
  renderGuidesList(query);
}

// =====================================================
// GUÍAS — DETALLE EXPANDIDO
// =====================================================
function openGuide(id) {
  const guide = guidesData.find(g => g.id === id);
  if (!guide) return;

  // Asegurar que estamos en la sección guías
  if (currentSection !== 'guias') {
    navigate('guias');
    setTimeout(() => openGuide(id), 100);
    return;
  }

  const container = document.getElementById('guias-container');

  const toolsHtml = Array.isArray(guide.tools) && guide.tools.length > 0 ? `
    <div class="guide-materials-box">
      <h4><i class="fa-solid fa-screwdriver-wrench" style="color:var(--accent-orange);margin-right:8px"></i>Herramientas necesarias</h4>
      <div class="materials-grid">
        ${guide.tools.map(t => `<div class="material-item"><i class="fa-solid fa-check"></i><span>${safeText(t)}</span></div>`).join('')}
      </div>
    </div>
  ` : '';

  const partsHtml = Array.isArray(guide.parts) && guide.parts.length > 0 ? `
    <div class="guide-materials-box">
      <h4><i class="fa-solid fa-box" style="color:var(--accent-orange);margin-right:8px"></i>Materiales y recambios</h4>
      <div class="materials-grid">
        ${guide.parts.map(p => `<div class="material-item"><i class="fa-solid fa-circle-dot"></i><span>${safeText(p)}</span></div>`).join('')}
      </div>
    </div>
  ` : '';

  const stepsHtml = guide.steps.map((step, i) => `
    <div class="step-card">
      <div class="step-number">Paso ${i + 1} de ${guide.steps.length}</div>
      <h4>${step.title}</h4>
      <p>${step.desc}</p>
      ${step.note ? `<div class="alert alert-warning" style="margin-top:12px;margin-bottom:4px"><i class="fa-solid fa-triangle-exclamation"></i><div>${step.note}</div></div>` : ''}
      ${step.tools && step.tools.length > 0 ? `
        <div class="step-tools">
          ${step.tools.map(t => `<button class="tool-buy-link" onclick="openShopForTool(decodeURIComponent('${encodeURIComponent(t)}'))"><i class="fa-solid fa-wrench"></i>${t} · ver en tienda</button>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');

  const difficultyIcons = [1,2,3,4,5].map(n =>
    `<i class="fa-solid fa-wrench wrench-icon${n > guide.difficulty ? ' empty' : ''}"></i>`
  ).join('');

  container.innerHTML = `
    <div class="guide-detail">
      <button class="btn-back" onclick="renderGuidesList()">
        <i class="fa-solid fa-arrow-left"></i> Volver a todas las guías
      </button>

      <div class="guide-detail-header">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
          <div class="guide-icon" style="width:48px;height:48px;font-size:22px"><i class="fa-solid ${guide.icon}"></i></div>
          <span class="guide-badge badge-${guide.badge}" style="font-size:11px;padding:5px 12px">${guide.badge === 'free' ? 'Gratis' : guide.badge === 'pro' ? 'Pro' : 'Próximamente'}</span>
          <span class="guide-system-tag" style="margin:0">${guide.system}</span>
        </div>
        <h2 style="font-family:var(--font-display);font-weight:800;font-size:clamp(24px,4vw,40px);color:var(--text-primary);line-height:1.1;margin-bottom:12px">${guide.title}</h2>
        <p style="color:var(--text-secondary);line-height:1.7;max-width:700px;font-size:14px">${guide.description}</p>
        <div class="guide-detail-meta-row">
          <div class="guide-detail-meta-item">
            <i class="fa-regular fa-clock"></i>
            <span>Duración: <strong>${guide.time}</strong></span>
          </div>
          <div class="guide-detail-meta-item">
            ${difficultyIcons}
            <span style="margin-left:6px">Dificultad: <strong>${guide.difficulty}/5</strong></span>
          </div>
          <div class="guide-detail-meta-item">
            <i class="fa-solid fa-list-ol"></i>
            <span><strong>${guide.steps.length}</strong> pasos</span>
          </div>
        </div>
      </div>

      ${toolsHtml}
      ${partsHtml}

      <div class="section-title" style="margin-bottom:16px">Procedimiento paso a paso</div>
      <div class="guide-steps-list">
        ${stepsHtml}
      </div>

      <div class="guide-videos-section" id="guide-videos-${guide.id}">
        <div class="guide-videos-title"><i class="fa-brands fa-youtube"></i> Vídeos de ejemplo</div>
        <div class="guide-videos-grid" style="display:grid">${renderGuideVideos(guide.id)}</div>
      </div>

      <div class="alert alert-success">
        <i class="fa-solid fa-circle-check"></i>
        <div>¿Ha sido útil esta guía? Encuentra más guías relacionadas con el sistema <strong>${guide.system}</strong> volviendo al listado.</div>
      </div>

      <button class="btn-back" onclick="renderGuidesList()" style="margin-top:8px">
        <i class="fa-solid fa-arrow-left"></i> Volver a todas las guías
      </button>
    </div>
  `;

  window.scrollTo(0, 0);

  window.scrollTo(0, 0);
}

// =====================================================
// VÍDEOS ESTÁTICOS POR GUÍA (embeds de YouTube)
// =====================================================
const guideVideosMap = {
  'g-filtro-aire': [
    { id: 'w8GdHuShk7Y', label: 'Cómo cambiar el filtro del aire del motor — tutorial completo' },
    { id: 'mYtTUrtYKDA', label: 'Cómo cambiar el filtro de aire de tu coche — tutorial de AUTODOC' },
    { id: 'Z_9l_3HGNcs', label: 'Cambio filtro de aire: revisión del sensor MAF incluida' }
  ],
  'g-maf': [
    { id: '695eOKcaCBk', label: 'Código P0101 sensor MAF: qué revisar y cómo solucionarlo' },
    { id: 'uCDPLdCg1a4', label: 'Limpieza del cuerpo de admisión y sensor MAF sin desmontar' },
    { id: 'kwFiv_QSogk', label: 'Cómo limpiar el cuerpo de aceleración electrónico sin descalibrar' }
  ],
  'g-cuerpo-aceleracion': [
    { id: 'uCDPLdCg1a4', label: 'Limpieza mariposa de admisión sin desmontar — más potencia' },
    { id: 'k30WG0SSM_k', label: 'Limpieza del cuerpo de aceleración con Liqui Moly paso a paso' },
    { id: 'kwFiv_QSogk', label: 'Limpiar el cuerpo de aceleración electrónico sin riesgo de descalibrar' }
  ],
  'g-aceite': [
    { id: 'YoH9ncQPNMQ', label: 'Cómo cambiar el aceite del motor y su filtro — tutorial completo' },
    { id: 'Q-aKhjJOO1w', label: 'Cómo cambiar el aceite de tu auto paso a paso' },
    { id: 'kWNAYHNzR-s', label: 'Cambio de aceite del motor y filtro — AUTODOC tutorial' }
  ],
  'g-purga-refrigeracion': [
    { id: 'nmf7QZr9XgI', label: 'Cómo purgar el radiador y limpiar el circuito refrigerante' },
    { id: 'NfS-bTH7Q1Y', label: 'Cómo purgar el circuito de refrigerante correctamente' },
    { id: '7hPnrhWNX3k', label: 'Purgar sistema de enfriamiento de cualquier carro paso a paso' }
  ],
  'g-termostato': [
    { id: 'f3qB1GrM-XY', label: 'Cómo saber si el termostato está dañado — síntomas y soluciones' },
    { id: 'DxpjTXAb3O4', label: 'Señales de que el termostato ya no sirve o está fallando' },
    { id: '9IarcOjXsfM', label: 'Cómo cambiar el termostato del coche — mantenimiento básico' }
  ],
  'g-sobrecalentamiento': [
    { id: 'WH5vvJJ4OvY', label: 'Sobrecalentamiento del motor: causas posibles y soluciones' },
    { id: 'XH5esi1EKRg', label: 'Motor recalentado o sobrecalentado: qué hacer' },
    { id: '8Du3CtLpIgw', label: '5 causas comunes que provocan calentamiento en el motor' }
  ],
  'g-ruido-cadena': [
    { id: 'lKqaSUhLnNg', label: 'Así suena una cadena de distribución destensada — peligro' },
    { id: 'euSz8YJRNQ8', label: 'Cadena de distribución con ruido fuerte: riesgo de rotura' },
    { id: '8Klj2but4Q4', label: 'Cadena de distribución ruidosa: ¿es necesario sustituirla?' }
  ],
  'g-cuando-cadena': [
    { id: 'ZeuCidaDE5U', label: '¿Cuándo cambiar la cadena de distribución? Factores clave' },
    { id: 'a19VPvo4NP4', label: 'Inspección y sustitución de la cadena de distribución del motor' },
    { id: 'yg61tWjW-zk', label: 'Cómo saber si ya no sirve la cadena de distribución' }
  ]
};

function renderGuideVideos(guideId) {
  const videos = guideVideosMap[guideId];
  if (!videos || !videos.length) return '<p style="color:var(--text-muted);font-size:13px">No hay vídeos disponibles para esta guía.</p>';
  return videos.map(v => `
    <a class="guide-video-card" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">
      <div class="guide-video-thumb">
        <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.label}" loading="lazy">
        <div class="guide-video-play"><i class="fa-solid fa-play"></i></div>
      </div>
      <div class="guide-video-label"><i class="fa-brands fa-youtube" style="color:#ff0000;margin-right:5px"></i>${v.label}</div>
    </a>
  `).join('');
}

// =====================================================
// FUNCIÓN GLOBAL PARA GUIDE PILLS
// =====================================================
window.openGuide = openGuide;


function addToCart(button) {
  const original = button.innerHTML;
  button.innerHTML = '<i class="fa-solid fa-check"></i> Añadido';
  button.classList.add('added');
  button.disabled = true;
  setTimeout(() => {
    button.innerHTML = original;
    button.classList.remove('added');
    button.disabled = false;
  }, 1200);
}

window.addToCart = addToCart;
window.navigate = navigate;
window.switchTab = switchTab;
window.filterGuides = filterGuides;
window.renderGuidesList = renderGuidesList;
window.openShopForTool = openShopForTool;
window.renderStore = renderStore;
window.handleHeroSearch = handleHeroSearch;
window.handleSearchResultClick = handleSearchResultClick;
window.doSearch = doSearch;
window.toggleTheme = toggleTheme;

// =====================================================
// INICIALIZACIÓN
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  navigate('inicio');
});
