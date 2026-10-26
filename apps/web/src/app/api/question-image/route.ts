import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

function getQuestionAssetsDir(): string {
  if (process.env.QUESTION_ASSETS_DIR) {
    return path.resolve(process.env.QUESTION_ASSETS_DIR);
  }
  return path.resolve('C:/Mod/muse-data-exchange/question-assets');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileParam = searchParams.get('file');

  if (!fileParam || !fileParam.trim()) {
    return NextResponse.json({ error: 'Missing or empty file query parameter' }, { status: 400 });
  }

  const rawFile = fileParam.trim();

  // Null-byte check
  if (rawFile.includes('\0')) {
    return NextResponse.json({ error: 'Invalid characters in filename' }, { status: 400 });
  }

  // Traversal & separator check: only pure basename allowed
  if (
    rawFile.includes('..') ||
    rawFile.includes('/') ||
    rawFile.includes('\\') ||
    path.basename(rawFile) !== rawFile
  ) {
    return NextResponse.json(
      { error: 'Path traversal and directory navigation are strictly forbidden' },
      { status: 403 }
    );
  }

  // Allowed extensions check (case-insensitive)
  const ext = path.extname(rawFile).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
  };

  const mimeType = mimeTypes[ext];
  if (!mimeType) {
    return NextResponse.json(
      { error: `Unsupported file extension '${ext}'. Allowed extensions: .png, .jpg, .jpeg, .webp` },
      { status: 400 }
    );
  }

  const assetsDir = getQuestionAssetsDir();
  const targetFilePath = path.resolve(assetsDir, rawFile);

  // Safety check: ensure file stays strictly within assetsDir
  const relative = path.relative(assetsDir, targetFilePath);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative !== rawFile) {
    return NextResponse.json(
      { error: 'Target file lies outside allowed assets directory' },
      { status: 403 }
    );
  }

  if (!fs.existsSync(targetFilePath)) {
    return NextResponse.json({ error: 'Question image not found' }, { status: 404 });
  }

  try {
    const stat = await fs.promises.stat(targetFilePath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: 'Question image not found' }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(targetFilePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=86400, immutable',
      },
    });
  } catch (err: any) {
    console.error('Error serving question image in Next.js:', err);
    return NextResponse.json({ error: 'Failed to access image file' }, { status: 500 });
  }
}
