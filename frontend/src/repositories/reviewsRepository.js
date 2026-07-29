import { api } from '../services/api';

export const reviewsRepository = {
  async create(bookingId, rating, text) {
    const { data } = await api.post('/reviews', { bookingId, rating, text });
    return data;
  },
  async list(params) { const { data } = await api.get('/reviews', { params }); return data || []; },
};
