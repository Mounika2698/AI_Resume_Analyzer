import { describe, expect, it } from 'vitest';
import { scoreResume } from './ats-scorer.js';

describe('scoreResume', () => {
  it('scores matching skills and identifies missing required skills', () => {
    const result = scoreResume(
      {
        rawText:
          'Avery\navery@example.com\nExperience\n• Built React apps for 4 years and improved performance by 30%\nSkills\nReact, TypeScript\nEducation\nBachelor of Science\n2023',
        skills: ['React', 'TypeScript'],
        education: ['Bachelor of Science'],
        experience: ['Built React apps'],
        certifications: [],
        email: 'avery@example.com',
        phone: null,
        summary: 'Frontend engineer',
      },
      {
        title: 'React Developer',
        content: 'React TypeScript JavaScript developer with web application experience',
        requiredSkills: ['React', 'TypeScript', 'JavaScript'],
        preferredSkills: [],
      }
    );
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.skillsMatchScore).toBe(10);
    expect(result.missingSkills).toEqual(['javascript']);
  });
});
