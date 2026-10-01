export type AtsScore = {
    overallScore: number;
    keywordMatchScore: number;
    skillsMatchScore: number;
    experienceScore: number;
    educationScore: number;
    structureScore: number;
    formatScore: number;
    missingSkills: string[];
};
type ResumeInput = {
    rawText: string;
    skills: string[];
    education: string[];
    experience: string[];
    certifications: string[];
    email: string | null;
    phone: string | null;
    summary: string | null;
};
export declare const extractJobKeywords: (content: string) => string[];
export declare const scoreResume: (resume: ResumeInput, job: {
    title: string;
    content: string;
    requiredSkills: string[];
    preferredSkills: string[];
}) => AtsScore;
export {};
//# sourceMappingURL=ats-scorer.d.ts.map