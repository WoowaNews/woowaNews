import { COACHES } from '../data/crew-data.js';
import { VILLAGE_NEWS } from '../data/village-news.js';
import { dailySeed } from '../utils/date-utils.js';

export function renderVillageAndCoach() {
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

  return `
    <div class="bottom-sections-grid">
      <div class="news-section-box">
        <span class="news-section-box-badge" style="background-color: #0f766e">마을 소식</span>
        <h2 class="news-section-box-title">🏘️ 이 시각 각 마을</h2>
        <div id="village-news-list">
          ${villageItemsHtml}
        </div>
      </div>
      <div class="news-section-box">
        <span class="news-section-box-badge" style="background-color: #7c3aed">코치의 한마디</span>
        <h2 class="news-section-box-title">📢 오늘의 한마디</h2>
        <div id="coach-quote-content">
          <div class="coach-quote-box">
            <p class="coach-quote-text">"${coach.quote}"</p>
            <p class="coach-quote-author">- 코치 ${coach.name}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
