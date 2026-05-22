import { COACHES } from '../data/crew-data.js';
import { VILLAGE_NEWS } from '../data/village-news.js';
import { dailySeed } from '../utils/date-utils.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function renderVillageAndCoach(guestbookEntries = []) {
  const seed = dailySeed();

  // 1. Village news items
  const villageItemsHtml = Object.keys(VILLAGE_NEWS).map(villageName => {
    const newsList = VILLAGE_NEWS[villageName];
    const news = newsList[seed % newsList.length];
    return `
      <div class="village-item">
        <span class="village-tag">${villageName}</span>
        <span class="village-news-text">${news}</span>
      </div>
    `;
  }).join('');

  // 2. Coach Quote
  const coach = COACHES[seed % COACHES.length];
  const guestbookListHtml = guestbookEntries.length > 0
    ? guestbookEntries.map(entry => `
      <div class="guestbook-entry">
        <p class="guestbook-entry-message">${escapeHtml(entry.message)}</p>
      </div>
    `).join('')
    : '<p class="guestbook-empty">아직 남겨진 한마디가 없습니다. 첫 인사를 남겨보세요.</p>';

  return `
    <div class="bottom-sections-grid">
      <div class="news-section-box">
        <span class="news-section-box-badge" style="background-color: #0f766e">마을 소식</span>
        <h2 class="news-section-box-title">🏘️ 이 시각 각 마을</h2>
        <div id="village-news-list">
          ${villageItemsHtml}
        </div>
      </div>
      <div class="news-section-box coach-word-section">
        <h2 class="news-section-box-title">📢 오늘의 한마디</h2>
        <div id="coach-quote-content">
          <div class="coach-quote-label">코치의 한마디</div>
          <div class="coach-quote-box">
            <p class="coach-quote-text">"${coach.quote}"</p>
            <p class="coach-quote-author">- 코치 ${coach.name}</p>
          </div>
          <div class="guestbook-list" id="guestbook-list">
            ${guestbookListHtml}
          </div>
          <form class="guestbook-form" id="guestbook-form">
            <input class="guestbook-message-input" id="guestbook-message-input" type="text" maxlength="80" placeholder="한마디를 남겨주세요." aria-label="방명록 한마디">
            <button class="guestbook-submit-button" type="submit">남기기</button>
          </form>
        </div>
      </div>
    </div>
  `;
}
