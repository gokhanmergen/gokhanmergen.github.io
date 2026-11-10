# BEYOND THE COPPER — Scenario, Motivation & Review Notes

*A two-disk browser megademo by the fictional group "Neon Blitter" (2026).*
*Part I explains the concept, Parts II and III walk through every scene, Part IV is written for critics.*

All timestamps are **global mm:ss** from pressing START, taken from the code (`js/music.js`,
`js/leyenda.js`, `js/scene_*.js`). Jump anywhere with `index.html?t=<seconds>`; press `H` for a HUD
showing scene, pattern/row (Disk 1) or bar/BPM (Disk 2).

---

## Part I — The idea

### One sentence
Every part shows an Amiga icon **exactly as it was**, then a **raster beam sweeps down the screen** and
the very same thing carries on at the fidelity of a 2026 GPU.

### Then, beam, now
- **Then.** 320×256, 12-bit colour with ordered dither, 50 Hz stepping, inside a simulated CRT at 5:4.
  The old half is the genuine old *technique* (sprite bobs, a lookup-table tunnel, a scanline road, palette
  cycling), not a pixelated modern render. Text and 2D parts are drawn by `js/pix.js`, a software
  framebuffer with a real 8×8 bitmap font.
- **The beam.** One transition, used everywhere: a hot scanline travels from the top of the picture to the
  bottom in about 1.4 s, on a musical boundary. Below it the picture is still 1985; above it the same
  object, from the same camera, is modern. It lives in the post chain (`uBeam` in `js/gfx.js`), and each
  scene's shader asks `isOld()` per pixel to pick its shading model. After the beam the CRT flattens and
  the frame widens to 16:9.
- **Now.** Whatever the old effect was reaching for: sprite balls become sixteen thousand lit spheres, a
  glenz vector becomes refracting glass, a scanline road becomes wet asphalt.

### Facts at a glance
| | |
|---|---|
| Runtime | 7:10.6 (Disk 1: 0:00–3:12.5, Disk 2: 3:12.5–7:10.6) |
| Platform | Any recent desktop browser; WebGL2 + Web Audio; no build, no server |
| Assets | None. Every pixel, glyph and sample is generated at load time |
| Size | 20 JS files + `index.html`, about 350 KB of readable source (not minified) |
| Audio | Rendered offline in JS before playback (Disk 1, ~5 s behind a loader); Disk 2 renders in the background during Disk 1 |
| Video | Each scene renders to an HDR target, then one shared post chain: bloom, ACES tone map, CRT (curvature, scanlines, shadow mask), the raster beam, letterbox, grain, CRT power-off |
| Adaptive | Render scale drops automatically when the frame rate falls (minimum 45 %); `Q` forces 100/75/50 % |

### Rules every part follows
1. **Palette discipline.** Two or three key hues per scene and deep blacks. The signature colours are
   copper orange/gold and Workbench blue (`#05A`); each scene adds one accent.
2. **No keynote captions.** At most one small part label in the 8×8 font, bottom-left, evocative rather
   than explanatory ("IT ALWAYS WANTED TO BE GLASS").
3. **No generic white flashes.** A flash is allowed only as a short hit on a musical impact.
4. **Sync to notes, not to a kick pulse.** Disk 1 uses kick, snare, hat, lead and pattern boundaries.
   Disk 2 uses individual guitar plucks, accented chords and melody notes.
5. **Procedural homages.** Disk 1 quotes demo *effects*; Disk 2 takes visual cues from classic games,
   including Prince of Persia, Project-X and Lotus Esprit. Art is generated in code; no original game
   assets are bundled. See `REVIEW.md` for the remaining fidelity gaps.

### The two disks
- **Disk 1, "the demos"**: a classic megademo arc over an original soundtrack that starts as a
  four-channel chip tune and opens out into modern synthesis.
- **Disk 2, "the games"**: *Leyenda*, a game that never existed. Each section of Albéniz's *Asturias* is
  a level in a different Amiga game genre, set in one moonlit Andalusian world, and the music plays the
  game: the notes are the joystick. It ends by showing the machine itself.

---

## Part II — Disk 1 (0:00 – 3:12.5)

Music: original, 125 BPM, 25 patterns of 7.68 s (4 bars each). Patterns 0–4 and 22–24 obey Paula-like
rules (four hard-panned voices, 8-bit wavetables, `0xy` arpeggios).

### 0:00.0 – 0:07.7 · BOOT (pattern 0)
Power-on colour steps, a blue screen with bootblock text in the 8×8 font, a drive seeking tracks, then
decrunch rasters with a percentage. Everything is 320×256 on the CRT.

### 0:07.7 – 0:38.4 · CRACKTRO (patterns 1–4)
The one part that stays in 1989 on purpose. A chrome logo built pixel by pixel (the 8×8 font Scale2x'ed
twice, sheared, with a horizon gradient, bevel, outline and drop shadow), copper bars that change colour
per raster line, a starfield, a one-pixel-column sine scroller in the 16×16 font and a checkerboard floor.
The logo drops in, bounces and nods on the kick.

### 0:38.4 – 1:09.1 · BOING (patterns 5–8)
- **Then:** the 1984 demo as it looked: a flat red-and-white ball, a grey room with a purple grid, and a
  shadow that is just a darker patch.
- **Beam at 0:40.3** (one bar in): the same room is lit for real, with soft shadows, gloss and reflections.
- **From 0:46:** the walls fall away into the other icon of the era, the ray-traced checkerboard under a
  blue sky, with chrome and glass spheres bouncing and colliding.

### 1:09.1 – 1:32.2 · VECTOR BALLS (patterns 9–11) · label "ONCE THERE WERE A HUNDRED"
- **Then:** 125 sprite "bobs" (three tones and a specular dot, three sprite sizes, painter-sorted) in a
  tumbling 5×5×5 lattice over a copper horizon.
- **Beam at 1:13.0:** every bob is a lit sphere. The lattice subdivides 125 → 1 000 → 16 384 and the swarm
  morphs sphere → torus knot → galaxy → the word AMIGA above a black mirror floor. One instanced draw plus
  one for the reflection; sphere impostors with correct per-pixel depth.

### 1:32.2 – 1:55.2 · GLENZ → GLASS (patterns 12–14) · label "IT ALWAYS WANTED TO BE GLASS"
The breather of Disk 1: half-time drums, a flute lead, bell arpeggios.
- **Then:** a glenz vector, a tumbling faceted solid whose translucent white and blue faces show the back
  through the front, over three copper bars.
- **Beam at 1:36.0:** it is glass. An analytically ray-traced convex polyhedron (26 half-spaces) with
  refraction, dispersion (red, green and blue are traced with slightly different indices), internal bounces
  and absorption, in a dark studio whose light strips are the copper bars reborn. Every flute note re-cuts
  the crystal (octahedron → truncated octahedron → cuboctahedron → ...); every bell note is a glint.

### 1:55.2 – 2:18.2 · TUNNEL (patterns 15–17) · label "THE SAME 32 TEXELS, GOING DEEPER"
Three generations of one effect with one 32×32 XOR tile and one palette (eight ambers, eight teals).
- **1990:** a chunky 2×2 rotozoomer.
- **1992:** the sheet rolls up into the classic lookup-table tunnel. The fold is a visible conformal morph
  of the mapping, not a cross-fade.
- **Beam at 2:02.9:** the tunnel is a place. The tiles are inlaid emissive panels between wet metal ribs,
  kick-launched light pulses run down the rings and the path starts to wind.
- **2:10–2:18:** the riser drives a warp (FOV stretch, radial streaks) into a white-out on the downbeat of
  the next part: the one flash of Disk 1.

### 2:18.2 – 2:49.0 · FRACTAL DREAMS (patterns 18–21) · label "THE SAME EQUATION, ONE DIMENSION UP"
Disk 1's climax; the cracktro melody returns as a supersaw anthem.
- **Then:** the Mandelbrot set at 320×256 in 32 colours with real colour cycling (palette rotation),
  40 iterations and a slow zoom.
- **Beam at 2:22.1:** the same view with smooth colouring and deeper iterations, a zoom into seahorse
  valley and back out while the set gains relief.
- **2:25.9:** it lifts into 3D. A Mandelbulb whose equatorial slice *is* the Mandelbrot set, its power
  rising from 2 to 8 with the lead.
- **2:33.6:** a dive through an infinite Menger sponge in stone white, copper and blue, with light pulses
  on kick and bell notes.

### 2:49.0 – 3:12.5 · GREETINGS / END OF DISK ONE (patterns 22–24) · label "EVERY PIXEL GREW UP TO BE A VOXEL"
The music returns to four-channel chip.
- **Then:** a one-pixel sine scroller in the 8×8 font with three bobbing copper bars and a rippling
  every-other-line mirror.
- **Beam at 2:50.9:** each font pixel is a bevelled glossy cube. The scroller snakes in depth over black
  water; lead notes send a bright crest along the letters. The text greets everyone "who kept the copper
  flowing" (coders, musicians, graphicians, swappers, sysops, crackers, trainer makers, party organisers)
  and ends on the tracker in-joke `C-3 01 F06`.
- **3:04.3:** on the final chord the cubes fly into the title BEYOND THE COPPER / END OF DISK ONE.
- **3:07.5–3:11:** the CRT returns and is switched off: a line, a dot, black.

---

## Part III — Disk 2 "LEYENDA" (3:12.5 – 7:10.6)

Music: Isaac Albéniz, *Asturias (Leyenda)*, 1892, public domain, arranged from a 135-bar classical guitar
tab (taken from the sibling project `amiga_gemini` and corrected; see Part IV). The piece is in 3/4, so a
bar is three beats. Tempo follows a map:

| Bars | Section | BPM | Global time | Part |
|---|---|---|---|---|
| 0–7 | Ostinato on "Paula" (8-bit) | 132 | 3:19.0 | Tracker |
| 8–23 | Ostinato, hi-fi guitar | 132 | 3:29.9 | Level 1 |
| 24–47 | Rasgueado (B / Em / C7 chords) | 132 | 3:51.7 | Level 2 |
| 48–61 | Hush, arpeggio build, climax chord, pause | 132 → 92 | 4:24.5 | Level 3 |
| 62–93 | Copla, the slow song | 96 (bar 77: 80) | 4:44.5 | Cutscene |
| 94–113 | Dance-like middle | 108 | 5:44.7 | Bonus stage |
| 114–128 | Chorale coda, slowing from bar 124 | 84 → ~66 | 6:18.1 | Ending |
| 129–134 | Theme returns, final E-minor chord, tail | 100 → 60 | 6:51.8 | Finale |

**The instrument:** an extended Karplus-Strong nylon string. A noise burst is shaped by pluck position and
brightness, an allpass fractional delay tunes it exactly (measured error below 0.5 cent from E2 to B5), and
each of the six strings rings until the tab plucks *that string* again. Chords are strummed low to high;
accented chords in the A section get two quieter finger flicks before the beat, the rasgueado roll.

The three levels share one status bar in the pixel font (score, level, lives), and each opens with a
blinking level title instead of a part label.

### 3:12.5 – 3:19.0 · DISK CHANGE
"END OF SIDE ONE. PLEASE INSERT DISK 2 IN DRIVE DF0:". A pixel-drawn floppy labelled LEYENDA slides into
the drive, the drive seeks, decrunch rasters. If Disk 2's audio is not ready yet (you skipped ahead), this
screen waits and shows the progress.

### 3:19.0 – 3:29.9 · PAULA'S TRACKER (bars 0–7)
The opening ostinato played on 8-bit Paula, shown as a four-channel tracker scrolling the real notes with
oscilloscopes and VU meters. A glitch at bar 8 hands over to the game.

### 3:29.9 – 3:51.7 · LEVEL 1 "RUN" (bars 8–23): the parallax action game
- **Then:** a copper-gradient dusk, a dithered moon, seven flat parallax layers (sierras, an aqueduct,
  cypresses and palms) and a silhouette runner with a trailing scarf.
- **Beam at 3:35.4** (bar 12): 27 layers with atmospheric perspective, moon shafts through the aqueduct
  arches, mist, a reflecting lake, fireflies and a ribbon of light behind the hero.
- **The notes play the game:** every thumb-melody note (six per bar) is a footfall with a glowing ripple;
  every second bar is a leap across a stream; the score ticks with the notes. Wind and speed build with
  the riser in bars 22–23.

### 3:51.7 – 4:24.5 · LEVEL 2 "THE FLOOR OF STARS" (bars 24–47): the shoot-'em-up
- **Then:** top-down over a flat star-and-cross tile floor with copper grout; formations fly in each bar;
  2-pixel bolts; chunky four-frame explosions.
- **Beam at 3:57.2** (bar 28, on the crash): raised glazed tiles, pulsing grout, soft shadows, HDR bolts,
  spark bursts; the camera tilts so the floor has depth.
- **The notes play the game:** every pluck fires a bolt; every accented chord is a six-way fan plus a
  smart-bomb shockwave that lifts the tiles as it passes. **Harmony is visible:** the floor re-glazes behind
  each shockwave in the colour of the chord: cobalt for B major, violet for E minor, crimson for C7.
- **Boss from 4:08.1** (bar 36): a seven-ring mandala of star tiles around a copper heart. Each chord strips
  one ring. The heart detonates on the downbeat of bar 47 and the debris settles into the hush.

### 4:24.5 – 4:44.5 · LEVEL 3 "THE ROAD TO THE FIESTA" (bars 48–61): the night racer
- **Then:** the scanline road: banded asphalt, rumble strips, cypresses and lamp posts as sprites in size
  steps, a dithered dusk sky, a small palace on the horizon, a dark wedge of a car with two tail lights.
- **Beam at 4:29.9** (bar 52, on the crash): wet asphalt with streaked reflections, lamp pools, mist in the
  headlights, a parallax sierra and the lit palace.
- **The notes play the game:** one lamp pair passes the car on every kick and one firework shell bursts on
  every kick; from bar 56 two lamps per beat with the snare eighths, from bar 58 four. A hill rises and
  swallows the palace.
- **4:40.8** (bar 60, the climax chord): the car crests the hill, the palace fills the horizon and six huge
  shells go off together, with a short flash. Bar 61, the silence: slow motion, one gold willow falling,
  brake lights, fade.

### 4:44.5 – 5:44.7 · COPLA (bars 62–93): the cutscene · label "EVERY NOTE FALLS INTO THE WATER"
The slowest music of the demo, staged like a letterboxed adventure-game cutscene in a moonlit courtyard of
horseshoe arcades around a reflecting pool. Three shots: a low walk along the water; at bar 77's held
chord a crane up to the roofs, where the moon lies in the pool; then a tracking shot through the arches.
Every melody note is a droplet that falls into the water and rings; the violin's long notes draw wide slow
rings, guitar notes small sharp ones.

### 5:44.7 – 6:18.1 · BONUS STAGE "PINBALL" (bars 94–113) · label "EVERY CASTANET IS A BUMPER"
A flamenco table: red lacquer, white polka dots, a fan, a guitar rosette, gold rails.
- **Then:** top-down and flat, scrolling after the ball, with an amber dot-matrix score line.
- **Beam at 5:51.4** (bar 98): the table is ray traced, with a chrome ball, glowing bumpers and a backbox;
  the camera drops to a player's-eye view.
- **The notes play the game:** the ball's path is planned backwards from the score so it strikes a bumper
  on every accented chord (where the castanets are), flippers fire on the kick at bar starts, and melody
  notes light the fan rib by rib. Free flights are true ballistic arcs. In bars 111–113 the ball spirals
  around the rosette, lighting one lamp per arpeggio note, and drops into the sound hole on the downbeat of
  bar 114.

### 6:18.1 – 6:51.8 · DAWN (bars 114–128): the ending
The same courtyard at sunrise: long shadows, gold on stone, sun glitter on the pool. The lanterns go out
one by one on the timpani hits while the end credits roll in the 8×8 font.

### 6:51.8 – 7:10.6 · FINALE (bars 129–134 + tail)
For the first time we see the machine from outside: a dark desk at night with a generic beige wedge
computer, an external floppy drive and a small CRT monitor that is the only light in the room. On it the
tracker from the start of Disk 2 plays the last bars, and its colours spill onto the keyboard and desk. The
camera starts close on the screen, so it reads as a continuation, and pulls back. On the final chord
(6:59.6) the screen shows THE END over Workbench blue. At 7:07 someone switches the monitor off: a line,
a dot, afterglow, and two LEDs in the dark.

---

## Part IV — For reviewers

### What we claim (and what we don't)
- **We claim:** an original Disk 1 tune; a structurally corrected arrangement of Asturias; everything
  procedural with no external assets; sync driven by the real note events; one consistent idea (then, beam,
  now) across the parts.
- **We do not claim:** cycle-exact Amiga emulation, real OCS limits, or that any "then" half would run on
  an A500. They *look* like Amiga output but break hardware rules freely (sprite counts, colours per line,
  blitter time).
- **Status:** every scene was checked in stills in headless Chrome with GPU rendering, including closely
  spaced frames around each beam and each synced event, and the whole demo was played through once on the
  real audio clock. The audio was checked by measurement (levels, clipping, pitch). It has **not** been
  judged by trained ears in a good room, the sync has not been judged by eye against sound at full frame
  rate, and frame rates have **not** been measured on a range of GPUs.

### Disk 2's music: what was corrected in the tab
The source was `amiga_gemini`'s 1,301-event guitar tab. The notes were right; the timing was not.
1. Durations were floats (`0.1667` for a triplet sixteenth); now exact integer ticks (24 per beat), and
   all 135 bars sum to exactly 3 beats.
2. Bars 0–15, 48–51 and 129–130 had one pedal note after each melody note while the rest of the piece has
   two (p-i-m). They were converted to triplets, so the ostinato keeps one texture.
3. Bar 122 held a 3-beat chord after a quarter note (4 beats in a 3/4 bar); the chord is now a half note.
4. The source's drums ran on a 4/4 grid against the 3/4 music and drifted every bar; Disk 2's drums are
   written per bar in 3/4.
5. The source played everything at 128 BPM; Disk 2 uses a tempo map with a broadening at the climax, a
   slow copla and a ritardando coda.

### Known weaknesses (our own critique first)
**Across the demo**
- Costliest moments at 1080p are the Mandelbulb (about 14–17 ms per frame) and the finale (10–14 ms);
  everything else measured 2–12 ms. The adaptive scaler covers the heavy ones, at some loss of sharpness.
- The level scores do not carry over from one level to the next.
- After its beam, Level 2 shows five hue families (three floor colours, copper, a teal boss). That is more
  than the palette rule allows, though it is the harmony that drives it.

**Disk 1**
- Greetings: letters twist on the steep part of the sine while the camera is yawed; the end title is kept
  to about two thirds of the width so it survives the CRT crop.
- Glenz: the facet reflections use a simplified room (no floor, no strip gaps) to keep the shader small.
- Tunnel: the white-out into the fractal is the one transition that is "just a flash".

**Disk 2**
- Level 2: the pilot never takes damage and the boss only launches escorts; there is a small scale seam
  along the beam line.
- Level 3: the palace is a flat elevation and reads a little like a stage set at climax size; road
  reflections are a screen-space mirror, not true reflections; the hillside during the climb is nearly
  featureless.
- Pinball: slingshot volleys repeat the same figure; three flipper shots curve slightly on open playfield
  with no physical guide; the final lock is half hidden by the fade; no anti-aliasing on silhouettes.
- Copla: sixty seconds in one location, even with three shots.

### Questions for a reviewer
1. Does the beam stay fresh over ten uses, or should two or three parts transition differently?
2. Does each "then" half pass for the real thing at a glance? Which one gives itself away first?
3. In Disk 2, can you tell *without being told* that the notes drive the game?
4. Is the copla too long for a demo, or is it the breath the piece needs?
5. Does the finale land, or is "the machine on the desk" too sentimental?

### Where feedback lands in the code
| Topic | File |
|---|---|
| Beam, CRT, bloom, part labels | `js/gfx.js` |
| 8×8 font, 12-bit palette, dithering, sprites | `js/pix.js` |
| Disk 1 song and instruments | `js/music.js` |
| Asturias notes / arrangement, tempo map, section table | `js/leyenda_tab.js`, `js/leyenda.js` |
| A scene | `js/scene_<name>.js` (timings are constants near the top or in `draw`) |
| Timeline, loader, adaptive quality, dev hooks (`?still=`, `?only=`, `__bench()`) | `js/main.js` |
