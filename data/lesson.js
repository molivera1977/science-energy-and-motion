/* ═══════════════════════════════════════════════════════
   LESSON 1.2 — ENERGY AND MOTION
   Grade 4 Science · Quarter 1 · Unit 1 "Motion: Car Crashes"
   NGSS 4-PS3-1

   The big question, the three "I can" lines and the words are the district's
   (Q1 Science Unit Plan and Scope and Sequence, SY 2025-2026) and Discovery
   Education's Concept 1.2. What the district keeps of that concept, day by
   day, is in the lesson folder:
   Science 1.2 - Energy and Motion/district sources/discovery-ed-concept-1-2-notes.md

   THE SHAPE (Marcos 10/12/2026): three days that follow the DISTRICT's cut of
   the Discovery lesson ("the district has shortened what discovery does to
   fit the 2 or 3 day schedule"), not Discovery's 13-day model.
     Day 1  district days 1-2 (Activities 1-6): what energy is, stored energy
            and moving energy, the words                       <- BUILT
     Day 2  district days 3-4 (Activities 7-11): energy changes form and is
            never lost                                         <- not built
     Day 3  district days 5-8 (Activities 12, 13, 17, 18 and the exit
            ticket): sort by kind of energy, review            <- not built
   Day 1 is a 35-minute period at most (a Wednesday or a Thursday), so it is
   much shorter than Lesson 1.1's Day 1 and it has NO test: the district's
   concept has no measuring investigation. The roller coaster tests and the
   claim-evidence-reasoning explanation are parked until Marcos says.
═══════════════════════════════════════════════════════ */

/* How many days of this lesson exist yet. The stop at the end of the last
   built day has no way on: it saves and says to close the computer. */
window.DAYS_BUILT = 1;

/* ══════════════════════════════════════════════════════
   WHAT MR. O JUST SHOWED YOU

   The bridge from the teacher-led minutes into the screen. Every line
   matches a step in the lesson plan's teach sequence and names the thing
   Mr. O DID, because a student who has forgotten the idea often still
   remembers the video or the chair.

   Day 1's teacher-led part is the district's own first day: the roller
   coaster video (Activity 2), the walk round the room to find things that
   use energy (Activity 3), and the chair pushed across the floor
   (Activity 6).
═══════════════════════════════════════════════════════ */
window.RECAP = {
  day1: {
    lead: 'Mr. O just showed you three things. Here are the three things again, so ' +
          'you can look back while you work.',
    items: [
      { t: 'A roller coaster goes slowly up a tall hill. Then the roller coaster goes down very fast.',
        d: 'Remember the video. A <dfn>roller coaster</dfn> is a ride at a park. A little train of cars rolls on a track with tall hills.' },
      { t: 'Things in our room use energy.',
        d: 'Remember the energy walk. The lights use energy. The clock uses energy. The pencil sharpener uses energy. Your body uses energy too.' },
      { t: '<dfn>Energy</dfn> is what makes things move or change.',
        d: 'Remember the chair. Mr. O pushed the chair across the floor. Mr. O used energy to move the chair.' }
    ],
    now: 'Next, you find out <b>where a moving thing gets energy</b>.'
  }
};

/* The things the lesson talks about that are not science terms. A child who
   has never been on a roller coaster cannot follow a page about one. */
window.THING_WORDS = {
  'roller coaster':
          { def: 'a ride at a park. A little train of cars rolls on a track with tall hills',
            ex: 'The cars go slowly up the first hill. Then the cars go down very fast. ' +
                'After the first hill, nothing pushes the cars. The cars roll all the way to the end.' },
  hill:   { def: 'a high part of the ground or of a track. You go up one side and down the other side',
            ex: 'A sledding hill in winter. The tall part of a roller coaster track. The top of a slide is like the top of a hill.' },
  track:  { def: 'the path the roller coaster cars roll on',
            ex: 'Like train tracks. The wheels of the cars stay on the track the whole ride.' },
  object: { def: 'a thing',
            ex: 'A ball. A chair. A roller coaster car. Anything you can touch and move is an object.' },
  speed:  { def: 'how fast a thing goes',
            ex: 'A kid who runs has more speed than a kid who walks. A car on the highway has more speed than a bike.' },
  'stored energy':
          { def: 'energy that is saved up and ready to use. The science name is potential energy',
            ex: 'A roller coaster car at the top of a hill. A ball on a high shelf. You, at the top of the slide.' },
  'moving energy':
          { def: 'the energy of a thing that is moving. The science name is kinetic energy',
            ex: 'A roller coaster car rolling down a hill. A ball that falls. You, going down the slide.' }
};

/* The words the METHOD uses. Day 1 has no test, so there is no "trial" or
   "average" yet; the day a test is added, its method words go here. */
window.METHOD_WORDS = {};

/* ══════════════════════════════════════════════════════
   THE PLAN — today in full, the later days as one short step

   Marcos 10/11: "preview yes, go through whole plan no." qa.js C28 keeps the
   preview short.
═══════════════════════════════════════════════════════ */
window.INTRO_PLAN = {
  head: 'What you do, which day',
  days: [
    { label: 'Day 1 &mdash; today', tests: [
      { art: 'words', t: 'Three new words',
        d: 'Learn the science names for stored energy and moving energy.' },
      { art: 'high', t: 'Which thing has more stored energy?',
        d: 'Look at a thing that is high up and a thing that is low down.' } ] }
  ],
  later: { art: 'later', label: 'On the next two days',
    text: '<b>Day 2</b>: energy can change, and energy is never lost. ' +
          '<b>Day 3</b>: you sort things by the kind of energy each thing has. Then you answer the last questions.' },
  everyHead: 'On every page',
  every: [
    { art: 'listen', t: 'Listen to each part', d: 'Press Listen and hear the whole part. Then the next part opens.' },
    { art: 'look',   t: 'Look at the picture', d: 'Every part has a picture. The picture shows what the words say.' },
    { art: 'check',  t: 'Answer the questions', d: 'After each part you answer two or three questions about that part.' }
  ],
  calm: 'Take your time. This lesson takes three days.'
};

/* ══════════════════════════════════════════════════════
   WHY SHOULD YOU CARE — three things from their own lives, each tied to the
   day they will learn about that thing.
═══════════════════════════════════════════════════════ */
window.CARE = [
  { art: 'slide', test: 'You will learn about this today',
    t: 'The slide at the park',
    d: 'You climb up high. Then you go down fast. Why do you go so fast at the bottom of the slide?' },
  { art: 'hands', test: 'You will learn about this on Day 2',
    t: 'Rubbing your hands together',
    d: 'Rub your hands fast and your hands get warm. Where does the warm come from?' },
  { art: 'lunch', test: 'You will learn about this on Day 3',
    t: 'The food you eat',
    d: 'Your lunch has energy in the food. That energy lets you run at recess.' }
];

/* ══════════════════════════════════════════════════════
   MEET THE ROLLER COASTER — the thing this lesson thinks with

   Lesson 1.1 had a cart to push. This lesson has a roller coaster to LOOK
   at: the district's own anchor (Discovery shows the roller coaster video at
   the start of the concept and again at the end). Three pages, one idea
   each: what a roller coaster is, why we look at one, and how the roller
   coaster gives the answer to the big question.

   "Stored energy" and "moving energy" are the plain names, taught here with
   the picture. The science names (potential, kinetic) come in the word
   section right after, each tied back to the plain name.
═══════════════════════════════════════════════════════ */
window.TOOL = { word: 'roller coaster', title: 'Meet the roller coaster', about: 'the roller coaster' };
window.TOOL_PAGES = [
  { scene: 'coaster',
    tiles: [
      { art: 'coaster', t: 'This is a roller coaster',
        d: 'A <dfn>roller coaster</dfn> is a ride at a park. A little train of cars rolls on a <dfn>track</dfn>. A track is the path the cars roll on. The track goes up tall hills and down again.' },
      { art: 'chain', t: 'The cars have no motor',
        d: 'A chain pulls the cars up the first <dfn>hill</dfn>. A hill is a high part of the track. After the first hill, nothing pushes the cars. The cars roll all the way to the end of the ride.' } ] },
  { head: 'Why we look at a roller coaster', scene: 'top',
    tiles: [
      { art: 'why', t: 'We have a question to answer',
        d: 'How do moving objects get energy? An <dfn>object</dfn> is a thing. A roller coaster car is an object that moves very fast. So where does the car get energy?' },
      { art: 'top', t: 'At the top of the hill, the car is still',
        d: 'The car is not moving yet. But the car is high up and ready to roll down. The car has <dfn>stored energy</dfn>. Stored energy is energy that is saved up and ready to use.' },
      { art: 'down', t: 'Going down the hill, the car moves',
        d: 'Now the car is moving fast. A thing that moves has <dfn>moving energy</dfn>. Moving energy is the energy of a thing that is moving.' } ] },
  { head: 'How the roller coaster gives us the answer', scene: 'change',
    tiles: [
      { art: 'change', t: 'Stored energy turns into moving energy',
        d: 'The car rolls down the hill. The stored energy of the car changes into moving energy. That is where the car gets the energy to move.' },
      { art: 'two', t: 'Two questions to ask about any object',
        d: 'Question 1: Is the object moving? Then the object has moving energy. Question 2: Is the object still, but ready to move? Then the object has stored energy.' } ] }
];

/* ══════════════════════════════════════════════════════
   A PAGE-SET INSIDE THE LESSON — taught, then checked

   Lesson 1.1 put a test after the words. This lesson's Day 1 puts a short
   set of teaching pages there, built the same way as Meet the roller
   coaster: one idea to a page, a picture at the top, each point a step that
   has to be heard. The questions that follow are in CHECKS (questions.js).

   `high` is the district's Activity 5: the higher thing has more potential
   energy, and potential energy turns into kinetic energy on the way down.
   The district's picture is four acrobats; a slide and a shelf are things
   every child in the room has seen.
═══════════════════════════════════════════════════════ */
window.LEARN = {
  high: {
    title: 'More stored energy, less stored energy', rail: 'High and low',
    pages: [
      { head: 'Higher up means more potential energy', scene: 'slides',
        tiles: [
          { art: 'slides', t: 'Two slides, two kids',
            d: 'One slide is tall. One slide is short. A kid sits still at the top of each slide.' },
          { art: 'tall', t: 'The kid on the tall slide has more potential energy',
            d: 'The kid on the tall slide is higher up. Higher up means more stored energy. So the kid on the tall slide has more potential energy.' },
          { art: 'fast', t: 'More potential energy makes more kinetic energy',
            d: 'Both kids go down. The kid on the tall slide goes faster at the bottom. How fast a thing goes is called <dfn>speed</dfn>. More kinetic energy means more speed.' } ] },
      { head: 'Gravity turns potential energy into kinetic energy', scene: 'shelf',
        tiles: [
          { art: 'shelf', t: 'A ball sits still on a high shelf',
            d: 'The ball is not moving. The ball is high up. So the ball has potential energy.' },
          { art: 'fall', t: 'The ball rolls off the shelf',
            d: 'Gravity pulls the ball down. The ball falls fast. Now the ball has kinetic energy.' },
          { art: 'floor', t: 'On the floor, the ball stops',
            d: 'The ball is low down and still. Where did the energy of the ball go? You find out on Day 2.' } ] }
    ]
  }
};

/* ══════════════════════════════════════════════════════
   THE STOP AT THE END OF A DAY

   What you did, what comes next time (one short thing: a preview, not the
   plan), then "ask Mr. O". Day 1's stop is the end of what is built
   (DAYS_BUILT), so for now there is no way on from it.
══════════════════════════════════════════════════════ */
window.DAY_GATES = {
  daygate: {
    day: 1, head: 'Nice work. You finished Day 1.',
    did: 'Today you learned three new words: potential energy, kinetic energy and work. ' +
         'You found out that a thing that is higher up has more potential energy.',
    nextLabel: 'Next time',
    next: [
      'You find out <b>where energy goes</b> when a moving thing stops. Mr. O will show you first.'
    ],
    recap: 'day2', go: 'Start Day 2 &rarr;'
  }
};

window.LESSON = {
  unit:   'Unit 1 · Motion: Car Crashes',
  title:  'Energy and Motion',
  code:   'Lesson 1.2',
  days:   '7 science sessions',
  ngss:   ['4-PS3-1'],

  /* Discovery's question for the whole concept ("Can You Explain?"). The
     Unit Plan words the same idea as "Where does the energy to move objects
     come from?" */
  driving: 'How do moving objects get energy?',

  /* The three "I can" lines in student words; the district's wording is kept
     below for planning. Same three objectives, same order. */
  icanKid: [
    'find the kinds of energy an object has.',
    'tell if an object has stored energy or moving energy, and say how I know.',
    'use what I see to explain that energy is never lost. Energy only changes.'
  ],
  /* one picture for each "I can" line, in the same order (names in data/art.js) */
  icanArt: ['look', 'two', 'change'],

  icanDistrict: [
    'investigate the forms of energy in a system or for an object.',
    'apply logical reasoning to predict the types of energy for an object.',
    'cite evidence to explain how energy is conserved.'
  ],

  /* WORDS ALREADY TAUGHT GET A REMINDER, NOT A PAGE (Marcos 10/11). `met`
     puts a word on one short reminder page, said as the one sentence in
     `short`. Energy is explained on What we just talked about. Gravity and
     force come from Lesson 1.1 (`from`), and this lesson uses both, so each
     is explained again here, in one line, before the page that uses the word.

     The three new words are the district's: work (week 2 of the Scope and
     Sequence), kinetic energy and potential energy (week 3). Each new word
     is tied to the plain name the roller coaster pages already taught. */
  vocab: [
    { word: 'energy',  es: 'energ&iacute;a', def: 'what makes things move or change',
      met: true, short: '<dfn>Energy</dfn> is what makes things move or change.',
      ex: 'The food you ate at lunch, which lets you run at recess. The battery in a toy. The gas in a car. Take any of those away and the thing stops working.' },
    { word: 'force',   es: 'fuerza',   def: 'a push or a pull on an object',
      met: true, from: 'Lesson 1.1', short: 'A <dfn>force</dfn> is a push or a pull on an object.',
      ex: 'Pushing a shopping cart at the store. Pulling the classroom door open. Kicking a ball.' },
    { word: 'gravity', es: 'gravedad', def: 'the force that pulls objects down toward Earth',
      met: true, from: 'Lesson 1.1', short: '<dfn>Gravity</dfn> is the force that pulls objects down toward Earth.',
      ex: 'A dropped pencil hits the floor. Rain falls down and never up. A ball comes back down after you throw the ball.' },

    { word: 'potential energy', es: 'energ&iacute;a potencial', def: 'stored energy. Energy that an object has saved up, ready to use',
      ex: 'A roller coaster car at the top of a hill. A ball on a high shelf. You, at the top of the slide. Each one is still. Each one is ready to move. Scientists call that stored energy potential energy.' },
    { word: 'kinetic energy',   es: 'energ&iacute;a cin&eacute;tica', def: 'moving energy. The energy an object has because the object is moving',
      ex: 'A roller coaster car rolling down a hill. A ball that falls off a shelf. You, going down the slide. Each one is moving. Scientists call that moving energy kinetic energy. A faster object has more kinetic energy.' },
    { word: 'work',             es: 'trabajo', def: 'what happens when a force moves an object',
      ex: 'Mr. O pushes a chair across the floor. The push is a force. The chair moves. So Mr. O did work on the chair. Doing work takes energy.' }
  ]
};
