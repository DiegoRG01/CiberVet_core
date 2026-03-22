import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

// =====================================================
// CATÁLOGO DE PROCEDIMIENTOS VETERINARIOS COMUNES
// =====================================================
// Cada procedimiento se asociará automáticamente a las
// citas existentes en la base de datos según su tipoCita.
// =====================================================

const PROCEDIMIENTOS_POR_TIPO: Record<
  string,
  { nombre: string; descripcion: string; costo: number; duracionMinutos: number }[]
> = {
  "Consulta General": [
    {
      nombre: "Examen físico general",
      descripcion:
        "Evaluación completa del estado de salud: auscultación cardio-pulmonar, palpación abdominal, revisión de mucosas y ganglios.",
      costo: 500,
      duracionMinutos: 15,
    },
    {
      nombre: "Toma de temperatura y signos vitales",
      descripcion:
        "Registro de temperatura rectal, frecuencia cardíaca, frecuencia respiratoria y presión arterial.",
      costo: 150,
      duracionMinutos: 5,
    },
    {
      nombre: "Evaluación de peso y condición corporal",
      descripcion:
        "Pesaje del paciente y valoración del índice de condición corporal (BCS) en escala del 1 al 9.",
      costo: 100,
      duracionMinutos: 5,
    },
  ],
  "Vacunación": [
    {
      nombre: "Vacuna antirrábica",
      descripcion:
        "Aplicación de vacuna antirrábica inactivada. Protección contra el virus de la rabia. Refuerzo anual.",
      costo: 350,
      duracionMinutos: 10,
    },
    {
      nombre: "Vacuna séxtuple canina (DHPPI+L)",
      descripcion:
        "Vacuna polivalente contra Distemper, Hepatitis, Parainfluenza, Parvovirus e Leptospira.",
      costo: 600,
      duracionMinutos: 10,
    },
    {
      nombre: "Vacuna triple felina (FPV+FHV+FCV)",
      descripcion:
        "Vacuna polivalente felina contra Panleucopenia, Rinotraqueítis y Calicivirus.",
      costo: 550,
      duracionMinutos: 10,
    },
    {
      nombre: "Vacuna contra Bordetella",
      descripcion:
        "Aplicación intranasal o inyectable contra la tos de las perreras (Bordetella bronchiseptica).",
      costo: 400,
      duracionMinutos: 10,
    },
    {
      nombre: "Registro en cartilla de vacunación",
      descripcion:
        "Anotación de la vacuna aplicada, número de lote y próxima fecha de refuerzo en la cartilla oficial.",
      costo: 0,
      duracionMinutos: 5,
    },
  ],
  "Desparasitación": [
    {
      nombre: "Desparasitación interna (antiparasitario oral)",
      descripcion:
        "Administración de antiparasitario de amplio espectro contra nematodos y cestodos (p. ej. Milbemicina, Praziquantel).",
      costo: 300,
      duracionMinutos: 5,
    },
    {
      nombre: "Desparasitación externa (antipulgas y garrapatas)",
      descripcion:
        "Aplicación tópica o inyectable de Fipronil / Selamectina / Fluralaner para control de ectoparásitos.",
      costo: 350,
      duracionMinutos: 10,
    },
    {
      nombre: "Coprológico preventivo",
      descripcion:
        "Análisis de muestra fecal para detección de parásitos gastrointestinales antes de tratar.",
      costo: 400,
      duracionMinutos: 20,
    },
  ],
  "Cirugía Menor": [
    {
      nombre: "Preparación preanestésica",
      descripcion:
        "Ayuno verificado, colocación de vía venosa, premedicación con acepromazina/butorfanol y monitoreo previo a inducción.",
      costo: 700,
      duracionMinutos: 15,
    },
    {
      nombre: "Anestesia general inhalatoria",
      descripcion:
        "Inducción con propofol IV, mantenimiento con isoflurano en circuito cerrado y monitoreo multiparamétrico.",
      costo: 1200,
      duracionMinutos: 30,
    },
    {
      nombre: "Extracción dental simple",
      descripcion:
        "Extracción de pieza dental con movilidad grado III o fractura irreparable, bajo anestesia general.",
      costo: 800,
      duracionMinutos: 20,
    },
    {
      nombre: "Sutura de herida",
      descripcion:
        "Limpieza, desbridamiento y sutura de herida superficial con material absorbible o no absorbible.",
      costo: 600,
      duracionMinutos: 15,
    },
    {
      nombre: "Aplicación de antibiótico postoperatorio",
      descripcion:
        "Administración de amoxicilina-ácido clavulánico inyectable como profilaxis postoperatoria.",
      costo: 250,
      duracionMinutos: 5,
    },
  ],
  "Control": [
    {
      nombre: "Revisión de herida postoperatoria",
      descripcion:
        "Inspección del sitio quirúrgico, evaluación de proceso de cicatrización y limpieza con antiséptico.",
      costo: 300,
      duracionMinutos: 10,
    },
    {
      nombre: "Retiro de puntos",
      descripcion:
        "Extracción de puntos de sutura no absorbibles entre 10 y 14 días post-cirugía.",
      costo: 200,
      duracionMinutos: 10,
    },
    {
      nombre: "Evaluación de respuesta al tratamiento",
      descripcion:
        "Valoración clínica de la evolución del paciente y ajuste de medicación si es necesario.",
      costo: 350,
      duracionMinutos: 15,
    },
  ],
  "Baño y Peluquería": [
    {
      nombre: "Baño medicado con champú antipulgas",
      descripcion:
        "Baño completo con champú a base de Piretrinas o Clorexidina, con tiempo de contacto de 10 minutos.",
      costo: 400,
      duracionMinutos: 30,
    },
    {
      nombre: "Corte de pelo y arreglo de orejas",
      descripcion: "Grooming estético: corte según estándar de raza, limpieza y arreglo de orejas.",
      costo: 600,
      duracionMinutos: 45,
    },
    {
      nombre: "Corte de uñas",
      descripcion:
        "Limado y/o corte de uñas con cortaúñas profesional, evitando la zona del tejido vivo (quick).",
      costo: 150,
      duracionMinutos: 10,
    },
  ],
};

// Procedimientos genéricos que se aplican a CUALQUIER cita
const PROCEDIMIENTOS_GENERICOS = [
  {
    nombre: "Examen físico general",
    descripcion:
      "Evaluación completa del estado de salud: auscultación cardio-pulmonar, palpación abdominal, revisión de mucosas y ganglios.",
    costo: 500,
    duracionMinutos: 15,
  },
  {
    nombre: "Toma de temperatura y signos vitales",
    descripcion:
      "Registro de temperatura rectal, frecuencia cardíaca, frecuencia respiratoria y presión arterial.",
    costo: 150,
    duracionMinutos: 5,
  },
];

async function main() {
  console.log("🌱 Iniciando seed de procedimientos veterinarios...\n");

  // Obtener todas las citas existentes con su tipo
  const citas = await prisma.appointment.findMany({
    select: {
      id: true,
      tipoCita: true,
      motivo: true,
      estado: true,
      paciente: { select: { nombre: true } },
    },
  });

  if (citas.length === 0) {
    console.log("⚠️  No se encontraron citas en la base de datos.");
    console.log("   Ejecuta primero: pnpm prisma:seed");
    return;
  }

  console.log(`📋 Se encontraron ${citas.length} citas. Creando procedimientos...\n`);

  let totalProcedimientos = 0;

  for (const cita of citas) {
    const tipoCita = cita.tipoCita ?? "Consulta General";

    // Verificar si ya tiene procedimientos
    const existentes = await prisma.procedure.count({
      where: { citaId: cita.id },
    });

    if (existentes > 0) {
      console.log(
        `⏭️  Cita "${tipoCita}" del paciente ${cita.paciente.nombre} ya tiene ${existentes} procedimiento(s). Saltando...`
      );
      continue;
    }

    // Obtener los procedimientos para este tipo de cita
    const procedimientosDeTipo =
      PROCEDIMIENTOS_POR_TIPO[tipoCita] ?? PROCEDIMIENTOS_GENERICOS;

    for (const proc of procedimientosDeTipo) {
      await prisma.procedure.create({
        data: {
          citaId: cita.id,
          nombre: proc.nombre,
          descripcion: proc.descripcion,
          costo: proc.costo,
          duracionMinutos: proc.duracionMinutos,
          estaActivo: true,
        },
      });
      totalProcedimientos++;
    }

    console.log(
      `✅ ${procedimientosDeTipo.length} procedimiento(s) creado(s) para "${tipoCita}" — Paciente: ${cita.paciente.nombre}`
    );
  }

  console.log(`\n✨ Seed de procedimientos completado!`);
  console.log(`\n📊 Resumen:`);
  console.log(`   - ${citas.length} citas procesadas`);
  console.log(`   - ${totalProcedimientos} procedimientos creados en total`);
  console.log(`\n💡 Los procedimientos creados cubren:`);
  console.log(`   🔬 Consulta General    → Examen físico, signos vitales, condición corporal`);
  console.log(`   💉 Vacunación          → Antirrábica, séxtuple, triple felina, Bordetella`);
  console.log(`   🪱 Desparasitación     → Interna, externa y coprológico`);
  console.log(`   🔪 Cirugía Menor       → Preanestesia, anestesia, extracción, sutura`);
  console.log(`   📋 Control             → Revisión, retiro de puntos, evaluación`);
  console.log(`   🛁 Baño y Peluquería   → Baño medicado, corte de pelo, uñas`);
}

main()
  .catch((e) => {
    console.error("❌ Error en el seed de procedimientos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
