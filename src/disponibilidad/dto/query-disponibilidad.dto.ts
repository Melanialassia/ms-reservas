import { IsInt, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDisponibilidadDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  canchaId: number;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'fecha debe ser YYYY-MM-DD' })
  fecha: string;
}
