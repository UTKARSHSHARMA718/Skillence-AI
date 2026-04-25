import { IsMongoId } from "class-validator";

export class GetSessionDto {
    @IsMongoId()
    sessionId: string;
}