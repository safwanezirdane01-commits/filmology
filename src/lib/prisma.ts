import { PrismaClient } from '@prisma/client'

import fs from "fs";
import path from "path";

function createPrismaClient(): PrismaClient {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    try {
      const tmpDbPath = path.join("/tmp", "dev.db");
      if (!fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
        const sourcePath = path.join(process.cwd(), "prisma", "dev.db");
        if (fs.existsSync(/*turbopackIgnore: true*/ sourcePath)) {
          fs.copyFileSync(sourcePath, tmpDbPath);
        }
      }
      if (fs.existsSync(/*turbopackIgnore: true*/ tmpDbPath)) {
        return new PrismaClient({
          datasourceUrl: `file:${tmpDbPath}`,
        });
      }
    } catch (err) {
      console.warn("Could not copy SQLite database to /tmp:", err);
    }
  }

  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
