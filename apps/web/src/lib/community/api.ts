/**
 * Community & Social Learning Lab API Client
 */

import { apiFetch } from '../api';

export const communityApi = {
  getProfile: (userId: string, viewerId?: string) => {
    const query = viewerId ? `?viewerId=${viewerId}` : '';
    return apiFetch(`/community/profile/${userId}${query}`);
  },

  getFriends: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/community/friends${query}`);
  },

  getFriendRequests: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/community/friend-requests${query}`);
  },

  sendFriendRequest: (targetUserId: string, userId?: string) =>
    apiFetch(`/community/friends/${targetUserId}`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  acceptFriendRequest: (targetUserId: string, userId?: string) =>
    apiFetch(`/community/friends/${targetUserId}/accept`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  rejectFriendRequest: (targetUserId: string, userId?: string) =>
    apiFetch(`/community/friends/${targetUserId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  followUser: (targetUserId: string, userId?: string) =>
    apiFetch(`/community/users/${targetUserId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  unfollowUser: (targetUserId: string, userId?: string) =>
    apiFetch(`/community/users/${targetUserId}/follow`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    }),

  getFeed: (viewerId?: string) => {
    const query = viewerId ? `?viewerId=${viewerId}` : '';
    return apiFetch(`/community/feed${query}`);
  },

  getNotes: (params: { tag?: string; q?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.tag) queryParams.set('tag', params.tag);
    if (params.q) queryParams.set('q', params.q);
    return apiFetch(`/community/notes?${queryParams.toString()}`);
  },

  getNote: (noteId: string) => apiFetch(`/community/notes/${noteId}`),

  createNote: (data: { title: string; content: string; tags?: string[]; visibility?: string; userId?: string }) =>
    apiFetch('/community/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  toggleReaction: (noteId: string, data: { reactionType: string; userId?: string }) =>
    apiFetch(`/community/notes/${noteId}/reactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  addComment: (noteId: string, data: { content: string; userId?: string }) =>
    apiFetch(`/community/notes/${noteId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getLeaderboard: (params: { period?: string; category?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.set('period', params.period);
    if (params.category) queryParams.set('category', params.category);
    return apiFetch(`/community/leaderboard?${queryParams.toString()}`);
  },

  getGroups: () => apiFetch('/community/groups'),

  getGroup: (groupId: string) => apiFetch(`/community/groups/${groupId}`),

  joinGroup: (groupId: string, userId?: string) =>
    apiFetch(`/community/groups/${groupId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    }),

  createGroupPost: (groupId: string, data: { content: string; userId?: string }) =>
    apiFetch(`/community/groups/${groupId}/posts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAchievements: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/community/achievements${query}`);
  },

  getNotifications: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiFetch(`/community/notifications${query}`);
  },

  markNotificationAsRead: (notificationId: string) =>
    apiFetch(`/community/notifications/${notificationId}/read`, {
      method: 'POST',
    }),

  search: (query: string) => apiFetch(`/community/search?q=${encodeURIComponent(query)}`),
};
