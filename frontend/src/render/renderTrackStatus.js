const MOCK_TRACKS = [
  {
    track: "프론트엔드",
    mission: "🎥 영화 리뷰 미션",
    openPr: 12,
    mergedPr: 45,
    repoUrl: "https://github.com/woowacourse/javascript-movie-review"
  },
  {
    track: "백엔드",
    mission: "♟️ 장기 게임 미션",
    openPr: 8,
    mergedPr: 62,
    repoUrl: "https://github.com/woowacourse/java-janggi"
  },
  {
    track: "안드로이드",
    mission: "🛒 쇼핑 카트 미션",
    openPr: 5,
    mergedPr: 31,
    repoUrl: "https://github.com/woowacourse/android-shopping-cart"
  }
];

export function renderTrackStatus() {
  const cardsHtml = MOCK_TRACKS.map(t => {
    return `
      <div class="track-card">
        <div class="track-card-header">
          <span class="track-card-title">${t.track}</span>
          <span class="track-badge">${t.track === '백엔드' ? 'Java' : t.track === '프론트엔드' ? 'JS' : 'Kotlin'}</span>
        </div>
        <div class="track-mission-name">${t.mission}</div>
        <div class="track-stats-row">
          <span>📬 Open PR: ${t.openPr}</span>
          <span>✅ Merged: ${t.mergedPr}</span>
        </div>
        <a class="track-repo-link" href="${t.repoUrl}" target="_blank">레포지토리 바로가기 ↗</a>
      </div>
    `;
  }).join('');

  return `
    <div class="track-section-box">
      <span class="news-section-box-badge" style="background-color: #0369a1">미션 현황</span>
      <h2 class="news-section-box-title">📋 교육 트랙별 미션 현황</h2>
      <div class="track-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
}
