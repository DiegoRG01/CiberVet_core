import { prisma } from "../config/prisma";

export const getAllPatients = async () => {
  return prisma.patient.findMany({
    include: {
      propietario: {
        select: {
          id: true,
          usuario: {
            select: {
              nombreCompleto: true,
            },
          },
        },
      },
    },
  });
};