import { Role } from '@prisma/client';

export class RegisterDto {
  nombre!: string;
  email!: string;
  password!: string;
  rol!: Role;
}