import { api } from '../services/api';
import { mapConversation, mapMessage } from '../models';

export const conversationsRepository = {
  async list(currentUserId) {
    const { data } = await api.get('/conversations');
    return (data || []).map((item) => mapConversation(item, currentUserId));
  },

  async messages(conversationId, currentUserId) {
    const { data } = await api.get(`/conversations/${conversationId}/messages`);
    return (data || []).map((item) => mapMessage(item, currentUserId));
  },

  async send(conversationId, { text, imageUrl } = {}) {
    await api.post(`/conversations/${conversationId}/messages`, {
      type: imageUrl ? 'IMAGE' : 'TEXT',
      ...(text ? { body: text } : {}),
      ...(imageUrl ? { mediaUrl: imageUrl } : {}),
    });
  },

  async direct(userId) {
    const { data } = await api.post(`/conversations/direct/${userId}`);
    return String(data?.id ?? userId);
  },

  async mute(conversationId, muted = true) {
    const { data } = muted
      ? await api.post(`/conversations/${conversationId}/mute`)
      : await api.delete(`/conversations/${conversationId}/mute`);
    return data;
  },
};
