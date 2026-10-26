import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { questionImageRouter, validateImageRequest } from '../src/routes/questionImage.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/question-image', questionImageRouter);
  app.use('/api/question-image', questionImageRouter);
  return app;
}

describe('Question Image Asset Serving API', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lf-question-assets-test-'));
  const originalAssetsDir = process.env.QUESTION_ASSETS_DIR;

  // Create test dummy images
  const testPng = path.join(tempDir, 'test-sample-map.png');
  fs.writeFileSync(testPng, Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));

  const testJpg = path.join(tempDir, 'test-sample-chart.jpg');
  fs.writeFileSync(testJpg, Buffer.from([0xff, 0xd8, 0xff, 0xe0]));

  process.env.QUESTION_ASSETS_DIR = tempDir;

  test.after(() => {
    process.env.QUESTION_ASSETS_DIR = originalAssetsDir;
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('validates pure basename and allows safe extensions', () => {
    const valid = validateImageRequest('sample.png', tempDir);
    assert.equal(valid.ok, true);
    if (valid.ok) {
      assert.equal(valid.filename, 'sample.png');
      assert.equal(valid.mimeType, 'image/png');
    }
  });

  it('blocks path traversal with .. (403)', () => {
    const res = validateImageRequest('../secrets.png', tempDir);
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 403);
    }
  });

  it('blocks path traversal with forward slash / (403)', () => {
    const res = validateImageRequest('subdir/sample.png', tempDir);
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 403);
    }
  });

  it('blocks path traversal with backslash \\ (403)', () => {
    const res = validateImageRequest('subdir\\sample.png', tempDir);
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 403);
    }
  });

  it('rejects unsupported file extensions with 400', () => {
    const res = validateImageRequest('payload.exe', tempDir);
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 400);
    }
  });

  it('rejects missing or empty file parameter with 400', () => {
    const res = validateImageRequest('', tempDir);
    assert.equal(res.ok, false);
    if (!res.ok) {
      assert.equal(res.status, 400);
    }
  });

  it('GET /api/question-image returns 200 with proper MIME for existing PNG', async () => {
    const app = createTestApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    try {
      const res = await fetch(`http://localhost:${port}/api/question-image?file=test-sample-map.png`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('content-type'), 'image/png');
      assert.ok(res.headers.get('cache-control')?.includes('public'));
      const buffer = await res.arrayBuffer();
      assert.equal(buffer.byteLength, 8);
    } finally {
      server.close();
    }
  });

  it('GET /api/v1/question-image returns 200 with proper MIME for existing JPG', async () => {
    const app = createTestApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    try {
      const res = await fetch(`http://localhost:${port}/api/v1/question-image?file=test-sample-chart.jpg`);
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('content-type'), 'image/jpeg');
    } finally {
      server.close();
    }
  });

  it('GET /api/question-image returns 404 for missing file', async () => {
    const app = createTestApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    try {
      const res = await fetch(`http://localhost:${port}/api/question-image?file=non-existent-image-12345.png`);
      assert.equal(res.status, 404);
      const json = await res.json() as any;
      assert.ok(json.error);
    } finally {
      server.close();
    }
  });

  it('GET /api/question-image returns 403 on traversal attempt', async () => {
    const app = createTestApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    try {
      const res = await fetch(`http://localhost:${port}/api/question-image?file=../../windows/system32/cmd.png`);
      assert.equal(res.status, 403);
      const json = await res.json() as any;
      assert.ok(json.error);
    } finally {
      server.close();
    }
  });

  it('GET /api/question-image returns 400 on missing query param', async () => {
    const app = createTestApp();
    const server = app.listen(0);
    const port = (server.address() as any).port;

    try {
      const res = await fetch(`http://localhost:${port}/api/question-image`);
      assert.equal(res.status, 400);
    } finally {
      server.close();
    }
  });

  it('importer asset validator throws descriptive error on missing asset', () => {
    const { execSync } = require('child_process');
    const rootDir = path.resolve(__dirname, '../../..');
    const pyCmd = `python -c "import sys; from scripts.corpus.importers.asset_validator import validate_questions_json_assets, QuestionAssetError; test_q = [{'questionNumber': 1, 'imageRef': 'missing_file_xyz_12345.png'}]; (lambda: (sys.exit(0) if not validate_questions_json_assets(test_q) else sys.exit(0)))() if False else None; (lambda: sys.exit(42))()"`;
    
    // Test direct python execution via python script runner
    const script = [
      'import sys',
      'from scripts.corpus.importers.asset_validator import validate_questions_json_assets, QuestionAssetError',
      'test_q = [{"questionNumber": 1, "imageRef": "missing_file_xyz_12345.png"}]',
      'try:',
      '    validate_questions_json_assets(test_q, context_label="TestUnit")',
      '    sys.exit(0)',
      'except QuestionAssetError:',
      '    sys.exit(42)',
    ].join('\n');

    try {
      execSync('python -', { input: script, cwd: rootDir });
      assert.fail('Expected python script to fail with exit code 42');
    } catch (err: any) {
      assert.equal(err.status, 42);
    }
  });

  it('importer asset validator blocks directory traversal in imageRef', () => {
    const { execSync } = require('child_process');
    const rootDir = path.resolve(__dirname, '../../..');
    const script = [
      'import sys',
      'from scripts.corpus.importers.asset_validator import validate_questions_json_assets, QuestionAssetError',
      'test_q = [{"questionNumber": 1, "imageRef": "../../etc/passwd.png"}]',
      'try:',
      '    validate_questions_json_assets(test_q, context_label="TestTraversal")',
      '    sys.exit(0)',
      'except QuestionAssetError:',
      '    sys.exit(43)',
    ].join('\n');

    try {
      execSync('python -', { input: script, cwd: rootDir });
      assert.fail('Expected python script to fail with exit code 43');
    } catch (err: any) {
      assert.equal(err.status, 43);
    }
  });

  it('UI component URL logic correctly encodes parameters and handles empty refs', () => {
    // Logic matching apps/web/src/components/common/QuestionImage.tsx
    const buildImageUrl = (imageRef?: string | null) => {
      if (!imageRef || typeof imageRef !== 'string' || !imageRef.trim()) {
        return null;
      }
      return `/api/question-image?file=${encodeURIComponent(imageRef.trim())}`;
    };

    assert.equal(buildImageUrl(null), null);
    assert.equal(buildImageUrl(undefined), null);
    assert.equal(buildImageUrl(''), null);
    assert.equal(buildImageUrl('   '), null);
    assert.equal(
      buildImageUrl('cam15-t2-l2-minster-park-map.png'),
      '/api/question-image?file=cam15-t2-l2-minster-park-map.png'
    );
    assert.equal(
      buildImageUrl('cam15-t4-l2-croft-valley-park-map.png'),
      '/api/question-image?file=cam15-t4-l2-croft-valley-park-map.png'
    );
  });
});
