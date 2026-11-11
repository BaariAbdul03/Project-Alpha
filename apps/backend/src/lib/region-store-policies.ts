/**
 * Store policy values kept in each region's `metadata`.
 * Shipping and returns remain unset until the client approves policies.
 */
export type RegionStorePolicies = {
  return_window_days?: number;
  free_returns?: boolean;
  shipping_rate?: number;
  handling_days_min?: number;
  handling_days_max?: number;
  transit_days_min?: number;
  transit_days_max?: number;
};

export const DEFAULT_REGION_STORE_POLICIES: RegionStorePolicies = {};
