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
  E13: 'Energy and speed',

  /* Day 2 */
  E14: 'Energy changes form',       E15: 'Energy is never lost',
  E16: 'Energy moves between objects',
  E17: 'Kinds of stored energy',    E18: 'Energy changes form',
  E19: 'Kinds of stored energy',

  /* Day 3 */
  E20: 'Energy changes form',       E21: 'Kinds of stored energy',
  E22: 'Potential energy',          E23: 'Kinetic energy',
  E24: 'Potential energy',
  E25: 'Energy and speed',          E26: 'More energy goes higher',
  E27: 'Energy and speed',          E28: 'Stored energy changes to moving energy',
  E29: 'Energy moves between objects', E30: 'Energy is never lost',
  E31: 'Energy changes form',

  /* added when the days were evened out */
  E32: 'Energy moves between objects', E33: 'Energy moves between objects',
  E34: 'Potential energy',          E35: 'Potential and kinetic energy together',
  E36: 'Energy and speed',
  E37: 'Energy moves between objects', E38: 'Energy and speed',
  E39: 'Ask a question you can test'
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

/* ── DAY 2 ─────────────────────────────────────────────
   NOT ASKED until DAYS_BUILT (lesson.js) reaches 2: a check runs only when
   the page-set it comes after is in the lesson.

   Never lost: the hands, the ball on the floor, and energy passing from one
   object to another. E15 and E16 carry the wrong idea the district's quarter
   assessment uses as a wrong choice: that the energy disappears. */
window.NEVER_Q = [
  { id:'E14',
    why: "Rubbing changes kinetic energy into thermal energy. Thermal energy is heat. That is why your hands feel warm.",
    q:'You rub your hands together fast. Your hands get warm. What happened to the <b>kinetic energy</b> of your hands?',
    opts:['The kinetic energy changed into thermal energy','The kinetic energy went away forever','The kinetic energy turned into a ball','Nothing happened to the kinetic energy'], a:0 },
  { id:'E15',
    why: "Energy is never lost. When the ball hit the floor, the energy of the ball changed into sound and heat.",
    q:'A ball falls and stops on the floor. Where did the energy of the ball go?',
    opts:['The energy is gone forever','The energy changed into sound and heat','The energy went back up to the shelf','The ball never had energy'], a:1 },
  { id:'E16',
    why: "Energy moved from the rolling ball to the still ball. Energy is never made. Energy only changes or moves.",
    q:'A rolling ball hits a still ball. The still ball starts to roll. Why?',
    opts:['The still ball made new energy','The floor gave energy to the still ball','The rolling ball gave energy to the still ball','The energy disappeared'], a:2 }
];

/* Kinds of energy: chemical energy, one change of form, and stored energy
   that has nothing to do with height. */
window.FORMS_Q = [
  { id:'E17',
    why: "A battery has chemical energy stored inside. Food has chemical energy stored inside too.",
    q:'Which one has <b>chemical energy</b> stored inside?',
    opts:['A shadow','A color','A battery','A sound'], a:2 },
  { id:'E18',
    why: "In a flashlight, the chemical energy of the battery changes into light. Light is a kind of energy.",
    q:'You turn on a flashlight. The chemical energy in the battery changes into what?',
    opts:['A hill','Light','A rubber band','Nothing'], a:1 },
  { id:'E19',
    why: "The rubber band is still, but the rubber band is ready to snap. Energy that is stored and ready to use is potential energy.",
    q:'You pull a rubber band back and hold the rubber band still. What kind of energy does the rubber band have?',
    opts:['Potential energy','Kinetic energy','Thermal energy','No energy at all'], a:0 }
];

/* Heat (Day 2): the district's progress measure for this lesson, the order
   in which heat moves to cook noodles. */
window.HEAT_Q = [
  { id:'E32',
    why: "The heat starts at the stove. The heat moves from the stove to the pan, then to the water, then to the noodles.",
    q:'You cook noodles in a pan of water on the stove. Which one gets hot <b>first</b>?',
    opts:['The noodles','The water','The pan','The top of the stove'], a:3 },
  { id:'E33',
    why: "Thermal energy moves from one object to the next object: the stove, the pan, the water, the noodles.",
    q:'How does the heat get from the stove to the noodles?',
    opts:['The heat jumps over the pan and the water','The heat moves from the stove to the pan, then to the water, then to the noodles','The noodles make the heat','The heat comes from the spoon'], a:1 }
];

/* ── DAY 3 ─────────────────────────────────────────────
   NOT ASKED until DAYS_BUILT reaches 3.

   Fuel: Discovery's two questions on the engine reading (Activity 12). */
window.FUEL_Q = [
  { id:'E20',
    why: "The engine burns the gas. The chemical energy in the gas changes into kinetic energy, and the car moves.",
    q:'What does the engine of a car do with the chemical energy in gas?',
    opts:['The engine changes the chemical energy into kinetic energy','The engine makes the chemical energy disappear','The engine turns the chemical energy into a hill','The engine does nothing with the chemical energy'], a:0 },
  { id:'E21',
    why: "Food is the fuel of your body. Gas is the fuel of a car. Food and gas both have chemical energy stored inside.",
    q:'How is the food you eat like the gas in a car?',
    opts:['Food and gas are both made of metal','Food and gas are both fuel, with chemical energy stored inside','Food and gas are both a kind of hill','Food and gas have no energy'], a:1 }
];

/* Sort: three of the six situations in Discovery's Activity 13, each decided
   with the two questions. */
window.SORT_Q = [
  { id:'E22',
    why: "The car is still, but the car is high up and ready to roll. That is potential energy.",
    q:'A car is parked at the top of a hill. The car is not moving. What kind of energy does the car have?',
    opts:['Kinetic energy','Potential energy','Sound','No energy at all'], a:1 },
  { id:'E23',
    why: "The car is moving. An object that is moving has kinetic energy.",
    q:'A car rolls down a long hill. What kind of energy does the moving car have?',
    opts:['Kinetic energy','No energy at all','Only light','Only sound'], a:0 },
  { id:'E24',
    why: "The energy in the battery is stored and ready to use. Stored energy is potential energy. The stored energy inside a battery is chemical energy.",
    q:'A battery sits on a shelf in a store. Nobody is using the battery. What kind of energy does the battery have?',
    opts:['Kinetic energy','Light','Potential energy','No energy at all'], a:2 }
];

/* Both: Discovery's Activity 17 (winter sports). Still and high up; moving
   and high up; and when a skater has the most kinetic energy. */
window.BOTH_Q = [
  { id:'E34',
    why: "The sled is still, so the sled has no kinetic energy yet. The sled is high up, so the sled has potential energy.",
    q:'A sled sits still at the top of a snowy hill. Which one is true?',
    opts:['The sled has potential energy and no kinetic energy yet','The sled has only kinetic energy','The sled has no energy at all','The sled has only sound'], a:0 },
  { id:'E35',
    why: "The skater is moving and the skater is high up. An object that moves has kinetic energy. An object that is high up has potential energy.",
    q:'A skater is in the middle of a high jump. What kinds of energy does the skater have?',
    opts:['Only potential energy','Only kinetic energy','Both potential energy and kinetic energy','No energy at all'], a:2 },
  { id:'E36',
    why: "Kinetic energy is the energy of moving. The faster the skater moves, the more kinetic energy the skater has.",
    q:'When does a skater have the <b>most kinetic energy</b>?',
    opts:['When the skater stands still','When the skater moves the fastest','When the skater sits down','When the skater ties a skate'], a:1 }
];

/* Bump: what the district's quarter assessment asks most. Energy passes from
   one object to another object; more speed, more energy passed along; and
   which question about a bump could be tested. */
window.BUMP_Q = [
  { id:'E37',
    why: "The toy car had kinetic energy. In the bump, the toy car gave energy to the block, so the block moved.",
    q:'A toy car rolls into a block. The block moves. What does this show?',
    opts:['The block made new energy','The toy car gave energy to the block','The energy went away','The block was moving before the bump'], a:1 },
  { id:'E38',
    why: "A faster toy car has more kinetic energy. More kinetic energy moves the block farther.",
    q:'You want the block to move <b>farther</b>. What should the toy car do?',
    opts:['Roll faster into the block','Roll slower into the block','Stop before the block','Roll away from the block'], a:0 },
  { id:'E39',
    why: "A good science question is a question you can test. You can roll one ball into another ball and watch what happens.",
    q:'You want to learn about energy when objects bump. Which question could you test?',
    opts:['What color is the ball?','How long is the room?','What happens to a still ball when a rolling ball hits the still ball?','What is the name of the table?'], a:2 }
];

/* How much energy: speed, and the district's own swing question. */
window.MEASURE_Q = [
  { id:'E25',
    why: "A faster object has more kinetic energy. More speed means more kinetic energy.",
    q:'Two balls roll across the floor. One ball is fast. One ball is slow. Which ball has more <b>kinetic energy</b>?',
    opts:['The slow ball','The fast ball','Both balls have the same kinetic energy','Neither ball has kinetic energy'], a:1 },
  { id:'E26',
    why: "A harder push gives the swing more energy. More energy sends the swing higher.",
    q:'You push one swing gently. You push another swing very hard. What happens?',
    opts:['The swing pushed hard has more energy and goes higher','Both swings go the same height','The swing pushed gently goes higher','Both swings stop right away'], a:0 }
];

/* ── EXIT TICKET ───────────────────────────────────────
   The last questions of the lesson (Discovery's Activity 18, the review).
   E27 is the district's Exit Ticket for Lesson 1.2, "Describe the ways you
   can measure the energy of something moving fast?", as a pick: this class
   builds answers by picking, not by typing. E31 is the big question.

   The engine adds the exit ticket and the end screen only when every day
   written in LEARN is built (DAYS_BUILT in lesson.js), so this list waits
   until Day 3 is in. Day 3 has no stop of its own: the lesson ends at the
   end screen. */
window.EXIT_Q = [
  { id:'E27',
    why: "Speed tells you about energy. A faster object has more kinetic energy.",
    q:'Which one is a way to tell how much energy a moving object has?',
    opts:['Look at the color of the object','Look at how fast the object goes','Look at the name of the object','Look at the day of the week'], a:1 },
  { id:'E28',
    why: "At the top of the hill the car has potential energy. Going down, the potential energy changes into kinetic energy.",
    q:'A roller coaster car sits still at the top of a hill. Then the car rolls down. What happens to the energy of the car?',
    opts:['Potential energy changes into kinetic energy','Kinetic energy changes into potential energy','The energy disappears','Nothing changes'], a:0 },
  { id:'E29',
    why: "Energy is never lost. The energy moved from the first toy car to the second toy car.",
    q:'Two toy cars bump. One toy car stops. The other toy car starts to roll. What happened to the energy?',
    opts:['The energy disappeared','The toy cars made new energy','The energy moved from one toy car to the other toy car','The energy turned into a color'], a:2 },
  { id:'E30',
    why: "Conservation of energy is the rule that energy is never made and never lost. Energy only changes from one kind to another kind, or moves to another object.",
    q:'What does <b>conservation of energy</b> mean?',
    opts:['Energy runs out after one day','Energy is never made and never lost. Energy only changes or moves','Only cars have energy','All energy is heat'], a:1 },
  { id:'E31',
    why: "Stored energy can change into kinetic energy. Energy can also move from one object to another object. That is how a moving object gets energy.",
    q:'How do moving objects get energy?',
    opts:['From the color of the object','From nowhere. A moving object makes new energy','From the name of the object','From stored energy that changes into kinetic energy, or from another object that gives energy'], a:3 }
];

window.CHECKS = {
  sumq:  { title:'What we talked about', about:'what we talked about', after:'summary', bank:'SUM_Q' },
  toolq: { title:'Roller coaster check', about:'the roller coaster',   after:'tool',    bank:'TOOL_Q' },
  planq: { title:'Plan check',           about:'the plan',             after:'plan',    bank:'PLAN_Q' },
  highq: { title:'High and low',         about:'high and low',         after:'high',    bank:'HIGH_Q' },
  /* Day 2 */
  neverq:   { title:'Never lost',        about:'where energy goes',     after:'never',   bank:'NEVER_Q' },
  formsq:   { title:'Kinds of energy',   about:'the kinds of energy',   after:'forms',   bank:'FORMS_Q' },
  heatq:    { title:'Heat',              about:'how heat moves',        after:'heat',    bank:'HEAT_Q' },
  /* Day 3 */
  fuelq:    { title:'Fuel',              about:'fuel',                  after:'fuel',    bank:'FUEL_Q' },
  sortq:    { title:'Sort',              about:'the two questions',     after:'sort',    bank:'SORT_Q' },
  bothq:    { title:'Both kinds',        about:'both kinds of energy',  after:'both',    bank:'BOTH_Q' },
  measureq: { title:'How much energy',   about:'how much energy',       after:'measure', bank:'MEASURE_Q' },
  bumpq:    { title:'Bump',              about:'what happens in a bump', after:'bump',   bank:'BUMP_Q' }
};
