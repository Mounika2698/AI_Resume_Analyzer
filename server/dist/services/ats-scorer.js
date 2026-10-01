const stopWords = new Set([
    'and',
    'the',
    'with',
    'for',
    'from',
    'that',
    'this',
    'will',
    'have',
    'our',
    'your',
    'you',
    'are',
    'job',
    'role',
    'team',
    'work',
    'years',
    'experience',
    'skills',
    'about',
    'their',
]);
const unique = (items) => [
    ...new Set(items.map((item) => item.toLowerCase().trim()).filter(Boolean)),
];
const hasPhrase = (text, phrase) => text.toLowerCase().includes(phrase.toLowerCase());
const points = (matched, total, maximum) => total ? Math.round((matched / total) * maximum) : 0;
export const extractJobKeywords = (content) => unique((content.toLowerCase().match(/[a-z][a-z0-9+#.\-/]{1,}/g) ?? []).filter((word) => !stopWords.has(word) && word.length > 2)).slice(0, 60);
export const scoreResume = (resume, job) => {
    const text = resume.rawText.toLowerCase();
    const requiredSkills = unique(job.requiredSkills);
    const preferredSkills = unique(job.preferredSkills);
    const keywords = extractJobKeywords(job.content);
    const keywordMatchScore = points(keywords.filter((keyword) => hasPhrase(text, keyword)).length, keywords.length, 30);
    const requiredMatched = requiredSkills.filter((skill) => hasPhrase(text, skill));
    const preferredMatched = preferredSkills.filter((skill) => hasPhrase(text, skill));
    const skillsMatchScore = points(requiredMatched.length, requiredSkills.length, 15) +
        points(preferredMatched.length, preferredSkills.length, 10);
    const years = Math.max(...Array.from(text.matchAll(/(\d{1,2})\+?\s*(?:years?|yrs?)/g), (match) => Number(match[1])), 0);
    const experienceScore = years >= 5 ? 15 : years >= 3 ? 12 : years >= 1 ? 8 : resume.experience.length ? 5 : 0;
    const educationText = [...resume.education, ...resume.certifications].join(' ').toLowerCase();
    const educationScore = Math.min(5, (/(master|mba|ph\.?d)/.test(educationText)
        ? 4
        : /(bachelor|b\.s\.|b\.a\.)/.test(educationText)
            ? 3
            : 0) + (resume.certifications.length ? 2 : 0));
    const hasSections = [resume.experience, resume.education, resume.skills].filter((section) => section.length).length;
    const structureScore = (resume.email || resume.phone ? 2 : 0) +
        (resume.summary ? 2 : 0) +
        (hasSections === 3 ? 3 : hasSections) +
        (/^[•*-]\s/m.test(resume.rawText) ? 2 : 0) +
        (/\d+[%+]|\$\d+|\d+\s*(users|customers|projects)/i.test(resume.rawText) ? 1 : 0);
    const formatScore = Math.min(5, (resume.rawText.length > 300 ? 2 : 0) +
        (/^[•*-]\s/m.test(resume.rawText) ? 1 : 0) +
        (/\b(19|20)\d{2}\b/.test(text) ? 1 : 0) +
        1);
    const titleTerms = unique(job.title
        .split(/\s+/)
        .map((term) => term.replace(/[^a-z0-9+#.]/gi, ''))
        .filter((term) => term.length > 2 && !['senior', 'junior', 'lead'].includes(term.toLowerCase())));
    const titleMatches = titleTerms.filter((term) => hasPhrase(text, term)).length;
    const titleScore = titleMatches === titleTerms.length && titleTerms.length > 0
        ? 10
        : titleMatches > 0
            ? titleMatches / titleTerms.length >= 0.5
                ? 7
                : 4
            : 0;
    const overallScore = Math.min(100, keywordMatchScore +
        skillsMatchScore +
        titleScore +
        experienceScore +
        educationScore +
        structureScore +
        formatScore);
    return {
        overallScore,
        keywordMatchScore,
        skillsMatchScore,
        experienceScore,
        educationScore,
        structureScore,
        formatScore,
        missingSkills: requiredSkills.filter((skill) => !requiredMatched.includes(skill)),
    };
};
//# sourceMappingURL=ats-scorer.js.map