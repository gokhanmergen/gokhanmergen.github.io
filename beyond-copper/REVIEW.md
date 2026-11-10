# Pass 1 of the idea review: the core idea — 9 November 2026 (night)

From a ranked list of outside ideas, this pass took the ones that strengthen "then, beam, now" itself.

| Idea | Change |
|---|---|
| The sound goes through the beam | The last stage of both disks' offline render is a Paula chain (`paulaGen` in `js/music.js`): 22 kHz sample-and-hold without anti-aliasing, 8 bits, a 3.6 kHz low-pass that sweeps open to 19 kHz. `main.js` builds its curve from each part's `beamAt()`, the same function the picture uses. On: Boing, Vector Balls, Glenz, Tunnel, Fractal and the four Disk 2 levels. Off: the cracktro and greetings (already chip music). |
| A copper split in Boing | The beam stops 42 % of the way down for a bar (1984 below, the lit room above; the ball changes material as it bounces through), then finishes on the drum fill. The held line is dimmer (`o.beamGlow`). |
| Two more bent beams | Glenz: through the crystal the line is refracted and split by dispersion; each colour channel picks 1991 or glass from where its exit ray points. Tunnel: the beam is a ring running down the tunnel into the vanishing point. Scenes that bend the beam write the split into alpha and set `o.mask`, so the post chain pixelates the right side and leaves out its straight line there. |
| Replace the tunnel white-out | No flash at either side of the cut. FRACTAL DREAMS opens with the tunnel's own tile and 16 colours still rushing outward, wrapped around a small Mandelbrot set that grows out of the vanishing point; the rings bend to the set's level lines, then drain ring by ring into the 32-colour colour-cycled set before the beam. |
| Longer 1985 halves | Vector Balls and Glenz keep their bobs and glenz for a whole pattern (7.7 s, was 3.8 s). Vector Balls pays with its sphere and galaxy stages: the lattice flies straight into the knot, and AMIGA lands on the pattern-11 downbeat and holds to the cut. Fractal stays at two bars (the tunnel opening fills them; a longer one would cut the seahorse dive). |

Verification: `node --test tests/*.test.cjs` (11 tests; three new: the chain dulls only its window and leaves
the rest bit-identical, it is a no-op at k = 0, and `main.js` hands each disk the right curve on the right
clock). Disk 1 was rendered offline in Node and measured: in the 1985 halves the chain removes 8–14 dB of
high-frequency energy at under 0.1 dB of loudness change; the hi-fi parts are unchanged; no new clicks at
the cuts; peak 0.76. Headless-Chrome stills (Metal) around every changed transition, a frame strip of the
Glenz beam, and the four Disk 2 beams. The live path (load, Disk 1 render, playing into Disk 2 while it
depacks) ran once without errors at 60 fps.

Not judged: anything by ear (the chain's strength in particular is a guess), and motion at full frame rate.
Frame rates were not re-measured; the Glenz shader does more work only during its 1.4 s beam.

## Runner fixes (from viewing)

| Finding | Change |
|---|---|
| A white shade behind the runner in both halves: the moon's glitter path. The sky does not scroll and the hero holds his place on screen, so the path below the moon sat at his back all level long and read as a glow stuck to him. Moving the moon only moved the patch. | No glitter path; the moon stays where it was. The lake keeps its reflections of the aqueduct and hills. |
| On the long last leap the trailing leg's knee bent backwards (down to -81 deg) and the thigh swung back to horizontal (-88 deg): the spline carried the push-off's fast backswing across a first key placed in proportion to the 4.6-step flight. Every regular leap also overextended the landing leg by 13 deg. | The trailing leg's first key comes at most 0.6 steps after toe-off, and soft joint limits (softplus: knee at least 5 deg, hip at most 50 deg back) keep every spline anatomical without breaking velocity continuity. Measured every 1/100 step over the whole level: knee min 5 deg (was -81), hip back at most 45 deg (was 88); normal running unchanged. |

---

# Fit-and-finish pass — 9 November 2026 (evening)

Every part was re-inspected in headless Chrome: a contact sheet of the whole timeline, closely spaced frames
around all sixteen cuts, and the runner frame by frame. The runner's gait was also checked numerically
(joint velocities sampled every 1/100 step for the whole level).

| Area | Finding | Change |
|---|---|---|
| Runner: gait | The hip stopped dead on every landing (a 40 px/step fall to zero in one frame), every toe-off had a knee kink (the swing spline started at 60 % of the stance speed), the take-off spring began at half speed, and the hip stepped slightly between strides while accelerating. | The fall's velocity is carried into the landing and absorbed by the knees; tangents are continuous at toe-off and take-off; stance timing follows the current speed. |
| Runner: picture | 1985 half: random white dashes flickered beside the hero (meant as moon glitter) and palm reflections broke up into dark blots. Modern half: the glitter was a wide field of static behind the hero; footfall rings hung in the air over the streams; eye and hairline merged into a pair of sunglasses; the white sprite bloomed heavily. | A proper glitter path under the moon in both halves (removed again later: see the runner fixes above); no palms in the lo-res reflection; rings clipped to the bank; a one-pixel eye clear of the hair; less bloom before the beam; the light trail starts at the sash. |
| Cuts between parts | Modern, wide parts cut straight to the next part's CRT; flashes washed over the bezel and pillarbox. | The tube outro (see `scenario.md`); flashes stay inside the picture; bezel light spill now falls off with distance instead of tinting the whole surround. |
| "Then" halves | Tunnel, Fractal and Greetings skipped the CRT; Boing and Greetings showed their 1985 half for under two seconds. | All three start in the tube; Boing and Greetings get two bars before the beam. |
| PIX screens | The cracktro logo and the tracker title were cut off by the tube's rounded corners. | A 6 % overscan border that repeats the edge colour. |
| Copla | 26 s on the opening shot. | A second shot from bar 70, low over the water. |
| Player | No feedback on pause, skip or quality; the pointer stayed visible; a fatal error rescheduled itself every frame; a hidden tab was read as a slow GPU. | One-line on-screen display in the 8×8 font, `1`/`2`/`Home`, double-click fullscreen, idle pointer hidden, loops stop on a fatal error, long frame gaps ignored by the scaler. The end screen drops the loading bar. |

Not done in this pass: the runner still has no hand-authored cycle; the shooter's legibility, the palace's
depth and startup hardening (items 1–3 and 5 below) are unchanged. Nothing here was judged by ear, and
frame rates were not re-measured; the shader changes are a few instructions each.

Verification: `node --test tests/*.test.cjs` (eight tests, two new: disk-jump keys with the pause display,
and the loop stopping after a render error), syntax checks, and the stills described above. The live path
(audio clock, a part skip, the on-screen display, the end screen) was run once in headless Chrome.

---

# Demo review — 9 November 2026

The strongest idea is the continuity between the pixel effect and its modern rendering. The biggest improvement is to make the objects recognizable before adding more effects: a distinctive runner, spacecraft, car and computer carry more nostalgia than extra bloom. Keep the music-driven choreography and give physical objects convincing contact.

## Changes in this pass

| Area | Finding | Change |
|---|---|---|
| Cracktro | A vertical sine existed, but horizontal travel dominated it. The long message could not finish at the revised speed. | Slower horizontal travel, 27-pixel vertical amplitude, time-plus-screen-position phase, and a shorter message. Nominal peak vertical speed is 1.5× horizontal speed. |
| Greetings | The wave phase used text coordinates, and the modern depth motion competed with the vertical wave. | Screen-relative phase shared by the pixel and voxel versions, larger vertical amplitude, smaller depth amplitude. Nominal base vertical speed is 1.5× horizontal speed; camera motion, musical accents and the final braking/morph alter the projected ratio. |
| Disk change | The label end entered the drive first. | Shutter at the leading lower edge, label remaining readable. |
| Runner | Black silhouette and long scarf had little connection to the Prince of Persia reference. | Ivory clothing, waist sash, brown hair/shoes and skin colours; retain the existing articulated gait and musical jumps. |
| Shooter | Star/rhombus enemies and gold player craft read as abstract ornaments. | Swept alloy interceptor, twin engines and several wing/boom enemy silhouettes. |
| Racer | Dark generic wedge was hard to identify. | Red Esprit-style body, flatter cabin, black rear louvres, spoiler and rectangular tail lights. |
| Finale | Generic proportions and blank keys weakened the computer reveal. Keyboard distance estimates were discontinuous and extended beneath the caps. | Shallower case, bounded solid keys, key legends, vents, AMIGA 1200 badge, three light pipes, integrated right drive slot and wider final framing. |
| Boing spheres | Independent analytic paths allowed balls to pass through each other. | Fixed-step 3D contacts, radius-cubed masses, restitution, overlap correction and floor ripples at actual landings. The original single-ball opening stays analytic. The vector swarm stays choreographed. |
| Playback | A jump into an unrendered Disk 2 resumed at the disk opening. | Preserve the pending seek and cancel it when navigating away. |
| Playback | Seeking after the ending left the overlay visible; replay could remain suspended. | Clear the end state on navigation and resume the audio context on replay. Clamp rendering at the final frame. Ignore repeat events for toggle keys. |

These game graphics are newly drawn procedural interpretations, not extracted original game sprites. The A1200 is closer in silhouette and detail, but it is **not an identical hardware replica**. Its keyboard still simplifies key sizes, staggering, function-key grouping and legends. For a faithful follow-up, compare an orthographic model against front, top and side references; the [A1200 service addendum](https://www.valoroso.it/file-share/documenti-manuali/Commodore-Amiga-1200-service-addendum-schematics.pdf) and [A1200.NET case reference](https://www.a1200.net/amiga-1200-cases/) are useful starting points.

## Next improvements, in priority order

1. **Complete the identity of the retro game art.** The runner needs a hand-authored animation cycle with asymmetric poses, weight transfer, heel strikes and a distinct jump silhouette. The shooter needs detailed pixel hull panels and a stronger mechanical enemy vocabulary. The procedural versions improve recognition but still look smoother and simpler than the requested originals. Preserve the same silhouette across each beam.
2. **Make shooter action legible.** Bright bolts, sparks and a high-frequency tile floor compete for attention. Reduce floor contrast behind the flight plane, reserve the brightest values for shots and hit cores, and add short, unmistakable hit reactions. The boss should visibly threaten the player; the current sequence largely presents a target and escorts. Keep outcomes deterministic for musical sync.
3. **Make the road climax feel spatial.** The palace is a flat elevation, so it reads as scenery when enlarged. Add a few depth planes, an offset tower and an approach that reveals parallax. Use a fixed warm light hierarchy rather than making every window equally bright.
4. **Give the copla a visible development.** A minute in the courtyard needs a change that viewers can follow: progressively reflected stars, doors opening to warm light, or a motif crossing the pool and resolving at dawn. Let each camera cut reveal progress.
5. **Harden startup and recovery.** Shader initialization is eager; consider yielding between costly compiles. Add WebGL context-loss recovery and stop scheduling rendering after a fatal error—the current loops schedule the next frame before handling failures. Add a real focusable start/replay control and accessible instructions; the current button is inside a hidden DOM container.
6. **Measure performance and audio on more machines.** Check integrated GPUs, high-DPI displays, Safari and Firefox. The finale now evaluates real bounded keyboard solids and should be benchmarked again. This pass does not establish a GPU performance improvement or validate the complete soundtrack by ear.

## Verification

- Chrome visual inspection: updated runner, shooter, racer, voxel greetings, finale and a running Boing scene.
- JavaScript syntax checks and `git diff --check`.
- `node --test tests/*.test.cjs`: six regression tests, including pending Disk 2 seeks, cancellation, end-overlay navigation, replay from suspension, a head-on collision, and separation/floor constraints at every baked frame of the actual Boing timeline.
- Physics uses a 240 Hz bake and interpolation, so it is independent of render frame rate and supports backward seeking. It is a small bounded demo simulation, not a general rigid-body engine. Floor bounces replenish energy; collisions can shift their musical phase.
- A complete seven-minute audiovisual playback and cross-browser/performance sweep remain outstanding.
