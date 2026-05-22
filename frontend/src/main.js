import './styles.css';
import { renderHeader } from './render/renderHeader.js';
import { renderBreakingNews, getTodayCrew } from './render/renderBreakingNews.js';
import { renderMidSections } from './render/renderMidSections.js';
import { renderTrackStatus } from './render/renderTrackStatus.js';
import { renderVillageAndCoach } from './render/renderVillageAndCoach.js';
import { renderFootprints } from './render/renderFootprints.js';

const app = document.querySelector('#app');
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8080'
  : '';

// App State
let todayCrew = getTodayCrew();
let likeCount = 0;
let votedOption = localStorage.getItem(`lunch-vote-choice-${getTodayDateKey()}`);
let voteResults = null;
let footprintData = null;

// Helpers
function getTodayDateKey() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
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
      <footer class="newspaper-footer">
        <p>우아한 뉴스 | 우테코 8기 보도국 | 발행인: 우테코 크루 일동</p>
        <p class="footer-disclaimer">※ 본 신문은 우아한테크코스 8기 교육용 데모 웹앱으로, 실제 보도 내용과는 무관할 수 있습니다. 무단 전재 시 커피 1잔의 벌금이 부과됩니다.</p>
      </footer>
    </div>
  `;

  // Render static/initial contents
  document.getElementById('section-header').innerHTML = renderHeader();
  document.getElementById('section-breaking').innerHTML = renderBreakingNews(todayCrew, likeCount);
  document.getElementById('section-mid').innerHTML = renderMidSections(voteResults, votedOption);
  document.getElementById('section-track').innerHTML = renderTrackStatus();
  document.getElementById('section-bottom').innerHTML = renderVillageAndCoach();
  document.getElementById('section-footprints').innerHTML = renderFootprints(footprintData);

  setupEventListeners();
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
  }

  // Github Sync button
  const syncBtn = document.getElementById('sync-github-btn');
  if (syncBtn) {
    syncBtn.addEventListener('click', handleGithubSync);
  }
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
      // If total votes > 0, we can display results or if user already voted.
      // For demo convenience, if user already voted (votedOption exists), show results.
      // Or if there are active votes, always show results. The spec says:
      // "투표 후 실시간 퍼센트 바 렌더링. 초기 구현은 mock 데이터 기반 렌더링 후 API 연동"
      // If user hasn't voted yet, let them vote.
      if (votedOption || voteResults.totalVotes > 0) {
        updateLunchUI();
      }
    }
  } catch (e) {
    console.warn("Failed to fetch lunch votes from server", e);
  }
}

async function handleLunchVote(optionKey) {
  votedOption = optionKey;
  localStorage.setItem(`lunch-vote-choice-${getTodayDateKey()}`, optionKey);

  // Optimistic UI change to showing results with mock increments
  if (!voteResults) {
    voteResults = {
      totalVotes: 1,
      options: { CORNER_C: 0, CORNER_D: 0, EAT_OUT: 0, LUNCH_BOX: 0 }
    };
  }
  voteResults.options[optionKey] = (voteResults.options[optionKey] || 0) + 1;
  voteResults.totalVotes++;
  updateLunchUI();

  try {
    const res = await fetch(`${API_BASE}/api/lunch-vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menuOption: optionKey })
    });
    if (res.ok) {
      voteResults = await res.json();
      updateLunchUI();
    }
  } catch (e) {
    console.error("Failed to post lunch vote", e);
  }
}

function updateLunchUI() {
  const container = document.getElementById('section-mid');
  if (container) {
    container.innerHTML = renderMidSections(voteResults, votedOption);
    setupEventListeners(); // re-bind remaining buttons
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

// Initial Boot
renderSkeleton();
fetchLikeCount();
fetchLunchVote();
loadFootprints();
