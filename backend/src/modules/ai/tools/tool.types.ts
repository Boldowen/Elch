export type ControlledToolName =
  | 'searchDestinations'
  | 'getDestinationDetails'
  | 'searchRoutes'
  | 'getRouteDetails'
  | 'validateRoute'
  | 'searchTours'
  | 'getTourDetails'
  | 'searchGuides'
  | 'getGuideDetails'
  | 'getGuideAvailability'
  | 'getGuideCompetency'
  | 'matchGuides'
  | 'getTourAvailability'
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
