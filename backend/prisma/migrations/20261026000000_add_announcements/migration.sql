-- Announcements table for dynamic announcement bar
CREATE TABLE IF NOT EXISTS "announcements" (
    "id"        TEXT NOT NULL,
    "text"      VARCHAR(300) NOT NULL,
    "textEn"    VARCHAR(300),
    "link"      VARCHAR(300),
    "bgColor"   VARCHAR(30) NOT NULL DEFAULT 'ea580c',
    "textColor" VARCHAR(30) NOT NULL DEFAULT 'ffffff',
    "icon"      VARCHAR(30) NOT NULL DEFAULT 'truck',
    "isActive"  BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "announcements_isActive_sortOrder_idx" ON "announcements"("isActive", "sortOrder");