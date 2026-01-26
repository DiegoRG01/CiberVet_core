import { z } from 'zod';

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  veterinaryId: z.string().uuid(),
  appointmentDate: z.string().datetime(),
  appointmentType: z.string().min(1),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;
