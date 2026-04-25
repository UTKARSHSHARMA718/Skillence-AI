import { IsMongoId } from 'class-validator';

export class StartInterviewDto {
  @IsMongoId()
  sessionId: string;
}
