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
      <div class="logo-extra-left">
        <div class="logo-extra-title">🔮 오늘의 운세</div>
        <p>어이쿠! 오늘 작성할 커밋에 사소한 오타가 숨어있군요. 세 번 자가 리뷰 후 머지하면 버그를 피할 수 있습니다.</p>
      </div>
      <div class="logo-center">
        <h1 class="newspaper-title-main">우아한 뉴스</h1>
        <div class="newspaper-title-sub">WOOWA DAILY NEWS</div>
      </div>
      <div class="logo-extra-right">
        <div class="logo-extra-title">🚨 독점 보도</div>
        <p>우테코 8기 데일리 신문 정식 창간! 크루들의 뜨거운 코딩 발자국과 감동의 마을 소식 전격 공개!</p>
      </div>
    </div>
    <div class="double-line"></div>
  `;
}
