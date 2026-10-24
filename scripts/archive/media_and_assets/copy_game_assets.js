const fs = require('fs');
const path = require('path');

const src1 = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/4fc98a77-226a-4a5a-b69b-a5691b862c3d/game_card_flip_3d_1788330395839.jpg';
const src2 = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/4fc98a77-226a-4a5a-b69b-a5691b862c3d/game_card_sentence_3d_1788330415210.jpg';
const src3 = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/4fc98a77-226a-4a5a-b69b-a5691b862c3d/game_card_typing_3d_1788330442689.jpg';
const src4 = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/4fc98a77-226a-4a5a-b69b-a5691b862c3d/game_card_blitz_3d_1788330485694.jpg';

const destDir = path.join(__dirname, '../apps/web/public/images/games');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

fs.copyFileSync(src1, path.join(destDir, 'card-word-match-3d.jpg'));
fs.copyFileSync(src2, path.join(destDir, 'card-sentence-scramble-3d.jpg'));
fs.copyFileSync(src3, path.join(destDir, 'card-typing-race-3d.jpg'));
fs.copyFileSync(src4, path.join(destDir, 'card-fill-blitz-3d.jpg'));

console.log('✅ Successfully copied all 4 3D game card assets into public/images/games!');
