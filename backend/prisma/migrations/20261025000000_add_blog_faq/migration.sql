-- Blog posts table
CREATE TABLE IF NOT EXISTS "blog_posts" (
    "id"          TEXT NOT NULL,
    "title"       VARCHAR(300) NOT NULL,
    "titleEn"     VARCHAR(300),
    "slug"        VARCHAR(320) NOT NULL,
    "excerpt"     TEXT,
    "excerptEn"   TEXT,
    "content"     TEXT,
    "contentEn"   TEXT,
    "coverImage"  VARCHAR(500),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "metaTitle"   VARCHAR(200),
    "metaDesc"    VARCHAR(500),
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "blog_posts_slug_key" ON "blog_posts"("slug");
CREATE INDEX IF NOT EXISTS "blog_posts_isPublished_idx" ON "blog_posts"("isPublished");
CREATE INDEX IF NOT EXISTS "blog_posts_publishedAt_idx" ON "blog_posts"("publishedAt");

-- FAQs table
CREATE TABLE IF NOT EXISTS "faqs" (
    "id"          TEXT NOT NULL,
    "question"    TEXT NOT NULL,
    "questionEn"  TEXT,
    "answer"      TEXT NOT NULL,
    "answerEn"    TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder"   INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "faqs_isPublished_sortOrder_idx" ON "faqs"("isPublished", "sortOrder");