import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum GuideReviewDecision {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export class ReviewGuideApplicationDto {
  @IsEnum(GuideReviewDecision)
  decision!: GuideReviewDecision;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  assessmentScore?: number;
}
