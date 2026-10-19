const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'apps/api/src/data/masterDictionary25k.json');
const CACHE_DIR = path.join(ROOT, 'scratch/cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100000) {
      console.log(`[Cache Hit] ${destPath} already exists (${(fs.statSync(destPath).size / (1024 * 1024)).toFixed(2)} MB). Skipping download.`);
      return resolve(destPath);
    }

    console.log(`[Downloading] ${url} -> ${destPath}...`);
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          console.log(`[Downloaded] Finished downloading ${(fs.statSync(destPath).size / (1024 * 1024)).toFixed(2)} MB.`);
          resolve(destPath);
        });
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

function assignCefrLevel(rank) {
  if (rank <= 1200) return 'A1';
  if (rank <= 3200) return 'A2';
  if (rank <= 7500) return 'B1';
  if (rank <= 15000) return 'B2';
  if (rank <= 23000) return 'C1';
  return 'C2';
}

function mapPartOfSpeech(rawPos) {
  if (!rawPos) return 'noun';
  const p = rawPos.toLowerCase();
  if (p.includes('danh từ')) return 'noun';
  if (p.includes('động từ')) return 'verb';
  if (p.includes('tính từ')) return 'adjective';
  if (p.includes('phó từ') || p.includes('trạng từ')) return 'adverb';
  if (p.includes('giới từ')) return 'preposition';
  if (p.includes('liên từ')) return 'conjunction';
  if (p.includes('thán từ')) return 'interjection';
  if (p.includes('đại từ')) return 'pronoun';
  return 'noun';
}

function inferCategory(word, meaning) {
  const text = (word + ' ' + meaning).toLowerCase();
  if (text.match(/máy tính|phần mềm|internet|công nghệ|kỹ thuật số|dữ liệu|device|computer|code/)) return 'Technology';
  if (text.match(/kinh tế|tiền|tài chính|ngân hàng|mua bán|giá cả|thị trường|money|bank|invest/)) return 'Business & Finance';
  if (text.match(/sức khỏe|bệnh|y tế|thuốc|bác sĩ|điều trị|cơ thể|health|medical|doctor/)) return 'Health & Medicine';
  if (text.match(/giáo dục|trường|học|sinh viên|giáo viên|bài học|nghiên cứu|school|learn|study/)) return 'Education';
  if (text.match(/du lịch|khách sạn|sân bay|chuyến bay|đi lại|vé|tour|hotel|travel|flight/)) return 'Travel & Tourism';
  if (text.match(/thức ăn|uống|món ăn|bữa|nấu|nhà hàng|thực phẩm|food|drink|cook|eat/)) return 'Food & Beverage';
  if (text.match(/môi trường|tự nhiên|sinh thái|rừng|biển|khí hậu|cây|nature|environment|climate/)) return 'Environment & Nature';
  if (text.match(/gia đình|bạn bè|người|tình cảm|xã hội|quan hệ|family|friend|love|people/)) return 'Social & Relationships';
  if (text.match(/thể thao|bóng|chạy|trò chơi|thi đấu|vận động|sport|game|play|run/)) return 'Sports & Recreation';
  if (text.match(/nghệ thuật|âm nhạc|họa|phim|sách|văn hóa|art|music|movie|culture/)) return 'Arts & Entertainment';
  if (text.match(/luật|pháp luật|tòa án|quyền|chính trị|chính phủ|law|court|rule|legal/)) return 'Law & Government';
  return 'General Vocabulary';
}

async function main() {
  console.log('=== BẮT ĐẦU XÂY DỰNG BỘ TỪ ĐIỂN 25,000+ TỪ VỰNG CHO LINGUAFLOW ===\n');

  const FREQ_URL = 'https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt';
  const DICT_URL = 'https://raw.githubusercontent.com/manhminno/English-Vietnamese-Dictionary/master/data/english-vietnamese.txt';

  const freqFile = path.join(CACHE_DIR, 'en_50k.txt');
  const dictFile = path.join(CACHE_DIR, 'english-vietnamese.txt');

  await downloadFile(FREQ_URL, freqFile);
  await downloadFile(DICT_URL, dictFile);

  console.log('\n[1/4] Đang nạp danh sách tần suất từ vựng tiếng Anh (50K)...');
  const freqContent = fs.readFileSync(freqFile, 'utf8');
  const frequencyMap = new Map();
  let rank = 1;

  for (const line of freqContent.split('\n')) {
    const parts = line.trim().split(/\s+/);
    const word = parts[0]?.toLowerCase();
    if (word && /^[a-zA-Z]+(-[a-zA-Z]+)?$/.test(word) && word.length >= 2) {
      if (!frequencyMap.has(word)) {
        frequencyMap.set(word, rank++);
      }
    }
  }
  console.log(`   -> Đã tải ${frequencyMap.size} từ vựng tiếng Anh hợp lệ có tần suất.`);

  console.log('\n[2/4] Đang đọc và phân tích từ điển Anh - Việt Hồ Ngọc Đức (109K từ)...');
  const dictContent = fs.readFileSync(dictFile, 'utf8');
  const rawEntries = dictContent.split(/\n(?=@)/);
  console.log(`   -> Tìm thấy ${rawEntries.length} mục từ trong kho từ điển gốc.`);

  const dictMap = new Map();

  for (let i = 0; i < rawEntries.length; i++) {
    const entryText = rawEntries[i].trim();
    if (!entryText.startsWith('@')) continue;

    const lines = entryText.split('\n').map(l => l.trim()).filter(Boolean);
    const header = lines[0];
    const headerMatch = header.match(/^@([^\/]+)(?:\/([^\/]+)\/)?/);
    if (!headerMatch) continue;

    const rawWord = headerMatch[1].trim();
    // Bỏ qua các từ chứa ký tự đặc biệt hoặc quá dài
    if (!/^[a-zA-Z\s-]+$/.test(rawWord) || rawWord.length > 35) continue;

    const normalized = rawWord.toLowerCase();
    const phonetic = headerMatch[2] ? `/${headerMatch[2].trim()}/` : '';

    let posRaw = '';
    const meanings = [];
    const examples = [];

    for (let j = 1; j < lines.length; j++) {
      const l = lines[j];
      if (l.startsWith('*')) {
        if (!posRaw) posRaw = l.replace(/^\*\s*/, '').trim();
      } else if (l.startsWith('-')) {
        const m = l.replace(/^-\s*/, '').trim();
        if (m && !m.startsWith('=')) meanings.push(m);
      } else if (l.startsWith('=')) {
        const parts = l.replace(/^=\s*/, '').split('+');
        if (parts[0] && parts[1]) {
          examples.push({
            sentence: parts[0].replace(/^=\s*/, '').replace(/_/g, ' ').trim(),
            translation: parts[1].trim()
          });
        }
      }
    }

    if (meanings.length > 0 && !dictMap.has(normalized)) {
      dictMap.set(normalized, {
        word: rawWord,
        phonetic,
        pos: mapPartOfSpeech(posRaw),
        meaning: meanings.slice(0, 3).join('; '),
        examples: examples.slice(0, 2),
      });
    }
  }

  console.log(`   -> Đã chuẩn hóa ${dictMap.size} từ điển hợp lệ.`);

  console.log('\n[3/4] Đang giao thoa tần suất và chọn lọc Top 26,000+ từ vựng chất lượng cao...');
  const compiledList = [];

  // Lấy các từ theo thứ tự tần suất từ 1 đến 50,000 có trong từ điển
  for (const [word, fRank] of frequencyMap.entries()) {
    const dictEntry = dictMap.get(word);
    if (dictEntry) {
      const cefrLevel = assignCefrLevel(fRank);
      const category = inferCategory(dictEntry.word, dictEntry.meaning);
      const id = `dict-${word.replace(/[^a-z0-9]/g, '-')}`;

      compiledList.push({
        id,
        targetText: dictEntry.word,
        normalizedText: word,
        phonetic: dictEntry.phonetic,
        partOfSpeech: dictEntry.pos,
        translation: dictEntry.meaning,
        cefrLevel,
        category,
        exampleSentence: dictEntry.examples[0]?.sentence || `This is an example sentence using the word "${dictEntry.word}".`,
        exampleTranslation: dictEntry.examples[0]?.translation || `Đây là câu ví dụ sử dụng từ "${dictEntry.word}".`,
        frequencyRank: fRank,
      });

      // Xóa khỏi map để tránh trùng
      dictMap.delete(word);

      if (compiledList.length >= 26500) break;
    }
  }

  // Nếu vẫn chưa đủ 26,000 từ, bổ sung thêm các từ học thuật trong dictMap
  if (compiledList.length < 26000) {
    for (const [word, dictEntry] of dictMap.entries()) {
      if (word.length >= 3 && !word.includes(' ')) {
        const id = `dict-${word.replace(/[^a-z0-9]/g, '-')}`;
        compiledList.push({
          id,
          targetText: dictEntry.word,
          normalizedText: word,
          phonetic: dictEntry.phonetic,
          partOfSpeech: dictEntry.pos,
          translation: dictEntry.meaning,
          cefrLevel: 'C1',
          category: inferCategory(dictEntry.word, dictEntry.meaning),
          exampleSentence: dictEntry.examples[0]?.sentence || `The term "${dictEntry.word}" is widely recognized.`,
          exampleTranslation: dictEntry.examples[0]?.translation || `Thuật ngữ "${dictEntry.word}" được công nhận rộng rãi.`,
          frequencyRank: 99999,
        });

        if (compiledList.length >= 26500) break;
      }
    }
  }

  console.log(`   -> Tổng số từ vựng xuất bản đạt: ${compiledList.length} từ!`);
  console.log('   -> Phân bổ CEFR:');
  const cefrDist = {};
  compiledList.forEach(w => cefrDist[w.cefrLevel] = (cefrDist[w.cefrLevel] || 0) + 1);
  console.table(cefrDist);

  console.log('\n[4/4] Đang ghi file dữ liệu masterDictionary25k.json...');
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(compiledList), 'utf8');
  const outSizeMB = (fs.statSync(OUTPUT_FILE).size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Hoàn thành xuất file: ${OUTPUT_FILE} (${outSizeMB} MB, ${compiledList.length} từ vựng)!`);
}

main().catch(err => {
  console.error('Lỗi khi xây dựng từ điển:', err);
  process.exit(1);
});
