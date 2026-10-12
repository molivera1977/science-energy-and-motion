/* ══════════════════════════════════════════════════════
   QA — the one check that runs before every push

   Why this exists (10/9/2026): too many defects reached Marcos. Each one was
   a block type, phase or path that a hand-kept list did not know about, and
   each check I ran was written after the fact for the thing I had just
   thought of. This walks EVERY screen the same way every time.

   Run it: open the lesson with ?qa in the address. It does not run otherwise.
   It never sends anything to the sheet, and it puts back whatever was in
   this browser's storage when it started.

   LESSON 1.2 (10/12/2026). The rules are the template's C1 to C30, made to
   check this lesson's pages, plus C31 to C33 for what is new here. Three of
   the template's rules are about a test (pushes, a data table). This lesson
   has no test yet, so those three are PARKED: each one records "not checked"
   (na), is not counted as passed, and does not stop "QA PASSED". They are
   C22, C24 and C30; what each one held is written where it is parked. The
   checking code for all three is in the template (git show 5388b7a:qa.js).
   The half of C25 that was about saved pushes is gone with them.

   What it checks:
     C1  closing the tab on the cover does not wipe a saved lesson
     C2  the opening path goes cover → why → care → summary → sumq → tool →
         toolq → plan → planq → goals → start
     C3  nothing starts talking on its own when a page opens
     C4  every preview stop shows exactly one screen, in the right phase
     C5  every visible piece of text belongs to a block that can be read aloud
     C6  every readable block has its own speaker (or its step's Listen button)
     C7  the word being read lights up, in every block, and the block is
         put back exactly as it was afterwards
     C8  no uncaught errors anywhere
     C9  no rows sent to the sheet
     C10 storage is unchanged at the end
     C11 nothing names the lesson's tool (TOOL.word, here the roller coaster)
         before the page that first explains the tool with <dfn> in a locked
         step: no page, and no question asked before that page
     C12 every question has its own feedback
     C13 no text a student reads is under 16px
     C14 guided screens: Next does not exist until every step was heard to
         the end, in order; stopping the voice early does not count. Every
         guided screen of the lesson is walked: the opening pages, the words,
         every page-set in LEARN, every stop at the end of a day
     C15 the teacher preview reaches every page of every guided screen
     C16 on a guided page a heading is read with its step, with no speaker
         of its own
     C17 student text names the thing and does not say "it"
     C18 every watched word is explained (<dfn>), in the lesson's own flow, at
         or before the first screen that uses it — the help panel does not count
     C19 student text says what was measured, not "your number"
     C20 a label is read with the line under it, on every screen
     C21 after every Listen the next thing to press is on screen, clear of
         the pinned help bar; and when a guided page opens, its Listen
         button comes on screen
     C22 PARKED (no test): after every push the helper speaks and the button
         and the glowing box are on screen
     C23 no screen is wider than the window (no sideways scroll)
     C24 PARKED (no test): the pushes of an older save are made to fit
     C25 the name page never clears saved work on one tap: with saved work
         "Pick up where I left off" is the big button, starting over asks
         for the teacher PIN (also when the saved work is under another
         name, and also when the saved lesson is finished), a student with
         nothing saved still starts with one tap, and a saved lesson is
         picked up where the student stopped, with its answers
     C26 the name page asks only for a name: almost nothing to read on it,
         and every "I can" line is inside a step of the locked page before it
     C27 frequent understanding checks: What we just talked about, Meet the
         tool, Here is the plan, the words and every page-set in LEARN are
         each followed at once by a check of two or three questions about
         that thing; every scored question is asked exactly once, with
         feedback and a skill; the dashboard's answer key (data/form_e.js)
         holds exactly the questions asked, word for word; the checks before
         the name page are answered on the way in and their answers go with
         the student who then picks a name; a lesson saved before a check
         existed is sent to that check and then back to where the student was
     C28 Day 1 previews the later days and does not walk through their plan:
         the plan page shows today in full and the later days in one short
         step; the end-of-day page says one short thing about next time
     C29 the word section: a word already taught (on an earlier page, or in
         an earlier lesson) gets one short reminder that explains the word
         again, a word that is new gets its own page with an example, and
         the word check asks every new word and no reminder word
     C30 PARKED (no test): a question answered from the student's own data
         has the data table on the screen with it
     C31 the stop at the end of the last built day has no way on: no button
         past it and no "What did Mr. O say?", for a student who arrives and
         for a student who comes back; the stop says the work is saved and to
         close the computer; a saved lesson whose place is that stop is
         picked up at that stop
     C32 no leftover Lesson 1.1 words in anything a student reads: the data,
         every screen, the static page, the help steps, and the text the
         engine writes (cart, push, surface, ramp, truck, friction, Test 1 to
         4, data table, centimeter, Starting and Stopping, Lesson 1.1)
     C33 a saved lesson is made to fit today's questions: a save that fits is
         left as it is; answers to questions no longer asked are taken out
         with their points; a place the lesson no longer has goes back to
         the first word; a damaged save does not stop the page
   It also lists how many words each screen asks a student to take in, and
   how many words each guided screen makes them listen to (window.__qaListen).

   The voice is replaced by a stand-in while the guided screens are tested,
   so C14 tests the lock, not the device's speech. Real speech has to be
   tried by ear on a real device.
═══════════════════════════════════════════════════════ */
(async function () {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const KEY = 'sci_energymotion_session_v1';
  const NO_TEST = 'This lesson has no test yet';
  const results = [];
  const rec = (id, label, pass, detail) => results.push({ id, label, pass: !!pass, na: false, detail: detail || '' });
  /* A PARKED RULE: what the rule is about does not exist in this lesson yet.
     It is recorded as not checked — never as passed — so the count of
     passed rules is the count of rules that really looked at something. */
  const park = (id, label, detail) => results.push({ id, label, pass: false, na: true, detail: detail || NO_TEST });
  const errors = [];
  window.addEventListener('error', e => errors.push(e.message));

  let sends = 0;
  const realFetch = window.fetch;
  window.fetch = function (u, o) { if (o && o.method === 'POST') sends++; return realFetch.apply(this, arguments); };

  const original = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); original[k] = localStorage.getItem(k); }
  const putBackSave = () => { if (KEY in original) localStorage.setItem(KEY, original[KEY]); else localStorage.removeItem(KEY); };

  const visible = () => [...document.querySelectorAll('section')].filter(s => !s.classList.contains('hidden'));
  const shown = el => !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
  const wordsIn = t => (String(t).match(/[A-Za-z0-9']+/g) || []).length;
  const plain = h => String(h == null ? '' : h).replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ').replace(/\s+/g, ' ').trim();
  const hush = () => { try { speechSynthesis.cancel(); speech.stop(); } catch (e) {} };
  /* All the text inside `el`, hidden parts too, one piece of text at a time
     with a space between. (textContent runs neighbours together: a choice's
     letter and its words came out as "CA push or a pull".) */
  const allText = el => { const out = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) { const p = w.currentNode.parentElement;
      if (p && !p.closest('script, style') && w.currentNode.textContent.trim()) out.push(w.currentNode.textContent.trim()); }
    return out.join(' '); };
  await wait(900); hush();

  /* every question the lesson has, whichever list holds it: any list in
     data/questions.js whose name ends in _Q. No list of lists to keep. */
  const BANKS = Object.keys(window).filter(k => /_Q$/.test(k) && Array.isArray(window[k]));
  const allQuestions = BANKS.reduce((all, k) => all.concat(window[k]), []);
  /* everything a student reads that C32 has to look at: { where, text } */
  const seenText = [];

  /* the answers a student who has reached `phase` has given: every question
     of every question screen before it (so a planted save is one the lesson
     as it is today could have written) */
  const answeredBefore = phase => {
    const out = {};
    PHASES.slice(0, PHASES.indexOf(phase)).filter(isQPhase).forEach(p => {
      const k = Q_PHASE[p].ans; out[k] = out[k] || {};
      bankFor(p).forEach(x => { out[k][x.id] = 0; });
    });
    return out;
  };

  /* C1 — a save this lesson could have written: a student partway through
     Day 1, with answers and pages heard. Closing the tab on the cover (where
     nobody has a name yet) must leave it exactly as it is. */
  {
    const planted = JSON.stringify(Object.assign({ studentName: 'QA STUDENT', phase: LEARN_KEYS[0] || 'vocab',
      score: 3, timerSeconds: 600, heard: { vocab: 7 } }, answeredBefore(LEARN_KEYS[0] || 'vocab')));
    localStorage.setItem(KEY, planted);
    window.dispatchEvent(new Event('beforeunload'));
    const after = localStorage.getItem(KEY);
    let kept = null; try { kept = JSON.parse(after || 'null'); } catch (e) {}
    rec('C1', 'Closing on the cover keeps a saved lesson', after === planted,
        !kept ? 'save gone' : (kept.studentName || '(no name)') + ', ' + Object.keys(kept.checkAns || {}).length + ' check answers, at "' + kept.phase + '"');
    /* Put back what was there. Removing the key outright made C10 fail on any
       browser that already held a saved lesson — the check blamed the lesson
       for a change this test made itself. */
    putBackSave();
  }

  /* ── the guided screens ──────────────────────────────────
     A stand-in for the voice: it "finishes" at once, or is "stopped early"
     when endOk is false. Anything that asks it to speak when this test did
     not press a button is the page talking on its own. */
  const realSay = speech.sayParts;
  let qaTap = false, endOk = true;
  const selfTalk = [], gateBad = [], listen = [], offScreen = [];
  const standIn = function (parts, rate, onEnd, onStart) {
    if (!qaTap) selfTalk.push(app.phase);
    if (onStart) onStart();
    if (onEnd) setTimeout(() => onEnd(endOk, endOk ? 'ended' : 'cancelled'), 0);
  };
  guide.instant = true;      /* no scroll animation: positions can be read at once */
  /* C21 — after every Listen, the next thing to press is on screen, clear of
     the "Stuck? Tap here" bar. Marcos 10/10: "the page should move up so they
     see the next button." */
  const inView = el => { const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= innerHeight - guide.barHeight() + 1; };
  speech.sayParts = standIn;
  const press = async btn => { qaTap = true; btn.click(); qaTap = false; await wait(40); };

  /* Do what a student has to do on the guided screen inside `sec`, and note
     anything the lock let through. `after` is what must stay out of reach
     until the last step has been heard. A screen with NO way on (the stop at
     the end of the last built day) has no `after`: there the steps are
     walked the same way, and C31 looks at what is left on the page. */
  async function gateCheck(name, sec, after) {
    const steps = () => [...sec.querySelectorAll('.gstep')];
    const done = () => steps().filter(e => e.classList.contains('g-done')).length;
    if (!steps().length) { gateBad.push(name + ': no steps at all'); return; }
    const tally = { screen: name, steps: steps().length, words: 0 };
    listen.push(tally);
    /* what one press of Listen makes them hear: the step and its headings */
    const heardWith = step => wordsIn(speech.textOf(step)) +
      [...sec.querySelectorAll('.glead')].filter(l => l._gstep === step && shown(l))
        .reduce((n, l) => n + wordsIn(speech.textOf(l)), 0);

    /* C21, when a page opens: the Listen button of the open step comes on
       screen by itself (the page moves up to it a moment after opening).
       Until 10/12 this was looked at only AFTER a Listen; the first Listen
       of a page was not, and on the last page of the stop that button is
       the only thing there is to press. */
    const listenOnScreen = async what => {
      const btn = () => { const live = steps().filter(e => e.classList.contains('g-live')).find(shown); return live && live.querySelector('.gbtn'); };
      for (let t = 0; t < 12 && btn() && !inView(btn()); t++) await wait(100);
      if (btn() && !inView(btn())) offScreen.push(name + ' ' + what + ': the Listen button is not on screen');
    };
    await listenOnScreen('when the screen opens');
    if (after && shown(after)) gateBad.push(name + ': Next is reachable before anything was heard');
    const open = steps().filter(shown);
    if (!open[0] || !open[0].classList.contains('g-live')) gateBad.push(name + ': the first step is not open');
    if (open.slice(1).some(e => !e.classList.contains('g-locked'))) gateBad.push(name + ': a later step is open too early');
    if (!open[0]) return;

    /* stopping the voice early must not count */
    endOk = false;
    await press(open[0].querySelector('.gbtn'));
    endOk = true;
    if (done() !== 0) gateBad.push(name + ': stopping the voice early still unlocked the step');

    let guard = 0;
    while (guard++ < 120) {
      const live = steps().filter(e => e.classList.contains('g-live')).find(shown);
      if (live) {
        const before = done();
        if (after && shown(after)) { gateBad.push(name + ': Next appeared with a step still unheard'); break; }
        tally.words += heardWith(live);
        await press(live.querySelector('.gbtn'));
        if (done() !== before + 1) { gateBad.push(name + ': a step did not unlock after it was heard'); break; }
        /* what does the student press now? It has to be where they can see it. */
        const nextLive = steps().filter(e => e.classList.contains('g-live')).find(shown);
        const todo = (nextLive && nextLive.querySelector('.gbtn')) || [...sec.querySelectorAll('.gnext')].find(shown) ||
                     (after && shown(after) ? after : null);
        if (todo && !inView(todo)) await wait(700);      /* some screens settle a moment later */
        if (todo && !inView(todo) && todo.getBoundingClientRect().height < innerHeight - 140)
          offScreen.push(name + ' after step ' + (before + 1) + ': "' + (todo.textContent || '').trim().slice(0, 24) + '"');
        continue;
      }
      const nx = [...sec.querySelectorAll('.gnext')].find(shown);
      if (nx) { nx.click(); await wait(60); await listenOnScreen('when its next page opens'); continue; }
      break;
    }
    if (done() !== steps().length) gateBad.push(name + ': ' + done() + ' of ' + steps().length + ' steps heard at the end');
    if (after && !shown(after)) gateBad.push(name + ': Next never appeared after every step was heard');
  }

  /* C2, C3, C14 (opening pages) — the student's own path, through the lock.
     The path is written out here, not read from the lesson's own list: this
     is what the opening has to be, and the lesson's list is held to it. */
  const wantPath = ['cover', 'why', 'care', 'summary', 'sumq', 'tool', 'toolq', 'plan', 'planq', 'goals', 'start'];
  const path = [app.phase], talked = [], checkWalk = [];
  for (const id of ['cover-go', 'why-next', 'care-next', 'sum-next', 'tool-next', 'ra-next', 'goals-next']) {
    const b = document.getElementById(id);
    if (!b) { path.push('(no #' + id + ')'); break; }
    if (id !== 'cover-go') await gateCheck(app.phase, visible()[0], b);
    b.click(); await wait(1200);
    if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(app.phase);
    hush(); path.push(app.phase);
    /* a check between two opening pages: answer every question the way a
       student does, then carry on from where that leads */
    if (isQPhase(app.phase)) {
      const here = app.phase, n = bankFor(here).length;
      let guard = 0;
      while (app.phase === here && guard++ < 20) {
        const opt = [...document.querySelectorAll('#q-opts .opt')].find(o => !o.disabled);
        const nx = document.getElementById('q-next');
        if (shown(nx)) { seenText.push({ where: 'the check "' + here + '", answered', text: allText(document.getElementById('q-screen')) });
                         nx.click(); await wait(300); }
        else if (opt) { opt.click(); await wait(80);
                        seenText.push({ where: 'the check "' + here + '", after a pick', text: allText(document.getElementById('q-fb')) }); }
      }
      checkWalk.push({ phase: here, asked: n, answered: bankFor(here).filter(x => answersFor(here)[x.id] != null).length, then: app.phase });
      if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(app.phase);
      hush(); path.push(app.phase);
    }
  }
  rec('C2', 'Opening path in order', JSON.stringify(path) === JSON.stringify(wantPath) && JSON.stringify(OPENING) === JSON.stringify(wantPath),
      path.join(' → ') + (JSON.stringify(OPENING) === JSON.stringify(wantPath) ? '' : ' | the lesson lists: ' + OPENING.join(' → ')));

  /* C26 — THE NAME PAGE ASKS FOR A NAME AND NOTHING ELSE. Marcos 10/10: "are
     the students forced to read this page?" It held 143 words above the name
     picker, each with a small speaker, and Start woke up as soon as a name
     was chosen. Anything a student has to take in belongs on a locked page
     BEFORE this one. So, standing on the name page the way a first-time
     student arrives: there is almost nothing to read here, and every "I can"
     line was inside a step of the locked page that came just before. */
  {
    const st = document.getElementById('start-screen');
    const lines = (window.LESSON.icanKid || []).map(t => t.replace(/\s+/g, ' ').slice(0, 30));
    const here = speech.readable(st).filter(b => shown(b.el));
    const nameWords = here.reduce((n, b) => n + wordsIn(b.text), 0);
    const steps = [...document.querySelectorAll('#goals-screen .gstep')].map(e => e.textContent.replace(/\s+/g, ' '));
    const notLocked = lines.filter(t => !steps.some(x => x.includes(t)));
    const stillHere = lines.filter(t => st.textContent.replace(/\s+/g, ' ').includes(t));
    const prose = [...st.querySelectorAll('p, li, h3')].filter(shown).map(e => e.textContent.trim().slice(0, 30));
    rec('C26', 'The name page asks only for a name; every "I can" line is heard on a locked page first',
        app.phase === 'start' && visible().length === 1 && nameWords <= 20 && lines.length > 0 && !notLocked.length && !stillHere.length && !prose.length,
        nameWords + ' words to read on the name page. ' +
        (visible().length !== 1 ? visible().length + ' screens showing at once: ' + visible().map(x => x.id).join(', ') + '. ' : '') +
        (!lines.length ? 'The lesson has no "I can" lines. ' : '') +
        (notLocked.length ? 'Not in a locked step: ' + notLocked.join(' | ') + '. ' : '') +
        (stillHere.length ? 'Still on the name page: ' + stillHere.join(' | ') + '. ' : '') +
        (prose.length ? 'Paragraphs on the name page: ' + prose.join(' | ') : ''));
  }

  /* C11 — a thing is introduced before it is talked about. Marcos, on Lesson
     1.1: "You start talking about a cart and the kids have no idea why you
     are talking about it." The lesson's tool is TOOL.word in data/lesson.js
     (the roller coaster). The page that introduces the tool is the first
     opening page that EXPLAINS the word, marked <dfn>, inside a step that
     has to be heard. Here that is What we just talked about, because Mr. O
     shows the video before the screens open. No page before that page may
     name the tool, and no question asked before that page may either. */
  {
    const tool = String((window.TOOL || {}).word || '').trim();
    const rx = new RegExp('\\b' + tool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+') + 's?\\b', 'i');
    const sectionOf = p => document.getElementById(p + '-screen');
    const pages = OPENING.filter(p => !isQPhase(p) && sectionOf(p));
    const explains = p => [...sectionOf(p).querySelectorAll('dfn')].some(d => rx.test(d.textContent) && d.closest('[data-step]'));
    const introAt = tool ? pages.find(explains) : '';
    const early = [];
    if (!tool) early.push('the lesson does not say what its tool is (TOOL.word)');
    else if (!introAt) early.push('no opening page explains "' + tool + '" (<dfn>) in a step that has to be heard');
    else OPENING.slice(0, OPENING.indexOf(introAt)).forEach(p => {
      if (isQPhase(p)) bankFor(p).forEach(x => {
        if (rx.test([x.q, (x.opts || []).join(' '), x.why || ''].join(' '))) early.push(x.id + ' (asked on "' + p + '")');
      });
      else if (sectionOf(p) && rx.test(sectionOf(p).textContent)) early.push('the "' + p + '" page');
    });
    rec('C11', 'Nothing names the ' + (tool || 'tool') + ' before the page that explains the ' + (tool || 'tool') +
        (introAt ? ' ("' + introAt + '")' : ''), early.length === 0, early.join(', '));
  }

  /* enter the preview */
  if (!window.startTeacherPreview) { rec('C4', 'Teacher preview exists', false, 'preview.js not loaded'); return report(); }
  window.startTeacherPreview(); await wait(150);
  document.getElementById('pin-input').value = TEACHER_PIN;
  document.getElementById('pin-ok').click(); await wait(500);
  const stops = window.__previewStops();
  const jump = async i => { const j = document.getElementById('tp-jump'); j.value = String(i);
    j.dispatchEvent(new Event('change')); await wait(250); };
  const stopOf = phase => stops.findIndex(s => s.phase === phase);
  const SPK_ATTR = ['background-color', 'box-shadow'];
  const MIN_FS = 16;   /* px — labels. Sentences are 18 and up. */

  /* C14 (inside the lesson) — the same lock on the words, on every page-set
     in LEARN and on every stop at the end of a day. guide.testGate turns the
     lock on inside the preview, so this needs no student name and sends
     nothing.

     WHICH screens are guided is not left to the preview to say: every screen
     after the name page that is not a question screen is one (the end screen
     apart). So a page-set added to LEARN is walked through the lock here, or
     this rule fails; it cannot be skipped by being left out of a list. */
  guide.testGate = true;
  /* which part of the screen holds the steps, and what must stay locked
     (nothing, on the stop with no way on) */
  const GATED = ph => ph === 'vocab' ? ['vocab-screen', 'vocab-next']
                    : isLearn(ph)    ? ['learn-screen', 'learn-next']
                    : isGate(ph)     ? ['daygate-screen', isLastStop(ph) ? '' : 'dg-next']
                    :                  null;
  const insideGuided = PHASES.filter(p => OPENING.indexOf(p) === -1 && !isQPhase(p) && p !== 'end');
  for (const ph of insideGuided) {
    const where = GATED(ph), at = stopOf(ph);
    if (!where) { gateBad.push(ph + ': not a kind of screen this check knows how to walk'); continue; }
    if (at === -1) { gateBad.push(ph + ': not in the teacher preview'); continue; }
    guide.testHeard = {};
    await jump(at);
    const after = where[1] ? document.getElementById(where[1]) : null;
    if (where[1] && !after) { gateBad.push(ph + ': no #' + where[1] + ' to keep locked'); continue; }
    await gateCheck(ph, document.getElementById(where[0]), after);
    if (isGate(ph) && !isLastStop(ph)) {
      document.getElementById('dg-next').click(); await wait(200);
      await gateCheck('day ' + ((window.DAY_GATES[ph].day || 1) + 1) + ' recap', document.getElementById('dg-recap'), document.getElementById('dg-go'));
    }
  }
  guide.testGate = false; guide.testHeard = {};
  speech.sayParts = realSay;
  guide.instant = false;
  /* every guided screen was really walked: the opening pages as a student,
     the rest just above */
  const mustWalk = OPENING.filter(p => !isQPhase(p) && p !== 'cover' && p !== 'start').concat(insideGuided);
  mustWalk.forEach(p => { if (!listen.some(l => l.screen === p && l.steps > 0)) gateBad.push(p + ': never walked through the lock'); });
  rec('C21', 'After every Listen the next button is on screen, above the help bar', offScreen.length === 0,
      offScreen.length + ' hidden. ' + offScreen.slice(0, 6).join(' | '));
  rec('C14', 'Guided screens: Next is locked until every step is heard (' + listen.length + ' screens)',
      gateBad.length === 0, [...new Set(gateBad)].slice(0, 6).join(' | '));

  const phaseBad = [], uncovered = [], noSpeaker = [], noLight = [], words = [], tiny = {};
  const cover = {}, lockedInPreview = [], apart = [], loose = [], flow = [];
  const tooWide = [];
  /* C17 — name the thing. Marcos 10/10, on "Which one lets it go farthest?":
     "don't say it, say what you are talking about". A struggling reader
     cannot carry "it" back to the noun, so student text says the noun again.
     Two phrases use "it" with nothing to point back to and are allowed. */
  const IT_OK = [/it is hard to run on sand/gi, /what it means to need energy/gi];
  const vague = {}, bareNumber = {};
  const lintIt = (text, where) => {
    let t = String(text || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ');
    IT_OK.forEach(rx => { t = t.replace(rx, ''); });
    const m = /(?:\S+\s+){0,4}\b[Ii]t(?:'s)?\b(?:\s+\S+){0,3}/.exec(t);
    if (m) vague[m[0].trim().slice(0, 60)] = where;
    /* C19 — say WHAT was measured. Marcos 10/10: "the distance the cart
       traveled. Be more specific in what is happening." "Your number" and
       "the numbers" do not say what the number is a number OF. */
    const n = /(?:\S+\s+){0,3}\b(?:your|the|that|those|these|two|own|real) numbers?\b(?:\s+\S+){0,3}/i.exec(t);
    if (n) bareNumber[n[0].trim().slice(0, 60)] = where;
  };
  /* every sentence the lesson keeps as data, whether or not a preview stop
     happens to show it. `walkText` hands each string to `fn` with the name of
     the list it came from; keys that are not sentences are left out. */
  const NOT_TEXT = { art: 1, scene: 1, es: 1, from: 1, recap: 1, word: 1, id: 1, a: 1, met: 1, day: 1, bank: 1, after: 1 };
  const LESSON_TEXT = { vocab: window.LESSON.vocab, 'I can lines': window.LESSON.icanKid, 'big question': window.LESSON.driving,
    'end screen': window.LESSON.endLead, RECAP: window.RECAP, INTRO_PLAN: window.INTRO_PLAN, CARE: window.CARE, TOOL: window.TOOL,
    TOOL_PAGES: window.TOOL_PAGES, LEARN: window.LEARN, DAY_GATES: window.DAY_GATES, METHOD_WORDS: window.METHOD_WORDS,
    THING_WORDS: window.THING_WORDS, CHECKS: window.CHECKS, SKILLS: window.SKILLS, questions: allQuestions,
    'the stop': STOP_LINES };
  const walkText = fn => Object.keys(LESSON_TEXT).forEach(name => (function walk(v, key) {
    if (typeof v === 'string') { if (!NOT_TEXT[key]) fn(v, name + (key && isNaN(key) ? ' (' + key + ')' : '')); }
    else if (Array.isArray(v)) v.forEach(x => walk(x, key));
    else if (v && typeof v === 'object') Object.keys(v).forEach(k => walk(v[k], k));
  })(LESSON_TEXT[name], ''));
  walkText((t, where) => lintIt(t, 'lesson text: ' + where));

  for (let i = 0; i < stops.length; i++) {
    await jump(i);
    await wait(650);
    if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(stops[i].label);
    hush();
    const v = visible();
    if (v.length !== 1 || app.phase !== stops[i].phase) { phaseBad.push(stops[i].label); continue; }
    const sec = v[0];
    const blocks = speech.readable(sec);
    const set = new Set(blocks.map(b => b.el));
    seenText.push({ where: stops[i].label, text: allText(sec) });

    /* C23 — nothing sticks out past the side of the window. The help bar did,
       by 16px, for two days: a sideways scroll on every working screen. */
    { const de = document.documentElement;
      if (de.scrollWidth > de.clientWidth + 1) tooWide.push(stops[i].label + ' (+' + (de.scrollWidth - de.clientWidth) + 'px)'); }

    /* C15 — which page of which guided screen is this? */
    const g = guide.current;
    if (g && shown(g.root) && (g.root === sec || sec.contains(g.root))) {
      (cover[g.id] = cover[g.id] || { n: g.pageCount, seen: new Set() }).seen.add(g.page);
      if ([...sec.querySelectorAll('.gstep')].some(e => shown(e) && !e.classList.contains('g-done')))
        lockedInPreview.push(stops[i].label);
    }

    /* C16 — on a guided page, nothing above a step has a speaker of its own.
       Marcos 10/9: "these two should be read combined." Every block that
       comes before the last step showing, and is not itself in a step, has
       to be one of that page's headings (read by a step's Listen button). */
    if (g && g.leads && shown(g.root) && (g.root === sec || sec.contains(g.root))) {
      const stepsOn = [...g.root.querySelectorAll('.gstep')].filter(shown);
      const lastStep = stepsOn[stepsOn.length - 1];
      if (lastStep) blocks.forEach(b => {
        if (!g.root.contains(b.el) || b.el.closest('.gstep,[data-gafter],.gnav')) return;
        if (!(b.el.compareDocumentPosition(lastStep) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
        if (!b.el.classList.contains('glead')) apart.push(stops[i].label + ': "' + b.text.slice(0, 36) + '"');
      });
    }

    /* C20 — a label never has a speaker of its own when the line it labels is
       right under it. Marcos 10/10, on "QUESTION 1 OF 2" above "What is a
       force?": "should be combined." Any block the page styles in capitals
       (that is what a label looks like here) with another block right under
       it must have been joined to that block. */
    blocks.forEach((b, k) => {
      const el = b.el, nx = blocks[k + 1] && blocks[k + 1].el;
      if (!nx || el.closest('.gstep,.glead,table') || nx.closest('table')) return;
      if (getComputedStyle(el).textTransform !== 'uppercase') return;
      const ra = el.getBoundingClientRect(), rb = nx.getBoundingClientRect();
      if (!(rb.top - ra.bottom < 56 && rb.top >= ra.top - 6)) return;
      const own = el.querySelector(':scope > .mini-spk');
      if (own && getComputedStyle(own).display !== 'none') loose.push(stops[i].label + ': "' + b.text.slice(0, 30) + '"');
    });

    /* C5 — no visible text outside a readable block */
    sec.querySelectorAll('span,div,p,li,h1,h2,h3,h4,td,th,label,b').forEach(el => {
      if (el.closest('[data-noread]') || el.offsetParent === null) return;
      const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim())
        .map(n => n.textContent.trim()).join(' ');
      if (own.length < 12 || set.has(el)) return;
      let p = el.parentElement, ok = false;
      while (p && p !== sec) { if (set.has(p)) { ok = true; break; } p = p.parentElement; }
      if (!ok) uncovered.push(stops[i].label + ': "' + own.slice(0, 40) + '"');
    });

    /* C13 — nothing a student reads is small. Marcos 10/9: "the writing seems
       very small... It needs to be more kid friendly." Text inside a drawing
       scales with the drawing, so it is skipped. */
    sec.querySelectorAll('*').forEach(el => {
      if (el.offsetParent === null || el.closest('svg,[data-noread]')) return;
      const own = [...el.childNodes].filter(n => n.nodeType === 3 && /[A-Za-z]{2}/.test(n.textContent))
        .map(n => n.textContent.trim()).join(' ');
      if (!own) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < MIN_FS) tiny[fs + 'px "' + own.slice(0, 30) + '"'] = stops[i].label;
    });

    blocks.forEach(b => lintIt(b.text, stops[i].label));
    /* C18 — this stop's words, and which words it EXPLAINS (<dfn>). */
    flow.push({ label: stops[i].label, phase: stops[i].phase, used: blocks.map(b => b.text).join(' '),
      taught: [...sec.querySelectorAll('dfn')].filter(shown).map(d => d.textContent.toLowerCase().trim()) });
    [...sec.querySelectorAll('button')].filter(shown).forEach(bt => lintIt(bt.textContent, stops[i].label + ' (button)'));

    blocks.forEach(b => {
      const el = b.el;
      /* C6 — a way to hear it: its own speaker icon that can be seen, or the
         Listen button of the guided step it sits in. Attached by the page
         itself, not by this test. */
      const mine = el.querySelector(el.classList.contains('opt') ? '.mini-spk' : ':scope > .mini-spk');
      const step = el.closest('.gstep');
      const lead = el.closest('.glead');       /* a heading read with its step */
      const joined = el.closest('.slead');     /* a label read with the line under it */
      const heardBy = (mine && getComputedStyle(mine).display !== 'none') ||
                      (step && shown(step.querySelector('.gbtn'))) ||
                      (lead && lead._gstep && lead._gstep.querySelector('.gbtn')) ||
                      (joined && joined._sfor && shown(joined._sfor.querySelector('.mini-spk')));
      if (!heardBy) noSpeaker.push(stops[i].label + ': "' + b.text.slice(0, 40) + '"');
      /* C7 — the WORD being read lights up (Marcos 10/9: "word for word
         highlighting instead of the entire box lit up"). The block is split
         into words the way speech does it; the first word must change colour
         when marked, every word must be in the spoken text, and the block
         must be put back exactly as it was. A block with no words to split
         falls back to lighting the box, and that has to be visible too. */
      const htmlBefore = el.innerHTML;
      const made = [];
      const spans = speech.split(el, made);
      const lit = spans[0] || el;
      const off = SPK_ATTR.map(k => getComputedStyle(lit).getPropertyValue(k)).join('|');
      lit.classList.add('spk');
      const on = SPK_ATTR.map(k => getComputedStyle(lit).getPropertyValue(k)).join('|');
      lit.classList.remove('spk');
      const said = spans.length ? speech.joinTokens(speech.tokensOf(spans)) : b.text;
      made.forEach(w => { if (w.parentNode) w.parentNode.replaceChild(document.createTextNode(w.textContent), w); });
      el.normalize();
      if (off === on) noLight.push(stops[i].label + ': "' + b.text.slice(0, 40) + '"');
      else if (said !== b.text) noLight.push(stops[i].label + ' (says one thing, lights another): "' + b.text.slice(0, 30) + '"');
      else if (el.innerHTML !== htmlBefore) noLight.push(stops[i].label + ' (not put back): "' + b.text.slice(0, 30) + '"');
    });
    words.push({ screen: stops[i].label.replace(/ · (?:word |page )?\d+ of \d+$/, ''),
      words: blocks.reduce((n, b) => n + (b.text.match(/[A-Za-z]+/g) || []).length, 0) });
  }

  talked.push(...selfTalk);
  rec('C3', 'Nothing speaks on its own', talked.length === 0, talked.join(', ') || 'silent');
  /* every phase of the lesson is a stop of the preview, or Mr. O cannot see it */
  PHASES.forEach(p => { if (stopOf(p) === -1) phaseBad.push('"' + p + '" is not in the preview'); });
  rec('C4', 'Every preview stop shows one screen in the right phase (' + stops.length + ' stops)',
      phaseBad.length === 0, phaseBad.join(', '));
  rec('C5', 'All visible text can be read aloud', uncovered.length === 0, uncovered.slice(0, 6).join(' | '));
  rec('C6', 'Every readable block has its own speaker', noSpeaker.length === 0,
      noSpeaker.length + ' missing. ' + noSpeaker.slice(0, 6).join(' | '));
  rec('C7', 'Every block lights up word by word while read', noLight.length === 0,
      noLight.length + ' dark. ' + noLight.slice(0, 6).join(' | '));
  const tinyList = Object.keys(tiny);
  rec('C13', 'No text a student reads is under ' + MIN_FS + 'px', tinyList.length === 0,
      tinyList.length + ' small. ' + tinyList.slice(0, 6).map(k => k + ' on ' + tiny[k]).join(' | '));

  /* C15 — a guided page the preview never lands on is a page Marcos cannot
     check. Every guided screen must show all of its pages, and the number
     of pages is counted from the lesson's own data, not from the preview:
     the words, the tool pages, every page-set in LEARN. */
  {
    const missed = Object.keys(cover).filter(id => cover[id].seen.size !== cover[id].n)
      .map(id => id + ' ' + cover[id].seen.size + '/' + cover[id].n);
    const wantPages = { tool: (window.TOOL_PAGES || []).length,
      vocab: (LESSON.vocab.some(v => v.met) ? 1 : 0) + LESSON.vocab.filter(v => !v.met).length };
    LEARN_KEYS.filter(k => PHASES.indexOf(k) !== -1).forEach(k => { wantPages[k] = (window.LEARN[k].pages || []).length; });
    Object.keys(wantPages).forEach(id => {
      const got = cover[id] ? cover[id].seen.size : 0;
      if (got !== wantPages[id]) missed.push(id + ' shows ' + got + ' of its ' + wantPages[id] + ' pages');
    });
    mustWalk.forEach(p => { if (!cover[p]) missed.push('"' + p + '" never showed as a guided screen'); });
    rec('C15', 'Teacher preview reaches every guided page (' + Object.keys(cover).length + ' guided screens)',
        missed.length === 0 && lockedInPreview.length === 0,
        (missed.length ? 'pages missed: ' + [...new Set(missed)].join(', ') + '. ' : '') +
        (lockedInPreview.length ? 'locked in preview: ' + lockedInPreview.slice(0, 4).join(', ') + '. ' : ''));
  }

  rec('C16', 'On guided pages a heading is read with its step, not by a separate speaker',
      apart.length === 0, apart.length + ' apart. ' + apart.slice(0, 6).join(' | '));

  rec('C20', 'A label is read with the line under it, not by a speaker of its own', loose.length === 0,
      loose.length + ' loose. ' + [...new Set(loose)].slice(0, 6).join(' | '));

  /* C12 — every question carries its own feedback. On 10/9 the feedback
     table of Lesson 1.1 was found keyed to the OLD question numbers: one
     question explained another and the newest questions had none. This
     catches a missing or copy-pasted explanation (matching it to the right
     question still needs a human read). */
  const bank = Object.keys(Q_PHASE).reduce((all, p) => all.concat(bankFor(p)), []);
  const fb = bank.map(q => ({ id: q.id, t: whyRight(q) }));
  const empty = fb.filter(f => !f.t).map(f => f.id);
  const seenT = {}, dupes = [];
  fb.forEach(f => { if (f.t) { if (seenT[f.t]) dupes.push(f.id + '=' + seenT[f.t]); else seenT[f.t] = f.id; } });
  fb.forEach(f => lintIt(f.t, f.id + ' feedback'));

  /* C30 — PARKED. What it held: a question answered from the student's own
     data table has that table on the screen with the question (Marcos 10/11,
     on the first claim question: "shouldn't they be able to see their data
     when answering the explain questions. It should be right there."). This
     lesson has no data table and no question built from one. The day a test
     is added, the check comes back from the template with the table. */
  park('C30', 'A question answered from the student\'s own data has the data table on screen');
  rec('C23', 'No screen is wider than the window', tooWide.length === 0,
      tooWide.length + ' are. ' + tooWide.slice(0, 6).join(' | '));

  /* C22 — PARKED. What it held: on the push screen, after every push of every
     test, the helper says something that can be heard, and the button and
     the glowing box of the data table are on screen (on a Chromebook the
     cart with them). Marcos 10/9: "kids won't know where the data table is
     and its connection to cart moving." This lesson has no push screen. */
  park('C22', 'After every push: the helper speaks, and the button and the glowing box are on screen');

  /* C24 — PARKED. What it held: a lesson saved when each setup had a
     different number of pushes is made to fit (pushes that no longer line up
     are dropped, the student goes back to the first test that is not full).
     This lesson saves no pushes. The half of that rule that is about saved
     ANSWERS still has something to check here, and is C33 below. */
  park('C24', 'A lesson saved before the pushes changed is made to fit when it is picked up');

  /* app is put aside while a check presses the real buttons, and put back
     after. app.go is held, so nothing starts; the preview is on, so nothing
     is saved or sent. */
  const FIELDS = ['studentName', 'phase', 'score', 'missedQuestions', 'events', 'startedAt', 'finishedAt', 'timerSeconds',
    'qIndex', 'checkAns', 'vocabAns', 'exitAns', 'heard', 'refit', 'resumeAt'];
  function holdApp() {
    const keep = {}; FIELDS.forEach(f => { keep[f] = JSON.stringify(app[f]); });
    const tabs = tabSwitchCount, chip = document.getElementById('who-chip').textContent;
    const realGo = app.go, realTimer = app.startTimer;
    const h = { went: '', realGo: p => realGo.call(app, p) };
    /* the clock is stopped as well as held: the preview starts it at the
       words, and a tick landing between "pick the lesson up" and the look at
       what came back made a saved 900 seconds read 901 */
    app.stopTimer();
    app.go = p => { h.went = p; }; app.startTimer = () => {};
    h.release = () => {
      app.go = realGo; app.startTimer = realTimer;
      FIELDS.forEach(f => { if (keep[f] === undefined) delete app[f]; else app[f] = JSON.parse(keep[f]); });
      tabSwitchCount = tabs; document.getElementById('who-chip').textContent = chip; app.tickTimer();
      putBackSave();
    };
    return h;
  }
  const pickName = async n => { const sel = document.getElementById('name-select'); sel.value = n;
    sel.dispatchEvent(new Event('change')); await wait(60); };

  /* C33 — A SAVED LESSON IS MADE TO FIT TODAY'S QUESTIONS (fitSaved in
     script.js). This is the half of the template's C24 that is not about
     pushes. The lesson is built a day at a time, so saves from before a
     change will be picked up. */
  {
    const fitBad = [];
    const midPhase = LEARN_KEYS[0] || 'vocab';
    /* a save that fits: left exactly as it is */
    const fits = Object.assign({ phase: midPhase, score: 5, heard: { vocab: 7, tool: 7 },
      missedQuestions: [{ id: bankFor('vq')[0] ? bankFor('vq')[0].id : 'E08', q: 'x' }] }, answeredBefore(midPhase));
    const f1 = fitSaved(fits);
    if (f1.catchUp || f1.resumeAt || f1.phase !== midPhase) fitBad.push('a save that fits was sent to "' + f1.phase + '"');
    if (f1.score !== 5 || f1.missed.length !== 1) fitBad.push('a save that fits lost its score or its misses');
    if (f1.heard.vocab !== 7 || f1.heard.tool !== 7) fitBad.push('a save that fits lost what was heard');
    Object.keys(answeredBefore(midPhase)).forEach(k => {
      if (JSON.stringify(f1.answers[k]) !== JSON.stringify(fits[k])) fitBad.push('a save that fits lost answers in ' + k);
    });
    /* answers to questions the lesson no longer asks are taken out, and so is
       the point for the one that was right (the score is out of today's
       questions); everything that is still asked is kept */
    const stale = fitSaved(Object.assign({}, fits, { missedQuestions: [{ id: 'Z99' }],
      vocabAns: Object.assign({ Z98: 0, Z99: 1 }, fits.vocabAns) }));
    if (stale.score !== 4 || 'Z98' in stale.answers.vocabAns || 'Z99' in stale.answers.vocabAns || stale.missed.length)
      fitBad.push('answers to questions no longer asked were kept (score ' + stale.score + ', ' + stale.missed.length + ' misses)');
    if (Object.keys(fits.vocabAns || {}).some(id => !(id in stale.answers.vocabAns)) || stale.phase !== midPhase || stale.catchUp)
      fitBad.push('taking out old answers disturbed answers that are still asked');
    /* a place the lesson no longer has: back to the first word, nothing lost */
    const moved = fitSaved(Object.assign({}, fits, { phase: 'runA' }));
    if (moved.phase !== 'vocab' || moved.catchUp || moved.score !== 5 || moved.heard.vocab !== 7)
      fitBad.push('a save at a place the lesson no longer has went to "' + moved.phase + '", not the first word');
    /* a damaged save must not stop the page */
    [null, 5, {}, { phase: 'daygate', checkAns: null, vocabAns: 7, heard: 'x', missedQuestions: 'no', score: 'two' },
     { phase: midPhase, checkAns: [1, 2], missedQuestions: [null, 3] }].forEach((bad, n) => {
      try { const f = fitSaved(bad);
            if (PHASES.indexOf(f.phase) === -1 || typeof f.score !== 'number' || isNaN(f.score) || !Array.isArray(f.missed))
              fitBad.push('damaged save ' + (n + 1) + ' came back unusable (at "' + f.phase + '", score ' + f.score + ')'); }
      catch (e) { fitBad.push('damaged save ' + (n + 1) + ' crashed: ' + e.message); }
    });
    rec('C33', 'A saved lesson is made to fit the questions the lesson asks today', fitBad.length === 0, fitBad.slice(0, 5).join(' | '));
  }

  /* C25 — THE NAME PAGE, coming back on Day 2 and Day 3. Every student passes
     through it with saved work. Until 10/10 the big button there read
     "Start over from the beginning" and cleared the work on one tap, no PIN.
     The preview never picks a name, so this does: a planted save, then the
     buttons pressed the way a student would press them.
     (The template also checked that saved PUSHES came back. No test, no
     pushes: here a saved lesson comes back with its answers, at its place.) */
  {
    const nameBad = [];
    const sel = document.getElementById('name-select'), sec = document.getElementById('start-screen');
    const begin = document.getElementById('begin-btn'), resume = document.getElementById('resume-btn');
    const small = document.getElementById('teacher-btn');          /* a small button, to measure against */
    const box = document.getElementById('resume-box'), modal = document.getElementById('pin-modal');
    const me = sel.options[2].value, other = sel.options[3].value;
    const R = el => el.getBoundingClientRect();
    const look = el => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), ink: cs.color }; };
    /* the big button is bigger than a small one and filled in, not outlined */
    const big = el => shown(el) && look(el).size > look(small).size && look(el).ink !== look(small).ink;
    const quiet = el => shown(el) && look(el).size === look(small).size && look(el).ink === look(small).ink;
    const pinUp = () => !modal.classList.contains('hidden');
    const stored = () => localStorage.getItem(KEY);
    const cancel = async () => { document.getElementById('pin-cancel').click(); await wait(30); };
    /* three saved lessons. `save`: stopped partway through Day 1, on the
       first page-set after the words. `saveStop`: stopped at the end of the
       day. `saveDone`: a finished lesson. */
    const midPhase = LEARN_KEYS[0] || 'vq', endPhase = GATE_KEYS[0] || midPhase;
    const count = o => Object.keys(o || {}).length;
    const save = JSON.stringify(Object.assign({ studentName: me, phase: midPhase, timerSeconds: 900, score: 2, heard: { vocab: 7 } },
      answeredBefore(midPhase)));
    const saveStop = JSON.stringify(Object.assign({ studentName: me, phase: endPhase, timerSeconds: 1500, score: 2, heard: { vocab: 7 } },
      answeredBefore(endPhase)));
    const saveDone = JSON.stringify(Object.assign({ studentName: me, phase: 'end', timerSeconds: 3000, score: 11,
      finishedAt: '2026-10-09T14:00:00.000Z' }, answeredBefore(endPhase)));
    const STARTS = OPENING.filter(isQPhase).concat(['vocab']);   /* the first opening check, or the first word */
    const plant = () => localStorage.setItem(KEY, save);
    /* the note about saved work is on screen, can be heard, and follows the wording rules */
    const noteOk = tag => {
      const blk = speech.readable(sec).find(b => b.el === box);
      const spk = box.querySelector(':scope > .mini-spk');
      if (!blk) { nameBad.push(tag + ': no note about the saved work'); return ''; }
      if (!spk || getComputedStyle(spk).display === 'none') nameBad.push(tag + ': the note cannot be read aloud');
      if (parseFloat(getComputedStyle(box).fontSize) < MIN_FS) nameBad.push(tag + ': the note is small');
      lintIt(blk.text, 'name page, ' + tag);
      [begin, resume].filter(shown).forEach(b => lintIt(b.textContent, 'name page, ' + tag + ' (button)'));
      /* the saved student's name is in the note; a name is not lesson text */
      seenText.push({ where: 'name page, ' + tag, text: (blk.text + ' ' + [begin, resume].filter(shown).map(b => b.textContent).join(' ')).split(me).join(' ') });
      return blk.text;
    };

    const held = holdApp();
    try {
      await jump(stopOf('start')); await wait(120);

      /* nothing saved: one tap starts the lesson, as before */
      localStorage.removeItem(KEY); await pickName(me);
      if (!big(begin) || shown(resume) || shown(box)) nameBad.push('nothing saved: "Start the lesson" is not the one big button');
      held.went = ''; begin.click(); await wait(40);
      /* the lesson starts at the first opening check when the opening pages were not walked, else at the first word */
      if (pinUp() || STARTS.indexOf(held.went) === -1) nameBad.push('nothing saved: one tap did not start the lesson');
      await cancel();

      /* this student's own saved work */
      plant(); await pickName(me);
      if (!big(resume)) nameBad.push('saved work: "Pick up where I left off" is not the big button');
      if (shown(begin) && !quiet(begin)) nameBad.push('saved work: starting over is not a small button ("' + begin.textContent.trim() + '")');
      if (shown(begin) && shown(resume) && (R(begin).top < R(resume).top - 1 ||
          (Math.abs(R(begin).top - R(resume).top) <= 1 && R(begin).left < R(resume).left)))
        nameBad.push('saved work: starting over comes before "Pick up where I left off"');
      noteOk('saved work');
      held.went = ''; begin.click(); await wait(40);
      if (!pinUp()) nameBad.push('saved work: starting over did not ask for the teacher PIN');
      if (stored() !== save || held.went) nameBad.push('saved work: one tap on starting over cleared the saved work');
      document.getElementById('pin-input').value = TEACHER_PIN + '0'; document.getElementById('pin-ok').click(); await wait(40);
      if (stored() !== save || held.went) nameBad.push('saved work: a wrong PIN cleared the saved work');
      await cancel();
      if (pinUp() || stored() !== save || held.went) nameBad.push('saved work: Cancel did not leave the saved work alone');

      /* the saved work is under another name: a wrong pick, or a shared computer */
      plant(); await pickName(other);
      if (shown(resume)) nameBad.push('work under another name: the work can be picked up under the wrong name');
      if (big(begin)) nameBad.push('work under another name: a big button starts a new lesson over the saved work');
      noteOk('work under another name');
      if (!shown(box) || box.textContent.indexOf(me) === -1) nameBad.push('work under another name: the page does not say whose work is saved');
      held.went = ''; begin.click(); await wait(40);
      if (!pinUp() || stored() !== save || held.went) nameBad.push('work under another name: one tap cleared the saved work');
      await cancel();

      /* a FINISHED lesson is kept the same way. The end screen asks for the
         PIN before it starts over; the name page let the same student, or
         the next student on that computer, do it with one tap on "Start the
         lesson". Marcos 10/10: "PIN it". (This lesson cannot be finished
         yet; the name page already has to treat a finished save this way
         for the day it can.) */
      for (const [tag, who] of [['finished lesson', me], ['finished lesson under another name', other]]) {
        localStorage.setItem(KEY, saveDone); await pickName(''); await pickName(who);
        if (shown(resume)) nameBad.push(tag + ': a finished lesson is offered to pick up');
        if (big(begin)) nameBad.push(tag + ': a big button starts a new lesson over the finished one');
        noteOk(tag);
        if (who !== me && (!shown(box) || box.textContent.indexOf(me) === -1)) nameBad.push(tag + ': the page does not say whose work is saved');
        held.went = ''; begin.click(); await wait(40);
        if (!pinUp() || stored() !== saveDone || held.went) nameBad.push(tag + ': one tap cleared the finished lesson');
        await cancel();
      }

      /* with the PIN, Mr. O can still clear the saved work and start the lesson */
      for (const [tag, sv] of [['saved work', save], ['a finished lesson', saveDone]]) {
        localStorage.setItem(KEY, sv); await pickName(''); await pickName(me);
        held.went = ''; begin.click(); await wait(40);
        document.getElementById('pin-input').value = TEACHER_PIN; document.getElementById('pin-ok').click(); await wait(40);
        if (pinUp() || stored() !== null || STARTS.indexOf(held.went) === -1) nameBad.push('the teacher PIN did not clear ' + tag + ' and start the lesson');
        await cancel();
      }

      /* and the big button picks a saved lesson up where the student stopped,
         with every answer and the score */
      for (const [what, sv, phase] of [['a lesson stopped partway through the day', save, midPhase],
                                       ['a lesson stopped at the end of the day', saveStop, endPhase]]) {
        const was = JSON.parse(sv);
        localStorage.setItem(KEY, sv); await pickName(''); await pickName(me);
        held.went = ''; resume.click(); await wait(40);
        if (held.went !== phase || app.studentName !== me || app.score !== 2 || app.timerSeconds !== was.timerSeconds ||
            count(app.checkAns) !== count(was.checkAns) || count(app.vocabAns) !== count(was.vocabAns) || app.heard.vocab !== 7)
          nameBad.push('"Pick up where I left off" did not bring back ' + what + ' (went to "' + held.went + '" with ' +
            count(app.checkAns) + ' check answers and ' + count(app.vocabAns) + ' word answers, not "' + phase + '" with ' +
            count(was.checkAns) + ' and ' + count(was.vocabAns) + ')');
        if (stored() !== sv) nameBad.push('"Pick up where I left off" changed ' + what + ' before the student did anything');
      }
    } catch (e) { nameBad.push('the check itself broke: ' + e.message); }
    await cancel();
    held.release();
    await pickName(''); await jump(0); await wait(150);
    rec('C25', 'On the name page, saved work is never cleared by one tap', nameBad.length === 0,
        nameBad.length + ' problems. ' + nameBad.slice(0, 6).join(' | '));
  }

  /* C27 — FREQUENT UNDERSTANDING CHECKS. Marcos 10/11, asking for questions
     before the End of Day 1 page and after Meet your cart: "I want the
     pattern for all Science lessons to have frequent understanding checks."
     A check is two or three questions asked RIGHT AFTER the thing the
     questions are about. This holds the pattern, so a later day built as
     data cannot quietly drop a check or pile the questions up at the end. */
  const where = {};       /* question id -> the screen that asks it */
  {
    const chk = [];
    const next = a => PHASES[PHASES.indexOf(a) + 1];
    /* every check sits right after the page CHECKS says it is about */
    Object.keys(window.CHECKS).forEach(p => {
      const page = window.CHECKS[p].after;
      if (!page) chk.push('"' + p + '" does not say which page it comes after');
      else if (PHASES.indexOf(page) === -1) {
        /* a check for a page-set of a day that is not built yet waits with that day */
        const waits = window.LEARN[page] && (window.LEARN[page].day || 1) > BUILT_DAYS;
        if (!waits) chk.push('"' + p + '" comes after "' + page + '", which is not a page of the lesson');
      }
      else if (next(page) !== p) chk.push('"' + page + '" is followed by "' + next(page) + '", not its check "' + p + '"');
    });
    /* every teaching block has one: the three opening pages Marcos named,
       the words, and every page-set in LEARN */
    ['summary', 'tool', 'plan'].concat(LEARN_KEYS.filter(k => PHASES.indexOf(k) !== -1)).forEach(page => {
      if (!Object.keys(window.CHECKS).some(p => window.CHECKS[p].after === page)) chk.push('no check comes after "' + page + '"');
      else if (!isQPhase(next(page))) chk.push('"' + page + '" is followed by "' + next(page) + '", not by questions');
    });
    if (next('vocab') !== 'vq') chk.push('the words are followed by "' + next('vocab') + '", not the word check');
    /* each check: two or three questions */
    Object.keys(Q_PHASE).filter(p => p !== 'exit').forEach(p => {
      const n = bankFor(p).length;
      if (n < 2 || n > 3) chk.push(p + ' has ' + n + ' question' + (n === 1 ? '' : 's') + ', not 2 or 3');
    });
    /* every scored question is asked on exactly one screen, with feedback and a skill */
    Object.keys(Q_PHASE).forEach(p => {
      if (PHASES.indexOf(p) === -1) chk.push('"' + p + '" is not a screen of the lesson');
      bankFor(p).forEach(x => {
        if (where[x.id]) chk.push(x.id + ' is asked on "' + where[x.id] + '" and again on "' + p + '"');
        where[x.id] = p;
        if (!whyRight(x)) chk.push(x.id + ' has no feedback');
        if (!(window.SKILLS || {})[x.id]) chk.push(x.id + ' has no skill');
        if (!Array.isArray(x.opts) || x.opts.length !== 4 || !(x.a >= 0 && x.a < 4)) chk.push(x.id + ' does not have four choices and one right answer');
      });
    });
    /* a list of questions that no check names is a list nobody is asked
       (a list named by the check of a day not built yet waits with that day) */
    const named = Object.keys(window.CHECKS).map(p => window.CHECKS[p].bank).concat(['VOCAB_Q', 'EXIT_Q']);
    BANKS.filter(b => named.indexOf(b) === -1).forEach(b => chk.push('the questions in ' + b + ' are never asked: no check names that list'));
    Object.keys(window.CHECKS).filter(p => PHASES.indexOf(p) !== -1).forEach(p => {
      (window[window.CHECKS[p].bank] || []).forEach(x => { if (where[x.id] !== p) chk.push(x.id + ' is never asked'); });
      if (!(window[window.CHECKS[p].bank] || []).length) chk.push('the check "' + p + '" has no questions (no list called ' + window.CHECKS[p].bank + ')');
    });
    if (app.totalItems() !== Object.keys(where).length)
      chk.push('the score is out of ' + app.totalItems() + ' but ' + Object.keys(where).length + ' questions are asked');
    /* THE ANSWER KEY THE TEACHER DASHBOARD READS (data/form_e.js, not loaded
       by the lesson) holds EXACTLY the questions asked, word for word. The
       dashboard counts every id in its table as asked and shows the choices
       from this file; a key that has drifted from the lesson shows Mr. O a
       question his students never saw. The file is made from the lesson's
       own files (tools/make-form-e.js); run that again after any change to
       a question. Read the way the dashboard reads it. */
    try {
      const src = await (await fetch('data/form_e.js?qa=' + Date.now())).text();
      const boxed = {}; new Function('window', src)(boxed);
      const key = boxed.FORM_E;
      if (!Array.isArray(key)) chk.push('data/form_e.js does not set window.FORM_E');
      else {
        const lost = Object.keys(where).filter(id => !key.some(k => k.id === id));
        const extra = key.filter(k => !where[k.id]).map(k => k.id);
        if (lost.length) chk.push('not in the dashboard answer key (form_e.js): ' + lost.join(' '));
        if (extra.length) chk.push('in the dashboard answer key but never asked: ' + extra.join(' '));
        const same = (a, b) => plain(a) === plain(b);
        key.forEach(k => {
          const x = allQuestions.find(q => q.id === k.id); if (!x) return;
          if (!same(k.q, x.q) || !Array.isArray(k.choices) || k.choices.length !== x.opts.length || k.choices.some((c, n) => !same(c, x.opts[n])) ||
              !same(k.answer, x.opts[x.a]) || !same(k.explanation, x.why))
            chk.push(k.id + ' in the dashboard answer key is not the question the lesson asks (run tools/make-form-e.js)');
        });
      }
    } catch (e) { chk.push('could not read data/form_e.js: ' + e.message); }
    /* the opening checks were really answered on the way in, and led on */
    OPENING.filter(isQPhase).forEach(p => {
      const cw = checkWalk.find(c => c.phase === p), want = OPENING[OPENING.indexOf(p) + 1];
      if (!cw) chk.push('the opening pages never reached the check "' + p + '"');
      else if (cw.answered !== cw.asked || cw.then !== want)
        chk.push('the check "' + p + '": ' + cw.answered + ' of ' + cw.asked + ' answered, then went to "' + cw.then + '", not "' + want + '"');
    });

    /* STARTING THE LESSON keeps the opening checks: the answers were given
       before the name was picked. And a student who starts without having
       had the opening checks is asked them first. */
    {
      const held = holdApp();
      try {
        const sel = document.getElementById('name-select'), begin = document.getElementById('begin-btn');
        const openQ = OPENING.filter(isQPhase).reduce((all, p) => all.concat(bankFor(p)), []);
        const ids = openQ.map(x => x.id);
        await jump(stopOf('start')); await wait(100);
        localStorage.removeItem(KEY);
        await pickName(sel.options[2].value);
        /* every opening question answered, the second one wrong */
        app.checkAns = Object.fromEntries(openQ.map((x, k) => [x.id, k === 1 ? (x.a + 1) % 4 : x.a]));
        app.missedQuestions = [{ id: ids[1], q: 'x', yourAnswer: 'x', correct: 'x', skill: 'x' }, { id: 'Z99', q: 'someone else' }];
        app.events = openQ.map((x, k) => ({ e: 'answer', id: x.id, ok: k !== 1 })).concat([{ e: 'cover_go' }]);
        app.score = 99;
        held.went = ''; begin.click(); await wait(40);
        if (held.went !== 'vocab') chk.push('with the opening checks answered, the lesson started at "' + held.went + '", not the first word');
        if (Object.keys(app.checkAns).length !== ids.length || app.score !== ids.length - 1 || app.missedQuestions.length !== 1 || app.missedQuestions[0].id !== ids[1])
          chk.push('starting the lesson did not keep the opening checks as answered (score ' + app.score + ', ' + app.missedQuestions.length + ' misses)');
        if (app.events.filter(e => e.e === 'answer').length !== ids.length || app.events.some(e => e.e === 'cover_go'))
          chk.push('starting the lesson did not keep exactly the opening check answers in the record');
        /* only the first check answered: the lesson starts at the next one */
        const firstOpen = OPENING.filter(isQPhase);
        app.checkAns = Object.fromEntries(bankFor(firstOpen[0]).map(x => [x.id, 0])); app.missedQuestions = []; app.events = []; app.score = 0;
        held.went = ''; begin.click(); await wait(40);
        if (firstOpen[1] && held.went !== firstOpen[1]) chk.push('a student with only the first check answered started at "' + held.went + '", not "' + firstOpen[1] + '"');
        /* no opening check yet: the first one is asked first */
        app.checkAns = {}; app.missedQuestions = []; app.events = []; app.score = 0;
        held.went = ''; begin.click(); await wait(40);
        if (held.went !== firstOpen[0]) chk.push('a student who never had the opening checks started at "' + held.went + '", not "' + firstOpen[0] + '"');

        /* A LESSON SAVED BEFORE A CHECK EXISTED. At the end of the day, every
           word answered, but none of the checks in the save. */
        const stop = GATE_KEYS.find(g => PHASES.indexOf(g) !== -1);
        const sv = Object.assign(answeredBefore(stop), { studentName: 'x', phase: stop, score: 2 });
        const mine = Object.assign({}, sv, { checkAns: {} });
        const fit = fitSaved(mine);
        /* every check before the stop whose answers are missing, in order, then back */
        const owed = PHASES.slice(0, PHASES.indexOf(stop)).filter(p => isQPhase(p) && Q_PHASE[p].ans === 'checkAns');
        if (owed.length < 2) chk.push('the lesson has fewer than two checks before its first stop');
        if (fit.phase !== owed[0] || fit.resumeAt !== stop)
          chk.push('a lesson saved before the checks existed went to "' + fit.phase + '" (back to "' + fit.resumeAt + '"), not "' + owed[0] + '" and then the stop');
        if (fitSaved(sv).catchUp || fitSaved(sv).phase !== stop) chk.push('a lesson with every check answered was sent back to "' + fitSaved(sv).phase + '"');
        /* ...and walking it: each check in turn, then back */
        app.restore(JSON.parse(JSON.stringify(mine)));      /* a copy: restore() keeps the objects handed to it */
        const walked = [app.phase];
        for (let hop = 0; hop < 12 && app.resumeAt; hop++) {
          bankFor(app.phase).forEach(x => { answersFor(app.phase)[x.id] = 0; });
          held.went = ''; app.next(); app.phase = held.went; walked.push(held.went);
        }
        if (walked.join(' > ') !== owed.concat([stop]).join(' > ') || app.resumeAt)
          chk.push('catching up walked ' + walked.join(' > ') + ', not ' + owed.concat([stop]).join(' > '));
        /* stopped halfway through catching up (the opening checks done, the
           later ones not): picked up again, the real place is not lost */
        const later = owed.find(p => OPENING.indexOf(p) === -1);
        if (later) {
          const half = fitSaved(Object.assign({}, mine, { phase: owed[0], resumeAt: stop, checkAns: answeredBefore('goals').checkAns }));
          if (half.phase !== later || half.resumeAt !== stop) chk.push('a lesson saved halfway through catching up went to "' + half.phase + '" (back to "' + half.resumeAt + '")');
        }
      } catch (e) { chk.push('the check itself broke: ' + e.message); }
      held.release();
      await pickName('');
      await jump(0); await wait(150);
    }

    /* How long a student listens between two questions. Not a pass or fail
       yet (no number has been agreed) — reported, so the longest stretch is
       known. Counted in lesson order from the locked steps measured above. */
    const heardOn = {}, recaps = listen.filter(l => /recap/.test(l.screen)).map(l => l.words);
    listen.forEach(l => { if (!/recap/.test(l.screen)) heardOn[l.screen] = l.words; });
    let run = 0, from = '', worst = { words: 0, from: '', to: '' };
    PHASES.forEach(p => {
      if (isQPhase(p)) { if (run > worst.words) worst = { words: run, from, to: p }; run = 0; from = ''; return; }
      const w = (heardOn[p] || 0) + (isGate(p) && !isLastStop(p) ? (recaps.shift() || 0) : 0);
      if (w && !from) from = p;
      run += w;
    });
    window.__qaStretch = worst;
    rec('C27', 'Understanding checks after every block, 2 or 3 questions each (' + Object.keys(window.CHECKS).length + ' checks + the word check, ' +
        Object.keys(where).length + ' scored questions)', chk.length === 0,
        chk.slice(0, 6).join(' | '));
  }

  /* C29 — THE WORD SECTION SPENDS ITS TIME ON THE NEW WORDS. Marcos 10/11, on
     a full page for "force" two pages after force was taught and checked:
     "reference force and friction but focus more on the other vocab words
     that have not been talked about. Also quiz the other words not force and
     friction again." A word is `met` in data/lesson.js when the student has
     already been taught the word: on an earlier page of this lesson, or in
     an earlier lesson (`from`). Either way the reminder has to SAY what the
     word means again, in one sentence, with the word marked <dfn>. */
  {
    const wb = [];
    const metW = LESSON.vocab.filter(v => v.met), newW = LESSON.vocab.filter(v => !v.met);
    const fv = flow.findIndex(f => f.phase === 'vocab');
    if (fv === -1) wb.push('the word section is not in the preview');
    const before = fv === -1 ? [] : flow.slice(0, fv);
    const taughtBefore = w => before.some(f => f.taught.indexOf(w) !== -1);
    metW.forEach(v => {
      /* a reminder only: an earlier page of this lesson really explains the
         word, or the word is marked as taught in an earlier lesson */
      if (!v.from && !taughtBefore(v.word)) wb.push('"' + v.word + '" is only a reminder here, but no earlier page explains "' + v.word + '" and the word is not marked as taught in an earlier lesson');
      if (!v.short) wb.push('"' + v.word + '" has no reminder sentence');
      else if (!new RegExp('<dfn>\\s*' + v.word + '\\s*</dfn>', 'i').test(v.short)) wb.push('the reminder for "' + v.word + '" does not mark the word (<dfn>)');
    });
    /* ...and a word an earlier page explains is not given a whole page again */
    newW.forEach(v => { if (taughtBefore(v.word)) wb.push('"' + v.word + '" gets a full page although an earlier page already explains "' + v.word + '"');
                        if (v.from) wb.push('"' + v.word + '" is marked as taught in ' + v.from + ' and still gets a full page');
                        if (!v.ex) wb.push('"' + v.word + '" is new and has no example'); });
    /* the reminder is one short sentence a word */
    const remWords = wordsIn(metW.map(v => plain(v.short)).join(' '));
    if (metW.length && remWords > 20 * metW.length) wb.push('the reminder is ' + remWords + ' words for ' + metW.length + ' words (20 a word at most)');
    /* pages: one reminder page, then one page for each new word */
    const pages = stops.filter(s => s.phase === 'vocab').length, wantPages = (metW.length ? 1 : 0) + newW.length;
    if (pages !== wantPages) wb.push('the word section has ' + pages + ' pages, not ' + wantPages);
    /* the reminder page really shows every reminder, and each new word's page shows the word */
    if (fv !== -1) {
      metW.forEach(v => { if (flow[fv].taught.indexOf(v.word) === -1) wb.push('the reminder page does not explain "' + v.word + '"'); });
      newW.forEach((v, n) => { const f = flow[fv + (metW.length ? 1 : 0) + n];
        if (!f || f.phase !== 'vocab' || f.taught.indexOf(v.word) === -1) wb.push('"' + v.word + '" has no page of its own'); });
    }
    /* the word check asks every new word, and no word that was already checked */
    const vq = bankFor('vq');
    vq.forEach(x => { const v = LESSON.vocab.find(w => w.word === x.word);
      if (!v) wb.push(x.id + ' does not say which word it checks');
      else if (v.met) wb.push(x.id + ' asks about "' + x.word + '" again'); });
    newW.forEach(v => { if (!vq.some(x => x.word === v.word)) wb.push('no question in the word check asks about "' + v.word + '"'); });
    rec('C29', 'The word section: a reminder for words already taught, a page for each new word, and the check asks the new words',
        wb.length === 0, wb.slice(0, 6).join(' | '));
  }

  /* C28 — DAY 1 PREVIEWS THE LATER DAYS, IT DOES NOT WALK THROUGH THEM.
     Marcos 10/11, with Day 1 running long: "we dont need to describe day 2
     and 3 on day 1", then "preview yes, go through whole plan no." The plan
     page had a tile for each of the four tests and the explanation, and the
     End of Day 1 page spent 118 words on the two tests of Day 2. A preview
     is a sentence or two; the word limits below are what "short" means here. */
  {
    const pv = [], P = window.INTRO_PLAN || {};
    if ((P.days || []).length !== 1) pv.push('the plan page lays out ' + (P.days || []).length + ' days, not today only');
    else if (!/Day 1\b/.test(plain(P.days[0].label))) pv.push('the day on the plan page is "' + plain(P.days[0].label) + '", not Day 1');
    /* the first page of the plan: today's parts, and ONE more step for the later days */
    const holder = document.createElement('div'); holder.innerHTML = planHTML();
    const first = holder.querySelector('[data-gpage]');
    const todaySteps = (P.days && P.days[0] ? P.days[0].tests || [] : []).length;
    const stepsOnFirst = first ? first.querySelectorAll('[data-step]').length : 0;
    if (stepsOnFirst !== todaySteps + 1) pv.push('the first page of the plan has ' + stepsOnFirst + ' steps: today has ' + todaySteps + ', and the later days get one');
    const laterWords = wordsIn(plain((P.later || {}).text));
    if (!laterWords) pv.push('the plan page has no preview of the later days');
    if (laterWords > 45) pv.push('the preview on the plan page is ' + laterWords + ' words (45 at most)');
    /* every stop at the end of a day: one short step about next time */
    GATE_KEYS.filter(g => PHASES.indexOf(g) !== -1).forEach(k => {
      const g = window.DAY_GATES[k], name = 'the End of Day ' + g.day + ' page';
      const nextSteps = (g.next || []).length, nextWords = wordsIn(plain((g.next || []).join(' ')));
      if (!nextSteps) pv.push(name + ' has no preview of next time');
      if (nextSteps > 1 || nextWords > 30) pv.push(name + ' spends ' + nextSteps + ' steps and ' + nextWords + ' words on next time (1 step and 30 words at most)');
      const at = stopOf(k);
      if (at === -1) pv.push(name + ' is not in the preview');
    });
    rec('C28', 'Day 1 previews the later days and does not walk through their plan', pv.length === 0, pv.join(' | '));
  }

  /* C31 — THE STOP AT THE END OF THE LAST BUILT DAY HAS NO WAY ON.
     10/12: the lesson is built a day at a time. Day 1 is built; Day 2 is
     not. The template's stop asked "What did Mr. O say?" and had a button
     into the next day. With no next day built, that button would lead
     nowhere a student should be. So the stop at the end of what is built:
       - shows what the student did today, and one short thing about next time
       - says the work is saved and to close the computer, in a step that
         has to be heard
       - has NO button that leads on, and no "What did Mr. O say?"
       - is where a student who comes back and presses "Pick up where I left
         off" lands, and it has no way on then either. */
  {
    const last = PHASES[PHASES.length - 1];
    if (last === 'end') {
      park('C31', 'The stop at the end of the last built day has no way on',
           'Every day is built: the lesson ends at the end screen, not at a stop');
    } else {
      const stopBad = [];
      const root = document.getElementById('daygate-screen');
      const G = (window.DAY_GATES || {})[last] || {};
      /* anything a student could press to leave: every button and link on the
         page that is not a Listen button, a speaker, or the stop's own Back
         and Next between its three pages (the last page has no Next) */
      const waysOn = () => [...root.querySelectorAll('button, a, [role="button"], [data-gafter]')].filter(shown)
        .filter(b => !b.matches('.gbtn, .gback, .gnext, .mini-spk')).map(b => '"' + (b.textContent || b.tagName).trim().slice(0, 28) + '"');
      const lookAtStop = who => {
        const pagesOn = [...root.querySelectorAll('[data-gpage]')].filter(shown);
        const page = pagesOn[pagesOn.length - 1];
        const text = plain(page ? page.textContent : '');
        if (pagesOn.length !== 1 || !page || page !== [...root.querySelectorAll('[data-gpage]')].pop()) { stopBad.push(who + ': not on the last page of the stop'); return; }
        const w = waysOn().concat([...root.querySelectorAll('.gnext')].filter(shown).map(b => '"' + b.textContent.trim() + '"'));
        if (w.length) stopBad.push(who + ': a way on from the stop: ' + w.join(', '));
        ['dg-next', 'dg-stop', 'dg-go'].forEach(id => { if (document.getElementById(id)) stopBad.push(who + ': the page has a #' + id + ' button'); });
        if (/What did Mr\. O say/i.test(root.textContent)) stopBad.push(who + ': the page asks "What did Mr. O say?"');
        if (shown(document.getElementById('dg-recap')) || shown(document.getElementById('dg-stopped'))) stopBad.push(who + ': a part of the next day is showing');
        if (!/\bsaved\b/i.test(text)) stopBad.push(who + ': the stop does not say the work is saved');
        if (!/close the computer/i.test(text)) stopBad.push(who + ': the stop does not say to close the computer');
        const loose = speech.readable(page).filter(b => shown(b.el) && !b.el.closest('.gstep') && !b.el.classList.contains('glead'));
        if (loose.length) stopBad.push(who + ': text on the stop that does not have to be heard: "' + loose[0].text.slice(0, 30) + '"');
      };

      if (!isGate(last)) stopBad.push('the lesson ends at "' + last + '", which is not a stop at the end of a day');
      else {
        if ((G.day || 1) !== BUILT_DAYS) stopBad.push('the last stop is the end of Day ' + G.day + ', but ' + BUILT_DAYS + ' day' + (BUILT_DAYS === 1 ? ' is' : 's are') + ' built');
        if (!plain(G.did)) stopBad.push('the stop does not say what the student did today (DAY_GATES.' + last + '.did)');

        /* 1 · a student who arrives at the stop, through the lock */
        speech.sayParts = standIn; guide.testGate = true; guide.instant = true; guide.testHeard = {};
        await jump(stopOf(last)); await wait(80);
        if (plain(G.did) && plain(root.textContent).indexOf(plain(G.did)) === -1) stopBad.push('the stop does not show what the student did today');
        let guard = 0;
        while (guard++ < 40) {
          const live = [...root.querySelectorAll('.gstep.g-live')].find(shown);
          if (live) { if (waysOn().length) stopBad.push('arriving: a way on shows before the stop was heard: ' + waysOn().join(', '));
                      await press(live.querySelector('.gbtn')); continue; }
          const nx = [...root.querySelectorAll('.gnext')].find(shown);
          if (nx) { nx.click(); await wait(60); continue; }
          break;
        }
        if ([...root.querySelectorAll('.gstep')].some(e => !e.classList.contains('g-done'))) stopBad.push('arriving: the stop could not be heard to the end');
        lookAtStop('arriving');
        seenText.push({ where: 'the stop, heard to the end', text: allText(root) });

        /* ...and nothing in the engine leads past the stop */
        const held = holdApp();
        try {
          app.phase = last; held.went = ''; app.next();
          if (held.went && held.went !== last) stopBad.push('arriving: going on from the stop leads to "' + held.went + '"');

          /* 2 · a student who comes back. The save says the stop was heard. */
          const sel = document.getElementById('name-select'), me = sel.options[2].value;
          const heard = {}; heard[last] = 99; heard.vocab = 7;
          const sv = JSON.stringify(Object.assign({ studentName: me, phase: last, timerSeconds: 1500, score: 9, heard }, answeredBefore(last)));
          const fit = fitSaved(JSON.parse(sv));
          if (fit.phase !== last || fit.catchUp || fit.resumeAt) stopBad.push('coming back: a lesson saved at the stop is sent to "' + fit.phase + '"');
          localStorage.setItem(KEY, sv);
          await jump(stopOf('start')); await wait(80); await pickName(''); await pickName(me);
          const resume = document.getElementById('resume-btn');
          if (!shown(resume)) stopBad.push('coming back: no "Pick up where I left off" for a lesson saved at the stop');
          else {
            held.went = ''; resume.click(); await wait(40);
            if (held.went !== last) stopBad.push('coming back: "Pick up where I left off" leads to "' + held.went + '", not the stop');
            /* show the stop as that student sees it: everything already heard */
            guide.testHeard = {}; guide.testHeard[last] = (app.heard || {})[last] || 0;
            held.realGo(last); await wait(120);
            if (app.phase !== last || visible().length !== 1 || visible()[0] !== root) stopBad.push('coming back: the stop is not the screen showing');
            if ([...root.querySelectorAll('.gstep')].some(e => !e.classList.contains('g-done'))) stopBad.push('coming back: the stop has to be heard again');
            lookAtStop('coming back');
          }
        } catch (e) { stopBad.push('the check itself broke: ' + e.message); }
        held.release();
        speech.sayParts = realSay; guide.testGate = false; guide.instant = false; guide.testHeard = {};
        await pickName(''); await jump(0); await wait(150);
      }
      rec('C31', 'The stop at the end of the last built day (Day ' + BUILT_DAYS + ') has no way on, and says the work is saved',
          stopBad.length === 0, [...new Set(stopBad)].slice(0, 6).join(' | '));
    }
  }

  /* C32 — NO LEFTOVER LESSON 1.1 WORDS. This site began as a copy of Lesson
     1.1: a cart pushed on a track, four tests, a data table. The engine alone
     named "push" 129 times and "cart" 63. A leftover does not break anything
     and no other rule looks for one; a student just reads "Push the cart" in
     a lesson with no cart.

     Looked at: every sentence the lesson keeps as data; every screen of the
     preview (hidden pages too); the static page; the help steps for every
     screen; what the name page and the question screen write; and every
     string the engine files hold (comments are left out), because a label
     the engine writes only now and then is the one a walk misses.

     ALLOWED (given with the rule, 10/12): Mr. O pushed or pushes the chair,
     "a push or a pull", "nothing pushes the cars". One more is allowed here
     and was reported when the rule was written: "The push is a force", the
     sentence that follows "Mr. O pushes a chair across the floor" in the
     example for the word work — the same push of the same chair.

     ALSO ALLOWED, added with Days 2 and 3 (10/12): the push of a SWING. A
     swing pushed gently and a swing pushed hard is this lesson's own example
     of "more energy goes higher", and is a question on the district's
     quarter assessment for this unit. Nothing else may be pushed. */
  {
    const LEFT_OK = [/\bpush(?:es|ed)? (?:a|the) chair\b/gi, /\ba push or a pull\b/gi, /\bnothing pushes the cars\b/gi,
                     /\bThe push is a force\b/g,
                     /\bpush(?:es|ed)? (?:a|the|one|another) swing\b/gi, /\bswing pushed\b/gi,
                     /\bhard(?:er)? push gives the swing\b/gi];
    const LEFT = { cart: /\bcarts?\b/i, push: /\bpush(?:es|ed)?\b/i, surface: /\bsurfaces?\b/i, ramp: /\bramps?\b/i,
      truck: /\btrucks?\b/i, friction: /\bfriction\b/i, 'Test 1 to 4': /\bTests? [1-4]\b/i, 'data table': /\bdata tables?\b/i,
      centimeter: /\bcentimeters?\b|\b\d+ ?cm\b/i, 'Starting and Stopping': /starting and stopping/i, 'Lesson 1.1': /\bLesson 1\.1\b/i };
    const left = {};
    const lintLeft = (text, where) => {
      let t = plain(text);
      LEFT_OK.forEach(rx => { t = t.replace(rx, ' '); });
      Object.keys(LEFT).forEach(w => { const m = new RegExp('(?:\\S+\\s+){0,3}(?:' + LEFT[w].source + ')(?:\\s+\\S+){0,3}', 'i').exec(t);
        if (m) left[w + ': "' + m[0].trim().slice(0, 50) + '"'] = where; });
    };
    /* 1 · the lesson's own sentences */
    walkText((t, name) => lintLeft(t, 'lesson text: ' + name));
    /* 2 · every screen that was shown, and what the walks above wrote */
    seenText.forEach(x => lintLeft(x.text, x.where));
    /* 3 · the static page, hidden screens and all (not the scripts, not this report, not the teacher's bar) */
    [...document.body.children].filter(el => !el.matches('script, style, #qa-report, #tpbar'))
      .forEach(el => lintLeft(allText(el), 'the page' + (el.id ? ' (#' + el.id + ')' : '')));
    lintLeft(document.title, 'the page title');
    /* 4 · the help steps for every screen */
    PHASES.forEach(p => (doStepsFor(p) || []).forEach(t => lintLeft(t, 'help steps on "' + p + '"')));
    /* 5 · every string in the engine. A small reader that knows a comment
       from a string from a pattern; what comes back is the text between
       quotes, which is where a label lives. */
    const strings = src => {
      const out = []; let i = 0; const n = src.length;
      const regexHere = at => /(?:^|[(,=:\[!&|?{};>+\-*%~^])\s*$|\b(?:return|typeof|case)\s*$/.test(src.slice(Math.max(0, at - 14), at));
      while (i < n) {
        const c = src[i], d = src[i + 1];
        if (c === '/' && d === '/') { i = src.indexOf('\n', i); if (i === -1) break; continue; }
        if (c === '/' && d === '*') { i = src.indexOf('*/', i + 2); if (i === -1) break; i += 2; continue; }
        if (c === '"' || c === "'" || c === '`') {
          let j = i + 1, t = '';
          while (j < n && src[j] !== c) { if (src[j] === '\\') { t += src[j + 1]; j += 2; } else { t += src[j]; j++; } }
          out.push(t); i = j + 1; continue;
        }
        if (c === '/' && regexHere(i)) {
          let j = i + 1, cls = false;
          while (j < n && (cls || src[j] !== '/') && src[j] !== '\n') { if (src[j] === '\\') j++; else if (src[j] === '[') cls = true; else if (src[j] === ']') cls = false; j++; }
          i = j + 1; continue;
        }
        i++;
      }
      return out;
    };
    let read = 0;
    for (const file of ['script.js', 'guide.js', 'preview.js']) {
      try {
        const lits = strings(await (await fetch(file + '?qa=' + Date.now())).text());
        read += lits.length;
        lits.forEach(t => lintLeft(t, 'a string in ' + file));
      } catch (e) { left['could not read ' + file + ': ' + e.message] = file; }
    }
    if (read < 200) left['the engine files gave only ' + read + ' strings to look at'] = 'the string reader';
    const leftList = Object.keys(left);
    rec('C32', 'No leftover Lesson 1.1 words (cart, push, surface, ramp, truck, friction, Test 1 to 4, data table, centimeter)',
        leftList.length === 0, leftList.length + ' found. ' + leftList.slice(0, 6).map(k => k + ' (' + left[k] + ')').join(' | '));
  }

  const vagueList = Object.keys(vague);
  rec('C17', 'Student text names the thing and does not say "it"', vagueList.length === 0,
      vagueList.length + ' found. ' + vagueList.slice(0, 6).map(k => '"' + k + '" (' + vague[k] + ')').join(' | '));
  const bareList = Object.keys(bareNumber);
  rec('C19', 'Student text says what was measured, not "your number"', bareList.length === 0,
      bareList.length + ' found. ' + bareList.slice(0, 6).map(k => '"' + k + '" (' + bareNumber[k] + ')').join(' | '));

  /* C18 — a word is explained, in a step the student has to hear, at or before
     the first place the word appears. Marcos 10/10: "was mass really
     discussed? It shows in the experiments yet it was not mentioned in the
     lead up." and, when "average" turned out the same: "we can never assume
     understanding."

     The first version of this check asked only whether a word was defined
     SOMEWHERE. "Average" passed it: a definition sat in the optional Stuck?
     panel that no student has to open. Now the lesson is walked in order.
     For every word below, the first screen that uses the word must be the
     screen, or come after the screen, where the word is marked <dfn> (the
     HTML tag for "this is where the term is defined"). The help panel does
     not count. Add each new lesson's words to this list.

     LESSON 1.2's words come first. The rest are science words carried from
     the template: this lesson does not use them, and would have to explain
     any one of them the day it did.

     ONE THING IS LEFT OUT OF "USES": the lesson's own title where it stands
     as the title (the cover, the name page). The title is "Energy and
     Motion", the cover holds the title and nothing else by Marcos's ruling
     (10/9: "The first pic should be alone on the cover"), and no page comes
     before the cover to explain a word on. Everywhere else the two words
     are held to the rule like any other. */
  const WATCH = { energy:'energy', 'roller coaster':'roller coasters?', track:'tracks?', hill:'hills?', object:'objects?',
    'stored energy':'stored energy', 'moving energy':'moving energy', 'potential energy':'potential energy',
    'kinetic energy':'kinetic energy', work:'work', gravity:'gravity', force:'forces?', speed:'speeds?',
    scientist:'scientists?', motion:'motion',
    /* Days 2 and 3 */
    heat:'heat', 'thermal energy':'thermal energy', 'chemical energy':'chemical energy',
    'conservation of energy':'conservation of energy', battery:'batter(?:y|ies)', fuel:'fuels?', engine:'engines?',
    mass:'mass', average:'averages?', trial:'trials?', prediction:'predict\\w*', 'data table':'data table',
    data:'data', surface:'surfaces?', friction:'friction', distance:'distances?', centimeter:'centimeters?|cm',
    claim:'claims?', evidence:'evidence', reasoning:'reasoning', explanation:'explanations?', ramp:'ramps?', cart:'carts?',
    test:'tests?', investigation:'investigations?', unbalanced:'unbalanced', magnetism:'magnetism' };
  const untaught = [];
  const title = String(window.LESSON.title || '');
  const usedOn = f => title ? f.used.split(title).join(' ') : f.used;
  Object.keys(WATCH).forEach(w => {
    const use = new RegExp('\\b(?:' + WATCH[w] + ')\\b', 'i');
    const isDef = t => new RegExp('^(?:' + WATCH[w] + ')$', 'i').test(t);
    const fu = flow.findIndex(f => use.test(usedOn(f)));
    if (fu === -1) return;
    const ft = flow.findIndex(f => f.taught.some(isDef));
    if (ft === -1) untaught.push(w + ' (never explained; first on "' + flow[fu].label + '")');
    else if (ft > fu) untaught.push(w + ' (used on "' + flow[fu].label + '" before it is explained on "' + flow[ft].label + '")');
  });
  rec('C18', 'Every word is explained at or before the first place a student meets it', untaught.length === 0,
      untaught.length + ' not. ' + untaught.slice(0, 8).join(' | '));

  rec('C12', 'Every question has its own feedback (' + bank.length + ' questions)',
      bank.length > 0 && !empty.length && !dupes.length, (empty.length ? 'none: ' + empty.join(' ') + '. ' : '') + (dupes.length ? 'same as another: ' + dupes.join(' ') : ''));

  rec('C8', 'No errors', errors.length === 0, errors.slice(0, 4).join(' | '));
  rec('C9', 'Nothing sent to the sheet', sends === 0, sends + ' sends');

  /* put storage back exactly as it was */
  const now = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); now[k] = localStorage.getItem(k); }
  rec('C10', 'Storage unchanged', JSON.stringify(now) === JSON.stringify(original), '');
  Object.keys(now).forEach(k => { if (!(k in original)) localStorage.removeItem(k); });
  Object.keys(original).forEach(k => localStorage.setItem(k, original[k]));

  const dense = {};
  words.forEach(w => { if (!dense[w.screen] || dense[w.screen] < w.words) dense[w.screen] = w.words; });
  window.__qaDensity = Object.entries(dense).sort((a, b) => b[1] - a[1]);
  window.__qaListen = listen;
  window.__qaQuestions = Object.keys(where).length;
  report();

  function report() {
    window.__qa = results;
    results.sort((a, b) => parseInt(a.id.slice(1), 10) - parseInt(b.id.slice(1), 10));
    const parked = results.filter(r => r.na), checked = results.filter(r => !r.na);
    const failed = checked.filter(r => !r.pass), passed = checked.filter(r => r.pass);
    /* a parked rule is not a pass and not a fail: it does not stop QA PASSED */
    const pass = failed.length === 0 && passed.length > 0;
    const line = (pass ? 'QA PASSED' : 'QA FAILED') + ' — ' + (failed.length ? failed.length + ' failed, ' : '') +
      passed.length + ' rule' + (passed.length === 1 ? '' : 's') + ' passed' +
      (parked.length ? ', ' + parked.length + ' not checked (no test in this lesson yet)' : '');
    window.__qaLine = line;
    const heardAll = (window.__qaListen || []).reduce((n, l) => n + l.words, 0);
    const box = document.createElement('div');
    box.id = 'qa-report';
    box.setAttribute('data-noread', '');
    box.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:9999;max-width:480px;max-height:70vh;' +
      'overflow:auto;background:#fff;color:#16211F;border:3px solid ' + (pass ? '#1E7D45' : '#B3261E') +
      ';border-radius:12px;padding:12px 14px;font:13px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3)';
    box.innerHTML = '<b style="font-size:15px">' + line + '</b>' +
      (window.__qaListen ? '<div style="margin-top:4px;color:#5A6E68">' + heardAll + ' words of locked listening, ' +
        (window.__qaQuestions || 0) + ' scored questions</div>' : '') +
      results.map(r => {
        const color = r.na ? '#5A6E68' : r.pass ? '#1E7D45' : '#B3261E';
        return '<div style="margin-top:6px"><b style="color:' + color + '">' +
          (r.na ? '– ' + r.id + ' not checked' : (r.pass ? '✓ ' : '✗ ') + r.id) + '</b> ' + r.label +
          (r.pass && !r.na ? '' : '<br><span style="color:#5A6E68">' + String(r.detail).replace(/</g, '&lt;') + '</span>') + '</div>';
      }).join('');
    document.body.appendChild(box);
  }
})();
