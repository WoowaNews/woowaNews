import './styles.css';

const app = document.querySelector('#app');

async function loadNewspaper() {
  try {
    const response = await fetch('/api/newspaper');

    if (!response.ok) {
      throw new Error('신문 정보를 불러오지 못했습니다.');
    }

    return await response.json();
  } catch {
    return {
      title: 'Woowa News',
      publishedDate: new Date().toISOString().slice(0, 10),
      description: '우아한테크코스 8기 크루들을 위한 복고풍 데일리 신문',
    };
  }
}

function render({ title, publishedDate, description }) {
  app.innerHTML = `
    <section class="newspaper">
      <header class="masthead">
        <p class="eyebrow">Daily Mission Gazette</p>
        <h1>${title}</h1>
        <div class="meta">
          <span>${publishedDate}</span>
          <span>Vol. 01</span>
          <span>Seoul</span>
        </div>
      </header>

      <section class="lead">
        <p class="kicker">오늘의 헤드라인</p>
        <h2>${description}</h2>
        <p>
          GitHub 미션 발자국과 커뮤니티 콘텐츠를 모아 하루의 흐름을 신문처럼 보여줄 준비를 마쳤습니다.
        </p>
      </section>

      <section class="columns" aria-label="초기 콘텐츠">
        <article>
          <h3>Mission Trace</h3>
          <p>크루들의 미션 진행 기록과 리뷰 흐름을 기사 형태로 엮을 수 있습니다.</p>
        </article>
        <article>
          <h3>Community Desk</h3>
          <p>잡담, 회고, 작은 발견까지 매일의 분위기를 담는 지면입니다.</p>
        </article>
        <article>
          <h3>Archive</h3>
          <p>지난 신문을 날짜별로 다시 펼쳐볼 수 있는 공간으로 확장할 수 있습니다.</p>
        </article>
      </section>
    </section>
  `;
}

loadNewspaper().then(render);
