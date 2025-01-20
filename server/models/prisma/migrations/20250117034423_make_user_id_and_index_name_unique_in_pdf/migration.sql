/*
  Warnings:

  - A unique constraint covering the columns `[userId,indexName]` on the table `Pdf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pdf_userId_indexName_key" ON "Pdf"("userId", "indexName");
