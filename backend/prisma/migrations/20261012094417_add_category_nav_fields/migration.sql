-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "navOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "showInNav" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "categories_showInNav_navOrder_idx" ON "categories"("showInNav", "navOrder");
