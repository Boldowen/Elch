import { api } from '../services/api';
import { mapGuide } from '../models';

export const guidesRepository = {
  async all() {
    const { data } = await api.get('/guides');
    return (data || []).map(mapGuide);
  },

  async one(id) {
    const { data } = await api.get(`/guides/${id}`);
    return mapGuide(data);
  },

  async ranking() {
    const { data } = await api.get('/guides/ranking');
    return (data || []).map((raw) => {
      const user = raw.user || {};
      return {
        userId: String(user.id ?? raw.userId ?? ''),
        name: String(user.name ?? 'Local guide'),
        photo: String(user.avatarUrl ?? ''),
        location: [raw.city, raw.country].filter(Boolean).join(', '),
        rating: Number(raw.rating) || 0,
        reviewCount: Number(raw.reviewCount) || 0,
        rankPoints: Number(raw.rankPoints) || 0,
        completedTrips: Number(raw.completedTrips) || 0,
        responseRate: Number(raw.responseRate) || 0,
        acceptanceRate: Number(raw.acceptanceRate) || 0,
        providerCancellationCount: Number(raw.providerCancellationCount) || 0,
        confirmedReportCount: Number(raw.confirmedReportCount) || 0,
        rankingUpdatedAt: raw.rankingUpdatedAt || null,
      };
    });
  },

  async mine() {
    const { data } = await api.get('/guides/me');
    return data;
  },

  async updateProfile(payload) {
    await api.patch('/guides/me', payload);
  },

  async apply(payload) {
    await api.post('/guides/apply', {
      country: payload.country,
      city: payload.city,
      bio: payload.bio,
      experienceYears: payload.experienceYears,
      languages: payload.languages || {},
      expertise: payload.expertise,
      availability: payload.availability,
      pricingType: payload.price == null ? 'NONE' : 'HOURLY',
      price: payload.price,
      referenceContact: payload.referenceContact,
      codeOfConductAccepted: payload.codeOfConductAccepted,
    });
  },

  async applications() {
    const { data } = await api.get('/guides/applications');
    return data || [];
  },

  async reviewApplication(id, payload) {
    const { data } = await api.patch(`/guides/applications/${id}/review`, payload);
    return data;
  },
};
