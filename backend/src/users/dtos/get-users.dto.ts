import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GetUsersDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}
