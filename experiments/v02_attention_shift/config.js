/*
 * V02 controls
 * -----------
 * Edit this file first. Timing is in milliseconds and all coordinates are in
 * the SVG coordinate system. There are separate layouts so the portrait view
 * is composed intentionally rather than cropping the landscape drawing.
 */
window.ATTENTION_SHIFT_CONFIG = {
  loopDuration: 15000,

  // Change these values to adjust how long each idea is held on screen.
  stages: [
    { name: 'TWO HAIRS', start: 0, end: 3000 },
    { name: 'NOTICE THE GAP', start: 3000, end: 6000 },
    { name: 'LIQUID BRIDGE', start: 6000, end: 11000 },
    { name: 'LIQUID TRANSFER', start: 11000, end: 15000 }
  ],

  colors: {
    paper: '#f3eddb',
    ink: '#292721',
    softInk: '#716c60',
    liquid: '#76aeba',
    attention: '#73b8c7'
  },

  // This is the only annotation drawn inside the scene.
  annotations: { gap: 'GAP' },

  layouts: {
    landscape: {
      viewBox: '0 0 1600 900',
      leftHairX: 685,
      rightHairX: 915,
      hairTop: 170,
      hairBottom: 590,
      gapWidth: 230,
      substrateY: 682,
      attentionY: 380,
      attentionRadius: 156,
      annotationX: 1066,
      annotationY: 310
    },
    portrait: {
      viewBox: '0 0 720 1280',
      leftHairX: 248,
      rightHairX: 472,
      hairTop: 210,
      hairBottom: 805,
      gapWidth: 224,
      substrateY: 1010,
      attentionY: 520,
      attentionRadius: 152,
      annotationX: 497,
      annotationY: 447
    }
  },

  drawing: {
    hairDuration: 650,
    circleDuration: 660,
    liquidRevealDuration: 700,
    transferDuration: 1450
  }
};
