import mammoth from 'mammoth';
import pdf from 'pdf-parse';
const sectionHeadings = {
    skills: ['skills', 'technical skills', 'core competencies'],
    education: ['education', 'academic background'],
    experience: ['experience', 'work experience', 'employment history', 'professional experience'],
    projects: ['projects', 'personal projects', 'selected projects'],
    certifications: ['certifications', 'certificates', 'licenses'],
};
const normalizeText = (text) => text
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
const findSection = (text, headings) => {
    const lines = text.split('\n').map((line) => line.trim());
    const start = lines.findIndex((line) => headings.some((heading) => line.toLowerCase() === heading));
    if (start === -1)
        return [];
    const values = [];
    for (const line of lines.slice(start + 1)) {
        if (Object.values(sectionHeadings).some((knownHeadings) => knownHeadings.includes(line.toLowerCase())))
            break;
        if (line)
            values.push(line.replace(/^[•\-*]\s*/, ''));
    }
    return values.slice(0, 20);
};
const parseText = (rawText) => {
    const text = normalizeText(rawText);
    const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
    const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
    const phone = text.match(/(?:\+?\d[\d().\-\s]{7,}\d)/)?.[0]?.trim() ?? null;
    const name = lines.find((line) => /^[A-Za-z][A-Za-z .'-]{1,80}$/.test(line)) ?? null;
    const location = lines.find((line) => /\b(?:city|state|usa|united states|remote)\b/i.test(line)) ?? null;
    return {
        rawText: text,
        name,
        email,
        phone,
        location,
        skills: findSection(text, sectionHeadings.skills),
        education: findSection(text, sectionHeadings.education),
        experience: findSection(text, sectionHeadings.experience),
        projects: findSection(text, sectionHeadings.projects),
        certifications: findSection(text, sectionHeadings.certifications),
        summary: lines.slice(0, 3).join(' ').slice(0, 1000) || null,
    };
};
export const parseResume = async (file) => {
    let text;
    if (file.mimetype === 'application/pdf')
        text = (await pdf(file.buffer)).text;
    else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        text = (await mammoth.extractRawText({ buffer: file.buffer })).value;
    else
        text = file.buffer.toString('utf8');
    const parsed = parseText(text);
    if (!parsed.rawText)
        throw new Error('The uploaded file does not contain readable text');
    return parsed;
};
//# sourceMappingURL=resume-parser.js.map