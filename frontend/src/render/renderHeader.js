import { getTodayKoreanDate } from '../utils/date-utils.js';

export function renderHeader() {
  const todayStr = getTodayKoreanDate();
  
  return `
    <div class="newspaper-ears">
      <span class="ear-publisher">우아한 뉴스 데일리 | 발행처: 우테코 8기 아티티티티 프레저</span>
      <span class="ear-date" id="ear-date">${todayStr}</span>
      <span class="ear-price">구독료: 꺼지지 않는 열정</span>
    </div>
    <div class="double-line"></div>
    <div class="newspaper-logo-area">
      <div class="logo-center">
        <h1 class="newspaper-title-main">우아한 뉴스</h1>
        <div class="newspaper-title-sub">WOOWA DAILY NEWS</div>
      </div>
    </div>
    <div class="double-line"></div>
  `;
}
