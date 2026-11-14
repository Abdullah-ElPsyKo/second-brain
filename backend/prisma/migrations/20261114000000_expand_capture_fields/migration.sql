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

INSERT INTO "new_Capture" (
    "id",
    "content",
    "createdAt",
    "updatedAt"
)
SELECT
    CAST("id" AS TEXT),
    "content",
    "createdAt",
    "createdAt"
FROM "Capture";

DROP TABLE "Capture";
ALTER TABLE "new_Capture" RENAME TO "Capture";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
