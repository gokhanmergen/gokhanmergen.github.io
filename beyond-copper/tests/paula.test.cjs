const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function engine() {
  const c = vm.createContext({ Math, Float32Array, Float64Array, performance });
  vm.runInContext(readFileSync('js/music.js', 'utf8'), c);
  return vm.runInContext('MUSIC.engine', c);
}
// two seconds of a mix-like signal: a low tone plus bright noise
function signal(SR) {
  const N = 2 * SR, L = new Float32Array(N), R = new Float32Array(N); let s = 7;
  for (let i = 0; i < N; i++) { s = (s * 1664525 + 1013904223) >>> 0; const n = s / 2 ** 31 - 1; L[i] = 0.4 * Math.sin(i * 2 * Math.PI * 110 / SR) + 0.15 * n; R[i] = L[i]; }
  return { N, L, R };
}
const run = (E, x, k) => { const g = E.paulaGen(x.L, x.R, x.N, k); while (!g.next().done); };
const hf = (X, a, b) => { let h = 0; for (let i = a + 1; i < b; i++) { const d = X[i] - X[i - 1]; h += d * d; } return h / (b - a); };

test('the Paula chain dulls the 1985 window and leaves the rest bit-identical', () => {
  const E = engine(), SR = E.SR, x = signal(SR), dry = Float32Array.from(x.L);
  run(E, x, t => t < 1 ? 1 : 0);
  const a = Math.round(0.1 * SR), b = Math.round(0.9 * SR);
  assert.ok(hf(x.L, a, b) < hf(dry, a, b) / 10, 'at least 10 dB less high-frequency energy while k = 1');
  const tail = Math.round(1.01 * SR);
  for (let i = tail; i < x.N; i++) assert.equal(x.L[i], dry[i]);
});

test('k = 0 everywhere changes nothing', () => {
  const E = engine(), x = signal(E.SR), dry = Float32Array.from(x.L);
  run(E, x, () => 0);
  assert.deepEqual(x.L, dry);
});
