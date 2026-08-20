import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.info('Seeding development database...');

  // Clean existing data
  await prisma.interviewQuestion.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.jobDescription.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('DemoPassword123!', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Avery Morgan',
      email: 'avery.morgan@example.test',
      password,
    },
  });

  await prisma.jobDescription.create({
    data: {
      userId: user.id,
      title: 'Junior Full-Stack Developer',
      company: 'Northstar Labs',
      content:
        'Build accessible React and TypeScript interfaces, develop Node.js APIs, and work with SQL databases. Experience with Git, testing, and Docker is preferred.',
      requiredSkills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'SQL', 'Git']),
      preferredSkills: JSON.stringify(['Docker', 'Vitest', 'Accessibility']),
    },
  });

  console.info('Development seed created (fictional data only).');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
