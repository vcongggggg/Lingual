// Real External Dictionary Service
// Connects to Free Dictionary API and Datamuse API with resilient caching and fallback.

export interface ExternalWordDefinition {
  word: string;
  phonetic?: string;
  audioUrl?: string;
  partOfSpeech: string;
  definitionVi?: string;
  definitionEn: string;
  exampleSentence?: string;
  synonyms: string[];
  antonyms: string[];
  source: 'free_dictionary_api' | 'datamuse' | 'curated_cache';
}

const LRU_CACHE = new Map<string, { data: ExternalWordDefinition[]; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export class RealDictionaryService {
  /**
   * Look up a word from external Free Dictionary API with timeout and caching
   */
  public static async lookupWord(word: string): Promise<ExternalWordDefinition[]> {
    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) return [];

    // Check memory cache
    const cached = LRU_CACHE.get(cleanWord);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'LinguaFlow-Dictionary/1.0' },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json) && json.length > 0) {
          const entry = json[0];
          const results: ExternalWordDefinition[] = [];

          // Extract best audio URL
          let audioUrl: string | undefined;
          if (entry.phonetics && Array.isArray(entry.phonetics)) {
            const withAudio = entry.phonetics.find((p: any) => p.audio && p.audio.trim().length > 0);
            if (withAudio) audioUrl = withAudio.audio;
          }

          const phonetic = entry.phonetic || (entry.phonetics?.[0]?.text);

          if (entry.meanings && Array.isArray(entry.meanings)) {
            entry.meanings.forEach((meaning: any) => {
              const pos = meaning.partOfSpeech || 'noun';
              const defObj = meaning.definitions?.[0];
              const defEn = defObj?.definition || '';
              const example = defObj?.example || '';
              const synonyms = meaning.synonyms?.slice(0, 5) || [];
              const antonyms = meaning.antonyms?.slice(0, 5) || [];

              if (defEn) {
                results.push({
                  word: cleanWord,
                  phonetic,
                  audioUrl,
                  partOfSpeech: pos,
                  definitionEn: defEn,
                  exampleSentence: example,
                  synonyms,
                  antonyms,
                  source: 'free_dictionary_api',
                });
              }
            });
          }

          if (results.length > 0) {
            LRU_CACHE.set(cleanWord, { data: results, timestamp: Date.now() });
            return results;
          }
        }
      }
    } catch (err) {
      // Fall through to Datamuse or fallback
    }

    // Fallback: Query Datamuse for synonyms and definitions
    try {
      const dmRes = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(cleanWord)}&md=dp&max=1`);
      if (dmRes.ok) {
        const dmJson = await dmRes.json();
        if (Array.isArray(dmJson) && dmJson.length > 0) {
          const item = dmJson[0];
          const defs = item.defs || [];
          const defEn = defs[0] ? defs[0].replace(/^[a-z]+\t/, '') : `Definition for ${cleanWord}`;
          const pos = defs[0] ? (defs[0].startsWith('n\t') ? 'noun' : defs[0].startsWith('v\t') ? 'verb' : 'adjective') : 'noun';

          const fallbackResult: ExternalWordDefinition[] = [
            {
              word: cleanWord,
              partOfSpeech: pos,
              definitionEn: defEn,
              synonyms: [],
              antonyms: [],
              source: 'datamuse',
            },
          ];

          LRU_CACHE.set(cleanWord, { data: fallbackResult, timestamp: Date.now() });
          return fallbackResult;
        }
      }
    } catch {}

    return [];
  }
}
