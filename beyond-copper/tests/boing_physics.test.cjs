const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
function engine() {
  const c = vm.createContext({ Float32Array, Math });
  vm.runInContext(readFileSync('js/boing_physics.js', 'utf8'), c);
  return c;
}

test('approaching spheres rebound instead of exchanging sides', () => {
  const { BOING_PHYSICS: physics } = engine();
  const defs = [-1, 1].map(x => ({ X: x, vx: -x * 2, r: .5, h: 0, pb: 1, ph: 0, spawn: -1 }));
  const cache = physics.bake(defs, { from: 0, to: 1, startTime: 0, beat: 1,
    position: (b, beat, t) => [b.X + b.vx * t, 2, 0] });
  assert.ok(cache.contacts > 0);
  const a = physics.sample(cache, 1, 0).p, b = physics.sample(cache, 1, 1).p;
  assert.ok(a[0] < -.5 && b[0] > .5);
  const before = physics.sample(cache, .99, 0).p;
  assert.ok(a[0] < before[0], 'left sphere travels left after contact');
  assert.deepEqual(physics.sample(cache, .5, 0), physics.sample(cache, .5, 0));
});

test('the actual Boing timeline stays separated and above the floor', () => {
  const c = engine();
  c.MUSIC = { PAT: 7.68, BAR: 1.92, BPM: 125 };
  c.window = c; c.SCENES = []; c.G = { program: () => ({}) };
  let captured;
  const bake = c.BOING_PHYSICS.bake;
  c.BOING_PHYSICS.bake = (defs, options) => {
    const cache = bake(defs, options); captured = { defs, cache }; return cache;
  };
  vm.runInContext(readFileSync('js/scene_boing.js', 'utf8'), c);
  c.SCENES[0].init();
  const { defs, cache } = captured;
  let overlap = 0, maxVh = 0, maxVy = 0;
  const hz = c.BOING_PHYSICS.HZ;
  for (let f = 0; f < cache.frames; f++) {
    const t = cache.from + f / hz;
    for (let i = 0; i < defs.length; i++) {
      if (t + 1e-9 < defs[i].spawn) continue;
      const a = (f * cache.count + i) * 6;
      assert.ok(Number.isFinite(cache.data[a + 1]));
      assert.ok(cache.data[a + 1] >= defs[i].r - 1e-6);
      if (f + 1 < cache.frames) {
        const next = ((f + 1) * cache.count + i) * 6;
        const vx = (cache.data[next] - cache.data[a]) * hz;
        const vy = (cache.data[next + 1] - cache.data[a + 1]) * hz;
        const vz = (cache.data[next + 2] - cache.data[a + 2]) * hz;
        maxVh = Math.max(maxVh, Math.hypot(vx, vz));
        maxVy = Math.max(maxVy, Math.abs(vy));
      }
      for (let j = i + 1; j < defs.length; j++) {
        if (t + 1e-9 < defs[j].spawn) continue;
        const b = (f * cache.count + j) * 6;
        const distance = Math.hypot(...[0, 1, 2].map(k => cache.data[a + k] - cache.data[b + k]));
        overlap = Math.max(overlap, defs[i].r + defs[j].r - distance);
      }
    }
  }
  assert.ok(cache.contacts > 0);
  assert.ok(overlap < .005, `maximum penetration ${overlap}`);
  assert.ok(maxVh < 5, `maximum horizontal speed ${maxVh}`);
  assert.ok(maxVy < 14, `maximum vertical speed ${maxVy}`);
});
