const { PrismaClient } = require('@prisma/client');

// Initialize and export Prisma Client
const prisma = new PrismaClient();

module.exports = prisma;
