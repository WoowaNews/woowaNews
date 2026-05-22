import { CREWS } from '../data/crew-data.js';

export function getTodayCrew() {
  return CREWS.find(crew => crew.name === '아티') || CREWS[0];
}

export function renderBreakingNews(crew, likeCount = 0) {
  const avatarHtml = crew.avatar
    ? `<img class="crew-avatar-img" src="${crew.avatar}" alt="${crew.name}">`
    : `<div class="crew-avatar-placeholder">${crew.name.charAt(0)}</div>`;

  const tagsHtml = crew.tags.map(t => `<span class="crew-tag">${t}</span>`).join('');

  return `
    <div class="breaking-news-banner crew-of-day-banner">
      <span class="breaking-news-label">[오늘의 크루]</span>
      <div class="crew-of-day-body">
        <div class="crew-of-day-avatar-wrap">
          ${avatarHtml}
        </div>
        <div class="crew-of-day-content">
          <div class="crew-of-day-top">
            <span class="breaking-news-text">${crew.headline}</span>
            <div class="crew-of-day-meta">
              <span class="track-badge">${crew.track}</span>
              ${tagsHtml}
            </div>
          </div>
          <div class="breaking-news-desc">
            <p>${crew.desc}</p>
          </div>
          <div class="crew-of-day-cta-area">
            <span class="crew-of-day-cta">${crew.callToAction}</span>
            <div class="like-button-container">
              <button class="like-button" id="like-btn-today" data-crew="${crew.name}">❤️</button>
              <span class="like-count" id="like-count-today">${likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
