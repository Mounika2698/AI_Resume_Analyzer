import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { parseResume } from '../services/resume-parser.js';
import { sendError, sendSuccess } from '../utils/response.js';

const resumesRouter = Router();
const uploadDirectory = path.resolve(process.cwd(), 'uploads');
const allowedFiles = new Map([
  ['application/pdf', 'pdf'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'],
  ['text/plain', 'txt'],
]);
const maxFileSize = Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize, files: 1 },
  fileFilter: (_req, file, callback) => callback(null, allowedFiles.has(file.mimetype)),
});

const safeResumeSelect = {
  id: true,
  fileName: true,
  fileType: true,
  fileSize: true,
  name: true,
  email: true,
  phone: true,
  location: true,
  skills: true,
  education: true,
  experience: true,
  projects: true,
  certifications: true,
  summary: true,
  createdAt: true,
  updatedAt: true,
} as const;

const serializeResume = (resume: Record<string, unknown>): Record<string, unknown> => {
  const serialized = { ...resume };
  for (const key of ['skills', 'education', 'experience', 'projects', 'certifications']) {
    const value = serialized[key];
    if (typeof value === 'string') serialized[key] = JSON.parse(value);
  }
  return serialized;
};

resumesRouter.post(
  '/',
  requireAuth,
  (req, res, next) => {
    upload.single('resume')(req, res, (error: unknown) => {
      if (error instanceof multer.MulterError) {
        return sendError(
          res,
          'Upload must contain one file no larger than the configured limit',
          'INVALID_FILE'
        );
      }
      if (error) return next(error);
      return next();
    });
  },
  async (req, res, next) => {
    try {
      if (!req.file || !allowedFiles.has(req.file.mimetype))
        return sendError(res, 'Upload a PDF, DOCX, or TXT resume', 'UNSUPPORTED_FILE_TYPE');

      const parsed = await parseResume(req.file);
      const fileType = allowedFiles.get(req.file.mimetype)!;
      const storageName = `${randomUUID()}.${fileType}`;
      await fs.mkdir(uploadDirectory, { recursive: true });
      await fs.writeFile(path.join(uploadDirectory, storageName), req.file.buffer, { flag: 'wx' });

      try {
        const resume = await prisma.resume.create({
          data: {
            userId: req.user!.id,
            fileName: req.file.originalname,
            fileType,
            fileSize: req.file.size,
            storagePath: storageName,
            ...parsed,
            skills: JSON.stringify(parsed.skills),
            education: JSON.stringify(parsed.education),
            experience: JSON.stringify(parsed.experience),
            projects: JSON.stringify(parsed.projects),
            certifications: JSON.stringify(parsed.certifications),
          },
          select: safeResumeSelect,
        });
        return sendSuccess(
          res,
          'Resume uploaded and parsed successfully',
          { resume: serializeResume(resume) },
          201
        );
      } catch (error) {
        await fs.unlink(path.join(uploadDirectory, storageName)).catch(() => undefined);
        throw error;
      }
    } catch (error) {
      return next(error);
    }
  }
);

resumesRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user!.id },
      select: safeResumeSelect,
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(res, 'Resumes retrieved successfully', {
      resumes: resumes.map(serializeResume),
    });
  } catch (error) {
    return next(error);
  }
});

resumesRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      select: { ...safeResumeSelect, rawText: true },
    });
    if (!resume) return sendError(res, 'Resume not found', 'RESUME_NOT_FOUND', 404);
    return sendSuccess(res, 'Resume retrieved successfully', { resume: serializeResume(resume) });
  } catch (error) {
    return next(error);
  }
});

resumesRouter.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!resume) return sendError(res, 'Resume not found', 'RESUME_NOT_FOUND', 404);
    await prisma.resume.delete({ where: { id: resume.id } });
    await fs.unlink(path.join(uploadDirectory, resume.storagePath)).catch(() => undefined);
    return sendSuccess(res, 'Resume deleted successfully');
  } catch (error) {
    return next(error);
  }
});

export { resumesRouter };
