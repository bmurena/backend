import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { CreatePrestamoDto } from './dto/create-prestamo.dto';
import { UpdatePrestamoDto } from './dto/update-prestamo.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Get()
  findAll() {
    return this.prestamosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prestamosService.findOne(id);
  }

  @Post()
  create(@Body() createPrestamoDto: CreatePrestamoDto) {
    return this.prestamosService.create(createPrestamoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrestamoDto: UpdatePrestamoDto) {
    return this.prestamosService.update(id, updatePrestamoDto);
  }

  @Patch(':id/devolver')
  devolver(@Param('id') id: string) {
    return this.prestamosService.devolver(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prestamosService.remove(id);
  }
}