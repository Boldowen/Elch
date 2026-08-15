import { api } from '../services/api';
import { mapResearchSummary } from '../models/research';

const EXPORT_FORMATS = new Set(['json', 'csv']);

export const researchRepository = {
  async summary(options = {}) {
    const { data } = await api.get('/research/summary', options);
    return mapResearchSummary(data);
  },

  async exportData(format, options = {}) {
    const normalizedFormat = String(format).toLowerCase();
    if (!EXPORT_FORMATS.has(normalizedFormat)) {
      throw new Error('Research export format must be json or csv');
    }
    const { params, ...config } = options;
    const response = await api.get('/research/export', {
      ...config,
      params: { ...(params || {}), format: normalizedFormat },
      responseType: 'text',
    });
    const content = typeof response.data === 'string'
      ? response.data
      : JSON.stringify(response.data ?? {}, null, 2);
    return {
      format: normalizedFormat,
      content,
      contentType: String(response.headers?.['content-type'] || (normalizedFormat === 'csv' ? 'text/csv' : 'application/json')),
    };
  },
};
