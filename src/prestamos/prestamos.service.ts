import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';
import { EstadoPrestamo } from '@prisma/client';

@Injectable()
export class PrestamosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.prestamo.findMany({
      include: {
        usuario: true,
        libros: {
          include: {
            libro: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.prestamo.findUnique({
      where: { id },
      include: {
        usuario: true,
        libros: {
          include: {
            libro: true,
          },
        },
      },
    });
  }

  async create(createPrestamoDto: CreatePrestamoDto) {
    const libros = await this.prisma.libro.findMany({
      where: {
        id: {
          in: createPrestamoDto.libroIds,
        },
      },
    });

    const totalCosto = libros.reduce((total, libro) => {
      return total + libro.costoPrestamo;
    }, 0);

    const prestamo = await this.prisma.prestamo.create({
      data: {
        usuarioId: createPrestamoDto.usuarioId,
        fechaMaxDevolucion: new Date(createPrestamoDto.fechaMaxDevolucion),
        documentoGarantia: createPrestamoDto.documentoGarantia,
        totalCosto,
        libros: {
          create: createPrestamoDto.libroIds.map((libroId) => ({
            libroId,
          })),
        },
      },
      include: {
        usuario: true,
        libros: {
          include: {
            libro: true,
          },
        },
      },
    });

    await this.prisma.libro.updateMany({
      where: {
        id: {
          in: createPrestamoDto.libroIds,
        },
      },
      data: {
        disponibilidad: false,
      },
    });

    return prestamo;
  }

  update(id: string, updatePrestamoDto: UpdatePrestamoDto) {
    return this.prisma.prestamo.update({
      where: { id },
      data: {
        ...updatePrestamoDto,
        fechaMaxDevolucion: updatePrestamoDto.fechaMaxDevolucion
          ? new Date(updatePrestamoDto.fechaMaxDevolucion)
          : undefined,
        fechaDevolucionAt: updatePrestamoDto.fechaDevolucionAt
          ? new Date(updatePrestamoDto.fechaDevolucionAt)
          : undefined,
      },
    });
  }

  async devolver(id: string) {
    const prestamo = await this.prisma.prestamo.findUnique({
      where: { id },
      include: {
        libros: true,
      },
    });

    if (!prestamo) {
      return {
        mensaje: 'Préstamo no encontrado',
      };
    }

    await this.prisma.libro.updateMany({
      where: {
        id: {
          in: prestamo.libros.map((detalle) => detalle.libroId),
        },
      },
      data: {
        disponibilidad: true,
      },
    });

    return this.prisma.prestamo.update({
      where: { id },
      data: {
        estado: EstadoPrestamo.DEVUELTO,
        fechaDevolucionAt: new Date(),
      },
      include: {
        usuario: true,
        libros: {
          include: {
            libro: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.prestamo.delete({
      where: { id },
    });
  }
}