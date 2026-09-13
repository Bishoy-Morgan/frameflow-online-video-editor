-- CreateEnum
CREATE TYPE "MusicSource" AS ENUM ('UPLOAD', 'PIXABAY');

-- CreateEnum
CREATE TYPE "VoiceoverSource" AS ENUM ('UPLOAD', 'RECORDING');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "musicSource" "MusicSource",
ADD COLUMN     "musicUrl" TEXT,
ADD COLUMN     "musicVolume" DOUBLE PRECISION DEFAULT 0.5,
ADD COLUMN     "voiceoverSource" "VoiceoverSource",
ADD COLUMN     "voiceoverUrl" TEXT,
ADD COLUMN     "voiceoverVolume" DOUBLE PRECISION DEFAULT 1.0;

-- AlterTable
ALTER TABLE "Scene" ADD COLUMN     "keepOriginalAudio" BOOLEAN NOT NULL DEFAULT false;
