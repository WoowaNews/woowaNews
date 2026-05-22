export function renderGames() {
  return `
    <div class="games-section">
      <div class="footprint-section-header">
        <span class="footprint-section-badge">🎮 오락실</span>
        <div class="footprint-section-title-wrap">
          <h2 style="font-family:var(--font-headline);font-size:1.4rem">오늘의 우아한 오락실</h2>
        </div>
        <p class="footprint-intro-desc">PR 대기 시간에 즐기는 3가지 미니게임</p>
      </div>
      <div class="games-grid">
        <div class="game-card" id="game-fortune">
          <div class="game-card-badge">🔮 운세</div>
          <div class="game-card-headline">오늘의 개발 운세</div>
          <div class="game-card-body">
            <div id="fortune-cookie-area">
              <div class="fortune-cookie-wrap">
                <div class="fortune-cookie" id="fortune-cookie" title="클릭하여 운세 확인">🥠</div>
              </div>
              <p class="fortune-hint">클릭하여 오늘의 운명을 확인하세요</p>
            </div>
            <div id="fortune-result-area" style="display:none;flex:1;display:none;flex-direction:column;gap:12px">
              <div class="fortune-card" id="fortune-card">
                <div class="fortune-keyword" id="fortune-keyword-el"></div>
                <div class="fortune-title" id="fortune-title-el"></div>
                <div class="fortune-content" id="fortune-content-el"></div>
              </div>
              <div class="fortune-breaking-ticker">🔮 오늘의 코드 운명이 펼쳐졌습니다</div>
            </div>
          </div>
        </div>

        <div class="game-card" id="game-reaction">
          <div class="game-card-badge">⚡ 실험</div>
          <div class="game-card-headline">인간 컴파일러</div>
          <div class="game-card-body">
            <div class="reaction-arena-wrap">
              <div class="reaction-arena" id="reaction-arena" data-state="idle">
                <div class="reaction-idle-content">
                  <p class="reaction-desc">반응속도를 측정합니다<br>총 3라운드</p>
                  <button class="game-btn" id="reaction-start-btn">▶ 시작하기</button>
                </div>
              </div>
              <div class="reaction-rounds" id="reaction-rounds"></div>
            </div>
            <div class="game-ranking-area">
              <div class="game-ranking-title">⚡ 명예의 전당</div>
              <div id="reaction-ranking-list" class="game-ranking-list">
                <div class="game-ranking-loading">불러오는 중...</div>
              </div>
            </div>
          </div>
        </div>

        <div class="game-card" id="game-coin">
          <div class="game-card-badge">🪙 확률</div>
          <div class="game-card-headline">랜덤 뚫기</div>
          <div class="game-card-body">
            <div class="coin-game-area">
              <div class="coin-probability">
                <span class="coin-prob-label">현재 확률</span>
                <span class="coin-prob-value" id="coin-prob-value">50%</span>
              </div>
              <div class="coin-container">
                <div class="coin" id="coin">
                  <div class="coin-face">SUCCESS</div>
                  <div class="coin-back">FAIL</div>
                </div>
              </div>
              <div class="coin-streak">
                <span class="coin-streak-num" id="coin-streak-num">0</span>
                <span class="coin-streak-label">연속 성공</span>
              </div>
              <div class="coin-result-msg" id="coin-result-msg"></div>
              <div class="coin-special-alert" id="coin-special-alert" style="display:none"></div>
              <button class="game-btn coin-flip-btn" id="coin-flip-btn">🪙 동전 던지기</button>
              <div class="coin-save-area" id="coin-save-area" style="display:none">
                <input type="text" class="game-input" id="coin-save-name" placeholder="이름 입력" maxlength="10">
                <button class="game-btn game-btn-small" id="coin-save-btn">기록 저장</button>
              </div>
            </div>
            <div class="game-ranking-area">
              <div class="game-ranking-title">🪙 명예의 전당</div>
              <div id="coin-ranking-list" class="game-ranking-list">
                <div class="game-ranking-loading">불러오는 중...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
