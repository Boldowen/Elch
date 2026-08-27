function optionalString(value) {
  return value === null || value === undefined || value === '' ? null : String(value);
}

export function mapBooking(json = {}) {
  const listing = json.listing && typeof json.listing === 'object' ? json.listing : null;
  const guide = json.guide && typeof json.guide === 'object' ? json.guide : null;
  return {
    id: String(json.id ?? ''),
    listingId: optionalString(json.listingId ?? listing?.id),
    guideId: optionalString(json.guideId ?? guide?.id),
    startsAt: optionalString(json.startsAt),
    endsAt: optionalString(json.endsAt),
    guests: Number(json.guests) || 1,
    amount: Number(json.amount) || 0,
    amountMinor: Number(json.amountMinor) || 0,
    baseAmountMinor: Number(json.baseAmountMinor) || 0,
    cleaningFeeMinor: Number(json.cleaningFeeMinor) || 0,
    serviceFeeMinor: Number(json.serviceFeeMinor) || 0,
    taxMinor: Number(json.taxMinor) || 0,
    extraGuestFeeMinor: Number(json.extraGuestFeeMinor) || 0,
    depositMinor: Number(json.depositMinor) || 0,
    currency: String(json.currency ?? 'USD'),
    status: String(json.status ?? ''),
    note: optionalString(json.note),
    updatedAt: optionalString(json.updatedAt),
    createdAt: optionalString(json.createdAt),
    listing: listing ? {
      id: String(listing.id ?? json.listingId ?? ''),
      title: String(listing.title ?? ''),
    } : null,
    guide: guide ? {
      id: String(guide.id ?? json.guideId ?? ''),
      name: String(guide.name ?? ''),
      avatarUrl: optionalString(guide.avatarUrl),
    } : null,
  };
}

export function bookingMatchesPayload(booking, payload) {
  if (!booking || !payload) return false;
  const sameProvider = payload.listingId
    ? booking.listingId === payload.listingId
    : booking.guideId === payload.guideId;
  return sameProvider &&
    new Date(booking.startsAt).getTime() === new Date(payload.startsAt).getTime() &&
    new Date(booking.endsAt).getTime() === new Date(payload.endsAt).getTime() &&
    booking.guests === payload.guests &&
    (booking.note || '') === (payload.note || '');
}
