// ===== 운세 데이터 =====
const FORTUNE_DATA = [
  { title: "오늘은 Merge Luck 상승", content: "리뷰어가 생각보다 빨리 approve 해줄지도 모릅니다. 지금 당장 PR을 열어두세요.", keyword: "Merge" },
  { title: "새벽 commit 주의", content: "오후 11시 이후 작성한 코드는 미래의 당신을 괴롭힐 수 있습니다. 자고 일어나서 하세요.", keyword: "Rollback" },
  { title: "변수명의 날", content: "오늘 작성한 변수명은 역사에 남을 것입니다. 좋은 의미로요. 신중하게 지으세요.", keyword: "Naming" },
  { title: "리팩토링 주의보", content: "잘 돌아가는 코드를 건드리고 싶은 충동이 생길 수 있습니다. 제발 참으세요.", keyword: "Refactoring" },
  { title: "Stack Overflow의 날", content: "오늘 당신이 찾는 답변은 이미 2012년에 올라와 있습니다. 구글링 3번이면 해결됩니다.", keyword: "Debug" },
  { title: "무한 루프 경계령", content: "오늘의 코드엔 탈출 조건이 있는지 세 번 확인하세요. Ctrl+C가 친구입니다.", keyword: "Loop" },
  { title: "PR 속도 대길", content: "오늘은 코드보다 리뷰어의 마음이 더 빠를 수 있습니다. 퀄리티 있는 PR을 올려보세요.", keyword: "Review" },
  { title: "NullPointer 경보", content: "NullPointerException이 당신의 하루를 방문할 가능성이 높습니다. null 체크 잊지 마세요.", keyword: "Exception" },
  { title: "커밋 메시지 대운", content: "오늘은 'fix' 한 단어보다 의미 있는 커밋 메시지를 쓸 영감이 샘솟습니다.", keyword: "Commit" },
  { title: "주석의 귀환", content: "6개월 전 자신이 남긴 주석을 발견할 것입니다. 당신은 그때도 틀렸습니다.", keyword: "Comment" },
  { title: "터미널 행운", content: "오늘 처음 실행한 명령어가 에러 없이 동작할 수도 있습니다. 기대해도 좋습니다.", keyword: "Terminal" },
  { title: "의존성 경고", content: "패키지 버전이 맞지 않을 수 있습니다. 오늘은 update 하지 마세요. 경고합니다.", keyword: "Dependency" },
  { title: "브레이크포인트 대길", content: "오늘은 디버거가 당신 편입니다. 버그가 항복을 선언할 것입니다.", keyword: "Debug" },
  { title: "협업 운세 상승", content: "오늘 페어 프로그래밍을 하면 2배의 생산성이 나옵니다. 옆 사람을 활용하세요.", keyword: "Pair" },
  { title: "Git 충돌 경고", content: "오늘 merge 전 반드시 pull을 먼저 해야 합니다. 안 하면 후회합니다.", keyword: "Conflict" },
  { title: "코드 리뷰 대길", content: "오늘 남긴 리뷰 코멘트 하나가 누군가의 성장에 결정적 도움이 될 수 있습니다.", keyword: "Review" },
  { title: "테스트 통과의 날", content: "오늘 작성한 테스트가 처음부터 통과될 가능성이 있습니다. 믿어보세요.", keyword: "Test" },
  { title: "IDE 행운", content: "오늘은 자동완성이 당신의 마음을 읽습니다. 믿고 Tab 키를 누르세요.", keyword: "IDE" },
  { title: "아키텍처 고민 주의", content: "완벽한 구조를 찾다가 하루가 다 갈 수 있습니다. 일단 만들고 리팩토링하세요.", keyword: "Architecture" },
  { title: "문서화 대운", content: "오늘 README를 업데이트하면 팀원의 칭찬이 쏟아질 것입니다. 지금 하세요.", keyword: "Docs" },
  { title: "성능 최적화의 날", content: "오늘은 O(n²)을 O(n)으로 바꿀 영감이 떠오를 것입니다. 알고리즘을 의심해보세요.", keyword: "Optimize" },
  { title: "배포 금지일", content: "오늘은 금요일 오후처럼 느껴집니다. 배포는 내일로 미루세요.", keyword: "Deploy" },
];

function getDailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

function seededRandom(seed) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getDailyFortune() {
  const seed = getDailySeed();
  const idx = Math.floor(seededRandom(seed) * FORTUNE_DATA.length);
  return FORTUNE_DATA[idx];
}

// ===== 게임 1: 포춘쿠키 =====
function initFortuneGame() {
  const cookie = document.getElementById('fortune-cookie');
  if (!cookie) return;

  const fortune = getDailyFortune();
  let revealed = false;

  cookie.addEventListener('click', () => {
    if (revealed) return;
    revealed = true;

    cookie.classList.add('cookie-breaking');

    setTimeout(() => {
      const cookieArea = document.getElementById('fortune-cookie-area');
      const resultArea = document.getElementById('fortune-result-area');
      if (cookieArea) cookieArea.style.display = 'none';
      if (resultArea) {
        resultArea.style.display = 'flex';
        resultArea.style.flexDirection = 'column';
        resultArea.style.gap = '12px';
      }
      const kwEl = document.getElementById('fortune-keyword-el');
      const titleEl = document.getElementById('fortune-title-el');
      const contentEl = document.getElementById('fortune-content-el');
      if (kwEl) kwEl.textContent = `#${fortune.keyword}`;
      if (titleEl) titleEl.textContent = fortune.title;
      if (contentEl) contentEl.textContent = fortune.content;

      const card = document.getElementById('fortune-card');
      if (card) {
        card.classList.remove('fortune-card-enter');
        void card.offsetWidth;
        card.classList.add('fortune-card-enter');
      }
    }, 800);
  });
}

// ===== 게임 2: 반응속도 =====
let reactionState = 'idle';
let reactionTimer = null;
let reactionStartTime = null;
let reactionRounds = [];
let reactionApiBase = '';

function initReactionGame(API_BASE) {
  reactionApiBase = API_BASE;
  const startBtn = document.getElementById('reaction-start-btn');
  if (startBtn) startBtn.addEventListener('click', startReactionGame);
  fetchReactionRanking();
}

function startReactionGame() {
  reactionRounds = [];
  updateReactionRoundsUI();
  nextReactionRound();
}

function nextReactionRound() {
  const arena = document.getElementById('reaction-arena');
  if (!arena) return;

  reactionState = 'waiting';
  arena.dataset.state = 'waiting';
  arena.innerHTML = `<div class="reaction-waiting-content"><p>초록색이 되면 클릭하세요</p></div>`;
  arena.onclick = null;

  arena.onclick = () => {
    if (reactionState !== 'waiting') return;
    clearTimeout(reactionTimer);
    reactionState = 'error';
    arena.dataset.state = 'error';
    arena.innerHTML = `<div class="reaction-error-content"><p>🚨 빨라요!</p><p class="reaction-error-sub">다시 기다리세요...</p></div>`;
    arena.classList.remove('reaction-shake');
    void arena.offsetWidth;
    arena.classList.add('reaction-shake');
    arena.onclick = null;
    setTimeout(nextReactionRound, 1200);
  };

  const delay = 1000 + Math.random() * 3000;
  reactionTimer = setTimeout(() => {
    if (reactionState !== 'waiting') return;
    reactionState = 'ready';
    arena.dataset.state = 'ready';
    reactionStartTime = performance.now();
    arena.innerHTML = `<div class="reaction-ready-content"><p>지금 클릭!</p></div>`;
    arena.onclick = () => {
      if (reactionState !== 'ready') return;
      const ms = Math.round(performance.now() - reactionStartTime);
      reactionRounds.push(ms);
      reactionState = 'idle';
      arena.onclick = null;
      updateReactionRoundsUI();
      if (reactionRounds.length >= 3) {
        showReactionResult();
      } else {
        nextReactionRound();
      }
    };
  }, delay);
}

function updateReactionRoundsUI() {
  const el = document.getElementById('reaction-rounds');
  if (!el) return;
  el.innerHTML = reactionRounds
    .map((ms, i) => `<span class="reaction-round-chip">${i + 1}R: ${ms}ms</span>`)
    .join('');
}

function showReactionResult() {
  const avg = Math.round(reactionRounds.reduce((a, b) => a + b, 0) / reactionRounds.length);
  const arena = document.getElementById('reaction-arena');
  if (!arena) return;

  reactionState = 'result';
  arena.dataset.state = 'result';
  arena.onclick = null;
  arena.innerHTML = `
    <div class="reaction-result-content">
      ${reactionRounds.map((ms, i) => `<div class="reaction-result-row">${i + 1}R: <strong>${ms}ms</strong></div>`).join('')}
      <div class="reaction-result-avg">평균: <strong>${avg}ms</strong></div>
      <div class="reaction-headline">⚡ 인간 컴파일러 등장 — 평균 ${avg}ms 기록</div>
      <div class="reaction-save-area">
        <input type="text" class="game-input" id="reaction-save-name" placeholder="이름 입력" maxlength="10">
        <button class="game-btn game-btn-small" id="reaction-save-btn">기록 저장</button>
      </div>
      <button class="game-btn game-btn-small" id="reaction-retry-btn" style="margin-top:6px">↩ 다시 도전</button>
    </div>
  `;

  document.getElementById('reaction-save-btn')?.addEventListener('click', async () => {
    const name = document.getElementById('reaction-save-name')?.value.trim();
    if (!name) return;
    await saveReactionRecord(name, avg);
    fetchReactionRanking();
  });

  document.getElementById('reaction-retry-btn')?.addEventListener('click', startReactionGame);
}

async function fetchReactionRanking() {
  try {
    const res = await fetch(`${reactionApiBase}/api/game/reaction/ranking`);
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById('reaction-ranking-list');
    if (!el) return;
    if (!data.length) {
      el.innerHTML = `<div class="game-ranking-empty">아직 기록이 없습니다</div>`;
      return;
    }
    el.innerHTML = data
      .map((r, i) => `
        <div class="game-ranking-item">
          <span class="game-rank-num">${i + 1}</span>
          <span class="game-rank-name">${r.name}</span>
          <span class="game-rank-value">${r.avgMs}ms</span>
        </div>`)
      .join('');
  } catch {}
}

async function saveReactionRecord(name, avgMs) {
  try {
    await fetch(`${reactionApiBase}/api/game/reaction/ranking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, avgMs }),
    });
  } catch {}
}

// ===== 게임 3: 동전 던지기 =====
let coinStreak = 0;
let coinBestStreak = 0;
let coinFlipping = false;
let coinTotalRotation = 0;
let coinApiBase = '';

function initCoinGame(API_BASE) {
  coinApiBase = API_BASE;
  const flipBtn = document.getElementById('coin-flip-btn');
  if (flipBtn) flipBtn.addEventListener('click', handleCoinFlip);
  fetchCoinRanking();
}

async function handleCoinFlip() {
  if (coinFlipping) return;
  coinFlipping = true;

  const flipBtn = document.getElementById('coin-flip-btn');
  if (flipBtn) flipBtn.disabled = true;

  const success = Math.random() < 0.5;
  await animateCoinFlip(success);

  if (success) {
    coinStreak++;
    coinBestStreak = Math.max(coinBestStreak, coinStreak);
    showCoinSuccess();
  } else {
    showCoinFail();
  }

  updateCoinUI();
  coinFlipping = false;
  if (success && flipBtn) flipBtn.disabled = false;
}

function animateCoinFlip(success) {
  return new Promise((resolve) => {
    const coin = document.getElementById('coin');
    if (!coin) { resolve(); return; }

    coin.style.transition = 'none';
    coin.style.transform = `rotateY(${coinTotalRotation}deg)`;

    const extraSpins = 5 * 360;
    const finalFace = success ? 0 : 180;
    const base = Math.round(coinTotalRotation / 360) * 360;
    coinTotalRotation = base + extraSpins + finalFace;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        coin.style.transition = 'transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        coin.style.transform = `rotateY(${coinTotalRotation}deg)`;
        setTimeout(resolve, 900);
      });
    });
  });
}

function updateCoinUI() {
  const probValue = document.getElementById('coin-prob-value');
  if (probValue) {
    if (coinStreak === 0) {
      probValue.textContent = '50%';
    } else {
      const prob = 100 / Math.pow(2, coinStreak);
      probValue.textContent = `${parseFloat(prob.toPrecision(6))}%`;
    }
  }

  const streakNum = document.getElementById('coin-streak-num');
  if (streakNum) {
    streakNum.textContent = coinStreak;
    streakNum.classList.remove('streak-pop');
    void streakNum.offsetWidth;
    streakNum.classList.add('streak-pop');
  }

  const specialAlert = document.getElementById('coin-special-alert');
  if (specialAlert) {
    if (coinStreak >= 10) {
      specialAlert.style.display = 'block';
      specialAlert.className = 'coin-special-alert special-raid';
      specialAlert.innerHTML = `⚠️ 운영진 긴급 관찰 대상`;
    } else if (coinStreak >= 8) {
      specialAlert.style.display = 'block';
      specialAlert.className = 'coin-special-alert special-breaking';
      const prob = (100 / Math.pow(2, coinStreak)).toPrecision(6);
      specialAlert.innerHTML = `🚨 속보<br>확률을 거스르는 중<br>현재 확률: ${prob}%`;
    } else if (coinStreak >= 5) {
      specialAlert.style.display = 'block';
      specialAlert.className = 'coin-special-alert special-glow';
      specialAlert.innerHTML = `🔥 ${coinStreak}연속 성공!`;
    } else {
      specialAlert.style.display = 'none';
    }
  }
}

function showCoinSuccess() {
  const msg = document.getElementById('coin-result-msg');
  if (msg) {
    msg.textContent = '🪙 앞면! SUCCESS';
    msg.className = 'coin-result-msg coin-result-success';
    msg.classList.remove('coin-result-pop');
    void msg.offsetWidth;
    msg.classList.add('coin-result-pop');
  }
  const saveArea = document.getElementById('coin-save-area');
  if (saveArea) saveArea.style.display = 'none';
}

function showCoinFail() {
  const msg = document.getElementById('coin-result-msg');
  if (msg) {
    msg.textContent = '🪙 뒷면! FAIL';
    msg.className = 'coin-result-msg coin-result-fail';
    msg.classList.remove('coin-result-pop');
    void msg.offsetWidth;
    msg.classList.add('coin-result-pop');
  }

  const flipBtn = document.getElementById('coin-flip-btn');
  if (flipBtn) flipBtn.disabled = true;

  if (coinBestStreak > 0) {
    const saveArea = document.getElementById('coin-save-area');
    if (saveArea) {
      saveArea.style.display = 'flex';
      const oldSaveBtn = document.getElementById('coin-save-btn');
      if (oldSaveBtn) {
        const newSaveBtn = oldSaveBtn.cloneNode(true);
        oldSaveBtn.parentNode.replaceChild(newSaveBtn, oldSaveBtn);
        newSaveBtn.addEventListener('click', async () => {
          const nameInput = document.getElementById('coin-save-name');
          const name = nameInput?.value.trim();
          if (!name) return;
          await saveCoinRecord(name, coinBestStreak);
          fetchCoinRanking();
          resetCoinGame();
        });
      }
    }
  } else {
    resetCoinGame();
  }
}

function resetCoinGame() {
  coinStreak = 0;
  coinBestStreak = 0;
  coinTotalRotation = 0;

  const coin = document.getElementById('coin');
  if (coin) {
    coin.style.transition = 'none';
    coin.style.transform = 'rotateY(0deg)';
  }
  const probValue = document.getElementById('coin-prob-value');
  if (probValue) probValue.textContent = '50%';

  const streakNum = document.getElementById('coin-streak-num');
  if (streakNum) streakNum.textContent = '0';

  const msg = document.getElementById('coin-result-msg');
  if (msg) msg.textContent = '';

  const specialAlert = document.getElementById('coin-special-alert');
  if (specialAlert) specialAlert.style.display = 'none';

  const saveArea = document.getElementById('coin-save-area');
  if (saveArea) saveArea.style.display = 'none';

  const flipBtn = document.getElementById('coin-flip-btn');
  if (flipBtn) flipBtn.disabled = false;
}

async function fetchCoinRanking() {
  try {
    const res = await fetch(`${coinApiBase}/api/game/coin/ranking`);
    if (!res.ok) return;
    const data = await res.json();
    const el = document.getElementById('coin-ranking-list');
    if (!el) return;
    if (!data.length) {
      el.innerHTML = `<div class="game-ranking-empty">아직 기록이 없습니다</div>`;
      return;
    }
    el.innerHTML = data
      .map((r, i) => `
        <div class="game-ranking-item">
          <span class="game-rank-num">${i + 1}</span>
          <span class="game-rank-name">${r.name}</span>
          <span class="game-rank-value">${r.streak}연속</span>
        </div>`)
      .join('');
  } catch {}
}

async function saveCoinRecord(name, streak) {
  try {
    await fetch(`${coinApiBase}/api/game/coin/ranking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, streak }),
    });
  } catch {}
}

// ===== 진입점 =====
export function initGames(API_BASE) {
  initFortuneGame();
  initReactionGame(API_BASE);
  initCoinGame(API_BASE);
}
