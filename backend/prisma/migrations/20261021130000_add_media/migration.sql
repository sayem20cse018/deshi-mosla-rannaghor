CREATE TABLE "media_files" (
  "id" TEXT NOT NULL,
  "publicId" VARCHAR(300) NOT NULL,
  "url" VARCHAR(500) NOT NULL,
  "secureUrl" VARCHAR(500) NOT NULL,
  "originalName" VARCHAR(255) NOT NULL,
  "altText" VARCHAR(255),
  "width" INTEGER,
  "height" INTEGER,
  "bytes" INTEGER,
  "format" VARCHAR(20),
  "folder" VARCHAR(100),
  "resourceType" VARCHAR(20) NOT NULL DEFAULT 'image',
  "uploadedBy" VARCHAR(100),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "media_files_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "media_files_publicId_key" ON "media_files"("publicId");
CREATE INDEX "media_files_folder_idx" ON "media_files"("folder");
CREATE INDEX "media_files_createdAt_idx" ON "media_files"("createdAt");
