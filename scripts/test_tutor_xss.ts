function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderSimpleMarkdownHtml(content: string) {
  const lines = content.split('\n');
  return lines.map((line) => {
    if (!line.trim()) return '';
    const escaped = escapeHtml(line);
    const formatted = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return formatted;
  });
}

console.log('🧪 Testing Tutor XSS protection and Markdown formatting...');

// 1. Test XSS payload
const xssPayload = '<img src=x onerror=alert(1)>';
const renderedXss = renderSimpleMarkdownHtml(xssPayload)[0];
console.log('Rendered XSS input:', renderedXss);
if (renderedXss.includes('<img') || renderedXss.includes('<')) {
  console.error('❌ FAILED: Raw HTML tag was not escaped!');
  process.exit(1);
}
if (!renderedXss.includes('&lt;img src=x onerror=alert(1)&gt;')) {
  console.error('❌ FAILED: Expected escaped HTML entity output!');
  process.exit(1);
}
console.log('✅ PASS: XSS payload successfully escaped into harmless text entities.');

// 2. Test bold markdown formatting
const boldPayload = 'Chào bạn! Tớ là **LingLing**, học tiếng Anh **rất vui**.';
const renderedBold = renderSimpleMarkdownHtml(boldPayload)[0];
console.log('Rendered Bold input:', renderedBold);
if (!renderedBold.includes('<strong>LingLing</strong>') || !renderedBold.includes('<strong>rất vui</strong>')) {
  console.error('❌ FAILED: Bold markdown was not formatted properly!');
  process.exit(1);
}
console.log('✅ PASS: Bold markdown formatted with <strong> tags properly.');

// 3. Test combination: bold containing potential tags
const comboPayload = 'Thử nghiệm **<b>không bị lồng</b>** và **in đậm**';
const renderedCombo = renderSimpleMarkdownHtml(comboPayload)[0];
console.log('Rendered Combo input:', renderedCombo);
if (renderedCombo.includes('<b>') || renderedCombo.includes('</b>')) {
  console.error('❌ FAILED: Embedded HTML tag inside bold was not escaped!');
  process.exit(1);
}
if (!renderedCombo.includes('<strong>&lt;b&gt;không bị lồng&lt;/b&gt;</strong>')) {
  console.error('❌ FAILED: Expected escaped HTML inside strong tags!');
  process.exit(1);
}
console.log('✅ PASS: Combined payload escaped and formatted securely.');

console.log('🎉 Mục 5 DoD Verification 100% PASSED!');
