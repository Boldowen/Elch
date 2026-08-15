import { api } from '../services/api';
import { mapGuideMatchResult } from '../models/research';

export const guideResearchRepository = {
  async score(payload, options = {}) {
    const { data } = await api.post('/guide-research/score', payload, options);
    return data;
  },

  async match(payload, options = {}) {
    const { data } = await api.post('/guide-research/match', payload, options);
    return mapGuideMatchResult(data);
  },
};
