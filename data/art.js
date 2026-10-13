/* ══════════════════════════════════════════════════════
   ART — inline SVG for the lesson.

   Why inline and not image files: no extra requests on a school
   Chromebook, no broken-image box if the network stalls mid-period,
   and the shapes inherit the theme so dark mode needs no second set.

   Every piece is decorative. Each carries aria-hidden and sits inside
   a [data-noread] wrapper, so the read-aloud enumerator skips it and
   a student never hears "image".

   Colours come from the stylesheet tokens, so these never fight the
   page: --sci (teal), --accent (orange), --ink-faint, --surface.

   LESSON 1.2 — ENERGY AND MOTION. One table for each place a picture is
   used, so a key in data/lesson.js is looked up in exactly one place:
     COVER_ART   the cover
     CARE_ART    the three "why should you care" tiles      (CARE[].art)
     SCENE_ART   the wide picture at the top of a page      (TOOL_PAGES[].scene, LEARN.*.pages[].scene)
     TILE_ART    the small picture beside a point           (tiles[].art, INTRO_PLAN, LESSON.icanArt)
     WORD_ART    one picture for each of the six words      (LESSON.vocab[].word)
     THING_ART   the things in the help panel's word list   (THING_WORDS)

   What the pictures have to get right (the science, not the style):
     - the thing that is HIGHER is drawn visibly higher
     - the thing that is FASTER has motion lines behind it; a thing that is
       still has none
     - where a person is in the picture, the person is what moves or what
       causes the motion (a kid on a slide, a hand, Mr. O and the chair).
       Marcos 10/11, on a drawn clip: "someone should be throwing the stone."
═══════════════════════════════════════════════════════ */

function svg(body, box) {
  return '<svg viewBox="0 0 ' + (box || '48 48') + '" aria-hidden="true" focusable="false">' +
         body + '</svg>';
}

/* A wrapper the read-aloud enumerator will skip. */
window.art = function (markup, cls) {
  if (!markup) return '';
  return '<span class="art' + (cls ? ' ' + cls : '') + '" data-noread>' + markup + '</span>';
};

/* ── THE PIECES every picture is built from ─────────────
   Drawn once, so a roller coaster car is the same car on the cover, in the
   scenes and in the small pictures, and a kid is the same kid. */
(function () {
  /* A roller coaster car: a box on two wheels. (x, y) is the spot on the
     track under the middle of the car; `turn` tips the car to follow the
     slope; `s` is the size. */
  function car(x, y, turn, s, fill) {
    return '<g transform="translate(' + x + ',' + y + ') rotate(' + (turn || 0) + ') scale(' + (s || 1) + ')">' +
      '<rect x="-11" y="-17" width="22" height="12" rx="3" fill="' + (fill || 'var(--accent)') + '"/>' +
      '<circle cx="-6" cy="-4" r="3.7" fill="var(--sci-dark)"/><circle cx="6" cy="-4" r="3.7" fill="var(--sci-dark)"/></g>';
  }
  /* A kid sitting down: head, body, legs out in front. (x, y) is where the
     kid sits. */
  function kid(x, y, s, fill) {
    const c = fill || 'var(--accent)';
    return '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')">' +
      '<circle cx="0" cy="-20" r="6" fill="' + c + '"/>' +
      '<path d="M0 -13v10l10 2" fill="none" stroke="' + c + '" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></g>';
  }
  /* Motion lines: three short lines BEHIND a thing that is moving. (x, y) is
     where the lines end, next to the thing; `turn` points them along the way
     the thing came from. A thing that is still never gets them. */
  function whoosh(x, y, turn, s) {
    return '<g transform="translate(' + x + ',' + y + ') rotate(' + (turn || 0) + ') scale(' + (s || 1) + ')" ' +
      'stroke="var(--sci)" stroke-width="3" stroke-linecap="round" opacity=".7">' +
      '<path d="M-16 -7h14M-20 0h17M-14 7h12"/></g>';
  }
  /* An arrow from (x1, y1) to (x2, y2). */
  function arrow(x1, y1, x2, y2, color, w, dash) {
    const a = Math.atan2(y2 - y1, x2 - x1), h = (w || 3.5) * 2.2;
    const p = (ang) => (x2 - h * Math.cos(a + ang)).toFixed(1) + ' ' + (y2 - h * Math.sin(a + ang)).toFixed(1);
    return '<path d="M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2 + '" stroke="' + (color || 'var(--accent)') + '" stroke-width="' + (w || 3.5) +
      '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>' +
      '<path d="M' + p(0.6) + 'L' + x2 + ' ' + y2 + 'L' + p(-0.6) + '" fill="none" stroke="' + (color || 'var(--accent)') +
      '" stroke-width="' + (w || 3.5) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  const ground = (y, x1, x2) => '<path d="M' + (x1 == null ? 3 : x1) + ' ' + y + 'H' + (x2 == null ? 45 : x2) +
    '" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>';
  const ball = (x, y, r, fill) => '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (fill || 'var(--accent)') + '"/>';
  /* a question mark, its top-left corner at (x, y) */
  const qmark = (x, y, color, s) => '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M0 6c0-7 12-7 12 0 0 5-6 5-6 11" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round"/>' +
    '<circle cx="6" cy="25" r="2.8" fill="' + color + '"/></g>';

  /* ── small pictures (48 x 48) ───────────────────────── */
  /* one hill of track, and the same hill filled in faintly */
  const HILL = 'M3 41C13 41 15 15 24 15S35 41 45 41';
  const hill = '<path d="' + HILL + 'z" fill="var(--sci)" opacity=".16"/>' +
    '<path d="' + HILL + '" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>';
  /* a straight slope, high on the left and low on the right */
  const slope = '<path d="M5 14L43 40H5z" fill="var(--sci)" opacity=".16"/>' +
    '<path d="M5 14L43 40" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>';

  /* a playground slide: a ladder up to the top, then the slide down to the
     ground on the right. `top` is how high the top is (a smaller number is
     higher), `x` is where the ladder stands, `reach` how far the slide runs */
  function slide(x, top, floor, reach, w) {
    const rungs = [];
    for (let y = floor - 7; y > top + 3; y -= 7) rungs.push('M' + x + ' ' + y + 'h7');
    return '<path d="M' + x + ' ' + floor + 'V' + top + 'M' + (x + 7) + ' ' + floor + 'V' + top + '" stroke="var(--ink-faint)" stroke-width="' + (w * 0.6) + '" stroke-linecap="round"/>' +
      '<path d="' + rungs.join('') + '" stroke="var(--ink-faint)" stroke-width="' + (w * 0.5) + '" stroke-linecap="round"/>' +
      '<path d="M' + (x - 2) + ' ' + top + 'h12C' + (x + 10 + reach * 0.35) + ' ' + top + ' ' + (x + 10 + reach * 0.55) + ' ' + floor + ' ' + (x + 10 + reach) + ' ' + floor +
      '" fill="none" stroke="var(--sci)" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  /* a shelf on a wall, with its two brackets */
  const shelf = (x, y, w) => '<path d="M' + x + ' ' + y + 'h' + w + '" stroke="var(--sci)" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M' + (x + 4) + ' ' + (y + 2) + 'v7M' + (x + w - 4) + ' ' + (y + 2) + 'v7" stroke="var(--sci)" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>';

  const eye = '<path d="M4 24C12 11 36 11 44 24 36 37 12 37 4 24z" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linejoin="round"/>' +
    '<circle cx="24" cy="24" r="7.5" fill="var(--accent)"/><circle cx="24" cy="24" r="3" fill="var(--sci-dark)"/>';
  const twoQuestions = qmark(6, 8, 'var(--sci)', 1.05) + qmark(27, 8, 'var(--accent)', 1.05);
  /* stored energy turns into moving energy: the car still at the top (faint),
     an arrow, the same car on the way down with motion lines */
  const change = slope + car(11, 17, 34, 0.55, 'var(--sci-dark)') +
    arrow(19, 12, 30, 19, 'var(--accent)', 3) + car(33, 33, 34, 0.55) + whoosh(27, 24, 34, 0.42);
  const carAtTop = hill + ground(43) + car(24, 15, 0, 0.72);
  const carGoingDown = slope + ground(43) + car(27, 29, 34, 0.72) + whoosh(18, 17, 34, 0.5);

  window.TILE_ART = {
    /* Meet the roller coaster */
    coaster: svg(
      '<path d="M3 41C9 41 10 13 17 13S24 35 30 35 34 25 38 25 42 41 45 41" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M17 16v25M10 30v11M24 30v11M38 28v13" stroke="var(--ink-faint)" stroke-width="2" stroke-linecap="round" opacity=".7"/>' +
      ground(43) + car(17, 13, 0, 0.66)),
    /* a chain pulls the car up the first hill */
    chain: svg(
      '<path d="M5 40L43 14" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M5 40L43 14" stroke="var(--sci-dark)" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 6.5"/>' +
      ground(43) + car(22, 28, -34, 0.66) + arrow(31, 12, 40, 6, 'var(--accent)', 3)),
    why: svg(car(15, 40, 0, 0.9) + ground(43) + qmark(29, 5, 'var(--accent)', 1.05)),
    top: svg(carAtTop),
    down: svg(carGoingDown),
    change: svg(change),
    two: svg(twoQuestions),

    /* Here is the plan */
    words: svg(
      '<rect x="5" y="6" width="38" height="10" rx="3" fill="var(--sci)" opacity=".9"/>' +
      '<rect x="5" y="19" width="38" height="10" rx="3" fill="var(--accent)" opacity=".9"/>' +
      '<rect x="5" y="32" width="38" height="10" rx="3" fill="var(--sci)" opacity=".55"/>' +
      '<path d="M10 11h18M10 24h24M10 37h14" stroke="var(--surface)" stroke-width="2.5" stroke-linecap="round"/>'),
    /* a ball high up and a ball low down */
    high: svg(
      shelf(4, 14, 18) + ball(13, 7, 5.5) + ground(43) + ball(35, 37, 5.5, 'var(--sci)') +
      arrow(35, 28, 35, 9, 'var(--ink-faint)', 2.5, '3 4')),
    later: svg(
      '<rect x="5" y="9" width="38" height="33" rx="5" fill="none" stroke="var(--sci)" stroke-width="3.5"/>' +
      '<path d="M5 19h38" stroke="var(--sci)" stroke-width="3.5"/>' +
      '<path d="M15 5v8M33 5v8" stroke="var(--sci-dark)" stroke-width="3.5" stroke-linecap="round"/>' +
      '<rect x="12" y="24" width="9" height="9" rx="2" fill="var(--accent)"/><rect x="27" y="24" width="9" height="9" rx="2" fill="var(--accent)" opacity=".6"/>'),
    listen: svg(
      '<path d="M6 19h8l11-9v28l-11-9H6z" fill="var(--sci)"/>' +
      '<path d="M31 17c3 4 3 10 0 14M36 11c6 8 6 18 0 26" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>'),
    look: svg(eye),
    check: svg(
      '<circle cx="24" cy="24" r="19" fill="var(--sci)" opacity=".16"/>' +
      '<circle cx="24" cy="24" r="19" fill="none" stroke="var(--sci)" stroke-width="3.5"/>' +
      '<path d="M14 25l7 7 14-15" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'),

    /* More stored energy, less stored energy: the two slides */
    slides: svg(ground(43) + slide(4, 10, 43, 13, 3) + slide(27, 27, 43, 8, 3) + kid(7.5, 10, 0.36) + kid(30.5, 27, 0.36, 'var(--sci-dark)')),
    /* the kid on the tall slide, with a line showing how high up that is */
    tall: svg(ground(43) + slide(14, 12, 43, 19, 3.5) + kid(18, 12, 0.5) +
      arrow(6, 41, 6, 13, 'var(--sci-dark)', 2.5, '3 4')),
    /* the kid at the bottom of the tall slide, going fast */
    fast: svg(ground(43) + slide(4, 12, 43, 22, 3.5) + kid(34, 41, 0.5) + whoosh(27, 30, 38, 0.5)),
    /* the ball and the shelf */
    shelf: svg(shelf(8, 17, 32) + ball(24, 9, 6.5) + ground(43)),
    fall: svg(shelf(4, 12, 22) + ball(34, 27, 6.5) + whoosh(34, 18, 90, 0.5) +
      arrow(44, 14, 44, 34, 'var(--sci-dark)', 2.5) + ground(43)),
    floor: svg(shelf(8, 12, 32) + ball(24, 36.5, 6.5) + ground(43))
  };

  /* ── one picture for each of the six words ──────────── */
  window.WORD_ART = {
    /* a bolt: what makes things move or change */
    energy: svg(
      '<path d="M27 4L12 28h10l-3 16 17-25H25z" fill="var(--accent)"/>' +
      '<path d="M27 4L12 28h10l-3 16 17-25H25z" fill="none" stroke="var(--sci-dark)" ' +
        'stroke-width="1.5" stroke-linejoin="round"/>'),
    /* a hand pushing a box: a push is a force */
    force: svg(
      '<rect x="24" y="20" width="20" height="20" rx="2" fill="var(--sci)" opacity=".85"/>' +
      '<path d="M3 26h9c2 0 3 1 3 3v6c0 2-1 3-3 3H3z" fill="var(--accent)"/>' +
      '<path d="M15 31h6" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>' +
      ground(43)),
    /* an apple on the way down, with the pull arrow */
    gravity: svg(
      '<circle cx="24" cy="12" r="7" fill="var(--accent)"/>' +
      '<path d="M24 9v-4" stroke="var(--sci-dark)" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M24 23v12" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round" ' +
        'stroke-dasharray="4 4"/>' +
      '<path d="M19 30l5 6 5-6" fill="none" stroke="var(--sci)" stroke-width="3.5" ' +
        'stroke-linecap="round" stroke-linejoin="round"/>' +
      ground(43)),
    /* stored energy: the car still at the top of the hill, ready to roll */
    'potential energy': svg(carAtTop),
    /* moving energy: the car rolling down, with motion lines */
    'kinetic energy': svg(carGoingDown),
    /* Mr. O pushes a chair across the floor: a force moves an object */
    work: svg(
      /* Mr. O, leaning in, both arms on the back of the chair */
      '<circle cx="11" cy="11" r="5.5" fill="var(--sci-dark)"/>' +
      '<path d="M10 18l3 13M13 31l-6 11M13 31l5 11" fill="none" stroke="var(--sci-dark)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M11 22l13 1" stroke="var(--sci-dark)" stroke-width="4" stroke-linecap="round"/>' +
      /* the chair */
      '<path d="M26 14v28M26 29h13v13" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      arrow(34, 20, 45, 20, 'var(--sci)', 3) + ground(44))
  };

  /* ── the things in the help panel's word list ───────── */
  window.THING_ART = {
    'roller coaster': window.TILE_ART.coaster,
    /* up one side and down the other side */
    hill: svg(hill + ground(43) + arrow(8, 33, 16, 20, 'var(--accent)', 3) + arrow(32, 20, 40, 33, 'var(--accent)', 3)),
    /* two rails and the ties that hold the rails */
    track: svg(
      '<path d="M3 30C14 30 16 14 28 14s12 8 17 8" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M3 38C14 38 16 22 28 22s12 8 17 8" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M9 28v10M16 22v9M23 16v8M31 14v9M39 19v9" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>'),
    /* a ball, a box and a chair: each one is an object */
    object: svg(
      ball(12, 33, 8) + '<rect x="25" y="24" width="17" height="17" rx="2.5" fill="var(--sci)" opacity=".85"/>' +
      '<path d="M18 5v15M18 12h10v8" fill="none" stroke="var(--sci-dark)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      ground(43)),
    /* a slow ball and a fast ball */
    speed: svg(
      ball(34, 13, 6.5, 'var(--sci)') + '<path d="M19 13h6" stroke="var(--sci)" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
      ball(36, 34, 6.5) + whoosh(27, 34, 0, 0.78) + '<path d="M3 23h42" stroke="var(--ink-faint)" stroke-width="1.5" stroke-dasharray="2 4" stroke-linecap="round"/>'),
    'stored energy': svg(carAtTop),
    'moving energy': svg(carGoingDown)
  };

  /* ── why-should-you-care pictures ───────────────────── */
  window.CARE_ART = {
    /* the slide at the park: a kid at the top, about to go down */
    slide: svg(ground(43) + slide(6, 12, 43, 26, 3.5) + kid(10, 12, 0.5) + arrow(24, 14, 36, 28, 'var(--accent)', 3, '3 4')),
    /* two hands rubbing, and the warm coming off the hands */
    hands: svg(
      /* the two sleeves */
      '<rect x="10" y="38" width="14" height="8" rx="2" fill="var(--sci-dark)"/><rect x="24" y="32" width="14" height="14" rx="2" fill="var(--sci-dark)"/>' +
      /* the left hand, and the right hand a little higher: one hand slides on the other hand */
      '<rect x="11" y="15" width="12" height="25" rx="5.5" fill="var(--accent)"/>' +
      '<path d="M11 31c-4-1-6-5-4-8" fill="none" stroke="var(--accent)" stroke-width="4.5" stroke-linecap="round"/>' +
      '<rect x="25" y="9" width="12" height="25" rx="5.5" fill="var(--sci)"/>' +
      '<path d="M37 25c4-1 6-5 4-8" fill="none" stroke="var(--sci)" stroke-width="4.5" stroke-linecap="round"/>' +
      /* the warm */
      '<path d="M4 15c0-3 3-3 3-6M15 10c0-3 3-3 3-6M42 10c0-3 3-3 3-6" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>'),
    /* a lunch tray: an apple and a sandwich */
    lunch: svg(
      '<rect x="3" y="30" width="42" height="11" rx="4" fill="var(--sci)" opacity=".3"/>' +
      '<rect x="3" y="30" width="42" height="11" rx="4" fill="none" stroke="var(--sci)" stroke-width="2.5"/>' +
      '<circle cx="15" cy="23" r="8" fill="var(--accent)"/>' +
      '<path d="M15 15c0-3 2-5 5-5" fill="none" stroke="var(--sci-dark)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M26 31l8-15 9 15z" fill="var(--sci)"/>' +
      '<path d="M28.5 27h12" stroke="var(--surface)" stroke-width="2.5" stroke-linecap="round"/>')
  };

  /* ── DAYS 2 AND 3 — the small pictures ──────────────────
     Added after Day 1's, from the same pieces. The bodies that a scene uses
     again are kept as their own strings (48 x 48), so a battery is the same
     battery in the small picture and in the scene. */
  /* wavy lines going up: heat coming off a thing */
  const heat = (x, y, s) => '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')" fill="none" stroke="var(--accent)" ' +
    'stroke-width="3" stroke-linecap="round"><path d="M-9 0c0-4 4-4 4-8s-4-4-4-8M0 0c0-4 4-4 4-8s-4-4-4-8M9 0c0-4 4-4 4-8s-4-4-4-8"/></g>';
  /* curved lines going out: a sound */
  const sound = (x, y, s, flip) => '<g transform="translate(' + x + ',' + y + ') scale(' + (flip ? -(s || 1) : (s || 1)) + ',' + (s || 1) + ')" fill="none" ' +
    'stroke="var(--sci)" stroke-width="3" stroke-linecap="round"><path d="M0 -5c3 3 3 7 0 10M6 -9c6 6 6 12 0 18M12 -13c9 9 9 17 0 26"/></g>';
  /* the lightning bolt that stands for energy, its top-left corner at (x, y) */
  const bolt = (x, y, s, fill) => '<g transform="translate(' + x + ',' + y + ') scale(' + (s || 1) + ')">' +
    '<path d="M15 0L0 24h10l-3 16 17-25H13z" fill="' + (fill || 'var(--accent)') + '"/></g>';
  /* two hands, one a little higher than the other: one hand slides on the other hand */
  const handsPair =
    '<rect x="10" y="38" width="14" height="8" rx="2" fill="var(--sci-dark)"/><rect x="24" y="32" width="14" height="14" rx="2" fill="var(--sci-dark)"/>' +
    '<rect x="11" y="15" width="12" height="25" rx="5.5" fill="var(--accent)"/>' +
    '<path d="M11 31c-4-1-6-5-4-8" fill="none" stroke="var(--accent)" stroke-width="4.5" stroke-linecap="round"/>' +
    '<rect x="25" y="9" width="12" height="25" rx="5.5" fill="var(--sci)"/>' +
    '<path d="M37 25c4-1 6-5 4-8" fill="none" stroke="var(--sci)" stroke-width="4.5" stroke-linecap="round"/>';
  /* up-and-down lines beside the hands: the hands are moving */
  const rubbing = '<path d="M4 20v12M43 14v12" stroke="var(--sci)" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
    '<path d="M1 23l3-4 3 4M40 23l3 4 3-4" fill="none" stroke="var(--sci)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>';
  const batteryBody =
    '<rect x="5" y="15" width="33" height="19" rx="3.5" fill="var(--sci)"/>' +
    '<rect x="38" y="20" width="5" height="9" rx="1.5" fill="var(--sci-dark)"/>' +
    '<path d="M27 24.5h7M30.500 21v7M10 24.500h7" stroke="var(--surface)" stroke-width="2.500" stroke-linecap="round"/>';
  /* a rubber band on a peg, pulled back by a hand and held still; the faint
     arrow is where the rubber band flies when the hand lets go */
  const bandBody =
    '<circle cx="8" cy="27" r="4" fill="var(--sci-dark)"/>' +
    '<path d="M8 23L35 27L8 31" fill="none" stroke="var(--sci)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>' +
    '<rect x="33" y="21" width="12" height="12" rx="5" fill="var(--accent)"/>' +
    arrow(30, 11, 10, 11, 'var(--ink-faint)', 2.5, '3 4');
  const flashlightBody =
    '<path d="M31 14l14-7v34l-14-7z" fill="var(--accent)" opacity=".4"/>' +
    '<rect x="3" y="19" width="19" height="10" rx="3" fill="var(--sci-dark)"/>' +
    '<path d="M22 17.500l9-4v21l-9-4z" fill="var(--sci)"/>';
  /* a kid running to the right */
  const runner = (c) => '<circle cx="29" cy="9" r="5.5" fill="' + c + '"/>' +
    '<path d="M28 16l-4 13M24 29l-9 5M24 29l8 5v8M26 20l9 3M26 20l-9-1" fill="none" stroke="' + c + '" stroke-width="4.500" stroke-linecap="round" stroke-linejoin="round"/>';
  const runBody = runner('var(--accent)') + whoosh(13, 24, 0, 0.5) + ground(44);
  /* a gas can with a spout */
  const gasBody =
    '<rect x="11" y="17" width="25" height="25" rx="3.5" fill="var(--accent)"/>' +
    '<path d="M16 17v-6h11v6" fill="none" stroke="var(--sci-dark)" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M31 15l8-7" stroke="var(--sci-dark)" stroke-width="4.500" stroke-linecap="round"/>' +
    '<path d="M23.500 23c-4 6-5 8-5 10a5 5 0 0 0 10 0c0-2-1-4-5-10z" fill="var(--surface)" opacity=".9"/>';
  /* a car from the side; the box under the hood is the engine */
  const carSide =
    '<path d="M3 35v-8l9-2 6-9h13l7 9 7 2v8z" fill="var(--sci)"/>' +
    '<path d="M20 18h10l5 7H16z" fill="var(--surface)" opacity=".85"/>' +
    '<rect x="35" y="27" width="9" height="6" rx="1.500" fill="var(--accent)"/>' +
    '<circle cx="13" cy="36" r="5" fill="var(--sci-dark)"/><circle cx="36" cy="36" r="5" fill="var(--sci-dark)"/>';
  const lunchBody =
    '<rect x="3" y="30" width="42" height="11" rx="4" fill="var(--sci)" opacity=".3"/>' +
    '<rect x="3" y="30" width="42" height="11" rx="4" fill="none" stroke="var(--sci)" stroke-width="2.5"/>' +
    '<circle cx="15" cy="23" r="8" fill="var(--accent)"/>' +
    '<path d="M15 15c0-3 2-5 5-5" fill="none" stroke="var(--sci-dark)" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M26 31l8-15 9 15z" fill="var(--sci)"/>' +
    '<path d="M28.5 27h12" stroke="var(--surface)" stroke-width="2.5" stroke-linecap="round"/>';
  const block = (x, y, w, fill) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + w + '" rx="' + (w * 0.15) + '" fill="' + (fill || 'var(--sci)') + '"/>';

  Object.assign(window.TILE_ART, {
    /* Day 2 · Energy is never lost */
    hands: svg(handsPair + rubbing),
    warm: svg(handsPair + heat(7, 12, 0.5) + heat(42, 9.5, 0.5)),
    /* the same amount of energy before and after: nothing went away */
    same: svg(bolt(3, 5, 0.85, 'var(--sci)') + arrow(22, 24, 29, 24, 'var(--ink-faint)', 2.5) + bolt(28, 5, 0.85)),
    /* the ball on the floor, and the sound going out both ways */
    thud: svg(ground(43) + ball(24, 36.5, 6.5) + sound(33, 30, 0.55) + sound(15, 30, 0.55, true)),
    /* energy goes round and round: never made, never lost */
    rule: svg(
      '<path d="M9 21A16 16 0 0 1 38 16" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M32 15l6 1 1-6" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M39 27A16 16 0 0 1 10 32" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M16 33l-6-1-1 6" fill="none" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      bolt(16, 9, 0.7)),
    /* a rolling ball on the way to a still ball */
    roll: svg(ground(43) + whoosh(11, 36, 0, 0.5) + ball(19, 36.5, 6.5) + ball(38, 36.5, 6.5, 'var(--sci)')),
    /* after the bump: the first ball is still, the second ball rolls */
    bump: svg(ground(43) + ball(10, 36.5, 6.5) + whoosh(27, 36, 0, 0.5) + ball(35, 36.5, 6.5, 'var(--sci)') +
      arrow(10, 21, 33, 21, 'var(--accent)', 3) ),

    /* Day 2 · Energy comes in different kinds */
    battery: svg(batteryBody),
    band: svg(bandBody),
    flashlight: svg(flashlightBody),
    run: svg(runBody),

    /* Day 3 · Fuel */
    gas: svg(gasBody),
    engine: svg(carSide + ground(43)),
    hot: svg(carSide + ground(43) + heat(37, 22, 0.5)),
    lunch: svg(lunchBody),

    /* Day 3 · Sort: a skater high in the air, still going up */
    air: svg(ground(43) +
      '<circle cx="26" cy="8" r="5" fill="var(--accent)"/>' +
      '<path d="M26 14v11M26 17l-8-5M26 17l8-5M26 25l-6 7M26 25l6 7" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
      whoosh(26, 37, -90, 0.42) + arrow(8, 41, 8, 9, 'var(--sci-dark)', 2.5, '3 4')),

    /* Day 3 · How much energy: a swing pushed high, with a kid on the seat */
    swing: svg(
      '<path d="M5 6h38M8 6L4 43M40 6l4 37" fill="none" stroke="var(--ink-faint)" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M24 6v28" stroke="var(--ink-faint)" stroke-width="2" stroke-dasharray="3 4" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M24 34c6 0 11-3 13-8" fill="none" stroke="var(--ink-faint)" stroke-width="2" stroke-dasharray="3 4" stroke-linecap="round" opacity=".7"/>' +
      '<path d="M24 6L38 27" stroke="var(--sci-dark)" stroke-width="2.500" stroke-linecap="round"/>' +
      kid(36, 29, 0.55) + '<path d="M31 30h11" stroke="var(--sci-dark)" stroke-width="3" stroke-linecap="round"/>' + ground(44)),
    /* a fast ball moves a block */
    block: svg(ground(43) + whoosh(8, 36, 0, 0.5) + ball(16, 36.5, 6) + block(24, 30, 12) + arrow(38, 25, 46, 25, 'var(--accent)', 3))
  });
  /* the new words in the help panel's list */
  Object.assign(window.THING_ART, {
    heat: window.TILE_ART.warm,
    battery: window.TILE_ART.battery,
    fuel: window.TILE_ART.gas,
    engine: window.TILE_ART.engine
  });

  /* ── THE SCENES at the top of a page (400 wide) ─────────
     One picture for the whole page: what the points under the picture are
     about. The few words inside a scene are the names the page teaches. */
  const label = (x, y, text, anchor, color) => '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') +
    '" font-size="15" font-weight="700" fill="' + (color || 'var(--ink)') + '" font-family="Public Sans, sans-serif">' + text + '</text>';
  const scene = (body, h) => '<svg viewBox="0 0 400 ' + (h || 120) + '" aria-hidden="true" focusable="false" class="coverscene">' +
    '<rect width="400" height="' + (h || 120) + '" fill="var(--sci-soft)"/>' + body + '</svg>';
  const posts = (pairs, floor) => '<path d="' + pairs.map(p => 'M' + p[0] + ' ' + (p[1] + 3) + 'V' + floor).join('') +
    '" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>';
  const floorLine = (y) => '<path d="M10 ' + y + 'h380" stroke="var(--sci-dark)" stroke-width="4" stroke-linecap="round"/>';

  /* the whole ride: a tall first hill, a small second hill, and a train of
     three cars on the way up the first hill, pulled by the chain */
  const RIDE = 'M10 100C50 100 70 26 110 26S160 96 200 96 240 56 270 56 320 100 390 100';
  /* one tall hill, for the two pages about the car at the top */
  const BIG = 'M20 104C90 104 110 30 170 30S260 104 380 104';
  const track = d => '<path d="' + d + '" fill="none" stroke="var(--sci)" stroke-width="5" stroke-linecap="round"/>';

  window.SCENE_ART = {
    coaster: scene(
      posts([[48, 77], [76, 44], [110, 26], [150, 54], [235, 76], [270, 56], [300, 67]], 108) +
      track(RIDE) +
      /* the chain under the cars on the way up */
      '<path d="M30 94C52 78 68 52 90 33" fill="none" stroke="var(--sci-dark)" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 8"/>' +
      car(44, 81.7, -46, 0.85) + car(58, 65.5, -51, 0.85) + car(72, 48.7, -48, 0.85) +
      floorLine(110)),
    /* the car at the top of the hill: still, and high up */
    top: scene(
      posts([[100, 66], [130, 42], [170, 30], [215, 44], [260, 72]], 112) + track(BIG) +
      car(170, 30, 0, 1.25) +
      arrow(60, 110, 60, 22, 'var(--sci-dark)', 3, '5 6') + label(72, 30, 'high up', 'start') +
      floorLine(114)),
    /* stored energy at the top turns into moving energy on the way down */
    change: scene(
      posts([[100, 66], [130, 42], [170, 30], [215, 44], [260, 72]], 108) + track(BIG) +
      car(170, 30, 0, 1.15, 'var(--sci-dark)') + label(150, 130, 'stored energy', 'middle', 'var(--sci-dark)') +
      arrow(196, 16, 232, 30, 'var(--accent)', 4) +
      car(260, 71.5, 30, 1.15) + whoosh(238, 46, 30, 0.9) + label(290, 130, 'moving energy', 'middle', 'var(--accent)') +
      floorLine(110), 138),
    /* a tall slide and a short slide, a kid sitting still at the top of each */
    slides: scene(
      floorLine(110) +
      slide(70, 26, 110, 92, 5) + kid(76, 26, 0.95) +
      slide(250, 70, 110, 52, 5) + kid(256, 70, 0.95, 'var(--sci-dark)') +
      arrow(48, 108, 48, 28, 'var(--ink-faint)', 3, '5 6') + arrow(228, 108, 228, 72, 'var(--ink-faint)', 3, '5 6')),
    /* the ball on the high shelf, the ball on the way down, the ball on the floor */
    shelf: scene(
      floorLine(110) +
      '<path d="M40 30h92" stroke="var(--sci)" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M52 34v14M120 34v14" stroke="var(--sci)" stroke-width="4" stroke-linecap="round" opacity=".7"/>' +
      ball(100, 17, 11) +
      '<path d="M118 14c40-6 62 8 68 36" fill="none" stroke="var(--ink-faint)" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 6"/>' +
      ball(196, 66, 11) + whoosh(196, 50, 90, 0.9) + arrow(226, 46, 226, 86, 'var(--sci-dark)', 3.5) +
      '<path d="M206 84c14 16 40 18 70 16" fill="none" stroke="var(--ink-faint)" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 6"/>' +
      ball(310, 97, 11))
  };

  /* ── DAYS 2 AND 3 — the scenes ──────────────────────────
     A small picture is drawn in a 48 x 48 box; `big` puts one into a scene
     at (x, y), `k` times the size. */
  const big = (body, x, y, k) => '<g transform="translate(' + x + ',' + y + ') scale(' + k + ')">' + body + '</g>';
  Object.assign(window.SCENE_ART, {
    /* the hands move, the hands get warm: kinetic energy changes into thermal energy */
    hands: scene(
      big(handsPair + rubbing, 52, 4, 2.2) + label(105, 131, 'kinetic energy', 'middle', 'var(--sci-dark)') +
      arrow(178, 58, 226, 58, 'var(--accent)', 4) +
      big(handsPair, 244, 20, 1.8) + heat(262, 34, 1.5) + heat(322, 28, 1.5) + label(290, 131, 'thermal energy', 'middle', 'var(--accent)'), 138),
    /* the ball falls, hits the floor and stops: sound goes out, the floor gets a little warm */
    thud: scene(
      floorLine(110) +
      '<path d="M96 14c40-4 70 22 96 70" fill="none" stroke="var(--ink-faint)" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 6"/>' +
      ball(86, 16, 11, 'var(--sci)') + ball(200, 97, 11) +
      sound(220, 84, 1.3) + label(268, 60, 'sound', 'start', 'var(--sci-dark)') +
      heat(150, 104, 1.1) + label(142, 60, 'heat', 'end', 'var(--accent)')),
    /* before the bump and after the bump */
    bump: scene(
      floorLine(110) +
      whoosh(52, 96, 0, 0.9) + ball(70, 97, 11) + ball(128, 97, 11, 'var(--sci)') +
      '<path d="M200 14v90" stroke="var(--ink-faint)" stroke-width="2" stroke-dasharray="4 6" stroke-linecap="round" opacity=".6"/>' +
      ball(252, 97, 11) + whoosh(312, 96, 0, 0.9) + ball(330, 97, 11, 'var(--sci)') +
      arrow(252, 62, 322, 62, 'var(--accent)', 4) + label(287, 48, 'energy', 'middle', 'var(--accent)') +
      label(100, 34, 'before', 'middle', 'var(--ink)') + label(290, 26, 'after', 'middle', 'var(--ink)')),
    /* three kinds of stored energy: high up, in a battery, in a rubber band */
    stored: scene(big(carAtTop, 18, 8, 2.2) + big(batteryBody, 148, 8, 2.2) + big(bandBody, 276, 8, 2.2)),
    /* the battery's chemical energy changes into light */
    flashlight: scene(
      big(batteryBody, 26, 22, 1.8) + label(70, 131, 'chemical energy', 'middle', 'var(--sci-dark)') +
      arrow(126, 58, 170, 58, 'var(--accent)', 4) +
      big(flashlightBody, 190, 4, 2.3) + label(280, 131, 'light', 'middle', 'var(--accent)'), 138),
    /* gas goes in, the engine changes the energy, the car moves */
    engine: scene(
      big(gasBody, 22, 14, 1.9) + label(68, 131, 'chemical energy', 'middle', 'var(--sci-dark)') +
      arrow(120, 60, 164, 60, 'var(--accent)', 4) +
      whoosh(196, 66, 0, 1.1) + big(carSide, 200, 0, 2.6) + floorLine(110) +
      label(262, 131, 'kinetic energy', 'middle', 'var(--accent)'), 138),
    /* lunch goes in, your body changes the energy, you run */
    lunch: scene(
      big(lunchBody, 22, 10, 2) + label(70, 131, 'chemical energy', 'middle', 'var(--sci-dark)') +
      arrow(130, 60, 174, 60, 'var(--accent)', 4) +
      big(runner('var(--accent)') + whoosh(13, 24, 0, 0.5), 196, 4, 2.3) + floorLine(110) +
      label(262, 131, 'kinetic energy', 'middle', 'var(--accent)'), 138),
    /* the two questions: is the object moving, or still and ready to move */
    two: scene(
      label(34, 44, '1', 'middle', 'var(--accent)') + big(carGoingDown, 50, 10, 2.1) +
      label(232, 44, '2', 'middle', 'var(--sci-dark)') + big(carAtTop, 250, 10, 2.1)),
    /* a slow ball moves the block a little; a fast ball moves the block far */
    block: scene(
      floorLine(110) +
      '<path d="M24 96h14" stroke="var(--sci)" stroke-width="3" stroke-linecap="round" opacity=".7"/>' +
      ball(54, 97, 11, 'var(--sci)') + block(72, 86, 22, 'var(--sci-dark)') + arrow(100, 74, 118, 74, 'var(--accent)', 4) +
      label(70, 34, 'slow', 'middle', 'var(--ink)') +
      '<path d="M200 14v90" stroke="var(--ink-faint)" stroke-width="2" stroke-dasharray="4 6" stroke-linecap="round" opacity=".6"/>' +
      whoosh(224, 96, 0, 0.9) + ball(242, 97, 11) + block(260, 86, 22, 'var(--sci-dark)') + arrow(288, 74, 372, 74, 'var(--accent)', 4) +
      label(262, 34, 'fast', 'middle', 'var(--ink)'))
  });

  /* ── THE COVER ──────────────────────────────────────────
     The first thing a student sees. One picture of the whole lesson: a
     roller coaster. The train is on the way down the tall first hill, going
     fast, with the small second hill still to come. Wide, so the picture
     fills the top of the cover like a book jacket. */
  window.COVER_ART =
    '<svg viewBox="0 0 400 150" aria-hidden="true" focusable="false" class="coverscene">' +
    '<rect width="400" height="150" fill="var(--sci-soft)"/>' +
    /* a sun and two clouds, faint */
    '<circle cx="352" cy="30" r="15" fill="var(--accent)" opacity=".5"/>' +
    '<path d="M196 30h34a9 9 0 0 0 0-18 13 13 0 0 0-24-3 10 10 0 0 0-10 21z" fill="var(--surface)" opacity=".8"/>' +
    '<path d="M22 46h28a7 7 0 0 0 0-14 10 10 0 0 0-19-2 8 8 0 0 0-9 16z" fill="var(--surface)" opacity=".8"/>' +
    posts([[40, 113], [60, 90], [90, 47], [120, 28], [146, 42], [174, 85], [250, 87], [290, 62], [330, 85]], 132) +
    /* cross braces under the tall hill */
    '<path d="M60 132L120 60M120 132L60 100M120 132L174 96M174 132L120 80" stroke="var(--ink-faint)" stroke-width="1.8" stroke-linecap="round" opacity=".4"/>' +
    '<path d="M10 126C60 126 80 28 120 28S170 112 210 112 255 62 290 62 345 126 390 126" fill="none" stroke="var(--sci)" stroke-width="5.5" stroke-linecap="round"/>' +
    /* the train, three cars, going down the far side of the tall hill */
    car(126, 28.6, 12, 0.9) + car(144, 39.7, 46, 0.9) + car(157, 56.8, 57, 0.9) +
    whoosh(104, 12, 14, 1.05) +
    '<path d="M10 134h380" stroke="var(--sci-dark)" stroke-width="5" stroke-linecap="round"/>' +
    '</svg>';
})();
