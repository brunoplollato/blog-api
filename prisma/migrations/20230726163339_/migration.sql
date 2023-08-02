/*
  Warnings:

  - A unique constraint covering the columns `[title,slug]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Post_slug_key";

-- DropIndex
DROP INDEX "Post_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "Post_title_slug_key" ON "Post"("title", "slug");
