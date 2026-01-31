import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Crear especies
  const speciesData = [
    { name: "Perro", description: "Canis lupus familiaris" },
    { name: "Gato", description: "Felis catus" },
    { name: "Ave", description: "Aves domésticas" },
    { name: "Conejo", description: "Oryctolagus cuniculus" },
    { name: "Hámster", description: "Cricetinae" },
    { name: "Cobayo", description: "Cavia porcellus" },
    { name: "Reptil", description: "Reptilia" },
    { name: "Pez", description: "Peces ornamentales" },
  ];

  console.log("📦 Creando especies...");
  const species = await Promise.all(
    speciesData.map(async (sp) => {
      return await prisma.species.upsert({
        where: { name: sp.name },
        update: {},
        create: sp,
      });
    }),
  );
  console.log(`✅ ${species.length} especies creadas`);

  // Crear razas de perros
  const dogSpecies = species.find((s) => s.name === "Perro");
  if (dogSpecies) {
    const dogBreeds = [
      "Labrador Retriever",
      "Pastor Alemán",
      "Golden Retriever",
      "Bulldog Francés",
      "Bulldog Inglés",
      "Beagle",
      "Poodle",
      "Rottweiler",
      "Yorkshire Terrier",
      "Boxer",
      "Dachshund",
      "Shih Tzu",
      "Chihuahua",
      "Pomerania",
      "Husky Siberiano",
      "Doberman",
      "Schnauzer",
      "Cocker Spaniel",
      "Maltés",
      "Mestizo",
      "Otra",
    ];

    console.log("🐕 Creando razas de perros...");
    await Promise.all(
      dogBreeds.map(async (breed) => {
        return await prisma.breed.upsert({
          where: {
            speciesId_name: {
              speciesId: dogSpecies.id,
              name: breed,
            },
          },
          update: {},
          create: {
            speciesId: dogSpecies.id,
            name: breed,
          },
        });
      }),
    );
    console.log(`✅ ${dogBreeds.length} razas de perro creadas`);
  }

  // Crear razas de gatos
  const catSpecies = species.find((s) => s.name === "Gato");
  if (catSpecies) {
    const catBreeds = [
      "Persa",
      "Siamés",
      "Maine Coon",
      "Bengalí",
      "Ragdoll",
      "British Shorthair",
      "Sphynx",
      "Scottish Fold",
      "Angora",
      "Azul Ruso",
      "Europeo común",
      "Mestizo",
      "Otra",
    ];

    console.log("🐈 Creando razas de gatos...");
    await Promise.all(
      catBreeds.map(async (breed) => {
        return await prisma.breed.upsert({
          where: {
            speciesId_name: {
              speciesId: catSpecies.id,
              name: breed,
            },
          },
          update: {},
          create: {
            speciesId: catSpecies.id,
            name: breed,
          },
        });
      }),
    );
    console.log(`✅ ${catBreeds.length} razas de gato creadas`);
  }

  // Crear razas de aves
  const birdSpecies = species.find((s) => s.name === "Ave");
  if (birdSpecies) {
    const birdBreeds = [
      "Periquito",
      "Canario",
      "Loro",
      "Cacatúa",
      "Agapornis",
      "Ninfa",
      "Paloma",
      "Otra",
    ];

    console.log("🦜 Creando razas de aves...");
    await Promise.all(
      birdBreeds.map(async (breed) => {
        return await prisma.breed.upsert({
          where: {
            speciesId_name: {
              speciesId: birdSpecies.id,
              name: breed,
            },
          },
          update: {},
          create: {
            speciesId: birdSpecies.id,
            name: breed,
          },
        });
      }),
    );
    console.log(`✅ ${birdBreeds.length} razas de ave creadas`);
  }

  // Crear razas de conejos
  const rabbitSpecies = species.find((s) => s.name === "Conejo");
  if (rabbitSpecies) {
    const rabbitBreeds = [
      "Holandés",
      "Cabeza de León",
      "Belier",
      "Gigante de Flandes",
      "Rex",
      "Angora",
      "Otra",
    ];

    console.log("🐰 Creando razas de conejos...");
    await Promise.all(
      rabbitBreeds.map(async (breed) => {
        return await prisma.breed.upsert({
          where: {
            speciesId_name: {
              speciesId: rabbitSpecies.id,
              name: breed,
            },
          },
          update: {},
          create: {
            speciesId: rabbitSpecies.id,
            name: breed,
          },
        });
      }),
    );
    console.log(`✅ ${rabbitBreeds.length} razas de conejo creadas`);
  }

  console.log("✨ Seed completado exitosamente!");
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
