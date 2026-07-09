export class CreatePrestamoDto {
  usuarioId!: string;
  fechaMaxDevolucion!: string;
  documentoGarantia?: string;
  libroIds!: string[];
}