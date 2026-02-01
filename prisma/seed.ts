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

  // ============================================
  // DATOS DE PRUEBA PARA CITAS
  // ============================================

  console.log("\n🏥 Creando veterinaria de prueba...");
  const veterinary = await prisma.veterinary.upsert({
    where: { email: "clinica@cibervet.com" },
    update: {},
    create: {
      name: "CiberVet - Clínica Veterinaria",
      email: "clinica@cibervet.com",
      phone: "809-555-0100",
      address: "Av. Principal #123",
      city: "Santo Domingo",
      state: "Distrito Nacional",
      country: "República Dominicana",
      postalCode: "10101",
    },
  });
  console.log(`✅ Veterinaria creada: ${veterinary.name}`);

  // Obtener razas para los pacientes
  const labradorBreed = await prisma.breed.findFirst({
    where: { name: "Labrador Retriever" },
  });
  const persaBreed = await prisma.breed.findFirst({
    where: { name: "Persa" },
  });
  const beagleBreed = await prisma.breed.findFirst({
    where: { name: "Beagle" },
  });

  console.log("\n👥 Creando dueños de prueba...");
  
  // IDs de usuarios existentes en Supabase
  const userIds = [
    "601c6b1e-8c3e-4473-8d05-411b1ba0e0f2",
    "3cbb9ba5-578d-46fc-9cf9-f3841614cfc9",
    "76b901bf-73c5-47b4-8c4c-155ed8b5cf61",
  ];

  const ownersData = [
    {
      userId: userIds[0],
      address: "Calle Luna #45",
      city: "Santo Domingo",
    },
    {
      userId: userIds[1],
      address: "Av. Sol #78",
      city: "Santiago",
    },
    {
      userId: userIds[2],
      address: "Calle Estrella #12",
      city: "La Vega",
    },
  ];

  const owners = [];
  for (const ownerData of ownersData) {
    // Crear o actualizar owner
    const owner = await prisma.owner.upsert({
      where: { userId: ownerData.userId },
      update: {
        address: ownerData.address,
        city: ownerData.city,
      },
      create: {
        userId: ownerData.userId,
        veterinaryId: veterinary.id,
        address: ownerData.address,
        city: ownerData.city,
      },
    });
    owners.push(owner);
    console.log(`✅ Owner creado: ${owner.id}`);
  }

  if (owners.length === 0) {
    console.log("\n⚠️  No se crearon owners.");
    console.log("✨ Seed de especies y razas completado exitosamente!");
    return;
  }

  console.log(`\n🐾 Creando pacientes de prueba...`);
  const patients = [];

  // Paciente 1: Max (Labrador de María)
  if (owners[0] && dogSpecies && labradorBreed) {
    let max = await prisma.patient.findFirst({
      where: {
        ownerId: owners[0].id,
        name: "Max"
      }
    });
    
    if (!max) {
      max = await prisma.patient.create({
        data: {
          name: "Max",
          ownerId: owners[0].id,
          veterinaryId: veterinary.id,
          speciesId: dogSpecies.id,
          breedId: labradorBreed.id,
          gender: "Macho",
          birthDate: new Date("2020-03-15"),
          weight: 28.5,
          color: "Dorado",
        },
      });
    }
    patients.push(max);
  }

  // Paciente 2: Luna (Gata Persa de Juan)
  if (owners[1] && catSpecies && persaBreed) {
    let luna = await prisma.patient.findFirst({
      where: {
        ownerId: owners[1].id,
        name: "Luna"
      }
    });
    
    if (!luna) {
      luna = await prisma.patient.create({
        data: {
          name: "Luna",
          ownerId: owners[1].id,
          veterinaryId: veterinary.id,
          speciesId: catSpecies.id,
          breedId: persaBreed.id,
          gender: "Hembra",
          birthDate: new Date("2021-07-20"),
          weight: 4.2,
          color: "Blanco",
        },
      });
    }
    patients.push(luna);
  }

  // Paciente 3: Rocky (Beagle de Ana)
  if (owners[2] && dogSpecies && beagleBreed) {
    let rocky = await prisma.patient.findFirst({
      where: {
        ownerId: owners[2].id,
        name: "Rocky"
      }
    });
    
    if (!rocky) {
      rocky = await prisma.patient.create({
        data: {
          name: "Rocky",
          ownerId: owners[2].id,
          veterinaryId: veterinary.id,
          speciesId: dogSpecies.id,
          breedId: beagleBreed.id,
          gender: "Macho",
          birthDate: new Date("2019-11-10"),
          weight: 12.8,
          color: "Tricolor",
        },
      });
    }
    patients.push(rocky);
  }

  console.log(`✅ ${patients.length} pacientes creados`);

  console.log("\n📅 Creando citas de prueba...");
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const appointmentsData = [
    // Cita programada para hoy a las 9:00 AM
    {
      patientId: patients[0]?.id,
      ownerId: owners[0]?.id,
      veterinaryId: veterinary.id,
      dateTime: new Date(today.setHours(9, 0, 0, 0)),
      durationMinutes: 30,
      status: "scheduled" as const,
      appointmentType: "Consulta General",
      reason: "Revisión de rutina",
      notes: "Primera visita del mes",
    },
    // Cita confirmada para hoy a las 11:00 AM
    {
      patientId: patients[1]?.id,
      ownerId: owners[1]?.id,
      veterinaryId: veterinary.id,
      dateTime: new Date(today.setHours(11, 0, 0, 0)),
      durationMinutes: 45,
      status: "confirmed" as const,
      appointmentType: "Vacunación",
      reason: "Vacuna antirrábica anual",
      notes: "Traer cartilla de vacunación",
    },
    // Cita en progreso para hoy a las 2:00 PM
    {
      patientId: patients[2]?.id,
      ownerId: owners[2]?.id,
      veterinaryId: veterinary.id,
      dateTime: new Date(today.setHours(14, 0, 0, 0)),
      durationMinutes: 60,
      status: "in_progress" as const,
      appointmentType: "Cirugía Menor",
      reason: "Extracción dental",
      notes: "Paciente en ayunas desde anoche",
    },
    // Cita completada de ayer a las 10:00 AM
    {
      patientId: patients[0]?.id,
      ownerId: owners[0]?.id,
      veterinaryId: veterinary.id,
      dateTime: new Date(yesterday.setHours(10, 0, 0, 0)),
      durationMinutes: 30,
      status: "completed" as const,
      appointmentType: "Consulta General",
      reason: "Control post-operatorio",
      notes: "Evolución favorable",
    },
    // Cita cancelada de ayer a las 3:00 PM
    {
      patientId: patients[1]?.id,
      ownerId: owners[1]?.id,
      veterinaryId: veterinary.id,
      dateTime: new Date(yesterday.setHours(15, 0, 0, 0)),
      durationMinutes: 30,
      status: "cancelled" as const,
      appointmentType: "Baño y Peluquería",
      reason: "Servicio de estética",
      notes: "Cancelado por el cliente",
      cancelledAt: new Date(yesterday.setHours(14, 30, 0, 0)),
      cancellationReason: "Emergencia familiar",
    },
    // Cita programada para mañana a las 8:00 AM
    {
      patientId: patients[2]?.id,
      ownerId: owners[2]?.id,
      veterinaryId: veterinary.id,
      dateTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
      durationMinutes: 30,
      status: "scheduled" as const,
      appointmentType: "Control",
      reason: "Revisión post-cirugía",
      notes: "Retirar puntos",
    },
    // Cita programada para la próxima semana a las 10:30 AM
    {
      patientId: patients[0]?.id,
      ownerId: owners[0]?.id,
      veterinaryId: veterinary.id,
      dateTime: new Date(nextWeek.setHours(10, 30, 0, 0)),
      durationMinutes: 45,
      status: "scheduled" as const,
      appointmentType: "Desparasitación",
      reason: "Desparasitación trimestral",
      notes: "Aplicar tratamiento preventivo",
    },
  ];

  for (const apptData of appointmentsData) {
    if (apptData.patientId && apptData.ownerId) {
      await prisma.appointment.create({
        data: apptData,
      });
    }
  }

  console.log(`✅ ${appointmentsData.length} citas creadas`);

  console.log("\n✨ Seed completado exitosamente!");
  console.log("\n📊 Resumen:");
  console.log(`   - ${species.length} especies`);
  console.log(`   - ${owners.length} dueños`);
  console.log(`   - ${patients.length} pacientes`);
  console.log(`   - ${appointmentsData.length} citas`);
  console.log("\n💡 Ahora puedes probar la pantalla de citas con datos realistas!");
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
