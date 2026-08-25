export type ParsedResume = {
    rawText: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
    skills: string[];
    education: string[];
    experience: string[];
    projects: string[];
    certifications: string[];
    summary: string | null;
};
export declare const parseResume: (file: Express.Multer.File) => Promise<ParsedResume>;
//# sourceMappingURL=resume-parser.d.ts.map