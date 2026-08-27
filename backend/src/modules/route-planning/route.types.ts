export type RiskClass = 'R0' | 'R1' | 'R2' | 'R3' | 'R4';

export interface RouteSource {
  id: string;
  title: string;
  url: string;
  authority: 1 | 2 | 3 | 4 | 5 | 6;
  lastVerifiedAt: string;
  verificationStatus: 'PROTOTYPE_REQUIRES_REVIEW' | 'HUMAN_VERIFIED';
}

export interface RoutePoi {
  id: string;
  nameMn: string;
  nameEn: string;
  region: string;
  type: 'CITY' | 'DESTINATION' | 'HERITAGE' | 'MUSEUM' | 'NATURE' | 'TRAILHEAD' | 'TRANSPORT_HUB' | 'ACCOMMODATION' | 'OTHER';
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  sourceId: string;
}

export interface RouteEdge {
  id: string;
  from: string;
  to: string;
  mode: 'ROAD' | 'OFF_ROAD' | 'TREK' | 'BOAT' | 'AIR' | 'RAIL' | 'HORSE' | 'OTHER';
  distanceKm: number;
  nominalMinutes: number;
  openMonths: number[];
  riskClass: RiskClass;
  requiredSkills: string[];
  estimatedCostMinor?: number;
  sourceId: string;
  bidirectional?: boolean;
  requiresRoadCheck?: boolean;
  requiresWeatherCheck?: boolean;
  requiresPermitCheck?: boolean;
  requiresGuide?: boolean;
  emergencyPlanRequired?: boolean;
  lastVerifiedAt?: string;
}

export interface ResearchRoute {
  id: string;
  name: string;
  description: string;
  recommendedDays: { min: number; max: number };
  poiIds: string[];
  riskClass: RiskClass;
  guideRequirements: {
    minimumLanguageLevel: string;
    routeBadge: string;
    firstAidRequired: boolean;
    legalRole: 'UNVERIFIED' | 'LICENSED_PROFESSIONAL' | 'LICENSED_PROFESSIONAL_GUIDE' | 'LOCAL_HOST' | 'SPECIALIST_INSTRUCTOR';
    specialtySkills: string[];
  };
}

export interface HydratedResearchRoute extends ResearchRoute {
  databaseId: string;
  routeFamily: 'CENTRAL_HERITAGE' | 'GOBI' | 'KHUVSGUL' | 'WESTERN_ALTAI';
  active: boolean;
  pois: RoutePoi[];
  edges: RouteEdge[];
  sources: RouteSource[];
  disclaimer: string;
  updatedAt?: string;
}

export interface RouteGraphData {
  disclaimer: string;
  sources: RouteSource[];
  pois: RoutePoi[];
  edges: RouteEdge[];
  routes: ResearchRoute[];
}
