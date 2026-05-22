export const MOCK_FOOTPRINTS = [
  {
    repoName: "java-janggi",
    totalCommits: 342,
    totalComments: 8825,
    participatingCrews: 28,
    mergedPrCount: 24,
    firstPR: { crew: "무빙", date: "3월 26일", time: "오후 3:52" },
    fastestMerge: { crew: "제이", duration: "26시간 50분" },
    mostComments: { crew: "요크", count: 142 },
    mostCommits: { crew: "아티", count: 48 }
  },
  {
    repoName: "javascript-movie-review",
    totalCommits: 187,
    totalComments: 7443,
    participatingCrews: 32,
    mergedPrCount: 29,
    firstPR: { crew: "엘라", date: "5월 4일", time: "오전 9:18" },
    fastestMerge: { crew: "아티", duration: "23시간 35분" },
    mostComments: { crew: "무빙", count: 98 },
    mostCommits: { crew: "제이", count: 35 }
  },
  {
    repoName: "android-shopping-cart",
    totalCommits: 215,
    totalComments: 4321,
    participatingCrews: 18,
    mergedPrCount: 15,
    firstPR: { crew: "요크", date: "5월 12일", time: "오전 10:05" },
    fastestMerge: { crew: "엘라", duration: "18시간 15분" },
    mostComments: { crew: "제이", count: 64 },
    mostCommits: { crew: "요크", count: 29 }
  }
];

export function renderFootprints(footprintData = null) {
  const data = footprintData || MOCK_FOOTPRINTS;
  
  const cardsHtml = data.map(repo => {
    const totalCommits = repo.totalCommits || 0;
    const totalComments = repo.totalComments || 0;
    const participatingCrews = repo.participatingCrews || 0;
    const mergedPrCount = repo.mergedPrCount || 0;

    const firstPrCrew = repo.firstPR?.crew || 'N/A';
    const firstPrDate = repo.firstPR?.date || '';
    const firstPrTime = repo.firstPR?.time || '';

    const fastestMergeCrew = repo.fastestMerge?.crew || 'N/A';
    const fastestMergeDuration = repo.fastestMerge?.duration || 'N/A';

    const mostCommentsCrew = repo.mostComments?.crew || 'N/A';
    const mostCommentsCount = repo.mostComments?.count || 0;

    const mostCommitsCrew = repo.mostCommits?.crew || 'N/A';
    const mostCommitsCount = repo.mostCommits?.count || 0;

    return `
      <div class="footprint-mission-card">
        <div class="footprint-card-header">
          <span class="footprint-mission-label">${
            repo.repoName === 'java-janggi' 
              ? '♟️ 장기 미션' 
              : repo.repoName === 'javascript-movie-review' 
                ? '🎥 영화 리뷰 미션' 
                : '🛒 쇼핑 카트 미션'
          }</span>
          <span class="footprint-repo-badge">${repo.repoName}</span>
        </div>
        <div class="footprint-stats-grid">
          <div class="footprint-stat-item">
            <span class="footprint-stat-val">${totalCommits}</span>
            <span class="footprint-stat-lbl">총 커밋 수</span>
          </div>
          <div class="footprint-stat-item">
            <span class="footprint-stat-val">${totalComments}</span>
            <span class="footprint-stat-lbl">총 코멘트 수</span>
          </div>
          <div class="footprint-stat-item">
            <span class="footprint-stat-val">${participatingCrews}</span>
            <span class="footprint-stat-lbl">참여 크루 수</span>
          </div>
          <div class="footprint-stat-item">
            <span class="footprint-stat-val">${mergedPrCount}</span>
            <span class="footprint-stat-lbl">merged PR 수</span>
          </div>
        </div>
        <div class="footprint-ranking-list">
          <div class="footprint-rank-item">
            <span class="footprint-rank-label">🥇 첫 PR 생성자</span>
            <span class="footprint-rank-value">${firstPrCrew} <span class="footprint-rank-value-sub">(${firstPrDate} ${firstPrTime})</span></span>
          </div>
          <div class="footprint-rank-item">
            <span class="footprint-rank-label">⚡ 첫 머지 크루</span>
            <span class="footprint-rank-value">${fastestMergeCrew} <span class="footprint-rank-value-sub">(${fastestMergeDuration})</span></span>
          </div>
          <div class="footprint-rank-item">
            <span class="footprint-rank-label">💬 최다 코멘트 리뷰어</span>
            <span class="footprint-rank-value">${mostCommentsCrew} <span class="footprint-rank-value-sub">(${mostCommentsCount}개)</span></span>
          </div>
          <div class="footprint-rank-item">
            <span class="footprint-rank-label">🔥 최다 커밋 크루</span>
            <span class="footprint-rank-value">${mostCommitsCrew} <span class="footprint-rank-value-sub">(${mostCommitsCount}회)</span></span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="footprint-section-header">
      <div class="footprint-section-title-wrap">
        <h2 class="news-section-box-title" style="border-bottom: none; margin-bottom: 0;">👣 우리가 함께 걸어온 발자국</h2>    
      </div>
      <p class="footprint-intro-desc">PR 생성부터 머지까지, 크루들의 도전 기록</p>
    </div>
    <div class="footprint-missions-grid" id="footprint-missions-grid">
      ${cardsHtml}
    </div>
  `;
}
