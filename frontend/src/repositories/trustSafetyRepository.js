import { api } from '../services/api';

export const trustSafetyRepository = {
  async block(userId) { const { data } = await api.post(`/users/${userId}/block`); return data; },
  async unblock(userId) { const { data } = await api.delete(`/users/${userId}/block`); return data; },
  async report({ reason, targetType, targetId, details }) {
    const { data } = await api.post('/reports', { reason, targetType, targetId, details });
    return data;
  },
  async reports() { const { data } = await api.get('/reports', { params: { status: 'OPEN' } }); return data || []; },
  async moderate(reportId, action, reason, durationHours) {
    const { data } = await api.patch(`/reports/${reportId}/moderate`, { action, reason, ...(durationHours ? { durationHours } : {}) });
    return data;
  },
  async dismiss(reportId, reason) { const { data } = await api.patch(`/reports/${reportId}/dismiss`, { reason }); return data; },
};
