export type ControlledToolName =
  | 'searchRoutes'
  | 'getRouteDetails'
  | 'validateRoute'
  | 'searchTours'
  | 'getTourDetails'
  | 'searchGuides'
  | 'getGuideDetails'
  | 'getLiveWeather'
  | 'getRoadClosures'
  | 'getPermitRequirements'
  | 'searchTransportAvailability'
  | 'createBookingDraft';

export interface AiToolContext {
  userId: string;
  roles: string[];
}

export interface AiToolResult {
  tool: ControlledToolName;
  data: unknown;
  truncated: boolean;
}
