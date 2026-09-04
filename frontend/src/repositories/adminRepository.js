import { api } from '../services/api';
import {
  mapAssessmentReview,
  mapAdminRoute,
  mapBlindAssessment,
  mapGuideEvidence,
  mapIngestionResult,
  mapSafetyPlan,
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

  async routeGraphs(options = {}) {
    const { data } = await api.get('/admin/route-graph/routes', options);
    return (Array.isArray(data) ? data : []).map(mapAdminRoute);
  },

  async createRouteGraph(payload, options = {}) {
    const { data } = await api.post('/admin/route-graph/routes', payload, options);
    return mapAdminRoute(data);
  },

  async updateRouteGraph(id, payload, options = {}) {
    const { data } = await api.patch(`/admin/route-graph/routes/${encodeURIComponent(id)}`, payload, options);
    return mapAdminRoute(data);
  },

  async createRouteNode(routeId, payload, options = {}) {
    const { data } = await api.post(`/admin/route-graph/routes/${encodeURIComponent(routeId)}/nodes`, payload, options);
    return mapAdminRoute(data);
  },

  async updateRouteNode(id, payload, options = {}) {
    const { data } = await api.patch(`/admin/route-graph/nodes/${encodeURIComponent(id)}`, payload, options);
    return mapAdminRoute(data);
  },

  async createRouteEdge(routeId, payload, options = {}) {
    const { data } = await api.post(`/admin/route-graph/routes/${encodeURIComponent(routeId)}/edges`, payload, options);
    return mapAdminRoute(data);
  },

  async updateRouteEdge(id, payload, options = {}) {
    const { data } = await api.patch(`/admin/route-graph/edges/${encodeURIComponent(id)}`, payload, options);
    return mapAdminRoute(data);
  },

  async safetyPlanQueue(options = {}) {
    const { data } = await api.get('/safety-plans/admin/review-queue', options);
    return (Array.isArray(data) ? data : []).map(mapSafetyPlan);
  },

  async reviewSafetyPlan(id, payload, options = {}) {
    const { data } = await api.post(`/safety-plans/${encodeURIComponent(id)}/review`, payload, options);
    return mapSafetyPlan(data);
  },

  async revokeSafetyPlan(id, payload, options = {}) {
    const { data } = await api.post(`/safety-plans/${encodeURIComponent(id)}/revoke`, payload, options);
    return mapSafetyPlan(data);
  },

  async pendingGuideEvidence(options = {}) {
    const { data } = await api.get('/guides/evidence/pending', options);
    return (Array.isArray(data) ? data : []).map(mapGuideEvidence);
  },

  async reviewGuideEvidence(id, payload, options = {}) {
    const { data } = await api.patch(`/guides/evidence/${encodeURIComponent(id)}/review`, payload, options);
    return mapGuideEvidence(data);
  },

  async guideEvidenceFile(id, options = {}) {
    const response = await api.get(`/guides/evidence/${encodeURIComponent(id)}/file`, {
      timeout: 60000,
      responseType: 'arraybuffer',
      ...options,
    });
    return {
      bytes: response.data,
      contentType: String(response.headers?.['content-type'] || 'application/octet-stream'),
    };
  },
};
