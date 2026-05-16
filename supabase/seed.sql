-- ============================================================
-- Mini Z and Me, Supabase Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- Safe to re-run: skips creating things that already exist,
-- and wipes old curated activities before reseeding the new ones.
-- (Your users' custom activities are kept untouched.)
-- ============================================================


-- STEP 1: Create the activities table (skipped if it already exists)
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
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


-- STEP 2: Enable Row Level Security and (re)create policies
-- ============================================================
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop the existing policies so we can recreate them cleanly
DROP POLICY IF EXISTS "Curated activities are public" ON activities;
DROP POLICY IF EXISTS "Users can read own activities" ON activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON activities;

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


-- STEP 3: Wipe old curated activities before reseeding
-- ============================================================
-- Only deletes curated entries (user_id IS NULL).
-- Anything users have built themselves is preserved.
DELETE FROM activities WHERE user_id IS NULL;


-- STEP 4: Seed the 13 curated activities
-- ============================================================
INSERT INTO activities (age, title, emoji, color, area, subject, duration, materials, steps, prior_stage, prior_desc, safety, ease_of_prep, is_custom) VALUES

(0, 'High-Contrast Mobile Watching', '🖤', '#ff6fa3', 'Visual development', 'Science', '5–10 min',
  ARRAY['Black & white printed cards', 'Soft mat or play gym', 'Cushion for tummy time'],
  ARRAY['Lay baby on their back or tummy on a soft mat.', 'Hold the high-contrast card 20–30 cm above their face.', 'Slowly move the card left and right and watch their eyes track it.', 'Swap cards every minute to keep their attention.'],
  'Newborn (0–3 months)',
  'Newborns naturally love bold patterns. Until now, dim lighting and your face were the main thing they had to look at.',
  'Always supervise. Never leave printed cards within reach of baby''s mouth.',
  9, false),

(0, 'Treasure Basket Texture Touch', '🧺', '#ff9a3c', 'Sensory · Fine motor', 'Sensory Play', '10 min',
  ARRAY['Shallow basket', 'Wooden spoon', 'Soft fabric scrap', 'Crinkly paper', 'Silicone whisk', 'Cool metal teether'],
  ARRAY['Sit baby supported on the floor.', 'Place the basket within easy reach.', 'Let baby choose, mouth and explore each item at their own pace.', 'Name each texture as they touch it: soft, cold, crinkly.'],
  'Newborn (0–3 months)',
  'Until now, most of baby''s sensory input came from being held and cuddled. The basket lets them go and find textures for themselves.',
  'All items must be larger than baby''s fist (no choking hazards). Always supervise.',
  8, false),

(1, 'Pots & Pans Orchestra', '🥁', '#ff9a3c', 'Music · Cause & effect', 'Arts & Crafts', '15 min',
  ARRAY['2–3 metal pots', 'Wooden spoon', 'Plastic bowl', 'Optional metal whisk'],
  ARRAY['Sit on the kitchen floor with child.', 'Demonstrate one tap on a pot, then pause.', 'Hand them the spoon and let them experiment.', 'Copy their rhythm back to model turn-taking.'],
  'Baby (0–12 months)',
  'They used to just listen while you sang. Now they get to be the music maker, which is a huge step in feeling like they can cause things to happen.',
  'Use lightweight pans. Stay close to prevent fingers from being caught.',
  9, false),

(1, 'Posting Box', '📮', '#ffd43b', 'Fine motor · Problem solving', 'Maths', '10–15 min',
  ARRAY['Cardboard box', 'Slot cut in the top', 'Large wooden discs or jar lids', 'Small basket to refill'],
  ARRAY['Show the child how one disc goes into the slot.', 'Cheer when they hear it drop inside.', 'Open the box together to reveal the treasure.', 'Refill and repeat. They''ll want to do it again and again.'],
  'Baby (6–12 months)',
  'This builds on peek-a-boo. Now they get to be the one making things disappear and come back.',
  'Ensure discs are at least 4 cm wide so they cannot be swallowed.',
  7, false),

(2, 'Water Sensory Play', '💧', '#4dc3ff', 'Sensory · Fine motor', 'Sensory Play', '20–30 min',
  ARRAY['Shallow tub or tray', 'Warm water (1–2 cm deep)', 'Cups and small jugs', 'Sponge or wash cloth', 'Floating toys', 'Towel for the floor'],
  ARRAY['Lay a towel down to catch splashes.', 'Fill the tub with a small amount of warm water.', 'Show pouring from cup to cup, then let them lead.', 'Add bubbles or food colouring for variation.'],
  '1 year, Wobbler',
  'At one, water play meant splashing in the bath and feeling wet or dry. Now they''re ready to use containers and pour with purpose, which builds wrist control and an early sense of volume.',
  'Never leave a child unsupervised near water, even shallow water.',
  8, false),

(2, 'Sticker Faces', '😀', '#ff6fa3', 'Fine motor · Early literacy', 'Arts & Crafts', '15 min',
  ARRAY['Large round stickers', 'Paper plate', 'Crayons'],
  ARRAY['Draw a big circle on the plate.', 'Help them peel stickers and place them as eyes/nose.', 'Talk about each feature as they add it.', 'Draw a smile together at the end.'],
  '1 year, Wobbler',
  'They used to love pointing at the parts of your face. Now they can put together a face of their own, which is early symbolic thinking.',
  'Use stickers larger than 3 cm to avoid them being put in the mouth and swallowed.',
  9, false),

(2, 'Dough Squish Tray', '🍪', '#5ed9b1', 'Sensory · Fine motor', 'Sensory Play', '20 min',
  ARRAY['Soft play dough', 'Rolling pin', 'Cookie cutters', 'Plastic knife'],
  ARRAY['Set up dough on a wipeable surface.', 'Show squishing, rolling, pinching.', 'Add cutters once they are interested.', 'Encourage them to name the shapes.'],
  '1 year, Wobbler',
  'Their hand strength has come from squishing food at mealtimes. Dough turns that into longer, more focused sensory play.',
  'Use taste-safe dough. Supervise so it isn''t eaten in large amounts.',
  8, false),

(3, 'Rainbow Rice Scoop', '🌈', '#a37cf0', 'Sensory · Maths', 'Sensory Play', '30 min',
  ARRAY['Dyed dry rice (food colouring + vinegar)', 'Large tray', 'Scoops, funnels, small jars', 'Spoons'],
  ARRAY['Pour rice into the tray.', 'Demonstrate scooping into a jar.', 'Encourage filling, pouring, and counting scoops.', 'Hide small toys for them to find.'],
  '2 years, Tiny explorer',
  'At two, water play introduced pouring. Rice is the next step. It''s solid but flowy, so it builds the same skills with a totally different feel (and a bit less mess).',
  'Not suitable if child still mouths objects. Supervise closely.',
  6, false),

(3, 'Nature Treasure Hunt', '🍂', '#5ed9b1', 'Outdoor · Vocabulary', 'Outdoor', '30–45 min',
  ARRAY['Small basket or paper bag', 'Printable picture list (leaf, stone, feather, stick)', 'Magnifying glass (optional)'],
  ARRAY['Walk to a garden or park together.', 'Show them the picture list.', 'Hunt for each item and tick it off.', 'Lay treasures out at home and talk about each one.'],
  '2 years, Tiny explorer',
  'Two-year-olds loved naming the things they spotted outside. The hunt adds a goal and a sequence, which stretches memory and category words.',
  'Teach children not to taste anything found outside. Wash hands after.',
  8, false),

(4, 'Letter Sound Hop', '🔤', '#4dc3ff', 'Phonics · Gross motor', 'Writing', '20 min',
  ARRAY['Chalk or paper plates', 'Marker', 'Open space'],
  ARRAY['Write letters on plates and place them on the floor.', 'Call out a sound. The child hops to that letter.', 'Switch roles: child calls the sound for you.', 'Use only sounds they recognise to keep it fun.'],
  '3 years, Curious kid',
  'At three, it was all about rhymes and singing the alphabet. Now they can connect sounds to written letters, which is the first real phonics step.',
  'Make sure the play space is clear of trip hazards.',
  8, false),

(4, 'Pretend Post Office', '✉️', '#ff9a3c', 'Literacy · Imaginative play', 'Writing', '30–45 min',
  ARRAY['Old envelopes', 'Paper', 'Crayons', 'Stickers as stamps', 'Cardboard box as postbox'],
  ARRAY['Set up a writing desk and postbox.', 'Help child write a letter (scribbles count!).', 'Fold, stamp, address, and post.', 'Be the postie and deliver back to them.'],
  '3 years, Curious kid',
  'Three-year-olds loved mark-making just for fun. Now writing has a purpose: getting a message across. That''s the seed of literacy.',
  'Use child-safe scissors only with supervision.',
  7, false),

(5, 'Build a Bridge Challenge', '🌉', '#a37cf0', 'STEM · Problem solving', 'Science', '30–60 min',
  ARRAY['Paper cups', 'Lolly sticks', 'Tape', 'A small toy car to test', 'Books to act as supports'],
  ARRAY['Set up two books as river banks about 20cm apart.', 'Challenge: build a bridge the car can cross.', 'Test designs and let them fail and rebuild.', 'Talk about what made the strongest design.'],
  '4 years, Pre-schooler',
  'At four, building was about stacking and balancing. Now they can hold a plan in their head across several attempts. That''s early engineering thinking.',
  'Supervise use of tape and sticks. Keep small parts away from younger siblings.',
  6, false),

(5, 'Story Stones', '📖', '#ff6fa3', 'Literacy · Imagination', 'Writing', '25 min',
  ARRAY['8–10 smooth stones', 'Permanent markers', 'Cloth bag'],
  ARRAY['Draw a different picture on each stone (sun, dog, house...).', 'Place all stones in the bag.', 'Pull out three and make up a story using them.', 'Take turns adding a sentence each.'],
  '4 years, Pre-schooler',
  'Four-year-olds loved being told stories. At five, they can build one themselves with a beginning, middle and end. That''s a huge leap in storytelling.',
  'Ensure markers are dry before play. Stones should be smooth-edged.',
  7, false);
