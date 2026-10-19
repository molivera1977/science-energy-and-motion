/* ═══════════════════════════════════════════════════════════════
   ENERGY AND MOTION — Grade 4 Science, Quarter 1, Lesson 1.2
   NGSS 4-PS3-1

   Built from the science lesson template (Lesson 1.1, Starting and
   Stopping, tag template-v1). The engine is the template's; what this
   lesson is lives in data/lesson.js and data/questions.js.

   Flow:  the opening pages, each teaching page followed at once by its
          check (cover · big question · why care · what we just talked
          about · meet the tool · the plan · I can · pick a name)
          → the words → word check
          → every page-set in LEARN, each followed by its check
          → the stop at the end of the day
   Which pages there are, their order, the rail and the stops are worked
   out from the data (CHECKS, LEARN, DAY_GATES, DAYS_BUILT): see PHASES.

   This lesson has NO TEST yet (no pushes, no data table). The template's
   track, distance model, helper, data table, graph and written answer were
   taken out; they are in the template (git show 5388b7a:script.js) for the
   day a test is added.

   Standards this site follows (same as the math review sites):
     · skill tags on every item, misses saved as "[ID] (Skill) q (picked: …)"
     · elapsed is TIME ON TASK — the clock pauses while the page is hidden
     · session log: start · leave · return · resume · close · finish
     · resume never re-asks a question the student already answered
═══════════════════════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────────────── */
const STORAGE_KEY  = 'sci_energymotion_session_v1';
const SCORES_KEY   = 'sci_energymotion_scores_v1';
const SESSION_ID_KEY = 'sci_energymotion_session_id_v1';
const TEACHER_PIN  = '9377';
const GAME_KEY     = 'energymotion-lesson';

const SESSION_ID = (() => {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) { id = 'EM-' + Math.random().toString(36).slice(2, 9).toUpperCase(); localStorage.setItem(SESSION_ID_KEY, id); }
  return id;
})();

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzv8CWv1yyi8NeH04now9UxVL4IZm5yMqqsEGMcgGdrcAOWVB-aSp5siTvSSJXIUpzFMA/exec';

let tabSwitchCount = 0;

/* One saved miss: "[ID] (Skill) question (picked: answer)" — the standard
   every review uses, so the teacher dashboard can rank skills. */
function missEntry(m) {
  const skill  = m.skill || (window.SKILLS || {})[m.id] || 'Unsorted';
  const picked = m.yourAnswer == null || m.yourAnswer === '' ? '' :
    ` (picked: ${String(m.yourAnswer).replace(/\s*\|\s*/g, ' / ').replace(/\s+/g, ' ').trim()})`;
  return `[${m.id}] (${skill}) ${m.q}${picked}`;
}

function stripTags(s) {
  const d = document.createElement('div'); d.innerHTML = String(s == null ? '' : s);
  return (d.textContent || '').replace(/\s+/g, ' ').trim();
}

/* ── SHEET SUBMISSION ───────────────────────────────── */
function sheetBody(done) {
  const total = app.totalItems();
  const pct   = total ? Math.round((app.score / total) * 100) : 0;
  return {
    action:    'submit',
    game:      GAME_KEY,
    sessionId: SESSION_ID + (done ? '-F' : ''),
    name:      app.studentName || 'Unknown',
    form:      LESSON.code + ' — ' + LESSON.title,
    score:     app.score,
    total:     total,
    percent:   pct,
    status:    done ? 'Complete' : 'In Progress (' + app.phaseLabel() + ')',
    done:      !!done,
    elapsed:   app.timerSeconds,
    tabSwitches: tabSwitchCount,
    wrongQuestions: (app.missedQuestions || []).map(missEntry).join(' | '),
    startedAt:  app.startedAt || '',
    finishedAt: app.finishedAt || '',
    events:     JSON.stringify(app.events || []),
    timestamp:  new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  };
}
function post(done) {
  /* Teacher preview must never write a student's save or a sheet row. */
  if (window.PREVIEW) return;
  /* No name, no row. The opening checks are answered before the name page,
     and every change of screen posts progress: without this, each student
     sent a row with nobody's name on it (qa C9 caught it before it shipped).
     The answers are not lost — they go with the student at "Start the
     lesson" and are in the first row sent after that. */
  if (!app.studentName) return;
  try {
    fetch(SHEET_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetBody(done))
    }).catch(() => {});
  } catch (e) { /* offline is fine — progress still saves on the device */ }
}
const submitPartial = () => post(false);
const submitFinal   = () => post(true);

/* ── ROSTER ─────────────────────────────────────────── */
const ROSTER = [
  { name: "Mr. O (Teacher)",           id: "9377" },
  { name: "Avery, Jo'Von",             id: "10053632" },
  { name: "Belasquez Bonilla, Eduin",  id: "10058674" },
  { name: "Castaneda, Kelvin",         id: "10053248" },
  { name: "Chicas-Santos, Allison",    id: "10066737" },
  { name: "Collado, Roniel",           id: "10060249" },
  { name: "Dejesus, Michael",          id: "10049434" },
  { name: "Dock, Fakeem",              id: "10059720" },
  { name: "Douglas, Iyana",            id: "10070980" },
  { name: "Dumphrey, Christopher",     id: "10060696" },
  { name: "Flores, Kiara",             id: "10052834" },
  { name: "Johnson, Destiny",          id: "10052926" },
  { name: "Jones, Tahji",              id: "10060315" },
  { name: "Lawrence, Eric",            id: "10057451" },
  { name: "Madero, Jovany",            id: "10076374" },
  { name: "Pettway, Lanaura",          id: "10060616" },
  { name: "Polanco Soriano, Thiara",   id: "10060503" },
  { name: "Roberts, Robyn",            id: "10060925" },
  { name: "Rodriguez-Jimenez, Marcos", id: "10048936" },
  { name: "Rojas, Alanie",             id: "10076388" },
  { name: "Sanchez Rodriguez, Johanelyz", id: "10076767" },
  { name: "Vega, Taishmara",           id: "10054043" },
  { name: "Watts, Autumn",             id: "10039032" },
  { name: "Zelaya-Osorto, Nazareth",   id: "10053626" }
];

/* ── READ ALOUD ─────────────────────────────────────────
   Speaks the text and highlights each word as it is said.
   Falls back silently when a device has no speech voices. */
/* Speech settings copied from the rounding reviews so every site sounds the
   same to the class. No voice is named on any of them — the browser default is
   used — so the rate is what makes the difference:
     0.82 for a screen that speaks itself (Marcos 10/6: "0.92 ran ahead of the
          highlight"), 0.92 for a read the student asks for by button. */
/* Slowed on this lesson, Marcos 10/9 after hearing the guided pages: "can we
   slow the rate of speech?" Every Listen button and speaker icon here now
   reads at 0.82, the pace he had already approved for screens that speak
   themselves. The other sites still read on demand at 0.92. */
const READ_RATE  = 0.82;
const INTRO_RATE = 0.82;
/* The 58 ms-a-letter figure that paces the highlight on voices with no word
   events was measured at 0.92. It is scaled from THAT, not from READ_RATE,
   or slowing the voice would leave the highlight running ahead of it. */
const PACE_BASE  = 0.92;

const speech = {
  words: [], parts: [], host: null, timer: null,

  prep(host) {
    this.host = host;
    host.querySelectorAll('.wrd').forEach(n => n.classList.remove('spk'));
    this.words = [...host.querySelectorAll('.wrd')];
  },

  say(host, onEnd, tail, rate) {
    this.stop();
    if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
    this.prep(host);
    /* When a caller supplies its own spoken text, that text IS the speech: the
       host is only there to highlight words, and reading its raw markup as well
       runs the labels together ("forceen espanol: fuerzaa push or a pull"). */
    const text = this.words.map(w => w.textContent).join(' ') || (tail ? '' : stripTags(host.innerHTML));
    if (!text && !tail) { if (onEnd) onEnd(); return; }

    const u = new SpeechSynthesisUtterance(text + (tail || ''));
    u.lang = 'en-US'; u.rate = rate || READ_RATE;

    let spoken = false;
    u.onboundary = (e) => {
      if (e.name && e.name !== 'word') return;
      spoken = true;
      const upto = text.slice(0, e.charIndex).split(/\s+/).filter(Boolean).length;
      this.mark(upto);
    };
    u.onstart = () => {
      /* Some voices never fire onboundary. Pace the highlight by hand
         if nothing has arrived after a moment. */
      const per = Math.max(170, (text.length * 58) / Math.max(1, this.words.length) * (PACE_BASE / u.rate));
      let i = 0;
      this.timer = setInterval(() => {
        if (spoken) { clearInterval(this.timer); this.timer = null; return; }
        this.mark(i++);
        if (i > this.words.length) { clearInterval(this.timer); this.timer = null; }
      }, per);
    };
    u.onend = u.onerror = () => { this.clear(); if (onEnd) onEnd(); };

    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
    catch (e) { if (onEnd) onEnd(); }
  },

  mark(i) {
    this.words.forEach((w, k) => w.classList.toggle('spk', k === i));
  },

  /* EVERYTHING ON THIS CLASS'S SCREENS MUST BE HEARABLE (Marcos, 10/8).
     So a screen's speaker reads the WHOLE screen in reading order rather than a
     list someone curated — headings, prose, cards, choices, data rows, the
     feedback after an answer, the hints beside a writing box. Anything added
     later is covered without being remembered. Mark a node [data-noread] to
     leave it out (the speaker button itself, decoration). */
  /* What a block should SAY. Anything marked [data-noread] is stripped first
     (the speaker icons themselves), and an answer choice's letter badge is
     separated from its words — without this, choice A reads as
     "AA push or a pull on an object". */
  textOf(el) {
    /* Built from the same word list that gets highlighted (tokensOf), on a
       copy, so what a block SAYS and what LIGHTS UP can never drift apart. */
    return this.joinTokens(this.tokensOf(this.split(el.cloneNode(true), [])));
  },
  /* Words go back together with a space between — except a mark that stands
     alone ("?" after a bold word, "." after a bold number), which closes up
     to the word before it: "a force?", not "a force ?". */
  gap(t, i) { return (i > 0 && !/^[.,!?;:)]+$/.test(t)) ? ' ' : ''; },
  joinTokens(tokens) { return tokens.map((t, i) => this.gap(t, i) + t).join(''); },

  /* ── WORD BY WORD ────────────────────────────────────────
     Marcos 10/9: "is it not possible to have word for word highlighting
     instead of the entire box lit up". A lit box tells a child that
     something is being read; a lit word tells them WHERE. So when a block is
     about to be spoken its text is split into one span a word, in place, and
     put back exactly as it was when the voice stops.

     Left alone: anything [data-noread] (speaker icons, Listen buttons,
     Spanish), and controls and pictures inside the block. */
  PAUSE_AFTER: 'div,p,li,h1,h2,h3,h4,td,th,.pt,.pd,.cerlbl,.ctest,.lbl,.exlbl,.ltr',
  made: [],          /* spans this object added and has to take out again */
  wrapped: [],       /* the blocks they were added to */

  /* Split root's text into word spans. Spans it creates are noted in `made`
     (pass an array to keep a throwaway copy's spans out of the live list).
     Words already in a span (question text) are used as they are. */
  split(root, made) {
    const skip = n => n.hasAttribute('data-noread') ||
      /^(button|svg|canvas|select|textarea|input|script|style)$/i.test(n.tagName);
    const spans = [];
    (function walk(node) {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          if (!/\S/.test(ch.textContent)) return;
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (!/\S/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'wrd'; w.textContent = part;
            frag.appendChild(w); spans.push(w); made.push(w);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && !skip(ch)) {
          if (ch.classList.contains('wrd')) spans.push(ch); else walk(ch);
        }
      });
    })(root);
    spans.root = root;
    return spans;
  },

  /* What each word span should SAY. A word that ends a line of the layout
     (a heading, a label, a table box, a choice's letter badge) gets a full
     stop, so the voice pauses where the page already does — without it a
     vocabulary card spoke as "surfacethe top of the thing you roll on" and a
     label ran straight into its sentence. */
  tokensOf(spans) {
    const root = spans.root;
    const lineOf = w => { const b = w.parentElement && w.parentElement.closest(this.PAUSE_AFTER);
                          return (b && b !== root && root.contains(b)) ? b : root; };
    return spans.map((w, i) => {
      let t = (w.textContent || '').trim();
      const ends = i === spans.length - 1 || lineOf(spans[i + 1]) !== lineOf(w);
      if (ends && t && !/[.!?:,;]$/.test(t)) t += '.';
      return t;
    });
  },

  /* Take the word spans back out, leaving the text exactly as it was. */
  unwrap() {
    this.made.forEach(w => {
      w.classList.remove('spk');
      if (w.parentNode) w.parentNode.replaceChild(document.createTextNode(w.textContent), w);
    });
    this.wrapped.forEach(el => { try { el.normalize(); } catch (e) {} });
    this.made = []; this.wrapped = [];
  },

  readable(root) {
    if (!root) return [];
    /* Everything a student can see, they can hear. Audited 10/9 by walking
       every phase and listing text blocks with no speaker: 19 of them,
       including the line announcing where a push landed and the graph's
       verdict on their prediction. The pair blocks (.same/.chg) are listed
       rather than their .lb/.v halves so a label is spoken with its value
       — "Push stays the same: Medium push" — instead of as two fragments. */
    const SEL = 'h1,h2,h3,h4,p,li,td,th,' +
      '.vcard,.opt,.grow,.readout,.fb,.g,.sb,.step,.box,' +
      '.runnow,.note,.eyebrow,.qcount,.lbl,.same,.chg,.plain,.say,.counter,.chips-lbl,.qdata-h,' +
      '.rcard,.rl,.rnow,.wh-def,.wh-ex,.wb-q,.ptile,.schip,.tnote';
    const out = [];
    root.querySelectorAll(SEL).forEach(el => {
      if (el.closest('[data-noread]')) return;
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return;  /* hidden */
      /* A container marked data-parts is a wrapper, not a block: its children
         are what get spoken. Directions are the case that needs this — a step
         a student did not catch has to be replayable on its own, without
         sitting through the whole list again. */
      if (el.hasAttribute('data-parts')) return;
      if (out.some(prev => prev.contains(el) && !prev.hasAttribute('data-parts'))) return;
      /* A table box holding only a dash or a ? has nothing to say. Giving it
         a speaker put an icon in every empty box of the data table. */
      if (!/[A-Za-z0-9]/.test(this.textOf(el))) return;
      out.push(el);
    });
    /* Anything else that carries visible text becomes its own block. The list
       above is a list someone has to remember to update; every block type
       added on 10/9 that it missed was silent. This makes "everything read
       aloud" the default instead of a list to maintain. Controls (buttons,
       inputs) are skipped — they are things to press, not text to read. */
    root.querySelectorAll('span,div,label,b,strong,em,small').forEach(el => {
      if (el.closest('[data-noread]')) return;
      if (el.closest('button,select,option,textarea,input')) return;
      if (el.classList.contains('wrd')) return;     /* a word of a block, not a block */
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return;
      /* its own text: loose text, or that same text while it is split into
         word spans because the block is being read right now */
      const own = [...el.childNodes].filter(t => (t.nodeType === 3 && t.textContent.trim()) ||
          (t.nodeType === 1 && t.classList.contains('wrd')))
        .map(t => t.textContent.trim()).join(' ');
      if (!/[A-Za-z]{2}/.test(own)) return;
      if (out.some(prev => prev.contains(el) || el.contains(prev))) return;
      if (!this.textOf(el)) return;
      out.push(el);
    });
    out.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
    return out.map(el => ({ el, text: this.textOf(el) }));
  },

  /* One block, on its own — what a speaker icon does. */
  sayOne(el, rate) { this.sayParts([{ el, text: this.textOf(el) }], rate); },

  sayScreen(root, rate) { this.sayParts(this.readable(root), rate); },

  /* Some screens are a layout, not a paragraph — vocabulary cards, a bar chart,
     a row of answer choices. There are no words to wrap there, so the thing that
     lights up is the PART being spoken: the card, the bar, the choice. Each part
     carries the text to say for it, and the boundary event picks the part whose
     words are being read. */
  /* onEnd(ok, why): ok is true only when the voice reached the end by
     itself. why is 'ended', 'cancelled' (someone stopped it or started
     another), 'unavailable' (this device has no speech) or 'error'. The
     guided screens (guide.js) unlock the next step on ok and on nothing
     else. onStart fires when sound actually begins. */
  sayParts(parts, rate, onEnd, onStart) {
    this.stop();
    this.parts = [];
    if (!('speechSynthesis' in window) || !parts.length) { if (onEnd) onEnd(false, 'unavailable'); return; }

    /* One entry per spoken word: the span to light, or — for a part with no
       words of its own to wrap — the part itself, lit as a box as before. */
    const list = [];
    parts.forEach(p => {
      const spans = p.el ? this.split(p.el, this.made) : [];
      if (p.el) this.wrapped.push(p.el);
      if (spans.length) {
        this.tokensOf(spans).forEach((t, i) => list.push({ t, w: spans[i] }));
      } else {
        String(p.text || '').trim().split(/\s+/).filter(Boolean).forEach(t => list.push({ t, box: p.el }));
        if (p.el) this.parts.push(p.el);
      }
    });
    const text = this.joinTokens(list.map(x => x.t));
    if (!text) { this.unwrap(); if (onEnd) onEnd(false, 'unavailable'); return; }
    const job = this.job = { cancelled: false };
    const total = list.length;

    /* where each word starts in the spoken text, so the voice's "I am at
       letter N" can be turned into "that is word K" */
    const starts = []; let at = 0;
    list.forEach((x, i) => { at += this.gap(x.t, i).length; starts.push(at); at += x.t.length; });
    const wordAt = ch => { let k = 0; while (k + 1 < total && starts[k + 1] <= ch) k++; return k; };

    let lit = null;
    const light = k => {
      const x = list[Math.max(0, Math.min(total - 1, k))];
      const el = x && (x.w || x.box);
      if (el === lit) return;
      if (lit) lit.classList.remove('spk');
      if (el) el.classList.add('spk');
      lit = el;
    };

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate || READ_RATE;

    let spoken = false;
    u.onboundary = e => {
      if (e.name && e.name !== 'word') return;
      spoken = true;
      light(wordAt(e.charIndex));
    };
    u.onstart = () => {
      if (onStart) onStart();
      /* voices that never report a boundary still get a moving highlight */
      const per = Math.max(240, (text.length * 58) / Math.max(1, total) * (PACE_BASE / u.rate));
      let i = 0;
      this.timer = setInterval(() => {
        if (spoken) { clearInterval(this.timer); this.timer = null; return; }
        light(i++);
        if (i > total) { clearInterval(this.timer); this.timer = null; }
      }, per);
    };
    /* An utterance that was cut off by the NEXT one reports in late. It must
       not tidy up — by then the words on screen belong to the new one. */
    const mine = () => this.job === job;
    u.onend = () => { if (mine()) this.clear(); if (onEnd) onEnd(!job.cancelled, job.cancelled ? 'cancelled' : 'ended'); };
    u.onerror = e => {
      if (mine()) this.clear();
      const stopped = job.cancelled || /interrupted|cancell?ed/.test((e && e.error) || '');
      if (onEnd) onEnd(false, stopped ? 'cancelled' : 'error');
    };

    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
    catch (e) { this.clear(); if (onEnd) onEnd(false, 'error'); }
  },
  clear() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this.words.forEach(w => w.classList.remove('spk'));
    (this.parts || []).forEach(el => el.classList.remove('spk'));
    this.unwrap();
  },
  stop() {
    if (this.job) this.job.cancelled = true;
    this.clear();
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
  }
};

/* Wrap every word of an HTML string in <span class="wrd"> without
   breaking the markup inside it. */
function wrapWords(htmlStr) {
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlStr;
  (function walk(node) {
    if (node.nodeType === 3) {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(p => {
        if (/\S/.test(p)) {
          const s = document.createElement('span');
          s.className = 'wrd'; s.textContent = p; frag.appendChild(s);
        } else if (p) { frag.appendChild(document.createTextNode(p)); }
      });
      node.parentNode.replaceChild(frag, node);
    } else { [...node.childNodes].forEach(walk); }
  })(tmp);
  return tmp.innerHTML;
}

/* ── SESSION EVENT LOG ──────────────────────────────────
   start · leave · return · resume · close · finish, each stamped with
   the on-task clock. elapsed is time ON TASK: the timer pauses while
   the page is hidden, so a sleeping device cannot inflate it. */
/* A speaker beside every block a student might want to hear on its own
   (Marcos, 10/8: everything has to be able to be read aloud). The icon is a
   span, not a button, because the answer choices ARE buttons and a button
   cannot sit inside one; the click is stopped so tapping the speaker never
   answers the question by accident. */
function attachSpeakers(root) {
  if (!root) return;
  const blocks = speech.readable(root).map(b => b.el);
  blocks.forEach(el => {
    if (el.querySelector(':scope > .mini-spk')) return;
    const b = document.createElement('span');
    b.className = 'mini-spk';
    b.setAttribute('role', 'button');
    b.setAttribute('tabindex', '0');
    b.setAttribute('data-noread', '');
    b.setAttribute('aria-label', 'Read this part to me');
    b.title = 'Read this part to me';
    b.textContent = '\u{1F50A}';
    const fire = e => { e.preventDefault(); e.stopPropagation(); sayJoined(el); };
    b.addEventListener('click', fire);
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fire(e); });
    /* BEFORE the text, not after. A reader who needs the button should meet it
       on the way in, not after reading to the end of the line to find it — and
       IXL puts its speakers on the left, so this is the placement the class
       already knows.

       It goes before the first thing that CARRIES TEXT, so on a vocabulary
       card it sits beside the word rather than between the picture and the
       word. Leading decoration is skipped. */
    let anchor = el.firstChild;
    while (anchor &&
           ((anchor.nodeType === 3 && !anchor.textContent.trim()) ||
            (anchor.nodeType === 1 && anchor.classList && anchor.classList.contains('art')))) {
      anchor = anchor.nextSibling;
    }
    el.insertBefore(b, anchor);
  });
  joinLabels(root, blocks);
}

/* A LABEL IS READ WITH WHAT IT LABELS — on every screen.
   Marcos 10/10, on "QUESTION 1 OF 2" with one speaker and "What is a force?"
   with another: "should be combined." (He had said the same of a label on a
   guided page the day before; guide.js handles those. This is everywhere
   else.)

   A small capitals label says nothing on its own, so it gets no speaker of
   its own. Whatever is right under it — a heading or a sentence — speaks
   for both: "Question 1 of 2. Word check. What is a force?" and
   "Test 1 results. What my data looks like."

   Nothing is listed by class. A label is any block the page styles in
   capitals; "right under" is measured on the screen. So a label added later
   joins up without anyone remembering to. Table boxes and guided steps are
   left alone. */
function sayJoined(el) {
  const leads = (el._sleads || []).filter(l => l.isConnected && l._sfor === el && l.classList.contains('slead'));
  speech.sayParts(leads.concat([el]).map(x => ({ el: x, text: speech.textOf(x) })));
}
function joinLabels(root, els) {
  root.querySelectorAll('.slead').forEach(n => { n.classList.remove('slead'); n._sfor = null; });
  els.forEach(el => { el._sleads = null; });
  const apart = el => !!el.closest('.gstep,.glead,table');
  const kind = el => (!apart(el) && getComputedStyle(el).textTransform === 'uppercase') ? 'label' : '';
  /* b is right under a (or beside it on the same line) */
  const under = (a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
                            return rb.top - ra.bottom < 56 && rb.top >= ra.top - 6; };
  let i = 0;
  while (i < els.length) {
    if (!kind(els[i])) { i++; continue; }
    let j = i;
    while (j + 1 < els.length && kind(els[j + 1]) && under(els[j], els[j + 1])) j++;
    const next = els[j + 1];
    let target = null, leads = [];
    if (next && !apart(next) && under(els[j], next)) { target = next; leads = els.slice(i, j + 1); }
    else if (j > i) { target = els[j]; leads = els.slice(i, j); }   /* nothing under them: the last label speaks for the row */
    leads.forEach(l => { l.classList.add('slead'); l._sfor = target; });
    if (target) target._sleads = leads;
    i = j + (target === next && target ? 2 : 1);
  }
}

/* ══════════════════════════════════════════════════════
   WORD HELP — the definitions, always one tap away

   Shown on every working screen after the words. The lesson words come from
   LESSON.vocab so there is one source of truth; the things the lesson talks
   about (roller coaster, hill, track…) come from THING_WORDS; the words of
   a test's method (trial, average…) come from METHOD_WORDS, which is empty
   until the lesson has a test.
══════════════════════════════════════════════════════ */
/* THE OPENING PAGES, in order: everything a student goes through before the
   lesson has their name. One list, because six places need to know it (the
   rail, the help bar, the word button, the preview, the resume button, and
   PHASES itself) and a page added to five of them is a page that half works.

   Only the PAGES are listed. A check comes right after the page it is about,
   and which page that is, is data: CHECKS[...].after in data/questions.js.
   So a check added there shows up here without this list being touched. */
const checkAfter = page => page === 'vocab'
  ? ((window.VOCAB_Q || []).length ? 'vq' : '')                         /* the word check follows the words */
  : (Object.keys(window.CHECKS || {}).find(c => window.CHECKS[c].after === page) || '');
const withCheck = page => checkAfter(page) ? [page, checkAfter(page)] : [page];
const OPENING_PAGES = ['cover', 'why', 'care', 'summary', 'tool', 'plan', 'goals', 'start'];
const OPENING = OPENING_PAGES.reduce((all, p) => all.concat(withCheck(p)), []);
const WH_HIDE_ON = OPENING.concat(['vocab', 'end']);

function buildWordHelp() {
  const row = document.getElementById('wh-words');
  const ans = document.getElementById('wh-answer');
  if (!row || row.childElementCount) return;

  const items = LESSON.vocab.map(v => ({
    label: v.word,
    html: art(WORD_ART[v.word], 'whart') +
          '<p class="wh-def"><b>' + v.word + '</b> &mdash; ' + v.def + '</p>' +
          (v.ex ? '<p class="wh-ex"><span class="exlbl" data-noread>For example</span>' + v.ex + '</p>' : '')
  })).concat(Object.keys(window.THING_WORDS || {}).map(k => ({
    label: k, cls: 'thing',
    html: art((window.THING_ART || {})[k], 'whart') +
          '<p class="wh-def"><b>' + k + '</b> &mdash; ' + THING_WORDS[k].def + '</p>' +
          '<p class="wh-ex"><span class="exlbl" data-noread>For example</span>' +
          THING_WORDS[k].ex + '</p>'
  }))).concat(Object.keys(METHOD_WORDS || {}).map(k => ({
    label: k, cls: 'word', html: '<p class="wh-def">' + METHOD_WORDS[k] + '</p>'
  })));

  items.forEach(it => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chipbtn' + (it.cls ? ' ' + it.cls : '');
    b.setAttribute('data-noread', '');
    b.textContent = it.label;
    b.onclick = () => {
      ans.innerHTML = it.html;
      ans.classList.remove('hidden');
      [...row.children].forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      attachSpeakers(ans);
      logEvent('wordhelp', { w: it.label });
    };
    row.appendChild(b);
  });

  document.querySelectorAll('.wh-tab').forEach(t => {
    t.onclick = () => {
      document.querySelectorAll('.wh-tab').forEach(x => x.classList.remove('on'));
      t.classList.add('on');
      const words = t.dataset.tab === 'words';
      document.getElementById('wh-wordpane').classList.toggle('hidden', !words);
      document.getElementById('wh-do').classList.toggle('hidden', words);
    };
  });

  const toggle = document.getElementById('wh-toggle');
  const panel = document.getElementById('wh-panel');
  toggle.onclick = () => {
    const open = panel.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', String(open));
    document.getElementById('wordhelp').classList.toggle('open', open);
  };
}

/* What to do, on the screen they are on, at the moment they forget. Marcos
   10/9: "frequent and constant reminding of what to do and how to do it."

   A lesson with no test has three kinds of working screen: a question, a
   page-set to listen to, and the stop at the end of a day. The steps for a
   page-set are the lesson's own "On every page" lines (INTRO_PLAN.every in
   data/lesson.js), so the help says what the plan page said, in the same
   words. The steps for the last stop are the stop's own lines. */
const Q_STEPS = ['Read the question. Tap the speaker to hear the question read to you.',
                 'Tap the answer you think is right.',
                 'Read what the page says about your answer. Then press the green button.'];
/* The stop at the end of the last built day: what the page says, and what
   the help panel says there. One list, so the two cannot disagree. */
const STOP_LINES = ['<b>You are done for today.</b>',
                    'Everything you did today is saved.',
                    'Close the computer now.'];
function doStepsFor(phase) {
  if (isQPhase(phase)) return Q_STEPS;
  if (isGate(phase)) return isLastStop(phase) ? STOP_LINES
    : ['Put your hand up.', 'Ask Mr. O if you should go on to the next day.'];
  if (isLearn(phase) || phase === 'vocab')
    return ((window.INTRO_PLAN || {}).every || []).map(e => '<b>' + e.t + '.</b> ' + e.d);
  return null;
}
function renderDoSteps(phase) {
  const host = document.getElementById('wh-do');
  if (!host) return;
  const steps = doStepsFor(phase);
  if (!steps || !steps.length) { host.innerHTML = '<p class="wh-def">Keep going &mdash; press the green button to move on.</p>'; }
  else {
    host.innerHTML = '<ol class="wh-steps">' +
      steps.map(t => '<li>' + t + '</li>').join('') + '</ol>';
  }
  attachSpeakers(host);
}

function syncWordHelp(phase) {
  const el = document.getElementById('wordhelp');
  if (!el) return;
  buildWordHelp();
  el.classList.toggle('hidden', WH_HIDE_ON.indexOf(phase) !== -1);
  renderDoSteps(phase);

  /* The driving question rides every working screen. */
  const wb = document.getElementById('whybar');
  if (wb) {
    const q = document.getElementById('wb-q');
    if (q && !q.innerHTML) { q.innerHTML = LESSON.driving; attachSpeakers(wb); }
    wb.classList.toggle('hidden', OPENING.concat(['end']).indexOf(phase) !== -1);
  }
}

function logEvent(kind, extra) {
  if (!app.events) app.events = [];
  app.events.push(Object.assign({
    at: new Date().toISOString(), e: kind, p: app.phase || 'start', on: app.timerSeconds || 0
  }, extra || {}));
  if (app.events.length > 300) app.events.splice(0, app.events.length - 300);
}

/* ══════════════════════════════════════════════════════
   PHASES — worked out from the data, never kept by hand

   The template listed its phases (predictA, runA, ... checkD) in three
   places. Here the lesson is whatever the data says it is:

     the opening pages, each followed by its check        (OPENING)
     Day 1: the words, the word check
     every day: each page-set in LEARN that belongs to that day (`day` on
       the page-set, 1 when left out), each followed by the check that
       names it in CHECKS[...].after
     the stop at the end of the day                       (DAY_GATES, by `day`)
     the last questions and the end screen, once EXIT_Q is written

   Only days up to DAYS_BUILT are in the lesson. So Day 2 is added as data:
   its page-sets in LEARN with day:2, their checks in CHECKS, its stop in
   DAY_GATES, and DAYS_BUILT = 2.

   UNDERSTANDING CHECKS sit right after the thing they ask about (Marcos
   10/11: "frequent understanding checks", two or three questions at a
   time). qa.js C27 holds that.
══════════════════════════════════════════════════════ */
const BUILT_DAYS = Math.max(1, window.DAYS_BUILT || 1);   /* how many days of the lesson exist yet */
const LEARN_KEYS = Object.keys(window.LEARN || {});
const GATE_KEYS  = Object.keys(window.DAY_GATES || {});
const isLearn = phase => LEARN_KEYS.indexOf(phase) !== -1;
const isGate  = phase => GATE_KEYS.indexOf(phase) !== -1;

const PHASES = OPENING.slice();
const RAIL = [];          /* the steps along the top: one for the words, one for each page-set */
const DAY_OF = {};        /* which day a phase belongs to */
for (let d = 1; d <= BUILT_DAYS; d++) {
  const parts = [];
  if (d === 1) parts.push({ key:'words', l:'Words', phases:withCheck('vocab') });
  LEARN_KEYS.filter(k => (window.LEARN[k].day || 1) === d)
    .forEach(k => parts.push({ key:k, l:window.LEARN[k].rail || window.LEARN[k].title, phases:withCheck(k) }));
  /* the stop belongs to the last part of its day */
  const gate = GATE_KEYS.find(g => window.DAY_GATES[g].day === d);
  if (gate && parts.length) parts[parts.length - 1].phases.push(gate);
  parts.forEach(p => {
    RAIL.push({ key:p.key, n:'Day ' + d, l:p.l, phases:p.phases });
    p.phases.forEach(x => { PHASES.push(x); DAY_OF[x] = d; });
  });
}
/* The last questions and the end screen come back when EXIT_Q exists in
   data/questions.js AND every day the data knows about is built. Until then
   the lesson ends at the stop of the last built day: EXIT_Q written ahead of
   time (with DAYS_BUILT still lower) must not put an exit ticket after Day 1. */
const LAST_DAY = Math.max(BUILT_DAYS, ...LEARN_KEYS.map(k => window.LEARN[k].day || 1),
                          ...GATE_KEYS.map(g => window.DAY_GATES[g].day || 1));
if ((window.EXIT_Q || []).length && BUILT_DAYS >= LAST_DAY) {
  RAIL.push({ key:'exit', n:'Day ' + BUILT_DAYS, l:'Exit', phases:['exit', 'end'] });
  PHASES.push('exit', 'end'); DAY_OF.exit = DAY_OF.end = BUILT_DAYS;
}

/* THE STOP WITH NO WAY ON. A stop at the end of a day is the end of the
   lesson as far as the lesson is built when nothing comes after it in
   PHASES. That stop saves, says to close the computer, and has no button
   (renderDayGate; qa.js C31). */
const isLastStop = phase => isGate(phase) && PHASES.indexOf(phase) === PHASES.length - 1;

/* A short name for a phase: the sheet's status column and the "You stopped
   at ..." note on the name page. From the data, like everything above. */
function phaseName(p) {
  if (p === 'vocab') return 'Words';
  if (p === 'vq') return 'Word check';
  if ((window.CHECKS || {})[p]) return window.CHECKS[p].title;
  if (isLearn(p)) return window.LEARN[p].rail || window.LEARN[p].title;
  if (isGate(p)) return 'End of Day ' + (window.DAY_GATES[p].day || 1);
  return ({ exit:'Exit ticket', end:'Done' })[p] || p;
}
/* The small label over a working screen's title: "Day 1 · Words". */
function dayLabel(phase) {
  const step = RAIL.find(st => st.phases.indexOf(phase) !== -1);
  return step ? step.n + ' &middot; ' + step.l : '';
}

/* ══════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════ */
const app = {
  studentName:'', phase:'start',
  score:0, missedQuestions:[], events:[],
  startedAt:'', finishedAt:'',
  timerSeconds:0, timerInterval:null, timerOn:false,

  qIndex:0, qLocked:false, qTry:1, firstPick:null,
  /* answers, by where they are kept: the checks, the word check, the last questions */
  checkAns:{}, vocabAns:{}, exitAns:{}, resumeAt:'',
  heard:{},        /* guide.js: how many steps of each guided screen were heard to the end */

  /* ── screens ── */
  show(id) {
    /* Every screen is a <section id="...-screen">. Hide them all by that
       rule, not from a list: a list here once left out a new page, and that
       page then stayed on screen under every page after it. */
    document.querySelectorAll('section[id$="-screen"]').forEach(s => s.classList.add('hidden'));
    const el = document.getElementById(id); if (el) el.classList.remove('hidden');
    window.scrollTo({ top:0, behavior:'smooth' });
    /* Speakers attach when a screen is SHOWN, not when the page loads.
       attachSpeakers skips hidden blocks, so the name-picker — hidden at boot
       since the cover went in — silently lost every speaker. Attaching here,
       and again a tick later for content rendered right after show(), covers
       every screen no matter which function shows it. Safe to repeat: blocks
       that already have a speaker are skipped. */
    if (el) { attachSpeakers(el); setTimeout(() => attachSpeakers(el), 0); }
  },

  phaseLabel() { return phaseName(this.phase); },

  /* every question of every question screen (each is asked on exactly one: qa C27) */
  totalItems() { return Object.keys(Q_PHASE).reduce((n, p) => n + bankFor(p).length, 0); },

  /* ── timer (time ON TASK) ── */
  startTimer() {
    if (this.timerOn) return;
    this.timerOn = true;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.tickTimer();
      if (this.timerSeconds % 30 === 0) this.save();
      if (this.timerSeconds % 120 === 0) submitPartial();
    }, 1000);
  },
  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null; this.timerOn = false;
  },
  tickTimer() {
    const m = Math.floor(this.timerSeconds / 60), s = this.timerSeconds % 60;
    const box = document.getElementById('timer-box');
    if (box) box.textContent = m + ':' + String(s).padStart(2, '0');
  },

  /* ── persistence ── */
  save() {
    if (window.PREVIEW) return;   /* never overwrite a student's save on this device */
    /* Never write a session with no student in it. Closing the tab on the
       cover — before anyone has picked a name — used to save an EMPTY
       session over the real one, wiping a student's yesterday. Caught
       10/9 in Lesson 1.1: a planted save came back empty. Guarding here
       rather than at each caller closes every path at once (qa C1). */
    if (!this.studentName) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        studentName:this.studentName, phase:this.phase, score:this.score,
        missedQuestions:this.missedQuestions, events:this.events,
        startedAt:this.startedAt, finishedAt:this.finishedAt,
        timerSeconds:this.timerSeconds,
        qIndex:this.qIndex, checkAns:this.checkAns, resumeAt:this.resumeAt,
        vocabAns:this.vocabAns, exitAns:this.exitAns, tabSwitches:tabSwitchCount,
        heard:this.heard,
        savedAt:new Date().toISOString()
      }));
    } catch (e) {}
  },
  loadSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { return null; }
  },
  clearSaved() { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} },
  /* The lesson a student saved on this device, finished or not, or null.
     A save with no student in it is nobody's work. */
  kept() {
    const s = this.loadSaved();
    return (s && s.studentName && s.phase) ? s : null;
  },

  restore(s) {
    this.studentName = s.studentName || '';
    this.events = s.events || [];
    this.startedAt = s.startedAt || new Date().toISOString();
    this.finishedAt = s.finishedAt || '';
    this.timerSeconds = s.timerSeconds || 0;
    this.qIndex = s.qIndex || 0;
    /* the saved lesson is made to fit the lesson as it is today (see fitSaved) */
    const fit = fitSaved(s);
    this.heard = fit.heard; this.phase = fit.phase;
    this.refit = fit.catchUp;
    this.resumeAt = fit.resumeAt;
    Object.assign(this, fit.answers);                 /* only the questions asked today */
    this.score = fit.score; this.missedQuestions = fit.missed;
    tabSwitchCount = s.tabSwitches || 0;
  },

  /* ── router ── */
  go(phase) {
    this.phase = phase;
    this.qLocked = false;
    drawRail();
    syncWordHelp(phase);
    this.save();

    /* guide.run AFTER the screen is showing: it works out which headings
       belong to which step from what is visible. */
    if (phase === 'vocab')    { this.startTimer(); renderVocab(); this.show('vocab-screen'); attachSpeakers(document.getElementById('vocab-screen'));
                                guide.run(document.getElementById('vocab-screen'), { id: 'vocab' }); }
    else if (isLearn(phase))  { this.startTimer(); renderLearn(phase); }
    else if (isQPhase(phase)) { this.qIndex = firstUnanswered(bankFor(phase), answersFor(phase)); renderQ(); }
    else if (isGate(phase))   { renderDayGate(phase); }
    else if (phase === 'end') { finish(); }
    submitPartial();
  },

  next() {
    /* CATCHING UP (see fitSaved): a lesson saved before a check existed is
       sent to that check first. From there, go to the next check that still
       has a question open, and then back to where the student was. */
    if (this.resumeAt) {
      const from = PHASES.indexOf(this.phase) + 1, to = PHASES.indexOf(this.resumeAt);
      const open = PHASES.slice(from, to).find(p => isQPhase(p) && firstUnanswered(bankFor(p), answersFor(p)) < bankFor(p).length);
      const target = open || this.resumeAt;
      if (!open) this.resumeAt = '';
      this.go(target);
      return;
    }
    /* A CHECK AMONG THE OPENING PAGES comes before the name page. A first-time
       student has no name yet and goes on to the next opening page. A student
       who already has a name (started over without walking the opening
       pages) goes to the next opening check not yet answered, then to the
       first word. */
    const at = OPENING.indexOf(this.phase);
    if (at !== -1 && isQPhase(this.phase)) {
      if (this.studentName && !window.PREVIEW) {
        this.go(OPENING.slice(at + 1).find(p => isQPhase(p) && firstUnanswered(bankFor(p), answersFor(p)) < bankFor(p).length) || 'vocab');
      } else {
        const page = OPENING[at + 1];
        if (isQPhase(page)) this.go(page);
        else OPENERS[page]();
      }
      return;
    }
    const i = PHASES.indexOf(this.phase);
    this.go(PHASES[Math.min(i + 1, PHASES.length - 1)]);
  }
};

/* ── RAIL ───────────────────────────────────────────── */
function drawRail() {
  const rail = document.getElementById('rail');
  const at = PHASES.indexOf(app.phase);
  rail.innerHTML = RAIL.map(st => {
    const last = PHASES.indexOf(st.phases[st.phases.length - 1]);
    const on = st.phases.includes(app.phase);
    const cls = on ? 'step on' : (at > last ? 'step done' : 'step');
    return '<div class="' + cls + '"><span class="n">' + st.n + '</span><span class="l">' + st.l + '</span></div>';
  }).join('');
  rail.classList.toggle('hidden', OPENING.indexOf(app.phase) !== -1);
}

/* ══════════════════════════════════════════════════════
   START SCREEN
══════════════════════════════════════════════════════ */
/* The cover. One picture, the question, one button — nothing to decide. */
function buildCover() {
  /* The app's default phase string is 'start', but the cover is what is on
     screen at boot. Leaving them out of step would save and resume a student
     to the wrong place and mislabel every event logged before they begin. */
  app.phase = 'cover';
  /* NOT named "art": that would shadow the global art() picture helper used
     below for the care tiles, throw, and leave Let's begin unwired. */
  const coverArtHost = document.getElementById('cover-art');
  if (coverArtHost) coverArtHost.innerHTML = window.COVER_ART || '';
  const q = document.getElementById('cv-driving');
  if (q) q.innerHTML = LESSON.driving;
  /* Built before attachSpeakers below, so every tile gets its own speaker. */
  const care = document.getElementById('cv-care');
  if (care) care.innerHTML = (window.CARE || []).map(c =>
    '<div class="ptile ctile" data-step>' + art((window.CARE_ART || {})[c.art], 'ptart') +
    '<div><b class="pt">' + c.t + '</b><span class="pd">' + c.d + '</span>' +
    '<span class="ctest">' + c.test + '</span></div></div>').join('');
  document.getElementById('cover-go').onclick = () => { logEvent('cover_begin'); showWhy(); };

  /* Coming back? The resume button lives on the name-picker page, which is
     ten pages in. If this device holds an unfinished lesson, the cover
     offers a shortcut straight to the name picker — and the name check there
     still stops one student picking up another's work on a shared device. */
  const back = document.getElementById('cv-resume');
  const saved = app.loadSaved();
  if (back && saved && saved.studentName && saved.phase && saved.phase !== 'end') {
    back.classList.remove('hidden');
    document.getElementById('cv-resume-go').onclick = () => {
      logEvent('cover_resume');
      showStart();
    };
  }
  attachSpeakers(document.getElementById('cover-screen'));
}

function buildStart() {
  const sel = document.getElementById('name-select');
  ROSTER.forEach(r => {
    const o = document.createElement('option');
    o.value = r.name; o.textContent = r.name; sel.appendChild(o);
  });
  /* Guest view (share.js, a colleague's link): no class list — one name, "Guest". */
  if (window.SHARE_MODE) {
    sel.innerHTML = '<option value="Guest">Guest</option>';
    sel.value = 'Guest';
    const lb = sel.closest('.fld') && sel.closest('.fld').querySelector('.lb');
    if (lb) lb.textContent = 'Guest view';
    const teacherBtn = document.getElementById('teacher-btn');   /* the lesson preview already opened for a guest */
    if (teacherBtn) teacherBtn.classList.add('hidden');
  }

  const begin = document.getElementById('begin-btn');
  const resumeBox = document.getElementById('resume-box');
  const resumeBtn = document.getElementById('resume-btn');

  /* THE BIG BUTTON NEVER CLEARS SAVED WORK (10/10). The lesson takes three
     days, so on Day 2 and Day 3 every student comes back through this page
     with saved work. The big button here used to turn into "Start over
     from the beginning" and clear them on one tap, with the real way back a
     small button beside it. Now, while this device holds a saved lesson:
     "Pick up where I left off" is the big button, and the button that
     clears the saved lesson is the small one and asks for the teacher PIN.
     The same holds when the saved lesson is under another name (a wrong
     pick in the list, or a shared computer), where one tap on "Start the
     lesson" cleared the other student's work just the same. And the same
     holds when the saved lesson is FINISHED: the end screen asks for the
     PIN before it starts over, and this page did not. Marcos 10/10: "PIN
     it". A student doing a make-up on a classmate's computer needs Mr. O. */
  sel.addEventListener('change', () => {
    begin.disabled = !sel.value;
    const s = app.kept();
    const mine = !!s && s.studentName === sel.value;
    const resumable = mine && s.phase !== 'end';
    const finished = mine && !resumable;
    const notMine = !!s && !!sel.value && !mine;         /* the saved lesson is under another name */
    resumeBox.classList.toggle('hidden', !mine && !notMine);
    resumeBtn.classList.toggle('hidden', !resumable);
    begin.classList.toggle('ghost', mine || notMine);
    begin.classList.toggle('small', mine || notMine);
    resumeBox.querySelector('.lb').textContent =
      notMine ? 'This computer has saved work.'
      : finished ? 'You already finished this lesson.' : 'You already started this lesson.';
    if (resumable) {
      const m = Math.floor((s.timerSeconds || 0) / 60);
      const howLong = m < 1 ? 'less than a minute' : m + ' minute' + (m === 1 ? '' : 's');
      /* A lesson saved before a check was added goes to that check first.
         Say so here, before the student presses. */
      const fit = fitSaved(s);
      document.getElementById('resume-text').innerHTML =
        'You stopped at <b>' + phaseName(fit.resumeAt || fit.phase) +
        '</b> after ' + howLong + ' of work. ' +
        (fit.catchUp
          ? 'The lesson changed: there are new questions about what you already did. You will answer the new questions first. ' +
            'Then you will go on from where you stopped. Your work is saved.'
          : 'Nothing you finished will be asked again.');
      begin.textContent = 'Start over (teacher PIN)';
    } else if (finished) {
      document.getElementById('resume-text').textContent =
        'Your work is saved. Ask Mr. O before you start the lesson again.';
      begin.textContent = 'Start over (teacher PIN)';
    } else if (notMine) {
      const who = '<b>' + String(s.studentName).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</b>';
      document.getElementById('resume-text').innerHTML =
        'The saved work belongs to ' + who + '. If you are ' + who + ', pick your own name. ' +
        'If you are a different student, ask Mr. O for help.';
      begin.textContent = 'Start the lesson (teacher PIN)';
    } else {
      begin.textContent = 'Start the lesson';
    }
    /* The note was hidden when the page got its speakers, so it had none. */
    attachSpeakers(document.getElementById('start-screen'));
  });

  /* Clears what is saved on this device and starts the lesson at the first word. */
  const startFresh = () => {
    /* THE OPENING CHECKS ARE ANSWERED BEFORE THIS PAGE, when the lesson does
       not know whose answers they are yet. Whoever just walked the opening
       pages on this device is the student now picking a name, so those
       answers, their points, their misses and their record go with this
       student. (Nothing else from before the name is kept, as before.) */
    const openChecks = OPENING.filter(isQPhase);
    const openIds = openChecks.reduce((all, p) => all.concat(bankFor(p).map(q => q.id)), []);
    const kept = {
      ans: Object.fromEntries(Object.entries(app.checkAns || {}).filter(([id]) => openIds.indexOf(id) !== -1)),
      missed: (app.missedQuestions || []).filter(m => openIds.indexOf(m.id) !== -1),
      events: (app.events || []).filter(e => e.e === 'answer' && openIds.indexOf(e.id) !== -1)
    };
    app.studentName = sel.value;
    app.clearSaved();
    app.checkAns = kept.ans; app.missedQuestions = kept.missed; app.events = kept.events;
    app.score = Object.keys(kept.ans).length - kept.missed.length;
    app.resumeAt = '';
    app.vocabAns = {}; app.exitAns = {};
    app.heard = {};
    app.timerSeconds = 0;
    app.startedAt = new Date().toISOString();
    logEvent('start', { name:app.studentName });
    document.getElementById('who-chip').textContent = app.studentName;
    /* a student who did not come through the opening pages this time (the
       lesson was started over) has not had the opening checks: ask them first */
    app.go(openChecks.find(p => firstUnanswered(bankFor(p), answersFor(p)) < bankFor(p).length) || 'vocab');
  };

  if (window.SHARE_MODE) sel.dispatchEvent(new Event('change'));   /* "Guest" is already picked */

  /* Asked again here, from what is saved right now and not from how the
     buttons look: however a student gets to this press, a saved lesson is
     cleared only with the PIN. Nothing saved: one tap starts, as before. */
  begin.addEventListener('click', () => {
    const s = app.kept();
    if (s) askPin('Enter the teacher PIN to clear the saved work for ' + s.studentName + ' and start the lesson from the beginning.', startFresh);
    else startFresh();
  });

  resumeBtn.addEventListener('click', () => {
    const s = app.loadSaved(); if (!s) return;
    app.restore(s);
    logEvent('resume');
    if (app.refit) logEvent('refit', { to:app.phase });
    document.getElementById('who-chip').textContent = app.studentName;
    app.startTimer(); app.tickTimer();
    app.go(isQPhase(app.phase) ? app.phase : OPENING.indexOf(app.phase) !== -1 ? 'vocab' : app.phase);
  });

  /* No whole-page reader anywhere now. Marcos 10/9: "I don't like the read to
     me that reads the entire page." Every block carries its own speaker, so a
     student hears the one line they are stuck on instead of sitting through
     the screen. */

  /* The Teacher button opens the full preview (preview.js): Back / Next
     through every screen and every question, nothing saved or sent. It used
     to jump once to a typed step number and then strand you there. */
  document.getElementById('teacher-btn').addEventListener('click', () => {
    if (window.startTeacherPreview) window.startTeacherPreview();
  });
}

/* The teacher-led minutes and the lab are the same lesson, but a student
   who looks up from the board to a screen has nothing carrying the thread.
   This is that thread: what Mr. O just did, named by its demo, with the
   one rule of the day underneath. */
function recapHTML(which) {
  const r = (window.RECAP || {})[which];
  if (!r) return '';
  return '<div class="recap">' +
    '<span class="lbl">What Mr. O just showed you</span>' +
    '<p class="rl" data-step>' + r.lead + '</p>' +
    r.items.map((it, i) =>
      '<div class="rcard" data-step><span class="rnum" data-noread>' + (i + 1) + '</span>' +
      '<div class="rbody"><div class="rt">' + it.t + '</div>' +
      '<div class="rd">' + it.d + '</div></div></div>').join('') +
    '<div class="rnow" data-step>' + r.now + '</div>' +
  '</div>';
}

/* The plan, as tiles: what today holds, a picture for each part, one short
   step about the later days, then the three things a student does on every
   page, then one calm line. Each tile is one read-aloud block so a student
   can hear just that piece. The two headings are data too (INTRO_PLAN.head
   and .everyHead): the template had "Which test, which day" written here. */
function planHTML() {
  const P = window.INTRO_PLAN;
  if (!P) return '';
  const tArt = window.TILE_ART || {};
  /* One page per idea: what today holds (with the short preview of the later
     days under it), then what happens on every page. Each tile is a step
     that has to be heard (guide.js). */
  return P.days.map((day, k) =>
      '<div data-gpage><span class="plan-h">' + (P.head || '') + '</span>' +
      '<div class="plan-day"><p class="pday">' + day.label + '</p>' +
      day.tests.map(t =>
        '<div class="ptile" data-step>' + art(tArt[t.art], 'ptart') +
        '<div><b class="pt">' + t.t + '</b><span class="pd">' + t.d + '</span></div></div>'
      ).join('') + '</div>' +
      /* the later days as ONE short step under today's parts: a preview,
         not the plan (INTRO_PLAN.later) */
      (k === P.days.length - 1 && P.later
        ? '<div class="plan-day"><div class="ptile" data-step>' + art(tArt[P.later.art], 'ptart') +
          '<div><b class="pt">' + P.later.label + '</b><span class="pd">' + P.later.text + '</span></div></div></div>'
        : '') +
      '</div>').join('') +
    '<div data-gpage><span class="plan-h">' + (P.everyHead || '') + '</span>' +
    '<div class="plan-every">' + P.every.map((e, i) =>
      '<div class="ptile step3" data-step><span class="pnum" data-noread>' + (i + 1) + '</span>' +
      art(tArt[e.art], 'ptart') +
      '<div><b class="pt">' + e.t + '</b><span class="pd">' + e.d + '</span></div></div>'
    ).join('') + '</div>' +
    '<p class="plan-calm" data-step>' + P.calm + '</p></div>';
}

/* Page two: the big question, and every word in the big question explained.
   Speakers are attached here because the page no longer lives inside the
   cover. */
function showWhy() {
  app.phase = 'why'; drawRail();
  app.show('why-screen');
  attachSpeakers(document.getElementById('why-screen'));
  guide.run(document.getElementById('why-screen'), { id: 'why' });
  document.getElementById('why-next').onclick = () => { speech.stop(); showCare(); };
}

/* Why should you care — its own page, so the three cards are not a scroll
   away under the big question. The cards are built at boot by buildCover. */
function showCare() {
  app.phase = 'care'; drawRail();
  app.show('care-screen');
  attachSpeakers(document.getElementById('care-screen'));
  guide.run(document.getElementById('care-screen'), { id: 'care' });
  document.getElementById('care-next').onclick = () => { speech.stop(); showSummary(); };
}

function showSummary() {
  app.phase = 'summary'; drawRail();
  document.getElementById('recap-host').innerHTML = recapHTML('day1');
  app.show('summary-screen');
  attachSpeakers(document.getElementById('summary-screen'));
  guide.run(document.getElementById('summary-screen'), { id: 'summary' });
  /* Nothing on these pages speaks on its own. Marcos 10/9: "this read on its
     own. It shouldn't." Twenty-two devices would all start talking at once. */
  nextOrCheck('sum-next', 'summary', showTool);
}

/* A TEACHING PAGE-SET: one page per idea, one picture at the top of each
   page (SCENE_ART), then the points one under the other so the order is
   never in doubt, each point with a small picture (TILE_ART) and each one a
   step that has to be heard (guide.js). Meet the tool is one of these; so is
   every page-set inside the lesson (LEARN). Same shape, same code. */
function pagesHTML(pages) {
  const scenes = window.SCENE_ART || {}, pics = window.TILE_ART || {};
  return (pages || []).map(pg =>
    '<div data-gpage>' + (pg.head ? '<h3 class="page-h">' + pg.head + '</h3>' : '') +
    (scenes[pg.scene] ? '<div class="cscene" data-noread>' + scenes[pg.scene] + '</div>' : '') +
    '<div class="page-list">' + pg.tiles.map(c =>
      '<div class="ptile crow" data-step>' + art(pics[c.art], 'ptart') +
      '<div><b class="pt">' + c.t + '</b><span class="pd">' + c.d + '</span></div></div>').join('') +
    '</div></div>').join('');
}

/* Meet the tool — the thing this lesson thinks with (TOOL and TOOL_PAGES in
   data/lesson.js). What we just talked about names the tool first, because
   Mr. O shows the video first; no page before that one may (qa.js C11). */
function showTool() {
  app.phase = 'tool'; drawRail();
  document.getElementById('tool-head').innerHTML = (window.TOOL || {}).title || '';
  document.getElementById('tool-pages').innerHTML = pagesHTML(window.TOOL_PAGES);
  app.show('tool-screen');
  guide.run(document.getElementById('tool-screen'), { id: 'tool' });
  nextOrCheck('tool-next', 'tool', showPlan);     /* the button says what comes next: the questions about the tool */
}

/* A PAGE-SET INSIDE THE LESSON (any key of LEARN): taught the same way, then
   checked. The label over the title is the day and the name on the rail. */
function renderLearn(key) {
  const L = window.LEARN[key];
  document.getElementById('learn-eyebrow').innerHTML = dayLabel(key);
  document.getElementById('learn-head').innerHTML = L.title || '';
  document.getElementById('learn-pages').innerHTML = pagesHTML(L.pages);
  app.show('learn-screen');
  attachSpeakers(document.getElementById('learn-screen'));
  guide.run(document.getElementById('learn-screen'), { id: key });
  nextOrCheck('learn-next', key, () => app.next());
}

/* The plan gets its own page. Marcos 10/9: the summary was one long screen,
   "perhaps push it to another page". */
function showPlan() {
  app.phase = 'plan'; drawRail();
  const host = document.getElementById('ra-text');
  host.innerHTML = planHTML();
  app.show('plan-screen');
  attachSpeakers(document.getElementById('plan-screen'));
  guide.run(document.getElementById('plan-screen'), { id: 'plan' });
  nextOrCheck('ra-next', 'plan', showGoals);
}

/* BY THE END YOU CAN — the "I can" lines, each one heard before the
   name page exists. They used to sit on the name page, where a student could
   pick a name and press Start without hearing one of them (Marcos 10/10:
   "are the students forced to read this page?"). One line to a step, a
   picture beside each; the page title is read with the first line. */
function showGoals() {
  app.phase = 'goals'; drawRail();
  const pics = window.TILE_ART || {};
  const which = LESSON.icanArt || [];
  document.getElementById('goals-list').innerHTML = LESSON.icanKid.map((line, i) =>
    '<div class="ptile crow" data-step>' + art(pics[which[i]], 'ptart') +
    '<div><b class="pt">I can ' + line + '</b></div></div>').join('');
  app.show('goals-screen');
  attachSpeakers(document.getElementById('goals-screen'));
  guide.run(document.getElementById('goals-screen'), { id: 'goals' });
  /* ...and then the name picker, not straight into the lesson. */
  document.getElementById('goals-next').onclick = () => { speech.stop(); showStart(); };
}

/* The name page. It asks for a name and nothing else (qa.js C26). */
function showStart() { app.phase = 'start'; app.show('start-screen'); drawRail(); }

/* How each opening page is opened. next() uses this to go on from a check
   among the opening pages, and the teacher preview to show any of them. */
const OPENERS = { why: showWhy, care: showCare, summary: showSummary, tool: showTool,
                  plan: showPlan, goals: showGoals, start: showStart };

/* ══════════════════════════════════════════════════════
   VOCABULARY
══════════════════════════════════════════════════════ */
function renderVocab() {
  /* One word per page (Marcos 10/9: "Split them"), each heard before the next
     appears (guide.js) — for the words that are NEW here. The words already
     taught share one short reminder page first (10/11: "reference force and
     friction but focus more on the other vocab words that have not been
     talked about"). Which is which is `met` on the word in data/lesson.js;
     a `met` word was taught on an earlier page of this lesson, or in an
     earlier lesson (`from`). The heading reads the same for both kinds. */
  const met = LESSON.vocab.filter(v => v.met), fresh = LESSON.vocab.filter(v => !v.met);
  const num = n => ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'][n] || String(n);
  const spanish = v => '<div class="es" data-noread>en espa&ntilde;ol: ' + v.es + '</div>';
  /* the label and the title, from the day and from how many words there are */
  const n = num(LESSON.vocab.length);
  document.getElementById('vocab-eyebrow').innerHTML = dayLabel('vocab');
  document.getElementById('vocab-head').textContent = n.charAt(0).toUpperCase() + n.slice(1) + ' words for today';
  document.getElementById('vocab-cards').innerHTML =
    (met.length
      ? '<div class="vpage" data-gpage><div class="vmet" data-step>' +
        '<span class="exlbl">You already know ' + num(met.length) + ' of the ' + num(LESSON.vocab.length) + ' words</span>' +
        met.map(v => '<div class="vmrow">' + art(WORD_ART[v.word], 'wordart') +
          '<div><p class="d">' + (v.short || '<dfn>' + v.word + '</dfn>: ' + v.def + '.') + '</p>' + spanish(v) + '</div></div>').join('') +
        '</div></div>'
      : '') +
    fresh.map((v, i) =>
      '<div class="vpage" data-gpage>' +
      '<div class="vcard" data-step>' + art(WORD_ART[v.word], 'wordart') +
      '<div class="vn">' + (met.length ? 'New word ' : 'Word ') + (i + 1) + ' of ' + fresh.length + '</div>' +
      '<div class="w"><dfn>' + v.word + '</dfn></div>' +
      /* data-noread: textOf() strips these before speaking, so the Spanish
         stays on screen for the reader who wants it and the English voice
         never tries to pronounce it. */
      spanish(v) +
      '<div class="d">' + v.def + '</div></div>' +
      (v.ex ? '<div class="vex" data-step><span class="exlbl">For example</span>' + v.ex + '</div>' : '') +
      '</div>').join('');
  /* the button says what comes next: the questions on the new words */
  const nQ = bankFor('vq').length, b = document.getElementById('vocab-next');
  if (nQ) b.innerHTML = 'Answer ' + nQ + ' question' + (nQ === 1 ? '' : 's') + ' about the ' + (met.length ? 'new ' : '') + 'words &rarr;';
  b.onclick = () => app.go('vq');
}

/* ══════════════════════════════════════════════════════
   QUESTION ENGINE — vocabulary check, data analysis, exit ticket
══════════════════════════════════════════════════════ */
/* Which questions a question screen asks, and where its answers are kept.
   The word check asks VOCAB_Q. Every check in CHECKS (data/questions.js)
   names its own list (`bank`). The last questions (EXIT_Q) are not written
   yet; the day they are, they are asked on 'exit' (see PHASES). */
const Q_PHASE = {};
if ((window.VOCAB_Q || []).length) Q_PHASE.vq   = { bank: () => window.VOCAB_Q, ans: 'vocabAns' };
if (PHASES.indexOf('exit') !== -1)  Q_PHASE.exit = { bank: () => window.EXIT_Q,  ans: 'exitAns' };
/* only the checks that are in the lesson: a check written for a day that is
   not built yet is not asked and does not count toward the score */
Object.keys(window.CHECKS || {}).filter(p => PHASES.indexOf(p) !== -1).forEach(p => {
  const c = window.CHECKS[p];
  Q_PHASE[p] = { bank: () => window[c.bank] || [], ans: 'checkAns' };
});
/* The Next button of a page that is followed by a check says so, and leads
   there: "Answer 3 questions about what we talked about". With no check
   after the page, the button keeps its own words and `goOn` runs. */
function nextOrCheck(btnId, page, goOn) {
  const b = document.getElementById(btnId), nx = PHASES[PHASES.indexOf(page) + 1];
  const n = isQPhase(nx) ? bankFor(nx).length : 0;
  if (n) b.innerHTML = 'Answer ' + n + ' question' + (n === 1 ? '' : 's') + ' about ' + ((window.CHECKS[nx] || {}).about || 'this page') + ' &rarr;';
  b.onclick = () => { speech.stop(); if (n) app.go(nx); else goOn(); };
}
const isQPhase = phase => Object.prototype.hasOwnProperty.call(Q_PHASE, phase);
function bankFor(phase) { return isQPhase(phase) ? Q_PHASE[phase].bank() : []; }
function answersFor(phase) { return isQPhase(phase) ? (app[Q_PHASE[phase].ans] || (app[Q_PHASE[phase].ans] = {})) : {}; }
function firstUnanswered(bank, ans) {
  for (let i = 0; i < bank.length; i++) if (ans[bank[i].id] == null) return i;
  return bank.length; /* all done */
}

/* A question's words, its choices and its right answer. Three small
   functions on purpose: in a lesson with a test they are where a question is
   built out of the student's own data table (the template did that with
   `qFrom`, `optsFrom` and `resolve`). Here every question is fixed. */
function stemOf(q) { return q.q; }
function optsOf(q) { return q.opts; }
function correctIndex(q) { return q.a; }

const PHASE_TITLE = { vq:'Word check', exit:'Exit ticket' };
Object.keys(window.CHECKS || {}).forEach(p => { PHASE_TITLE[p] = window.CHECKS[p].title; });

function renderQ() {
  const bank = bankFor(app.phase), ans = answersFor(app.phase);
  if (app.qIndex >= bank.length) { app.next(); return; }

  const q = bank[app.qIndex];
  app.qLocked = false;
  app.qTry = 1; app.firstPick = null;
  app.show('q-screen');

  document.getElementById('q-count').textContent =
    'Question ' + (app.qIndex + 1) + ' of ' + bank.length;
  document.getElementById('q-phase').textContent = PHASE_TITLE[app.phase] || '';
  const qt = document.getElementById('q-text');
  qt.innerHTML = wrapWords(stemOf(q));
  /* Read-aloud says the question AND the four choices — a student who cannot
     read the options cannot answer a question they understood. */

  document.getElementById('q-fb').innerHTML = '';
  document.getElementById('q-next').classList.add('hidden');
  document.getElementById('q-bar').style.width = Math.round((app.qIndex / bank.length) * 100) + '%';

  /* Move focus onto the new question: a screen reader announces it, and a
     keyboard user lands next to the choices instead of back at the page top. */
  setTimeout(() => { try { qt.focus({ preventScroll:true }); } catch (e) {} }, 30);

  const box = document.getElementById('q-opts');
  box.innerHTML = '';
  optsOf(q).forEach((o, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'opt';
    b.innerHTML = '<span class="ltr">' + 'ABCD'[i] + '</span><span>' + o + '</span>';
    b.onclick = () => answerQ(q, i, bank, ans);
    box.appendChild(b);
  });
  attachSpeakers(document.getElementById('q-screen'));
}

/* A wrong first pick gets ONE more try before the answer is shown. This is a
   lesson, not a test: a student who misreads an option should get back in, and
   a second look at two remaining choices is where the thinking happens.

   Scoring is unchanged and still comparable to every other site: the point is
   earned only on the FIRST pick, and the miss is logged with that first pick.
   The retry changes what the student learns, not what the data means. */
function answerQ(q, picked, bank, ans) {
  if (app.qLocked) return;
  const right = correctIndex(q);
  const ok = picked === right;
  const btns = [...document.getElementById('q-opts').children];
  const fb = document.getElementById('q-fb');
  const choices = optsOf(q);
  speech.stop();

  const firstTry = app.qTry !== 2;

  if (!ok && firstTry) {
    /* one more go — the wrong choice is taken off the table, nothing is revealed */
    app.qTry = 2;
    app.firstPick = picked;
    btns[picked].classList.add('wrong');
    btns[picked].disabled = true;
    fb.className = 'fb try';
    fb.innerHTML = '<b>Not that one — try once more.</b> ' +
      'Read the question again and pick from the choices that are left.';
    logEvent('answer', { id:q.id, ok:false, t:1 });
    app.save();
    attachSpeakers(document.getElementById('q-screen'));   /* "try once more" can be heard too */
    const again = btns.find(b => !b.disabled);
    if (again) again.focus();
    return;
  }

  app.qLocked = true;
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === right) b.classList.add('right');
    else if (i === picked) b.classList.add('wrong');
  });

  /* the point rides on the first pick, whether or not a second try followed */
  const earned = ok && firstTry;
  const recordedPick = firstTry ? picked : app.firstPick;

  ans[q.id] = recordedPick;
  if (earned) app.score++;
  else app.missedQuestions.push({
    id:q.id, q:stripTags(stemOf(q)), yourAnswer:stripTags(choices[recordedPick]),
    correct:stripTags(choices[right]), skill:(window.SKILLS || {})[q.id] || 'Unsorted'
  });

  fb.className = earned ? 'fb ok' : 'fb no';
  fb.innerHTML = earned
    ? '<b>Correct.</b> ' + whyRight(q)
    : ok
      ? '<b>That is right — on your second try.</b> ' + whyRight(q)
      : '<b>Not quite.</b> The answer is <b>' + stripTags(choices[right]) + '</b>. ' + whyRight(q);

  logEvent('answer', { id:q.id, ok:earned, t:firstTry ? 1 : 2 });
  app.save();

  attachSpeakers(document.getElementById('q-screen'));

  const nx = document.getElementById('q-next');
  nx.classList.remove('hidden');
  nx.textContent = (app.qIndex + 1 >= bank.length) ? 'Finish this step →' : 'Next →';
  nx.onclick = () => { app.qIndex++; app.save(); renderQ(); };
  nx.focus();
}

/* A one-line reason, so a wrong answer still teaches something. */
/* Feedback comes from the question itself (questions.js, `why`). */
function whyRight(q) { return q.why || ''; }

/* ══════════════════════════════════════════════════════
   A SAVED LESSON MUST FIT THE LESSON AS IT IS TODAY

   The lesson is built a day at a time, and a question or a page can change
   after students have saved work on their computers. Marcos 10/10, picking
   up his own saved Lesson 1.1 after a change: "this is not where i left
   off." The rule from that day, for the parts this lesson has:

   - A place the lesson no longer has (a page that was renamed or taken
     out): the student starts again at the first word. Nothing answered is
     asked again and nothing heard has to be heard again.
   - Answers to questions the lesson no longer asks are taken out, and so is
     the point for each one that was right: the score is out of the
     questions asked today.
   - A check that was added (or moved earlier) after this lesson was saved
     sits BEHIND the student, never asked. Those questions count toward the
     score, so the student is sent to the first such check, and from there
     next() walks the rest and then returns the student to `resumeAt`.

   (The template also fitted saved PUSHES to the runs of each test. This
   lesson has no test; that half is in the template, git show
   5388b7a:script.js, fitSaved, for the day a test is added.)

   Pure: takes what was saved, returns what to use. A damaged save must not
   stop the page, so nothing here trusts the shape of what it is given.
══════════════════════════════════════════════════════ */
function fitSaved(s) {
  s = (s && typeof s === 'object') ? s : {};
  const obj = v => (v && typeof v === 'object' && !Array.isArray(v)) ? v : {};
  const heard = Object.assign({}, obj(s.heard));
  /* `resumeAt` is where a student who was catching up was really up to */
  let phase = s.resumeAt || s.phase || 'vocab';
  if (PHASES.indexOf(phase) === -1) phase = 'vocab';

  const askedNow = Object.keys(Q_PHASE).reduce((all, p) => all.concat(bankFor(p).map(x => x.id)), []);
  const oldMisses = Array.isArray(s.missedQuestions) ? s.missedQuestions.filter(m => m && typeof m === 'object') : [];
  const wasMissed = id => oldMisses.some(m => m.id === id);
  const answers = {};
  let score = Number(s.score) || 0;
  [...new Set(Object.keys(Q_PHASE).map(p => Q_PHASE[p].ans))].forEach(key => {
    answers[key] = {};
    const was = obj(s[key]);
    Object.keys(was).forEach(id => {
      if (askedNow.indexOf(id) !== -1) answers[key][id] = was[id];
      else if (!wasMissed(id)) score--;
    });
  });
  score = Math.max(0, score);
  const missed = oldMisses.filter(m => askedNow.indexOf(m.id) !== -1);

  let resumeAt = '', catchUp = '';
  const saidTo = p => answers[Q_PHASE[p].ans] || {};
  const behind = PHASES.slice(0, Math.max(0, PHASES.indexOf(phase)))
    .find(p => isQPhase(p) && bankFor(p).some(q => saidTo(p)[q.id] == null));
  if (behind) { catchUp = behind; resumeAt = phase; phase = behind; }
  return { heard, phase, catchUp, resumeAt, answers, score, missed };
}

/* ══════════════════════════════════════════════════════
   THE STOP AT THE END OF A DAY — a real stop, not a scroll-past

   Three short pages, each one heard: what you did today (DAY_GATES[..].did),
   one short thing about next time (a preview, not the plan: qa.js C28), and
   the stop itself.

   The stop is one of two things:

   - THE END OF WHAT IS BUILT (isLastStop). There is no next day to go to
     yet, so the page has no way on: no "What did Mr. O say?", no button.
     The page says the work is saved and to close the computer. A student
     who comes back and presses "Pick up where I left off" lands here again.
     qa.js C31 holds this.

   - A STOP WITH ANOTHER DAY AFTER IT (the template's gate, used again the
     day DAYS_BUILT goes up). Without a gate a fast student runs straight
     into the next day's pages, which Mr. O has not shown yet. So the page
     asks out loud, and the answer is logged either way.
══════════════════════════════════════════════════════ */
function renderDayGate(phase) {
  const G = (window.DAY_GATES || {})[phase] || {};
  const day = G.day || 1, nextDay = day + 1;
  const last = isLastStop(phase);
  app.show('daygate-screen');
  const gateRoot = document.getElementById('daygate-screen');
  const choices = document.getElementById('dg-choices');
  /* back to its opening state every time: the stop on, the rest off */
  choices.classList.remove('hidden');
  document.getElementById('dg-stopped').classList.add('hidden');
  const recapHost = document.getElementById('dg-recap');
  recapHost.classList.add('hidden'); recapHost.innerHTML = '';
  const hidePages = () => gateRoot.querySelectorAll('[data-gpage],.gdots').forEach(n => n.classList.add('ghide'));

  document.getElementById('dg-eyebrow').innerHTML = 'End of Day ' + day;
  document.getElementById('dg-head').innerHTML = G.head || 'Nice job.';

  /* what they did today */
  document.getElementById('dg-did').innerHTML = G.did || '';

  /* what comes next time, each point a step that has to be heard */
  document.getElementById('dg-nextbox').innerHTML =
    '<span class="lbl">' + (G.nextLabel || 'Next time') + '</span><ol>' +
    (G.next || []).map(t => '<li data-step>' + t + '</li>').join('') + '</ol>';

  if (last) {
    /* No way on. The three lines are one step, so the stop has to be heard
       like everything else; when the stop has been heard, the day is logged
       as finished and one more row goes to the sheet. */
    choices.innerHTML = '<div class="box ask" data-parts data-step id="dg-ask">' +
      '<span class="lbl">Stop here</span>' + STOP_LINES.map(t => '<p>' + t + '</p>').join('') + '</div>';
    attachSpeakers(gateRoot);
    guide.run(gateRoot, { id: phase, onDone: () => {
      logEvent('day' + day + '_stop', { end: 'last built day' });
      app.save(); submitPartial();
    } });
    return;
  }

  choices.innerHTML =
    '<div class="box ask" data-parts data-step id="dg-ask">' +
    '<span class="lbl">Stop here</span>' +
    '<p><b>Ask Mr. O if you should go on to Day ' + nextDay + '.</b></p>' +
    '<p>Put your hand up and ask. Do not start Day ' + nextDay + ' on your own. Mr. O will show the class ' +
    'what is new first. The new pages are easier after Mr. O shows the class.</p></div>' +
    '<div data-gafter><p class="qtext">What did Mr. O say?</p><div class="btnrow">' +
    '<button class="btn" id="dg-next" type="button">Mr. O said I can start Day ' + nextDay + ' &rarr;</button>' +
    '<button class="btn ghost" id="dg-stop" type="button">Mr. O said stop here for today</button></div></div>';
  document.getElementById('dg-stopped-day').textContent = 'Day ' + nextDay;

  /* The teacher's answer is logged either way, so Mr. O can see on the
     dashboard who went on and who was told to wait. */
  document.getElementById('dg-next').onclick = () => {
    logEvent('day' + nextDay + '_start', { cleared: 'teacher said yes' });
    choices.classList.add('hidden');
    hidePages();
    recapHost.innerHTML = recapHTML(G.recap) +
      '<div class="btnrow" data-gafter><button class="btn" id="dg-go" type="button">' +
      (G.go || 'Keep going &rarr;') + '</button></div>';
    recapHost.classList.remove('hidden');
    attachSpeakers(recapHost);
    guide.run(recapHost, { id: (G.recap || 'day') + 'recap' });
    document.getElementById('dg-go').onclick = () => app.next();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.getElementById('dg-stop').onclick = () => {
    logEvent('day' + day + '_stop'); app.save(); submitPartial();
    choices.classList.add('hidden');
    hidePages();
    document.getElementById('dg-stopped').classList.remove('hidden');
    speech.stop();
  };
  attachSpeakers(gateRoot);
  guide.run(gateRoot, { id: phase });
}

/* ══════════════════════════════════════════════════════
   FINISH — the end screen

   Not reached yet: it comes back with the last questions (EXIT_Q, see
   PHASES). The template's end screen also showed the data tables and the
   explanation a student built; this lesson has neither.
══════════════════════════════════════════════════════ */
function finish() {
  app.stopTimer();
  app.finishedAt = new Date().toISOString();
  logEvent('finish', { score:app.score, total:app.totalItems() });
  speech.stop();
  app.show('end-screen');

  const total = app.totalItems();
  const pct = total ? Math.round((app.score / total) * 100) : 0;
  const clock = n => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');

  /* what the student did, in the lesson's own words (LESSON.endLead) */
  document.getElementById('end-lead').innerHTML = window.LESSON.endLead || '';

  document.getElementById('end-scores').innerHTML = [
    ['' + app.score + '/' + total, 'Questions right'],
    [pct + '%', 'Score'],
    [clock(app.timerSeconds), 'Time on task']
  ].map(x => '<div class="sb"><div class="n tnum">' + x[0] + '</div><div class="l">' + x[1] + '</div></div>').join('');

  const miss = app.missedQuestions;
  document.getElementById('end-miss').innerHTML = miss.length
    ? '<hr class="hr"><h3 style="font-size:21px">Look at these again with Mr. O</h3><ul class="misslist">' +
      miss.map(x => '<li><b>' + (x.skill || '') + '</b> — ' + x.q +
        ' <i>(you picked: ' + x.yourAnswer + '; answer: ' + x.correct + ')</i></li>').join('') + '</ul>'
    : app.score >= total && total
      ? '<hr class="hr"><p class="lead">You got every question right. Nothing to go back over.</p>'
      : '';   /* no misses on record and not every point: say nothing (the teacher preview answers no questions) */

  submitFinal();
  if (!window.PREVIEW) try {
    const all = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
    all.push({ name:app.studentName, score:app.score, total:total, percent:pct,
               elapsed:app.timerSeconds, at:new Date().toISOString() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all.slice(-80)));
  } catch (e) {}
  app.save();

  attachSpeakers(document.getElementById('end-screen'));

  document.getElementById('end-print').onclick = () => window.print();
  document.getElementById('end-restart').onclick = () =>
    askPin('Enter the teacher PIN to clear this student and start over.', () => {
      app.clearSaved(); location.reload();
    });
}

/* ══════════════════════════════════════════════════════
   PIN · THEME · VISIBILITY
══════════════════════════════════════════════════════ */
let pinCb = null;
function askPin(why, cb) {
  pinCb = cb;
  document.getElementById('pin-why').textContent = why;
  document.getElementById('pin-input').value = '';
  document.getElementById('pin-modal').classList.remove('hidden');
  document.getElementById('pin-input').focus();
}
document.getElementById('pin-ok').onclick = () => {
  if (document.getElementById('pin-input').value.trim() === TEACHER_PIN) {
    document.getElementById('pin-modal').classList.add('hidden');
    const cb = pinCb; pinCb = null; if (cb) cb();
  } else {
    document.getElementById('pin-why').textContent = 'That PIN is not right. Ask Mr. O.';
  }
};
document.getElementById('pin-cancel').onclick = () => {
  document.getElementById('pin-modal').classList.add('hidden'); pinCb = null;
};

document.getElementById('theme-btn').onclick = () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const dark = cur ? cur === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  try { localStorage.setItem('sci_theme', dark ? 'light' : 'dark'); } catch (e) {}
};
try {
  const t = localStorage.getItem('sci_theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
} catch (e) {}

/* The clock pauses while the page is hidden, so elapsed is time ON TASK. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (!app.timerOn) return;
    tabSwitchCount++;
    logEvent('leave');
    app.stopTimer(); app.save(); submitPartial();
    speech.stop();
    app._wasRunning = true;
  } else {
    if (!app._wasRunning) return;
    app._wasRunning = false;
    logEvent('return');
    const b = document.getElementById('tab-warning-banner');
    if (b) b.classList.remove('hidden');
    app.startTimer();
  }
});
window.addEventListener('beforeunload', () => {
  if (app.studentName && PHASES.indexOf(app.phase) > PHASES.indexOf('start') && app.phase !== 'end') {
    logEvent('close'); app.save(); submitPartial();
  }
});

/* ── BOOT ───────────────────────────────────────────── */
buildCover();
buildStart();
attachSpeakers(document.getElementById('start-screen'));
drawRail();
app.tickTimer();
