import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.libro.findMany();
  }

  findOne(id: string) {
    return this.prisma.libro.findUnique({
      where: { id },
    });
  }

  create(createLibroDto: CreateLibroDto) {
    return this.prisma.libro.create({
      data: createLibroDto,
    });
  }

  update(id: string, updateLibroDto: UpdateLibroDto) {
    return this.prisma.libro.update({
      where: { id },
      data: updateLibroDto,
    });
  }

  remove(id: string) {
    return this.prisma.libro.delete({
      where: { id },
    });
  }
}