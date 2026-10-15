-- CreateEnum
CREATE TYPE "AudioLayerType" AS ENUM ('MUSIC', 'VOICEOVER');

-- CreateTable
CREATE TABLE "AudioLayer" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" "AudioLayerType" NOT NULL,
    "url" TEXT NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "startTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "row" INTEGER NOT NULL DEFAULT 0,
    "sourceDuration" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioLayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AudioLayer_projectId_idx" ON "AudioLayer"("projectId");

-- AddForeignKey
ALTER TABLE "AudioLayer" ADD CONSTRAINT "AudioLayer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
