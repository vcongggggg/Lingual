import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { communityRouter } from '../src/routes/community.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/community', communityRouter);
  return app;
}

test('Community API - GET /profile/:userId retrieves public profile', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/profile/demo-user-id-001`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.profile.userId, 'demo-user-id-001');
    assert.ok(body.profile.totalXP > 0);
  } finally {
    server.close();
  }
});

test('Community API - GET /profile/:userId with non-existent user returns 404', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/profile/non-existent-user`);
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test('Community API - GET /friends lists friends and following', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/friends?userId=demo-user-id-001`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.friends));
    assert.ok(Array.isArray(body.followings));
  } finally {
    server.close();
  }
});

test('Community API - GET /friend-requests returns pending requests', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/friend-requests?userId=demo-user-id-001`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.requests));
  } finally {
    server.close();
  }
});

test('Community API - POST /friends/:id sends friend request and rejects self-friending', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 1. Self friending rejection
    const selfRes = await fetch(`http://localhost:${port}/api/v1/community/friends/demo-user-id-001`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user-id-001' }),
    });
    assert.equal(selfRes.status, 400);

    // 2. Normal friend request
    const friendRes = await fetch(`http://localhost:${port}/api/v1/community/friends/user-kenji-003`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user-id-001' }),
    });
    assert.ok(friendRes.status === 200 || friendRes.status === 201);
  } finally {
    server.close();
  }
});

test('Community API - POST /users/:id/follow follows target and DELETE unfollows', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const followRes = await fetch(`http://localhost:${port}/api/v1/community/users/user-linhdan-004/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user-id-001' }),
    });
    assert.ok(followRes.status === 200 || followRes.status === 201);

    const unfollowRes = await fetch(`http://localhost:${port}/api/v1/community/users/user-linhdan-004/follow`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user-id-001' }),
    });
    assert.equal(unfollowRes.status, 200);
  } finally {
    server.close();
  }
});

test('Community API - GET /feed returns sanitized activity feed', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/feed?viewerId=demo-user-id-001`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.activities));
    assert.ok(body.activities.length >= 2);
  } finally {
    server.close();
  }
});

test('Community API - GET /notes and POST /notes performs study note lifecycle', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 1. Create note
    const createRes = await fetch(`http://localhost:${port}/api/v1/community/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Mẹo phát âm âm /θ/ và /ð/',
        content: 'Đặt đầu lưỡi giữa 2 hàm răng và đẩy luồng hơi nhẹ nhàng.',
        tags: ['pronunciation', 'phonetics'],
        userId: 'demo-user-id-001',
      }),
    });
    assert.equal(createRes.status, 201);
    const createBody = await createRes.json();
    assert.equal(createBody.note.title, 'Mẹo phát âm âm /θ/ và /ð/');
    assert.ok(createBody.xpEarned >= 5);

    // 2. Reject empty note
    const badRes = await fetch(`http://localhost:${port}/api/v1/community/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '', content: '' }),
    });
    assert.equal(badRes.status, 400);

    // 3. List notes
    const listRes = await fetch(`http://localhost:${port}/api/v1/community/notes?tag=pronunciation`);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    assert.ok(listBody.notes.some((n: any) => n.tags.includes('pronunciation')));
  } finally {
    server.close();
  }
});

test('Community API - POST /notes/:id/reactions toggles note reaction', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/notes/note-001/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reactionType: 'helpful', userId: 'user-kenji-003' }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.success);
    assert.ok(body.reactionCount >= 0);
  } finally {
    server.close();
  }
});

test('Community API - POST /notes/:id/comments adds comment', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/notes/note-001/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Bài viết rất bổ ích!', userId: 'user-linhdan-004' }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.comment.content, 'Bài viết rất bổ ích!');
  } finally {
    server.close();
  }
});

test('Community API - GET /leaderboard returns ranked score entries', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/leaderboard?period=weekly&category=xp`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.leaderboard));
    assert.equal(body.leaderboard[0].rank, 1);
    assert.ok(body.leaderboard[0].score >= body.leaderboard[1].score);
  } finally {
    server.close();
  }
});

test('Community API - GET /groups and POST /groups/:id/join performs study group actions', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    // 1. List groups
    const listRes = await fetch(`http://localhost:${port}/api/v1/community/groups`);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    assert.ok(listBody.groups.length >= 1);

    // 2. Get group detail
    const detailRes = await fetch(`http://localhost:${port}/api/v1/community/groups/group-toeic-900`);
    assert.equal(detailRes.status, 200);
    const detailBody = await detailRes.json();
    assert.equal(detailBody.group.id, 'group-toeic-900');
    assert.ok(Array.isArray(detailBody.members));

    // 3. Post to group
    const postRes = await fetch(`http://localhost:${port}/api/v1/community/groups/group-toeic-900/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Mọi người đã làm bài đọc hôm nay chưa?', userId: 'demo-user-id-001' }),
    });
    assert.equal(postRes.status, 201);
  } finally {
    server.close();
  }
});

test('Community API - GET /achievements returns social learning achievements', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/achievements?userId=demo-user-id-001`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.achievements));
    assert.ok(body.achievements.length >= 5);
  } finally {
    server.close();
  }
});

test('Community API - GET /notifications and POST /notifications/:id/read', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const listRes = await fetch(`http://localhost:${port}/api/v1/community/notifications?userId=demo-user-id-001`);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    assert.ok(Array.isArray(listBody.notifications));

    const readRes = await fetch(`http://localhost:${port}/api/v1/community/notifications/notif-1/read`, {
      method: 'POST',
    });
    assert.equal(readRes.status, 200);
  } finally {
    server.close();
  }
});

test('Community API - GET /search searches across users, notes, and groups', async () => {
  const app = createTestApp();
  const server = app.listen(0);
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://localhost:${port}/api/v1/community/search?q=toeic`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.groups));
    assert.ok(body.groups.some((g: any) => g.name.includes('TOEIC')));
  } finally {
    server.close();
  }
});
