/* Edit this file first: all story timing and composition coordinates live here. */
window.THINKING_ON_PAPER_CONFIG = {
  loopDuration: 15000,
  timings: {
    hairs: { start: 180, duration: 1760 },
    twoHairs: { start: 1720, duration: 260 },
    circle: { start: 3260, duration: 780 },
    wait: { start: 4080, duration: 220 },
    gapQuestion: { start: 4740, duration: 280 },
    questionCrossOut: { start: 6080, duration: 390 },
    gap: { start: 6540, duration: 260 },
    bridge: { start: 6630, duration: 2180 },
    bridgeLabel: { start: 8530, duration: 300 },
    transfer: { start: 11120, duration: 1860 },
    transferLabel: { start: 13280, duration: 300 }
  },
  colors: { paper: '#f3eddb', ink: '#2d2b25', quietInk: '#756f62', liquid: '#73aeb7', attention: '#548d95' },
  text: {
    twoHairs: ['TWO HAIRS', '兩根毛'],
    wait: ['wait...', ''], gapQuestion: ['GAP?', '空隙？'], gap: ['GAP', '空隙'],
    bridge: ['LIQUID BRIDGE', '液橋'], transfer: ['LIQUID TRANSFER', '液體轉移']
  },
  layouts: {
    landscape: {
      viewBox: '0 0 1600 900', leftHairX: 674, rightHairX: 926, hairTop: 148, hairBottom: 605,
      substrateY: 694, circleY: 394, circleRX: 165, circleRY: 153,
      labels: { twoHairs: [1056, 244], wait: [1045, 354], question: [1062, 412], gap: [1062, 412], bridge: [1023, 552], transfer: [1038, 747] }
    },
    portrait: {
      viewBox: '0 0 720 1280', leftHairX: 218, rightHairX: 502, hairTop: 188, hairBottom: 788,
      substrateY: 1030, circleY: 531, circleRX: 170, circleRY: 164,
      labels: { twoHairs: [88, 128], wait: [92, 420], question: [90, 478], gap: [90, 478], bridge: [86, 824], transfer: [90, 1103] }
    }
  }
};
