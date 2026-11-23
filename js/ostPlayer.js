const ostListEl = document.getElementById("ost-list");
const discEl = document.getElementById("disc");

// 화면 텍스트 요소
const currentNoEl = document.getElementById("current-no");
const currentSeriesEl = document.getElementById("current-series");
const currentTitleEl = document.getElementById("current-title");
const currentTypeEl = document.getElementById("current-type");

// 컨트롤 요소
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");
const filterBtns = document.querySelectorAll(".filter-btn");
const PLAY_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const PAUSE_ICON = `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;

let filteredList = [...ostList];
let currentTrackId = ostList[0].id;
let isPlaying = false;
let ytPlayer = null;
let isPlayerReady = false;
let progressTimer = null;

// YouTube IFrame API 준비 완료 시 자동 호출되는 전역 함수
window.onYouTubeIframeAPIReady = function () {
  const firstTrack = ostList[0];
  ytPlayer = new YT.Player("youtube-player", {
    height: "1",
    width: "1",
    videoId: firstTrack.videoId || "",
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1
    },
    events: {
      onReady: () => {
        isPlayerReady = true;
        startProgressLoop();
      },
      onStateChange: onPlayerStateChange,
      onError: () => {
        console.warn("외부 재생이 제한된 영상이거나 videoId가 비어 있습니다. 다음 곡으로 이동합니다.");
        if (isPlaying) {
          nextBtn.click();
        }
      }
    }
  });
};

// 유튜브 플레이어 상태 변화 감지
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    playBtn.innerHTML = PAUSE_ICON;
    discEl.classList.add("playing");
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    playBtn.innerHTML = PLAY_ICON;
    discEl.classList.remove("playing");
  } else if (event.data === YT.PlayerState.ENDED) {
    nextBtn.click();
  }
}

// 초기 실행
function init() {
  renderList(filteredList);
  updateTrackUI(ostList[0]);
}

// 리스트 렌더링
function renderList(list) {
  ostListEl.innerHTML = "";
  list.forEach((item) => {
    const li = document.createElement("li");
    li.className = `ost-item ${item.id === currentTrackId ? "active" : ""}`;
    li.innerHTML = `
      <div class="item-info">
        <span class="item-no">${item.no} · ${item.series}</span>
        <span class="item-title">${item.title}</span>
      </div>
      <span class="item-tag">${item.type}</span>
    `;
    li.addEventListener("click", () => {
      loadTrackById(item.id, true);
    });
    ostListEl.appendChild(li);
  });
}

// 좌측 화면 텍스트만 갱신
function updateTrackUI(track) {
  currentTrackId = track.id;
  currentNoEl.textContent = track.no;
  currentSeriesEl.textContent = track.series;
  currentTitleEl.textContent = track.title;
  currentTypeEl.textContent = track.type;
  progressBar.value = 0;
  currentTimeEl.textContent = "0:00";
  durationTimeEl.textContent = "0:00";
  renderList(filteredList);
}

// 고유 ID로 곡 로드 및 재생
function loadTrackById(id, autoPlay = true) {
  const track = ostList.find((item) => item.id === id);
  if (!track) return;

  updateTrackUI(track);

  if (!isPlayerReady || !ytPlayer) return;

  if (!track.videoId) {
    console.warn(`[${track.title}]의 videoId가 아직 입력되지 않았습니다.`);
    pauseAudio();
    return;
  }

  if (autoPlay) {
    ytPlayer.loadVideoById(track.videoId);
    isPlaying = true;
    playBtn.innerHTML = PAUSE_ICON;
    discEl.classList.add("playing");
  } else {
    ytPlayer.cueVideoById(track.videoId);
    pauseAudio();
  }
}

function playAudio() {
  if (!isPlayerReady || !ytPlayer) return;
  const track = ostList.find((item) => item.id === currentTrackId);
  if (!track || !track.videoId) return;

  ytPlayer.playVideo();
  isPlaying = true;
  playBtn.innerHTML = PAUSE_ICON;
  discEl.classList.add("playing");
}

function pauseAudio() {
  if (isPlayerReady && ytPlayer && typeof ytPlayer.pauseVideo === "function") {
    ytPlayer.pauseVideo();
  }
  isPlaying = false;
  playBtn.innerHTML = PLAY_ICON;
  discEl.classList.remove("playing");
}

// 재생/일시정지 토글
playBtn.addEventListener("click", () => {
  isPlaying ? pauseAudio() : playAudio();
});

// 이전/다음 곡 (현재 필터된 리스트 기준 이동)
prevBtn.addEventListener("click", () => {
  const activeList = filteredList.length > 0 ? filteredList : ostList;
  const idx = activeList.findIndex((item) => item.id === currentTrackId);
  const prevIdx = idx === -1 ? 0 : (idx - 1 + activeList.length) % activeList.length;
  loadTrackById(activeList[prevIdx].id, true);
});

nextBtn.addEventListener("click", () => {
  const activeList = filteredList.length > 0 ? filteredList : ostList;
  const idx = activeList.findIndex((item) => item.id === currentTrackId);
  const nextIdx = idx === -1 ? 0 : (idx + 1) % activeList.length;
  loadTrackById(activeList[nextIdx].id, true);
});

// 0.5초마다 재생 시간 & 프로그레스 바 동기화
function startProgressLoop() {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    if (isPlayerReady && ytPlayer && isPlaying && typeof ytPlayer.getCurrentTime === "function") {
      const current = ytPlayer.getCurrentTime() || 0;
      const duration = ytPlayer.getDuration() || 0;
      if (duration > 0) {
        progressBar.value = (current / duration) * 100;
        currentTimeEl.textContent = formatTime(current);
        durationTimeEl.textContent = formatTime(duration);
      }
    }
  }, 500);
}

// 프로그레스 바 탐색
progressBar.addEventListener("input", () => {
  if (isPlayerReady && ytPlayer && typeof ytPlayer.getDuration === "function") {
    const duration = ytPlayer.getDuration() || 0;
    if (duration > 0) {
      ytPlayer.seekTo((progressBar.value / 100) * duration, true);
    }
  }
});

// 시리즈 필터 버튼 (현재 재생 곡 유지)
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const series = btn.dataset.series;
    filteredList = series === "ALL"
      ? [...ostList]
      : ostList.filter((item) => item.series === series);

    renderList(filteredList);
  });
});

function formatTime(sec) {
  const min = Math.floor(sec / 60);
  const remSec = Math.floor(sec % 60);
  return `${min}:${remSec < 10 ? "0" : ""}${remSec}`;
}

init();
