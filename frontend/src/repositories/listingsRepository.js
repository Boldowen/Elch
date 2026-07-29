import { api } from '../services/api';
import * as Crypto from 'expo-crypto';
import { storage } from '../services/storage';
import { mapListing } from '../models';

export const listingsRepository = {
  async fetch({ category, search, page = 1, limit = 50 } = {}) {
    const cacheKey = `listings:${category || 'all'}:${search || ''}`;
    try {
      const { data } = await api.get('/listings', {
        params: {
          ...(category ? { category: String(category).toUpperCase() } : {}),
          ...(search ? { search } : {}),
          page,
          limit,
        },
      });
      const items = (data.items || data || []).map(mapListing);
      await storage.cache(
        cacheKey,
        items.map((item) => ({
          id: item.id,
          title: item.title,
          location: item.location,
          images: item.images.map((url) => ({ url })),
          rating: item.rating,
          reviewCount: item.reviews,
          price: item.price,
          priceUnit: item.priceUnit,
          datesLabel: item.dates,
          tags: item.tags,
          category: item.category.toUpperCase(),
          description: item.description,
          amenities: item.amenities,
          host: {
            name: item.hostName,
            avatarUrl: item.hostPhoto,
            isVerified: item.superhost,
          },
        })),
      );
      return items;
    } catch (error) {
      const cached = await storage.cached(cacheKey);
      if (Array.isArray(cached) && cached.length) {
        return cached.map((item) => mapListing({ ...item, isCached: true }));
      }
      throw error;
    }
  },

  async one(id) {
    try {
      const { data } = await api.get(`/listings/${id}`);
      return mapListing(data);
    } catch (error) {
      throw error;
    }
  },

  async mine() {
    const { data } = await api.get('/listings/mine');
    return data || [];
  },

  async publish(id) {
    const { data } = await api.post(`/listings/${id}/publish`);
    return data;
  },

  async unpublish(id) {
    const { data } = await api.post(`/listings/${id}/unpublish`);
    return data;
  },

  async setInventory(id, days) {
    const { data } = await api.patch(`/listings/${id}/inventory`, { days });
    return data;
  },
};

export const bookingsRepository = {
  async list() {
    const { data } = await api.get('/bookings');
    return data || [];
  },

  async providerList() {
    const { data } = await api.get('/bookings/provider');
    return data || [];
  },

  async create(payload) {
    const { data } = await api.post('/bookings', payload, {
      headers: { 'Idempotency-Key': Crypto.randomUUID() },
    });
    return data;
  },

  async quote(payload) {
    const { data } = await api.post('/bookings/quote', payload);
    return data;
  },

  async updateStatus(id, action) {
    const { data } = await api.patch(`/bookings/${id}/status`, { action });
    return data;
  },
  async proposePayment(id, arrangement, instructions) {
    const { data } = await api.post(`/bookings/${id}/payment`, { arrangement, instructions });
    return data;
  },
  async agreePayment(id) { const { data } = await api.post(`/bookings/${id}/payment/agree`); return data; },
  async markPaymentPaid(id) { const { data } = await api.post(`/bookings/${id}/payment/paid`); return data; },
};
