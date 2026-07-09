import { EstadoPrestamo } from '@prisma/client';

export class UpdatePrestamoDto {
  fechaMaxDevolucion?: string;
  fechaDevolucionAt?: string;
  estado?: EstadoPrestamo;
  documentoGarantia?: string;
  totalCosto?: number;
  multaAcumulada?: number;
}