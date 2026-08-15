import { api } from '../services/api';
import {
  mapAssessmentAttempt,
  mapAssessmentDashboard,
  mapAssessmentResponse,
  mapLanguageEstimate,
} from '../models/assessments';

export const guideAssessmentsRepository = {
  async dashboard(options = {}) {
    const { data } = await api.get('/guide-assessments/dashboard', options);
    return mapAssessmentDashboard(data);
  },

  async attempts(options = {}) {
    const { data } = await api.get('/guide-assessments/attempts', options);
    return (Array.isArray(data) ? data : []).map(mapAssessmentAttempt);
  },

  async start(payload, options = {}) {
    const { data } = await api.post('/guide-assessments/attempts', payload, options);
    return mapAssessmentAttempt(data);
  },

  async attempt(id, options = {}) {
    const { data } = await api.get(`/guide-assessments/attempts/${encodeURIComponent(id)}`, options);
    return mapAssessmentAttempt(data);
  },

  async saveResponse(attemptId, payload, options = {}) {
    const { data } = await api.post(
      `/guide-assessments/attempts/${encodeURIComponent(attemptId)}/responses`,
      payload,
      options,
    );
    return mapAssessmentResponse(data);
  },

  async submit(attemptId, options = {}) {
    const { data } = await api.post(
      `/guide-assessments/attempts/${encodeURIComponent(attemptId)}/submit`,
      {},
      options,
    );
    return mapAssessmentAttempt(data);
  },

  async evaluateLanguage(attemptId, payload, options = {}) {
    const { data } = await api.post(
      `/guide-assessments/attempts/${encodeURIComponent(attemptId)}/language-evaluate`,
      payload,
      { timeout: 30000, ...options },
    );
    return mapLanguageEstimate(data);
  },
};
