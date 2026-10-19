import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('=== LINGUAFLOW DATABASE SUMMARY ===');
  console.log('Vocabularies:', await prisma.vocabulary.count());
  console.log('Grammar Questions:', await prisma.grammarQuestion.count());
  console.log('Shadowing Sentences:', await prisma.shadowingSentence.count());
  console.log('Dialogue Scenarios:', await prisma.dialogueScenario.count());
  console.log('Story Templates:', await prisma.storyTemplate.count());
  console.log('Content Packages:', await prisma.contentPackage.count());
  console.log('Bilingual Articles:', await prisma.bilingualArticle.count());
  console.log('Bilingual Stories:', await prisma.bilingualStory.count());
  console.log('IELTS Reading Passages:', await prisma.ieltsReadingPassage.count());
  console.log('IELTS Listening Sections:', await prisma.ieltsListeningSection.count());
  console.log('IELTS Speaking Topics:', await prisma.ieltsSpeakingTopic.count());
  console.log('IELTS Writing Topics:', await prisma.ieltsWritingTopic.count());
  console.log('Curriculum Units:', await prisma.curriculumUnit.count());
  console.log('Diary Prompts:', await prisma.diaryPrompt.count());
  console.log('Daily Vocab Questions:', await prisma.dailyVocabQuestion.count());
  console.log('Idioms:', await prisma.idiom.count());
  console.log('Phrasal Verbs:', await prisma.phrasalVerb.count());
  console.log('Collocations:', await prisma.collocation.count());
  console.log('Synonyms & Antonyms:', await prisma.synonymAntonym.count());
  console.log('Minimal Pairs:', await prisma.minimalPair.count());
  console.log('Tongue Twisters:', await prisma.tongueTwister.count());
  console.log('Proverbs:', await prisma.proverb.count());
  console.log('Game Word Pools:', await prisma.gameWordPool.count());
  console.log('Grammar Explanations:', await prisma.grammarExplanation.count());
  console.log('Listening Monologues:', await prisma.listeningMonologue.count());
  console.log('Dictation Sentences:', await prisma.dictationSentence.count());
  console.log('Situational Phrases:', await prisma.situationalPhrase.count());
  console.log('Business Phrases:', await prisma.businessPhrase.count());
  console.log('Travel Phrases:', await prisma.travelPhrase.count());
  console.log('===================================');
  await prisma.$disconnect();
}

run();
