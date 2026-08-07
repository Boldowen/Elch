import { api } from '../services/api';
import { mapSocialPost } from '../models';

export const socialRepository = {
  async feed() {
    const { data } = await api.get('/social/feed');
    return (data || []).map(mapSocialPost);
  },

  async createPost({ text, location, imageUrl }) {
    await api.post('/social/posts', {
      text,
      location,
      ...(imageUrl ? { imageUrls: [imageUrl] } : {}),
    });
  },

  async toggleLike(postId) {
    await api.post(`/social/posts/${postId}/like`);
  },

  async addComment(postId, text) {
    await api.post(`/social/posts/${postId}/comments`, { text });
  },

  async toggleFollow(userId) {
    const { data } = await api.post(`/social/users/${userId}/follow`);
    return data;
  },
};
