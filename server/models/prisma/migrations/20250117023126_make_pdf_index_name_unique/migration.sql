/*
  Warnings:

  - A unique constraint covering the columns `[indexName]` on the table `Pdf` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pdf_indexName_key" ON "Pdf"("indexName");
