import fs from 'fs';
import path from 'path';
import { Router, Request, Response } from 'express';

export const questionImageRouter = Router();

export function getQuestionAssetsDir(): string {
  if (process.env.QUESTION_ASSETS_DIR) {
    return path.resolve(process.env.QUESTION_ASSETS_DIR);
  }
  // Default directory for question assets outside repository
  return path.resolve('C:/Mod/muse-data-exchange/question-assets');
}

export type ValidationResult =
  | { ok: true; filename: string; mimeType: string; filePath: string }
  | { ok: false; status: number; error: string };

export function validateImageRequest(fileParam: unknown, assetsDir = getQuestionAssetsDir()): ValidationResult {
  if (typeof fileParam !== 'string' || !fileParam.trim()) {
    return { ok: false, status: 400, error: 'Missing or empty file query parameter' };
  }

  const rawFile = fileParam.trim();

  // Null-byte check
  if (rawFile.includes('\0')) {
    return { ok: false, status: 400, error: 'Invalid characters in filename' };
  }

  // Traversal & separator check: only pure basename allowed
  if (
    rawFile.includes('..') ||
    rawFile.includes('/') ||
    rawFile.includes('\\') ||
    path.basename(rawFile) !== rawFile
  ) {
    return { ok: false, status: 403, error: 'Path traversal and directory navigation are strictly forbidden' };
  }

  // Extension check (case-insensitive)
  const ext = path.extname(rawFile).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
  };

  const mimeType = mimeTypes[ext];
  if (!mimeType) {
    return {
      ok: false,
      status: 400,
      error: `Unsupported file extension '${ext}'. Allowed extensions: .png, .jpg, .jpeg, .webp`,
    };
  }

  const resolvedBase = path.resolve(assetsDir);
  const targetFilePath = path.resolve(resolvedBase, rawFile);

  // Extra safety check: ensure target path is directly inside assetsDir
  const relative = path.relative(resolvedBase, targetFilePath);
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative !== rawFile) {
    return { ok: false, status: 403, error: 'Target file lies outside allowed assets directory' };
  }

  return { ok: true, filename: rawFile, mimeType, filePath: targetFilePath };
}

const handleGetImage = (req: Request, res: Response) => {
  const validation = validateImageRequest(req.query.file);
  if (validation.ok === false) {
    res.status(validation.status).json({ error: validation.error, status: validation.status });
    return;
  }

  if (!fs.existsSync(validation.filePath)) {
    res.status(404).json({ error: 'Question image not found', status: 404 });
    return;
  }

  try {
    const stat = fs.statSync(validation.filePath);
    if (!stat.isFile()) {
      res.status(404).json({ error: 'Question image not found', status: 404 });
      return;
    }

    res.setHeader('Content-Type', validation.mimeType);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');

    const stream = fs.createReadStream(validation.filePath);
    stream.on('error', (err) => {
      console.error('Error streaming question image:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error reading image file' });
      }
    });
    stream.pipe(res);
  } catch (err: any) {
    console.error('Failed to read image file:', err);
    res.status(500).json({ error: 'Failed to access image file' });
  }
};

questionImageRouter.get('/', handleGetImage);
