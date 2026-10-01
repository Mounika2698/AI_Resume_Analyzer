import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { scoreResume } from '../services/ats-scorer.js';
import { sendError, sendSuccess } from '../utils/response.js';
const analysesRouter = Router();
const schema = z.object({ resumeId: z.string().min(1), jobDescriptionId: z.string().min(1) });
const select = {
    id: true,
    resumeId: true,
    jobDescriptionId: true,
    overallScore: true,
    keywordMatchScore: true,
    skillsMatchScore: true,
    experienceScore: true,
    educationScore: true,
    structureScore: true,
    formatScore: true,
    missingSkills: true,
    createdAt: true,
    resume: { select: { fileName: true } },
    jobDescription: { select: { title: true, company: true } },
};
const serialize = (analysis) => ({
    ...analysis,
    missingSkills: analysis.missingSkills ? JSON.parse(analysis.missingSkills) : [],
});
analysesRouter.post('/', requireAuth, async (req, res, next) => {
    try {
        const input = schema.safeParse(req.body);
        if (!input.success)
            return sendError(res, 'Choose a resume and job description', 'VALIDATION_ERROR', 400);
        const [resume, job] = await Promise.all([
            prisma.resume.findFirst({ where: { id: input.data.resumeId, userId: req.user.id } }),
            prisma.jobDescription.findFirst({
                where: { id: input.data.jobDescriptionId, userId: req.user.id },
            }),
        ]);
        if (!resume || !job)
            return sendError(res, 'Resume or job description not found', 'RESOURCE_NOT_FOUND', 404);
        const scored = scoreResume({
            ...resume,
            skills: JSON.parse(resume.skills),
            education: JSON.parse(resume.education),
            experience: JSON.parse(resume.experience),
            certifications: JSON.parse(resume.certifications || '[]'),
        }, {
            ...job,
            requiredSkills: JSON.parse(job.requiredSkills),
            preferredSkills: JSON.parse(job.preferredSkills),
        });
        const analysis = await prisma.analysis.create({
            data: {
                userId: req.user.id,
                resumeId: resume.id,
                jobDescriptionId: job.id,
                ...scored,
                missingSkills: JSON.stringify(scored.missingSkills),
            },
            select,
        });
        return sendSuccess(res, 'ATS analysis completed successfully', { analysis: serialize(analysis) }, 201);
    }
    catch (error) {
        return next(error);
    }
});
analysesRouter.get('/', requireAuth, async (req, res, next) => {
    try {
        const analyses = await prisma.analysis.findMany({
            where: { userId: req.user.id },
            select,
            orderBy: { createdAt: 'desc' },
        });
        return sendSuccess(res, 'Analyses retrieved successfully', {
            analyses: analyses.map(serialize),
        });
    }
    catch (error) {
        return next(error);
    }
});
export { analysesRouter };
//# sourceMappingURL=analyses.js.map