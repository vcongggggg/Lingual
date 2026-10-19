/**
 * Automated Live QA Test Script for Phase 16: Community & Social Learning Lab
 */

const API_BASE = 'http://localhost:4000/api/v1';

async function runLiveCommunityQA() {
  console.log('🚀 Starting Phase 16 Community & Social Learning Lab Live QA Suite...\n');
  let passCount = 0;
  let failCount = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${msg}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${msg}`);
      failCount++;
    }
  }

  try {
    // 1. Health check
    console.log('1. Verifying API Health...');
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    assert(healthRes.status === 200 && healthData.status === 'ok', 'API is online and healthy');

    // 2. Fetch User Profile
    console.log('\n2. Fetching User Social Profiles...');
    const profileRes = await fetch(`${API_BASE}/community/profile/demo-user-id-001`);
    const profileData = await profileRes.json();
    assert(profileRes.status === 200 && profileData.profile.userId === 'demo-user-id-001', 'Retrieved valid social profile');
    assert(profileData.profile.totalXP > 0, `Profile totalXP verified: ${profileData.profile.totalXP}`);

    // 3. Friend and Follow Connections
    console.log('\n3. Verifying Friend & Follow Network Endpoints...');
    const friendsRes = await fetch(`${API_BASE}/community/friends?userId=demo-user-id-001`);
    const friendsData = await friendsRes.json();
    assert(friendsRes.status === 200 && Array.isArray(friendsData.friends), 'Retrieved friends list');

    const requestsRes = await fetch(`${API_BASE}/community/friend-requests?userId=demo-user-id-001`);
    const requestsData = await requestsRes.json();
    assert(requestsRes.status === 200 && Array.isArray(requestsData.requests), 'Retrieved pending friend requests');

    // Test Self-Friend Rejection
    const selfFriendRes = await fetch(`${API_BASE}/community/friends/demo-user-id-001`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'demo-user-id-001' }),
    });
    assert(selfFriendRes.status === 400, 'Security: Self-friend request rejected with 400');

    // 4. Learning Activity Feed
    console.log('\n4. Testing Learning Activity Feed...');
    const feedRes = await fetch(`${API_BASE}/community/feed?viewerId=demo-user-id-001`);
    const feedData = await feedRes.json();
    assert(feedRes.status === 200 && Array.isArray(feedData.activities), 'Retrieved activity feed');
    assert(feedData.activities.length >= 2, `Feed contains ${feedData.activities.length} visible activities`);

    // 5. Study Notes Lifecycle & Reactions & Comments
    console.log('\n5. Testing Study Notes Lifecycle, Reactions, and Comments...');
    const createNoteRes = await fetch(`${API_BASE}/community/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Mẹo phát âm âm đuôi /s/, /z/, /ɪz/ trong tiếng Anh',
        content: 'Quy tắc tận cùng bằng các âm vô thanh p, k, f, t, th đọc là /s/...',
        tags: ['pronunciation', 'phonetics', 'rules'],
        userId: 'demo-user-id-001',
      }),
    });
    const createNoteData = await createNoteRes.json();
    assert(createNoteRes.status === 201 && Boolean(createNoteData.note?.id), 'Created study note successfully');
    assert(createNoteData.xpEarned >= 5, `Awarded social XP: +${createNoteData.xpEarned} XP`);

    const noteId = createNoteData.note.id;

    // Toggle Reaction
    const reactRes = await fetch(`${API_BASE}/community/notes/${noteId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reactionType: 'helpful', userId: 'user-alice-002' }),
    });
    const reactData = await reactRes.json();
    assert(reactRes.status === 200 && reactData.success === true, 'Toggled reaction on study note');

    // Add Comment
    const commentRes = await fetch(`${API_BASE}/community/notes/${noteId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Rất hữu ích, cảm ơn bạn!', userId: 'user-alice-002' }),
    });
    const commentData = await commentRes.json();
    assert(commentRes.status === 201 && Boolean(commentData.comment?.id), 'Added comment to study note');

    // 6. Leaderboard Ranking
    console.log('\n6. Testing Authoritative Leaderboard Rankings...');
    const ldbRes = await fetch(`${API_BASE}/community/leaderboard?period=weekly&category=xp`);
    const ldbData = await ldbRes.json();
    assert(ldbRes.status === 200 && Array.isArray(ldbData.leaderboard), 'Retrieved leaderboard');
    assert(ldbData.leaderboard[0].rank === 1, 'Leaderboard ranks assigned authoritatively');

    // 7. Study Groups
    console.log('\n7. Testing Study Groups and Group Discussion Posts...');
    const groupsRes = await fetch(`${API_BASE}/community/groups`);
    const groupsData = await groupsRes.json();
    assert(groupsRes.status === 200 && groupsData.groups.length >= 1, 'Retrieved study groups catalog');

    const groupPostRes = await fetch(`${API_BASE}/community/groups/group-toeic-900/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Hôm nay mọi người cùng làm bài nhé!', userId: 'demo-user-id-001' }),
    });
    const groupPostData = await groupPostRes.json();
    assert(groupPostRes.status === 201 && Boolean(groupPostData.post?.id), 'Posted to study group successfully');

    // 8. Achievements
    console.log('\n8. Testing Social Learning Achievements & Progress...');
    const achRes = await fetch(`${API_BASE}/community/achievements?userId=demo-user-id-001`);
    const achData = await achRes.json();
    assert(achRes.status === 200 && achData.achievements.length >= 5, 'Retrieved achievements with user progress');

    // 9. Community Search
    console.log('\n9. Testing Community Search Engine...');
    const searchRes = await fetch(`${API_BASE}/community/search?q=toeic`);
    const searchData = await searchRes.json();
    assert(searchRes.status === 200 && Array.isArray(searchData.groups), 'Search completed across groups, users, and notes');

    // 10. Security Boundary
    console.log('\n10. Testing Security Rejection of Invalid Targets...');
    const badProfileRes = await fetch(`${API_BASE}/community/profile/non-existent-user`);
    assert(badProfileRes.status === 404, 'Rejects non-existent profile with 404');

    const badNoteRes = await fetch(`${API_BASE}/community/notes/non-existent-note`);
    assert(badNoteRes.status === 404, 'Rejects non-existent note with 404');

    console.log(`\n========================================`);
    console.log(`🎉 LIVE QA SUITE FINISHED: ${passCount} PASSED, ${failCount} FAILED`);
    console.log(`========================================\n`);

    if (failCount > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Fatal QA error:', err);
    process.exit(1);
  }
}

runLiveCommunityQA();
