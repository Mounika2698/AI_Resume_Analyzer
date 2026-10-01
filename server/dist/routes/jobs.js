import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { extractJobKeywords } from '../services/ats-scorer.js';
import { sendError, sendSuccess } from '../utils/response.js';
const jobsRouter = Router();
const jobSchema = z.object({
    title: z.string().trim().min(2).max(160),
    company: z.string().trim().max(160).optional(),
    content: z.string().trim().min(50).max(30000),
    requiredSkills: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
    preferredSkills: z.array(z.string().trim().min(1).max(80)).max(30).default([]),
});
const select = {
    id: true,
    title: true,
    company: true,
    content: true,
    requiredSkills: true,
    preferredSkills: true,
    createdAt: true,
};
const serialize = (job) => ({
    ...job,
    requiredSkills: JSON.parse(job.requiredSkills),
    preferredSkills: JSON.parse(job.preferredSkills),
});
jobsRouter.post('/', requireAuth, async (req, res, next) => {
    try {
        const parsed = jobSchema.safeParse(req.body);
        if (!parsed.success)
            return sendError(res, parsed.error.issues[0]?.message || 'Invalid job description', 'VALIDATION_ERROR', 400);
        const data = parsed.data;
        const job = await prisma.jobDescription.create({
            data: {
                userId: req.user.id,
                title: data.title,
                company: data.company || null,
                content: data.content,
                requiredSkills: JSON.stringify(data.requiredSkills.length
                    ? data.requiredSkills
                    : extractJobKeywords(data.content).slice(0, 12)),
                preferredSkills: JSON.stringify(data.preferredSkills),
            },
            select,
        });
        return sendSuccess(res, 'Job description created successfully', { job: serialize(job) }, 201);
    }
    catch (error) {
        return next(error);
    }
});
jobsRouter.get('/', requireAuth, async (req, res, next) => {
    try {
        const jobs = await prisma.jobDescription.findMany({
            where: { userId: req.user.id },
            select,
            orderBy: { createdAt: 'desc' },
        });
        return sendSuccess(res, 'Job descriptions retrieved successfully', {
            jobs: jobs.map(serialize),
        });
    }
    catch (error) {
        return next(error);
    }
});
jobsRouter.delete('/:id', requireAuth, async (req, res, next) => {
    try {
        const job = await prisma.jobDescription.findFirst({
            where: { id: req.params.id, userId: req.user.id },
        });
        if (!job)
            return sendError(res, 'Job description not found', 'JOB_NOT_FOUND', 404);
        await prisma.jobDescription.delete({ where: { id: job.id } });
        return sendSuccess(res, 'Job description deleted successfully');
    }
    catch (error) {
        return next(error);
    }
});
export { jobsRouter };
//# sourceMappingURL=jobs.js.map