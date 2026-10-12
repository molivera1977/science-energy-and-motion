/* ═══════════════════════════════════════════════════════
   LESSON 1.2 — ENERGY AND MOTION · the questions

   SKILL TAGS say what each question is testing. A tag is saved with every
   missed question so the teacher dashboard can rank skills (Focus next /
   Strongest). Every skill rolls up to NGSS 4-PS3-1.

   IDs are E01, E02, ... — ONE prefix letter for the whole lesson, because the
   dashboard's skill report filters a site's questions by the first letter of
   the id.

   FEEDBACK lives on each question as `why`, so a renumber carries the
   feedback along with the question (in Lesson 1.1 a separate feedback table
   once fell out of step and questions showed another question's feedback).

   Day 1 (built):  E01-E03 what we talked about · E04-E05 the roller coaster ·
                   E06-E07 the plan · E08-E10 word check · E11-E13 high and low
   Day 2, Day 3:   not written yet
═══════════════════════════════════════════════════════ */
window.SKILLS = {
  E01: 'What energy is',            E02: 'Energy and speed',
  E03: 'What energy is',
  E04: 'Stored or moving energy',   E05: 'Stored energy changes to moving energy',
  E06: 'Know the plan',             E07: 'Know the plan',
  E08: 'Potential energy',          E09: 'Kinetic energy',
  E10: 'Work',
  E11: 'Higher means more potential energy',
  E12: 'Gravity changes potential to kinetic energy',
  E13: 'Energy and speed'
};

/* ── UNDERSTANDING CHECKS ──────────────────────────────
   Marcos 10/11: "I want the pattern for all Science lessons to have frequent
   understanding checks." A check is two or three questions asked RIGHT AFTER
   the thing the questions are about. CHECKS (below) says which list belongs
   to which check and which page the check comes right `after`; qa.js C27
   holds the pattern.

   The three checks before the name page (sumq, toolq, planq) are answered
   before the lesson knows who the student is; the answers go with the
   student at "Start the lesson". */

/* What we just talked about shows three things; one question for each.
   Nothing here may use a word the page has not explained. */
window.SUM_Q = [
  { id:'E01',
    why: "Energy is what makes things move or change. Mr. O used energy to push the chair across the floor.",
    q:'What makes things move or change?',
    opts:['A color','Energy','A name','A shadow'], a:1 },
  { id:'E02',
    why: "The roller coaster went slowly up the tall hill. Then the roller coaster went down the hill very fast.",
    q:'In the video, when did the roller coaster go the <b>fastest</b>?',
    opts:['Going up the tall hill','Sitting still at the top of the hill','Going down the tall hill','Before the ride started'], a:2 },
  { id:'E03',
    why: "Your body uses energy to run and play. The lights, the clock and the pencil sharpener use energy too.",
    q:'On the energy walk we found things that use energy. Which one uses energy?',
    opts:['The lights in our room','The color of the wall','The sign on the door','The shadow of a desk'], a:0 }
];

/* Meet the roller coaster: stored energy at the top, moving energy on the way
   down, and the change from one to the other. */
window.TOOL_Q = [
  { id:'E04',
    why: "The car is still, but the car is high up and ready to roll down. Energy that is saved up and ready to use is stored energy.",
    q:'The roller coaster car sits still at the top of the tall hill. What kind of energy does the car have?',
    opts:['Moving energy','Stored energy','No energy at all','Sound energy'], a:1 },
  { id:'E05',
    why: "Going down the hill, the stored energy of the car changes into moving energy. That is where the car gets the energy to move.",
    q:'The car rolls down the hill. What happens to the <b>stored energy</b> of the car?',
    opts:['The stored energy changes into moving energy','The stored energy is gone forever','The stored energy stays the same','The stored energy turns into a chain'], a:0 }
];

/* Here is the plan: what today holds, and what a student does on every page. */
window.PLAN_Q = [
  { id:'E06',
    why: "Today you learn three new words. Two of the words are the science names for stored energy and moving energy.",
    q:'What do you learn <b>today</b>?',
    opts:['The science names for stored energy and moving energy','How to build a roller coaster','How to fix a clock','The names of the planets'], a:0 },
  { id:'E07',
    why: "After each part you answer two or three questions. The questions are about the part you just heard.",
    q:'What do you do after you listen to each part?',
    opts:['Close the computer','Answer two or three questions about that part','Start the lesson over','Pick a new name'], a:1 }
];

/* ── WORD CHECK ────────────────────────────────────────
   `word` says which word a question checks. The word check asks the three
   words that get a page of their own (potential energy, kinetic energy,
   work) and none of the reminder words (qa.js C29). */
window.VOCAB_Q = [
  { id:'E08', word:'potential energy',
    why: "Potential energy is stored energy. A ball on a high shelf is still, but the ball is ready to fall. That ball has potential energy.",
    q:'What is <b>potential energy</b>?',
    opts:['Energy that is stored and ready to use','The energy of an object that is moving','A push or a pull','A kind of hill'], a:0 },
  { id:'E09', word:'kinetic energy',
    why: "Kinetic energy is moving energy. Any object that moves has kinetic energy.",
    q:'A ball rolls fast across the floor. The rolling ball has <b>kinetic energy</b>. Why?',
    opts:['Because the ball is round','Because the ball is moving','Because the ball is on the floor','Because the ball is small'], a:1 },
  { id:'E10', word:'work',
    why: "A force moved an object. That is work. Doing work takes energy.",
    q:'Mr. O pushes a chair. The chair moves across the floor. What did Mr. O do to the chair?',
    opts:['Potential energy','Gravity','Work','Nothing'], a:2 }
];

/* High and low (LEARN.high in lesson.js) — the district's Activity 5: which
   one has the most potential energy, and what happens next. E13 is the
   standard itself, in a child's terms: more energy, more speed. */
window.HIGH_Q = [
  { id:'E11',
    why: "The kid on the tallest slide is the highest up. Higher up means more potential energy.",
    q:'Three kids sit at the top of three slides. Which kid has the <b>most potential energy</b>?',
    opts:['The kid on the shortest slide','The kid on the middle slide','The kid on the tallest slide','All three kids have the same potential energy'], a:2 },
  { id:'E12',
    why: "Gravity is the force that pulls objects down toward Earth. Gravity pulls the ball down, and the potential energy of the ball changes into kinetic energy.",
    q:'A ball rolls off a high shelf and falls. What pulls the ball down?',
    opts:['Speed','Gravity','The shelf','Nothing pulls the ball'], a:1 },
  { id:'E13',
    why: "The kid on the tall slide starts with more potential energy. More potential energy changes into more kinetic energy. More kinetic energy means more speed.",
    q:'Two kids go down two slides. One slide is tall. One slide is short. Which kid has more <b>speed</b> at the bottom?',
    opts:['The kid on the tall slide','The kid on the short slide','Both kids have the same speed','Neither kid moves'], a:0 }
];

window.CHECKS = {
  sumq:  { title:'What we talked about', about:'what we talked about', after:'summary', bank:'SUM_Q' },
  toolq: { title:'Roller coaster check', about:'the roller coaster',   after:'tool',    bank:'TOOL_Q' },
  planq: { title:'Plan check',           about:'the plan',             after:'plan',    bank:'PLAN_Q' },
  highq: { title:'High and low',         about:'high and low',         after:'high',    bank:'HIGH_Q' }
};
