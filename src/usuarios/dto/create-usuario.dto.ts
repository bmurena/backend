import { Role } from '@prisma/client';

export class CreateUsuarioDto {
  email!: string;
  password!: string;
  nombre!: string;
  rol!: Role;
}