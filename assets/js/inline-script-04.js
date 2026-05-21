// =====================================================
// GUÍAS
// =====================================================
(function(){
  function safeText(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function paragraphize(text) {
    if (!text) return '';
    return String(text).split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');
  }

  function getGuideContext(guide) {
    const title = `${guide.title || ''} ${guide.system || ''} ${guide.tags || ''}`.toLowerCase();
    if (title.includes('filtro') && title.includes('aire')) {
      return {
        intro: 'Esta intervención parece sencilla, pero es una de las mejores oportunidades para comprobar el estado real de la admisión. Un filtro mal colocado, una caja de filtro con suciedad acumulada o una abrazadera floja pueden provocar entrada de aire sin filtrar, lecturas erróneas del caudal de aire y desgaste prematuro del turbo o de los cilindros.',
        checks: ['Comprobar que el filtro nuevo tiene la misma geometría y altura que el anterior.', 'Verificar que la goma perimetral queda asentada en todo el contorno.', 'Revisar que no queda ningún clip de la caja sin cerrar.', 'Inspeccionar el conducto de admisión por si hay grietas o abrazaderas flojas.'],
        mistakes: ['Soplar el filtro usado con aire a presión y reutilizarlo si ya está saturado.', 'Dejar caer polvo dentro de la caja del filtro durante la extracción.', 'Forzar pestañas de plástico frías o envejecidas.', 'Tocar o contaminar el sensor MAF con productos no específicos.']
      };
    }
    if (title.includes('maf') || title.includes('p0101')) {
      return {
        intro: 'El diagnóstico de un sensor MAF no consiste solo en limpiar o cambiar la pieza. La señal del MAF depende de la estanqueidad de toda la admisión, del estado del filtro, de la tensión de alimentación, de la masa eléctrica y de la lectura que interpreta la ECU. Por eso conviene seguir una secuencia lógica y no sustituir componentes a ciegas.',
        checks: ['Leer códigos antes de borrar nada y guardar una captura.', 'Comparar valores de caudal en ralentí, a 2.000 rpm y en aceleración suave.', 'Inspeccionar conectores, pines, cableado y manguitos posteriores al sensor.', 'Confirmar que no existen entradas de aire no medidas después del MAF.'],
        mistakes: ['Usar limpiador de frenos o carburador sobre el filamento del MAF.', 'Borrar códigos antes de anotar congelados y datos en vivo.', 'Cambiar el sensor sin comprobar fugas de admisión.', 'Tocar el filamento interno con bastoncillos o trapos.']
      };
    }
    if (title.includes('aceleración') || title.includes('aceleracion') || title.includes('mariposa')) {
      return {
        intro: 'La mariposa electrónica trabaja con tolerancias finas. La suciedad acumulada puede alterar el paso de aire en ralentí, pero una limpieza agresiva también puede dañar recubrimientos o desajustar la adaptación. La clave es limpiar de forma gradual, sin inundar el eje ni forzar el plato.',
        checks: ['Confirmar que el motor está frío y la zona ventilada.', 'Desconectar solo lo necesario para evitar tirones en el cableado.', 'Usar paños sin pelusa y limpiador compatible con cuerpos electrónicos.', 'Realizar adaptación o aprendizaje si el ralentí queda inestable.'],
        mistakes: ['Empapar el cuerpo de aceleración hasta que el líquido entre en el colector.', 'Forzar la mariposa con herramientas duras.', 'Montar el conducto de admisión dejando una toma de aire.', 'Arrancar inmediatamente sin dejar evaporar el limpiador.']
      };
    }
    if (title.includes('aceite')) {
      return {
        intro: 'El cambio de aceite es una operación básica, pero de ella depende la vida del turbo, tensores hidráulicos, cadena, bomba de aceite y casquillos. La calidad de la intervención no se mide solo en vaciar y rellenar: hay que controlar especificación, cantidad, par de apriete, fugas, nivel en caliente y trazabilidad del mantenimiento.',
        checks: ['Confirmar especificación exacta de aceite antes de abrir el cárter.', 'Sustituir junta o tapón cuando el diseño lo requiera.', 'Lubricar la junta del filtro si procede.', 'Arrancar, esperar, parar y comprobar nivel en superficie plana.'],
        mistakes: ['Apretar el tapón sin dinamométrica cuando el cárter es delicado.', 'Rellenar por encima del máximo.', 'Usar aceite solo por viscosidad sin homologación adecuada.', 'No comprobar fugas después de calentar el motor.']
      };
    }
    if (title.includes('refriger') || title.includes('termostato') || title.includes('sobrecalentamiento')) {
      return {
        intro: 'El sistema de refrigeración debe tratarse como un circuito cerrado y presurizado. Un pequeño resto de aire, una mezcla incorrecta de refrigerante, un tapón de expansión fatigado o un termostato que abre tarde pueden provocar síntomas intermitentes difíciles de diagnosticar. Trabaja siempre con el motor frío y con una secuencia ordenada.',
        checks: ['No abrir el circuito con el motor caliente o presurizado.', 'Usar refrigerante compatible y agua desmineralizada cuando corresponda.', 'Purgar hasta que la calefacción entregue aire caliente estable.', 'Controlar temperatura real con OBD o termómetro infrarrojo.'],
        mistakes: ['Mezclar refrigerantes incompatibles por color sin comprobar especificación.', 'Dar por solucionada una fuga solo porque el nivel tarda en bajar.', 'No revisar el tapón del depósito de expansión.', 'Olvidar que el ventilador puede arrancar con el contacto dado.']
      };
    }
    if (title.includes('cadena') || title.includes('distribución') || title.includes('distribucion')) {
      return {
        intro: 'La distribución sincroniza el movimiento interno del motor. Cualquier diagnóstico debe hacerse con prudencia: un ruido breve puede ser tolerable en algunos motores, pero un desfase registrado por la ECU o un ruido creciente puede anticipar una avería grave. La guía ayuda a distinguir síntomas, priorizar pruebas y decidir cuándo parar el vehículo.',
        checks: ['Escuchar el arranque en frío real, no solo con el motor templado.', 'Leer códigos de correlación de árbol de levas y cigüeñal.', 'Revisar historial de aceite, intervalos y especificación.', 'No seguir circulando si hay ruido metálico constante o fallo persistente.'],
        mistakes: ['Ignorar un ruido que aumenta semana a semana.', 'Cambiar solo el tensor cuando el conjunto ya presenta desgaste.', 'Diagnosticar por oído sin leer códigos ni datos.', 'Arrancar repetidamente un motor con posible salto de distribución.']
      };
    }
    return {
      intro: 'Esta guía está pensada para trabajar con método. Antes de desmontar, conviene identificar el síntoma, preparar herramientas, limpiar la zona, documentar la posición de cada pieza y verificar el resultado al terminar. La diferencia entre una reparación correcta y una reparación problemática suele estar en el orden, la limpieza y las comprobaciones finales.',
      checks: ['Preparar herramientas y recambios antes de empezar.', 'Trabajar con el vehículo estable y en una zona iluminada.', 'Fotografiar conectores, manguitos y tornillos antes de desmontar.', 'Comprobar el funcionamiento después de montar y antes de dar la reparación por terminada.'],
      mistakes: ['Empezar sin leer el procedimiento completo.', 'Mezclar tornillos de diferente longitud.', 'Forzar conectores de plástico envejecidos.', 'No hacer una prueba final de fugas, ruidos o códigos.']
    };
  }

  function buildExpandedStepText(guide, step, index) {
    const ctx = getGuideContext(guide);
    const stepTitle = `${step.title || ''}`.toLowerCase();
    const systemName = guide.system || 'sistema';
    const tools = (step.tools && step.tools.length) ? step.tools.join(', ') : 'las herramientas indicadas en la guía';

    const detail = [];
    detail.push(`En esta fase debes trabajar sin prisa. El objetivo no es solamente completar el paso, sino dejar el ${systemName.toLowerCase()} en una condición verificable y segura. Antes de tocar nada, observa la posición de las piezas, comprueba si hay suciedad, marcas de fuga, conectores tensos o plásticos fatigados, y piensa cómo vas a volver a montar cada elemento. Esta preparación evita errores típicos como montar una abrazadera girada, pellizcar una junta o dejar un conector sin enclavar.`);
    detail.push(`La descripción original del paso indica: “${safeText(step.desc)}”. Llévala a la práctica manteniendo tres criterios: limpieza, control y verificación. Limpieza significa que no debe entrar polvo, líquido o residuos en el circuito que estás abriendo. Control significa no aplicar fuerza excesiva ni usar una herramienta que no encaja. Verificación significa que cada pieza desmontada debe volver a quedar asentada, apretada y conectada como estaba, o mejor.`);

    if (stepTitle.includes('prepar')) {
      detail.push('Como preparación, revisa que el coche esté en una posición estable, con buena iluminación y con espacio suficiente para apoyar herramientas y recambios. Si la intervención afecta a fluidos, coloca absorbente o una bandeja antes de abrir el circuito. Si afecta a electricidad o sensores, evita tirar de los cables: desconecta siempre desde el cuerpo del conector y no desde el mazo.');
    } else if (stepTitle.includes('desconex') || stepTitle.includes('extracción') || stepTitle.includes('extraccion') || stepTitle.includes('desmont')) {
      detail.push('Durante el desmontaje, la regla principal es no romper nada para ahorrar unos segundos. Muchos conectores y grapas tienen una pestaña oculta: localízala con la linterna y presiona donde corresponde. Si una pieza no sale, probablemente queda un tornillo, clip o junta adherida. Haz movimientos cortos y controlados, y guarda cada tornillo por zona para que no se mezclen longitudes.');
    } else if (stepTitle.includes('limpieza') || stepTitle.includes('limpiar')) {
      detail.push('En la limpieza, empieza siempre por retirar suciedad suelta y termina con producto específico. No todos los limpiadores son compatibles con sensores, juntas o plásticos. Aplica poca cantidad, deja actuar y retira el residuo con un paño sin pelusa. Si necesitas repetir, es mejor hacer varias pasadas suaves que una sola agresiva.');
    } else if (stepTitle.includes('instal') || stepTitle.includes('mont') || stepTitle.includes('reinstal')) {
      detail.push('En el montaje, no aprietes todo de golpe. Presenta primero las piezas, comprueba que encajan sin tensión y aprieta de forma progresiva. Cuando haya juntas, tóricas o superficies de sellado, verifica que están limpias y correctamente asentadas. Una junta mordida puede parecer correcta al montar, pero provocar fuga al calentar o al presurizar el sistema.');
    } else if (stepTitle.includes('verific') || stepTitle.includes('prueba') || stepTitle.includes('evaluación') || stepTitle.includes('evaluacion')) {
      detail.push('La verificación final es parte de la reparación, no un añadido. Comprueba visualmente la zona, escucha el funcionamiento, revisa niveles si aplica y realiza una prueba progresiva. Si hay OBD, lee códigos antes y después. Si aparece un síntoma nuevo, vuelve al último punto desmontado: normalmente el fallo está en un conector, una toma de aire, una abrazadera o una pieza mal asentada.');
    } else {
      detail.push('Si en este punto aparece resistencia, ruido anómalo, olor a combustible, fuga de refrigerante, chispa eléctrica o cualquier situación que no esperabas, detén la operación y vuelve un paso atrás. En mecánica doméstica la mejor decisión suele ser parar a tiempo, revisar documentación y continuar solo cuando entiendas la causa.');
    }

    detail.push(`Herramientas útiles para este paso: ${safeText(tools)}. Asegúrate de que la herramienta apoya bien antes de aplicar fuerza. Si una punta resbala, redondea tornillos; si una llave no entra recta, puede partir una cabeza o dañar una carcasa. En trabajos de precisión, un torquímetro pequeño marca la diferencia entre una reparación limpia y una rosca pasada.`);

    const checks = ctx.checks.map(x => `<li><i class="fa-solid fa-check"></i><span>${x}</span></li>`).join('');
    const mistakes = ctx.mistakes.map(x => `<li><i class="fa-solid fa-triangle-exclamation"></i><span>${x}</span></li>`).join('');

    return `
      <div class="step-expanded-section">
        <h5><i class="fa-solid fa-circle-info"></i> Explicación detallada</h5>
        ${detail.map(p => `<p>${p}</p>`).join('')}
      </div>
      <div class="step-expanded-section">
        <h5><i class="fa-solid fa-clipboard-check"></i> Comprobaciones recomendadas</h5>
        <p>${ctx.intro}</p>
        <ul class="step-expanded-list">${checks}</ul>
      </div>
      <div class="step-expanded-section">
        <h5><i class="fa-solid fa-shield-halved"></i> Errores que debes evitar</h5>
        <ul class="step-expanded-list">${mistakes}</ul>
        <div class="step-warning-grid">
          <div class="step-mini-card"><strong>Seguridad</strong>Si el paso implica calor, presión, combustible, electricidad o elevación del coche, detén la operación ante cualquier duda y no trabajes solo debajo del vehículo.</div>
          <div class="step-mini-card"><strong>Calidad</strong>Una reparación correcta debe quedar limpia, sin piezas sobrantes, sin fugas, sin testigos nuevos y con el mismo comportamiento o mejor que antes de intervenir.</div>
          <div class="step-mini-card"><strong>Registro</strong>Anota fecha, kilometraje, recambio usado y observaciones. Este historial ayuda a diagnosticar futuros fallos y aumenta la trazabilidad del mantenimiento.</div>
        </div>
      </div>
    `;
  }

  function toggleGuideStep(button) {
    const card = button.closest('.step-card');
    if (!card) return;
    card.classList.toggle('open');
    const expanded = card.classList.contains('open');
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    const panel = card.querySelector('.step-panel');
    if (panel) panel.hidden = !expanded;
  }

  function setAllGuideSteps(open) {
    document.querySelectorAll('.step-card.step-collapsible').forEach(card => {
      card.classList.toggle('open', open);
      const btn = card.querySelector('.step-toggle');
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      const panel = card.querySelector('.step-panel');
      if (panel) panel.hidden = !open;
    });
  }

  function renderExtendedGuideSteps(guide) {
    return guide.steps.map((step, i) => {
      const isOpen = i === 0;
      const panelId = `guide-step-panel-${safeText(guide.id)}-${i + 1}`;
      return `
        <div class="step-card step-collapsible ${isOpen ? 'open' : ''}">
          <button class="step-toggle" onclick="toggleGuideStep(this)" aria-expanded="${isOpen ? 'true' : 'false'}" aria-controls="${panelId}" type="button">
            <span class="step-toggle-main">
              <span class="step-number">Paso ${i + 1} de ${guide.steps.length}</span>
              <span class="step-heading">${safeText(step.title)}</span>
            </span>
            <span class="step-toggle-icon" aria-hidden="true"><i class="fa-solid fa-chevron-down"></i></span>
          </button>
          <div class="step-panel" id="${panelId}" ${isOpen ? '' : 'hidden'}>
            <p>${safeText(step.desc)}</p>
            ${step.note ? `<div class="alert alert-warning" style="margin-top:12px;margin-bottom:4px"><i class="fa-solid fa-triangle-exclamation"></i><div>${safeText(step.note)}</div></div>` : ''}
            ${buildExpandedStepText(guide, step, i)}
            ${step.tools && step.tools.length > 0 ? `
              <div class="step-tools">
                ${step.tools.map(t => `<button class="tool-buy-link" type="button" onclick="openShopForTool(decodeURIComponent('${encodeURIComponent(t)}'))"><i class="fa-solid fa-wrench"></i>${safeText(t)} · ver en tienda</button>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  function openGuideExtended(id) {
    const guide = guidesData.find(g => g.id === id);
    if (!guide) return;

    if (currentSection !== 'guias') {
      navigate('guias');
      setTimeout(() => openGuideExtended(id), 100);
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

    const difficultyIcons = [1,2,3,4,5].map(n =>
      `<i class="fa-solid fa-wrench wrench-icon${n > guide.difficulty ? ' empty' : ''}"></i>`
    ).join('');

    container.innerHTML = `
      <div class="guide-detail" id="guide-detail">
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
          <p style="color:var(--text-secondary);line-height:1.8;max-width:780px;font-size:14px">${guide.description}</p>
          <p style="color:var(--text-secondary);line-height:1.8;max-width:780px;font-size:14px;margin-top:10px">Esta versión extendida está pensada para que puedas entender no solo qué hacer, sino por qué se hace, qué síntomas observar, qué errores evitar y cómo validar el resultado final. Lee todos los pasos antes de empezar y abre solo los apartados que necesites mientras trabajas.</p>
          <div class="guide-detail-meta-row">
            <div class="guide-detail-meta-item"><i class="fa-regular fa-clock"></i><span>Duración: <strong>${guide.time}</strong></span></div>
            <div class="guide-detail-meta-item">${difficultyIcons}<span style="margin-left:6px">Dificultad: <strong>${guide.difficulty}/5</strong></span></div>
            <div class="guide-detail-meta-item"><i class="fa-solid fa-list-ol"></i><span><strong>${guide.steps.length}</strong> pasos</span></div>
          </div>
        </div>

${toolsHtml}
        ${partsHtml}

        <div class="section-title" style="margin-bottom:16px">Procedimiento paso a paso</div>
        <div class="guide-accordion-toolbar">
          <button class="guide-accordion-btn" onclick="setAllGuideSteps(true)"><i class="fa-solid fa-up-right-and-down-left-from-center"></i> Abrir todos</button>
          <button class="guide-accordion-btn" onclick="setAllGuideSteps(false)"><i class="fa-solid fa-down-left-and-up-right-to-center"></i> Cerrar todos</button>
        </div>
        <div class="guide-steps-list">
          ${renderExtendedGuideSteps(guide)}
        </div>

        <div class="guide-videos-section" id="guide-videos-${guide.id}">
          <div class="guide-videos-title"><i class="fa-brands fa-youtube"></i> Vídeos de ejemplo</div>
          <div class="guide-videos-grid" style="display:grid">${typeof renderGuideVideos === 'function' ? renderGuideVideos(guide.id) : ''}</div>
        </div>

<button class="btn-back" onclick="renderGuidesList()" style="margin-top:8px">
          <i class="fa-solid fa-arrow-left"></i> Volver a todas las guías
        </button>
      </div>
    `;

    if (typeof injectGuideActionsBar === 'function') {
      const previousBar = document.getElementById('guide-actions-' + id);
      if (previousBar) previousBar.remove();
      injectGuideActionsBar(id, guide.title);
    }

    window.scrollTo(0, 0);
  }

  window.toggleGuideStep = toggleGuideStep;
  window.setAllGuideSteps = setAllGuideSteps;
  window.openGuide = openGuideExtended;
})();
