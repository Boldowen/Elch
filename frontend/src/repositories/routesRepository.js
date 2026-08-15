import { api } from '../services/api';
import { mapResearchRoute, mapRouteValidation } from '../models/research';

export const routesRepository = {
  async list(options = {}) {
    const { data } = await api.get('/research-routes', options);
    return (Array.isArray(data) ? data : []).map(mapResearchRoute);
  },

  async detail(id, options = {}) {
    const { data } = await api.get(`/research-routes/${encodeURIComponent(id)}`, options);
    return mapResearchRoute(data);
  },

  async validate(payload, options = {}) {
    const { data } = await api.post('/research-routes/validate', payload, options);
    return mapRouteValidation(data);
  },
};
