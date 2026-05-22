import juneBirthdayHallImage from '../assets/june-birthday-hall.png';
import artiBirthdayHallImage from '../assets/arti-today-crew.jpeg';

const MOCK_YESTERDAY = [
  {
    name: "피노, 코코",
    realName: "",
    status: "checkin",
    time: "08:00",
    color: "#1e3a8a",
    msg: "오전 8시 첫 번째 입실자로 입실했습니다."
  },
  {
    name: "정콩이",
    realName: "",
    status: "checkout",
    time: "23:00",
    color: "#991b1b",
    msg: "오후 11시 마지막 퇴실자임을 확인 후 퇴실했습니다."
  }
];

export const CAFETERIA_MENUS = {
  C: "🍽️ 쇠고기 우거지 해장국",
  D: "🍜 포장마차 잔치국수"
};

const JUNE_BIRTHDAY_CREWS = [
  {
    name: "무빙",
    month: 6,
    day: 25,
    image: juneBirthdayHallImage
  },
  {
    name: "아티",
    month: 6,
    day: 30,
    image: artiBirthdayHallImage
  }
];

export function getJuneBirthdayCrewCount() {
  return JUNE_BIRTHDAY_CREWS.length;
}

export function renderMidSections(voteResults = null, votedOption = null, birthdaySlideIndex = 0) {
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
            ${item.realName ? `<span class="hall-realname">(${item.realName})</span>` : ''}
            ${statusBadge}
            <span class="hall-time">${item.time}</span>
          </div>
          <p class="hall-msg">${item.msg}</p>
        </div>
      </div>
    `;
  }).join('');

  // 2. June birthday hall of fame
  const birthdayMonth = 6;
  const birthdayCrews = JUNE_BIRTHDAY_CREWS;
  const normalizedBirthdayIndex = birthdayCrews.length > 0
    ? ((birthdaySlideIndex % birthdayCrews.length) + birthdayCrews.length) % birthdayCrews.length
    : 0;
  const birthdayCrew = birthdayCrews[normalizedBirthdayIndex];
  let birthdayHtml = '';
  if (birthdayCrews.length > 0) {
    const dotsHtml = birthdayCrews.map((crew, index) => `
      <button
        class="birthday-carousel-dot ${index === normalizedBirthdayIndex ? 'active' : ''}"
        type="button"
        data-birthday-index="${index}"
        aria-label="${crew.name} 생일자 보기"
      ></button>
    `).join('');

    birthdayHtml = `
      <div class="birthday-content-wrap birthday-hall-content">
        <div class="birthday-hall-frame">
          <div class="birthday-hall-laurel" aria-hidden="true">
            <div class="laurel-center">
              <div class="laurel-stars">★ ★ ★</div>
              <div class="laurel-title">생일의 전당</div>
              <div class="laurel-subtitle">JUNE BIRTHDAY</div>
            </div>
          </div>
          <button class="birthday-carousel-button birthday-carousel-prev" type="button" data-birthday-direction="-1" aria-label="이전 생일자 보기">‹</button>
          <button class="birthday-carousel-button birthday-carousel-next" type="button" data-birthday-direction="1" aria-label="다음 생일자 보기">›</button>
          <img class="birthday-hall-image" src="${birthdayCrew.image}" alt="6월 생일자 ${birthdayCrew.name} 명예의 전당 사진">
          <div class="birthday-hall-copy">
            <div class="birthday-names">${birthdayCrew.name} <span class="birthday-date">(${birthdayCrew.month}월 ${birthdayCrew.day}일)</span></div>
            <div class="birthday-blurb">${birthdayMonth}월의 생일을 진심으로 축하합니다!<br>오늘 보도국의 주인공으로 선정된 크루에게 응원의 인사를 건네보세요.</div>
          </div>
        </div>
        <div class="birthday-carousel-dots" aria-label="생일자 목록">
          ${dotsHtml}
        </div>
      </div>
    `;
  } else {
    birthdayHtml = `
      <div class="birthday-content-wrap">
        <p class="birthday-empty">${birthdayMonth}월에 생일인 크루가 없네요. 다음 달을 기다려주세요!</p>
      </div>
    `;
  }

  // 3. Lunch Vote
  const options = [
    { key: "CORNER_C", label: `구내식당 C코너 (${CAFETERIA_MENUS.C})`, color: "#0f766e" },
    { key: "CORNER_D", label: `구내식당 D코너 (${CAFETERIA_MENUS.D})`, color: "#2563eb" },
    { key: "EAT_OUT", label: "밖에서 맛있는 식사 🚶", color: "#d97706" },
    { key: "LUNCH_BOX", label: "집에서 준비한 도시락 🍱", color: "#be123c" }
  ];

  let lunchContentHtml = '';

  if (voteResults && (voteResults.totalVotes > 0 || votedOption)) {
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

    let currentDeg = 0;
    const donutSegments = options.map(opt => {
      const count = items[opt.key] || 0;
      const deg = totalVotes > 0 ? (count / totalVotes) * 360 : 0;
      const segment = `${opt.color} ${currentDeg}deg ${currentDeg + deg}deg`;
      currentDeg += deg;
      return segment;
    }).join(', ');
    const donutBackground = totalVotes > 0 ? donutSegments : '#e2e8f0 0deg 360deg';

    const resultsListHtml = options.map(opt => {
      const count = items[opt.key] || 0;
      const percent = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
      const isUserChoice = votedOption === opt.key ? ' (나의 선택)' : '';
      
      return `
        <div class="lunch-result-row">
          <span class="lunch-legend-color" style="background-color: ${opt.color}"></span>
          <div class="lunch-result-label-row">
            <span>${opt.label}${isUserChoice}</span>
            <span>${percent}% (${count}표)</span>
          </div>
        </div>
      `;
    }).join('');

    lunchContentHtml = `
      <div class="lunch-vote-box">
        <div class="lunch-menu-header">📢 투표 종료! 실시간 현황 (총 ${totalVotes}표)</div>
        <div class="lunch-donut-result">
          <div class="lunch-donut-chart" style="--donut-bg: conic-gradient(${donutBackground})">
            <div class="lunch-donut-center">
              <span class="lunch-donut-total">${totalVotes}</span>
              <span class="lunch-donut-label">votes</span>
            </div>
          </div>
          <div class="lunch-options-list lunch-donut-legend">
            ${resultsListHtml}
          </div>
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
      <div class="news-section-box birthday-column-box">
        <span class="news-section-box-badge" style="background-color: #9d174d">6월의 생일</span>
        <h2 class="news-section-box-title">🏛️ 생일자 명예의 전당</h2>
        <div id="birthday-section-content">
          ${birthdayHtml}
        </div>
      </div>
      <div class="mid-side-column">
        <div class="news-section-box">
          <span class="news-section-box-badge" style="background-color: #d97706">점뭐먹</span>
          <h2 class="news-section-box-title">🍱 오늘 점심 뭐 먹지?</h2>
          <div id="lunch-vote-content">
            ${lunchContentHtml}
          </div>
        </div>
        <div class="news-section-box">
          <span class="news-section-box-badge" style="background-color: #0369a1">우테코 소식</span>
          <h2 class="news-section-box-title">📺 우테코 소식</h2>
          <div class="wooteco-news-video-wrap">
            <iframe
              class="wooteco-news-video"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/wtEnb8qD4wc"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </div>
    <div class="news-section-box hall-section-wide">
      <span class="news-section-box-badge" style="background-color: var(--slate-navy)">명예의 전당</span>
      <h2 class="news-section-box-title">🏆 어제의 왔다감 크루</h2>
      <div class="hall-crew-list hall-crew-list-wide" id="hall-crew-list">
        ${hallListHtml}
      </div>
    </div>
  `;
}
