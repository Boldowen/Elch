import { Injectable } from '@nestjs/common';
import { RiskClass } from './route.types.js';

export interface RiskPolicy {
  guideRequired: boolean;
  routeCompetencyRequired: boolean;
  firstAidRequired: boolean;
  specialistRequired: boolean;
  safetyPlanRequired: boolean;
  humanApprovalRequired: boolean;
}

@Injectable()
export class RouteRiskPolicyService {
  for(risk: RiskClass): RiskPolicy {
    const policies: Record<RiskClass, RiskPolicy> = {
      R0: { guideRequired: false, routeCompetencyRequired: false, firstAidRequired: false, specialistRequired: false, safetyPlanRequired: false, humanApprovalRequired: false },
      R1: { guideRequired: false, routeCompetencyRequired: false, firstAidRequired: false, specialistRequired: false, safetyPlanRequired: false, humanApprovalRequired: false },
      R2: { guideRequired: true, routeCompetencyRequired: true, firstAidRequired: true, specialistRequired: false, safetyPlanRequired: false, humanApprovalRequired: false },
      R3: { guideRequired: true, routeCompetencyRequired: true, firstAidRequired: true, specialistRequired: true, safetyPlanRequired: true, humanApprovalRequired: false },
      R4: { guideRequired: true, routeCompetencyRequired: true, firstAidRequired: true, specialistRequired: true, safetyPlanRequired: true, humanApprovalRequired: true },
    };
    return policies[risk];
  }
}
