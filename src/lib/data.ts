export type AgeKey = 0 | 1 | 2 | 3 | 4 | 5;

export type AgeGroup = {
  age: AgeKey;
  label: string;
  sub: string;
  emoji: string;
  color: string;
};

export type PriorStage = {
  stage: string;
  desc: string;
};

export type Activity = {
  id: string | number;
  age: AgeKey;
  title: string;
  emoji: string;
  color: string;
  area: string;
  subject?: string;
  duration: string;
  materials: string[];
  steps: string[];
  prior: PriorStage;
  safety?: string;
  easeOfPrep?: number;
  isCustom?: boolean;
};

export type Child = {
  id: string;
  name: string;
  age: AgeKey;
};

export const AGES: AgeGroup[] = [
  { age: 0, label: "0 years", sub: "Baby", emoji: "👶", color: "#c97a6b" },        // dusty rose
  { age: 1, label: "1 year", sub: "Wobbler", emoji: "🍼", color: "#d4a949" },      // mustard
  { age: 2, label: "2 years", sub: "Tiny explorer", emoji: "🧸", color: "#b85a40" }, // clay
  { age: 3, label: "3 years", sub: "Curious kid", emoji: "🎨", color: "#8ba888" },  // sage
  { age: 4, label: "4 years", sub: "Pre-schooler", emoji: "🚀", color: "#7a93a6" }, // dusty blue
  { age: 5, label: "5 years", sub: "Little learner", emoji: "📚", color: "#6b7a4f" }, // olive
];

export function mapActivityFromDB(row: Record<string, unknown>): Activity {
  return {
    id: row.id as string,
    age: row.age as AgeKey,
    title: row.title as string,
    emoji: row.emoji as string,
    color: row.color as string,
    area: row.area as string,
    subject: row.subject as string | undefined,
    duration: row.duration as string,
    materials: row.materials as string[],
    steps: row.steps as string[],
    prior: {
      stage: row.prior_stage as string,
      desc: row.prior_desc as string,
    },
    safety: (row.safety as string) || undefined,
    easeOfPrep: row.ease_of_prep as number | undefined,
    isCustom: row.is_custom as boolean | undefined,
  };
}

// ---- REMOVE AFTER DB IS SEEDED (kept as fallback during transition) ----
export const ACTIVITIES: Activity[] = [
  {
    id: 1, age: 0, title: "High-Contrast Mobile Watching", emoji: "🖤", color: "#ff6fa3",
    area: "Visual development", duration: "5–10 min",
    materials: ["Black & white printed cards", "Soft mat or play gym", "Cushion for tummy time"],
    steps: [
      "Lay baby on their back or tummy on a soft mat.",
      "Hold the high-contrast card 20–30 cm above their face.",
      "Slowly move the card left and right and watch their eyes track it.",
      "Swap cards every minute to keep their attention.",
    ],
    prior: {
      stage: "Newborn (0–3 months)",
      desc: "Builds on a newborn's natural preference for bold edges. At this earlier stage, even just dimmed lighting and your face were the main visual stimulation.",
    },
    safety: "Always supervise. Never leave printed cards within reach of baby's mouth.",
  },
  {
    id: 2, age: 0, title: "Treasure Basket Texture Touch", emoji: "🧺", color: "#ff9a3c",
    area: "Sensory · Fine motor", duration: "10 min",
    materials: ["Shallow basket", "Wooden spoon", "Soft fabric scrap", "Crinkly paper", "Silicone whisk", "Cool metal teether"],
    steps: [
      "Sit baby supported on the floor.",
      "Place the basket within easy reach.",
      "Let baby choose, mouth and explore each item at their own pace.",
      "Name each texture as they touch it: 'soft', 'cold', 'crinkly'.",
    ],
    prior: {
      stage: "Newborn (0–3 months)",
      desc: "Earlier, sensory input came mostly from being held and skin-to-skin contact. The basket extends this into self-directed touch exploration.",
    },
    safety: "All items must be larger than baby's fist (no choking hazards). Always supervise.",
  },
  {
    id: 3, age: 1, title: "Pots & Pans Orchestra", emoji: "🥁", color: "#ff9a3c",
    area: "Music · Cause & effect", duration: "15 min",
    materials: ["2–3 metal pots", "Wooden spoon", "Plastic bowl", "Optional metal whisk"],
    steps: [
      "Sit on the kitchen floor with child.",
      "Demonstrate one tap on a pot, then pause.",
      "Hand them the spoon and let them experiment.",
      "Copy their rhythm back to model turn-taking.",
    ],
    prior: {
      stage: "Baby (0–12 months)",
      desc: "Earlier, the focus was on listening and being sung to. Now the child becomes the music maker — a huge leap in agency and cause-and-effect understanding.",
    },
    safety: "Use lightweight pans. Stay close to prevent fingers from being caught.",
  },
  {
    id: 4, age: 1, title: "Posting Box", emoji: "📮", color: "#ffd43b",
    area: "Fine motor · Problem solving", duration: "10–15 min",
    materials: ["Cardboard box", "Slot cut in the top", "Large wooden discs or jar lids", "Small basket to refill"],
    steps: [
      "Show the child how one disc goes into the slot.",
      "Cheer when they hear it drop inside.",
      "Open the box together to reveal the 'treasure'.",
      "Refill and repeat — they will want to do it many times.",
    ],
    prior: {
      stage: "Baby (6–12 months)",
      desc: "Builds on object permanence games like peek-a-boo. The child is now ready to actively cause objects to 'disappear' and reappear.",
    },
    safety: "Ensure discs are at least 4 cm wide so they cannot be swallowed.",
  },
  {
    id: 5, age: 2, title: "Water Sensory Play", emoji: "💧", color: "#4dc3ff",
    area: "Sensory · Fine motor", duration: "20–30 min",
    materials: ["Shallow tub or tray", "Warm water (1–2 cm deep)", "Cups and small jugs", "Sponge or wash cloth", "Floating toys", "Towel for the floor"],
    steps: [
      "Lay a towel down to catch splashes.",
      "Fill the tub with a small amount of warm water.",
      "Show pouring from cup to cup, then let them lead.",
      "Add bubbles or food colouring for variation.",
    ],
    prior: {
      stage: "1 year — Wobbler",
      desc: "At one, water play was about splashing in the bath and feeling wet/dry. Now they are ready to use containers and pour with purpose — building wrist control and early volume concepts.",
    },
    safety: "Never leave a child unsupervised near water, even shallow water.",
  },
  {
    id: 6, age: 2, title: "Sticker Faces", emoji: "😀", color: "#ff6fa3",
    area: "Fine motor · Early literacy", duration: "15 min",
    materials: ["Large round stickers", "Paper plate", "Crayons"],
    steps: [
      "Draw a big circle on the plate.",
      "Help them peel stickers and place them as eyes/nose.",
      "Talk about each feature as they add it.",
      "Draw a smile together at the end.",
    ],
    prior: {
      stage: "1 year — Wobbler",
      desc: "Previously the child enjoyed pointing to face parts on you. Now they can begin reconstructing a face — early symbolic thinking.",
    },
    safety: "Use stickers larger than 3 cm to avoid them being put in the mouth and swallowed.",
  },
  {
    id: 7, age: 2, title: "Dough Squish Tray", emoji: "🍪", color: "#5ed9b1",
    area: "Sensory · Fine motor", duration: "20 min",
    materials: ["Soft play dough", "Rolling pin", "Cookie cutters", "Plastic knife"],
    steps: [
      "Set up dough on a wipeable surface.",
      "Show squishing, rolling, pinching.",
      "Add cutters once they are interested.",
      "Encourage them to name the shapes.",
    ],
    prior: {
      stage: "1 year — Wobbler",
      desc: "Earlier, hand strength came from squishing food at mealtimes. Dough extends this into a longer, intentional sensory play.",
    },
    safety: "Use taste-safe dough. Supervise so it isn't eaten in large amounts.",
  },
  {
    id: 8, age: 3, title: "Rainbow Rice Scoop", emoji: "🌈", color: "#a37cf0",
    area: "Sensory · Maths", duration: "30 min",
    materials: ["Dyed dry rice (food colouring + vinegar)", "Large tray", "Scoops, funnels, small jars", "Spoons"],
    steps: [
      "Pour rice into the tray.",
      "Demonstrate scooping into a jar.",
      "Encourage filling, pouring, and counting scoops.",
      "Hide small toys for them to find.",
    ],
    prior: {
      stage: "2 years — Tiny explorer",
      desc: "At two, water play introduced pouring. Rice is the next step — solid but flowing, so it builds the same skill with a different sensory profile and less mess control.",
    },
    safety: "Not suitable if child still mouths objects. Supervise closely.",
  },
  {
    id: 9, age: 3, title: "Nature Treasure Hunt", emoji: "🍂", color: "#5ed9b1",
    area: "Outdoor · Vocabulary", duration: "30–45 min",
    materials: ["Small basket or paper bag", "Printable picture list (leaf, stone, feather, stick)", "Magnifying glass (optional)"],
    steps: [
      "Walk to a garden or park together.",
      "Show them the picture list.",
      "Hunt for each item and tick it off.",
      "Lay treasures out at home and talk about each one.",
    ],
    prior: {
      stage: "2 years — Tiny explorer",
      desc: "Two-year-olds enjoyed naming things they saw outside. The hunt adds a goal and sequence — strengthening memory and category words.",
    },
    safety: "Teach 'look but don't taste'. Wash hands after.",
  },
  {
    id: 10, age: 4, title: "Letter Sound Hop", emoji: "🔤", color: "#4dc3ff",
    area: "Phonics · Gross motor", duration: "20 min",
    materials: ["Chalk or paper plates", "Marker", "Open space"],
    steps: [
      "Write letters on plates and place them on the floor.",
      "Call out a sound — child hops to that letter.",
      "Switch roles: child calls the sound for you.",
      "Use only sounds they recognise to keep it fun.",
    ],
    prior: {
      stage: "3 years — Curious kid",
      desc: "At three, the focus was on hearing rhymes and singing the alphabet. Now they can map sounds to written letters — the first big phonics step.",
    },
    safety: "Make sure the play space is clear of trip hazards.",
  },
  {
    id: 11, age: 4, title: "Pretend Post Office", emoji: "✉️", color: "#ff9a3c",
    area: "Literacy · Imaginative play", duration: "30–45 min",
    materials: ["Old envelopes", "Paper", "Crayons", "Stickers as 'stamps'", "Cardboard box as postbox"],
    steps: [
      "Set up a writing desk and postbox.",
      "Help child 'write' a letter (scribbles count!).",
      "Fold, stamp, address, and post.",
      "Be the postie and deliver back to them.",
    ],
    prior: {
      stage: "3 years — Curious kid",
      desc: "Three-year-olds enjoyed mark-making for its own sake. Now writing has a purpose — communication — which is the seed of literacy.",
    },
    safety: "Use child-safe scissors only with supervision.",
  },
  {
    id: 12, age: 5, title: "Build a Bridge Challenge", emoji: "🌉", color: "#a37cf0",
    area: "STEM · Problem solving", duration: "30–60 min",
    materials: ["Paper cups", "Lolly sticks", "Tape", "A small toy car to test", "Books to act as supports"],
    steps: [
      "Set up two books as 'river banks' about 20cm apart.",
      "Challenge: build a bridge the car can cross.",
      "Test designs and let them fail and rebuild.",
      "Talk about what made the strongest design.",
    ],
    prior: {
      stage: "4 years — Pre-schooler",
      desc: "At four, building was about stacking and balancing. Now they can hold a design goal in mind across multiple attempts — early engineering thinking.",
    },
    safety: "Supervise use of tape and sticks. Keep small parts away from younger siblings.",
  },
  {
    id: 13, age: 5, title: "Story Stones", emoji: "📖", color: "#ff6fa3",
    area: "Literacy · Imagination", duration: "25 min",
    materials: ["8–10 smooth stones", "Permanent markers", "Cloth bag"],
    steps: [
      "Draw a different picture on each stone (sun, dog, house...).",
      "Place all stones in the bag.",
      "Pull out three and make up a story using them.",
      "Take turns adding a sentence each.",
    ],
    prior: {
      stage: "4 years — Pre-schooler",
      desc: "Four-year-olds loved being told stories. At five, they can construct one themselves with a beginning, middle and end — a huge leap in narrative thinking.",
    },
    safety: "Ensure markers are dry before play. Stones should be smooth-edged.",
  },
];

type KeywordTemplate = {
  emoji: string;
  area: string;
  color: string;
  materials: string[];
  steps: string[];
  safety: string;
};

const KEYWORDS: Record<string, KeywordTemplate> = {
  water:    { emoji: "💧", area: "Sensory · Fine motor", color: "#4dc3ff",
              materials: ["Shallow tub or tray", "Warm water", "Cups and jugs", "Sponge", "Floating toys", "Towel"],
              steps: ["Lay a towel to catch splashes.", "Fill the tub with a small amount of warm water.", "Demonstrate pouring, then let the child explore.", "Add bubbles or food colouring to extend the play."],
              safety: "Never leave a child unsupervised near water." },
  sensory:  { emoji: "✋", area: "Sensory · Exploration", color: "#a37cf0",
              materials: ["Large tray", "Filler (rice, pasta, dried oats)", "Scoops and small containers", "Hidden small toys"],
              steps: ["Pour the filler into the tray.", "Demonstrate scooping and pouring.", "Hide toys for them to find.", "Talk about textures and sounds together."],
              safety: "Avoid small fillers if child still mouths objects." },
  messy:    { emoji: "🎨", area: "Sensory · Creativity", color: "#ff6fa3",
              materials: ["Old shirt or apron", "Wipeable tray", "Shaving foam or yogurt paint", "Spoons and brushes"],
              steps: ["Set up over a wipeable floor.", "Squirt foam onto the tray.", "Let child swirl, scoop and squish.", "Add colour drops to mix."],
              safety: "Use taste-safe materials for under-3s." },
  paint:    { emoji: "🖌️", area: "Creativity · Fine motor", color: "#ff9a3c",
              materials: ["Non-toxic paint", "Thick paper", "Chunky brushes", "Apron", "Wipeable mat"],
              steps: ["Tape paper down so it doesn't slide.", "Offer one colour at a time.", "Let them explore brush, fingers, sponges.", "Display the artwork to celebrate."],
              safety: "Use only certified non-toxic paint." },
  music:    { emoji: "🎵", area: "Music · Auditory", color: "#ffd43b",
              materials: ["Pots and wooden spoons", "Shaker (rice in a sealed bottle)", "Music to play along to"],
              steps: ["Set up instruments on the floor.", "Start a steady beat together.", "Take turns leading the rhythm.", "Add singing or movement."],
              safety: "Tape shaker lids securely shut." },
  outdoor:  { emoji: "🌳", area: "Outdoor · Gross motor", color: "#5ed9b1",
              materials: ["Small basket", "Comfortable shoes", "Weather-suitable clothes", "Picture checklist"],
              steps: ["Walk to a green space together.", "Look for natural items on the list.", "Collect, observe and name each one.", "Lay them out at home to talk about."],
              safety: "Teach 'look but don't taste'. Wash hands after." },
  nature:   { emoji: "🍃", area: "Outdoor · Vocabulary", color: "#5ed9b1",
              materials: ["Magnifying glass", "Basket", "Notebook", "Pencil"],
              steps: ["Choose a small patch of garden or park.", "Look closely at one square of ground.", "Talk about every plant, bug or stone.", "Draw or describe what you saw."],
              safety: "Avoid stinging plants and wash hands afterwards." },
  dough:    { emoji: "🍪", area: "Sensory · Fine motor", color: "#5ed9b1",
              materials: ["Soft play dough", "Rolling pin", "Cookie cutters", "Plastic knife"],
              steps: ["Set out dough on a wipeable surface.", "Show squishing, rolling, pinching.", "Add cutters and tools.", "Encourage shape and colour naming."],
              safety: "Use taste-safe dough; supervise so it isn't eaten in large amounts." },
  book:     { emoji: "📖", area: "Literacy · Imagination", color: "#a37cf0",
              materials: ["A favourite picture book", "Cosy cushion", "Soft toy audience"],
              steps: ["Snuggle up together.", "Read slowly, pointing to pictures.", "Pause and ask 'what's next?'.", "Let them re-tell the story to a soft toy."],
              safety: "" },
  story:    { emoji: "📖", area: "Literacy · Imagination", color: "#a37cf0",
              materials: ["Story prompts on cards", "Paper and crayons", "Comfortable space"],
              steps: ["Pull a prompt at random.", "Build a story together one sentence each.", "Draw a scene from the story.", "Re-tell it at bedtime."],
              safety: "" },
  number:   { emoji: "🔢", area: "Maths · Early numeracy", color: "#ffd43b",
              materials: ["Counters (buttons, pasta, pom-poms)", "Number cards 1–10", "Small bowls"],
              steps: ["Lay out number cards in order.", "Ask child to put the right number of counters by each.", "Count together out loud.", "Mix the cards and repeat."],
              safety: "Avoid small counters with under-3s." },
  counting: { emoji: "🔢", area: "Maths · Early numeracy", color: "#ffd43b",
              materials: ["10 chunky counters", "Egg box or muffin tin", "Number cards 1–10"],
              steps: ["Pop a number card next to each section.", "Count counters into each.", "Mix the cards and repeat.", "Try counting backwards as a challenge."],
              safety: "Choose chunky counters for under-3s." },
  letter:   { emoji: "🔤", area: "Phonics · Early literacy", color: "#4dc3ff",
              materials: ["Paper plates with letters", "Marker", "Open floor space"],
              steps: ["Lay letter plates on the floor.", "Call out a sound, child hops to the letter.", "Switch roles so they call sounds for you.", "Stick to letters they already know."],
              safety: "Clear trip hazards from the play area." },
  phonics:  { emoji: "🔤", area: "Phonics · Early literacy", color: "#4dc3ff",
              materials: ["Object basket (apple, ball, cup...)", "Letter cards"],
              steps: ["Pick an object from the basket.", "Say its first sound and find the matching letter.", "Make a silly sentence with the sound.", "Swap roles."],
              safety: "" },
  build:    { emoji: "🧱", area: "STEM · Problem solving", color: "#a37cf0",
              materials: ["Blocks or recycled boxes", "Tape", "Small toy to use as a test"],
              steps: ["Set a challenge — 'a tower taller than teddy'.", "Let the child plan and build.", "Test it. If it falls, talk about why.", "Try a new design together."],
              safety: "Supervise tape and small parts." },
  science:  { emoji: "🔬", area: "STEM · Discovery", color: "#5ed9b1",
              materials: ["Clear jars", "Water", "Drops of food colouring", "Pipette or spoon"],
              steps: ["Fill jars with water.", "Add a different colour to each.", "Mix two colours and predict what happens.", "Record favourites with a drawing."],
              safety: "Food colouring can stain — protect clothes and surfaces." },
  cooking:  { emoji: "🥣", area: "Life skills · Maths", color: "#ff9a3c",
              materials: ["Mixing bowl", "Wooden spoon", "Pre-measured ingredients in cups"],
              steps: ["Wash hands together.", "Pour each cup into the bowl in turn.", "Take turns stirring.", "Talk about what each ingredient does."],
              safety: "Avoid hot surfaces; supervise around any sharp tools." },
  bath:     { emoji: "🛁", area: "Sensory · Routine", color: "#4dc3ff",
              materials: ["Bath", "Cups, jugs, sponges", "Bath crayons (optional)"],
              steps: ["Run a warm, shallow bath.", "Offer one new tool at a time.", "Pour and sponge water across the bath.", "End with a warm towel cuddle."],
              safety: "Never leave a child unattended in the bath." },
};

const AGE_DURATION: Record<AgeKey, string> = {
  0: "5–10 min",
  1: "10–15 min",
  2: "15–25 min",
  3: "20–30 min",
  4: "25–40 min",
  5: "30–45 min",
};

const PRIOR_STAGE: Record<AgeKey, PriorStage> = {
  0: { stage: "Newborn reflexes", desc: "Before this stage, sensory experience came from being held, fed and looked at. This activity is an early step into self-directed exploration." },
  1: { stage: "Baby (0–12 months)", desc: "As a baby, the focus was on watching and being shown. Now the child takes the lead and causes things to happen themselves." },
  2: { stage: "1 year — Wobbler", desc: "At one, the child explored through grabbing and mouthing. Now they can use simple tools with intention, building wrist and finger control." },
  3: { stage: "2 years — Tiny explorer", desc: "Two-year-olds explored textures freely. Now they can follow a simple sequence and start to talk about what they see." },
  4: { stage: "3 years — Curious kid", desc: "At three, play was about doing. Now the child can hold a goal in mind and plan a couple of steps ahead." },
  5: { stage: "4 years — Pre-schooler", desc: "Pre-schoolers loved imaginative play. By five they can layer in rules, sequences and longer narratives — early formal learning skills." },
};

export const SUGGESTIONS: string[] = [
  "Water sensory play for my 2 year old",
  "Messy paint exploration for my 3 year old",
  "Letter sound game for my 4 year old",
  "Music and rhythm play for my 1 year old",
  "Bridge building challenge for my 5 year old",
  "Nature treasure hunt for my 3 year old",
];

export function generateActivity(prompt: string, age: AgeKey): Activity {
  const lower = prompt.toLowerCase();
  let match: KeywordTemplate | null = null;
  let matchedWord: string | null = null;

  for (const word of Object.keys(KEYWORDS)) {
    if (lower.includes(word)) {
      match = KEYWORDS[word];
      matchedWord = word;
      break;
    }
  }

  if (!match) {
    match = {
      emoji: "✨",
      area: "Open exploration",
      color: "#a37cf0",
      materials: ["Whatever your child is drawn to today", "A clear, safe play space", "Open mind and a few minutes"],
      steps: [
        "Set out 2–3 interesting items on the floor.",
        "Follow your child's lead — don't direct.",
        "Narrate what they do: 'you're stacking', 'you're shaking'.",
        "Stop when they lose interest, not before.",
      ],
      safety: "",
    };
    matchedWord = "play";
  }

  const cleaned = prompt.trim().replace(/\.$/, "");
  let title: string;
  if (cleaned.length > 0 && cleaned.length < 60) {
    title = cleaned
      .replace(/^(i want to |i'd like to |create |make )+/i, "")
      .replace(/\bfor my .*$/i, "")
      .trim();
    title = title.charAt(0).toUpperCase() + title.slice(1);
    if (!title) title = (matchedWord ?? "play").charAt(0).toUpperCase() + (matchedWord ?? "play").slice(1) + " play";
  } else {
    title = (matchedWord ?? "play").charAt(0).toUpperCase() + (matchedWord ?? "play").slice(1) + " play";
  }

  return {
    id: "custom-" + Date.now(),
    age,
    title,
    emoji: match.emoji,
    color: match.color,
    area: match.area,
    duration: AGE_DURATION[age],
    materials: match.materials,
    steps: match.steps,
    prior: PRIOR_STAGE[age],
    safety: match.safety,
    isCustom: true,
  };
}
