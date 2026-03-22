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
    { nombre: "Perro", descripcion: "Canis lupus familiaris" },
    { nombre: "Gato", descripcion: "Felis catus" },
    { nombre: "Ave", descripcion: "Aves domésticas" },
    { nombre: "Conejo", descripcion: "Oryctolagus cuniculus" },
    { nombre: "Hámster", descripcion: "Cricetinae" },
    { nombre: "Cobayo", descripcion: "Cavia porcellus" },
    { nombre: "Reptil", descripcion: "Reptilia" },
    { nombre: "Pez", descripcion: "Peces ornamentales" },
  ];

  console.log("📦 Creando especies...");
  const species = await Promise.all(
    speciesData.map(async (sp) => {
      return await prisma.species.upsert({
        where: { nombre: sp.nombre },
        update: {},
        create: sp,
      });
    }),
  );
  console.log(`✅ ${species.length} especies creadas`);

  // Crear razas de perros
  const dogSpecies = species.find((s) => s.nombre === "Perro");
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
            especieId_nombre: {
              especieId: dogSpecies.id,
              nombre: breed,
            },
          },
          update: {},
          create: {
            especieId: dogSpecies.id,
            nombre: breed,
          },
        });
      }),
    );
    console.log(`✅ ${dogBreeds.length} razas de perro creadas`);
  }

  // Crear razas de gatos
  const catSpecies = species.find((s) => s.nombre === "Gato");
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
            especieId_nombre: {
              especieId: catSpecies.id,
              nombre: breed,
            },
          },
          update: {},
          create: {
            especieId: catSpecies.id,
            nombre: breed,
          },
        });
      }),
    );
    console.log(`✅ ${catBreeds.length} razas de gato creadas`);
  }

  // Crear razas de aves
  const birdSpecies = species.find((s) => s.nombre === "Ave");
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
            especieId_nombre: {
              especieId: birdSpecies.id,
              nombre: breed,
            },
          },
          update: {},
          create: {
            especieId: birdSpecies.id,
            nombre: breed,
          },
        });
      }),
    );
    console.log(`✅ ${birdBreeds.length} razas de ave creadas`);
  }

  // Crear razas de conejos
  const rabbitSpecies = species.find((s) => s.nombre === "Conejo");
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
            especieId_nombre: {
              especieId: rabbitSpecies.id,
              nombre: breed,
            },
          },
          update: {},
          create: {
            especieId: rabbitSpecies.id,
            nombre: breed,
          },
        });
      }),
    );
    console.log(`✅ ${rabbitBreeds.length} razas de conejo creadas`);
  }

  // ============================================
  // DATOS DE PRUEBA PARA CITAS
  // ============================================

  console.log("\n🏥 Creando clínica de prueba...");
  const business = await prisma.business.upsert({
    where: { correo: "clinica@cibervet.com" },
    update: {},
    create: {
      nombre: "CiberVet - Clínica Veterinaria",
      correo: "clinica@cibervet.com",
      telefono: "809-555-0100",
      direccion: "Av. Principal #123",
      ciudad: "Santo Domingo",
      estado: "Distrito Nacional",
      pais: "República Dominicana",
      codigoPostal: "10101",
    },
  });
  console.log(`✅ Clínica creada: ${business.nombre}`);

  // ============================================
  // VETERINARIOS DE PRUEBA
  // ============================================

  console.log("\n🩺 Creando veterinarios de prueba...");

  const vetUsersData = [
    {
      id: "a1b2c3d4-0001-4000-8000-000000000001",
      correo: "dr.martinez@cibervet.com",
      nombreCompleto: "Dr. Carlos Martínez",
      telefono: "809-555-1001",
      rol: "operador" as const,
      veterinariaId: business.id,
    },
    {
      id: "a1b2c3d4-0002-4000-8000-000000000002",
      correo: "dra.lopez@cibervet.com",
      nombreCompleto: "Dra. Sofía López",
      telefono: "809-555-1002",
      rol: "operador" as const,
      veterinariaId: business.id,
    },
    {
      id: "a1b2c3d4-0003-4000-8000-000000000003",
      correo: "dr.reyes@cibervet.com",
      nombreCompleto: "Dr. Andrés Reyes",
      telefono: "809-555-1003",
      rol: "operador" as const,
      veterinariaId: business.id,
    },
  ];

  for (const vetUser of vetUsersData) {
    await prisma.user.upsert({
      where: { id: vetUser.id },
      update: {},
      create: vetUser,
    });

    await prisma.veterinarian.upsert({
      where: { usuarioId: vetUser.id },
      update: {},
      create: {
        usuarioId: vetUser.id,
        veterinariaId: business.id,
        posicion: "Veterinario",
        fechaContratacion: new Date("2024-01-15"),
      },
    });
  }
  console.log(`✅ ${vetUsersData.length} veterinarios creados`);

  // Obtener razas para los pacientes
  const labradorBreed = await prisma.breed.findFirst({
    where: { nombre: "Labrador Retriever" },
  });
  const persaBreed = await prisma.breed.findFirst({
    where: { nombre: "Persa" },
  });
  const beagleBreed = await prisma.breed.findFirst({
    where: { nombre: "Beagle" },
  });

  console.log("\n👥 Creando usuarios y dueños de prueba...");
  
  // Primero crear usuarios de prueba
  const usersData = [
    {
      id: "601c6b1e-8c3e-4473-8d05-411b1ba0e0f2",
      correo: "maria@example.com",
      nombreCompleto: "María García",
      telefono: "809-555-0001",
      rol: "propietario" as const,
    },
    {
      id: "3cbb9ba5-578d-46fc-9cf9-f3841614cfc9",
      correo: "juan@example.com",
      nombreCompleto: "Juan Pérez",
      telefono: "809-555-0002",
      rol: "propietario" as const,
    },
    {
      id: "76b901bf-73c5-47b4-8c4c-155ed8b5cf61",
      correo: "ana@example.com",
      nombreCompleto: "Ana Rodríguez",
      telefono: "809-555-0003",
      rol: "propietario" as const,
    },
  ];

  // Crear usuarios
  for (const userData of usersData) {
    await prisma.user.upsert({
      where: { id: userData.id },
      update: {},
      create: userData,
    });
  }
  console.log(`✅ ${usersData.length} usuarios creados`);

  const ownersData = [
    {
      usuarioId: usersData[0].id,
      direccion: "Calle Luna #45",
      ciudad: "Santo Domingo",
    },
    {
      usuarioId: usersData[1].id,
      direccion: "Av. Sol #78",
      ciudad: "Santiago",
    },
    {
      usuarioId: usersData[2].id,
      direccion: "Calle Estrella #12",
      ciudad: "La Vega",
    },
  ];

  const owners = [];
  for (const ownerData of ownersData) {
    // Crear o actualizar owner
    const owner = await prisma.owner.upsert({
      where: { usuarioId: ownerData.usuarioId },
      update: {
        direccion: ownerData.direccion,
        ciudad: ownerData.ciudad,
      },
      create: {
        usuarioId: ownerData.usuarioId,
        veterinariaId: business.id,
        direccion: ownerData.direccion,
        ciudad: ownerData.ciudad,
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
        propietarioId: owners[0].id,
        nombre: "Max"
      }
    });
    
    if (!max) {
      max = await prisma.patient.create({
        data: {
          nombre: "Max",
          propietarioId: owners[0].id,
          veterinariaId: business.id,
          especieId: dogSpecies.id,
          razaId: labradorBreed.id,
          genero: "Macho",
          fechaNacimiento: new Date("2020-03-15"),
          peso: 28.5,
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
        propietarioId: owners[1].id,
        nombre: "Luna"
      }
    });
    
    if (!luna) {
      luna = await prisma.patient.create({
        data: {
          nombre: "Luna",
          propietarioId: owners[1].id,
          veterinariaId: business.id,
          especieId: catSpecies.id,
          razaId: persaBreed.id,
          genero: "Hembra",
          fechaNacimiento: new Date("2021-07-20"),
          peso: 4.2,
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
        propietarioId: owners[2].id,
        nombre: "Rocky"
      }
    });
    
    if (!rocky) {
      rocky = await prisma.patient.create({
        data: {
          nombre: "Rocky",
          propietarioId: owners[2].id,
          veterinariaId: business.id,
          especieId: dogSpecies.id,
          razaId: beagleBreed.id,
          genero: "Macho",
          fechaNacimiento: new Date("2019-11-10"),
          peso: 12.8,
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
      pacienteId: patients[0]?.id,
      propietarioId: owners[0]?.id,
      veterinariaId: business.id,
      fechaHora: new Date(today.setHours(9, 0, 0, 0)),
      duracionMinutos: 30,
      estado: "programada" as const,
      tipoCita: "Consulta General",
      motivo: "Revisión de rutina",
      notas: "Primera visita del mes",
    },
    // Cita confirmada para hoy a las 11:00 AM
    {
      pacienteId: patients[1]?.id,
      propietarioId: owners[1]?.id,
      veterinariaId: business.id,
      fechaHora: new Date(today.setHours(11, 0, 0, 0)),
      duracionMinutos: 45,
      estado: "confirmada" as const,
      tipoCita: "Vacunación",
      motivo: "Vacuna antirrábica anual",
      notas: "Traer cartilla de vacunación",
    },
    // Cita en progreso para hoy a las 2:00 PM
    {
      pacienteId: patients[2]?.id,
      propietarioId: owners[2]?.id,
      veterinariaId: business.id,
      fechaHora: new Date(today.setHours(14, 0, 0, 0)),
      duracionMinutos: 60,
      estado: "en_progreso" as const,
      tipoCita: "Cirugía Menor",
      motivo: "Extracción dental",
      notas: "Paciente en ayunas desde anoche",
    },
    // Cita completada de ayer a las 10:00 AM
    {
      pacienteId: patients[0]?.id,
      propietarioId: owners[0]?.id,
      veterinariaId: business.id,
      fechaHora: new Date(yesterday.setHours(10, 0, 0, 0)),
      duracionMinutos: 30,
      estado: "completada" as const,
      tipoCita: "Consulta General",
      motivo: "Control post-operatorio",
      notas: "Evolución favorable",
    },
    // Cita cancelada de ayer a las 3:00 PM
    {
      pacienteId: patients[1]?.id,
      propietarioId: owners[1]?.id,
      veterinariaId: business.id,
      fechaHora: new Date(yesterday.setHours(15, 0, 0, 0)),
      duracionMinutos: 30,
      estado: "cancelada" as const,
      tipoCita: "Baño y Peluquería",
      motivo: "Servicio de estética",
      notas: "Cancelado por el cliente",
      canceladoEn: new Date(yesterday.setHours(14, 30, 0, 0)),
      motivoCancelacion: "Emergencia familiar",
    },
    // Cita programada para mañana a las 8:00 AM
    {
      pacienteId: patients[2]?.id,
      propietarioId: owners[2]?.id,
      veterinariaId: business.id,
      fechaHora: new Date(tomorrow.setHours(8, 0, 0, 0)),
      duracionMinutos: 30,
      estado: "programada" as const,
      tipoCita: "Control",
      motivo: "Revisión post-cirugía",
      notas: "Retirar puntos",
    },
    // Cita programada para la próxima semana a las 10:30 AM
    {
      pacienteId: patients[0]?.id,
      propietarioId: owners[0]?.id,
      veterinariaId: business.id,
      fechaHora: new Date(nextWeek.setHours(10, 30, 0, 0)),
      duracionMinutos: 45,
      estado: "programada" as const,
      tipoCita: "Desparasitación",
      motivo: "Desparasitación trimestral",
      notas: "Aplicar tratamiento preventivo",
    },
  ];

  for (const apptData of appointmentsData) {
    if (apptData.pacienteId && apptData.propietarioId) {
      await prisma.appointment.create({
        data: apptData,
      });
    }
  }

  console.log(`✅ ${appointmentsData.length} citas creadas`);

  console.log("\n✨ Seed completado exitosamente!");
  console.log("\n📊 Resumen:");
  console.log(`   - ${species.length} especies`);
  console.log(`   - ${vetUsersData.length} veterinarios`);
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
