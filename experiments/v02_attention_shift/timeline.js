/* A dependency-free SVG drawing timeline. It clears every layer before each loop. */
(() => {
  const C = window.ATTENTION_SHIFT_CONFIG;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('scene');
  const stageLabel = document.getElementById('stage-label');
  const layerIds = ['hair-layer', 'surface-layer', 'attention-layer', 'liquid-layer', 'annotation-layer'];
  let restartTimer;
  let scheduledTimers = [];

  const layer = (id) => document.getElementById(id);
  const make = (tag, attributes = {}) => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    return element;
  };
  const add = (layerId, tag, attributes) => {
    const element = make(tag, attributes);
    layer(layerId).append(element);
    return element;
  };
  const wait = (callback, delay) => scheduledTimers.push(window.setTimeout(callback, delay));
  const clearScene = () => layerIds.forEach((id) => { layer(id).replaceChildren(); });
  const activeLayout = () => {
    const source = window.matchMedia('(max-width: 760px)').matches ? C.layouts.portrait : C.layouts.landscape;
    // Keep the pair centered on its configured positions while making gapWidth
    // the single, easy control for the clear space between the two hairs.
    const centerX = (source.leftHairX + source.rightHairX) / 2;
    return { ...source, leftHairX: centerX - source.gapWidth / 2, rightHairX: centerX + source.gapWidth / 2 };
  };
  const applyConfiguredColors = () => {
    const root = document.documentElement.style;
    root.setProperty('--paper', C.colors.paper);
    root.setProperty('--ink', C.colors.ink);
    root.setProperty('--quiet-ink', C.colors.softInk);
    root.setProperty('--liquid', C.colors.liquid);
    root.setProperty('--attention', C.colors.attention);
  };
  const setStage = (stageNumber, name) => { stageLabel.textContent = `${String(stageNumber).padStart(2, '0')} / ${name}`; };

  const reveal = (element, delay, duration) => element.animate(
    [{ opacity: 0 }, { opacity: 1 }],
    { delay, duration, easing: 'ease-out', fill: 'forwards' }
  );
  const draw = (element, delay, duration) => {
    const length = Math.max(element.getTotalLength(), 1);
    element.style.strokeDasharray = `${length}`;
    element.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
      delay, duration, easing: 'ease-out', fill: 'forwards'
    });
  };

  function hairPath(x, top, bottom, side) {
    const inward = side * 25;
    const outer = side * 10;
    return `M ${x} ${top} C ${x + outer} ${top + 78}, ${x + inward} ${bottom - 130}, ${x + inward} ${bottom - 33} L ${x + outer} ${bottom} C ${x - outer} ${bottom - 110}, ${x - outer} ${top + 84}, ${x - outer / 3} ${top} Z`;
  }

  function drawBase(layout) {
    const left = add('hair-layer', 'path', { class: 'hair', d: hairPath(layout.leftHairX, layout.hairTop, layout.hairBottom, 1) });
    const right = add('hair-layer', 'path', { class: 'hair', d: hairPath(layout.rightHairX, layout.hairTop, layout.hairBottom, -1) });
    reveal(left, 100, C.drawing.hairDuration);
    reveal(right, 290, C.drawing.hairDuration);

    const width = layout.rightHairX - layout.leftHairX;
    const surfaceStart = layout.leftHairX - width * 1.15;
    const surfaceEnd = layout.rightHairX + width * 1.15;
    const surface = add('surface-layer', 'path', { class: 'surface', d: `M ${surfaceStart} ${layout.substrateY} Q ${(surfaceStart + surfaceEnd) / 2} ${layout.substrateY - 8} ${surfaceEnd} ${layout.substrateY}` });
    const echo = add('surface-layer', 'path', { class: 'surface-echo', d: `M ${surfaceStart + 36} ${layout.substrateY + 7} Q ${(surfaceStart + surfaceEnd) / 2} ${layout.substrateY + 2} ${surfaceEnd - 42} ${layout.substrateY + 7}` });
    draw(surface, 650, 500);
    draw(echo, 810, 460);
  }

  function showGap(layout) {
    setStage(2, C.stages[1].name);
    const centerX = (layout.leftHairX + layout.rightHairX) / 2;
    const circle = add('attention-layer', 'ellipse', {
      class: 'attention', cx: centerX, cy: layout.attentionY,
      rx: layout.attentionRadius, ry: layout.attentionRadius * .82
    });
    draw(circle, 160, C.drawing.circleDuration);
    const note = add('annotation-layer', 'text', { class: 'annotation', x: layout.annotationX, y: layout.annotationY });
    note.textContent = C.annotations.gap;
    const leader = add('annotation-layer', 'path', {
      class: 'annotation-line', d: `M ${layout.annotationX - 16} ${layout.annotationY + 7} L ${centerX + layout.attentionRadius * .68} ${layout.attentionY - layout.attentionRadius * .42}`
    });
    reveal(note, 920, 240);
    draw(leader, 860, 330);
  }

  function bridgePath(layout) {
    const left = layout.leftHairX + 9;
    const right = layout.rightHairX - 9;
    const top = layout.attentionY - 103;
    const middle = layout.attentionY + 40;
    const bottom = layout.attentionY + 120;
    return `M ${left} ${top} C ${left + 30} ${top + 92}, ${left + 31} ${middle - 38}, ${left + 4} ${bottom} C ${left + 54} ${bottom - 63}, ${right - 54} ${bottom - 63}, ${right - 4} ${bottom} C ${right - 31} ${middle - 38}, ${right - 30} ${top + 92}, ${right} ${top} C ${right - 44} ${top + 66}, ${left + 44} ${top + 66}, ${left} ${top} Z`;
  }

  function showBridge(layout) {
    setStage(3, C.stages[2].name);
    layer('attention-layer').replaceChildren();
    layer('annotation-layer').replaceChildren();
    const bridge = add('liquid-layer', 'path', { class: 'liquid', d: bridgePath(layout) });
    reveal(bridge, 220, C.drawing.liquidRevealDuration);
  }

  function showTransfer(layout) {
    setStage(4, C.stages[3].name);
    layer('liquid-layer').replaceChildren();
    const centerX = (layout.leftHairX + layout.rightHairX) / 2;
    const bridgeBottom = layout.attentionY + 120;
    const transferTop = bridgeBottom - 190;
    const poolTop = layout.substrateY - 5;
    const liquid = add('liquid-layer', 'path', {
      class: 'liquid',
      d: `M ${layout.leftHairX + 9} ${transferTop} C ${layout.leftHairX + 39} ${transferTop + 91}, ${layout.leftHairX + 38} ${bridgeBottom - 32}, ${centerX} ${bridgeBottom} C ${centerX + 15} ${bridgeBottom + 58}, ${centerX + 10} ${poolTop - 45}, ${centerX - 16} ${poolTop - 26} C ${centerX - 61} ${poolTop - 15}, ${centerX - 85} ${poolTop - 6}, ${centerX - 92} ${poolTop} L ${centerX + 92} ${poolTop} C ${centerX + 81} ${poolTop - 7}, ${centerX + 56} ${poolTop - 16}, ${centerX + 16} ${poolTop - 26} C ${centerX - 10} ${poolTop - 45}, ${centerX - 15} ${bridgeBottom + 58}, ${centerX} ${bridgeBottom} C ${layout.rightHairX - 38} ${bridgeBottom - 32}, ${layout.rightHairX - 39} ${transferTop + 91}, ${layout.rightHairX - 9} ${transferTop} C ${layout.rightHairX - 45} ${transferTop + 66}, ${layout.leftHairX + 45} ${transferTop + 66}, ${layout.leftHairX + 9} ${transferTop} Z`
    });
    reveal(liquid, 170, C.drawing.transferDuration);
  }

  function startLoop() {
    window.clearTimeout(restartTimer);
    scheduledTimers.forEach(window.clearTimeout);
    scheduledTimers = [];
    applyConfiguredColors();
    clearScene();
    const layout = activeLayout();
    svg.setAttribute('viewBox', layout.viewBox);
    setStage(1, C.stages[0].name);
    drawBase(layout);
    wait(() => showGap(layout), C.stages[1].start);
    wait(() => showBridge(layout), C.stages[2].start);
    wait(() => showTransfer(layout), C.stages[3].start);
    restartTimer = window.setTimeout(startLoop, C.loopDuration);
  }

  window.addEventListener('resize', () => {
    window.clearTimeout(restartTimer);
    scheduledTimers.forEach(window.clearTimeout);
    startLoop();
  });
  startLoop();
})();
