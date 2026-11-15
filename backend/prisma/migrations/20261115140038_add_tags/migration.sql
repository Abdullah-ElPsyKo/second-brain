/*
  Warnings:

  - You are about to drop the column `tags` on the `Capture` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CaptureToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CaptureToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Capture" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CaptureToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Capture" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NOTE',
    "status" TEXT NOT NULL DEFAULT 'INBOX',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Capture" ("content", "createdAt", "id", "status", "title", "type", "updatedAt") SELECT "content", "createdAt", "id", "status", "title", "type", "updatedAt" FROM "Capture";
DROP TABLE "Capture";
ALTER TABLE "new_Capture" RENAME TO "Capture";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_CaptureToTag_AB_unique" ON "_CaptureToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CaptureToTag_B_index" ON "_CaptureToTag"("B");
