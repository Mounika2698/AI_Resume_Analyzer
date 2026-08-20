# ATS Scoring Algorithm

## Overview

The ATS (Applicant Tracking System) score is calculated using a transparent, measurable algorithm rather than subjective AI judgment.

**Total Score: 0-100**

## Scoring Breakdown

### 1. Keyword Match (30 points)

Compares keywords from the job description against resume text.

**Calculation:**

- Extract keywords from job description
- Count matching keywords in resume
- Score = (matched / total keywords) × 30

**Example:**

- Job requires: ["React", "Node.js", "AWS", "Docker"]
- Resume contains: ["React", "Node.js", "Docker"]
- Score = (3/4) × 30 = 22.5 points

### 2. Skills Match (25 points)

Compares required and preferred skills.

**Calculation:**

- Extract required skills from job description
- Extract skills from resume
- Required match: (matched required / total required) × 15
- Preferred match: (matched preferred / total preferred) × 10

**Example:**

- Required: ["JavaScript", "React", "TypeScript", "REST API"]
- Resume has: ["JavaScript", "React", "TypeScript"]
- Score = (3/4) × 15 = 11.25 points (required)
- Preferred: ["AWS", "Docker"]
- Resume has: ["Docker"]
- Score = (1/2) × 10 = 5 points (preferred)
- Total: 16.25 points

### 3. Job Title Relevance (10 points)

Matches current/most recent job title against target role.

**Calculation:**

- Exact match: 10 points
- Related match (e.g., "Sr. Developer" for "Developer"): 7 points
- Partial match: 4 points
- No match: 0 points

### 4. Experience Relevance (15 points)

Evaluates years and type of experience.

**Calculation:**

- Years of relevant experience score:
  - 5+ years: 10 points
  - 3-5 years: 8 points
  - 1-3 years: 5 points
  - 0-1 years: 2 points
- Experience type score:
  - Direct industry experience: 5 points
  - Adjacent industry: 3 points
  - Different industry: 1 point

### 5. Education & Certifications (5 points)

Checks for relevant degrees or certifications.

**Calculation:**

- Bachelor's degree: 3 points
- Master's degree: 4 points
- Relevant certification: 2 points each (max 3)
- Bootcamp: 1 point
- Multiple qualifications stack

### 6. Resume Structure (10 points)

Evaluates formatting and organization.

**Calculation:**

- Has clear contact information: 2 points
- Has professional summary: 2 points
- Has organized sections (experience, education, skills): 3 points
- Uses bullet points for achievements: 2 points
- Includes quantified metrics: 1 point

### 7. Formatting & Readability (5 points)

Checks for visual parsing issues.

**Calculation:**

- No formatting errors: 2 points
- Consistent bullet points: 1 point
- Clear date formatting: 1 point
- Reasonable spacing: 1 point

## Scoring Weights

```
Keyword Match        30%   (0-30 points)
Skills Match         25%   (0-25 points)
Job Title Relevance  10%   (0-10 points)
Experience Relevant  15%   (0-15 points)
Education/Certs       5%   (0-5 points)
Structure            10%   (0-10 points)
Formatting            5%   (0-5 points)
                     ----
TOTAL              100%   (0-100 points)
```

## Interpretation

- **80-100**: Excellent match, likely to pass ATS
- **70-79**: Good match, competitive candidate
- **60-69**: Fair match, some gaps
- **50-59**: Below average, significant gaps
- **0-49**: Poor match, likely to be filtered out

## Example Calculation

Resume: Senior React Developer with 4 years experience
Job: "React Developer, 3+ years, JavaScript, TypeScript"

| Category   | Max     | Calculation                    | Score  |
| ---------- | ------- | ------------------------------ | ------ |
| Keywords   | 30      | 4/5 matches                    | 24     |
| Skills     | 25      | React + JS + TS = 3/3 required | 22     |
| Title      | 10      | "Sr. React Dev" vs "React Dev" | 8      |
| Experience | 15      | 4 years, tech industry         | 12     |
| Education  | 5       | Bachelor's + AWS Cert          | 5      |
| Structure  | 10      | Well organized                 | 9      |
| Formatting | 5       | Clean formatting               | 5      |
| **TOTAL**  | **100** |                                | **85** |

## Customization

In production, this algorithm can be:

- Adjusted by industry
- Weighted based on client preference
- Combined with AI analysis for qualitative insights
- Configured per job posting

---

See [Development Guide](development.md) for implementation details.
