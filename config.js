/* Edit this file first: the main visual and timing controls live here. */
window.SKETCH_CONFIG = {
  duration: 15000,
  ink: '#252019',
  liquid: '#7a9d99',
  stages: [
    { name: 'TWO HAIRS', start: 0, end: 3300 },
    { name: 'NOTICE THE GAP', start: 3300, end: 6500 },
    { name: 'LIQUID BRIDGE', start: 6500, end: 10300 },
    { name: 'LIQUID TRANSFER', start: 10300, end: 15000 }
  ],
  positions: {
    leftHair: 480,
    rightHair: 680,
    substrateY: 590,
    gapCenter: 580
  },
  pauses: { hair: 700, gap: 750, bridge: 700, transfer: 850 }
};
