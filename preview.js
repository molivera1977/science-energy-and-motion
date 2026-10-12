/* ══════════════════════════════════════════════════════
   TEACHER PREVIEW — scan the whole lesson

   Marcos 10/9: "where is the teacher mode so I can scan the entire lesson."
   The old Teacher button asked for a step number, jumped once, and left you
   stranded — the button only lived on the name-picker page.

   This one: unlock with the teacher PIN, then a bar across the top with
   Back / Next and a jump list. Every screen and every single question is a
   stop, in the order a student meets them. Left and right arrow keys work
   too.

   Guided screens (guide.js) show every step already unlocked here, so you
   can read straight through without listening to each one.

   NOTHING IS SAVED OR SENT. window.PREVIEW stops app.save(), post() and the
   local score list — so previewing on a student's Chromebook cannot
   overwrite their work, and no rows reach the sheet. Exit reloads the page
   clean.

   Open it three ways: the Teacher button on the name-picker page, the small
   "Teacher preview" link at the bottom of the cover, or ?teacher in the URL.
═══════════════════════════════════════════════════════ */
(function () {
  /* What each stop is called in the jump list. The opening pages are named
     here; everything inside the lesson takes its name from the data (the
     title of a check, the title of a page-set, the day of a stop), so a
     page-set or a check added to the data is listed without this file
     being touched. */
  const OPENING_NAMES = { cover: 'Cover', why: 'The big question', care: 'Why should you care',
    summary: 'What we just talked about', plan: 'Here is the plan', goals: 'By the end you can', start: 'Pick your name' };
  const nameOf = p => {
    if (OPENING_NAMES[p]) return OPENING_NAMES[p];
    if (p === 'tool') return (window.TOOL || {}).title || 'Meet the tool';
    if (p === 'vocab') return 'The words';
    if (p === 'vq') return 'Word check';
    if ((window.CHECKS || {})[p]) return window.CHECKS[p].title + ' \u00b7 questions';
    if (isLearn(p)) return window.LEARN[p].title;
    if (isGate(p)) return 'End of Day ' + window.DAY_GATES[p].day + (isLastStop(p) ? ' \u00b7 stop here' : ' \u00b7 ask Mr. O');
    return ({ exit: 'Exit ticket', end: 'Finished' })[p] || p;
  };
  const GROUP = p => OPENING.indexOf(p) !== -1 ? 'Before the lesson' : 'Day ' + (DAY_OF[p] || 1);

  /* Every screen, and every question inside a question screen, as one list. */
  function buildStops() {
    const out = [];
    PHASES.forEach(p => {
      if (isQPhase(p)) {                       /* every question screen, the checks included */
        const qs = bankFor(p);
        qs.forEach((q, i) => out.push({ phase: p, q: i,
          label: nameOf(p) + ' · ' + (i + 1) + ' of ' + qs.length }));
      } else {
        /* A guided screen with several pages (one word per page, the pages of
           a teaching page-set) is one stop PER PAGE, so the preview shows exactly
           what a student sees. The count comes from the screen's own markup. */
        const n = window.guide ? guide.pagesFor(p) : 0;
        if (n > 1) {
          for (let i = 0; i < n; i++) out.push({ phase: p, gp: i,
            label: nameOf(p) + ' \u00b7 page ' + (i + 1) + ' of ' + n });
        } else {
          out.push({ phase: p, label: nameOf(p) });
        }
      }
    });
    return out;
  }

  let STOPS = [], at = 0;

  function prepare() {
    app.studentName = 'Mr. O (Teacher)';
    const chip = document.getElementById('who-chip');
    if (chip) chip.textContent = 'Teacher preview';
    app.checkAns = {}; app.vocabAns = {}; app.exitAns = {};
    app.missedQuestions = []; app.resumeAt = '';
  }

  function show(i) {
    at = Math.max(0, Math.min(STOPS.length - 1, i));
    const stop = STOPS[at];
    try { speech.stop(); } catch (e) {}
    prepare();
    const p = stop.phase;
    if (p === 'cover')        { app.phase = 'cover'; app.show('cover-screen'); drawRail(); }
    else if (OPENERS[p])      { OPENERS[p](); }      /* the other opening pages */
    else {
      app.go(p);
      if (stop.q != null) { app.qIndex = stop.q; app.qLocked = false; renderQ(); }
    }
    if (stop.gp != null && window.guide && guide.current) guide.current.goto(stop.gp);
    syncWordHelp(p);
    document.getElementById('tp-jump').value = String(at);
    document.getElementById('tp-pos').textContent = (at + 1) + ' / ' + STOPS.length;
    document.getElementById('tp-prev').disabled = at === 0;
    document.getElementById('tp-next').disabled = at === STOPS.length - 1;
    window.scrollTo(0, 0);
  }

  function buildBar() {
    if (document.getElementById('tpbar')) return;
    const groups = {};
    STOPS.forEach((s, i) => {
      const g = GROUP(s.phase);
      (groups[g] = groups[g] || []).push('<option value="' + i + '">' + s.label + '</option>');
    });
    const bar = document.createElement('div');
    bar.id = 'tpbar';
    bar.setAttribute('data-noread', '');
    bar.innerHTML =
      '<span class="tp-tag">Teacher preview</span>' +
      '<span class="tp-note">nothing is saved or sent</span>' +
      '<button type="button" id="tp-prev">&#9664; Back</button>' +
      '<select id="tp-jump" aria-label="Jump to a screen">' +
        Object.keys(groups).map(g => '<optgroup label="' + g + '">' + groups[g].join('') + '</optgroup>').join('') +
      '</select>' +
      '<span id="tp-pos"></span>' +
      '<button type="button" id="tp-next">Next &#9654;</button>' +
      '<button type="button" id="tp-exit">Exit</button>';
    document.body.prepend(bar);
    document.body.classList.add('tp-on');
    document.getElementById('tp-prev').onclick = () => show(at - 1);
    document.getElementById('tp-next').onclick = () => show(at + 1);
    document.getElementById('tp-jump').onchange = e => show(parseInt(e.target.value, 10));
    document.getElementById('tp-exit').onclick = () => {
      try { speech.stop(); } catch (e) {}
      location.href = location.pathname;          /* reload clean, preview off */
    };
    document.addEventListener('keydown', e => {
      if (!window.PREVIEW) return;
      const t = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(t)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); show(at - 1); }
    });
  }

  function begin() {
    window.PREVIEW = true;
    app.stopTimer && app.stopTimer();
    STOPS = buildStops();
    buildBar();
    show(0);
  }

  /* Exposed for the Teacher button, the cover link and ?teacher. */
  window.startTeacherPreview = function () {
    if (window.PREVIEW) return;
    askPin('Teacher preview: scan every screen of the lesson. Nothing is saved or sent.', begin);
  };
  /* for testing, and for anything that needs the list without the PIN */
  window.__previewStops = () => buildStops();

  const link = document.getElementById('cv-teacher');
  if (link) link.onclick = e => { e.preventDefault(); window.startTeacherPreview(); };

  if (/[?&]teacher\b/.test(location.search)) window.startTeacherPreview();
})();
