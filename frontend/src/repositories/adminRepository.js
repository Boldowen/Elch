import { api } from '../services/api';
import {
  mapAssessmentReview,
  mapBlindAssessment,
  mapIngestionResult,
  mapTourismKnowledge,
  mapTourismSource,
} from '../models/admin';

export const adminRepository = {
  async tourismSources(params = {}, options = {}) {
    const { data } = await api.get('/tourism-knowledge/sources', {
      ...options,
      params: { ...params, ...(options.params || {}) },
    });
    return (Array.isArray(data) ? data : []).map(mapTourismSource);
  },

  async tourismSource(id, options = {}) {
    const { data } = await api.get(`/tourism-knowledge/sources/${encodeURIComponent(id)}`, options);
    return mapTourismSource(data);
  },

  async createTourismSource(payload, options = {}) {
    const { data } = await api.post('/tourism-knowledge/sources', payload, options);
    return mapTourismSource(data);
  },

  async ingestTourismKnowledge(payload, options = {}) {
    const { data } = await api.post('/tourism-knowledge/ingest', payload, {
      timeout: 60000,
      ...options,
    });
    return mapIngestionResult(data);
  },

  async reviewTourismSource(id, payload, options = {}) {
    const { data } = await api.patch(
      `/tourism-knowledge/sources/${encodeURIComponent(id)}/review`,
      payload,
      options,
    );
    return mapTourismSource(data);
  },

  async reviewTourismKnowledge(id, payload, options = {}) {
    const { data } = await api.patch(
      `/tourism-knowledge/knowledge/${encodeURIComponent(id)}/review`,
      payload,
      options,
    );
    return mapTourismKnowledge(data);
  },

  async blindAssessmentQueue(options = {}) {
    const { data } = await api.get('/guide-assessments/review-queue', {
      ...options,
      params: { ...(options.params || {}), blind: true },
    });
    return (Array.isArray(data) ? data : []).map(mapBlindAssessment);
  },

  async reviewAssessment(attemptId, payload, options = {}) {
    const { data } = await api.post(
      `/guide-assessments/attempts/${encodeURIComponent(attemptId)}/review`,
      payload,
      options,
    );
    return mapAssessmentReview(data);
  },
};
