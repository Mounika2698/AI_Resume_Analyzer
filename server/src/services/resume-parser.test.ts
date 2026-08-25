import { describe, expect, it } from 'vitest';
import { parseResume } from './resume-parser.js';

describe('parseResume', () => {
  it('extracts basic details and sections from a text resume', async () => {
    const parsed = await parseResume({
      buffer: Buffer.from(
        `Avery Morgan\navery@example.com | +1 (555) 123-4567\n\nSkills\nTypeScript\nReact\n\nEducation\nState University\n\nExperience\nSoftware Engineer at Example Co.`
      ),
      mimetype: 'text/plain',
    } as Express.Multer.File);

    expect(parsed).toMatchObject({
      name: 'Avery Morgan',
      email: 'avery@example.com',
      skills: ['TypeScript', 'React'],
      education: ['State University'],
      experience: ['Software Engineer at Example Co.'],
    });
  });
});
