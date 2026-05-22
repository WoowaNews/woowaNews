export function dailySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function pickByDate(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[dailySeed() % arr.length];
}

export function getTodayKoreanDate() {
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const dayName = days[d.getDay()];
  return `${year}년 ${month}월 ${date}일 (${dayName})`;
}
