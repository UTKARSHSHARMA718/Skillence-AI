import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class GetTopicsDto {
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number;

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    @Max(100)
    pageSize: number;
}