import { api } from '../services/api';
import { mapAssistantResponse } from '../models/research';

export const assistantRepository = {
  async ask(payload, options = {}) {
    const { data } = await api.post('/research-assistant/query', payload, {
      timeout: 30000,
      ...options,
    });
    return mapAssistantResponse(data);
  },
};
