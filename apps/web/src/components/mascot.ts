/**
 * Central Mascot Registry for Lingual (LingLing Cow Mascot)
 * Maps 34 semantic poses to their transparent PNG assets in /mascot/
 */

export const MASCOT_REGISTRY = {
  // Core Study & Skills
  studying: '/mascot/cow_gen_studying.png',
  listening: '/mascot/cow_gen_headphones.png',
  headphones: '/mascot/cow_gen_headphones.png',
  mic: '/mascot/cow_gen_mic.png',
  speaking: '/mascot/cow_gen_mic.png',
  writing: '/mascot/cow_gen_writing.png',
  magnify: '/mascot/cow_gen_magnify.png',
  graduation: '/mascot/cow_gen_graduation.png',

  // Thinking & Expressions
  thinking: '/mascot/cow_gen_thinking.png',
  facepalm: '/mascot/cow_gen_facepalm.png',
  shrug: '/mascot/cow_gen_shrug.png',
  pointYou: '/mascot/cow_gen_point_you.png',
  laughTease: '/mascot/cow_gen_laugh_tease.png',
  dizzy: '/mascot/cow_gen_dizzy.png',
  shocked: '/mascot/cow_shocked.png',
  shyApologetic: '/mascot/cow_shy_apologetic.png',
  coolSerious: '/mascot/cow_cool_serious.png',
  sternCrossed: '/mascot/cow_stern_crossed.png',
  angryHandsHips: '/mascot/cow_angry_hands_hips.png',
  angryRun: '/mascot/cow_angry_run.png',
  sleeping: '/mascot/cow_sleeping.png',

  // Celebrations & Emotions
  trophy: '/mascot/cow_gen_trophy.png',
  thumbsup: '/mascot/cow_gen_thumbsup.png',
  proud: '/mascot/cow_gen_proud.png',
  flex: '/mascot/cow_gen_flex.png',
  party: '/mascot/cow_gen_party.png',
  cheersSoda: '/mascot/cow_cheers_soda.png',
  dance: '/mascot/cow_gen_dance.png',
  heart: '/mascot/cow_gen_heart.png',
  roseGift: '/mascot/cow_rose_gift.png',

  // Difficulties & Calming
  tear: '/mascot/cow_gen_tear.png',
  cryingUpset: '/mascot/cow_crying_upset.png',
  meditate: '/mascot/cow_gen_meditate.png',
  stretch: '/mascot/cow_gen_stretch.png',

  // Activities & Games
  stopwatch: '/mascot/cow_gen_stopwatch.png',
  juggle: '/mascot/cow_gen_juggle.png',

  // Legacy compatibility aliases
  greet: '/mascot/cow_greet_heart.png',
  salute: '/mascot/cow_salute.png',
  wink: '/mascot/cow_wink_kiss.png',
  hands_on_hips: '/mascot/cow_angry_hands_hips.png',
  cry: '/mascot/cow_gen_tear.png',
  run: '/mascot/cow_angry_run.png',
  bubble: '/mascot/lingling_waving_bubble.png',
} as const;

export type MascotPose = keyof typeof MASCOT_REGISTRY;

export function getMascotUrl(pose: MascotPose | string): string {
  if (pose in MASCOT_REGISTRY) {
    return MASCOT_REGISTRY[pose as MascotPose];
  }
  return MASCOT_REGISTRY.studying;
}

export default MASCOT_REGISTRY;
