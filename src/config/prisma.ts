import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

if (!process.env.DIRECT_URL && !process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL o DIRECT_URL no están definidas en las variables de entorno",
  );
}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });

// Manejar desconexión al cerrar la aplicación
process.on("beforeExit", async () => {
  await prisma.$disconnect();
  await pool.end();
});
