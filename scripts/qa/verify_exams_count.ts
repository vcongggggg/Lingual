import { MASTER_EXAMS } from '../apps/api/src/routes/examData.js';

console.log('Total Standardized Exams:', MASTER_EXAMS.length);
let totalQuestions = 0;
for (const exam of MASTER_EXAMS) {
  let qCount = 0;
  for (const s of exam.sections) {
    qCount += s.questions.length;
  }
  totalQuestions += qCount;
  console.log(`- [${exam.type.toUpperCase()}] ${exam.title} (${exam.difficulty}): ${exam.sections.length} sections, ${qCount} questions`);
}
console.log('Total Questions Across All Exams:', totalQuestions);
