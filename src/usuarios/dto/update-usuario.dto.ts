import { Role } from '@prisma/client';

export class UpdateUsuarioDto {
  email?: string;
  password?: string;
  nombre?: string;
  rol?: Role;
}