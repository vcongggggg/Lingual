import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const studyTemplateRouter = Router();

const querySchema = z.object({
  type: z.string().optional(),
  search: z.string().optional(),
  source: z.string().optional(),
  page: z.preprocess((v) => (v !== undefined ? Number(v) : 1), z.number().int().min(1).default(1)),
  limit: z.preprocess((v) => (v !== undefined ? Number(v) : 50), z.number().int().min(1).max(100).default(50)),
});

const createTemplateSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  titleVi: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionVi: z.string().min(1),
  structure: z.record(z.any()),
  source: z.string().default('authored'),
});

const updateTemplateSchema = z.object({
  type: z.string().optional(),
  titleVi: z.string().optional(),
  titleEn: z.string().optional(),
  descriptionVi: z.string().optional(),
  structure: z.record(z.any()).optional(),
  source: z.string().optional(),
});

// GET /api/v1/study-templates - List templates
studyTemplateRouter.get('/', async (req: Request, res: Response) => {
  try {
    const query = querySchema.parse(req.query);
    const where: any = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.source) {
      where.source = query.source;
    }

    if (query.search) {
      where.OR = [
        { titleVi: { contains: query.search, mode: 'insensitive' } },
        { titleEn: { contains: query.search, mode: 'insensitive' } },
        { descriptionVi: { contains: query.search, mode: 'insensitive' } },
        { type: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.studyTemplate.count({ where });
    const skip = (query.page - 1) * query.limit;

    const templates = await prisma.studyTemplate.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: { id: 'asc' },
    });

    res.json({
      success: true,
      data: templates,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit) || 1,
    });
  } catch (error: any) {
    console.error('Error fetching study templates:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// GET /api/v1/study-templates/:id - Get template by ID or Type
studyTemplateRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await prisma.studyTemplate.findFirst({
      where: {
        OR: [{ id }, { type: id }],
      },
    });

    if (!template) {
      return res.status(404).json({ success: false, error: 'Study template not found' });
    }

    res.json({ success: true, data: template });
  } catch (error: any) {
    console.error('Error fetching study template by ID:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// POST /api/v1/study-templates - Create template
studyTemplateRouter.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = createTemplateSchema.parse(req.body);

    const existing = await prisma.studyTemplate.findFirst({
      where: {
        OR: [{ id: parsed.id }, { type: parsed.type }],
      },
    });

    if (existing) {
      return res.status(409).json({ success: false, error: 'Template with this id or type already exists' });
    }

    const created = await prisma.studyTemplate.create({
      data: {
        id: parsed.id,
        type: parsed.type,
        titleVi: parsed.titleVi,
        titleEn: parsed.titleEn,
        descriptionVi: parsed.descriptionVi,
        structure: parsed.structure,
        source: parsed.source,
      },
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error creating study template:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// PUT /api/v1/study-templates/:id - Update template
studyTemplateRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsed = updateTemplateSchema.parse(req.body);

    const existing = await prisma.studyTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Study template not found' });
    }

    const updated = await prisma.studyTemplate.update({
      where: { id },
      data: parsed,
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, error: error.errors });
    }
    console.error('Error updating study template:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// DELETE /api/v1/study-templates/:id - Delete template
studyTemplateRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await prisma.studyTemplate.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Study template not found' });
    }

    await prisma.studyTemplate.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Template deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting study template:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});
