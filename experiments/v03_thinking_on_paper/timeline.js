/* One drawing is built per loop. Nothing is replaced between ideas: new marks answer earlier marks. */
(() => {
  const C = window.THINKING_ON_PAPER_CONFIG;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('scene');
  const layers = ['surface-layer', 'hair-layer', 'thinking-layer', 'liquid-layer', 'annotation-layer'];
  let timers = [], restartTimer;
  const el = id => document.getElementById(id);
  const make = (tag, attrs = {}) => { const node = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v)); return node; };
  const add = (id, tag, attrs) => { const node = make(tag, attrs); el(id).append(node); return node; };
  const later = (fn, delay) => timers.push(setTimeout(fn, delay));
  const clear = () => layers.forEach(id => el(id).replaceChildren());
  const layout = () => window.matchMedia('(max-width: 760px)').matches ? C.layouts.portrait : C.layouts.landscape;
  const show = (node, delay, duration = 260) => node.animate([{ opacity: 0, transform: 'translate(0px, 3px)' }, { opacity: 1, transform: 'translate(0px, 0px)' }], { delay, duration, easing: 'ease-out', fill: 'forwards' });
  const fade = (node, delay, duration = 220) => node.animate([{ opacity: 1 }, { opacity: 0 }], { delay, duration, easing: 'ease-in', fill: 'forwards' });
  const draw = (node, delay, duration) => { const length = Math.max(1, node.getTotalLength()); node.style.strokeDasharray = `${length}`; node.style.strokeDashoffset = length; node.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { delay, duration, easing: 'ease-out', fill: 'forwards' }); };
  const colors = () => { const s = document.documentElement.style; s.setProperty('--paper', C.colors.paper); s.setProperty('--ink', C.colors.ink); s.setProperty('--quiet-ink', C.colors.quietInk); s.setProperty('--liquid', C.colors.liquid); s.setProperty('--attention', C.colors.attention); };

  function hairPath(x, top, bottom, side) {
    const inwards = side * 27, outer = side * 12;
    return `M ${x} ${top} C ${x + outer} ${top + 94}, ${x + inwards} ${bottom - 158}, ${x + inwards} ${bottom - 42} L ${x + outer} ${bottom} C ${x - outer} ${bottom - 115}, ${x - outer} ${top + 86}, ${x - outer / 3} ${top} Z`;
  }
  function sketchText(key, copy, pos, className = '') {
    const group = add('annotation-layer', 'g', { class: `note ${key}` });
    const [x, y] = pos;
    const primary = make('text', { class: `annotation ${className}`, x, y }); primary.textContent = copy[0]; group.append(primary);
    if (copy[1]) { const secondary = make('text', { class: 'annotation small', x, y: y + 27 }); secondary.textContent = copy[1]; group.append(secondary); }
    return group;
  }
  function base(l) {
    const span = l.rightHairX - l.leftHairX, start = l.leftHairX - span * 1.18, end = l.rightHairX + span * 1.18;
    const substrate = add('surface-layer', 'path', { class: 'surface', d: `M ${start} ${l.substrateY} Q ${(start + end) / 2} ${l.substrateY - 7} ${end} ${l.substrateY}` });
    const echo = add('surface-layer', 'path', { class: 'surface-echo', d: `M ${start + 37} ${l.substrateY + 7} Q ${(start + end) / 2} ${l.substrateY + 1} ${end - 42} ${l.substrateY + 7}` });
    draw(substrate, 850, 640); draw(echo, 1060, 560);
    [['left', l.leftHairX, 1, 0], ['right', l.rightHairX, -1, 250]].forEach(([, x, side, delay]) => {
      const hair = add('hair-layer', 'path', { class: 'hair', d: hairPath(x, l.hairTop, l.hairBottom, side) });
      hair.style.fillOpacity = '0';
      draw(hair, C.timings.hairs.start + delay, C.timings.hairs.duration - delay);
      hair.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], { delay: C.timings.hairs.start + delay + 680, duration: 600, easing: 'ease-out', fill: 'forwards' });
      const mark = add('hair-layer', 'path', { class: 'hair-mark', d: `M ${x - side * 3} ${l.hairTop + 83} Q ${x + side * 9} ${(l.hairTop + l.hairBottom) / 2} ${x + side * 5} ${l.hairBottom - 104}` });
      draw(mark, C.timings.hairs.start + 360 + delay, 980);
    });
  }
  function circlePath(l) { const cx = (l.leftHairX + l.rightHairX) / 2, cy = l.circleY, rx = l.circleRX, ry = l.circleRY; return `M ${cx - rx} ${cy + 3} C ${cx - rx + 10} ${cy - ry + 15}, ${cx + rx - 19} ${cy - ry - 4}, ${cx + rx} ${cy - 3} C ${cx + rx - 9} ${cy + ry - 10}, ${cx - rx + 15} ${cy + ry + 7}, ${cx - rx} ${cy + 3}`; }
  function bridgePath(l) {
    const left = l.leftHairX + 8, right = l.rightHairX - 8, top = l.circleY - 109, belly = l.circleY + 116;
    return `M ${left} ${top} C ${left + 32} ${top + 82}, ${left + 33} ${belly - 74}, ${left + 9} ${belly} C ${left + 58} ${belly - 50}, ${right - 58} ${belly - 50}, ${right - 9} ${belly} C ${right - 33} ${belly - 74}, ${right - 32} ${top + 82}, ${right} ${top} C ${right - 46} ${top + 57}, ${left + 46} ${top + 57}, ${left} ${top} Z`;
  }
  function transferPath(l) {
    const cx = (l.leftHairX + l.rightHairX) / 2, bridgeBottom = l.circleY + 116, top = l.circleY + 27, bottom = l.substrateY;
    return `M ${l.leftHairX + 17} ${top} C ${l.leftHairX + 49} ${top + 102}, ${cx - 17} ${bridgeBottom - 16}, ${cx - 19} ${bridgeBottom + 35} C ${cx - 22} ${bottom - 74}, ${cx - 53} ${bottom - 25}, ${cx - 102} ${bottom} L ${cx + 104} ${bottom} C ${cx + 51} ${bottom - 25}, ${cx + 23} ${bottom - 74}, ${cx + 19} ${bridgeBottom + 35} C ${cx + 17} ${bridgeBottom - 16}, ${l.rightHairX - 49} ${top + 102}, ${l.rightHairX - 17} ${top} C ${l.rightHairX - 53} ${top + 58}, ${l.leftHairX + 53} ${top + 58}, ${l.leftHairX + 17} ${top} Z`;
  }
  function run() {
    clear(); colors(); const l = layout(); svg.setAttribute('viewBox', l.viewBox); base(l);
    const two = sketchText('two-hairs', C.text.twoHairs, l.labels.twoHairs); show(two, C.timings.twoHairs.start, C.timings.twoHairs.duration); fade(two, C.timings.circle.start - 300, 180);
    later(() => {
      const ring = add('thinking-layer', 'path', { class: 'attention', d: circlePath(l) }); draw(ring, 0, C.timings.circle.duration);
      const wait = sketchText('wait', C.text.wait, l.labels.wait, 'wait'); show(wait, C.timings.wait.start - C.timings.circle.start, C.timings.wait.duration); fade(wait, C.timings.gapQuestion.start - C.timings.circle.start - 150, 160);
      const question = sketchText('gap-question', C.text.gapQuestion, l.labels.question); show(question, C.timings.gapQuestion.start - C.timings.circle.start, C.timings.gapQuestion.duration);
      later(() => { const cross = add('thinking-layer', 'path', { class: 'cross-out', d: `M ${l.labels.question[0] - 4} ${l.labels.question[1] - 12} L ${l.labels.question[0] + 82} ${l.labels.question[1] + 6}` }); draw(cross, 0, C.timings.questionCrossOut.duration); }, C.timings.questionCrossOut.start - C.timings.circle.start);
      later(() => { const gap = sketchText('gap', C.text.gap, l.labels.gap); show(gap, 0, C.timings.gap.duration); }, C.timings.gap.start - C.timings.circle.start);
      later(() => fade(ring, 0, 520), C.timings.bridge.start - C.timings.circle.start + 140);
    }, C.timings.circle.start);
    later(() => {
      const bridge = add('liquid-layer', 'path', { class: 'liquid', d: bridgePath(l) }); bridge.style.fillOpacity = '0'; draw(bridge, 0, C.timings.bridge.duration); bridge.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], { delay: 620, duration: 960, easing: 'ease-out', fill: 'forwards' });
      const edge = add('liquid-layer', 'path', { class: 'liquid-edge', d: `M ${l.leftHairX + 24} ${l.circleY + 22} Q ${(l.leftHairX + l.rightHairX) / 2} ${l.circleY + 61} ${l.rightHairX - 24} ${l.circleY + 22}` }); draw(edge, 1030, 600);
      later(() => { fade(el('annotation-layer').querySelector('.gap'), 0, 180); const note = sketchText('bridge-note', C.text.bridge, l.labels.bridge); show(note, 0, C.timings.bridgeLabel.duration); }, C.timings.bridgeLabel.start - C.timings.bridge.start);
    }, C.timings.bridge.start);
    later(() => {
      const transfer = add('liquid-layer', 'path', { class: 'liquid', d: transferPath(l) }); transfer.style.fillOpacity = '0'; draw(transfer, 0, C.timings.transfer.duration); transfer.animate([{ fillOpacity: 0 }, { fillOpacity: 1 }], { delay: 420, duration: 1100, easing: 'ease-out', fill: 'forwards' });
      later(() => { fade(el('annotation-layer').querySelector('.bridge-note'), 0, 180); const note = sketchText('transfer-note', C.text.transfer, l.labels.transfer); show(note, 0, C.timings.transferLabel.duration); }, C.timings.transferLabel.start - C.timings.transfer.start);
    }, C.timings.transfer.start);
    restartTimer = setTimeout(run, C.loopDuration);
  }
  function restart() { clearTimeout(restartTimer); timers.forEach(clearTimeout); timers = []; run(); }
  window.addEventListener('resize', restart); run();
})();
