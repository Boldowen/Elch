import type { z } from 'zod';

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

export interface ControlledToolDefinition {
  name: ControlledToolName;
  description: string;
  schema: z.ZodType;
  /** Drop explicit nulls (strict-mode placeholders for optional fields) before execute(). */
  compact: boolean;
}
