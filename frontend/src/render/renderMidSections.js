import { BIRTHDAY_CREWS } from '../data/crew-data.js';

const MOCK_YESTERDAY = [
  {
    name: "포비",
    realName: "박재성",
    status: "checkin", // "checkin" or "checkout"
    time: "08:52",
    color: "#1e3a8a",
    msg: "오늘도 페어와 즐겁게 레거시 코드를 파헤쳐봅시다! 다들 파이팅!"
  },
  {
    name: "준태",
    realName: "김준태",
    status: "checkout",
    time: "22:15",
    color: "#991b1b",
    msg: "드디어 테스트 통과... 가벼운 마음으로 칼퇴합니다. 둠바!"
  }
];

export const CAFETERIA_MENUS = {
  C: "🍽️ 수제 돈까스 & 마크니 커리",
  D: "🍜 전통 육개장 칼국수 & 왕만두"
};

export function renderMidSections(voteResults = null, votedOption = null) {
  // 1. Hall of fame (yesterday checkin)
  const hallListHtml = MOCK_YESTERDAY.map(item => {
    const statusBadge = item.status === 'checkin'
      ? `<span class="badge-checkin">🌅 입실</span>`
      : `<span class="badge-checkout">🌙 퇴실</span>`;
      
    return `
      <div class="hall-crew-item">
        <div class="hall-avatar" style="background-color: ${item.color}">${item.name.charAt(0)}</div>
        <div class="hall-crew-info">
          <div class="hall-crew-name-row">
            <span class="hall-nickname">${item.name}</span>
            <span class="hall-realname">(${item.realName})</span>
            ${statusBadge}
            <span class="hall-time">${item.time}</span>
          </div>
          <p class="hall-msg">"${item.msg}"</p>
        </div>
      </div>
    `;
  }).join('');

  // 2. Birthdays of the month
  const thisMonth = new Date().getMonth() + 1;
  const birthdayCrews = BIRTHDAY_CREWS.filter(c => c.month === thisMonth);
  let birthdayHtml = '';
  if (birthdayCrews.length > 0) {
    const names = birthdayCrews.map(c => c.name).join(', ');
    birthdayHtml = `
      <div class="birthday-content-wrap">
        <div class="birthday-cake-icon">🎂</div>
        <div class="birthday-names">${names}</div>
        <div class="birthday-blurb">${thisMonth}월의 생일을 진심으로 축하합니다!<br>오늘 보도국의 주인공으로 선정된 크루들에게 응원의 인사를 건네보세요. 🎉</div>
      </div>
    `;
  } else {
    birthdayHtml = `
      <div class="birthday-content-wrap">
        <p class="birthday-empty">${thisMonth}월에 생일인 크루가 없네요. 다음 달을 기다려주세요!</p>
      </div>
    `;
  }

  // 3. Lunch Vote
  const options = [
    { key: "CORNER_C", label: `구내식당 C코너 (${CAFETERIA_MENUS.C})` },
    { key: "CORNER_D", label: `구내식당 D코너 (${CAFETERIA_MENUS.D})` },
    { key: "EAT_OUT", label: "밖에서 맛있는 식사 🚶" },
    { key: "LUNCH_BOX", label: "집에서 준비한 도시락 🍱" }
  ];

  let lunchContentHtml = '';

  if (voteResults) {
    // Show results
    const totalVotes = voteResults.totalVotes || 0;
    const items = voteResults.options || {};
    
    // Find winner
    let winnerOption = '';
    let maxCount = -1;
    options.forEach(opt => {
      const count = items[opt.key] || 0;
      if (count > maxCount) {
        maxCount = count;
        winnerOption = opt.label;
      }
    });

    const resultsListHtml = options.map(opt => {
      const count = items[opt.key] || 0;
      const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
      const isUserChoice = votedOption === opt.key ? ' (나의 선택)' : '';
      
      return `
        <div class="lunch-result-row">
          <div class="lunch-result-label-row">
            <span>${opt.label}${isUserChoice}</span>
            <span>${percent}% (${count}표)</span>
          </div>
          <div class="lunch-progress-bar-bg">
            <div class="lunch-progress-bar-fill" style="width: ${percent}%"></div>
          </div>
        </div>
      `;
    }).join('');

    lunchContentHtml = `
      <div class="lunch-vote-box">
        <div class="lunch-menu-header">📢 투표 종료! 실시간 현황 (총 ${totalVotes}표)</div>
        <div class="lunch-options-list">
          ${resultsListHtml}
        </div>
        ${maxCount > 0 ? `<div class="lunch-winner-badge">🏆 현재 1등 메뉴: ${winnerOption}</div>` : ''}
      </div>
    `;
  } else {
    // Show voting options
    const buttonsHtml = options.map(opt => {
      return `<button class="lunch-option-btn" data-option="${opt.key}"><span>${opt.label}</span> 🗳️</button>`;
    }).join('');

    lunchContentHtml = `
      <div class="lunch-vote-box">
        <div class="lunch-menu-header">📋 오늘의 구내식당 메뉴판<br>• C코너: ${CAFETERIA_MENUS.C}<br>• D코너: ${CAFETERIA_MENUS.D}</div>
        <div class="lunch-options-list">
          ${buttonsHtml}
        </div>
      </div>
    `;
  }

  return `
    <div class="mid-sections-grid">
      <div class="news-section-box">
        <span class="news-section-box-badge" style="background-color: var(--slate-navy)">명예의 전당</span>
        <h2 class="news-section-box-title">🏆 어제의 왔다감 크루</h2>
        <div class="hall-crew-list" id="hall-crew-list">
          ${hallListHtml}
        </div>
      </div>
      <div class="news-section-box">
        <span class="news-section-box-badge" style="background-color: #9d174d">이달의 생일</span>
        <h2 class="news-section-box-title">🎂 이번달 주인공</h2>
        <div id="birthday-section-content">
          ${birthdayHtml}
        </div>
      </div>
      <div class="news-section-box">
        <span class="news-section-box-badge" style="background-color: #d97706">점뭐먹</span>
        <h2 class="news-section-box-title">🍱 오늘 점심 뭐 먹지?</h2>
        <div id="lunch-vote-content">
          ${lunchContentHtml}
        </div>
      </div>
    </div>
  `;
}
