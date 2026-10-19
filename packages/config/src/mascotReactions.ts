/**
 * Lingual Official Cow Mascot Reaction Config
 * Central mapping of UI events to public mascot reaction stickers.
 */

export const mascotReactions = {
  greet: '/mascot/cow_greet_heart.png',
  celebrate_big: '/mascot/cow_wink_kiss.png',
  confirm: '/mascot/cow_salute.png',
  challenge: '/mascot/cow_hands_on_hips.png',
  loading: '/mascot/cow_run_side.png',
  wrong_mild: '/mascot/cow_cry_soft.png',
  wrong_severe: '/mascot/cow_cry_hard.png',
  streak_urgent: '/mascot/cow_jump_angry.png',
  focus_mode: '/mascot/cow_serious_closeup.png',
  relax_done: '/mascot/cow_lying_relaxed.png',
  idle_empty: '/mascot/cow_lying_curled.png',
  farewell: '/mascot/cow_back_view.png',
} as const;

export type MascotReactionKey = keyof typeof mascotReactions;

export function getMascotReaction(key: MascotReactionKey): string {
  return mascotReactions[key] || mascotReactions.greet;
}
