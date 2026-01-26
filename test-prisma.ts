import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

async function testPrismaConnection() {
  console.log("🔍 Verificando conexión con Supabase...\n");

  // Mostrar las URLs (enmascaradas)
  const dbUrl = process.env.DATABASE_URL;
  const directUrl = process.env.DIRECT_URL;

  if (!dbUrl || !directUrl) {
    console.error(
      "❌ Error: DATABASE_URL o DIRECT_URL no están configuradas en .env",
    );
    console.log("\nAgrega en tu archivo .env:");
    console.log("DATABASE_URL=postgresql://...");
    console.log("DIRECT_URL=postgresql://...");
    return;
  }

  console.log(`✓ DATABASE_URL configurada: ${dbUrl.substring(0, 30)}...`);
  console.log(`✓ DIRECT_URL configurada: ${directUrl.substring(0, 30)}...\n`);

  let pool: pg.Pool | null = null;
  let prisma: PrismaClient | null = null;

  try {
    // Probar conexión directa con pg
    console.log("1️⃣ Probando conexión directa con pg...");
    pool = new pg.Pool({ connectionString: directUrl });

    const result = await pool.query(
      "SELECT NOW() as now, version() as version",
    );
    console.log("✅ Conexión directa exitosa!");
    console.log(`   Hora del servidor: ${result.rows[0].now}`);
    console.log(`   PostgreSQL: ${result.rows[0].version.split(",")[0]}\n`);

    // Probar con Prisma
    console.log("2️⃣ Probando conexión con Prisma + Adapter...");
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });

    await prisma.$connect();
    console.log("✅ Prisma conectado correctamente!\n");

    // Verificar tablas
    console.log("3️⃣ Verificando tablas en la base de datos...");
    const tables: any = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    if (tables.rows.length > 0) {
      console.log(`✅ Se encontraron ${tables.rows.length} tablas:`);
      tables.rows.forEach((row: any, idx: number) => {
        console.log(`   ${idx + 1}. ${row.table_name}`);
      });
      console.log("\n✅ Todo listo! Prisma está correctamente configurado.");
      console.log("\nPuedes usar Prisma en tu aplicación importando:");
      console.log('   import prisma from "./src/lib/prisma"');
    } else {
      console.log("⚠️  No se encontraron tablas en la base de datos.");
      console.log("\n📝 Para crear las tablas, tienes dos opciones:");
      console.log("\nOpción 1 - Usar Prisma (recomendado):");
      console.log("   pnpm prisma db push");
      console.log("\nOpción 2 - Ejecutar SQL manualmente:");
      console.log("   1. Abre: https://supabase.com/dashboard");
      console.log("   2. Ve a SQL Editor");
      console.log("   3. Pega el contenido de Context/db_definition.sql");
      console.log("   4. Ejecuta el script");
    }
  } catch (error: any) {
    console.error("\n❌ Error durante la prueba:", error.message);

    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      console.log("\n💡 Sugerencias:");
      console.log("   1. Verifica que las URLs de conexión sean correctas");
      console.log(
        "   2. Asegúrate de que tu IP esté en la whitelist de Supabase",
      );
      console.log("   3. Verifica que el proyecto de Supabase esté activo");
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
    if (pool) {
      await pool.end();
    }
    console.log("\n👋 Conexiones cerradas");
  }
}

testPrismaConnection();
