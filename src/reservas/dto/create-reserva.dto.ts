import { IsInt, IsString, IsOptional, Matches, Min } from 'class-validator';

export class CreateReservaDto {
  @IsInt()
  @Min(1)
  canchaId: number;

  @IsInt()
  @Min(1)
  clienteId: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe ser YYYY-MM-DD' })
  fecha: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaInicio debe ser HH:mm' })
  horaInicio: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'horaFin debe ser HH:mm' })
  horaFin: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
