-- Preserve a private local filename so the stored upload can be removed with its resume record.
ALTER TABLE "resumes" ADD COLUMN "storagePath" TEXT NOT NULL DEFAULT '';
