import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        email: loginDto.email,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos',
      );
    }

    if (usuario.password !== loginDto.password) {
      throw new UnauthorizedException(
        'Correo o contraseña incorrectos',
      );
    }

    return {
      mensaje: 'Inicio de sesión correcto',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const existe = await this.prisma.usuario.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existe) {
      throw new BadRequestException(
        'El correo ya está registrado',
      );
    }

    if (
      registerDto.rol === Role.ADMIN ||
      registerDto.rol === Role.BIBLIOTECARIO
    ) {
      throw new BadRequestException(
        'No puede registrarse con ese rol',
      );
    }

    const usuario = await this.prisma.usuario.create({
      data: registerDto,
    });

    return {
      mensaje: 'Usuario registrado correctamente',
      usuario,
    };
  }
}