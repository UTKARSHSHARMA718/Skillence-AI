import { ArrayMinSize, IsMongoId, IsString } from 'class-validator';

export class StartSessionDto {
  @IsString({ each: true })
  @ArrayMinSize(0)
  @IsMongoId({ each: true })
  topicIds: string[];
}
