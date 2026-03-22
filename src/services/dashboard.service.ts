import { prisma } from "../config/prisma";

export interface ActivityLogItem {
  id: string;
  tipoAccion: string;
  tipoEntidad: string | null;
  descripcion: string;
  creadoEn: Date;
}

export interface DashboardStats {
  citasHoy: number;
  citasAyer: number;
  totalPacientes: number;
  pacientesNuevosMes: number;
  totalClientes: number;
  clientesNuevosMes: number;
  procedimientosMes: number;
  procedimientosMesAnterior: number;
  actividadReciente: ActivityLogItem[];
}

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const now = new Date();

    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      citasHoy,
      citasAyer,
      totalPacientes,
      pacientesNuevosMes,
      totalClientes,
      clientesNuevosMes,
      procedimientosMes,
      procedimientosMesAnterior,
      actividadReciente,
    ] = await prisma.$transaction([
      prisma.appointment.count({
        where: {
          fechaHora: { gte: todayStart, lte: todayEnd },
          estado: { notIn: ["cancelada", "no_asistio"] },
        },
      }),
      prisma.appointment.count({
        where: {
          fechaHora: { gte: yesterdayStart, lte: yesterdayEnd },
          estado: { notIn: ["cancelada", "no_asistio"] },
        },
      }),
      prisma.patient.count({
        where: { estaActivo: true },
      }),
      prisma.patient.count({
        where: {
          creadoEn: { gte: monthStart, lt: nextMonthStart },
        },
      }),
      prisma.user.count({
        where: { rol: "propietario", estaActivo: true },
      }),
      prisma.user.count({
        where: {
          rol: "propietario",
          creadoEn: { gte: monthStart, lt: nextMonthStart },
        },
      }),
      prisma.procedureCita.count({
        where: {
          cita: { fechaHora: { gte: monthStart, lt: nextMonthStart }, estado: { notIn: ["cancelada", "no_asistio"] } },
        },
      }),
      prisma.procedureCita.count({
        where: {
          cita: { fechaHora: { gte: lastMonthStart, lt: monthStart }, estado: { notIn: ["cancelada", "no_asistio"] } },
        },
      }),
      prisma.activityLog.findMany({
        select: {
          id: true,
          tipoAccion: true,
          tipoEntidad: true,
          descripcion: true,
          creadoEn: true,
        },
        orderBy: { creadoEn: "desc" },
        take: 10,
      }),
    ]);

    return {
      citasHoy,
      citasAyer,
      totalPacientes,
      pacientesNuevosMes,
      totalClientes,
      clientesNuevosMes,
      procedimientosMes,
      procedimientosMesAnterior,
      actividadReciente,
    };
  }
}

export const dashboardService = new DashboardService();
