-- ============================================================
-- Mini Z and Me — Supabase Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================


-- STEP 1: Create the activities table
-- ============================================================
CREATE TABLE activities (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  age           SMALLINT    NOT NULL CHECK (age >= 0 AND age <= 7),
  title         TEXT        NOT NULL,
  emoji         TEXT        NOT NULL,
  color         TEXT        NOT NULL,
  area          TEXT        NOT NULL,
  subject       TEXT        NOT NULL DEFAULT 'General',
  duration      TEXT        NOT NULL,
  materials     TEXT[]      NOT NULL DEFAULT '{}',
  steps         TEXT[]      NOT NULL DEFAULT '{}',
  prior_stage   TEXT        NOT NULL,
  prior_desc    TEXT        NOT NULL,
  safety        TEXT,
  ease_of_prep  SMALLINT    CHECK (ease_of_prep BETWEEN 1 AND 10),
  is_custom     BOOLEAN     DEFAULT FALSE,
  user_id       UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- STEP 2: Enable Row Level Security
-- ============================================================
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Anyone (even logged-out visitors) can read curated activities
CREATE POLICY "Curated activities are public"
  ON activities FOR SELECT
  USING (user_id IS NULL);

-- Logged-in users can read their own custom activities
CREATE POLICY "Users can read own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Logged-in users can save their own custom activities
CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());


-- STEP 3: Seed the 13 curated activities
-- ============================================================
INSERT INTO activities (age, title, emoji, color, area, subject, duration, materials, steps, prior_stage, prior_desc, safety, ease_of_prep, is_custom) VALUES

(0, 'High-Contrast Mobile Watching', '🖤', '#ff6fa3', 'Visual development', 'Science', '5–10 min',
  ARRAY['Black & white printed cards', 'Soft mat or play gym', 'Cushion for tummy time'],
  ARRAY['Lay baby on their back or tummy on a soft mat.', 'Hold the high-contrast card 20–30 cm above their face.', 'Slowly move the card left and right and watch their eyes track it.', 'Swap cards every minute to keep their attention.'],
  'Newborn (0–3 months)',
  'Builds on a newborn''s natural preference for bold edges. At this earlier stage, even just dimmed lighting and your face were the main visual stimulation.',
  'Always supervise. Never leave printed cards within reach of baby''s mouth.',
  9, false),

(0, 'Treasure Basket Texture Touch', '🧺', '#ff9a3c', 'Sensory · Fine motor', 'Sensory Play', '10 min',
  ARRAY['Shallow basket', 'Wooden spoon', 'Soft fabric scrap', 'Crinkly paper', 'Silicone whisk', 'Cool metal teether'],
  ARRAY['Sit baby supported on the floor.', 'Place the basket within easy reach.', 'Let baby choose, mouth and explore each item at their own pace.', 'Name each texture as they touch it: soft, cold, crinkly.'],
  'Newborn (0–3 months)',
  'Earlier, sensory input came mostly from being held and skin-to-skin contact. The basket extends this into self-directed touch exploration.',
  'All items must be larger than baby''s fist (no choking hazards). Always supervise.',
  8, false),

(1, 'Pots & Pans Orchestra', '🥁', '#ff9a3c', 'Music · Cause & effect', 'Arts & Crafts', '15 min',
  ARRAY['2–3 metal pots', 'Wooden spoon', 'Plastic bowl', 'Optional metal whisk'],
  ARRAY['Sit on the kitchen floor with child.', 'Demonstrate one tap on a pot, then pause.', 'Hand them the spoon and let them experiment.', 'Copy their rhythm back to model turn-taking.'],
  'Baby (0–12 months)',
  'Earlier, the focus was on listening and being sung to. Now the child becomes the music maker — a huge leap in agency and cause-and-effect understanding.',
  'Use lightweight pans. Stay close to prevent fingers from being caught.',
  9, false),

(1, 'Posting Box', '📮', '#ffd43b', 'Fine motor · Problem solving', 'Maths', '10–15 min',
  ARRAY['Cardboard box', 'Slot cut in the top', 'Large wooden discs or jar lids', 'Small basket to refill'],
  ARRAY['Show the child how one disc goes into the slot.', 'Cheer when they hear it drop inside.', 'Open the box together to reveal the treasure.', 'Refill and repeat — they will want to do it many times.'],
  'Baby (6–12 months)',
  'Builds on object permanence games like peek-a-boo. The child is now ready to actively cause objects to disappear and reappear.',
  'Ensure discs are at least 4 cm wide so they cannot be swallowed.',
  7, false),

(2, 'Water Sensory Play', '💧', '#4dc3ff', 'Sensory · Fine motor', 'Sensory Play', '20–30 min',
  ARRAY['Shallow tub or tray', 'Warm water (1–2 cm deep)', 'Cups and small jugs', 'Sponge or wash cloth', 'Floating toys', 'Towel for the floor'],
  ARRAY['Lay a towel down to catch splashes.', 'Fill the tub with a small amount of warm water.', 'Show pouring from cup to cup, then let them lead.', 'Add bubbles or food colouring for variation.'],
  '1 year — Wobbler',
  'At one, water play was about splashing in the bath and feeling wet/dry. Now they are ready to use containers and pour with purpose — building wrist control and early volume concepts.',
  'Never leave a child unsupervised near water, even shallow water.',
  8, false),

(2, 'Sticker Faces', '😀', '#ff6fa3', 'Fine motor · Early literacy', 'Arts & Crafts', '15 min',
  ARRAY['Large round stickers', 'Paper plate', 'Crayons'],
  ARRAY['Draw a big circle on the plate.', 'Help them peel stickers and place them as eyes/nose.', 'Talk about each feature as they add it.', 'Draw a smile together at the end.'],
  '1 year — Wobbler',
  'Previously the child enjoyed pointing to face parts on you. Now they can begin reconstructing a face — early symbolic thinking.',
  'Use stickers larger than 3 cm to avoid them being put in the mouth and swallowed.',
  9, false),

(2, 'Dough Squish Tray', '🍪', '#5ed9b1', 'Sensory · Fine motor', 'Sensory Play', '20 min',
  ARRAY['Soft play dough', 'Rolling pin', 'Cookie cutters', 'Plastic knife'],
  ARRAY['Set up dough on a wipeable surface.', 'Show squishing, rolling, pinching.', 'Add cutters once they are interested.', 'Encourage them to name the shapes.'],
  '1 year — Wobbler',
  'Earlier, hand strength came from squishing food at mealtimes. Dough extends this into a longer, intentional sensory play.',
  'Use taste-safe dough. Supervise so it isn''t eaten in large amounts.',
  8, false),

(3, 'Rainbow Rice Scoop', '🌈', '#a37cf0', 'Sensory · Maths', 'Sensory Play', '30 min',
  ARRAY['Dyed dry rice (food colouring + vinegar)', 'Large tray', 'Scoops, funnels, small jars', 'Spoons'],
  ARRAY['Pour rice into the tray.', 'Demonstrate scooping into a jar.', 'Encourage filling, pouring, and counting scoops.', 'Hide small toys for them to find.'],
  '2 years — Tiny explorer',
  'At two, water play introduced pouring. Rice is the next step — solid but flowing, so it builds the same skill with a different sensory profile and less mess control.',
  'Not suitable if child still mouths objects. Supervise closely.',
  6, false),

(3, 'Nature Treasure Hunt', '🍂', '#5ed9b1', 'Outdoor · Vocabulary', 'Outdoor', '30–45 min',
  ARRAY['Small basket or paper bag', 'Printable picture list (leaf, stone, feather, stick)', 'Magnifying glass (optional)'],
  ARRAY['Walk to a garden or park together.', 'Show them the picture list.', 'Hunt for each item and tick it off.', 'Lay treasures out at home and talk about each one.'],
  '2 years — Tiny explorer',
  'Two-year-olds enjoyed naming things they saw outside. The hunt adds a goal and sequence — strengthening memory and category words.',
  'Teach children not to taste anything found outside. Wash hands after.',
  8, false),

(4, 'Letter Sound Hop', '🔤', '#4dc3ff', 'Phonics · Gross motor', 'Writing', '20 min',
  ARRAY['Chalk or paper plates', 'Marker', 'Open space'],
  ARRAY['Write letters on plates and place them on the floor.', 'Call out a sound — child hops to that letter.', 'Switch roles: child calls the sound for you.', 'Use only sounds they recognise to keep it fun.'],
  '3 years — Curious kid',
  'At three, the focus was on hearing rhymes and singing the alphabet. Now they can map sounds to written letters — the first big phonics step.',
  'Make sure the play space is clear of trip hazards.',
  8, false),

(4, 'Pretend Post Office', '✉️', '#ff9a3c', 'Literacy · Imaginative play', 'Writing', '30–45 min',
  ARRAY['Old envelopes', 'Paper', 'Crayons', 'Stickers as stamps', 'Cardboard box as postbox'],
  ARRAY['Set up a writing desk and postbox.', 'Help child write a letter (scribbles count!).', 'Fold, stamp, address, and post.', 'Be the postie and deliver back to them.'],
  '3 years — Curious kid',
  'Three-year-olds enjoyed mark-making for its own sake. Now writing has a purpose — communication — which is the seed of literacy.',
  'Use child-safe scissors only with supervision.',
  7, false),

(5, 'Build a Bridge Challenge', '🌉', '#a37cf0', 'STEM · Problem solving', 'Science', '30–60 min',
  ARRAY['Paper cups', 'Lolly sticks', 'Tape', 'A small toy car to test', 'Books to act as supports'],
  ARRAY['Set up two books as river banks about 20cm apart.', 'Challenge: build a bridge the car can cross.', 'Test designs and let them fail and rebuild.', 'Talk about what made the strongest design.'],
  '4 years — Pre-schooler',
  'At four, building was about stacking and balancing. Now they can hold a design goal in mind across multiple attempts — early engineering thinking.',
  'Supervise use of tape and sticks. Keep small parts away from younger siblings.',
  6, false),

(5, 'Story Stones', '📖', '#ff6fa3', 'Literacy · Imagination', 'Writing', '25 min',
  ARRAY['8–10 smooth stones', 'Permanent markers', 'Cloth bag'],
  ARRAY['Draw a different picture on each stone (sun, dog, house...).', 'Place all stones in the bag.', 'Pull out three and make up a story using them.', 'Take turns adding a sentence each.'],
  '4 years — Pre-schooler',
  'Four-year-olds loved being told stories. At five, they can construct one themselves with a beginning, middle and end — a huge leap in narrative thinking.',
  'Ensure markers are dry before play. Stones should be smooth-edged.',
  7, false);
