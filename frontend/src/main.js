import './styles.css';
import { renderHeader } from './render/renderHeader.js';
import { renderBreakingNews, getTodayCrew } from './render/renderBreakingNews.js';
import { getJuneBirthdayCrewCount, renderMidSections } from './render/renderMidSections.js';
import { renderTrackStatus } from './render/renderTrackStatus.js';
import { renderVillageAndCoach } from './render/renderVillageAndCoach.js';
import { renderFootprints } from './render/renderFootprints.js';
import { renderGames } from './render/renderGames.js';
import { initGames } from './games.js';

const app = document.querySelector('#app');
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080'
  : '';

// App State
let todayCrew = getTodayCrew();
let likeCount = 0;
let votedOption = null;
let voteResults = null;
let footprintData = null;
let guestbookEntries = loadGuestbookEntries();
let birthdaySlideIndex = 0;
let birthdayCarouselTimer = null;

// Helpers
function getTodayDateKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function clearLegacyLunchVoteChoice() {
  localStorage.removeItem(`lunch-vote-choice-${getTodayDateKey()}`);
}

function loadGuestbookEntries() {
  try {
    return JSON.parse(localStorage.getItem('today-word-guestbook') || '[]');
  } catch {
    localStorage.removeItem('today-word-guestbook');
    return [];
  }
}

function saveGuestbookEntries() {
  localStorage.setItem('today-word-guestbook', JSON.stringify(guestbookEntries));
}

function getCurrentKoreanTimeLabel() {
  const d = new Date();
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function mapCommentToGuestbookEntry(comment) {
  return {
    id: comment.id,
    message: comment.content || comment.message || '',
    createdAt: comment.create_at || comment.createAt || ''
  };
}

// Render the main skeleton
function renderSkeleton() {
  app.innerHTML = `
    <div class="newspaper-wrapper">
      <div id="section-header"></div>
      <div id="section-breaking"></div>
      <div class="thick-line"></div>
      <div id="section-mid"></div>
      <div class="paper-crease"></div>
      <div id="section-track"></div>
      <div class="thick-line"></div>
      <div id="section-bottom"></div>
      <div class="thick-line"></div>
      <div id="section-footprints"></div>
      <div class="double-line"></div>
      <div id="section-games"></div>
      <div class="double-line"></div>
      <footer class="newspaper-footer">
        <p>우아한 뉴스 | 우테코 8기 보도국 | 발행인: 우테코 크루 일동</p>
        <p class="footer-disclaimer">※ 본 신문은 우아한테크코스 8기 교육용 데모 웹앱으로, 실제 보도 내용과는 무관할 수 있습니다. 무단 전재 시 추노하러갑니다.</p>
      </footer>
    </div>
  `;

  // Render static/initial contents
  document.getElementById('section-header').innerHTML = renderHeader();
  document.getElementById('section-breaking').innerHTML = renderBreakingNews(todayCrew, likeCount);
  document.getElementById('section-mid').innerHTML = renderMidSections(voteResults, votedOption, birthdaySlideIndex);
  document.getElementById('section-track').innerHTML = renderTrackStatus();
  document.getElementById('section-bottom').innerHTML = renderVillageAndCoach(guestbookEntries);
  document.getElementById('section-footprints').innerHTML = renderFootprints(footprintData);
  document.getElementById('section-games').innerHTML = renderGames();

  setupEventListeners();
  initGames(API_BASE);
}

// Set up event listeners for interactive buttons
function setupEventListeners() {
  // Like button
  const likeBtn = document.getElementById('like-btn-today');
  if (likeBtn) {
    likeBtn.addEventListener('click', handleLike);
  }

  // Lunch option buttons
  const midContainer = document.getElementById('section-mid');
  if (midContainer) {
    midContainer.querySelectorAll('.lunch-option-btn').forEach(btn => {
      btn.addEventListener('click', () => handleLunchVote(btn.dataset.option));
    });

    midContainer.querySelectorAll('[data-birthday-direction]').forEach(btn => {
      btn.addEventListener('click', () => handleBirthdaySlideMove(Number(btn.dataset.birthdayDirection)));
    });

    midContainer.querySelectorAll('[data-birthday-index]').forEach(btn => {
      btn.addEventListener('click', () => handleBirthdaySlideSelect(Number(btn.dataset.birthdayIndex)));
    });
  }

  // Github Sync button
  const syncBtn = document.getElementById('sync-github-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', handleGithubSync);
  }

  // Guestbook form
  const guestbookForm = document.getElementById('guestbook-form');
  if (guestbookForm) {
    guestbookForm.addEventListener('submit', handleGuestbookSubmit);
  }

  startBirthdayCarousel();
}

// 1. Crew Like API call
async function fetchLikeCount() {
  try {
    const res = await fetch(`${API_BASE}/api/crew-like/${todayCrew.name}`);
    if (res.ok) {
      const data = await res.json();
      likeCount = data.likeCount || 0;
      updateLikeUI();
    }
  } catch (e) {
    console.warn("Failed to fetch like count from server, using default.", e);
  }
}

async function handleLike() {
  // Optimistic update
  likeCount++;
  updateLikeUI();

  try {
    const res = await fetch(`${API_BASE}/api/crew-like/${todayCrew.name}`, {
      method: 'POST'
    });
    if (res.ok) {
      const data = await res.json();
      likeCount = data.likeCount;
      updateLikeUI();
    }
  } catch (e) {
    console.error("Failed to post like to server", e);
  }
}

function updateLikeUI() {
  const countEl = document.getElementById('like-count-today');
  if (countEl) {
    countEl.textContent = likeCount;
  }
}

// 2. Lunch Vote API calls
async function fetchLunchVote() {
  try {
    const res = await fetch(`${API_BASE}/api/lunch-vote`);
    if (res.ok) {
      voteResults = await res.json();
      updateLunchUI();
    }
  } catch (e) {
    console.warn("Failed to fetch lunch votes from server", e);
  }
}

async function handleLunchVote(optionKey) {
  const lunchButtons = document.querySelectorAll('.lunch-option-btn');
  lunchButtons.forEach(btn => {
    btn.disabled = true;
  });

  try {
    const res = await fetch(`${API_BASE}/api/lunch-vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menuOption: optionKey })
    });
    if (res.ok) {
      votedOption = optionKey;
      voteResults = await res.json();
      updateLunchUI();
    } else {
      await fetchLunchVote();
    }
  } catch (e) {
    console.error("Failed to post lunch vote", e);
    lunchButtons.forEach(btn => {
      btn.disabled = false;
    });
  }
}

function updateLunchUI() {
  const container = document.getElementById('section-mid');
  if (container) {
    container.innerHTML = renderMidSections(voteResults, votedOption, birthdaySlideIndex);
    setupEventListeners(); // re-bind remaining buttons
  }
}

function handleBirthdaySlideMove(direction) {
  const count = getJuneBirthdayCrewCount();
  if (count <= 1) return;

  birthdaySlideIndex = (birthdaySlideIndex + direction + count) % count;
  updateMidSectionsUI();
}

function handleBirthdaySlideSelect(index) {
  const count = getJuneBirthdayCrewCount();
  if (count <= 1 || Number.isNaN(index)) return;

  birthdaySlideIndex = ((index % count) + count) % count;
  updateMidSectionsUI();
}

function startBirthdayCarousel() {
  const count = getJuneBirthdayCrewCount();
  clearInterval(birthdayCarouselTimer);

  if (count <= 1) return;

  birthdayCarouselTimer = setInterval(() => {
    birthdaySlideIndex = (birthdaySlideIndex + 1) % count;
    updateMidSectionsUI();
  }, 4500);
}

function updateMidSectionsUI() {
  const container = document.getElementById('section-mid');
  if (container) {
    container.innerHTML = renderMidSections(voteResults, votedOption, birthdaySlideIndex);
    setupEventListeners();
  }
}

// 3. Footprint API Caching and Sync
async function loadFootprints() {
  const todayKey = getTodayDateKey();
  const cacheKey = `footprint-backend-${todayKey}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      footprintData = JSON.parse(cached);
      updateFootprintsUI();
      return;
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  // Fetch from backend
  await fetchFootprints();
}

async function fetchFootprints() {
  try {
    const res = await fetch(`${API_BASE}/api/footprint`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        footprintData = data;
        const todayKey = getTodayDateKey();
        localStorage.setItem(`footprint-backend-${todayKey}`, JSON.stringify(data));
        updateFootprintsUI();
      }
    }
  } catch (e) {
    console.warn("Failed to fetch footprints from backend, rendering mock data.", e);
  }
}

async function handleGithubSync() {
  const syncBtn = document.getElementById('sync-github-btn');
  if (syncBtn) {
    syncBtn.disabled = true;
    syncBtn.textContent = '🔄 동기화 중...';
  }

  try {
    const res = await fetch(`${API_BASE}/api/sync`);
    if (res.ok) {
      // Re-fetch footprint data and overwrite cache
      const resData = await fetch(`${API_BASE}/api/footprint`);
      if (resData.ok) {
        const data = await resData.json();
        footprintData = data;
        const todayKey = getTodayDateKey();
        localStorage.setItem(`footprint-backend-${todayKey}`, JSON.stringify(data));
        updateFootprintsUI();
        alert('동기화 완료!');
      }
    } else {
      alert('동기화 실패. GITHUB_TOKEN 및 백엔드 설정을 확인하세요.');
    }
  } catch (e) {
    console.error("Error during sync", e);
    alert('동기화 실패. 백엔드 서버 연결을 확인하세요.');
  } finally {
    if (syncBtn) {
      syncBtn.disabled = false;
      syncBtn.textContent = '🔄 깃허브 데이터 동기화';
    }
  }
}

function updateFootprintsUI() {
  const container = document.getElementById('section-footprints');
  if (container) {
    container.innerHTML = renderFootprints(footprintData);
    setupEventListeners(); // re-bind sync button
  }
}

async function fetchComments() {
  try {
    const res = await fetch(`${API_BASE}/api/comments`);
    if (res.ok) {
      const comments = await res.json();
      guestbookEntries = comments.map(mapCommentToGuestbookEntry);
      saveGuestbookEntries();
      updateVillageAndCoachUI();
    }
  } catch (e) {
    console.warn("Failed to fetch comments from server, using local guestbook entries.", e);
  }
}

async function handleGuestbookSubmit(event) {
  event.preventDefault();

  const messageInput = document.getElementById('guestbook-message-input');
  const message = messageInput?.value.trim();

  if (!message) {
    messageInput?.focus();
    return;
  }

  messageInput.value = '';
  messageInput.disabled = true;

  guestbookEntries = [
    {
      message,
      createdAt: getCurrentKoreanTimeLabel()
    },
    ...guestbookEntries
  ].slice(0, 6);

  saveGuestbookEntries();
  updateVillageAndCoachUI();

  try {
    const res = await fetch(`${API_BASE}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message })
    });

    if (res.ok) {
      await fetchComments();
    }
  } catch (e) {
    console.error("Failed to post comment to server, keeping local optimistic entry.", e);
  } finally {
    const currentInput = document.getElementById('guestbook-message-input');
    if (currentInput) {
      currentInput.disabled = false;
      currentInput.focus();
    }
  }
}

function updateVillageAndCoachUI() {
  const container = document.getElementById('section-bottom');
  if (container) {
    container.innerHTML = renderVillageAndCoach(guestbookEntries);
    setupEventListeners();
  }
}

// Initial Boot
clearLegacyLunchVoteChoice();
renderSkeleton();
fetchLikeCount();
fetchLunchVote();
loadFootprints();
fetchComments();
