import { Module } from "@nestjs/common";
import { OpenAIService } from "./openai/openai.service";
import { InterviewEvaluator } from "./evaluators/interview.evaluator";
import { AiService } from './ai.service';
import { UsersModule } from "src/users/users.module";

@Module({
  providers: [OpenAIService, InterviewEvaluator, AiService],
  exports: [InterviewEvaluator],
  imports: [UsersModule]
})
export class AiModule {}