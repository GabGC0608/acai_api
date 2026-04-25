-- Add required endereco column to Cliente
-- Strategy:
-- 1) add column with default to avoid failing on existing rows
-- 2) backfill any existing rows
-- 3) enforce NOT NULL
-- 4) remove default (optional, keeps schema strict but DB clean)

ALTER TABLE "Cliente"
ADD COLUMN "endereco" TEXT;

UPDATE "Cliente"
SET "endereco" = ''
WHERE "endereco" IS NULL;

ALTER TABLE "Cliente"
ALTER COLUMN "endereco" SET NOT NULL;

