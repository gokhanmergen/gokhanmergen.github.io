const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

// Exercise the real loader/clock/controller without rendering seven minutes of audio.
async function demo(query = '?autostart&t=18') {
  const listeners = {}, frames = [], starts = [], draws = [];
  const noop = () => {};
  const classes = new Set();
  const ctx = { createImageData: () => ({ data: new Uint8Array(320 * 256 * 4) }), putImageData: noop, fillRect: noop };
  const osd = [];
  const elements = Object.fromEntries(['ui', 'status', 'fill', 'go', 'hud', 'err', 'c', 'ld', 'osd'].map(id => [id, {
    style: {}, dataset: {}, textContent: '', addEventListener: noop, getContext: () => ctx,
    classList: { add: x => classes.add(x), remove: x => classes.delete(x), contains: x => classes.has(x) },
  }]));
  elements.osd.classList = { add: () => osd.push('on'), remove: () => osd.push('off') };
  let ready = false;
  class Audio {
    constructor() { this.currentTime = 0; this.state = 'running'; Audio.instance = this; }
    createBuffer() { return { copyToChannel: noop }; }
    createBufferSource() { return { connect: noop, disconnect: noop, stop: noop, start: (...args) => starts.push(args) }; }
    resume() { this.state = 'running'; }
    suspend() { this.state = 'suspended'; }
  }
  const song = { N: 1, SR: 1, L: new Float32Array(1), R: new Float32Array(1) };
  const sandbox = {
    console: { error: noop, log: noop }, URLSearchParams, Float32Array, Uint8Array, Math, performance: { now: () => 0 },
    innerWidth: 640, innerHeight: 480, location: { search: query },
    document: { getElementById: id => elements[id], body: { classList: { add: noop, remove: noop } } },
    setInterval: noop, setTimeout: noop, clearTimeout: noop, requestAnimationFrame: fn => frames.push(fn),
    PIX: { W: 320, H: 256, font8: { mask: new Uint8Array(64 * 64) }, buf: new Uint8Array(320 * 256 * 4), hex: x => x, init: noop, clear: noop, rect: noop, text: noop, centre: noop, bevel: noop },
    MUSIC: { PAT: 1, LEN: 10, env: () => 0, render: async () => song, engine: { step: () => ready ? { done: true, value: song } : { value: { p: 0.5 } } } },
    LEY: { AT: 10, LEN: 20, env: () => 0, start: () => ({}), barAt: () => 0, bpm: () => 120 },
    G: { init: noop, globals: {}, ensure: () => ({ w: 640, h: 480 }), post: noop },
    SCENES: [{ name: 'one', range: () => [0, 10], draw: st => { draws.push(st); } }, { name: 'two', disk: 2, range: () => [10, 30], draw: st => { draws.push(st); } }],
    AudioContext: Audio, addEventListener: (name, fn) => (listeners[name] ||= []).push(fn), removeEventListener: noop,
  };
  sandbox.window = sandbox;
  const loading = vm.runInNewContext(readFileSync('js/main.js', 'utf8'), sandbox);
  // Scene compilation yields once only if there are initializers; this fixture has none.
  await loading;
  return {
    elements, starts, draws, ac: Audio.instance, classes, osd,
    fail: () => { sandbox.G.post = () => { throw new Error('lost context'); }; }, pending: () => frames.length,
    ready: () => { ready = true; }, tick: () => { assert.ok(frames.length); frames.shift()(); },
    key: key => listeners.keydown.forEach(fn => fn({ key, preventDefault: noop })),
  };
}

test('a pending Disk 2 seek resumes at the requested position', async () => {
  const d = await demo();
  d.tick();
  assert.equal(d.draws.at(-1).t, 10); // disk change while depacking
  d.ready(); d.tick();
  assert.equal(d.starts.at(-1)[1], 8); // requested global 18, not Disk 2 opening
  assert.equal(d.draws.at(-1).t, 18);
});

test('seeking back cancels a pending Disk 2 jump', async () => {
  const d = await demo(); d.tick();
  d.key('ArrowLeft'); // restart current part
  d.key('ArrowLeft'); // previous part
  d.ready(); d.tick();
  assert.equal(d.draws.at(-1).t, 0);
});

test('seeking after the ending dismisses the overlay', async () => {
  const d = await demo('?autostart&t=29'); d.ready();
  d.ac.currentTime = 2; d.tick();
  assert.equal(d.classes.has('hidden'), false);
  assert.ok(d.draws.at(-1).t < 30); // clamp the final frame
  d.key('ArrowLeft');
  assert.equal(d.classes.has('hidden'), true);
  assert.equal(d.elements.go.style.display, 'none');
});

test('replay resumes a suspended audio context', async () => {
  const d = await demo(); d.ready(); d.tick();
  d.key(' '); assert.equal(d.ac.state, 'suspended');
  d.elements.go.onclick();
  assert.equal(d.ac.state, 'running');
  assert.equal(d.starts.at(-2)[1], 0);
});

test('the 2 key jumps to Disk 2 and resumes playback', async () => {
  const d = await demo('?autostart&t=3'); d.ready(); d.tick();
  d.key(' '); assert.equal(d.ac.state, 'suspended');
  assert.equal(d.osd.at(-1), 'on'); // PAUSED stays on screen
  d.key('2');
  assert.equal(d.ac.state, 'running');
  assert.equal(d.starts.at(-1)[1], 0); // Disk 2 buffer from its start
  d.tick(); assert.equal(d.draws.at(-1).t, 10);
  d.key('1'); d.tick(); assert.equal(d.draws.at(-1).t, 0);
});

test('a fatal render error stops the loop instead of failing every frame', async () => {
  const d = await demo('?autostart&t=3'); d.ready(); d.tick();
  d.fail(); d.tick(); // this frame throws; the one already scheduled must not schedule another
  d.tick();
  assert.equal(d.pending(), 0);
});
