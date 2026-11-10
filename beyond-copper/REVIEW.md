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
