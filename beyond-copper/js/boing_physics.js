'use strict';
// Deterministic, fixed-step sphere dynamics. Bake once so seeking, pausing and
// rendering at different frame rates all show the same contacts.
(() => {
  const HZ = 240, STRIDE = 6;
  function bake(defs, { from, to, startTime, beat, position }) {
    const frames = Math.ceil((to - from) * HZ) + 1, count = defs.length;
    const data = new Float32Array(frames * count * STRIDE), bodies = Array(count).fill(null);
    let contacts = 0;
    function clampV(a) {
      const vh = Math.hypot(a.v[0], a.v[2]);
      if (vh > a.maxVh) {
        const s = a.maxVh / vh;
        a.v[0] *= s; a.v[2] *= s;
      }
      if (a.bounce > 0) {
        if (a.v[1] > a.bounce) a.v[1] = a.bounce;
        if (a.v[1] < -a.bounce * 1.15) a.v[1] = -a.bounce * 1.15;
      }
    }
    function bounds(a, b, time) {
      if (a.p[1] < b.r) {
        a.p[1] = b.r;
        if (a.v[1] < 0) {
          // The soundtrack supplies fresh energy at each floor bounce.
          a.v[1] = a.bounce;
          a.impact = [a.p[0], a.p[2], time];
        }
      }
      // A round arena keeps the spheres framed as the camera orbits.
      const radial = Math.hypot(a.p[0], a.p[2]), limit = 4.8 - b.r;
      if (radial > limit) {
        const nx = a.p[0] / radial, nz = a.p[2] / radial;
        a.p[0] = nx * limit; a.p[2] = nz * limit;
        const speed = a.v[0] * nx + a.v[2] * nz;
        if (speed > 0) { a.v[0] -= 1.85 * speed * nx; a.v[2] -= 1.85 * speed * nz; }
      }
      clampV(a);
    }
    for (let frame = 0; frame < frames; frame++) {
      const lt = from + frame / HZ, time = startTime + lt;
      for (let i = 0; i < count; i++) {
        const b = defs[i];
        if (lt + 1e-9 < b.spawn) continue;
        if (!bodies[i]) {
          const p = position(b, time / beat, time), e = 1e-4;
          const prev = position(b, (time - e) / beat, time - e);
          const next = position(b, (time + e) / beat, time + e);
          const v = next.map((x, k) => (x - prev[k]) / (2 * e));
          const gravity = 8 * b.h / (b.pb * beat) ** 2;
          const bounce = Math.sqrt(2 * gravity * b.h);
          const cruise = Math.hypot(v[0], v[2]);
          const maxVh = Math.max(cruise * 1.35, 2.5);
          const falling = b.spawn >= from;
          if (falling) { p[1] = b.r + b.h + 5.5; v[1] = -bounce * 0.55; }
          const impactTime = (Math.floor((time / beat + b.ph) / b.pb) * b.pb - b.ph) * beat;
          const impactPos = position(b, impactTime / beat, impactTime);
          bodies[i] = { p, v, invMass: 1 / b.r ** 2, gravity, bounce, cruise, maxVh,
            impact: [impactPos[0], impactPos[2], falling ? -1e3 : impactTime - startTime] };
        } else {
          const a = bodies[i];
          a.v[1] -= a.gravity / HZ;
          const vh = Math.hypot(a.v[0], a.v[2]);
          if (vh > a.cruise && vh > 1e-6) {
            const target = a.cruise + (vh - a.cruise) * Math.exp(-2.5 / HZ);
            a.v[0] *= target / vh; a.v[2] *= target / vh;
          }
          for (let k = 0; k < 3; k++) a.p[k] += a.v[k] / HZ;
        }
        bounds(bodies[i], b, lt);
      }
      // Iterative projection resolves several simultaneous contacts without
      // applying an impulse twice to an already separating pair.
      for (let iteration = 0; iteration < 8; iteration++) {
        for (let i = 0; i < count; i++) for (let j = i + 1; j < count; j++) {
          const a = bodies[i], b = bodies[j]; if (!a || !b) continue;
          const d = b.p.map((x, k) => x - a.p[k]);
          const distance = Math.hypot(...d);
          const radius = defs[i].r + defs[j].r;
          if (distance >= radius) continue;
          const normal = distance < 1e-9 ? [1, 0, 0] : d.map(x => x / distance);
          const inverseMass = a.invMass + b.invMass;
          const correction = (radius - distance + 1e-6) / inverseMass;
          const relative = normal.reduce((v, n, k) => v + (b.v[k] - a.v[k]) * n, 0);
          const relH = (b.v[0] - a.v[0]) * normal[0] + (b.v[1] - a.v[1]) * normal[1] * 0.2 + (b.v[2] - a.v[2]) * normal[2];
          const impulse = relative < 0 ? -(1 + 0.85) * relative / inverseMass : 0;
          const impulseH = relH < 0 ? -(1 + 0.85) * relH / inverseMass : 0;
          if (impulse > 0) contacts++;
          for (let k = 0; k < 3; k++) {
            const imp = k === 1 ? impulse : impulseH;
            a.p[k] -= normal[k] * correction * a.invMass;
            b.p[k] += normal[k] * correction * b.invMass;
            a.v[k] -= normal[k] * imp * a.invMass;
            b.v[k] += normal[k] * imp * b.invMass;
          }
        }
        bodies.forEach((a, i) => { if (a) bounds(a, defs[i], lt); });
      }
      bodies.forEach((a, i) => {
        if (a) data.set([...a.p, ...a.impact], (frame * count + i) * STRIDE);
      });
    }
    return { data, frames, count, from, contacts };
  }
  function sample(cache, lt, i) {
    const f = Math.min(cache.frames - 1, Math.max(0, (lt - cache.from) * HZ));
    const spawnFrame = cache.spawnFrames?.[i] || 0;
    const a = Math.max(spawnFrame, Math.floor(f)), b = Math.min(cache.frames - 1, a + 1), mix = Math.max(0, f - a);
    const offset = (a * cache.count + i) * STRIDE, next = (b * cache.count + i) * STRIDE;
    const p = [0, 1, 2].map(k => cache.data[offset + k] * (1 - mix) + cache.data[next + k] * mix);
    // An impact is a discrete event; never interpolate its time or origin.
    return { p, impact: Array.from(cache.data.subarray(offset + 3, offset + 6)) };
  }
  globalThis.BOING_PHYSICS = { bake, sample, HZ };
})();
