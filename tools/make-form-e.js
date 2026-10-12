/* ═══════════════════════════════════════════════════════
   MAKES data/form_e.js — the answer key the teacher dashboard reads.

   Run it after ANY change to a question, a choice or a feedback line:

       node tools/make-form-e.js

   The dashboard fetches data/form_e.js to show the choices behind a missed
   question, and counts every id in its own table as a question the student
   was asked. So the key has to hold EXACTLY the questions the lesson asks,
   in the lesson's words. It is made from the lesson's own files here, never
   typed, and qa.js C27 fails if the key and the lesson differ.

   Not part of the site: the lesson does not load this file or the key.
   Plain Node, nothing to install.
═══════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

/* read the lesson's data the way a browser does: each file sets window.X */
const window = {};
['data/lesson.js', 'data/questions.js'].forEach(f =>
  new Function('window', fs.readFileSync(path.join(root, f), 'utf8'))(window));

/* the questions the lesson asks, in the order a student meets them: the
   opening checks, the word check, then the check after each page-set, day
   by day. (script.js works the same order out as PHASES.) */
const built = Math.max(1, window.DAYS_BUILT || 1);
const checkAfter = page => Object.keys(window.CHECKS).find(p => window.CHECKS[p].after === page);
const order = [];
['summary', 'tool', 'plan'].forEach(page => { if (checkAfter(page)) order.push(checkAfter(page)); });
if ((window.VOCAB_Q || []).length) order.push('vq');
for (let d = 1; d <= built; d++)
  Object.keys(window.LEARN || {}).filter(k => (window.LEARN[k].day || 1) === d)
    .forEach(k => { if (checkAfter(k)) order.push(checkAfter(k)); });
/* the last questions are asked only once every day the data knows about is built (script.js, PHASES) */
const lastDay = Math.max(built, ...Object.keys(window.LEARN || {}).map(k => window.LEARN[k].day || 1),
                         ...Object.keys(window.DAY_GATES || {}).map(g => window.DAY_GATES[g].day || 1));
if ((window.EXIT_Q || []).length && built >= lastDay) order.push('exit');

const bankOf = p => p === 'vq' ? window.VOCAB_Q : p === 'exit' ? window.EXIT_Q : (window[window.CHECKS[p].bank] || []);
const titleOf = p => p === 'vq' ? 'Word check' : p === 'exit' ? 'Exit ticket' : window.CHECKS[p].title;

const rows = [];
order.forEach(p => bankOf(p).forEach(x => rows.push({
  id: x.id, section: titleOf(p), q: x.q, choices: x.opts, answer: x.opts[x.a], explanation: x.why
})));

const ids = rows.map(r => r.id);
if (new Set(ids).size !== ids.length) throw new Error('a question id is used twice: ' + ids.join(' '));

const line = r => '  { id:' + JSON.stringify(r.id) + ', section:' + JSON.stringify(r.section) + ', q:' + JSON.stringify(r.q) +
  ', choices:' + JSON.stringify(r.choices) + ', answer:' + JSON.stringify(r.answer) + ', explanation:' + JSON.stringify(r.explanation) + ' }';

const out =
`/* ═══════════════════════════════════════════════════════
   FORM E — every scored question in ${window.LESSON.code}, ${window.LESSON.title}
   (${ids[0]} to ${ids[ids.length - 1]}, ${rows.length} questions), in the order a student meets them.

   MADE BY tools/make-form-e.js FROM data/questions.js. Do not edit by hand:
   change the question in data/questions.js and run the tool again.
   qa.js C27 fails if this file and the lesson differ.

   The teacher dashboard fetches this file to show the answer choices
   behind a missed question. It is NOT loaded by the lesson itself.
═══════════════════════════════════════════════════════ */
window.FORM_E = [
${rows.map(line).join(',\n')}
];
`;
fs.writeFileSync(path.join(root, 'data/form_e.js'), out);
console.log('data/form_e.js: ' + rows.length + ' questions (' + ids.join(' ') + ')');
