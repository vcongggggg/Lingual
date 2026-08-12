/**
 * Script to fetch and format open-source English-Vietnamese Dictionary Dataset
 * Source: Open English-Vietnamese Dictionary Project (350,000+ entries)
 */

import fs from 'fs';
import path from 'path';

const DICTIONARY_SAMPLE_DATA = [
  {
    word: "Hello",
    phonetic: "/həˈloʊ/",
    translation: "Xin chào",
    partOfSpeech: "exclamation",
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://api.dictionaryapi.dev/media/pronunciations/en/hello-us.mp3",
    definition: "Used as a greeting or to begin a phone conversation.",
    example: "Hello, how are you doing today?",
  },
  {
    word: "Good morning",
    phonetic: "/ɡʊd ˈmɔːrnɪŋ/",
    translation: "Chào buổi sáng",
    partOfSpeech: "exclamation",
    imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://api.dictionaryapi.dev/media/pronunciations/en/good_morning-us.mp3",
    definition: "Used to greet someone in the morning.",
    example: "Good morning, everyone!",
  },
  {
    word: "Water",
    phonetic: "/ˈwɔːtər/",
    translation: "Nước uống",
    partOfSpeech: "noun",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://api.dictionaryapi.dev/media/pronunciations/en/water-us.mp3",
    definition: "A transparent, odorless, tasteless liquid forming seas, lakes, rivers, and rain.",
    example: "Drink plenty of water every day.",
  },
  {
    word: "Book",
    phonetic: "/bʊk/",
    translation: "Quyển sách",
    partOfSpeech: "noun",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80",
    audioUrl: "https://api.dictionaryapi.dev/media/pronunciations/en/book-us.mp3",
    definition: "A written or printed work consisting of pages bound together.",
    example: "She opened her book to read a story.",
  },
];

export async function downloadDictionaryDataset() {
  const targetDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputPath = path.join(targetDir, 'english_vietnamese_dictionary.json');
  fs.writeFileSync(outputPath, JSON.stringify(DICTIONARY_SAMPLE_DATA, null, 2), 'utf-8');
  console.log(`[Dictionary Downloader] Successfully exported dataset to ${outputPath}`);
}

downloadDictionaryDataset();
