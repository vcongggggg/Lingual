/**
 * Raymond Murphy Study Guide Mapping Table for LinguaFlow Placement P2
 * 
 * Maps the 50 theory topics from `grammar_explanations` to canonical Raymond Murphy Units 
 * in English Grammar in Use (5th Edition) via the Raymond Murphy Study Guide.
 * 
 * Metadata only (unit number + canonical unit title + study guide category).
 * ZERO book body content, ZERO questions imported.
 */

export interface MurphySuggestion {
  topic: string;
  unitNumber: number;
  unitTitle: string;
  studyGuideCategory: string;
  deepLink: string;
}

export interface MurphyUnitInfo {
  unitNumber: number;
  unitTitle: string;
  studyGuideCategory: string;
}

export const MURPHY_STUDY_GUIDE_MAP: Record<string, MurphyUnitInfo> = {
  'Present Simple': {
    unitNumber: 2,
    unitTitle: 'Present simple (I do)',
    studyGuideCategory: 'Present and past',
  },
  'Present Continuous': {
    unitNumber: 1,
    unitTitle: 'Present continuous (I am doing)',
    studyGuideCategory: 'Present and past',
  },
  'Past Simple': {
    unitNumber: 5,
    unitTitle: 'Past simple (I did)',
    studyGuideCategory: 'Present and past',
  },
  'Future Simple (will)': {
    unitNumber: 21,
    unitTitle: 'will and shall 1',
    studyGuideCategory: 'Future',
  },
  'Be Going To': {
    unitNumber: 20,
    unitTitle: "I'm going to (do)",
    studyGuideCategory: 'Future',
  },
  'Articles: a / an / the': {
    unitNumber: 72,
    unitTitle: 'a/an and the',
    studyGuideCategory: 'Articles and nouns',
  },
  'Plural Nouns': {
    unitNumber: 79,
    unitTitle: 'Singular and plural',
    studyGuideCategory: 'Articles and nouns',
  },
  'Comparatives': {
    unitNumber: 105,
    unitTitle: 'Comparative 1 (cheaper, more expensive etc.)',
    studyGuideCategory: 'Adjectives and adverbs',
  },
  'Superlatives': {
    unitNumber: 108,
    unitTitle: 'Superlative (the longest, the most enjoyable etc.)',
    studyGuideCategory: 'Adjectives and adverbs',
  },
  'Modal Verbs: can / could': {
    unitNumber: 26,
    unitTitle: 'can, could and (be) able to',
    studyGuideCategory: 'Modals',
  },
  'There is / There are': {
    unitNumber: 84,
    unitTitle: 'there ... and it ...',
    studyGuideCategory: 'Pronouns and determiners',
  },
  'Countable and Uncountable Nouns': {
    unitNumber: 69,
    unitTitle: 'Countable and uncountable 1',
    studyGuideCategory: 'Articles and nouns',
  },
  'Prepositions of Time: in / on / at': {
    unitNumber: 121,
    unitTitle: 'at/on/in (time)',
    studyGuideCategory: 'Prepositions',
  },
  'Adverbs of Frequency': {
    unitNumber: 110,
    unitTitle: 'Word order 2: adverbs with the verb',
    studyGuideCategory: 'Adjectives and adverbs',
  },
  'Possessive Adjectives and Pronouns': {
    unitNumber: 81,
    unitTitle: "-'s (your sister's name) and of ... (the name of the book)",
    studyGuideCategory: 'Articles and nouns',
  },
  'Present Perfect': {
    unitNumber: 7,
    unitTitle: 'Present perfect 1 (I have done)',
    studyGuideCategory: 'Present perfect and past',
  },
  'Past Continuous': {
    unitNumber: 6,
    unitTitle: 'Past continuous (I was doing)',
    studyGuideCategory: 'Present and past',
  },
  'Past Perfect (Introduction)': {
    unitNumber: 15,
    unitTitle: 'Past perfect (I had done)',
    studyGuideCategory: 'Present perfect and past',
  },
  'First Conditional': {
    unitNumber: 38,
    unitTitle: 'if I do ... and if I did ...',
    studyGuideCategory: 'If and wish',
  },
  'Second Conditional': {
    unitNumber: 39,
    unitTitle: 'if I knew ... / I wish I knew ...',
    studyGuideCategory: 'If and wish',
  },
  'Passive Voice (Present and Past)': {
    unitNumber: 42,
    unitTitle: 'Passive 1 (is done / was done)',
    studyGuideCategory: 'Passive',
  },
  'Reported Speech (Statements)': {
    unitNumber: 47,
    unitTitle: 'Reported speech 1 (he said that ...)',
    studyGuideCategory: 'Reported speech',
  },
  'Relative Clauses': {
    unitNumber: 92,
    unitTitle: 'Relative clauses 1: clauses with who/that/which',
    studyGuideCategory: 'Relative clauses',
  },
  'Used To': {
    unitNumber: 18,
    unitTitle: 'used to (do)',
    studyGuideCategory: 'Present perfect and past',
  },
  'Modal Verbs: must / have to / should': {
    unitNumber: 31,
    unitTitle: 'have to and must',
    studyGuideCategory: 'Modals',
  },
  'Gerund vs Infinitive': {
    unitNumber: 53,
    unitTitle: 'Verb + -ing (enjoy doing / stop doing etc.)',
    studyGuideCategory: '-ing and to ...',
  },
  'So and Such': {
    unitNumber: 102,
    unitTitle: 'so and such',
    studyGuideCategory: 'Adjectives and adverbs',
  },
  'Tag Questions': {
    unitNumber: 52,
    unitTitle: "Question tags (do you? isn't it? etc.)",
    studyGuideCategory: 'Questions and auxiliary verbs',
  },
  'Present Perfect Continuous (Introduction)': {
    unitNumber: 9,
    unitTitle: 'Present perfect continuous (I have been doing)',
    studyGuideCategory: 'Present perfect and past',
  },
  'Quantifiers: much / many / a lot of / few / little': {
    unitNumber: 87,
    unitTitle: 'much, many, little, few, a lot, plenty',
    studyGuideCategory: 'Pronouns and determiners',
  },
  'Reflexive Pronouns': {
    unitNumber: 82,
    unitTitle: 'myself/yourself/themselves etc.',
    studyGuideCategory: 'Pronouns and determiners',
  },
  'Comparisons: as...as / not as...as': {
    unitNumber: 107,
    unitTitle: 'Comparative 3 (as ... as / than)',
    studyGuideCategory: 'Adjectives and adverbs',
  },
  'Wish (Introduction)': {
    unitNumber: 41,
    unitTitle: 'wish',
    studyGuideCategory: 'If and wish',
  },
  'Future Continuous (Introduction)': {
    unitNumber: 24,
    unitTitle: 'will be doing and will have done',
    studyGuideCategory: 'Future',
  },
  'Infinitive of Purpose': {
    unitNumber: 64,
    unitTitle: 'to ... , for ... and so that ...',
    studyGuideCategory: '-ing and to ...',
  },
  'Third Conditional': {
    unitNumber: 40,
    unitTitle: 'if I had known ... / I wish I had known ...',
    studyGuideCategory: 'If and wish',
  },
  'Mixed Conditionals': {
    unitNumber: 40,
    unitTitle: 'if I had known ... / I wish I had known ...',
    studyGuideCategory: 'If and wish',
  },
  'Passive Voice (Advanced)': {
    unitNumber: 44,
    unitTitle: 'Passive 3',
    studyGuideCategory: 'Passive',
  },
  'Reported Speech (Questions and Commands)': {
    unitNumber: 48,
    unitTitle: 'Reported speech 2',
    studyGuideCategory: 'Reported speech',
  },
  'Inversion': {
    unitNumber: 110,
    unitTitle: 'Word order 2: adverbs with the verb',
    studyGuideCategory: 'Adjectives and adverbs',
  },
  'Cleft Sentences': {
    unitNumber: 84,
    unitTitle: 'there ... and it ...',
    studyGuideCategory: 'Pronouns and determiners',
  },
  'Subjunctive': {
    unitNumber: 34,
    unitTitle: 'should 2',
    studyGuideCategory: 'Modals',
  },
  'Participle Clauses': {
    unitNumber: 68,
    unitTitle: '-ing clauses (He hurt his knee playing football.)',
    studyGuideCategory: '-ing and to ...',
  },
  'Wish and If Only (Advanced)': {
    unitNumber: 41,
    unitTitle: 'wish',
    studyGuideCategory: 'If and wish',
  },
  'Causative: have / get': {
    unitNumber: 46,
    unitTitle: 'have something done',
    studyGuideCategory: 'Passive',
  },
  'Modal Perfect': {
    unitNumber: 27,
    unitTitle: 'could (do) and could have (done)',
    studyGuideCategory: 'Modals',
  },
  'Ellipsis': {
    unitNumber: 51,
    unitTitle: 'Auxiliary verbs (have/do/can etc.)',
    studyGuideCategory: 'Questions and auxiliary verbs',
  },
  'Discourse Markers': {
    unitNumber: 113,
    unitTitle: 'although / though / even though / in spite of / despite',
    studyGuideCategory: 'Conjunctions and prepositions',
  },
  'Future Perfect': {
    unitNumber: 24,
    unitTitle: 'will be doing and will have done',
    studyGuideCategory: 'Future',
  },
  'Emphasis with Do / Inversion with Only': {
    unitNumber: 51,
    unitTitle: 'Auxiliary verbs (have/do/can etc.)',
    studyGuideCategory: 'Questions and auxiliary verbs',
  },
};

/**
 * Resolve Murphy suggestion for a single grammar topic
 */
export function getMurphySuggestionForTopic(topic: string): MurphySuggestion | null {
  if (!topic) return null;
  const match = MURPHY_STUDY_GUIDE_MAP[topic.trim()];
  if (!match) return null;
  return {
    topic: topic.trim(),
    unitNumber: match.unitNumber,
    unitTitle: match.unitTitle,
    studyGuideCategory: match.studyGuideCategory,
    deepLink: `/grammar?topic=${encodeURIComponent(topic.trim())}&unit=${match.unitNumber}`,
  };
}

/**
 * Resolve Murphy suggestions for an array of weak grammar topics
 */
export function getMurphySuggestions(topics: string[]): MurphySuggestion[] {
  if (!Array.isArray(topics)) return [];
  return topics
    .map((t) => getMurphySuggestionForTopic(t))
    .filter((s): s is MurphySuggestion => s !== null);
}
