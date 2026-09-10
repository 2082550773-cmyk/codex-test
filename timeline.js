/* A small, dependency-free drawing timeline. The scene restarts every 15 seconds. */
(() => {
  const C = window.SKETCH_CONFIG;
  const $ = (id) => document.getElementById(id);
  const groups = ['underlines', 'hairs', 'gap-guide', 'liquid', 'substrate', 'attention', 'annotations', 'caption'];
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (name, attrs = {}) => {
    const el = document.createElementNS(NS, name);
    Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
    return el;
  };
  const add = (group, name, attrs) => { const el = svgEl(name, attrs); $(group).append(el); return el; };
  const path = (group, d, className = 'draw', delay = 0, duration = 600) => {
    const el = add(group, 'path', { d, class: className });
    const length = el.getTotalLength();
    el.style.setProperty('--length', length);
    el.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { duration, delay, fill: 'forwards', easing: 'ease-out' });
    return el;
  };
  const text = (group, content, x, y, className, delay = 0) => {
    const el = add(group, 'text', { x, y, class: className, opacity: 0 }); el.textContent = content;
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, delay, fill: 'forwards' }); return el;
  };
  const fade = (el, delay, out = true) => el.animate([{ opacity: out ? 1 : 0 }, { opacity: out ? 0 : 1 }], { duration: 320, delay, fill: 'forwards', easing: 'ease-in-out' });
  const clear = () => groups.forEach((id) => ($(id).innerHTML = ''));
  const stage = (name) => { $('stage-label').textContent = `${String(C.stages.findIndex(s => s.name === name) + 1).padStart(2, '0')} / ${name}`; };

  function baseHairs(delay = 0) {
    const { leftHair: L, rightHair: R } = C.positions;
    path('hairs', `M ${L - 35} 505 C ${L - 15} 435, ${L - 14} 267, ${L + 8} 156 C ${L + 13} 130, ${L + 20} 106, ${L + 23} 86`, 'draw', delay, 800);
    path('hairs', `M ${R + 34} 505 C ${R + 12} 431, ${R + 13} 275, ${R - 10} 158 C ${R - 15} 132, ${R - 21} 109, ${R - 24} 86`, 'draw', delay + 100, 800);
    path('underlines', `M ${L - 57} 514 q 40 8 76 0 M ${R - 20} 514 q 38 8 76 0`, 'draw', delay + 450, 350);
  }
  function circle(group, cx, cy, r, delay, duration = 530) {
    const el = add(group, 'ellipse', { cx, cy, rx: r, ry: r * .83, class: 'draw' });
    const length = el.getTotalLength(); el.style.setProperty('--length', length);
    el.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], { duration, delay, fill: 'forwards', easing: 'ease-out' }); return el;
  }
  function drawScene() {
    clear();
    const { gapCenter: X, substrateY: Y } = C.positions;
    stage('TWO HAIRS');
    text('caption', 'two hairs', 82, 98, 'caption', 120);
    path('annotations', 'M 84 112 q 108 10 214 -3', 'draw soft', 230, 450);
    baseHairs(410);
    text('annotations', 'natural taper', 170, 308, 'annotation-small', 1250);
    path('annotations', 'M 302 304 q 83 -24 160 -51', 'draw soft', 1370, 450);

    setTimeout(() => {
      stage('NOTICE THE GAP');
      text('caption', 'not the hair — the space between', 82, 98, 'caption', 100);
      path('caption', 'M 83 112 q 275 11 497 -2', 'draw soft', 220, 550);
      circle('attention', X, 315, 130, 520);
      circle('attention', X + 5, 316, 144, 650);
      path('gap-guide', `M ${X} 210 q -7 104 1 208`, 'draw soft', 1150, 540);
      text('annotations', 'gap', X - 19, 190, 'annotation-text', 1250);
      path('annotations', `M ${X - 5} 199 q 8 12 4 28`, 'draw soft', 1350, 250);
      const old = $('hairs'); fade(old, 2600, true);
    }, 3300);

    setTimeout(() => {
      stage('LIQUID BRIDGE');
      text('caption', 'let liquid occupy the gap', 82, 98, 'caption', 50);
      path('caption', 'M 82 112 q 217 10 407 -2', 'draw soft', 170, 500);
      path('liquid', `M 510 340 C 531 305 551 286 580 286 C 610 286 631 306 651 340 C 634 372 612 392 580 394 C 547 392 527 372 510 340 Z`, '', 0, 0).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 520, fill: 'forwards' });
      path('liquid', 'M 580 202 C 567 225 569 250 580 280 C 592 251 593 226 580 202 Z', '', 0, 0).animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 160, fill: 'forwards' });
      path('attention', 'M 480 446 q 98 45 201 -1', 'draw', 1050, 580);
      text('annotations', 'bridge', 716, 346, 'annotation-text', 1290);
      path('annotations', 'M 704 351 q -34 3 -72 -8', 'draw soft', 1400, 340);
    }, 6500);

    setTimeout(() => {
      stage('LIQUID TRANSFER');
      text('caption', 'then transfer to the substrate', 82, 98, 'caption', 50);
      path('caption', 'M 82 112 q 244 10 467 -2', 'draw soft', 180, 500);
      path('substrate', `M 320 ${Y} q 265 -9 525 0`, 'draw', 390, 800);
      path('substrate', `M 344 ${Y + 11} q 240 -6 474 0`, 'draw soft', 620, 700);
      const drop = path('liquid', `M 580 395 C 561 443 554 478 580 530 C 607 478 599 443 580 395 Z`, '', 0, 0);
      drop.animate([{ opacity: 0, transform: 'translate(0 -8px)' }, { opacity: 1, transform: 'translate(0 0)' }], { duration: 420, delay: 570, fill: 'forwards' });
      const pool = path('liquid', `M 522 ${Y} C 539 570 560 562 580 562 C 602 562 623 570 641 ${Y} C 616 602 548 602 522 ${Y} Z`, '', 0, 0);
      pool.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 1300, fill: 'forwards' });
      path('attention', `M 484 ${Y + 34} q 98 37 193 0`, 'draw', 1850, 550);
      text('annotations', 'transfer', 706, 580, 'annotation-text', 2050);
      path('annotations', `M 694 584 q -33 5 -70 0`, 'draw soft', 2170, 330);
      text('annotations', 'substrate', 342, 655, 'annotation-small', 2380);
    }, 10300);
  }
  drawScene();
  setInterval(drawScene, C.duration);
})();
