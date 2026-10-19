const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Curated Video Dataset
const FULL_CRAWLED_VIDEOS = [
  {
    id: 'steve-jobs-stanford',
    youtubeId: 'UF8uR6Z6KLc',
    title: 'Steve Jobs Stanford Commencement Speech (2005)',
    channel: 'Stanford University',
    category: 'TED',
    level: 'B1',
    duration: '15:04',
    views: '45.2M views',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60',
    isFeatured: true,
    segments: [
      {
        id: 1,
        start: 0.5,
        end: 7.0,
        text: 'I am honored to be with you today at your commencement from one of the finest universities in the world.',
        vietnamese: 'Tôi rất vinh dự được có mặt cùng các bạn hôm nay tại lễ tốt nghiệp từ một trong những trường đại học danh giá nhất thế giới.',
        words: ['I', 'am', 'honored', 'to', 'be', 'with', 'you', 'today', 'at', 'your', 'commencement', 'from', 'one', 'of', 'the', 'finest', 'universities', 'in', 'the', 'world.'],
        ipa: '/aɪ/ /æm/ /ˈɒn.əd/ /tuː/ /biː/ /wɪð/ /juː/ /təˈdeɪ/',
      },
      {
        id: 2,
        start: 7.5,
        end: 14.0,
        text: "I never graduated from college. Truth be told, this is the closest I've ever gotten to a college graduation.",
        vietnamese: 'Tôi chưa từng tốt nghiệp đại học. Thú thật, đây là dịp tôi ở gần một buổi lễ tốt nghiệp đại học nhất trong đời.',
        words: ['I', 'never', 'graduated', 'from', 'college.', 'Truth', 'be', 'told,', 'this', 'is', 'the', 'closest', "I've", 'ever', 'gotten', 'to', 'a', 'college', 'graduation.'],
        ipa: '/aɪ/ /ˈnev.ər/ /ˈɡrædʒ.u.eɪt.ɪd/ /frɒm/ /ˈkɒl.ɪdʒ/',
      },
      {
        id: 3,
        start: 14.5,
        end: 22.0,
        text: "Today I want to tell you three stories from my life. That's it. No big deal. Just three stories.",
        vietnamese: 'Hôm nay tôi muốn kể cho các bạn nghe 3 câu chuyện trong cuộc đời tôi. Chỉ có thế thôi. Không có gì to tát. Chỉ 3 câu chuyện.',
        words: ['Today', 'I', 'want', 'to', 'tell', 'you', 'three', 'stories', 'from', 'my', 'life.', "That's", 'it.', 'No', 'big', 'deal.', 'Just', 'three', 'stories.'],
        ipa: '/təˈdeɪ/ /aɪ/ /wɒnt/ /tuː/ /tel/ /juː/ /θriː/ /ˈstɔː.riz/',
      },
    ],
  },
  {
    id: 'see-you-again-boyce',
    youtubeId: 'RgKAFK5djSk',
    title: 'See You Again - Boyce Avenue feat. Bea Miller (Acoustic Cover)',
    channel: 'Boyce Avenue',
    category: 'Music',
    level: 'A1',
    duration: '4:23',
    views: '12.4K views',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60',
    isFeatured: true,
    segments: [
      {
        id: 1,
        start: 12.0,
        end: 18.0,
        text: "It's been a long day without you, my friend.",
        vietnamese: 'Đã là một ngày dài khi không có bạn bên cạnh, bạn tôi ơi.',
        words: ["It's", 'been', 'a', 'long', 'day', 'without', 'you,', 'my', 'friend.'],
        ipa: '/ɪts/ /bɪn/ /ə/ /lɒŋ/ /deɪ/ /wɪˈðaʊt/ /juː/ /maɪ/ /frend/',
      },
      {
        id: 2,
        start: 18.5,
        end: 25.0,
        text: "And I'll tell you all about it when I see you again.",
        vietnamese: 'Và tôi sẽ kể cho bạn nghe mọi điều khi chúng ta gặp lại nhau.',
        words: ['And', "I'll", 'tell', 'you', 'all', 'about', 'it', 'when', 'I', 'see', 'you', 'again.'],
        ipa: '/ænd/ /aɪl/ /tel/ /juː/ /ɔːl/ /əˈbaʊt/ /ɪt/ /wen/ /aɪ/ /siː/ /juː/ /əˈɡen/',
      },
      {
        id: 3,
        start: 25.5,
        end: 32.0,
        text: "We've come a long way from where we began.",
        vietnamese: 'Chúng ta đã đi một chặng đường rất dài từ điểm xuất phát ban đầu.',
        words: ["We've", 'come', 'a', 'long', 'way', 'from', 'where', 'we', 'began.'],
        ipa: '/wiːv/ /kʌm/ /ə/ /lɒŋ/ /weɪ/ /frɒm/ /weər/ /wiː/ /bɪˈɡæn/',
      },
    ],
  },
  {
    id: 'ted-ed-brain-concussion',
    youtubeId: 'L_LUpnjgPso',
    title: 'What happens when you have a concussion? | TED-Ed',
    channel: 'TED-Ed',
    category: 'TED',
    level: 'B1',
    duration: '4:47',
    views: '3.8M views',
    thumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=60',
    isFeatured: true,
    segments: [
      {
        id: 1,
        start: 1.5,
        end: 7.5,
        text: 'The human brain is a fragile organ suspended in protective fluid.',
        vietnamese: 'Bộ não con người là một cơ quan mỏng manh lơ lửng trong dịch bảo vệ.',
        words: ['The', 'human', 'brain', 'is', 'a', 'fragile', 'organ', 'suspended', 'in', 'protective', 'fluid.'],
        ipa: '/ðə/ /ˈhjuː.mən/ /breɪn/ /ɪz/ /ə/ /ˈfrædʒ.aɪl/ /ˈɔː.ɡən/',
      },
      {
        id: 2,
        start: 7.5,
        end: 13.5,
        text: 'Surrounding it is a hard, bony skull designed to withstand impacts.',
        vietnamese: 'Bao quanh nó là một hộp sọ cứng cáp bằng xương được thiết kế để chống chịu các va đập.',
        words: ['Surrounding', 'it', 'is', 'a', 'hard,', 'bony', 'skull', 'designed', 'to', 'withstand', 'impacts.'],
        ipa: '/səˈraʊn.dɪŋ/ /ɪt/ /ɪz/ /ə/ /hɑːd/ /ˈboʊ.ni/ /skʌl/',
      },
      {
        id: 3,
        start: 13.5,
        end: 20.0,
        text: 'When the head experiences a sudden jolt, the brain collides with the skull wall.',
        vietnamese: 'Khi đầu phải chịu một cú giật đột ngột, bộ não sẽ va chạm mạnh vào thành hộp sọ.',
        words: ['When', 'the', 'head', 'experiences', 'a', 'sudden', 'jolt,', 'the', 'brain', 'collides', 'with', 'the', 'skull', 'wall.'],
        ipa: '/wen/ /ðə/ /hed/ /ɪkˈspɪə.ri.ən.sɪz/ /ə/ /ˈsʌd.ən/ /dʒoʊlt/',
      },
    ],
  },
  {
    id: 'rick-astley-never-give-up',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Never Gonna Give You Up - Official Music Video',
    channel: 'Rick Astley Official',
    category: 'Music',
    level: 'A2',
    duration: '3:33',
    views: '1.5B views',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    isFeatured: true,
    segments: [
      {
        id: 1,
        start: 18.5,
        end: 22.5,
        text: "We're no strangers to love.",
        vietnamese: 'Chúng ta đâu còn xa lạ gì với tình yêu.',
        words: ["We're", 'no', 'strangers', 'to', 'love.'],
        ipa: '/wɪər/ /noʊ/ /ˈstreɪn.dʒərz/ /tuː/ /lʌv/',
      },
      {
        id: 2,
        start: 22.5,
        end: 26.5,
        text: 'You know the rules and so do I.',
        vietnamese: 'Bạn biết rõ những quy luật đó, và tôi cũng vậy.',
        words: ['You', 'know', 'the', 'rules', 'and', 'so', 'do', 'I.'],
        ipa: '/juː/ /noʊ/ /ðə/ /ruːlz/ /ænd/ /soʊ/ /duː/ /aɪ/',
      },
    ],
  },
];

// 2. Curated Vocabulary Dataset
const FULL_CRAWLED_VOCABULARY = [
  {
    id: 'vocab-hello',
    targetText: 'Hello',
    normalizedText: 'hello',
    translation: 'Xin chào',
    phoneticUs: '/həˈloʊ/',
    phoneticUk: '/həˈləʊ/',
    partOfSpeech: 'interjection',
    cefrLevel: 'A1',
    category: 'Daily Life',
    definitionEn: 'Used as a greeting or to begin a conversation.',
    examples: [
      { sentence: 'Hello, how are you today?', translation: 'Xin chào, hôm nay bạn thế nào?' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=500&auto=format&fit=crop&q=80',
    tags: ['greetings', 'basics'],
  },
  {
    id: 'vocab-student',
    targetText: 'Student',
    normalizedText: 'student',
    translation: 'Học sinh / Sinh viên',
    phoneticUs: '/ˈstuːdənt/',
    phoneticUk: '/ˈstjuːdnt/',
    partOfSpeech: 'noun',
    cefrLevel: 'A1',
    category: 'Education',
    definitionEn: 'A person who is studying at a school, college, or university.',
    examples: [
      { sentence: 'He is an enthusiastic university student.', translation: 'Anh ấy là một sinh viên đại học nhiệt huyết.' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
    tags: ['school', 'study'],
  },
];

const outVideosPath = path.join(dataDir, 'crawled_bibung_videos.json');
fs.writeFileSync(outVideosPath, JSON.stringify(FULL_CRAWLED_VIDEOS, null, 2), 'utf-8');

const outVocabPath = path.join(dataDir, 'crawled_bibung_vocabulary.json');
fs.writeFileSync(outVocabPath, JSON.stringify(FULL_CRAWLED_VOCABULARY, null, 2), 'utf-8');

console.log(`[Crawler] Successfully exported ${FULL_CRAWLED_VIDEOS.length} videos to: ${outVideosPath}`);
console.log(`[Crawler] Successfully exported ${FULL_CRAWLED_VOCABULARY.length} vocabulary items to: ${outVocabPath}`);
